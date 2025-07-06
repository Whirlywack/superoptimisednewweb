"use client";

import React from "react";
import Link from "next/link";
import { Twitter, MessageCircle, BarChart3, Users, Calendar, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCommunityStats } from "@/hooks/useCommunityStats";

export function CommunityProof() {
  const { stats, isLoading, isError } = useCommunityStats();

  // Fallback stats for loading/error states
  const fallbackStats = [
    {
      icon: BarChart3,
      value: "17",
      label: "Total Votes",
      description: "Community decisions made",
    },
    {
      icon: Users,
      value: "3",
      label: "Unique Voters",
      description: "Community members engaged",
    },
    {
      icon: MessageCircle,
      value: "4",
      label: "Active Questions",
      description: "Current voting opportunities",
    },
    {
      icon: Calendar,
      value: "1",
      label: "Days Building",
      description: "Transparent development time",
    },
  ];

  // Use real stats when available
  const displayStats = stats
    ? [
        {
          icon: BarChart3,
          value: stats.totalVotes.toLocaleString(),
          label: "Total Votes",
          description: "Community decisions made",
        },
        {
          icon: Users,
          value: stats.uniqueVoters.toLocaleString(),
          label: "Unique Voters",
          description: "Community members engaged",
        },
        {
          icon: MessageCircle,
          value: stats.activeQuestions.toLocaleString(),
          label: "Active Questions",
          description: "Current voting opportunities",
        },
        {
          icon: Calendar,
          value: Math.ceil(
            (Date.now() - new Date("2024-01-01").getTime()) / (1000 * 60 * 60 * 24)
          ).toLocaleString(),
          label: "Days Building",
          description: "Transparent development time",
        },
      ]
    : fallbackStats;

  return (
    <section className="w-full px-4 py-24" aria-labelledby="community-heading">
      <div className="mx-auto max-w-6xl">
        {/* Section Title - Centered, slightly bigger heading */}
        <h2 id="community-heading" className="mb-2xl text-center text-xl font-bold text-off-black">
          Community Input Shapes Every Decision
        </h2>

        {/* Twitter Example - Full width block above stats */}
        <div className="mb-2xl">
          <div className="w-full">
            <div className={cn("rounded-lg border-2 border-light-gray bg-white p-lg")}>
              {/* Tweet Header */}
              <div className="mb-4 flex items-start gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Twitter className="size-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-off-black">Superoptimised</div>
                  <div className="text-small text-warm-gray">@superoptimised</div>
                </div>
              </div>

              {/* Tweet Content */}
              <div className="mb-4">
                <p className="text-body leading-relaxed text-off-black">
                  Should I prioritize mobile-first design or desktop experience for the
                  questionnaire system? Mobile = better accessibility, Desktop = richer
                  interactions. Your thoughts?
                </p>
              </div>

              {/* Tweet Stats */}
              <div className="flex items-center gap-6 text-small text-warm-gray">
                <div className="flex items-center gap-1">
                  <span>📱</span>
                  <span className="font-medium">Mobile-first: 67%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>💻</span>
                  <span className="font-medium">Desktop: 33%</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 className="size-4" />
                  <span>15 votes</span>
                </div>
              </div>

              {/* View on X Link */}
              <div className="mt-4 border-t border-light-gray pt-4">
                <Link
                  href="https://x.com/superoptimised"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 text-small text-primary",
                    "transition-colors duration-200 hover:text-primary/80",
                    "rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  )}
                >
                  <Twitter className="size-4" />
                  View full conversation on X
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Community Stats Grid - Full width with light gray background */}
        <div className="w-full rounded-lg bg-primary/5 p-lg">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-warm-gray">Loading community stats...</span>
            </div>
          ) : isError ? (
            <div className="py-8 text-center">
              <p className="text-sm text-warm-gray">Using cached community stats</p>
            </div>
          ) : null}

          <div className="mb-md grid grid-cols-2 gap-md md:grid-cols-4">
            {displayStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className={cn(
                    "mb-2 font-mono text-xl font-bold text-primary",
                    isLoading && "animate-pulse"
                  )}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-warm-gray">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs italic leading-relaxed text-warm-gray">
            Real-time community input from X polls and website questionnaires shapes every technical
            decision.
          </p>
        </div>
      </div>
    </section>
  );
}
