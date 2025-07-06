import { createTRPCRouter, publicProcedure } from "../trpc";
import { getCommunityStatsSchema, getProjectStatsSchema, getContentBlocksSchema } from "../schemas";
import { safeExecute } from "../errors";
import { prisma } from "../../db";
import { calculateProjectProgress, refreshProjectProgress } from "../../milestone-tracker";
import {
  createContentVersion,
  getContentVersions,
  rollbackContentToVersion,
  compareContentVersions,
  getVersioningStats,
} from "../../content-versioning";
import { z } from "zod";

export const contentRouter = createTRPCRouter({
  getContentBlocks: publicProcedure.input(getContentBlocksSchema).query(async ({ input }) => {
    return safeExecute(async () => {
      const { pageKey, blockKey } = input;

      if (blockKey) {
        // Get specific content block
        const contentBlock = await prisma.contentBlock.findUnique({
          where: {
            pageKey_blockKey: {
              pageKey,
              blockKey,
            },
          },
        });

        if (!contentBlock || !contentBlock.isActive) {
          return null;
        }

        return {
          id: contentBlock.id,
          pageKey: contentBlock.pageKey,
          blockKey: contentBlock.blockKey,
          contentType: contentBlock.contentType,
          content: contentBlock.content,
          updatedAt: contentBlock.updatedAt,
        };
      }

      // Get all content blocks for a page
      const contentBlocks = await prisma.contentBlock.findMany({
        where: {
          pageKey,
          isActive: true,
        },
        orderBy: { blockKey: "asc" },
      });

      const blocks: Record<
        string,
        { id: string; contentType: string; content: string; updatedAt: Date }
      > = {};
      contentBlocks.forEach((block) => {
        blocks[block.blockKey] = {
          id: block.id,
          contentType: block.contentType,
          content: block.content,
          updatedAt: block.updatedAt,
        };
      });

      return {
        pageKey,
        blocks,
        lastUpdated: new Date(),
      };
    }, "getContentBlocks");
  }),

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

      interface ProjectStatValue {
        value: string;
        description: string | null;
        lastUpdated: Date;
      }

      const projectStats: Record<string, ProjectStatValue> = {};
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

  getProjectProgress: publicProcedure.query(async () => {
    return safeExecute(async () => {
      return await calculateProjectProgress();
    }, "getProjectProgress");
  }),

  refreshProjectProgress: publicProcedure.mutation(async () => {
    return safeExecute(async () => {
      return await refreshProjectProgress();
    }, "refreshProjectProgress");
  }),

  // Content versioning endpoints
  getContentVersions: publicProcedure
    .input(z.object({ contentBlockId: z.string() }))
    .query(async ({ input }) => {
      return safeExecute(async () => {
        return await getContentVersions(input.contentBlockId);
      }, "getContentVersions");
    }),

  updateContentWithVersion: publicProcedure
    .input(
      z.object({
        contentBlockId: z.string(),
        newContent: z.string(),
        changeReason: z.string().optional(),
        createdBy: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return safeExecute(async () => {
        return await createContentVersion(
          input.contentBlockId,
          input.newContent,
          input.changeReason,
          input.createdBy
        );
      }, "updateContentWithVersion");
    }),

  rollbackContent: publicProcedure
    .input(
      z.object({
        contentBlockId: z.string(),
        targetVersion: z.number(),
        rollbackReason: z.string().optional(),
        rollbackBy: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return safeExecute(async () => {
        return await rollbackContentToVersion(
          input.contentBlockId,
          input.targetVersion,
          input.rollbackReason,
          input.rollbackBy
        );
      }, "rollbackContent");
    }),

  compareVersions: publicProcedure
    .input(
      z.object({
        contentBlockId: z.string(),
        version1: z.number(),
        version2: z.number(),
      })
    )
    .query(async ({ input }) => {
      return safeExecute(async () => {
        return await compareContentVersions(input.contentBlockId, input.version1, input.version2);
      }, "compareVersions");
    }),

  getVersioningStats: publicProcedure.query(async () => {
    return safeExecute(async () => {
      return await getVersioningStats();
    }, "getVersioningStats");
  }),
});
