# 📚 Project Documentation Index

Welcome to the **Superoptimised Next.js AI Starter** documentation hub. This file links out to the living documents inside the `docs` folder and gives newcomers a bird’s-eye view of what each document contains.

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/superoptimised"
DIRECT_URL="postgresql://username:password@localhost:5432/superoptimised"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Email Service (Resend)
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@yourdomain.com"

# AI Services (Optional)
OPENAI_API_KEY="your-openai-key"
GOOGLE_AI_KEY="your-gemini-key"
GROQ_API_KEY="your-groq-key"

# Supabase (for real-time features)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Site Configuration
SITE_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## 🧪 Testing

**Run all tests:**

```bash
npm test
```

**Run specific test types:**

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Watch mode for development
npm run test:watch
```

**Test coverage:**

```bash
npm run test:coverage
```

**Testing the newsletter system:**

```bash
# Run newsletter API tests
npm run test src/lib/api/routers/newsletterRouter.test.ts

# Test newsletter components
npm run test src/components/molecules/NewsletterSignup.test.tsx
```

**Testing Phase 6 advanced question types:**

```bash
# Test all question types
npm run test scripts/test-*.ts

# Test specific question type
npm run test scripts/test-research-page.ts
```

## 🎯 Interactive Database Features

**Phase 1 Complete**: Core tRPC API foundation with anonymous voting system
**Phase 2 Complete**: Real-time Updates & WebSocket Integration  
**Phase 3 Complete**: Frontend Integration & localStorage Migration
**Phase 4 Complete**: XP System & Engagement Tracking with Email Claiming
**Phase 5 Complete**: Content Management System with Dynamic Content Blocks, Milestone Timeline Integration & SEO Optimization
**Phase 7 Complete**: Newsletter System Integration with Double Opt-in, Real-time Stats & Email Automation
**Phase 8.1 Complete**: Admin Dashboard Authentication & Authorization with Role-based Access Control
**Phase 8.2 Complete**: Question Management Interface with All Question Types, Scheduling, and Toggle Controls
**Research Page Refactor Complete**: Production-ready research voting system with advanced features (Phases 1-3 + performance optimizations)

✅ **Anonymous Voting System**

- SHA-256 hashed voter tokens for privacy
- Duplicate vote prevention
- IP-based rate limiting (100 votes/24h)

✅ **Question Management API**

- `getActiveQuestions` - Fetch questions by category
- `getQuestionById` - Single question with stats
- `getQuestionResults` - Vote aggregation with percentages

✅ **Voting API**

- `submitVote` - Submit votes with validation
- `getVoteStats` - Real-time vote statistics
- `getUserVoteHistory` - Anonymous voting history

✅ **XP & Engagement Tracking**

- Progressive XP rewards (5→10→15→20→25→50→100 based on vote count)
- Real-time XP calculation and database recording
- Engagement analytics with streaks and milestones
- Secure email-based XP claiming system
- Anonymous leaderboards and community metrics

✅ **Real-time Features**

- WebSocket subscriptions via Supabase Realtime
- `useRealtimeVotes` hook for live vote counts
- `useRealtimeStats` hook for community statistics
- Automatic fallback to polling (15s intervals)

✅ **Performance Optimization**

- Batch stats updates (5s delay, 50 max)
- In-memory caching with 5min TTL
- Real-time aggregation on vote submission
- Optimized database queries

✅ **Frontend Integration**

- Complete localStorage replacement with tRPC API calls
- Live data integration across all pages (Homepage, About, Journey)
- Real-time progress indicators with dynamic project completion
- Optimistic UI updates and error handling with toast notifications

✅ **Content Management System (Phase 5)**

- Database-driven content blocks (26+ blocks across pages)
- Content versioning with rollback capabilities
- Real-time project timeline with milestone tracking (`/timeline`)
- Automated progress updates based on completed features
- Server Component architecture for content fetching

✅ **Blog Post Management (Phase 5.3)**

- `getBlogPosts` API endpoint with pagination and filtering
- Journey timeline integration with database blog posts
- **Enhanced Markdown rendering** with syntax highlighting and XSS protection
- Code block syntax highlighting with copy-to-clipboard functionality
- Heading anchors, external link indicators, and responsive tables
- Blog post viewer component with reading time estimation
- **Dynamic slug-based routing** (`/journey/[slug]`) with SEO metadata generation
- Static site generation for published posts with automatic 404 handling

✅ **Research Page Refactor (Complete - All Phases)**

- **Phase 1**: Database integration with real questions, votes, and XP tracking
- **Phase 2**: Completion page with real XP calculations and vote history
- **Phase 3**: Real-time data, optimistic updates, and enhanced user experience
- **Advanced Features**: Performance optimization, haptic feedback, accessibility
- Progressive XP rewards (5→10→15→20→25→50→100) based on engagement
- Real-time vote statistics with optimistic UI updates
- Anonymous voter tracking and duplicate prevention
- Enhanced loading states, error boundaries, and comprehensive error handling

✅ **Phase 3: Advanced User Experience & Performance**

- **Optimistic UI Updates**: Instant vote count feedback before database confirmation
- **Performance Optimization**: Intelligent caching, memoization, and reduced re-renders
- **Error Boundaries**: Robust error handling with automatic retry mechanisms
- **Advanced Feedback**: Haptic feedback, enhanced animations, and visual loading states
- **Accessibility Features**: Screen reader support, keyboard navigation, reduced motion preferences
- **Mobile Optimization**: Virtual keyboard detection and responsive touch interactions

✅ **Phase 4: Background Processing Architecture (NEW)**

- **Fast Vote Recording**: Critical vote path reduced from 4-5 seconds to 300-500ms (10x improvement)
- **Background XP Processing**: Heavy calculations moved to async background jobs
- **Immediate Progression**: Users can proceed to next question while XP calculates in background
- **Smart Reconciliation**: Completion page shows accurate totals with real-time updates
- **Horizontal Loading Animation**: Clean, linear loading design replacing circular dots

✅ **Phase 7: Newsletter System Integration (NEW)**

- **Double Opt-in Flow**: Secure email verification with token-based confirmation
- **Real-time Subscriber Stats**: Live newsletter subscriber counts across all pages
- **Multi-variant Components**: Flexible signup forms (card, inline, banner) with source tracking
- **Email Automation**: Automated confirmation emails with professional HTML templates
- **XP Integration**: Newsletter signups award 5 XP with toast notifications
- **Advanced Analytics**: Daily analytics tracking and source attribution
- **Error Handling**: Comprehensive validation, duplicate prevention, and user feedback

---

## 🔧 Phase 3: Live Data Integration Architecture

### React Hooks Created

**Core Data Hooks:**

- `useActiveQuestions` - Fetches real questions from database with caching (5min stale, 10min cache)
- `useCommunityStats` - Provides live community statistics with auto-refresh (30s stale, 1min refresh)
- `useVoteSubmission` - Handles secure vote submission with XP integration and error handling
- `useProjectStats` - Fetches real project completion data for progress indicators

**XP System Hooks:**

- `useClaimXp` - Manages XP claiming modal state and validation
- `useVoteSubmission` - Enhanced with XP integration (now returns `xpEarned` and `totalXp`)
- `useEngagementStats` - Real user XP data with streaks and milestones
- `useUserVoteHistory` - Database vote history for completion page
- `useVoterToken` - Voter identification and token management
- `useQuestionStats` - Real-time vote statistics for individual questions

**Phase 3: Advanced UX Hooks (NEW):**

- `useAdvancedFeedback` - Haptic feedback, audio cues, and multi-sensory user feedback
- `useResearchPageOptimization` - Performance optimization with intelligent caching and memoization
- `useAccessibility` - Screen reader detection, keyboard navigation, and accessibility preferences

### Frontend Integration Logic

**Homepage (`/`):**

- `DualInteractivePolls` component now uses `useActiveQuestions` to fetch real questions from database
- Vote submission through `useVoteSubmission` hook with optimistic UI updates
- Real-time vote counts displayed from database instead of hardcoded values
- Community stats in `CommunityProof` component use `useCommunityStats` hook

**About Page (`/about`):**

- Community stats section uses real database values via `useCommunityStats`
- Dynamic calculation of "Days Building" based on project start date
- Live vote counts and unique voter statistics

**Journey Page (`/journey`):**

- `JourneyHero` component displays live community metrics
- Real-time vote counts and active question counts
- Dynamic community input statistics in current focus section

**Research Page (`/research`):**

- `ResearchPage` component loads real questions from database via `useActiveQuestions`
- Vote submission through database with real XP rewards via `useVoteSubmission`
- Real-time vote statistics using `useQuestionStats` hook
- Anonymous voter tracking with duplicate prevention
- Progress bar replacement of countdown with mechanical precision

**Research Completion Page (`/research/complete`):**

- Real XP calculations using `useEngagementStats` hook
- Database vote history via `useUserVoteHistory` with timestamps
- Fallback to localStorage for backward compatibility
- Enhanced loading states and error handling

### Progress Bar System

**How It Works:**

```typescript
// useProjectStats hook looks for specific database entries:
// 1. Direct completion percentage: 'project_completion_percentage' stat
// 2. Milestone-based calculation: completed_milestones / total_milestones * 100
// 3. Fallback to 15% if no data available

const calculateOverallProgress = () => {
  // Look for direct completion stat
  const completionStat = data["project_completion_percentage"];
  if (completionStat) {
    return parseInt(completionStat.value) || 15;
  }

  // Calculate from milestones
  const completed = parseInt(data["completed_milestones"]?.value) || 0;
  const total = parseInt(data["total_milestones"]?.value) || 1;
  return Math.round((completed / total) * 100);
};
```

**Database Setup for Progress:**
To update the progress bar, add entries to the `project_stats` table:

```sql
-- Option 1: Direct percentage
INSERT INTO project_stats (stat_key, stat_value, description)
VALUES ('project_completion_percentage', '25', 'Overall project completion');

-- Option 2: Milestone-based
INSERT INTO project_stats (stat_key, stat_value, description)
VALUES ('completed_milestones', '3', 'Number of completed milestones');
INSERT INTO project_stats (stat_key, stat_value, description)
VALUES ('total_milestones', '12', 'Total planned milestones');

-- Current phase description
INSERT INTO project_stats (stat_key, stat_value, description)
VALUES ('current_phase', 'Phase 3: Frontend Integration', 'Current development phase');
```

**Progress Bar Features:**

- Dynamic width based on real completion percentage
- Loading state with pulse animation
- Current phase description from database
- Fallback to hardcoded values if database is unavailable
- Accessible with proper ARIA labels

### Real-time Data Flow

**Vote Submission Process:**

1. User clicks vote option → Optimistic UI update (immediate visual feedback)
2. `useVoteSubmission` hook submits vote via tRPC API
3. Backend validates, prevents duplicates, applies rate limiting
4. Vote recorded + XP awarded + stats updated
5. Real-time stats propagated via WebSocket to all connected clients
6. UI shows XP toast notification and updates vote counts

**Statistics Aggregation:**

1. Vote submitted → Stats cache updated immediately for UX
2. Batch processor collects stats updates (5s delay or 50 max items)
3. Database transaction applies all stat updates atomically
4. Real-time subscriptions notify all clients of new stats
5. Components automatically re-render with updated data

**Error Handling:**

- Optimistic updates reverted on submission failure
- Toast notifications for different error types (duplicate vote, rate limit, network)
- Graceful fallback to cached/hardcoded values during network issues
- Retry mechanisms for failed API calls

---

## 🏆 Phase 4: XP System & Engagement Tracking

### XP Reward System

**Progressive XP Calculation:**

```typescript
// XP rewards based on vote count milestones
function calculateXpForVote(voteNumber: number): number {
  if (voteNumber <= 5) return 5; // First 5 votes: 5 XP each
  if (voteNumber <= 10) return 10; // Votes 6-10: 10 XP each
  if (voteNumber <= 25) return 15; // Votes 11-25: 15 XP each
  if (voteNumber <= 50) return 20; // Votes 26-50: 20 XP each
  if (voteNumber <= 100) return 25; // Votes 51-100: 25 XP each
  if (voteNumber <= 250) return 50; // Votes 101-250: 50 XP each
  return 100; // Votes 250+: 100 XP each
}
```

**XP Recording Process:**

1. User submits vote → Progressive XP calculated based on their vote count
2. XP transaction recorded in `xp_ledger` table with action type "vote"
3. Voter's total vote count incremented
4. Total XP calculated and returned in API response
5. Toast notification shows: "+15 XP earned • Total XP: 245"

### Engagement Analytics

**Streak Calculation:**

```typescript
// Calculate consecutive voting days
function calculateStreakDays(voteDates: Date[]): number {
  // Gets unique voting days, checks for consecutive dates
  // Streak resets if no vote today or yesterday
  // Returns current streak length in days
}
```

**Milestone System:**

- **Getting Started**: 10 votes → 50 XP bonus
- **Community Member**: 25 votes → 100 XP bonus
- **Active Participant**: 50 votes → 250 XP bonus
- **Community Champion**: 100 votes → 500 XP bonus
- **Superoptimised Builder**: 250 votes → 1000 XP bonus

**Analytics Endpoint (`getEngagementStats`):**

```typescript
api.vote.getEngagementStats.useQuery({
  voterTokenId: "optional-for-user-specific-stats",
  includeMilestones: true,
});
// Returns: global stats, user stats, milestones, leaderboard
```

### XP Claiming System

**Secure Claiming Process:**

1. **Claim Initiation**: User opens `ClaimXpModal` component
2. **Email Verification**: User enters email → `claimXP` endpoint creates claim record
3. **Magic Link Email**: Resend sends styled email with 24-hour expiration token
4. **Token Validation**: `/api/claim-xp?token=...` validates and processes claim
5. **Success Page**: User redirected to `/claim-xp/success` with XP total

**Database Flow:**

```sql
-- XP claim record created
INSERT INTO xp_claims (voter_token_id, email, claim_token, total_xp, expires_at, status)
VALUES (..., 'pending');

-- After successful claim
UPDATE xp_claims SET status = 'claimed', claimed_at = NOW() WHERE claim_token = ?;
```

**Email Template Features:**

- Beautiful HTML email with XP total prominently displayed
- Secure magic link with expiration notice
- Privacy messaging about anonymous voting protection
- Branded styling consistent with app design

**Error Handling:**

- **Invalid/Expired Links**: `/claim-xp/invalid` with helpful troubleshooting
- **System Errors**: `/claim-xp/error` with error codes and support info
- **Duplicate Claims**: Prevention at database level with user-friendly messaging

### Security & Privacy

**Anonymous Protection:**

- XP claiming doesn't compromise voting anonymity
- Voter tokens remain hashed and unlinkable to emails
- Email used only for claim verification, not vote tracking
- Privacy notice in all claim interfaces

**Rate Limiting & Validation:**

- One claim per voter token (prevents double claiming)
- 24-hour magic link expiration
- Secure token generation with crypto.randomUUID()
- Email validation with Zod schemas

### Testing the XP System

**Manual Testing Flow:**

1. Vote on questions to earn XP (watch progressive rewards)
2. Check XP totals in vote submission toasts
3. Test engagement stats API for streaks and milestones
4. Claim XP via modal → check email → complete claim process
5. Verify claim success page shows correct totals

**Database Verification:**

```sql
-- Check XP transactions
SELECT * FROM xp_ledger WHERE voter_token_id = 'token-id';

-- Check engagement stats
SELECT voter_token_id, COUNT(*) as vote_count, SUM(xp_amount) as total_xp
FROM xp_ledger GROUP BY voter_token_id;

-- Check claim records
SELECT * FROM xp_claims WHERE status = 'claimed';
```

---

## 🏗️ Phase 5: Content Management System

### Dynamic Content Blocks

**Database-Driven Content:**

```typescript
// Content blocks replace hardcoded strings
export interface ContentBlock {
  id: string;
  pageKey: string; // 'homepage_hero', 'about_mission'
  blockKey: string; // 'title', 'description', 'stats'
  contentType: string; // 'text', 'json', 'markdown'
  content: string;
  version: number;
  isActive: boolean;
}
```

**Content API Endpoints:**

- `getContentBlocks` - Fetch all content for a page
- `updateContentWithVersion` - Update content with versioning
- `rollbackContent` - Rollback to previous version
- `compareVersions` - Compare different content versions
- `getVersioningStats` - Content versioning analytics

### Blog Post Management & Markdown System

**Blog Post API:**

```typescript
// Blog posts with pagination and filtering
api.blog.getBlogPosts.useQuery({
  page: 1,
  limit: 10,
  postType: "journey", // "blog" | "journey" | "announcement"
  featured: true,
  search: "markdown",
});
```

**Enhanced Markdown Renderer:**

- **Security**: XSS protection via `rehype-sanitize`
- **Syntax Highlighting**: Code blocks with `react-syntax-highlighter`
- **Interactive Features**: Copy-to-clipboard, heading anchors
- **Responsive Design**: Tables, images, and responsive layouts
- **Multiple Variants**: article, blog, documentation, comment styles

**Markdown Features:**

```typescript
<MarkdownRenderer
  content={post.content}
  variant="blog"
  enableSyntaxHighlight={true}
  showHeadingAnchors={true}
  showCopyButton={true}
/>
```

**Supported Elements:**

- Code blocks with syntax highlighting (JavaScript, TypeScript, Python, etc.)
- Headings with clickable anchors for deep linking
- External links with indicators and security attributes
- Tables with responsive overflow handling
- Images with lazy loading and proper sizing
- Blockquotes with styled borders and background

### Project Timeline Integration

**Real-time Timeline (`/timeline`):**

- Displays project phases with real completion dates
- Milestone tracking with completion percentages
- Community milestones (votes, XP, subscribers)
- Development milestones (phase completions)
- Follows Elevated Brutalism design system

**Timeline Data Sources:**

```typescript
// Timeline events from multiple sources
interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: Date | null;
  type: "phase" | "milestone" | "feature" | "community";
  status: "completed" | "in_progress" | "upcoming";
  completionPercentage?: number;
  category?: string;
}
```

### Milestone Tracking System

**Automated Progress Tracking:**

```typescript
// Progress events trigger automatic updates
export async function onVoteSubmitted(voterTokenId: string, questionId: string) {
  await trackProgressEvent({
    type: "vote_submitted",
    data: { voterTokenId, questionId },
    timestamp: new Date(),
  });
}

// Milestones tracked automatically
const voteMilestones = [25, 50, 100, 250, 500, 1000];
const xpMilestones = [100, 500, 1000, 2500, 5000];
const newsletterMilestones = [10, 25, 50, 100, 250];
```

**Progress Calculation:**

- Overall project completion: 42% (18/43 tasks)
- Current phase: Phase 5 (Content Management System)
- Real-time milestone detection and database updates
- Integration with existing vote and XP systems

### Content Versioning

**Version Control for Content:**

- Every content update creates a new version
- Rollback capability to any previous version
- Change tracking with reasons and timestamps
- Comparison between versions with diff calculation

**Versioning API:**

```typescript
// Create new version
await createContentVersion(
  contentBlockId,
  newContent,
  "Updated based on user feedback",
  "admin-user-id"
);

// Rollback to previous version
await rollbackContentToVersion(
  contentBlockId,
  targetVersion,
  "Reverted due to error",
  "admin-user-id"
);
```

### Server Component Architecture

**Homepage Content (`/`):**

- `ProjectAnnouncement` now Server Component
- Fetches content from database with fallbacks
- Bold text parsing (**text** → `<strong>text</strong>`)

**About Page Content (`/about`):**

- `AboutPageWrapper` Server Component wraps client component
- Structured content interface with type safety
- Complex content parsing (line breaks, mentions, links)

**Testing Content System:**

1. Update content blocks in database
2. See immediate changes on website (5min cache)
3. Test version history and rollback functionality
4. Monitor timeline for real-time progress updates

| File                                                          | Purpose                                                                                                                       |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| [`database-schema.md`](./docs/database-schema.md)             | Complete database design with 12 tables for interactive features                                                              |
| [`tasks.md`](./docs/tasks.md)                                 | 100+ story-point tasks organized in 13 phases for continued development                                                       |
| [`dynamic-update-system.md`](./docs/dynamic-update-system.md) | Technical deep dive into real-time data flow, progress bar logic, and XP system architecture                                  |
| [`design-system.md`](./design-system.md)                      | Describes the Superoptimised design system: colour palette, typography scale, spacing tokens, and atomic component standards. |
| [`front-enddesign-prompts.md`](./front-enddesign-prompts.md)  | Curated prompts for AI pair-programmers to generate pixel-perfect UI code that adheres to the design system.                  |

---

## 📧 Phase 7: Newsletter System Integration

### Architecture Overview

The newsletter system implements a secure, scalable email subscription service with double opt-in verification, real-time statistics, and comprehensive analytics. Built on tRPC with Prisma ORM and Resend email service.

### Database Schema

```typescript
model NewsletterSubscriber {
  id                String    @id @default(cuid())
  email             String    @unique
  name              String?
  sourcePage        String?   // Track signup source (homepage, journey, etc.)
  preferences       Json      @default("{}")
  status            String    @default("pending") // pending, confirmed, unsubscribed
  verificationToken String?
  confirmedAt       DateTime?
  unsubscribedAt    DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

// Live statistics integration
model LiveStat {
  statKey     String   @unique // newsletter_subscribers
  statValue   Int      // Real-time count
  lastUpdated DateTime @default(now())
}

// Daily analytics tracking
model AnalyticsDaily {
  date              DateTime @unique @db.Date
  newsletterSignups Int      @default(0)
  // ... other analytics fields
}
```

### API Endpoints

**Newsletter Router (`/api/trpc/newsletter`):**

```typescript
// Subscribe to newsletter
api.newsletter.subscribe.useMutation({
  email: "user@example.com",
  name: "John Doe",
  sourcePage: "homepage",
  preferences: { weeklyUpdates: true, announcements: true },
});

// Confirm subscription via email token
api.newsletter.confirm.useMutation({
  token: "verification-token-from-email",
});

// Unsubscribe from newsletter
api.newsletter.unsubscribe.useMutation({
  email: "user@example.com",
});

// Get newsletter statistics
api.newsletter.getStats.useQuery(); // Returns subscriber counts and sources

// Update subscription preferences
api.newsletter.updatePreferences.useMutation({
  email: "user@example.com",
  preferences: { weeklyUpdates: false },
});
```

### Component Architecture

**1. NewsletterSignup Component (`/src/components/molecules/NewsletterSignup.tsx`)**

Multi-variant signup form with three display modes:

```typescript
// Card variant - standalone signup card
<NewsletterSignup
  variant="card"
  title="Stay Updated"
  description="Get weekly building insights"
  sourcePage="homepage"
/>

// Inline variant - compact horizontal form
<NewsletterSignup
  variant="inline"
  placeholder="your@email.com"
  buttonText="Subscribe"
  sourcePage="sidebar"
/>

// Banner variant - prominent call-to-action
<NewsletterSignup
  variant="banner"
  title="Join 100+ Builders"
  showIcon={true}
  sourcePage="journey"
/>
```

**Features:**

- Real-time form validation with error handling
- Loading states with button disable
- Success state with confirmation message
- tRPC integration with automatic error handling
- Responsive design across all variants
- Source tracking for analytics

**2. NewsletterSection Component (`/src/components/templates/Homepage/NewsletterSection.tsx`)**

Homepage-specific newsletter section with:

```typescript
// Real-time subscriber count
const { data: stats } = api.newsletter.getStats.useQuery();
const builderCount = stats?.confirmedSubscribers || 0;

// XP integration
const { showXPToast } = useContext(XPToastContext);

// Success handling with XP reward
onSuccess: () => {
  showXPToast("+5 XP • Newsletter signup!");
  setIsSubscribed(true);
};
```

**3. MidNewsletterCTA Component (`/src/components/templates/JourneyPage/MidNewsletterCTA.tsx`)**

Journey page mid-content newsletter signup with contextual messaging about decision updates.

**4. Newsletter Confirmation Page (`/src/app/newsletter/confirm/page.tsx`)**

Dedicated confirmation page handling:

```typescript
// Token verification flow
const confirmMutation = api.newsletter.confirm.useMutation({
  onSuccess: (data) => {
    setConfirmationState("success");
    setEmail(data.email);
  },
  onError: (error) => {
    setConfirmationState("error");
    setErrorMessage(error.message);
  },
});

// URL token parsing
const token = useSearchParams().get("token");
useEffect(() => {
  if (token) {
    confirmMutation.mutate({ token });
  }
}, [token]);
```

### Email System Integration

**Confirmation Email Template:**

```typescript
// Automated email sending
async function sendConfirmationEmail(email: string, name: string, token: string) {
  const confirmationUrl = `${process.env.SITE_URL}/newsletter/confirm?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Confirm your newsletter subscription",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Confirm Your Newsletter Subscription</h2>
        <p>Hi ${name || "there"}!</p>
        <p>Thank you for subscribing to our newsletter.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Confirm Subscription
          </a>
        </div>
        
        <p>If you didn't subscribe, you can safely ignore this email.</p>
      </div>
    `,
  });
}
```

**Email Features:**

- Professional HTML templates with responsive design
- Branded styling consistent with site design
- Secure token-based verification links
- Fallback text for accessibility
- Unsubscribe link in footer
- Error handling for failed sends

### Real-time Statistics Integration

**Live Stats Updates:**

```typescript
// Newsletter subscriber count updates
async function updateNewsletterStats() {
  const confirmedCount = await prisma.newsletterSubscriber.count({
    where: { status: "confirmed" },
  });

  await prisma.liveStat.upsert({
    where: { statKey: "newsletter_subscribers" },
    update: {
      statValue: confirmedCount,
      lastUpdated: new Date(),
    },
    create: {
      statKey: "newsletter_subscribers",
      statValue: confirmedCount,
      lastUpdated: new Date(),
    },
  });
}
```

**Community Stats Integration:**

```typescript
// Real-time newsletter subscriber count display
export function useCommunityStats() {
  const { data } = api.content.getCommunityStats.useQuery();

  return {
    newsletterSubscribers: data?.newsletterSubscribers || 0,
    // ... other stats
  };
}
```

### Analytics & Tracking

**Daily Analytics:**

```typescript
// Track newsletter signups per day
async function updateDailyAnalytics() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.analyticsDaily.upsert({
    where: { date: today },
    update: {
      newsletterSignups: { increment: 1 },
    },
    create: {
      date: today,
      newsletterSignups: 1,
    },
  });
}
```

**Source Attribution:**

```typescript
// Newsletter signup sources tracking
const signupSources = await prisma.newsletterSubscriber.groupBy({
  by: ["sourcePage"],
  _count: { id: true },
  where: { status: "confirmed" },
});

// Returns: [
//   { source: "homepage", count: 45 },
//   { source: "journey", count: 23 },
//   { source: "about", count: 12 }
// ]
```

### Error Handling & Validation

**Input Validation:**

```typescript
// Zod schema validation
const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  sourcePage: z.string().optional(),
  preferences: z.record(z.boolean()).optional(),
});
```

**Error States:**

```typescript
// Comprehensive error handling
try {
  await subscribeMutation.mutateAsync({ email, sourcePage });
} catch (error) {
  if (error.code === "CONFLICT") {
    setError("Email is already subscribed");
  } else if (error.code === "INTERNAL_SERVER_ERROR") {
    setError("Something went wrong. Please try again.");
  } else {
    setError(error.message);
  }
}
```

**Duplicate Prevention:**

```typescript
// Check for existing subscriptions
const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
  where: { email },
});

if (existingSubscriber?.status === "confirmed") {
  throw new TRPCError({
    code: "CONFLICT",
    message: "Email is already subscribed to newsletter",
  });
}
```

### Testing & Verification

**Manual Testing Steps:**

1. **Subscription Flow:**

   ```bash
   # Test newsletter signup
   1. Navigate to homepage
   2. Enter email in newsletter form
   3. Click "Subscribe"
   4. Verify success message shows
   5. Check email for confirmation link
   6. Click confirmation link
   7. Verify confirmation page shows success
   ```

2. **Real-time Stats:**

   ```bash
   # Verify subscriber count updates
   1. Note current subscriber count on homepage
   2. Complete newsletter signup and confirmation
   3. Refresh homepage - count should increment by 1
   4. Check /about page - same count should display
   ```

3. **Error Handling:**

   ```bash
   # Test duplicate prevention
   1. Subscribe with email address
   2. Try to subscribe again with same email
   3. Should show "Email is already subscribed" error
   ```

**API Testing:**

```typescript
// Test newsletter endpoints
describe("Newsletter API", () => {
  it("should create pending subscription", async () => {
    const result = await caller.newsletter.subscribe({
      email: "test@example.com",
      name: "Test User",
      sourcePage: "homepage",
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Confirmation email sent");
  });

  it("should confirm subscription with valid token", async () => {
    const result = await caller.newsletter.confirm({
      token: "valid-token-123",
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Newsletter subscription confirmed");
  });
});
```

### Performance Considerations

**Caching Strategy:**

```typescript
// Newsletter stats caching
api.newsletter.getStats.useQuery(undefined, {
  staleTime: 30 * 1000, // 30 seconds
  cacheTime: 2 * 60 * 1000, // 2 minutes
  refetchInterval: 60 * 1000, // Refresh every minute
});
```

**Database Optimization:**

```sql
-- Database indexes for performance
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX idx_newsletter_subscribers_source ON newsletter_subscribers(source_page);
CREATE INDEX idx_newsletter_subscribers_created ON newsletter_subscribers(created_at);
```

### Usage Examples

**Homepage Integration:**

```typescript
// Newsletter section with real-time stats
export function NewsletterSection() {
  const { data: stats } = api.newsletter.getStats.useQuery();
  const subscriberCount = stats?.confirmedSubscribers || 0;

  return (
    <section>
      <h2>Join {subscriberCount} Builders</h2>
      <NewsletterSignup
        sourcePage="homepage"
        variant="card"
        title="Stay Updated"
        description="Get weekly building insights"
      />
    </section>
  );
}
```

**Journey Page CTA:**

```typescript
// Mid-content newsletter signup
export function MidNewsletterCTA() {
  return (
    <NewsletterSignup
      sourcePage="journey"
      variant="banner"
      title="Don't Miss the Next Decision"
      description="Major technical choices happen weekly"
      buttonText="Get Weekly Updates"
    />
  );
}
```

**Sidebar Newsletter:**

```typescript
// Compact inline newsletter form
export function SidebarNewsletter() {
  return (
    <NewsletterSignup
      sourcePage="sidebar"
      variant="inline"
      placeholder="your@email.com"
      buttonText="Subscribe"
      showIcon={false}
    />
  );
}
```

### Security Considerations

**Token Security:**

- Cryptographically secure token generation using `crypto.randomBytes(32)`
- Tokens expire after single use (set to null after confirmation)
- No sensitive data in email URLs

**Email Validation:**

- Server-side email format validation
- Duplicate subscription prevention
- Rate limiting on subscription attempts

**Data Privacy:**

- Optional name collection
- Granular subscription preferences
- Easy unsubscribe process
- No tracking pixels in emails

---

## 🔐 Phase 8.1: Admin Dashboard System

### Authentication & Authorization

**Secure Admin Access:**

The admin dashboard implements enterprise-grade role-based access control with the following security features:

- **tRPC Admin Middleware**: Server-side role verification with authentication checks
- **NextAuth Integration**: Leverages existing magic link authentication system
- **Protected Routes**: All `/admin/*` routes require authentication and admin privileges
- **Automatic Redirects**: Unauthorized users redirected to sign-in with callback URLs

### Admin User Management

**Development Admin Accounts:**

The database is seeded with admin accounts for development:

```bash
# Admin accounts created by: npx prisma db seed
admin@superoptimised.com  # Primary admin account
dev@superoptimised.com    # Developer admin account
```

**Role Verification:**

Admin access requires **both** database role and permission flags:

- `User.role = "admin"` **AND** `User.isAdmin = true`
- Dual verification prevents accidental privilege escalation

### Admin Dashboard Features

**Current Implementation (Phase 8.1):**

```typescript
// Access the admin dashboard
http://localhost:3000/admin

// Authentication flow
1. Unauthenticated → /auth/signin?callbackUrl=/admin
2. Non-admin user → /unauthorized
3. Admin user → /admin (dashboard)
```

**Elevated Brutalism Design System Implementation:**

**Admin Dashboard:**

- **Terminal-style Interface**: Command-line aesthetic with `$ whoami`, `$ ls -la`, `$ status` commands
- **Raw Directory Listing**: File system navigation instead of typical admin cards
- **System Status**: Real-time operational status in terminal format
- **Authentic Typography**: Pure monospace (JetBrains Mono) throughout
- **Developer Notes**: Honest commentary about design philosophy
- **Function over Form**: Direct access to tools without unnecessary visual polish

**Admin Sign-in Page:**

- **Terminal Authentication**: `$ sudo login --admin` command prompt styling
- **Raw Form Design**: 2px borders, no gradients, shadows, or rounded corners
- **Technical Details**: Shows target URLs, system messages, session expiration info
- **Honest Loading States**: "[sending magic link...]" instead of generic spinners
- **Security Context**: Clear admin-only messaging and requirements

**Design Differentiation Achieved:**

- Completely avoids generic admin dashboard patterns
- No typical stat cards, widgets, or decorative icons
- Terminal aesthetic creates memorable, distinctive interface
- Follows authentic transparency and honest communication principles

### Testing Admin Access

**Manual Testing Flow:**

1. **Sign in as admin:**

   ```bash
   # Visit admin dashboard
   http://localhost:3000/admin

   # You'll be redirected to sign-in
   # Enter: admin@superoptimised.com
   # Check email for magic link
   # Complete sign-in → redirected to /admin
   ```

2. **Test unauthorized access:**

   ```bash
   # Sign in with regular email (not admin account)
   # Visit: http://localhost:3000/admin
   # Should see: "Access Denied" page
   ```

3. **Test authentication flow:**
   ```bash
   # Visit /admin while not signed in
   # Should redirect to: /auth/signin?callbackUrl=/admin
   # After sign-in, should return to /admin
   ```

### Database Schema

**Admin-related Models:**

```sql
-- User model with admin fields
model User {
  role    UserRole @default(user)  -- "user" | "admin"
  isAdmin Boolean  @default(false) -- Additional permission flag
  -- ... other fields
}

-- Role enumeration
enum UserRole {
  user
  admin
}
```

**Admin User Creation:**

```typescript
// Programmatic admin creation
await prisma.user.create({
  data: {
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
    isAdmin: true,
  },
});
```

### Architecture Details

**tRPC Admin Procedure:**

```typescript
// Admin-only tRPC endpoints
export const adminProcedure = t.procedure
  .use(loggingMiddleware)
  .use(adminMiddleware); // Checks role + isAdmin

// Usage in routers
.mutation(adminProcedure
  .input(createQuestionSchema)
  .mutation(async ({ input, ctx }) => {
    // Only admin users can reach this code
  }));
```

**NextAuth Session Enhancement:**

```typescript
// Session callback includes admin status
session: {
  user: {
    id: string;
    email: string;
    role: "admin" | "user";
    isAdmin: boolean;
    // ... other fields
  }
}
```

### Phase 8.3 Complete: Modern 4-Page Admin Architecture

**NEW: Streamlined Admin System Following Modern UX Patterns**

Based on user feedback, completely redesigned the admin interface from a cramped single-page dashboard to a dedicated 4-page architecture that eliminates navigation clicks and removes all hardcoded data.

**✅ Implemented Features:**

- **✅ Question Management Interface**: Full CRUD operations for all question types
- **✅ All Question Types Supported**: Binary, multi-choice, rating-scale, text-response, ranking, A/B test
- **✅ Question Scheduling**: Start/end date scheduling with terminal-style modal interface
- **✅ Toggle Controls**: Real-time activate/deactivate with optimistic UI updates
- **✅ Card-Based Question Builder**: Replaced dropdown with beautiful card selector
- **✅ Template System Integration**: Direct template access with real data
- **✅ Modern Admin Architecture**: 4 dedicated pages following 2024-2025 UX patterns
- **✅ Navigation Optimization**: Each tab leads to focused, functional interface

**🔄 Current Phase 8.3b - Data Integration:**

- Removing all hardcoded mock data from admin interfaces
- Implementing real tRPC API calls for each admin section
- Adding missing analytics and content tRPC routers
- Creating proper loading states and error handling

**📋 Upcoming Phase 8.3c - Page Development:**

- **Analytics Dashboard**: Real website and questionnaire performance metrics
- **Content Management**: Blog post and template management system
- **Enhanced Questionnaires**: Full database integration with real CRUD operations
- **Central Dashboard**: Data aggregation hub showing overview from all sections

**Admin Architecture Overview:**

```
Admin Header: [DASHBOARD] [QUESTIONNAIRES] [ANALYTICS] [CONTENT] [SIGN OUT]
                   ↓              ↓             ↓          ↓
           Central Overview  Templates &   Performance  Content &
           & Quick Stats    Management     Metrics     Templates
```

**Key UX Improvements:**

- **1-2 Click Maximum**: Optimized workflows for minimal navigation
- **No Hardcoded Data**: All information from real database sources
- **Direct Actions**: Primary actions accessible without deep navigation
- **Card-Based UI**: Visual scanning instead of dropdown interactions
- **Real-Time Updates**: Live data integration across all sections

### Security Considerations

**Role-based Security:**

- No client-side role checking (server-side only)
- Session verification on every admin request
- Automatic session expiration handling
- CSRF protection via NextAuth

**Development vs Production:**

- Development: Seeded admin accounts for testing
- Production: Admin accounts created manually via database
- Email verification required for all admin sign-ins
- No default admin passwords (magic link only)

---

## 🏗️ Tech-Stack Snapshot

- **Framework:** Next.js 15.3.4 (App Router, React 19, Turbopack)
- **Type Safety:** TypeScript ≥ 5.x
- **Styling:** Tailwind CSS 3.4 with design-system tokens
- **Backend:** Prisma ORM 6.11 connected to Supabase Postgres
- **API:** tRPC (latest “next” channel)
- **Auth:** NextAuth 4 (Supabase adapter)
- **Email:** Resend 4.x
- **Markdown:** react-markdown + rehype-sanitize + react-syntax-highlighter
- **Component Lab:** Storybook 8.5 + Chromatic CI
- **Testing:** Jest, React Testing Library, Playwright (e2e)

## 🚀 Quick Start

```bash
# Install deps
npm install

# Prepare database
npx prisma migrate dev

# Seed database with initial questions and content
npx prisma db seed

# Setup Supabase Realtime (run SQL in Supabase SQL Editor)
# See docs/supabase-setup.sql for required policies

# Run dev servers (Next.js + Storybook)
npm run dev            # http://localhost:3000
npm run storybook      # http://localhost:6006
```

## 🗳️ Testing the Complete Interactive System

Once running, you can test the full interactive voting and data system:

**Frontend Voting Experience:**

1. Visit the homepage (`/`) to see real questions from database
2. Vote on questions (anonymous, no login required)
3. See immediate optimistic UI updates and XP toast notifications with progressive rewards
4. Watch vote counts update in real-time across all components
5. Test error scenarios (duplicate votes, rate limiting)

**XP System Testing:**

1. Vote multiple times to see progressive XP rewards (5→10→15→20→25→50→100)
2. Check toast notifications show actual XP earned and total: "+15 XP earned • Total XP: 245"
3. Test XP claiming modal (requires email verification)
4. Check email for magic link and complete claim process
5. Verify success page shows correct XP totals and achievement status

**Live Data Integration:**

1. Check community stats on Homepage, About (`/about`), and Journey (`/journey`) pages
2. Verify all statistics are pulling from database (not hardcoded)
3. Watch progress bar on homepage reflect real project completion
4. Test stats refresh (30s intervals) and WebSocket real-time updates

**Admin Dashboard Testing:**

1. **Test admin authentication:**

   ```bash
   # Visit http://localhost:3000/admin
   # Sign in with: admin@superoptimised.com
   # Should access admin dashboard successfully
   ```

2. **Test unauthorized access:**

   ```bash
   # Sign in with regular email (not admin account)
   # Visit /admin → should see "Access Denied" page
   ```

3. **Test admin features:**
   ```bash
   # Check statistics cards display "--" (placeholder)
   # Navigate through quick action links
   # Test sign-out from admin header
   ```

**Progress Bar Testing:**

1. Insert project stats into database to see progress bar update:

   ```sql
   INSERT INTO project_stats (stat_key, stat_value, description)
   VALUES ('project_completion_percentage', '50', 'Halfway milestone reached');
   ```

2. Refresh page to see progress bar width change to 50%
3. Update current phase description to see text change

**API Testing:**

- Test tRPC endpoints at `/api/trpc`
- Monitor network tab for real-time WebSocket connections
- Check database for vote records and stat updates

**Real-time Features:**

- Vote counts update instantly via WebSocket across all tabs/users
- Community stats refresh automatically every minute
- Progress indicators reflect latest database values
- Graceful fallback to polling if WebSocket fails
- Error handling with toast notifications

## 📂 Directory Overview

```plaintext
app/               → Next.js routes (App Router)
  ├─ api/claim-xp/ → XP claiming API route
  └─ claim-xp/     → XP claim success/error pages
src/
  ├─ components/   → Atomic/molecular/organism UI
  │   └─ ui/       → ClaimXpModal component
  ├─ hooks/        → React hooks for data fetching & voting
  │   ├─ useActiveQuestions.ts    → Real questions from database
  │   ├─ useCommunityStats.ts     → Live community statistics
  │   ├─ useVoteSubmission.ts     → Secure vote submission with XP
  │   ├─ useProjectStats.ts       → Project completion data
  │   └─ useClaimXp.ts           → XP claiming modal management
  ├─ lib/          → tRPC routers, utilities
  │   ├─ api/      → tRPC routers (question, vote, content)
  │   │   └─ routers/voteRouter.ts → Enhanced with XP & engagement
  │   ├─ email/    → Email templates and sending
  │   │   └─ templates/XpClaimEmail.tsx → XP claim email template
  │   └─ trpc/     → React Query integration
  └─ stories/      → .stories.tsx files for Storybook
prisma/            → Database schema & migrations
docs/              → Documentation including dynamic-update-system.md
```

## 🛡️ Security & Compliance

This project is pinned to dependencies with **no known vulnerabilities (`npm audit`)** as of 2025-07-01. Automated Dependabot and GitHub Actions workflows keep the stack up-to-date.

## 📄 Contributing to Docs

The documentation is source-controlled. To amend a doc:

1. Edit the relevant Markdown file in `docs/`.
2. Commit with a conventional message, e.g. `docs: clarify Tailwind tokens`.
3. Open a pull request – CI will lint Markdown and spell-check.

---

Made with ❤️ and **AI-assisted code**.
