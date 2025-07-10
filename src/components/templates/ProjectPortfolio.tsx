import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import {
  Filter,
  Search,
  Grid,
  List,
  ChevronDown,
  Calendar,
  Code,
  Github,
  Globe,
  Star,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  Play,
  CheckCircle,
  AlertCircle,
  Pause,
  Lightbulb,
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  status: "planning" | "in-progress" | "completed" | "paused" | "archived";
  progress?: number;
  startDate: string;
  endDate?: string;
  estimatedCompletion?: string;
  category: string;
  technologies: string[];
  features: string[];
  links: {
    demo?: string;
    github?: string;
    documentation?: string;
    blog?: string;
  };
  stats: {
    stars?: number;
    forks?: number;
    downloads?: number;
    users?: number;
  };
  image?: string;
  featured?: boolean;
  buildingInPublic?: boolean;
  learnings?: string[];
  challenges?: string[];
}

interface ProjectPortfolioProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  projects: Project[];
  showFilters?: boolean;
  showSearch?: boolean;
  showStats?: boolean;
  viewMode?: "grid" | "list";
  searchPlaceholder?: string;
  onProjectClick?: (project: Project) => void;
  onFilterChange?: (filters: { category: string; status: string; technology: string }) => void;
  onSearch?: (query: string) => void;
  className?: string;
}

export function ProjectPortfolio({
  title = "Project Portfolio",
  description = "Explore our collection of projects built in public, showcasing transparent development, community feedback, and continuous learning.",
  projects,
  showFilters = true,
  showSearch = true,
  showStats = true,
  viewMode = "grid",
  searchPlaceholder = "Search projects...",
  onProjectClick,
  onFilterChange,
  onSearch,
  className,
  ...props
}: ProjectPortfolioProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentViewMode, setCurrentViewMode] = useState(viewMode);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    status: "all",
    technology: "all",
  });

  const categories = React.useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category))).sort();
    return ["all", ...cats];
  }, [projects]);

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "planning", label: "Planning" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "paused", label: "Paused" },
    { value: "archived", label: "Archived" },
  ];

  const technologies = React.useMemo(() => {
    const techs = Array.from(new Set(projects.flatMap((p) => p.technologies))).sort();
    return ["all", ...techs];
  }, [projects]);

  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        !searchQuery.trim() ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = filters.category === "all" || project.category === filters.category;
      const matchesStatus = filters.status === "all" || project.status === filters.status;
      const matchesTechnology =
        filters.technology === "all" || project.technologies.includes(filters.technology);

      return matchesSearch && matchesCategory && matchesStatus && matchesTechnology;
    });
  }, [projects, searchQuery, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "in-progress":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
      case "planning":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      case "paused":
        return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20";
      case "archived":
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
      default:
        return "text-warm-gray bg-light-gray dark:bg-warm-gray/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "in-progress":
        return Play;
      case "planning":
        return Lightbulb;
      case "paused":
        return Pause;
      case "archived":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const renderProjectCard = (project: Project) => {
    const StatusIcon = getStatusIcon(project.status);

    return (
      <article
        key={project.id}
        onClick={() => onProjectClick?.(project)}
        className={cn(
          "cursor-pointer overflow-hidden rounded-lg border border-light-gray bg-off-white transition-colors hover:border-primary/50 dark:border-warm-gray/30 dark:bg-off-black",
          project.featured && "ring-2 ring-primary/20",
          currentViewMode === "list" && "flex gap-6 p-6"
        )}
      >
        {/* Project Image */}
        {project.image && (
          <div
            className={cn(
              "relative aspect-video overflow-hidden bg-light-gray dark:bg-warm-gray/20",
              currentViewMode === "list" && "aspect-auto h-32 w-48 shrink-0"
            )}
          >
            <img src={project.image} alt={project.title} className="size-full object-cover" />
            {project.buildingInPublic && (
              <div className="absolute left-3 top-3 rounded bg-primary/90 px-2 py-1 text-xs font-medium text-off-white">
                Building in Public
              </div>
            )}
            {project.featured && (
              <div className="absolute right-3 top-3 rounded bg-yellow-500 px-2 py-1 text-xs font-medium text-off-white">
                Featured
              </div>
            )}
          </div>
        )}

        <div
          className={cn(
            "flex-1 space-y-4 p-6",
            !project.image && currentViewMode === "grid" && "pt-6"
          )}
        >
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold leading-snug text-off-black dark:text-off-white">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium capitalize",
                      getStatusColor(project.status)
                    )}
                  >
                    <LucideIcon icon={StatusIcon} size="xs" />
                    {project.status.replace("-", " ")}
                  </span>
                  <span className="text-xs text-warm-gray">{project.category}</span>
                </div>
              </div>

              {project.progress !== undefined && project.status === "in-progress" && (
                <div className="text-right">
                  <div className="text-sm font-medium text-off-black dark:text-off-white">
                    {project.progress}%
                  </div>
                  <div className="mt-1 h-2 w-16 rounded-full bg-light-gray dark:bg-warm-gray/30">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <p className="leading-relaxed text-warm-gray">{project.description}</p>
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded bg-light-gray px-2 py-1 text-xs text-warm-gray dark:bg-warm-gray/20"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="py-1 text-xs text-warm-gray">
                +{project.technologies.length - 4} more
              </span>
            )}
          </div>

          {/* Stats */}
          {showStats && Object.keys(project.stats).length > 0 && (
            <div className="flex items-center gap-4 text-sm text-warm-gray">
              {project.stats.stars && (
                <div className="flex items-center gap-1">
                  <LucideIcon icon={Star} size="xs" />
                  <span>{project.stats.stars}</span>
                </div>
              )}
              {project.stats.users && (
                <div className="flex items-center gap-1">
                  <LucideIcon icon={Users} size="xs" />
                  <span>{project.stats.users.toLocaleString()}</span>
                </div>
              )}
              {project.stats.downloads && (
                <div className="flex items-center gap-1">
                  <LucideIcon icon={TrendingUp} size="xs" />
                  <span>{project.stats.downloads.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          {/* Timeline */}
          <div className="flex items-center gap-4 text-sm text-warm-gray">
            <div className="flex items-center gap-1">
              <LucideIcon icon={Calendar} size="xs" />
              <span>Started {formatDate(project.startDate)}</span>
            </div>
            {project.endDate && (
              <div className="flex items-center gap-1">
                <span>•</span>
                <span>Completed {formatDate(project.endDate)}</span>
              </div>
            )}
            {project.estimatedCompletion && !project.endDate && (
              <div className="flex items-center gap-1">
                <span>•</span>
                <span>Est. {formatDate(project.estimatedCompletion)}</span>
              </div>
            )}
          </div>

          {/* Links */}
          <div className="flex items-center gap-3 border-t border-light-gray pt-2 dark:border-warm-gray/30">
            {project.links.demo && (
              <Link
                href={project.links.demo}
                external
                className="inline-flex items-center gap-1 text-sm font-medium text-primary no-underline"
              >
                <LucideIcon icon={Globe} size="xs" />
                Demo
              </Link>
            )}
            {project.links.github && (
              <Link
                href={project.links.github}
                external
                className="inline-flex items-center gap-1 text-sm font-medium text-primary no-underline"
              >
                <LucideIcon icon={Github} size="xs" />
                Code
              </Link>
            )}
            {project.links.documentation && (
              <Link
                href={project.links.documentation}
                external
                className="inline-flex items-center gap-1 text-sm font-medium text-primary no-underline"
              >
                <LucideIcon icon={Code} size="xs" />
                Docs
              </Link>
            )}
            {project.links.blog && (
              <Link
                href={project.links.blog}
                className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-primary no-underline"
              >
                Read More
                <LucideIcon icon={ArrowRight} size="xs" />
              </Link>
            )}
          </div>
        </div>
      </article>
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
          value={filters.category}
          onChange={(e) => handleFilterChange({ category: e.target.value })}
          className="w-full rounded-lg border border-light-gray bg-off-white px-3 py-2 text-sm text-off-black dark:border-warm-gray/30 dark:bg-off-black dark:text-off-white"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-off-black dark:text-off-white">Status</label>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange({ status: e.target.value })}
          className="w-full rounded-lg border border-light-gray bg-off-white px-3 py-2 text-sm text-off-black dark:border-warm-gray/30 dark:bg-off-black dark:text-off-white"
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Technology Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-off-black dark:text-off-white">Technology</label>
        <select
          value={filters.technology}
          onChange={(e) => handleFilterChange({ technology: e.target.value })}
          className="w-full rounded-lg border border-light-gray bg-off-white px-3 py-2 text-sm text-off-black dark:border-warm-gray/30 dark:bg-off-black dark:text-off-white"
        >
          {technologies.map((tech) => (
            <option key={tech} value={tech}>
              {tech === "all" ? "All Technologies" : tech}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleFilterChange({ category: "all", status: "all", technology: "all" })}
        className="w-full"
      >
        Clear Filters
      </Button>
    </div>
  );

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
                {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center gap-2">
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
        <div className={cn("grid gap-8", showFilters ? "lg:grid-cols-4" : "grid-cols-1")}>
          {/* Filters Sidebar */}
          {showFilters && <div className="lg:col-span-1">{renderFilters()}</div>}

          {/* Projects Grid */}
          <div className={cn(showFilters ? "lg:col-span-3" : "col-span-1")}>
            {filteredProjects.length > 0 ? (
              <div
                className={cn(
                  "gap-6",
                  currentViewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    : "flex flex-col space-y-6"
                )}
              >
                {filteredProjects.map(renderProjectCard)}
              </div>
            ) : (
              <div className="py-12 text-center text-warm-gray">
                <LucideIcon icon={Search} size="xl" className="mx-auto mb-4 opacity-50" />
                <h3 className="mb-2 text-lg font-medium">No projects found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
