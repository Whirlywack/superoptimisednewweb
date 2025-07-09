import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AnalyticsDashboardClient } from "@/components/admin/AnalyticsDashboardClient";

/**
 * Admin Analytics Dashboard
 * Real-time analytics and performance metrics
 * Website traffic, questionnaire performance, user engagement
 */
export default async function AdminAnalyticsPage() {
  const session = await getServerSession(authOptions);

  return <AnalyticsDashboardClient userEmail={session?.user?.email || ""} />;
}