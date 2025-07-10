import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import {
  Download,
  FileText,
  Search,
  Filter,
  ExternalLink,
  Calendar,
  User,
  Grid,
  List,
  ChevronDown,
  Star,
  Eye,
  BookOpen,
  Code,
  Video,
  Link as LinkIcon,
  Archive,
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "document" | "template" | "guide" | "code" | "video" | "link" | "tool";
  category: string;
  author?: string;
  date?: string;
  downloadUrl?: string;
  externalUrl?: string;
  fileSize?: string;
  format?: string;
  tags?: string[];
  featured?: boolean;
  views?: number;
  downloads?: number;
  rating?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  estimatedTime?: string;
}

interface ResourceLibraryProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  resources: Resource[];
  variant?: "default" | "grid" | "list" | "compact";
  size?: "sm" | "md" | "lg";
  showSearch?: boolean;
  showFilters?: boolean;
  showCategories?: boolean;
  searchPlaceholder?: string;
  onResourceClick?: (resource: Resource) => void;
  onDownload?: (resource: Resource) => void;
  className?: string;
}

export function ResourceLibrary({
  title = "Resource Library",
  description,
  resources,
  variant = "default",
  size = "md",
  showSearch = true,
  showFilters = true,
  showCategories: _showCategories = true,
  searchPlaceholder = "Search resources...",
  onResourceClick,
  onDownload,
  className,
  ...props
}: ResourceLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">(variant === "list" ? "list" : "grid");
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const sizeClasses = {
    sm: "py-6",
    md: "py-8",
    lg: "py-12",
  };

  const titleSizes = {
    sm: "text-xl",
    md: "text-2xl lg:text-3xl",
    lg: "text-3xl lg:text-4xl",
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return FileText;
      case "template":
        return Archive;
      case "guide":
        return BookOpen;
      case "code":
        return Code;
      case "video":
        return Video;
      case "link":
        return LinkIcon;
      case "tool":
        return Download;
      default:
        return FileText;
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-primary";
      case "intermediate":
        return "text-warm-gray";
      case "advanced":
        return "text-off-black dark:text-off-white";
      default:
        return "text-warm-gray";
    }
  };

  const categories = React.useMemo(() => {
    const cats = Array.from(new Set(resources.map((r) => r.category))).sort();
    return ["all", ...cats];
  }, [resources]);

  const types = React.useMemo(() => {
    const typeSet = Array.from(new Set(resources.map((r) => r.type))).sort();
    return ["all", ...typeSet];
  }, [resources]);

  const filteredResources = React.useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        !searchQuery.trim() ||
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
      const matchesType = selectedType === "all" || resource.type === selectedType;

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [resources, searchQuery, selectedCategory, selectedType]);

  const handleResourceClick = (resource: Resource) => {
    if (onResourceClick) {
      onResourceClick(resource);
    }
  };

  const handleDownload = (resource: Resource, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(resource);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <LucideIcon
        key={i}
        icon={Star}
        size="xs"
        className={cn(i < rating ? "text-primary" : "text-light-gray dark:text-warm-gray/30")}
      />
    ));
  };

  const renderResourceCard = (resource: Resource) => {
    const TypeIcon = getTypeIcon(resource.type);

    return (
      <div
        key={resource.id}
        onClick={() => handleResourceClick(resource)}
        className={cn(
          "cursor-pointer space-y-4 rounded-lg border border-light-gray bg-off-white p-6 transition-colors hover:border-primary/50 dark:border-warm-gray/30 dark:bg-off-black",
          resource.featured && "ring-2 ring-primary/20",
          viewMode === "list" && "flex items-start gap-6 p-4"
        )}
      >
        {/* Icon and Header */}
        <div className={cn("flex items-start gap-4", viewMode === "list" && "shrink-0")}>
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <LucideIcon icon={TypeIcon} size="md" className="text-primary" />
          </div>

          <div className={cn("flex-1 space-y-2", viewMode === "list" && "space-y-1")}>
            <div className="flex items-start justify-between gap-2">
              <h3
                className={cn(
                  "font-semibold leading-snug text-off-black dark:text-off-white",
                  size === "sm" ? "text-base" : size === "md" ? "text-lg" : "text-xl",
                  viewMode === "list" && "text-base"
                )}
              >
                {resource.title}
              </h3>

              {resource.featured && (
                <div className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  Featured
                </div>
              )}
            </div>

            <p
              className={cn(
                "leading-relaxed text-warm-gray",
                size === "sm" ? "text-sm" : "text-base",
                viewMode === "list" && "line-clamp-2 text-sm"
              )}
            >
              {resource.description}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className={cn("space-y-3", viewMode === "list" && "shrink-0 space-y-2")}>
          <div className="flex flex-wrap items-center gap-4 text-sm text-warm-gray">
            {resource.author && (
              <div className="flex items-center gap-1">
                <LucideIcon icon={User} size="xs" />
                <span>{resource.author}</span>
              </div>
            )}

            {resource.date && (
              <div className="flex items-center gap-1">
                <LucideIcon icon={Calendar} size="xs" />
                <span>{resource.date}</span>
              </div>
            )}

            {resource.estimatedTime && (
              <div className="flex items-center gap-1">
                <LucideIcon icon={Eye} size="xs" />
                <span>{resource.estimatedTime}</span>
              </div>
            )}

            {resource.difficulty && (
              <span
                className={cn("font-medium capitalize", getDifficultyColor(resource.difficulty))}
              >
                {resource.difficulty}
              </span>
            )}
          </div>

          {/* Stats */}
          {(resource.views || resource.downloads || resource.rating) && (
            <div className="flex items-center gap-4 text-sm text-warm-gray">
              {resource.rating && (
                <div className="flex items-center gap-1">
                  {renderStars(resource.rating)}
                  <span className="ml-1">{resource.rating}/5</span>
                </div>
              )}

              {resource.views && (
                <div className="flex items-center gap-1">
                  <LucideIcon icon={Eye} size="xs" />
                  <span>{resource.views}</span>
                </div>
              )}

              {resource.downloads && (
                <div className="flex items-center gap-1">
                  <LucideIcon icon={Download} size="xs" />
                  <span>{resource.downloads}</span>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {resource.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-light-gray px-2 py-1 text-xs text-warm-gray dark:bg-warm-gray/20"
                >
                  {tag}
                </span>
              ))}
              {resource.tags.length > 4 && (
                <span className="text-xs text-warm-gray">+{resource.tags.length - 4} more</span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 border-t border-light-gray pt-2 dark:border-warm-gray/30">
          {resource.downloadUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => handleDownload(resource, e)}
              className="flex-1"
            >
              <LucideIcon icon={Download} size="xs" className="mr-2" />
              Download
              {resource.fileSize && <span className="ml-2 text-xs">({resource.fileSize})</span>}
            </Button>
          )}

          {resource.externalUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(resource.externalUrl, "_blank");
              }}
            >
              <LucideIcon icon={ExternalLink} size="xs" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderFilters = () => (
    <div
      className={cn(
        "space-y-4 rounded-lg bg-light-gray/50 p-4 dark:bg-warm-gray/10",
        showFiltersPanel ? "block" : "hidden lg:block"
      )}
    >
      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-off-black dark:text-off-white">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full rounded-lg border border-light-gray bg-off-white px-3 py-2 text-sm text-off-black dark:border-warm-gray/30 dark:bg-off-black dark:text-off-white"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>
      </div>

      {/* Type Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-off-black dark:text-off-white">Type</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full rounded-lg border border-light-gray bg-off-white px-3 py-2 text-sm text-off-black dark:border-warm-gray/30 dark:bg-off-black dark:text-off-white"
        >
          {types.map((type) => (
            <option key={type} value={type}>
              {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className={cn(sizeClasses[size], className)} {...props}>
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        {(title || description) && (
          <div className="space-y-4 text-center">
            {title && (
              <h2 className={cn(titleSizes[size], "font-bold text-off-black dark:text-off-white")}>
                {title}
              </h2>
            )}
            {description && (
              <p
                className={cn(
                  "mx-auto max-w-3xl leading-relaxed text-warm-gray",
                  size === "lg" ? "text-lg" : "text-base"
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="space-y-4">
          {/* Search */}
          {showSearch && (
            <div className="relative mx-auto max-w-2xl">
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
                {filteredResources.length} resource{filteredResources.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <LucideIcon icon={Grid} size="xs" />
              </Button>
              <Button
                variant={viewMode === "list" ? "primary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <LucideIcon icon={List} size="xs" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={cn("grid gap-8", showFilters ? "lg:grid-cols-4" : "grid-cols-1")}>
          {/* Filters Sidebar */}
          {showFilters && <div className="lg:col-span-1">{renderFilters()}</div>}

          {/* Resources Grid */}
          <div className={cn(showFilters ? "lg:col-span-3" : "col-span-1")}>
            {filteredResources.length > 0 ? (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                )}
              >
                {filteredResources.map(renderResourceCard)}
              </div>
            ) : (
              <div className="py-12 text-center text-warm-gray">
                <LucideIcon icon={Search} size="xl" className="mx-auto mb-4 opacity-50" />
                <h3 className="mb-2 text-lg font-medium">No resources found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
