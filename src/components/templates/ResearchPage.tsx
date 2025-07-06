"use client";

import React, { useState, useContext, useEffect } from "react";
import { cn } from "@/lib/utils";
import { HomepageNavigation } from "./Homepage/HomepageNavigation";
import { HomepageFooter } from "./Homepage/HomepageFooter";
import { XPToastProvider, XPToastContext } from "./Homepage/XPToastProvider";
import { ChevronRight } from "lucide-react";

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
      { id: "point-system", text: "Point Allocation", description: "Distribute points across options" },
    ],
    votes: { "ranked-choice": 22, "point-system": 25 },
    totalVotes: 47,
  }
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
  totalQuestions 
}: { 
  question: ResearchQuestion; 
  onVote: (optionId: string) => void;
  currentIndex: number;
  totalQuestions: number;
}) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleVote = (optionId: string) => {
    setSelectedOption(optionId);
    setShowResults(true);
    onVote(optionId);

    // Start countdown for next question
    if (currentIndex < totalQuestions - 1) {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const getVotePercentage = (optionId: string) => {
    if (question.totalVotes === 0) return 0;
    return Math.round((question.votes[optionId] / question.totalVotes) * 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-off-white">
      {/* Navigation */}
      <HomepageNavigation />

      {/* Progress Bar */}
      <div className="w-full bg-white border-b border-light-gray px-4 py-md">
        <div className="mx-auto max-w-2xl">
          <ProgressBar current={currentIndex + 1} total={totalQuestions} />
        </div>
      </div>

      {/* Main Question */}
      <main className="flex-1 flex items-center justify-center px-4 py-xl">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-xl">
            <h1 className="text-hero font-bold text-off-black mb-lg leading-tight">
              {question.title}
            </h1>
            <p className="text-warm-gray text-lg leading-relaxed max-w-prose mx-auto">
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
                    "w-full p-lg border-2 text-left transition-all duration-200",
                    "min-h-[88px] flex flex-col justify-center relative overflow-hidden",
                    showResults
                      ? isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-light-gray bg-light-gray text-warm-gray"
                      : "border-light-gray bg-white text-off-black hover:border-primary active:transform active:scale-98"
                  )}
                >
                  {showResults && (
                    <div
                      className="absolute inset-0 bg-primary/[0.1] transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  )}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <span className="font-bold text-xl leading-tight">{option.text}</span>
                      {showResults && (
                        <span className="font-mono text-lg font-bold ml-md">
                          {percentage}%
                        </span>
                      )}
                    </div>
                    {option.description && (
                      <div className={cn(
                        "mt-sm text-base",
                        showResults && isSelected ? "text-white/90" : "text-warm-gray"
                      )}>
                        {option.description}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {showResults && (
            <div className="mt-xl text-center space-y-md">
              <div className="inline-flex items-center gap-sm bg-white border border-light-gray px-md py-sm">
                <span className="font-mono text-xs font-semibold uppercase tracking-wide text-primary">
                  {question.totalVotes} total votes
                </span>
              </div>
              
              {countdown !== null && currentIndex < totalQuestions - 1 && (
                <div className="text-warm-gray">
                  <span className="font-mono text-sm">
                    Next question in {countdown}s...
                  </span>
                </div>
              )}
              
              {showResults && currentIndex === totalQuestions - 1 && (
                <div className="text-warm-gray">
                  <span className="font-mono text-sm">
                    Almost done! One moment...
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

function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showXPToast } = useContext(XPToastContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEmail("");
      showXPToast("newsletter");
    } catch (error) {
      console.error("Newsletter signup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-white border-t border-light-gray px-4 py-xl">
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="text-xl font-bold text-off-black mb-sm">
          Get Decision Updates
        </h3>
        <p className="text-warm-gray mb-lg">
          Be notified when new community decisions need your input.
        </p>
        
        <form onSubmit={handleSubmit} className="flex gap-sm max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={isSubmitting}
            className={cn(
              "flex-1 border-2 border-light-gray px-md py-sm",
              "bg-white text-base",
              "focus:border-primary focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
          <button
            type="submit"
            disabled={isSubmitting || !email}
            className={cn(
              "bg-primary px-lg py-sm text-base font-semibold text-white",
              "transition-all duration-200",
              "hover:bg-off-black disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            {isSubmitting ? "..." : "Join"}
          </button>
        </form>
      </div>
    </section>
  );
}

export function ResearchPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const { showXPToast } = useContext(XPToastContext);

  // Debug: Log current state
  console.log('Current question index:', currentQuestionIndex);
  console.log('Total questions:', researchQuestions.length);
  console.log('Answered questions:', Array.from(answeredQuestions));

  const handleVote = (optionId: string) => {
    console.log('Vote received for option:', optionId, 'on question:', currentQuestionIndex);
    
    // Track the vote
    showXPToast("research-vote");
    
    // Mark question as answered
    const newAnswered = new Set(answeredQuestions);
    newAnswered.add(currentQuestionIndex);
    setAnsweredQuestions(newAnswered);

    console.log('Setting timeout for question advancement. Current:', currentQuestionIndex, 'Total:', researchQuestions.length);

    // Auto-advance to next question after 3 seconds
    setTimeout(() => {
      setCurrentQuestionIndex(prevIndex => {
        console.log('Timeout fired. Previous index:', prevIndex, 'Total questions:', researchQuestions.length);
        if (prevIndex < researchQuestions.length - 1) {
          console.log('Advancing to next question:', prevIndex + 1);
          return prevIndex + 1;
        } else {
          console.log('All questions complete, redirecting to completion page');
          // Redirect to completion page instead of showing inline completion
          window.location.href = '/research/complete';
          return prevIndex;
        }
      });
    }, 3000);
  };

  const handleShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent("Just voted on key decisions for @superoptimised's building project! Your voice matters - help shape what gets built next:")}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
    showXPToast("social-share");
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