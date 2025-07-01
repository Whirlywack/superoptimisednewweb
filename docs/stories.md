# 🗂️ Project Stories Checklist

Detailed breakdown of every story into single-story-point tasks. Each checkbox represents **one point** and should be completed by the coding agent sequentially.

## 📂 Project Structure & Tech Stack

**Directory Overview**

```
app/               → Next.js App Router pages & API routes
src/
  ├─ components/   → UI components
  ├─ lib/          → Utilities & configurations
  │   ├─ api/      → tRPC routers
  │   └─ utils/    → Shared utilities
  └─ stories/      → Storybook stories
prisma/            → Database schema & migrations
```

**Primary Technologies**

- Next.js 15 (Turbopack, RSC, App Router)
- TypeScript
- Tailwind CSS (custom tokens)
- Prisma ORM
- Supabase (Postgres, Auth, Storage)
- tRPC (end-to-end types)
- NextAuth (Supabase email provider)
- Resend (transactional email)
- Storybook 8 (Chromatic CI)
- Jest + RTL

_All stories below are written to utilise this exact stack._

## 🟢 Foundation & Infrastructure

### Story: Repository & Tooling Setup

- [ ] Initialise `.editorconfig`, `.prettierrc`, and ESLint config matching design-system code style
- [ ] Configure Husky pre-commit hook running `lint` and `prisma format`
- [ ] Add GitHub Actions workflow for **CI**: install, build, test, lint
- [ ] Add GitHub Actions workflow for **Chromatic** visual regression (Storybook build)
- [ ] Add Dependabot config for npm package updates

### Story: Environment Management

- [ ] Add `.env.local.example` with **all** variables documented
- [ ] Script: `scripts/validate-env.ts` to fail build on missing env vars

### Story: Vercel Integration

- [ ] Link repo to Vercel project via `vercel link`
- [ ] Configure Vercel Environment Variables (import from Supabase Connected Apps)
- [ ] Enable analytics & edge network regions
- [ ] Map production domain `superoptimised.com` and preview domain `*.vercel.app`
- [ ] Add Vercel project README badge

---

## 🎨 Design System Implementation

### Story: Tailwind Theme Tokens

- [ ] Add custom Tailwind config with color palette from `design-system.md`
- [ ] Implement typography scale utilities (`text-h1` → `text-small`)
- [ ] Add spacing scale plugin classes (`section`, `component`, `paragraph`, `list`)
- [ ] Configure dark-mode strategy `class`
- [ ] Generate design-tokens JSON for Figma sync

### Story: Global Stylesheet

- [ ] Create `globals.css` importing Tailwind base/components/utilities
- [ ] Inject `@font-face` for Inter & JetBrains Mono
- [ ] Set CSS custom properties for colors (for future theming)

---

## 🧩 Atomic Component Library (Storybook)

> For every component below execute **ALL** subtasks:
> 
> 1. **Scaffold TSX** file in `src/components/<atom|molecule|organism>`
> 2. Add Storybook story with **Controls**, **A11y**, **Viewport**
> 3. Write unit test with React Testing Library + Jest
> 4. Add visual regression snapshot (Chromatic)
> 5. Write JSDoc & prop types via `zod`

### Atoms

- [ ] Typography: `H1`
- [ ] Typography: `H2`
- [ ] Typography: `H3`
- [ ] Typography: `H4`
- [ ] Typography: `Paragraph`
- [ ] Typography: `InlineCode`
- [ ] Button: `Primary`
- [ ] Button: `Outline`
- [ ] Icon `LucideIcon` wrapper
- [ ] Input `TextField`
- [ ] Input `Checkbox`
- [ ] Input `Radio`
- [ ] Tag / Badge component
- [ ] Spinner Loader

### Molecules

- [ ] FormGroup (label + input + error)
- [ ] Toast Notification (react-toastify wrapper)
- [ ] Modal dialog
- [ ] Dropdown menu
- [ ] Avatar with fallback initials
- [ ] Card (header, body, footer slots)

### Organisms

- [ ] Navigation Bar (desktop/mobile)
- [ ] Footer with socials links
- [ ] Auth Form (email/password + magic link)
- [ ] Article List (responsive grid)
- [ ] Markdown Renderer (code blocks, headings)

### Templates

- [ ] DocSite layout (sidebar nav + content)
- [ ] Marketing layout (hero + feature sections)

---

## 📄 Page Stories (Next.js App Router)

### Public Marketing

- [ ] `/` Home page – hero, features, CTA, footer
- [ ] `/pricing` Pricing tiers from Supabase table
- [ ] `/contact` Contact form → Resend email
- [ ] `/privacy` Static MDX content

### Authenticated App

- [ ] `/dashboard` User dashboard shell
- [ ] `/dashboard/profile` Update profile form (Supabase auth)
- [ ] `/dashboard/settings` Feature flags toggle (database driven)

### Error & Utility Pages

- [ ] `/404` custom not-found page
- [ ] `/500` error boundary fallback

---

## 🔌 Backend & API Stories

### Story: Prisma + Supabase Schema

- [ ] Model `User` (id, email, role, avatar_url, createdAt)
- [ ] Model `FeatureFlag` (key, enabled)
- [ ] Run migration & generate client

### Story: tRPC Router Setup

- [ ] Configure tRPC server in `src/server`
- [ ] Add `getUser` procedure (protected)
- [ ] Add `listFeatureFlags` procedure (public)

### Story: NextAuth Integration

- [ ] Add Supabase email provider
- [ ] JWT callback persisting user id
- [ ] Session strategy `jwt`

### Story: Resend Email Service

- [ ] Create `lib/email.ts` helper using Resend API key
- [ ] Send welcome email after registration via Inngest background job

---

## 🛠️ Dev Experience Stories

### Story: Testing

- [ ] Configure Jest + Testing Library + Vitest types
- [ ] Add `npm run test:watch` script
- [ ] 100% util functions coverage threshold

### Story: Linting & Formatting

- [ ] ESLint rules: Next.js + Tailwindcss + Jest
- [ ] Prettier plugin for tailwind class sorting

### Story: Commit Lint & Conventional Commits

- [ ] Add `commitlint` + `cz-conventional-changelog`

---

## 🚀 Deployment & Ops Stories

### Story: Vercel Production Deployment

- [ ] Enable automatic deployments from `main`
- [ ] Protect `main` branch with required checks
- [ ] Configure Vercel preview comments on PRs

### Story: Domain Mapping

- [ ] Add `superoptimised.com` apex domain
- [ ] Set CNAME for `www`
- [ ] Configure SSL certificate

### Story: Monitoring & Alerts

- [ ] Enable Vercel Analytics
- [ ] Add Log Drains to Supabase + Vercel

---

## 📚 Documentation Stories

### Story: README Enhancement

- [ ] Add project description, screenshots, and live link
- [ ] Document local setup & `supabase cli` instructions
- [ ] Usage examples for API routes & tRPC client

### Story: Storybook Docs Page

- [ ] Configure `docsPage` addon for auto-generated props tables
- [ ] Publish Storybook to Chromatic static hosting

### Story: Contribution Guide

- [ ] Write `CONTRIBUTING.md` with branch strategy, PR template, and code style guide
- [ ] Add `CODE_OF_CONDUCT.md`

---

## 🧹 Miscellaneous Stories

### Story: Accessibility Pass

- [ ] Run Storybook A11y audit on all components
- [ ] Fix contrast / ARIA warnings
- [ ] Keyboard-navigate full app in staging

### Story: Performance Optimisation

- [ ] Setup next/image for all images
- [ ] Enable React 18 `use client` streaming where beneficial
- [ ] Add `next/font` for self-hosting Inter

---

**End of Checklist** – Ensure all boxes are checked before release 🚀