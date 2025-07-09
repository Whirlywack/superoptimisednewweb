import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { QuestionListClient } from "@/components/admin/QuestionListClient";

/**
 * Admin Question Management Page
 * Terminal-style interface for managing research questions
 * Follows Elevated Brutalism design system
 */
export default async function AdminQuestionsPage() {
  const session = await getServerSession(authOptions);

  // This page is protected by layout, but double-check for TypeScript
  if (!session?.user || session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  // Fetch all questions with stats
  const questions = await prisma.question.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      questionType: true,
      category: true,
      isActive: true,
      startDate: true,
      endDate: true,
      displayOrder: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          responses: true,
        },
      },
    },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });

  // Transform questions to include responseCount for client component
  const transformedQuestions = questions.map((question) => ({
    ...question,
    responseCount: question._count.responses,
  }));

  return (
    <QuestionListClient initialQuestions={transformedQuestions} userEmail={session?.user?.email} />
  );
}
