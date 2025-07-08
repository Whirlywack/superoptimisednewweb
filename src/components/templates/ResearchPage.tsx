"use client";

import React, { useState } from "react";
import { HomepageNavigation } from "./Homepage/HomepageNavigation";
import { HomepageFooter } from "./Homepage/HomepageFooter";
import { XPToastProvider } from "./Homepage/XPToastProvider";
import { useVoteSubmission } from "@/hooks/useVoteSubmission";
import { useQuestionStats } from "@/hooks/useQuestionStats";
import { useResearchPageOptimization } from "@/hooks/useResearchPageOptimization";
import { ResearchErrorBoundary } from "@/components/ui/ResearchErrorBoundary";
import { useAdvancedFeedback } from "@/hooks/useAdvancedFeedback";
import { AnimatedCounter, SlideIn } from "@/components/ui/EnhancedLoadingStates";
import { useAccessibility } from "@/hooks/useAccessibility";
import { QuestionRenderer } from "./QuestionRenderer";

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
  onVote: (responseData: any) => void;
  currentIndex: number;
  totalQuestions: number;
}) {
  const [showResults, setShowResults] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isProgressing, setIsProgressing] = useState(false);

  // Get real-time vote statistics for this question with optimistic updates
  const { totalVotes, applyOptimisticUpdate, hasOptimisticUpdates } = useQuestionStats({
    questionId: question.id,
    refetchInterval: showResults ? 2000 : 0, // Faster polling when showing results
    enableOptimistic: true,
  });

  const { voteSubmitted, progressUpdate } = useAdvancedFeedback();
  const { announceToScreenReader } = useAccessibility();

  const { submitVote, isVoting } = useVoteSubmission({
    onSuccess: () => {
      // Vote successful, stats will update automatically via real-time hook
      // XP calculation happening in background
      voteSubmitted(true);
      progressUpdate();
    },
    onError: () => {
      voteSubmitted(false);
    },
    showToasts: false, // Disable toasts for smoother progression
  });

  const handleVote = async (responseData: any) => {
    if (isVoting(question.id)) return; // Prevent double voting

    // Handle different response formats for optimistic updates
    const questionType = question.content?.type || "binary";
    let optimisticUpdateData;
    let screenReaderText = "";

    switch (questionType) {
      case "binary":
        optimisticUpdateData = responseData.selectedOption;
        const optionText = question.options?.find(
          (opt) => opt.id === responseData.selectedOption
        )?.text;
        screenReaderText = `Vote submitted for: ${optionText}`;
        break;
      case "multi-choice":
        optimisticUpdateData = responseData.selectedOptions[0]; // Use first selection for optimistic update
        screenReaderText = `Vote submitted for ${responseData.selectedOptions.length} options`;
        break;
      case "rating-scale":
        optimisticUpdateData = `rating-${responseData.rating}`;
        screenReaderText = `Rating of ${responseData.rating} out of ${responseData.maxRating} submitted`;
        break;
      case "text-response":
        optimisticUpdateData = "text-response";
        screenReaderText = `Text response submitted`;
        break;
      case "ranking":
        optimisticUpdateData = "ranking-response";
        screenReaderText = `Ranking response submitted`;
        break;
      case "ab-test":
        optimisticUpdateData = responseData.selectedOption;
        screenReaderText = `A/B test choice submitted`;
        break;
      default:
        optimisticUpdateData = "unknown-response";
        screenReaderText = `Response submitted`;
    }

    setShowResults(true);

    // Apply optimistic update for immediate feedback (for compatible question types)
    if (questionType === "binary" || questionType === "multi-choice") {
      applyOptimisticUpdate(optimisticUpdateData);
    }

    try {
      // Submit vote to database with the properly formatted response
      // The server expects the raw response data, not the wrapper object
      await submitVote(question.id, responseData);

      // Announce to screen readers
      announceToScreenReader(screenReaderText, "polite");

      // Notify parent component with full response data
      onVote(responseData);

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
      setShowResults(false);
      // Reset optimistic updates if they were applied
      if (questionType === "binary" || questionType === "multi-choice") {
        // The useQuestionStats hook should handle automatic cleanup of failed optimistic updates
      }
    }
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
          {/* Use QuestionRenderer for all question types */}
          <QuestionRenderer
            question={question}
            onVote={handleVote}
            currentIndex={currentIndex}
            totalQuestions={totalQuestions}
            disabled={showResults || isVoting(question.id)}
            className="mb-lg"
          />

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

  const handleVote = (responseData: any) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    console.log("Vote received with data:", responseData, "on question:", currentQuestion.id);

    // XP toast is now handled by the SingleQuestion component with real XP values

    // Mark question as answered and store response
    const newAnswered = new Set(answeredQuestions);
    newAnswered.add(currentQuestionIndex);
    setAnsweredQuestions(newAnswered);

    // Store user response by question ID (not index) - now supports different response formats
    const newResponses = { ...userResponses };
    newResponses[currentQuestion.id] = responseData;
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
