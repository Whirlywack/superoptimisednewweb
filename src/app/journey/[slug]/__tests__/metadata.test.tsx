import { generateMetadata } from "../page";
import { api } from "@/lib/trpc/server";

// Mock the API
jest.mock("@/lib/trpc/server", () => ({
  api: {
    blog: {
      getBlogPostBySlug: jest.fn(),
    },
  },
}));

const mockPost = {
  id: "test-id",
  title: "Test Journey Post",
  excerpt: "This is a test excerpt for SEO",
  content: "# Test Content",
  slug: "test-slug",
  postType: "journey",
  status: "published",
  featured: false,
  publishedAt: new Date("2024-01-01T10:00:00Z"),
  author: {
    id: "author-id",
    name: "Test Author",
    email: "test@example.com",
  },
};

describe("generateMetadata", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("generates correct metadata for valid post", async () => {
    (api.blog.getBlogPostBySlug as jest.Mock).mockResolvedValue(mockPost);

    const metadata = await generateMetadata({ params: { slug: "test-slug" } });

    expect(metadata).toEqual({
      title: "Test Journey Post | Superoptimised Journey",
      description: "This is a test excerpt for SEO",
      openGraph: {
        title: "Test Journey Post",
        description: "This is a test excerpt for SEO",
        type: "article",
        publishedTime: "2024-01-01T10:00:00.000Z",
        authors: ["Test Author"],
        url: "http://localhost:3000/journey/test-slug",
        images: [
          {
            url: "http://localhost:3000/api/og/test-slug",
            width: 1200,
            height: 630,
            alt: "Test Journey Post",
          },
          {
            url: "http://localhost:3000/og-default.png",
            width: 1200,
            height: 630,
            alt: "Superoptimised - Building in Public",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Test Journey Post",
        description: "This is a test excerpt for SEO",
        images: ["http://localhost:3000/api/og/test-slug", "http://localhost:3000/og-default.png"],
      },
      alternates: {
        canonical: "http://localhost:3000/journey/test-slug",
      },
    });
  });

  it("generates fallback metadata when post not found", async () => {
    (api.blog.getBlogPostBySlug as jest.Mock).mockResolvedValue(null);

    const metadata = await generateMetadata({ params: { slug: "non-existent" } });

    expect(metadata).toEqual({
      title: "Post Not Found - Superoptimised",
      description: "The requested post could not be found.",
    });
  });

  it("generates fallback description when post has no excerpt", async () => {
    const postWithoutExcerpt = { ...mockPost, excerpt: null };
    (api.blog.getBlogPostBySlug as jest.Mock).mockResolvedValue(postWithoutExcerpt);

    const metadata = await generateMetadata({ params: { slug: "test-slug" } });

    expect(metadata.description).toBe(
      "Read about Test Journey Post in the Superoptimised building journey."
    );
  });

  it("handles author without name", async () => {
    const postWithoutAuthorName = {
      ...mockPost,
      author: { ...mockPost.author, name: null },
    };
    (api.blog.getBlogPostBySlug as jest.Mock).mockResolvedValue(postWithoutAuthorName);

    const metadata = await generateMetadata({ params: { slug: "test-slug" } });

    expect(metadata.openGraph?.authors).toEqual(["Superoptimised"]);
  });

  it("handles error in API call", async () => {
    (api.blog.getBlogPostBySlug as jest.Mock).mockRejectedValue(new Error("API Error"));

    const metadata = await generateMetadata({ params: { slug: "error-slug" } });

    expect(metadata).toEqual({
      title: "Post Not Found - Superoptimised",
      description: "The requested post could not be found.",
    });
  });

  it("calls API with correct slug", async () => {
    (api.blog.getBlogPostBySlug as jest.Mock).mockResolvedValue(mockPost);

    await generateMetadata({ params: { slug: "test-slug" } });

    expect(api.blog.getBlogPostBySlug).toHaveBeenCalledWith({ slug: "test-slug" });
  });
});
