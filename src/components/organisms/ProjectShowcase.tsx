import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/Tag";
import { LucideIcon } from "@/components/ui/Icon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Link } from "@/components/ui/Typography";
import { 
  Github, 
  ExternalLink, 
  Star, 
  GitFork,
  Activity,
  Calendar,
  Code,
  Package,
  Zap,
  Users,
  Globe
} from "lucide-react";

interface TechStack {
  name: string;
  icon?: React.ComponentType;
  color?: string;
}

interface ProjectLink {
  type: "github" | "demo" | "docs" | "website";
  url: string;
  label?: string;
}

interface ProjectShowcaseProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  description: string;
  longDescription?: string;
  techStack: TechStack[] | string[];
  status?: "planning" | "in-progress" | "completed" | "maintained";
  progress?: number;
  image?: string;
  imageAlt?: string;
  links?: ProjectLink[];
  stats?: {
    stars?: number;
    forks?: number;
    contributors?: number;
    commits?: number;
  };
  startDate?: string;
  completedDate?: string;
  variant?: "card" | "hero" | "detailed" | "compact";
  size?: "sm" | "md" | "lg";
  featured?: boolean;
  showStats?: boolean;
  showProgress?: boolean;
  className?: string;
}

export function ProjectShowcase({
  name,
  description,
  longDescription,
  techStack,
  status = "in-progress",
  progress,
  image,
  imageAlt,
  links = [],
  stats,
  startDate,
  completedDate,
  variant = "card",
  size = "md",
  featured = false,
  showStats = true,
  showProgress = true,
  className,
  ...props
}: ProjectShowcaseProps) {
  const getStatusColor = () => {
    switch (status) {
      case "planning":
        return "text-warm-gray";
      case "in-progress":
        return "text-primary";
      case "completed":
        return "text-green-600 dark:text-green-400";
      case "maintained":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-warm-gray";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "planning":
        return "Planning";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "maintained":
        return "Actively Maintained";
      default:
        return status;
    }
  };

  const getLinkIcon = (type: string) => {
    switch (type) {
      case "github":
        return Github;
      case "demo":
        return Globe;
      case "docs":
        return Code;
      case "website":
        return ExternalLink;
      default:
        return ExternalLink;
    }
  };

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const titleSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const renderTechStack = () => {
    const items = techStack.slice(0, variant === "compact" ? 4 : undefined);
    const remaining = techStack.length - items.length;

    return (
      <div className="flex flex-wrap gap-2">
        {items.map((tech, index) => {
          const isString = typeof tech === "string";
          const name = isString ? tech : tech.name;
          const icon = !isString && tech.icon ? tech.icon : Code;
          
          return (
            <Tag
              key={index}
              size="sm"
              variant="secondary"
              className="flex items-center gap-1"
            >
              <LucideIcon icon={icon} size="xs" />
              {name}
            </Tag>
          );
        })}
        {remaining > 0 && (
          <Tag size="sm" variant="secondary">
            +{remaining} more
          </Tag>
        )}
      </div>
    );
  };

  const renderStats = () => {
    if (!showStats || !stats) return null;

    return (
      <div className="flex flex-wrap items-center gap-4 text-sm text-warm-gray">
        {stats.stars !== undefined && (
          <div className="flex items-center gap-1">
            <LucideIcon icon={Star} size="xs" />
            <span>{stats.stars}</span>
          </div>
        )}
        {stats.forks !== undefined && (
          <div className="flex items-center gap-1">
            <LucideIcon icon={GitFork} size="xs" />
            <span>{stats.forks}</span>
          </div>
        )}
        {stats.contributors !== undefined && (
          <div className="flex items-center gap-1">
            <LucideIcon icon={Users} size="xs" />
            <span>{stats.contributors}</span>
          </div>
        )}
        {stats.commits !== undefined && (
          <div className="flex items-center gap-1">
            <LucideIcon icon={Activity} size="xs" />
            <span>{stats.commits} commits</span>
          </div>
        )}
      </div>
    );
  };

  const renderProgress = () => {
    if (!showProgress || progress === undefined) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-warm-gray">Progress</span>
          <span className="font-medium text-off-black dark:text-off-white">
            {progress}%
          </span>
        </div>
        <ProgressBar value={progress} size="sm" />
      </div>
    );
  };

  const renderLinks = () => {
    if (links.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-3">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            external
            className="no-underline"
          >
            <Button
              variant={index === 0 ? "primary" : "outline"}
              size="sm"
            >
              <span className="flex items-center gap-2">
                <LucideIcon icon={getLinkIcon(link.type)} size="sm" />
                {link.label || link.type.charAt(0).toUpperCase() + link.type.slice(1)}
              </span>
            </Button>
          </Link>
        ))}
      </div>
    );
  };

  if (variant === "hero") {
    return (
      <div
        className={cn(
          "grid grid-cols-1 lg:grid-cols-2 gap-8 items-center",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {/* Content */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className={cn(
                titleSizes[size],
                "font-bold text-off-black dark:text-off-white"
              )}>
                {name}
              </h2>
              {featured && (
                <LucideIcon icon={Star} size="md" className="text-primary" />
              )}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className={cn("font-medium", getStatusColor())}>
                {getStatusLabel()}
              </span>
              {startDate && (
                <div className="flex items-center gap-1 text-warm-gray">
                  <LucideIcon icon={Calendar} size="xs" />
                  <span>Started {startDate}</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-lg text-warm-gray leading-relaxed">
            {longDescription || description}
          </p>

          {renderTechStack()}
          {renderProgress()}
          {renderStats()}
          {renderLinks()}
        </div>

        {/* Image */}
        {image && (
          <div className={cn(
            "aspect-video rounded-lg overflow-hidden",
            "bg-light-gray dark:bg-warm-gray/20"
          )}>
            <img
              src={image}
              alt={imageAlt || `${name} screenshot`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <div
        className={cn(
          "space-y-6",
          sizeClasses[size],
          "bg-off-white dark:bg-off-black",
          "border border-light-gray dark:border-warm-gray/30",
          "rounded-lg",
          featured && "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent",
          className
        )}
        {...props}
      >
        {image && (
          <div className="aspect-video rounded-lg overflow-hidden -m-6 mb-0">
            <img
              src={image}
              alt={imageAlt || `${name} screenshot`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h3 className={cn(
                titleSizes[size],
                "font-bold text-off-black dark:text-off-white"
              )}>
                {name}
              </h3>
              <div className="flex items-center gap-3 text-sm">
                <span className={cn("font-medium", getStatusColor())}>
                  {getStatusLabel()}
                </span>
                {renderStats()}
              </div>
            </div>
            {featured && (
              <LucideIcon icon={Star} size="md" className="text-primary flex-shrink-0" />
            )}
          </div>

          <p className="text-warm-gray leading-relaxed">
            {longDescription || description}
          </p>

          {renderTechStack()}
          {renderProgress()}
          {renderLinks()}
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center gap-4 p-4",
          "bg-off-white dark:bg-off-black",
          "border border-light-gray dark:border-warm-gray/30",
          "rounded-lg hover:border-warm-gray dark:hover:border-warm-gray/60",
          "transition-colors duration-200",
          className
        )}
        {...props}
      >
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-semibold text-off-black dark:text-off-white">
              {name}
            </h4>
            <span className={cn("text-sm", getStatusColor())}>
              {getStatusLabel()}
            </span>
          </div>
          <p className="text-sm text-warm-gray line-clamp-1">{description}</p>
          {renderTechStack()}
        </div>
        {links.length > 0 && (
          <Link href={links[0].url} external className="no-underline">
            <Button variant="ghost" size="sm">
              <LucideIcon icon={getLinkIcon(links[0].type)} size="sm" />
            </Button>
          </Link>
        )}
      </div>
    );
  }

  // Default card variant
  return (
    <div
      className={cn(
        "space-y-4",
        sizeClasses[size],
        "bg-off-white dark:bg-off-black",
        "border border-light-gray dark:border-warm-gray/30",
        "rounded-lg hover:border-warm-gray dark:hover:border-warm-gray/60",
        "transition-all duration-200",
        featured && "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <h3 className={cn(
            titleSizes[size],
            "font-semibold text-off-black dark:text-off-white"
          )}>
            {name}
          </h3>
          <span className={cn("text-sm font-medium", getStatusColor())}>
            {getStatusLabel()}
          </span>
        </div>
        {featured && (
          <LucideIcon icon={Star} size="md" className="text-primary flex-shrink-0" />
        )}
      </div>

      <p className="text-warm-gray leading-relaxed">
        {description}
      </p>

      {renderTechStack()}
      {renderProgress()}
      {renderStats()}
      {renderLinks()}
    </div>
  );
}