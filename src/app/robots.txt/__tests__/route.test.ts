import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { GET } from "../route";

// Mock environment variable
const originalEnv = process.env.NEXT_PUBLIC_BASE_URL;

describe("/robots.txt route", () => {
  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_BASE_URL;
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.NEXT_PUBLIC_BASE_URL = originalEnv;
    }
  });

  it("returns 200 status", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
  });

  it("returns correct content-type header", async () => {
    const response = await GET();
    expect(response.headers.get("Content-Type")).toBe("text/plain");
  });

  it("includes cache control headers", async () => {
    const response = await GET();
    expect(response.headers.get("Cache-Control")).toBe("public, max-age=86400, s-maxage=86400");
  });

  it("returns correct robots.txt content with environment URL", async () => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://example.com";

    const response = await GET();
    const text = await response.text();

    expect(text).toContain("User-agent: *");
    expect(text).toContain("Allow: /");
    expect(text).toContain("Disallow: /api/");
    expect(text).toContain("Disallow: /auth/");
    expect(text).toContain("Disallow: /claim-xp/");
    expect(text).toContain("Sitemap: https://example.com/sitemap.xml");
  });

  it("returns correct robots.txt content with localhost fallback", async () => {
    const response = await GET();
    const text = await response.text();

    expect(text).toContain("Sitemap: http://localhost:3000/sitemap.xml");
  });

  it("has exact body format as specified in requirements", async () => {
    process.env.NEXT_PUBLIC_BASE_URL = "https://example.com";

    const response = await GET();
    const text = await response.text();

    const expectedFormat = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /auth/
Disallow: /claim-xp/

Sitemap: https://example.com/sitemap.xml`;

    expect(text).toBe(expectedFormat);
  });
});
