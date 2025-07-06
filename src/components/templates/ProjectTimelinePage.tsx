"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useProjectTimeline } from "@/hooks/useProjectTimeline";
import { LucideIcon } from "@/components/ui/Icon";
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

  if (isLoading) {
    return (
      <div className={cn("container mx-auto px-4 py-16", className)}>
        <div className="max-w-4xl">
          <div className="space-y-8">
            <div className="animate-pulse">
              <div className="mb-4 h-16 rounded bg-light-gray dark:bg-warm-gray/20" />
              <div className="h-4 w-1/3 rounded bg-light-gray dark:bg-warm-gray/20" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex animate-pulse gap-6">
                <div className="size-12 rounded-full bg-light-gray dark:bg-warm-gray/20" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-3/4 rounded bg-light-gray dark:bg-warm-gray/20" />
                  <div className="h-4 w-1/2 rounded bg-light-gray dark:bg-warm-gray/20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("container mx-auto px-4 py-16", className)}>
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 rounded-lg bg-light-gray p-8 dark:bg-warm-gray/20">
            <AlertCircle className="size-8 text-primary" />
            <div>
              <h2 className="mb-2 text-xl font-bold text-off-black dark:text-off-white">
                FAILED TO LOAD TIMELINE
              </h2>
              <p className="text-warm-gray">
                Unable to fetch project timeline data. Check connection and try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      return "bg-primary text-off-white";
    }
    if (status === "in_progress") {
      return "bg-off-black dark:bg-off-white text-off-white dark:text-off-black";
    }
    return "bg-light-gray dark:bg-warm-gray/30 text-warm-gray";
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
      completed: "bg-primary text-off-white",
      in_progress: "bg-off-black dark:bg-off-white text-off-white dark:text-off-black",
      upcoming: "bg-light-gray dark:bg-warm-gray/30 text-warm-gray",
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
    <div className={cn("container mx-auto px-4 py-16", className)}>
      <div className="max-w-4xl">
        {/* Brutalist Header */}
        <div className="mb-16">
          <h1 className="mb-6 text-hero font-bold uppercase tracking-tight text-off-black dark:text-off-white">
            PROJECT
            <br />
            TIMELINE
          </h1>

          {/* Progress Stats */}
          {progress && (
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="border-2 border-off-black bg-off-white p-6 dark:border-off-white dark:bg-off-black">
                <div className="mb-2 text-3xl font-bold text-off-black dark:text-off-white">
                  {progress.overallPercentage}%
                </div>
                <div className="text-sm font-bold uppercase tracking-wider text-warm-gray">
                  COMPLETE
                </div>
              </div>

              <div className="border-2 border-off-black bg-off-white p-6 dark:border-off-white dark:bg-off-black">
                <div className="mb-2 text-3xl font-bold text-off-black dark:text-off-white">
                  {progress.completedTasks}/{progress.totalTasks}
                </div>
                <div className="text-sm font-bold uppercase tracking-wider text-warm-gray">
                  TASKS
                </div>
              </div>

              <div className="border-2 border-off-black bg-off-white p-6 dark:border-off-white dark:bg-off-black">
                <div className="mb-2 text-xl font-bold text-off-black dark:text-off-white">
                  {progress.currentPhase}
                </div>
                <div className="text-sm font-bold uppercase tracking-wider text-warm-gray">
                  CURRENT
                </div>
              </div>
            </div>
          )}

          {/* Timeline Stats */}
          {timelineStats && (
            <div className="font-mono text-sm text-warm-gray">
              {timelineStats.completed} COMPLETED • {timelineStats.inProgress} IN PROGRESS •{" "}
              {timelineStats.upcoming} PLANNED
            </div>
          )}
        </div>

        {/* Timeline Events */}
        <div className="space-y-12">
          {timelineEvents.map((event, index) => {
            const EventIcon = getEventIcon(event.type, event.status);
            const isLast = index === timelineEvents.length - 1;

            return (
              <div key={event.id} className="relative">
                {/* Connector Line */}
                {!isLast && (
                  <div className="absolute bottom-0 left-6 top-16 w-0.5 bg-light-gray dark:bg-warm-gray/30" />
                )}

                <div className="flex gap-8">
                  {/* Icon */}
                  <div
                    className={cn(
                      "relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border-2",
                      getEventColor(event.type, event.status),
                      "border-off-black dark:border-off-white"
                    )}
                  >
                    <LucideIcon icon={EventIcon} size="sm" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    {/* Header */}
                    <div className="mb-4 flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="mb-2 text-xl font-bold text-off-black dark:text-off-white">
                          {event.title}
                        </h3>
                        <p className="leading-relaxed text-warm-gray">{event.description}</p>
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
                    {event.status === "in_progress" && event.completionPercentage !== undefined && (
                      <div className="mb-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-bold uppercase tracking-wider text-warm-gray">
                            PROGRESS
                          </span>
                          <span className="font-mono text-sm text-warm-gray">
                            {Math.round(event.completionPercentage)}%
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden bg-light-gray dark:bg-warm-gray/30">
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
                        <span className="bg-light-gray px-3 py-1 text-xs font-bold uppercase tracking-wider text-warm-gray dark:bg-warm-gray/20">
                          {event.category}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-16 bg-light-gray p-6 dark:bg-warm-gray/20">
          <p className="font-mono text-sm text-warm-gray">
            BUILDING IN PUBLIC • REAL-TIME UPDATES • COMMUNITY DRIVEN
          </p>
          {timelineStats?.nextMilestone && (
            <p className="mt-2 text-sm text-warm-gray">
              Next milestone: <span className="font-bold">{timelineStats.nextMilestone.title}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
