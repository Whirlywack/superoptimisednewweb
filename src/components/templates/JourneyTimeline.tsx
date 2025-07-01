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
          "bg-off-white dark:bg-off-black border border-light-gray dark:border-warm-gray/30 rounded-lg p-6 space-y-4 hover:border-primary/50 transition-colors cursor-pointer",
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
            "absolute top-6 w-4 h-4 rounded-full border-2 border-primary bg-off-white dark:bg-off-black",
            post.milestone && "bg-primary border-primary",
            isLeft ? "-right-6 lg:-right-8" : "-left-6 lg:-left-8"
          )} />
        )}

        {/* Post Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <time className="text-sm text-warm-gray flex items-center gap-1">
                  <LucideIcon icon={Calendar} size="xs" />
                  {formatDate(post.publishedAt)}
                </time>
                
                <span className="text-sm text-warm-gray flex items-center gap-1">
                  <LucideIcon icon={Clock} size="xs" />
                  {post.readTime}
                </span>

                {post.status && (
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize",
                    getStatusColor(post.status)
                  )}>
                    {post.status}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-semibold text-off-black dark:text-off-white leading-snug">
                {post.title}
              </h3>
            </div>

            {post.milestone && (
              <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium flex-shrink-0">
                Milestone
              </div>
            )}
          </div>

          <p className="text-warm-gray leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Author */}
        <div className="flex items-center gap-3">
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-light-gray dark:bg-warm-gray/20 flex items-center justify-center">
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
                className="bg-light-gray dark:bg-warm-gray/20 text-warm-gray px-2 py-1 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 4 && (
              <span className="text-warm-gray text-xs py-1">
                +{post.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        {showStats && (
          <div className="flex items-center gap-4 text-sm text-warm-gray pt-2 border-t border-light-gray dark:border-warm-gray/30">
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
            
            <div className="flex items-center gap-1 ml-auto">
              <Link 
                href={post.href} 
                className="text-primary text-sm font-medium no-underline inline-flex items-center gap-1"
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
      "space-y-4 p-4 bg-light-gray/50 dark:bg-warm-gray/10 rounded-lg",
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
          className="w-full px-3 py-2 border border-light-gray dark:border-warm-gray/30 rounded-lg bg-off-white dark:bg-off-black text-off-black dark:text-off-white text-sm"
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
          className="w-full px-3 py-2 border border-light-gray dark:border-warm-gray/30 rounded-lg bg-off-white dark:bg-off-black text-off-black dark:text-off-white text-sm"
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
    <div className={cn("min-h-screen bg-off-white dark:bg-off-black py-8", className)} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-off-black dark:text-off-white">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-warm-gray max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Search */}
          {showSearch && (
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LucideIcon icon={Search} size="sm" className="text-warm-gray" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 border border-light-gray dark:border-warm-gray/30 rounded-lg",
                    "bg-off-white dark:bg-off-black text-off-black dark:text-off-white",
                    "placeholder:text-warm-gray",
                    "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                    "transition-colors"
                  )}
                />
              </form>
            </div>
          )}

          {/* Filter and View Controls */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
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
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-light-gray dark:bg-warm-gray/30 h-full" />
                )}
                
                <div className={cn(
                  "space-y-8",
                  currentViewMode === "grid" && "grid grid-cols-1 md:grid-cols-2 gap-6",
                  currentViewMode === "list" && "space-y-4",
                  currentViewMode === "timeline" && "relative"
                )}>
                  {posts.map((post, index) => renderPostCard(post, index))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-warm-gray">
                <LucideIcon icon={Search} size="xl" className="mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No posts found</h3>
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