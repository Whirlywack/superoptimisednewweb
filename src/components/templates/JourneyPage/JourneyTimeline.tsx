"use client";

import React, { useState, useContext } from "react";
import { cn } from "@/lib/utils";
import { XPToastContext } from "../Homepage/XPToastProvider";
import { JourneyPostsTimeline } from "./JourneyPostsTimeline";
import { MessageCircle, Repeat2, Heart } from "lucide-react";
import { useProjectTimeline } from "@/hooks/useProjectTimeline";

export function JourneyTimeline() {
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
  const { showXPToast } = useContext(XPToastContext);
  const { data: timelineData } = useProjectTimeline();

  const handlePollVote = (option: string) => {
    setSelectedPoll(option);
    showXPToast("poll");

    // Auto-refresh poll after vote (simulated)
    setTimeout(() => {
      setSelectedPoll(null);
    }, 2000);
  };

  return (
    <section className="w-full px-4 py-2xl">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6">
        {/* Timeline Header */}
        <div className="col-span-12 mb-2xl text-center">
          <h2 className="mb-md text-xl font-semibold text-off-black">Building Timeline</h2>
          <p className="text-base text-warm-gray">
            Every decision documented. Community influence tracked. Lessons shared transparently.
          </p>
        </div>

        {/* Timeline Content - Left 8 columns */}
        <div className="col-span-12 md:col-span-8">
          <JourneyPostsTimeline showUpcoming={true} maxItems={50} className="bg-transparent" />

          {/* Content Strategy Poll */}
          <div className="mt-2xl rounded-lg border-2 border-light-gray bg-off-white p-lg transition-all duration-200">
            <div className="mb-md text-lg font-semibold text-off-black">
              What type of content would be most valuable next?
            </div>
            <div className="mb-md flex flex-wrap gap-sm">
              <button
                onClick={() => handlePollVote("technical")}
                className={cn(
                  "flex-1 rounded px-md py-sm text-center text-sm font-medium transition-all duration-200",
                  selectedPoll === "technical"
                    ? "border-2 border-primary bg-primary text-off-white"
                    : "border-2 border-light-gray bg-light-gray hover:border-primary hover:bg-off-white"
                )}
              >
                Technical Deep-Dives
              </button>
              <button
                onClick={() => handlePollVote("decisions")}
                className={cn(
                  "flex-1 rounded px-md py-sm text-center text-sm font-medium transition-all duration-200",
                  selectedPoll === "decisions"
                    ? "border-2 border-primary bg-primary text-off-white"
                    : "border-2 border-light-gray bg-light-gray hover:border-primary hover:bg-off-white"
                )}
              >
                Decision Breakdowns
              </button>
              <button
                onClick={() => handlePollVote("lessons")}
                className={cn(
                  "flex-1 rounded px-md py-sm text-center text-sm font-medium transition-all duration-200",
                  selectedPoll === "lessons"
                    ? "border-2 border-primary bg-primary text-off-white"
                    : "border-2 border-light-gray bg-light-gray hover:border-primary hover:bg-off-white"
                )}
              >
                Weekly Lessons
              </button>
            </div>
            <div className="text-center text-sm text-warm-gray">
              <span className="font-mono">Shape upcoming content</span> •
              <a href="https://x.com/superoptimised" className="ml-1 text-primary hover:underline">
                Suggest on X
              </a>
            </div>
          </div>
        </div>

        {/* Timeline Sidebar - Right 4 columns */}
        <div className="col-span-12 md:col-span-4">
          <div className="sticky top-lg space-y-lg">
            {/* Journey Stats */}
            <div className="rounded-lg border-2 border-light-gray bg-off-white p-lg">
              <h3 className="mb-md text-lg font-semibold text-off-black">Journey Stats</h3>
              <div className="space-y-sm">
                {timelineData ? (
                  [
                    {
                      label: "Days Building",
                      value: Math.ceil(
                        (new Date().getTime() - new Date("2024-11-15").getTime()) /
                          (1000 * 60 * 60 * 24)
                      ).toString(),
                    },
                    {
                      label: "Journey Posts",
                      value: "3", // This will be dynamic based on actual blog posts
                    },
                    {
                      label: "Phases Complete",
                      value: timelineData.events
                        .filter((e) => e.type === "phase" && e.status === "completed")
                        .length.toString(),
                    },
                    {
                      label: "Community Votes",
                      value: "247", // This would come from voting system
                    },
                    {
                      label: "Project Complete",
                      value: `${timelineData.progress.overallPercentage}%`,
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-light-gray py-xs last:border-b-0"
                    >
                      <span className="text-sm text-warm-gray">{stat.label}</span>
                      <span className="font-mono text-sm font-semibold text-primary">
                        {stat.value}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-warm-gray">Loading stats...</div>
                )}
              </div>
            </div>

            {/* Recent X Activity */}
            <div className="rounded-lg border-2 border-light-gray bg-off-white p-lg">
              <h3 className="mb-md text-lg font-semibold text-off-black">Live from X</h3>
              <div className="rounded-lg border-2 border-light-gray bg-light-gray p-lg">
                {/* X Header */}
                <div className="mb-md flex items-center gap-sm">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-off-white">
                    SO
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-off-black">Superoptimised</div>
                    <div className="font-mono text-xs text-warm-gray">@superoptimised</div>
                  </div>
                </div>

                {/* X Content */}
                <div className="mb-md text-base leading-relaxed text-off-black">
                  Building in public means documenting every decision, sharing every challenge, and
                  letting community feedback guide the direction. Each phase brings new lessons and
                  deeper community connections.
                </div>

                {/* X Stats */}
                <div className="flex gap-lg font-mono text-sm text-warm-gray">
                  <div className="flex items-center gap-1">
                    <Repeat2 className="size-4" />
                    <span>12</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="size-4" />
                    <span>28</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="size-4" />
                    <span>7</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
