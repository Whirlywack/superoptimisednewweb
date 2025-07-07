"use client";

import React, { useState, useContext } from "react";
import { cn } from "@/lib/utils";
import { HomepageNavigation } from "./Homepage/HomepageNavigation";
import { HomepageFooter } from "./Homepage/HomepageFooter";
import { XPToastProvider, XPToastContext } from "./Homepage/XPToastProvider";

interface ResearchQuestion {
  id: string;
  title: string;
  description: string;
  options: {
    id: string;
    text: string;
    description?: string;
  }[];
  votes: Record<string, number>;
  totalVotes: number;
}

const researchQuestions: ResearchQuestion[] = [
  {
    id: "auth-method",
    title: "How should users authenticate to vote?",
    description: "We need to prevent spam while keeping it accessible for everyone.",
    options: [
      { id: "magic-links", text: "Magic Links", description: "Email-based, no passwords" },
      { id: "social-auth", text: "Social Login", description: "Google, GitHub, etc." },
    ],
    votes: { "magic-links": 23, "social-auth": 17 },
    totalVotes: 40,
  },
  {
    id: "mobile-experience",
    title: "Which platform should we prioritize first?",
    description: "Limited time means focusing on one experience initially.",
    options: [
      { id: "mobile-first", text: "Mobile-First", description: "Optimized for phones" },
      { id: "desktop-first", text: "Desktop-First", description: "Rich desktop experience" },
    ],
    votes: { "mobile-first": 31, "desktop-first": 14 },
    totalVotes: 45,
  },
  {
    id: "notifications",
    title: "How would you like decision updates?",
    description: "When new community decisions need your input.",
    options: [
      { id: "email-weekly", text: "Weekly Email", description: "Digest of all decisions" },
      { id: "real-time", text: "Real-time Alerts", description: "Immediate notifications" },
    ],
    votes: { "email-weekly": 28, "real-time": 19 },
    totalVotes: 47,
  },
  {
    id: "voting-style",
    title: "What voting system feels most fair?",
    description: "For prioritizing features and making decisions.",
    options: [
      { id: "ranked-choice", text: "Ranked Choice", description: "Rank options by preference" },
      {
        id: "point-system",
        text: "Point Allocation",
        description: "Distribute points across options",
      },
    ],
    votes: { "ranked-choice": 22, "point-system": 25 },
    totalVotes: 47,
  },
];

function ProgressBar({ current, total }: { current: number; total: number }) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="mb-sm flex justify-between">
        <span className="font-mono text-xs font-semibold uppercase tracking-wide text-primary">
          {current} of {total}
        </span>
        <span className="font-mono text-xs font-semibold text-warm-gray">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-1 w-full bg-light-gray">
        <div
          className="h-1 bg-primary transition-all duration-500 ease-out"
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
  question: ResearchQuestion;
  onVote: (optionId: string) => void;
  currentIndex: number;
  totalQuestions: number;
}) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isProgressing, setIsProgressing] = useState(false);

  const handleVote = (optionId: string) => {
    setSelectedOption(optionId);
    setShowResults(true);
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
  };

  const getVotePercentage = (optionId: string) => {
    if (question.totalVotes === 0) return 0;
    return Math.round((question.votes[optionId] / question.totalVotes) * 100);
  };

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      {/* Navigation */}
      <HomepageNavigation />

      {/* Progress Bar */}
      <div className="w-full border-b border-light-gray bg-white px-4 py-md">
        <div className="mx-auto max-w-2xl">
          <ProgressBar current={currentIndex + 1} total={totalQuestions} />
        </div>
      </div>

      {/* Main Question */}
      <main className="flex flex-1 items-start justify-center px-4 pb-xl pt-lg">
        <div className="w-full max-w-2xl">
          <div className="mb-lg text-center">
            <h1 className="mb-md text-5xl font-bold leading-none text-off-black md:text-6xl">
              {question.title}
            </h1>
            <p className="mx-auto max-w-prose text-base leading-relaxed text-warm-gray">
              {question.description}
            </p>
          </div>

          <div className="space-y-md">
            {question.options.map((option) => {
              const percentage = getVotePercentage(option.id);
              const isSelected = selectedOption === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleVote(option.id)}
                  disabled={showResults}
                  className={cn(
                    "w-full border-2 p-lg text-left transition-all duration-100",
                    "relative flex min-h-[88px] flex-col justify-center overflow-hidden",
                    showResults
                      ? isSelected
                        ? "border-primary bg-off-white text-off-black"
                        : "border-light-gray bg-light-gray text-warm-gray"
                      : "border-light-gray bg-off-white text-off-black hover:border-primary"
                  )}
                >
                  {showResults && (
                    <div
                      className="absolute inset-y-0 left-0 border-r-2 border-primary transition-all duration-500 ease-linear"
                      style={{ width: `${percentage}%` }}
                    />
                  )}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <span className="text-xl font-bold leading-tight">{option.text}</span>
                      {showResults && (
                        <span className="ml-md font-mono text-lg font-bold text-primary">
                          {percentage}%
                        </span>
                      )}
                    </div>
                    {option.description && (
                      <div className={cn("mt-sm text-base", "text-warm-gray")}>
                        {option.description}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showResults && (
            <div className="mt-lg space-y-md text-center">
              <div className="inline-flex items-center gap-sm border border-light-gray bg-off-white px-md py-sm">
                <span className="font-mono text-xs font-semibold uppercase tracking-wide text-primary">
                  {question.totalVotes} total votes
                </span>
              </div>

              {isProgressing && currentIndex < totalQuestions - 1 && (
                <div className="space-y-sm">
                  <div className="text-warm-gray">
                    <span className="font-mono text-sm">Next question</span>
                  </div>
                  <div className="mx-auto w-full max-w-xs">
                    <div className="h-0.5 w-full bg-light-gray">
                      <div
                        className="h-0.5 bg-primary transition-all duration-75 ease-linear"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {showResults && currentIndex === totalQuestions - 1 && (
                <div className="text-warm-gray">
                  <span className="font-mono text-sm">Processing...</span>
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

export function ResearchPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const { showXPToast } = useContext(XPToastContext);

  // Debug: Log current state
  console.log("Current question index:", currentQuestionIndex);
  console.log("Total questions:", researchQuestions.length);
  console.log("Answered questions:", Array.from(answeredQuestions));

  const handleVote = (optionId: string) => {
    console.log("Vote received for option:", optionId, "on question:", currentQuestionIndex);

    // Track the vote
    showXPToast("research-vote");

    // Mark question as answered
    const newAnswered = new Set(answeredQuestions);
    newAnswered.add(currentQuestionIndex);
    setAnsweredQuestions(newAnswered);

    console.log(
      "Setting timeout for question advancement. Current:",
      currentQuestionIndex,
      "Total:",
      researchQuestions.length
    );

    // Auto-advance to next question after 3 seconds
    setTimeout(() => {
      setCurrentQuestionIndex((prevIndex) => {
        console.log(
          "Timeout fired. Previous index:",
          prevIndex,
          "Total questions:",
          researchQuestions.length
        );
        if (prevIndex < researchQuestions.length - 1) {
          console.log("Advancing to next question:", prevIndex + 1);
          return prevIndex + 1;
        } else {
          console.log("All questions complete, redirecting to completion page");
          // Redirect to completion page instead of showing inline completion
          window.location.href = "/research/complete";
          return prevIndex;
        }
      });
    }, 3000);
  };

  // No inline completion screen needed - redirects to /research/complete

  return (
    <XPToastProvider>
      <SingleQuestion
        key={currentQuestionIndex}
        question={researchQuestions[currentQuestionIndex]}
        onVote={handleVote}
        currentIndex={currentQuestionIndex}
        totalQuestions={researchQuestions.length}
      />
    </XPToastProvider>
  );
}
