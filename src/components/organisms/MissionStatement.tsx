import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import { Tag } from "@/components/ui/Tag";
import { 
  Heart, 
  Target, 
  Users, 
  Lightbulb, 
  ArrowRight,
  Star,
  Globe,
  BookOpen,
  Code,
  MessageCircle
} from "lucide-react";

interface Value {
  icon: typeof Heart;
  title: string;
  description: string;
}

interface Principle {
  title: string;
  description: string;
  example?: string;
}

interface MissionStatementProps extends React.HTMLAttributes<HTMLElement> {
  mission: string;
  vision?: string;
  values?: Value[];
  principles?: Principle[];
  goals?: string[];
  tags?: string[];
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  variant?: "default" | "hero" | "minimal" | "detailed";
  size?: "sm" | "md" | "lg";
  showValues?: boolean;
  showPrinciples?: boolean;
  showGoals?: boolean;
  className?: string;
}

export function MissionStatement({
  mission,
  vision,
  values = [],
  principles = [],
  goals = [],
  tags = [],
  ctaText = "Learn More",
  ctaHref,
  onCtaClick,
  variant = "default",
  size = "md",
  showValues = true,
  showPrinciples = true,
  showGoals = true,
  className,
  ...props
}: MissionStatementProps) {
  const sizeClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
  };

  const titleSizes = {
    sm: "text-2xl",
    md: "text-3xl lg:text-4xl",
    lg: "text-4xl lg:text-5xl",
  };

  const renderValues = () => {
    if (!showValues || values.length === 0) return null;

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-off-black dark:text-off-white">
          Our Values
        </h3>
        <div className={cn(
          "grid gap-6",
          values.length === 1 && "grid-cols-1",
          values.length === 2 && "grid-cols-1 sm:grid-cols-2",
          values.length >= 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        )}>
          {values.map((value, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <LucideIcon icon={value.icon} size="sm" className="text-primary" />
                </div>
                <h4 className="font-medium text-off-black dark:text-off-white">
                  {value.title}
                </h4>
              </div>
              <p className="text-warm-gray text-sm leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPrinciples = () => {
    if (!showPrinciples || principles.length === 0) return null;

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-off-black dark:text-off-white">
          Guiding Principles
        </h3>
        <div className="space-y-4">
          {principles.map((principle, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium text-off-black dark:text-off-white">
                {principle.title}
              </h4>
              <p className="text-warm-gray leading-relaxed">
                {principle.description}
              </p>
              {principle.example && (
                <p className="text-sm text-warm-gray italic">
                  Example: {principle.example}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGoals = () => {
    if (!showGoals || goals.length === 0) return null;

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-off-black dark:text-off-white">
          Key Goals
        </h3>
        <div className="grid gap-3">
          {goals.map((goal, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <LucideIcon icon={Target} size="xs" className="text-primary" />
              </div>
              <p className="text-warm-gray leading-relaxed">{goal}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Content = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h2 className={cn(
            titleSizes[size],
            "font-bold text-off-black dark:text-off-white leading-tight"
          )}>
            Our Mission
          </h2>
          
          <p className={cn(
            "text-warm-gray leading-relaxed max-w-3xl mx-auto",
            size === "lg" ? "text-lg" : "text-base"
          )}>
            {mission}
          </p>
        </div>

        {vision && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-off-black dark:text-off-white">
              Our Vision
            </h3>
            <p className="text-warm-gray leading-relaxed max-w-2xl mx-auto">
              {vision}
            </p>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {tags.map((tag) => (
              <Tag key={tag} size="sm" variant="secondary">
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </div>

      {/* Content Sections */}
      <div className="space-y-12">
        {renderValues()}
        {renderPrinciples()}
        {renderGoals()}
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

  if (variant === "hero") {
    return (
      <section
        className={cn(
          sizeClasses[size],
          "bg-gradient-to-br from-primary/5 via-transparent to-primary/5",
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Content />
          </div>
        </div>
      </section>
    );
  }

  if (variant === "minimal") {
    return (
      <div
        className={cn("space-y-6", className)}
        {...props}
      >
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-off-black dark:text-off-white">
            Our Mission
          </h3>
          <p className="text-warm-gray leading-relaxed">
            {mission}
          </p>
          {(ctaHref || onCtaClick) && (
            <div>
              {ctaHref ? (
                <Link 
                  href={ctaHref}
                  className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors no-underline"
                >
                  {ctaText}
                  <LucideIcon icon={ArrowRight} size="xs" />
                </Link>
              ) : (
                <button
                  onClick={onCtaClick}
                  className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                >
                  {ctaText}
                  <LucideIcon icon={ArrowRight} size="xs" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  const containerClasses = variant === "detailed" ? cn(
    "bg-off-white dark:bg-off-black",
    "border border-light-gray dark:border-warm-gray/30",
    "rounded-lg p-8"
  ) : "";

  return (
    <div
      className={cn(
        sizeClasses[size],
        containerClasses,
        className
      )}
      {...props}
    >
      <div className="max-w-4xl mx-auto">
        <Content />
      </div>
    </div>
  );
}