import React from "react";
import { cn } from "@/lib/utils";
import { H3, H4, MonoText, Paragraph } from "@/components/ui/Typography";
import { LucideIcon } from "@/components/ui/Icon";
import { TrendingUp, TrendingDown, Minus, BarChart3, Users, Star, Eye, Clock } from "lucide-react";

interface StatItem {
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
  };
  icon?: "chart" | "users" | "star" | "eye" | "clock" | "custom";
  customIcon?: React.ComponentType<React.SVGAttributes<SVGElement>>;
}

interface StatsDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: StatItem[];
  variant?: "cards" | "inline" | "compact";
  size?: "sm" | "md" | "lg";
  showIcons?: boolean;
  showChanges?: boolean;
  columns?: number;
  className?: string;
}

const iconMap = {
  chart: BarChart3,
  users: Users,
  star: Star,
  eye: Eye,
  clock: Clock,
};

const trendIcons = {
  increase: TrendingUp,
  decrease: TrendingDown,
  neutral: Minus,
};

const trendColors = {
  increase: "text-primary",
  decrease: "text-warm-gray",
  neutral: "text-warm-gray",
};

export function StatsDisplay({
  stats,
  variant = "cards",
  size = "md",
  showIcons = true,
  showChanges = true,
  columns,
  className,
  ...props
}: StatsDisplayProps) {
  const formatValue = (value: string | number): string => {
    if (typeof value === "number") {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toString();
    }
    return value;
  };

  const sizeClasses = {
    sm: {
      container: variant === "cards" ? "p-3" : "",
      value: "text-lg",
      label: "text-xs",
      icon: "sm" as const,
      spacing: "space-y-1",
    },
    md: {
      container: variant === "cards" ? "p-4" : "",
      value: "text-2xl",
      label: "text-sm",
      icon: "md" as const,
      spacing: "space-y-2",
    },
    lg: {
      container: variant === "cards" ? "p-6" : "",
      value: "text-3xl",
      label: "text-base",
      icon: "lg" as const,
      spacing: "space-y-3",
    },
  };

  const gridCols = columns 
    ? `grid-cols-${Math.min(columns, 6)}` 
    : variant === "compact" 
      ? "grid-cols-2 sm:grid-cols-4" 
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  if (variant === "inline") {
    return (
      <div
        className={cn("flex flex-wrap items-center gap-6", className)}
        {...props}
      >
        {stats.map((stat, index) => {
          const IconComponent = stat.customIcon || (stat.icon && stat.icon !== "custom" ? iconMap[stat.icon] : null);
          
          return (
            <div key={index} className="flex items-center gap-3">
              {showIcons && IconComponent && (
                <LucideIcon
                  icon={IconComponent}
                  size={sizeClasses[size].icon}
                  className="text-primary"
                />
              )}
              
              <div className="space-y-1">
                <div className={cn("font-bold text-off-black dark:text-off-white", sizeClasses[size].value)}>
                  {formatValue(stat.value)}
                </div>
                <MonoText variant="muted" className={sizeClasses[size].label}>
                  {stat.label}
                </MonoText>
              </div>

              {showChanges && stat.change && (
                <div className={cn("flex items-center gap-1", trendColors[stat.change.type])}>
                  <LucideIcon
                    icon={trendIcons[stat.change.type]}
                    size="xs"
                  />
                  <MonoText variant="small" className={trendColors[stat.change.type]}>
                    {Math.abs(stat.change.value)}%
                  </MonoText>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        gridCols,
        className
      )}
      {...props}
    >
      {stats.map((stat, index) => {
        const IconComponent = stat.customIcon || (stat.icon && stat.icon !== "custom" ? iconMap[stat.icon] : null);
        
        return (
          <div
            key={index}
            className={cn(
              variant === "cards" && [
                "bg-off-white dark:bg-off-black",
                "border border-light-gray dark:border-warm-gray/30",
                "rounded-lg",
              ],
              sizeClasses[size].container,
              sizeClasses[size].spacing
            )}
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className={cn("font-bold text-off-black dark:text-off-white", sizeClasses[size].value)}>
                  {formatValue(stat.value)}
                </div>
                <MonoText variant="muted" className={sizeClasses[size].label}>
                  {stat.label}
                </MonoText>
              </div>

              {showIcons && IconComponent && (
                <LucideIcon
                  icon={IconComponent}
                  size={sizeClasses[size].icon}
                  className="shrink-0 text-primary"
                />
              )}
            </div>

            {showChanges && stat.change && (
              <div className={cn("mt-2 flex items-center gap-1", trendColors[stat.change.type])}>
                <LucideIcon
                  icon={trendIcons[stat.change.type]}
                  size="xs"
                />
                <MonoText variant="small" className={trendColors[stat.change.type]}>
                  {stat.change.type === "increase" ? "+" : stat.change.type === "decrease" ? "-" : ""}
                  {Math.abs(stat.change.value)}% from last period
                </MonoText>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}