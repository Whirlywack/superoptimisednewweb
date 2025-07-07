"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface BlogPostCardProps {
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
  className?: string;
}

export function BlogPostCard({
  title,
  excerpt,
  slug,
  publishedAt,
  readingTime,
  featured = false,
  communityImpact,
  className,
}: BlogPostCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatReadingTime = (minutes?: number) => {
    if (!minutes) return null;
    return `${minutes} min read`;
  };

  return (
    <article
      className={cn(
        "group mb-component",
        "rounded-lg border-2 border-light-gray p-lg",
        "bg-off-white transition-all duration-200",
        "hover:translate-y-[-2px] hover:border-primary",
        featured && "border-primary",
        className
      )}
    >
      {/* Post Header */}
      <div className="mb-md">
        <div className="mb-sm flex items-start justify-between gap-md">
          <h3 className="text-lg font-semibold leading-tight text-off-black">
            <Link
              href={`/journey/${slug}`}
              className="transition-colors duration-200 hover:text-primary"
            >
              {title}
            </Link>
          </h3>

          {/* Post Meta */}
          <div className="flex shrink-0 items-center gap-sm font-mono text-sm text-warm-gray">
            <time dateTime={publishedAt.toISOString()}>{formatDate(publishedAt)}</time>
            {featured && (
              <>
                <span>•</span>
                <span className="font-medium text-primary">Featured</span>
              </>
            )}
          </div>
        </div>

        {/* Post Excerpt */}
        <p
          className="mb-md text-base leading-relaxed text-warm-gray"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {excerpt}
        </p>
      </div>

      {/* Community Impact */}
      {communityImpact && Object.values(communityImpact).some((val) => val && val > 0) && (
        <div className="mb-md rounded bg-light-gray p-md">
          <div className="mb-sm text-sm font-medium text-primary">Community Impact</div>
          <div className="flex gap-lg font-mono text-sm text-warm-gray">
            {communityImpact.votes && communityImpact.votes > 0 && (
              <span>📊 {communityImpact.votes} votes</span>
            )}
            {communityImpact.comments && communityImpact.comments > 0 && (
              <span>💬 {communityImpact.comments} comments</span>
            )}
            {communityImpact.shares && communityImpact.shares > 0 && (
              <span>🔄 {communityImpact.shares} shares</span>
            )}
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center justify-between">
        <Link
          href={`/journey/${slug}`}
          className="font-medium text-primary transition-all duration-200 hover:underline"
        >
          Read full post →
        </Link>

        {readingTime && (
          <span className="font-mono text-sm text-warm-gray">{formatReadingTime(readingTime)}</span>
        )}
      </div>
    </article>
  );
}
