"use client";

import { api } from "@/lib/trpc/react";

export function useCommunityStats(includeDaily: boolean = false) {
  const { data, isLoading, isError, error, refetch } = api.content.getCommunityStats.useQuery(
    { includeDaily },
    {
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000, // 30 seconds
      cacheTime: 2 * 60 * 1000, // 2 minutes
      refetchInterval: 60 * 1000, // Refetch every minute for live stats
    }
  );

  const stats = data
    ? {
        totalVotes: data.totalVotes || 0,
        uniqueVoters: data.uniqueVoters || 0,
        activeQuestions: data.activeQuestions || 0,
        totalXpEarned: data.totalXpEarned || 0,
        newsletterSubscribers: data.newsletterSubscribers || 0,
        lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : new Date(),
        ...(data.today && { today: data.today }),
      }
    : null;

  return {
    stats,
    isLoading,
    isError,
    error: error?.message || null,
    refetch,
    hasStats: Boolean(stats),
  };
}
