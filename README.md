# 📚 Project Documentation Index

Welcome to the **Superoptimised Next.js AI Starter** documentation hub. This file links out to the living documents inside the `docs` folder and gives newcomers a bird’s-eye view of what each document contains.

## 🎯 Interactive Database Features

**Phase 1 Complete**: Core tRPC API foundation with anonymous voting system
**Phase 2 Complete**: Real-time Updates & WebSocket Integration

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

- XP rewards for voting (+5 XP base)
- Live statistics updates
- Rate limiting and abuse protection

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

| File                                                         | Purpose                                                                                                                       |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| [`database-schema.md`](./docs/database-schema.md)            | Complete database design with 12 tables for interactive features                                                              |
| [`tasks.md`](./docs/tasks.md)                                | 100+ story-point tasks organized in 13 phases for continued development                                                       |
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

## 🗳️ Testing the Voting System

Once running, you can test the interactive voting system:

1. Visit the homepage to see active questions
2. Vote on questions (anonymous, no login required)
3. View real-time vote results and statistics (WebSocket + polling fallback)
4. Test the tRPC API endpoints at `/api/trpc`
5. Monitor real-time stats updates on community pages

**Real-time Features:**

- Vote counts update instantly via WebSocket
- Community stats refresh automatically
- Graceful fallback to 15-second polling if WebSocket fails

## 📂 Directory Overview

```
app/               → Next.js routes (App Router)
src/
  ├─ components/   → Atomic/molecular/organism UI
  ├─ lib/          → tRPC routers, utilities
  └─ stories/      → .stories.tsx files for Storybook
prisma/            → Database schema & migrations
docs/              → ← you are here
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
