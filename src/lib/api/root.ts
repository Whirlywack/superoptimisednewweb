import { createCallerFactory, createTRPCRouter } from "./trpc";
import { questionRouter } from "./routers/questionRouter";
import { voteRouter } from "./routers/voteRouter";
import { contentRouter } from "./routers/contentRouter";
import { blogRouter } from "./routers/blogRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  question: questionRouter,
  vote: voteRouter,
  content: contentRouter,
  blog: blogRouter,
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
