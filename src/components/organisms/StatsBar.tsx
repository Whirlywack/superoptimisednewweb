import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import { 
  FileText, 
  Clock, 
  Folder, 
  Users, 
  GitCommit,
  Star,
  Eye,
  Download,
  Heart,
  MessageCircle,
  TrendingUp,
  Calendar,
  Activity,
  Globe,
  Code,
  Database
} from "lucide-react";

interface Stat {
  label: string;
  value: string | number;
  icon?: typeof FileText;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  href?: string;
  description?: string;
}

interface StatsBarProps extends React.HTMLAttributes<HTMLElement> {
  stats: Stat[];
  title?: string;
  description?: string;
  variant?: "default" | "compact" | "detailed" | "grid";
  size?: "sm" | "md" | "lg";
  showTrends?: boolean;
  showIcons?: boolean;
  highlightBest?: boolean;
  className?: string;
}

export function StatsBar({
  stats,
  title,
  description,
  variant = "default",
  size = "md",
  showTrends = false,
  showIcons = true,
  highlightBest = false,
  className,
  ...props
}: StatsBarProps) {
  const sizeClasses = {
    sm: "py-4",
    md: "py-6", 
    lg: "py-8",
  };

  const statSizes = {
    sm: {
      value: "text-lg",
      label: "text-xs",
      padding: "p-3",
    },
    md: {
      value: "text-xl",
      label: "text-sm",
      padding: "p-4",
    },
    lg: {
      value: "text-2xl",
      label: "text-base",
      padding: "p-6",
    },
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return TrendingUp;
      case "down":
        return TrendingUp;
      case "stable":
        return TrendingUp;
      default:
        return null;
    }
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case "up":
        return "text-green-600 dark:text-green-400";
      case "down":
        return "text-red-600 dark:text-red-400";
      case "stable":
        return "text-warm-gray";
      default:
        return "text-warm-gray";
    }
  };

  const formatValue = (value: string | number) => {
    if (typeof value === "number") {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toLocaleString();
    }
    return value;
  };

  const findBestStat = () => {
    if (!highlightBest) return null;
    
    const numericStats = stats.filter(stat => typeof stat.value === "number");
    if (numericStats.length === 0) return null;
    
    return numericStats.reduce((best, current) => 
      (current.value as number) > (best.value as number) ? current : best
    );
  };

  const bestStat = findBestStat();

  const renderStat = (stat: Stat, index: number) => {
    const isBest = highlightBest && bestStat === stat;
    const TrendIcon = getTrendIcon(stat.trend);
    
    const StatContent = () => (
      <div className={cn(
        "flex flex-col items-center text-center space-y-2",
        variant === "detailed" && "space-y-3",
        isBest && "ring-2 ring-primary/20 bg-primary/5 rounded-lg",
        statSizes[size].padding
      )}>
        {/* Icon */}
        {showIcons && stat.icon && (
          <div className={cn(
            "flex items-center justify-center rounded-full",
            isBest ? "bg-primary text-off-white" : "bg-light-gray dark:bg-warm-gray/20 text-warm-gray",
            size === "sm" ? "w-8 h-8" : size === "md" ? "w-10 h-10" : "w-12 h-12"
          )}>
            <LucideIcon 
              icon={stat.icon} 
              size={size === "sm" ? "xs" : "sm"} 
              className={isBest ? "text-off-white" : ""}
            />
          </div>
        )}

        {/* Value */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className={cn(
              statSizes[size].value,
              "font-bold text-off-black dark:text-off-white"
            )}>
              {formatValue(stat.value)}
            </span>
            
            {showTrends && stat.trend && TrendIcon && (
              <div className="flex items-center gap-1">
                <LucideIcon 
                  icon={TrendIcon} 
                  size="xs" 
                  className={cn(
                    getTrendColor(stat.trend),
                    stat.trend === "down" && "rotate-180"
                  )} 
                />
                {stat.trendValue && (
                  <span className={cn("text-xs", getTrendColor(stat.trend))}>
                    {stat.trendValue}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <p className={cn(
            statSizes[size].label,
            "text-warm-gray font-medium"
          )}>
            {stat.label}
          </p>
        </div>

        {/* Description */}
        {variant === "detailed" && stat.description && (
          <p className="text-xs text-warm-gray text-center leading-relaxed">
            {stat.description}
          </p>
        )}

        {/* Best indicator */}
        {isBest && (
          <div className="flex items-center gap-1 text-xs text-primary font-medium">
            <LucideIcon icon={Star} size="xs" />
            <span>Highest</span>
          </div>
        )}
      </div>
    );

    if (stat.href) {
      return (
        <Link 
          key={index}
          href={stat.href} 
          className="block no-underline hover:bg-light-gray/50 dark:hover:bg-warm-gray/10 rounded-lg transition-colors"
        >
          <StatContent />
        </Link>
      );
    }

    return (
      <div key={index}>
        <StatContent />
      </div>
    );
  };

  const getGridClasses = () => {
    const count = stats.length;
    
    if (variant === "grid") {
      if (count <= 2) return "grid-cols-1 sm:grid-cols-2";
      if (count <= 4) return "grid-cols-2 sm:grid-cols-4";
      if (count <= 6) return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6";
      return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
    }

    if (variant === "compact") {
      return "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6";
    }

    // Default and detailed variants
    if (count <= 3) return "grid-cols-1 sm:grid-cols-3";
    if (count <= 4) return "grid-cols-2 sm:grid-cols-4";
    if (count <= 5) return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5";
    return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
  };

  if (variant === "compact") {
    return (
      <div 
        className={cn("flex flex-wrap items-center gap-6", className)}
        {...props}
      >
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-2">
            {showIcons && stat.icon && (
              <LucideIcon icon={stat.icon} size="sm" className="text-warm-gray" />
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold text-off-black dark:text-off-white">
                {formatValue(stat.value)}
              </span>
              <span className="text-sm text-warm-gray">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      className={cn(sizeClasses[size], className)}
      {...props}
    >
      <div className="space-y-6">
        {/* Header */}
        {(title || description) && (
          <div className="text-center space-y-2">
            {title && (
              <h2 className="text-2xl font-bold text-off-black dark:text-off-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-warm-gray max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className={cn(
          "grid gap-4",
          getGridClasses(),
          variant === "detailed" && "gap-6"
        )}>
          {stats.map((stat, index) => renderStat(stat, index))}
        </div>
      </div>
    </div>
  );
}