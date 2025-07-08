/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { getServerAuthSession } from "../auth";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers; req?: Request }) => {
  const session = await getServerAuthSession();

  // Extract IP address for rate limiting
  const ipAddress = opts.req ? getClientIPAddress(opts.req) : undefined;

  return {
    session,
    ipAddress,
    ...opts,
  };
};

/**
 * Extract client IP address from request headers
 */
function getClientIPAddress(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIP = req.headers.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  // Fallback to connection remote address (won't work in serverless)
  return "127.0.0.1";
}

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
        customError: error.cause?.name || null,
        timestamp: new Date().toISOString(),
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Request logging middleware for performance monitoring
 */
const loggingMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();

  console.log(`[tRPC] ${type.toUpperCase()} ${path} - Started`);

  const result = await next();

  const duration = Date.now() - start;
  const status = result.ok ? "SUCCESS" : "ERROR";

  console.log(`[tRPC] ${type.toUpperCase()} ${path} - ${status} (${duration}ms)`);

  if (!result.ok) {
    console.error(`[tRPC] Error in ${path}:`, result.error);
  }

  return result;
});

/**
 * Voter token middleware for anonymous voting
 */
const voterTokenMiddleware = t.middleware(async ({ ctx, next }) => {
  // Extract voter token from request headers/cookies
  let voterToken: string | null = null;
  let voterTokenRecord = null;

  // Try to get voter token from cookie header
  if (ctx.headers?.get) {
    const cookieHeader = ctx.headers.get("cookie");
    if (cookieHeader) {
      const cookies = cookieHeader.split(";").reduce(
        (acc, cookie) => {
          const [key, value] = cookie.trim().split("=");
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>
      );

      voterToken = cookies.voterToken || cookies.voter_token || null;
    }
  }

  // If we have a voter token, try to get the record
  if (voterToken) {
    try {
      const { getOrCreateVoterToken } = await import("./voterToken");
      const { token, voterTokenRecord: record } = await getOrCreateVoterToken(
        voterToken,
        ctx.ipAddress
      );
      voterToken = token;
      voterTokenRecord = record;
    } catch (error) {
      console.error("[tRPC] Error handling voter token:", error);
      voterToken = null;
      voterTokenRecord = null;
    }
  }

  return next({
    ctx: {
      ...ctx,
      voterToken,
      voterTokenRecord,
    },
  });
});

/**
 * Rate limiting middleware for voting endpoints
 */
const rateLimitMiddleware = t.middleware(async ({ ctx, next, path }) => {
  // For voting endpoints, we'll implement IP-based rate limiting
  if (path.includes("vote") || path.includes("submit")) {
    // This will be enhanced when we implement the actual rate limiting logic
    // For now, just log the attempt
    console.log(`[tRPC] Rate limit check for ${path} from IP: ${ctx.ipAddress}`);
  }

  return next();
});

/**
 * Public (unauthenticated) procedure with logging
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(loggingMiddleware);

/**
 * Public procedure with rate limiting (for voting endpoints)
 */
export const rateLimitedProcedure = t.procedure.use(loggingMiddleware).use(rateLimitMiddleware);

/**
 * Voting procedure with voter token and rate limiting
 */
export const votingProcedure = t.procedure
  .use(loggingMiddleware)
  .use(voterTokenMiddleware)
  .use(rateLimitMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(loggingMiddleware).use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Session or user information is missing",
    });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

// /**
//  * Protected (authenticated) procedure
//  *
//  * If you want a query or mutation to ONLY be accessible to logged in admins, use this. It verifies
//  * the session is valid and guarantees `ctx.session.user` has admin privileges.
//  *
//  * @see https://trpc.io/docs/procedures
//  */
// export const adminProcedure = t.procedure.use(({ ctx, next }) => {
//   if (!ctx.session?.user?.isAdmin) {
//     throw new TRPCError({
//       code: "UNAUTHORIZED",
//       message: "Admin privileges required",
//     });
//   }

//   return next({
//     ctx: {
//       session: { ...ctx.session, user: ctx.session.user },
//     },
//   });
// });
