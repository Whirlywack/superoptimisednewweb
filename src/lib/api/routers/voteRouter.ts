import { createTRPCRouter, votingProcedure, publicProcedure } from "../trpc";
import { submitVoteSchema, getVoteStatsSchema } from "../schemas";
import { safeExecute, DuplicateVoteError, QuestionNotFoundError, RateLimitError } from "../errors";
import { prisma } from "../../db";
import {
  getOrCreateVoterToken,
  hasVoterVoted,
  getVoterRateLimit,
  incrementRateLimit,
} from "../voterToken";

export const voteRouter = createTRPCRouter({
  submitVote: votingProcedure.input(submitVoteSchema).mutation(async ({ input, ctx }) => {
    return safeExecute(async () => {
      const { questionId, response } = input;
      const ipAddress = ctx.ipAddress || "127.0.0.1";

      // Check rate limiting first
      const rateLimit = await getVoterRateLimit(ipAddress);
      if (rateLimit.remaining <= 0) {
        throw new RateLimitError(
          `Rate limit exceeded. You can vote again after ${rateLimit.resetTime.toISOString()}`,
          Math.floor((rateLimit.resetTime.getTime() - Date.now()) / 1000)
        );
      }

      // Verify question exists and is active
      const question = await prisma.question.findFirst({
        where: {
          id: questionId,
          isActive: true,
          OR: [{ scheduledStart: null }, { scheduledStart: { lte: new Date() } }],
          AND: [
            {
              OR: [{ scheduledEnd: null }, { scheduledEnd: { gte: new Date() } }],
            },
          ],
        },
      });

      if (!question) {
        throw new QuestionNotFoundError(questionId);
      }

      // Get or create voter token (this would normally come from cookies)
      const { token, voterTokenRecord } = await getOrCreateVoterToken(ctx.voterToken, ipAddress);

      // Check for duplicate vote
      const hasVoted = await hasVoterVoted(voterTokenRecord.id, questionId);
      if (hasVoted) {
        throw new DuplicateVoteError();
      }

      // Increment rate limit counter
      await incrementRateLimit(ipAddress);

      // Store the vote
      const voteResponse = await prisma.questionResponse.create({
        data: {
          questionId,
          voterTokenId: voterTokenRecord.id,
          response,
          ipAddress,
        },
      });

      // Update live stats
      await prisma.liveStat.upsert({
        where: { statKey: "total_votes" },
        create: { statKey: "total_votes", statValue: 1 },
        update: { statValue: { increment: 1 } },
      });

      // Record XP for the vote
      await prisma.xpLedger.create({
        data: {
          voterTokenId: voterTokenRecord.id,
          action: "vote",
          amount: 5, // Base XP for voting
          metadata: {
            questionId,
            questionType: question.questionType,
          },
        },
      });

      return {
        success: true,
        voteId: voteResponse.id,
        voterToken: token, // Return token so it can be set in cookie
        xpAwarded: 5,
        message: "Vote submitted successfully!",
      };
    }, "submitVote");
  }),

  getVoteStats: publicProcedure.input(getVoteStatsSchema).query(async ({ input }) => {
    return safeExecute(async () => {
      const { questionId } = input;

      const stats = await prisma.questionResponse.groupBy({
        by: ["response"],
        where: { questionId },
        _count: {
          response: true,
        },
      });

      const totalVotes = await prisma.questionResponse.count({
        where: { questionId },
      });

      return {
        questionId,
        totalVotes,
        breakdown: stats.map((stat) => ({
          option: stat.response as string,
          count: stat._count.response,
          percentage: totalVotes > 0 ? Math.round((stat._count.response / totalVotes) * 100) : 0,
        })),
      };
    }, "getVoteStats");
  }),

  getUserVoteHistory: votingProcedure.query(async ({ ctx }) => {
    return safeExecute(async () => {
      if (!ctx.voterTokenRecord) {
        return { votes: [], totalXp: 0 };
      }

      const votes = await prisma.questionResponse.findMany({
        where: { voterTokenId: ctx.voterTokenRecord.id },
        include: {
          question: {
            select: {
              id: true,
              title: true,
              category: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50, // Limit to recent votes
      });

      const totalXp = await prisma.xpLedger.aggregate({
        where: { voterTokenId: ctx.voterTokenRecord.id },
        _sum: { amount: true },
      });

      return {
        votes: votes.map((vote) => ({
          id: vote.id,
          questionId: vote.questionId,
          questionTitle: vote.question.title,
          category: vote.question.category,
          response: vote.response,
          createdAt: vote.createdAt,
        })),
        totalXp: totalXp._sum.amount || 0,
      };
    }, "getUserVoteHistory");
  }),
});
