"use client";

import React, { useState, useContext } from "react";
import { cn } from "@/lib/utils";
import { HomepageNavigation } from "./Homepage/HomepageNavigation";
import { HomepageFooter } from "./Homepage/HomepageFooter";
import { XPToastProvider, XPToastContext } from "./Homepage/XPToastProvider";
import { Share } from "lucide-react";
import { useVoterToken } from "@/hooks/useVoterToken";
import { useEngagementStats } from "@/hooks/useEngagementStats";
import { useUserVoteHistory } from "@/hooks/useUserVoteHistory";
import { useActiveQuestions } from "@/hooks/useActiveQuestions";

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
    <section className="w-full border-t border-light-gray bg-white px-4 py-xl">
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="mb-sm text-xl font-bold text-off-black">Get Decision Updates</h3>
        <p className="mb-lg text-warm-gray">
          Be the first to know when new community decisions need your input.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-sm">
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

export function ResearchCompletePage() {
  const { showXPToast } = useContext(XPToastContext);
  const [showResponses, setShowResponses] = useState(false);
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});

  // Get voter token and real data from database
  const { voterTokenId } = useVoterToken();
  const { user: userStats, isLoading: statsLoading } = useEngagementStats({
    voterTokenId: voterTokenId || undefined,
  });
  const { votes: userVotes, totalXp, isLoading: votesLoading } = useUserVoteHistory();

  // New optimized XP calculation that handles background processing
  const { data: finalXp, isLoading: xpLoading } = api.vote.getFinalXpCalculation.useQuery(
    undefined,
    {
      refetchInterval: (data) => {
        // Keep polling if background processing isn't complete
        return data?.shouldRefetch ? 2000 : false;
      },
      staleTime: 1000, // Fresh data
    }
  );

  const { questions: allQuestions } = useActiveQuestions({ category: "research", limit: 20 });

  // Load user responses from localStorage as fallback
  React.useEffect(() => {
    const stored = localStorage.getItem("research-responses");
    if (stored) {
      setUserResponses(JSON.parse(stored));
    }
  }, []);

  // Get real questions from database
  const questions = allQuestions || [];

  // Filter votes for research category to get count and calculate XP
  const researchVotes = userVotes.filter((vote) => vote.category === "research");
  const researchVoteCount = researchVotes.length;

  // Calculate XP breakdown with optimized data handling
  const calculateXpBreakdown = () => {
    // Use the new optimized XP calculation if available
    if (finalXp && finalXp.voteCount > 0) {
      const baseXpPerQuestion = Math.floor(finalXp.totalXp / finalXp.voteCount);
      return {
        questionsAnswered: finalXp.voteCount,
        baseXpPerQuestion,
        questionXP: finalXp.totalXp,
        streakBonus: userStats?.currentStreak ? userStats.currentStreak * 5 : 0,
        engagementBonus: 0,
        totalEarnedXP: finalXp.totalXp,
        isEstimated: false,
        isProcessingComplete: finalXp.isComplete,
      };
    }

    // Fallback to legacy calculation
    if (!userStats || researchVoteCount === 0) {
      // Fallback calculation for localStorage data
      const localResponseCount = Object.keys(userResponses).length;
      return {
        questionsAnswered: localResponseCount,
        baseXpPerQuestion: 10, // Estimated
        questionXP: localResponseCount * 10,
        streakBonus: 0,
        engagementBonus: 0,
        totalEarnedXP: localResponseCount * 10,
        isEstimated: true,
        isProcessingComplete: true,
      };
    }

    // Real XP calculation from database (legacy path)
    const baseXpPerQuestion = Math.floor(
      (userStats.totalXp || 0) / Math.max(userStats.totalVotes || 1, 1)
    );
    return {
      questionsAnswered: researchVoteCount,
      baseXpPerQuestion,
      questionXP: researchVoteCount * baseXpPerQuestion,
      streakBonus: userStats.currentStreak ? userStats.currentStreak * 5 : 0,
      engagementBonus: 0,
      totalEarnedXP: totalXp || userStats.totalXp || 0,
      isEstimated: false,
      isProcessingComplete: true,
    };
  };

  const xpBreakdown = calculateXpBreakdown();

  const handleShare = () => {
    const responseCount = researchVoteCount || Object.keys(userResponses).length;
    const xpEarned = xpBreakdown.totalEarnedXP;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just completed ${responseCount} research questions and earned ${xpEarned} XP for @superoptimised's building project! 🗳️ Your voice shapes what gets built:`)}&url=${encodeURIComponent(window.location.origin + "/research")}`;
    window.open(url, "_blank");
    showXPToast("poll");
  };

  const handleTakeAnotherQuiz = () => {
    // Clear current responses for fresh start
    localStorage.removeItem("research-responses");
    window.location.href = "/";
  };

  return (
    <XPToastProvider>
      <div className="flex min-h-screen flex-col bg-off-white">
        {/* Navigation */}
        <HomepageNavigation />

        {/* Main Content */}
        <main className="flex flex-1 items-center justify-center px-4 py-xl">
          <div className="w-full max-w-2xl text-center">
            {/* Success Message */}
            <div className="mb-xl">
              <h1 className="mb-md text-6xl font-bold leading-none text-off-black md:text-8xl">
                Done!
              </h1>
              <p className="mb-lg text-xl font-medium leading-tight text-primary md:text-2xl">
                Thanks for shaping the project
              </p>
            </div>

            {/* XP Breakdown */}
            <div className="mb-xl">
              <div className="border-2 border-primary bg-off-white p-lg">
                <h3 className="mb-md font-mono text-sm font-semibold uppercase tracking-wide text-primary">
                  XP Breakdown {xpBreakdown.isEstimated && "(Estimated)"}
                  {!xpBreakdown.isProcessingComplete && (
                    <span className="ml-sm text-xs text-warm-gray">Calculating...</span>
                  )}
                </h3>

                {statsLoading || votesLoading || xpLoading ? (
                  <div className="space-y-sm">
                    <div className="h-4 w-full animate-pulse bg-light-gray"></div>
                    <div className="h-4 w-3/4 animate-pulse bg-light-gray"></div>
                    <div className="h-4 w-1/2 animate-pulse bg-light-gray"></div>
                  </div>
                ) : (
                  <div className="space-y-sm">
                    <div className="flex justify-between">
                      <span className="font-mono text-sm text-warm-gray">
                        {xpBreakdown.questionsAnswered} questions × {xpBreakdown.baseXpPerQuestion}{" "}
                        XP
                      </span>
                      <span className="font-mono text-sm font-bold text-off-black">
                        {xpBreakdown.questionXP}
                      </span>
                    </div>

                    {xpBreakdown.streakBonus > 0 && (
                      <div className="flex justify-between">
                        <span className="font-mono text-sm text-warm-gray">Streak bonus</span>
                        <span className="font-mono text-sm font-bold text-off-black">
                          {xpBreakdown.streakBonus}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="font-mono text-sm text-warm-gray">Engagement bonus</span>
                      <span className="font-mono text-sm font-bold text-off-black">
                        {xpBreakdown.engagementBonus}
                      </span>
                    </div>

                    <div className="border-t border-light-gray pt-sm">
                      <div className="flex justify-between">
                        <span className="font-mono text-base font-bold text-off-black">
                          Total XP
                        </span>
                        <span className="font-mono text-xl font-bold text-primary">
                          +{xpBreakdown.totalEarnedXP}
                        </span>
                      </div>
                    </div>

                    {/* Progress to next level */}
                    <div className="mt-md">
                      <div className="mb-xs flex justify-between">
                        <span className="font-mono text-xs text-warm-gray">Level Progress</span>
                        <span className="font-mono text-xs text-warm-gray">
                          {xpBreakdown.totalEarnedXP}/100 XP
                        </span>
                      </div>
                      <div className="h-2 w-full bg-light-gray">
                        <div
                          className="h-2 bg-primary transition-all duration-300"
                          style={{
                            width: `${Math.min((xpBreakdown.totalEarnedXP / 100) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Your Responses */}
            <div className="mb-xl">
              <button
                onClick={() => setShowResponses(!showResponses)}
                className="w-full border border-light-gray bg-off-white p-md font-mono text-sm font-medium text-off-black transition-all duration-100 hover:border-primary"
              >
                {showResponses ? "▼" : "▶"} Your Responses
              </button>

              {showResponses && (
                <div className="mt-md space-y-md border border-light-gray bg-off-white p-md">
                  {votesLoading ? (
                    <div className="space-y-md">
                      <div className="h-16 w-full animate-pulse bg-light-gray"></div>
                      <div className="h-16 w-full animate-pulse bg-light-gray"></div>
                    </div>
                  ) : (
                    <>
                      {researchVotes.length > 0
                        ? researchVotes.map((vote, index) => (
                            <div
                              key={vote.id}
                              className="border-b border-light-gray pb-sm last:border-b-0"
                            >
                              <div className="font-mono text-xs font-semibold uppercase tracking-wide text-primary">
                                Question {index + 1}
                              </div>
                              <div className="mb-xs text-sm font-medium text-off-black">
                                {vote.questionTitle}
                              </div>
                              <div className="font-mono text-sm text-primary">
                                → {vote.response as string}
                              </div>
                              <div className="mt-xs font-mono text-xs text-warm-gray">
                                {new Date(vote.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))
                        : // Fallback to localStorage data if no database votes found
                          questions.map((question, index) => {
                            const responseId = userResponses[question.id];
                            const optionLabels = question.questionData?.optionLabels || {};
                            const responseText = responseId
                              ? optionLabels[responseId] || responseId
                              : "No response";

                            return (
                              <div
                                key={question.id}
                                className="border-b border-light-gray pb-sm last:border-b-0"
                              >
                                <div className="font-mono text-xs font-semibold uppercase tracking-wide text-primary">
                                  Question {index + 1} (Local)
                                </div>
                                <div className="mb-xs text-sm font-medium text-off-black">
                                  {question.title}
                                </div>
                                <div className="font-mono text-sm text-primary">
                                  → {responseText}
                                </div>
                              </div>
                            );
                          })}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mx-auto mb-xl max-w-md">
              <div className="grid grid-cols-2 gap-sm">
                {/* Take Another Quiz Button */}
                <button
                  onClick={handleTakeAnotherQuiz}
                  className="flex items-center justify-center border-2 border-primary bg-primary p-lg font-semibold text-off-white transition-all duration-100 hover:bg-off-black"
                >
                  Take Another Quiz
                </button>

                {/* Share Results Button */}
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-sm border-2 border-primary bg-off-white p-lg font-semibold text-primary transition-all duration-100 hover:bg-primary hover:text-off-white"
                >
                  <Share className="size-4" />
                  Share Results
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Newsletter Signup */}
        <NewsletterSignup />

        {/* Footer */}
        <HomepageFooter />
      </div>
    </XPToastProvider>
  );
}
