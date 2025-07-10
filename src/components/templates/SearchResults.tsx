import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc,
  Grid,
  List,
  Clock,
  Calendar,
  Tag,
  User,
  FileText,
  Image,
  Video,
  Music,
  File,
  ExternalLink,
  ChevronDown,
  X,
  TrendingUp,
  Star,
  Eye,
  Download,
  BookOpen,
  Code,
  MessageCircle,
  Heart,
  Share,
  Bookmark,
  MoreHorizontal,
  ArrowRight
} from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "page" | "post" | "project" | "document" | "image" | "video" | "audio" | "code" | "user";
  url: string;
  thumbnail?: string;
  author?: {
    name: string;
    avatar?: string;
    url?: string;
  };
  date: string;
  readTime?: number;
  tags?: string[];
  metadata?: {
    views?: number;
    likes?: number;
    downloads?: number;
    comments?: number;
    rating?: number;
    fileSize?: string;
    duration?: string;
  };
  isBookmarked?: boolean;
  isFeatured?: boolean;
  excerpt?: string;
  highlightedText?: string;
}

interface SearchFilter {
  id: string;
  label: string;
  value: string;
  count?: number;
}

interface SearchResultsProps extends React.HTMLAttributes<HTMLElement> {
  query: string;
  results: SearchResult[];
  totalResults: number;
  searchTime?: number;
  currentPage?: number;
  totalPages?: number;
  viewMode?: "grid" | "list";
  sortBy?: "relevance" | "date" | "popularity" | "title";
  sortOrder?: "asc" | "desc";
  showFilters?: boolean;
  showStats?: boolean;
  showPagination?: boolean;
  filters?: {
    type?: SearchFilter[];
    dateRange?: SearchFilter[];
    author?: SearchFilter[];
    tags?: SearchFilter[];
  };
  activeFilters?: Record<string, string[]>;
  searchPlaceholder?: string;
  emptyStateTitle?: string;
  emptyStateMessage?: string;
  onSearch?: (query: string) => void;
  onFilterChange?: (filterType: string, values: string[]) => void;
  onSortChange?: (sortBy: string, order: string) => void;
  onViewModeChange?: (mode: "grid" | "list") => void;
  onPageChange?: (page: number) => void;
  onResultClick?: (result: SearchResult) => void;
  onBookmarkToggle?: (result: SearchResult) => void;
  onShare?: (result: SearchResult) => void;
  className?: string;
}

export function SearchResults({
  query,
  results,
  totalResults,
  searchTime,
  currentPage = 1,
  totalPages = 1,
  viewMode = "list",
  sortBy = "relevance",
  sortOrder = "desc",
  showFilters = true,
  showStats = true,
  showPagination = true,
  filters,
  activeFilters = {},
  searchPlaceholder = "Search...",
  emptyStateTitle = "No results found",
  emptyStateMessage = "Try adjusting your search terms or filters",
  onSearch,
  onFilterChange,
  onSortChange,
  onViewModeChange,
  onPageChange,
  onResultClick,
  onBookmarkToggle,
  onShare,
  className,
  ...props
}: SearchResultsProps) {
  const [searchInput, setSearchInput] = useState(query);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && onSearch) {
      onSearch(searchInput.trim());
    }
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setCurrentViewMode(mode);
    onViewModeChange?.(mode);
  };

  const handleSortChange = (newSortBy: string) => {
    const newOrder = sortBy === newSortBy && sortOrder === "desc" ? "asc" : "desc";
    onSortChange?.(newSortBy, newOrder);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case "post":
        return FileText;
      case "project":
        return Code;
      case "document":
        return BookOpen;
      case "image":
        return Image;
      case "video":
        return Video;
      case "audio":
        return Music;
      case "user":
        return User;
      case "code":
        return Code;
      default:
        return File;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  const renderResultCard = (result: SearchResult) => {
    const ResultIcon = getResultIcon(result.type);
    
    return (
      <article
        key={result.id}
        onClick={() => onResultClick?.(result)}
        className={cn(
          "cursor-pointer overflow-hidden rounded-lg border border-light-gray bg-off-white transition-colors hover:border-primary/50 dark:border-warm-gray/30 dark:bg-off-black",
          result.isFeatured && "ring-2 ring-primary/20",
          currentViewMode === "list" && "flex gap-4 p-4",
          currentViewMode === "grid" && "p-6"
        )}
      >
        {/* Thumbnail */}
        {result.thumbnail && (
          <div className={cn(
            "relative shrink-0 overflow-hidden bg-light-gray dark:bg-warm-gray/20",
            currentViewMode === "list" && "size-24 rounded-lg",
            currentViewMode === "grid" && "mb-4 h-32 w-full rounded-lg"
          )}>
            <img
              src={result.thumbnail}
              alt={result.title}
              className="size-full object-cover"
            />
            {result.isFeatured && (
              <div className="absolute left-2 top-2 rounded bg-primary/90 px-2 py-1 text-xs font-medium text-off-white">
                Featured
              </div>
            )}
          </div>
        )}

        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <LucideIcon icon={ResultIcon} size="xs" className="shrink-0 text-warm-gray" />
                <span className="text-xs capitalize text-warm-gray">{result.type}</span>
                {result.readTime && (
                  <>
                    <span className="text-warm-gray">•</span>
                    <span className="text-xs text-warm-gray">{result.readTime} min read</span>
                  </>
                )}
              </div>
              
              <h3 className="font-semibold leading-snug text-off-black transition-colors hover:text-primary dark:text-off-white">
                {result.title}
              </h3>
              
              <p className="line-clamp-2 text-sm leading-relaxed text-warm-gray">
                {result.highlightedText || result.description}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmarkToggle?.(result);
                }}
                className="size-8 p-1"
              >
                <LucideIcon 
                  icon={Bookmark} 
                  size="xs" 
                  className={cn(
                    result.isBookmarked ? "fill-current text-primary" : "text-warm-gray"
                  )} 
                />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare?.(result);
                }}
                className="size-8 p-1"
              >
                <LucideIcon icon={Share} size="xs" className="text-warm-gray" />
              </Button>
            </div>
          </div>

          {/* Tags */}
          {result.tags && result.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {result.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-light-gray px-2 py-1 text-xs text-warm-gray dark:bg-warm-gray/20"
                >
                  {tag}
                </span>
              ))}
              {result.tags.length > 3 && (
                <span className="py-1 text-xs text-warm-gray">
                  +{result.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-warm-gray">
            <div className="flex items-center gap-4">
              {result.author && (
                <div className="flex items-center gap-2">
                  {result.author.avatar ? (
                    <img
                      src={result.author.avatar}
                      alt={result.author.name}
                      className="size-4 rounded-full"
                    />
                  ) : (
                    <LucideIcon icon={User} size="xs" />
                  )}
                  <span>{result.author.name}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <LucideIcon icon={Calendar} size="xs" />
                <span>{formatDate(result.date)}</span>
              </div>
            </div>

            {result.metadata && (
              <div className="flex items-center gap-3">
                {result.metadata.views && (
                  <div className="flex items-center gap-1">
                    <LucideIcon icon={Eye} size="xs" />
                    <span>{result.metadata.views.toLocaleString()}</span>
                  </div>
                )}
                {result.metadata.likes && (
                  <div className="flex items-center gap-1">
                    <LucideIcon icon={Heart} size="xs" />
                    <span>{result.metadata.likes}</span>
                  </div>
                )}
                {result.metadata.downloads && (
                  <div className="flex items-center gap-1">
                    <LucideIcon icon={Download} size="xs" />
                    <span>{result.metadata.downloads}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </article>
    );
  };

  const renderFilters = () => {
    if (!filters) return null;

    return (
      <div className={cn(
        "space-y-6 rounded-lg bg-light-gray/50 p-4 dark:bg-warm-gray/10",
        showFiltersPanel ? "block" : "hidden lg:block"
      )}>
        {Object.entries(filters).map(([filterType, filterOptions]) => (
          <div key={filterType} className="space-y-3">
            <h3 className="font-medium capitalize text-off-black dark:text-off-white">
              {filterType.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <div className="space-y-2">
              {filterOptions.map((option) => (
                <label key={option.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={activeFilters[filterType]?.includes(option.value) || false}
                    onChange={(e) => {
                      const currentValues = activeFilters[filterType] || [];
                      const newValues = e.target.checked
                        ? [...currentValues, option.value]
                        : currentValues.filter(v => v !== option.value);
                      onFilterChange?.(filterType, newValues);
                    }}
                    className="rounded border-light-gray dark:border-warm-gray/30"
                  />
                  <span className="text-warm-gray">
                    {option.label}
                    {option.count && (
                      <span className="ml-1 text-xs">({option.count})</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("min-h-screen bg-off-white py-8 dark:bg-off-black", className)} {...props}>
      <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LucideIcon icon={Search} size="sm" className="text-warm-gray" />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={searchPlaceholder}
              className={cn(
                "w-full rounded-lg border border-light-gray py-3 pl-10 pr-4 dark:border-warm-gray/30",
                "bg-off-white text-off-black dark:bg-off-black dark:text-off-white",
                "placeholder:text-warm-gray",
                "focus:border-primary focus:ring-2 focus:ring-primary/20",
                "transition-colors"
              )}
            />
          </form>

          {/* Search Stats */}
          {showStats && (
            <div className="flex items-center justify-between gap-4 text-sm text-warm-gray">
              <div>
                {totalResults.toLocaleString()} results for &ldquo;{query}&rdquo;
                {searchTime && (
                  <span className="ml-2">({searchTime.toFixed(2)}s)</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {showFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className="lg:hidden"
              >
                <LucideIcon icon={Filter} size="xs" className="mr-2" />
                Filters
                <LucideIcon icon={ChevronDown} size="xs" className="ml-2" />
              </Button>
            )}

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-warm-gray">Sort by:</span>
              {["relevance", "date", "popularity", "title"].map((option) => (
                <Button
                  key={option}
                  variant={sortBy === option ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => handleSortChange(option)}
                  className="capitalize"
                >
                  {option}
                  {sortBy === option && (
                    <LucideIcon 
                      icon={sortOrder === "asc" ? SortAsc : SortDesc} 
                      size="xs" 
                      className="ml-1" 
                    />
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            <Button
              variant={currentViewMode === "list" ? "primary" : "ghost"}
              size="sm"
              onClick={() => handleViewModeChange("list")}
            >
              <LucideIcon icon={List} size="xs" />
            </Button>
            <Button
              variant={currentViewMode === "grid" ? "primary" : "ghost"}
              size="sm"
              onClick={() => handleViewModeChange("grid")}
            >
              <LucideIcon icon={Grid} size="xs" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className={cn(
          "grid gap-6",
          showFilters ? "lg:grid-cols-4" : "grid-cols-1"
        )}>
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              {renderFilters()}
            </div>
          )}

          {/* Results */}
          <div className={cn(
            showFilters ? "lg:col-span-3" : "col-span-1"
          )}>
            {results.length > 0 ? (
              <div className={cn(
                "space-y-4",
                currentViewMode === "grid" && "grid grid-cols-1 gap-6 space-y-0 md:grid-cols-2"
              )}>
                {results.map(renderResultCard)}
              </div>
            ) : (
              <div className="py-12 text-center text-warm-gray">
                <LucideIcon icon={Search} size="xl" className="mx-auto mb-4 opacity-50" />
                <h3 className="mb-2 text-lg font-medium">{emptyStateTitle}</h3>
                <p>{emptyStateMessage}</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange?.(currentPage - 1)}
            >
              Previous
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "primary" : "ghost"}
                size="sm"
                onClick={() => onPageChange?.(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}