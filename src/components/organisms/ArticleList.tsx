import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { PostMeta } from "@/components/molecules/PostMeta";
import { Grid, List, Tag } from "lucide-react";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  project?: string;
  tags: string[];
  date: string;
  readingTime: string;
  author?: {
    name: string;
    avatar?: string;
  };
  featured?: boolean;
  status?: "published" | "draft" | "updated";
}

interface ArticleListProps extends React.HTMLAttributes<HTMLDivElement> {
  articles: Article[];
  loading?: boolean;
  onArticleClick?: (article: Article) => void;
  showViewToggle?: boolean;
  showFilters?: boolean;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  variant?: "grid" | "list" | "compact";
  defaultView?: "grid" | "list";
  gridCols?: 1 | 2 | 3 | 4;
  showMeta?: boolean;
  className?: string;
}

export function ArticleList({
  articles,
  loading = false,
  onArticleClick,
  showViewToggle = true,
  showFilters = false,
  showLoadMore = false,
  onLoadMore,
  hasMore = false,
  variant = "grid",
  defaultView = "grid",
  gridCols = 3,
  showMeta = true,
  className,
  ...props
}: ArticleListProps) {
  const [view, setView] = useState<"grid" | "list">(defaultView);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "title" | "reading-time">("date");

  // Get all unique tags from articles
  const _allTags = Array.from(new Set(articles.flatMap((article) => article.tags))).sort();

  // Filter articles by selected tag
  const filteredArticles = selectedTag
    ? articles.filter((article) => article.tags.includes(selectedTag))
    : articles;

  // Sort articles
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "reading-time":
        return parseInt(a.readingTime) - parseInt(b.readingTime);
      case "date":
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const handleArticleClick = (article: Article) => {
    onArticleClick?.(article);
  };

  const renderArticleCard = (article: Article) => {
    const isCompact = variant === "compact" || view === "list";

    return (
      <article
        key={article.id}
        className={cn(
          "group cursor-pointer transition-all duration-200",
          isCompact
            ? "flex gap-4 rounded-lg p-4 hover:bg-light-gray dark:hover:bg-warm-gray/10"
            : "block rounded-lg border border-light-gray p-6 hover:border-primary/30 dark:border-warm-gray/30 dark:hover:border-primary/50"
        )}
        onClick={() => handleArticleClick(article)}
      >
        {/* Featured Badge */}
        {article.featured && !isCompact && (
          <div className="mb-3">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              Featured
            </span>
          </div>
        )}

        <div className={cn(isCompact ? "min-w-0 flex-1" : "space-y-3")}>
          {/* Title */}
          <h3
            className={cn(
              "font-semibold text-off-black transition-colors group-hover:text-primary dark:text-off-white",
              isCompact ? "line-clamp-2 text-lg" : "text-xl"
            )}
          >
            {article.title}
          </h3>

          {/* Excerpt */}
          <p
            className={cn(
              "text-warm-gray",
              isCompact ? "line-clamp-2 text-sm" : "line-clamp-3 text-base"
            )}
          >
            {article.excerpt}
          </p>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {article.tags.slice(0, isCompact ? 2 : 4).map((tag) => (
                <button
                  key={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTag(selectedTag === tag ? null : tag);
                  }}
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-1 text-xs transition-colors",
                    selectedTag === tag
                      ? "bg-primary text-off-white"
                      : "bg-light-gray text-warm-gray hover:bg-primary/10 hover:text-primary dark:bg-warm-gray/20"
                  )}
                >
                  <LucideIcon icon={Tag} size="xs" className="mr-1" />
                  {tag}
                </button>
              ))}
              {article.tags.length > (isCompact ? 2 : 4) && (
                <span className="text-xs text-warm-gray">
                  +{article.tags.length - (isCompact ? 2 : 4)} more
                </span>
              )}
            </div>
          )}

          {/* Meta */}
          {showMeta && (
            <div className={cn(isCompact ? "mt-2" : "mt-4")}>
              <PostMeta
                date={article.date}
                project={article.project}
                readingTime={article.readingTime}
                variant={isCompact ? "horizontal" : "horizontal"}
              />
            </div>
          )}
        </div>

        {/* Status indicator */}
        {article.status && article.status !== "published" && (
          <div className={cn(isCompact ? "ml-2" : "mt-3")}>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                article.status === "draft"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
              )}
            >
              {article.status === "draft" ? "Draft" : "Updated"}
            </span>
          </div>
        )}
      </article>
    );
  };

  const getGridCols = () => {
    switch (gridCols) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Header with Controls */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          {showViewToggle && variant !== "compact" && (
            <div className="flex items-center gap-1 rounded-md bg-light-gray p-1 dark:bg-warm-gray/20">
              <Button
                variant={view === "grid" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setView("grid")}
                className="px-2 py-1"
                aria-label="Grid view"
              >
                <LucideIcon icon={Grid} size="sm" />
              </Button>
              <Button
                variant={view === "list" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setView("list")}
                className="px-2 py-1"
                aria-label="List view"
              >
                <LucideIcon icon={List} size="sm" />
              </Button>
            </div>
          )}

          {/* Article Count */}
          <p className="text-sm text-warm-gray">
            {sortedArticles.length} article{sortedArticles.length !== 1 ? "s" : ""}
            {selectedTag && (
              <span>
                {" "}
                tagged with <span className="font-medium text-primary">{selectedTag}</span>
              </span>
            )}
          </p>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className={cn(
                "rounded-md px-3 py-1 text-sm",
                "bg-off-white dark:bg-off-black",
                "border border-light-gray dark:border-warm-gray/30",
                "text-off-black dark:text-off-white",
                "focus:outline-none focus:ring-2 focus:ring-primary/50"
              )}
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="reading-time">Sort by Reading Time</option>
            </select>

            {/* Clear Filters */}
            {selectedTag && (
              <Button variant="outline" size="sm" onClick={() => setSelectedTag(null)}>
                Clear Filter
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-light-gray p-6 dark:border-warm-gray/30"
            >
              <div className="space-y-3">
                <div className="h-6 w-3/4 rounded bg-light-gray dark:bg-warm-gray/20"></div>
                <div className="space-y-2">
                  <div className="h-4 rounded bg-light-gray dark:bg-warm-gray/20"></div>
                  <div className="h-4 w-5/6 rounded bg-light-gray dark:bg-warm-gray/20"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 rounded bg-light-gray dark:bg-warm-gray/20"></div>
                  <div className="h-6 w-20 rounded bg-light-gray dark:bg-warm-gray/20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Articles */}
      {!loading && (
        <>
          {sortedArticles.length > 0 ? (
            <div
              className={cn(
                variant === "compact" || view === "list"
                  ? "space-y-2"
                  : `grid gap-6 ${getGridCols()}`
              )}
            >
              {sortedArticles.map(renderArticleCard)}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="space-y-3">
                <LucideIcon icon={Grid} size="lg" className="mx-auto text-warm-gray" />
                <h3 className="text-lg font-medium text-off-black dark:text-off-white">
                  No articles found
                </h3>
                <p className="text-warm-gray">
                  {selectedTag
                    ? `No articles tagged with "${selectedTag}"`
                    : "No articles available at the moment"}
                </p>
                {selectedTag && (
                  <Button variant="outline" onClick={() => setSelectedTag(null)}>
                    Clear Filter
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Load More */}
          {showLoadMore && hasMore && !loading && sortedArticles.length > 0 && (
            <div className="pt-6 text-center">
              <Button variant="outline" onClick={onLoadMore} disabled={loading}>
                Load More Articles
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
