# 📚 Project Documentation Index

Welcome to the **Superoptimised Next.js AI Starter** documentation hub. This file links out to the living documents inside the `docs` folder and gives newcomers a bird’s-eye view of what each document contains.

## 🎯 Interactive Database Features

**Phase 1 Complete**: Core tRPC API foundation with anonymous voting system
**Phase 2 Complete**: Real-time Updates & WebSocket Integration  
**Phase 3 Complete**: Frontend Integration & localStorage Migration
**Phase 4 Complete**: XP System & Engagement Tracking with Email Claiming

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
  if (voteNumber <= 5) return 5;    // First 5 votes: 5 XP each
  if (voteNumber <= 10) return 10;  // Votes 6-10: 10 XP each
  if (voteNumber <= 25) return 15;  // Votes 11-25: 15 XP each
  if (voteNumber <= 50) return 20;  // Votes 26-50: 20 XP each
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
  includeMilestones: true
})
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

| File                                                         | Purpose                                                                                                                       |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| [`database-schema.md`](./docs/database-schema.md)            | Complete database design with 12 tables for interactive features                                                              |
| [`tasks.md`](./docs/tasks.md)                                | 100+ story-point tasks organized in 13 phases for continued development                                                       |
| [`dynamic-update-system.md`](./docs/dynamic-update-system.md) | Technical deep dive into real-time data flow, progress bar logic, and XP system architecture                                  |
| [`design-system.md`](./design-system.md)                     | Describes the Superoptimised design system: colour palette, typography scale, spacing tokens, and atomic component standards. |
| [`front-enddesign-prompts.md`](./front-enddesign-prompts.md) | Curated prompts for AI pair-programmers to generate pixel-perfect UI code that adheres to the design system.                  |

---

## 🏗️ Tech-Stack Snapshot

- **Framework:** Next.js 15.3.4 (App Router, React 19, Turbopack)
- **Type Safety:** TypeScript ≥ 5.x
- **Styling:** Tailwind CSS 3.4 with design-system tokens
- **Backend:** Prisma ORM 6.11 connected to Supabase Postgres
- **API:** tRPC (latest “next” channel)
- **Auth:** NextAuth 4 (Supabase adapter)
- **Email:** Resend 4.x
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

```
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
