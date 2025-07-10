import { analyticsRouter } from "../analyticsRouter";
import { prisma } from "../../../db";

// Mock the database
jest.mock("../../../db", () => ({
  prisma: {
    questionResponse: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    engagementStats: {
      findMany: jest.fn(),
    },
    xpLedger: {
      findMany: jest.fn(),
    },
    question: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    questionnaireResponse: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      count: jest.fn(),
    },
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("analyticsRouter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getVotingAnalytics", () => {
    it("should return real voting analytics data", async () => {
      const mockVotes = [
        {
          id: "vote1",
          createdAt: new Date("2025-07-10T10:00:00Z"),
          voterTokenId: "voter1",
          userId: null,
          question: { questionType: "binary" },
        },
        {
          id: "vote2",
          createdAt: new Date("2025-07-10T11:00:00Z"),
          voterTokenId: "voter2",
          userId: null,
          question: { questionType: "multi-choice" },
        },
      ];

      mockPrisma.questionResponse.findMany.mockResolvedValue(mockVotes as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const caller = analyticsRouter.createCaller({ db: mockPrisma });
      const result = await caller.getVotingAnalytics({ timeRange: "7d" });

      expect(result.summary.totalVotes).toBe(2);
      expect(result.summary.uniqueVoters).toBe(2);
      expect(result.questionTypeBreakdown.binary).toBe(1);
      expect(result.questionTypeBreakdown.multiChoice).toBe(1);
      expect(mockPrisma.questionResponse.findMany).toHaveBeenCalledWith({
        where: { createdAt: { gte: expect.any(Date) } },
        include: { question: true },
        orderBy: { createdAt: "asc" },
      });
    });

    it("should handle empty data gracefully", async () => {
      mockPrisma.questionResponse.findMany.mockResolvedValue([]);

      const caller = analyticsRouter.createCaller({ db: mockPrisma });
      const result = await caller.getVotingAnalytics({ timeRange: "24h" });

      expect(result.summary.totalVotes).toBe(0);
      expect(result.summary.uniqueVoters).toBe(0);
      expect(result.chartData.labels).toEqual(expect.any(Array));
      expect(result.chartData.datasets).toHaveLength(2);
    });
  });

  describe("getCommunityEngagement", () => {
    it("should return real community engagement metrics", async () => {
      const mockEngagementStats = [
        { currentStreak: 5, longestStreak: 10, totalXp: 100 },
        { currentStreak: 3, longestStreak: 8, totalXp: 80 },
      ];

      const mockXpLedger = [
        { createdAt: new Date("2025-07-10T10:00:00Z"), xpAmount: 10 },
        { createdAt: new Date("2025-07-09T10:00:00Z"), xpAmount: 15 },
      ];

      mockPrisma.engagementStats.findMany.mockResolvedValue(mockEngagementStats as any); // eslint-disable-line @typescript-eslint/no-explicit-any
      mockPrisma.xpLedger.findMany.mockResolvedValue(mockXpLedger as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const caller = analyticsRouter.createCaller({ db: mockPrisma });
      const result = await caller.getCommunityEngagement();

      expect(result.metrics.totalActiveUsers).toBe(2);
      expect(result.metrics.avgCurrentStreak).toBe(4);
      expect(result.metrics.longestStreak).toBe(10);
      expect(result.metrics.totalXpAwarded).toBe(180);
      expect(result.xpTrendData.labels).toHaveLength(7);
    });
  });

  describe("exportVotingData", () => {
    it("should export voting data in CSV format", async () => {
      const mockVotes = [
        {
          id: "vote1",
          createdAt: new Date("2025-07-10T10:00:00Z"),
          voterTokenId: "voter1",
          userId: null,
          ipAddress: "127.0.0.1",
          responseData: { response: "yes" },
          question: {
            id: "q1",
            title: "Test Question",
            questionType: "binary",
            category: "test",
          },
          voterToken: null,
          user: null,
        },
      ];

      mockPrisma.questionResponse.findMany.mockResolvedValue(mockVotes as any); // eslint-disable-line @typescript-eslint/no-explicit-any

      const caller = analyticsRouter.createCaller({ db: mockPrisma });
      const result = await caller.exportVotingData({
        format: "csv",
        timeRange: "7d",
        includeResponses: true,
        includeVoterInfo: false,
      });

      expect(result.format).toBe("csv");
      expect(result.recordCount).toBe(1);
      expect(result.content).toContain("voteId,questionId");
      expect(result.content).toContain("vote1,q1");
      expect(result.filename).toMatch(/voting-data-7d-\d{4}-\d{2}-\d{2}\.csv/);
    });

    it("should export empty CSV when no data", async () => {
      mockPrisma.questionResponse.findMany.mockResolvedValue([]);

      const caller = analyticsRouter.createCaller({ db: mockPrisma });
      const result = await caller.exportVotingData({
        format: "csv",
        timeRange: "7d",
        includeResponses: true,
        includeVoterInfo: false,
      });

      expect(result.format).toBe("csv");
      expect(result.recordCount).toBe(0);
      expect(result.content).toBe("No data available for the selected time range");
    });
  });

  describe("error handling", () => {
    it("should handle database errors gracefully", async () => {
      mockPrisma.questionResponse.findMany.mockRejectedValue(new Error("Database error"));

      const caller = analyticsRouter.createCaller({ db: mockPrisma });
      const result = await caller.getVotingAnalytics({ timeRange: "7d" });

      expect(result.summary.totalVotes).toBe(0);
      expect(result.summary.uniqueVoters).toBe(0);
      expect(result.chartData.labels).toEqual([]);
    });
  });
});
