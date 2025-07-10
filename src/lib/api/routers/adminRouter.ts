import { createTRPCRouter, adminProcedure } from "../trpc";
import { deleteQuestionSchema, getQuestionByIdSchema } from "../schemas";
import { safeExecute, QuestionNotFoundError } from "../errors";
import { prisma } from "../../db";
import { generateChatCompletion, parseJsonResponse } from "../../aiClient";
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

  // Reorder questions by updating displayOrder
  reorderQuestions: adminProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          displayOrder: z.number(),
        })
      )
    )
    .mutation(async ({ input }) => {
      return safeExecute(async () => {
        // Update all questions in a transaction
        const updatePromises = input.map((item) =>
          prisma.question.update({
            where: { id: item.id },
            data: { displayOrder: item.displayOrder },
          })
        );

        await prisma.$transaction(updatePromises);

        return { success: true };
      }, "reorderQuestions");
    }),

  // AI-powered question generation
  generateQuestionSuggestions: adminProcedure
    .input(
      z.object({
        questionnaireTitle: z.string().optional(),
        questionnaireDescription: z.string().optional(),
        category: z.string().optional(),
        existingQuestions: z.array(z.string()).optional(),
        questionType: z
          .enum(["binary", "multi-choice", "rating-scale", "text-response", "ranking", "ab-test"])
          .optional(),
        count: z.number().min(1).max(10).default(5),
        context: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return safeExecute(async () => {
        const {
          questionnaireTitle,
          questionnaireDescription,
          category,
          existingQuestions = [],
          questionType,
          count,
          context,
        } = input;

        const prompt = `You are an expert questionnaire designer. Generate ${count} high-quality question suggestions based on the following context:

Questionnaire Title: ${questionnaireTitle || "Not specified"}
Description: ${questionnaireDescription || "Not specified"}
Category: ${category || "general"}
${questionType ? `Question Type: ${questionType}` : "Question Type: Any"}
${context ? `Additional Context: ${context}` : ""}

${
  existingQuestions.length > 0
    ? `Existing Questions in this questionnaire:
${existingQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Please avoid duplicating these topics and create complementary questions that add value.`
    : ""
}

Generate questions that are:
1. Clear and unambiguous
2. Relevant to the questionnaire's purpose
3. Engaging and well-structured
4. Appropriate for the specified category
5. Complementary to existing questions (if any)

Return your response as a JSON array with this exact structure:
[
  {
    "title": "The question text",
    "description": "Brief explanation of why this question is valuable (optional)",
    "type": "${questionType || "auto-suggested type"}",
    "reasoning": "Why this question fits well with the questionnaire",
    "config": {
      // Appropriate configuration for the question type
      // For multi-choice: {"options": [{"id": "1", "text": "Option 1"}, ...]}
      // For rating-scale: {"min": 1, "max": 10, "labels": {"min": "Poor", "max": "Excellent"}}
      // For ranking: {"items": [{"id": "1", "text": "Item 1"}, ...]}
      // For ab-test: {"optionA": {...}, "optionB": {...}}
      // For binary: {}
      // For text-response: {"maxLength": 500, "placeholder": "..."}
    }
  }
]`;

        const response = await generateChatCompletion(
          [{ role: "user", content: prompt }],
          "GPT_4O",
          { temperature: 0.7 }
        );

        try {
          const suggestions = parseJsonResponse(response);

          // Validate the response structure
          if (!Array.isArray(suggestions)) {
            throw new Error("Response is not an array");
          }

          const validatedSuggestions = suggestions.map((suggestion, index) => {
            if (!suggestion.title || typeof suggestion.title !== "string") {
              throw new Error(`Suggestion ${index + 1} missing valid title`);
            }
            if (!suggestion.type || typeof suggestion.type !== "string") {
              throw new Error(`Suggestion ${index + 1} missing valid type`);
            }
            if (!suggestion.config || typeof suggestion.config !== "object") {
              suggestion.config = {};
            }

            return {
              title: suggestion.title.trim(),
              description: suggestion.description || "",
              type: suggestion.type,
              reasoning: suggestion.reasoning || "",
              config: suggestion.config,
            };
          });

          return {
            suggestions: validatedSuggestions,
            context: {
              questionnaireTitle,
              category,
              existingQuestionsCount: existingQuestions.length,
              requestedType: questionType,
            },
          };
        } catch (parseError) {
          console.error("Failed to parse AI response:", parseError);
          throw new Error("Failed to generate valid question suggestions. Please try again.");
        }
      }, "generateQuestionSuggestions");
    }),

  // AI-powered question improvement
  improveQuestion: adminProcedure
    .input(
      z.object({
        questionTitle: z.string().min(1),
        questionDescription: z.string().optional(),
        questionType: z.enum([
          "binary",
          "multi-choice",
          "rating-scale",
          "text-response",
          "ranking",
          "ab-test",
        ]),
        questionConfig: z.record(z.unknown()).optional(),
        category: z.string().optional(),
        improvementAreas: z
          .array(
            z.enum(["clarity", "bias-reduction", "engagement", "specificity", "response-quality"])
          )
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      return safeExecute(async () => {
        const {
          questionTitle,
          questionDescription,
          questionType,
          questionConfig,
          category,
          improvementAreas = ["clarity", "engagement"],
        } = input;

        const prompt = `You are an expert questionnaire designer and researcher. Analyze and improve the following question:

Original Question:
Title: "${questionTitle}"
Description: ${questionDescription || "None provided"}
Type: ${questionType}
Category: ${category || "general"}
Current Config: ${JSON.stringify(questionConfig || {}, null, 2)}

Improvement Areas Requested: ${improvementAreas.join(", ")}

Please provide specific, actionable improvements focusing on:
${improvementAreas
  .map((area) => {
    switch (area) {
      case "clarity":
        return "- Making the question clearer and easier to understand";
      case "bias-reduction":
        return "- Reducing potential bias and leading language";
      case "engagement":
        return "- Making the question more engaging and motivating";
      case "specificity":
        return "- Adding appropriate specificity without being too narrow";
      case "response-quality":
        return "- Improving the likelihood of getting quality responses";
      default:
        return `- Improving ${area}`;
    }
  })
  .join("\n")}

Return your response as JSON with this structure:
{
  "improvedTitle": "Enhanced question text",
  "improvedDescription": "Enhanced description (if needed)",
  "improvementSummary": "Brief summary of key changes made",
  "improvements": [
    {
      "area": "clarity|bias-reduction|engagement|specificity|response-quality",
      "before": "What was problematic",
      "after": "How it was improved",
      "reasoning": "Why this change helps"
    }
  ],
  "configSuggestions": {
    // Enhanced configuration for the question type
  },
  "alternativeVersions": [
    // 2-3 alternative phrasings if significantly different approaches are possible
    {
      "title": "Alternative question text",
      "reasoning": "Why this alternative might work better in certain contexts"
    }
  ]
}`;

        const response = await generateChatCompletion(
          [{ role: "user", content: prompt }],
          "GPT_4O",
          { temperature: 0.5 }
        );

        try {
          const improvement = parseJsonResponse(response);

          // Validate the response structure
          if (!improvement.improvedTitle || typeof improvement.improvedTitle !== "string") {
            throw new Error("Missing improved title");
          }

          return {
            original: {
              title: questionTitle,
              description: questionDescription,
              type: questionType,
              config: questionConfig,
            },
            improved: {
              title: improvement.improvedTitle.trim(),
              description: improvement.improvedDescription || questionDescription,
              config: improvement.configSuggestions || questionConfig,
            },
            analysis: {
              summary: improvement.improvementSummary || "Question has been enhanced",
              improvements: improvement.improvements || [],
              alternatives: improvement.alternativeVersions || [],
            },
          };
        } catch (parseError) {
          console.error("Failed to parse AI improvement response:", parseError);
          throw new Error("Failed to generate question improvements. Please try again.");
        }
      }, "improveQuestion");
    }),
});
