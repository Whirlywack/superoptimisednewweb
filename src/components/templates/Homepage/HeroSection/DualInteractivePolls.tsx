"use client";

import React, { useState, useContext, useEffect } from "react";
import { cn } from "@/lib/utils";
import { XPToastContext } from "../XPToastProvider";
import { useActiveQuestions } from "@/hooks/useActiveQuestions";
import { useVoteSubmission } from "@/hooks/useVoteSubmission";

interface DatabaseQuestion {
  id: string;
  title: string;
  description: string | null;
  questionType: string;
  questionData: unknown; // JSON object containing options, etc.
  category: string | null;
  responseCount: number;
}

interface PollState {
  id: string;
  question: DatabaseQuestion;
  selectedOption: string | null;
  isAnimating: boolean;
  hasVoted: boolean;
}

export function DualInteractivePolls() {
  const { showXPToast } = useContext(XPToastContext);
  const [polls, setPolls] = useState<PollState[]>([]);
  const [votedQuestions, setVotedQuestions] = useState<Set<string>>(new Set());

  // Fetch active questions using tRPC
  const {
    questions,
    isLoading: questionsLoading,
    isError: questionsError,
    getRandomQuestions,
    refetch: refetchQuestions,
  } = useActiveQuestions({ limit: 20 });

  // Vote submission hook with XP toast integration
  const { submitVote } = useVoteSubmission({
    onSuccess: () => {
      showXPToast("poll");
    },
    showToasts: false, // We handle XP toast manually
  });

  // Initialize polls with random questions from database
  useEffect(() => {
    if (questions && questions.length > 0 && polls.length === 0) {
      const randomQuestions = getRandomQuestions(2);
      const initialPolls = randomQuestions.map((question, index) => ({
        id: `poll-${index + 1}`,
        question,
        selectedOption: null,
        isAnimating: false,
        hasVoted: false,
      }));
      setPolls(initialPolls);
    }
  }, [questions, polls.length, getRandomQuestions]);

  const handleVote = async (pollId: string, optionIndex: number) => {
    // Find the poll
    const pollIndex = polls.findIndex((p) => p.id === pollId);
    if (pollIndex === -1) return;

    const poll = polls[pollIndex];
    if (poll.hasVoted || votedQuestions.has(poll.question.id)) return; // Already voted

    // Get the selected option from questionData
    const options = poll.question.questionData?.options || [];
    if (optionIndex >= options.length) return;

    const selectedOption = options[optionIndex];

    try {
      // Mark as voted locally first (optimistic update)
      setPolls((prev) =>
        prev.map((p) => (p.id === pollId ? { ...p, selectedOption, hasVoted: true } : p))
      );
      setVotedQuestions((prev) => new Set(prev).add(poll.question.id));

      // Submit vote to backend
      await submitVote(poll.question.id, selectedOption);

      // Start question replacement after 600ms
      setTimeout(() => {
        setPolls((prev) => prev.map((p) => (p.id === pollId ? { ...p, isAnimating: true } : p)));

        // Replace question after fade out (200ms)
        setTimeout(() => {
          const availableQuestions =
            questions?.filter((q) => !votedQuestions.has(q.id) && q.id !== poll.question.id) || [];

          if (availableQuestions.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableQuestions.length);
            const newQuestion = availableQuestions[randomIndex];

            setPolls((prev) =>
              prev.map((p) =>
                p.id === pollId
                  ? {
                      ...p,
                      question: newQuestion,
                      selectedOption: null,
                      isAnimating: false,
                      hasVoted: false,
                    }
                  : p
              )
            );
          } else {
            // No more questions available, refetch
            refetchQuestions();
          }
        }, 200);
      }, 600);
    } catch {
      // Revert optimistic update on error
      setPolls((prev) =>
        prev.map((p) => (p.id === pollId ? { ...p, selectedOption: null, hasVoted: false } : p))
      );
      setVotedQuestions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(poll.question.id);
        return newSet;
      });
    }
  };

  const shareToTwitter = (poll: PollState) => {
    const text = `Just voted on: "${poll.question.title}" 

Building in public with @superoptimised 🚀

#BuildInPublic #DeveloperFeedback`;

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (questionsLoading || polls.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <PollSkeleton />
        <PollSkeleton />
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="my-12 text-center">
        <p className="mb-4 text-warm-gray">Unable to load questions. Please try again.</p>
        <button onClick={() => refetchQuestions()} className="text-primary hover:underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="my-12 grid grid-cols-1 gap-8 md:grid-cols-2">
      {polls.map((poll) => (
        <PollWidget
          key={poll.id}
          poll={poll}
          onVote={(optionIndex) => handleVote(poll.id, optionIndex)}
          onShare={() => shareToTwitter(poll)}
        />
      ))}
    </div>
  );
}

interface PollWidgetProps {
  poll: PollState;
  onVote: (optionIndex: number) => void;
  onShare: () => void;
}

function PollWidget({ poll, onVote, onShare }: PollWidgetProps) {
  const hasVoted = poll.hasVoted;
  const totalVotes = poll.question.responseCount;
  const options = poll.question.questionData?.options || [];

  return (
    <div
      className={cn(
        "rounded-lg border-2 border-light-gray bg-white p-8 transition-all duration-200",
        poll.isAnimating && "translate-y-1 opacity-0"
      )}
    >
      {/* Question */}
      <div className="mb-8 text-sm font-semibold leading-snug text-off-black">
        {poll.question.title}
      </div>

      {/* Description (if available) */}
      {poll.question.description && (
        <div className="mb-6 text-xs text-warm-gray">{poll.question.description}</div>
      )}

      {/* Options */}
      <div className="mb-8 flex gap-4">
        {options.map((option: string, index: number) => {
          const isSelected = poll.selectedOption === option;

          return (
            <button
              key={index}
              onClick={() => onVote(index)}
              disabled={hasVoted}
              className={cn(
                "flex-1 rounded p-4 text-center text-sm font-medium transition-all duration-200",
                "cursor-pointer border-2 border-transparent",
                hasVoted && "cursor-not-allowed opacity-70",
                isSelected
                  ? "border-primary bg-primary text-white"
                  : "bg-light-gray text-off-black hover:border-primary hover:bg-white",
                hasVoted && !isSelected && "opacity-50"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Meta */}
      <div className="text-center text-xs text-warm-gray">
        <span className="font-mono">{totalVotes} votes so far</span>
        <span className="mx-2">•</span>
        <button onClick={onShare} className="text-primary hover:underline">
          {hasVoted ? "Discuss on X" : "Share on X"}
        </button>
      </div>
    </div>
  );
}

function PollSkeleton() {
  return (
    <div className="rounded-lg border-2 border-light-gray bg-white p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-3/4 rounded bg-light-gray"></div>
        <div className="h-3 w-1/2 rounded bg-light-gray"></div>
        <div className="space-y-3">
          <div className="h-12 rounded bg-light-gray"></div>
          <div className="h-12 rounded bg-light-gray"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-20 rounded bg-light-gray"></div>
          <div className="h-3 w-16 rounded bg-light-gray"></div>
        </div>
      </div>
    </div>
  );
}
