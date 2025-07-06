import { api } from "@/lib/trpc/react";
import type { GetBlogPostsInput } from "@/lib/api/schemas";

interface UseBlogPostsOptions extends GetBlogPostsInput {
  enabled?: boolean;
}

export function useBlogPosts(options: UseBlogPostsOptions = {}) {
  const { enabled = true, ...input } = options;

  return api.blog.getBlogPosts.useQuery(input, {
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useBlogPostBySlug(slug: string, enabled = true) {
  return api.blog.getBlogPostBySlug.useQuery(
    { slug },
    {
      enabled: enabled && !!slug,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    }
  );
}

export function useRecentPosts(options: UseBlogPostsOptions = {}) {
  const { enabled = true, ...input } = options;

  return api.blog.getRecentPosts.useQuery(input, {
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

export function useFeaturedPosts(options: UseBlogPostsOptions = {}) {
  const { enabled = true, ...input } = options;

  return api.blog.getFeaturedPosts.useQuery(input, {
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

export function useBlogStats(enabled = true) {
  return api.blog.getBlogStats.useQuery(undefined, {
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  });
}
