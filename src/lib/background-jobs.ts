/**
 * Background Job System for Async Vote Processing
 *
 * This system handles non-critical vote processing operations that can be done
 * asynchronously without blocking user progression through questions.
 */

import { prisma } from "./db";
import { incrementVoteStats } from "./api/statsCache";
import { onVoteSubmitted } from "./progress-automation";

interface VoteEnhancementJob {
  voteId: string;
  voterTokenId: string;
  questionId: string;
  isNewVoter: boolean;
  submittedAt: Date;
}

interface XpCalculationResult {
  xpAmount: number;
  totalXp: number;
  voteCount: number;
}

/**
 * Calculate progressive XP rewards based on vote count
 * Progressive rewards: 5, 10, 15, 20, 25, 50, 100
 */
function calculateXpForVote(voteNumber: number): number {
  if (voteNumber <= 5) return 5;
  if (voteNumber <= 10) return 10;
  if (voteNumber <= 25) return 15;
  if (voteNumber <= 50) return 20;
  if (voteNumber <= 100) return 25;
  if (voteNumber <= 250) return 50;
  return 100; // Max XP for votes 250+
}

/**
 * Fast XP calculation using atomic operations
 * This ensures accurate vote counting even with concurrent votes
 */
async function calculateAndRecordXp(
  voterTokenId: string,
  questionId: string
): Promise<XpCalculationResult> {
  return await prisma.$transaction(async (tx) => {
    // Atomically increment vote count and get new total
    const updatedVoter = await tx.voterToken.update({
      where: { id: voterTokenId },
      data: { voteCount: { increment: 1 } },
      select: { voteCount: true },
    });

    const newVoteCount = updatedVoter.voteCount;
    const xpAmount = calculateXpForVote(newVoteCount);

    // Record XP transaction
    await tx.xpLedger.create({
      data: {
        voterTokenId,
        actionType: "vote",
        xpAmount,
        sourceQuestionId: questionId,
      },
    });

    // Get total XP (could be cached in future)
    const totalXpResult = await tx.xpLedger.aggregate({
      where: { voterTokenId },
      _sum: { xpAmount: true },
    });

    return {
      xpAmount,
      totalXp: totalXpResult._sum.xpAmount || 0,
      voteCount: newVoteCount,
    };
  });
}

/**
 * Update engagement statistics and real-time stats
 */
async function updateEngagementStats(voterTokenId: string): Promise<void> {
  try {
    // Update or create engagement stats record
    const voteHistory = await prisma.questionResponse.findMany({
      where: { voterTokenId },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 30, // Last 30 for streak calculation
    });

    const totalVotes = voteHistory.length;

    // Simple streak calculation (consecutive days with votes)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStreak = 0;
    const longestStreak = 0; // TODO: Implement proper longest streak calculation

    if (voteHistory.length > 0) {
      // Simplified: if voted today, streak = 1 (can be enhanced later)
      const lastVoteDate = new Date(voteHistory[0].createdAt);
      lastVoteDate.setHours(0, 0, 0, 0);

      if (lastVoteDate.getTime() === today.getTime()) {
        currentStreak = 1; // Simplified for now
      }
    }

    // Get total XP for this voter
    const totalXpResult = await prisma.xpLedger.aggregate({
      where: { voterTokenId },
      _sum: { xpAmount: true },
    });

    // Upsert engagement stats
    await prisma.engagementStats.upsert({
      where: { voterTokenId },
      update: {
        currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak),
        totalVotes,
        totalXp: totalXpResult._sum.xpAmount || 0,
        lastActivity: new Date(),
        updatedAt: new Date(),
      },
      create: {
        voterTokenId,
        currentStreak,
        longestStreak: currentStreak,
        totalVotes,
        totalXp: totalXpResult._sum.xpAmount || 0,
        lastActivity: new Date(),
      },
    });

    console.log(`✅ Updated engagement stats for voter ${voterTokenId}`);
  } catch (error) {
    console.error(`❌ Failed to update engagement stats for voter ${voterTokenId}:`, error);
    // Don't throw - this is background processing
  }
}

/**
 * Process a vote enhancement job
 * This includes XP calculation, stats updates, and progress tracking
 */
export async function processVoteEnhancement(job: VoteEnhancementJob): Promise<void> {
  const { voteId, voterTokenId, questionId, isNewVoter } = job;

  try {
    console.log(`🔄 Processing vote enhancement for vote ${voteId}`);

    // 1. Calculate and record XP (atomic operation)
    const xpResult = await calculateAndRecordXp(voterTokenId, questionId);

    console.log(
      `💰 Awarded ${xpResult.xpAmount} XP (Total: ${xpResult.totalXp}) for vote ${voteId}`
    );

    // 2. Update live stats using optimized batch caching
    incrementVoteStats(isNewVoter);

    // 3. Update engagement statistics
    await updateEngagementStats(voterTokenId);

    // 4. Track progress event for automation
    await onVoteSubmitted(voterTokenId, questionId);

    console.log(`✅ Completed vote enhancement for vote ${voteId}`);
  } catch (error) {
    console.error(`❌ Failed to process vote enhancement for vote ${voteId}:`, error);

    // For critical failures, we could implement retry logic
    // For now, we'll log the error but not fail the original vote
    // The completion page can handle missing XP calculations
  }
}

/**
 * Queue a vote for background enhancement
 * This is called after the fast vote recording is complete
 */
export function queueVoteEnhancement(job: VoteEnhancementJob): void {
  // For now, process immediately in background
  // In production, this could use a proper job queue like Bull/Agenda
  setImmediate(() => {
    processVoteEnhancement(job).catch((error) => {
      console.error("Background vote enhancement failed:", error);
    });
  });
}

/**
 * Batch process multiple vote enhancements
 * Useful for handling bursts of votes efficiently
 */
export async function batchProcessVoteEnhancements(jobs: VoteEnhancementJob[]): Promise<void> {
  console.log(`🔄 Batch processing ${jobs.length} vote enhancements`);

  const results = await Promise.allSettled(jobs.map((job) => processVoteEnhancement(job)));

  const successful = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  console.log(`✅ Batch complete: ${successful} successful, ${failed} failed`);
}

/**
 * Get XP calculation for a specific vote (used by completion page if needed)
 */
export async function getVoteXpCalculation(
  voterTokenId: string
): Promise<XpCalculationResult | null> {
  try {
    const [voteCount, totalXpResult] = await Promise.all([
      prisma.questionResponse.count({
        where: { voterTokenId },
      }),
      prisma.xpLedger.aggregate({
        where: { voterTokenId },
        _sum: { xpAmount: true },
      }),
    ]);

    return {
      xpAmount: calculateXpForVote(voteCount),
      totalXp: totalXpResult._sum.xpAmount || 0,
      voteCount,
    };
  } catch (error) {
    console.error("Failed to get XP calculation:", error);
    return null;
  }
}
