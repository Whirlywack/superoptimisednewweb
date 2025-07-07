"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useProjectTimeline } from "@/hooks/useProjectTimeline";
import { PhaseHeader } from "./PhaseHeader";
import { BlogPostCard } from "./BlogPostCard";

interface Phase {
  id: string;
  number: number;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "upcoming";
  completionPercentage: number;
  completedDate?: Date;
  posts: BlogPost[];
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: Date;
  readingTime?: number;
  featured?: boolean;
  communityImpact?: {
    votes?: number;
    comments?: number;
    shares?: number;
  };
}

interface JourneyPostsTimelineProps extends React.HTMLAttributes<HTMLElement> {
  showUpcoming?: boolean;
  variant?: "default" | "compact";
  maxItems?: number;
  className?: string;
}

export function JourneyPostsTimeline({
  showUpcoming = true,
  variant: _variant = "default",
  maxItems: _maxItems = 20,
  className,
  ...props
}: JourneyPostsTimelineProps) {
  const { data: blogData, isLoading: blogLoading } = useBlogPosts({
    postType: "journey",
    limit: 50, // Get more posts to group by phases
    status: "published",
  });

  const { data: timelineData, isLoading: timelineLoading } = useProjectTimeline();

  const isLoading = blogLoading || timelineLoading;

  // Phase definitions based on timeline data
  const getPhaseDefinitions = (): Omit<Phase, "posts">[] => {
    if (!timelineData?.events) return [];

    const phases = timelineData.events
      .filter((event) => event.type === "phase")
      .map((event) => ({
        id: event.id,
        number: parseInt(event.id.replace("phase-", "")) || 0,
        title: event.title.replace(/^Phase \d+:\s*/, ""),
        description: event.description,
        status: event.status as "completed" | "in_progress" | "upcoming",
        completionPercentage: event.completionPercentage || 0,
        completedDate: event.date && event.status === "completed" ? event.date : undefined,
      }))
      .sort((a, b) => a.number - b.number);

    return phases;
  };

  // Group posts by phase based on content or dates
  const groupPostsByPhase = (posts: unknown[], phases: Omit<Phase, "posts">[]): Phase[] => {
    if (!posts?.length) {
      return phases.map((phase) => ({ ...phase, posts: [] }));
    }

    const phasesWithPosts = phases.map((phase) => {
      // Simple heuristic: group posts by keywords in title or by date ranges
      const phasePosts = posts
        .filter((post: any) => {
          const title = post.title.toLowerCase();
          const phaseTitle = phase.title.toLowerCase();

          // Match by keywords in title
          if (
            phaseTitle.includes("foundation") &&
            (title.includes("foundation") || title.includes("public"))
          )
            return true;
          if (
            phaseTitle.includes("real-time") &&
            (title.includes("real-time") || title.includes("websocket"))
          )
            return true;
          if (
            phaseTitle.includes("frontend") &&
            (title.includes("frontend") || title.includes("integration"))
          )
            return true;
          if (phaseTitle.includes("xp") && (title.includes("xp") || title.includes("engagement")))
            return true;
          if (
            phaseTitle.includes("content") &&
            (title.includes("content") || title.includes("cms") || title.includes("seo"))
          )
            return true;

          return false;
        })
        .map((post: any) => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt || `Read about ${post.title.toLowerCase()}...`,
          slug: post.slug,
          publishedAt: new Date(post.publishedAt),
          readingTime: post.readingTime,
          featured: post.featured,
          communityImpact: {
            votes: Math.floor(Math.random() * 50) + 5, // Mock data - replace with real metrics
            comments: Math.floor(Math.random() * 20) + 2,
            shares: Math.floor(Math.random() * 15) + 1,
          },
        }));

      return {
        ...phase,
        posts: phasePosts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()),
      };
    });

    return phasesWithPosts;
  };

  // Get phases with grouped posts
  const getPhasesWithPosts = (): Phase[] => {
    const phaseDefinitions = getPhaseDefinitions();
    const posts = blogData?.posts || [];
    return groupPostsByPhase(posts, phaseDefinitions);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)} {...props}>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-off-black">Journey Timeline</h2>
          <div className="text-warm-gray">Loading journey posts...</div>
        </div>
        <div className="space-y-lg">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-md">
              <div className="h-6 w-1/3 animate-pulse rounded bg-light-gray" />
              <div className="space-y-md">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="animate-pulse rounded-lg border-2 border-light-gray p-lg">
                    <div className="mb-sm h-4 w-3/4 rounded bg-light-gray" />
                    <div className="mb-xs h-3 w-full rounded bg-light-gray" />
                    <div className="h-3 w-2/3 rounded bg-light-gray" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const phasesWithPosts = getPhasesWithPosts();

  const renderPhase = (phase: Phase) => {
    if (!showUpcoming && phase.status === "upcoming") {
      return null;
    }

    return (
      <div key={phase.id} className="mb-2xl">
        {/* Phase Header */}
        <PhaseHeader
          phaseNumber={phase.number}
          title={phase.title}
          status={phase.status}
          completionPercentage={phase.completionPercentage}
          description={phase.description}
          completedDate={phase.completedDate}
        />

        {/* Phase Posts */}
        <div className="space-y-component">
          {phase.posts.length > 0 ? (
            phase.posts.map((post) => (
              <BlogPostCard
                key={post.id}
                title={post.title}
                excerpt={post.excerpt}
                slug={post.slug}
                publishedAt={post.publishedAt}
                readingTime={post.readingTime}
                featured={post.featured}
                communityImpact={post.communityImpact}
              />
            ))
          ) : (
            <div className="rounded-lg border-2 border-light-gray p-lg text-center text-warm-gray">
              <p className="mb-sm text-base">
                {phase.status === "upcoming"
                  ? "Posts coming soon..."
                  : "No posts available for this phase yet."}
              </p>
              {phase.status === "in_progress" && (
                <p className="text-sm">Follow along as we document this phase of the journey.</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("space-y-section", className)} {...props}>
      {/* Header */}
      <div className="space-y-md">
        <h2 className="text-2xl font-bold text-off-black">Building Journey</h2>
        <div className="flex items-center gap-lg text-sm text-warm-gray">
          <div className="flex items-center gap-sm">
            <div className="size-3 rounded-full bg-primary" />
            <span className="font-mono">
              {timelineData?.progress
                ? `${timelineData.progress.overallPercentage}% Complete`
                : "Loading..."}
            </span>
          </div>
          <div className="flex items-center gap-sm">
            <span>📝</span>
            <span className="font-mono">{blogData?.posts.length || 0} Journey Posts</span>
          </div>
          <div className="flex items-center gap-sm">
            <span>⚡</span>
            <span className="font-mono">
              {phasesWithPosts.filter((p) => p.status === "completed").length} Phases Complete
            </span>
          </div>
        </div>
        <p className="max-w-prose text-base text-warm-gray">
          Every decision documented. Community influence tracked. Lessons shared transparently.
          Follow the complete building journey from initial planning to launch.
        </p>
      </div>

      {/* Phase Groups */}
      <div className="space-y-section">{phasesWithPosts.map(renderPhase)}</div>

      {/* Footer */}
      {phasesWithPosts.length === 0 && (
        <div className="py-2xl text-center text-warm-gray">
          <p className="mb-sm text-lg">No journey content available yet.</p>
          <p className="text-base">Check back soon as we begin documenting the building process.</p>
        </div>
      )}
    </div>
  );
}
