import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { TRPCError } from "@trpc/server";
import {
  VotingError,
  RateLimitError,
  DuplicateVoteError,
  QuestionNotFoundError,
  InvalidVoterTokenError,
  handleVotingError,
  safeExecute,
} from "../errors";

describe("Error Handling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Custom Error Classes", () => {
    it("should create VotingError with correct properties", () => {
      const error = new VotingError("Test message", "TEST_CODE");
      
      expect(error.name).toBe("VotingError");
      expect(error.message).toBe("Test message");
      expect(error.code).toBe("TEST_CODE");
      expect(error instanceof Error).toBe(true);
    });

    it("should create RateLimitError with correct properties", () => {
      const error = new RateLimitError("Rate limit exceeded", 60);
      
      expect(error.name).toBe("RateLimitError");
      expect(error.message).toBe("Rate limit exceeded");
      expect(error.retryAfter).toBe(60);
      expect(error instanceof Error).toBe(true);
    });

    it("should create DuplicateVoteError with default message", () => {
      const error = new DuplicateVoteError();
      
      expect(error.name).toBe("DuplicateVoteError");
      expect(error.message).toBe("You have already voted on this question");
      expect(error instanceof Error).toBe(true);
    });

    it("should create DuplicateVoteError with custom message", () => {
      const error = new DuplicateVoteError("Custom duplicate message");
      
      expect(error.name).toBe("DuplicateVoteError");
      expect(error.message).toBe("Custom duplicate message");
    });

    it("should create QuestionNotFoundError with formatted message", () => {
      const error = new QuestionNotFoundError("question-123");
      
      expect(error.name).toBe("QuestionNotFoundError");
      expect(error.message).toBe("Question with ID question-123 not found or is not active");
      expect(error instanceof Error).toBe(true);
    });

    it("should create InvalidVoterTokenError with default message", () => {
      const error = new InvalidVoterTokenError();
      
      expect(error.name).toBe("InvalidVoterTokenError");
      expect(error.message).toBe("Invalid or expired voter token");
      expect(error instanceof Error).toBe(true);
    });

    it("should create InvalidVoterTokenError with custom message", () => {
      const error = new InvalidVoterTokenError("Token has expired");
      
      expect(error.name).toBe("InvalidVoterTokenError");
      expect(error.message).toBe("Token has expired");
    });
  });

  describe("handleVotingError", () => {
    it("should convert DuplicateVoteError to CONFLICT tRPC error", () => {
      const originalError = new DuplicateVoteError("Already voted");
      
      expect(() => handleVotingError(originalError)).toThrow(TRPCError);
      
      try {
        handleVotingError(originalError);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("CONFLICT");
        expect((error as TRPCError).message).toBe("Already voted");
        expect((error as TRPCError).cause).toBe(originalError);
      }
    });

    it("should convert QuestionNotFoundError to NOT_FOUND tRPC error", () => {
      const originalError = new QuestionNotFoundError("question-123");
      
      expect(() => handleVotingError(originalError)).toThrow(TRPCError);
      
      try {
        handleVotingError(originalError);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("NOT_FOUND");
        expect((error as TRPCError).message).toBe("Question with ID question-123 not found or is not active");
        expect((error as TRPCError).cause).toBe(originalError);
      }
    });

    it("should convert RateLimitError to TOO_MANY_REQUESTS tRPC error", () => {
      const originalError = new RateLimitError("Rate limit exceeded", 60);
      
      expect(() => handleVotingError(originalError)).toThrow(TRPCError);
      
      try {
        handleVotingError(originalError);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("TOO_MANY_REQUESTS");
        expect((error as TRPCError).message).toBe("Rate limit exceeded");
        expect((error as TRPCError).cause).toBe(originalError);
      }
    });

    it("should convert InvalidVoterTokenError to UNAUTHORIZED tRPC error", () => {
      const originalError = new InvalidVoterTokenError("Token expired");
      
      expect(() => handleVotingError(originalError)).toThrow(TRPCError);
      
      try {
        handleVotingError(originalError);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("UNAUTHORIZED");
        expect((error as TRPCError).message).toBe("Token expired");
        expect((error as TRPCError).cause).toBe(originalError);
      }
    });

    it("should convert VotingError to BAD_REQUEST tRPC error", () => {
      const originalError = new VotingError("Invalid vote data", "INVALID_DATA");
      
      expect(() => handleVotingError(originalError)).toThrow(TRPCError);
      
      try {
        handleVotingError(originalError);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("BAD_REQUEST");
        expect((error as TRPCError).message).toBe("Invalid vote data");
        expect((error as TRPCError).cause).toBe(originalError);
      }
    });

    it("should convert generic Error to INTERNAL_SERVER_ERROR tRPC error", () => {
      const originalError = new Error("Database connection failed");
      
      expect(() => handleVotingError(originalError)).toThrow(TRPCError);
      
      try {
        handleVotingError(originalError);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("INTERNAL_SERVER_ERROR");
        expect((error as TRPCError).message).toBe("An unexpected error occurred");
        expect((error as TRPCError).cause).toBe(originalError);
      }
    });

    it("should handle non-Error objects", () => {
      const originalError = "String error";
      
      expect(() => handleVotingError(originalError)).toThrow(TRPCError);
      
      try {
        handleVotingError(originalError);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("INTERNAL_SERVER_ERROR");
        expect((error as TRPCError).message).toBe("An unknown error occurred");
        expect((error as TRPCError).cause).toBeUndefined();
      }
    });

    it("should handle null/undefined errors", () => {
      expect(() => handleVotingError(null)).toThrow(TRPCError);
      expect(() => handleVotingError(undefined)).toThrow(TRPCError);
      
      try {
        handleVotingError(null);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("INTERNAL_SERVER_ERROR");
        expect((error as TRPCError).message).toBe("An unknown error occurred");
      }
    });
  });

  describe("safeExecute", () => {
    it("should execute operation successfully and return result", async () => {
      const mockOperation = jest.fn().mockResolvedValue("success result");
      
      const result = await safeExecute(mockOperation, "test operation");
      
      expect(result).toBe("success result");
      expect(mockOperation).toHaveBeenCalledTimes(1);
    });

    it("should handle and convert errors using handleVotingError", async () => {
      const mockOperation = jest.fn().mockRejectedValue(new DuplicateVoteError());
      
      await expect(safeExecute(mockOperation, "test operation")).rejects.toThrow(TRPCError);
      
      try {
        await safeExecute(mockOperation, "test operation");
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("CONFLICT");
      }
    });

    it("should log errors with context", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      const mockOperation = jest.fn().mockRejectedValue(new Error("Database error"));
      
      try {
        await safeExecute(mockOperation, "test operation");
      } catch (error) {
        // Error should be thrown
      }
      
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error in test operation:",
        expect.objectContaining({
          name: "Error",
          message: "Database error",
        })
      );
      
      consoleSpy.mockRestore();
    });

    it("should log errors without context when context is not provided", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      const mockOperation = jest.fn().mockRejectedValue(new Error("Database error"));
      
      try {
        await safeExecute(mockOperation);
      } catch (error) {
        // Error should be thrown
      }
      
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error in operation:",
        expect.objectContaining({
          name: "Error",
          message: "Database error",
        })
      );
      
      consoleSpy.mockRestore();
    });

    it("should sanitize error logs to remove sensitive information", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      const sensitiveError = new Error("Password: secret123");
      sensitiveError.stack = "Stack trace with sensitive info";
      
      const mockOperation = jest.fn().mockRejectedValue(sensitiveError);
      
      try {
        await safeExecute(mockOperation, "test operation");
      } catch (error) {
        // Error should be thrown
      }
      
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error in test operation:",
        expect.objectContaining({
          name: "Error",
          message: "Password: secret123",
          // Should not include stack trace or other sensitive props
        })
      );
      
      // Verify stack trace is not logged
      const loggedError = consoleSpy.mock.calls[0][1];
      expect(loggedError).not.toHaveProperty("stack");
      
      consoleSpy.mockRestore();
    });

    it("should handle async operations that throw synchronously", async () => {
      const mockOperation = jest.fn().mockImplementation(() => {
        throw new QuestionNotFoundError("question-123");
      });
      
      await expect(safeExecute(mockOperation, "test operation")).rejects.toThrow(TRPCError);
      
      try {
        await safeExecute(mockOperation, "test operation");
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe("NOT_FOUND");
      }
    });

    it("should handle non-Error objects in sanitizeErrorForLog", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      const mockOperation = jest.fn().mockRejectedValue("String error");
      
      try {
        await safeExecute(mockOperation, "test operation");
      } catch (error) {
        // Error should be thrown
      }
      
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error in test operation:",
        "Unknown error occurred"
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe("Error Consistency", () => {
    it("should maintain error inheritance chain", () => {
      const errors = [
        new VotingError("test", "CODE"),
        new RateLimitError("test", 60),
        new DuplicateVoteError("test"),
        new QuestionNotFoundError("test"),
        new InvalidVoterTokenError("test"),
      ];
      
      errors.forEach(error => {
        expect(error instanceof Error).toBe(true);
        expect(error.name).toBeDefined();
        expect(error.message).toBeDefined();
      });
    });

    it("should ensure all custom errors are handled by handleVotingError", () => {
      const errors = [
        new VotingError("test", "CODE"),
        new RateLimitError("test", 60),
        new DuplicateVoteError("test"),
        new QuestionNotFoundError("test"),
        new InvalidVoterTokenError("test"),
      ];
      
      errors.forEach(error => {
        expect(() => handleVotingError(error)).toThrow(TRPCError);
      });
    });
  });

  describe("Error Context and Debugging", () => {
    it("should preserve original error causes in tRPC errors", () => {
      const originalError = new DuplicateVoteError("Already voted");
      
      try {
        handleVotingError(originalError);
      } catch (error) {
        const trpcError = error as TRPCError;
        expect(trpcError.cause).toBe(originalError);
        expect(trpcError.cause?.name).toBe("DuplicateVoteError");
        expect(trpcError.cause?.message).toBe("Already voted");
      }
    });

    it("should handle errors with additional properties", () => {
      const error = new RateLimitError("Rate limit exceeded", 120);
      error.retryAfter = 120;
      
      try {
        handleVotingError(error);
      } catch (trpcError) {
        expect((trpcError as TRPCError).cause).toBe(error);
        expect((error as RateLimitError).retryAfter).toBe(120);
      }
    });

    it("should handle circular reference errors safely", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      
      const circularError: any = new Error("Circular reference");
      circularError.self = circularError;
      
      const mockOperation = jest.fn().mockRejectedValue(circularError);
      
      try {
        await safeExecute(mockOperation, "test operation");
      } catch (error) {
        // Should not throw during logging
      }
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("Production Error Handling", () => {
    it("should not leak sensitive information in production errors", () => {
      const sensitiveError = new Error("Database password: secret123");
      
      try {
        handleVotingError(sensitiveError);
      } catch (error) {
        const trpcError = error as TRPCError;
        expect(trpcError.message).toBe("An unexpected error occurred");
        expect(trpcError.message).not.toContain("secret123");
      }
    });

    it("should provide user-friendly error messages", () => {
      const userErrors = [
        new DuplicateVoteError(),
        new QuestionNotFoundError("question-123"),
        new RateLimitError("Too many requests", 60),
        new InvalidVoterTokenError(),
      ];
      
      userErrors.forEach(error => {
        try {
          handleVotingError(error);
        } catch (trpcError) {
          const message = (trpcError as TRPCError).message;
          expect(message).toBeDefined();
          expect(message.length).toBeGreaterThan(0);
          expect(message).not.toContain("undefined");
          expect(message).not.toContain("null");
        }
      });
    });
  });
});