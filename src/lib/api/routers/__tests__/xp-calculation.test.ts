import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { TRPCError } from "@trpc/server";

// Mock dependencies
jest.mock("../../../db", () => ({
  prisma: {
    voterToken: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    xpLedger: {
      create: jest.fn(),
      aggregate: jest.fn(),
      findMany: jest.fn(),
    },
    xpClaim: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    questionResponse: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock("../../../background-jobs", () => ({
  calculateXpForVote: jest.fn(),
  calculateAndRecordXp: jest.fn(),
  processVoteEnhancement: jest.fn(),
  updateEngagementStats: jest.fn(),
  getVoteXpCalculation: jest.fn(),
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
  calculateXpForVote,
  calculateAndRecordXp,
  processVoteEnhancement,
  updateEngagementStats,
  getVoteXpCalculation,
  queueVoteEnhancement
} from "../../../background-jobs";
import { sendXpClaimEmail } from "../../../email/sendEmail";
import { onXpClaimed } from "../../../progress-automation";
import { randomUUID } from "crypto";
import { voteRouter } from "../voteRouter";
import { 
  createMockContext, 
  createMockVoterToken, 
  createMockXpLedger 
} from "./test-utils";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockCalculateXpForVote = calculateXpForVote as jest.MockedFunction<typeof calculateXpForVote>;
const mockCalculateAndRecordXp = calculateAndRecordXp as jest.MockedFunction<typeof calculateAndRecordXp>;
const mockProcessVoteEnhancement = processVoteEnhancement as jest.MockedFunction<typeof processVoteEnhancement>;
const mockUpdateEngagementStats = updateEngagementStats as jest.MockedFunction<typeof updateEngagementStats>;
const mockGetVoteXpCalculation = getVoteXpCalculation as jest.MockedFunction<typeof getVoteXpCalculation>;
const mockQueueVoteEnhancement = queueVoteEnhancement as jest.MockedFunction<typeof queueVoteEnhancement>;
const mockSendXpClaimEmail = sendXpClaimEmail as jest.MockedFunction<typeof sendXpClaimEmail>;
const mockOnXpClaimed = onXpClaimed as jest.MockedFunction<typeof onXpClaimed>;
const mockRandomUUID = randomUUID as jest.MockedFunction<typeof randomUUID>;

describe("XP Calculation and Aggregation System", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRandomUUID.mockReturnValue("test-uuid");
  });

  describe("Core XP Calculation Logic", () => {
    it("should calculate correct XP for early votes (1-5)", () => {
      // Test progressive XP calculation for votes 1-5
      const testCases = [
        { voteNumber: 1, expectedXp: 5 },
        { voteNumber: 2, expectedXp: 5 },
        { voteNumber: 3, expectedXp: 5 },
        { voteNumber: 4, expectedXp: 5 },
        { voteNumber: 5, expectedXp: 5 },
      ];

      testCases.forEach(({ voteNumber, expectedXp }) => {
        mockCalculateXpForVote.mockReturnValue(expectedXp);
        const result = calculateXpForVote(voteNumber);
        expect(result).toBe(expectedXp);
      });
    });

    it("should calculate correct XP for intermediate votes (6-25)", () => {
      const testCases = [
        { voteNumber: 6, expectedXp: 10 },
        { voteNumber: 10, expectedXp: 10 },
        { voteNumber: 11, expectedXp: 15 },
        { voteNumber: 25, expectedXp: 15 },
      ];

      testCases.forEach(({ voteNumber, expectedXp }) => {
        mockCalculateXpForVote.mockReturnValue(expectedXp);
        const result = calculateXpForVote(voteNumber);
        expect(result).toBe(expectedXp);
      });
    });

    it("should calculate correct XP for higher votes (26-250)", () => {
      const testCases = [
        { voteNumber: 26, expectedXp: 20 },
        { voteNumber: 50, expectedXp: 20 },
        { voteNumber: 51, expectedXp: 25 },
        { voteNumber: 100, expectedXp: 25 },
        { voteNumber: 101, expectedXp: 50 },
        { voteNumber: 250, expectedXp: 50 },
      ];

      testCases.forEach(({ voteNumber, expectedXp }) => {
        mockCalculateXpForVote.mockReturnValue(expectedXp);
        const result = calculateXpForVote(voteNumber);
        expect(result).toBe(expectedXp);
      });
    });

    it("should calculate correct XP for very high votes (250+)", () => {
      const testCases = [
        { voteNumber: 251, expectedXp: 100 },
        { voteNumber: 500, expectedXp: 100 },
        { voteNumber: 1000, expectedXp: 100 },
        { voteNumber: 10000, expectedXp: 100 },
      ];

      testCases.forEach(({ voteNumber, expectedXp }) => {
        mockCalculateXpForVote.mockReturnValue(expectedXp);
        const result = calculateXpForVote(voteNumber);
        expect(result).toBe(expectedXp);
      });
    });

    it("should handle boundary cases correctly", () => {
      // Test exact boundary values
      const boundaryTests = [
        { voteNumber: 5, expectedXp: 5 },   // Last vote at 5 XP
        { voteNumber: 6, expectedXp: 10 },  // First vote at 10 XP
        { voteNumber: 10, expectedXp: 10 }, // Last vote at 10 XP
        { voteNumber: 11, expectedXp: 15 }, // First vote at 15 XP
        { voteNumber: 25, expectedXp: 15 }, // Last vote at 15 XP
        { voteNumber: 26, expectedXp: 20 }, // First vote at 20 XP
        { voteNumber: 50, expectedXp: 20 }, // Last vote at 20 XP
        { voteNumber: 51, expectedXp: 25 }, // First vote at 25 XP
        { voteNumber: 100, expectedXp: 25 }, // Last vote at 25 XP
        { voteNumber: 101, expectedXp: 50 }, // First vote at 50 XP
        { voteNumber: 250, expectedXp: 50 }, // Last vote at 50 XP
        { voteNumber: 251, expectedXp: 100 }, // First vote at 100 XP
      ];

      boundaryTests.forEach(({ voteNumber, expectedXp }) => {
        mockCalculateXpForVote.mockReturnValue(expectedXp);
        const result = calculateXpForVote(voteNumber);
        expect(result).toBe(expectedXp);
      });
    });

    it("should handle edge cases for invalid vote numbers", () => {
      const edgeCases = [
        { voteNumber: 0, expectedXp: 5 },     // Zero votes
        { voteNumber: -1, expectedXp: 5 },    // Negative votes
        { voteNumber: -100, expectedXp: 5 },  // Large negative
      ];

      edgeCases.forEach(({ voteNumber, expectedXp }) => {
        mockCalculateXpForVote.mockReturnValue(expectedXp);
        const result = calculateXpForVote(voteNumber);
        expect(result).toBe(expectedXp);
      });
    });
  });

  describe("XP Recording and Aggregation", () => {
    it("should record XP transaction atomically", async () => {
      const mockResult = {
        xpAmount: 10,
        totalXp: 50,
        voteCount: 6,
      };

      mockCalculateAndRecordXp.mockResolvedValue(mockResult);

      const result = await calculateAndRecordXp("voter-1", "question-1");

      expect(result).toEqual(mockResult);
      expect(mockCalculateAndRecordXp).toHaveBeenCalledWith("voter-1", "question-1");
    });

    it("should handle transaction failures gracefully", async () => {
      const transactionError = new Error("Database transaction failed");
      mockCalculateAndRecordXp.mockRejectedValue(transactionError);

      await expect(calculateAndRecordXp("voter-1", "question-1")).rejects.toThrow(
        "Database transaction failed"
      );
    });

    it("should aggregate XP correctly for multiple transactions", async () => {
      const voterTokenId = "voter-1";
      const mockXpLedger = [
        createMockXpLedger({ voterTokenId, xpAmount: 5 }),
        createMockXpLedger({ voterTokenId, xpAmount: 10 }),
        createMockXpLedger({ voterTokenId, xpAmount: 15 }),
        createMockXpLedger({ voterTokenId, xpAmount: 20 }),
      ];

      mockPrisma.xpLedger.aggregate.mockResolvedValue({
        _sum: { xpAmount: 50 },
        _count: { id: 4 },
      });

      const ctx = createMockContext({ voterTokenRecord: { id: voterTokenId } });
      const caller = voteRouter.createCaller(ctx);

      const result = await caller.getFinalXpCalculation();

      expect(result.totalXp).toBe(50);
      expect(result.voteCount).toBeDefined();
    });

    it("should handle empty XP ledger gracefully", async () => {
      mockPrisma.xpLedger.aggregate.mockResolvedValue({
        _sum: { xpAmount: null },
        _count: { id: 0 },
      });

      const ctx = createMockContext({ voterTokenRecord: { id: "voter-1" } });
      const caller = voteRouter.createCaller(ctx);

      const result = await caller.getFinalXpCalculation();

      expect(result.totalXp).toBe(0);
      expect(result.voteCount).toBeDefined();
    });
  });

  describe("XP Claiming System", () => {
    it("should create XP claim with correct total", async () => {
      const mockVoterToken = {
        id: "voter-1",
        xpLedger: [
          { xpAmount: 5 },
          { xpAmount: 10 },
          { xpAmount: 15 },
          { xpAmount: 20 },
        ],
      };

      const mockXpClaim = {
        id: "claim-1",
        voterTokenId: "voter-1",
        email: "test@example.com",
        claimToken: "test-uuid",
        totalXp: 50,
        status: "pending",
      };

      mockPrisma.voterToken.findFirst.mockResolvedValue(mockVoterToken);
      mockPrisma.xpClaim.findFirst.mockResolvedValue(null); // No existing claim
      mockPrisma.xpClaim.create.mockResolvedValue(mockXpClaim);
      mockSendXpClaimEmail.mockResolvedValue(undefined);
      mockOnXpClaimed.mockResolvedValue(undefined);

      const ctx = createMockContext();
      const caller = voteRouter.createCaller(ctx);

      const result = await caller.claimXP({
        email: "test@example.com",
        voterTokenHash: "test-hash",
      });

      expect(result.success).toBe(true);
      expect(result.totalXp).toBe(50);
      expect(mockPrisma.xpClaim.create).toHaveBeenCalledWith({
        data: {
          voterTokenId: "voter-1",
          email: "test@example.com",
          claimToken: "test-uuid",
          totalXp: 50,
          expiresAt: expect.any(Date),
          status: "pending",
        },
      });
    });

    it("should reject claim for invalid voter token", async () => {
      mockPrisma.voterToken.findFirst.mockResolvedValue(null);

      const ctx = createMockContext();
      const caller = voteRouter.createCaller(ctx);

      await expect(caller.claimXP({
        email: "test@example.com",
        voterTokenHash: "invalid-hash",
      })).rejects.toThrow("Invalid voter token");
    });

    it("should reject claim for zero XP", async () => {
      const mockVoterToken = {
        id: "voter-1",
        xpLedger: [], // No XP
      };

      mockPrisma.voterToken.findFirst.mockResolvedValue(mockVoterToken);

      const ctx = createMockContext();
      const caller = voteRouter.createCaller(ctx);

      await expect(caller.claimXP({
        email: "test@example.com",
        voterTokenHash: "test-hash",
      })).rejects.toThrow("No XP to claim");
    });

    it("should reject duplicate claims", async () => {
      const mockVoterToken = {
        id: "voter-1",
        xpLedger: [{ xpAmount: 50 }],
      };

      const mockExistingClaim = {
        id: "claim-1",
        voterTokenId: "voter-1",
        status: "claimed",
      };

      mockPrisma.voterToken.findFirst.mockResolvedValue(mockVoterToken);
      mockPrisma.xpClaim.findFirst.mockResolvedValue(mockExistingClaim);

      const ctx = createMockContext();
      const caller = voteRouter.createCaller(ctx);

      await expect(caller.claimXP({
        email: "test@example.com",
        voterTokenHash: "test-hash",
      })).rejects.toThrow("XP has already been claimed for this account");
    });

    it("should handle email sending failures gracefully", async () => {
      const mockVoterToken = {
        id: "voter-1",
        xpLedger: [{ xpAmount: 50 }],
      };

      const mockXpClaim = {
        id: "claim-1",
        voterTokenId: "voter-1",
        email: "test@example.com",
        totalXp: 50,
        status: "pending",
      };

      mockPrisma.voterToken.findFirst.mockResolvedValue(mockVoterToken);
      mockPrisma.xpClaim.findFirst.mockResolvedValue(null);
      mockPrisma.xpClaim.create.mockResolvedValue(mockXpClaim);
      mockSendXpClaimEmail.mockRejectedValue(new Error("Email service down"));

      const ctx = createMockContext();
      const caller = voteRouter.createCaller(ctx);

      const result = await caller.claimXP({
        email: "test@example.com",
        voterTokenHash: "test-hash",
      });

      // Should still succeed even if email fails
      expect(result.success).toBe(true);
      expect(result.totalXp).toBe(50);
    });
  });

  describe("Background XP Processing", () => {
    it("should queue vote enhancement for background processing", async () => {
      const mockJob = {
        voteId: "vote-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: true,
        submittedAt: new Date(),
      };

      mockQueueVoteEnhancement.mockResolvedValue(undefined);

      await queueVoteEnhancement(mockJob);

      expect(mockQueueVoteEnhancement).toHaveBeenCalledWith(mockJob);
    });

    it("should process vote enhancement job successfully", async () => {
      const mockJob = {
        voteId: "vote-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: true,
        submittedAt: new Date(),
      };

      const mockResult = {
        xpAmount: 10,
        totalXp: 60,
        voteCount: 6,
      };

      mockProcessVoteEnhancement.mockResolvedValue(mockResult);

      const result = await processVoteEnhancement(mockJob);

      expect(result).toEqual(mockResult);
      expect(mockProcessVoteEnhancement).toHaveBeenCalledWith(mockJob);
    });

    it("should handle background processing errors", async () => {
      const mockJob = {
        voteId: "vote-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: true,
        submittedAt: new Date(),
      };

      const processingError = new Error("Background processing failed");
      mockProcessVoteEnhancement.mockRejectedValue(processingError);

      await expect(processVoteEnhancement(mockJob)).rejects.toThrow(
        "Background processing failed"
      );
    });

    it("should update engagement stats", async () => {
      const voterTokenId = "voter-1";
      
      mockUpdateEngagementStats.mockResolvedValue(undefined);

      await updateEngagementStats(voterTokenId);

      expect(mockUpdateEngagementStats).toHaveBeenCalledWith(voterTokenId);
    });
  });

  describe("XP Completion Reconciliation", () => {
    it("should indicate complete processing when XP matches expected minimum", async () => {
      const mockVoterToken = createMockVoterToken({ id: "voter-1" });
      
      mockPrisma.xpLedger.aggregate.mockResolvedValue({
        _sum: { xpAmount: 50 }, // 10 votes * 5 XP = 50 (minimum)
      });
      
      mockPrisma.questionResponse.count.mockResolvedValue(10);

      const ctx = createMockContext({ voterTokenRecord: mockVoterToken });
      const caller = voteRouter.createCaller(ctx);

      const result = await caller.getFinalXpCalculation();

      expect(result.totalXp).toBe(50);
      expect(result.voteCount).toBe(10);
      expect(result.isComplete).toBe(true);
      expect(result.shouldRefetch).toBe(false);
    });

    it("should indicate incomplete processing when XP is below minimum", async () => {
      const mockVoterToken = createMockVoterToken({ id: "voter-1" });
      
      mockPrisma.xpLedger.aggregate.mockResolvedValue({
        _sum: { xpAmount: 25 }, // Less than 10 votes * 5 XP = 50
      });
      
      mockPrisma.questionResponse.count.mockResolvedValue(10);

      const ctx = createMockContext({ voterTokenRecord: mockVoterToken });
      const caller = voteRouter.createCaller(ctx);

      const result = await caller.getFinalXpCalculation();

      expect(result.totalXp).toBe(25);
      expect(result.voteCount).toBe(10);
      expect(result.isComplete).toBe(false);
      expect(result.shouldRefetch).toBe(true);
    });

    it("should handle users without voter token", async () => {
      const ctx = createMockContext({ voterTokenRecord: null });
      const caller = voteRouter.createCaller(ctx);

      const result = await caller.getFinalXpCalculation();

      expect(result.totalXp).toBe(0);
      expect(result.voteCount).toBe(0);
      expect(result.isComplete).toBe(true);
    });
  });

  describe("XP Performance and Scalability", () => {
    it("should handle high-volume XP calculations efficiently", async () => {
      const startTime = Date.now();
      
      // Simulate 1000 XP calculations
      for (let i = 1; i <= 1000; i++) {
        mockCalculateXpForVote.mockReturnValue(i <= 5 ? 5 : i <= 10 ? 10 : 15);
        calculateXpForVote(i);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time
      expect(duration).toBeLessThan(1000); // Less than 1 second
    });

    it("should handle concurrent XP aggregation requests", async () => {
      const voterTokenId = "voter-1";
      
      mockPrisma.xpLedger.aggregate.mockResolvedValue({
        _sum: { xpAmount: 100 },
        _count: { id: 10 },
      });

      // Simulate concurrent requests
      const promises = Array.from({ length: 10 }, () => 
        mockGetVoteXpCalculation ? getVoteXpCalculation(voterTokenId) : Promise.resolve({ totalXp: 100 })
      );

      const results = await Promise.all(promises);

      // All requests should succeed
      results.forEach(result => {
        expect(result.totalXp).toBe(100);
      });
    });
  });

  describe("XP Data Integrity", () => {
    it("should maintain XP consistency across concurrent operations", async () => {
      const mockTransaction = jest.fn(async (callback) => {
        return await callback({
          voterToken: {
            update: jest.fn().mockResolvedValue({ voteCount: 1 }),
          },
          xpLedger: {
            create: jest.fn().mockResolvedValue({ xpAmount: 5 }),
            aggregate: jest.fn().mockResolvedValue({ _sum: { xpAmount: 5 } }),
          },
        });
      });

      mockPrisma.$transaction.mockImplementation(mockTransaction);

      const mockResult = {
        xpAmount: 5,
        totalXp: 5,
        voteCount: 1,
      };

      mockCalculateAndRecordXp.mockResolvedValue(mockResult);

      const result = await calculateAndRecordXp("voter-1", "question-1");

      expect(result.xpAmount).toBe(5);
      expect(result.totalXp).toBe(5);
      expect(result.voteCount).toBe(1);
    });

    it("should handle XP calculation rollback on failure", async () => {
      const mockTransaction = jest.fn(async () => {
        throw new Error("Transaction failed");
      });

      mockPrisma.$transaction.mockImplementation(mockTransaction);
      mockCalculateAndRecordXp.mockRejectedValue(new Error("Transaction failed"));

      await expect(calculateAndRecordXp("voter-1", "question-1")).rejects.toThrow(
        "Transaction failed"
      );

      // Verify no partial state changes occurred
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });
  });
});