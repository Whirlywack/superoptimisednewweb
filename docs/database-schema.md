# Database Schema Documentation

## Overview

This document outlines the complete database schema for the interactive community-driven features of Superoptimised. The schema is designed to transform hardcoded community stats and voting systems into dynamic, database-backed functionality.

## Design Principles

- **Anonymous-first**: Support anonymous voting without requiring user accounts
- **Flexible question types**: Support binary, multiple choice, rating, ranking, text, and image-based questions
- **Real-time capable**: Optimized for live updates via Supabase Realtime
- **Abuse prevention**: Built-in rate limiting and duplicate vote prevention
- **Admin controlled**: Question scheduling and content management
- **Performance optimized**: Pre-computed analytics and caching tables

## Core Tables

### 1. VoterToken

**Purpose**: Anonymous voter tracking via SHA-256 hashed tokens

```sql
CREATE TABLE voter_tokens (
  id TEXT PRIMARY KEY,
  token_hash TEXT UNIQUE NOT NULL,  -- SHA-256 of UUID cookie
  created_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW(),
  ip_address TEXT,  -- For rate limiting
  vote_count INTEGER DEFAULT 0
);
```

**Key Features**:

- HttpOnly cookie with UUID → SHA-256 hash storage
- IP tracking for rate limiting (100 votes/day)
- 12-month cleanup for inactive tokens
- No PII stored

### 2. Question

**Purpose**: Core questions supporting all interaction types

```sql
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  question_type TEXT NOT NULL,  -- 'binary', 'multiple_choice', 'rating', 'ranking', 'text', 'image'
  question_data JSONB NOT NULL,  -- Type-specific config
  category TEXT,  -- 'auth', 'platform', 'general'
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Supported Question Types**:

- **Binary**: A/B choices (current homepage polls)
- **Multiple Choice**: Up to 4 options
- **Rating**: 1-10 or star ratings
- **Ranking**: Drag-and-drop priority ordering
- **Text**: Short text responses
- **Image**: Image-based A/B or multi-option voting

**Question Data Examples**:

```json
// Binary question
{
  "options": ["Magic Links", "Social Login"],
  "images": null
}

// Rating question
{
  "scale": 10,
  "labels": ["Poor", "Excellent"],
  "step": 1
}

// Multiple choice
{
  "options": [
    {"id": "opt1", "text": "Mobile-First", "description": "Optimize for mobile devices"},
    {"id": "opt2", "text": "Desktop-First", "description": "Optimize for desktop"}
  ]
}
```

### 3. QuestionResponse

**Purpose**: Store all user responses with flexible data structure

```sql
CREATE TABLE question_responses (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL,
  voter_token_id TEXT,  -- NULL for completely anonymous
  user_id TEXT,  -- NULL for anonymous voters
  response_data JSONB NOT NULL,  -- Flexible response format
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Response Data Examples**:

```json
// Binary choice
{
  "selectedOption": "Magic Links",
  "optionIndex": 0
}

// Rating
{
  "rating": 8,
  "scale": 10
}

// Ranking
{
  "ranking": ["opt1", "opt3", "opt2"],
  "completedRanking": true
}

// Text response
{
  "text": "I prefer magic links because...",
  "characterCount": 156
}
```

### 4. XpLedger

**Purpose**: Complete audit trail of XP-earning actions

```sql
CREATE TABLE xp_ledger (
  id TEXT PRIMARY KEY,
  voter_token_id TEXT,
  user_id TEXT,
  action_type TEXT NOT NULL,  -- 'vote', 'newsletter_signup', 'streak_bonus'
  xp_amount INTEGER NOT NULL,
  source_question_id TEXT,  -- NULL for non-voting actions
  created_at TIMESTAMP DEFAULT NOW()
);
```

**XP Earning Actions**:

- **vote**: +5, +10, +15 XP (progressive rewards)
- **newsletter_signup**: +5 XP
- **streak_bonus**: +25, +50, +100 XP (milestone rewards)

### 5. EngagementStats

**Purpose**: User engagement tracking and streak management

```sql
CREATE TABLE engagement_stats (
  id TEXT PRIMARY KEY,
  voter_token_id TEXT,
  user_id TEXT,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_votes INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  last_activity TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Content Management Tables

### 6. Post

**Purpose**: Blog posts, journey entries, and announcements

```sql
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,  -- Markdown
  post_type TEXT NOT NULL,  -- 'blog', 'journey', 'announcement'
  status TEXT DEFAULT 'draft',  -- 'draft', 'published', 'archived'
  featured BOOLEAN DEFAULT false,
  author_id TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 7. ContentBlock

**Purpose**: Dynamic content for pages (homepage, about, etc.)

```sql
CREATE TABLE content_blocks (
  id TEXT PRIMARY KEY,
  page_key TEXT NOT NULL,  -- 'homepage_hero', 'about_mission'
  block_key TEXT NOT NULL,  -- 'title', 'description', 'stats'
  content_type TEXT NOT NULL,  -- 'text', 'json', 'markdown'
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Content Block Examples**:

```json
// Homepage hero title
{
  "page_key": "homepage_hero",
  "block_key": "title",
  "content_type": "text",
  "content": "Building Magic Link Questionnaire System"
}

// Community stats
{
  "page_key": "homepage_community",
  "block_key": "stats",
  "content_type": "json",
  "content": "{\"days_building\": 5, \"total_votes\": 127, \"decisions_influenced\": 8}"
}
```

### 8. ProjectStat

**Purpose**: Real project metrics and progress tracking

```sql
CREATE TABLE project_stats (
  id TEXT PRIMARY KEY,
  stat_key TEXT UNIQUE NOT NULL,  -- 'progress_percentage', 'days_building'
  stat_value TEXT NOT NULL,  -- JSON for complex values
  description TEXT,
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Project Stats Examples**:

```json
// Progress percentage
{
  "stat_key": "progress_percentage",
  "stat_value": "23",
  "description": "Overall project completion percentage"
}

// Days building
{
  "stat_key": "days_building",
  "stat_value": "5",
  "description": "Number of days actively building"
}
```

## Newsletter & Communication

### 9. NewsletterSubscriber

**Purpose**: Newsletter subscriptions with double opt-in

```sql
CREATE TABLE newsletter_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source_page TEXT,  -- Signup attribution
  preferences JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending',  -- 'pending', 'confirmed', 'unsubscribed'
  verification_token TEXT,
  confirmed_at TIMESTAMP,
  unsubscribed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Analytics & Performance

### 10. AnalyticsDaily

**Purpose**: Pre-computed daily metrics for dashboard performance

```sql
CREATE TABLE analytics_daily (
  id TEXT PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  total_votes INTEGER DEFAULT 0,
  unique_voters INTEGER DEFAULT 0,
  total_xp_earned INTEGER DEFAULT 0,
  newsletter_signups INTEGER DEFAULT 0,
  popular_questions JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 11. LiveStat

**Purpose**: Real-time cached statistics

```sql
CREATE TABLE live_stats (
  id TEXT PRIMARY KEY,
  stat_key TEXT UNIQUE NOT NULL,  -- 'total_votes', 'active_questions'
  stat_value INTEGER NOT NULL,
  last_updated TIMESTAMP DEFAULT NOW()
);
```

**Live Stats Examples**:

- `total_votes`: Current total vote count across all questions
- `active_questions`: Number of currently active questions
- `unique_voters_today`: Daily unique voter count
- `total_xp_awarded`: Lifetime XP awarded

### 12. RateLimit

**Purpose**: IP-based abuse protection

```sql
CREATE TABLE rate_limits (
  id TEXT PRIMARY KEY,
  ip_address TEXT NOT NULL,
  action_type TEXT NOT NULL,  -- 'vote', 'newsletter'
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);
```

**Rate Limiting Rules**:

- **Voting**: 100 votes per IP per 24-hour window
- **Newsletter**: 5 signups per IP per 24-hour window
- **Auto-cleanup**: Expired entries removed daily

## Data Flow & Relationships

### Voting Flow

1. User visits page → receives HttpOnly cookie with UUID
2. Cookie UUID → SHA-256 hash → stored in `voter_tokens`
3. User votes → `question_responses` + XP → `xp_ledger`
4. Stats updated → `engagement_stats` + `live_stats`
5. Real-time broadcast → Supabase Realtime → live UI updates

### Content Management Flow

1. Admin creates/edits content → `posts` / `content_blocks`
2. Frontend fetches dynamic content → replaces hardcoded values
3. Stats auto-update → `project_stats` → live dashboard

### Analytics Flow

1. Daily cron job → aggregates data → `analytics_daily`
2. Real-time updates → `live_stats` cache
3. Admin dashboard → reads pre-computed data

## Security Considerations

### Anonymous Voter Privacy

- Only SHA-256 hash stored (irreversible)
- No personal data in voting records
- IP addresses for rate limiting only (24h retention)

### Rate Limiting

- IP-based protection against vote stuffing
- Soft limits with graceful degradation
- Redis alternative using database TTL

### Data Retention

- **Vote data**: Permanent (no PII)
- **Voter tokens**: 12 months of inactivity
- **XP ledger**: 3 years → aggregate to totals
- **Rate limits**: 24 hours auto-expire

## Performance Optimizations

### Indexing Strategy

```sql
-- Critical indexes for performance
CREATE INDEX idx_questions_active_category ON questions(is_active, category);
CREATE INDEX idx_responses_question_created ON question_responses(question_id, created_at);
CREATE INDEX idx_voter_tokens_hash ON voter_tokens(token_hash);
CREATE INDEX idx_live_stats_key ON live_stats(stat_key);
```

### Real-time Capabilities

- Supabase Realtime subscriptions on `question_responses`
- Optimistic UI updates with conflict resolution
- Cached aggregates in `live_stats` for instant loading

## Migration Strategy

### Phase 1: Database Setup

1. Apply Prisma migration
2. Seed initial questions from current `questionBank.ts`
3. Migrate hardcoded content to `content_blocks`

### Phase 2: Component Integration

1. Replace localStorage with tRPC calls
2. Add real-time subscriptions
3. Update community stats to use live data

### Phase 3: Admin Interface

1. Question management dashboard
2. Content editing interface
3. Analytics dashboard

This schema provides a solid foundation for the community-driven development platform while maintaining performance, security, and scalability.
