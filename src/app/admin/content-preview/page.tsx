import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ContentPreviewWorkflow } from "@/components/admin/ContentPreviewWorkflow";

export default async function AdminContentPreviewPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-off-white">
      <ContentPreviewWorkflow userEmail={session.user.email} />
    </div>
  );
}
