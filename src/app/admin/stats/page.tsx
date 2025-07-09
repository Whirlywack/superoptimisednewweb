import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProjectStatsManager } from "@/components/admin/ProjectStatsManager";

export default async function AdminStatsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-off-white">
      <ProjectStatsManager userEmail={session.user.email} />
    </div>
  );
}
