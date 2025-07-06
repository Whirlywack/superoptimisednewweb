import {
  getCanonicalUrl,
  getDefaultOgImage,
  generatePostOgImage,
  generateBreadcrumbJsonLd,
  generatePostBreadcrumbs,
} from "../seo";

// Mock environment variable
const originalEnv = process.env.NEXT_PUBLIC_BASE_URL;

describe("SEO Utils", () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_BASE_URL;
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.NEXT_PUBLIC_BASE_URL = originalEnv;
    }
  });

  describe("getCanonicalUrl", () => {
    it("uses environment variable when available", () => {
      process.env.NEXT_PUBLIC_BASE_URL = "https://example.com";
      expect(getCanonicalUrl("/test")).toBe("https://example.com/test");
    });

    it("falls back to localhost when env var not set", () => {
      expect(getCanonicalUrl("/test")).toBe("http://localhost:3000/test");
    });

    it("handles paths without leading slash", () => {
      process.env.NEXT_PUBLIC_BASE_URL = "https://example.com";
      expect(getCanonicalUrl("test")).toBe("https://example.com/test");
    });

    it("handles root path correctly", () => {
      process.env.NEXT_PUBLIC_BASE_URL = "https://example.com";
      expect(getCanonicalUrl("/")).toBe("https://example.com/");
    });
  });

  describe("getDefaultOgImage", () => {
    it("returns correct default OG image URL", () => {
      process.env.NEXT_PUBLIC_BASE_URL = "https://example.com";
      expect(getDefaultOgImage()).toBe("https://example.com/og-default.png");
    });

    it("works with localhost fallback", () => {
      expect(getDefaultOgImage()).toBe("http://localhost:3000/og-default.png");
    });
  });

  describe("generatePostOgImage", () => {
    it("generates correct post OG image URL", () => {
      process.env.NEXT_PUBLIC_BASE_URL = "https://example.com";
      expect(generatePostOgImage("test-slug")).toBe("https://example.com/api/og/test-slug");
    });

    it("works with localhost fallback", () => {
      expect(generatePostOgImage("test-slug")).toBe("http://localhost:3000/api/og/test-slug");
    });
  });

  describe("generateBreadcrumbJsonLd", () => {
    it("generates valid JSON-LD breadcrumb structure", () => {
      process.env.NEXT_PUBLIC_BASE_URL = "https://example.com";

      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Journey", url: "/journey" },
        { name: "Test Post", url: "/journey/test-post" },
      ];

      const result = generateBreadcrumbJsonLd(breadcrumbs);
      const parsed = JSON.parse(result);

      expect(parsed["@context"]).toBe("https://schema.org");
      expect(parsed["@type"]).toBe("BreadcrumbList");
      expect(parsed.itemListElement).toHaveLength(3);

      expect(parsed.itemListElement[0]).toEqual({
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://example.com/",
      });

      expect(parsed.itemListElement[2]).toEqual({
        "@type": "ListItem",
        position: 3,
        name: "Test Post",
        item: "https://example.com/journey/test-post",
      });
    });

    it("parses without JSON syntax errors", () => {
      const breadcrumbs = [{ name: "Home", url: "/" }];
      const result = generateBreadcrumbJsonLd(breadcrumbs);

      expect(() => JSON.parse(result)).not.toThrow();
    });
  });

  describe("generatePostBreadcrumbs", () => {
    it("generates correct breadcrumb structure for post", () => {
      process.env.NEXT_PUBLIC_BASE_URL = "https://example.com";

      const result = generatePostBreadcrumbs("My Test Post", "my-test-post");
      const parsed = JSON.parse(result);

      expect(parsed.itemListElement).toHaveLength(3);
      expect(parsed.itemListElement[0].name).toBe("Home");
      expect(parsed.itemListElement[1].name).toBe("Journey");
      expect(parsed.itemListElement[2].name).toBe("My Test Post");
      expect(parsed.itemListElement[2].item).toBe("https://example.com/journey/my-test-post");
    });
  });
});
