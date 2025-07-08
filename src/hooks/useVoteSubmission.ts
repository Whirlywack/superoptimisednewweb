"use client";

import { api } from "@/lib/trpc/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export interface VoteSubmissionOptions {
  onSuccess?: (data: {
    success: boolean;
    voteId: string;
    processingInBackground?: boolean;
  }) => void;
  onError?: (error: string) => void;
  showToasts?: boolean;
}

export function useVoteSubmission(options: VoteSubmissionOptions = {}) {
  const { onSuccess, onError, showToasts = true } = options;
  const [votingStates, setVotingStates] = useState<Map<string, boolean>>(new Map());

  const utils = api.useUtils();

  const voteMutation = api.vote.submitVote.useMutation({
    onSuccess: (data) => {
      if (showToasts) {
        // New optimized flow: just confirm vote recorded
        // XP calculation happens in background
        toast.success("Vote recorded!", {
          description: data.processingInBackground ? "XP calculating..." : "Processing complete",
          duration: 2000,
        });
      }

      // Invalidate and refetch related queries
      utils.question.getActiveQuestions.invalidate();
      utils.content.getCommunityStats.invalidate();

      onSuccess?.(data);
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to submit vote";

      if (showToasts) {
        if (error.data?.code === "CONFLICT") {
          toast.warning("You have already voted on this question");
        } else if (error.data?.code === "TOO_MANY_REQUESTS") {
          toast.error("Rate limit exceeded. Please try again later.");
        } else {
          toast.error(errorMessage);
        }
      }

      onError?.(errorMessage);
    },
    onSettled: (data, error, variables) => {
      // Remove loading state for this question
      setVotingStates((prev) => {
        const newStates = new Map(prev);
        newStates.delete(variables.questionId);
        return newStates;
      });
    },
  });

  const submitVote = useCallback(
    async (questionId: string, response: string | number | string[] | Record<string, unknown>) => {
      // Set loading state for this question
      setVotingStates((prev) => new Map(prev).set(questionId, true));

      try {
        await voteMutation.mutateAsync({ questionId, response });
      } catch (error) {
        // Error is already handled by the mutation's onError
        throw error;
      }
    },
    [voteMutation]
  );

  const isVoting = useCallback(
    (questionId: string) => {
      return votingStates.get(questionId) || false;
    },
    [votingStates]
  );

  const isAnyVoting = votingStates.size > 0;

  return {
    submitVote,
    isVoting,
    isAnyVoting,
    isLoading: voteMutation.isLoading,
    error: voteMutation.error?.message || null,
  };
}
