import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock the database
jest.mock("../../../db", () => ({
  prisma: {
    questionResponse: {
      findFirst: jest.fn(),
    },
  },
}));

// Import the actual functions we want to test
import { prisma } from "../../../db";
import { hasVoterVoted } from "../../voterToken";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("Vote Duplicate Prevention - Direct hasVoterVoted Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("hasVoterVoted function", () => {
    it("should return true when voter has already voted on question", async () => {
      const mockResponse = {
        id: "response-1",
        questionId: "question-1",
        voterTokenId: "voter-1",
        responseData: "Yes",
        ipAddress: "127.0.0.1",
        createdAt: new Date(),
      };
      mockPrisma.questionResponse.findFirst.mockResolvedValue(mockResponse);

      const result = await hasVoterVoted("voter-1", "question-1");

      expect(result).toBe(true);
      expect(mockPrisma.questionResponse.findFirst).toHaveBeenCalledWith({
        where: {
          voterTokenId: "voter-1",
          questionId: "question-1",
        },
      });
    });

    it("should return false when voter has not voted on question", async () => {
      mockPrisma.questionResponse.findFirst.mockResolvedValue(null);

      const result = await hasVoterVoted("voter-1", "question-1");

      expect(result).toBe(false);
      expect(mockPrisma.questionResponse.findFirst).toHaveBeenCalledWith({
        where: {
          voterTokenId: "voter-1",
          questionId: "question-1",
        },
      });
    });

    it("should handle database errors gracefully", async () => {
      const databaseError = new Error("Database connection failed");
      mockPrisma.questionResponse.findFirst.mockRejectedValue(databaseError);

      await expect(hasVoterVoted("voter-1", "question-1")).rejects.toThrow(
        "Database connection failed"
      );
    });

    it("should handle empty parameters", async () => {
      mockPrisma.questionResponse.findFirst.mockResolvedValue(null);

      // Should still make the query even with empty strings
      const result = await hasVoterVoted("", "question-1");
      expect(result).toBe(false);
      expect(mockPrisma.questionResponse.findFirst).toHaveBeenCalledWith({
        where: {
          voterTokenId: "",
          questionId: "question-1",
        },
      });
    });

    it("should work with different voter token and question ID combinations", async () => {
      const testCases = [
        { voterTokenId: "voter-1", questionId: "binary-question-1" },
        { voterTokenId: "voter-2", questionId: "rating-question-1" },
        { voterTokenId: "voter-3", questionId: "text-question-1" },
        { voterTokenId: "voter-4", questionId: "ranking-question-1" },
      ];

      for (const testCase of testCases) {
        mockPrisma.questionResponse.findFirst.mockResolvedValue(null);

        const result = await hasVoterVoted(testCase.voterTokenId, testCase.questionId);
        expect(result).toBe(false);

        expect(mockPrisma.questionResponse.findFirst).toHaveBeenCalledWith({
          where: {
            voterTokenId: testCase.voterTokenId,
            questionId: testCase.questionId,
          },
        });
      }
    });

    it("should efficiently use database queries", async () => {
      mockPrisma.questionResponse.findFirst.mockResolvedValue(null);

      const startTime = Date.now();
      await hasVoterVoted("voter-1", "question-1");
      const endTime = Date.now();

      // Should complete very quickly
      expect(endTime - startTime).toBeLessThan(100);

      // Should only make one database query
      expect(mockPrisma.questionResponse.findFirst).toHaveBeenCalledTimes(1);
    });

    it("should handle concurrent duplicate checks", async () => {
      mockPrisma.questionResponse.findFirst.mockResolvedValue(null);

      // Run multiple duplicate checks concurrently
      const promises = [
        hasVoterVoted("voter-1", "question-1"),
        hasVoterVoted("voter-2", "question-1"),
        hasVoterVoted("voter-1", "question-2"),
        hasVoterVoted("voter-3", "question-1"),
      ];

      const results = await Promise.all(promises);

      // All should return false (no duplicates)
      results.forEach((result) => expect(result).toBe(false));

      // Should have made separate queries for each check
      expect(mockPrisma.questionResponse.findFirst).toHaveBeenCalledTimes(4);
    });

    it("should handle malformed voter token IDs", async () => {
      const malformedTokens = [
        "", // Empty string
        "   ", // Whitespace only
        "invalid-uuid", // Invalid format
        "null", // String "null"
        "undefined", // String "undefined"
        "12345", // Numeric string
      ];

      for (const token of malformedTokens) {
        mockPrisma.questionResponse.findFirst.mockResolvedValue(null);

        const result = await hasVoterVoted(token, "question-1");
        expect(result).toBe(false);
      }
    });

    it("should return consistent results for same input", async () => {
      mockPrisma.questionResponse.findFirst.mockResolvedValue(null);

      // Call the same function multiple times
      const result1 = await hasVoterVoted("voter-1", "question-1");
      const result2 = await hasVoterVoted("voter-1", "question-1");
      const result3 = await hasVoterVoted("voter-1", "question-1");

      // Should return consistent results
      expect(result1).toBe(false);
      expect(result2).toBe(false);
      expect(result3).toBe(false);
    });
  });

  describe("Duplicate prevention database query patterns", () => {
    it("should use composite key lookup for duplicate detection", async () => {
      mockPrisma.questionResponse.findFirst.mockResolvedValue(null);

      await hasVoterVoted("voter-123", "question-456");

      expect(mockPrisma.questionResponse.findFirst).toHaveBeenCalledWith({
        where: {
          voterTokenId: "voter-123",
          questionId: "question-456",
        },
      });
    });

    it("should handle database timeout gracefully", async () => {
      const timeoutError = new Error("Connection timeout");
      mockPrisma.questionResponse.findFirst.mockRejectedValue(timeoutError);

      await expect(hasVoterVoted("voter-1", "question-1")).rejects.toThrow("Connection timeout");
    });

    it("should handle database connection errors", async () => {
      const connectionError = new Error("ECONNREFUSED");
      mockPrisma.questionResponse.findFirst.mockRejectedValue(connectionError);

      await expect(hasVoterVoted("voter-1", "question-1")).rejects.toThrow("ECONNREFUSED");
    });

    it("should handle null database responses", async () => {
      mockPrisma.questionResponse.findFirst.mockResolvedValue(null);

      const result = await hasVoterVoted("voter-1", "question-1");
      expect(result).toBe(false);
    });

    it("should handle database response with actual vote data", async () => {
      const mockVoteResponse = {
        id: "response-123",
        questionId: "question-1",
        voterTokenId: "voter-1",
        responseData: "Yes",
        ipAddress: "192.168.1.100",
        createdAt: new Date("2024-01-01T10:00:00Z"),
      };
      mockPrisma.questionResponse.findFirst.mockResolvedValue(mockVoteResponse);

      const result = await hasVoterVoted("voter-1", "question-1");
      expect(result).toBe(true);
    });
  });
});
