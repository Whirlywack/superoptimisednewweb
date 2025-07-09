import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import { MessageCircle, Quote, Star, Heart, Twitter } from "lucide-react";

interface CommunityQuote {
  id: string;
  content: string;
  author: string;
  role?: string;
  avatarUrl?: string;
  source?: "twitter" | "github" | "email" | "questionnaire";
  date?: string;
  url?: string;
  highlighted?: boolean;
  likes?: number;
}

interface CommunityVoicesProps extends React.HTMLAttributes<HTMLElement> {
  quotes: CommunityQuote[];
  title?: string;
  description?: string;
  variant?: "grid" | "masonry" | "carousel" | "featured";
  columns?: 1 | 2 | 3 | 4;
  showSource?: boolean;
  showLikes?: boolean;
  maxQuotes?: number;
  className?: string;
}

export function CommunityVoices({
  quotes,
  title = "Community Voices",
  description,
  variant = "grid",
  columns = 3,
  showSource = true,
  showLikes = true,
  maxQuotes,
  className,
  ...props
}: CommunityVoicesProps) {
  const displayQuotes = maxQuotes ? quotes.slice(0, maxQuotes) : quotes;
  const highlightedQuotes = displayQuotes.filter(q => q.highlighted);
  const regularQuotes = displayQuotes.filter(q => !q.highlighted);

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case "twitter":
        return Twitter;
      case "github":
        return Star;
      case "questionnaire":
        return MessageCircle;
      default:
        return Quote;
    }
  };

  const getSourceLabel = (source?: string) => {
    switch (source) {
      case "twitter":
        return "Twitter";
      case "github":
        return "GitHub";
      case "questionnaire":
        return "Survey Response";
      case "email":
        return "Email";
      default:
        return "Community";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const renderQuoteCard = (quote: CommunityQuote, index: number) => {
    const isHighlighted = quote.highlighted;
    
    return (
      <blockquote
        key={quote.id}
        className={cn(
          "relative space-y-4 rounded-lg p-6",
          "bg-off-white dark:bg-off-black",
          "border transition-all duration-200",
          isHighlighted
            ? "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent"
            : "border-light-gray hover:border-warm-gray dark:border-warm-gray/30 dark:hover:border-warm-gray/60",
          variant === "masonry" && index % 3 === 1 && "md:mt-8",
          variant === "masonry" && index % 3 === 2 && "lg:mt-16"
        )}
      >
        {/* Quote Icon */}
        <LucideIcon
          icon={Quote}
          size="lg"
          className="absolute right-4 top-4 text-primary/20"
        />

        {/* Content */}
        <p className="relative z-10 pr-8 leading-relaxed text-warm-gray">
          "{quote.content}"
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4">
          {/* Author */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className={cn(
              "flex size-10 items-center justify-center rounded-full text-sm font-medium",
              "bg-light-gray dark:bg-warm-gray/20",
              "text-warm-gray"
            )}>
              {quote.avatarUrl ? (
                <img
                  src={quote.avatarUrl}
                  alt={quote.author}
                  className="size-full rounded-full object-cover"
                />
              ) : (
                getInitials(quote.author)
              )}
            </div>

            {/* Author Info */}
            <div>
              <cite className="text-sm font-medium not-italic text-off-black dark:text-off-white">
                {quote.url ? (
                  <Link
                    href={quote.url}
                    external
                    className="no-underline transition-colors hover:text-primary"
                  >
                    {quote.author}
                  </Link>
                ) : (
                  quote.author
                )}
              </cite>
              {quote.role && (
                <p className="text-xs text-warm-gray">{quote.role}</p>
              )}
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-warm-gray">
            {showSource && quote.source && (
              <div className="flex items-center gap-1">
                <LucideIcon icon={getSourceIcon(quote.source)} size="xs" />
                <span className="hidden sm:inline">
                  {getSourceLabel(quote.source)}
                </span>
              </div>
            )}
            
            {showLikes && quote.likes && quote.likes > 0 && (
              <div className="flex items-center gap-1">
                <LucideIcon icon={Heart} size="xs" />
                <span>{quote.likes}</span>
              </div>
            )}
          </div>
        </div>
      </blockquote>
    );
  };

  const renderGrid = () => (
    <div className={cn("grid gap-6", columnClasses[columns])}>
      {displayQuotes.map((quote, index) => renderQuoteCard(quote, index))}
    </div>
  );

  const renderFeatured = () => {
    if (highlightedQuotes.length === 0) {
      return renderGrid();
    }

    return (
      <div className="space-y-8">
        {/* Featured Quote */}
        {highlightedQuotes.length > 0 && (
          <div className="mx-auto max-w-3xl">
            {renderQuoteCard(highlightedQuotes[0], 0)}
          </div>
        )}

        {/* Regular Quotes Grid */}
        {regularQuotes.length > 0 && (
          <div className={cn("grid gap-6", columnClasses[columns])}>
            {regularQuotes.map((quote, index) => renderQuoteCard(quote, index + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderCarousel = () => (
    <div className="-mx-4 overflow-x-auto px-4 pb-4">
      <div className="flex gap-6" style={{ width: "max-content" }}>
        {displayQuotes.map((quote, index) => (
          <div key={quote.id} className="w-80 shrink-0">
            {renderQuoteCard(quote, index)}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section
      className={cn("space-y-8", className)}
      {...props}
    >
      {/* Header */}
      {(title || description) && (
        <div className="mx-auto max-w-3xl space-y-2 text-center">
          {title && (
            <h2 className="text-3xl font-bold text-off-black dark:text-off-white lg:text-4xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-lg text-warm-gray">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Quotes */}
      {variant === "grid" && renderGrid()}
      {variant === "masonry" && renderGrid()}
      {variant === "featured" && renderFeatured()}
      {variant === "carousel" && renderCarousel()}

      {/* View More */}
      {maxQuotes && quotes.length > maxQuotes && (
        <div className="pt-4 text-center">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary/80"
          >
            View all {quotes.length} community voices
            <LucideIcon icon={MessageCircle} size="sm" />
          </Link>
        </div>
      )}
    </section>
  );
}