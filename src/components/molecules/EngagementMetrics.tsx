import React from "react";
import { cn } from "@/lib/utils";
import { MonoText } from "@/components/ui/Typography";
import { LucideIcon } from "@/components/ui/Icon";
import { Heart, MessageCircle, Share } from "lucide-react";

interface EngagementMetric {
  type: "likes" | "comments" | "shares";
  count: number;
  label?: string;
}

interface EngagementMetricsProps extends React.HTMLAttributes<HTMLDivElement> {
  metrics: EngagementMetric[];
  variant?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  className?: string;
}

const iconMap = {
  likes: Heart,
  comments: MessageCircle,
  shares: Share,
};

const defaultLabels = {
  likes: "likes",
  comments: "comments", 
  shares: "shares",
};

export function EngagementMetrics({
  metrics,
  variant = "horizontal",
  size = "md",
  showLabels = false,
  className,
  ...props
}: EngagementMetricsProps) {
  const isVertical = variant === "vertical";
  
  const sizeClasses = {
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6",
  };

  const iconSizes = {
    sm: "sm" as const,
    md: "md" as const,
    lg: "lg" as const,
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div
      className={cn(
        "flex items-center",
        isVertical && "flex-col items-start",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {metrics.map((metric) => {
        const IconComponent = iconMap[metric.type];
        const label = metric.label || defaultLabels[metric.type];
        
        return (
          <div
            key={metric.type}
            className={cn(
              "flex items-center gap-1.5",
              isVertical && "w-full"
            )}
          >
            <LucideIcon 
              icon={IconComponent} 
              size={iconSizes[size]}
              className="text-warm-gray hover:text-primary transition-colors duration-200" 
            />
            <MonoText variant="muted" className="text-warm-gray">
              {formatCount(metric.count)}
            </MonoText>
            {showLabels && (
              <MonoText variant="small" className="text-warm-gray">
                {label}
              </MonoText>
            )}
          </div>
        );
      })}
    </div>
  );
}