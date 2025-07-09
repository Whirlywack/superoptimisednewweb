import { createCallerFactory, createTRPCRouter } from "./trpc";
import { questionRouter } from "./routers/questionRouter";
import { questionnaireRouter } from "./routers/questionnaireRouter";
import { voteRouter } from "./routers/voteRouter";
import { contentRouter } from "./routers/contentRouter";
import { blogRouter } from "./routers/blogRouter";
import { newsletterRouter } from "./routers/newsletterRouter";
import { adminRouter } from "./routers/adminRouter";
import { analyticsRouter } from "./routers/analyticsRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  question: questionRouter,
  questionnaire: questionnaireRouter,
  vote: voteRouter,
  content: contentRouter,
  blog: blogRouter,
  newsletter: newsletterRouter,
  admin: adminRouter,
  analytics: analyticsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
