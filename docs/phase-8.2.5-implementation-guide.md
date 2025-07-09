# Phase 8.2.5 Implementation Guide: Admin Dashboard Data Integration

## Overview

This document provides a detailed implementation guide for completing Phase 8.2.5 - removing all hardcoded mock data from the admin dashboard and implementing real API integration with Chart.js visualization.

## Current Status

- ✅ **Architecture Complete**: Modern 4-page admin dashboard implemented
- 🔴 **Data Integration Required**: 75% of admin data is still hardcoded mock data
- 🔴 **Missing Backend APIs**: Analytics and Content routers incomplete
- 🔴 **Missing Visualization**: Chart.js not installed or implemented

## Detailed Implementation Plan

### **WEEK 1: Foundation APIs (High Priority)**

#### Task 8.2.5.2: Install Chart.js Dependencies
**Estimated Time**: 1 hour  
**Priority**: High

```bash
# Install required packages
npm install react-chartjs-2 chart.js
npm install @types/chart.js  # TypeScript support
```

**Acceptance Criteria**:
- [ ] react-chartjs-2 and chart.js packages installed
- [ ] TypeScript types available
- [ ] No build errors after installation

#### Task 8.2.5.3: Create Analytics tRPC Router
**Estimated Time**: 4-6 hours  
**Priority**: High  
**File**: `/src/lib/api/routers/analyticsRouter.ts`

**Required Endpoints**:
```typescript
export const analyticsRouter = createTRPCRouter({
  // Website traffic statistics
  getWebsiteStats: adminProcedure.query(async () => {
    // Return: pageViews, uniqueVisitors, sessions, bounceRate
  }),
  
  // Time-series data for charts
  getTrafficOverTime: adminProcedure
    .input(z.object({
      period: z.enum(['7d', '30d', '90d']),
      metric: z.enum(['pageViews', 'uniqueVisitors', 'sessions'])
    }))
    .query(async ({ input }) => {
      // Return: array of {date, value} for charting
    }),
  
  // Top performing pages
  getTopPages: adminProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      // Return: array of {path, pageViews, uniqueVisitors}
    }),
  
  // Questionnaire performance analytics  
  getQuestionnaireAnalytics: adminProcedure.query(async () => {
    // Return: completion rates, response times, top questionnaires
  }),
  
  // Conversion and engagement metrics
  getConversionMetrics: adminProcedure.query(async () => {
    // Return: conversion rates, session duration, engagement scores
  })
});
```

**Database Tables Needed**:
- `analytics_daily` - Daily aggregated website stats
- `page_views` - Individual page view tracking
- `user_sessions` - Session tracking and duration

**Acceptance Criteria**:
- [ ] Analytics router created with all endpoints
- [ ] Database schema for analytics tracking implemented
- [ ] Proper admin middleware protection
- [ ] Zod validation for all inputs
- [ ] Error handling for all queries

#### Task 8.2.5.4: Replace AdminDashboardClient Mock Data
**Estimated Time**: 2-3 hours  
**Priority**: High  
**File**: `/src/components/admin/AdminDashboardClient.tsx`

**Mock Data to Replace**:
- Lines 38-44: `mockAnalytics` object
- Lines 46-58: `contentTemplates` array  
- Lines 640-644: "Top Performing" questionnaire data
- Lines 821-824: "Recent Posts" data

**New API Calls**:
```typescript
const { data: websiteStats, isLoading: websiteLoading } = 
  api.analytics.getWebsiteStats.useQuery();
const { data: contentStats, isLoading: contentLoading } = 
  api.content.getContentStats.useQuery();
const { data: topQuestionnaires, isLoading: topQuestionnaireLoading } = 
  api.questionnaire.getTopPerforming.useQuery({ limit: 3 });
```

**Acceptance Criteria**:
- [ ] All hardcoded analytics data replaced with real API calls
- [ ] Loading states implemented for all data
- [ ] Error handling for failed API calls
- [ ] Dashboard shows real metrics instead of mock data

#### Task 8.2.5.5: Replace AnalyticsDashboardClient Mock Data
**Estimated Time**: 3-4 hours  
**Priority**: High  
**File**: `/src/components/admin/AnalyticsDashboardClient.tsx`

**Mock Data to Replace**:
- Lines 31-57: Massive `mockAnalytics` object
- Lines 177-287: All displayed metrics from hardcoded values
- Lines 333-379: Top pages list
- Lines 497-541: Top questionnaires performance

**New API Calls**:
```typescript
const { data: websiteStats } = api.analytics.getWebsiteStats.useQuery();
const { data: trafficData } = api.analytics.getTrafficOverTime.useQuery({
  period: selectedPeriod,
  metric: 'pageViews'
});
const { data: topPages } = api.analytics.getTopPages.useQuery({ limit: 10 });
```

**Acceptance Criteria**:
- [ ] All hardcoded analytics data replaced
- [ ] Time range selector working with real data
- [ ] Top pages showing real traffic data
- [ ] Real questionnaire analytics displayed
- [ ] Proper loading states and error handling

### **WEEK 2: Content Management & Visualization (High Priority)**

#### Task 8.2.5.6: Extend Content tRPC Router
**Estimated Time**: 4-5 hours  
**Priority**: High  
**File**: `/src/lib/api/routers/contentRouter.ts`

**New Endpoints to Add**:
```typescript
// Content statistics
getContentStats: adminProcedure.query(async () => {
  // Return: totalPosts, draftPosts, publishedPosts, totalViews
}),

// Content templates management
getContentTemplates: adminProcedure.query(async () => {
  // Return: array of content templates
}),

createContentTemplate: adminProcedure
  .input(contentTemplateSchema)
  .mutation(async ({ input }) => {
    // Create new content template
  }),

updateContentTemplate: adminProcedure
  .input(z.object({ id: z.string(), data: contentTemplateSchema }))
  .mutation(async ({ input }) => {
    // Update existing template
  }),

deleteContentTemplate: adminProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    // Delete content template
  })
```

**Database Schema Updates**:
- `content_templates` table for dynamic templates
- `content_stats` table for aggregated statistics
- Blog post view tracking integration

**Acceptance Criteria**:
- [ ] Content router extended with all new endpoints
- [ ] Database schema updated with new tables
- [ ] CRUD operations for content templates working
- [ ] Content statistics calculated from real data

#### Task 8.2.5.7: Replace ContentDashboardClient Mock Data
**Estimated Time**: 2-3 hours  
**Priority**: High  
**File**: `/src/components/admin/ContentDashboardClient.tsx`

**Mock Data to Replace**:
- Lines 38-113: `mockContent` object
- Lines 219-320: Dashboard statistics
- Lines 372-434: Content templates section
- Lines 506-577: Recent posts filtering

**New API Calls**:
```typescript
const { data: contentStats } = api.content.getContentStats.useQuery();
const { data: contentTemplates } = api.content.getContentTemplates.useQuery();
const { data: recentPosts } = api.blog.getBlogPosts.useQuery({
  page: 1,
  limit: 10,
  status: selectedFilter
});
```

**Acceptance Criteria**:
- [ ] All mock content data replaced with real APIs
- [ ] Content statistics show real numbers
- [ ] Templates management working with database
- [ ] Blog post filtering working with real data

#### Task 8.2.5.8: Create Real Chart Components
**Estimated Time**: 4-6 hours  
**Priority**: High  
**File**: `/src/components/admin/charts/`

**Chart Components to Create**:
```typescript
// LineChart.tsx - Website traffic over time
interface LineChartProps {
  data: Array<{date: string, value: number}>;
  title: string;
  color?: string;
}

// BarChart.tsx - Top pages performance  
interface BarChartProps {
  data: Array<{label: string, value: number}>;
  title: string;
}

// DoughnutChart.tsx - Traffic sources
interface DoughnutChartProps {
  data: Array<{label: string, value: number, color: string}>;
  title: string;
}
```

**Integration Points**:
- Replace "Coming Soon" in AnalyticsDashboardClient (lines 547-585)
- Add charts to main dashboard overview
- Time range selector integration

**Acceptance Criteria**:
- [ ] Chart.js components created with TypeScript
- [ ] Charts integrated into analytics dashboard
- [ ] Time range filtering working
- [ ] Charts responsive and accessible
- [ ] Real data flowing through charts

#### Task 8.2.5.9: Implement Functional Blog Post Creation/Editing
**Estimated Time**: 3-4 hours  
**Priority**: High  
**Files**: `/src/components/admin/BlogPostEditor.tsx`

**Features to Implement**:
- Rich text editor for blog post content
- Draft/publish workflow
- SEO metadata editing
- Image upload functionality
- Preview functionality

**API Integration**:
```typescript
const createPostMutation = api.content.createBlogPost.useMutation();
const updatePostMutation = api.content.updateBlogPost.useMutation();
const deletePostMutation = api.content.deleteBlogPost.useMutation();
```

**Acceptance Criteria**:
- [ ] Blog post creation working
- [ ] Rich text editor implemented
- [ ] Draft/publish workflow functional
- [ ] SEO metadata editing
- [ ] Image upload integration

### **WEEK 3: Template System & Enhancement (Medium Priority)**

#### Task 8.2.5.10: Move QuestionnaireTemplates to Database
**Estimated Time**: 4-5 hours  
**Priority**: Medium

**Database Schema**:
```sql
CREATE TABLE "questionnaire_templates" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT,
  "estimatedTime" TEXT,
  "targetAudience" TEXT,
  "isLocked" BOOLEAN DEFAULT false,
  "tags" TEXT[],
  "bestPractices" TEXT[],
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "questionnaire_template_questions" (
  "id" TEXT PRIMARY KEY,
  "templateId" TEXT REFERENCES "questionnaire_templates"("id"),
  "questionData" JSONB NOT NULL,
  "displayOrder" INTEGER NOT NULL,
  "isRequired" BOOLEAN DEFAULT true,
  "isLocked" BOOLEAN DEFAULT false
);
```

**Migration Strategy**:
- Create database tables
- Migrate existing static templates to database
- Update template gallery to use database
- Add admin interface for template management

**Acceptance Criteria**:
- [ ] Database schema for templates implemented
- [ ] Static templates migrated to database
- [ ] Template gallery uses database
- [ ] Admin template management interface

#### Task 8.2.5.11: Add Drag and Drop Question Reordering
**Estimated Time**: 3-4 hours  
**Priority**: Medium

**Implementation**:
- Install react-beautiful-dnd or @dnd-kit/core
- Add drag handles to question cards
- Implement reorder mutation
- Optimistic UI updates

**Acceptance Criteria**:
- [ ] Drag and drop library installed
- [ ] Question reordering working
- [ ] Changes persist to database
- [ ] Optimistic UI updates

#### Task 8.2.5.12: Add Bulk Operations for Question Management
**Estimated Time**: 2-3 hours  
**Priority**: Medium

**Features**:
- Multi-select questions
- Bulk activate/deactivate
- Bulk delete
- Bulk category assignment

**Acceptance Criteria**:
- [ ] Multi-select functionality
- [ ] Bulk operations working
- [ ] Confirmation dialogs
- [ ] Error handling

## Testing Checklist

### Before Starting Implementation
- [ ] Backup current database
- [ ] Ensure all existing features are working
- [ ] Document current admin functionality

### During Implementation
- [ ] Test each task individually before moving to next
- [ ] Verify loading states work correctly
- [ ] Test error handling scenarios
- [ ] Ensure responsive design maintained

### Final Validation
- [ ] All hardcoded data replaced with real APIs
- [ ] Charts display real data correctly
- [ ] Content management fully functional
- [ ] Performance testing completed
- [ ] Admin workflow efficiency verified

## Success Metrics

**Completion Criteria**:
- [ ] 0% hardcoded data in admin dashboard
- [ ] All charts showing real analytics data
- [ ] Functional content creation and editing
- [ ] Template system moved to database
- [ ] Admin efficiency improved (185 actions → ~25 actions)

**Performance Targets**:
- Admin dashboard loads in <2 seconds
- Charts render in <1 second
- Real-time data updates working
- No console errors or warnings

## Risk Mitigation

**Potential Issues**:
1. **Chart.js Integration Complexity** - Start with simple charts, add complexity gradually
2. **Database Schema Changes** - Use Prisma migrations, test thoroughly
3. **Performance Impact** - Implement proper caching and loading states
4. **Data Migration** - Backup before migrating templates to database

**Rollback Plan**:
- Keep backup of working admin dashboard
- Use feature flags for new functionality
- Incremental deployment strategy

## Documentation Updates Required

After completion, update:
- [ ] `/docs/admin-dashboard.md` - Mark Phase 8.2.5 as complete
- [ ] `/docs/tasks.md` - Update task statuses
- [ ] `/README.md` - Update admin system description
- [ ] `/docs/api-documentation.md` - Document new tRPC endpoints

This implementation guide ensures systematic completion of Phase 8.2.5 with clear acceptance criteria and testing procedures.