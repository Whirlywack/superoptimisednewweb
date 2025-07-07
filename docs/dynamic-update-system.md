# Dynamic Update System & Progress Bar Logic

This document explains how the website's live data integration works, including the **completed Phase 5 Content Management System**, project timeline integration with real milestone data, and progress bar system connections to the database for real-time updates.

## Overview

The website uses a sophisticated real-time data system that replaces static content with live database values across all pages. This creates a truly dynamic experience where community votes, statistics, and project progress are reflected instantly.

## Core Architecture

### Data Flow Chain

```
User Action → tRPC API → Database → WebSocket → All Connected Clients → UI Update
```

1. **User Action**: Vote submission, form completion, or page load
2. **tRPC API**: Type-safe API calls with validation and error handling
3. **Database**: Supabase PostgreSQL with real-time subscriptions
4. **WebSocket**: Instant propagation to all connected users
5. **UI Update**: Automatic re-rendering with new data

### React Query Integration

All data fetching uses React Query through tRPC for:

- **Caching**: Intelligent cache management with stale-while-revalidate
- **Background Updates**: Automatic refetching on intervals
- **Optimistic Updates**: Immediate UI feedback before server confirmation
- **Error Recovery**: Automatic retries and fallback strategies

## Dynamic Update Components

### 1. Real-time Voting System

**Location**: `src/components/templates/Homepage/HeroSection/DualInteractivePolls.tsx`

**How it Works**:

```typescript
// Fetch real questions from database
const { questions, isLoading, getRandomQuestions } = useActiveQuestions({ limit: 20 });

// Submit votes with optimistic updates
const { submitVote } = useVoteSubmission({
  onSuccess: () => {
    // Immediate UI feedback
    showXPToast("poll");
    // Invalidate and refetch related data
    utils.question.getActiveQuestions.invalidate();
    utils.content.getCommunityStats.invalidate();
  },
});
```

**Database Tables Involved**:

- `questions` - Active poll questions
- `question_votes` - Individual vote records
- `question_stats` - Aggregated vote counts
- `xp_transactions` - XP rewards for voting

### 2. Community Statistics

**Location**: Multiple pages via `useCommunityStats` hook

**Real-time Stats Include**:

- Total votes across all questions
- Unique voter count (based on hashed tokens)
- Active questions count
- Daily/weekly voting trends

**Update Frequency**:

- **Stale Time**: 30 seconds (shows cached data while fetching)
- **Refetch Interval**: 60 seconds (background updates)
- **WebSocket**: Instant updates on vote submission

### 3. Project Progress Indicators

**Location**: `src/components/templates/Homepage/HeroSection/ProgressIndicator.tsx`

**Database Integration**:

```typescript
const { overallProgress, getStatValue, getStatDescription } = useProjectStats();

// Progress calculation logic
const calculateOverallProgress = () => {
  // Option 1: Direct percentage from database
  const completionStat = data["project_completion_percentage"];
  if (completionStat) {
    return parseInt(completionStat.value) || 15;
  }

  // Option 2: Calculate from milestones
  const completed = parseInt(data["completed_milestones"]?.value) || 0;
  const total = parseInt(data["total_milestones"]?.value) || 1;
  return Math.round((completed / total) * 100);
};
```

### 4. Research Page Integration

**Location**: `src/components/templates/ResearchPage.tsx` and `src/components/templates/ResearchCompletePage.tsx`

**Database Integration**:

The research page has been completely refactored from hard-coded data to production-ready database integration:

```typescript
// Real questions from database
const {
  questions: dbQuestions,
  isLoading,
  isError,
  refetch,
} = useActiveQuestions({
  category: "research",
  limit: 10,
});

// Real vote submission with XP rewards
const { submitVote, isVoting } = useVoteSubmission({
  onSuccess: () => {
    // Real XP toast notifications
    // Database vote recording
    // Real-time stats updates
  },
  showToasts: true,
});

// Real-time vote statistics
const { totalVotes, breakdown } = useQuestionStats({
  questionId: question.id,
  refetchInterval: showResults ? 3000 : 0,
});
```

**Key Features**:

- **Database Questions**: Research questions loaded from database via `useActiveQuestions` with category filtering
- **Real Vote Submission**: Votes submitted to database with progressive XP rewards (5→10→15→20→25→50→100)
- **Anonymous Tracking**: SHA-256 voter tokens with duplicate vote prevention
- **Real-time Stats**: Live vote counts update automatically via WebSocket
- **Completion Page**: Real XP breakdown using `useEngagementStats` and `useUserVoteHistory` hooks
- **Fallback Support**: localStorage fallback for backward compatibility

**Data Flow**:

1. **Question Loading**: `useActiveQuestions` fetches research category questions from database
2. **Vote Submission**: Click vote → database submission → XP calculation → real-time stats update
3. **Progress Display**: Real vote percentages and counts from database, not hard-coded values
4. **Completion**: Real XP breakdown, database vote history, fallback to localStorage if needed

**Caching Configuration**:

- **Question Data**: 5 minutes stale time, 10 minutes cache time
- **Vote Statistics**: 2 seconds stale time, real-time updates during voting
- **Engagement Stats**: 5 minutes stale time for completion page
- **User Vote History**: 2 minutes stale time for response display

## Progress Bar Database System

### Database Schema

The progress bar system uses the `project_stats` table:

```sql
CREATE TABLE project_stats (
  id SERIAL PRIMARY KEY,
  stat_key VARCHAR(255) UNIQUE NOT NULL,
  stat_value TEXT NOT NULL,
  description TEXT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Key Statistics Tracked

| Stat Key                        | Purpose                       | Example Value                     |
| ------------------------------- | ----------------------------- | --------------------------------- |
| `project_completion_percentage` | Overall project completion    | `"25"`                            |
| `completed_milestones`          | Number of finished milestones | `"3"`                             |
| `total_milestones`              | Total planned milestones      | `"12"`                            |
| `current_phase`                 | Current development phase     | `"Phase 3: Frontend Integration"` |
| `days_building`                 | Days since project start      | `"157"`                           |
| `lines_of_code`                 | Current codebase size         | `"15420"`                         |

### Updating Progress Bar

#### Method 1: Direct Percentage Update

```sql
-- Set progress to 50%
INSERT INTO project_stats (stat_key, stat_value, description)
VALUES ('project_completion_percentage', '50', 'Halfway milestone reached')
ON CONFLICT (stat_key)
DO UPDATE SET
  stat_value = EXCLUDED.stat_value,
  description = EXCLUDED.description,
  last_updated = CURRENT_TIMESTAMP;
```

#### Method 2: Milestone-Based Calculation

```sql
-- Update milestone completion
INSERT INTO project_stats (stat_key, stat_value, description) VALUES
('completed_milestones', '5', 'Number of completed milestones'),
('total_milestones', '12', 'Total planned milestones')
ON CONFLICT (stat_key)
DO UPDATE SET
  stat_value = EXCLUDED.stat_value,
  last_updated = CURRENT_TIMESTAMP;
```

#### Method 3: Phase Description Update

```sql
-- Update current phase
INSERT INTO project_stats (stat_key, stat_value, description)
VALUES ('current_phase', 'Phase 4: Testing & Optimization', 'Current development phase')
ON CONFLICT (stat_key)
DO UPDATE SET
  stat_value = EXCLUDED.stat_value,
  last_updated = CURRENT_TIMESTAMP;
```

### Progress Bar Features

**Visual Elements**:

- **Width**: Dynamically calculated from database percentage
- **Label**: Shows current phase or completion description
- **Animation**: Smooth transitions when values change
- **Loading State**: Pulse animation during data fetching

**Accessibility**:

- Proper ARIA labels for screen readers
- Semantic HTML progress elements
- High contrast color scheme

**Fallback Strategy**:

- Default to 15% if no database connection
- Show "Initial Planning Complete" if no phase data
- Graceful degradation for all scenarios

## Real-time Synchronization

### WebSocket Integration

**Supabase Realtime Setup**:

```sql
-- Enable real-time for critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE question_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE question_stats;
ALTER PUBLICATION supabase_realtime ADD TABLE project_stats;
```

**React Hook Implementation**:

```typescript
// Subscribe to real-time updates
const subscription = supabase
  .channel("project-updates")
  .on("postgres_changes", { event: "*", schema: "public", table: "project_stats" }, (payload) => {
    // Invalidate React Query cache
    queryClient.invalidateQueries(["project-stats"]);
    // Trigger UI re-render
  })
  .subscribe();
```

### Optimistic Updates

**Vote Submission Flow**:

1. **Immediate UI Update**: Show selected option instantly
2. **Background API Call**: Submit vote to database
3. **Success Handling**: Show XP toast, invalidate cache
4. **Error Handling**: Revert UI state, show error message

**Benefits**:

- Instant user feedback (no loading delays)
- Improved perceived performance
- Graceful error recovery
- Consistent user experience

## Performance Optimizations

### Caching Strategy

**React Query Configuration**:

```typescript
{
  staleTime: 30 * 1000,        // 30s - use cache if fresh
  cacheTime: 2 * 60 * 1000,    // 2min - keep in memory
  refetchInterval: 60 * 1000,   // 1min - background refresh
  refetchOnWindowFocus: false   // Don't refetch on tab switch
}
```

### Batch Processing

**Stats Updates**:

- Collect multiple updates for 5 seconds
- Process in single database transaction
- Reduce database load and improve consistency

**Memory Caching**:

- In-memory cache with 5-minute TTL
- Reduces database queries for frequent requests
- Automatic invalidation on data changes

## Testing the System

### Manual Testing Steps

1. **Vote Submission**:
   - Click vote option → See immediate UI change
   - Check XP toast notification appears
   - Verify vote count increases in all locations

2. **Progress Bar Updates**:
   - Run SQL update in Supabase dashboard
   - Refresh page → See progress bar width change
   - Check phase description updates correctly

3. **Real-time Synchronization**:
   - Open multiple browser tabs
   - Vote in one tab → See updates in other tabs
   - Monitor network tab for WebSocket activity

### Automated Testing

**API Tests**:

```bash
# Test vote submission
npm run test:api -- --grep "vote submission"

# Test progress bar data fetching
npm run test:api -- --grep "project stats"
```

**Component Tests**:

```bash
# Test optimistic updates
npm run test:components -- --grep "DualInteractivePolls"

# Test progress indicator
npm run test:components -- --grep "ProgressIndicator"
```

## Troubleshooting

### Common Issues

**Progress Bar Stuck at 15%**:

- Check database connection
- Verify `project_stats` table has data
- Confirm `useProjectStats` hook is working

**Vote Counts Not Updating**:

- Check WebSocket connection in browser dev tools
- Verify Supabase Realtime is enabled
- Check React Query cache invalidation

**Optimistic Updates Not Working**:

- Verify `useVoteSubmission` hook implementation
- Check error handling in vote submission
- Confirm UI state management

### Debug Commands

```bash
# Check database connection
npx prisma studio

# Test tRPC endpoints
curl http://localhost:3000/api/trpc/content.getProjectStats

# Monitor WebSocket connections
# Open browser dev tools → Network → WS tab
```

## Future Enhancements

### Planned Features

1. **Advanced Progress Tracking**:
   - Sub-project progress bars
   - Feature completion tracking
   - Time-based milestones

2. **Enhanced Real-time Features**:
   - Live user count indicators
   - Real-time comment updates
   - Collaborative voting sessions

3. **Analytics Dashboard**:
   - Vote trends over time
   - User engagement metrics
   - Progress velocity tracking

### Scalability Considerations

- **Database Indexing**: Optimize queries for large datasets
- **CDN Integration**: Cache static content globally
- **Connection Pooling**: Handle high concurrent user loads
- **Rate Limiting**: Prevent abuse and ensure fair usage

---

## Phase 5: Content Management System

### Database-Driven Content Architecture

**Content Block System**:

```typescript
// Content blocks replace all hardcoded strings
interface ContentBlock {
  id: string;
  pageKey: string; // 'homepage_hero', 'about_mission'
  blockKey: string; // 'title', 'description', 'stats'
  contentType: string; // 'text', 'json', 'markdown'
  content: string;
  version: number; // Versioning support
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Server Component Integration**:

```typescript
// Homepage ProjectAnnouncement - Server Component
export async function ProjectAnnouncement() {
  const [heroLabel, heroTitle, heroDescription] = await Promise.all([
    getContentWithFallback('homepage_hero', 'hero_label', 'Building Decision Made'),
    getContentWithFallback('homepage_hero', 'hero_title', 'Magic Link\nQuestionnaire\nSystem'),
    getContentWithFallback('homepage_hero', 'hero_description', 'Fallback description')
  ]);

  return (
    <div className="space-y-4">
      <div className="text-sm font-bold text-primary">{heroLabel}</div>
      <h1 className="text-hero font-bold">{heroTitle.split('\n').map(line => <div key={line}>{line}</div>)}</h1>
      <p>{parseContentWithFormatting(heroDescription)}</p>
    </div>
  );
}
```

### Content Versioning System

**Automatic Version Creation**:

```typescript
// Every content update creates a new version
export async function createContentVersion(
  contentBlockId: string,
  newContent: string,
  changeReason?: string,
  createdBy?: string
): Promise<ContentVersion> {
  return await prisma.$transaction(async (tx) => {
    // Get latest version number
    const latestVersion = await tx.contentVersion.findFirst({
      where: { contentBlockId },
      orderBy: { version: "desc" },
    });

    const newVersionNumber = (latestVersion?.version || 0) + 1;

    // Create version record for current content
    if (!latestVersion) {
      await tx.contentVersion.create({
        data: {
          contentBlockId,
          version: 1,
          content: currentBlock.content,
          contentType: currentBlock.contentType,
          changeReason: "Initial version",
        },
      });
    }

    // Create new version and update content block
    const newVersion = await tx.contentVersion.create({
      data: {
        contentBlockId,
        version: newVersionNumber,
        content: newContent,
        contentType: currentBlock.contentType,
        changeReason,
        createdBy,
      },
    });

    await tx.contentBlock.update({
      where: { id: contentBlockId },
      data: {
        content: newContent,
        version: newVersionNumber,
        updatedAt: new Date(),
      },
    });

    return newVersion;
  });
}
```

**Rollback Functionality**:

```typescript
// Rollback to any previous version
export async function rollbackContentToVersion(
  contentBlockId: string,
  targetVersion: number,
  rollbackReason?: string,
  rollbackBy?: string
): Promise<ContentVersion> {
  // Get target version content
  const targetVersionContent = await prisma.contentVersion.findFirst({
    where: { contentBlockId, version: targetVersion },
  });

  // Create new version with rolled-back content
  return await createContentVersion(
    contentBlockId,
    targetVersionContent.content,
    rollbackReason || `Rolled back to version ${targetVersion}`,
    rollbackBy
  );
}
```

### Project Timeline Integration

**Journey Page Timeline Integration (`/journey`)**:

```typescript
// Journey page now uses real milestone data in existing timeline
export function useProjectTimeline() {
  return api.content.getProjectTimeline.useQuery(undefined, {
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });
}

// Integrated into existing JourneyTimeline component
export function JourneyTimeline() {
  const { data: timelineData, isLoading, error } = useProjectTimeline();

  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-12 md:col-span-8">
        <ProjectTimeline
          variant="compact"
          showUpcoming={true}
          showEstimates={false}
          className="bg-transparent"
        />
        {/* Content Strategy Poll remains unchanged */}
      </div>
    </div>
  );
}
```

**Timeline Data Sources**:

1. **Phase Completions**: Hardcoded phase dates with real completion status from milestone system
2. **Community Milestones**: Live calculation from votes, XP, subscribers via `calculateProjectProgress()`
3. **Development Milestones**: Real milestone tracking with completion percentages
4. **Status Determination**: Completed/in-progress/upcoming based on actual data vs targets

**Task 5.2.4 Implementation**:

The timeline integration replaced hardcoded events in the journey page with real milestone data from the database. The `ProjectTimeline` component now fetches live data through the `getProjectTimeline` tRPC endpoint, displaying actual project progress with completion percentages and real dates where available.

### Automated Progress Tracking

**Event-Driven Updates**:

```typescript
// Progress events trigger automatic milestone updates
export async function trackProgressEvent(event: ProgressEvent): Promise<void> {
  switch (event.type) {
    case "vote_submitted":
      await handleVoteSubmitted(event);
      break;
    case "xp_claimed":
      await handleXpClaimed(event);
      break;
    case "milestone_reached":
      await handleMilestoneReached(event);
      break;
    case "phase_completed":
      await handlePhaseCompleted(event);
      break;
  }
}

// Integrated into existing vote submission
export const voteRouter = createTRPCRouter({
  submitVote: votingProcedure.mutation(async ({ input, ctx }) => {
    // ... vote submission logic ...

    // Track progress event for automation
    await onVoteSubmitted(voterTokenRecord.id, questionId);

    return { success: true, xpEarned, totalXp };
  }),
});
```

**Milestone Detection**:

```typescript
// Automatic milestone detection
async function checkVoteMilestones(totalVotes: number): Promise<void> {
  const milestones = [25, 50, 100, 250, 500, 1000];

  for (const milestone of milestones) {
    if (totalVotes >= milestone) {
      const existingMilestone = await prisma.projectStat.findUnique({
        where: { statKey: `milestone_votes_${milestone}` },
      });

      if (!existingMilestone) {
        await trackProgressEvent({
          type: "milestone_reached",
          data: { milestoneId: `votes_${milestone}` },
          timestamp: new Date(),
        });
      }
    }
  }
}
```

### Content Caching Strategy

**Multi-Level Caching**:

```typescript
// In-memory cache for content blocks
const contentCache = new Map<string, ContentBlock>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getContentBlock(pageKey: string, blockKey: string) {
  const cacheKey = `${pageKey}.${blockKey}`;
  const cachedBlock = contentCache.get(cacheKey);

  // Return cached version if fresh
  if (cachedBlock && Date.now() - cachedBlock.updatedAt.getTime() < CACHE_DURATION) {
    return cachedBlock;
  }

  // Fetch from database and cache
  const block = await prisma.contentBlock.findUnique({
    where: { pageKey_blockKey: { pageKey, blockKey } },
  });

  if (block) {
    contentCache.set(cacheKey, block);
    return block;
  }

  return null;
}
```

### Testing Content System

**Content Update Flow**:

1. Update content block in database via tRPC API
2. New version automatically created with change tracking
3. Website updates within 5 minutes (cache duration)
4. Timeline shows real-time progress updates
5. Rollback capability available for any version

**Manual Testing**:

```sql
-- Update content block
UPDATE content_blocks
SET content = 'Updated hero title with real data',
    version = version + 1,
    updated_at = NOW()
WHERE page_key = 'homepage_hero' AND block_key = 'hero_title';

-- Check version history
SELECT * FROM content_versions
WHERE content_block_id = 'block-id'
ORDER BY version DESC;
```

**API Testing**:

```typescript
// Test content versioning API
const newVersion = await api.content.updateContentWithVersion.mutate({
  contentBlockId: "block-id",
  newContent: "Updated content",
  changeReason: "User feedback implementation",
  createdBy: "admin-user",
});

// Test rollback functionality
const rolledBack = await api.content.rollbackContent.mutate({
  contentBlockId: "block-id",
  targetVersion: 2,
  rollbackReason: "Reverted due to error",
  rollbackBy: "admin-user",
});
```

This comprehensive content management system ensures that all website content is dynamic, versionable, and trackable while maintaining excellent performance through strategic caching and real-time updates.

---

## Phase 5.3: Blog Post Management & Markdown System

### Enhanced Blog Post API

**tRPC Blog Router Implementation:**

```typescript
// Blog posts API with comprehensive filtering and pagination
export const blogRouter = createTRPCRouter({
  getBlogPosts: publicProcedure.input(getBlogPostsSchema).query(async ({ input }) => {
    const { page, limit, postType, status, featured, search } = input;

    // Dynamic where clause building
    const where: Record<string, unknown> = {
      status: status || "published",
    };

    if (postType) where.postType = postType;
    if (featured !== undefined) where.featured = featured;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    return { posts, pagination };
  }),

  getBlogPostBySlug: publicProcedure.input(getBlogPostBySlugSchema).query(async ({ input }) => {
    // Fetch individual post by slug with 404 handling
  }),

  getRecentPosts: publicProcedure.query(async ({ input }) => {
    // Recent posts for sidebar/related content
  }),

  getFeaturedPosts: publicProcedure.query(async ({ input }) => {
    // Featured posts for homepage highlights
  }),

  getBlogStats: publicProcedure.query(async () => {
    // Blog statistics and analytics
  }),
});
```

### Journey Timeline Integration

**JourneyPostsTimeline Component:**

The journey page now displays a unified timeline combining:

1. **Database Blog Posts**: Journey posts from the `posts` table
2. **Project Timeline Events**: Phases and milestones from timeline API
3. **Combined Sorting**: Chronological order with featured posts prioritized

```typescript
// Combined timeline implementation
export function JourneyPostsTimeline() {
  const { data: blogData } = useBlogPosts({
    postType: "journey",
    limit: 10,
    status: "published",
  });

  const { data: timelineData } = useProjectTimeline();

  const getCombinedTimeline = (): TimelineItem[] => {
    const items: TimelineItem[] = [];

    // Add blog posts as timeline items
    if (blogData?.posts) {
      blogData.posts.forEach((post) => {
        items.push({
          id: `post-${post.id}`,
          title: post.title,
          description: post.excerpt,
          date: new Date(post.publishedAt),
          type: "post",
          status: "completed",
          postType: post.postType,
          slug: post.slug,
          featured: post.featured,
        });
      });
    }

    // Add timeline events
    if (timelineData?.events) {
      timelineData.events.forEach((event) => {
        if (event.date) {
          items.push({
            id: event.id,
            title: event.title,
            description: event.description,
            date: event.date,
            type: event.type,
            status: event.status,
            completionPercentage: event.completionPercentage,
          });
        }
      });
    }

    return items.sort((a, b) => b.date.getTime() - a.date.getTime());
  };
}
```

### Advanced Markdown Rendering System

**Enhanced MarkdownRenderer Component:**

The new markdown system provides enterprise-grade content rendering with:

**Security Features:**

- **XSS Protection**: `rehype-sanitize` plugin strips malicious HTML
- **Content Validation**: Zod schemas validate all markdown input
- **Safe Rendering**: No innerHTML usage, pure React components

**Interactive Features:**

- **Syntax Highlighting**: `react-syntax-highlighter` with Prism theme
- **Copy-to-Clipboard**: One-click code copying with visual feedback
- **Heading Anchors**: Deep-linkable headings with smooth scrolling
- **External Link Indicators**: Visual indicators for external links

**Responsive Design:**

- **Table Overflow**: Horizontal scrolling for wide tables
- **Image Optimization**: Lazy loading with proper sizing
- **Code Block Headers**: Language indicators and copy buttons
- **Mobile-First**: Touch-friendly interactions and spacing

```typescript
// MarkdownRenderer usage
<MarkdownRenderer
  content={post.content}
  variant="blog"                    // article | blog | documentation | comment
  maxWidth="prose"                  // none | prose | narrow
  enableSyntaxHighlight={true}      // Code syntax highlighting
  showHeadingAnchors={true}         // Clickable heading links
  showCopyButton={true}             // Copy code functionality
  onHeadingClick={(id, text) => {   // Custom heading click handling
    // Analytics or custom behavior
  }}
/>
```

**Supported Markdown Elements:**

1. **Headings (H1-H6)**: With anchor links and scroll behavior
2. **Code Blocks**: Multi-language syntax highlighting
3. **Inline Code**: Styled with background and proper spacing
4. **Links**: External link detection with security attributes
5. **Images**: Responsive with lazy loading
6. **Tables**: Responsive with proper borders and spacing
7. **Lists**: Ordered and unordered with consistent styling
8. **Blockquotes**: Styled with borders and background
9. **Emphasis**: Bold and italic text styling
10. **Horizontal Rules**: Section dividers

**Code Block Features:**

```typescript
// Example code block with all features
function CodeBlock({ children, language, showCopyButton, fileName }) {
  return (
    <div className="group relative my-4">
      {/* Header with language indicator and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-warm-gray/10">
        <div className="flex items-center gap-2">
          <Code size="sm" />
          {fileName && <span className="font-mono">{fileName}</span>}
          {language && (
            <span className="text-xs px-2 py-1 rounded bg-primary/10">
              {language}
            </span>
          )}
        </div>

        {showCopyButton && (
          <button onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>

      {/* Syntax highlighted content */}
      <SyntaxHighlighter
        style={prism}
        language={language}
        customStyle={{
          backgroundColor: "#1a1a1a",
          color: "#fafafa",
          padding: "1rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
```

### BlogPostViewer Component

**Full-Featured Blog Post Display:**

```typescript
// Complete blog post viewing experience
export function BlogPostViewer({ post, variant = "full" }) {
  const publishedDate = new Date(post.publishedAt);
  const estimatedReadTime = Math.ceil(post.content.split(" ").length / 200);

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header with meta information */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {post.featured && <Tag variant="secondary">Featured</Tag>}
          <Tag variant="secondary">{post.postType}</Tag>
        </div>

        <h1 className="text-4xl font-bold text-off-black mb-4">
          {post.title}
        </h1>

        <p className="text-lg text-warm-gray mb-6">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-4 text-sm text-warm-gray">
          {post.author && (
            <div className="flex items-center gap-1">
              <User size="xs" />
              <span>{post.author.name}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Calendar size="xs" />
            <time>{publishedDate.toLocaleDateString()}</time>
          </div>

          <div className="flex items-center gap-1">
            <Clock size="xs" />
            <span>{estimatedReadTime} min read</span>
          </div>
        </div>
      </header>

      {/* Markdown content */}
      <MarkdownRenderer
        content={post.content}
        variant="blog"
        enableSyntaxHighlight={true}
        showHeadingAnchors={true}
        showCopyButton={true}
      />

      {/* Social sharing footer */}
      <footer className="mt-12 pt-8 border-t">
        <div className="flex items-center justify-between">
          <div className="text-sm text-warm-gray">
            Published on {publishedDate.toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-warm-gray">Share:</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </article>
  );
}
```

### React Hooks for Blog Data

**useBlogPosts Hook:**

```typescript
// Type-safe blog post fetching with caching
export function useBlogPosts(options: UseBlogPostsOptions = {}) {
  const {
    page = 1,
    limit = 10,
    postType,
    status = "published",
    featured,
    search,
    enabled = true,
  } = options;

  const input = {
    page,
    limit,
    postType,
    status,
    featured,
    search,
  };

  return api.blog.getBlogPosts.useQuery(input, {
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
```

### Testing the Blog System

**Manual Testing Steps:**

1. **Blog Post API**: Test pagination, filtering, and search functionality
2. **Markdown Rendering**: Verify syntax highlighting and XSS protection
3. **Journey Timeline**: Check blog post integration with timeline events
4. **Copy Functionality**: Test code block copying across different browsers
5. **Responsive Design**: Verify mobile layouts and touch interactions

**API Testing Examples:**

```bash
# Test blog posts pagination
curl "http://localhost:3000/api/trpc/blog.getBlogPosts?input=%7B%22page%22%3A1%2C%22limit%22%3A5%7D"

# Test journey post filtering
curl "http://localhost:3000/api/trpc/blog.getBlogPosts?input=%7B%22postType%22%3A%22journey%22%7D"

# Test individual post fetching
curl "http://localhost:3000/api/trpc/blog.getBlogPostBySlug?input=%7B%22slug%22%3A%22day-1-foundation%22%7D"
```

**Database Verification:**

```sql
-- Check blog post count
SELECT COUNT(*) FROM posts WHERE status = 'published';

-- Check post types distribution
SELECT post_type, COUNT(*) FROM posts GROUP BY post_type;

-- Verify sample content
SELECT title, excerpt, LENGTH(content) as content_length
FROM posts WHERE post_type = 'journey';
```

### Performance Considerations

**Caching Strategy:**

- **Blog Posts**: 2-minute stale time, 5-minute cache time
- **Individual Posts**: Cache by slug with longer TTL
- **Markdown Rendering**: Component-level memoization
- **Code Highlighting**: Language-specific caching

**Optimization Features:**

- **Lazy Loading**: Images and code blocks load on scroll
- **Bundle Splitting**: Syntax highlighter loaded dynamically
- **Memory Management**: Proper cleanup of event listeners
- **Search Debouncing**: 300ms debounce for search queries

This enhanced blog system provides a solid foundation for content management while maintaining the real-time, dynamic nature of the overall application.

### Dynamic Post Slug Routing (/journey/[slug])

**Implementation Details:**

```typescript
// Dynamic route at /app/journey/[slug]/page.tsx
export default async function JourneyPost({ params }: PageProps) {
  try {
    const post = await api.blog.getBlogPostBySlug({ slug: params.slug });

    if (!post) {
      notFound();
    }

    return <BlogPostViewer post={post} />;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }
}
```

**SEO & Metadata Generation:**

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const post = await api.blog.getBlogPostBySlug({ slug: params.slug });

    if (!post) {
      return { title: "Post Not Found - Superoptimised" };
    }

    return {
      title: `${post.title} | Superoptimised Journey`,
      description: post.excerpt || `Read about ${post.title} in the building journey.`,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        publishedTime: post.publishedAt?.toISOString(),
        images: [{ url: `/api/og/${post.slug}`, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        images: [`/api/og/${post.slug}`],
      },
      alternates: {
        canonical: `/journey/${post.slug}`,
      },
    };
  } catch (error) {
    return { title: "Post Not Found - Superoptimised" };
  }
}
```

**Static Site Generation:**

```typescript
export async function generateStaticParams() {
  try {
    const { posts } = await api.blog.getBlogPosts({
      page: 1,
      limit: 100,
      status: "published",
      postType: "journey",
    });

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
```

**Automatic Timeline Integration:**

The journey timeline component automatically generates clickable links for all published blog posts:

```typescript
// In JourneyPostsTimeline.tsx
{item.type === "post" && item.slug ? (
  <a
    href={`/journey/${item.slug}`}
    className="hover:text-primary transition-colors"
  >
    {item.title}
  </a>
) : (
  item.title
)}
```

**Testing Slug Routing:**

1. **Development Testing**:

   ```bash
   # Start dev server
   npm run dev

   # Test existing slug
   curl http://localhost:3000/journey/day-1-foundation

   # Test 404 handling
   curl http://localhost:3000/journey/non-existent-slug
   ```

2. **Database Seeded Routes**:
   - `/journey/day-1-foundation` - Technical architecture decisions
   - Additional slugs generated from database posts automatically

3. **404 Handling**:
   - Custom not-found page at `/journey/[slug]/not-found.tsx`
   - User-friendly error messages with navigation options
   - Automatic fallback to journey index page

This slug-based routing system provides SEO-friendly URLs, proper metadata generation, and seamless integration with the existing blog system while maintaining TypeScript safety and error handling.
