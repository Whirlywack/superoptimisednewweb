import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Tag";
import { CheckCircle2, Circle, Clock, Calendar, Code, Zap, Users, TrendingUp } from "lucide-react";
import type { ProjectProgress } from "@/lib/milestone-tracker";

interface ProjectTimelineEvent {
  id: string;
  title: string;
  description: string;
  date: Date | null;
  type: "phase" | "milestone" | "feature" | "community";
  status: "completed" | "in_progress" | "upcoming";
  completionPercentage?: number;
  category?: string;
  isEstimated?: boolean;
}

interface ProjectTimelineProps extends React.HTMLAttributes<HTMLElement> {
  progress: ProjectProgress;
  showUpcoming?: boolean;
  showEstimates?: boolean;
  variant?: "default" | "compact";
  maxEvents?: number;
  className?: string;
}

export function ProjectTimeline({
  progress,
  showUpcoming = true,
  showEstimates = false,
  variant = "default",
  maxEvents,
  className,
  ...props
}: ProjectTimelineProps) {
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
      return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
    }
    if (status === "in_progress") {
      return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
    }

    switch (type) {
      case "phase":
        return "text-primary bg-primary/10";
      case "milestone":
        return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20";
      case "community":
        return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20";
      case "feature":
        return "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20";
      default:
        return "text-warm-gray bg-light-gray dark:bg-warm-gray/20";
    }
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

  const generateEstimatedDate = (daysFromNow: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date;
  };

  const generateTimelineEvents = (): ProjectTimelineEvent[] => {
    const events: ProjectTimelineEvent[] = [];

    // Add completed phases (hardcoded dates for now - would come from database)
    events.push(
      {
        id: "phase-1",
        title: "Phase 1: Core tRPC API Foundation",
        description: "Database schema, tRPC setup, and basic voting infrastructure",
        date: new Date("2024-11-15"),
        type: "phase",
        status: "completed",
        completionPercentage: 100,
        category: "Backend",
      },
      {
        id: "phase-2",
        title: "Phase 2: Real-time Updates & WebSocket Integration",
        description: "Live vote statistics and real-time engagement tracking",
        date: new Date("2024-11-22"),
        type: "phase",
        status: "completed",
        completionPercentage: 100,
        category: "Backend",
      },
      {
        id: "phase-3",
        title: "Phase 3: Frontend Integration & localStorage Migration",
        description: "React Query integration and optimistic updates",
        date: new Date("2024-11-30"),
        type: "phase",
        status: "completed",
        completionPercentage: 100,
        category: "Frontend",
      },
      {
        id: "phase-4",
        title: "Phase 4: XP System & Engagement Tracking",
        description: "Gamification features and user progression tracking",
        date: new Date("2024-12-07"),
        type: "phase",
        status: "completed",
        completionPercentage: 100,
        category: "Features",
      },
      {
        id: "phase-5",
        title: "Phase 5: Content Management System",
        description: "Dynamic content blocks and project progress tracking",
        date: new Date("2024-12-15"),
        type: "phase",
        status: "in_progress",
        completionPercentage: 87.5, // 7/8 tasks completed
        category: "CMS",
      }
    );

    // Add milestone events from the progress data
    progress.milestones.forEach((milestone) => {
      events.push({
        id: milestone.id,
        title: milestone.title,
        description: milestone.description,
        date: milestone.completedAt || null,
        type: "milestone",
        status: milestone.isCompleted
          ? "completed"
          : milestone.completionPercentage > 0
            ? "in_progress"
            : "upcoming",
        completionPercentage: milestone.completionPercentage,
        category: milestone.category,
      });
    });

    // Add upcoming phases with estimated dates
    if (showUpcoming) {
      const upcomingPhases = [
        {
          id: "phase-6",
          title: "Phase 6: Advanced Question Types",
          description: "Multi-choice, rating, and ranking question support",
          daysFromNow: 14,
          category: "Features",
        },
        {
          id: "phase-7",
          title: "Phase 7: Newsletter System Integration",
          description: "Email campaigns and subscriber management",
          daysFromNow: 28,
          category: "Marketing",
        },
        {
          id: "phase-8",
          title: "Phase 8: Admin Dashboard",
          description: "Content management and analytics interface",
          daysFromNow: 42,
          category: "Admin",
        },
      ];

      upcomingPhases.forEach((phase) => {
        events.push({
          id: phase.id,
          title: phase.title,
          description: phase.description,
          date: showEstimates ? generateEstimatedDate(phase.daysFromNow) : null,
          type: "phase",
          status: "upcoming",
          category: phase.category,
          isEstimated: showEstimates,
        });
      });
    }

    // Sort by date (completed first, then upcoming)
    return events
      .sort((a, b) => {
        if (a.status === "completed" && b.status !== "completed") return -1;
        if (b.status === "completed" && a.status !== "completed") return 1;
        if (a.status === "in_progress" && b.status === "upcoming") return -1;
        if (b.status === "in_progress" && a.status === "upcoming") return 1;

        if (a.date && b.date) {
          return a.date.getTime() - b.date.getTime();
        }
        if (a.date && !b.date) return -1;
        if (!a.date && b.date) return 1;
        return 0;
      })
      .slice(0, maxEvents);
  };

  const events = generateTimelineEvents();

  const renderEvent = (event: ProjectTimelineEvent, index: number, isLast: boolean) => {
    const EventIcon = getEventIcon(event.type, event.status);

    return (
      <div key={event.id} className={cn("relative flex gap-4", !isLast && "pb-6")}>
        {/* Connector Line */}
        {!isLast && (
          <div className="absolute bottom-0 left-5 top-10 w-0.5 bg-light-gray dark:bg-warm-gray/30" />
        )}

        {/* Icon */}
        <div
          className={cn(
            "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full",
            getEventColor(event.type, event.status)
          )}
        >
          <LucideIcon icon={EventIcon} size="sm" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-4">
              <h3
                className={cn(
                  "font-semibold text-off-black dark:text-off-white",
                  variant === "compact" ? "text-base" : "text-lg"
                )}
              >
                {event.title}
              </h3>

              <div className="flex shrink-0 items-center gap-2 text-sm text-warm-gray">
                <LucideIcon icon={Calendar} size="xs" />
                <time dateTime={event.date?.toISOString()}>
                  {formatDate(event.date, event.isEstimated)}
                </time>
              </div>
            </div>

            {/* Description */}
            {variant !== "compact" && <p className="text-sm text-warm-gray">{event.description}</p>}
          </div>

          {/* Progress & Meta */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Progress bar for in-progress items */}
              {event.status === "in_progress" && event.completionPercentage !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-light-gray dark:bg-warm-gray/30">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${event.completionPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-warm-gray">
                    {Math.round(event.completionPercentage)}%
                  </span>
                </div>
              )}

              {/* Category tag */}
              {event.category && (
                <Tag size="xs" variant="secondary">
                  {event.category}
                </Tag>
              )}
            </div>

            {/* Status indicator */}
            <div
              className={cn(
                "rounded-full px-2 py-1 text-xs font-medium capitalize",
                event.status === "completed" &&
                  "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
                event.status === "in_progress" &&
                  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                event.status === "upcoming" && "bg-warm-gray/20 text-warm-gray"
              )}
            >
              {event.status.replace("_", " ")}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-off-black dark:text-off-white">Project Timeline</h2>
        <div className="flex items-center gap-4 text-sm text-warm-gray">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-primary" />
            <span>Overall Progress: {progress.overallPercentage}%</span>
          </div>
          <div className="flex items-center gap-2">
            <LucideIcon icon={TrendingUp} size="xs" />
            <span>{progress.currentPhase}</span>
          </div>
        </div>
      </div>

      {/* Timeline Events */}
      <div className="space-y-0">
        {events.map((event, index) => renderEvent(event, index, index === events.length - 1))}
      </div>

      {/* Footer */}
      {events.length === 0 && (
        <div className="py-8 text-center text-warm-gray">
          <p>No timeline events available.</p>
        </div>
      )}

      {/* Legend */}
      {showEstimates && (
        <div className="text-xs italic text-warm-gray">
          ~ indicates estimated dates based on current progress
        </div>
      )}
    </div>
  );
}
