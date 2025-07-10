import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import { Tag } from "@/components/ui/Tag";
import { 
  Calendar,
  Clock,
  ArrowRight,
  Circle,
  CheckCircle2,
  Star,
  MessageCircle,
  Heart,
  Folder,
  TrendingUp,
  AlertCircle,
  Zap
} from "lucide-react";

interface TimelinePost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  readingTime: string;
  project?: string;
  tags?: string[];
  type?: "milestone" | "update" | "learning" | "challenge" | "announcement";
  featured?: boolean;
  status?: "published" | "draft";
  engagementCount?: number;
  responseCount?: number;
}

interface TimelineGroup {
  label: string;
  posts: TimelinePost[];
}

interface JourneyTimelineProps extends React.HTMLAttributes<HTMLElement> {
  posts?: TimelinePost[];
  groupedPosts?: TimelineGroup[];
  variant?: "default" | "compact" | "detailed" | "minimal";
  groupBy?: "month" | "project" | "type" | "none";
  showConnector?: boolean;
  showEngagement?: boolean;
  showTags?: boolean;
  showExcerpt?: boolean;
  maxPostsPerGroup?: number;
  onPostClick?: (post: TimelinePost) => void;
  className?: string;
}

export function JourneyTimeline({
  posts = [],
  groupedPosts,
  variant = "default",
  groupBy = "month",
  showConnector = true,
  showEngagement = true,
  showTags = true,
  showExcerpt = true,
  maxPostsPerGroup,
  onPostClick,
  className,
  ...props
}: JourneyTimelineProps) {
  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "milestone":
        return CheckCircle2;
      case "learning":
        return TrendingUp;
      case "challenge":
        return AlertCircle;
      case "announcement":
        return Zap;
      default:
        return Circle;
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "milestone":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "learning":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
      case "challenge":
        return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20";
      case "announcement":
        return "text-primary bg-primary/10";
      default:
        return "text-warm-gray bg-light-gray dark:bg-warm-gray/20";
    }
  };

  const groupPosts = (posts: TimelinePost[]): TimelineGroup[] => {
    if (groupBy === "none") {
      return [{ label: "", posts }];
    }

    const groups: Record<string, TimelinePost[]> = {};

    posts.forEach(post => {
      let key = "";
      
      switch (groupBy) {
        case "month":
          const date = new Date(post.date);
          key = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
          break;
        case "project":
          key = post.project || "Other";
          break;
        case "type":
          key = post.type || "update";
          key = key.charAt(0).toUpperCase() + key.slice(1) + "s";
          break;
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(post);
    });

    return Object.entries(groups).map(([label, posts]) => ({
      label,
      posts: maxPostsPerGroup ? posts.slice(0, maxPostsPerGroup) : posts,
    }));
  };

  const displayGroups = groupedPosts || groupPosts(posts);

  const renderPost = (post: TimelinePost, index: number, isLast: boolean) => {
    const TypeIcon = getTypeIcon(post.type);

    if (variant === "minimal") {
      return (
        <div
          key={post.id}
          className="group flex cursor-pointer items-start gap-3"
          onClick={() => onPostClick?.(post)}
        >
          <div className={cn(
            "mt-2 size-2 shrink-0 rounded-full",
            post.featured ? "bg-primary" : "bg-warm-gray"
          )} />
          
          <div className="flex-1 space-y-1">
            <Link
              href={`/journey/${post.slug}`}
              className="block no-underline transition-colors group-hover:text-primary"
            >
              <h4 className="font-medium text-off-black dark:text-off-white">
                {post.title}
              </h4>
            </Link>
            <div className="flex items-center gap-3 text-xs text-warm-gray">
              <span>{post.date}</span>
              <span>{post.readingTime}</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={post.id}
        className={cn(
          "relative flex gap-4",
          !isLast && showConnector && "pb-6"
        )}
      >
        {/* Connector Line */}
        {showConnector && (
          <div className="absolute bottom-0 left-5 top-10 w-0.5 bg-light-gray dark:bg-warm-gray/30" />
        )}

        {/* Icon */}
        <div className={cn(
          "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full",
          getTypeColor(post.type)
        )}>
          <LucideIcon icon={TypeIcon} size="sm" />
          {post.featured && (
            <div className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary">
              <LucideIcon icon={Star} size="xs" className="text-off-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className={cn(
            "group flex-1 cursor-pointer",
            variant === "detailed" && "rounded-lg border border-light-gray bg-off-white p-4 dark:border-warm-gray/30 dark:bg-off-black",
            variant === "compact" && "pb-2"
          )}
          onClick={() => onPostClick?.(post)}
        >
          {/* Header */}
          <div className="space-y-2">
            <Link
              href={`/journey/${post.slug}`}
              className="block no-underline"
            >
              <h3 className={cn(
                "font-semibold text-off-black transition-colors group-hover:text-primary dark:text-off-white",
                variant === "compact" ? "text-base" : "text-lg"
              )}>
                {post.title}
              </h3>
            </Link>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-warm-gray">
              <div className="flex items-center gap-1">
                <LucideIcon icon={Calendar} size="xs" />
                <time dateTime={post.date}>{post.date}</time>
              </div>
              
              <div className="flex items-center gap-1">
                <LucideIcon icon={Clock} size="xs" />
                <span>{post.readingTime}</span>
              </div>
              
              {post.project && (
                <div className="flex items-center gap-1">
                  <LucideIcon icon={Folder} size="xs" />
                  <span>{post.project}</span>
                </div>
              )}

              {post.status === "draft" && (
                <span className="text-xs italic">Draft</span>
              )}
            </div>
          </div>

          {/* Excerpt */}
          {showExcerpt && variant !== "compact" && (
            <p className={cn(
              "mt-2 text-warm-gray",
              variant === "detailed" ? "line-clamp-3" : "line-clamp-2"
            )}>
              {post.excerpt}
            </p>
          )}

          {/* Footer */}
          {(showTags || showEngagement) && (
            <div className="mt-3 flex items-end justify-between gap-4">
              {/* Tags */}
              {showTags && post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, variant === "compact" ? 2 : 3).map(tag => (
                    <Tag key={tag} size="sm" variant="secondary">
                      {tag}
                    </Tag>
                  ))}
                  {post.tags.length > 3 && variant !== "compact" && (
                    <Tag size="sm" variant="secondary">
                      +{post.tags.length - 3}
                    </Tag>
                  )}
                </div>
              )}

              {/* Engagement */}
              {showEngagement && (post.engagementCount || post.responseCount) && (
                <div className="flex items-center gap-3 text-xs text-warm-gray">
                  {(post.engagementCount || 0) > 0 && (
                    <div className="flex items-center gap-1">
                      <LucideIcon icon={Heart} size="xs" />
                      <span>{post.engagementCount}</span>
                    </div>
                  )}
                  {(post.responseCount || 0) > 0 && (
                    <div className="flex items-center gap-1">
                      <LucideIcon icon={MessageCircle} size="xs" />
                      <span>{post.responseCount}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Read More Link */}
          {variant === "detailed" && (
            <div className="mt-3 border-t border-light-gray pt-3 dark:border-warm-gray/30">
              <Link
                href={`/journey/${post.slug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary no-underline transition-colors hover:text-primary/80"
              >
                Read full post
                <LucideIcon icon={ArrowRight} size="xs" />
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn("space-y-8", className)}
      {...props}
    >
      {displayGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-4">
          {/* Group Label */}
          {group.label && (
            <h2 className="text-xl font-semibold text-off-black dark:text-off-white">
              {group.label}
            </h2>
          )}

          {/* Posts */}
          <div className={variant === "minimal" ? "space-y-3" : "space-y-0"}>
            {group.posts.map((post, index) => 
              renderPost(post, index, index === group.posts.length - 1)
            )}
          </div>

          {/* View More */}
          {maxPostsPerGroup && posts.length > maxPostsPerGroup && (
            <div className="pl-14">
              <Link
                href="/journey"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                View all posts in {group.label}
                <LucideIcon icon={ArrowRight} size="xs" />
              </Link>
            </div>
          )}
        </div>
      ))}

      {/* Load More */}
      {posts.length === 0 && (
        <div className="py-8 text-center text-warm-gray">
          <p>No posts yet. The journey begins soon!</p>
        </div>
      )}
    </div>
  );
}