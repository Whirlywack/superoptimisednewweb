"use client";

import { api } from "@/lib/trpc/react";
import { useState, useEffect, useCallback } from "react";

export interface UseQuestionStatsOptions {
  questionId: string;
  refetchInterval?: number;
  enableOptimistic?: boolean;
}

export interface VoteBreakdown {
  option: string;
  count: number;
  percentage: number;
}

export interface OptimisticUpdate {
  optionId: string;
  timestamp: number;
}

export function useQuestionStats({
  questionId,
  refetchInterval = 3000, // Faster real-time updates
  enableOptimistic = true,
}: UseQuestionStatsOptions) {
  const [optimisticUpdates, setOptimisticUpdates] = useState<OptimisticUpdate[]>([]);

  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
  } = api.vote.getVoteStats.useQuery(
    { questionId },
    {
      refetchOnWindowFocus: false,
      refetchInterval,
      staleTime: 1 * 1000, // 1 second for faster updates
      cacheTime: 60 * 1000, // 1 minute cache
      // Retry failed requests
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    }
  );

  // Clean up old optimistic updates (older than 10 seconds)
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setOptimisticUpdates((prev) => prev.filter((update) => now - update.timestamp < 10000));
    }, 5000);

    return () => clearInterval(cleanup);
  }, []);

  // Apply optimistic update for immediate UI feedback
  const applyOptimisticUpdate = useCallback(
    (optionId: string) => {
      if (!enableOptimistic) return;

      setOptimisticUpdates((prev) => [...prev, { optionId, timestamp: Date.now() }]);

      // Auto-refresh after optimistic update to get real data
      setTimeout(() => {
        refetch();
      }, 500);
    },
    [enableOptimistic, refetch]
  );

  // Calculate stats with optimistic updates applied
  const calculateOptimisticStats = useCallback(() => {
    if (!stats || !enableOptimistic || optimisticUpdates.length === 0) {
      return stats;
    }

    const optimisticCounts: Record<string, number> = {};
    optimisticUpdates.forEach((update) => {
      optimisticCounts[update.optionId] = (optimisticCounts[update.optionId] || 0) + 1;
    });

    const newTotalVotes = stats.totalVotes + optimisticUpdates.length;
    const newBreakdown = stats.breakdown.map((item) => {
      const optimisticBoost = optimisticCounts[item.option] || 0;
      const newCount = item.count + optimisticBoost;
      const newPercentage = newTotalVotes > 0 ? Math.round((newCount / newTotalVotes) * 100) : 0;

      return {
        ...item,
        count: newCount,
        percentage: newPercentage,
      };
    });

    return {
      ...stats,
      totalVotes: newTotalVotes,
      breakdown: newBreakdown,
    };
  }, [stats, optimisticUpdates, enableOptimistic]);

  const optimisticStats = calculateOptimisticStats();

  return {
    stats: optimisticStats || null,
    isLoading,
    isError,
    error: error?.message || null,
    refetch,
    totalVotes: optimisticStats?.totalVotes || 0,
    breakdown: optimisticStats?.breakdown || [],
    // New methods for optimistic updates
    applyOptimisticUpdate,
    hasOptimisticUpdates: optimisticUpdates.length > 0,
  };
}
