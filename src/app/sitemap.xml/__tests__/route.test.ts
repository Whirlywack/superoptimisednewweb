import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { GET } from "../route";

// Mock the tRPC API
jest.mock("@/lib/trpc/server", () => ({
  api: {
    blog: {
      getBlogPosts: jest.fn(),
    },
  },
}));

import { api } from "@/lib/trpc/server";

const mockApi = api as jest.Mocked<typeof api>;

describe("/sitemap.xml route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.NEXT_PUBLIC_BASE_URL;
  });

  it("returns 200 status", async () => {
    mockApi.blog.getBlogPosts.mockResolvedValue([]);

    const response = await GET();
    expect(response.status).toBe(200);
  });

  it("returns correct content-type header", async () => {
    mockApi.blog.getBlogPosts.mockResolvedValue([]);

    const response = await GET();
    expect(response.headers.get("Content-Type")).toBe("application/xml");
  });

  it("includes cache control headers", async () => {
    mockApi.blog.getBlogPosts.mockResolvedValue([]);

    const response = await GET();
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=86400, s-maxage=86400");
  });

  it("includes static pages in sitemap", async () => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://example.com";
    mockApi.blog.getBlogPosts.mockResolvedValue([]);

    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain("<loc>https://example.com/</loc>");
    expect(xml).toContain("<loc>https://example.com/about</loc>");
    expect(xml).toContain("<loc>https://example.com/journey</loc>");
    expect(xml).toContain("<loc>https://example.com/research</loc>");
  });

  it("includes blog posts in sitemap", async () => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://example.com";

    const mockPosts = [
      {
        slug: "test-post-1",
        updatedAt: new Date("2023-01-01"),
      },
      {
        slug: "test-post-2",
        updatedAt: new Date("2023-01-02"),
      },
    ];

    mockApi.blog.getBlogPosts.mockResolvedValue(mockPosts);

    const response = await GET();
    const xml = await response.text();

    expect(xml).toContain("<loc>https://example.com/journey/test-post-1</loc>");
    expect(xml).toContain("<loc>https://example.com/journey/test-post-2</loc>");
    expect(xml).toContain("<lastmod>2023-01-01T00:00:00.000Z</lastmod>");
    expect(xml).toContain("<lastmod>2023-01-02T00:00:00.000Z</lastmod>");
  });

  it("generates valid XML structure", async () => {
    mockApi.blog.getBlogPosts.mockResolvedValue([]);

    const response = await GET();
    const xml = await response.text();

    expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>/);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain("</urlset>");
  });

  it("handles API errors gracefully with fallback", async () => {
    mockApi.blog.getBlogPosts.mockRejectedValue(new Error("Database error"));

    const response = await GET();
    const xml = await response.text();

    // Should still include static pages
    expect(xml).toContain("<loc>http://localhost:3000/</loc>");
    expect(xml).toContain("<loc>http://localhost:3000/about</loc>");
    expect(response.status).toBe(200);
  });

  it("includes proper XML elements for each URL", async () => {
    mockApi.blog.getBlogPosts.mockResolvedValue([]);

    const response = await GET();
    const xml = await response.text();

    // Check that each URL has required elements
    expect(xml).toContain("<priority>1.0</priority>"); // Homepage
    expect(xml).toContain("<priority>0.8</priority>"); // About
    expect(xml).toContain("<priority>0.9</priority>"); // Journey
    expect(xml).toContain("<changefreq>weekly</changefreq>");
  });
});
