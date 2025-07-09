import { NextResponse } from "next/server";
import { api } from "@/lib/trpc/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    // Get all published blog posts
    const blogPosts = await api.blog.getBlogPosts({
      limit: 1000, // Get all posts for sitemap
      page: 1,
    });

    // Static pages
    const staticPages = [
      { url: "/", lastModified: new Date().toISOString(), priority: "1.0" },
      { url: "/about", lastModified: new Date().toISOString(), priority: "0.8" },
      { url: "/journey", lastModified: new Date().toISOString(), priority: "0.9" },
      { url: "/research", lastModified: new Date().toISOString(), priority: "0.7" },
    ];

    // Dynamic blog post pages
    const dynamicPages = blogPosts.posts.map((post) => ({
      url: `/journey/${post.slug}`,
      lastModified: post.updatedAt.toISOString(),
      priority: "0.8",
    }));

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...dynamicPages]
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <priority>${page.priority}</priority>
    <changefreq>weekly</changefreq>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Fallback with just static pages
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>${baseUrl}/journey</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.9</priority>
    <changefreq>weekly</changefreq>
  </url>
</urlset>`;

    return new NextResponse(fallbackSitemap, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  }
}
