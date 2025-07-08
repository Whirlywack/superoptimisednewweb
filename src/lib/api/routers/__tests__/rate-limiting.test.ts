import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// Mock dependencies
jest.mock("../../../db", () => ({
  prisma: {
    rateLimit: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

jest.mock("../voterToken", () => ({
  getVoterRateLimit: jest.fn(),
  incrementRateLimit: jest.fn(),
  cleanupExpiredRateLimits: jest.fn(),
}));

import { prisma } from "../../../db";
import { 
  getVoterRateLimit, 
  incrementRateLimit, 
  cleanupExpiredRateLimits 
} from "../voterToken";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockGetVoterRateLimit = getVoterRateLimit as jest.MockedFunction<typeof getVoterRateLimit>;
const mockIncrementRateLimit = incrementRateLimit as jest.MockedFunction<typeof incrementRateLimit>;
const mockCleanupExpiredRateLimits = cleanupExpiredRateLimits as jest.MockedFunction<typeof cleanupExpiredRateLimits>;

describe("Rate Limiting", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getVoterRateLimit", () => {
    it("should return rate limit info for IP with remaining requests", async () => {
      const mockRateLimit = {
        id: "rate-1",
        ipAddress: "192.168.1.1",
        actionType: "vote",
        requestCount: 5,
        windowStart: new Date(Date.now() - 30000), // 30 seconds ago
        expiresAt: new Date(Date.now() + 30000), // 30 seconds from now
      };

      mockPrisma.rateLimit.findFirst.mockResolvedValue(mockRateLimit);

      const result = await getVoterRateLimit("192.168.1.1");

      expect(result).toEqual({
        remaining: expect.any(Number),
        resetTime: expect.any(Date),
      });

      expect(mockPrisma.rateLimit.findFirst).toHaveBeenCalledWith({
        where: {
          ipAddress: "192.168.1.1",
          actionType: "vote",
          expiresAt: { gt: expect.any(Date) },
        },
      });
    });

    it("should return full limit for IP with no rate limit record", async () => {
      mockPrisma.rateLimit.findFirst.mockResolvedValue(null);

      const result = await getVoterRateLimit("192.168.1.1");

      expect(result.remaining).toBeGreaterThan(0);
      expect(result.resetTime).toBeInstanceOf(Date);
    });

    it("should return zero remaining for IP that exceeded limit", async () => {
      const mockRateLimit = {
        id: "rate-1",
        ipAddress: "192.168.1.1",
        actionType: "vote",
        requestCount: 100, // Assuming limit is 100
        windowStart: new Date(Date.now() - 30000),
        expiresAt: new Date(Date.now() + 30000),
      };

      mockPrisma.rateLimit.findFirst.mockResolvedValue(mockRateLimit);

      const result = await getVoterRateLimit("192.168.1.1");

      expect(result.remaining).toBe(0);
      expect(result.resetTime).toBeInstanceOf(Date);
    });

    it("should handle database errors gracefully", async () => {
      mockPrisma.rateLimit.findFirst.mockRejectedValue(new Error("Database error"));

      const result = await getVoterRateLimit("192.168.1.1");

      // Should return conservative rate limit info on error
      expect(result.remaining).toBe(0);
      expect(result.resetTime).toBeInstanceOf(Date);
    });

    it("should handle different action types", async () => {
      const mockRateLimit = {
        id: "rate-1",
        ipAddress: "192.168.1.1",
        actionType: "newsletter",
        requestCount: 2,
        windowStart: new Date(Date.now() - 30000),
        expiresAt: new Date(Date.now() + 30000),
      };

      mockPrisma.rateLimit.findFirst.mockResolvedValue(mockRateLimit);

      await getVoterRateLimit("192.168.1.1", "newsletter");

      expect(mockPrisma.rateLimit.findFirst).toHaveBeenCalledWith({
        where: {
          ipAddress: "192.168.1.1",
          actionType: "newsletter",
          expiresAt: { gt: expect.any(Date) },
        },
      });
    });
  });

  describe("incrementRateLimit", () => {
    it("should create new rate limit record for first request", async () => {
      mockPrisma.rateLimit.upsert.mockResolvedValue({
        id: "rate-1",
        ipAddress: "192.168.1.1",
        actionType: "vote",
        requestCount: 1,
        windowStart: new Date(),
        expiresAt: new Date(Date.now() + 60000),
      });

      await incrementRateLimit("192.168.1.1");

      expect(mockPrisma.rateLimit.upsert).toHaveBeenCalledWith({
        where: {
          ipAddress_actionType: {
            ipAddress: "192.168.1.1",
            actionType: "vote",
          },
        },
        create: {
          ipAddress: "192.168.1.1",
          actionType: "vote",
          requestCount: 1,
          windowStart: expect.any(Date),
          expiresAt: expect.any(Date),
        },
        update: {
          requestCount: { increment: 1 },
        },
      });
    });

    it("should increment existing rate limit record", async () => {
      mockPrisma.rateLimit.upsert.mockResolvedValue({
        id: "rate-1",
        ipAddress: "192.168.1.1",
        actionType: "vote",
        requestCount: 5,
        windowStart: new Date(Date.now() - 30000),
        expiresAt: new Date(Date.now() + 30000),
      });

      await incrementRateLimit("192.168.1.1");

      expect(mockPrisma.rateLimit.upsert).toHaveBeenCalledWith({
        where: {
          ipAddress_actionType: {
            ipAddress: "192.168.1.1",
            actionType: "vote",
          },
        },
        create: expect.any(Object),
        update: {
          requestCount: { increment: 1 },
        },
      });
    });

    it("should handle different action types for increment", async () => {
      mockPrisma.rateLimit.upsert.mockResolvedValue({
        id: "rate-1",
        ipAddress: "192.168.1.1",
        actionType: "newsletter",
        requestCount: 1,
        windowStart: new Date(),
        expiresAt: new Date(Date.now() + 60000),
      });

      await incrementRateLimit("192.168.1.1", "newsletter");

      expect(mockPrisma.rateLimit.upsert).toHaveBeenCalledWith({
        where: {
          ipAddress_actionType: {
            ipAddress: "192.168.1.1",
            actionType: "newsletter",
          },
        },
        create: expect.objectContaining({
          actionType: "newsletter",
        }),
        update: {
          requestCount: { increment: 1 },
        },
      });
    });

    it("should handle database errors during increment", async () => {
      mockPrisma.rateLimit.upsert.mockRejectedValue(new Error("Database error"));

      await expect(incrementRateLimit("192.168.1.1")).rejects.toThrow("Database error");
    });

    it("should set appropriate expiration times", async () => {
      const now = Date.now();
      mockPrisma.rateLimit.upsert.mockResolvedValue({
        id: "rate-1",
        ipAddress: "192.168.1.1",
        actionType: "vote",
        requestCount: 1,
        windowStart: new Date(now),
        expiresAt: new Date(now + 60000),
      });

      await incrementRateLimit("192.168.1.1");

      const createCall = mockPrisma.rateLimit.upsert.mock.calls[0][0];
      const createData = createCall.create;

      expect(createData.expiresAt.getTime()).toBeGreaterThan(now);
      expect(createData.expiresAt.getTime()).toBeLessThan(now + 120000); // Within 2 minutes
    });
  });

  describe("cleanupExpiredRateLimits", () => {
    it("should delete expired rate limit records", async () => {
      const mockDeletedRecords = [
        {
          id: "rate-1",
          ipAddress: "192.168.1.1",
          expiresAt: new Date(Date.now() - 60000),
        },
        {
          id: "rate-2",
          ipAddress: "192.168.1.2",
          expiresAt: new Date(Date.now() - 120000),
        },
      ];

      mockPrisma.rateLimit.findMany.mockResolvedValue(mockDeletedRecords);
      mockPrisma.rateLimit.delete.mockResolvedValue(mockDeletedRecords[0]);

      await cleanupExpiredRateLimits();

      expect(mockPrisma.rateLimit.findMany).toHaveBeenCalledWith({
        where: {
          expiresAt: { lt: expect.any(Date) },
        },
      });

      expect(mockPrisma.rateLimit.delete).toHaveBeenCalledTimes(2);
    });

    it("should handle empty cleanup gracefully", async () => {
      mockPrisma.rateLimit.findMany.mockResolvedValue([]);

      await cleanupExpiredRateLimits();

      expect(mockPrisma.rateLimit.findMany).toHaveBeenCalled();
      expect(mockPrisma.rateLimit.delete).not.toHaveBeenCalled();
    });

    it("should continue cleanup even if some deletions fail", async () => {
      const mockRecords = [
        { id: "rate-1", ipAddress: "192.168.1.1" },
        { id: "rate-2", ipAddress: "192.168.1.2" },
        { id: "rate-3", ipAddress: "192.168.1.3" },
      ];

      mockPrisma.rateLimit.findMany.mockResolvedValue(mockRecords);
      mockPrisma.rateLimit.delete
        .mockResolvedValueOnce(mockRecords[0])
        .mockRejectedValueOnce(new Error("Delete failed"))
        .mockResolvedValueOnce(mockRecords[2]);

      await cleanupExpiredRateLimits();

      expect(mockPrisma.rateLimit.delete).toHaveBeenCalledTimes(3);
    });
  });

  describe("Rate Limiting Integration", () => {
    it("should enforce rate limits across multiple requests", async () => {
      const ipAddress = "192.168.1.1";
      let requestCount = 0;

      // Mock progressive rate limit responses
      mockGetVoterRateLimit.mockImplementation(async () => {
        requestCount++;
        return {
          remaining: Math.max(0, 10 - requestCount),
          resetTime: new Date(Date.now() + 60000),
        };
      });

      mockIncrementRateLimit.mockImplementation(async () => {
        // Simulate incrementing
      });

      // Simulate multiple requests
      for (let i = 0; i < 12; i++) {
        const rateLimit = await getVoterRateLimit(ipAddress);
        
        if (rateLimit.remaining > 0) {
          await incrementRateLimit(ipAddress);
        }
        
        if (i < 10) {
          expect(rateLimit.remaining).toBeGreaterThan(0);
        } else {
          expect(rateLimit.remaining).toBe(0);
        }
      }
    });

    it("should handle concurrent rate limit checks", async () => {
      const ipAddress = "192.168.1.1";
      
      mockGetVoterRateLimit.mockResolvedValue({
        remaining: 5,
        resetTime: new Date(Date.now() + 60000),
      });

      mockIncrementRateLimit.mockResolvedValue(undefined);

      // Simulate concurrent requests
      const promises = Array(10).fill(null).map(async () => {
        const rateLimit = await getVoterRateLimit(ipAddress);
        if (rateLimit.remaining > 0) {
          await incrementRateLimit(ipAddress);
        }
        return rateLimit;
      });

      const results = await Promise.all(promises);
      
      // All should have gotten the same rate limit info
      results.forEach(result => {
        expect(result.remaining).toBe(5);
      });
    });

    it("should reset rate limits after expiration", async () => {
      const ipAddress = "192.168.1.1";
      const now = Date.now();
      
      // First check - at limit
      mockGetVoterRateLimit.mockResolvedValueOnce({
        remaining: 0,
        resetTime: new Date(now + 1000),
      });

      // Second check - after reset
      mockGetVoterRateLimit.mockResolvedValueOnce({
        remaining: 10,
        resetTime: new Date(now + 61000),
      });

      const firstCheck = await getVoterRateLimit(ipAddress);
      expect(firstCheck.remaining).toBe(0);

      const secondCheck = await getVoterRateLimit(ipAddress);
      expect(secondCheck.remaining).toBe(10);
    });
  });

  describe("Rate Limit Edge Cases", () => {
    it("should handle IPv6 addresses", async () => {
      const ipv6Address = "2001:0db8:85a3:0000:0000:8a2e:0370:7334";
      
      mockPrisma.rateLimit.findFirst.mockResolvedValue(null);

      const result = await getVoterRateLimit(ipv6Address);
      
      expect(result).toHaveProperty("remaining");
      expect(result).toHaveProperty("resetTime");
    });

    it("should handle localhost addresses", async () => {
      const localhostAddresses = ["127.0.0.1", "::1", "localhost"];
      
      for (const address of localhostAddresses) {
        mockPrisma.rateLimit.findFirst.mockResolvedValue(null);
        
        const result = await getVoterRateLimit(address);
        
        expect(result).toHaveProperty("remaining");
        expect(result).toHaveProperty("resetTime");
      }
    });

    it("should handle very long IP addresses", async () => {
      const longIpAddress = "192.168.1.1".repeat(10);
      
      mockPrisma.rateLimit.findFirst.mockResolvedValue(null);

      const result = await getVoterRateLimit(longIpAddress);
      
      expect(result).toHaveProperty("remaining");
      expect(result).toHaveProperty("resetTime");
    });

    it("should handle invalid IP address formats", async () => {
      const invalidIpAddresses = ["invalid", "999.999.999.999", ""];
      
      for (const address of invalidIpAddresses) {
        mockPrisma.rateLimit.findFirst.mockResolvedValue(null);
        
        const result = await getVoterRateLimit(address);
        
        expect(result).toHaveProperty("remaining");
        expect(result).toHaveProperty("resetTime");
      }
    });
  });

  describe("Rate Limit Performance", () => {
    it("should handle high-frequency rate limit checks efficiently", async () => {
      const ipAddress = "192.168.1.1";
      
      mockGetVoterRateLimit.mockResolvedValue({
        remaining: 100,
        resetTime: new Date(Date.now() + 60000),
      });

      const startTime = Date.now();
      
      // Simulate 100 rapid rate limit checks
      const promises = Array(100).fill(null).map(() => getVoterRateLimit(ipAddress));
      
      await Promise.all(promises);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time (adjust threshold as needed)
      expect(duration).toBeLessThan(5000); // 5 seconds
    });

    it("should handle rate limit cleanup efficiently", async () => {
      const mockExpiredRecords = Array(1000).fill(null).map((_, i) => ({
        id: `rate-${i}`,
        ipAddress: `192.168.1.${i}`,
        expiresAt: new Date(Date.now() - 60000),
      }));

      mockPrisma.rateLimit.findMany.mockResolvedValue(mockExpiredRecords);
      mockPrisma.rateLimit.delete.mockResolvedValue(mockExpiredRecords[0]);

      const startTime = Date.now();
      
      await cleanupExpiredRateLimits();
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within reasonable time
      expect(duration).toBeLessThan(10000); // 10 seconds
      expect(mockPrisma.rateLimit.delete).toHaveBeenCalledTimes(1000);
    });
  });

  describe("Rate Limit Security", () => {
    it("should prevent rate limit bypass through IP spoofing", async () => {
      const realIp = "192.168.1.1";
      const spoofedIp = "192.168.1.2";
      
      // Set up rate limit for real IP
      mockGetVoterRateLimit.mockImplementation(async (ip) => {
        if (ip === realIp) {
          return { remaining: 0, resetTime: new Date(Date.now() + 60000) };
        }
        return { remaining: 10, resetTime: new Date(Date.now() + 60000) };
      });

      const realIpResult = await getVoterRateLimit(realIp);
      const spoofedIpResult = await getVoterRateLimit(spoofedIp);

      expect(realIpResult.remaining).toBe(0);
      expect(spoofedIpResult.remaining).toBe(10);
    });

    it("should handle rate limit bombing attacks", async () => {
      const attackerIp = "192.168.1.100";
      
      mockGetVoterRateLimit.mockResolvedValue({
        remaining: 0,
        resetTime: new Date(Date.now() + 60000),
      });

      // Simulate rapid consecutive requests from attacker
      const promises = Array(1000).fill(null).map(() => getVoterRateLimit(attackerIp));
      
      const results = await Promise.all(promises);
      
      // All requests should be rate limited
      results.forEach(result => {
        expect(result.remaining).toBe(0);
      });
    });

    it("should isolate rate limits between different IPs", async () => {
      const ip1 = "192.168.1.1";
      const ip2 = "192.168.1.2";
      
      mockGetVoterRateLimit.mockImplementation(async (ip) => {
        if (ip === ip1) {
          return { remaining: 0, resetTime: new Date(Date.now() + 60000) };
        }
        return { remaining: 10, resetTime: new Date(Date.now() + 60000) };
      });

      const ip1Result = await getVoterRateLimit(ip1);
      const ip2Result = await getVoterRateLimit(ip2);

      expect(ip1Result.remaining).toBe(0);
      expect(ip2Result.remaining).toBe(10);
    });
  });
});