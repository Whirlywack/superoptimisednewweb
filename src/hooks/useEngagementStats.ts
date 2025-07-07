"use client";

import { api } from "@/lib/trpc/react";

export interface UseEngagementStatsOptions {
  voterTokenId?: string;
  includeMilestones?: boolean;
  refetchInterval?: number;
}

export function useEngagementStats({
  voterTokenId,
  includeMilestones = true,
  refetchInterval = 0,
}: UseEngagementStatsOptions = {}) {
  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
  } = api.vote.getEngagementStats.useQuery(
    {
      voterTokenId,
      includeMilestones,
    },
    {
      refetchOnWindowFocus: false,
      refetchInterval,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  return {
    stats: stats || null,
    global: stats?.global || null,
    user: stats?.user || null,
    milestones: stats?.milestones || null,
    isLoading,
    isError,
    error: error?.message || null,
    refetch,
    lastUpdated: stats?.lastUpdated || null,
  };
}
