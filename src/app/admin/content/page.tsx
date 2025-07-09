import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ContentDashboardClient } from "@/components/admin/ContentDashboardClient";

/**
 * Admin Content Management Dashboard
 * Blog post management, content templates, publishing workflow
 * Content creation tools and SEO optimization
 */
export default async function AdminContentPage() {
  const session = await getServerSession(authOptions);

  return <ContentDashboardClient userEmail={session?.user?.email || ""} />;
}