import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import { 
  Download, 
  FileText, 
  Search, 
  Filter,
  ExternalLink,
  Calendar,
  User,
  Tag,
  Grid,
  List,
  ChevronDown,
  Star,
  Eye,
  BookOpen,
  Code,
  Video,
  Link as LinkIcon,
  Archive
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
  showCategories = true,
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
    const cats = Array.from(new Set(resources.map(r => r.category))).sort();
    return ["all", ...cats];
  }, [resources]);

  const types = React.useMemo(() => {
    const typeSet = Array.from(new Set(resources.map(r => r.type))).sort();
    return ["all", ...typeSet];
  }, [resources]);

  const filteredResources = React.useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch = !searchQuery.trim() || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
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
        className={cn(
          i < rating ? "text-primary" : "text-light-gray dark:text-warm-gray/30"
        )}
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
          "bg-off-white dark:bg-off-black border border-light-gray dark:border-warm-gray/30 rounded-lg p-6 space-y-4 hover:border-primary/50 transition-colors cursor-pointer",
          resource.featured && "ring-2 ring-primary/20",
          viewMode === "list" && "flex items-start gap-6 p-4"
        )}
      >
        {/* Icon and Header */}
        <div className={cn(
          "flex items-start gap-4",
          viewMode === "list" && "flex-shrink-0"
        )}>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <LucideIcon icon={TypeIcon} size="md" className="text-primary" />
          </div>
          
          <div className={cn(
            "space-y-2 flex-1",
            viewMode === "list" && "space-y-1"
          )}>
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn(
                "font-semibold text-off-black dark:text-off-white leading-snug",
                size === "sm" ? "text-base" : size === "md" ? "text-lg" : "text-xl",
                viewMode === "list" && "text-base"
              )}>
                {resource.title}
              </h3>
              
              {resource.featured && (
                <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                  Featured
                </div>
              )}
            </div>
            
            <p className={cn(
              "text-warm-gray leading-relaxed",
              size === "sm" ? "text-sm" : "text-base",
              viewMode === "list" && "text-sm line-clamp-2"
            )}>
              {resource.description}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className={cn(
          "space-y-3",
          viewMode === "list" && "space-y-2 flex-shrink-0"
        )}>
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
              <span className={cn(
                "font-medium capitalize",
                getDifficultyColor(resource.difficulty)
              )}>
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
                  className="bg-light-gray dark:bg-warm-gray/20 text-warm-gray px-2 py-1 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {resource.tags.length > 4 && (
                <span className="text-warm-gray text-xs">
                  +{resource.tags.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-light-gray dark:border-warm-gray/30">
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
                window.open(resource.externalUrl, '_blank');
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
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-light-gray dark:border-warm-gray/30 rounded-lg bg-off-white dark:bg-off-black text-off-black dark:text-off-white text-sm"
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
        <label className="text-sm font-medium text-off-black dark:text-off-white">
          Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-3 py-2 border border-light-gray dark:border-warm-gray/30 rounded-lg bg-off-white dark:bg-off-black text-off-black dark:text-off-white text-sm"
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        {(title || description) && (
          <div className="text-center space-y-4">
            {title && (
              <h2 className={cn(
                titleSizes[size],
                "font-bold text-off-black dark:text-off-white"
              )}>
                {title}
              </h2>
            )}
            {description && (
              <p className={cn(
                "text-warm-gray leading-relaxed max-w-3xl mx-auto",
                size === "lg" ? "text-lg" : "text-base"
              )}>
                {description}
              </p>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="space-y-4">
          {/* Search */}
          {showSearch && (
            <div className="relative max-w-2xl mx-auto">
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
                {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
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

          {/* Resources Grid */}
          <div className={cn(
            showFilters ? "lg:col-span-3" : "col-span-1"
          )}>
            {filteredResources.length > 0 ? (
              <div className={cn(
                "grid gap-6",
                viewMode === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              )}>
                {filteredResources.map(renderResourceCard)}
              </div>
            ) : (
              <div className="text-center py-12 text-warm-gray">
                <LucideIcon icon={Search} size="xl" className="mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No resources found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}