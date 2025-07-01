import React from "react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { H4, Paragraph, MonoText } from "@/components/ui/Typography";
import { LucideIcon } from "@/components/ui/Icon";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface ProjectProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  progress: number;
  status: "in-progress" | "completed" | "paused" | "planning";
  lastUpdated?: string;
  totalTasks?: number;
  completedTasks?: number;
  variant?: "card" | "inline";
  size?: "sm" | "md" | "lg";
  showMeta?: boolean;
  className?: string;
}

const statusConfig = {
  "in-progress": {
    icon: Clock,
    label: "In Progress",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  completed: {
    icon: CheckCircle,
    label: "Completed",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  paused: {
    icon: AlertCircle,
    label: "Paused",
    color: "text-warm-gray",
    bgColor: "bg-warm-gray/10",
  },
  planning: {
    icon: Clock,
    label: "Planning",
    color: "text-warm-gray",
    bgColor: "bg-warm-gray/10",
  },
};

export function ProjectProgress({
  title,
  description,
  progress,
  status,
  lastUpdated,
  totalTasks,
  completedTasks,
  variant = "card",
  size = "md",
  showMeta = true,
  className,
  ...props
}: ProjectProgressProps) {
  const config = statusConfig[status];
  const isCard = variant === "card";
  
  const sizeClasses = {
    sm: {
      container: isCard ? "p-4" : "",
      title: "text-base",
      spacing: "space-y-2",
    },
    md: {
      container: isCard ? "p-6" : "",
      title: "text-lg",
      spacing: "space-y-3",
    },
    lg: {
      container: isCard ? "p-8" : "",
      title: "text-xl",
      spacing: "space-y-4",
    },
  };

  const cardClasses = isCard ? cn(
    "bg-off-white dark:bg-off-black",
    "border border-light-gray dark:border-warm-gray/30",
    "rounded-lg"
  ) : "";

  return (
    <div
      className={cn(
        cardClasses,
        sizeClasses[size].container,
        sizeClasses[size].spacing,
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <H4 className={cn(sizeClasses[size].title, "mb-1")}>
            {title}
          </H4>
          
          {description && (
            <Paragraph variant="muted" className="text-sm">
              {description}
            </Paragraph>
          )}
        </div>

        {/* Status Badge */}
        <div className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full",
          config.bgColor
        )}>
          <LucideIcon
            icon={config.icon}
            size="xs"
            className={config.color}
          />
          <MonoText variant="small" className={config.color}>
            {config.label}
          </MonoText>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <MonoText variant="muted" className="text-sm">
            Progress
          </MonoText>
          <MonoText variant="muted" className="text-sm">
            {Math.round(progress)}%
          </MonoText>
        </div>
        
        <ProgressBar
          value={progress}
          size={size === "sm" ? "sm" : "md"}
          variant="default"
          animated={status === "in-progress"}
        />
      </div>

      {/* Meta Information */}
      {showMeta && (
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {totalTasks !== undefined && completedTasks !== undefined && (
            <div className="flex items-center gap-1">
              <MonoText variant="muted">Tasks:</MonoText>
              <MonoText variant="default">
                {completedTasks}/{totalTasks}
              </MonoText>
            </div>
          )}

          {lastUpdated && (
            <div className="flex items-center gap-1">
              <MonoText variant="muted">Updated:</MonoText>
              <MonoText variant="default" as="time">
                {lastUpdated}
              </MonoText>
            </div>
          )}
        </div>
      )}
    </div>
  );
}