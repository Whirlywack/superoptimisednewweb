import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Tag } from "@/components/ui/Tag";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import { 
  Target, 
  Calendar, 
  Clock, 
  ArrowRight,
  Activity,
  CheckCircle2,
  Circle,
  AlertCircle,
  TrendingUp
} from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  date?: string;
}

interface Update {
  date: string;
  content: string;
  type?: "progress" | "milestone" | "challenge" | "learning";
}

interface CurrentFocusProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description: string;
  progress: number;
  startDate: string;
  targetDate?: string;
  milestones?: Milestone[];
  recentUpdates?: Update[];
  tags?: string[];
  metrics?: {
    label: string;
    value: string | number;
    trend?: "up" | "down" | "stable";
  }[];
  ctaText?: string;
  ctaHref?: string;
  ctaExternal?: boolean;
  onCtaClick?: () => void;
  variant?: "default" | "card" | "hero" | "minimal";
  size?: "sm" | "md" | "lg";
  showMilestones?: boolean;
  showUpdates?: boolean;
  showMetrics?: boolean;
  className?: string;
}

export function CurrentFocus({
  title,
  description,
  progress,
  startDate,
  targetDate,
  milestones = [],
  recentUpdates = [],
  tags = [],
  metrics = [],
  ctaText = "Follow Progress",
  ctaHref,
  ctaExternal = false,
  onCtaClick,
  variant = "default",
  size = "md",
  showMilestones = true,
  showUpdates = true,
  showMetrics = true,
  className,
  ...props
}: CurrentFocusProps) {
  const completedMilestones = milestones.filter(m => m.completed).length;
  const totalMilestones = milestones.length;

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const titleSizes = {
    sm: "text-xl",
    md: "text-2xl lg:text-3xl",
    lg: "text-3xl lg:text-4xl",
  };

  const getUpdateIcon = (type?: string) => {
    switch (type) {
      case "milestone":
        return CheckCircle2;
      case "challenge":
        return AlertCircle;
      case "learning":
        return TrendingUp;
      default:
        return Activity;
    }
  };

  const getUpdateColor = (type?: string) => {
    switch (type) {
      case "milestone":
        return "text-green-600 dark:text-green-400";
      case "challenge":
        return "text-orange-600 dark:text-orange-400";
      case "learning":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-primary";
    }
  };

  const renderMilestones = () => {
    if (!showMilestones || milestones.length === 0) return null;

    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-off-black dark:text-off-white">
          Milestones ({completedMilestones}/{totalMilestones})
        </h3>
        <div className="space-y-2">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="flex items-center gap-3 text-sm"
            >
              <LucideIcon
                icon={milestone.completed ? CheckCircle2 : Circle}
                size="sm"
                className={cn(
                  milestone.completed
                    ? "text-green-600 dark:text-green-400"
                    : "text-warm-gray"
                )}
              />
              <span
                className={cn(
                  "flex-1",
                  milestone.completed && "text-warm-gray line-through"
                )}
              >
                {milestone.title}
              </span>
              {milestone.date && (
                <span className="text-xs text-warm-gray">{milestone.date}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUpdates = () => {
    if (!showUpdates || recentUpdates.length === 0) return null;

    const displayUpdates = recentUpdates.slice(0, 3);

    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-off-black dark:text-off-white">
          Recent Updates
        </h3>
        <div className="space-y-3">
          {displayUpdates.map((update, index) => (
            <div key={index} className="flex gap-3">
              <LucideIcon
                icon={getUpdateIcon(update.type)}
                size="sm"
                className={cn("mt-0.5 shrink-0", getUpdateColor(update.type))}
              />
              <div className="flex-1 space-y-1">
                <p className="text-sm text-warm-gray">{update.content}</p>
                <time className="text-xs text-warm-gray/70">{update.date}</time>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMetrics = () => {
    if (!showMetrics || metrics.length === 0) return null;

    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-off-black dark:text-off-white">
                {metric.value}
              </span>
              {metric.trend && (
                <LucideIcon
                  icon={TrendingUp}
                  size="xs"
                  className={cn(
                    metric.trend === "up" && "text-green-600 dark:text-green-400",
                    metric.trend === "down" && "rotate-180 text-red-600 dark:text-red-400",
                    metric.trend === "stable" && "rotate-90 text-warm-gray"
                  )}
                />
              )}
            </div>
            <p className="text-xs text-warm-gray">{metric.label}</p>
          </div>
        ))}
      </div>
    );
  };

  const CardContent = () => (
    <>
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <LucideIcon icon={Target} size="md" className="text-primary" />
            <h2 className={cn(
              titleSizes[size],
              "font-bold text-off-black dark:text-off-white"
            )}>
              {title}
            </h2>
          </div>
          
          <p className="leading-relaxed text-warm-gray">
            {description}
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag} size="sm" variant="secondary">
                {tag}
              </Tag>
            ))}
          </div>
        )}

        {/* Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-warm-gray">Overall Progress</span>
            <span className="font-medium text-off-black dark:text-off-white">
              {progress}%
            </span>
          </div>
          <ProgressBar value={progress} size="md" showLabel={false} />
          
          <div className="flex items-center justify-between text-xs text-warm-gray">
            <div className="flex items-center gap-1">
              <LucideIcon icon={Calendar} size="xs" />
              <span>Started {startDate}</span>
            </div>
            {targetDate && (
              <div className="flex items-center gap-1">
                <LucideIcon icon={Clock} size="xs" />
                <span>Target: {targetDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metrics */}
      {showMetrics && metrics.length > 0 && (
        <div className="border-t border-light-gray pt-4 dark:border-warm-gray/30">
          {renderMetrics()}
        </div>
      )}

      {/* Milestones */}
      {showMilestones && milestones.length > 0 && (
        <div className="border-t border-light-gray pt-4 dark:border-warm-gray/30">
          {renderMilestones()}
        </div>
      )}

      {/* Updates */}
      {showUpdates && recentUpdates.length > 0 && (
        <div className="border-t border-light-gray pt-4 dark:border-warm-gray/30">
          {renderUpdates()}
        </div>
      )}

      {/* CTA */}
      {(ctaHref || onCtaClick) && (
        <div className="pt-4">
          {ctaHref ? (
            <Link href={ctaHref} external={ctaExternal} className="no-underline">
              <Button variant="primary" className="w-full sm:w-auto">
                <span className="flex items-center gap-2">
                  {ctaText}
                  <LucideIcon icon={ArrowRight} size="sm" />
                </span>
              </Button>
            </Link>
          ) : (
            <Button 
              variant="primary" 
              onClick={onCtaClick}
              className="w-full sm:w-auto"
            >
              <span className="flex items-center gap-2">
                {ctaText}
                <LucideIcon icon={ArrowRight} size="sm" />
              </span>
            </Button>
          )}
        </div>
      )}
    </>
  );

  if (variant === "hero") {
    return (
      <section
        className={cn(
          "py-12 lg:py-16",
          "bg-gradient-to-br from-primary/5 via-transparent to-primary/5",
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-6">
            <CardContent />
          </div>
        </div>
      </section>
    );
  }

  if (variant === "minimal") {
    return (
      <div
        className={cn("space-y-4", className)}
        {...props}
      >
        <div className="flex items-center gap-2">
          <LucideIcon icon={Target} size="sm" className="text-primary" />
          <h3 className="text-lg font-semibold text-off-black dark:text-off-white">
            {title}
          </h3>
        </div>
        
        <p className="text-sm text-warm-gray">{description}</p>
        
        <div className="space-y-2">
          <ProgressBar value={progress} size="sm" />
          <div className="flex items-center justify-between text-xs text-warm-gray">
            <span>{progress}% complete</span>
            {targetDate && <span>Target: {targetDate}</span>}
          </div>
        </div>
        
        {(ctaHref || onCtaClick) && (
          <div>
            {ctaHref ? (
              <Link 
                href={ctaHref} 
                external={ctaExternal}
                className="inline-flex items-center gap-1 text-sm text-primary no-underline transition-colors hover:text-primary/80"
              >
                {ctaText}
                <LucideIcon icon={ArrowRight} size="xs" />
              </Link>
            ) : (
              <button
                onClick={onCtaClick}
                className="inline-flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80"
              >
                {ctaText}
                <LucideIcon icon={ArrowRight} size="xs" />
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  const containerClasses = variant === "card" ? cn(
    "bg-off-white dark:bg-off-black",
    "border border-light-gray dark:border-warm-gray/30",
    "rounded-lg",
    sizeClasses[size]
  ) : "";

  return (
    <div
      className={cn(
        "space-y-6",
        containerClasses,
        className
      )}
      {...props}
    >
      <CardContent />
    </div>
  );
}