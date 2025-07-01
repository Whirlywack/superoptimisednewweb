# 📚 Project Documentation Index

Welcome to the **Superoptimised Next.js AI Starter** documentation hub. This file links out to the living documents inside the `docs` folder and gives newcomers a bird’s-eye view of what each document contains.

| File | Purpose |
|------|---------|
| [`stories.md`](./stories.md) | Single-story-point checklist covering every task required to build, test, deploy, and maintain the application. Use it as your authoritative project backlog. |
| [`design-system.md`](./design-system.md) | Describes the Superoptimised design system: colour palette, typography scale, spacing tokens, and atomic component standards. |
| [`front-enddesign-prompts.md`](./front-enddesign-prompts.md) | Curated prompts for AI pair-programmers to generate pixel-perfect UI code that adheres to the design system. |

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

# Run dev servers (Next.js + Storybook)
npm run dev            # http://localhost:3000
npm run storybook      # http://localhost:6006
```

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
