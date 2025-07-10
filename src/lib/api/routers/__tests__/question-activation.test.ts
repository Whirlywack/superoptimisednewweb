import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { adminRouter } from "../adminRouter";
import { questionRouter } from "../questionRouter";
import { voteRouter } from "../voteRouter";
import { 
  createMockContext, 
  createMockQuestion, 
  createMockVoterToken, 
  createMockQuestionResponse 
} from "./test-utils";

// Mock dependencies
jest.mock("../../../db", () => ({
  prisma: {
    question: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    questionResponse: {
      findFirst: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
    voterToken: {
      findFirst: jest.fn(),
    },
  },
}));

jest.mock("../../voterToken", () => ({
  getOrCreateVoterToken: jest.fn(),
  hasVoterVoted: jest.fn(),
  getVoterRateLimit: jest.fn(),
  incrementRateLimit: jest.fn(),
}));

jest.mock("../../../background-jobs", () => ({
  queueVoteEnhancement: jest.fn(),
}));

jest.mock("../../../email/sendEmail", () => ({
  sendXpClaimEmail: jest.fn(),
}));

jest.mock("../../../progress-automation", () => ({
  onXpClaimed: jest.fn(),
}));

jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
}));

import { prisma } from "../../../db";
import { 
  getOrCreateVoterToken, 
  hasVoterVoted,
  getVoterRateLimit, 
  incrementRateLimit 
} from "../../voterToken";
import { randomUUID } from "crypto";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockGetOrCreateVoterToken = getOrCreateVoterToken as jest.MockedFunction<typeof getOrCreateVoterToken>;
const mockHasVoterVoted = hasVoterVoted as jest.MockedFunction<typeof hasVoterVoted>;
const mockGetVoterRateLimit = getVoterRateLimit as jest.MockedFunction<typeof getVoterRateLimit>;
const mockIncrementRateLimit = incrementRateLimit as jest.MockedFunction<typeof incrementRateLimit>;
const mockRandomUUID = randomUUID as jest.MockedFunction<typeof randomUUID>;

describe("Question Activation/Deactivation Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocks
    mockGetVoterRateLimit.mockResolvedValue({
      remaining: 10,
      resetTime: new Date(Date.now() + 60000),
    });
    
    mockGetOrCreateVoterToken.mockResolvedValue({
      token: "test-token",
      voterTokenRecord: createMockVoterToken(),
    });
    
    mockHasVoterVoted.mockResolvedValue(false);
    mockIncrementRateLimit.mockResolvedValue(undefined);
    mockRandomUUID.mockReturnValue("test-uuid");
  });

  describe("Admin Question Activation Toggle", () => {
    it("should toggle question from inactive to active", async () => {
      const inactiveQuestion = createMockQuestion({ 
        id: "question-1", 
        isActive: false 
      });
      
      const activeQuestion = createMockQuestion({ 
        id: "question-1", 
        isActive: true 
      });

      mockPrisma.question.findUnique.mockResolvedValue(inactiveQuestion);
      mockPrisma.question.update.mockResolvedValue(activeQuestion);

      const ctx = createMockContext();
      const caller = adminRouter.createCaller(ctx);

      const result = await caller.toggleQuestionStatus({
        id: "question-1",
        isActive: true,
      });

      expect(result.isActive).toBe(true);
      expect(mockPrisma.question.update).toHaveBeenCalledWith({
        where: { id: "question-1" },
        data: { isActive: true },
      });
    });

    it("should toggle question from active to inactive", async () => {
      const activeQuestion = createMockQuestion({ 
        id: "question-1", 
        isActive: true 
      });
      
      const inactiveQuestion = createMockQuestion({ 
        id: "question-1", 
        isActive: false 
      });

      mockPrisma.question.findUnique.mockResolvedValue(activeQuestion);
      mockPrisma.question.update.mockResolvedValue(inactiveQuestion);

      const ctx = createMockContext();
      const caller = adminRouter.createCaller(ctx);

      const result = await caller.toggleQuestionStatus({
        id: "question-1",
        isActive: false,
      });

      expect(result.isActive).toBe(false);
      expect(mockPrisma.question.update).toHaveBeenCalledWith({
        where: { id: "question-1" },
        data: { isActive: false },
      });
    });

    it("should throw error when question not found", async () => {
      mockPrisma.question.findUnique.mockResolvedValue(null);

      const ctx = createMockContext();
      const caller = adminRouter.createCaller(ctx);

      await expect(caller.toggleQuestionStatus({
        id: "non-existent",
        isActive: true,
      })).rejects.toThrow("Question not found");
    });

    it("should handle database errors during toggle", async () => {
      const question = createMockQuestion({ id: "question-1" });
      mockPrisma.question.findUnique.mockResolvedValue(question);
      mockPrisma.question.update.mockRejectedValue(new Error("Database error"));

      const ctx = createMockContext();
      const caller = adminRouter.createCaller(ctx);

      await expect(caller.toggleQuestionStatus({
        id: "question-1",
        isActive: true,
      })).rejects.toThrow("Database error");
    });
  });

  describe("Question Scheduling (Start/End Dates)", () => {
    it("should update question schedule with start and end dates", async () => {
      const question = createMockQuestion({ id: "question-1" });
      const startDate = new Date("2024-01-01T10:00:00Z");
      const endDate = new Date("2024-01-31T10:00:00Z");
      
      const updatedQuestion = createMockQuestion({
        id: "question-1",
        startDate,
        endDate,
      });

      mockPrisma.question.findUnique.mockResolvedValue(question);
      mockPrisma.question.update.mockResolvedValue(updatedQuestion);

      const ctx = createMockContext();
      const caller = adminRouter.createCaller(ctx);

      const result = await caller.updateQuestionSchedule({
        id: "question-1",
        startDate,
        endDate,
      });

      expect(result.startDate).toEqual(startDate);
      expect(result.endDate).toEqual(endDate);
      expect(mockPrisma.question.update).toHaveBeenCalledWith({
        where: { id: "question-1" },
        data: { startDate, endDate },
      });
    });

    it("should clear schedule dates when set to null", async () => {
      const question = createMockQuestion({ 
        id: "question-1",
        startDate: new Date("2024-01-01T10:00:00Z"),
        endDate: new Date("2024-01-31T10:00:00Z"),
      });
      
      const updatedQuestion = createMockQuestion({
        id: "question-1",
        startDate: null,
        endDate: null,
      });

      mockPrisma.question.findUnique.mockResolvedValue(question);
      mockPrisma.question.update.mockResolvedValue(updatedQuestion);

      const ctx = createMockContext();
      const caller = adminRouter.createCaller(ctx);

      const result = await caller.updateQuestionSchedule({
        id: "question-1",
        startDate: null,
        endDate: null,
      });

      expect(result.startDate).toBe(null);
      expect(result.endDate).toBe(null);
    });
  });

  describe("Active Question Filtering", () => {
    const now = new Date("2024-01-15T10:00:00Z");

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(now);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should return questions that are active with no date restrictions", async () => {
      const activeQuestion = createMockQuestion({
        id: "question-1",
        isActive: true,
        startDate: null,
        endDate: null,
      });

      mockPrisma.question.findMany.mockResolvedValue([activeQuestion]);

      const ctx = createMockContext();
      const caller = questionRouter.createCaller(ctx);

      const result = await caller.getActiveQuestions({});

      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].id).toBe("question-1");
      
      // Verify the complex filtering logic
      expect(mockPrisma.question.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          OR: [{ startDate: null }, { startDate: { lte: now } }],
          AND: [
            {
              OR: [{ endDate: null }, { endDate: { gte: now } }],
            },
          ],
        },
        orderBy: { displayOrder: "asc" },
        include: {
          _count: { select: { responses: true } },
        },
      });
    });

    it("should return questions that are active and scheduled for current time", async () => {
      const scheduledQuestion = createMockQuestion({
        id: "question-1",
        isActive: true,
        startDate: new Date("2024-01-01T10:00:00Z"), // Past start date
        endDate: new Date("2024-01-31T10:00:00Z"), // Future end date
      });

      mockPrisma.question.findMany.mockResolvedValue([scheduledQuestion]);

      const ctx = createMockContext();
      const caller = questionRouter.createCaller(ctx);

      const result = await caller.getActiveQuestions({});

      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].id).toBe("question-1");
    });

    it("should not return questions that are not yet started", async () => {
      const _futureQuestion = createMockQuestion({
        id: "question-1",
        isActive: true,
        startDate: new Date("2024-01-31T10:00:00Z"), // Future start date
        endDate: null,
      });

      mockPrisma.question.findMany.mockResolvedValue([]);

      const ctx = createMockContext();
      const caller = questionRouter.createCaller(ctx);

      const result = await caller.getActiveQuestions({});

      expect(result.questions).toHaveLength(0);
    });

    it("should not return questions that have expired", async () => {
      const _expiredQuestion = createMockQuestion({
        id: "question-1",
        isActive: true,
        startDate: null,
        endDate: new Date("2024-01-01T10:00:00Z"), // Past end date
      });

      mockPrisma.question.findMany.mockResolvedValue([]);

      const ctx = createMockContext();
      const caller = questionRouter.createCaller(ctx);

      const result = await caller.getActiveQuestions({});

      expect(result.questions).toHaveLength(0);
    });

    it("should not return questions that are manually deactivated", async () => {
      const _deactivatedQuestion = createMockQuestion({
        id: "question-1",
        isActive: false,
        startDate: null,
        endDate: null,
      });

      mockPrisma.question.findMany.mockResolvedValue([]);

      const ctx = createMockContext();
      const caller = questionRouter.createCaller(ctx);

      const result = await caller.getActiveQuestions({});

      expect(result.questions).toHaveLength(0);
    });
  });

  describe("Vote Submission Activation Validation", () => {
    const now = new Date("2024-01-15T10:00:00Z");

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(now);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should allow voting on active questions", async () => {
      const activeQuestion = createMockQuestion({
        id: "question-1",
        isActive: true,
        startDate: null,
        endDate: null,
      });

      const mockVoteResponse = createMockQuestionResponse();

      mockPrisma.question.findFirst.mockResolvedValue(activeQuestion);
      mockPrisma.questionResponse.create.mockResolvedValue(mockVoteResponse);

      const ctx = createMockContext();
      const caller = voteRouter.createCaller(ctx);

      const result = await caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      });

      expect(result.success).toBe(true);
      expect(mockPrisma.question.findFirst).toHaveBeenCalledWith({
        where: {
          id: "question-1",
          isActive: true,
          OR: [{ startDate: null }, { startDate: { lte: now } }],
          AND: [
            {
              OR: [{ endDate: null }, { endDate: { gte: now } }],
            },
          ],
        },
        select: { id: true },
      });
    });

    it("should reject voting on inactive questions", async () => {
      mockPrisma.question.findFirst.mockResolvedValue(null);

      const ctx = createMockContext();
      const caller = voteRouter.createCaller(ctx);

      await expect(caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      })).rejects.toThrow("Question with ID question-1 not found or is not active");
    });

    it("should reject voting on questions not yet started", async () => {
      mockPrisma.question.findFirst.mockResolvedValue(null);

      const ctx = createMockContext();
      const caller = voteRouter.createCaller(ctx);

      await expect(caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      })).rejects.toThrow("Question with ID question-1 not found or is not active");
    });

    it("should reject voting on expired questions", async () => {
      mockPrisma.question.findFirst.mockResolvedValue(null);

      const ctx = createMockContext();
      const caller = voteRouter.createCaller(ctx);

      await expect(caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      })).rejects.toThrow("Question with ID question-1 not found or is not active");
    });
  });

  describe("Question Soft Delete with Activation", () => {
    it("should soft delete question with responses by deactivating it", async () => {
      const questionWithResponses = createMockQuestion({
        id: "question-1",
        isActive: true,
      });

      const updatedQuestion = createMockQuestion({
        id: "question-1",
        isActive: false,
        endDate: new Date(),
      });

      mockPrisma.question.findUnique.mockResolvedValue(questionWithResponses);
      mockPrisma.questionResponse.count.mockResolvedValue(5); // Has responses
      mockPrisma.question.update.mockResolvedValue(updatedQuestion);

      const ctx = createMockContext();
      const caller = adminRouter.createCaller(ctx);

      const result = await caller.deleteQuestion({ id: "question-1" });

      expect(result.wasDeleted).toBe(false);
      expect(result.wasDeactivated).toBe(true);
      expect(mockPrisma.question.update).toHaveBeenCalledWith({
        where: { id: "question-1" },
        data: { 
          isActive: false,
          endDate: expect.any(Date),
        },
      });
    });

    it("should hard delete question without responses", async () => {
      const questionWithoutResponses = createMockQuestion({
        id: "question-1",
        isActive: true,
      });

      mockPrisma.question.findUnique.mockResolvedValue(questionWithoutResponses);
      mockPrisma.questionResponse.count.mockResolvedValue(0); // No responses
      mockPrisma.question.delete.mockResolvedValue(questionWithoutResponses);

      const ctx = createMockContext();
      const caller = adminRouter.createCaller(ctx);

      const result = await caller.deleteQuestion({ id: "question-1" });

      expect(result.wasDeleted).toBe(true);
      expect(result.wasDeactivated).toBe(false);
      expect(mockPrisma.question.delete).toHaveBeenCalledWith({
        where: { id: "question-1" },
      });
    });
  });

  describe("Question Creation with Activation", () => {
    it("should create question with specified activation status", async () => {
      const newQuestion = createMockQuestion({
        id: "question-1",
        isActive: true,
        title: "Test Question",
      });

      mockPrisma.question.create.mockResolvedValue(newQuestion);

      const ctx = createMockContext();
      const caller = adminRouter.createCaller(ctx);

      const result = await caller.createQuestion({
        title: "Test Question",
        description: "Test Description",
        questionType: "binary",
        questionData: { options: ["Yes", "No"] },
        category: "test",
        isActive: true,
      });

      expect(result.isActive).toBe(true);
      expect(mockPrisma.question.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          isActive: true,
        }),
      });
    });

    it("should create question as inactive by default", async () => {
      const newQuestion = createMockQuestion({
        id: "question-1",
        isActive: false,
        title: "Test Question",
      });

      mockPrisma.question.create.mockResolvedValue(newQuestion);

      const ctx = createMockContext();
      const caller = adminRouter.createCaller(ctx);

      const result = await caller.createQuestion({
        title: "Test Question",
        description: "Test Description",
        questionType: "binary",
        questionData: { options: ["Yes", "No"] },
        category: "test",
        // isActive not specified - should default to false
      });

      expect(result.isActive).toBe(false);
      expect(mockPrisma.question.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          isActive: false,
        }),
      });
    });
  });

  describe("Complex Activation Scenarios", () => {
    const now = new Date("2024-01-15T10:00:00Z");

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(now);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should handle question with past start date and future end date", async () => {
      const activeQuestion = createMockQuestion({
        id: "question-1",
        isActive: true,
        startDate: new Date("2024-01-01T10:00:00Z"), // Past
        endDate: new Date("2024-01-31T10:00:00Z"), // Future
      });

      mockPrisma.question.findMany.mockResolvedValue([activeQuestion]);

      const ctx = createMockContext();
      const caller = questionRouter.createCaller(ctx);

      const result = await caller.getActiveQuestions({});

      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].id).toBe("question-1");
    });

    it("should handle question with future start date and no end date", async () => {
      mockPrisma.question.findMany.mockResolvedValue([]);

      const ctx = createMockContext();
      const caller = questionRouter.createCaller(ctx);

      const result = await caller.getActiveQuestions({});

      expect(result.questions).toHaveLength(0);
    });

    it("should handle question with no start date but past end date", async () => {
      mockPrisma.question.findMany.mockResolvedValue([]);

      const ctx = createMockContext();
      const caller = questionRouter.createCaller(ctx);

      const result = await caller.getActiveQuestions({});

      expect(result.questions).toHaveLength(0);
    });

    it("should handle deactivated question with valid dates", async () => {
      mockPrisma.question.findMany.mockResolvedValue([]);

      const ctx = createMockContext();
      const caller = questionRouter.createCaller(ctx);

      const result = await caller.getActiveQuestions({});

      expect(result.questions).toHaveLength(0);
    });
  });
});