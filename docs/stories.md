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

### Atoms ✅ COMPLETE

- [x] Typography: `H1`
- [x] Typography: `H2`
- [x] Typography: `H3`
- [x] Typography: `H4`
- [x] Typography: `Paragraph`
- [x] Typography: `InlineCode`
- [x] Button: `Primary`
- [x] Button: `Outline`
- [x] Icon `LucideIcon` wrapper
- [x] Input `TextField`
- [x] Input `Checkbox`
- [x] Input `Radio`
- [x] Tag / Badge component
- [x] Spinner Loader

## 🔧 **Additional Atoms** ✅ COMPLETE

- [x] Typography: `MonoText` (for dates, technical metadata)
- [x] Typography: `Link` (with hover states, external link handling)
- [x] Typography: `CodeBlock` (syntax highlighted code)
- [x] Progress: `ProgressBar` (for building progress indicators)
- [x] Layout: `Divider` (section separators)
- [x] Status: `ProjectStatus` (in-progress, complete, concept badges)
- [x] Interaction: `FocusRing` (consistent focus states)

### Molecules ✅ COMPLETE

- [x] FormGroup (label + input + error)
- [x] Toast Notification (react-toastify wrapper)
- [x] Modal dialog
- [x] Dropdown menu
- [x] Avatar with fallback initials
- [x] Card (header, body, footer slots)

## 🎯 **Questionnaire-Specific Atoms**

- [x] `QuestionLabel` (clear, mobile-friendly question text)
- [x] `OptionButton` (large touch targets for mobile)
- [x] `RatingDot` (individual rating points)
- [x] `RankHandle` (drag handle for reordering)
- [x] `ValidationMessage` (error states for required questions)
- [x] `ProgressDot` (questionnaire progress indicator)
- [x] `SkipButton` (optional question handling)

## 🧩 **Question Type Molecules**

### Core Question Types:

- [x] `ABTestQuestion` (compare two technical approaches)
- [x] `MultipleChoice` (4 options max for mobile)
- [x] `YesNoQuestion` (binary decisions with optional "unsure")
- [x] `RatingScale` (1-10 with labeled endpoints)
- [x] `RankingQuestion` (drag-to-reorder up to 6 items)
- [x] `LikertScale` (strongly disagree → strongly agree)
- [x] `TextFeedback` (open-ended with character limit)
- [x] `TechStackSelector` (checkbox group for technologies)

### Developer-Specific Question Types:

- [x] `PriorityMatrix` (effort vs impact 2x2 grid)
- [x] `FeatureVoting` (allocate limited points across options)
- [x] `CodeApproachComparison` (side-by-side code snippets)
- [x] `ArchitectureChoice` (visual diagram selection)
- [x] `TimestampEstimate` (development time estimation)
- [x] `DifficultyRating` (technical complexity assessment)
- [x] `TechDebtTolerance` (trade-off acceptance scale)

## 🏗️ **Questionnaire Organisms** ✅ COMPLETE

- [x] `QuestionCard` (single question container with progress)
- [x] `QuestionFlow` (handles question sequence and validation)
- [x] `ProgressHeader` (shows completion status)
- [x] `ConditionalLogic` (shows/hides questions based on answers)
- [x] `ResponseSummary` (review answers before submission)
- [x] `ThankYouScreen` (completion with next steps)

## 📱 **Mobile-First Components** ✅ COMPLETE

- [x] `LargeButtonChoice` (44px+ touch targets)
- [x] `SwipeRating` (swipe-based rating input)
- [x] `TapToRank` (mobile-friendly ranking)
- [x] `OneHandedInput` (thumb-reachable controls)

## 🧩 **Additional Molecules** ✅ COMPLETE

- [x] `PostMeta` (date + project + reading time grouped)
- [x] `EngagementMetrics` (Heart, MessageCircle icons + count combinations)
- [x] `NewsletterSignup` (email input + subscribe button)
- [x] `FilterButtonGroup` (clean button-based filters)
- [x] `Breadcrumb` (navigation context with ChevronRight separators)
- [x] `PaginationControls` (prev/next with arrow icons + page info)
- [x] `CommunityQuote` (blockquote with attribution)
- [x] `ProjectProgress` (progress bar + status + meta)
- [x] `PostPreview` (title + excerpt + tags)
- [x] `SearchInput` (input with Search icon)
- [x] `SocialShare` (share buttons with platform icons)
- [x] `StatsDisplay` (metrics display)
- [x] `NotificationBanner` (dismissible alerts with close button)
- [x] `AuthorCard` (profile card)
- [ ] `TableOfContents` (document navigation)

### Organisms

- [ ] `Navigation` (desktop/mobile with hamburger menu)
- [ ] `Footer` (socials with platform icons)
- [ ] `AuthForm` (email/password + magic link with visibility toggles)
- [ ] `ArticleList` (responsive grid with view toggles)
- [ ] `MarkdownRenderer` (code blocks, headings with copy functionality)

## 🏗️ **Additional Organisms Needed**

- [ ] `PageHeader` (dramatic title + description)
- [ ] `HeroSection` (current building focus)
- [ ] `PostCard` (complete journey post card)
- [ ] `CommunityVoices` (grid of community quotes)
- [ ] `ProjectShowcase` (project card with tech stack)
- [ ] `CurrentFocus` (building progress section)
- [ ] `JourneyTimeline` (chronological post listing)
- [ ] `MissionStatement` (philosophy content block)
- [ ] `StatsBar` (post count, last updated, projects)
- [ ] `FeatureGrid` (feature highlights)
- [ ] `TestimonialCarousel` (rotating testimonials with navigation)
- [ ] `ContactSection` (contact form)
- [ ] `FAQAccordion` (expandable Q&A with expand/collapse)
- [ ] `ResourceLibrary` (searchable resources with download functionality)

### Templates

- [ ] `DocSiteLayout` (sidebar nav + content)
- [ ] `MarketingLayout` (hero + feature sections)

## 📄 **Additional Templates Needed**

- [ ] `Homepage` (hero + community + mission + latest)
- [ ] `JourneyTimeline` (header + timeline + pagination)
- [ ] `ProjectPortfolio` (project grid + filters)
- [ ] `IndividualPost` (article with community responses)
- [ ] `AboutMission` (story + philosophy + contact)
- [ ] `MagicLinkForm` (questionnaire flow)
- [ ] `ErrorPage` (404, expired link)
- [ ] `SearchResults` (filtered content)
- [ ] `UserDashboard` (profile + activity)
- [ ] `ContactForm` (inquiry form)

## 📱 **Mobile-First Considerations**

- [ ] `MobileNav` (hamburger menu, drawer)
- [ ] `TouchTarget` (44px minimum touch areas)
- [ ] `ResponsiveGrid` (content grids that stack properly)
- [ ] `MobileFilter` (filter controls optimized for touch)

## ♿ **Accessibility-Specific Components**

- [ ] `SkipLink` (keyboard navigation)
- [ ] `ScreenReaderText` (sr-only content)
- [ ] `FocusTrap` (modal/dropdown focus management)
- [ ] `AnnounceRegion` (dynamic content updates)

## 🔧 **Developer Experience Components**

- [ ] `DevIndicator` (show component boundaries in dev)
- [ ] `PropsTable` (for Storybook documentation)
- [ ] `ColorSwatch` (design system documentation)
- [ ] `TypographyScale` (typography examples)

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
- [ ] Send welcome email after registration via background job

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

### Story: Performance Optimization

- [ ] Setup next/image for all images
- [ ] Enable React 18 `use client` streaming where beneficial
- [ ] Add `next/font` for self-hosting Inter

---

**End of Checklist** – Ensure all boxes are checked before release 🚀
