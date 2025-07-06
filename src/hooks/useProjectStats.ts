"use client";

import { api } from "@/lib/trpc/react";

export function useProjectStats(statKey?: string) {
  const { data, isLoading, isError, error, refetch } = api.content.getProjectStats.useQuery(
    { statKey },
    {
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    }
  );

  const getStatValue = (key: string) => {
    if (!data) return null;
    return data[key]?.value || null;
  };

  const getStatDescription = (key: string) => {
    if (!data) return null;
    return data[key]?.description || null;
  };

  const getStatLastUpdated = (key: string) => {
    if (!data) return null;
    return data[key]?.lastUpdated || null;
  };

  // Calculate overall project completion based on multiple stats
  const calculateOverallProgress = () => {
    if (!data) return 15; // fallback

    // Look for a specific completion percentage stat
    const completionStat = data["project_completion_percentage"];
    if (completionStat) {
      return parseInt(completionStat.value) || 15;
    }

    // Alternative: calculate based on milestone completion
    const milestoneStat = data["completed_milestones"];
    const totalMilestonesStat = data["total_milestones"];

    if (milestoneStat && totalMilestonesStat) {
      const completed = parseInt(milestoneStat.value) || 0;
      const total = parseInt(totalMilestonesStat.value) || 1;
      return Math.round((completed / total) * 100);
    }

    return 15; // fallback value
  };

  return {
    stats: data || {},
    isLoading,
    isError,
    error: error?.message || null,
    refetch,
    getStatValue,
    getStatDescription,
    getStatLastUpdated,
    overallProgress: calculateOverallProgress(),
    hasStats: Boolean(data && Object.keys(data).length > 0),
  };
}
