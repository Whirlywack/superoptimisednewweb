/**
 * SEO utility functions for metadata and canonical URLs
 */

export function getCanonicalUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getDefaultOgImage(): string {
  return getCanonicalUrl("/og-default.png");
}

export function generatePostOgImage(slug: string): string {
  return getCanonicalUrl(`/api/og/${slug}`);
}

export interface BreadcrumbItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]): string {
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.url),
    })),
  };

  return JSON.stringify(breadcrumbList);
}

export function generatePostBreadcrumbs(postTitle: string, postSlug: string): string {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Journey", url: "/journey" },
    { name: postTitle, url: `/journey/${postSlug}` },
  ];

  return generateBreadcrumbJsonLd(breadcrumbs);
}
