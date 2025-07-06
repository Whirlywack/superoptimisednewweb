import { createTRPCRouter, publicProcedure } from "../trpc";
import { getCommunityStatsSchema, getProjectStatsSchema } from "../schemas";
import { safeExecute } from "../errors";
import { prisma } from "../../db";

export const contentRouter = createTRPCRouter({
  getCommunityStats: publicProcedure.input(getCommunityStatsSchema).query(async ({ input }) => {
    return safeExecute(async () => {
      const { includeDaily = false } = input;

      // Get live stats from cache
      const liveStats = await prisma.liveStat.findMany({
        orderBy: { statKey: "asc" },
      });

      // Convert to key-value pairs
      const stats: Record<string, number> = {};
      liveStats.forEach((stat) => {
        stats[stat.statKey] = stat.statValue;
      });

      // Get additional real-time calculations
      const [totalVotes, uniqueVoters, activeQuestions, totalXpEarned, newsletterSubscribers] =
        await Promise.all([
          prisma.questionResponse.count(),
          prisma.voterToken.count(),
          prisma.question.count({ where: { isActive: true } }),
          prisma.xpLedger.aggregate({ _sum: { xpAmount: true } }),
          prisma.newsletterSubscriber.count({ where: { status: "confirmed" } }),
        ]);

      const communityStats = {
        totalVotes: stats.total_votes || totalVotes,
        uniqueVoters: stats.unique_voters || uniqueVoters,
        activeQuestions: stats.active_questions || activeQuestions,
        totalXpEarned: stats.total_xp || totalXpEarned._sum.xpAmount || 0,
        newsletterSubscribers: stats.newsletter_subscribers || newsletterSubscribers,
        lastUpdated: new Date(),
      };

      // Include daily stats if requested
      let dailyStats = null;
      if (includeDaily) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dailyAnalytics = await prisma.analyticsDaily.findUnique({
          where: { date: today },
        });

        if (dailyAnalytics) {
          dailyStats = {
            date: dailyAnalytics.date,
            totalVotes: dailyAnalytics.totalVotes,
            uniqueVoters: dailyAnalytics.uniqueVoters,
            totalXpEarned: dailyAnalytics.totalXpEarned,
            newsletterSignups: dailyAnalytics.newsletterSignups,
            popularQuestions: dailyAnalytics.popularQuestions,
          };
        }
      }

      return {
        ...communityStats,
        ...(dailyStats && { today: dailyStats }),
      };
    }, "getCommunityStats");
  }),

  getProjectStats: publicProcedure.input(getProjectStatsSchema).query(async ({ input }) => {
    return safeExecute(async () => {
      const { statKey } = input;

      if (statKey) {
        // Get specific stat
        const stat = await prisma.projectStat.findUnique({
          where: { statKey },
        });

        if (!stat) {
          return null;
        }

        return {
          [stat.statKey]: {
            value: stat.statValue,
            description: stat.description,
            lastUpdated: stat.lastUpdated,
          },
        };
      }

      // Get all project stats
      const stats = await prisma.projectStat.findMany({
        orderBy: { statKey: "asc" },
      });

      const projectStats: Record<string, unknown> = {};
      stats.forEach((stat) => {
        projectStats[stat.statKey] = {
          value: stat.statValue,
          description: stat.description,
          lastUpdated: stat.lastUpdated,
        };
      });

      return projectStats;
    }, "getProjectStats");
  }),
});
