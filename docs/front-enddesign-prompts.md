# Frontend Page Prompts for Superoptimised Website

## 1. Homepage

### Purpose
Hero section introducing Superoptimised's transparency mission with featured current project and latest journey update.

### Frontend Prompt
```
Create a Next.js homepage that embodies transparency and authenticity for a "build in public" development company. 

**Layout Requirements:**
- Clean, modern hero section with transparent/authentic feel (not overly polished)
- Featured current project prominently displayed
- Latest journey update with preview and "read more" CTA
- Brief mission statement about building in public
- Professional but approachable design suitable for both community and corporate audiences

**Key Components:**
- Hero with headline, mission statement, and current focus
- Featured project card with tech stack, progress, and link to full project
- Latest journey post preview with excerpt, tags, and community engagement hints
- Newsletter signup with transparent value proposition
- Navigation to Journey, Projects, About sections

**Content Strategy:**
- Emphasize authenticity over perfection
- Show real development progress and challenges
- Include subtle community engagement indicators
- Balance casual learning tone with professional credibility

**Technical Requirements:**
- Next.js 14 with TypeScript
- Tailwind CSS for styling
- SEO-optimized with meta tags and structured data
- Mobile-responsive design
- WCAG 2.1 AA accessibility compliance
- Fast loading with optimized images
```

## 2. Journey Hub/Timeline Page

### Purpose
Chronological blog post listing with project filters and community engagement highlights.

### Frontend Prompt
```
Build a journey timeline page that showcases development blog posts in an engaging, filterable format.

**Layout Requirements:**
- Chronological blog post listing (newest first)
- Filter sidebar/dropdown for projects, tags, and post types
- Each post preview shows title, excerpt, project, tags, and engagement metrics
- Clean, content-focused design that encourages reading
- Pagination or infinite scroll for performance

**Key Components:**
- Filter controls (project, tags, date range)
- Post preview cards with:
  - Title and compelling excerpt
  - Project association and tags
  - Community engagement indicators (responses, shares)
  - Reading time estimate
  - Publication date
- Search functionality for content discovery
- Archive link for older posts

**Interaction Features:**
- Filter persistence in URL
- Smooth transitions between filtered states
- Hover states showing more post details
- Clear "reset filters" option
- Social sharing buttons

**Technical Requirements:**
- Server-side rendering for SEO
- Efficient data fetching with React Query
- URL state management for filters
- Optimized for social media referrals
- Schema.org BlogPosting markup
```

## 3. Individual Journey Post Page

### Purpose
Rich blog post view with embedded community responses, decision explanations, and visual progress indicators.

### Frontend Prompt
```
Create a comprehensive blog post template that integrates community feedback and makes development decisions transparent.

**Layout Requirements:**
- Full-width readable content area optimized for long-form reading
- Embedded Twitter community responses that feel native (not like external embeds)
- Decision timeline or progress indicators within the post
- Related posts and project context
- Author byline and publication metadata

**Key Components:**
- Article header with title, subtitle, project context, and metadata
- Rich markdown content with syntax highlighting for code blocks
- Embedded community response sections throughout the content
- "Decision points" or "progress markers" with visual indicators
- Questionnaire results integration where relevant
- Navigation to previous/next posts in the journey
- Social sharing optimized for developer communities

**Community Integration:**
- Twitter responses displayed as cards within content flow
- Poll results visualization
- Community decision influence indicators
- "Join the conversation" CTAs

**Technical Features:**
- Markdown parsing with syntax highlighting
- Social media embed optimization
- Reading progress indicator
- Table of contents for longer posts
- Print-friendly styling
- JSON-LD structured data for rich snippets
```

## 4. Projects Portfolio Page

### Purpose
Grid view of current and completed projects with technology stack, outcomes, and lessons learned.

### Frontend Prompt
```
Design a project portfolio that showcases technical competency while maintaining transparency about challenges and learnings.

**Layout Requirements:**
- Grid layout showcasing projects as cards
- Filter/sort by status, technology, project type
- Each card shows project overview, tech stack, and key outcomes
- Professional presentation suitable for potential clients
- Clear indication of project status (concept, in-progress, launched, maintained)

**Key Components:**
- Project cards with:
  - Project name and brief description
  - Technology stack badges
  - Status indicator and timeline
  - Key metrics (when available)
  - Links to live demo, case study, or detailed view
- Filter controls for technology, status, project type
- Search functionality
- "Currently building" prominently featured

**Content Strategy:**
- Honest about project outcomes (successes and failures)
- Technical details accessible to developers
- Business impact clear for potential clients
- Learning outcomes emphasized

**Technical Requirements:**
- Responsive grid system
- Filter state management
- Performance optimized image loading
- SEO optimization for individual projects
- Accessibility for screen readers
```

## 5. Project Detail Page

### Purpose
Deep dive into specific project with full development timeline, community decisions, and technical insights.

### Frontend Prompt
```
Build a comprehensive project case study template that tells the complete story of a project's development.

**Layout Requirements:**
- Hero section with project overview and key metrics
- Development timeline with major milestones
- Technical deep dive section with architecture decisions
- Community decision points and their influence
- Lessons learned and retrospective
- Related journey posts

**Key Components:**
- Project hero with name, description, live demo, and repository links
- Technology stack breakdown with rationale for choices
- Interactive timeline showing development phases
- Technical architecture diagrams or screenshots
- Performance metrics and user feedback
- "What I learned" retrospective section
- Links to related journey posts chronicling the development

**Technical Deep Dive:**
- Code examples with syntax highlighting
- Architecture decision records
- Performance optimization explanations
- Security and accessibility considerations
- Testing and deployment strategies

**Community Integration:**
- Decision points where community input influenced direction
- Poll results that affected technical choices
- Community feedback integration
```

## 6. About/Mission Page

### Purpose
Explanation of "build in public" philosophy and team introduction for corporate client trust building.

### Frontend Prompt
```
Create an about page that builds trust with potential clients while staying authentic to the transparent development philosophy.

**Layout Requirements:**
- Personal founder story that builds credibility
- Clear explanation of "build in public" philosophy and its benefits
- Current building focus and expertise areas
- Contact information and availability
- Professional presentation without losing authenticity

**Key Components:**
- Founder introduction with authentic personal story
- Mission statement and values explanation
- "Why build in public" benefits section
- Current focus areas and expertise
- Client testimonials or project outcomes
- Contact form or scheduling link
- Newsletter signup for business updates

**Trust Building Elements:**
- Transparency about process and pricing
- Real project outcomes and timelines
- Honest about strengths and learning areas
- Professional credentials and experience
- Contact accessibility and response expectations

**Dual Audience Balance:**
- Technical depth for developer community
- Business value for potential clients
- Authentic personality while maintaining professionalism
```

## 7. Magic Link Questionnaire Page

### Purpose
Mobile-optimized questionnaire interface with forwarding and newsletter signup integration.

### Frontend Prompt
```
Build a smooth, mobile-first questionnaire experience that feels personal and engaging rather than corporate.

**Layout Requirements:**
- Single-question-per-screen mobile-optimized flow
- Progress indicator showing completion status
- Smooth transitions between questions
- Thank you page with next steps
- Error handling for expired or invalid links

**Key Components:**
- Welcome screen explaining the questionnaire purpose
- Question components supporting multiple input types:
  - Multiple choice (single/multiple selection)
  - Text input (short/long form)
  - Rating scales
  - File upload for context
- Progress bar or step indicator
- Forward to contacts feature
- Newsletter signup integration
- Thank you page with next questionnaire preview

**User Experience:**
- One question at a time to reduce cognitive load
- Clear "back" navigation between questions
- Auto-save responses to prevent data loss
- Estimated completion time
- Personal tone in question copy
- Smooth animations between questions

**Technical Features:**
- Form state management with validation
- Token validation and expiry handling
- Offline support for partial completion
- Analytics for completion rates
- Newsletter API integration
```

## 8. Admin Dashboard

### Purpose
Content and community management interface for efficient workflow execution.

### Frontend Prompt
```
Create an efficient admin dashboard for managing content, questionnaires, and community engagement.

**Layout Requirements:**
- Clean, functional dashboard with key metrics overview
- Content management for journey posts and projects
- Questionnaire creation and response analysis
- Community engagement monitoring
- Newsletter subscriber management

**Key Dashboard Sections:**
1. Overview Dashboard:
   - Recent activity summary
   - Key metrics (page views, engagement, subscribers)
   - Quick actions for common tasks

2. Content Management:
   - Journey post editor with markdown support
   - Project portfolio management
   - Draft/publish workflow
   - SEO optimization tools

3. Questionnaire Management:
   - Questionnaire builder with drag-drop
   - Magic link generation and tracking
   - Response analytics and export
   - Template library

4. Community Engagement:
   - Twitter response monitoring
   - Community decision tracking
   - Engagement analytics

5. Subscriber Management:
   - Newsletter subscriber list
   - Segmentation and targeting
   - Email campaign management

**Technical Requirements:**
- Role-based access control
- Real-time updates for collaborative editing
- Data export capabilities
- Performance monitoring
- Security audit logging
```

## Design System Considerations

### Typography Scale
```css
/* Developer-friendly fonts optimized for code and long-form content */
--font-sans: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;

/* Content-optimized scale */
--text-xs: 0.75rem;     /* Metadata, captions */
--text-sm: 0.875rem;    /* Secondary text */
--text-base: 1rem;      /* Body text */
--text-lg: 1.125rem;    /* Lead paragraphs */
--text-xl: 1.25rem;     /* Section headings */
--text-2xl: 1.5rem;     /* Page titles */
--text-3xl: 1.875rem;   /* Hero headings */
```

### Color Palette
```css
/* Professional but approachable colors */
--primary: #2563eb;     /* Trust-building blue */
--secondary: #64748b;   /* Neutral gray */
--accent: #0ea5e9;      /* Interactive elements */
--success: #10b981;     /* Positive actions */
--warning: #f59e0b;     /* Attention needed */
--error: #ef4444;       /* Error states */

/* Content-focused neutrals */
--neutral-50: #f8fafc;
--neutral-900: #0f172a;
--code-bg: #1e293b;     /* Code block background */
```

### Component Patterns
- Consistent card elevations and border radius
- Subtle hover states that don't distract from content
- Loading states that maintain layout stability
- Error boundaries with helpful recovery actions
- Accessibility-first interactive elements

## 9. 404 Error Page

### Purpose
Helpful and on-brand error page that maintains user engagement when they encounter broken links.

### Frontend Prompt
```
Create a 404 error page that stays true to Superoptimised's transparent, developer-friendly brand while helping users find what they're looking for.

**Layout Requirements:**
- Clear, friendly error message that doesn't blame the user
- Navigation suggestions to help users find relevant content
- Search functionality to locate specific content
- Visual design consistent with main site aesthetic
- Maintain header/footer navigation for site continuity

**Key Components:**
- Honest, developer-humorous error message
- "What you might be looking for" section with:
  - Recent journey posts
  - Featured projects
  - Popular content links
- Search bar for content discovery
- "Report broken link" option for community contribution
- Newsletter signup as recovery action

**Content Strategy:**
- Transparent about what went wrong (if appropriate)
- Maintain authentic, helpful tone
- Turn error into potential engagement opportunity
- Provide clear path forward for users

**Developer-Friendly Touch:**
- Optional: HTTP status code explanation for fellow developers
- Subtle reference to the "building in public" journey
- Link to report issues via GitHub or contact form

**Technical Requirements:**
- Proper 404 HTTP status code
- SEO considerations (noindex, nofollow)
- Analytics tracking for broken link analysis
- Fast loading with minimal dependencies
- Accessibility compliance for error state
```

## 10. Magic Link Expired Page

### Purpose
Specific error page for expired questionnaire tokens with clear next steps and engagement recovery.

### Frontend Prompt
```
Build a friendly expired link page that turns a potential frustration into a positive engagement opportunity.

**Layout Requirements:**
- Clear explanation of why the link expired
- Multiple engagement options to stay connected
- Transparent about the questionnaire system
- Mobile-optimized since many users arrive via mobile
- Maintains trust while offering alternatives

**Key Components:**
- Friendly headline explaining the expiration (not an error)
- Brief explanation of the magic link system and why links expire
- Alternative engagement options:
  - Newsletter signup to get future questionnaires
  - Browse recent journey posts
  - Follow social media for real-time updates
  - Contact form for specific feedback
- "How magic links work" explanation for transparency
- Recent content preview to maintain engagement

**Content Strategy:**
- Educational about the system rather than apologetic
- Transparent about why expiration exists (security, relevance)
- Multiple value propositions for staying engaged
- Maintain the "build in public" educational angle

**Engagement Recovery:**
- Prominent newsletter signup with clear value proposition
- Social media follow buttons
- Link to latest questionnaire insights/results
- "Behind the scenes" content about the questionnaire system

**Technical Features:**
- Token validation and expiry reason detection
- Analytics for expired link patterns
- UTM parameter preservation for source tracking
- Newsletter API integration
- Social sharing for the educational content

**Mobile Optimization:**
- Touch-friendly interaction elements
- Fast loading for users on mobile networks
- Simplified layout for small screens
- Easy newsletter signup flow
```

## Cross-Page Technical Requirements

### SEO & Performance
- Next.js 14 App Router with RSC
- Meta tags and OpenGraph optimization
- JSON-LD structured data for all content types
- Core Web Vitals optimization
- Image optimization with next/image

### State Management
- Zustand for global app state
- React Query for server state
- URL state for filters and navigation
- Form state with React Hook Form

### Accessibility
- WCAG 2.1 AA compliance
- Semantic HTML structure
- Keyboard navigation support
- Screen reader optimization
- Focus management for SPAs

### Mobile Optimization
- Mobile-first responsive design
- Touch-friendly interactive elements
- Optimized for social media traffic
- Fast loading on mobile networks
- Offline support for core content