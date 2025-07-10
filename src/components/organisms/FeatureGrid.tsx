import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import { Tag } from "@/components/ui/Tag";
import type { 
  Zap} from "lucide-react";
import { 
  ArrowRight,
  Star
} from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: typeof Zap;
  status?: "available" | "coming-soon" | "beta" | "new";
  href?: string;
  tags?: string[];
  highlighted?: boolean;
}

interface FeatureGridProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  features: Feature[];
  variant?: "default" | "compact" | "detailed" | "minimal";
  columns?: 1 | 2 | 3 | 4;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
  showTags?: boolean;
  highlightNew?: boolean;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  onFeatureClick?: (feature: Feature) => void;
  className?: string;
}

export function FeatureGrid({
  title,
  description,
  features,
  variant = "default",
  columns,
  size = "md",
  showStatus = true,
  showTags = false,
  highlightNew = false,
  ctaText,
  ctaHref,
  onCtaClick,
  onFeatureClick,
  className,
  ...props
}: FeatureGridProps) {
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "new":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "beta":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "coming-soon":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      default:
        return "bg-light-gray text-warm-gray dark:bg-warm-gray/20";
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case "new":
        return "New";
      case "beta":
        return "Beta";
      case "coming-soon":
        return "Coming Soon";
      case "available":
        return "Available";
      default:
        return "";
    }
  };

  const getGridClasses = () => {
    if (columns) {
      return `grid-cols-1 ${columns >= 2 ? 'sm:grid-cols-2' : ''} ${columns >= 3 ? 'lg:grid-cols-3' : ''} ${columns >= 4 ? 'xl:grid-cols-4' : ''}`;
    }

    const count = features.length;
    if (count <= 2) return "grid-cols-1 sm:grid-cols-2";
    if (count <= 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    if (count <= 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    if (count <= 6) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  };

  const renderFeature = (feature: Feature) => {
    const isHighlighted = feature.highlighted || (highlightNew && feature.status === "new");
    const isComingSoon = feature.status === "coming-soon";
    
    const FeatureContent = () => (
      <div className={cn(
        "group relative h-full",
        variant === "compact" ? "p-4" : sizeClasses[size],
        "rounded-lg border border-light-gray dark:border-warm-gray/30",
        "bg-off-white dark:bg-off-black",
        "transition-all duration-200",
        !isComingSoon && (feature.href || onFeatureClick) && "cursor-pointer hover:border-primary/50 hover:shadow-sm",
        isHighlighted && "border-primary/30 ring-2 ring-primary/20",
        isComingSoon && "opacity-75"
      )}
      onClick={() => !isComingSoon && onFeatureClick?.(feature)}
    >
      {/* Status Badge */}
      {showStatus && feature.status && (
        <div className="absolute right-3 top-3">
          <span className={cn(
            "rounded-full px-2 py-1 text-xs font-medium",
            getStatusColor(feature.status)
          )}>
            {getStatusText(feature.status)}
          </span>
        </div>
      )}

      {/* Highlight indicator */}
      {isHighlighted && (
        <div className="absolute left-3 top-3">
          <div className="flex size-6 items-center justify-center rounded-full bg-primary">
            <LucideIcon icon={Star} size="xs" className="text-off-white" />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Icon */}
        <div className={cn(
          "flex size-12 items-center justify-center rounded-lg",
          isHighlighted 
            ? "bg-primary text-off-white" 
            : "bg-light-gray text-warm-gray dark:bg-warm-gray/20"
        )}>
          <LucideIcon 
            icon={feature.icon} 
            size={size === "sm" ? "sm" : "md"} 
            className={isHighlighted ? "text-off-white" : ""}
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className={cn(
            "font-semibold text-off-black dark:text-off-white",
            variant === "compact" ? "text-base" : "text-lg"
          )}>
            {feature.title}
          </h3>
          
          <p className={cn(
            "leading-relaxed text-warm-gray",
            variant === "compact" ? "text-sm" : "text-base",
            variant === "minimal" && "line-clamp-2"
          )}>
            {feature.description}
          </p>
        </div>

        {/* Tags */}
        {showTags && feature.tags && feature.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {feature.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} size="sm" variant="secondary">
                {tag}
              </Tag>
            ))}
            {feature.tags.length > 3 && (
              <Tag size="sm" variant="secondary">
                +{feature.tags.length - 3}
              </Tag>
            )}
          </div>
        )}

        {/* Link indicator */}
        {!isComingSoon && feature.href && (
          <div className="flex items-center text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
            <span>Learn more</span>
            <LucideIcon icon={ArrowRight} size="xs" className="ml-1" />
          </div>
        )}
      </div>
    </div>
    );

    if (!isComingSoon && feature.href) {
      return (
        <Link key={feature.id} href={feature.href} className="block h-full no-underline">
          <FeatureContent />
        </Link>
      );
    }

    return (
      <div key={feature.id} className="h-full">
        <FeatureContent />
      </div>
    );
  };

  if (variant === "minimal") {
    return (
      <div className={cn("space-y-6", className)} {...props}>
        {title && (
          <h2 className="text-xl font-semibold text-off-black dark:text-off-white">
            {title}
          </h2>
        )}
        
        <div className="space-y-4">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-start gap-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-light-gray dark:bg-warm-gray/20">
                <LucideIcon icon={feature.icon} size="sm" className="text-warm-gray" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-off-black dark:text-off-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-warm-gray">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8", className)} {...props}>
      {/* Header */}
      {(title || description) && (
        <div className="space-y-4 text-center">
          {title && (
            <h2 className={cn(
              titleSizes[size],
              "font-bold text-off-black dark:text-off-white"
            )}>
              {title}
            </h2>
          )}
          {description && (
            <p className={cn(
              "mx-auto max-w-3xl leading-relaxed text-warm-gray",
              size === "lg" ? "text-lg" : "text-base"
            )}>
              {description}
            </p>
          )}
        </div>
      )}

      {/* Features Grid */}
      <div className={cn(
        "grid gap-6",
        getGridClasses(),
        variant === "compact" && "gap-4"
      )}>
        {features.map((feature) => renderFeature(feature))}
      </div>

      {/* CTA */}
      {(ctaHref || onCtaClick) && (
        <div className="text-center">
          {ctaHref ? (
            <Link href={ctaHref} className="no-underline">
              <Button variant="primary" size="lg">
                <span className="flex items-center gap-2">
                  {ctaText}
                  <LucideIcon icon={ArrowRight} size="sm" />
                </span>
              </Button>
            </Link>
          ) : (
            <Button variant="primary" size="lg" onClick={onCtaClick}>
              <span className="flex items-center gap-2">
                {ctaText}
                <LucideIcon icon={ArrowRight} size="sm" />
              </span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}