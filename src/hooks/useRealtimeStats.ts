"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type LiveStat = Database["public"]["Tables"]["live_stats"]["Row"];

interface CommunityStats {
  totalVotes: number;
  uniqueVoters: number;
  activeQuestions: number;
  totalXpEarned: number;
  newsletterSubscribers: number;
  lastUpdated: Date;
}

interface UseRealtimeStatsOptions {
  pollInterval?: number; // Fallback polling interval in ms (default: 30000)
  enabled?: boolean;
}

interface UseRealtimeStatsReturn {
  stats: CommunityStats | null;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  isPolling: boolean;
}

export function useRealtimeStats({
  pollInterval = 30000,
  enabled = true,
}: UseRealtimeStatsOptions = {}): UseRealtimeStatsReturn {
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  // Process live stats data
  const processLiveStats = useCallback((liveStats: LiveStat[]): CommunityStats => {
    const statsMap: Record<string, number> = {};
    liveStats.forEach((stat) => {
      statsMap[stat.stat_key] = stat.stat_value;
    });

    return {
      totalVotes: statsMap.total_votes || 0,
      uniqueVoters: statsMap.unique_voters || 0,
      activeQuestions: statsMap.active_questions || 0,
      totalXpEarned: statsMap.total_xp || 0,
      newsletterSubscribers: statsMap.newsletter_subscribers || 0,
      lastUpdated: new Date(),
    };
  }, []);

  // Fetch latest stats
  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase.from("live_stats").select("*");

      if (fetchError) {
        throw new Error(`Failed to fetch stats: ${fetchError.message}`);
      }

      const communityStats = processLiveStats(data || []);
      setStats(communityStats);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
      setIsLoading(false);
    }
  }, [processLiveStats]);

  // Set up real-time subscription
  useEffect(() => {
    if (!enabled) return;

    let pollIntervalId: NodeJS.Timeout;
    let retryTimeout: NodeJS.Timeout;

    // Initial fetch
    fetchStats();

    // Set up real-time subscription
    const channel = supabase
      .channel("community_stats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "live_stats",
        },
        async (payload) => {
          console.log("[useRealtimeStats] Live stats update received:", payload);

          // Refetch all stats to ensure consistency
          await fetchStats();
        }
      )
      .subscribe((status) => {
        console.log("[useRealtimeStats] Subscription status:", status);

        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          setIsPolling(false);

          // Clear any existing polling
          if (pollIntervalId) {
            clearInterval(pollIntervalId);
          }
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setIsConnected(false);
          setError("Real-time connection failed, falling back to polling");

          // Start fallback polling after a delay
          retryTimeout = setTimeout(() => {
            setIsPolling(true);
            pollIntervalId = setInterval(fetchStats, pollInterval);
          }, 2000);
        } else if (status === "CLOSED") {
          setIsConnected(false);
        }
      });

    // Cleanup function
    return () => {
      if (pollIntervalId) {
        clearInterval(pollIntervalId);
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }

      console.log("[useRealtimeStats] Cleaning up subscription");
      supabase.removeChannel(channel);
    };
  }, [enabled, fetchStats, pollInterval]);

  return {
    stats,
    isLoading,
    error,
    isConnected,
    isPolling,
  };
}
