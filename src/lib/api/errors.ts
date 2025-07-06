import { TRPCError } from "@trpc/server";

export class VotingError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = "VotingError";
  }
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public readonly retryAfter?: number
  ) {
    super(message);
    this.name = "RateLimitError";
  }
}

export class DuplicateVoteError extends Error {
  constructor(message: string = "You have already voted on this question") {
    super(message);
    this.name = "DuplicateVoteError";
  }
}

export class QuestionNotFoundError extends Error {
  constructor(questionId: string) {
    super(`Question with ID ${questionId} not found or is not active`);
    this.name = "QuestionNotFoundError";
  }
}

export class InvalidVoterTokenError extends Error {
  constructor(message: string = "Invalid or expired voter token") {
    super(message);
    this.name = "InvalidVoterTokenError";
  }
}

// Helper functions to convert custom errors to tRPC errors
export function handleVotingError(error: unknown): never {
  if (error instanceof DuplicateVoteError) {
    throw new TRPCError({
      code: "CONFLICT",
      message: error.message,
      cause: error,
    });
  }

  if (error instanceof QuestionNotFoundError) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: error.message,
      cause: error,
    });
  }

  if (error instanceof RateLimitError) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: error.message,
      cause: error,
    });
  }

  if (error instanceof InvalidVoterTokenError) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: error.message,
      cause: error,
    });
  }

  if (error instanceof VotingError) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: error.message,
      cause: error,
    });
  }

  // Generic database or unknown errors
  if (error instanceof Error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
      cause: error,
    });
  }

  // Fallback for non-Error objects
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "An unknown error occurred",
  });
}

// Utility function to safely execute database operations with error handling
export async function safeExecute<T>(operation: () => Promise<T>, context?: string): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(`Error in ${context || "operation"}:`, error);
    handleVotingError(error);
  }
}
