# Dynamic Update System & Progress Bar Logic

This document explains how the website's live data integration works, including the new Phase 5 Content Management System, project timeline, and progress bar system connections to the database for real-time updates.

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

**Real-time Timeline (`/timeline`)**:

```typescript
// Timeline displays live project progress
export function useProjectTimeline() {
  const { data: timelineData } = api.content.getProjectTimeline.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const timelineEvents = useMemo(() => {
    if (!timelineData?.events) return [];

    return timelineData.events.map((event) => ({
      ...event,
      date: event.date ? new Date(event.date) : null,
    }));
  }, [timelineData]);

  return { timelineEvents, progress: timelineData?.progress };
}
```

**Timeline Data Sources**:

1. **Phase Completions**: Real dates from `project_stats` table
2. **Community Milestones**: Live calculation from votes, XP, subscribers
3. **Development Milestones**: Task completion tracking
4. **Future Estimates**: Calculated based on current velocity

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
