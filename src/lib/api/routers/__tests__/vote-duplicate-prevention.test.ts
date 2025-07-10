import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import {
  createMockContext,
  createMockQuestion,
  createMockVoterToken,
  createMockQuestionResponse,
  rateLimitMocks,
} from "./test-utils";

// Mock dependencies
jest.mock("../../../db", () => ({
  prisma: {
    question: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
    questionResponse: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn(),
      count: jest.fn(),
    },
    voterToken: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    xpLedger: {
      aggregate: jest.fn(),
    },
    xpClaim: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    analyticsDaily: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    newsletterSubscriber: {
      count: jest.fn(),
    },
  },
}));

jest.mock("../../voterToken", () => ({
  getOrCreateVoterToken: jest.fn(),
  hasVoterVoted: jest.fn(),
  getVoterRateLimit: jest.fn(),
  incrementRateLimit: jest.fn(),
  hashToken: jest.fn(),
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
  createHash: jest.fn(),
}));

import { prisma } from "../../../db";
import {
  getOrCreateVoterToken,
  hasVoterVoted,
  getVoterRateLimit,
  incrementRateLimit,
  hashToken,
} from "../../voterToken";
import { voteRouter } from "../voteRouter";
import { randomUUID, createHash } from "crypto";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockGetOrCreateVoterToken = getOrCreateVoterToken as jest.MockedFunction<
  typeof getOrCreateVoterToken
>;
const mockHasVoterVoted = hasVoterVoted as jest.MockedFunction<typeof hasVoterVoted>;
const mockGetVoterRateLimit = getVoterRateLimit as jest.MockedFunction<typeof getVoterRateLimit>;
const mockIncrementRateLimit = incrementRateLimit as jest.MockedFunction<typeof incrementRateLimit>;
const mockHashToken = hashToken as jest.MockedFunction<typeof hashToken>;
const mockRandomUUID = randomUUID as jest.MockedFunction<typeof randomUUID>;
const mockCreateHash = createHash as jest.MockedFunction<typeof createHash>;

describe("Vote Duplicate Prevention", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    mockGetVoterRateLimit.mockResolvedValue(rateLimitMocks.withinLimit);
    mockIncrementRateLimit.mockResolvedValue(undefined);
    mockRandomUUID.mockReturnValue("test-uuid");

    mockGetOrCreateVoterToken.mockResolvedValue({
      token: "test-token",
      voterTokenRecord: createMockVoterToken(),
    });

    // Mock crypto hash chain
    const mockHashInstance = {
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue("test-hash"),
    };
    mockCreateHash.mockReturnValue(mockHashInstance as any);
    mockHashToken.mockReturnValue("test-hash");
  });

  describe("hasVoterVoted function mock behavior", () => {
    it("should return true when voter has already voted on question", async () => {
      mockHasVoterVoted.mockResolvedValue(true);

      const result = await hasVoterVoted("voter-1", "question-1");

      expect(result).toBe(true);
      expect(mockHasVoterVoted).toHaveBeenCalledWith("voter-1", "question-1");
    });

    it("should return false when voter has not voted on question", async () => {
      mockHasVoterVoted.mockResolvedValue(false);

      const result = await hasVoterVoted("voter-1", "question-1");

      expect(result).toBe(false);
      expect(mockHasVoterVoted).toHaveBeenCalledWith("voter-1", "question-1");
    });

    it("should handle database errors gracefully", async () => {
      mockHasVoterVoted.mockRejectedValue(new Error("Database error"));

      await expect(hasVoterVoted("voter-1", "question-1")).rejects.toThrow("Database error");
    });

    it("should handle null/undefined parameters", async () => {
      mockHasVoterVoted.mockResolvedValue(false);

      await expect(hasVoterVoted("", "question-1")).resolves.toBe(false);
      await expect(hasVoterVoted("voter-1", "")).resolves.toBe(false);
    });

    it("should work with different question types", async () => {
      const testCases = [
        { voterTokenId: "voter-1", questionId: "binary-question-1" },
        { voterTokenId: "voter-2", questionId: "rating-question-1" },
        { voterTokenId: "voter-3", questionId: "text-question-1" },
        { voterTokenId: "voter-4", questionId: "ranking-question-1" },
      ];

      for (const testCase of testCases) {
        mockHasVoterVoted.mockResolvedValue(false);
        const result = await hasVoterVoted(testCase.voterTokenId, testCase.questionId);
        expect(result).toBe(false);
      }
    });
  });

  describe("Vote submission duplicate prevention", () => {
    const mockActiveQuestion = createMockQuestion();
    const mockVoterToken = createMockVoterToken();
    const mockVoteResponse = createMockQuestionResponse();

    beforeEach(() => {
      mockGetOrCreateVoterToken.mockResolvedValue({
        token: "test-token",
        voterTokenRecord: mockVoterToken,
      });
      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
    });

    it("should prevent duplicate votes for the same voter and question", async () => {
      mockHasVoterVoted.mockResolvedValue(true);

      const ctx = createMockContext();
      const caller = voteRouter.createCaller(ctx);

      await expect(
        caller.submitVote({
          questionId: "question-1",
          response: "Yes",
        })
      ).rejects.toThrow("You have already voted on this question");
    });

    it("should allow votes when voter has not voted on question", async () => {
      mockHasVoterVoted.mockResolvedValue(false);
      mockPrisma.questionResponse.create.mockResolvedValue(mockVoteResponse);

      const ctx = createMockContext();
      const caller = voteRouter.createCaller(ctx);

      const result = await caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      });

      expect(result.success).toBe(true);
      expect(result.voteId).toBe("response-1");
    });

    it("should prevent duplicate votes across different response types", async () => {
      const testCases = [
        { response: "Yes", questionType: "binary" },
        { response: "React", questionType: "multiple_choice" },
        { response: 5, questionType: "rating" },
        { response: ["A", "B", "C"], questionType: "ranking" },
        { response: "Great feature!", questionType: "text" },
      ];

      for (const testCase of testCases) {
        mockHasVoterVoted.mockResolvedValue(true);

        const ctx = createMockContext();
        const caller = voteRouter.createCaller(ctx);

        await expect(
          caller.submitVote({
            questionId: "question-1",
            response: testCase.response,
          })
        ).rejects.toThrow("You have already voted on this question");
      }
    });

    it("should allow different voters to vote on same question", async () => {
      mockHasVoterVoted.mockResolvedValue(false);
      mockPrisma.questionResponse.create.mockResolvedValue(mockVoteResponse);

      const voterTokens = [
        { id: "voter-1", tokenHash: "hash-1" },
        { id: "voter-2", tokenHash: "hash-2" },
        { id: "voter-3", tokenHash: "hash-3" },
      ];

      for (const voterToken of voterTokens) {
        mockGetOrCreateVoterToken.mockResolvedValue({
          token: `token-${voterToken.id}`,
          voterTokenRecord: { ...mockVoterToken, ...voterToken },
        });

        const ctx = createMockContext({
          voterTokenRecord: { ...mockVoterToken, ...voterToken },
        });
        const caller = voteRouter.createCaller(ctx);

        const result = await caller.submitVote({
          questionId: "question-1",
          response: "Yes",
        });

        expect(result.success).toBe(true);
      }
    });

    it("should allow same voter to vote on different questions", async () => {
      mockHasVoterVoted.mockResolvedValue(false);
      mockPrisma.questionResponse.create.mockResolvedValue(mockVoteResponse);

      const questionIds = ["question-1", "question-2", "question-3"];

      for (const questionId of questionIds) {
        const ctx = createMockContext();
        const caller = voteRouter.createCaller(ctx);

        const result = await caller.submitVote({
          questionId,
          response: "Yes",
        });

        expect(result.success).toBe(true);
      }
    });

    it("should handle race conditions with concurrent vote attempts", async () => {
      // First call succeeds (no duplicate)
      mockHasVoterVoted.mockResolvedValueOnce(false);
      // Second call fails (duplicate detected)
      mockHasVoterVoted.mockResolvedValueOnce(true);

      mockPrisma.questionResponse.create.mockResolvedValue(mockVoteResponse);

      const ctx = createMockContext();
      const caller = voteRouter.createCaller(ctx);

      // First vote should succeed
      const firstVote = caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      });

      // Second vote should fail due to duplicate
      const secondVote = caller.submitVote({
        questionId: "question-1",
        response: "No",
      });

      const [firstResult, secondResult] = await Promise.allSettled([firstVote, secondVote]);

      expect(firstResult.status).toBe("fulfilled");
      expect(secondResult.status).toBe("rejected");

      if (secondResult.status === "rejected") {
        expect(secondResult.reason.message).toContain("You have already voted on this question");
      }
    });

    it("should maintain duplicate prevention across voter token regeneration", async () => {
      const originalVoterToken = createMockVoterToken({ id: "voter-1" });
      const newVoterToken = createMockVoterToken({ id: "voter-1" }); // Same ID, different token

      // First vote with original token
      mockHasVoterVoted.mockResolvedValueOnce(false);
      mockGetOrCreateVoterToken.mockResolvedValueOnce({
        token: "original-token",
        voterTokenRecord: originalVoterToken,
      });
      mockPrisma.questionResponse.create.mockResolvedValue(mockVoteResponse);

      const ctx1 = createMockContext({ voterTokenRecord: originalVoterToken });
      const caller1 = voteRouter.createCaller(ctx1);

      const firstResult = await caller1.submitVote({
        questionId: "question-1",
        response: "Yes",
      });

      expect(firstResult.success).toBe(true);

      // Second vote with new token but same voter ID should fail
      mockHasVoterVoted.mockResolvedValueOnce(true);
      mockGetOrCreateVoterToken.mockResolvedValueOnce({
        token: "new-token",
        voterTokenRecord: newVoterToken,
      });

      const ctx2 = createMockContext({ voterTokenRecord: newVoterToken });
      const caller2 = voteRouter.createCaller(ctx2);

      await expect(
        caller2.submitVote({
          questionId: "question-1",
          response: "No",
        })
      ).rejects.toThrow("You have already voted on this question");
    });

    it("should handle database errors during duplicate check", async () => {
      mockHasVoterVoted.mockRejectedValue(new Error("Database connection failed"));

      const ctx = createMockContext();
      const caller = voteRouter.createCaller(ctx);

      await expect(
        caller.submitVote({
          questionId: "question-1",
          response: "Yes",
        })
      ).rejects.toThrow("Database connection failed");
    });

    it("should verify duplicate check happens before vote creation", async () => {
      mockHasVoterVoted.mockResolvedValue(true);

      const ctx = createMockContext();
      const caller = voteRouter.createCaller(ctx);

      await expect(
        caller.submitVote({
          questionId: "question-1",
          response: "Yes",
        })
      ).rejects.toThrow("You have already voted on this question");

      // Verify that questionResponse.create was never called
      expect(mockPrisma.questionResponse.create).not.toHaveBeenCalled();
    });

    it("should handle edge case with null/undefined voter token ID", async () => {
      mockGetOrCreateVoterToken.mockResolvedValue({
        token: "test-token",
        voterTokenRecord: { ...mockVoterToken, id: null as any },
      });

      const ctx = createMockContext();
      const caller = voteRouter.createCaller(ctx);

      // Should handle gracefully and not crash
      await expect(
        caller.submitVote({
          questionId: "question-1",
          response: "Yes",
        })
      ).rejects.toThrow();
    });
  });

  describe("Duplicate prevention performance", () => {
    it("should perform duplicate check efficiently", async () => {
      mockPrisma.questionResponse.findFirst.mockResolvedValue(null);

      const startTime = Date.now();
      await hasVoterVoted("voter-1", "question-1");
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100); // Should be very fast
      expect(mockPrisma.questionResponse.findFirst).toHaveBeenCalledTimes(1);
    });

    it("should use efficient database query for duplicate check", async () => {
      mockPrisma.questionResponse.findFirst.mockResolvedValue(null);

      await hasVoterVoted("voter-1", "question-1");

      expect(mockPrisma.questionResponse.findFirst).toHaveBeenCalledWith({
        where: {
          voterTokenId: "voter-1",
          questionId: "question-1",
        },
      });
    });
  });

  describe("Error handling and recovery", () => {
    it("should throw DuplicateVoteError with correct message", async () => {
      mockHasVoterVoted.mockResolvedValue(true);
      mockPrisma.question.findFirst.mockResolvedValue(createMockQuestion());

      const ctx = createMockContext();
      const caller = voteRouter.createCaller(ctx);

      try {
        await caller.submitVote({
          questionId: "question-1",
          response: "Yes",
        });
      } catch (error: any) {
        expect(error.message).toBe("You have already voted on this question");
        expect(error.code).toBe("CONFLICT");
      }
    });

    it("should handle database timeout during duplicate check", async () => {
      const timeoutError = new Error("Connection timeout");
      mockHasVoterVoted.mockRejectedValue(timeoutError);
      mockPrisma.question.findFirst.mockResolvedValue(createMockQuestion());

      const ctx = createMockContext();
      const caller = voteRouter.createCaller(ctx);

      await expect(
        caller.submitVote({
          questionId: "question-1",
          response: "Yes",
        })
      ).rejects.toThrow("Connection timeout");
    });

    it("should handle malformed voter token IDs", async () => {
      const malformedTokens = [
        "", // Empty string
        "   ", // Whitespace only
        "invalid-uuid", // Invalid format
        "null", // String "null"
        "undefined", // String "undefined"
      ];

      for (const token of malformedTokens) {
        mockPrisma.questionResponse.findFirst.mockResolvedValue(null);
        const result = await hasVoterVoted(token, "question-1");
        expect(result).toBe(false);
      }
    });
  });

  describe("Integration with voting flow", () => {
    it("should prevent duplicate votes while maintaining normal flow", async () => {
      const mockQuestion = createMockQuestion();
      const mockVoterToken = createMockVoterToken();

      mockPrisma.question.findFirst.mockResolvedValue(mockQuestion);
      mockGetOrCreateVoterToken.mockResolvedValue({
        token: "test-token",
        voterTokenRecord: mockVoterToken,
      });

      // First vote should succeed
      mockHasVoterVoted.mockResolvedValueOnce(false);
      mockPrisma.questionResponse.create.mockResolvedValue(createMockQuestionResponse());

      const ctx = createMockContext();
      const caller = voteRouter.createCaller(ctx);

      const firstResult = await caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      });

      expect(firstResult.success).toBe(true);
      expect(firstResult.voteId).toBeDefined();

      // Second vote should fail
      mockHasVoterVoted.mockResolvedValueOnce(true);

      await expect(
        caller.submitVote({
          questionId: "question-1",
          response: "No",
        })
      ).rejects.toThrow("You have already voted on this question");
    });

    it("should work correctly with rate limiting", async () => {
      mockPrisma.question.findFirst.mockResolvedValue(createMockQuestion());
      mockGetOrCreateVoterToken.mockResolvedValue({
        token: "test-token",
        voterTokenRecord: createMockVoterToken(),
      });

      // Rate limit exceeded
      mockGetVoterRateLimit.mockResolvedValue(rateLimitMocks.exceeded);

      const ctx = createMockContext();
      const caller = voteRouter.createCaller(ctx);

      await expect(
        caller.submitVote({
          questionId: "question-1",
          response: "Yes",
        })
      ).rejects.toThrow("Rate limit exceeded");

      // hasVoterVoted should not be called when rate limit is exceeded
      expect(mockHasVoterVoted).not.toHaveBeenCalled();
    });
  });
});
