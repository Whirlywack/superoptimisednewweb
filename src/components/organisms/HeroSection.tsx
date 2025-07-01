import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import { ArrowRight, Star, Github, ExternalLink, Play, Download } from "lucide-react";

interface ActionButton {
  label: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  icon?: React.ComponentType;
  size?: "sm" | "md" | "lg";
}

interface Feature {
  icon?: React.ComponentType;
  title: string;
  description: string;
}

interface HeroSectionProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: ActionButton[];
  features?: Feature[];
  backgroundImage?: string;
  backgroundVideo?: string;
  variant?: "default" | "centered" | "split" | "minimal" | "gradient";
  size?: "sm" | "md" | "lg" | "xl";
  showMetrics?: boolean;
  metrics?: {
    label: string;
    value: string;
  }[];
  className?: string;
}

export function HeroSection({
  title,
  subtitle,
  description,
  actions,
  features,
  backgroundImage,
  backgroundVideo,
  variant = "default",
  size = "lg",
  showMetrics = false,
  metrics,
  className,
  ...props
}: HeroSectionProps) {
  const sizeClasses = {
    sm: "py-12 lg:py-16",
    md: "py-16 lg:py-20",
    lg: "py-20 lg:py-28",
    xl: "py-28 lg:py-36",
  };

  const titleSizes = {
    sm: "text-3xl lg:text-4xl",
    md: "text-4xl lg:text-5xl",
    lg: "text-5xl lg:text-6xl",
    xl: "text-6xl lg:text-7xl",
  };

  const subtitleSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const descriptionSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  const renderActions = () => {
    if (!actions || actions.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center gap-4">
        {actions.map((action, index) => {
          const buttonContent = (
            <span className="flex items-center gap-2">
              {action.icon && <LucideIcon icon={action.icon} size="sm" />}
              {action.label}
              {action.external && <LucideIcon icon={ExternalLink} size="xs" />}
            </span>
          );

          if (action.href) {
            return (
              <Link
                key={index}
                href={action.href}
                external={action.external}
                className="no-underline"
              >
                <Button
                  variant={action.variant || "primary"}
                  size={action.size || "lg"}
                >
                  {buttonContent}
                </Button>
              </Link>
            );
          }

          return (
            <Button
              key={index}
              variant={action.variant || "primary"}
              size={action.size || "lg"}
              onClick={action.onClick}
            >
              {buttonContent}
            </Button>
          );
        })}
      </div>
    );
  };

  const renderFeatures = () => {
    if (!features || features.length === 0) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            {feature.icon && (
              <div className="flex-shrink-0 mt-1">
                <LucideIcon
                  icon={feature.icon}
                  size="md"
                  className="text-primary"
                />
              </div>
            )}
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-off-black dark:text-off-white">
                {feature.title}
              </h3>
              <p className="text-sm text-warm-gray">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMetrics = () => {
    if (!showMetrics || !metrics || metrics.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center gap-8">
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-off-black dark:text-off-white">
              {metric.value}
            </div>
            <div className="text-sm text-warm-gray">
              {metric.label}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderBackgroundMedia = () => {
    if (backgroundVideo) {
      return (
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={backgroundVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-off-black/40" />
        </div>
      );
    }

    if (backgroundImage) {
      return (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-off-black/40" />
        </div>
      );
    }

    return null;
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "gradient":
        return "bg-gradient-to-br from-primary/10 via-transparent to-primary/5";
      case "minimal":
        return "";
      default:
        return "";
    }
  };

  const contentAlignment = variant === "centered" ? "text-center" : "text-left";
  const contentMaxWidth = variant === "centered" ? "max-w-4xl mx-auto" : "max-w-none";
  const hasBackgroundMedia = backgroundImage || backgroundVideo;

  if (variant === "split") {
    return (
      <section
        className={cn(
          sizeClasses[size],
          "relative overflow-hidden",
          getVariantClasses(),
          className
        )}
        {...props}
      >
        {renderBackgroundMedia()}
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              {subtitle && (
                <div className={cn(
                  subtitleSizes[size],
                  "font-medium text-primary"
                )}>
                  {subtitle}
                </div>
              )}
              
              <h1 className={cn(
                titleSizes[size],
                "font-bold leading-tight text-off-black dark:text-off-white",
                hasBackgroundMedia && "text-off-white"
              )}>
                {title}
              </h1>
              
              {description && (
                <p className={cn(
                  descriptionSizes[size],
                  "text-warm-gray leading-relaxed max-w-2xl",
                  hasBackgroundMedia && "text-off-white/90"
                )}>
                  {description}
                </p>
              )}
              
              {renderActions()}
              
              {showMetrics && (
                <div className="pt-6">
                  {renderMetrics()}
                </div>
              )}
            </div>
            
            {/* Visual Content Placeholder */}
            <div className="lg:order-first xl:order-last">
              <div className={cn(
                "aspect-square rounded-2xl",
                "bg-gradient-to-br from-primary/20 to-primary/5",
                "border border-light-gray dark:border-warm-gray/30",
                "flex items-center justify-center"
              )}>
                <div className="text-center space-y-4">
                  <LucideIcon 
                    icon={Star} 
                    size="xl" 
                    className="text-primary mx-auto" 
                  />
                  <p className="text-sm text-warm-gray">
                    Visual content area
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        sizeClasses[size],
        "relative overflow-hidden",
        getVariantClasses(),
        className
      )}
      {...props}
    >
      {renderBackgroundMedia()}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={cn(contentMaxWidth, contentAlignment)}>
          <div className="space-y-6">
            {subtitle && (
              <div className={cn(
                subtitleSizes[size],
                "font-medium text-primary"
              )}>
                {subtitle}
              </div>
            )}
            
            <h1 className={cn(
              titleSizes[size],
              "font-bold leading-tight text-off-black dark:text-off-white",
              hasBackgroundMedia && "text-off-white"
            )}>
              {title}
            </h1>
            
            {description && (
              <p className={cn(
                descriptionSizes[size],
                "text-warm-gray leading-relaxed",
                variant === "centered" ? "mx-auto max-w-3xl" : "max-w-3xl",
                hasBackgroundMedia && "text-off-white/90"
              )}>
                {description}
              </p>
            )}
            
            {renderActions()}
            
            {showMetrics && (
              <div className="pt-8">
                {renderMetrics()}
              </div>
            )}
            
            {features && features.length > 0 && (
              <div className="pt-12">
                {renderFeatures()}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}