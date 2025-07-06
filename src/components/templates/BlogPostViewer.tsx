"use client";

import React from "react";
import { MarkdownRenderer } from "@/components/organisms/MarkdownRenderer";
import { LucideIcon } from "@/components/ui/Icon";
import { Calendar, Clock, User } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author?: {
    name: string;
    email: string;
  };
  publishedAt: string;
  postType: "blog" | "journey" | "announcement";
  featured: boolean;
  slug: string;
}

interface BlogPostViewerProps {
  post: BlogPost;
  variant?: "full" | "preview";
  className?: string;
}

export function BlogPostViewer({ post, variant = "full", className }: BlogPostViewerProps) {
  const publishedDate = new Date(post.publishedAt);
  
  const estimatedReadTime = Math.ceil(post.content.split(" ").length / 200); // ~200 words per minute

  return (
    <article className={cn("max-w-4xl mx-auto", className)}>
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {post.featured && (
            <Tag variant="secondary" size="sm">
              Featured
            </Tag>
          )}
          <Tag variant="secondary" size="sm">
            {post.postType}
          </Tag>
        </div>

        <h1 className="text-4xl font-bold text-off-black mb-4 leading-tight">
          {post.title}
        </h1>

        <p className="text-lg text-warm-gray mb-6 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-warm-gray border-b border-light-gray pb-6">
          {post.author && (
            <div className="flex items-center gap-1">
              <LucideIcon icon={User} size="xs" />
              <span>{post.author.name}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <LucideIcon icon={Calendar} size="xs" />
            <time dateTime={publishedDate.toISOString()}>
              {publishedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>

          <div className="flex items-center gap-1">
            <LucideIcon icon={Clock} size="xs" />
            <span>{estimatedReadTime} min read</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="prose-container">
        <MarkdownRenderer
          content={post.content}
          variant="blog"
          maxWidth="none"
          enableSyntaxHighlight={true}
          showHeadingAnchors={true}
          showCopyButton={true}
        />
      </div>

      {/* Footer */}
      {variant === "full" && (
        <footer className="mt-12 pt-8 border-t border-light-gray">
          <div className="flex items-center justify-between">
            <div className="text-sm text-warm-gray">
              Published on {publishedDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-warm-gray">Share:</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                Twitter
              </a>
            </div>
          </div>
        </footer>
      )}
    </article>
  );
}