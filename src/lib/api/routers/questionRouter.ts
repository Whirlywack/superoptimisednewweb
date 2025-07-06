import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  getActiveQuestionsSchema,
  getQuestionByIdSchema,
  getQuestionResultsSchema,
} from "../schemas";
import { safeExecute } from "../errors";
import { prisma } from "../../db";

export const questionRouter = createTRPCRouter({
  getActiveQuestions: publicProcedure.input(getActiveQuestionsSchema).query(async ({ input }) => {
    return safeExecute(async () => {
      const { category, limit = 10 } = input;

      const questions = await prisma.question.findMany({
        where: {
          isActive: true,
          ...(category && { category }),
          OR: [{ scheduledStart: null }, { scheduledStart: { lte: new Date() } }],
          AND: [
            {
              OR: [{ scheduledEnd: null }, { scheduledEnd: { gte: new Date() } }],
            },
          ],
        },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          questionType: true,
          questionData: true,
          category: true,
          displayOrder: true,
          createdAt: true,
          _count: {
            select: {
              questionResponses: true,
            },
          },
        },
      });

      return questions.map((question) => ({
        ...question,
        responseCount: question._count.questionResponses,
      }));
    }, "getActiveQuestions");
  }),

  getQuestionById: publicProcedure.input(getQuestionByIdSchema).query(async ({ input }) => {
    return safeExecute(async () => {
      const question = await prisma.question.findFirst({
        where: {
          id: input.id,
          isActive: true,
          OR: [{ scheduledStart: null }, { scheduledStart: { lte: new Date() } }],
          AND: [
            {
              OR: [{ scheduledEnd: null }, { scheduledEnd: { gte: new Date() } }],
            },
          ],
        },
        select: {
          id: true,
          title: true,
          description: true,
          questionType: true,
          questionData: true,
          category: true,
          displayOrder: true,
          createdAt: true,
          _count: {
            select: {
              questionResponses: true,
            },
          },
        },
      });

      if (!question) {
        throw new Error(`Question with ID ${input.id} not found or is not active`);
      }

      return {
        ...question,
        responseCount: question._count.questionResponses,
      };
    }, "getQuestionById");
  }),

  getQuestionResults: publicProcedure.input(getQuestionResultsSchema).query(async ({ input }) => {
    return safeExecute(async () => {
      const question = await prisma.question.findUnique({
        where: { id: input.questionId },
        include: {
          questionResponses: {
            select: {
              response: true,
              createdAt: true,
            },
          },
        },
      });

      if (!question) {
        throw new Error(`Question with ID ${input.questionId} not found`);
      }

      const responses = question.questionResponses;
      const totalResponses = responses.length;

      // Handle different question types
      if (question.questionType === "binary") {
        const results = responses.reduce(
          (acc, response) => {
            const choice = response.response as string;
            acc[choice] = (acc[choice] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );

        return {
          questionId: question.id,
          questionType: question.questionType,
          totalResponses,
          results: Object.entries(results).map(([option, count]) => ({
            option,
            count,
            percentage: totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0,
          })),
        };
      }

      // For other question types, return raw aggregated data
      return {
        questionId: question.id,
        questionType: question.questionType,
        totalResponses,
        responses: responses.map((r) => r.response),
      };
    }, "getQuestionResults");
  }),
});
