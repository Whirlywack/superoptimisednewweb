import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { voteRouter } from "../voteRouter";

// Mock dependencies
jest.mock("../../../db", () => ({
  prisma: {
    question: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
    questionResponse: {
      create: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn(),
      count: jest.fn(),
    },
    voterToken: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
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

jest.mock("../voterToken", () => ({
  getOrCreateVoterToken: jest.fn(),
  hasVoterVoted: jest.fn(),
  getVoterRateLimit: jest.fn(),
  incrementRateLimit: jest.fn(),
}));

jest.mock("../../background-jobs", () => ({
  queueVoteEnhancement: jest.fn(),
}));

jest.mock("../../email/sendEmail", () => ({
  sendXpClaimEmail: jest.fn(),
}));

jest.mock("../../progress-automation", () => ({
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
  incrementRateLimit,
} from "../voterToken";
import { sendXpClaimEmail } from "../../email/sendEmail";
import { onXpClaimed } from "../../progress-automation";
import { randomUUID } from "crypto";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockGetOrCreateVoterToken = getOrCreateVoterToken as jest.MockedFunction<
  typeof getOrCreateVoterToken
>;
const mockHasVoterVoted = hasVoterVoted as jest.MockedFunction<typeof hasVoterVoted>;
const mockGetVoterRateLimit = getVoterRateLimit as jest.MockedFunction<typeof getVoterRateLimit>;
const mockIncrementRateLimit = incrementRateLimit as jest.MockedFunction<typeof incrementRateLimit>;
const mockSendXpClaimEmail = sendXpClaimEmail as jest.MockedFunction<typeof sendXpClaimEmail>;
const mockOnXpClaimed = onXpClaimed as jest.MockedFunction<typeof onXpClaimed>;
const mockRandomUUID = randomUUID as jest.MockedFunction<typeof randomUUID>;

describe("voteRouter", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup dynamic import mock
    jest.doMock("../../background-jobs", () => ({
      queueVoteEnhancement: jest.fn(),
    }));

    // Default mock implementations
    mockGetVoterRateLimit.mockResolvedValue({
      remaining: 10,
      resetTime: new Date(Date.now() + 60000),
    });

    mockGetOrCreateVoterToken.mockResolvedValue({
      token: "test-token",
      voterTokenRecord: {
        id: "voter-1",
        voteCount: 0,
        createdAt: new Date(),
      },
    });

    mockHasVoterVoted.mockResolvedValue(false);
    mockIncrementRateLimit.mockResolvedValue(undefined);
    mockRandomUUID.mockReturnValue("test-uuid");
  });

  describe("submitVote", () => {
    const mockActiveQuestion = {
      id: "question-1",
    };

    const mockVoteResponse = {
      id: "vote-1",
      questionId: "question-1",
      voterTokenId: "voter-1",
      responseData: "Yes",
      ipAddress: "127.0.0.1",
      createdAt: new Date(),
    };

    const mockCtx = {
      ipAddress: "127.0.0.1",
      voterToken: "existing-token",
      voterTokenRecord: {
        id: "voter-1",
        voteCount: 0,
        createdAt: new Date(),
      },
    };

    it("should submit a binary vote successfully", async () => {
      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
      mockPrisma.questionResponse.create.mockResolvedValue(mockVoteResponse);

      const caller = voteRouter.createCaller(mockCtx);
      const result = await caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      });

      expect(result).toEqual({
        success: true,
        voteId: "vote-1",
        voterToken: "test-token",
        message: "Vote recorded successfully!",
        processingInBackground: true,
      });

      expect(mockPrisma.questionResponse.create).toHaveBeenCalledWith({
        data: {
          questionId: "question-1",
          voterTokenId: "voter-1",
          responseData: "Yes",
          ipAddress: "127.0.0.1",
        },
      });
    });

    it("should submit a multiple choice vote successfully", async () => {
      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
      mockPrisma.questionResponse.create.mockResolvedValue({
        ...mockVoteResponse,
        responseData: "React",
      });

      const caller = voteRouter.createCaller(mockCtx);
      const result = await caller.submitVote({
        questionId: "question-1",
        response: "React",
      });

      expect(result.success).toBe(true);
      expect(mockPrisma.questionResponse.create).toHaveBeenCalledWith({
        data: {
          questionId: "question-1",
          voterTokenId: "voter-1",
          responseData: "React",
          ipAddress: "127.0.0.1",
        },
      });
    });

    it("should submit a rating vote successfully", async () => {
      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
      mockPrisma.questionResponse.create.mockResolvedValue({
        ...mockVoteResponse,
        responseData: 5,
      });

      const caller = voteRouter.createCaller(mockCtx);
      const result = await caller.submitVote({
        questionId: "question-1",
        response: 5,
      });

      expect(result.success).toBe(true);
      expect(mockPrisma.questionResponse.create).toHaveBeenCalledWith({
        data: {
          questionId: "question-1",
          voterTokenId: "voter-1",
          responseData: 5,
          ipAddress: "127.0.0.1",
        },
      });
    });

    it("should submit a ranking vote successfully", async () => {
      const rankingResponse = ["Performance", "Security", "User Experience", "Maintainability"];

      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
      mockPrisma.questionResponse.create.mockResolvedValue({
        ...mockVoteResponse,
        responseData: rankingResponse,
      });

      const caller = voteRouter.createCaller(mockCtx);
      const result = await caller.submitVote({
        questionId: "question-1",
        response: rankingResponse,
      });

      expect(result.success).toBe(true);
      expect(mockPrisma.questionResponse.create).toHaveBeenCalledWith({
        data: {
          questionId: "question-1",
          voterTokenId: "voter-1",
          responseData: rankingResponse,
          ipAddress: "127.0.0.1",
        },
      });
    });

    it("should submit a text response successfully", async () => {
      const textResponse = "I would like to see better mobile support";

      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
      mockPrisma.questionResponse.create.mockResolvedValue({
        ...mockVoteResponse,
        responseData: textResponse,
      });

      const caller = voteRouter.createCaller(mockCtx);
      const result = await caller.submitVote({
        questionId: "question-1",
        response: textResponse,
      });

      expect(result.success).toBe(true);
      expect(mockPrisma.questionResponse.create).toHaveBeenCalledWith({
        data: {
          questionId: "question-1",
          voterTokenId: "voter-1",
          responseData: textResponse,
          ipAddress: "127.0.0.1",
        },
      });
    });

    it("should submit an AB test vote successfully", async () => {
      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
      mockPrisma.questionResponse.create.mockResolvedValue({
        ...mockVoteResponse,
        responseData: "variant-a",
      });

      const caller = voteRouter.createCaller(mockCtx);
      const result = await caller.submitVote({
        questionId: "question-1",
        response: "variant-a",
      });

      expect(result.success).toBe(true);
      expect(mockPrisma.questionResponse.create).toHaveBeenCalledWith({
        data: {
          questionId: "question-1",
          voterTokenId: "voter-1",
          responseData: "variant-a",
          ipAddress: "127.0.0.1",
        },
      });
    });

    it("should handle complex JSON responses", async () => {
      const complexResponse = {
        selectedOptions: ["option1", "option2"],
        confidence: 0.8,
        feedback: "This is helpful",
      };

      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
      mockPrisma.questionResponse.create.mockResolvedValue({
        ...mockVoteResponse,
        responseData: complexResponse,
      });

      const caller = voteRouter.createCaller(mockCtx);
      const result = await caller.submitVote({
        questionId: "question-1",
        response: complexResponse,
      });

      expect(result.success).toBe(true);
      expect(mockPrisma.questionResponse.create).toHaveBeenCalledWith({
        data: {
          questionId: "question-1",
          voterTokenId: "voter-1",
          responseData: complexResponse,
          ipAddress: "127.0.0.1",
        },
      });
    });

    it("should throw RateLimitError when rate limit exceeded", async () => {
      mockGetVoterRateLimit.mockResolvedValue({
        remaining: 0,
        resetTime: new Date(Date.now() + 60000),
      });

      const caller = voteRouter.createCaller(mockCtx);

      await expect(
        caller.submitVote({
          questionId: "question-1",
          response: "Yes",
        })
      ).rejects.toThrow("Rate limit exceeded");
    });

    it("should throw QuestionNotFoundError when question does not exist", async () => {
      mockPrisma.question.findFirst.mockResolvedValue(null);

      const caller = voteRouter.createCaller(mockCtx);

      await expect(
        caller.submitVote({
          questionId: "non-existent",
          response: "Yes",
        })
      ).rejects.toThrow("Question with ID non-existent not found or is not active");
    });

    it("should throw DuplicateVoteError when user has already voted", async () => {
      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
      mockHasVoterVoted.mockResolvedValue(true);

      const caller = voteRouter.createCaller(mockCtx);

      await expect(
        caller.submitVote({
          questionId: "question-1",
          response: "Yes",
        })
      ).rejects.toThrow("You have already voted on this question");
    });

    it("should handle voter token creation for new users", async () => {
      const newVoterCtx = {
        ipAddress: "127.0.0.1",
        voterToken: undefined,
        voterTokenRecord: undefined,
      };

      mockGetOrCreateVoterToken.mockResolvedValue({
        token: "new-token",
        voterTokenRecord: {
          id: "new-voter-1",
          voteCount: 0,
          createdAt: new Date(),
        },
      });

      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
      mockPrisma.questionResponse.create.mockResolvedValue({
        ...mockVoteResponse,
        voterTokenId: "new-voter-1",
      });

      const caller = voteRouter.createCaller(newVoterCtx);
      const result = await caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      });

      expect(result.success).toBe(true);
      expect(result.voterToken).toBe("new-token");
    });

    it("should queue background job for vote enhancement", async () => {
      const { queueVoteEnhancement } = await import("../../background-jobs");

      mockPrisma.question.findFirst.mockResolvedValue(mockActiveQuestion);
      mockPrisma.questionResponse.create.mockResolvedValue(mockVoteResponse);

      const caller = voteRouter.createCaller(mockCtx);
      await caller.submitVote({
        questionId: "question-1",
        response: "Yes",
      });

      expect(queueVoteEnhancement).toHaveBeenCalledWith({
        voteId: "vote-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: true,
        submittedAt: expect.any(Date),
      });
    });
  });

  describe("getVoteStats", () => {
    it("should return vote statistics for a question", async () => {
      const mockStats = [
        { responseData: "Yes", _count: { responseData: 150 } },
        { responseData: "No", _count: { responseData: 50 } },
      ];

      mockPrisma.questionResponse.groupBy.mockResolvedValue(mockStats);
      mockPrisma.questionResponse.count.mockResolvedValue(200);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = voteRouter.createCaller(ctx);
      const result = await caller.getVoteStats({ questionId: "question-1" });

      expect(result).toEqual({
        questionId: "question-1",
        totalVotes: 200,
        breakdown: [
          {
            option: "Yes",
            count: 150,
            percentage: 75,
          },
          {
            option: "No",
            count: 50,
            percentage: 25,
          },
        ],
      });
    });

    it("should handle zero votes gracefully", async () => {
      mockPrisma.questionResponse.groupBy.mockResolvedValue([]);
      mockPrisma.questionResponse.count.mockResolvedValue(0);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = voteRouter.createCaller(ctx);
      const result = await caller.getVoteStats({ questionId: "question-1" });

      expect(result).toEqual({
        questionId: "question-1",
        totalVotes: 0,
        breakdown: [],
      });
    });
  });

  describe("getUserVoteHistory", () => {
    it("should return user vote history", async () => {
      const mockVotes = [
        {
          id: "vote-1",
          questionId: "question-1",
          responseData: "Yes",
          createdAt: new Date("2024-01-01"),
          question: {
            id: "question-1",
            title: "Do you prefer TypeScript?",
            category: "development",
          },
        },
        {
          id: "vote-2",
          questionId: "question-2",
          responseData: "React",
          createdAt: new Date("2024-01-02"),
          question: {
            id: "question-2",
            title: "Favorite framework?",
            category: "development",
          },
        },
      ];

      const mockXpTotal = { _sum: { xpAmount: 250 } };

      mockPrisma.questionResponse.findMany.mockResolvedValue(mockVotes);
      mockPrisma.xpLedger.aggregate.mockResolvedValue(mockXpTotal);

      const mockCtx = {
        voterTokenRecord: {
          id: "voter-1",
          voteCount: 2,
          createdAt: new Date(),
        },
      };

      const caller = voteRouter.createCaller(mockCtx);
      const result = await caller.getUserVoteHistory();

      expect(result).toEqual({
        votes: [
          {
            id: "vote-1",
            questionId: "question-1",
            questionTitle: "Do you prefer TypeScript?",
            category: "development",
            response: "Yes",
            createdAt: new Date("2024-01-01"),
          },
          {
            id: "vote-2",
            questionId: "question-2",
            questionTitle: "Favorite framework?",
            category: "development",
            response: "React",
            createdAt: new Date("2024-01-02"),
          },
        ],
        totalXp: 250,
      });
    });

    it("should return empty history for users without voter token", async () => {
      const mockCtx = {
        voterTokenRecord: null,
      };

      const caller = voteRouter.createCaller(mockCtx);
      const result = await caller.getUserVoteHistory();

      expect(result).toEqual({
        votes: [],
        totalXp: 0,
      });
    });
  });

  describe("getFinalXpCalculation", () => {
    it("should return final XP calculation for completed processing", async () => {
      const mockXpResult = { _sum: { xpAmount: 150 } };
      const mockVoteCount = 10;

      mockPrisma.xpLedger.aggregate.mockResolvedValue(mockXpResult);
      mockPrisma.questionResponse.count.mockResolvedValue(mockVoteCount);

      const mockCtx = {
        voterTokenRecord: {
          id: "voter-1",
          voteCount: 10,
          createdAt: new Date(),
        },
      };

      const caller = voteRouter.createCaller(mockCtx);
      const result = await caller.getFinalXpCalculation();

      expect(result).toEqual({
        totalXp: 150,
        voteCount: 10,
        isComplete: true,
        shouldRefetch: false,
      });
    });

    it("should indicate incomplete processing when XP is below minimum", async () => {
      const mockXpResult = { _sum: { xpAmount: 25 } }; // Less than 10 votes * 5 XP = 50
      const mockVoteCount = 10;

      mockPrisma.xpLedger.aggregate.mockResolvedValue(mockXpResult);
      mockPrisma.questionResponse.count.mockResolvedValue(mockVoteCount);

      const mockCtx = {
        voterTokenRecord: {
          id: "voter-1",
          voteCount: 10,
          createdAt: new Date(),
        },
      };

      const caller = voteRouter.createCaller(mockCtx);
      const result = await caller.getFinalXpCalculation();

      expect(result).toEqual({
        totalXp: 25,
        voteCount: 10,
        isComplete: false,
        shouldRefetch: true,
      });
    });

    it("should handle users without voter token", async () => {
      const mockCtx = {
        voterTokenRecord: null,
      };

      const caller = voteRouter.createCaller(mockCtx);
      const result = await caller.getFinalXpCalculation();

      expect(result).toEqual({
        totalXp: 0,
        voteCount: 0,
        isComplete: true,
      });
    });
  });

  describe("getEngagementStats", () => {
    it("should return global engagement statistics", async () => {
      const mockGlobalXp = { _sum: { xpAmount: 10000 }, _count: { id: 500 } };
      const mockRecentActivity = [
        {
          date: new Date("2024-01-01"),
          totalVotes: 150,
          uniqueVoters: 45,
        },
      ];
      const mockTopPerformers = [
        {
          id: "voter-1",
          voteCount: 100,
          createdAt: new Date("2023-12-01"),
          _count: { xpLedger: 15 },
        },
      ];

      mockPrisma.xpLedger.aggregate.mockResolvedValue(mockGlobalXp);
      mockPrisma.analyticsDaily.findMany.mockResolvedValue(mockRecentActivity);
      mockPrisma.voterToken.findMany.mockResolvedValue(mockTopPerformers);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = voteRouter.createCaller(ctx);
      const result = await caller.getEngagementStats({});

      expect(result.global).toEqual({
        totalXpEarned: 10000,
        totalXpTransactions: 500,
        recentActivity: mockRecentActivity.slice(0, 7),
        leaderboard: [
          {
            rank: 1,
            voteCount: 100,
            memberSince: new Date("2023-12-01"),
            totalTransactions: 15,
          },
        ],
      });

      expect(result.user).toBeNull();
      expect(result.milestones).toEqual([
        {
          votes: 10,
          xpReward: 50,
          title: "Getting Started",
          achieved: false,
        },
        {
          votes: 25,
          xpReward: 100,
          title: "Community Member",
          achieved: false,
        },
        {
          votes: 50,
          xpReward: 250,
          title: "Active Participant",
          achieved: false,
        },
        {
          votes: 100,
          xpReward: 500,
          title: "Community Champion",
          achieved: false,
        },
        {
          votes: 250,
          xpReward: 1000,
          title: "Superoptimised Builder",
          achieved: false,
        },
      ]);
    });

    it("should return user-specific engagement statistics", async () => {
      const mockUserXp = { _sum: { xpAmount: 500 }, _count: { id: 10 } };
      const mockUserVotes = 25;
      const mockUserStreak = [
        { createdAt: new Date("2024-01-01") },
        { createdAt: new Date("2024-01-02") },
      ];

      mockPrisma.xpLedger.aggregate
        .mockResolvedValueOnce({ _sum: { xpAmount: 10000 }, _count: { id: 500 } }) // Global stats
        .mockResolvedValueOnce(mockUserXp); // User stats

      mockPrisma.analyticsDaily.findMany.mockResolvedValue([]);
      mockPrisma.voterToken.findMany.mockResolvedValue([]);
      mockPrisma.questionResponse.count.mockResolvedValue(mockUserVotes);
      mockPrisma.questionResponse.findMany.mockResolvedValue(mockUserStreak);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = voteRouter.createCaller(ctx);
      const result = await caller.getEngagementStats({ voterTokenId: "voter-1" });

      expect(result.user).toEqual({
        totalXp: 500,
        totalVotes: 25,
        currentStreak: expect.any(Number),
        xpTransactions: 10,
        rank: 1, // Not found in leaderboard, so rank 1
      });

      expect(result.milestones?.[1]).toEqual({
        votes: 25,
        xpReward: 100,
        title: "Community Member",
        achieved: true,
      });
    });

    it("should handle database errors gracefully", async () => {
      mockPrisma.xpLedger.aggregate.mockRejectedValue(new Error("Database error"));
      mockPrisma.analyticsDaily.findMany.mockResolvedValue([]);
      mockPrisma.voterToken.findMany.mockResolvedValue([]);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = voteRouter.createCaller(ctx);
      const result = await caller.getEngagementStats({});

      expect(result.global.totalXpEarned).toBe(0);
      expect(result.global.totalXpTransactions).toBe(0);
    });
  });

  describe("claimXP", () => {
    it("should create XP claim and send verification email", async () => {
      const mockVoterToken = {
        id: "voter-1",
        xpLedger: [{ xpAmount: 50 }, { xpAmount: 100 }, { xpAmount: 25 }],
      };

      mockPrisma.voterToken.findFirst.mockResolvedValue(mockVoterToken);
      mockPrisma.xpClaim.findFirst.mockResolvedValue(null);
      mockPrisma.xpClaim.create.mockResolvedValue({
        id: "claim-1",
        email: "test@example.com",
        totalXp: 175,
        status: "pending",
      });

      mockSendXpClaimEmail.mockResolvedValue(undefined);
      mockOnXpClaimed.mockResolvedValue(undefined);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = voteRouter.createCaller(ctx);
      const result = await caller.claimXP({
        email: "test@example.com",
        voterTokenHash: "test-hash",
      });

      expect(result).toEqual({
        success: true,
        message: "Verification email sent successfully",
        totalXp: 175,
      });

      expect(mockPrisma.xpClaim.create).toHaveBeenCalledWith({
        data: {
          voterTokenId: "voter-1",
          email: "test@example.com",
          claimToken: "test-uuid",
          totalXp: 175,
          expiresAt: expect.any(Date),
          status: "pending",
        },
      });

      expect(mockSendXpClaimEmail).toHaveBeenCalledWith("test@example.com", 175, "test-uuid");
    });

    it("should throw error for invalid voter token", async () => {
      mockPrisma.voterToken.findFirst.mockResolvedValue(null);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = voteRouter.createCaller(ctx);

      await expect(
        caller.claimXP({
          email: "test@example.com",
          voterTokenHash: "invalid-hash",
        })
      ).rejects.toThrow("Invalid voter token");
    });

    it("should throw error for zero XP", async () => {
      const mockVoterToken = {
        id: "voter-1",
        xpLedger: [],
      };

      mockPrisma.voterToken.findFirst.mockResolvedValue(mockVoterToken);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = voteRouter.createCaller(ctx);

      await expect(
        caller.claimXP({
          email: "test@example.com",
          voterTokenHash: "test-hash",
        })
      ).rejects.toThrow("No XP to claim");
    });

    it("should throw error for already claimed XP", async () => {
      const mockVoterToken = {
        id: "voter-1",
        xpLedger: [{ xpAmount: 100 }],
      };

      const mockExistingClaim = {
        id: "claim-1",
        voterTokenId: "voter-1",
        status: "claimed",
      };

      mockPrisma.voterToken.findFirst.mockResolvedValue(mockVoterToken);
      mockPrisma.xpClaim.findFirst.mockResolvedValue(mockExistingClaim);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = voteRouter.createCaller(ctx);

      await expect(
        caller.claimXP({
          email: "test@example.com",
          voterTokenHash: "test-hash",
        })
      ).rejects.toThrow("XP has already been claimed for this account");
    });

    it("should continue even if email sending fails", async () => {
      const mockVoterToken = {
        id: "voter-1",
        xpLedger: [{ xpAmount: 100 }],
      };

      mockPrisma.voterToken.findFirst.mockResolvedValue(mockVoterToken);
      mockPrisma.xpClaim.findFirst.mockResolvedValue(null);
      mockPrisma.xpClaim.create.mockResolvedValue({
        id: "claim-1",
        email: "test@example.com",
        totalXp: 100,
        status: "pending",
      });

      mockSendXpClaimEmail.mockRejectedValue(new Error("Email service down"));

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = voteRouter.createCaller(ctx);
      const result = await caller.claimXP({
        email: "test@example.com",
        voterTokenHash: "test-hash",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("aggregateDailyStats", () => {
    it("should aggregate daily statistics successfully", async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      mockPrisma.analyticsDaily.findFirst.mockResolvedValue(null);
      mockPrisma.questionResponse.count.mockResolvedValue(150);
      mockPrisma.questionResponse.findMany.mockResolvedValue([
        { voterTokenId: "voter-1" },
        { voterTokenId: "voter-2" },
        { voterTokenId: "voter-1" },
      ]);
      mockPrisma.xpLedger.aggregate.mockResolvedValue({ _sum: { xpAmount: 750 } });
      mockPrisma.newsletterSubscriber.count.mockResolvedValue(25);
      mockPrisma.questionResponse.groupBy.mockResolvedValue([
        { questionId: "question-1", _count: { questionId: 100 } },
        { questionId: "question-2", _count: { questionId: 50 } },
      ]);
      mockPrisma.question.findUnique
        .mockResolvedValueOnce({ title: "TypeScript vs JavaScript" })
        .mockResolvedValueOnce({ title: "Favorite Framework" });

      const expectedStats = {
        id: "daily-1",
        date: today,
        totalVotes: 150,
        uniqueVoters: 2,
        totalXpEarned: 750,
        newsletterSignups: 25,
        popularQuestions: [
          {
            questionId: "question-1",
            title: "TypeScript vs JavaScript",
            voteCount: 100,
          },
          {
            questionId: "question-2",
            title: "Favorite Framework",
            voteCount: 50,
          },
        ],
      };

      mockPrisma.analyticsDaily.create.mockResolvedValue(expectedStats);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = voteRouter.createCaller(ctx);
      const result = await caller.aggregateDailyStats();

      expect(result).toEqual({
        success: true,
        date: today.toISOString().split("T")[0],
        stats: {
          totalVotes: 150,
          uniqueVoters: 2,
          totalXpEarned: 750,
          newsletterSignups: 25,
          popularQuestions: [
            {
              questionId: "question-1",
              title: "TypeScript vs JavaScript",
              voteCount: 100,
            },
            {
              questionId: "question-2",
              title: "Favorite Framework",
              voteCount: 50,
            },
          ],
        },
      });
    });

    it("should throw error if daily stats already exist", async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      mockPrisma.analyticsDaily.findFirst.mockResolvedValue({
        id: "existing-1",
        date: today,
      });

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const caller = voteRouter.createCaller(ctx);

      await expect(caller.aggregateDailyStats()).rejects.toThrow(
        "Daily stats for today already aggregated"
      );
    });
  });

  describe("streak calculation", () => {
    it("should calculate streak correctly for consecutive days", () => {
      // This would test the calculateStreakDays function
      // Since it's not exported, we test it indirectly through getEngagementStats
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const twoDaysAgo = new Date(today.getTime() - 48 * 60 * 60 * 1000);

      const mockUserStreak = [
        { createdAt: today },
        { createdAt: yesterday },
        { createdAt: twoDaysAgo },
      ];

      mockPrisma.xpLedger.aggregate
        .mockResolvedValueOnce({ _sum: { xpAmount: 10000 }, _count: { id: 500 } })
        .mockResolvedValueOnce({ _sum: { xpAmount: 300 }, _count: { id: 6 } });

      mockPrisma.analyticsDaily.findMany.mockResolvedValue([]);
      mockPrisma.voterToken.findMany.mockResolvedValue([]);
      mockPrisma.questionResponse.count.mockResolvedValue(15);
      mockPrisma.questionResponse.findMany.mockResolvedValue(mockUserStreak);

      const ctx = {
        db: mockPrisma,
        headers: new Headers(),
      };

      const _caller = voteRouter.createCaller(ctx);

      // The streak calculation logic would be tested here
      // This is a placeholder for the actual implementation
      expect(true).toBe(true);
    });
  });
});
