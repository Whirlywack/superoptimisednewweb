# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.3.4 application with TypeScript, using the App Router pattern. The project integrates multiple modern web technologies including tRPC for type-safe APIs, Prisma ORM with Supabase Postgres, NextAuth for authentication, and Tailwind CSS for styling.

## Key Commands

### Development
```bash
npm run dev          # Start Next.js dev server with Turbopack on http://localhost:3000
npm run storybook    # Start Storybook on http://localhost:6006
```

### Build & Production
```bash
npm run build        # Build for production (runs prisma generate first)
npm run start        # Start production server
```

### Database
```bash
npx prisma migrate dev     # Run database migrations in development
npx prisma generate        # Generate Prisma client (auto-runs on build/install)
npx prisma studio          # Open Prisma Studio GUI
```

### Code Quality
```bash
npm run lint         # Run Next.js linting
```

## Architecture Overview

### Directory Structure
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components following atomic design
- `src/lib/` - Core utilities, tRPC setup, database clients
- `src/stories/` - Storybook component stories
- `prisma/` - Database schema and migrations
- `docs/` - Project documentation

### Key Technical Patterns

#### tRPC Setup
- Router definition: `src/lib/api/root.ts`
- Server context: `src/lib/api/trpc.ts`
- Client setup: `src/lib/trpc/client.tsx`
- API route handler: `src/app/api/trpc/[trpc]/route.ts`

#### Authentication
- NextAuth configuration: `src/lib/auth/index.ts`
- Auth routes: `src/app/api/auth/[...nextauth]/route.ts`
- Database adapter: Prisma with User/Account/Session models

#### Database Access
- Prisma client singleton: `src/lib/db.ts`
- Schema: `prisma/schema.prisma`
- Uses Supabase Postgres with connection pooling

#### Component Architecture
- Design system tokens defined in `docs/design-system.md`
- Atomic components in `src/components/`
- shadcn/ui components in `src/components/ui/`
- Theme provider for dark mode support

#### API Integrations
- AI clients (OpenAI, Gemini, Groq): `src/lib/aiClient.ts`
- Email sending via Resend: `src/lib/email/sendEmail.ts`
- S3 storage: `src/lib/storage.ts`
- Background jobs: Inngest configuration in `inngest.config.ts`

## Important Notes

- Always run database migrations before starting development
- The project uses environment variables for sensitive configuration
- TypeScript strict mode is enabled - ensure proper type safety
- Path alias `@/` maps to `./src/` directory
- React 19 and Next.js 15 with Turbopack are used
- Email templates use React Email components