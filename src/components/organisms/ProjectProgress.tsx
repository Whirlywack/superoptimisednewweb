"use client";

import React from "react";
import { useProjectProgress } from "@/hooks/useProjectProgress";
import type { Milestone } from "@/lib/milestone-tracker";
import { RefreshCw, Target, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface MilestoneCardProps {
  milestone: Milestone;
}

function MilestoneCard({ milestone }: MilestoneCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "development":
        return "bg-blue-100 text-blue-800";
      case "community":
        return "bg-green-100 text-green-800";
      case "content":
        return "bg-purple-100 text-purple-800";
      case "features":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border-2 p-4 transition-all duration-200",
        milestone.isCompleted
          ? "border-green-200 bg-green-50"
          : "border-light-gray bg-white hover:border-primary/50"
      )}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          {milestone.isCompleted ? (
            <CheckCircle className="size-5 text-green-600" />
          ) : (
            <Clock className="size-5 text-warm-gray" />
          )}
          <span
            className={cn(
              "rounded-full px-2 py-1 text-xs font-medium uppercase tracking-wider",
              getCategoryColor(milestone.category)
            )}
          >
            {milestone.category}
          </span>
        </div>
        <div className="text-right">
          <div className="font-mono text-sm font-semibold text-primary">
            {milestone.currentValue}/{milestone.targetValue}
          </div>
          <div className="text-xs text-warm-gray">{milestone.completionPercentage}% complete</div>
        </div>
      </div>

      <h3 className="mb-2 font-semibold text-off-black">{milestone.title}</h3>
      <p className="mb-3 text-sm text-warm-gray">{milestone.description}</p>

      <div className="mb-2 h-2 w-full rounded-full bg-light-gray">
        <div
          className={cn(
            "h-2 rounded-full transition-all duration-500",
            milestone.isCompleted ? "bg-green-500" : "bg-primary"
          )}
          style={{ width: `${milestone.completionPercentage}%` }}
        />
      </div>

      {milestone.completedAt && (
        <div className="text-xs font-medium text-green-600">
          Completed: {milestone.completedAt.toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

interface ProjectProgressProps {
  className?: string;
  showMilestones?: boolean;
}

export function ProjectProgress({ className, showMilestones = true }: ProjectProgressProps) {
  const { progress, isLoading, refreshProgress, isRefreshing } = useProjectProgress();

  if (isLoading) {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="rounded-lg border-2 border-light-gray bg-white p-6">
          <div className="mb-4 h-4 rounded bg-light-gray"></div>
          <div className="mb-4 h-2 rounded bg-light-gray"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-3 rounded bg-light-gray"></div>
            <div className="h-3 rounded bg-light-gray"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div
        className={cn("rounded-lg border-2 border-light-gray bg-white p-6 text-center", className)}
      >
        <p className="text-warm-gray">Unable to load project progress</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Overall Progress */}
      <div className="mb-6 rounded-lg border-2 border-primary bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-off-black">Project Progress</h2>
          <button
            onClick={refreshProgress}
            disabled={isRefreshing}
            className={cn(
              "flex items-center gap-2 rounded-sm px-3 py-1 text-sm",
              "border border-light-gray bg-white text-warm-gray",
              "transition-colors hover:border-primary hover:text-primary",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
            Refresh
          </button>
        </div>

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-warm-gray">Overall Completion</span>
            <span className="font-mono text-lg font-bold text-primary">
              {progress.overallPercentage}%
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-light-gray">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-1000"
              style={{ width: `${progress.overallPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          <div>
            <div className="font-mono text-lg font-bold text-primary">
              {progress.completedTasks}
            </div>
            <div className="text-xs text-warm-gray">Tasks Done</div>
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-primary">{progress.totalTasks}</div>
            <div className="text-xs text-warm-gray">Total Tasks</div>
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-primary">{progress.currentPhase}</div>
            <div className="text-xs text-warm-gray">Current Phase</div>
          </div>
          <div>
            <div className="font-mono text-lg font-bold text-primary">
              {progress.milestones.filter((m) => m.isCompleted).length}
            </div>
            <div className="text-xs text-warm-gray">Milestones Hit</div>
          </div>
        </div>
      </div>

      {/* Next Milestone */}
      {progress.nextMilestone && (
        <div className="mb-6 rounded-lg border-2 border-primary/20 bg-primary/5 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-off-black">
            <Target className="size-5 text-primary" />
            Next Milestone
          </h3>
          <MilestoneCard milestone={progress.nextMilestone} />
        </div>
      )}

      {/* All Milestones */}
      {showMilestones && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-off-black">All Milestones</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {progress.milestones.map((milestone) => (
              <MilestoneCard key={milestone.id} milestone={milestone} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs text-warm-gray">
          Last updated: {progress.lastUpdated.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
