import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { questionRouter } from "../questionRouter";

// Mock Prisma BEFORE importing it
jest.mock("../../../db", () => ({
  prisma: {
    question: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
    questionResponse: {
      findMany: jest.fn(),
      groupBy: jest.fn(),
      count: jest.fn(),
    },
  },
}));

// Import after mocking
import { prisma } from "../../../db";

// Create typed mock
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("questionRouter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getActiveQuestions", () => {
    const mockQuestions = [
      {
        id: "question-1",
        title: "Do you prefer TypeScript over JavaScript?",
        description: "Help us understand language preferences",
        questionType: "binary",
        questionData: {
          options: ["Yes", "No"],
        },
        category: "development",
        displayOrder: 1,
        createdAt: new Date("2024-01-01"),
        _count: {
          responses: 150,
        },
      },
      {
        id: "question-2",
        title: "What's your favorite frontend framework?",
        description: "Multiple choice question about frameworks",
        questionType: "multi-choice",
        questionData: {
          options: ["React", "Vue", "Angular", "Svelte"],
          allowMultiple: false,
        },
        category: "development",
        displayOrder: 2,
        createdAt: new Date("2024-01-02"),
        _count: {
          responses: 200,
        },
      },
    ];

    it("should return all active questions without category filter", async () => {
      mockPrisma.question.findMany.mockResolvedValue(mockQuestions);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);
      const result = await caller.getActiveQuestions({});

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        ...mockQuestions[0],
        responseCount: 150,
      });
      expect(result[1]).toEqual({
        ...mockQuestions[1],
        responseCount: 200,
      });

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
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
        take: 10,
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
              responses: true,
            },
          },
        },
      });
    });

    it("should filter questions by category", async () => {
      const developmentQuestions = mockQuestions.filter((q) => q.category === "development");
      mockPrisma.question.findMany.mockResolvedValue(developmentQuestions);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);
      const result = await caller.getActiveQuestions({ category: "development" });

      expect(result).toHaveLength(2);
      expect(result.every((q) => q.category === "development")).toBe(true);

      expect(mockPrisma.question.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          category: "development",
          OR: [{ startDate: null }, { startDate: { lte: expect.any(Date) } }],
          AND: [
            {
              OR: [{ endDate: null }, { endDate: { gte: expect.any(Date) } }],
            },
          ],
        },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
        take: 10,
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
              responses: true,
            },
          },
        },
      });
    });

    it("should validate limit parameter bounds", async () => {
      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);

      // Test limit too high
      await expect(caller.getActiveQuestions({ limit: 101 })).rejects.toThrow();

      // Test limit too low
      await expect(caller.getActiveQuestions({ limit: 0 })).rejects.toThrow();
    });
  });

  describe("getQuestionById", () => {
    const mockQuestion = {
      id: "question-1",
      title: "Do you prefer TypeScript over JavaScript?",
      description: "Help us understand language preferences",
      questionType: "binary",
      questionData: {
        options: ["Yes", "No"],
      },
      category: "development",
      displayOrder: 1,
      createdAt: new Date("2024-01-01"),
      _count: {
        responses: 150,
      },
    };

    it("should return a question by ID", async () => {
      mockPrisma.question.findFirst.mockResolvedValue(mockQuestion);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);
      const result = await caller.getQuestionById({ id: "question-1" });

      expect(result).toEqual({
        ...mockQuestion,
        responseCount: 150,
      });

      expect(mockPrisma.question.findFirst).toHaveBeenCalledWith({
        where: {
          id: "question-1",
          isActive: true,
          OR: [{ startDate: null }, { startDate: { lte: expect.any(Date) } }],
          AND: [
            {
              OR: [{ endDate: null }, { endDate: { gte: expect.any(Date) } }],
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
              responses: true,
            },
          },
        },
      });
    });

    it("should throw QuestionNotFoundError when question does not exist", async () => {
      mockPrisma.question.findFirst.mockResolvedValue(null);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);

      await expect(caller.getQuestionById({ id: "non-existent" })).rejects.toThrow();
    });

    it("should validate CUID format for question ID", async () => {
      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);

      await expect(caller.getQuestionById({ id: "invalid-id" })).rejects.toThrow();
    });
  });

  describe("getQuestionResults", () => {
    it("should return binary question results with percentages", async () => {
      const mockBinaryQuestion = {
        id: "question-1",
        questionType: "binary",
        responses: [{ responseData: "Yes" }, { responseData: "Yes" }, { responseData: "No" }],
      };

      mockPrisma.question.findUnique.mockResolvedValue(mockBinaryQuestion);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);
      const result = await caller.getQuestionResults({ questionId: "question-1" });

      expect(result.totalResponses).toBe(3);
      expect(result.results).toHaveProperty("Yes");
      expect(result.results).toHaveProperty("No");
      expect(result.results.Yes.percentage).toBeCloseTo(66.67, 1);
      expect(result.results.No.percentage).toBeCloseTo(33.33, 1);
    });

    it("should handle empty results", async () => {
      const mockEmptyQuestion = {
        id: "question-1",
        questionType: "binary",
        responses: [],
      };

      mockPrisma.question.findUnique.mockResolvedValue(mockEmptyQuestion);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);
      const result = await caller.getQuestionResults({ questionId: "question-1" });

      expect(result.totalResponses).toBe(0);
      expect(result.results).toEqual({});
    });

    it("should throw QuestionNotFoundError when question does not exist", async () => {
      mockPrisma.question.findUnique.mockResolvedValue(null);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);

      await expect(caller.getQuestionResults({ questionId: "non-existent" })).rejects.toThrow();
    });
  });

  describe("error handling", () => {
    it("should handle database errors gracefully", async () => {
      mockPrisma.question.findMany.mockRejectedValue(new Error("Database connection failed"));

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);

      await expect(caller.getActiveQuestions({})).rejects.toThrow();
    });
  });
});
