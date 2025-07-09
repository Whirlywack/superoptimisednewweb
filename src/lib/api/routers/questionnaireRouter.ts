import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "@/lib/api/trpc";
import { prisma } from "@/lib/db";

export const questionnaireRouter = createTRPCRouter({
  // Get all questionnaires (admin only)
  getAll: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional().default(10),
        cursor: z.string().optional(),
        status: z.enum(["draft", "active", "closed", "all"]).optional().default("all"),
      })
    )
    .query(async ({ input }) => {
      const whereClause = input.status !== "all" ? { status: input.status } : {};
      
      const questionnaires = await prisma.questionnaire.findMany({
        where: whereClause,
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          questions: {
            include: {
              question: true,
            },
            orderBy: { displayOrder: "asc" },
          },
          responses: {
            where: { status: "completed" },
          },
          _count: {
            select: {
              responses: {
                where: { status: "completed" },
              },
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (questionnaires.length > input.limit) {
        const nextItem = questionnaires.pop();
        nextCursor = nextItem!.id;
      }

      return {
        questionnaires: questionnaires.map((q) => ({
          ...q,
          questionCount: q.questions.length,
          responseCount: q._count.responses,
        })),
        nextCursor,
      };
    }),

  // Get questionnaire statistics
  getStats: adminProcedure.query(async () => {
    const [
      totalQuestionnaires,
      activeQuestionnaires,
      totalQuestions,
      totalResponses,
      completedResponses,
    ] = await Promise.all([
      prisma.questionnaire.count(),
      prisma.questionnaire.count({ where: { status: "active" } }),
      prisma.question.count(),
      prisma.questionnaireResponse.count(),
      prisma.questionnaireResponse.count({ where: { status: "completed" } }),
    ]);

    const completionRate = totalResponses > 0 
      ? Math.round((completedResponses / totalResponses) * 100) 
      : 0;

    return {
      totalQuestionnaires,
      activeQuestionnaires,
      totalQuestions,
      totalResponses: completedResponses,
      completionRate,
    };
  }),

  // Get single questionnaire by ID
  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const questionnaire = await prisma.questionnaire.findUnique({
        where: { id: input.id },
        include: {
          questions: {
            include: {
              question: true,
            },
            orderBy: { displayOrder: "asc" },
          },
          responses: {
            include: {
              questionResponses: {
                include: {
                  question: true,
                },
              },
            },
          },
        },
      });

      if (!questionnaire) {
        throw new Error("Questionnaire not found");
      }

      return questionnaire;
    }),

  // Create new questionnaire
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        category: z.string().optional(),
        questionIds: z.array(z.string()).optional().default([]),
      })
    )
    .mutation(async ({ input }) => {
      const questionnaire = await prisma.questionnaire.create({
        data: {
          title: input.title,
          description: input.description,
          category: input.category,
        },
      });

      // Add questions if provided
      if (input.questionIds.length > 0) {
        await prisma.questionnaireQuestion.createMany({
          data: input.questionIds.map((questionId, index) => ({
            questionnaireId: questionnaire.id,
            questionId,
            displayOrder: index,
          })),
        });
      }

      return questionnaire;
    }),

  // Update questionnaire
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        status: z.enum(["draft", "active", "closed"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      
      return await prisma.questionnaire.update({
        where: { id },
        data: updateData,
      });
    }),

  // Add question to questionnaire
  addQuestion: adminProcedure
    .input(
      z.object({
        questionnaireId: z.string(),
        questionId: z.string(),
        displayOrder: z.number().optional(),
        isRequired: z.boolean().optional().default(true),
      })
    )
    .mutation(async ({ input }) => {
      // Get current max order if no order specified
      const displayOrder = input.displayOrder ?? (
        await prisma.questionnaireQuestion.count({
          where: { questionnaireId: input.questionnaireId }
        })
      );

      return await prisma.questionnaireQuestion.create({
        data: {
          questionnaireId: input.questionnaireId,
          questionId: input.questionId,
          displayOrder,
          isRequired: input.isRequired,
        },
        include: {
          question: true,
        },
      });
    }),

  // Remove question from questionnaire
  removeQuestion: adminProcedure
    .input(
      z.object({
        questionnaireId: z.string(),
        questionId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.questionnaireQuestion.delete({
        where: {
          questionnaireId_questionId: {
            questionnaireId: input.questionnaireId,
            questionId: input.questionId,
          },
        },
      });
    }),

  // Reorder questions in questionnaire
  reorderQuestions: adminProcedure
    .input(
      z.object({
        questionnaireId: z.string(),
        questionOrders: z.array(
          z.object({
            questionId: z.string(),
            displayOrder: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      // Update each question's order
      await Promise.all(
        input.questionOrders.map((item) =>
          prisma.questionnaireQuestion.update({
            where: {
              questionnaireId_questionId: {
                questionnaireId: input.questionnaireId,
                questionId: item.questionId,
              },
            },
            data: {
              displayOrder: item.displayOrder,
            },
          })
        )
      );

      return { success: true };
    }),

  // Delete questionnaire
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.questionnaire.delete({
        where: { id: input.id },
      });
    }),

  // Publish/unpublish questionnaire
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["draft", "active", "closed"]),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.questionnaire.update({
        where: { id: input.id },
        data: { 
          status: input.status,
          startDate: input.status === "active" ? new Date() : undefined,
          endDate: input.status === "closed" ? new Date() : undefined,
        },
      });
    }),
});