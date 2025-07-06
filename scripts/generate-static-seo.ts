#!/usr/bin/env node

/**
 * Build-time generation of static SEO files
 * Generates robots.txt and sitemap.xml in the public directory
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const PUBLIC_DIR = path.join(__dirname, "..", "public");

// Ensure public directory exists
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// Generate robots.txt
function generateRobotsTxt(): void {
  const robotsContent = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /auth/
Disallow: /claim-xp/

Sitemap: ${BASE_URL}/sitemap.xml`;

  const robotsPath = path.join(PUBLIC_DIR, "robots.txt");
  fs.writeFileSync(robotsPath, robotsContent, "utf-8");
  console.log("✅ Generated robots.txt");
}

// Generate basic sitemap.xml (static pages only for build time)
function generateSitemapXml(): void {
  const currentDate = new Date().toISOString();

  const staticPages = [
    { url: "/", lastModified: currentDate, priority: "1.0" },
    { url: "/about", lastModified: currentDate, priority: "0.8" },
    { url: "/journey", lastModified: currentDate, priority: "0.9" },
    { url: "/research", lastModified: currentDate, priority: "0.7" },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <priority>${page.priority}</priority>
    <changefreq>weekly</changefreq>
  </url>`
  )
  .join("\n")}
</urlset>`;

  const sitemapPath = path.join(PUBLIC_DIR, "sitemap.xml");
  fs.writeFileSync(sitemapPath, sitemap, "utf-8");
  console.log("✅ Generated sitemap.xml");
}

// Main execution
try {
  generateRobotsTxt();
  generateSitemapXml();
  console.log("🎉 Static SEO files generated successfully!");
} catch (error) {
  console.error("❌ Error generating static SEO files:", error);
  process.exit(1);
}
