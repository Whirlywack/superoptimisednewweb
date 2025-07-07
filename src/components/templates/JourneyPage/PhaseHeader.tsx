"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PhaseHeaderProps {
  phaseNumber: number;
  title: string;
  status: "completed" | "in_progress" | "upcoming";
  completionPercentage?: number;
  description?: string;
  completedDate?: Date;
  className?: string;
}

export function PhaseHeader({
  phaseNumber,
  title,
  status,
  completionPercentage = 0,
  description,
  completedDate,
  className,
}: PhaseHeaderProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusText = () => {
    switch (status) {
      case "completed":
        return "Complete";
      case "in_progress":
        return `${Math.round(completionPercentage)}% Complete`;
      case "upcoming":
        return "Upcoming";
      default:
        return "";
    }
  };

  return (
    <div className={cn("mb-lg", className)}>
      {/* Phase Header */}
      <div className="mb-md">
        <div className="mb-sm flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary">
            Phase {phaseNumber}: {title}
          </h2>

          {/* Status and Date */}
          <div className="flex items-center gap-md font-mono text-sm text-warm-gray">
            <span className="font-medium text-primary">{getStatusText()}</span>
            {completedDate && (
              <>
                <span>•</span>
                <time dateTime={completedDate.toISOString()}>{formatDate(completedDate)}</time>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar for In-Progress Phases */}
        {status === "in_progress" && (
          <div className="mb-sm">
            <div className="h-1 w-full overflow-hidden rounded-full bg-light-gray">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Description */}
        {description && <p className="max-w-prose text-base text-warm-gray">{description}</p>}
      </div>

      {/* Visual Separator */}
      <div className="mb-lg border-l-2 border-light-gray pl-lg">
        <div className="ml-[-2px] h-4 w-0.5 bg-primary" />
      </div>
    </div>
  );
}
