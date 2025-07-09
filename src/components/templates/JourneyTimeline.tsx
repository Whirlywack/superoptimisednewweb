import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import { 
  Calendar, 
  Clock, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Grid,
  List,
  Tag,
  User,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  TrendingUp,
  Eye,
  ChevronDown,
  X
} from "lucide-react";

interface TimelinePost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  publishedAt: string;
  readTime: string;
  href: string;
  author: {
    name: string;
    avatar?: string;
  };
  tags: string[];
  stats: {
    views: number;
    likes: number;
    comments: number;
  };
  featured?: boolean;
  milestone?: boolean;
  status?: "published" | "draft" | "scheduled";
}

interface TimelineFilter {
  category: "all" | "milestone" | "update" | "feature" | "fix" | "learning";
  timeRange: "all" | "week" | "month" | "quarter" | "year";
  tag?: string;
}

interface JourneyTimelineProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  posts: TimelinePost[];
  currentPage?: number;
  totalPages?: number;
  postsPerPage?: number;
  showFilters?: boolean;
  showSearch?: boolean;
  showStats?: boolean;
  showPagination?: boolean;
  viewMode?: "timeline" | "grid" | "list";
  searchPlaceholder?: string;
  onPageChange?: (page: number) => void;
  onFilterChange?: (filters: TimelineFilter) => void;
  onSearch?: (query: string) => void;
  onPostClick?: (post: TimelinePost) => void;
  className?: string;
}

export function JourneyTimeline({
  title = "Building in Public Journey",
  description = "Follow our complete development journey with transparent updates, milestones, and learnings shared in real-time.",
  posts,
  currentPage = 1,
  totalPages = 1,
  postsPerPage = 10,
  showFilters = true,
  showSearch = true,
  showStats = true,
  showPagination = true,
  viewMode = "timeline",
  searchPlaceholder = "Search journey posts...",
  onPageChange,
  onFilterChange,
  onSearch,
  onPostClick,
  className,
  ...props
}: JourneyTimelineProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [filters, setFilters] = useState<TimelineFilter>({
    category: "all",
    timeRange: "all",
  });

  const categories = [
    { value: "all", label: "All Posts" },
    { value: "milestone", label: "Milestones" },
    { value: "update", label: "Updates" },
    { value: "feature", label: "Features" },
    { value: "fix", label: "Fixes" },
    { value: "learning", label: "Learnings" },
  ];

  const timeRanges = [
    { value: "all", label: "All Time" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleFilterChange = (newFilters: Partial<TimelineFilter>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "published":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "draft":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      case "scheduled":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
      default:
        return "text-warm-gray bg-light-gray dark:bg-warm-gray/20";
    }
  };

  const renderPostCard = (post: TimelinePost, index: number) => {
    const isLeft = index % 2 === 0;
    
    return (
      <article
        key={post.id}
        onClick={() => onPostClick?.(post)}
        className={cn(
          "cursor-pointer space-y-4 rounded-lg border border-light-gray bg-off-white p-6 transition-colors hover:border-primary/50 dark:border-warm-gray/30 dark:bg-off-black",
          post.featured && "ring-2 ring-primary/20",
          post.milestone && "border-primary bg-primary/5 dark:bg-primary/10",
          currentViewMode === "timeline" && "relative",
          currentViewMode === "timeline" && isLeft && "mr-8 lg:mr-12",
          currentViewMode === "timeline" && !isLeft && "ml-8 lg:ml-12"
        )}
      >
        {/* Timeline connector */}
        {currentViewMode === "timeline" && (
          <div className={cn(
            "absolute top-6 size-4 rounded-full border-2 border-primary bg-off-white dark:bg-off-black",
            post.milestone && "border-primary bg-primary",
            isLeft ? "-right-6 lg:-right-8" : "-left-6 lg:-left-8"
          )} />
        )}

        {/* Post Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <time className="flex items-center gap-1 text-sm text-warm-gray">
                  <LucideIcon icon={Calendar} size="xs" />
                  {formatDate(post.publishedAt)}
                </time>
                
                <span className="flex items-center gap-1 text-sm text-warm-gray">
                  <LucideIcon icon={Clock} size="xs" />
                  {post.readTime}
                </span>

                {post.status && (
                  <span className={cn(
                    "inline-flex items-center rounded px-2 py-1 text-xs font-medium capitalize",
                    getStatusColor(post.status)
                  )}>
                    {post.status}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-semibold leading-snug text-off-black dark:text-off-white">
                {post.title}
              </h3>
            </div>

            {post.milestone && (
              <div className="shrink-0 rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                Milestone
              </div>
            )}
          </div>

          <p className="leading-relaxed text-warm-gray">
            {post.excerpt}
          </p>
        </div>

        {/* Author */}
        <div className="flex items-center gap-3">
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-light-gray dark:bg-warm-gray/20">
              <LucideIcon icon={User} size="xs" className="text-warm-gray" />
            </div>
          )}
          <span className="text-sm text-warm-gray">by {post.author.name}</span>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded bg-light-gray px-2 py-1 text-xs text-warm-gray dark:bg-warm-gray/20"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 4 && (
              <span className="py-1 text-xs text-warm-gray">
                +{post.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        {showStats && (
          <div className="flex items-center gap-4 border-t border-light-gray pt-2 text-sm text-warm-gray dark:border-warm-gray/30">
            <div className="flex items-center gap-1">
              <LucideIcon icon={Eye} size="xs" />
              <span>{post.stats.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <LucideIcon icon={Heart} size="xs" />
              <span>{post.stats.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <LucideIcon icon={MessageCircle} size="xs" />
              <span>{post.stats.comments}</span>
            </div>
            
            <div className="ml-auto flex items-center gap-1">
              <Link 
                href={post.href} 
                className="inline-flex items-center gap-1 text-sm font-medium text-primary no-underline"
              >
                Read More
                <LucideIcon icon={ArrowRight} size="xs" />
              </Link>
            </div>
          </div>
        )}
      </article>
    );
  };

  const renderFilters = () => (
    <div className={cn(
      "space-y-4 rounded-lg bg-light-gray/50 p-4 dark:bg-warm-gray/10",
      showFiltersPanel ? "block" : "hidden lg:block"
    )}>
      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-off-black dark:text-off-white">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange({ category: e.target.value as any })}
          className="w-full rounded-lg border border-light-gray bg-off-white px-3 py-2 text-sm text-off-black dark:border-warm-gray/30 dark:bg-off-black dark:text-off-white"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Time Range Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-off-black dark:text-off-white">
          Time Range
        </label>
        <select
          value={filters.timeRange}
          onChange={(e) => handleFilterChange({ timeRange: e.target.value as any })}
          className="w-full rounded-lg border border-light-gray bg-off-white px-3 py-2 text-sm text-off-black dark:border-warm-gray/30 dark:bg-off-black dark:text-off-white"
        >
          {timeRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleFilterChange({ category: "all", timeRange: "all", tag: undefined })}
        className="w-full"
      >
        Clear Filters
      </Button>
    </div>
  );

  const renderPagination = () => {
    if (!showPagination || totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-warm-gray">
          Page {currentPage} of {totalPages} ({posts.length} posts)
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <LucideIcon icon={ChevronLeft} size="xs" className="mr-1" />
            Previous
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <LucideIcon icon={ChevronRight} size="xs" className="ml-1" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("min-h-screen bg-off-white py-8 dark:bg-off-black", className)} {...props}>
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold text-off-black dark:text-off-white lg:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-warm-gray">
              {description}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Search */}
          {showSearch && (
            <div className="mx-auto max-w-2xl">
              <form onSubmit={handleSearch} className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <LucideIcon icon={Search} size="sm" className="text-warm-gray" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
            </div>
          )}

          {/* Filter and View Controls */}
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
              
              <span className="text-sm text-warm-gray">
                {posts.length} post{posts.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={currentViewMode === "timeline" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setCurrentViewMode("timeline")}
              >
                <LucideIcon icon={TrendingUp} size="xs" />
              </Button>
              <Button
                variant={currentViewMode === "grid" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setCurrentViewMode("grid")}
              >
                <LucideIcon icon={Grid} size="xs" />
              </Button>
              <Button
                variant={currentViewMode === "list" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setCurrentViewMode("list")}
              >
                <LucideIcon icon={List} size="xs" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={cn(
          "grid gap-8",
          showFilters ? "lg:grid-cols-4" : "grid-cols-1"
        )}>
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              {renderFilters()}
            </div>
          )}

          {/* Posts */}
          <div className={cn(
            showFilters ? "lg:col-span-3" : "col-span-1"
          )}>
            {posts.length > 0 ? (
              <div className="space-y-8">
                {/* Timeline Line */}
                {currentViewMode === "timeline" && (
                  <div className="absolute left-1/2 hidden h-full w-0.5 -translate-x-1/2 bg-light-gray dark:bg-warm-gray/30 lg:block" />
                )}
                
                <div className={cn(
                  "space-y-8",
                  currentViewMode === "grid" && "grid grid-cols-1 gap-6 md:grid-cols-2",
                  currentViewMode === "list" && "space-y-4",
                  currentViewMode === "timeline" && "relative"
                )}>
                  {posts.map((post, index) => renderPostCard(post, index))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-warm-gray">
                <LucideIcon icon={Search} size="xl" className="mx-auto mb-4 opacity-50" />
                <h3 className="mb-2 text-lg font-medium">No posts found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
}