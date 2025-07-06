import { prisma } from "../db";

interface StatUpdate {
  statKey: string;
  increment?: number;
  setValue?: number;
}

// In-memory cache for frequently accessed stats
const statsCache = new Map<string, { value: number; lastUpdated: Date }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Batch update queue
let batchQueue: StatUpdate[] = [];
let batchTimeout: NodeJS.Timeout | null = null;
const BATCH_DELAY = 5000; // 5 seconds
const MAX_BATCH_SIZE = 50;

/**
 * Add a stat update to the batch queue
 */
export function queueStatUpdate(statKey: string, increment?: number, setValue?: number) {
  const existingIndex = batchQueue.findIndex((update) => update.statKey === statKey);

  if (existingIndex >= 0) {
    // Merge with existing update
    const existing = batchQueue[existingIndex];
    if (increment !== undefined) {
      existing.increment = (existing.increment || 0) + increment;
    }
    if (setValue !== undefined) {
      existing.setValue = setValue;
      existing.increment = undefined; // setValue takes precedence
    }
  } else {
    // Add new update
    batchQueue.push({ statKey, increment, setValue });
  }

  // Update local cache immediately for better UX
  if (increment !== undefined) {
    const cached = statsCache.get(statKey);
    if (cached) {
      cached.value += increment;
      cached.lastUpdated = new Date();
    }
  } else if (setValue !== undefined) {
    statsCache.set(statKey, { value: setValue, lastUpdated: new Date() });
  }

  // Schedule batch processing
  if (batchTimeout) {
    clearTimeout(batchTimeout);
  }

  // Process immediately if queue is full, otherwise wait for delay
  if (batchQueue.length >= MAX_BATCH_SIZE) {
    processBatchUpdates();
  } else {
    batchTimeout = setTimeout(processBatchUpdates, BATCH_DELAY);
  }
}

/**
 * Process all queued stat updates in a single transaction
 */
async function processBatchUpdates() {
  if (batchQueue.length === 0) return;

  const updates = [...batchQueue];
  batchQueue = [];

  if (batchTimeout) {
    clearTimeout(batchTimeout);
    batchTimeout = null;
  }

  try {
    console.log(`[statsCache] Processing ${updates.length} stat updates`);

    // Process updates in a transaction for consistency
    await prisma.$transaction(async (tx) => {
      for (const update of updates) {
        const { statKey, increment, setValue } = update;

        if (setValue !== undefined) {
          // Set absolute value
          await tx.liveStat.upsert({
            where: { statKey },
            create: { statKey, statValue: setValue },
            update: { statValue: setValue, lastUpdated: new Date() },
          });
        } else if (increment !== undefined && increment !== 0) {
          // Increment value
          await tx.liveStat.upsert({
            where: { statKey },
            create: { statKey, statValue: Math.max(0, increment) },
            update: {
              statValue: { increment },
              lastUpdated: new Date(),
            },
          });
        }
      }
    });

    console.log(`[statsCache] Successfully processed ${updates.length} stat updates`);
  } catch (error) {
    console.error("[statsCache] Failed to process batch updates:", error);

    // Re-queue failed updates with exponential backoff
    setTimeout(() => {
      batchQueue.unshift(...updates);
      processBatchUpdates();
    }, 10000);
  }
}

/**
 * Get a cached stat value (with TTL)
 */
export function getCachedStat(statKey: string): number | null {
  const cached = statsCache.get(statKey);
  if (!cached) return null;

  const now = new Date();
  const age = now.getTime() - cached.lastUpdated.getTime();

  if (age > CACHE_TTL) {
    statsCache.delete(statKey);
    return null;
  }

  return cached.value;
}

/**
 * Warm the cache with current database values
 */
export async function warmStatsCache() {
  try {
    const liveStats = await prisma.liveStat.findMany();
    const now = new Date();

    liveStats.forEach((stat) => {
      statsCache.set(stat.statKey, {
        value: stat.statValue,
        lastUpdated: now,
      });
    });

    console.log(`[statsCache] Warmed cache with ${liveStats.length} stats`);
  } catch (error) {
    console.error("[statsCache] Failed to warm cache:", error);
  }
}

/**
 * Force flush all pending updates (useful for graceful shutdown)
 */
export async function flushStatUpdates(): Promise<void> {
  if (batchTimeout) {
    clearTimeout(batchTimeout);
    batchTimeout = null;
  }

  if (batchQueue.length > 0) {
    console.log(`[statsCache] Force flushing ${batchQueue.length} pending updates`);
    await processBatchUpdates();
  }
}

/**
 * Clear the in-memory cache
 */
export function clearStatsCache() {
  statsCache.clear();
  console.log("[statsCache] Cache cleared");
}

/**
 * Get cache statistics for monitoring
 */
export function getCacheStats() {
  return {
    cacheSize: statsCache.size,
    queueSize: batchQueue.length,
    isProcessing: batchTimeout !== null,
  };
}

// Optimize stats update for voting operations
export function incrementVoteStats(voterIsNew: boolean = false) {
  queueStatUpdate("total_votes", 1);
  if (voterIsNew) {
    queueStatUpdate("unique_voters", 1);
  }
  queueStatUpdate("total_xp", 5);
}

// Initialize cache on startup
warmStatsCache();
