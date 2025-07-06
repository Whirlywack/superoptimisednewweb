import { render, screen } from "@testing-library/react";
import { api } from "@/lib/trpc/server";
import JourneyPost from "../page";
import { notFound } from "next/navigation";

// Mock the API and Next.js functions
jest.mock("@/lib/trpc/server", () => ({
  api: {
    blog: {
      getBlogPostBySlug: jest.fn(),
    },
  },
}));

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

jest.mock("@/components/templates/BlogPostViewer", () => ({
  BlogPostViewer: ({ post }: { post: any }) => (
    <div data-testid="blog-post-viewer">
      <h1>{post.title}</h1>
      <p>{post.excerpt}</p>
    </div>
  ),
}));

const mockPost = {
  id: "test-id",
  title: "Test Journey Post",
  excerpt: "This is a test excerpt",
  content: "# Test Content\n\nThis is test content.",
  slug: "test-slug",
  postType: "journey",
  status: "published",
  featured: false,
  publishedAt: new Date("2024-01-01"),
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  author: {
    id: "author-id",
    name: "Test Author",
    email: "test@example.com",
  },
};

describe("Journey Post Dynamic Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders blog post when found", async () => {
    // Mock successful API response
    (api.blog.getBlogPostBySlug as jest.Mock).mockResolvedValue(mockPost);

    const Component = await JourneyPost({ params: { slug: "test-slug" } });

    render(Component);

    expect(screen.getByTestId("blog-post-viewer")).toBeInTheDocument();
    expect(screen.getByText("Test Journey Post")).toBeInTheDocument();
    expect(screen.getByText("This is a test excerpt")).toBeInTheDocument();
  });

  it("calls notFound when post is not found", async () => {
    // Mock API returning null
    (api.blog.getBlogPostBySlug as jest.Mock).mockResolvedValue(null);

    await JourneyPost({ params: { slug: "non-existent-slug" } });

    expect(notFound).toHaveBeenCalled();
  });

  it("calls notFound when API throws error", async () => {
    // Mock API throwing error
    (api.blog.getBlogPostBySlug as jest.Mock).mockRejectedValue(new Error("API Error"));

    await JourneyPost({ params: { slug: "error-slug" } });

    expect(notFound).toHaveBeenCalled();
  });

  it("calls API with correct slug parameter", async () => {
    (api.blog.getBlogPostBySlug as jest.Mock).mockResolvedValue(mockPost);

    await JourneyPost({ params: { slug: "test-slug" } });

    expect(api.blog.getBlogPostBySlug).toHaveBeenCalledWith({ slug: "test-slug" });
  });
});
