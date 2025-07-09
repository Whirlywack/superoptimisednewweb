import React from "react";
import { cn } from "@/lib/utils";
import { Paragraph, MonoText } from "@/components/ui/Typography";
import { LucideIcon } from "@/components/ui/Icon";
import { Quote } from "lucide-react";

interface CommunityQuoteProps extends React.HTMLAttributes<HTMLBlockquoteElement> {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  variant?: "default" | "highlighted" | "minimal";
  size?: "sm" | "md" | "lg";
  showQuoteIcon?: boolean;
  className?: string;
}

export function CommunityQuote({
  quote,
  author,
  role,
  company,
  avatar,
  variant = "default",
  size = "md",
  showQuoteIcon = true,
  className,
  ...props
}: CommunityQuoteProps) {
  const sizeClasses = {
    sm: {
      container: "p-4",
      quote: "text-sm",
      icon: "sm" as const,
    },
    md: {
      container: "p-6",
      quote: "text-base",
      icon: "md" as const,
    },
    lg: {
      container: "p-8",
      quote: "text-lg",
      icon: "lg" as const,
    },
  };

  const variantClasses = {
    default: cn(
      "bg-off-white dark:bg-off-black",
      "border border-light-gray dark:border-warm-gray/30",
      "rounded-lg"
    ),
    highlighted: cn(
      "bg-primary/5 dark:bg-primary/10",
      "border border-primary/20 dark:border-primary/30",
      "rounded-lg"
    ),
    minimal: "border-l-4 border-primary pl-6",
  };

  const authorInfo = [role, company].filter(Boolean).join(", ");

  return (
    <blockquote
      className={cn(
        variantClasses[variant],
        sizeClasses[size].container,
        "space-y-4",
        className
      )}
      {...props}
    >
      <div className="relative">
        {showQuoteIcon && variant !== "minimal" && (
          <LucideIcon
            icon={Quote}
            size={sizeClasses[size].icon}
            className="absolute -left-2 -top-2 text-primary/40"
          />
        )}
        
        <Paragraph
          className={cn(
            sizeClasses[size].quote,
            "text-off-black dark:text-off-white",
            "italic leading-relaxed",
            showQuoteIcon && variant !== "minimal" && "ml-4"
          )}
        >
          "{quote}"
        </Paragraph>
      </div>

      <footer className="flex items-center gap-3">
        {avatar && (
          <img
            src={avatar}
            alt={`${author} avatar`}
            className="size-10 rounded-full bg-light-gray object-cover dark:bg-warm-gray/20"
          />
        )}
        
        <div className="flex flex-col">
          <MonoText
            variant="default"
            className="font-medium text-off-black dark:text-off-white"
          >
            {author}
          </MonoText>
          
          {authorInfo && (
            <MonoText variant="muted" className="text-xs">
              {authorInfo}
            </MonoText>
          )}
        </div>
      </footer>
    </blockquote>
  );
}