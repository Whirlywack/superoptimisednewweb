import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Question bank data from the existing file
const QUESTION_BANK = [
  // Authentication-specific questions
  {
    id: "auth-1",
    category: "auth",
    text: "What's your preference for authentication?",
    options: ["Magic links only", "Traditional login forms"],
  },
  {
    id: "auth-2",
    category: "auth",
    text: "Anonymous feedback vs. tracked contributions?",
    options: ["Full anonymity", "Optional profiles"],
  },
  {
    id: "auth-3",
    category: "auth",
    text: "How long should magic links stay valid?",
    options: ["15 minutes", "1 hour"],
  },

  // Platform/mobile questions
  {
    id: "platform-1",
    category: "platform",
    text: "Primary device for filling surveys?",
    options: ["Mobile phone", "Desktop computer"],
  },
  {
    id: "platform-2",
    category: "platform",
    text: "Preferred interaction method?",
    options: ["Touch/tap", "Click/keyboard"],
  },
  {
    id: "platform-3",
    category: "platform",
    text: "Survey length preference?",
    options: ["Quick 2-3 questions", "Detailed 10+ questions"],
  },

  // Universal questions
  {
    id: "general-1",
    category: "general",
    text: "What motivates you to give feedback?",
    options: ["Improving the product", "Helping the community"],
  },
  {
    id: "general-2",
    category: "general",
    text: "Ideal feedback frequency?",
    options: ["Weekly check-ins", "Only major milestones"],
  },
  {
    id: "general-3",
    category: "general",
    text: "Transparency level preference?",
    options: ["See all decisions", "Just final results"],
  },
  {
    id: "general-4",
    category: "general",
    text: "Community involvement style?",
    options: ["Active participant", "Passive observer"],
  },
  {
    id: "general-5",
    category: "general",
    text: "Feature priority preference?",
    options: ["User experience", "Technical robustness"],
  },

  // Phase 6: Advanced question types for research category
  {
    id: "research-1",
    category: "research",
    text: "Which features are most important for developer productivity?",
    type: "multi-choice",
    description: "Select up to 3 features that matter most to you",
    options: [
      { id: "hot-reload", text: "Hot Reload", description: "Instant code updates without losing state" },
      { id: "type-safety", text: "TypeScript Integration", description: "Full type safety across the stack" },
      { id: "debugging", text: "Advanced Debugging", description: "Source maps and error tracking" },
      { id: "performance", text: "Performance Monitoring", description: "Real-time performance metrics" },
      { id: "testing", text: "Testing Tools", description: "Integrated testing framework" }
    ],
    maxSelections: 3,
  },
  {
    id: "research-2",
    category: "research",
    text: "How would you rate our documentation quality?",
    type: "rating-scale",
    description: "1 = Poor, 10 = Excellent",
    scale: 10,
    variant: "numbers",
  },
  {
    id: "research-3",
    category: "research",
    text: "What feature would you most like to see added next?",
    type: "text-response",
    description: "Describe the feature and why it would be valuable to you",
    maxLength: 500,
    placeholder: "e.g., Real-time collaboration features...",
  },
  {
    id: "research-4",
    category: "research",
    text: "Rank these development priorities in order of importance",
    type: "ranking",
    description: "Drag to reorder from most to least important",
    items: [
      { id: "speed", label: "Development Speed", description: "Fast iteration and deployment" },
      { id: "security", label: "Security", description: "Robust security measures" },
      { id: "scalability", label: "Scalability", description: "Handle growing user base" },
      { id: "maintainability", label: "Code Maintainability", description: "Clean, readable codebase" },
      { id: "user-experience", label: "User Experience", description: "Intuitive and polished UI" }
    ],
  },
  {
    id: "research-5",
    category: "research", 
    text: "Which authentication approach would you prefer?",
    type: "ab-test",
    description: "Compare these two authentication methods",
    optionA: {
      id: "magic-link",
      title: "Magic Link Authentication",
      description: "Passwordless login via email",
      pros: ["No passwords to remember", "More secure", "Faster login"],
      cons: ["Requires email access", "May end up in spam"],
      performance: "Fast (single API call)",
      maintainability: "Low complexity"
    },
    optionB: {
      id: "oauth",
      title: "OAuth with Google/GitHub",
      description: "Social authentication",
      pros: ["Familiar to users", "Quick setup", "Trusted providers"],
      cons: ["Third-party dependency", "Privacy concerns"],
      performance: "Medium (redirect flow)",
      maintainability: "Medium complexity"
    },
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.questionResponse.deleteMany();
  await prisma.question.deleteMany();
  await prisma.xpLedger.deleteMany();
  await prisma.engagementStats.deleteMany();
  await prisma.contentBlock.deleteMany();
  await prisma.projectStat.deleteMany();
  await prisma.liveStat.deleteMany();

  // Seed questions from questionBank
  console.log("📋 Seeding questions...");
  for (const questionData of QUESTION_BANK) {
    // Handle different question types
    const questionType = questionData.type || "binary";
    let questionDataContent: Record<string, any> = {};
    let description = questionData.description || `${questionType} question from ${questionData.category} category`;

    switch (questionType) {
      case "binary":
        questionDataContent = {
          type: "binary",
          options: questionData.options,
        };
        break;
      case "multi-choice":
        questionDataContent = {
          type: "multi-choice",
          maxSelections: questionData.maxSelections || 3,
          options: questionData.options,
        };
        break;
      case "rating-scale":
        questionDataContent = {
          type: "rating-scale",
          scale: questionData.scale || 10,
          variant: questionData.variant || "numbers",
        };
        break;
      case "text-response":
        questionDataContent = {
          type: "text-response",
          maxLength: questionData.maxLength || 500,
          placeholder: questionData.placeholder || "Enter your response...",
        };
        break;
      case "ranking":
        questionDataContent = {
          type: "ranking",
          items: questionData.items || [],
        };
        break;
      case "ab-test":
        questionDataContent = {
          type: "ab-test",
          optionA: questionData.optionA,
          optionB: questionData.optionB,
        };
        break;
      default:
        // Fallback to binary for unknown types
        questionDataContent = {
          type: "binary",
          options: questionData.options || ["Yes", "No"],
        };
    }

    await prisma.question.create({
      data: {
        id: questionData.id,
        title: questionData.text,
        description,
        questionType: questionType,
        questionData: questionDataContent,
        category: questionData.category,
        isActive: true,
        displayOrder: 0,
      },
    });
    console.log(`  ✅ Created ${questionType} question: ${questionData.id}`);
  }

  // Seed initial content blocks
  console.log("📄 Seeding content blocks...");
  const contentBlocks = [
    {
      pageKey: "homepage_hero",
      blockKey: "project_title",
      contentType: "text",
      content: "Magic Link Questionnaire System",
    },
    {
      pageKey: "homepage_hero",
      blockKey: "project_description",
      contentType: "text",
      content:
        "Building a community-driven questionnaire system with radical transparency. Every decision documented, community input shapes the direction.",
    },
    {
      pageKey: "homepage_community",
      blockKey: "stats",
      contentType: "json",
      content: JSON.stringify({
        days_building: 1,
        total_votes: 0,
        decisions_influenced: 0,
        active_polls: 11,
      }),
    },
    {
      pageKey: "about_mission",
      blockKey: "title",
      contentType: "text",
      content: "Your Input Shapes What Gets Built",
    },
    {
      pageKey: "about_mission",
      blockKey: "description",
      contentType: "markdown",
      content:
        "Every feature decision, every design choice, every technical direction - all influenced by community feedback through bite-sized questions and transparent building in public.",
    },
  ];

  for (const block of contentBlocks) {
    await prisma.contentBlock.create({ data: block });
    console.log(`  ✅ Created content block: ${block.pageKey}.${block.blockKey}`);
  }

  // Seed initial project stats
  console.log("📊 Seeding project stats...");
  const projectStats = [
    {
      statKey: "progress_percentage",
      statValue: "15",
      description: "Overall project completion percentage",
    },
    {
      statKey: "days_building",
      statValue: "1",
      description: "Number of days actively building",
    },
    {
      statKey: "milestone_current",
      statValue: "Database Integration",
      description: "Current development milestone",
    },
    {
      statKey: "next_milestone",
      statValue: "Real-time Voting System",
      description: "Next planned milestone",
    },
  ];

  for (const stat of projectStats) {
    await prisma.projectStat.create({ data: stat });
    console.log(`  ✅ Created project stat: ${stat.statKey}`);
  }

  // Seed initial live stats
  console.log("📈 Seeding live stats...");
  const liveStats = [
    { statKey: "total_votes", statValue: 0 },
    { statKey: "active_questions", statValue: 11 },
    { statKey: "unique_voters_today", statValue: 0 },
    { statKey: "total_xp_awarded", statValue: 0 },
    { statKey: "newsletter_subscribers", statValue: 0 },
  ];

  for (const stat of liveStats) {
    await prisma.liveStat.create({ data: stat });
    console.log(`  ✅ Created live stat: ${stat.statKey}`);
  }

  // Create sample blog posts
  console.log("📝 Seeding sample content...");

  const samplePosts = [
    {
      slug: "day-1-foundation",
      title: "Day 1: Foundation - Building in Public",
      excerpt:
        "Starting the journey of building a Magic Link Questionnaire System with complete transparency.",
      content: `# Day 1: Foundation - Building in Public

Today marks the beginning of an exciting experiment in radical transparency and community-driven development.

## What We're Building

A Magic Link Questionnaire System that puts community input at the center of every decision. No traditional logins, no passwords - just smooth, accessible feedback collection.

## Why This Matters

Too many products are built in isolation. We're flipping that script by making every technical decision, every design choice, and every feature prioritization a community conversation.

## What's Next

- Set up the database foundation ✅
- Implement real-time voting system
- Create admin dashboard for question management
- Launch first community questionnaire

Your input shapes what gets built. Every vote matters.`,
      postType: "journey",
      status: "published",
      featured: true,
      publishedAt: new Date("2024-11-15"),
    },
    {
      slug: "week-1-progress-update",
      title: "Week 1: Real-Time Voting System Complete",
      excerpt:
        "Major milestone reached - our anonymous voting system is live and collecting real community input.",
      content: `# Week 1: Real-Time Voting System Complete

What a week! We've gone from concept to a working real-time voting system that's already collecting valuable community feedback.

## What We Built

- **Anonymous Voting**: SHA-256 hashed voter tokens protect privacy
- **Real-time Updates**: WebSocket connections show live vote counts
- **Rate Limiting**: Fair usage with 100 votes per 24 hours
- **XP System**: Progressive rewards for community engagement

## Community Stats So Far

- 47 votes collected
- 12 unique community members
- 3 active polls running
- 100% uptime since launch

## What's Next

Moving into Phase 2 with real-time updates and WebSocket integration. Your feedback is shaping our technical priorities!`,
      postType: "journey",
      status: "published",
      featured: false,
      publishedAt: new Date("2024-11-22"),
    },
    {
      slug: "technical-deep-dive-trpc-setup",
      title: "Technical Deep Dive: tRPC Setup and Type Safety",
      excerpt:
        "A detailed look at how we implemented end-to-end type safety with tRPC for seamless API development.",
      content: `# Technical Deep Dive: tRPC Setup and Type Safety

For fellow developers following our journey, here's how we achieved full-stack type safety with tRPC.

## Why tRPC?

Traditional REST APIs break down when you need:
- Runtime type validation
- End-to-end type safety
- Rapid prototyping
- Real-time subscriptions

## Our Implementation

\`\`\`typescript
// Question router with Zod validation
export const questionRouter = createTRPCRouter({
  getActiveQuestions: publicProcedure
    .input(getActiveQuestionsSchema)
    .query(async ({ input }) => {
      // Fully typed input and output
    }),
});
\`\`\`

## Benefits We've Seen

- Zero API documentation needed
- Automatic type inference in React
- Runtime validation catches errors early
- Seamless WebSocket integration

The developer experience has been incredible. Type errors surface immediately, and refactoring is fearless.`,
      postType: "blog",
      status: "published",
      featured: true,
      publishedAt: new Date("2024-11-28"),
    },
    {
      slug: "community-milestone-100-votes",
      title: "Community Milestone: 100 Votes Reached!",
      excerpt:
        "Celebrating our first major community milestone with insights into what drives engagement.",
      content: `# Community Milestone: 100 Votes Reached!

🎉 We've hit our first major milestone - 100 community votes collected!

## The Journey

It took us exactly 12 days to reach this milestone, with engagement patterns showing:

- **Peak hours**: 2-4 PM and 7-9 PM
- **Most popular question type**: Binary choice polls
- **Average session**: 3.4 votes per visitor
- **Return rate**: 34% of voters return within 48 hours

## What We Learned

1. **Simple questions perform better** - Clear binary choices get 40% more engagement
2. **Context matters** - Questions with background info see higher completion rates
3. **Timing is everything** - Weekday afternoon polls outperform weekend morning ones

## What's Next

With this foundation, we're expanding into:
- Multiple choice questions
- Rating scales (1-10)
- Open-ended feedback collection
- Advanced analytics dashboard

Thank you to every community member who's participated. Your input is literally building this platform!`,
      postType: "announcement",
      status: "published",
      featured: false,
      publishedAt: new Date("2024-12-01"),
    },
    {
      slug: "phase-5-content-management-system",
      title: "Phase 5 Complete: Dynamic Content Management System",
      excerpt:
        "Milestone achieved - our website now runs entirely on database-driven content with full versioning support.",
      content: `# Phase 5 Complete: Dynamic Content Management System

Another major phase in the books! We've successfully implemented a comprehensive content management system that makes our entire website dynamic.

## What Changed

Previously, our content was hardcoded in React components. Now everything flows from the database:

- **26+ content blocks** across all pages
- **Version control** for all content changes
- **Rollback capability** to any previous version
- **Real-time timeline** showing actual project progress

## Technical Implementation

\`\`\`typescript
// Server Components fetch content with fallbacks
export async function ProjectAnnouncement() {
  const heroTitle = await getContentWithFallback(
    'homepage_hero', 
    'hero_title', 
    'Magic Link Questionnaire System'
  );
  
  return <h1>{parseContentWithFormatting(heroTitle)}</h1>;
}
\`\`\`

## Impact on User Experience

- **Faster updates**: Content changes deploy immediately
- **Consistency**: Single source of truth for all messaging
- **Personalization ready**: Foundation for user-specific content
- **A/B testing capable**: Easy to test different messaging

## Lessons Learned

1. **Caching is critical** - 5-minute TTL keeps performance smooth
2. **Fallbacks prevent disasters** - Always have hardcoded backups
3. **Versioning saves lives** - Being able to rollback bad changes is essential
4. **Server Components rock** - Perfect for content that changes infrequently

## Performance Results

- **Page load time**: Improved by 23% with strategic caching
- **Bounce rate**: Decreased 15% with more engaging, dynamic content
- **Admin efficiency**: Content updates now take 30 seconds vs 30 minutes

Phase 6 up next: Advanced question types with multiple choice, rating scales, and ranking questions!`,
      postType: "journey",
      status: "published",
      featured: true,
      publishedAt: new Date("2024-12-15"),
    },
    {
      slug: "upcoming-blog-system-preview",
      title: "Coming Soon: Blog System Preview",
      excerpt:
        "A preview of the upcoming blog system with Markdown support and slug-based routing.",
      content: `# Coming Soon: Blog System Preview

We're working on something exciting - a full-featured blog system that will replace our current static content approach.

## What's Coming

- **Markdown Support**: Rich content with code blocks, images, and formatting
- **Slug-based Routing**: Clean URLs like /journey/post-title  
- **Pagination**: Handle hundreds of posts efficiently
- **Search Functionality**: Find content quickly
- **Category Filtering**: Blog, journey, announcements

## Technical Details

The system is built on:
- tRPC endpoints for type-safe API calls
- Prisma for database operations
- React Query for caching and state management
- Next.js App Router for optimal performance

Stay tuned for the full launch!`,
      postType: "blog",
      status: "draft",
      featured: false,
      publishedAt: null,
    },
  ];

  for (const postData of samplePosts) {
    await prisma.post.upsert({
      where: { slug: postData.slug },
      update: postData,
      create: postData,
    });
    console.log(`  ✅ Created/updated post: ${postData.title}`);
  }

  console.log("\n🎉 Database seeded successfully!");
  console.log(`📊 Summary:`);
  console.log(`  - ${QUESTION_BANK.length} questions created`);
  console.log(`  - ${contentBlocks.length} content blocks created`);
  console.log(`  - ${projectStats.length} project stats created`);
  console.log(`  - ${liveStats.length} live stats created`);
  console.log(`  - ${samplePosts.length} sample blog posts created`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
