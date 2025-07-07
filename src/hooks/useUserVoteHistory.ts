"use client";

import { api } from "@/lib/trpc/react";

export function useUserVoteHistory() {
  const {
    data: history,
    isLoading,
    isError,
    error,
    refetch,
  } = api.vote.getUserVoteHistory.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    votes: history?.votes || [],
    totalXp: history?.totalXp || 0,
    isLoading,
    isError,
    error: error?.message || null,
    refetch,
  };
}
