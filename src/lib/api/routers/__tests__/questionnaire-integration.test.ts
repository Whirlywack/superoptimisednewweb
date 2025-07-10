import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock dependencies
jest.mock("../../../db", () => ({
  prisma: {
    questionnaire: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    questionnaireQuestion: {
      create: jest.fn(),
      createMany: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    questionnaireResponse: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    question: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

import { prisma } from "../../../db";
import { questionnaireRouter } from "../questionnaireRouter";
import { createMockContext } from "./test-utils";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("Questionnaire Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Complete Questionnaire Lifecycle", () => {
    it("should create, configure, and manage questionnaire from start to finish", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      
      // Step 1: Create questionnaire
      const mockQuestionnaire = {
        id: "questionnaire-1",
        title: "User Experience Survey",
        description: "Comprehensive UX feedback questionnaire",
        category: "ux",
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.questionnaire.create.mockResolvedValue(mockQuestionnaire);
      mockPrisma.questionnaireQuestion.createMany.mockResolvedValue({ count: 0 });

      const caller = questionnaireRouter.createCaller(mockCtx);
      
      const createResult = await caller.create({
        title: "User Experience Survey",
        description: "Comprehensive UX feedback questionnaire",
        category: "ux",
        questionIds: [],
      });

      expect(createResult.id).toBe("questionnaire-1");
      expect(createResult.title).toBe("User Experience Survey");
      expect(mockPrisma.questionnaire.create).toHaveBeenCalledWith({
        data: {
          title: "User Experience Survey",
          description: "Comprehensive UX feedback questionnaire",
          category: "ux",
        },
      });

      // Step 2: Add questions to questionnaire
      const mockQuestionnaireQuestion = {
        id: "qq-1",
        questionnaireId: "questionnaire-1",
        questionId: "question-1",
        displayOrder: 0,
        isRequired: true,
        createdAt: new Date(),
        question: {
          id: "question-1",
          title: "How satisfied are you with our product?",
          questionType: "rating",
        },
      };

      mockPrisma.questionnaireQuestion.count.mockResolvedValue(0);
      mockPrisma.questionnaireQuestion.create.mockResolvedValue(mockQuestionnaireQuestion);

      const addQuestionResult = await caller.addQuestion({
        questionnaireId: "questionnaire-1",
        questionId: "question-1",
        isRequired: true,
      });

      expect(addQuestionResult.questionId).toBe("question-1");
      expect(addQuestionResult.displayOrder).toBe(0);
      expect(mockPrisma.questionnaireQuestion.create).toHaveBeenCalledWith({
        data: {
          questionnaireId: "questionnaire-1",
          questionId: "question-1",
          displayOrder: 0,
          isRequired: true,
        },
        include: {
          question: true,
        },
      });

      // Step 3: Reorder questions
      mockPrisma.questionnaireQuestion.update.mockResolvedValue({
        ...mockQuestionnaireQuestion,
        displayOrder: 1,
      });

      const reorderResult = await caller.reorderQuestions({
        questionnaireId: "questionnaire-1",
        questionOrders: [
          { questionId: "question-1", displayOrder: 1 },
        ],
      });

      expect(reorderResult.success).toBe(true);
      expect(mockPrisma.questionnaireQuestion.update).toHaveBeenCalledWith({
        where: {
          questionnaireId_questionId: {
            questionnaireId: "questionnaire-1",
            questionId: "question-1",
          },
        },
        data: {
          displayOrder: 1,
        },
      });

      // Step 4: Activate questionnaire
      const mockUpdatedQuestionnaire = {
        ...mockQuestionnaire,
        status: "active",
        startDate: new Date(),
      };

      mockPrisma.questionnaire.update.mockResolvedValue(mockUpdatedQuestionnaire);

      const activateResult = await caller.updateStatus({
        id: "questionnaire-1",
        status: "active",
      });

      expect(activateResult.status).toBe("active");
      expect(activateResult.startDate).toBeDefined();
      expect(mockPrisma.questionnaire.update).toHaveBeenCalledWith({
        where: { id: "questionnaire-1" },
        data: {
          status: "active",
          startDate: expect.any(Date),
          endDate: undefined,
        },
      });

      // Step 5: Get questionnaire with full details
      const mockFullQuestionnaire = {
        ...mockUpdatedQuestionnaire,
        questions: [mockQuestionnaireQuestion],
        responses: [],
      };

      mockPrisma.questionnaire.findUnique.mockResolvedValue(mockFullQuestionnaire);

      const getResult = await caller.getById({ id: "questionnaire-1" });

      expect(getResult.id).toBe("questionnaire-1");
      expect(getResult.questions).toHaveLength(1);
      expect(getResult.questions[0].question.title).toBe("How satisfied are you with our product?");
    });

    it("should handle questionnaire creation with multiple questions", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionnaireRouter.createCaller(mockCtx);

      const mockQuestionnaire = {
        id: "questionnaire-2",
        title: "Multi-Question Survey",
        description: "Survey with multiple questions",
        category: "feedback",
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.questionnaire.create.mockResolvedValue(mockQuestionnaire);
      mockPrisma.questionnaireQuestion.createMany.mockResolvedValue({ count: 3 });

      const result = await caller.create({
        title: "Multi-Question Survey",
        description: "Survey with multiple questions",
        category: "feedback",
        questionIds: ["q1", "q2", "q3"],
      });

      expect(result.id).toBe("questionnaire-2");
      expect(mockPrisma.questionnaireQuestion.createMany).toHaveBeenCalledWith({
        data: [
          { questionnaireId: "questionnaire-2", questionId: "q1", displayOrder: 0 },
          { questionnaireId: "questionnaire-2", questionId: "q2", displayOrder: 1 },
          { questionnaireId: "questionnaire-2", questionId: "q3", displayOrder: 2 },
        ],
      });
    });
  });

  describe("Questionnaire Statistics Integration", () => {
    it("should calculate comprehensive statistics across all questionnaires", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionnaireRouter.createCaller(mockCtx);

      // Mock statistics data
      mockPrisma.questionnaire.count
        .mockResolvedValueOnce(25) // total questionnaires
        .mockResolvedValueOnce(8); // active questionnaires
      
      mockPrisma.question.count.mockResolvedValue(150); // total questions
      mockPrisma.questionnaireResponse.count
        .mockResolvedValueOnce(500) // total responses
        .mockResolvedValueOnce(425); // completed responses

      const stats = await caller.getStats();

      expect(stats).toEqual({
        totalQuestionnaires: 25,
        activeQuestionnaires: 8,
        totalQuestions: 150,
        totalResponses: 425,
        completionRate: 85, // 425/500 * 100
      });

      // Verify all database calls were made
      expect(mockPrisma.questionnaire.count).toHaveBeenCalledTimes(2);
      expect(mockPrisma.question.count).toHaveBeenCalledTimes(1);
      expect(mockPrisma.questionnaireResponse.count).toHaveBeenCalledTimes(2);
    });

    it("should handle zero responses gracefully in statistics", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionnaireRouter.createCaller(mockCtx);

      mockPrisma.questionnaire.count
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(2);
      mockPrisma.question.count.mockResolvedValue(20);
      mockPrisma.questionnaireResponse.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);

      const stats = await caller.getStats();

      expect(stats.completionRate).toBe(0);
      expect(stats.totalResponses).toBe(0);
    });
  });

  describe("Questionnaire Retrieval and Filtering", () => {
    it("should retrieve questionnaires with pagination and filtering", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionnaireRouter.createCaller(mockCtx);

      const mockQuestionnaires = [
        {
          id: "q1",
          title: "Active Survey 1",
          status: "active",
          createdAt: new Date("2024-01-01"),
          questions: [{ question: { title: "Question 1" } }],
          responses: [],
          _count: { responses: 10 },
        },
        {
          id: "q2",
          title: "Active Survey 2",
          status: "active",
          createdAt: new Date("2024-01-02"),
          questions: [
            { question: { title: "Question 2" } },
            { question: { title: "Question 3" } },
          ],
          responses: [],
          _count: { responses: 5 },
        },
      ];

      mockPrisma.questionnaire.findMany.mockResolvedValue(mockQuestionnaires);

      const result = await caller.getAll({
        limit: 10,
        status: "active",
      });

      expect(result.questionnaires).toHaveLength(2);
      expect(result.questionnaires[0].questionCount).toBe(1);
      expect(result.questionnaires[1].questionCount).toBe(2);
      expect(result.questionnaires[0].responseCount).toBe(10);
      expect(result.nextCursor).toBeUndefined();

      expect(mockPrisma.questionnaire.findMany).toHaveBeenCalledWith({
        where: { status: "active" },
        take: 11, // limit + 1
        cursor: undefined,
        orderBy: { createdAt: "desc" },
        include: {
          questions: {
            include: { question: true },
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
    });

    it("should handle cursor-based pagination correctly", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionnaireRouter.createCaller(mockCtx);

      const mockQuestionnaires = Array.from({ length: 6 }, (_, i) => ({
        id: `q${i + 1}`,
        title: `Survey ${i + 1}`,
        status: "draft",
        createdAt: new Date(`2024-01-0${i + 1}`),
        questions: [],
        responses: [],
        _count: { responses: 0 },
      }));

      mockPrisma.questionnaire.findMany.mockResolvedValue(mockQuestionnaires);

      const result = await caller.getAll({
        limit: 5,
        cursor: "q3",
      });

      expect(result.questionnaires).toHaveLength(5);
      expect(result.nextCursor).toBe("q6");

      expect(mockPrisma.questionnaire.findMany).toHaveBeenCalledWith({
        where: {},
        take: 6,
        cursor: { id: "q3" },
        orderBy: { createdAt: "desc" },
        include: expect.any(Object),
      });
    });
  });

  describe("Question Management Integration", () => {
    it("should handle complex question reordering scenarios", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionnaireRouter.createCaller(mockCtx);

      const questionOrders = [
        { questionId: "q1", displayOrder: 2 },
        { questionId: "q2", displayOrder: 0 },
        { questionId: "q3", displayOrder: 1 },
      ];

      mockPrisma.questionnaireQuestion.update.mockResolvedValue({
        id: "qq-1",
        questionnaireId: "questionnaire-1",
        questionId: "q1",
        displayOrder: 2,
        isRequired: true,
        createdAt: new Date(),
      });

      const result = await caller.reorderQuestions({
        questionnaireId: "questionnaire-1",
        questionOrders,
      });

      expect(result.success).toBe(true);
      expect(mockPrisma.questionnaireQuestion.update).toHaveBeenCalledTimes(3);

      // Verify each update call
      questionOrders.forEach((order, index) => {
        expect(mockPrisma.questionnaireQuestion.update).toHaveBeenNthCalledWith(
          index + 1,
          {
            where: {
              questionnaireId_questionId: {
                questionnaireId: "questionnaire-1",
                questionId: order.questionId,
              },
            },
            data: {
              displayOrder: order.displayOrder,
            },
          }
        );
      });
    });

    it("should handle question removal and cascade effects", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionnaireRouter.createCaller(mockCtx);

      mockPrisma.questionnaireQuestion.delete.mockResolvedValue({
        id: "qq-1",
        questionnaireId: "questionnaire-1",
        questionId: "question-1",
        displayOrder: 0,
        isRequired: true,
        createdAt: new Date(),
      });

      const result = await caller.removeQuestion({
        questionnaireId: "questionnaire-1",
        questionId: "question-1",
      });

      expect(result.questionId).toBe("question-1");
      expect(mockPrisma.questionnaireQuestion.delete).toHaveBeenCalledWith({
        where: {
          questionnaireId_questionId: {
            questionnaireId: "questionnaire-1",
            questionId: "question-1",
          },
        },
      });
    });
  });

  describe("Status Management Integration", () => {
    it("should handle questionnaire lifecycle status changes", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionnaireRouter.createCaller(mockCtx);

      const statusTransitions = [
        { status: "active", expectStartDate: true, expectEndDate: false },
        { status: "closed", expectStartDate: false, expectEndDate: true },
        { status: "draft", expectStartDate: false, expectEndDate: false },
      ];

      for (const transition of statusTransitions) {
        const mockUpdatedQuestionnaire = {
          id: "questionnaire-1",
          title: "Test Questionnaire",
          status: transition.status,
          startDate: transition.expectStartDate ? new Date() : undefined,
          endDate: transition.expectEndDate ? new Date() : undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockPrisma.questionnaire.update.mockResolvedValue(mockUpdatedQuestionnaire);

        const result = await caller.updateStatus({
          id: "questionnaire-1",
          status: transition.status as "draft" | "active" | "closed",
        });

        expect(result.status).toBe(transition.status);
        
        if (transition.expectStartDate) {
          expect(result.startDate).toBeDefined();
        }
        
        if (transition.expectEndDate) {
          expect(result.endDate).toBeDefined();
        }
      }
    });

    it("should handle questionnaire update with partial data", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionnaireRouter.createCaller(mockCtx);

      const mockUpdatedQuestionnaire = {
        id: "questionnaire-1",
        title: "Updated Title",
        description: "Original description",
        category: "feedback",
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.questionnaire.update.mockResolvedValue(mockUpdatedQuestionnaire);

      const result = await caller.update({
        id: "questionnaire-1",
        title: "Updated Title",
        // Only updating title, other fields should remain unchanged
      });

      expect(result.title).toBe("Updated Title");
      expect(mockPrisma.questionnaire.update).toHaveBeenCalledWith({
        where: { id: "questionnaire-1" },
        data: { title: "Updated Title" },
      });
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("should handle questionnaire not found errors", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionnaireRouter.createCaller(mockCtx);

      mockPrisma.questionnaire.findUnique.mockResolvedValue(null);

      await expect(caller.getById({ id: "non-existent" })).rejects.toThrow(
        "Questionnaire not found"
      );
    });

    it("should handle database errors gracefully", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionnaireRouter.createCaller(mockCtx);

      mockPrisma.questionnaire.create.mockRejectedValue(new Error("Database error"));

      await expect(caller.create({
        title: "Test Survey",
        description: "Test description",
      })).rejects.toThrow("Database error");
    });

    it("should handle questionnaire deletion with cascading effects", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionnaireRouter.createCaller(mockCtx);

      const mockDeletedQuestionnaire = {
        id: "questionnaire-1",
        title: "Deleted Survey",
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.questionnaire.delete.mockResolvedValue(mockDeletedQuestionnaire);

      const result = await caller.delete({ id: "questionnaire-1" });

      expect(result.id).toBe("questionnaire-1");
      expect(mockPrisma.questionnaire.delete).toHaveBeenCalledWith({
        where: { id: "questionnaire-1" },
      });
    });
  });

  describe("Performance and Concurrency", () => {
    it("should handle concurrent question additions efficiently", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionnaireRouter.createCaller(mockCtx);

      const questions = ["q1", "q2", "q3", "q4", "q5"];
      const promises = questions.map((questionId, index) => {
        mockPrisma.questionnaireQuestion.count.mockResolvedValue(index);
        mockPrisma.questionnaireQuestion.create.mockResolvedValue({
          id: `qq-${index}`,
          questionnaireId: "questionnaire-1",
          questionId,
          displayOrder: index,
          isRequired: true,
          createdAt: new Date(),
          question: { id: questionId, title: `Question ${index}` },
        });

        return caller.addQuestion({
          questionnaireId: "questionnaire-1",
          questionId,
          displayOrder: index,
        });
      });

      const results = await Promise.all(promises);

      expect(results).toHaveLength(5);
      results.forEach((result, index) => {
        expect(result.questionId).toBe(`q${index + 1}`);
        expect(result.displayOrder).toBe(index);
      });
    });

    it("should handle large questionnaire retrieval efficiently", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionnaireRouter.createCaller(mockCtx);

      const largeQuestionnaireList = Array.from({ length: 100 }, (_, i) => ({
        id: `q${i}`,
        title: `Survey ${i}`,
        status: "draft",
        createdAt: new Date(),
        questions: Array.from({ length: 10 }, (_, j) => ({
          question: { title: `Question ${j}` },
        })),
        responses: [],
        _count: { responses: Math.floor(Math.random() * 100) },
      }));

      mockPrisma.questionnaire.findMany.mockResolvedValue(largeQuestionnaireList.slice(0, 51));

      const startTime = Date.now();
      const result = await caller.getAll({ limit: 50 });
      const endTime = Date.now();

      expect(result.questionnaires).toHaveLength(50);
      expect(result.nextCursor).toBe("q50");
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });

  describe("Cross-Component Integration", () => {
    it("should integrate questionnaire management with question lifecycle", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionnaireRouter.createCaller(mockCtx);

      // Create questionnaire
      const mockQuestionnaire = {
        id: "integrated-questionnaire",
        title: "Integration Test Survey",
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.questionnaire.create.mockResolvedValue(mockQuestionnaire);
      mockPrisma.questionnaireQuestion.createMany.mockResolvedValue({ count: 0 });

      const questionnaire = await caller.create({
        title: "Integration Test Survey",
        questionIds: [],
      });

      // Add questions
      const questions = ["q1", "q2", "q3"];
      for (let i = 0; i < questions.length; i++) {
        mockPrisma.questionnaireQuestion.count.mockResolvedValue(i);
        mockPrisma.questionnaireQuestion.create.mockResolvedValue({
          id: `qq-${i}`,
          questionnaireId: questionnaire.id,
          questionId: questions[i],
          displayOrder: i,
          isRequired: true,
          createdAt: new Date(),
          question: { id: questions[i], title: `Question ${i + 1}` },
        });

        await caller.addQuestion({
          questionnaireId: questionnaire.id,
          questionId: questions[i],
        });
      }

      // Reorder questions
      mockPrisma.questionnaireQuestion.update.mockResolvedValue({
        id: "qq-1",
        questionnaireId: questionnaire.id,
        questionId: "q1",
        displayOrder: 2,
        isRequired: true,
        createdAt: new Date(),
      });

      await caller.reorderQuestions({
        questionnaireId: questionnaire.id,
        questionOrders: [
          { questionId: "q1", displayOrder: 2 },
          { questionId: "q2", displayOrder: 0 },
          { questionId: "q3", displayOrder: 1 },
        ],
      });

      // Activate questionnaire
      mockPrisma.questionnaire.update.mockResolvedValue({
        ...mockQuestionnaire,
        status: "active",
        startDate: new Date(),
      });

      const activatedQuestionnaire = await caller.updateStatus({
        id: questionnaire.id,
        status: "active",
      });

      expect(activatedQuestionnaire.status).toBe("active");
      expect(activatedQuestionnaire.startDate).toBeDefined();

      // Verify all operations completed successfully
      expect(mockPrisma.questionnaire.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.questionnaireQuestion.create).toHaveBeenCalledTimes(3);
      expect(mockPrisma.questionnaireQuestion.update).toHaveBeenCalledTimes(3);
      expect(mockPrisma.questionnaire.update).toHaveBeenCalledTimes(1);
    });
  });
});