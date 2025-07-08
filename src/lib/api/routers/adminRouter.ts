import { createTRPCRouter, adminProcedure } from "../trpc";
import { deleteQuestionSchema, getQuestionByIdSchema } from "../schemas";
import { safeExecute, QuestionNotFoundError } from "../errors";
import { prisma } from "../../db";
import { z } from "zod";

/**
 * Admin Router for Question Management
 * All endpoints require admin authentication
 */
export const adminRouter = createTRPCRouter({
  // Get all questions (including inactive ones) for admin interface
  getAllQuestions: adminProcedure.query(async () => {
    return safeExecute(async () => {
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

      return questions.map((question) => ({
        ...question,
        responseCount: question._count.responses,
      }));
    }, "getAllQuestions");
  }),

  // Get single question by ID for editing
  getQuestionForEdit: adminProcedure.input(getQuestionByIdSchema).query(async ({ input }) => {
    return safeExecute(async () => {
      const question = await prisma.question.findUnique({
        where: { id: input.id },
        select: {
          id: true,
          title: true,
          description: true,
          questionType: true,
          questionData: true,
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
      });

      if (!question) {
        throw new QuestionNotFoundError(input.id);
      }

      return {
        ...question,
        responseCount: question._count.responses,
      };
    }, "getQuestionForEdit");
  }),

  // Create new question
  createQuestion: adminProcedure
    .input(
      z.object({
        title: z.string().min(1).max(500),
        description: z.string().optional(),
        questionType: z.enum([
          "binary",
          "multi-choice",
          "rating-scale",
          "text-response",
          "ranking",
          "ab-test",
        ]),
        config: z.record(z.unknown()),
        category: z.string(),
        isActive: z.boolean().default(false),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        displayOrder: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      return safeExecute(async () => {
        const question = await prisma.question.create({
          data: {
            title: input.title,
            description: input.description,
            questionType: input.questionType,
            questionData: input.config,
            category: input.category,
            isActive: input.isActive,
            startDate: input.startDate,
            endDate: input.endDate,
            displayOrder: input.displayOrder,
          },
          select: {
            id: true,
            title: true,
            questionType: true,
            isActive: true,
            createdAt: true,
          },
        });

        return question;
      }, "createQuestion");
    }),

  // Toggle question active/inactive status
  toggleQuestionStatus: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        isActive: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      return safeExecute(async () => {
        const question = await prisma.question.findUnique({
          where: { id: input.id },
          select: { id: true, title: true, isActive: true },
        });

        if (!question) {
          throw new QuestionNotFoundError(input.id);
        }

        const updatedQuestion = await prisma.question.update({
          where: { id: input.id },
          data: { isActive: input.isActive },
          select: {
            id: true,
            title: true,
            isActive: true,
            updatedAt: true,
          },
        });

        return updatedQuestion;
      }, "toggleQuestionStatus");
    }),

  // Update question scheduling
  updateQuestionSchedule: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        startDate: z.date().nullable(),
        endDate: z.date().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      return safeExecute(async () => {
        const question = await prisma.question.findUnique({
          where: { id: input.id },
          select: { id: true, title: true },
        });

        if (!question) {
          throw new QuestionNotFoundError(input.id);
        }

        const updatedQuestion = await prisma.question.update({
          where: { id: input.id },
          data: {
            startDate: input.startDate,
            endDate: input.endDate,
          },
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
            updatedAt: true,
          },
        });

        return updatedQuestion;
      }, "updateQuestionSchedule");
    }),

  // Update question details
  updateQuestion: adminProcedure
    .input(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1).max(500).optional(),
        description: z.string().optional(),
        config: z.record(z.unknown()).optional(),
        category: z.string().optional(),
        isActive: z.boolean().optional(),
        startDate: z.date().nullable().optional(),
        endDate: z.date().nullable().optional(),
        displayOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return safeExecute(async () => {
        const { id, config, ...updateData } = input;

        const question = await prisma.question.findUnique({
          where: { id },
          select: { id: true, title: true },
        });

        if (!question) {
          throw new QuestionNotFoundError(id);
        }

        const updatedQuestion = await prisma.question.update({
          where: { id },
          data: {
            ...updateData,
            ...(config && { questionData: config }),
          },
          select: {
            id: true,
            title: true,
            description: true,
            questionType: true,
            questionData: true,
            category: true,
            isActive: true,
            startDate: true,
            endDate: true,
            displayOrder: true,
            updatedAt: true,
            _count: {
              select: {
                responses: true,
              },
            },
          },
        });

        return {
          ...updatedQuestion,
          responseCount: updatedQuestion._count.responses,
        };
      }, "updateQuestion");
    }),

  // Delete question (soft delete - mark as archived)
  deleteQuestion: adminProcedure.input(deleteQuestionSchema).mutation(async ({ input }) => {
    return safeExecute(async () => {
      const question = await prisma.question.findUnique({
        where: { id: input.id },
        select: { id: true, title: true },
      });

      if (!question) {
        throw new QuestionNotFoundError(input.id);
      }

      // Check if question has responses
      const responseCount = await prisma.questionResponse.count({
        where: { questionId: input.id },
      });

      if (responseCount > 0) {
        // Soft delete by deactivating if there are responses
        const updatedQuestion = await prisma.question.update({
          where: { id: input.id },
          data: {
            isActive: false,
            endDate: new Date(), // End the question immediately
          },
          select: {
            id: true,
            title: true,
            isActive: true,
          },
        });

        return {
          ...updatedQuestion,
          deleted: false,
          message: "Question deactivated due to existing responses",
        };
      } else {
        // Hard delete if no responses
        await prisma.question.delete({
          where: { id: input.id },
        });

        return {
          id: input.id,
          deleted: true,
          message: "Question permanently deleted",
        };
      }
    }, "deleteQuestion");
  }),

  // Get question analytics
  getQuestionAnalytics: adminProcedure.input(getQuestionByIdSchema).query(async ({ input }) => {
    return safeExecute(async () => {
      const question = await prisma.question.findUnique({
        where: { id: input.id },
        include: {
          responses: {
            select: {
              responseData: true,
              createdAt: true,
              voterTokenHash: true,
            },
          },
        },
      });

      if (!question) {
        throw new QuestionNotFoundError(input.id);
      }

      const totalResponses = question.responses.length;
      const uniqueVoters = new Set(question.responses.map((r) => r.voterTokenHash)).size;

      // Calculate response rate over time (daily buckets)
      const responsesOverTime = question.responses.reduce(
        (acc, response) => {
          const date = response.createdAt.toISOString().split("T")[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      return {
        questionId: question.id,
        title: question.title,
        questionType: question.questionType,
        totalResponses,
        uniqueVoters,
        responsesOverTime,
        averageResponsesPerDay:
          totalResponses > 0
            ? totalResponses /
              Math.max(
                1,
                Math.ceil(
                  (new Date().getTime() - question.createdAt.getTime()) / (1000 * 60 * 60 * 24)
                )
              )
            : 0,
        isActive: question.isActive,
        createdAt: question.createdAt,
      };
    }, "getQuestionAnalytics");
  }),
});
