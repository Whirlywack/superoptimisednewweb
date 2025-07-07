"use client";

import { api } from "@/lib/trpc/react";

export interface UseQuestionStatsOptions {
  questionId: string;
  refetchInterval?: number;
}

export function useQuestionStats({ questionId, refetchInterval = 5000 }: UseQuestionStatsOptions) {
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
      refetchInterval, // Real-time updates every 5 seconds
      staleTime: 2 * 1000, // 2 seconds
      cacheTime: 30 * 1000, // 30 seconds
    }
  );

  return {
    stats: stats || null,
    isLoading,
    isError,
    error: error?.message || null,
    refetch,
    totalVotes: stats?.totalVotes || 0,
    breakdown: stats?.breakdown || [],
  };
}
