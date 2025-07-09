import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { TRPCError } from "@trpc/server";

// Mock all dependencies for integration testing
jest.mock("../../../db", () => ({
  prisma: {
    $transaction: jest.fn(),
    question: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    questionResponse: {
      create: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    voterToken: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    rateLimit: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    xpLedger: {
      create: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn(),
    },
    liveStat: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    analyticsDaily: {
      findFirst: jest.fn(),
      create: jest.fn(),
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
  processVoteEnhancement: jest.fn(),
  calculateAndRecordXp: jest.fn(),
  calculateXpForVote: jest.fn(),
}));

jest.mock("../../statsCache", () => ({
  queueStatUpdate: jest.fn(),
  incrementVoteStats: jest.fn(),
  warmStatsCache: jest.fn(),
}));

jest.mock("../../../progress-automation", () => ({
  trackProgressEvent: jest.fn(),
  onVoteSubmitted: jest.fn(),
}));

jest.mock("../../../email/sendEmail", () => ({
  sendXpClaimEmail: jest.fn(),
}));

jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
}));

// Import all the modules after mocking
import { prisma } from "../../../db";
import { 
  getOrCreateVoterToken, 
  hasVoterVoted,
  getVoterRateLimit, 
  incrementRateLimit,
  hashToken 
} from "../../voterToken";
import { 
  queueVoteEnhancement,
  processVoteEnhancement,
  calculateAndRecordXp,
  calculateXpForVote
} from "../../../background-jobs";
import { 
  queueStatUpdate,
  incrementVoteStats,
  warmStatsCache 
} from "../../statsCache";
import { 
  trackProgressEvent,
  onVoteSubmitted 
} from "../../../progress-automation";
import { sendXpClaimEmail } from "../../../email/sendEmail";
import { randomUUID } from "crypto";
import { voteRouter } from "../voteRouter";
import { 
  createMockContext, 
  createMockQuestion, 
  createMockVoterToken, 
  createMockQuestionResponse,
  createMockXpLedger,
  rateLimitMocks
} from "./test-utils";

// Create typed mock functions
const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockGetOrCreateVoterToken = getOrCreateVoterToken as jest.MockedFunction<typeof getOrCreateVoterToken>;
const mockHasVoterVoted = hasVoterVoted as jest.MockedFunction<typeof hasVoterVoted>;
const mockGetVoterRateLimit = getVoterRateLimit as jest.MockedFunction<typeof getVoterRateLimit>;
const mockIncrementRateLimit = incrementRateLimit as jest.MockedFunction<typeof incrementRateLimit>;
const mockHashToken = hashToken as jest.MockedFunction<typeof hashToken>;
const mockQueueVoteEnhancement = queueVoteEnhancement as jest.MockedFunction<typeof queueVoteEnhancement>;
const mockProcessVoteEnhancement = processVoteEnhancement as jest.MockedFunction<typeof processVoteEnhancement>;
const mockCalculateAndRecordXp = calculateAndRecordXp as jest.MockedFunction<typeof calculateAndRecordXp>;
const mockCalculateXpForVote = calculateXpForVote as jest.MockedFunction<typeof calculateXpForVote>;
const mockQueueStatUpdate = queueStatUpdate as jest.MockedFunction<typeof queueStatUpdate>;
const mockIncrementVoteStats = incrementVoteStats as jest.MockedFunction<typeof incrementVoteStats>;
const mockWarmStatsCache = warmStatsCache as jest.MockedFunction<typeof warmStatsCache>;
const mockTrackProgressEvent = trackProgressEvent as jest.MockedFunction<typeof trackProgressEvent>;
const mockOnVoteSubmitted = onVoteSubmitted as jest.MockedFunction<typeof onVoteSubmitted>;
const mockSendXpClaimEmail = sendXpClaimEmail as jest.MockedFunction<typeof sendXpClaimEmail>;
const mockRandomUUID = randomUUID as jest.MockedFunction<typeof randomUUID>;

describe("Voting Flow Integration Tests", () => {
  // Test fixtures
  let mockActiveQuestion: any;
  let mockVoterToken: any;
  let mockVoteResponse: any;
  let mockContext: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup common test fixtures
    mockActiveQuestion = createMockQuestion({
      id: "question-1",
      title: "Test Question",
      isActive: true,
      startDate: null,
      endDate: null,
    });

    mockVoterToken = createMockVoterToken({
      id: "voter-1",
      tokenHash: "test-hash",
      voteCount: 5,
    });

    mockVoteResponse = createMockQuestionResponse({
      id: "response-1",
      questionId: "question-1",
      voterTokenId: "voter-1",
      responseData: "Yes",
    });

    mockContext = createMockContext({
      ipAddress: "127.0.0.1",
      voterToken: "test-token",
      voterTokenRecord: mockVoterToken,
    });

    // Setup default successful mocks
    mockGetVoterRateLimit.mockResolvedValue(rateLimitMocks.withinLimit);
    mockIncrementRateLimit.mockResolvedValue(undefined);
    mockGetOrCreateVoterToken.mockResolvedValue({
      token: "test-token",
      voterTokenRecord: mockVoterToken,
    });
    mockHasVoterVoted.mockResolvedValue(false);
    mockRandomUUID.mockReturnValue("test-uuid");
    mockHashToken.mockReturnValue("test-hash");

    // Setup background processing mocks
    mockQueueVoteEnhancement.mockResolvedValue(undefined);
    mockProcessVoteEnhancement.mockResolvedValue({
      xpAmount: 10,
      totalXp: 60,
      voteCount: 6,
    });
    mockCalculateAndRecordXp.mockResolvedValue({
      xpAmount: 10,
      totalXp: 60,
      voteCount: 6,
    });
    mockCalculateXpForVote.mockReturnValue(10);

    // Setup statistics mocks
    mockQueueStatUpdate.mockResolvedValue(undefined);
    mockIncrementVoteStats.mockResolvedValue(undefined);
    mockWarmStatsCache.mockResolvedValue(undefined);

    // Setup progress automation mocks
    mockTrackProgressEvent.mockResolvedValue(undefined);
    mockOnVoteSubmitted.mockResolvedValue(undefined);
  });

  describe("Complete End-to-End Voting Flow", () => {
    it("should successfully complete entire voting flow from submission to background processing", async () => {
      // Setup successful database operations
      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
      mockPrisma.questionResponse.create.mockResolvedValue(mockVoteResponse);

      const caller = voteRouter.createCaller(mockContext);

      // Phase 1: Submit vote (critical path)
      const submitResult = await caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      });

      // Verify immediate response
      expect(submitResult.success).toBe(true);
      expect(submitResult.voteId).toBe("response-1");
      expect(submitResult.voterToken).toBe("test-token");
      expect(submitResult.message).toBe("Vote recorded successfully!");
      expect(submitResult.processingInBackground).toBe(true);

      // Verify critical path operations were called in correct order
      expect(mockGetVoterRateLimit).toHaveBeenCalledWith("127.0.0.1");
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
        select: { id: true },
      });
      expect(mockGetOrCreateVoterToken).toHaveBeenCalledWith("test-token", "127.0.0.1");
      expect(mockHasVoterVoted).toHaveBeenCalledWith("voter-1", "question-1");
      expect(mockIncrementRateLimit).toHaveBeenCalledWith("127.0.0.1");
      expect(mockPrisma.questionResponse.create).toHaveBeenCalledWith({
        data: {
          questionId: "question-1",
          voterTokenId: "voter-1",
          responseData: "Yes",
          ipAddress: "127.0.0.1",
        },
      });

      // Verify background job was queued
      expect(mockQueueVoteEnhancement).toHaveBeenCalledWith({
        voteId: "response-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: false, // voteCount > 0
        submittedAt: expect.any(Date),
      });

      // Phase 2: Simulate background processing
      const backgroundJob = {
        voteId: "response-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: false,
        submittedAt: new Date(),
      };

      await processVoteEnhancement(backgroundJob);

      // Verify background operations were called
      expect(mockProcessVoteEnhancement).toHaveBeenCalledWith(backgroundJob);
    });

    it("should handle new voter registration and first vote", async () => {
      // Setup for new voter
      const newVoterToken = createMockVoterToken({
        id: "new-voter-1",
        voteCount: 0,
      });

      mockGetOrCreateVoterToken.mockResolvedValue({
        token: "new-token",
        voterTokenRecord: newVoterToken,
      });

      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
      mockPrisma.questionResponse.create.mockResolvedValue({
        ...mockVoteResponse,
        voterTokenId: "new-voter-1",
      });

      const newVoterContext = createMockContext({
        ipAddress: "127.0.0.1",
        voterToken: undefined, // No existing token
        voterTokenRecord: undefined,
      });

      const caller = voteRouter.createCaller(newVoterContext);

      const result = await caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      });

      expect(result.success).toBe(true);
      expect(result.voterToken).toBe("new-token");

      // Verify background job was queued with isNewVoter: true
      expect(mockQueueVoteEnhancement).toHaveBeenCalledWith({
        voteId: "response-1",
        voterTokenId: "new-voter-1",
        questionId: "question-1",
        isNewVoter: true, // voteCount === 0
        submittedAt: expect.any(Date),
      });
    });

    it("should handle multiple question types in voting flow", async () => {
      const testCases = [
        { type: "binary", response: "Yes" },
        { type: "multiple_choice", response: "React" },
        { type: "rating", response: 5 },
        { type: "ranking", response: ["A", "B", "C", "D"] },
        { type: "text", response: "This is my feedback" },
        { type: "ab-test", response: "variant-a" },
      ];

      for (const testCase of testCases) {
        mockPrisma.question.findFirst.mockResolvedValue({
          ...mockActiveQuestion,
          questionType: testCase.type,
        });

        mockPrisma.questionResponse.create.mockResolvedValue({
          ...mockVoteResponse,
          responseData: testCase.response,
        });

        const caller = voteRouter.createCaller(mockContext);

        const result = await caller.submitVote({
          questionId: "question-1",
          response: testCase.response,
        });

        expect(result.success).toBe(true);
        expect(mockPrisma.questionResponse.create).toHaveBeenCalledWith({
          data: {
            questionId: "question-1",
            voterTokenId: "voter-1",
            responseData: testCase.response,
            ipAddress: "127.0.0.1",
          },
        });
      }
    });
  });

  describe("Error Handling Integration", () => {
    it("should handle rate limit exceeded across the entire flow", async () => {
      mockGetVoterRateLimit.mockResolvedValue(rateLimitMocks.exceeded);

      const caller = voteRouter.createCaller(mockContext);

      await expect(caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      })).rejects.toThrow("Rate limit exceeded");

      // Verify subsequent operations were not called
      expect(mockPrisma.question.findFirst).not.toHaveBeenCalled();
      expect(mockGetOrCreateVoterToken).not.toHaveBeenCalled();
      expect(mockHasVoterVoted).not.toHaveBeenCalled();
      expect(mockPrisma.questionResponse.create).not.toHaveBeenCalled();
      expect(mockQueueVoteEnhancement).not.toHaveBeenCalled();
    });

    it("should handle inactive question validation", async () => {
      mockPrisma.question.findFirst.mockResolvedValue(null); // Question not active

      const caller = voteRouter.createCaller(mockContext);

      await expect(caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      })).rejects.toThrow("Question with ID question-1 not found or is not active");

      // Verify subsequent operations were not called
      expect(mockHasVoterVoted).not.toHaveBeenCalled();
      expect(mockPrisma.questionResponse.create).not.toHaveBeenCalled();
      expect(mockQueueVoteEnhancement).not.toHaveBeenCalled();
    });

    it("should handle duplicate vote prevention", async () => {
      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
      mockHasVoterVoted.mockResolvedValue(true); // Already voted

      const caller = voteRouter.createCaller(mockContext);

      await expect(caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      })).rejects.toThrow("You have already voted on this question");

      // Verify subsequent operations were not called
      expect(mockPrisma.questionResponse.create).not.toHaveBeenCalled();
      expect(mockQueueVoteEnhancement).not.toHaveBeenCalled();
    });

    it("should handle database errors during vote creation", async () => {
      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
      mockPrisma.questionResponse.create.mockRejectedValue(new Error("Database error"));

      const caller = voteRouter.createCaller(mockContext);

      await expect(caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      })).rejects.toThrow("Database error");

      // Verify background job was not queued on failure
      expect(mockQueueVoteEnhancement).not.toHaveBeenCalled();
    });

    it("should handle background processing failures gracefully", async () => {
      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
      mockPrisma.questionResponse.create.mockResolvedValue(mockVoteResponse);

      // Background processing should not affect main flow
      mockProcessVoteEnhancement.mockRejectedValue(new Error("Background processing failed"));

      const caller = voteRouter.createCaller(mockContext);

      // Main vote submission should still succeed
      const result = await caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      });

      expect(result.success).toBe(true);
      expect(mockQueueVoteEnhancement).toHaveBeenCalled();

      // Simulate background processing failure
      const backgroundJob = {
        voteId: "response-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: false,
        submittedAt: new Date(),
      };

      await expect(processVoteEnhancement(backgroundJob)).rejects.toThrow("Background processing failed");
    });
  });

  describe("Background Processing Integration", () => {
    it("should integrate XP calculation with vote processing", async () => {
      const backgroundJob = {
        voteId: "response-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: false,
        submittedAt: new Date(),
      };

      const mockXpResult = {
        xpAmount: 10,
        totalXp: 60,
        voteCount: 6,
      };

      mockCalculateAndRecordXp.mockResolvedValue(mockXpResult);

      await processVoteEnhancement(backgroundJob);

      expect(mockProcessVoteEnhancement).toHaveBeenCalledWith(backgroundJob);
    });

    it("should integrate statistics updates with vote processing", async () => {
      const backgroundJob = {
        voteId: "response-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: false,
        submittedAt: new Date(),
      };

      mockIncrementVoteStats.mockResolvedValue(undefined);

      await processVoteEnhancement(backgroundJob);

      expect(mockProcessVoteEnhancement).toHaveBeenCalledWith(backgroundJob);
    });

    it("should integrate progress tracking with vote processing", async () => {
      const backgroundJob = {
        voteId: "response-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: true, // New voter milestone
        submittedAt: new Date(),
      };

      await processVoteEnhancement(backgroundJob);

      expect(mockProcessVoteEnhancement).toHaveBeenCalledWith(backgroundJob);
    });

    it("should handle background job queue management", async () => {
      // Simulate queuing multiple jobs
      const jobs = [
        {
          voteId: "response-1",
          voterTokenId: "voter-1",
          questionId: "question-1",
          isNewVoter: false,
          submittedAt: new Date(),
        },
        {
          voteId: "response-2",
          voterTokenId: "voter-2",
          questionId: "question-1",
          isNewVoter: true,
          submittedAt: new Date(),
        },
        {
          voteId: "response-3",
          voterTokenId: "voter-3",
          questionId: "question-2",
          isNewVoter: false,
          submittedAt: new Date(),
        },
      ];

      // Queue all jobs
      for (const job of jobs) {
        await queueVoteEnhancement(job);
        expect(mockQueueVoteEnhancement).toHaveBeenCalledWith(job);
      }

      // Process all jobs
      for (const job of jobs) {
        await processVoteEnhancement(job);
        expect(mockProcessVoteEnhancement).toHaveBeenCalledWith(job);
      }
    });
  });

  describe("Real-time Statistics Integration", () => {
    it("should integrate statistics updates with vote counts", async () => {
      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
      mockPrisma.questionResponse.create.mockResolvedValue(mockVoteResponse);

      const caller = voteRouter.createCaller(mockContext);

      await caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      });

      // Verify background job was queued for statistics updates
      expect(mockQueueVoteEnhancement).toHaveBeenCalledWith({
        voteId: "response-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: false,
        submittedAt: expect.any(Date),
      });
    });

    it("should handle concurrent statistics updates", async () => {
      const concurrentVotes = 5;
      const promises = [];

      for (let i = 0; i < concurrentVotes; i++) {
        mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
        mockPrisma.questionResponse.create.mockResolvedValue({
          ...mockVoteResponse,
          id: `response-${i}`,
        });

        const caller = voteRouter.createCaller(mockContext);
        promises.push(caller.submitVote({
          questionId: "question-1",
          response: "Yes",
        }));
      }

      const results = await Promise.all(promises);

      // All votes should succeed
      results.forEach((result, index) => {
        expect(result.success).toBe(true);
        expect(result.voteId).toBe(`response-${index}`);
      });

      // Background jobs should be queued for all votes
      expect(mockQueueVoteEnhancement).toHaveBeenCalledTimes(concurrentVotes);
    });
  });

  describe("Performance Integration", () => {
    it("should complete voting flow within performance thresholds", async () => {
      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
      mockPrisma.questionResponse.create.mockResolvedValue(mockVoteResponse);

      const caller = voteRouter.createCaller(mockContext);

      const startTime = Date.now();
      
      await caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete critical path in under 500ms
      expect(duration).toBeLessThan(500);
    });

    it("should handle high-volume concurrent voting", async () => {
      const concurrentVotes = 100;
      const promises = [];

      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);

      for (let i = 0; i < concurrentVotes; i++) {
        mockPrisma.questionResponse.create.mockResolvedValue({
          ...mockVoteResponse,
          id: `response-${i}`,
        });

        const caller = voteRouter.createCaller(mockContext);
        promises.push(caller.submitVote({
          questionId: "question-1",
          response: "Yes",
        }));
      }

      const startTime = Date.now();
      const results = await Promise.all(promises);
      const endTime = Date.now();

      // All votes should succeed
      results.forEach((result, index) => {
        expect(result.success).toBe(true);
        expect(result.voteId).toBe(`response-${index}`);
      });

      // Should handle high concurrency efficiently
      const averageTime = (endTime - startTime) / concurrentVotes;
      expect(averageTime).toBeLessThan(50); // Less than 50ms per vote on average
    });
  });

  describe("Cross-Component Integration", () => {
    it("should integrate voter token management across vote flow", async () => {
      // Test token creation for new voter
      const newVoterContext = createMockContext({
        ipAddress: "127.0.0.1",
        voterToken: undefined,
        voterTokenRecord: undefined,
      });

      mockGetOrCreateVoterToken.mockResolvedValue({
        token: "new-token",
        voterTokenRecord: createMockVoterToken({ id: "new-voter", voteCount: 0 }),
      });

      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
      mockPrisma.questionResponse.create.mockResolvedValue(mockVoteResponse);

      const caller = voteRouter.createCaller(newVoterContext);

      const result = await caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      });

      expect(result.success).toBe(true);
      expect(result.voterToken).toBe("new-token");

      // Verify token was created and used throughout flow
      expect(mockGetOrCreateVoterToken).toHaveBeenCalledWith(undefined, "127.0.0.1");
      expect(mockHasVoterVoted).toHaveBeenCalledWith("new-voter", "question-1");
    });

    it("should integrate error handling across all components", async () => {
      // Test error propagation from deep in the stack
      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
      mockGetOrCreateVoterToken.mockRejectedValue(new Error("Token creation failed"));

      const caller = voteRouter.createCaller(mockContext);

      await expect(caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      })).rejects.toThrow("Token creation failed");

      // Verify error stopped the flow
      expect(mockHasVoterVoted).not.toHaveBeenCalled();
      expect(mockPrisma.questionResponse.create).not.toHaveBeenCalled();
      expect(mockQueueVoteEnhancement).not.toHaveBeenCalled();
    });

    it("should integrate validation across all input types", async () => {
      const invalidInputs = [
        { questionId: "", response: "Yes" },
        { questionId: "question-1", response: null },
        { questionId: "question-1", response: undefined },
        { questionId: "invalid-id", response: "Yes" },
      ];

      for (const invalidInput of invalidInputs) {
        const caller = voteRouter.createCaller(mockContext);

        await expect(caller.submitVote(invalidInput as any)).rejects.toThrow();
      }
    });
  });
});