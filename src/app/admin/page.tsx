import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

/**
 * Elevated Brutalism Admin Dashboard
 * Functional workspace for questionnaire management
 * Direct access to all creation and management tools
 */
export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  return <AdminDashboardClient userEmail={session?.user?.email || ""} />;
}