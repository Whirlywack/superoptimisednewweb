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
            <div className="mx-auto max-w-prose border-l-2 border-light-gray pl-md">
              <p className="text-sm italic leading-relaxed text-warm-gray">
                {question.description}
              </p>
            </div>
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
                          <span className="font-mono text-xl font-bold text-primary">
                            {percentage}%
                          </span>
                          <div className="font-mono text-sm text-warm-gray">
                            {question.votes[option.id]} votes
                          </div>
                        </div>
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
            <div className="mt-lg space-y-md">
              {/* Vote Summary */}
              <div className="text-center">
                <div className="inline-flex items-center gap-sm border-2 border-primary bg-off-white px-lg py-md">
                  <span className="font-mono text-base font-semibold text-primary">
                    {question.totalVotes} Total Votes
                  </span>
                </div>
              </div>

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

export function ResearchPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [userResponses, setUserResponses] = useState<Record<number, string>>({});
  const { showXPToast } = useContext(XPToastContext);

  // Debug: Log current state
  console.log("Current question index:", currentQuestionIndex);
  console.log("Total questions:", researchQuestions.length);
  console.log("Answered questions:", Array.from(answeredQuestions));

  const handleVote = (optionId: string) => {
    console.log("Vote received for option:", optionId, "on question:", currentQuestionIndex);

    // Track the vote
    showXPToast("research-vote");

    // Mark question as answered and store response
    const newAnswered = new Set(answeredQuestions);
    newAnswered.add(currentQuestionIndex);
    setAnsweredQuestions(newAnswered);

    // Store user response
    const newResponses = { ...userResponses };
    newResponses[currentQuestionIndex] = optionId;
    setUserResponses(newResponses);

    // Store responses in localStorage for completion page
    localStorage.setItem("research-responses", JSON.stringify(newResponses));

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
          // Store final responses before redirect
          localStorage.setItem("research-responses", JSON.stringify(newResponses));
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
