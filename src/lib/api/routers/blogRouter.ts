import { createTRPCRouter, publicProcedure } from "@/lib/api/trpc";
import { prisma } from "@/lib/db";
import { getBlogPostsSchema, getBlogPostBySlugSchema } from "@/lib/api/schemas";
import { safeExecute } from "@/lib/api/errors";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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

  /**
   * Create a new blog post
   */
  createPost: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(200),
        slug: z.string().min(1).max(100),
        excerpt: z.string().optional(),
        content: z.string().min(1),
        contentType: z.enum(["markdown", "tsx"]).default("tsx"),
        postType: z.string().default("blog"),
        status: z.enum(["draft", "published"]).default("draft"),
        featured: z.boolean().default(false),
        authorId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return safeExecute(async () => {
        // Check if slug already exists
        const existingPost = await prisma.post.findUnique({
          where: { slug: input.slug },
        });

        if (existingPost) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A post with this slug already exists",
          });
        }

        const post = await prisma.post.create({
          data: {
            ...input,
            publishedAt: input.status === "published" ? new Date() : null,
          },
        });

        return post;
      }, "createPost");
    }),

  /**
   * Update an existing blog post
   */
  updatePost: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(200).optional(),
        slug: z.string().min(1).max(100).optional(),
        excerpt: z.string().optional(),
        content: z.string().min(1).optional(),
        contentType: z.enum(["markdown", "tsx"]).optional(),
        postType: z.string().optional(),
        status: z.enum(["draft", "published"]).optional(),
        featured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return safeExecute(async () => {
        const { id, ...updateData } = input;

        // If slug is being updated, check for conflicts
        if (updateData.slug) {
          const existingPost = await prisma.post.findUnique({
            where: { slug: updateData.slug },
          });

          if (existingPost && existingPost.id !== id) {
            throw new TRPCError({
              code: "CONFLICT",
              message: "A post with this slug already exists",
            });
          }
        }

        // Set publishedAt when status changes to published
        if (updateData.status === "published") {
          const currentPost = await prisma.post.findUnique({
            where: { id },
            select: { publishedAt: true },
          });

          if (!currentPost?.publishedAt) {
            (updateData as any).publishedAt = new Date();
          }
        }

        const post = await prisma.post.update({
          where: { id },
          data: updateData,
        });

        return post;
      }, "updatePost");
    }),

  /**
   * Get a single blog post by ID (for admin editing)
   */
  getPostById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    return safeExecute(async () => {
      const post = await prisma.post.findUnique({
        where: { id: input.id },
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
          message: "Post not found",
        });
      }

      return post;
    }, "getPostById");
  }),
});
