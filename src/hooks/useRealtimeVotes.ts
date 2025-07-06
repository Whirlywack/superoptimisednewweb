"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

type QuestionResponse = Database["public"]["Tables"]["question_responses"]["Row"];

interface VoteStats {
  questionId: string;
  totalVotes: number;
  breakdown: Array<{
    option: string;
    count: number;
    percentage: number;
  }>;
  lastUpdated: Date;
}

interface UseRealtimeVotesOptions {
  questionId: string;
  pollInterval?: number; // Fallback polling interval in ms (default: 15000)
  enabled?: boolean;
}

interface UseRealtimeVotesReturn {
  voteStats: VoteStats | null;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  isPolling: boolean;
}

export function useRealtimeVotes({
  questionId,
  pollInterval = 15000,
  enabled = true,
}: UseRealtimeVotesOptions): UseRealtimeVotesReturn {
  const [voteStats, setVoteStats] = useState<VoteStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  // Calculate vote statistics from raw responses
  const calculateVoteStats = useCallback(
    (responses: QuestionResponse[]): VoteStats => {
      const totalVotes = responses.length;
      const responseCounts: Record<string, number> = {};

      // Count responses
      responses.forEach((response) => {
        const responseValue = String(response.response_data);
        responseCounts[responseValue] = (responseCounts[responseValue] || 0) + 1;
      });

      // Create breakdown with percentages
      const breakdown = Object.entries(responseCounts).map(([option, count]) => ({
        option,
        count,
        percentage: totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0,
      }));

      return {
        questionId,
        totalVotes,
        breakdown,
        lastUpdated: new Date(),
      };
    },
    [questionId]
  );

  // Fetch initial vote data
  const fetchVoteStats = useCallback(async () => {
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("question_responses")
        .select("*")
        .eq("question_id", questionId);

      if (fetchError) {
        throw new Error(`Failed to fetch vote data: ${fetchError.message}`);
      }

      const stats = calculateVoteStats(data || []);
      setVoteStats(stats);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch vote data");
      setIsLoading(false);
    }
  }, [questionId, calculateVoteStats]);

  // Set up real-time subscription
  useEffect(() => {
    if (!enabled || !questionId) return;

    let pollInterval_id: NodeJS.Timeout;
    let retryTimeout: NodeJS.Timeout;

    // Initial fetch
    fetchVoteStats();

    // Set up real-time subscription
    const channel = supabase
      .channel(`question_${questionId}_votes`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "question_responses",
          filter: `question_id=eq.${questionId}`,
        },
        async (payload) => {
          console.log("[useRealtimeVotes] Real-time update received:", payload);

          // Refetch all data to ensure consistency
          await fetchVoteStats();
        }
      )
      .subscribe((status) => {
        console.log("[useRealtimeVotes] Subscription status:", status);

        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          setIsPolling(false);

          // Clear any existing polling
          if (pollInterval_id) {
            clearInterval(pollInterval_id);
          }
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setIsConnected(false);
          setError("Real-time connection failed, falling back to polling");

          // Start fallback polling after a delay
          retryTimeout = setTimeout(() => {
            setIsPolling(true);
            pollInterval_id = setInterval(fetchVoteStats, pollInterval);
          }, 1000);
        } else if (status === "CLOSED") {
          setIsConnected(false);
        }
      });

    // Cleanup function
    return () => {
      if (pollInterval_id) {
        clearInterval(pollInterval_id);
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }

      console.log("[useRealtimeVotes] Cleaning up subscription");
      supabase.removeChannel(channel);
    };
  }, [enabled, questionId, fetchVoteStats, pollInterval]);

  return {
    voteStats,
    isLoading,
    error,
    isConnected,
    isPolling,
  };
}
