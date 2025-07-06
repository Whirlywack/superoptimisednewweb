import { NextResponse } from "next/server";

export function GET() {
  const robotsContent = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /auth/
Disallow: /claim-xp/

Sitemap: ${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/sitemap.xml`;

  return new NextResponse(robotsContent, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
