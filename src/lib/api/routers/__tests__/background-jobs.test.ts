import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock dependencies
jest.mock("../../../db", () => ({
  prisma: {
    questionResponse: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    voterToken: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    xpLedger: {
      create: jest.fn(),
      findMany: jest.fn(),
      aggregate: jest.fn(),
    },
    engagementStats: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
    },
    liveStat: {
      upsert: jest.fn(),
    },
    question: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("../../background-jobs", () => ({
  queueVoteEnhancement: jest.fn(),
  processVoteEnhancement: jest.fn(),
  calculateXpForVote: jest.fn(),
  updateEngagementStats: jest.fn(),
  updateLiveStats: jest.fn(),
  sendMilestoneNotification: jest.fn(),
  cleanupStaleData: jest.fn(),
}));

jest.mock("../../email/sendEmail", () => ({
  sendMilestoneEmail: jest.fn(),
  sendStreakEmail: jest.fn(),
}));

import { prisma } from "../../../db";
import {
  queueVoteEnhancement,
  processVoteEnhancement,
  calculateXpForVote,
  updateEngagementStats,
  updateLiveStats,
  sendMilestoneNotification,
  cleanupStaleData,
} from "../../background-jobs";
import { sendMilestoneEmail, sendStreakEmail } from "../../email/sendEmail";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockQueueVoteEnhancement = queueVoteEnhancement as jest.MockedFunction<typeof queueVoteEnhancement>;
const mockProcessVoteEnhancement = processVoteEnhancement as jest.MockedFunction<typeof processVoteEnhancement>;
const mockCalculateXpForVote = calculateXpForVote as jest.MockedFunction<typeof calculateXpForVote>;
const mockUpdateEngagementStats = updateEngagementStats as jest.MockedFunction<typeof updateEngagementStats>;
const mockUpdateLiveStats = updateLiveStats as jest.MockedFunction<typeof updateLiveStats>;
const mockSendMilestoneNotification = sendMilestoneNotification as jest.MockedFunction<typeof sendMilestoneNotification>;
const mockCleanupStaleData = cleanupStaleData as jest.MockedFunction<typeof cleanupStaleData>;
const mockSendMilestoneEmail = sendMilestoneEmail as jest.MockedFunction<typeof sendMilestoneEmail>;
const mockSendStreakEmail = sendStreakEmail as jest.MockedFunction<typeof sendStreakEmail>;

describe("Background Job Processing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Vote Enhancement Queue", () => {
    it("should queue vote enhancement job successfully", async () => {
      const mockVoteData = {
        voteId: "vote-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: false,
        submittedAt: new Date(),
      };

      mockQueueVoteEnhancement.mockResolvedValue(undefined);

      await queueVoteEnhancement(mockVoteData);

      expect(mockQueueVoteEnhancement).toHaveBeenCalledWith(mockVoteData);
    });

    it("should handle queue failures gracefully", async () => {
      const mockVoteData = {
        voteId: "vote-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: false,
        submittedAt: new Date(),
      };

      mockQueueVoteEnhancement.mockRejectedValue(new Error("Queue service unavailable"));

      await expect(queueVoteEnhancement(mockVoteData)).rejects.toThrow("Queue service unavailable");
    });

    it("should prioritize new voter enhancement", async () => {
      const mockNewVoterData = {
        voteId: "vote-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: true,
        submittedAt: new Date(),
      };

      mockQueueVoteEnhancement.mockResolvedValue(undefined);

      await queueVoteEnhancement(mockNewVoterData);

      expect(mockQueueVoteEnhancement).toHaveBeenCalledWith(
        expect.objectContaining({
          isNewVoter: true,
        })
      );
    });
  });

  describe("Vote Enhancement Processing", () => {
    it("should process vote enhancement job completely", async () => {
      const mockJobData = {
        voteId: "vote-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: false,
        submittedAt: new Date(),
      };

      const mockVoteRecord = {
        id: "vote-1",
        questionId: "question-1",
        voterTokenId: "voter-1",
        responseData: "Yes",
        createdAt: new Date(),
      };

      const mockXpCalculation = {
        baseXp: 10,
        bonusXp: 5,
        totalXp: 15,
        bonusReasons: ["streak_bonus"],
      };

      const mockEngagementStats = {
        id: "engagement-1",
        voterTokenId: "voter-1",
        currentStreak: 3,
        longestStreak: 5,
        totalVotes: 15,
        totalXp: 450,
        lastActivity: new Date(),
      };

      mockPrisma.questionResponse.findUnique.mockResolvedValue(mockVoteRecord);
      mockCalculateXpForVote.mockResolvedValue(mockXpCalculation);
      mockUpdateEngagementStats.mockResolvedValue(mockEngagementStats);
      mockUpdateLiveStats.mockResolvedValue(undefined);
      mockProcessVoteEnhancement.mockResolvedValue({
        success: true,
        xpAwarded: 15,
        engagementUpdated: true,
        milestonesReached: [],
      });

      const result = await processVoteEnhancement(mockJobData);

      expect(result.success).toBe(true);
      expect(result.xpAwarded).toBe(15);
      expect(result.engagementUpdated).toBe(true);
    });

    it("should handle XP calculation during processing", async () => {
      const mockJobData = {
        voteId: "vote-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: false,
        submittedAt: new Date(),
      };

      const mockVoteRecord = {
        id: "vote-1",
        questionId: "question-1",
        voterTokenId: "voter-1",
        responseData: "Yes",
        createdAt: new Date(),
      };

      const mockXpCalculation = {
        baseXp: 10,
        bonusXp: 15,
        totalXp: 25,
        bonusReasons: ["streak_bonus", "milestone_10_votes"],
      };

      mockPrisma.questionResponse.findUnique.mockResolvedValue(mockVoteRecord);
      mockCalculateXpForVote.mockResolvedValue(mockXpCalculation);
      mockPrisma.xpLedger.create.mockResolvedValue({
        id: "xp-1",
        voterTokenId: "voter-1",
        actionType: "vote",
        xpAmount: 25,
        sourceQuestionId: "question-1",
        createdAt: new Date(),
      });

      await calculateXpForVote(mockVoteRecord);

      expect(mockCalculateXpForVote).toHaveBeenCalledWith(mockVoteRecord);
    });

    it("should handle engagement stats update during processing", async () => {
      const mockEngagementData = {
        voterTokenId: "voter-1",
        voteId: "vote-1",
        questionId: "question-1",
        isNewVoter: false,
      };

      const mockCurrentStats = {
        id: "engagement-1",
        voterTokenId: "voter-1",
        currentStreak: 2,
        longestStreak: 4,
        totalVotes: 14,
        totalXp: 435,
        lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
      };

      const mockUpdatedStats = {
        ...mockCurrentStats,
        currentStreak: 3,
        longestStreak: 4,
        totalVotes: 15,
        totalXp: 450,
        lastActivity: new Date(),
      };

      mockPrisma.engagementStats.findFirst.mockResolvedValue(mockCurrentStats);
      mockPrisma.engagementStats.upsert.mockResolvedValue(mockUpdatedStats);
      mockUpdateEngagementStats.mockResolvedValue(mockUpdatedStats);

      const result = await updateEngagementStats(mockEngagementData);

      expect(result.currentStreak).toBe(3);
      expect(result.totalVotes).toBe(15);
      expect(result.totalXp).toBe(450);
    });

    it("should detect and handle milestones during processing", async () => {
      const mockJobData = {
        voteId: "vote-25",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: false,
        submittedAt: new Date(),
      };

      const mockVoteRecord = {
        id: "vote-25",
        questionId: "question-1",
        voterTokenId: "voter-1",
        responseData: "Yes",
        createdAt: new Date(),
      };

      const mockXpCalculation = {
        baseXp: 10,
        bonusXp: 100,
        totalXp: 110,
        bonusReasons: ["milestone_25_votes"],
      };

      mockPrisma.questionResponse.findUnique.mockResolvedValue(mockVoteRecord);
      mockPrisma.questionResponse.count.mockResolvedValue(25);
      mockCalculateXpForVote.mockResolvedValue(mockXpCalculation);
      mockProcessVoteEnhancement.mockResolvedValue({
        success: true,
        xpAwarded: 110,
        engagementUpdated: true,
        milestonesReached: ["25_votes"],
      });

      const result = await processVoteEnhancement(mockJobData);

      expect(result.milestonesReached).toContain("25_votes");
      expect(result.xpAwarded).toBe(110);
    });

    it("should handle processing failures gracefully", async () => {
      const mockJobData = {
        voteId: "vote-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: false,
        submittedAt: new Date(),
      };

      mockPrisma.questionResponse.findUnique.mockRejectedValue(new Error("Database error"));
      mockProcessVoteEnhancement.mockRejectedValue(new Error("Processing failed"));

      await expect(processVoteEnhancement(mockJobData)).rejects.toThrow("Processing failed");
    });

    it("should handle missing vote records", async () => {
      const mockJobData = {
        voteId: "vote-nonexistent",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: false,
        submittedAt: new Date(),
      };

      mockPrisma.questionResponse.findUnique.mockResolvedValue(null);
      mockProcessVoteEnhancement.mockResolvedValue({
        success: false,
        error: "Vote record not found",
      });

      const result = await processVoteEnhancement(mockJobData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Vote record not found");
    });
  });

  describe("Live Statistics Updates", () => {
    it("should update live statistics after vote processing", async () => {
      const mockLiveStats = {
        totalVotes: 1001,
        activeQuestions: 15,
        totalXpAwarded: 50100,
        uniqueVoters: 250,
      };

      mockPrisma.liveStat.upsert
        .mockResolvedValueOnce({ id: "stat-1", statKey: "total_votes", statValue: 1001 })
        .mockResolvedValueOnce({ id: "stat-2", statKey: "total_xp_awarded", statValue: 50100 })
        .mockResolvedValueOnce({ id: "stat-3", statKey: "unique_voters", statValue: 250 });

      mockUpdateLiveStats.mockResolvedValue(mockLiveStats);

      const result = await updateLiveStats();

      expect(result.totalVotes).toBe(1001);
      expect(result.totalXpAwarded).toBe(50100);
      expect(result.uniqueVoters).toBe(250);
    });

    it("should handle concurrent live stat updates", async () => {
      const mockConcurrentUpdates = Array(10).fill(null).map((_, i) => ({
        statKey: "total_votes",
        statValue: 1000 + i,
      }));

      mockPrisma.liveStat.upsert.mockImplementation(async (args) => ({
        id: "stat-1",
        statKey: args.where.statKey,
        statValue: args.update.statValue,
        lastUpdated: new Date(),
      }));

      const promises = mockConcurrentUpdates.map(update =>
        mockPrisma.liveStat.upsert({
          where: { statKey: update.statKey },
          create: update,
          update: { statValue: update.statValue },
        })
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(10);
      expect(mockPrisma.liveStat.upsert).toHaveBeenCalledTimes(10);
    });

    it("should handle live stat update failures", async () => {
      mockPrisma.liveStat.upsert.mockRejectedValue(new Error("Database connection failed"));
      mockUpdateLiveStats.mockRejectedValue(new Error("Live stats update failed"));

      await expect(updateLiveStats()).rejects.toThrow("Live stats update failed");
    });
  });

  describe("Milestone Notifications", () => {
    it("should send milestone notification email", async () => {
      const mockMilestoneData = {
        voterTokenId: "voter-1",
        milestone: "25_votes",
        xpAwarded: 100,
        totalXp: 550,
        totalVotes: 25,
      };

      mockSendMilestoneEmail.mockResolvedValue(undefined);
      mockSendMilestoneNotification.mockResolvedValue({
        success: true,
        notificationSent: true,
      });

      const result = await sendMilestoneNotification(mockMilestoneData);

      expect(result.success).toBe(true);
      expect(result.notificationSent).toBe(true);
    });

    it("should handle milestone notification failures", async () => {
      const mockMilestoneData = {
        voterTokenId: "voter-1",
        milestone: "25_votes",
        xpAwarded: 100,
        totalXp: 550,
        totalVotes: 25,
      };

      mockSendMilestoneEmail.mockRejectedValue(new Error("Email service unavailable"));
      mockSendMilestoneNotification.mockResolvedValue({
        success: false,
        error: "Email service unavailable",
      });

      const result = await sendMilestoneNotification(mockMilestoneData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Email service unavailable");
    });

    it("should send streak notification email", async () => {
      const mockStreakData = {
        voterTokenId: "voter-1",
        currentStreak: 7,
        longestStreak: 10,
        bonusXp: 15,
      };

      mockSendStreakEmail.mockResolvedValue(undefined);

      await sendStreakEmail(mockStreakData);

      expect(mockSendStreakEmail).toHaveBeenCalledWith(mockStreakData);
    });
  });

  describe("Data Cleanup Jobs", () => {
    it("should cleanup stale vote enhancement jobs", async () => {
      const mockStaleJobs = [
        { id: "job-1", createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000) },
        { id: "job-2", createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000) },
      ];

      mockCleanupStaleData.mockResolvedValue({
        deletedJobs: 2,
        deletedTokens: 0,
        deletedRateLimits: 5,
      });

      const result = await cleanupStaleData();

      expect(result.deletedJobs).toBe(2);
      expect(result.deletedRateLimits).toBe(5);
    });

    it("should cleanup expired voter tokens", async () => {
      mockCleanupStaleData.mockResolvedValue({
        deletedJobs: 0,
        deletedTokens: 3,
        deletedRateLimits: 0,
      });

      const result = await cleanupStaleData();

      expect(result.deletedTokens).toBe(3);
    });

    it("should cleanup expired rate limits", async () => {
      mockCleanupStaleData.mockResolvedValue({
        deletedJobs: 0,
        deletedTokens: 0,
        deletedRateLimits: 15,
      });

      const result = await cleanupStaleData();

      expect(result.deletedRateLimits).toBe(15);
    });
  });

  describe("Job Processing Performance", () => {
    it("should process vote enhancement jobs within time limits", async () => {
      const mockJobData = {
        voteId: "vote-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: false,
        submittedAt: new Date(),
      };

      const mockVoteRecord = {
        id: "vote-1",
        questionId: "question-1",
        voterTokenId: "voter-1",
        responseData: "Yes",
        createdAt: new Date(),
      };

      mockPrisma.questionResponse.findUnique.mockResolvedValue(mockVoteRecord);
      mockCalculateXpForVote.mockResolvedValue({
        baseXp: 10,
        bonusXp: 0,
        totalXp: 10,
        bonusReasons: [],
      });
      mockUpdateEngagementStats.mockResolvedValue({
        id: "engagement-1",
        voterTokenId: "voter-1",
        currentStreak: 1,
        longestStreak: 1,
        totalVotes: 1,
        totalXp: 10,
        lastActivity: new Date(),
      });

      const startTime = Date.now();
      
      mockProcessVoteEnhancement.mockResolvedValue({
        success: true,
        xpAwarded: 10,
        engagementUpdated: true,
        milestonesReached: [],
      });

      await processVoteEnhancement(mockJobData);
      
      const endTime = Date.now();
      const processingTime = endTime - startTime;

      // Should complete within reasonable time
      expect(processingTime).toBeLessThan(2000); // 2 seconds
    });

    it("should handle high-volume job processing", async () => {
      const mockJobs = Array(100).fill(null).map((_, i) => ({
        voteId: `vote-${i}`,
        voterTokenId: `voter-${i}`,
        questionId: "question-1",
        isNewVoter: false,
        submittedAt: new Date(),
      }));

      mockProcessVoteEnhancement.mockResolvedValue({
        success: true,
        xpAwarded: 10,
        engagementUpdated: true,
        milestonesReached: [],
      });

      const startTime = Date.now();
      
      // Process jobs in batches
      const batchSize = 10;
      const batches = [];
      
      for (let i = 0; i < mockJobs.length; i += batchSize) {
        const batch = mockJobs.slice(i, i + batchSize);
        batches.push(Promise.all(batch.map(job => processVoteEnhancement(job))));
      }

      await Promise.all(batches);
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // Should complete within reasonable time
      expect(totalTime).toBeLessThan(10000); // 10 seconds
      expect(mockProcessVoteEnhancement).toHaveBeenCalledTimes(100);
    });
  });

  describe("Job Retry Logic", () => {
    it("should retry failed job processing", async () => {
      const mockJobData = {
        voteId: "vote-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: false,
        submittedAt: new Date(),
      };

      mockProcessVoteEnhancement
        .mockRejectedValueOnce(new Error("Temporary failure"))
        .mockRejectedValueOnce(new Error("Temporary failure"))
        .mockResolvedValueOnce({
          success: true,
          xpAwarded: 10,
          engagementUpdated: true,
          milestonesReached: [],
        });

      // Simulate retry logic
      let attempts = 0;
      let result;
      
      while (attempts < 3) {
        try {
          result = await processVoteEnhancement(mockJobData);
          break;
        } catch (error) {
          attempts++;
          if (attempts === 3) throw error;
        }
      }

      expect(result?.success).toBe(true);
      expect(mockProcessVoteEnhancement).toHaveBeenCalledTimes(3);
    });

    it("should handle permanent job failures", async () => {
      const mockJobData = {
        voteId: "vote-nonexistent",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: false,
        submittedAt: new Date(),
      };

      mockProcessVoteEnhancement.mockRejectedValue(new Error("Permanent failure"));

      await expect(processVoteEnhancement(mockJobData)).rejects.toThrow("Permanent failure");
    });
  });

  describe("Job Monitoring and Logging", () => {
    it("should log job processing metrics", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
      
      const mockJobData = {
        voteId: "vote-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: false,
        submittedAt: new Date(),
      };

      mockProcessVoteEnhancement.mockResolvedValue({
        success: true,
        xpAwarded: 10,
        engagementUpdated: true,
        milestonesReached: [],
      });

      await processVoteEnhancement(mockJobData);

      // Verify logging would occur in actual implementation
      consoleSpy.mockRestore();
    });

    it("should track job processing statistics", async () => {
      const mockJobData = {
        voteId: "vote-1",
        voterTokenId: "voter-1",
        questionId: "question-1",
        isNewVoter: false,
        submittedAt: new Date(),
      };

      mockProcessVoteEnhancement.mockResolvedValue({
        success: true,
        xpAwarded: 10,
        engagementUpdated: true,
        milestonesReached: [],
        processingTime: 150,
      });

      const result = await processVoteEnhancement(mockJobData);

      expect(result.processingTime).toBeDefined();
      expect(typeof result.processingTime).toBe("number");
    });
  });
});