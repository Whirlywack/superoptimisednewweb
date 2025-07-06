import { createTRPCRouter, publicProcedure } from "@/lib/api/trpc";
import { prisma } from "@/lib/db";
import { getBlogPostsSchema, getBlogPostBySlugSchema } from "@/lib/api/schemas";
import { safeExecute } from "@/lib/api/errors";
import { TRPCError } from "@trpc/server";

export const blogRouter = createTRPCRouter({
  /**
   * Get blog posts with pagination and filtering
   */
  getBlogPosts: publicProcedure.input(getBlogPostsSchema).query(async ({ input }) => {
    return safeExecute(async () => {
      const { page, limit, postType, status, featured, search } = input;
      const offset = (page - 1) * limit;

      // Build where clause dynamically
      const where: Record<string, unknown> = {
        status: status || "published",
      };

      if (postType) {
        where.postType = postType;
      }

      if (featured !== undefined) {
        where.featured = featured;
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { excerpt: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ];
      }

      // Get total count for pagination
      const totalCount = await prisma.post.count({ where });

      // Get posts with pagination
      const posts = await prisma.post.findMany({
        where,
        orderBy: [
          { featured: "desc" }, // Featured posts first
          { publishedAt: "desc" }, // Then by published date
          { createdAt: "desc" }, // Finally by creation date
        ],
        skip: offset,
        take: limit,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          postType: true,
          status: true,
          featured: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        posts,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage,
          hasPreviousPage,
        },
      };
    }, "getBlogPosts");
  }),

  /**
   * Get a single blog post by slug
   */
  getBlogPostBySlug: publicProcedure.input(getBlogPostBySlugSchema).query(async ({ input }) => {
    return safeExecute(async () => {
      const post = await prisma.post.findUnique({
        where: {
          slug: input.slug,
          status: "published", // Only return published posts for public access
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Blog post not found",
        });
      }

      return post;
    }, "getBlogPostBySlug");
  }),

  /**
   * Get recent posts for sidebar/related content
   */
  getRecentPosts: publicProcedure
    .input(getBlogPostsSchema.partial().optional())
    .query(async ({ input = {} }) => {
      return safeExecute(async () => {
        const { limit = 5, postType } = input;

        const where: Record<string, unknown> = {
          status: "published",
        };

        if (postType) {
          where.postType = postType;
        }

        const posts = await prisma.post.findMany({
          where,
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
          take: limit,
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            postType: true,
            featured: true,
            publishedAt: true,
            createdAt: true,
          },
        });

        return posts;
      }, "getRecentPosts");
    }),

  /**
   * Get featured posts
   */
  getFeaturedPosts: publicProcedure
    .input(getBlogPostsSchema.partial().optional())
    .query(async ({ input = {} }) => {
      return safeExecute(async () => {
        const { limit = 3, postType } = input;

        const where: Record<string, unknown> = {
          status: "published",
          featured: true,
        };

        if (postType) {
          where.postType = postType;
        }

        const posts = await prisma.post.findMany({
          where,
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
          take: limit,
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            postType: true,
            featured: true,
            publishedAt: true,
            createdAt: true,
          },
        });

        return posts;
      }, "getFeaturedPosts");
    }),

  /**
   * Get blog post statistics
   */
  getBlogStats: publicProcedure.query(async () => {
    return safeExecute(async () => {
      const [totalPosts, publishedPosts, draftPosts, featuredPosts] = await Promise.all([
        prisma.post.count(),
        prisma.post.count({ where: { status: "published" } }),
        prisma.post.count({ where: { status: "draft" } }),
        prisma.post.count({ where: { status: "published", featured: true } }),
      ]);

      const postsByType = await prisma.post.groupBy({
        by: ["postType"],
        where: { status: "published" },
        _count: {
          id: true,
        },
      });

      const recentActivity = await prisma.post.findMany({
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          postType: true,
          publishedAt: true,
        },
      });

      return {
        totalPosts,
        publishedPosts,
        draftPosts,
        featuredPosts,
        postsByType: postsByType.reduce(
          (acc, item) => {
            acc[item.postType] = item._count.id;
            return acc;
          },
          {} as Record<string, number>
        ),
        recentActivity,
      };
    }, "getBlogStats");
  }),
});
