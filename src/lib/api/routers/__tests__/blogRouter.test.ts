import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { blogRouter } from "../blogRouter";

// Mock Prisma
jest.mock("../../../db", () => ({
  prisma: {
    post: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      groupBy: jest.fn(),
    },
  },
}));

import { prisma } from "../../../db";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("blogRouter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getBlogPosts", () => {
    it("should return paginated blog posts", async () => {
      const mockPosts = [
        {
          id: "post-1",
          slug: "test-post-1",
          title: "Test Post 1",
          excerpt: "This is a test post",
          postType: "blog",
          status: "published",
          featured: true,
          publishedAt: new Date("2024-12-01"),
          createdAt: new Date("2024-12-01"),
          updatedAt: new Date("2024-12-01"),
          author: {
            id: "user-1",
            name: "Test Author",
            email: "test@example.com",
          },
        },
      ];

      mockPrisma.post.count.mockResolvedValue(5);
      mockPrisma.post.findMany.mockResolvedValue(mockPosts);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = blogRouter.createCaller(ctx);
      const result = await caller.getBlogPosts({
        page: 1,
        limit: 10,
        status: "published",
      });

      expect(result.posts).toEqual(mockPosts);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        totalCount: 5,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });

      expect(mockPrisma.post.count).toHaveBeenCalledWith({
        where: { status: "published" },
      });

      expect(mockPrisma.post.findMany).toHaveBeenCalledWith({
        where: { status: "published" },
        orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
        skip: 0,
        take: 10,
        select: expect.objectContaining({
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
        }),
      });
    });

    it("should handle search filtering", async () => {
      mockPrisma.post.count.mockResolvedValue(2);
      mockPrisma.post.findMany.mockResolvedValue([]);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = blogRouter.createCaller(ctx);
      await caller.getBlogPosts({
        page: 1,
        limit: 10,
        search: "test search",
        status: "published",
      });

      expect(mockPrisma.post.count).toHaveBeenCalledWith({
        where: {
          status: "published",
          OR: [
            { title: { contains: "test search", mode: "insensitive" } },
            { excerpt: { contains: "test search", mode: "insensitive" } },
            { content: { contains: "test search", mode: "insensitive" } },
          ],
        },
      });
    });

    it("should handle postType filtering", async () => {
      mockPrisma.post.count.mockResolvedValue(3);
      mockPrisma.post.findMany.mockResolvedValue([]);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = blogRouter.createCaller(ctx);
      await caller.getBlogPosts({
        page: 1,
        limit: 10,
        postType: "journey",
        status: "published",
      });

      expect(mockPrisma.post.count).toHaveBeenCalledWith({
        where: {
          status: "published",
          postType: "journey",
        },
      });
    });

    it("should calculate pagination correctly", async () => {
      mockPrisma.post.count.mockResolvedValue(25);
      mockPrisma.post.findMany.mockResolvedValue([]);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = blogRouter.createCaller(ctx);
      const result = await caller.getBlogPosts({
        page: 2,
        limit: 10,
        status: "published",
      });

      expect(result.pagination).toEqual({
        page: 2,
        limit: 10,
        totalCount: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPreviousPage: true,
      });

      expect(mockPrisma.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10, // (page - 1) * limit = (2 - 1) * 10 = 10
          take: 10,
        })
      );
    });
  });

  describe("getBlogPostBySlug", () => {
    it("should return a blog post by slug", async () => {
      const mockPost = {
        id: "post-1",
        slug: "test-post",
        title: "Test Post",
        content: "# Test Content",
        postType: "blog",
        status: "published",
        featured: false,
        publishedAt: new Date("2024-12-01"),
        createdAt: new Date("2024-12-01"),
        updatedAt: new Date("2024-12-01"),
        author: {
          id: "user-1",
          name: "Test Author",
          email: "test@example.com",
        },
      };

      mockPrisma.post.findUnique.mockResolvedValue(mockPost);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = blogRouter.createCaller(ctx);
      const result = await caller.getBlogPostBySlug({ slug: "test-post" });

      expect(result).toEqual(mockPost);
      expect(mockPrisma.post.findUnique).toHaveBeenCalledWith({
        where: {
          slug: "test-post",
          status: "published",
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
    });

    it("should throw NOT_FOUND error when post does not exist", async () => {
      mockPrisma.post.findUnique.mockResolvedValue(null);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = blogRouter.createCaller(ctx);

      await expect(caller.getBlogPostBySlug({ slug: "non-existent" })).rejects.toThrow(
        "Blog post not found"
      );
    });
  });

  describe("getBlogStats", () => {
    it("should return blog statistics", async () => {
      const mockGroupByResult = [
        { postType: "blog", _count: { id: 5 } },
        { postType: "journey", _count: { id: 3 } },
        { postType: "announcement", _count: { id: 2 } },
      ];

      const mockRecentPosts = [
        {
          id: "post-1",
          title: "Recent Post",
          slug: "recent-post",
          postType: "blog",
          publishedAt: new Date("2024-12-01"),
        },
      ];

      mockPrisma.post.count
        .mockResolvedValueOnce(10) // totalPosts
        .mockResolvedValueOnce(8) // publishedPosts
        .mockResolvedValueOnce(2) // draftPosts
        .mockResolvedValueOnce(3); // featuredPosts

      mockPrisma.post.groupBy.mockResolvedValue(mockGroupByResult);
      mockPrisma.post.findMany.mockResolvedValue(mockRecentPosts);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = blogRouter.createCaller(ctx);
      const result = await caller.getBlogStats();

      expect(result).toEqual({
        totalPosts: 10,
        publishedPosts: 8,
        draftPosts: 2,
        featuredPosts: 3,
        postsByType: {
          blog: 5,
          journey: 3,
          announcement: 2,
        },
        recentActivity: mockRecentPosts,
      });
    });
  });
});
