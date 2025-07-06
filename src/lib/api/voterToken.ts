import type { NextRequest, NextResponse } from "next/server";
import { createHash, randomUUID } from "crypto";
import { prisma } from "../db";

export const VOTER_TOKEN_COOKIE = "voter_token";
export const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

/**
 * Generate SHA-256 hash of a token
 */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Generate a new UUID voter token
 */
export function generateVoterToken(): string {
  return randomUUID();
}

/**
 * Get or create a voter token from request cookies
 */
export function getVoterTokenFromRequest(request: NextRequest): string | null {
  return request.cookies.get(VOTER_TOKEN_COOKIE)?.value || null;
}

/**
 * Set voter token cookie in response
 */
export function setVoterTokenCookie(response: NextResponse, token: string): void {
  response.cookies.set(VOTER_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

/**
 * Get or create voter token database record
 * Returns the unhashed token and the database record
 */
export async function getOrCreateVoterToken(
  existingToken?: string | null,
  ipAddress?: string
): Promise<{
  token: string;
  voterTokenRecord: {
    id: string;
    tokenHash: string;
    createdAt: Date;
    lastActive: Date;
    ipAddress: string | null;
    voteCount: number;
  };
}> {
  let token = existingToken;
  let voterTokenRecord;

  if (token) {
    // Try to find existing token record
    const tokenHash = hashToken(token);
    voterTokenRecord = await prisma.voterToken.findUnique({
      where: { tokenHash },
    });

    if (voterTokenRecord) {
      // Update last active timestamp
      voterTokenRecord = await prisma.voterToken.update({
        where: { tokenHash },
        data: {
          lastActive: new Date(),
          ...(ipAddress && { ipAddress }),
        },
      });

      return { token, voterTokenRecord };
    }
  }

  // Generate new token if none exists or existing token not found
  token = generateVoterToken();
  const tokenHash = hashToken(token);

  voterTokenRecord = await prisma.voterToken.create({
    data: {
      tokenHash,
      ipAddress,
      lastActive: new Date(),
    },
  });

  return { token, voterTokenRecord };
}

/**
 * Check if a voter has already voted on a specific question
 */
export async function hasVoterVoted(voterTokenId: string, questionId: string): Promise<boolean> {
  const existingResponse = await prisma.questionResponse.findFirst({
    where: {
      voterTokenId,
      questionId,
    },
  });

  return !!existingResponse;
}

/**
 * Get voter's rate limit status
 */
export async function getVoterRateLimit(ipAddress: string): Promise<{
  count: number;
  remaining: number;
  resetTime: Date;
}> {
  const rateLimit = await prisma.rateLimit.findUnique({
    where: { ipAddress },
  });

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  if (!rateLimit || rateLimit.windowStart < oneDayAgo) {
    // Create or reset rate limit window
    const newRateLimit = await prisma.rateLimit.upsert({
      where: { ipAddress },
      create: {
        ipAddress,
        requestCount: 0,
        windowStart: now,
      },
      update: {
        requestCount: 0,
        windowStart: now,
      },
    });

    return {
      count: newRateLimit.requestCount,
      remaining: 100 - newRateLimit.requestCount,
      resetTime: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    };
  }

  return {
    count: rateLimit.requestCount,
    remaining: Math.max(0, 100 - rateLimit.requestCount),
    resetTime: new Date(rateLimit.windowStart.getTime() + 24 * 60 * 60 * 1000),
  };
}

/**
 * Increment rate limit counter
 */
export async function incrementRateLimit(ipAddress: string): Promise<void> {
  await prisma.rateLimit.upsert({
    where: { ipAddress },
    create: {
      ipAddress,
      requestCount: 1,
      windowStart: new Date(),
    },
    update: {
      requestCount: {
        increment: 1,
      },
    },
  });
}
