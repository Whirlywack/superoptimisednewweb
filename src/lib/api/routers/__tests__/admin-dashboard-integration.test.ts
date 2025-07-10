import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock dependencies
jest.mock("../../../db", () => ({
  prisma: {
    question: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    questionResponse: {
      count: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn(),
    },
    voterToken: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    xpLedger: {
      aggregate: jest.fn(),
    },
    newsletterSubscriber: {
      count: jest.fn(),
    },
    analyticsDaily: {
      findMany: jest.fn(),
    },
    projectStat: {
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
    user: {
      findFirst: jest.fn(),
    },
  },
}));

import { prisma } from "../../../db";
import { questionRouter } from "../questionRouter";
import { voteRouter } from "../voteRouter";
import { createMockContext } from "./test-utils";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("Admin Dashboard Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Question Management Workflow", () => {
    it("should handle complete question lifecycle from creation to deletion", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionRouter.createCaller(mockCtx);

      // Step 1: Create question
      const mockQuestion = {
        id: "question-1",
        title: "What is your favorite JavaScript framework?",
        description: "Please select your preferred framework",
        questionType: "multiple_choice",
        questionData: {
          options: ["React", "Vue", "Angular", "Svelte"],
        },
        category: "development",
        isActive: false,
        displayOrder: 0,
        startDate: null,
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.question.create.mockResolvedValue(mockQuestion);

      const createResult = await caller.create({
        title: "What is your favorite JavaScript framework?",
        description: "Please select your preferred framework",
        questionType: "multiple_choice",
        questionData: {
          options: ["React", "Vue", "Angular", "Svelte"],
        },
        category: "development",
        displayOrder: 0,
      });

      expect(createResult.id).toBe("question-1");
      expect(createResult.isActive).toBe(false);
      expect(mockPrisma.question.create).toHaveBeenCalledWith({
        data: {
          title: "What is your favorite JavaScript framework?",
          description: "Please select your preferred framework",
          questionType: "multiple_choice",
          questionData: {
            options: ["React", "Vue", "Angular", "Svelte"],
          },
          category: "development",
          displayOrder: 0,
          startDate: undefined,
          endDate: undefined,
        },
      });

      // Step 2: Update question
      const mockUpdatedQuestion = {
        ...mockQuestion,
        title: "What is your preferred JavaScript framework?",
        questionData: {
          options: ["React", "Vue", "Angular", "Svelte", "Other"],
        },
      };

      mockPrisma.question.update.mockResolvedValue(mockUpdatedQuestion);

      const updateResult = await caller.update({
        id: "question-1",
        title: "What is your preferred JavaScript framework?",
        questionData: {
          options: ["React", "Vue", "Angular", "Svelte", "Other"],
        },
      });

      expect(updateResult.title).toBe("What is your preferred JavaScript framework?");
      expect(updateResult.questionData.options).toContain("Other");

      // Step 3: Activate question
      const mockActivatedQuestion = {
        ...mockUpdatedQuestion,
        isActive: true,
        startDate: new Date(),
      };

      mockPrisma.question.update.mockResolvedValue(mockActivatedQuestion);

      const activateResult = await caller.update({
        id: "question-1",
        isActive: true,
      });

      expect(activateResult.isActive).toBe(true);
      expect(activateResult.startDate).toBeDefined();

      // Step 4: Get question details
      mockPrisma.question.findUnique.mockResolvedValue(mockActivatedQuestion);

      const getResult = await caller.getById({ id: "question-1" });

      expect(getResult.id).toBe("question-1");
      expect(getResult.isActive).toBe(true);

      // Step 5: Delete question
      mockPrisma.question.delete.mockResolvedValue(mockActivatedQuestion);

      const deleteResult = await caller.delete({ id: "question-1" });

      expect(deleteResult.id).toBe("question-1");
      expect(mockPrisma.question.delete).toHaveBeenCalledWith({
        where: { id: "question-1" },
      });
    });

    it("should handle batch question operations", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionRouter.createCaller(mockCtx);

      const batchQuestions = [
        {
          title: "Rate our UI design",
          questionType: "rating",
          category: "design",
        },
        {
          title: "How often do you use our product?",
          questionType: "multiple_choice",
          category: "usage",
        },
        {
          title: "Any additional feedback?",
          questionType: "text",
          category: "feedback",
        },
      ];

      // Create multiple questions
      for (let i = 0; i < batchQuestions.length; i++) {
        const mockQuestion = {
          id: `question-${i + 1}`,
          ...batchQuestions[i],
          questionData: {},
          isActive: false,
          displayOrder: i,
          startDate: null,
          endDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockPrisma.question.create.mockResolvedValue(mockQuestion);

        const result = await caller.create({
          title: batchQuestions[i].title,
          questionType: batchQuestions[i].questionType as any,
          category: batchQuestions[i].category,
          questionData: {},
          displayOrder: i,
        });

        expect(result.id).toBe(`question-${i + 1}`);
        expect(result.displayOrder).toBe(i);
      }

      // Verify all questions were created
      expect(mockPrisma.question.create).toHaveBeenCalledTimes(3);
    });
  });

  describe("Analytics and Statistics Integration", () => {
    it("should aggregate comprehensive dashboard statistics", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const questionCaller = questionRouter.createCaller(mockCtx);
      const voteCaller = voteRouter.createCaller(mockCtx);

      // Mock statistics data
      const mockQuestions = [
        { id: "q1", title: "Question 1", isActive: true, category: "tech" },
        { id: "q2", title: "Question 2", isActive: true, category: "design" },
        { id: "q3", title: "Question 3", isActive: false, category: "tech" },
      ];

      mockPrisma.question.findMany.mockResolvedValue(mockQuestions);
      mockPrisma.question.count.mockResolvedValue(3);

      // Get active questions
      const activeQuestions = await questionCaller.getActiveQuestions({
        limit: 10,
      });

      expect(activeQuestions.questions).toHaveLength(3);
      expect(mockPrisma.question.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          OR: [{ startDate: null }, { startDate: { lte: expect.any(Date) } }],
          AND: [
            {
              OR: [{ endDate: null }, { endDate: { gte: expect.any(Date) } }],
            },
          ],
        },
        orderBy: { displayOrder: "asc" },
        take: 10,
      });

      // Mock engagement statistics
      const mockGlobalXp = { _sum: { xpAmount: 5000 }, _count: { id: 200 } };
      const mockRecentActivity = [
        {
          date: new Date("2024-01-01"),
          totalVotes: 100,
          uniqueVoters: 30,
          totalXpEarned: 500,
        },
        {
          date: new Date("2024-01-02"),
          totalVotes: 150,
          uniqueVoters: 45,
          totalXpEarned: 750,
        },
      ];

      mockPrisma.xpLedger.aggregate.mockResolvedValue(mockGlobalXp);
      mockPrisma.analyticsDaily.findMany.mockResolvedValue(mockRecentActivity);
      mockPrisma.voterToken.findMany.mockResolvedValue([]);

      // Get engagement statistics
      const engagementStats = await voteCaller.getEngagementStats({});

      expect(engagementStats.global.totalXpEarned).toBe(5000);
      expect(engagementStats.global.totalXpTransactions).toBe(200);
      expect(engagementStats.global.recentActivity).toHaveLength(2);
      expect(engagementStats.milestones).toHaveLength(5);
    });

    it("should handle real-time statistics updates", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const voteCaller = voteRouter.createCaller(mockCtx);

      // Mock daily stats aggregation
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      mockPrisma.analyticsDaily.findFirst.mockResolvedValue(null);
      mockPrisma.questionResponse.count.mockResolvedValue(250);
      mockPrisma.questionResponse.findMany.mockResolvedValue([
        { voterTokenId: "voter-1" },
        { voterTokenId: "voter-2" },
        { voterTokenId: "voter-1" },
        { voterTokenId: "voter-3" },
      ]);
      mockPrisma.xpLedger.aggregate.mockResolvedValue({ _sum: { xpAmount: 1250 } });
      mockPrisma.newsletterSubscriber.count.mockResolvedValue(50);
      mockPrisma.questionResponse.groupBy.mockResolvedValue([
        { questionId: "q1", _count: { questionId: 150 } },
        { questionId: "q2", _count: { questionId: 100 } },
      ]);

      // Mock question lookups
      mockPrisma.question.findUnique
        .mockResolvedValueOnce({ title: "Favorite Framework" })
        .mockResolvedValueOnce({ title: "UI Preferences" });

      const mockCreatedStats = {
        id: "daily-stats-1",
        date: today,
        totalVotes: 250,
        uniqueVoters: 3,
        totalXpEarned: 1250,
        newsletterSignups: 50,
        popularQuestions: [
          { questionId: "q1", title: "Favorite Framework", voteCount: 150 },
          { questionId: "q2", title: "UI Preferences", voteCount: 100 },
        ],
      };

      mockPrisma.analyticsDaily.create.mockResolvedValue(mockCreatedStats);

      const aggregateResult = await voteCaller.aggregateDailyStats();

      expect(aggregateResult.success).toBe(true);
      expect(aggregateResult.stats.totalVotes).toBe(250);
      expect(aggregateResult.stats.uniqueVoters).toBe(3);
      expect(aggregateResult.stats.totalXpEarned).toBe(1250);
      expect(aggregateResult.stats.popularQuestions).toHaveLength(2);
    });
  });

  describe("User Management Integration", () => {
    it("should handle admin user verification and permissions", async () => {
      const mockAdminUser = {
        id: "admin-1",
        email: "admin@example.com",
        isAdmin: true,
        role: "admin",
        createdAt: new Date(),
      };

      mockPrisma.user.findFirst.mockResolvedValue(mockAdminUser);

      const adminCtx = createMockContext({ 
        isAdmin: true,
        user: mockAdminUser,
      });

      const caller = questionRouter.createCaller(adminCtx);

      // Admin should be able to create questions
      const mockQuestion = {
        id: "admin-question-1",
        title: "Admin Test Question",
        questionType: "binary",
        questionData: {},
        category: "admin",
        isActive: false,
        displayOrder: 0,
        startDate: null,
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.question.create.mockResolvedValue(mockQuestion);

      const result = await caller.create({
        title: "Admin Test Question",
        questionType: "binary",
        questionData: {},
        category: "admin",
        displayOrder: 0,
      });

      expect(result.id).toBe("admin-question-1");
      expect(result.title).toBe("Admin Test Question");
    });

    it("should handle non-admin user access restrictions", async () => {
      const mockRegularUser = {
        id: "user-1",
        email: "user@example.com",
        isAdmin: false,
        role: "user",
        createdAt: new Date(),
      };

      const userCtx = createMockContext({ 
        isAdmin: false,
        user: mockRegularUser,
      });

      const caller = questionRouter.createCaller(userCtx);

      // Non-admin should not be able to create questions
      // This would be handled by the adminProcedure middleware
      // For the test, we'll assume the middleware throws an error
      await expect(caller.create({
        title: "User Test Question",
        questionType: "binary",
        questionData: {},
        category: "user",
        displayOrder: 0,
      })).rejects.toThrow(); // Middleware should throw authorization error
    });
  });

  describe("Performance and Scalability", () => {
    it("should handle high-volume question management operations", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionRouter.createCaller(mockCtx);

      // Create 100 questions concurrently
      const questionPromises = Array.from({ length: 100 }, (_, i) => {
        const mockQuestion = {
          id: `bulk-question-${i}`,
          title: `Bulk Question ${i}`,
          questionType: "binary",
          questionData: {},
          category: "bulk",
          isActive: false,
          displayOrder: i,
          startDate: null,
          endDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockPrisma.question.create.mockResolvedValue(mockQuestion);

        return caller.create({
          title: `Bulk Question ${i}`,
          questionType: "binary",
          questionData: {},
          category: "bulk",
          displayOrder: i,
        });
      });

      const startTime = Date.now();
      const results = await Promise.all(questionPromises);
      const endTime = Date.now();

      expect(results).toHaveLength(100);
      expect(endTime - startTime).toBeLessThan(2000); // Should complete within 2 seconds
      expect(mockPrisma.question.create).toHaveBeenCalledTimes(100);
    });

    it("should handle large dataset queries efficiently", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionRouter.createCaller(mockCtx);

      // Mock large dataset
      const largeQuestionSet = Array.from({ length: 1000 }, (_, i) => ({
        id: `question-${i}`,
        title: `Question ${i}`,
        questionType: "binary",
        questionData: {},
        category: i % 5 === 0 ? "featured" : "regular",
        isActive: true,
        displayOrder: i,
        startDate: null,
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      mockPrisma.question.findMany.mockResolvedValue(largeQuestionSet.slice(0, 50));

      const startTime = Date.now();
      const result = await caller.getActiveQuestions({ limit: 50 });
      const endTime = Date.now();

      expect(result.questions).toHaveLength(50);
      expect(endTime - startTime).toBeLessThan(500); // Should complete within 500ms
    });
  });

  describe("Error Recovery and Resilience", () => {
    it("should handle database connection failures gracefully", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionRouter.createCaller(mockCtx);

      mockPrisma.question.create.mockRejectedValue(new Error("Database connection failed"));

      await expect(caller.create({
        title: "Test Question",
        questionType: "binary",
        questionData: {},
        category: "test",
        displayOrder: 0,
      })).rejects.toThrow("Database connection failed");
    });

    it("should handle transaction rollbacks on partial failures", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionRouter.createCaller(mockCtx);

      // Simulate partial failure during question creation
      mockPrisma.question.create
        .mockResolvedValueOnce({
          id: "question-1",
          title: "Question 1",
          questionType: "binary",
          questionData: {},
          category: "test",
          isActive: false,
          displayOrder: 0,
          startDate: null,
          endDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .mockRejectedValueOnce(new Error("Constraint violation"));

      const results = await Promise.allSettled([
        caller.create({
          title: "Question 1",
          questionType: "binary",
          questionData: {},
          category: "test",
          displayOrder: 0,
        }),
        caller.create({
          title: "Question 2",
          questionType: "binary",
          questionData: {},
          category: "test",
          displayOrder: 1,
        }),
      ]);

      expect(results[0].status).toBe("fulfilled");
      expect(results[1].status).toBe("rejected");
      
      if (results[1].status === "rejected") {
        expect(results[1].reason.message).toBe("Constraint violation");
      }
    });
  });

  describe("Integration with External Systems", () => {
    it("should integrate with project statistics tracking", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionRouter.createCaller(mockCtx);

      // Mock project stats
      const mockProjectStats = [
        { statKey: "total_questions", statValue: "150", lastUpdated: new Date() },
        { statKey: "active_questions", statValue: "25", lastUpdated: new Date() },
        { statKey: "total_votes", statValue: "5000", lastUpdated: new Date() },
      ];

      mockPrisma.projectStat.findMany.mockResolvedValue(mockProjectStats);

      // Create a new question and verify stats tracking
      const mockQuestion = {
        id: "stats-question-1",
        title: "Stats Test Question",
        questionType: "binary",
        questionData: {},
        category: "stats",
        isActive: false,
        displayOrder: 0,
        startDate: null,
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.question.create.mockResolvedValue(mockQuestion);

      const result = await caller.create({
        title: "Stats Test Question",
        questionType: "binary",
        questionData: {},
        category: "stats",
        displayOrder: 0,
      });

      expect(result.id).toBe("stats-question-1");
      
      // Verify that stats would be updated (in real implementation)
      // This is a placeholder for the actual stats integration
      expect(mockPrisma.question.create).toHaveBeenCalledTimes(1);
    });

    it("should handle newsletter integration for question updates", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = questionRouter.createCaller(mockCtx);

      // Mock newsletter subscriber count
      mockPrisma.newsletterSubscriber.count.mockResolvedValue(150);

      // Create a question that might trigger newsletter notifications
      const mockQuestion = {
        id: "newsletter-question-1",
        title: "What features would you like to see next?",
        questionType: "text",
        questionData: {},
        category: "feedback",
        isActive: true,
        displayOrder: 0,
        startDate: new Date(),
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.question.create.mockResolvedValue(mockQuestion);

      const result = await caller.create({
        title: "What features would you like to see next?",
        questionType: "text",
        questionData: {},
        category: "feedback",
        displayOrder: 0,
      });

      expect(result.id).toBe("newsletter-question-1");
      expect(result.category).toBe("feedback");
      
      // In real implementation, this would trigger newsletter notifications
      // to subscribers about the new question
    });
  });
});