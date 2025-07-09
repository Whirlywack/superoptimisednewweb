# Application Sitemap & Route Structure

## Overview
This document provides a comprehensive overview of all routes in the Superoptimised web application after the Phase 8.2.5 cleanup and audit.

## **🌍 Public Routes**

### Main Application
- **`/`** - Homepage with hero section, building philosophy, community proof
- **`/about`** - About page with mission information  
- **`/journey`** - Journey overview page with blog posts
- **`/journey/[slug]`** - Dynamic blog post pages (e.g., `/journey/phase-1-setup`)
- **`/research`** - Research questionnaire page
- **`/research/complete`** - Research completion page (auto-redirect)
- **`/unauthorized`** - Unauthorized access page (auto-redirect)

### Utility Pages
- **`/newsletter/confirm`** - Newsletter confirmation (email links)
- **`/claim-xp/success`** - XP claim success page (magic links)
- **`/claim-xp/error`** - XP claim error page (magic links)  
- **`/claim-xp/invalid`** - Invalid XP claim page (magic links)

## **🔐 Authentication Routes**

- **`/auth/signin`** - User sign-in page
- **`/auth/signout`** - User sign-out page
- **`/auth/error`** - Authentication error page
- **`/auth/verify`** - Email verification page

## **👑 Admin Routes** (Protected)

### Main Admin Navigation
- **`/admin`** - Admin dashboard (central overview)
- **`/admin/questionnaires`** - **MAIN** questionnaire management page ⭐
- **`/admin/analytics`** - Analytics dashboard  
- **`/admin/content`** - Content management

### Admin Sub-Routes
- **`/admin/questionnaires/new`** - Create new questionnaire
- **`/admin/questionnaires/templates`** - Questionnaire template gallery
- **`/admin-test`** - Admin testing page (development only)

## **🔧 API Routes**

### Core APIs
- **`/api/auth/[...nextauth]`** - NextAuth.js authentication (GET, POST)
- **`/api/trpc/[trpc]`** - tRPC API endpoint (GET, POST)

### Utility APIs  
- **`/api/claim-xp`** - XP claim processing (POST)
- **`/api/transcribe`** - Audio transcription (POST)
- **`/api/upload`** - File upload handling (POST)
- **`/api/inngest`** - Background job processing (GET, POST)

### SEO & Meta
- **`/robots.txt`** - Dynamic robots.txt (text/plain)
- **`/sitemap.xml`** - Dynamic sitemap (application/xml)

## **📱 Navigation Structure**

### Public Navigation
```
[LOGO] [JOURNEY] [RESEARCH] [ABOUT] [FOLLOW ON X]
```

### Admin Navigation  
```
[DASHBOARD] [QUESTIONNAIRES] [ANALYTICS] [CONTENT] [SIGN OUT]
      ↓              ↓             ↓          ↓
Central Overview  Management    Performance  Content &
& Quick Stats    & Templates     Metrics     Templates
```

## **🛣️ User Flow Paths**

### Public User Journey
1. **`/`** (Homepage) → **`/research`** (Questionnaire) → **`/research/complete`** (Success)
2. **`/`** (Homepage) → **`/journey`** (Blog) → **`/journey/[slug]`** (Article)
3. **`/`** (Homepage) → **`/about`** (Mission)

### Admin User Journey
1. **`/auth/signin`** → **`/admin`** (Dashboard)
2. **`/admin`** → **`/admin/questionnaires`** → **`/admin/questionnaires/new`** (Create)
3. **`/admin`** → **`/admin/questionnaires`** → **`/admin/questionnaires/templates`** (Browse)
4. **`/admin/analytics`** (Performance metrics)
5. **`/admin/content`** (Blog management)

### Authentication Flow
```
Public User: /auth/signin → /
Admin User:  /auth/signin → /admin
Sign Out:    /auth/signout → /
```

## **🔒 Route Protection**

### Public Routes (No Auth Required)
- All main application routes (`/`, `/about`, `/journey`, etc.)
- All authentication routes (`/auth/*`)
- All utility routes (`/newsletter/*`, `/claim-xp/*`)

### Protected Routes (Admin Only)
- All `/admin/*` routes require:
  - Valid session (`getServerSession(authOptions)`)
  - Admin role (`user.role === "admin"`)
  - Admin flag (`user.isAdmin === true`)

### API Protection
- **Public APIs**: `/api/trpc/*` (some endpoints)
- **Protected APIs**: `/api/trpc/*` (admin endpoints via middleware)
- **Utility APIs**: Rate limited but public

## **⚡ Recent Fixes Applied**

### ✅ Fixed Route Conflicts
- **Removed**: `/public/robots.txt` and `/public/sitemap.xml` (static files)
- **Kept**: `/src/app/robots.txt/route.ts` and `/src/app/sitemap.xml/route.ts` (dynamic)
- **Result**: No more conflicts between static and dynamic SEO routes

### ✅ Fixed Navigation Consistency  
- **Updated**: Admin navigation now links to `/admin/questionnaires` (main page)
- **Before**: Admin nav linked directly to `/admin/questionnaires/templates`
- **Result**: Proper navigation hierarchy with main questionnaire management

### ✅ Identified Orphaned Routes
- **`/journey/day-1-foundation`** - Legacy specific post (should be dynamic route)
- **`/admin-test`** - Development page (intentionally not in navigation)
- **All XP/auth utility routes** - Accessible via magic links/redirects (correct)

## **📊 Route Statistics**

- **Total Routes**: 29 unique routes
- **Public Routes**: 11 (including utility)
- **Protected Admin Routes**: 7
- **Authentication Routes**: 4  
- **API Routes**: 6
- **Meta/SEO Routes**: 2

## **🔮 Route Recommendations**

### Immediate Actions Needed
1. **✅ DONE**: Fix static SEO file conflicts
2. **✅ DONE**: Fix admin navigation consistency  
3. **📋 TODO**: Add breadcrumb navigation for admin routes
4. **📋 TODO**: Consider adding search functionality

### Future Enhancements
1. **Route-level loading states** for better UX
2. **Error boundaries** for graceful error handling
3. **Analytics tracking** for route usage metrics
4. **Progressive enhancement** for offline functionality

## **🚦 Route Health Status**

### ✅ Healthy Routes
- All public routes working correctly
- Admin authentication and protection working
- API routes functioning properly
- SEO routes generating correctly

### ⚠️ Needs Attention
- Some admin routes could benefit from breadcrumb navigation
- Error handling could be enhanced at route level
- Loading states could be improved

### 🚨 Critical Issues
- **RESOLVED**: All critical route conflicts fixed
- **RESOLVED**: Navigation consistency restored

This sitemap provides a complete overview of the application's route structure and serves as a reference for development and maintenance.