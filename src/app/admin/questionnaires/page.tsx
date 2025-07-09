import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { QuestionnairesDashboardClient } from "@/components/admin/QuestionnairesDashboardClient";

/**
 * Admin Questionnaires Management Dashboard
 * Real questionnaire CRUD operations, template gallery, questionnaire builder
 * Full database integration with tRPC APIs
 */
export default async function AdminQuestionnairesPage() {
  const session = await getServerSession(authOptions);

  return <QuestionnairesDashboardClient userEmail={session?.user?.email || ""} />;
}