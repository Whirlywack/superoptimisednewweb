# Admin Dashboard Documentation

## Overview

The admin dashboard provides comprehensive management capabilities for the Superoptimised web application. Built with NextAuth authentication, tRPC APIs, and following the Elevated Brutalism design system, it offers secure, efficient tools for managing questions, questionnaires, content, and analytics.

## Table of Contents

1. [Authentication & Access](#authentication--access)
2. [Dashboard Architecture](#dashboard-architecture)
3. [Question Management](#question-management)
4. [Questionnaire System](#questionnaire-system)
5. [User Interface Design](#user-interface-design)
6. [API Integration](#api-integration)
7. [Database Schema](#database-schema)
8. [Security Implementation](#security-implementation)
9. [Development & Testing](#development--testing)
10. [Troubleshooting](#troubleshooting)

---

## Authentication & Access

### Admin User Setup

**Development Environment:**

```bash
# Create admin user using script
npx tsx scripts/check-user-admin.ts

# Or manually insert into database
INSERT INTO "User" (id, email, name, role, "isAdmin", "createdAt", "updatedAt")
VALUES ('admin-id', 'admin@superoptimised.com', 'Admin User', 'admin', true, NOW(), NOW());
```

**Production Environment:**

```sql
-- Create admin user directly in database
INSERT INTO "User" (id, email, name, role, "isAdmin", "createdAt", "updatedAt")
VALUES (generate_cuid(), 'your-admin@email.com', 'Admin Name', 'admin', true, NOW(), NOW());
```

### Authentication Flow

1. **Access Attempt**: User visits `/admin` (or any admin route)
2. **Auth Check**: Server verifies session using NextAuth
3. **Role Verification**: Checks `user.role === "admin" && user.isAdmin === true`
4. **Redirect Logic**:
   - No session → `/auth/signin?callbackUrl=/admin`
   - Invalid role → `/unauthorized`
   - Valid admin → Access granted

### Magic Link Authentication

```typescript
// Enhanced redirect callback in authOptions
async redirect({ url, baseUrl }) {
  if (url.startsWith(baseUrl)) {
    const urlObj = new URL(url);
    let callbackUrl = urlObj.searchParams.get('callbackUrl');

    // Magic link detection and admin redirect
    if (!callbackUrl && urlObj.pathname.includes('/api/auth/callback/email')) {
      callbackUrl = '/admin';
    }

    if (callbackUrl && callbackUrl.startsWith('/')) {
      return `${baseUrl}${callbackUrl}`;
    }
  }

  return `${baseUrl}/admin`; // Default admin redirect
}
```

---

## Dashboard Architecture

### Component Structure

```
src/app/admin/
├── layout.tsx                    # Admin layout with auth protection
├── page.tsx                      # Main dashboard page
├── questions/
│   ├── page.tsx                 # Question list page
│   └── new/page.tsx            # Create question page
└── questionnaires/
    └── new/page.tsx            # Questionnaire builder (in development)

src/components/admin/
├── AdminDashboardClient.tsx     # Main dashboard component
├── AdminNavigation.tsx          # Navigation header
├── QuestionListClient.tsx       # Question management interface
└── QuestionScheduleModal.tsx    # Question scheduling modal
```

### Navigation Structure

**Admin Header Navigation:**

- **Dashboard**: `/admin` - Main overview with statistics and quick actions
- **Questions**: `/admin/questions` - Question management interface
- **Analytics**: `/admin/analytics` - Analytics dashboard (planned)
- **Content**: `/admin/content` - Content management (planned)
- **Sign Out**: `/auth/signout` - Logout functionality

### Dashboard Layout

```typescript
// Admin layout with authentication protection
export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession(authOptions);

  // Authentication check
  if (!session || !session.user) {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  // Role verification
  const isAdmin = session.user.role === UserRole.admin || session.user.isAdmin;
  if (!isAdmin) {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--off-white)' }}>
      <AdminNavigation userEmail={session.user.email || ""} />
      <main className="mx-auto max-w-7xl px-6">
        {children}
      </main>
    </div>
  );
}
```

---

## Question Management

### Question Types Supported

The admin dashboard supports all 6 question types with full configuration:

1. **Binary Questions**: Yes/No, A/B choice questions
2. **Multi-Choice Questions**: Multiple selection with configurable options
3. **Rating Scale Questions**: 1-10 numerical ratings with labels
4. **Text Response Questions**: Open-ended text input with character limits
5. **Ranking Questions**: Drag-and-drop priority ordering
6. **A/B Test Questions**: Detailed comparison between two options

### Question Creation Interface

**Location**: `/admin/questions/new`

**Features:**

- **Terminal-style UI**: Follows Elevated Brutalism design principles
- **Dynamic Configuration**: Question-specific options appear based on type
- **Real-time Preview**: See how questions will appear to users
- **Validation**: Client and server-side validation
- **Type Safety**: Full TypeScript support with Zod schemas

**Configuration Options per Type:**

```typescript
// Binary Questions
interface BinaryConfig {
  optionA: { id: string; text: string; description?: string };
  optionB: { id: string; text: string; description?: string };
}

// Multi-Choice Questions
interface MultiChoiceConfig {
  options: Array<{ id: string; text: string }>;
  maxSelections: number;
}

// Rating Scale Questions
interface RatingConfig {
  scale: number; // 1-10
  variant: string; // "numbers" | "stars" | "emoji"
  labels?: { min: string; max: string };
}

// Text Response Questions
interface TextConfig {
  maxLength: number;
  placeholder: string;
  multiline?: boolean;
}

// Ranking Questions
interface RankingConfig {
  items: Array<{ id: string; text: string }>;
}

// A/B Test Questions
interface ABTestConfig {
  optionA: { title: string; description: string };
  optionB: { title: string; description: string };
}
```

### Question Management Interface

**Location**: `/admin/questions`

**Features:**

- **Question List**: All questions with metadata and response counts
- **Filtering**: Filter by category ("general", "technical", "design", "business", "research")
- **Question Type Filter**: Filter by question type (binary, multi-choice, etc.)
- **Real-time Stats**: Live statistics showing total, active, and response counts
- **Toggle Controls**: Activate/deactivate questions with optimistic UI updates
- **Scheduling**: Set start/end dates for questions

**Question List Interface:**

```typescript
interface Question {
  id: string;
  title: string;
  description: string | null;
  questionType: string;
  category: string;
  isActive: boolean;
  startDate: Date | null;
  endDate: Date | null;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
  responseCount: number;
}
```

### Question Scheduling System

**Features:**

- **Terminal-style Modal**: Consistent with Elevated Brutalism design
- **Date/Time Picker**: HTML5 datetime-local inputs
- **Validation**: Start date must be before end date
- **Current Schedule Display**: Shows existing schedule clearly
- **Clear All Function**: Remove all scheduling constraints

**Scheduling Interface:**

```typescript
// Question scheduling modal
<QuestionScheduleModal
  isOpen={scheduleModal.isOpen}
  onClose={handleCloseScheduleModal}
  questionId={scheduleModal.questionId}
  questionTitle={scheduleModal.questionTitle}
  initialStartDate={scheduleModal.startDate}
  initialEndDate={scheduleModal.endDate}
  onSuccess={handleScheduleSuccess}
/>
```

### Question Toggle Controls

**Implementation:**

- **Optimistic Updates**: UI updates immediately before API confirmation
- **Loading States**: Visual feedback during API calls
- **Error Handling**: Rollback on failure with user notification
- **Real-time Sync**: Status changes propagate across all admin sessions

```typescript
const toggleMutation = api.admin.toggleQuestionStatus.useMutation({
  onMutate: ({ id, isActive }) => {
    setIsToggling(id);
    // Optimistic update
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, isActive } : q)));
  },
  onError: (error, variables) => {
    // Rollback on error
    setQuestions((prev) =>
      prev.map((q) => (q.id === variables.id ? { ...q, isActive: !variables.isActive } : q))
    );
  },
  onSettled: () => {
    setIsToggling(null);
  },
});
```

---

## Questionnaire System

### Current Implementation Status

**Phase 8.2 Status**: Basic questionnaire infrastructure implemented but not fully functional

**What's Implemented:**

- ✅ Database schema for questionnaires and question relationships
- ✅ tRPC API endpoints for questionnaire management
- ✅ Questionnaire templates with pre-configured questions
- ✅ Basic questionnaire builder UI

**What's Not Functional:**

- ❌ Question modal in builder is oversimplified
- ❌ No backend integration for questionnaire creation
- ❌ Templates are not connected to UI
- ❌ No questionnaire management interface

### Database Schema

```sql
-- Questionnaires table
CREATE TABLE "questionnaires" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT,
  "status" TEXT DEFAULT 'draft', -- 'draft', 'active', 'closed'
  "start_date" TIMESTAMP,
  "end_date" TIMESTAMP,
  "settings" JSONB DEFAULT '{}',
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for questionnaire-question relationships
CREATE TABLE "questionnaire_questions" (
  "id" TEXT PRIMARY KEY,
  "questionnaire_id" TEXT REFERENCES "questionnaires"("id"),
  "question_id" TEXT REFERENCES "questions"("id"),
  "display_order" INTEGER NOT NULL,
  "is_required" BOOLEAN DEFAULT true,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questionnaire responses
CREATE TABLE "questionnaire_responses" (
  "id" TEXT PRIMARY KEY,
  "questionnaire_id" TEXT REFERENCES "questionnaires"("id"),
  "voter_token_id" TEXT REFERENCES "voter_tokens"("id"),
  "user_id" TEXT REFERENCES "User"("id"),
  "status" TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
  "started_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "completed_at" TIMESTAMP,
  "ip_address" TEXT,
  "user_agent" TEXT
);
```

### Questionnaire Templates

**Template System:**
Pre-configured questionnaire templates for common use cases:

```typescript
export const questionnaireTemplates: QuestionnaireTemplate[] = [
  {
    id: "product-research",
    title: "Product Feature Research",
    description: "Comprehensive survey to gather user feedback on new product features",
    category: "research",
    questions: [
      {
        title: "How often do you use our current product?",
        questionType: "multi-choice",
        questionData: {
          options: [
            { id: "daily", text: "Daily" },
            { id: "weekly", text: "Weekly" },
            { id: "monthly", text: "Monthly" },
            { id: "rarely", text: "Rarely" },
          ],
          maxSelections: 1,
        },
        isRequired: true,
      },
      // ... more questions
    ],
  },
  // ... more templates
];
```

### tRPC API Endpoints

**Questionnaire Management:**

```typescript
// Get all questionnaires
api.questionnaire.getAll.useQuery({
  limit: 10,
  cursor: undefined,
  status: "all", // "draft" | "active" | "closed" | "all"
});

// Get questionnaire statistics
api.questionnaire.getStats.useQuery();

// Create new questionnaire
api.questionnaire.create.useMutation({
  title: "My Questionnaire",
  description: "Description here",
  category: "research",
  questionIds: ["question-1", "question-2"],
});

// Update questionnaire status
api.questionnaire.updateStatus.useMutation({
  id: "questionnaire-id",
  status: "active",
});
```

---

## User Interface Design

### Elevated Brutalism Design System

The admin dashboard follows the Elevated Brutalism design principles:

**Core Principles:**

- **Functional Brutalism**: Raw, unpolished interfaces that prioritize function over form
- **Terminal Aesthetics**: Command-line inspired interfaces with monospace typography
- **Honest Design**: No unnecessary decoration or hiding of system complexity
- **Direct Access**: Immediate access to tools without navigation layers

**Design Elements:**

```css
/* Core Design Tokens */
:root {
  --off-white: #fafafa;
  --off-black: #1a1a1a;
  --primary: #00ff00;
  --warm-gray: #666666;
  --light-gray: #e5e5e5;

  /* Typography */
  --font-mono: "JetBrains Mono", monospace;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-hero: 2.5rem;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
}
```

**Component Styling:**

```typescript
// Terminal-style headers
<div className="border-b-2 border-off-black bg-off-black p-4">
  <div className="font-mono text-sm text-green-400">
    $ admin/questions/schedule --edit
  </div>
  <div className="font-mono font-bold uppercase tracking-wide text-off-white">
    SCHEDULE_EDITOR
  </div>
</div>

// Brutalist buttons
<button className="bg-off-black px-6 py-3 font-mono text-sm text-off-white
                   transition-colors hover:bg-primary hover:text-off-black">
  CREATE_QUESTION
</button>

// Raw form inputs
<input className="w-full border-2 border-off-black bg-off-white
                  font-mono text-sm transition-all duration-200
                  focus:border-primary focus:outline-none" />
```

### Navigation Design

**Admin Header:**

- **Terminal Context**: Shows current user and system status
- **Connected Buttons**: No gaps between navigation items
- **Hover States**: Primary color transitions on hover
- **Sign Out**: Prominently displayed with different styling

```typescript
// Admin navigation component
<nav className="flex items-center" style={{ gap: '0' }}>
  <a href="/admin" className="admin-nav-link">Dashboard</a>
  <a href="/admin/questions" className="admin-nav-link">Questions</a>
  <a href="/admin/analytics" className="admin-nav-link">Analytics</a>
  <a href="/admin/content" className="admin-nav-link">Content</a>
  <a href="/auth/signout" className="admin-nav-signout">Sign Out</a>
</nav>
```

### Form Design

**Question Creation Form:**

- **Terminal Headers**: Command-line style section headers
- **Grouped Configuration**: Related options grouped in blocks
- **Dynamic UI**: Interface changes based on question type
- **Real-time Preview**: Shows how questions will appear

**Modal Design:**

- **Terminal-style Modals**: Consistent with command-line aesthetic
- **System Messages**: Show technical details (IDs, timestamps)
- **Help Text**: Command-line style help and documentation

---

## API Integration

### tRPC Architecture

**Admin Router Structure:**

```typescript
// Admin router with protected procedures
export const adminRouter = createTRPCRouter({
  // Question management
  getAllQuestions: adminProcedure
    .input(
      z.object({
        category: z.string().optional(),
        questionType: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .query(async ({ input }) => {
      // Get questions with filtering
    }),

  createQuestion: adminProcedure.input(createQuestionSchema).mutation(async ({ input }) => {
    // Create new question
  }),

  toggleQuestionStatus: adminProcedure
    .input(
      z.object({
        id: z.string(),
        isActive: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      // Toggle question active status
    }),

  updateQuestionSchedule: adminProcedure
    .input(
      z.object({
        id: z.string(),
        startDate: z.date().nullable(),
        endDate: z.date().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      // Update question schedule
    }),
});
```

### Data Validation

**Zod Schemas:**

```typescript
// Question creation schema
const createQuestionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  questionType: z.enum([
    "binary",
    "multi-choice",
    "rating-scale",
    "text-response",
    "ranking",
    "ab-test",
  ]),
  category: z.enum(["general", "technical", "design", "business", "research"]),
  isActive: z.boolean(),
  displayOrder: z.number().default(0),
  config: z.record(z.unknown()), // Dynamic config based on question type
});

// Schedule update schema
const scheduleUpdateSchema = z
  .object({
    id: z.string(),
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate < data.endDate;
      }
      return true;
    },
    {
      message: "Start date must be before end date",
      path: ["endDate"],
    }
  );
```

### Error Handling

**tRPC Error Handling:**

```typescript
// Client-side error handling
const createQuestionMutation = api.admin.createQuestion.useMutation({
  onSuccess: (data) => {
    router.push("/admin/questions");
  },
  onError: (error) => {
    if (error.code === "UNAUTHORIZED") {
      router.push("/auth/signin");
    } else if (error.code === "BAD_REQUEST") {
      setFormErrors(error.message);
    } else {
      setError("An unexpected error occurred");
    }
  },
});
```

---

## Database Schema

### Core Admin Tables

**Users Table:**

```sql
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "name" TEXT,
  "role" TEXT DEFAULT 'user', -- 'user' | 'admin'
  "isAdmin" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Questions Table:**

```sql
CREATE TABLE "questions" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "question_type" TEXT NOT NULL,
  "question_data" JSONB NOT NULL,
  "category" TEXT DEFAULT 'general',
  "is_active" BOOLEAN DEFAULT false,
  "display_order" INTEGER DEFAULT 0,
  "start_date" TIMESTAMP,
  "end_date" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Questionnaires System:**

```sql
-- Main questionnaires table
CREATE TABLE "questionnaires" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "category" TEXT,
  "status" TEXT DEFAULT 'draft',
  "start_date" TIMESTAMP,
  "end_date" TIMESTAMP,
  "settings" JSONB DEFAULT '{}',
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for questionnaire-question relationships
CREATE TABLE "questionnaire_questions" (
  "id" TEXT PRIMARY KEY,
  "questionnaire_id" TEXT REFERENCES "questionnaires"("id") ON DELETE CASCADE,
  "question_id" TEXT REFERENCES "questions"("id") ON DELETE CASCADE,
  "display_order" INTEGER NOT NULL,
  "is_required" BOOLEAN DEFAULT true,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("questionnaire_id", "question_id")
);
```

### Database Relationships

**Question Management:**

- One-to-many relationship between questionnaires and questions
- Questions can be reused across multiple questionnaires
- Ordering and requirement settings per questionnaire

**Response Tracking:**

- Individual question responses linked to questionnaire responses
- Anonymous voter tracking maintained
- Session-based response tracking for questionnaires

---

## Security Implementation

### Authentication Security

**Session Management:**

- NextAuth handles all session management
- Secure HTTP-only cookies
- Automatic session refresh
- Session expiration handling

**Role-based Access Control:**

```typescript
// tRPC admin middleware
export const adminMiddleware = t.middleware(async ({ next, ctx }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = ctx.session.user;
  if (user.role !== "admin" || !user.isAdmin) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next();
});
```

### Data Protection

**Input Validation:**

- All inputs validated with Zod schemas
- SQL injection prevention via Prisma ORM
- XSS protection in form inputs
- CSRF protection via NextAuth

**Database Security:**

- Parameterized queries only
- Row-level security policies
- Audit logging for admin actions
- Data encryption at rest

### Admin Action Logging

**Activity Tracking:**

```typescript
// Log admin actions
async function logAdminAction(
  userId: string,
  action: string,
  resourceType: string,
  resourceId: string,
  details?: Record<string, unknown>
) {
  await prisma.adminLog.create({
    data: {
      userId,
      action,
      resourceType,
      resourceId,
      details,
      timestamp: new Date(),
      ipAddress: getClientIP(),
    },
  });
}
```

---

## Development & Testing

### Local Development Setup

**Prerequisites:**

```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev
npx prisma generate

# Create admin user
npx tsx scripts/check-user-admin.ts

# Start development server
npm run dev
```

**Environment Variables:**

```bash
# Required for admin functionality
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
EMAIL_SERVER_PASSWORD="resend-api-key"
EMAIL_FROM="admin@yourdomain.com"
```

### Testing Admin Features

**Manual Testing Checklist:**

1. **Authentication Testing:**

   ```bash
   # Test admin login
   1. Visit http://localhost:3000/admin
   2. Enter admin email: admin@superoptimised.com
   3. Check email for magic link
   4. Click link → should redirect to /admin

   # Test unauthorized access
   1. Sign in with regular user email
   2. Visit /admin → should see "Access Denied"
   ```

2. **Question Management Testing:**

   ```bash
   # Test question creation
   1. Navigate to /admin/questions/new
   2. Fill out form with all question types
   3. Test validation errors
   4. Verify database creation

   # Test question list
   1. Navigate to /admin/questions
   2. Test filtering by category and type
   3. Test toggle active/inactive
   4. Test scheduling modal
   ```

3. **API Testing:**

   ```bash
   # Test tRPC endpoints
   npm run test:admin-api

   # Test unauthorized access
   curl -X POST http://localhost:3000/api/trpc/admin.getAllQuestions
   # Should return 401 Unauthorized
   ```

### Automated Testing

**Unit Tests:**

```typescript
// Test admin middleware
describe("Admin Middleware", () => {
  it("should allow admin users", async () => {
    const ctx = createMockContext({
      session: { user: { role: "admin", isAdmin: true } },
    });

    await expect(adminMiddleware({ ctx, next: mockNext })).resolves.not.toThrow();
  });

  it("should reject non-admin users", async () => {
    const ctx = createMockContext({
      session: { user: { role: "user", isAdmin: false } },
    });

    await expect(adminMiddleware({ ctx, next: mockNext })).rejects.toThrow("FORBIDDEN");
  });
});
```

**Integration Tests:**

```typescript
// Test admin question creation
describe("Admin Question Creation", () => {
  it("should create question with valid data", async () => {
    const question = await caller.admin.createQuestion({
      title: "Test Question",
      questionType: "binary",
      category: "general",
      isActive: true,
      config: {
        optionA: { id: "a", text: "Option A" },
        optionB: { id: "b", text: "Option B" },
      },
    });

    expect(question).toBeDefined();
    expect(question.title).toBe("Test Question");
  });
});
```

---

## Troubleshooting

### Common Issues

**1. Admin Access Denied**

```
Error: Access denied to admin dashboard
```

**Solution:**

- Verify user has `role: "admin"` AND `isAdmin: true`
- Check session is valid with `getServerSession()`
- Ensure admin user exists in database

**2. Magic Link Not Redirecting to Admin**

```
Error: Magic link redirects to homepage instead of /admin
```

**Solution:**

- Check `callbackUrl` parameter in sign-in URL
- Verify redirect callback in `authOptions`
- Ensure magic link includes callback URL

**3. Question Creation Failing**

```
Error: Question creation returns validation error
```

**Solution:**

- Check Zod schema validation
- Verify all required fields are provided
- Ensure question config matches question type

**4. Database Connection Issues**

```
Error: Can't reach database server
```

**Solution:**

- Check DATABASE_URL environment variable
- Verify database is running
- Run `npx prisma migrate dev` to sync schema

### Debug Commands

**Check Admin User:**

```bash
# Verify admin user exists
npx tsx scripts/check-user-admin.ts

# Check user role in database
npx prisma studio
# Navigate to User table and check role/isAdmin fields
```

**Check Session:**

```bash
# Test session endpoint
curl -H "Cookie: next-auth.session-token=..." \
  http://localhost:3000/api/auth/session
```

**Database Debugging:**

```sql
-- Check admin users
SELECT id, email, role, "isAdmin" FROM "User" WHERE role = 'admin';

-- Check questions
SELECT id, title, question_type, is_active FROM questions;

-- Check questionnaires
SELECT id, title, status FROM questionnaires;
```

### Performance Monitoring

**Query Performance:**

```typescript
// Monitor slow queries
const questions = await prisma.question.findMany({
  where: { isActive: true },
  include: { _count: { select: { responses: true } } },
  orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
});
```

**Memory Usage:**

```bash
# Monitor memory usage during admin operations
node --inspect npm run dev
# Open Chrome DevTools → Performance tab
```

---

## Future Enhancements

### Planned Features (Phase 8.3-8.4)

**Analytics Dashboard:**

- Real-time voting charts with Chart.js/Recharts
- Community engagement metrics
- Question performance analytics
- CSV export functionality

**Content Management:**

- Content block editing interface
- Blog post creation and editing
- Project stats management
- Content preview and publishing workflow

**Advanced Question Features:**

- Question templates
- Bulk operations
- Advanced scheduling
- Question duplication

### Performance Improvements

**Caching Strategy:**

- Redis integration for API responses
- Query result caching
- Static content caching
- Real-time data optimization

**Database Optimization:**

- Query optimization
- Index improvements
- Connection pooling
- Read replicas

### Security Enhancements

**Advanced Security:**

- Two-factor authentication
- Admin action audit logs
- IP-based access restrictions
- Advanced rate limiting

**Compliance Features:**

- GDPR compliance tools
- Data export/import
- User data deletion
- Privacy controls

---

## Conclusion

The admin dashboard provides a comprehensive, secure, and efficient interface for managing the Superoptimised application. Built with modern technologies and following the Elevated Brutalism design system, it offers a unique and powerful administrative experience.

For questions or contributions, please refer to the project documentation or contact the development team.

**Key Links:**

- [Main Documentation](../README.md)
- [Database Schema](./database-schema.md)
- [Task List](./tasks.md)
- [Design System](./design-system.md)
