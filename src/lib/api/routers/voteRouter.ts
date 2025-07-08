import { createTRPCRouter, votingProcedure, publicProcedure } from "../trpc";
import {
  submitVoteSchema,
  getVoteStatsSchema,
  getEngagementStatsSchema,
  claimXpSchema,
} from "../schemas";
import { safeExecute, DuplicateVoteError, QuestionNotFoundError, RateLimitError } from "../errors";
import { prisma } from "../../db";
import { randomUUID } from "crypto";
import {
  getOrCreateVoterToken,
  hasVoterVoted,
  getVoterRateLimit,
  incrementRateLimit,
} from "../voterToken";
import { sendXpClaimEmail } from "../../email/sendEmail";
import { onXpClaimed } from "../../progress-automation";

// Note: XP calculation moved to background-jobs.ts

/**
 * Calculate current streak days based on vote dates
 * Returns number of consecutive days with at least one vote
 */
function calculateStreakDays(voteDates: Date[]): number {
  if (voteDates.length === 0) return 0;

  // Sort dates in descending order
  const sortedDates = voteDates.sort((a, b) => b.getTime() - a.getTime());

  // Get unique days (ignore time)
  const uniqueDays = new Set(
    sortedDates.map((date) => {
      const day = new Date(date);
      day.setHours(0, 0, 0, 0);
      return day.getTime();
    })
  );

  const dayTimestamps = Array.from(uniqueDays).sort((a, b) => b - a);

  if (dayTimestamps.length === 0) return 0;

  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if most recent vote was today or yesterday
  const mostRecentDay = new Date(dayTimestamps[0]);
  const daysDiff = (today.getTime() - mostRecentDay.getTime()) / (1000 * 60 * 60 * 24);

  if (daysDiff > 1) {
    return 0; // Streak broken if no vote today or yesterday
  }

  // Count consecutive days
  for (let i = 1; i < dayTimestamps.length; i++) {
    const currentDay = dayTimestamps[i];
    const previousDay = dayTimestamps[i - 1];
    const dayDiff = (previousDay - currentDay) / (1000 * 60 * 60 * 24);

    if (dayDiff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export const voteRouter = createTRPCRouter({
  submitVote: votingProcedure.input(submitVoteSchema).mutation(async ({ input, ctx }) => {
    return safeExecute(async () => {
      const { questionId, response } = input;
      const ipAddress = ctx.ipAddress || "127.0.0.1";

      // PHASE 1: FAST CRITICAL PATH (< 500ms)
      // Only essential operations that must complete before user can proceed

      // Check rate limiting first (should be fast with caching)
      const rateLimit = await getVoterRateLimit(ipAddress);
      if (rateLimit.remaining <= 0) {
        throw new RateLimitError(
          `Rate limit exceeded. You can vote again after ${rateLimit.resetTime.toISOString()}`,
          Math.floor((rateLimit.resetTime.getTime() - Date.now()) / 1000)
        );
      }

      // Verify question exists and is active (fast lookup)
      const question = await prisma.question.findFirst({
        where: {
          id: questionId,
          isActive: true,
          OR: [{ startDate: null }, { startDate: { lte: new Date() } }],
          AND: [
            {
              OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
            },
          ],
        },
        select: { id: true }, // Only select what we need
      });

      if (!question) {
        throw new QuestionNotFoundError(questionId);
      }

      // Get or create voter token (cached when possible)
      const { token, voterTokenRecord } = await getOrCreateVoterToken(ctx.voterToken, ipAddress);

      // Check for duplicate vote (fast lookup)
      const hasVoted = await hasVoterVoted(voterTokenRecord.id, questionId);
      if (hasVoted) {
        throw new DuplicateVoteError();
      }

      // Increment rate limit counter (fast operation)
      await incrementRateLimit(ipAddress);

      // CRITICAL: Record the vote immediately (atomic operation)
      const voteResponse = await prisma.questionResponse.create({
        data: {
          questionId,
          voterTokenId: voterTokenRecord.id,
          responseData: response,
          ipAddress,
        },
      });

      // PHASE 2: QUEUE BACKGROUND PROCESSING
      // Heavy operations that don't block user progression
      const { queueVoteEnhancement } = await import("../../background-jobs");

      const isNewVoter = voterTokenRecord.voteCount === 0;

      queueVoteEnhancement({
        voteId: voteResponse.id,
        voterTokenId: voterTokenRecord.id,
        questionId,
        isNewVoter,
        submittedAt: new Date(),
      });

      // IMMEDIATE RESPONSE: User can proceed immediately
      return {
        success: true,
        voteId: voteResponse.id,
        voterToken: token, // Return token so it can be set in cookie
        message: "Vote recorded successfully!",
        // Note: XP will be calculated in background and available on completion page
        processingInBackground: true,
      };
    }, "submitVote");
  }),

  getVoteStats: publicProcedure.input(getVoteStatsSchema).query(async ({ input }) => {
    return safeExecute(async () => {
      const { questionId } = input;

      const stats = await prisma.questionResponse.groupBy({
        by: ["responseData"],
        where: { questionId },
        _count: {
          responseData: true,
        },
      });

      const totalVotes = await prisma.questionResponse.count({
        where: { questionId },
      });

      return {
        questionId,
        totalVotes,
        breakdown: stats.map((stat) => ({
          option: stat.responseData as string,
          count: stat._count.responseData,
          percentage:
            totalVotes > 0 ? Math.round((stat._count.responseData / totalVotes) * 100) : 0,
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
        _sum: { xpAmount: true },
      });

      return {
        votes: votes.map((vote) => ({
          id: vote.id,
          questionId: vote.questionId,
          questionTitle: vote.question.title,
          category: vote.question.category,
          response: vote.responseData,
          createdAt: vote.createdAt,
        })),
        totalXp: totalXp._sum.xpAmount || 0,
      };
    }, "getUserVoteHistory");
  }),

  // New endpoint for completion page XP reconciliation
  getFinalXpCalculation: votingProcedure.query(async ({ ctx }) => {
    return safeExecute(async () => {
      if (!ctx.voterTokenRecord) {
        return { totalXp: 0, voteCount: 0, isComplete: true };
      }

      const voterTokenId = ctx.voterTokenRecord.id;

      // Get current XP and vote counts
      const [xpResult, voteCount] = await Promise.all([
        prisma.xpLedger.aggregate({
          where: { voterTokenId },
          _sum: { xpAmount: true },
        }),
        prisma.questionResponse.count({
          where: { voterTokenId },
        }),
      ]);

      const currentXp = xpResult._sum.xpAmount || 0;

      // Check if background processing might still be pending
      // If vote count doesn't match expected XP, background processing may be ongoing
      const expectedMinXp = voteCount * 5; // Minimum XP (5 per vote)
      const processingComplete = currentXp >= expectedMinXp;

      return {
        totalXp: currentXp,
        voteCount,
        isComplete: processingComplete,
        // If not complete, poll again in a few seconds
        shouldRefetch: !processingComplete,
      };
    }, "getFinalXpCalculation");
  }),

  getEngagementStats: publicProcedure.input(getEngagementStatsSchema).query(async ({ input }) => {
    return safeExecute(async () => {
      const { voterTokenId, includeMilestones = true } = input;

      // Base stats for all users
      const globalStats = await Promise.all([
        // Total community engagement
        prisma.xpLedger
          .aggregate({
            _sum: { xpAmount: true },
            _count: { id: true },
          })
          .catch(() => ({ _sum: { xpAmount: 0 }, _count: { id: 0 } })),

        // Vote streaks (simulated - would need daily analytics)
        prisma.analyticsDaily
          .findMany({
            orderBy: { date: "desc" },
            take: 30, // Last 30 days
            select: {
              date: true,
              totalVotes: true,
              uniqueVoters: true,
            },
          })
          .catch(() => []), // Return empty array if table doesn't exist or has no data

        // Top performers (anonymous)
        prisma.voterToken
          .findMany({
            orderBy: { voteCount: "desc" },
            take: 10,
            select: {
              id: true,
              voteCount: true,
              createdAt: true,
              _count: {
                select: { xpLedger: true },
              },
            },
          })
          .catch(() => []), // Return empty array if no voters yet
      ]);

      const [totalXpStats, recentActivity, topPerformers] = globalStats;

      // User-specific stats if voterTokenId provided
      let userStats = null;
      if (voterTokenId) {
        const [userXp, userVotes, userStreak] = await Promise.all([
          prisma.xpLedger
            .aggregate({
              where: { voterTokenId },
              _sum: { xpAmount: true },
              _count: { id: true },
            })
            .catch(() => ({ _sum: { xpAmount: 0 }, _count: { id: 0 } })),

          prisma.questionResponse
            .count({
              where: { voterTokenId },
            })
            .catch(() => 0),

          // Calculate current streak (simplified)
          prisma.questionResponse
            .findMany({
              where: { voterTokenId },
              select: { createdAt: true },
              orderBy: { createdAt: "desc" },
              take: 30,
            })
            .catch(() => []),
        ]);

        // Calculate streak days
        const streakDays = calculateStreakDays(userStreak.map((v) => v.createdAt));

        userStats = {
          totalXp: userXp._sum.xpAmount || 0,
          totalVotes: userVotes,
          currentStreak: streakDays,
          xpTransactions: userXp._count.id,
          rank: topPerformers.findIndex((p) => p.id === voterTokenId) + 1,
        };
      }

      // Engagement milestones
      let milestones = null;
      if (includeMilestones) {
        milestones = [
          {
            votes: 10,
            xpReward: 50,
            title: "Getting Started",
            achieved: userStats ? userStats.totalVotes >= 10 : false,
          },
          {
            votes: 25,
            xpReward: 100,
            title: "Community Member",
            achieved: userStats ? userStats.totalVotes >= 25 : false,
          },
          {
            votes: 50,
            xpReward: 250,
            title: "Active Participant",
            achieved: userStats ? userStats.totalVotes >= 50 : false,
          },
          {
            votes: 100,
            xpReward: 500,
            title: "Community Champion",
            achieved: userStats ? userStats.totalVotes >= 100 : false,
          },
          {
            votes: 250,
            xpReward: 1000,
            title: "Superoptimised Builder",
            achieved: userStats ? userStats.totalVotes >= 250 : false,
          },
        ];
      }

      return {
        global: {
          totalXpEarned: totalXpStats._sum.xpAmount || 0,
          totalXpTransactions: totalXpStats._count.id,
          recentActivity: recentActivity.slice(0, 7), // Last 7 days
          leaderboard: topPerformers.map((p, index) => ({
            rank: index + 1,
            voteCount: p.voteCount,
            memberSince: p.createdAt,
            totalTransactions: p._count.xpLedger,
          })),
        },
        user: userStats,
        milestones,
        lastUpdated: new Date(),
      };
    }, "getEngagementStats");
  }),

  claimXP: publicProcedure.input(claimXpSchema).mutation(async ({ input }) => {
    return safeExecute(async () => {
      const { email, voterTokenHash } = input;

      // Find voter token by hash
      const voterToken = await prisma.voterToken.findFirst({
        where: { tokenHash: voterTokenHash },
        include: {
          xpLedger: {
            select: {
              xpAmount: true,
            },
          },
        },
      });

      if (!voterToken) {
        throw new Error("Invalid voter token");
      }

      // Calculate total XP
      const totalXp = voterToken.xpLedger.reduce((sum, xp) => sum + xp.xpAmount, 0);

      if (totalXp === 0) {
        throw new Error("No XP to claim");
      }

      // Check if XP has already been claimed
      const existingClaim = await prisma.xpClaim.findFirst({
        where: { voterTokenId: voterToken.id },
      });

      if (existingClaim) {
        throw new Error("XP has already been claimed for this account");
      }

      // Generate magic link token
      const claimToken = randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create XP claim record
      await prisma.xpClaim.create({
        data: {
          voterTokenId: voterToken.id,
          email,
          claimToken,
          totalXp,
          expiresAt,
          status: "pending",
        },
      });

      // Send verification email
      try {
        await sendXpClaimEmail(email, totalXp, claimToken);

        // Track progress event for automation
        await onXpClaimed(email, totalXp);
      } catch (emailError) {
        console.error("Failed to send XP claim email:", emailError);
        // Continue execution - the claim record exists, user can try again
      }

      return {
        success: true,
        message: "Verification email sent successfully",
        totalXp,
      };
    }, "claimXP");
  }),

  // Daily engagement aggregation for analytics
  aggregateDailyStats: publicProcedure.mutation(async () => {
    return safeExecute(async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Check if today's stats already exist
      const existingStats = await prisma.analyticsDaily.findFirst({
        where: { date: today },
      });

      if (existingStats) {
        throw new Error("Daily stats for today already aggregated");
      }

      // Get today's engagement data
      const [todayVotes, uniqueVoters, todayXp, todayNewsletterSignups] = await Promise.all([
        // Total votes today
        prisma.questionResponse.count({
          where: {
            createdAt: {
              gte: today,
              lt: tomorrow,
            },
          },
        }),

        // Unique voters today
        prisma.questionResponse.findMany({
          where: {
            createdAt: {
              gte: today,
              lt: tomorrow,
            },
          },
          distinct: ["voterTokenId"],
          select: { voterTokenId: true },
        }),

        // Total XP earned today
        prisma.xpLedger.aggregate({
          where: {
            createdAt: {
              gte: today,
              lt: tomorrow,
            },
          },
          _sum: { xpAmount: true },
        }),

        // Newsletter signups today
        prisma.newsletterSubscriber.count({
          where: {
            createdAt: {
              gte: today,
              lt: tomorrow,
            },
          },
        }),
      ]);

      // Get popular questions (most voted today)
      const popularQuestions = await prisma.questionResponse.groupBy({
        by: ["questionId"],
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        _count: {
          questionId: true,
        },
        orderBy: {
          _count: {
            questionId: "desc",
          },
        },
        take: 5,
      });

      // Include question titles
      const questionsWithTitles = await Promise.all(
        popularQuestions.map(async (pq) => {
          const question = await prisma.question.findUnique({
            where: { id: pq.questionId },
            select: { title: true },
          });
          return {
            questionId: pq.questionId,
            title: question?.title || "Unknown Question",
            voteCount: pq._count.questionId,
          };
        })
      );

      // Create daily analytics record
      const dailyStats = await prisma.analyticsDaily.create({
        data: {
          date: today,
          totalVotes: todayVotes,
          uniqueVoters: uniqueVoters.length,
          totalXpEarned: todayXp._sum.xpAmount || 0,
          newsletterSignups: todayNewsletterSignups,
          popularQuestions: questionsWithTitles,
        },
      });

      return {
        success: true,
        date: today.toISOString().split("T")[0],
        stats: {
          totalVotes: dailyStats.totalVotes,
          uniqueVoters: dailyStats.uniqueVoters,
          totalXpEarned: dailyStats.totalXpEarned,
          newsletterSignups: dailyStats.newsletterSignups,
          popularQuestions: dailyStats.popularQuestions,
        },
      };
    }, "aggregateDailyStats");
  }),
});
