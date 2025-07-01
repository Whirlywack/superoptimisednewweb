# 🛠️ Coding Standards for Superoptimised Next.js AI Starter

These conventions keep our codebase consistent, secure, and performant while maximising the leverage of AI tooling.

---

## 1. Core Principles

- **Type Safety** – All module boundaries (API, components, utilities) must be typed with TypeScript; shared types live in `src/lib/types.ts`. Avoid `any`; if unavoidable use `unknown` and refine.
- **Single Responsibility** – Each file, function and component does one thing. Extract helpers over adding nested logic.
- **Error Handling** – API routes _and_ tRPC procedures return `{ ok: false, code, message }` with proper HTTP status or a `TRPCError` code.
- **Security First** – Validate **all** external inputs with Zod. Never expose secrets. Middleware must strip `x-middleware-subrequest-id` on external redirects.
- **Performance** –
  - Use `<Image>` for images.
  - Apply `export const dynamic = 'force-static'` or explicit `cache-control` headers on route handlers.
  - Prefer React Server Components for data-heavy UI.
- **Privacy & Compliance** – Email collection requires explicit user consent; questionnaire data is anonymous. Follow GDPR data-retention rules.
- **Accessibility** – Meet WCAG AA. Interactive elements need ARIA labels.

---

## 2. Naming Conventions

| Element               | Casing / Pattern                | Example                   |
| --------------------- | ------------------------------- | ------------------------- |
| **Components**        | `PascalCase`                    | `QuestionnaireForm.tsx`   |
| **Hooks**             | `camelCase` prefixed with `use` | `useQuestionnaire.ts`     |
| **API Routes (REST)** | `kebab-case`                    | `/api/magic-links`        |
| **tRPC Routers**      | `camelCase`                     | `questionnaireRouter`     |
| **Prisma Models**     | `PascalCase`                    | `MagicLink`               |
| **Database Tables**   | `snake_case`                    | `questionnaire_responses` |
| **Zod Schemas**       | `PascalCase`+`Schema`           | `MagicLinkSchema`         |
| **Functions / Vars**  | `camelCase`                     | `validateMagicLink()`     |
| **Storybook Stories** | `Component.stories.tsx`         | `Button.stories.tsx`      |

---

## 3. Project Structure (excerpt)

```
src/app/           → Next.js App Router
src/
  ├─ components/   → UI components (atoms → templates)
  ├─ lib/
  │   ├─ api/      → tRPC routers
  │   └─ utils/    → cross-cutting helpers
  └─ lib/types.ts  → shared TS types
  └─ stories/      → Storybook stories
prisma/            → schema & migrations
docs/              → documentation hub
```

---

## 4. Error-Handling Pattern

```ts
// src/lib/utils/error.ts
export interface ApiError {
  ok: false;
  code: string;
  message: string;
}

export const toApiError = (error: unknown): ApiError => {
  if (error instanceof TRPCError) {
    return { ok: false, code: error.code, message: error.message };
  }
  return { ok: false, code: "INTERNAL_SERVER_ERROR", message: "Unexpected error" };
};
```

REST route example:

```ts
return NextResponse.json(toApiError(e), { status: 400 });
```

---

## 5. Security Checklist

- [`next-secure-headers`](https://www.npmjs.com/package/next-secure-headers) in `middleware.ts` for HSTS, CSP, etc.
- Environment secrets only in Vercel env vars.
- Sanitize user-supplied HTML with `DOMPurify`.
- Rate-limit `/api/auth/*`, `/api/magic-links`, and newsletter endpoints.

---

## 6. Performance Guidelines

1. **Turbopack** caches incremental builds.
2. **Streaming/Suspense**: Split large pages with `<Suspense>`.
3. **Database**: Select specific fields; avoid loading all relations.
4. **Edge vs Node**: Use edge runtime only when latency-critical.

---

## 7. Testing Strategy

| Layer       | Tooling               | Requirement              |
| ----------- | --------------------- | ------------------------ |
| Unit        | Jest + RTL            | ≥ 80 % coverage on utils |
| Component   | Storybook + Chromatic | Visual regression on PR  |
| Integration | Playwright            | Core user journeys pass  |

`npm test` must pass locally and in CI.

---

## 8. Git Workflow & Commits

- Branch from `main` using `feat/`, `fix/`, `docs/`, `chore/` prefixes.
- Follow Conventional Commits: `feat: add magic link auth`.
- PRs must reference items in `stories.md` and pass CI, Chromatic & audit.

---

## 9. Linting & Formatting

- ESLint (`next/core-web-vitals`) + Prettier (2-space indent, 100-char lines) run on Husky `pre-commit`.

---

_Updated: 2025-07-01_

---

> **Legacy guidelines below are retained for reference and will be removed after migration.**

## Original Core Rules

### Critical Fullstack Rules

- **Type Safety**: All API boundaries must use TypeScript interfaces, shared types between frontend and backend
- **Error Handling**: All API routes must use consistent error response format with proper HTTP status codes
- **Security First**: Never expose sensitive data in API responses, always validate inputs with Zod schemas
- **Performance**: Images must use Next.js Image component with optimization, API responses must include appropriate caching headers
- **Privacy**: Questionnaire responses must remain anonymous, email collection requires explicit consent

### Naming Conventions

| Element         | Frontend             | Backend    | Example                   |
| :-------------- | :------------------- | :--------- | :------------------------ |
| Components      | PascalCase           | -          | `QuestionnaireForm.tsx`   |
| Hooks           | camelCase with 'use' | -          | `useQuestionnaire.ts`     |
| API Routes      | -                    | kebab-case | `/api/magic-links`        |
| Database Tables | -                    | snake_case | `questionnaire_responses` |
| Functions       | camelCase            | camelCase  | `validateMagicLink()`     |

---

## Enhanced Standards for Superoptimised Project

### 🎯 Project-Specific Requirements

Based on the PRD, architecture, and UI/UX specifications, these standards ensure the platform delivers on its core mission of **radical transparency** while maintaining **enterprise-grade security** and **sub-3 second performance** for social media traffic.

## 🔒 Maximum Security Standards

### Magic Link Security (Critical for Questionnaire System)

```typescript
// ✅ REQUIRED: Secure token generation
export function generateMagicLinkToken(): string {
  return crypto.randomBytes(32).toString("base64url"); // 43 chars, URL-safe
}

// ✅ REQUIRED: Token validation with timing attack protection
export function validateMagicLink(token: string, stored: string): boolean {
  return crypto.timingSafeEqual(Buffer.from(token, "base64url"), Buffer.from(stored, "base64url"));
}

// ✅ REQUIRED: Expiry validation
export const magicLinkSchema = z.object({
  token: z.string().regex(/^[A-Za-z0-9_-]{43}$/, "Invalid token format"),
  expiresAt: z.date().refine((date) => date > new Date(), "Token expired"),
});
```

### Anonymous Data Protection (Privacy-First Architecture)

```typescript
// ✅ REQUIRED: Never store identifying information with responses
interface QuestionnaireResponse {
  id: string;
  questionnaireId: string;
  responses: Record<string, unknown>;
  metadata: {
    submittedAt: Date;
    userAgent?: string; // Only for analytics
    // ❌ FORBIDDEN: email, IP address, userId
  };
}

// ✅ REQUIRED: Sanitize all logs
export function sanitizeForLog(data: any): any {
  const sanitized = { ...data };
  delete sanitized.email;
  delete sanitized.ip;
  delete sanitized.userId;
  delete sanitized.token;
  return sanitized;
}
```

### Input Validation (All API Endpoints)

```typescript
// ✅ REQUIRED: Validate ALL inputs with Zod
export const submitResponseSchema = z.object({
  token: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
  responses: z.record(z.unknown()).refine(
    (obj) => Object.keys(obj).length <= 20, // Prevent DoS
    "Too many responses"
  ),
  forwardTo: z
    .array(
      z.object({
        email: z.string().email(),
        name: z.string().max(100).optional(),
      })
    )
    .max(5)
    .optional(), // Limit viral spreading
});

// ❌ FORBIDDEN: Accepting raw request data
```

### Rate Limiting (Social Media Traffic Protection)

```typescript
// ✅ REQUIRED: Rate limiting on all public endpoints
export const rateLimits = {
  magicLink: { requests: 10, window: "1m" }, // Questionnaire access
  newsletter: { requests: 3, window: "1m" }, // Email signup
  api: { requests: 100, window: "1m" }, // General API
  static: { requests: 1000, window: "1m" }, // Journey posts
} as const;
```

## ⚡ Performance Optimization (Sub-3 Second Target)

### Image Optimization (Social Media Traffic)

```tsx
// ✅ REQUIRED: Next.js Image with optimization
import Image from "next/image";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Image
      src={project.imageUrl}
      alt={`${project.name} screenshot`}
      width={400}
      height={300}
      placeholder="blur"
      blurDataURL={project.blurDataUrl} // Pre-generated
      priority={project.isFeatured} // Only for above-fold
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}

// ❌ FORBIDDEN: Regular img tags or unoptimized images
```

### API Response Caching (Mobile Performance)

```typescript
// ✅ REQUIRED: Aggressive caching for content
export async function GET() {
  const posts = await getJourneyPosts();

  return NextResponse.json(posts, {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate=86400",
      "CDN-Cache-Control": "s-maxage=31536000",
      Vary: "Accept-Encoding",
    },
  });
}
```

### Database Query Optimization

```typescript
// ✅ REQUIRED: Select only needed fields
export async function getJourneyPostsForList() {
  return await db.journeyPost.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      readingTime: true,
      publishedAt: true,
      project: true,
      tags: true,
      // ❌ Never select 'content' for list views
    },
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 20, // Always limit
  });
}
```

## 🧩 Modularity Rules (500 Line Limit)

### Component Size Enforcement

```typescript
// ✅ REQUIRED: Break down large components
// QuestionnaireForm.tsx - Main component (< 100 lines)
export function QuestionnaireForm({ questionnaire, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit}>
      <QuestionnaireHeader questionnaire={questionnaire} />
      <QuestionnaireQuestions questions={questionnaire.questions} />
      <QuestionnaireActions />
    </form>
  );
}

// QuestionnaireQuestions.tsx - Question rendering (< 150 lines)
// QuestionnaireActions.tsx - Form actions (< 50 lines)
// QuestionnaireHeader.tsx - Header content (< 50 lines)

// ❌ FORBIDDEN: Components over 200 lines
```

### Feature Module Structure

```typescript
// features/questionnaire/
//   ├── components/          (< 150 lines each)
//   ├── hooks/              (< 100 lines each)
//   ├── api/                (< 200 lines each)
//   ├── types.ts            (< 100 lines)
//   └── index.ts            (Exports only)

// ✅ REQUIRED: Each feature is self-contained
export * from "./components";
export * from "./hooks";
export * from "./types";
```

### API Route Modularity

```typescript
// ✅ REQUIRED: Small, focused API routes
// api/magic-links/[token]/route.ts
export async function GET(req: Request, { params }: Context) {
  const result = await validateMagicLinkToken(params.token);
  return NextResponse.json(result);
}

export async function POST(req: Request, { params }: Context) {
  const data = await submitQuestionnaireResponse(params.token, req);
  return NextResponse.json(data);
}

// ❌ FORBIDDEN: Monolithic API routes handling multiple resources
```

## 🎨 Community Integration Standards

### Twitter Response Curation (Manual Process)

```typescript
// ✅ REQUIRED: Manual curation with permission tracking
interface TwitterResponse {
  id: string;
  content: string;
  username: string;
  hasPermission: boolean; // Explicit consent required
  isHighlighted: boolean;
  curatedAt: Date;
}

// ✅ REQUIRED: Content sanitization
export function sanitizeTwitterContent(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [], // No HTML allowed
    ALLOWED_ATTR: [],
  });
}
```

### Community Response Display

```tsx
// ✅ REQUIRED: Privacy-respecting display
export function CommunityResponseCard({ response }: Props) {
  return (
    <div className="community-response">
      {response.hasPermission ? <cite>@{response.username}</cite> : <cite>Community Member</cite>}
      <blockquote>{response.content}</blockquote>
    </div>
  );
}
```

## 📊 Type Safety (Shared Across Stack)

### Shared Type Definitions

```typescript
// types/shared.ts - Single source of truth
export interface JourneyPost {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly content: string;
  readonly status: "draft" | "published" | "archived";
  readonly project: string;
  readonly tags: readonly string[];
  readonly twitterResponses?: readonly TwitterResponse[];
  readonly questionnaireResults?: readonly QuestionnaireResult[];
  readonly readingTime: number;
  readonly wordCount: number;
  readonly publishedAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

// ✅ REQUIRED: Use readonly for immutable data
// ✅ REQUIRED: Explicit null handling
```

### API Contract Enforcement

```typescript
// ✅ REQUIRED: Input/output validation
export const journeyPostRouter = createTRPCRouter({
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1).max(100) }))
    .output(journeyPostSchema.nullable())
    .query(async ({ input }) => {
      // Must return JourneyPost | null
    }),
});
```

## 🚨 Error Handling (User-Friendly)

### Consistent Error Format

```typescript
// ✅ REQUIRED: Standardized error responses
interface ApiError {
  code: TRPCErrorCode;
  message: string; // User-friendly
  details?: Record<string, unknown>;
  timestamp: string;
  requestId: string;
}

// ✅ REQUIRED: Error sanitization
export function createUserError(
  code: TRPCErrorCode,
  userMessage: string,
  internalError?: Error
): TRPCError {
  // Log internal error
  logger.error("API Error", { error: internalError, code });

  // Return sanitized error
  return new TRPCError({
    code,
    message: userMessage, // Never expose internal details
  });
}
```

### Error Boundaries (React)

```tsx
// ✅ REQUIRED: Error boundaries for all routes
export function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundaryComponent
      fallback={<ErrorFallback />}
      onError={(error, errorInfo) => {
        trackEvent("frontend_error", {
          error: error.message,
          component: errorInfo.componentStack,
        });
      }}
    >
      {children}
    </ErrorBoundaryComponent>
  );
}
```

## 📱 Mobile-First Standards (Social Media Traffic)

### Responsive Component Design

```tsx
// ✅ REQUIRED: Mobile-first responsive design
export function QuestionnaireForm() {
  return (
    <div className="// Mobile padding // Tablet padding // Desktop padding // Mobile max width // Tablet max width // Desktop max width // Center on all sizes mx-auto max-w-md p-4 md:max-w-lg md:p-6 lg:max-w-2xl lg:p-8">
      {/* Content optimized for touch */}
    </div>
  );
}
```

### Touch-Optimized Interactions

```tsx
// ✅ REQUIRED: 44px minimum touch targets
export function SubmitButton() {
  return (
    <button className="// 48px height (> 44px minimum) // Adequate horizontal padding // 16px+ text size // Touch-friendly corners // Touch feedback h-12 rounded-lg px-6 text-base active:scale-95">
      Submit Response
    </button>
  );
}
```

## 🔍 SEO & Social Optimization

### Metadata Standards

```tsx
// ✅ REQUIRED: Complete metadata for social sharing
export function generateMetadata({ params }: Props): Metadata {
  const post = await getJourneyPost(params.slug);

  return {
    title: `${post.title} | Superoptimised`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: ["Superoptimised"],
      images: [
        {
          url: `/api/og/${post.slug}`, // Dynamic OG images
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [`/api/og/${post.slug}`],
    },
  };
}
```

## 🧪 Testing Requirements

### Component Testing

```typescript
// ✅ REQUIRED: Test privacy compliance
describe("QuestionnaireForm", () => {
  it("never exposes user identifying information", async () => {
    const { result } = renderHook(() => useQuestionnaire(validToken));

    // Submit response
    await act(async () => {
      await result.current.submitResponse({ q1: "answer" });
    });

    // Verify no PII in any request
    expect(mockApiCalls).not.toContainEqual(
      expect.objectContaining({
        email: expect.anything(),
        ip: expect.anything(),
        userId: expect.anything(),
      })
    );
  });
});
```

### API Testing

```typescript
// ✅ REQUIRED: Test security boundaries
describe("POST /api/magic-links/[token]", () => {
  it("validates token format and expiry", async () => {
    const expiredToken = await createExpiredMagicLink();

    const response = await request(app)
      .post(`/api/magic-links/${expiredToken}`)
      .send({ responses: { q1: "answer" } })
      .expect(404);

    expect(response.body.message).toBe("Magic link expired or invalid");
  });
});
```

## 🚀 Deployment Standards

### Environment Configuration

```typescript
// ✅ REQUIRED: Validate all environment variables
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  MAGIC_LINK_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().length(64), // 32 bytes hex
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  // All env vars must be validated
});

export const env = envSchema.parse(process.env);
```

### Performance Monitoring

```typescript
// ✅ REQUIRED: Track Core Web Vitals
export function trackPerformance() {
  if (typeof window !== "undefined") {
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
}
```

## 📋 Extended Naming Conventions

| Element             | Convention        | Example               | Max Length | Notes                         |
| :------------------ | :---------------- | :-------------------- | :--------- | :---------------------------- |
| **Components**      | PascalCase        | `MagicLinkForm.tsx`   | 50 chars   | Descriptive, no abbreviations |
| **Hooks**           | camelCase + 'use' | `useMagicLink.ts`     | 30 chars   | Return objects, not arrays    |
| **API Routes**      | kebab-case        | `/api/magic-links`    | 50 chars   | RESTful, plural nouns         |
| **Database Tables** | snake_case        | `magic_links`         | 30 chars   | Plural, descriptive           |
| **Functions**       | camelCase         | `validateMagicLink()` | 40 chars   | Verb-based actions            |
| **Constants**       | SCREAMING_SNAKE   | `MAX_LINK_EXPIRY`     | 30 chars   | All caps with underscores     |
| **Types**           | PascalCase        | `MagicLinkData`       | 40 chars   | No 'I' prefix                 |
| **Files**           | kebab-case        | `magic-link-form.tsx` | 50 chars   | Descriptive, no abbreviations |

## 🚫 Absolute Prohibitions

### Security Violations

```typescript
// ❌ FORBIDDEN: Logging sensitive data
console.log("User data:", { email, responses }); // NEVER

// ❌ FORBIDDEN: Exposing errors to users
throw new Error(`Database error: ${dbError.details}`); // NEVER

// ❌ FORBIDDEN: Storing PII with anonymous data
const response = { userId: "123", email, answers }; // NEVER
```

### Performance Violations

```typescript
// ❌ FORBIDDEN: Unoptimized images
<img src="/large-image.jpg" /> // Use Next.js Image

// ❌ FORBIDDEN: Blocking operations
const allData = await fetchEverything(); // Paginate/limit

// ❌ FORBIDDEN: Memory leaks
useEffect(() => {
  const interval = setInterval(fn, 1000);
  // Missing cleanup
}, []); // Add cleanup!
```

### Type Safety Violations

```typescript
// ❌ FORBIDDEN: Any types
function process(data: any): any {} // Use proper types

// ❌ FORBIDDEN: Non-null assertions
const user = getUser()!; // Might crash

// ❌ FORBIDDEN: Ignoring TypeScript
// @ts-ignore
const result = dangerousFunction(); // Fix the types
```

## ✅ Pre-Deployment Checklist

Before any code deployment:

- [ ] **Security**: All inputs validated, no PII logged
- [ ] **Performance**: Images optimized, queries limited
- [ ] **Privacy**: Anonymous handling verified
- [ ] **Type Safety**: No `any` types, errors handled
- [ ] **Modularity**: No files over 500 lines
- [ ] **Mobile**: Touch targets 44px+, responsive
- [ ] **SEO**: Metadata complete, OG images
- [ ] **Testing**: Security and privacy tests pass
- [ ] **Accessibility**: WCAG 2.1 AA compliance
- [ ] **Monitoring**: Error tracking configured

These enhanced standards ensure Superoptimised delivers on its mission of radical transparency while maintaining enterprise-grade security, performance, and user experience.
