# Interactive Database Integration - Task Breakdown

## Current Status ✅

- ✅ Database schema design and implementation (12 tables)
- ✅ Prisma migration applied to Supabase
- ✅ Database seeded with 11 questions and initial content
- ✅ Comprehensive documentation created
- ✅ **Phase 1 COMPLETE**: Core tRPC API Foundation with anonymous voting system
- ✅ **Phase 2 COMPLETE**: Real-time Updates & WebSocket Integration with Supabase
- ✅ **Phase 3 COMPLETE**: Frontend Integration & localStorage Migration
- ✅ **Phase 4 COMPLETE**: XP System & Engagement Tracking with Email Claiming

**Status**: All core phases implemented and production-ready

- ✅ **Phase 5 COMPLETE**: Content Management System with dynamic content blocks, milestone tracking, and timeline integration

---

## Phase 1: Core tRPC API Foundation (High Priority) ✅ COMPLETED

### 1.1 Basic tRPC Infrastructure ✅

- ✅ **Task 1.1.1**: Create empty tRPC routers structure (questionRouter, voteRouter, contentRouter)
- ✅ **Task 1.1.2**: Add Zod validation schemas for all voting operations
- ✅ **Task 1.1.3**: Implement error handling and formatting for tRPC responses
- ✅ **Task 1.1.4**: Add tRPC middleware for request logging and performance monitoring

### 1.2 Question Management API ✅

- ✅ **Task 1.2.1**: Implement `getActiveQuestions` endpoint (public, returns active questions by category)
- ✅ **Task 1.2.2**: Implement `getQuestionById` endpoint (public, returns single question with vote stats)
- ✅ **Task 1.2.3**: Implement `getQuestionResults` endpoint (public, returns aggregated vote percentages)
- ⏭️ **Task 1.2.4**: Add caching layer for question queries (5-minute TTL) - _Implemented with stats cache_

### 1.3 Anonymous Voter Identity System ✅

- ✅ **Task 1.3.1**: Create voter token middleware (generates signed HttpOnly cookie with UUID)
- ✅ **Task 1.3.2**: Implement SHA-256 token hashing on server side
- ✅ **Task 1.3.3**: Create `getOrCreateVoterToken` utility function
- ✅ **Task 1.3.4**: Add IP-based rate limiting middleware (100 votes/24h per IP)

### 1.4 Core Voting API ✅

- ✅ **Task 1.4.1**: Implement `submitVote` mutation (prevents duplicate votes, stores response)
- ✅ **Task 1.4.2**: Add vote validation logic (question exists, is active, valid response format)
- ✅ **Task 1.4.3**: Implement vote aggregation utilities (real-time vote counting)
- ✅ **Task 1.4.4**: Add duplicate vote prevention (check voter token hash + question ID)

---

## Phase 2: Real-time Updates & WebSocket Integration (High Priority) ✅ COMPLETED

### 2.1 Supabase Realtime Setup ✅

- ✅ **Task 2.1.1**: Enable Supabase Realtime on `question_responses` table
- ✅ **Task 2.1.2**: Configure Supabase RLS policies for realtime subscriptions
- ✅ **Task 2.1.3**: Create `useRealtimeVotes` hook for live vote count updates
- ✅ **Task 2.1.4**: Add fallback polling mechanism (15s intervals) for WebSocket failures

### 2.2 Live Statistics Integration ✅

- ✅ **Task 2.2.1**: Implement `getCommunityStats` endpoint (total votes, active questions, etc.)
- ✅ **Task 2.2.2**: Create real-time stats aggregation (update `live_stats` table on votes)
- ✅ **Task 2.2.3**: Add `useRealtimeStats` hook for homepage community stats
- ✅ **Task 2.2.4**: Implement stats caching and batch updates for performance

---

## Phase 3: Frontend Integration & localStorage Migration (High Priority) ✅ COMPLETED

### 3.1 Homepage Polls Integration ✅

- ✅ **Task 3.1.1**: Replace `DualInteractivePolls` localStorage with tRPC `getActiveQuestions`
- ✅ **Task 3.1.2**: Replace vote submission localStorage with tRPC `submitVote` mutation
- ✅ **Task 3.1.3**: Add optimistic UI updates for voting (immediate visual feedback)
- ✅ **Task 3.1.4**: Replace hardcoded "2 votes" with real-time vote counts

### 3.2 Community Stats Replacement ✅

- ✅ **Task 3.2.1**: Replace homepage community stats with `getCommunityStats` API
- ✅ **Task 3.2.2**: Replace About page stats with real database values
- ✅ **Task 3.2.3**: Replace Journey page community metrics with live data
- ✅ **Task 3.2.4**: Update progress indicator with real project completion percentage

### 3.3 Error Handling & Loading States ✅

- ✅ **Task 3.3.1**: Add skeleton loaders for question fetching states
- ✅ **Task 3.3.2**: Implement error toasts for vote submission failures
- ✅ **Task 3.3.3**: Add network error recovery mechanisms
- ✅ **Task 3.3.4**: Grey out components after successful vote submission

---

## Phase 4: XP System & Engagement Tracking (Medium Priority) ✅ COMPLETED

### 4.1 XP Ledger Integration ✅

- ✅ **Task 4.1.1**: Implement `recordXP` mutation (triggered after vote submission)
- ✅ **Task 4.1.2**: Update XP toast system to use real database XP totals
- ✅ **Task 4.1.3**: Create `getEngagementStats` endpoint (streaks, totals, milestones)
- ✅ **Task 4.1.4**: Add XP calculation logic (progressive rewards: 5, 10, 15, 20, 25, 50, 100)

### 4.2 XP Claiming System ✅

- ✅ **Task 4.2.1**: Create "Claim XP" modal component with email input
- ✅ **Task 4.2.2**: Implement `claimXP` endpoint with email verification
- ✅ **Task 4.2.3**: Add Resend email integration for XP claim magic links
- ✅ **Task 4.2.4**: Create `/claim-xp?token=` route handler and confirmation page

### 4.3 Engagement Analytics ✅

- ✅ **Task 4.3.1**: Implement daily engagement aggregation (populate `analytics_daily`)
- ✅ **Task 4.3.2**: Add streak tracking logic (reset at midnight, milestone rewards)
- ✅ **Task 4.3.3**: Create engagement milestone system (10, 25, 50, 100 votes)
- ✅ **Task 4.3.4**: Add participation leaderboard queries (anonymous top performers)

---

## Phase 5: Content Management System (Medium Priority) ✅ COMPLETED

### 5.1 Dynamic Content Integration ✅

- ✅ **Task 5.1.1**: Create `getContentBlocks` endpoint for page content
- ✅ **Task 5.1.2**: Replace homepage hero text with database content blocks
- ✅ **Task 5.1.3**: Replace About page mission content with database values
- ✅ **Task 5.1.4**: Add content versioning and rollback capability

### 5.2 Project Stats & Progress ✅

- ✅ **Task 5.2.1**: Create `getProjectStats` endpoint for progress tracking
- ✅ **Task 5.2.2**: Implement milestone tracking system (completion percentages)
- ✅ **Task 5.2.3**: Add automated progress updates based on completed features
- ✅ **Task 5.2.4**: Integrate real milestone data into existing journey page timeline

### 5.3 Blog Post Management

- ✅ **Task 5.3.1**: Create `getBlogPosts` endpoint with pagination
- ✅ **Task 5.3.2**: Replace hardcoded journey timeline with database posts
- ✅ **Task 5.3.3**: Add Markdown rendering for post content
- **Task 5.3.4**: Implement post slug-based routing (/journey/[slug])

## Phase 5.4 — SEO & Crawl-Optimisation Tasks

| ID        | Task                                          | Acceptance Criteria                                                                                                                                  |
| --------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **5.4.1** | **Create `/robots.txt` route**                | • Returns:<br> `User-agent: *`<br> `Sitemap: <SITE_URL>/sitemap.xml`<br>• Unit test asserts 200 status + exact body                                  |
| **5.4.2** | **Dynamic `/api/sitemap.xml` endpoint**       | • Builds XML from all blog-post slugs **+** static pages (`/`, `/about`, `/journey`) <br>• Sends header `Cache-Control: public, max-age=86400`       |
| **5.4.3** | **Global `metadata` export for static pages** | • Add `export const metadata` to Home, About, Journey pages <br>• Fields: `title`, `description`, `openGraph` — populated from DB/content blocks     |
| **5.4.4** | **Dynamic post-level metadata**               | • In `/journey/[slug]`, fetch post → return `metadata` incl. OG image <br>• 404 if slug not found                                                    |
| **5.4.5** | **Canonical URL helper**                      | • Inject `<link rel="canonical">` on every page <br>• Helper derives URL from `SITE_URL` env var <br>• Jest test verifies correct domain             |
| **5.4.6** | **Default OG image fallback**                 | • Place `/public/og-default.png` <br>• Metadata uses fallback when post lacks cover image                                                            |
| **5.4.7** | **JSON-LD breadcrumbs on post pages**         | • Inject `<script type="application/ld+json">` with `BreadcrumbList` (Home → Journey → Post) <br>• JSON parses without error in unit test            |
| **5.4.8** | **Build-time sitemap/robots generation**      | • Add `next-sitemap.js` (or custom script) <br>• `npm run build` outputs `public/sitemap.xml` & `public/robots.txt` <br>• CI checks both files exist |

> **Env note:** define `SITE_URL` as `http://localhost:3000` during development and switch to the production domain before launch.

---

## Phase 6: Advanced Question Types (Medium Priority)

### 6.1 Multi-Choice Questions

- **Task 6.1.1**: Add support for multiple choice questions (3-4 options)
- **Task 6.1.2**: Create MultipleChoiceQuestion component
- **Task 6.1.3**: Update vote submission to handle multiple choice responses
- **Task 6.1.4**: Add results visualization for multiple choice (bar charts)

### 6.2 Rating Scale Questions

- **Task 6.2.1**: Add support for rating scale questions (1-10, star ratings)
- **Task 6.2.2**: Create RatingScaleQuestion component with touch/mouse support
- **Task 6.2.3**: Update vote aggregation for average rating calculations
- **Task 6.2.4**: Add rating distribution visualization (histogram)

### 6.3 Text & Ranking Questions

- **Task 6.3.1**: Add support for short text response questions
- **Task 6.3.2**: Create drag-and-drop ranking question component
- **Task 6.3.3**: Implement text response moderation and filtering
- **Task 6.3.4**: Add ranking result visualization (priority order)

---

## Phase 7: Newsletter System Integration (Medium Priority)

### 7.1 Newsletter API

- **Task 7.1.1**: Create `subscribeNewsletter` mutation with email validation
- **Task 7.1.2**: Implement double opt-in flow with Resend integration
- **Task 7.1.3**: Add unsubscribe endpoint and page
- **Task 7.1.4**: Create newsletter preference management system

### 7.2 Subscription Analytics

- **Task 7.2.1**: Track newsletter signup sources (which page/component)
- **Task 7.2.2**: Add newsletter subscriber count to live stats
- **Task 7.2.3**: Implement subscription preference analytics
- **Task 7.2.4**: Add XP rewards for newsletter subscription (+5 XP)

---

## Phase 8: Admin Dashboard (Medium Priority)

### 8.1 Admin Authentication & Authorization

- **Task 8.1.1**: Create admin role verification middleware
- **Task 8.1.2**: Protect /admin routes with NextAuth role guard
- **Task 8.1.3**: Add admin user seeding to database seed script
- **Task 8.1.4**: Create admin login flow and session management

### 8.2 Question Management Interface

- **Task 8.2.1**: Create question list page with filtering and sorting
- **Task 8.2.2**: Add "New Question" form with all question type support
- **Task 8.2.3**: Implement question activate/deactivate toggle controls
- **Task 8.2.4**: Add question scheduling interface (start/end dates)

### 8.3 Analytics Dashboard

- **Task 8.3.1**: Create real-time voting analytics charts (Chart.js/Recharts)
- **Task 8.3.2**: Add community engagement metrics dashboard
- **Task 8.3.3**: Implement vote response export functionality (CSV)
- **Task 8.3.4**: Add question performance analytics (response rates, completion)

### 8.4 Content Management Interface

- **Task 8.4.1**: Create content block editing interface
- **Task 8.4.2**: Add blog post creation and editing forms
- **Task 8.4.3**: Implement project stats management interface
- **Task 8.4.4**: Add content preview and publishing workflow

---

## Phase 9: Mobile & Touch Optimization (Lower Priority)

### 9.1 Touch Interface Improvements

- **Task 9.1.1**: Optimize voting components for mobile touch targets (44px minimum)
- **Task 9.1.2**: Add haptic feedback for mobile voting interactions
- **Task 9.1.3**: Implement swipe gestures for question navigation
- **Task 9.1.4**: Add mobile-specific loading states and error handling

### 9.2 Responsive Design Enhancements

- **Task 9.2.1**: Optimize poll layouts for mobile screens
- **Task 9.2.2**: Add mobile-specific typography and spacing
- **Task 9.2.3**: Implement mobile navigation for admin dashboard
- **Task 9.2.4**: Add pull-to-refresh for mobile question updates

---

## Phase 10: Social Media Integration (Lower Priority)

### 10.1 Twitter/X Integration

- **Task 10.1.1**: Add Twitter sharing for vote participation
- **Task 10.1.2**: Create social sharing buttons with pre-filled text
- **Task 10.1.3**: Add Twitter card meta tags for social previews
- **Task 10.1.4**: Implement social sharing analytics tracking

### 10.2 Live Social Feeds

- **Task 10.2.1**: Replace hardcoded social activity with Twitter API integration
- **Task 10.2.2**: Add real-time social media mentions tracking
- **Task 10.2.3**: Create social engagement widgets for journey pages
- **Task 10.2.4**: Add social proof elements (recent shares, mentions)

---

## Phase 11: Performance & Security (Lower Priority)

### 11.1 Performance Optimization

- **Task 11.1.1**: Implement query result caching (Redis or in-memory)
- **Task 11.1.2**: Add database query optimization and indexing
- **Task 11.1.3**: Implement code splitting for admin dashboard
- **Task 11.1.4**: Add image optimization for question images

### 11.2 Security Hardening

- **Task 11.2.1**: Add CSRF protection for voting endpoints
- **Task 11.2.2**: Implement Cloudflare Turnstile for bot protection
- **Task 11.2.3**: Add request sanitization and validation
- **Task 11.2.4**: Implement audit logging for admin actions

### 11.3 Data Cleanup & Maintenance

- **Task 11.3.1**: Create scheduled job for old voter token cleanup (12 months)
- **Task 11.3.2**: Implement IP rate limit counter TTL (24 hours)
- **Task 11.3.3**: Add database backup and restore procedures
- **Task 11.3.4**: Create data export utilities for analytics

---

## Phase 12: Testing & Quality Assurance (Ongoing)

### 12.1 Unit Testing

- **Task 12.1.1**: Add unit tests for vote duplicate prevention
- **Task 12.1.2**: Test question activation/deactivation logic
- **Task 12.1.3**: Add unit tests for XP calculation and aggregation
- **Task 12.1.4**: Test rate limiting and security middleware

### 12.2 Integration Testing

- **Task 12.2.1**: Add API integration tests for voting flow
- **Task 12.2.2**: Test real-time WebSocket connections and updates
- **Task 12.2.3**: Add database migration testing
- **Task 12.2.4**: Test email delivery and verification flows

### 12.3 End-to-End Testing

- **Task 12.3.1**: Create Playwright tests for complete voting workflow
- **Task 12.3.2**: Test XP claiming and transfer flow
- **Task 12.3.3**: Add admin dashboard functionality tests
- **Task 12.3.4**: Test mobile touch interactions and responsiveness

### 12.4 Performance Testing

- **Task 12.4.1**: Load test voting endpoints (simulate 1000 votes/day)
- **Task 12.4.2**: Test WebSocket connection limits and scaling
- **Task 12.4.3**: Add database performance monitoring
- **Task 12.4.4**: Test caching effectiveness and invalidation

---

## Phase 13: Documentation & Deployment (Lower Priority)

### 13.1 Technical Documentation

- **Task 13.1.1**: Update README with complete setup instructions
- **Task 13.1.2**: Document all environment variables and configuration
- **Task 13.1.3**: Create API documentation for tRPC endpoints
- **Task 13.1.4**: Add database ER diagram and schema documentation

### 13.2 User Documentation

- **Task 13.2.1**: Create admin dashboard user guide
- **Task 13.2.2**: Document question creation best practices
- **Task 13.2.3**: Add troubleshooting guide for common issues
- **Task 13.2.4**: Create deployment and maintenance procedures

### 13.3 CI/CD & Deployment

- **Task 13.3.1**: Add Prisma migrate check to CI pipeline
- **Task 13.3.2**: Create automated testing in CI/CD
- **Task 13.3.3**: Set up preview deployments for feature branches
- **Task 13.3.4**: Add production deployment automation

---

## Task Prioritization Guidelines

### Story Point Definition

Each task should be:

- ✅ Completable in 1-4 hours by an AI coding assistant
- ✅ Have clear acceptance criteria and success metrics
- ✅ Be independently testable and verifiable
- ✅ Have minimal external dependencies
- ✅ Include error handling and edge cases

### Priority Levels

- **High Priority**: Blocks other features, critical for basic functionality
- **Medium Priority**: Important for user experience and feature completeness
- **Lower Priority**: Nice-to-have features and optimizations

### Dependencies

- Complete Phase 1 before Phase 2 (API before real-time)
- Complete Phase 3 before Phase 4 (basic integration before XP)
- Admin dashboard (Phase 8) requires basic functionality (Phases 1-3)
- Testing (Phase 12) should be done throughout all phases

---

## Current Next Steps

Based on the analysis and current state, the immediate next tasks should be:

1. **Task 1.1.1**: Create empty tRPC routers structure
2. **Task 1.2.1**: Implement `getActiveQuestions` endpoint
3. **Task 1.3.1**: Create voter token middleware
4. **Task 1.4.1**: Implement `submitVote` mutation

This will establish the foundation for replacing localStorage-based voting with real database persistence and enable all subsequent features.
