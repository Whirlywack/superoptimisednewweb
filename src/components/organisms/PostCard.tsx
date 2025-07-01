import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "@/components/ui/Typography";
import { Tag } from "@/components/ui/Tag";
import { LucideIcon } from "@/components/ui/Icon";
import { 
  Calendar, 
  Clock, 
  Folder, 
  MessageCircle, 
  Heart, 
  ArrowRight,
  ExternalLink,
  Star
} from "lucide-react";

interface PostCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  readingTime: string;
  project?: string;
  tags?: string[];
  featured?: boolean;
  status?: "published" | "draft" | "updated";
  engagementCount?: number;
  responseCount?: number;
  variant?: "default" | "featured" | "compact" | "minimal";
  size?: "sm" | "md" | "lg";
  showMeta?: boolean;
  showEngagement?: boolean;
  showTags?: boolean;
  showExcerpt?: boolean;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PostCard({
  title,
  slug,
  excerpt,
  date,
  readingTime,
  project,
  tags = [],
  featured = false,
  status = "published",
  engagementCount = 0,
  responseCount = 0,
  variant = "default",
  size = "md",
  showMeta = true,
  showEngagement = true,
  showTags = true,
  showExcerpt = true,
  href,
  external = false,
  onClick,
  className,
  ...props
}: PostCardProps) {
  const postUrl = href || `/journey/${slug}`;

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const titleSizes = {
    sm: "text-lg",
    md: "text-xl lg:text-2xl",
    lg: "text-2xl lg:text-3xl",
  };

  const excerptSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const variantClasses = {
    default: cn(
      "bg-off-white dark:bg-off-black",
      "border border-light-gray dark:border-warm-gray/30",
      "hover:border-warm-gray dark:hover:border-warm-gray/60",
      "transition-all duration-200"
    ),
    featured: cn(
      "bg-gradient-to-br from-primary/5 to-transparent",
      "border-2 border-primary/20",
      "hover:border-primary/40",
      "transition-all duration-200"
    ),
    compact: cn(
      "bg-transparent",
      "border-b border-light-gray dark:border-warm-gray/30",
      "hover:bg-light-gray/30 dark:hover:bg-warm-gray/10",
      "transition-colors duration-200"
    ),
    minimal: cn(
      "bg-transparent",
      "hover:bg-light-gray/20 dark:hover:bg-warm-gray/5",
      "transition-colors duration-200"
    ),
  };

  const renderMeta = () => {
    if (!showMeta) return null;

    return (
      <div className="flex flex-wrap items-center gap-4 text-sm text-warm-gray">
        <div className="flex items-center gap-1">
          <LucideIcon icon={Calendar} size="xs" />
          <time dateTime={date}>{date}</time>
        </div>
        
        <div className="flex items-center gap-1">
          <LucideIcon icon={Clock} size="xs" />
          <span>{readingTime}</span>
        </div>
        
        {project && (
          <div className="flex items-center gap-1">
            <LucideIcon icon={Folder} size="xs" />
            <span>{project}</span>
          </div>
        )}

        {status === "updated" && (
          <span className="text-primary font-medium">Updated</span>
        )}
        
        {status === "draft" && (
          <span className="text-warm-gray italic">Draft</span>
        )}
      </div>
    );
  };

  const renderEngagement = () => {
    if (!showEngagement || (engagementCount === 0 && responseCount === 0)) return null;

    return (
      <div className="flex items-center gap-4 text-sm text-warm-gray">
        {engagementCount > 0 && (
          <div className="flex items-center gap-1">
            <LucideIcon icon={Heart} size="xs" />
            <span>{engagementCount}</span>
          </div>
        )}
        
        {responseCount > 0 && (
          <div className="flex items-center gap-1">
            <LucideIcon icon={MessageCircle} size="xs" />
            <span>{responseCount}</span>
          </div>
        )}
      </div>
    );
  };

  const renderTags = () => {
    if (!showTags || tags.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tag key={tag} size="sm" variant="secondary">
            {tag}
          </Tag>
        ))}
      </div>
    );
  };

  const CardContent = () => (
    <>
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className={cn(
            titleSizes[size],
            "font-semibold text-off-black dark:text-off-white leading-tight",
            "group-hover:text-primary transition-colors duration-200"
          )}>
            {title}
          </h3>
          
          {featured && (
            <LucideIcon 
              icon={Star} 
              size="sm" 
              className="text-primary flex-shrink-0 mt-1"
            />
          )}
        </div>

        {showMeta && renderMeta()}
      </div>

      {/* Excerpt */}
      {showExcerpt && excerpt && (
        <p className={cn(
          excerptSizes[size],
          "text-warm-gray leading-relaxed",
          variant === "compact" ? "line-clamp-2" : "line-clamp-3"
        )}>
          {excerpt}
        </p>
      )}

      {/* Footer */}
      {(showTags || showEngagement) && (
        <div className="flex items-end justify-between gap-4">
          {renderTags()}
          {renderEngagement()}
        </div>
      )}

      {/* Read More */}
      {variant !== "minimal" && (
        <div className="flex items-center gap-2 text-primary font-medium">
          <span>Read more</span>
          <LucideIcon 
            icon={external ? ExternalLink : ArrowRight} 
            size="xs" 
            className="group-hover:translate-x-1 transition-transform duration-200"
          />
        </div>
      )}
    </>
  );

  if (variant === "compact") {
    return (
      <article
        className={cn(
          "group block",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        onClick={onClick}
        {...props}
      >
        <Link 
          href={postUrl} 
          external={external}
          className="no-underline block space-y-3"
        >
          <CardContent />
        </Link>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group block rounded-lg",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      onClick={onClick}
      {...props}
    >
      <Link 
        href={postUrl} 
        external={external}
        className="no-underline block space-y-4"
      >
        <CardContent />
      </Link>
    </article>
  );
}