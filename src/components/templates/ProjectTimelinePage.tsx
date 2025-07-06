"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useProjectTimeline } from "@/hooks/useProjectTimeline";
import { LucideIcon } from "@/components/ui/Icon";
import { HomepageNavigation } from "./Homepage/HomepageNavigation";
import { HomepageFooter } from "./Homepage/HomepageFooter";
import { XPToastProvider } from "./Homepage/XPToastProvider";
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Code,
  Zap,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

interface ProjectTimelinePageProps {
  className?: string;
}

export function ProjectTimelinePage({ className }: ProjectTimelinePageProps) {
  const { timelineEvents, timelineStats, progress, isLoading, error } = useProjectTimeline();

  const loadingContent = (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="mb-4 h-16 rounded bg-light-gray" />
          <div className="h-4 w-1/3 rounded bg-light-gray" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex animate-pulse gap-6">
            <div className="size-12 rounded-full bg-light-gray" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-3/4 rounded bg-light-gray" />
              <div className="h-4 w-1/2 rounded bg-light-gray" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const errorContent = (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex items-center gap-4 rounded-lg bg-light-gray p-8">
        <AlertCircle className="size-8 text-primary" />
        <div>
          <h2 className="mb-2 text-xl font-bold text-off-black">FAILED TO LOAD TIMELINE</h2>
          <p className="text-warm-gray">
            Unable to fetch project timeline data. Check connection and try again.
          </p>
        </div>
      </div>
    </div>
  );

  const getEventIcon = (type: string, status: string) => {
    if (status === "completed") return CheckCircle2;
    if (status === "in_progress") return Clock;

    switch (type) {
      case "phase":
        return Code;
      case "milestone":
        return Zap;
      case "community":
        return Users;
      case "feature":
        return TrendingUp;
      default:
        return Circle;
    }
  };

  const getEventColor = (type: string, status: string) => {
    if (status === "completed") {
      return "bg-primary text-white";
    }
    if (status === "in_progress") {
      return "bg-off-black text-white";
    }
    return "bg-light-gray text-warm-gray";
  };

  const formatDate = (date: Date | null, isEstimated = false) => {
    if (!date) return "TBD";

    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return isEstimated ? `~${formatted}` : formatted;
  };

  const renderStatusBadge = (status: string) => {
    const badges = {
      completed: "DONE",
      in_progress: "BUILDING",
      upcoming: "PLANNED",
    };

    const colors = {
      completed: "bg-primary text-white",
      in_progress: "bg-off-black text-white",
      upcoming: "bg-light-gray text-warm-gray",
    };

    return (
      <span
        className={cn(
          "px-3 py-1 text-xs font-bold uppercase tracking-wider",
          colors[status as keyof typeof colors]
        )}
      >
        {badges[status as keyof typeof badges]}
      </span>
    );
  };

  return (
    <XPToastProvider>
      <div className={cn("flex min-h-screen flex-col bg-off-white", className)}>
        {/* Navigation */}
        <HomepageNavigation />

        {/* Main Content */}
        <main className="flex-1">
          {isLoading && loadingContent}
          {error && errorContent}
          {!isLoading && !error && (
            <section className="w-full px-4 py-2xl">
              <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-12 gap-6">
                  {/* Hero Content - Main */}
                  <div className="col-span-12 md:col-span-8">
                    <div className="mb-sm font-mono text-sm font-semibold uppercase tracking-wide text-primary">
                      BUILDING IN PUBLIC
                    </div>
                    <h1 className="mb-8 text-hero font-bold leading-[1.1] text-off-black">
                      PROJECT
                      <br />
                      TIMELINE
                    </h1>
                    <p className="mb-12 max-w-prose text-lg leading-relaxed text-warm-gray">
                      Follow our transparent development journey with real-time progress tracking,
                      milestone achievements, and community-driven feature development. Every
                      decision documented, every milestone tracked with the community.
                    </p>

                    {/* Inline Stats - No White Space */}
                    <div className="mb-12 flex gap-12 rounded-lg border-l-4 border-primary bg-primary/[0.05] p-8">
                      <div className="flex min-w-[80px] flex-col items-center">
                        <div className="font-mono text-lg font-extrabold text-primary">
                          {progress?.overallPercentage || 42}%
                        </div>
                        <div className="mt-2 text-center text-xs text-warm-gray">Complete</div>
                      </div>
                      <div className="flex min-w-[80px] flex-col items-center">
                        <div className="font-mono text-lg font-extrabold text-primary">
                          {progress?.completedTasks || 18}/{progress?.totalTasks || 43}
                        </div>
                        <div className="mt-2 text-center text-xs text-warm-gray">Tasks</div>
                      </div>
                      <div className="flex min-w-[80px] flex-col items-center">
                        <div className="font-mono text-lg font-extrabold text-primary">
                          {timelineStats?.completed || 5}
                        </div>
                        <div className="mt-2 text-center text-xs text-warm-gray">Phases Done</div>
                      </div>
                      <div className="flex min-w-[80px] flex-col items-center">
                        <div className="font-mono text-lg font-extrabold text-primary">∞</div>
                        <div className="mt-2 text-center text-xs text-warm-gray">To Learn</div>
                      </div>
                    </div>

                    {/* Quick Poll for Timeline */}
                    <div className="mb-12 rounded-lg border-2 border-light-gray bg-white p-6">
                      <div className="mb-4 font-semibold text-off-black">
                        Quick input: What&apos;s most valuable in a project timeline?
                      </div>
                      <div className="mb-4 flex gap-3">
                        <button className="flex-1 rounded border-2 border-light-gray bg-light-gray px-4 py-2 text-center text-sm font-medium transition-all hover:border-primary hover:bg-white">
                          Progress Tracking
                        </button>
                        <button className="flex-1 rounded border-2 border-light-gray bg-light-gray px-4 py-2 text-center text-sm font-medium transition-all hover:border-primary hover:bg-white">
                          Real Dates
                        </button>
                      </div>
                      <div className="text-center text-xs text-warm-gray">
                        <span className="font-mono">Help shape future updates</span> •
                        <a
                          href="https://x.com/superoptimised"
                          className="font-medium text-primary hover:underline"
                        >
                          Discuss on X
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Hero Sidebar */}
                  <div className="col-span-12 md:col-span-4">
                    {/* Newsletter CTA */}
                    <div className="mb-8 rounded-lg border-2 border-primary bg-white p-8 text-center">
                      <h3 className="mb-4 text-lg font-bold text-off-black">
                        Follow Every Milestone
                      </h3>
                      <p className="mb-6 text-sm text-warm-gray">
                        Get updates when we reach major milestones. Be among the first to see how
                        community feedback shapes the timeline.
                      </p>
                      <div className="flex flex-col gap-3">
                        <input
                          type="email"
                          placeholder="your@email.com"
                          className="w-full rounded border-2 border-light-gray px-4 py-2 text-base focus:border-primary focus:outline-none"
                        />
                        <button className="w-full rounded bg-primary py-2 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-off-black">
                          Track Progress
                        </button>
                      </div>
                    </div>

                    {/* Live Metrics */}
                    <div className="mb-6 rounded-lg bg-primary/[0.05] p-4 text-center">
                      <div className="font-mono text-xl font-extrabold text-primary">
                        {timelineStats?.inProgress || 2}
                      </div>
                      <div className="text-xs text-warm-gray">Phases In Progress</div>
                    </div>

                    <div className="rounded-lg bg-primary/[0.05] p-4 text-center">
                      <div className="font-mono text-xl font-extrabold text-primary">
                        {timelineStats?.upcoming || 8}
                      </div>
                      <div className="text-xs text-warm-gray">Upcoming Milestones</div>
                    </div>
                  </div>
                </div>

                {/* Timeline Events */}
                <div className="mt-16 space-y-12">
                  {timelineEvents?.map((event, index) => {
                    const EventIcon = getEventIcon(event.type, event.status);
                    const isLast = index === timelineEvents.length - 1;

                    return (
                      <div key={event.id} className="relative">
                        {/* Connector Line */}
                        {!isLast && (
                          <div className="absolute bottom-0 left-12 top-24 w-0.5 bg-light-gray" />
                        )}

                        <div className="rounded-lg border-2 border-light-gray bg-white p-6 transition-all hover:border-primary hover:shadow-lg">
                          <div className="flex gap-6">
                            {/* Icon */}
                            <div
                              className={cn(
                                "relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-off-black",
                                getEventColor(event.type, event.status)
                              )}
                            >
                              <LucideIcon icon={EventIcon} size="sm" />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                              {/* Header */}
                              <div className="mb-4 flex items-start justify-between gap-6">
                                <div className="flex-1">
                                  <h3 className="mb-2 text-xl font-bold text-off-black">
                                    {event.title}
                                  </h3>
                                  <p className="leading-relaxed text-warm-gray">
                                    {event.description}
                                  </p>
                                </div>

                                <div className="flex shrink-0 flex-col items-end gap-3 text-right">
                                  <div className="flex items-center gap-2 font-mono text-sm text-warm-gray">
                                    <Calendar className="size-4" />
                                    {formatDate(event.date, event.isEstimated)}
                                  </div>
                                  {renderStatusBadge(event.status)}
                                </div>
                              </div>

                              {/* Progress Bar for In-Progress Items */}
                              {event.status === "in_progress" &&
                                event.completionPercentage !== undefined && (
                                  <div className="mb-4">
                                    <div className="mb-2 flex items-center justify-between">
                                      <span className="text-sm font-bold uppercase tracking-wider text-warm-gray">
                                        PROGRESS
                                      </span>
                                      <span className="font-mono text-sm text-warm-gray">
                                        {Math.round(event.completionPercentage)}%
                                      </span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden bg-light-gray">
                                      <div
                                        className="h-full bg-primary transition-all duration-500"
                                        style={{ width: `${event.completionPercentage}%` }}
                                      />
                                    </div>
                                  </div>
                                )}

                              {/* Category Tag */}
                              {event.category && (
                                <div className="inline-block">
                                  <span className="bg-light-gray px-3 py-1 text-xs font-bold uppercase tracking-wider text-warm-gray">
                                    {event.category}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer Note */}
                <div className="mt-16 border-l-4 border-primary bg-primary/[0.05] p-6">
                  <p className="font-mono text-sm text-warm-gray">
                    BUILDING IN PUBLIC • REAL-TIME UPDATES • COMMUNITY DRIVEN
                  </p>
                  {timelineStats?.nextMilestone && (
                    <p className="mt-2 text-sm text-warm-gray">
                      Next milestone:{" "}
                      <span className="font-bold">{timelineStats.nextMilestone.title}</span>
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <HomepageFooter />
      </div>
    </XPToastProvider>
  );
}
