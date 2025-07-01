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
          "relative p-6 rounded-lg space-y-4",
          "bg-off-white dark:bg-off-black",
          "border transition-all duration-200",
          isHighlighted
            ? "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent"
            : "border-light-gray dark:border-warm-gray/30 hover:border-warm-gray dark:hover:border-warm-gray/60",
          variant === "masonry" && index % 3 === 1 && "md:mt-8",
          variant === "masonry" && index % 3 === 2 && "lg:mt-16"
        )}
      >
        {/* Quote Icon */}
        <LucideIcon
          icon={Quote}
          size="lg"
          className="absolute top-4 right-4 text-primary/20"
        />

        {/* Content */}
        <p className="text-warm-gray leading-relaxed relative z-10 pr-8">
          "{quote.content}"
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4">
          {/* Author */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
              "bg-light-gray dark:bg-warm-gray/20",
              "text-warm-gray"
            )}>
              {quote.avatarUrl ? (
                <img
                  src={quote.avatarUrl}
                  alt={quote.author}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                getInitials(quote.author)
              )}
            </div>

            {/* Author Info */}
            <div>
              <cite className="not-italic font-medium text-sm text-off-black dark:text-off-white">
                {quote.url ? (
                  <Link
                    href={quote.url}
                    external
                    className="hover:text-primary transition-colors no-underline"
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
          <div className="max-w-3xl mx-auto">
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
    <div className="overflow-x-auto pb-4 -mx-4 px-4">
      <div className="flex gap-6" style={{ width: "max-content" }}>
        {displayQuotes.map((quote, index) => (
          <div key={quote.id} className="w-80 flex-shrink-0">
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
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          {title && (
            <h2 className="text-3xl lg:text-4xl font-bold text-off-black dark:text-off-white">
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
        <div className="text-center pt-4">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            View all {quotes.length} community voices
            <LucideIcon icon={MessageCircle} size="sm" />
          </Link>
        </div>
      )}
    </section>
  );
}