import React from "react";
import { cn } from "@/lib/utils";
import { H3, Paragraph, Link } from "@/components/ui/Typography";
import { Tag } from "@/components/ui/Tag";
import { PostMeta } from "./PostMeta";
import { LucideIcon } from "@/components/ui/Icon";
import { ExternalLink, ArrowRight } from "lucide-react";

interface PostPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  excerpt: string;
  href: string;
  date: string;
  project?: string;
  readingTime?: string;
  tags?: string[];
  variant?: "card" | "list" | "minimal";
  size?: "sm" | "md" | "lg";
  external?: boolean;
  showMeta?: boolean;
  showExcerpt?: boolean;
  showTags?: boolean;
  className?: string;
}

export function PostPreview({
  title,
  excerpt,
  href,
  date,
  project,
  readingTime,
  tags = [],
  variant = "card",
  size = "md",
  external = false,
  showMeta = true,
  showExcerpt = true,
  showTags = true,
  className,
  ...props
}: PostPreviewProps) {
  const sizeClasses = {
    sm: {
      container: variant === "card" ? "p-4" : "",
      spacing: "space-y-2",
      title: "text-lg",
    },
    md: {
      container: variant === "card" ? "p-6" : "",
      spacing: "space-y-3",
      title: "text-xl",
    },
    lg: {
      container: variant === "card" ? "p-8" : "",
      spacing: "space-y-4",
      title: "text-2xl",
    },
  };

  const variantClasses = {
    card: cn(
      "bg-off-white dark:bg-off-black",
      "border border-light-gray dark:border-warm-gray/30",
      "rounded-lg",
      "hover:border-primary/50 dark:hover:border-primary/50",
      "transition-all duration-200"
    ),
    list: cn(
      "border-b border-light-gray dark:border-warm-gray/30 last:border-0",
      "py-4 first:pt-0 last:pb-0"
    ),
    minimal: "space-y-2",
  };

  const LinkComponent = external ? "a" : Link;
  const linkProps = external 
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  return (
    <article
      className={cn(
        variantClasses[variant],
        sizeClasses[size].container,
        sizeClasses[size].spacing,
        className
      )}
      {...props}
    >
      {/* Meta information */}
      {showMeta && (
        <PostMeta
          date={date}
          project={project}
          readingTime={readingTime}
          variant={variant === "list" ? "horizontal" : "horizontal"}
        />
      )}

      {/* Title */}
      <div className="group">
        <LinkComponent
          {...linkProps}
          className={cn(
            sizeClasses[size].title,
            "font-semibold text-off-black dark:text-off-white",
            "group-hover:text-primary transition-colors duration-200",
            "no-underline",
            "flex items-center gap-2"
          )}
        >
          {title}
          {external ? (
            <LucideIcon 
              icon={ExternalLink} 
              size="sm" 
              className="opacity-50 group-hover:opacity-100 transition-opacity" 
            />
          ) : (
            <LucideIcon 
              icon={ArrowRight} 
              size="sm" 
              className="opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" 
            />
          )}
        </LinkComponent>
      </div>

      {/* Excerpt */}
      {showExcerpt && excerpt && (
        <Paragraph variant="muted" className="line-clamp-3">
          {excerpt}
        </Paragraph>
      )}

      {/* Tags */}
      {showTags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Tag
              key={index}
              variant="secondary"
              size={size === "lg" ? "md" : "sm"}
            >
              {tag}
            </Tag>
          ))}
        </div>
      )}
    </article>
  );
}