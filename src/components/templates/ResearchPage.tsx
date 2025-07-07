"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { HomepageNavigation } from "./Homepage/HomepageNavigation";
import { HomepageFooter } from "./Homepage/HomepageFooter";
import { XPToastProvider } from "./Homepage/XPToastProvider";
import { useVoteSubmission } from "@/hooks/useVoteSubmission";
import { useQuestionStats } from "@/hooks/useQuestionStats";
import { useResearchPageOptimization } from "@/hooks/useResearchPageOptimization";
import { ResearchErrorBoundary } from "@/components/ui/ResearchErrorBoundary";
import { useAdvancedFeedback } from "@/hooks/useAdvancedFeedback";
import {
  VoteButtonLoading,
  AnimatedCounter,
  SlideIn,
  ProgressRing,
} from "@/components/ui/EnhancedLoadingStates";
import { useAccessibility } from "@/hooks/useAccessibility";

// Import types from the optimization hook
import type { ProcessedQuestion } from "@/hooks/useResearchPageOptimization";

function ProgressBar({ current, total }: { current: number; total: number }) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="mb-sm">
        <span className="font-mono text-sm font-semibold text-primary">
          Question {current} of {total}
        </span>
      </div>
      <div className="h-2 w-full bg-light-gray">
        <div
          className="h-2 bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function SingleQuestion({
  question,
  onVote,
  currentIndex,
  totalQuestions,
}: {
  question: ProcessedQuestion;
  onVote: (optionId: string) => void;
  currentIndex: number;
  totalQuestions: number;
}) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isProgressing, setIsProgressing] = useState(false);

  // Get real-time vote statistics for this question with optimistic updates
  const { totalVotes, breakdown, applyOptimisticUpdate, hasOptimisticUpdates } = useQuestionStats({
    questionId: question.id,
    refetchInterval: showResults ? 2000 : 0, // Faster polling when showing results
    enableOptimistic: true,
  });

  const { voteSubmitted, buttonClick, progressUpdate } = useAdvancedFeedback();
  const { announceToScreenReader, shouldReduceMotion, isKeyboardUser } = useAccessibility();

  const { submitVote, isVoting } = useVoteSubmission({
    onSuccess: () => {
      // Vote successful, stats will update automatically via real-time hook
      // Real XP toast is already handled by useVoteSubmission
      voteSubmitted(true);
      progressUpdate();
    },
    onError: () => {
      voteSubmitted(false);
    },
    showToasts: true, // Use built-in real XP toasts instead of fake ones
  });

  const handleVote = async (optionId: string) => {
    if (isVoting(question.id)) return; // Prevent double voting

    setSelectedOption(optionId);
    setShowResults(true);

    // Apply optimistic update for immediate feedback
    applyOptimisticUpdate(optionId);

    try {
      // Submit vote to database
      await submitVote(question.id, optionId);

      // Announce to screen readers
      const optionText = question.options.find((opt) => opt.id === optionId)?.text;
      announceToScreenReader(`Vote submitted for: ${optionText}`, "polite");

      // Notify parent component
      onVote(optionId);

      // Start progress bar for next question
      if (currentIndex < totalQuestions - 1) {
        setIsProgressing(true);
        setProgressPercent(0);

        const duration = 3000; // 3 seconds
        const interval = 50; // Update every 50ms for smooth animation
        const increment = (interval / duration) * 100;

        const timer = setInterval(() => {
          setProgressPercent((prev) => {
            const next = prev + increment;
            if (next >= 100) {
              clearInterval(timer);
              setIsProgressing(false);
              return 100;
            }
            return next;
          });
        }, interval);
      }
    } catch {
      // Reset state on error
      setSelectedOption(null);
      setShowResults(false);
    }
  };

  const getVotePercentage = (optionId: string) => {
    if (!breakdown || totalVotes === 0) return 0;
    const option = breakdown.find((b) => b.option === optionId);
    return option ? option.percentage : 0;
  };

  const getVoteCount = (optionId: string) => {
    if (!breakdown) return 0;
    const option = breakdown.find((b) => b.option === optionId);
    return option ? option.count : 0;
  };

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      {/* Navigation */}
      <HomepageNavigation />

      {/* Progress Bar */}
      <div className="w-full border-b border-light-gray bg-white px-4 py-md">
        <div className="mx-auto max-w-2xl">
          <ProgressBar current={currentIndex + 1} total={totalQuestions} />
          {/* Performance indicator (dev mode only) */}
          {process.env.NODE_ENV === "development" && hasOptimisticUpdates && (
            <div className="mt-xs flex items-center justify-end gap-xs">
              <div className="size-1.5 rounded-full bg-green-500"></div>
              <span className="font-mono text-xs text-green-600">Optimized</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Question */}
      <main
        className="flex flex-1 items-start justify-center px-4 pb-xl pt-lg"
        id="main-content"
        role="main"
        aria-label="Research questions"
      >
        <div className="w-full max-w-2xl">
          <div className="mb-lg text-center">
            <h1 className="mb-md text-5xl font-bold leading-none text-off-black md:text-6xl">
              {question.title}
            </h1>
            <div className="mx-auto max-w-prose border-l-2 border-light-gray pl-md">
              <p
                id="question-description"
                className="text-sm italic leading-relaxed text-warm-gray"
              >
                {question.description}
              </p>
            </div>
          </div>

          <div
            className="space-y-md"
            role="radiogroup"
            aria-label={`Question: ${question.title}`}
            aria-describedby="question-description"
          >
            {question.options.map((option, index) => {
              const percentage = getVotePercentage(option.id);
              const voteCount = getVoteCount(option.id);
              const isSelected = selectedOption === option.id;
              const isVotingThis = isVoting(question.id) && isSelected;

              return (
                <SlideIn key={option.id} delay={shouldReduceMotion ? 0 : index * 100}>
                  <VoteButtonLoading
                    isLoading={isVotingThis}
                    onClick={() => {
                      buttonClick();
                      handleVote(option.id);
                    }}
                    disabled={showResults}
                    className={cn(
                      "w-full border-2 p-lg text-left transition-all",
                      shouldReduceMotion ? "duration-0" : "duration-200",
                      "relative flex min-h-[88px] flex-col justify-center overflow-hidden",
                      !shouldReduceMotion && "hover:scale-[1.01] active:scale-[0.99]",
                      isKeyboardUser &&
                        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      showResults
                        ? isSelected
                          ? "border-primary bg-off-white text-off-black shadow-lg"
                          : "border-light-gray bg-light-gray text-warm-gray"
                        : "border-light-gray bg-off-white text-off-black hover:border-primary hover:shadow-md"
                    )}
                    role="radio"
                    aria-checked={isSelected}
                    aria-describedby={`option-${option.id}-description`}
                    aria-label={`${option.text}${showResults ? `, ${percentage}% of votes, ${voteCount} total votes` : ""}`}
                  >
                    {showResults && (
                      <>
                        <div
                          className="absolute inset-y-0 left-0 bg-primary/5 transition-all duration-500 ease-linear"
                          style={{ width: `${percentage}%` }}
                        />
                        {isSelected && (
                          <div className="absolute right-2 top-2">
                            <div className="size-3 rounded-full bg-primary" />
                          </div>
                        )}
                      </>
                    )}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between">
                        <span className="text-xl font-bold leading-tight">{option.text}</span>
                        {showResults && (
                          <div className="ml-md text-right">
                            <div className="flex items-center gap-sm">
                              <div>
                                <AnimatedCounter
                                  value={percentage}
                                  suffix="%"
                                  className="font-mono text-xl font-bold text-primary"
                                />
                                <div className="font-mono text-sm text-warm-gray">
                                  <AnimatedCounter
                                    value={voteCount}
                                    suffix={` vote${voteCount !== 1 ? "s" : ""}`}
                                  />
                                </div>
                              </div>
                              {isSelected && (
                                <ProgressRing
                                  progress={percentage}
                                  size={32}
                                  className="text-primary"
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {option.description && (
                        <div
                          id={`option-${option.id}-description`}
                          className={cn("mt-sm text-base", "text-warm-gray")}
                        >
                          {option.description}
                        </div>
                      )}
                    </div>
                  </VoteButtonLoading>
                </SlideIn>
              );
            })}
          </div>

          {showResults && (
            <div className="mt-lg space-y-md">
              {/* Vote Summary */}
              <SlideIn delay={200}>
                <div className="text-center">
                  <div className="inline-flex items-center gap-sm border-2 border-primary bg-off-white px-lg py-md transition-all duration-300 hover:shadow-lg">
                    <span className="font-mono text-base font-semibold text-primary">
                      <AnimatedCounter value={totalVotes} /> Total Vote{totalVotes !== 1 ? "s" : ""}
                    </span>
                    {hasOptimisticUpdates && (
                      <div className="flex items-center gap-xs">
                        <div className="size-2 animate-pulse rounded-full bg-primary"></div>
                        <span className="font-mono text-xs text-primary">Live</span>
                      </div>
                    )}
                  </div>
                </div>
              </SlideIn>

              {/* Next Question Progress */}
              {isProgressing && currentIndex < totalQuestions - 1 && (
                <div className="space-y-sm">
                  <div className="text-center">
                    <span className="font-mono text-base font-semibold text-off-black">
                      Next Question
                    </span>
                  </div>
                  <div className="mx-auto w-full max-w-md">
                    <div className="h-1 w-full bg-light-gray">
                      <div
                        className="h-1 bg-primary transition-all duration-75 ease-linear"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Final Question Processing */}
              {showResults && currentIndex === totalQuestions - 1 && (
                <div className="text-center">
                  <span className="font-mono text-base font-semibold text-off-black">
                    Processing Results...
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <HomepageFooter />
    </div>
  );
}

// processQuestion function moved to useResearchPageOptimization hook

function ResearchPageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <HomepageNavigation />

      {/* Progress Bar Skeleton */}
      <div className="w-full border-b border-light-gray bg-white px-4 py-md">
        <div className="mx-auto max-w-2xl">
          <div className="mb-sm">
            <div className="h-4 w-32 animate-pulse bg-light-gray"></div>
          </div>
          <div className="h-2 w-full bg-light-gray"></div>
        </div>
      </div>

      {/* Question Skeleton */}
      <main className="flex flex-1 items-start justify-center px-4 pb-xl pt-lg">
        <div className="w-full max-w-2xl">
          <div className="mb-lg text-center">
            <div className="mb-md h-16 w-full animate-pulse bg-light-gray"></div>
            <div className="mx-auto h-8 max-w-prose animate-pulse bg-light-gray"></div>
          </div>

          <div className="space-y-md">
            <div className="h-24 w-full animate-pulse bg-light-gray"></div>
            <div className="h-24 w-full animate-pulse bg-light-gray"></div>
          </div>
        </div>
      </main>

      <HomepageFooter />
    </div>
  );
}

export function ResearchPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});

  // Use optimized research page hook for better performance
  const { questions, isLoading, isError, error, refetch } = useResearchPageOptimization();

  const handleVote = (optionId: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    console.log("Vote received for option:", optionId, "on question:", currentQuestion.id);

    // XP toast is now handled by the SingleQuestion component with real XP values

    // Mark question as answered and store response
    const newAnswered = new Set(answeredQuestions);
    newAnswered.add(currentQuestionIndex);
    setAnsweredQuestions(newAnswered);

    // Store user response by question ID (not index)
    const newResponses = { ...userResponses };
    newResponses[currentQuestion.id] = optionId;
    setUserResponses(newResponses);

    // Store responses in localStorage for completion page
    localStorage.setItem("research-responses", JSON.stringify(newResponses));

    console.log(
      "Setting timeout for question advancement. Current:",
      currentQuestionIndex,
      "Total:",
      questions.length
    );

    // Auto-advance to next question after 3 seconds
    setTimeout(() => {
      setCurrentQuestionIndex((prevIndex) => {
        console.log(
          "Timeout fired. Previous index:",
          prevIndex,
          "Total questions:",
          questions.length
        );
        if (prevIndex < questions.length - 1) {
          console.log("Advancing to next question:", prevIndex + 1);
          return prevIndex + 1;
        } else {
          console.log("All questions complete, redirecting to completion page");
          // Store final responses before redirect
          localStorage.setItem("research-responses", JSON.stringify(newResponses));
          // Redirect to completion page
          window.location.href = "/research/complete";
          return prevIndex;
        }
      });
    }, 3000);
  };

  // Loading state
  if (isLoading) {
    return (
      <ResearchErrorBoundary>
        <XPToastProvider>
          <ResearchPageSkeleton />
        </XPToastProvider>
      </ResearchErrorBoundary>
    );
  }

  // Error state
  if (isError || !questions || questions.length === 0) {
    return (
      <ResearchErrorBoundary>
        <XPToastProvider>
          <div className="flex min-h-screen flex-col bg-off-white">
            <HomepageNavigation />
            <main className="flex flex-1 items-center justify-center px-4">
              <div className="text-center">
                <h1 className="mb-4 text-2xl font-bold text-off-black">
                  Unable to Load Research Questions
                </h1>
                <p className="mb-8 text-warm-gray">
                  {error || "There was an error loading the research questions. Please try again."}
                </p>
                <button
                  onClick={() => refetch()}
                  className="border-2 border-primary bg-primary px-6 py-3 font-mono text-white transition-all hover:bg-off-white hover:text-primary"
                >
                  Try Again
                </button>
              </div>
            </main>
            <HomepageFooter />
          </div>
        </XPToastProvider>
      </ResearchErrorBoundary>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <ResearchErrorBoundary>
        <XPToastProvider>
          <ResearchPageSkeleton />
        </XPToastProvider>
      </ResearchErrorBoundary>
    );
  }

  return (
    <ResearchErrorBoundary>
      <XPToastProvider>
        <SingleQuestion
          key={currentQuestionIndex}
          question={currentQuestion}
          onVote={handleVote}
          currentIndex={currentQuestionIndex}
          totalQuestions={questions.length}
        />
      </XPToastProvider>
    </ResearchErrorBoundary>
  );
}
