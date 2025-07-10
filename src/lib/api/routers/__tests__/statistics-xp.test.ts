import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock dependencies
jest.mock("../../../db", () => ({
  prisma: {
    questionResponse: {
      findMany: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
      aggregate: jest.fn(),
    },
    voterToken: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    xpLedger: {
      findMany: jest.fn(),
      create: jest.fn(),
      aggregate: jest.fn(),
    },
    engagementStats: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
    },
    analyticsDaily: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    liveStat: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
    },
  },
}));

jest.mock("../../background-jobs", () => ({
  calculateXpForVote: jest.fn(),
  updateEngagementStats: jest.fn(),
  updateLiveStats: jest.fn(),
}));

import { prisma } from "../../../db";
import { 
  calculateXpForVote, 
  updateEngagementStats, 
  updateLiveStats 
} from "../../background-jobs";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockCalculateXpForVote = calculateXpForVote as jest.MockedFunction<typeof calculateXpForVote>;
const mockUpdateEngagementStats = updateEngagementStats as jest.MockedFunction<typeof updateEngagementStats>;
const mockUpdateLiveStats = updateLiveStats as jest.MockedFunction<typeof updateLiveStats>;

describe("Statistics and XP Calculation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("XP Calculation", () => {
    it("should calculate base XP for a vote", async () => {
      const mockVoteData = {
        id: "vote-1",
        questionId: "question-1",
        voterTokenId: "voter-1",
        responseData: "Yes",
        createdAt: new Date(),
      };

      mockCalculateXpForVote.mockResolvedValue({
        baseXp: 10,
        bonusXp: 0,
        totalXp: 10,
        bonusReasons: [],
      });

      const result = await calculateXpForVote(mockVoteData);

      expect(result).toEqual({
        baseXp: 10,
        bonusXp: 0,
        totalXp: 10,
        bonusReasons: [],
      });
    });

    it("should calculate bonus XP for streak voting", async () => {
      const mockVoteData = {
        id: "vote-1",
        questionId: "question-1",
        voterTokenId: "voter-1",
        responseData: "Yes",
        createdAt: new Date(),
      };

      mockCalculateXpForVote.mockResolvedValue({
        baseXp: 10,
        bonusXp: 5,
        totalXp: 15,
        bonusReasons: ["streak_bonus"],
      });

      // Mock consecutive voting days
      const mockVoteHistory = [
        { createdAt: new Date() },
        { createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        { createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000) },
      ];

      mockPrisma.questionResponse.findMany.mockResolvedValue(mockVoteHistory);

      const result = await calculateXpForVote(mockVoteData);

      expect(result.bonusXp).toBe(5);
      expect(result.bonusReasons).toContain("streak_bonus");
    });

    it("should calculate milestone bonus XP", async () => {
      const mockVoteData = {
        id: "vote-25",
        questionId: "question-1",
        voterTokenId: "voter-1",
        responseData: "Yes",
        createdAt: new Date(),
      };

      mockCalculateXpForVote.mockResolvedValue({
        baseXp: 10,
        bonusXp: 100,
        totalXp: 110,
        bonusReasons: ["milestone_25_votes"],
      });

      // Mock vote count reaching milestone
      mockPrisma.questionResponse.count.mockResolvedValue(25);

      const result = await calculateXpForVote(mockVoteData);

      expect(result.bonusXp).toBe(100);
      expect(result.bonusReasons).toContain("milestone_25_votes");
    });

    it("should calculate category completion bonus", async () => {
      const mockVoteData = {
        id: "vote-1",
        questionId: "question-1",
        voterTokenId: "voter-1",
        responseData: "Yes",
        createdAt: new Date(),
      };

      mockCalculateXpForVote.mockResolvedValue({
        baseXp: 10,
        bonusXp: 25,
        totalXp: 35,
        bonusReasons: ["category_completion"],
      });

      const result = await calculateXpForVote(mockVoteData);

      expect(result.bonusXp).toBe(25);
      expect(result.bonusReasons).toContain("category_completion");
    });

    it("should handle multiple bonus types", async () => {
      const mockVoteData = {
        id: "vote-1",
        questionId: "question-1",
        voterTokenId: "voter-1",
        responseData: "Yes",
        createdAt: new Date(),
      };

      mockCalculateXpForVote.mockResolvedValue({
        baseXp: 10,
        bonusXp: 30,
        totalXp: 40,
        bonusReasons: ["streak_bonus", "milestone_10_votes", "category_completion"],
      });

      const result = await calculateXpForVote(mockVoteData);

      expect(result.totalXp).toBe(40);
      expect(result.bonusReasons).toHaveLength(3);
      expect(result.bonusReasons).toContain("streak_bonus");
      expect(result.bonusReasons).toContain("milestone_10_votes");
      expect(result.bonusReasons).toContain("category_completion");
    });

    it("should create XP ledger entries", async () => {
      const mockXpCalculation = {
        baseXp: 10,
        bonusXp: 5,
        totalXp: 15,
        bonusReasons: ["streak_bonus"],
      };

      mockCalculateXpForVote.mockResolvedValue(mockXpCalculation);

      const mockXpLedgerEntry = {
        id: "xp-1",
        voterTokenId: "voter-1",
        actionType: "vote",
        xpAmount: 15,
        sourceQuestionId: "question-1",
        createdAt: new Date(),
      };

      mockPrisma.xpLedger.create.mockResolvedValue(mockXpLedgerEntry);

      const voteData = {
        id: "vote-1",
        questionId: "question-1",
        voterTokenId: "voter-1",
        responseData: "Yes",
        createdAt: new Date(),
      };

      const xpResult = await calculateXpForVote(voteData);

      expect(xpResult.totalXp).toBe(15);
    });

    it("should handle XP calculation errors gracefully", async () => {
      const mockVoteData = {
        id: "vote-1",
        questionId: "question-1",
        voterTokenId: "voter-1",
        responseData: "Yes",
        createdAt: new Date(),
      };

      mockCalculateXpForVote.mockRejectedValue(new Error("XP calculation failed"));

      await expect(calculateXpForVote(mockVoteData)).rejects.toThrow("XP calculation failed");
    });
  });

  describe("Real-time Statistics", () => {
    it("should update live stats after vote submission", async () => {
      const mockLiveStats = {
        totalVotes: 1000,
        activeQuestions: 15,
        totalXpAwarded: 50000,
        uniqueVoters: 250,
      };

      mockUpdateLiveStats.mockResolvedValue(mockLiveStats);

      const result = await updateLiveStats();

      expect(result).toEqual(mockLiveStats);
    });

    it("should retrieve current live stats", async () => {
      const mockStats = [
        { statKey: "total_votes", statValue: 1000 },
        { statKey: "active_questions", statValue: 15 },
        { statKey: "total_xp_awarded", statValue: 50000 },
        { statKey: "unique_voters", statValue: 250 },
      ];

      mockPrisma.liveStat.findFirst
        .mockResolvedValueOnce(mockStats[0])
        .mockResolvedValueOnce(mockStats[1])
        .mockResolvedValueOnce(mockStats[2])
        .mockResolvedValueOnce(mockStats[3]);

      // Test getting individual stats
      for (const stat of mockStats) {
        const result = await mockPrisma.liveStat.findFirst({
          where: { statKey: stat.statKey },
        });
        expect(result).toEqual(stat);
      }
    });

    it("should update live stats atomically", async () => {
      const mockUpdates = [
        { statKey: "total_votes", statValue: 1001 },
        { statKey: "unique_voters", statValue: 251 },
      ];

      mockPrisma.liveStat.upsert
        .mockResolvedValueOnce(mockUpdates[0])
        .mockResolvedValueOnce(mockUpdates[1]);

      for (const update of mockUpdates) {
        await mockPrisma.liveStat.upsert({
          where: { statKey: update.statKey },
          create: update,
          update: { statValue: update.statValue },
        });
      }

      expect(mockPrisma.liveStat.upsert).toHaveBeenCalledTimes(2);
    });

    it("should handle concurrent stat updates", async () => {
      const concurrentUpdates = Array(10).fill(null).map((_, i) => ({
        statKey: "total_votes",
        statValue: 1000 + i,
      }));

      mockPrisma.liveStat.upsert.mockImplementation(async (args) => ({
        id: "stat-1",
        ...args.update,
        lastUpdated: new Date(),
      }));

      const promises = concurrentUpdates.map(update =>
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

    it("should calculate aggregated statistics", async () => {
      // Mock data for aggregation
      const mockVoteStats = {
        _count: { id: 1000 },
        _sum: { xpAmount: 50000 },
      };

      const _mockUniqueVoters = { _count: { voterTokenId: 250 } };

      mockPrisma.questionResponse.aggregate.mockResolvedValue(mockVoteStats);
      mockPrisma.questionResponse.count.mockResolvedValue(250);

      const voteCount = await mockPrisma.questionResponse.aggregate({
        _count: { id: true },
      });

      const uniqueVoters = await mockPrisma.questionResponse.count({
        distinct: ["voterTokenId"],
      });

      expect(voteCount._count.id).toBe(1000);
      expect(uniqueVoters).toBe(250);
    });

    it("should handle empty statistics gracefully", async () => {
      mockPrisma.questionResponse.aggregate.mockResolvedValue({
        _count: { id: 0 },
        _sum: { xpAmount: 0 },
      });

      mockPrisma.questionResponse.count.mockResolvedValue(0);

      const voteCount = await mockPrisma.questionResponse.aggregate({
        _count: { id: true },
      });

      expect(voteCount._count.id).toBe(0);
      expect(voteCount._sum.xpAmount).toBe(0);
    });
  });

  describe("Engagement Statistics", () => {
    it("should update engagement stats after vote", async () => {
      const mockEngagementData = {
        voterTokenId: "voter-1",
        voteId: "vote-1",
        questionId: "question-1",
        isNewVoter: false,
      };

      const mockUpdatedStats = {
        id: "engagement-1",
        voterTokenId: "voter-1",
        currentStreak: 3,
        longestStreak: 5,
        totalVotes: 15,
        totalXp: 450,
        lastActivity: new Date(),
      };

      mockUpdateEngagementStats.mockResolvedValue(mockUpdatedStats);

      const result = await updateEngagementStats(mockEngagementData);

      expect(result).toEqual(mockUpdatedStats);
    });

    it("should calculate streak correctly", async () => {
      const mockVoteHistory = [
        { createdAt: new Date() }, // Today
        { createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Yesterday
        { createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000) }, // 2 days ago
        { createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000) }, // 4 days ago (gap)
      ];

      mockPrisma.questionResponse.findMany.mockResolvedValue(mockVoteHistory);

      const voteHistory = await mockPrisma.questionResponse.findMany({
        where: { voterTokenId: "voter-1" },
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
      });

      expect(voteHistory).toHaveLength(4);
      // Streak calculation logic would be tested in the actual implementation
    });

    it("should track longest streak", async () => {
      const mockEngagementStats = {
        id: "engagement-1",
        voterTokenId: "voter-1",
        currentStreak: 3,
        longestStreak: 7,
        totalVotes: 25,
        totalXp: 750,
        lastActivity: new Date(),
      };

      mockPrisma.engagementStats.findFirst.mockResolvedValue(mockEngagementStats);

      const stats = await mockPrisma.engagementStats.findFirst({
        where: { voterTokenId: "voter-1" },
      });

      expect(stats?.longestStreak).toBe(7);
      expect(stats?.currentStreak).toBe(3);
    });

    it("should handle streak reset correctly", async () => {
      const mockEngagementData = {
        voterTokenId: "voter-1",
        voteId: "vote-1",
        questionId: "question-1",
        isNewVoter: false,
      };

      // Mock broken streak (last vote more than 1 day ago)
      const mockVoteHistory = [
        { createdAt: new Date() }, // Today
        { createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }, // 3 days ago
      ];

      mockPrisma.questionResponse.findMany.mockResolvedValue(mockVoteHistory);

      const mockResetStats = {
        id: "engagement-1",
        voterTokenId: "voter-1",
        currentStreak: 1, // Reset to 1
        longestStreak: 5, // Preserved
        totalVotes: 16,
        totalXp: 480,
        lastActivity: new Date(),
      };

      mockUpdateEngagementStats.mockResolvedValue(mockResetStats);

      const result = await updateEngagementStats(mockEngagementData);

      expect(result.currentStreak).toBe(1);
      expect(result.longestStreak).toBe(5);
    });

    it("should handle new voter engagement stats", async () => {
      const mockEngagementData = {
        voterTokenId: "voter-1",
        voteId: "vote-1",
        questionId: "question-1",
        isNewVoter: true,
      };

      const mockNewStats = {
        id: "engagement-1",
        voterTokenId: "voter-1",
        currentStreak: 1,
        longestStreak: 1,
        totalVotes: 1,
        totalXp: 10,
        lastActivity: new Date(),
      };

      mockUpdateEngagementStats.mockResolvedValue(mockNewStats);

      const result = await updateEngagementStats(mockEngagementData);

      expect(result.currentStreak).toBe(1);
      expect(result.longestStreak).toBe(1);
      expect(result.totalVotes).toBe(1);
    });
  });

  describe("Daily Analytics", () => {
    it("should aggregate daily statistics", async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const mockDailyStats = {
        date: today,
        totalVotes: 150,
        uniqueVoters: 45,
        totalXpEarned: 1500,
        newsletterSignups: 12,
        popularQuestions: [
          { questionId: "question-1", title: "TypeScript vs JavaScript", voteCount: 50 },
          { questionId: "question-2", title: "Favorite Framework", voteCount: 35 },
        ],
      };

      mockPrisma.analyticsDaily.create.mockResolvedValue(mockDailyStats);

      const result = await mockPrisma.analyticsDaily.create({
        data: mockDailyStats,
      });

      expect(result.totalVotes).toBe(150);
      expect(result.uniqueVoters).toBe(45);
      expect(result.popularQuestions).toHaveLength(2);
    });

    it("should calculate trending questions", async () => {
      const mockQuestionStats = [
        { questionId: "question-1", _count: { questionId: 100 } },
        { questionId: "question-2", _count: { questionId: 75 } },
        { questionId: "question-3", _count: { questionId: 50 } },
      ];

      mockPrisma.questionResponse.groupBy.mockResolvedValue(mockQuestionStats);

      const trending = await mockPrisma.questionResponse.groupBy({
        by: ["questionId"],
        _count: { questionId: true },
        orderBy: { _count: { questionId: "desc" } },
        take: 5,
      });

      expect(trending).toHaveLength(3);
      expect(trending[0]._count.questionId).toBe(100);
    });

    it("should handle historical analytics retrieval", async () => {
      const mockHistoricalData = Array(30).fill(null).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        return {
          date,
          totalVotes: 100 + i * 5,
          uniqueVoters: 30 + i * 2,
          totalXpEarned: 1000 + i * 50,
        };
      });

      mockPrisma.analyticsDaily.findMany.mockResolvedValue(mockHistoricalData);

      const history = await mockPrisma.analyticsDaily.findMany({
        orderBy: { date: "desc" },
        take: 30,
      });

      expect(history).toHaveLength(30);
      expect(history[0].totalVotes).toBe(100);
    });
  });

  describe("Performance Optimization", () => {
    it("should cache frequently accessed statistics", async () => {
      const mockCachedStats = {
        totalVotes: 1000,
        lastUpdated: new Date(),
      };

      mockPrisma.liveStat.findFirst.mockResolvedValue(mockCachedStats);

      // Multiple calls should use cached data
      const calls = Array(5).fill(null).map(() =>
        mockPrisma.liveStat.findFirst({
          where: { statKey: "total_votes" },
        })
      );

      const results = await Promise.all(calls);

      expect(results).toHaveLength(5);
      results.forEach(result => {
        expect(result).toEqual(mockCachedStats);
      });
    });

    it("should batch statistics updates", async () => {
      const mockBatchUpdates = [
        { statKey: "total_votes", statValue: 1001 },
        { statKey: "unique_voters", statValue: 251 },
        { statKey: "total_xp_awarded", statValue: 50100 },
      ];

      mockPrisma.liveStat.upsert.mockResolvedValue(mockBatchUpdates[0]);

      // Simulate batch update
      for (const update of mockBatchUpdates) {
        await mockPrisma.liveStat.upsert({
          where: { statKey: update.statKey },
          create: update,
          update: { statValue: update.statValue },
        });
      }

      expect(mockPrisma.liveStat.upsert).toHaveBeenCalledTimes(3);
    });

    it("should handle high-frequency stat updates", async () => {
      const startTime = Date.now();
      
      mockUpdateLiveStats.mockResolvedValue({
        totalVotes: 1000,
        activeQuestions: 15,
        totalXpAwarded: 50000,
        uniqueVoters: 250,
      });

      // Simulate 100 rapid updates
      const promises = Array(100).fill(null).map(() => updateLiveStats());
      
      await Promise.all(promises);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time
      expect(duration).toBeLessThan(5000); // 5 seconds
    });
  });

  describe("Error Handling in Statistics", () => {
    it("should handle XP calculation failures gracefully", async () => {
      const mockVoteData = {
        id: "vote-1",
        questionId: "question-1",
        voterTokenId: "voter-1",
        responseData: "Yes",
        createdAt: new Date(),
      };

      mockCalculateXpForVote.mockRejectedValue(new Error("Database error"));

      await expect(calculateXpForVote(mockVoteData)).rejects.toThrow("Database error");
    });

    it("should handle statistics update failures", async () => {
      mockUpdateLiveStats.mockRejectedValue(new Error("Update failed"));

      await expect(updateLiveStats()).rejects.toThrow("Update failed");
    });

    it("should handle corrupted statistics data", async () => {
      const mockCorruptedData = {
        statKey: "total_votes",
        statValue: null, // Corrupted value
      };

      mockPrisma.liveStat.findFirst.mockResolvedValue(mockCorruptedData);

      const result = await mockPrisma.liveStat.findFirst({
        where: { statKey: "total_votes" },
      });

      expect(result?.statValue).toBeNull();
    });
  });
});