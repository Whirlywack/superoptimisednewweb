import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { questionRouter } from "../questionRouter";

// Mock Prisma
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

import { prisma } from "../../../db";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

// Get mock instances
const mockQuestionFindMany = mockPrisma.question.findMany as jest.MockedFunction<any>;
const mockQuestionFindFirst = mockPrisma.question.findFirst as jest.MockedFunction<any>;
const mockQuestionFindUnique = mockPrisma.question.findUnique as jest.MockedFunction<any>;

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
        questionType: "multiple_choice",
        questionData: {
          options: ["React", "Vue", "Angular", "Svelte"],
          allowMultiple: false,
        },
        category: "development",
        displayOrder: 2,
        createdAt: new Date("2024-01-02"),
        _count: {
          responses: 89,
        },
      },
      {
        id: "question-3",
        title: "Rate your satisfaction with the current UI",
        description: "Rating scale from 1-5",
        questionType: "rating",
        questionData: {
          scale: {
            min: 1,
            max: 5,
            labels: {
              1: "Very Poor",
              3: "Average",
              5: "Excellent",
            },
          },
        },
        category: "feedback",
        displayOrder: 3,
        createdAt: new Date("2024-01-03"),
        _count: {
          responses: 234,
        },
      },
      {
        id: "question-4",
        title: "Rank these features by importance",
        description: "Drag and drop ranking question",
        questionType: "ranking",
        questionData: {
          items: ["Performance", "Security", "User Experience", "Maintainability"],
        },
        category: "features",
        displayOrder: 4,
        createdAt: new Date("2024-01-04"),
        _count: {
          responses: 67,
        },
      },
      {
        id: "question-5",
        title: "What features would you like to see next?",
        description: "Open-ended text response",
        questionType: "text",
        questionData: {
          maxLength: 500,
          placeholder: "Describe the features you'd like...",
        },
        category: "features",
        displayOrder: 5,
        createdAt: new Date("2024-01-05"),
        _count: {
          responses: 45,
        },
      },
      {
        id: "question-6",
        title: "Which login design do you prefer?",
        description: "A/B test between two design options",
        questionType: "ab-test",
        questionData: {
          variants: [
            {
              id: "variant-a",
              name: "Classic Design",
              image: "/images/login-classic.png",
              description: "Traditional login form",
            },
            {
              id: "variant-b",
              name: "Modern Design",
              image: "/images/login-modern.png",
              description: "Modern minimalist approach",
            },
          ],
        },
        category: "design",
        displayOrder: 6,
        createdAt: new Date("2024-01-06"),
        _count: {
          responses: 123,
        },
      },
    ];

    it("should return all active questions without category filter", async () => {
      mockQuestionFindMany.mockResolvedValue(mockQuestions);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);
      const result = await caller.getActiveQuestions({});

      expect(result).toHaveLength(6);
      expect(result[0]).toEqual({
        ...mockQuestions[0],
        responseCount: 150,
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
      mockQuestionFindMany.mockResolvedValue(developmentQuestions);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);
      const result = await caller.getActiveQuestions({ category: "development" });

      expect(result).toHaveLength(2);
      expect(result[0].category).toBe("development");
      expect(result[1].category).toBe("development");

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

    it("should respect limit parameter", async () => {
      const limitedQuestions = mockQuestions.slice(0, 3);
      mockQuestionFindMany.mockResolvedValue(limitedQuestions);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);
      const result = await caller.getActiveQuestions({ limit: 3 });

      expect(result).toHaveLength(3);
      expect(mockPrisma.question.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 3,
        })
      );
    });

    it("should validate limit parameter bounds", async () => {
      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);

      // Test limit too low
      await expect(caller.getActiveQuestions({ limit: 0 })).rejects.toThrow();

      // Test limit too high
      await expect(caller.getActiveQuestions({ limit: 101 })).rejects.toThrow();
    });

    it("should handle different question types correctly", async () => {
      mockQuestionFindMany.mockResolvedValue(mockQuestions);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);
      const result = await caller.getActiveQuestions({});

      // Verify all question types are handled
      const questionTypes = result.map((q) => q.questionType);
      expect(questionTypes).toContain("binary");
      expect(questionTypes).toContain("multiple_choice");
      expect(questionTypes).toContain("rating");
      expect(questionTypes).toContain("ranking");
      expect(questionTypes).toContain("text");
      expect(questionTypes).toContain("ab-test");

      // Verify questionData structure for each type
      const binaryQ = result.find((q) => q.questionType === "binary");
      expect(binaryQ?.questionData).toEqual({
        options: ["Yes", "No"],
      });

      const multipleChoiceQ = result.find((q) => q.questionType === "multiple_choice");
      expect(multipleChoiceQ?.questionData).toEqual({
        options: ["React", "Vue", "Angular", "Svelte"],
        allowMultiple: false,
      });

      const ratingQ = result.find((q) => q.questionType === "rating");
      expect(ratingQ?.questionData).toEqual({
        scale: {
          min: 1,
          max: 5,
          labels: {
            1: "Very Poor",
            3: "Average",
            5: "Excellent",
          },
        },
      });

      const rankingQ = result.find((q) => q.questionType === "ranking");
      expect(rankingQ?.questionData).toEqual({
        items: ["Performance", "Security", "User Experience", "Maintainability"],
      });

      const textQ = result.find((q) => q.questionType === "text");
      expect(textQ?.questionData).toEqual({
        maxLength: 500,
        placeholder: "Describe the features you'd like...",
      });

      const abTestQ = result.find((q) => q.questionType === "ab-test");
      expect(abTestQ?.questionData).toEqual({
        variants: [
          {
            id: "variant-a",
            name: "Classic Design",
            image: "/images/login-classic.png",
            description: "Traditional login form",
          },
          {
            id: "variant-b",
            name: "Modern Design",
            image: "/images/login-modern.png",
            description: "Modern minimalist approach",
          },
        ],
      });
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
      mockQuestionFindFirst.mockResolvedValue(mockQuestion);

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
      mockQuestionFindFirst.mockResolvedValue(null);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);

      await expect(caller.getQuestionById({ id: "non-existent" })).rejects.toThrow(
        "Question with ID non-existent not found or is not active"
      );
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
    const mockBinaryQuestion = {
      id: "question-1",
      questionType: "binary",
      responses: [
        { responseData: "Yes", createdAt: new Date("2024-01-01") },
        { responseData: "Yes", createdAt: new Date("2024-01-02") },
        { responseData: "No", createdAt: new Date("2024-01-03") },
        { responseData: "Yes", createdAt: new Date("2024-01-04") },
      ],
    };

    const mockMultipleChoiceQuestion = {
      id: "question-2",
      questionType: "multiple_choice",
      responses: [
        { responseData: "React", createdAt: new Date("2024-01-01") },
        { responseData: "Vue", createdAt: new Date("2024-01-02") },
        { responseData: "React", createdAt: new Date("2024-01-03") },
        { responseData: "Angular", createdAt: new Date("2024-01-04") },
        { responseData: "React", createdAt: new Date("2024-01-05") },
      ],
    };

    const mockRatingQuestion = {
      id: "question-3",
      questionType: "rating",
      responses: [
        { responseData: 5, createdAt: new Date("2024-01-01") },
        { responseData: 4, createdAt: new Date("2024-01-02") },
        { responseData: 3, createdAt: new Date("2024-01-03") },
        { responseData: 5, createdAt: new Date("2024-01-04") },
      ],
    };

    const mockRankingQuestion = {
      id: "question-4",
      questionType: "ranking",
      responses: [
        {
          responseData: ["Performance", "Security", "User Experience", "Maintainability"],
          createdAt: new Date("2024-01-01"),
        },
        {
          responseData: ["Security", "Performance", "Maintainability", "User Experience"],
          createdAt: new Date("2024-01-02"),
        },
      ],
    };

    const mockTextQuestion = {
      id: "question-5",
      questionType: "text",
      responses: [
        {
          responseData: "I would like to see dark mode support",
          createdAt: new Date("2024-01-01"),
        },
        { responseData: "Better mobile responsiveness", createdAt: new Date("2024-01-02") },
        { responseData: "More customization options", createdAt: new Date("2024-01-03") },
      ],
    };

    const mockAbTestQuestion = {
      id: "question-6",
      questionType: "ab-test",
      responses: [
        { responseData: "variant-a", createdAt: new Date("2024-01-01") },
        { responseData: "variant-b", createdAt: new Date("2024-01-02") },
        { responseData: "variant-a", createdAt: new Date("2024-01-03") },
        { responseData: "variant-b", createdAt: new Date("2024-01-04") },
        { responseData: "variant-a", createdAt: new Date("2024-01-05") },
      ],
    };

    it("should return binary question results with percentages", async () => {
      mockQuestionFindUnique.mockResolvedValue(mockBinaryQuestion);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);
      const result = await caller.getQuestionResults({ questionId: "question-1" });

      expect(result).toEqual({
        questionId: "question-1",
        questionType: "binary",
        totalResponses: 4,
        results: [
          {
            option: "Yes",
            count: 3,
            percentage: 75,
          },
          {
            option: "No",
            count: 1,
            percentage: 25,
          },
        ],
      });
    });

    it("should handle multiple choice question results", async () => {
      mockQuestionFindUnique.mockResolvedValue(mockMultipleChoiceQuestion);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);
      const result = await caller.getQuestionResults({ questionId: "question-2" });

      expect(result).toEqual({
        questionId: "question-2",
        questionType: "multiple_choice",
        totalResponses: 5,
        responses: ["React", "Vue", "React", "Angular", "React"],
      });
    });

    it("should handle rating question results", async () => {
      mockQuestionFindUnique.mockResolvedValue(mockRatingQuestion);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);
      const result = await caller.getQuestionResults({ questionId: "question-3" });

      expect(result).toEqual({
        questionId: "question-3",
        questionType: "rating",
        totalResponses: 4,
        responses: [5, 4, 3, 5],
      });
    });

    it("should handle ranking question results", async () => {
      mockQuestionFindUnique.mockResolvedValue(mockRankingQuestion);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);
      const result = await caller.getQuestionResults({ questionId: "question-4" });

      expect(result).toEqual({
        questionId: "question-4",
        questionType: "ranking",
        totalResponses: 2,
        responses: [
          ["Performance", "Security", "User Experience", "Maintainability"],
          ["Security", "Performance", "Maintainability", "User Experience"],
        ],
      });
    });

    it("should handle text question results", async () => {
      mockQuestionFindUnique.mockResolvedValue(mockTextQuestion);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);
      const result = await caller.getQuestionResults({ questionId: "question-5" });

      expect(result).toEqual({
        questionId: "question-5",
        questionType: "text",
        totalResponses: 3,
        responses: [
          "I would like to see dark mode support",
          "Better mobile responsiveness",
          "More customization options",
        ],
      });
    });

    it("should handle ab-test question results", async () => {
      mockQuestionFindUnique.mockResolvedValue(mockAbTestQuestion);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);
      const result = await caller.getQuestionResults({ questionId: "question-6" });

      expect(result).toEqual({
        questionId: "question-6",
        questionType: "ab-test",
        totalResponses: 5,
        responses: ["variant-a", "variant-b", "variant-a", "variant-b", "variant-a"],
      });
    });

    it("should handle empty results", async () => {
      const mockEmptyQuestion = {
        id: "question-empty",
        questionType: "binary",
        responses: [],
      };

      mockQuestionFindUnique.mockResolvedValue(mockEmptyQuestion);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);
      const result = await caller.getQuestionResults({ questionId: "question-empty" });

      expect(result).toEqual({
        questionId: "question-empty",
        questionType: "binary",
        totalResponses: 0,
        results: [],
      });
    });

    it("should handle binary results with zero total (avoid division by zero)", async () => {
      const mockQuestionWithZeroResponses = {
        id: "question-zero",
        questionType: "binary",
        responses: [],
      };

      mockQuestionFindUnique.mockResolvedValue(mockQuestionWithZeroResponses);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);
      const result = await caller.getQuestionResults({ questionId: "question-zero" });

      expect(result.results).toEqual([]);
    });

    it("should throw QuestionNotFoundError when question does not exist", async () => {
      mockQuestionFindUnique.mockResolvedValue(null);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);

      await expect(caller.getQuestionResults({ questionId: "non-existent" })).rejects.toThrow(
        "Question with ID non-existent not found or is not active"
      );
    });
  });

  describe("date filtering", () => {
    it("should filter questions by start and end dates", async () => {
      const now = new Date();
      const _pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
      const _futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day ahead

      mockQuestionFindMany.mockResolvedValue([]);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);
      await caller.getActiveQuestions({});

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
  });

  describe("error handling", () => {
    it("should handle database errors gracefully", async () => {
      mockQuestionFindMany.mockRejectedValue(new Error("Database connection failed"));

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);

      await expect(caller.getActiveQuestions({})).rejects.toThrow("An unexpected error occurred");
    });

    it("should handle invalid question type in results", async () => {
      const mockInvalidQuestion = {
        id: "question-invalid",
        questionType: "invalid_type",
        responses: [{ responseData: "test", createdAt: new Date() }],
      };

      mockQuestionFindUnique.mockResolvedValue(mockInvalidQuestion);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = questionRouter.createCaller(ctx);
      const result = await caller.getQuestionResults({ questionId: "question-invalid" });

      // Should fall back to raw response format for unknown types
      expect(result).toEqual({
        questionId: "question-invalid",
        questionType: "invalid_type",
        totalResponses: 1,
        responses: ["test"],
      });
    });
  });
});
