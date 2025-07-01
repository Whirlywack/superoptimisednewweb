import type { Meta, StoryObj } from "@storybook/react";
import { JourneyTimeline } from "./JourneyTimeline";
import { fn } from "@storybook/test";

const meta = {
  title: "Templates/JourneyTimeline",
  component: JourneyTimeline,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Journey timeline template for displaying chronological posts, updates, and milestones in a building in public context. Features filtering, search, pagination, and multiple view modes.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Page title",
    },
    description: {
      control: "text",
      description: "Page description",
    },
    posts: {
      control: "object",
      description: "Array of timeline posts",
    },
    currentPage: {
      control: "number",
      description: "Current page number",
    },
    totalPages: {
      control: "number",
      description: "Total number of pages",
    },
    postsPerPage: {
      control: "number",
      description: "Number of posts per page",
    },
    showFilters: {
      control: "boolean",
      description: "Show filter panel",
    },
    showSearch: {
      control: "boolean",
      description: "Show search functionality",
    },
    showStats: {
      control: "boolean",
      description: "Show post statistics",
    },
    showPagination: {
      control: "boolean",
      description: "Show pagination controls",
    },
    viewMode: {
      control: "select",
      options: ["timeline", "grid", "list"],
      description: "Default view mode",
    },
    searchPlaceholder: {
      control: "text",
      description: "Search input placeholder",
    },
    onPageChange: {
      action: "page-changed",
      description: "Page change handler",
    },
    onFilterChange: {
      action: "filter-changed",
      description: "Filter change handler",
    },
    onSearch: {
      action: "search-performed",
      description: "Search handler",
    },
    onPostClick: {
      action: "post-clicked",
      description: "Post click handler",
    },
  },
  args: {
    onPageChange: fn(),
    onFilterChange: fn(),
    onSearch: fn(),
    onPostClick: fn(),
  },
} satisfies Meta<typeof JourneyTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const samplePosts = [
  {
    id: "milestone-v2-launch",
    title: "Platform 2.0 Launch - Building in Public Journey Milestone",
    excerpt: "After 12 months of transparent development, we're excited to launch our completely rebuilt platform with 10x performance improvements and 50+ new features.",
    publishedAt: "2024-01-15",
    readTime: "8 min read",
    href: "/journey/platform-v2-launch",
    author: {
      name: "Development Team",
      avatar: "https://via.placeholder.com/32x32",
    },
    tags: ["Milestone", "Launch", "Platform", "Performance"],
    stats: {
      views: 5420,
      likes: 128,
      comments: 45,
    },
    featured: true,
    milestone: true,
    status: "published" as const,
  },
  {
    id: "component-library-evolution",
    title: "Component Library Evolution: From 20 to 200+ Components",
    excerpt: "Deep dive into how our component library grew organically through community feedback and real-world usage patterns. Learn about the design decisions that shaped our system.",
    publishedAt: "2024-01-12",
    readTime: "6 min read",
    href: "/journey/component-library-evolution",
    author: {
      name: "Sarah Chen",
      avatar: "https://via.placeholder.com/32x32",
    },
    tags: ["Components", "Design System", "Growth", "Community"],
    stats: {
      views: 3240,
      likes: 89,
      comments: 23,
    },
    status: "published" as const,
  },
  {
    id: "api-redesign-lessons",
    title: "API Redesign Lessons: What We Learned from Developer Feedback",
    excerpt: "How we completely redesigned our API based on thousands of pieces of community feedback. The good, the bad, and the surprising insights from building in public.",
    publishedAt: "2024-01-10",
    readTime: "10 min read",
    href: "/journey/api-redesign-lessons",
    author: {
      name: "Marcus Rodriguez",
      avatar: "https://via.placeholder.com/32x32",
    },
    tags: ["API", "Feedback", "Learning", "Developer Experience"],
    stats: {
      views: 4680,
      likes: 156,
      comments: 67,
    },
    status: "published" as const,
  },
  {
    id: "scaling-infrastructure",
    title: "Scaling Infrastructure: From 100 to 100,000 Users",
    excerpt: "Our journey scaling from a small beta to supporting 100,000+ users. Architecture decisions, performance optimizations, and the challenges we faced along the way.",
    publishedAt: "2024-01-08",
    readTime: "12 min read",
    href: "/journey/scaling-infrastructure",
    author: {
      name: "Emily Taylor",
      avatar: "https://via.placeholder.com/32x32",
    },
    tags: ["Infrastructure", "Scaling", "Performance", "Architecture"],
    stats: {
      views: 6720,
      likes: 234,
      comments: 89,
    },
    featured: true,
    status: "published" as const,
  },
  {
    id: "community-driven-features",
    title: "Building Features the Community Actually Wants",
    excerpt: "How we shifted from building what we thought users wanted to building what they actually need. Our framework for community-driven product development.",
    publishedAt: "2024-01-05",
    readTime: "7 min read",
    href: "/journey/community-driven-features",
    author: {
      name: "David Kim",
      avatar: "https://via.placeholder.com/32x32",
    },
    tags: ["Community", "Product", "Features", "Feedback"],
    stats: {
      views: 2890,
      likes: 76,
      comments: 34,
    },
    status: "published" as const,
  },
  {
    id: "first-10000-users",
    title: "From Zero to 10,000 Users: Building in Public Milestone",
    excerpt: "Reflecting on the journey from our first line of code to reaching 10,000 users. What worked, what didn't, and the power of transparent development.",
    publishedAt: "2024-01-03",
    readTime: "9 min read",
    href: "/journey/first-10000-users",
    author: {
      name: "Jessica Park",
      avatar: "https://via.placeholder.com/32x32",
    },
    tags: ["Milestone", "Growth", "Users", "Reflection"],
    stats: {
      views: 8950,
      likes: 312,
      comments: 145,
    },
    milestone: true,
    status: "published" as const,
  },
  {
    id: "open-source-decision",
    title: "Why We Decided to Go Fully Open Source",
    excerpt: "The strategic decision to make our entire platform open source. Business considerations, community impact, and lessons learned from other successful projects.",
    publishedAt: "2024-01-01",
    readTime: "5 min read",
    href: "/journey/open-source-decision",
    author: {
      name: "Alex Thompson",
    },
    tags: ["Open Source", "Strategy", "Community", "Transparency"],
    stats: {
      views: 4230,
      likes: 167,
      comments: 78,
    },
    status: "published" as const,
  },
  {
    id: "year-in-review-2023",
    title: "2023 Year in Review: A Year of Building in Public",
    excerpt: "Complete retrospective of our 2023 journey. Metrics, milestones, challenges overcome, and what we learned from sharing everything publicly.",
    publishedAt: "2023-12-31",
    readTime: "15 min read",
    href: "/journey/year-in-review-2023",
    author: {
      name: "Development Team",
      avatar: "https://via.placeholder.com/32x32",
    },
    tags: ["Year Review", "Metrics", "Retrospective", "Learning"],
    stats: {
      views: 12340,
      likes: 445,
      comments: 203,
    },
    featured: true,
    milestone: true,
    status: "published" as const,
  },
  {
    id: "design-system-v2",
    title: "Design System 2.0: Lessons from 50,000 Components",
    excerpt: "How our design system evolved through real-world usage. Component usage analytics, accessibility improvements, and the design tokens that changed everything.",
    publishedAt: "2023-12-28",
    readTime: "11 min read",
    href: "/journey/design-system-v2",
    author: {
      name: "Lisa Wang",
      avatar: "https://via.placeholder.com/32x32",
    },
    tags: ["Design System", "Components", "Accessibility", "Analytics"],
    stats: {
      views: 3670,
      likes: 124,
      comments: 56,
    },
    status: "published" as const,
  },
  {
    id: "first-enterprise-customer",
    title: "Landing Our First Enterprise Customer: A Transparency Experiment",
    excerpt: "How building in public actually helped us land our first major enterprise deal. The unexpected ways transparency builds trust with large organizations.",
    publishedAt: "2023-12-25",
    readTime: "8 min read",
    href: "/journey/first-enterprise-customer",
    author: {
      name: "Tom Wilson",
      avatar: "https://via.placeholder.com/32x32",
    },
    tags: ["Enterprise", "Sales", "Trust", "Milestone"],
    stats: {
      views: 5890,
      likes: 189,
      comments: 92,
    },
    milestone: true,
    status: "published" as const,
  },
];

const earlyJourneyPosts = [
  {
    id: "day-1-idea",
    title: "Day 1: The Idea That Started Everything",
    excerpt: "The spark that ignited our building in public journey. Why we decided to share everything from day one, and the fears we had to overcome.",
    publishedAt: "2023-01-01",
    readTime: "4 min read",
    href: "/journey/day-1-idea",
    author: {
      name: "Founder",
    },
    tags: ["Beginning", "Idea", "Fear", "Transparency"],
    stats: {
      views: 890,
      likes: 34,
      comments: 12,
    },
    milestone: true,
    status: "published" as const,
  },
  {
    id: "first-week-learnings",
    title: "First Week: What Building in Public Actually Means",
    excerpt: "Reality check after our first week of transparent development. The unexpected challenges and surprising benefits of radical openness.",
    publishedAt: "2023-01-08",
    readTime: "6 min read",
    href: "/journey/first-week-learnings",
    author: {
      name: "Founder",
    },
    tags: ["Learning", "Reality Check", "Challenges", "Benefits"],
    stats: {
      views: 1240,
      likes: 45,
      comments: 18,
    },
    status: "published" as const,
  },
  {
    id: "first-feedback",
    title: "Our First Real Feedback: Humbling and Inspiring",
    excerpt: "The moment we received our first genuine user feedback. How it completely changed our direction and taught us the value of community input.",
    publishedAt: "2023-01-15",
    readTime: "5 min read",
    href: "/journey/first-feedback",
    author: {
      name: "Founder",
    },
    tags: ["Feedback", "Direction Change", "Community", "Humble"],
    stats: {
      views: 1560,
      likes: 67,
      comments: 23,
    },
    status: "published" as const,
  },
];

const recentPosts = [
  {
    id: "upcoming-mobile-app",
    title: "Mobile App Development: Starting Our Next Big Challenge",
    excerpt: "Announcing our mobile app development journey. We're building native iOS and Android apps completely in public, sharing every decision and challenge.",
    publishedAt: "2024-01-18",
    readTime: "5 min read",
    href: "/journey/upcoming-mobile-app",
    author: {
      name: "Mobile Team",
      avatar: "https://via.placeholder.com/32x32",
    },
    tags: ["Mobile", "iOS", "Android", "Announcement"],
    stats: {
      views: 2340,
      likes: 78,
      comments: 34,
    },
    status: "published" as const,
  },
  {
    id: "ai-integration-experiments",
    title: "AI Integration Experiments: Week 1 Results",
    excerpt: "Our first week experimenting with AI-powered features. Raw results, unexpected discoveries, and the questions we're still trying to answer.",
    publishedAt: "2024-01-20",
    readTime: "7 min read",
    href: "/journey/ai-integration-experiments",
    author: {
      name: "AI Research Team",
    },
    tags: ["AI", "Experiments", "Results", "Research"],
    stats: {
      views: 4560,
      likes: 145,
      comments: 67,
    },
    featured: true,
    status: "published" as const,
  },
];

export const Default: Story = {
  args: {
    posts: samplePosts,
    currentPage: 1,
    totalPages: 5,
    postsPerPage: 10,
  },
};

export const TimelineView: Story = {
  args: {
    posts: samplePosts.slice(0, 6),
    viewMode: "timeline",
    showStats: true,
    currentPage: 1,
    totalPages: 3,
  },
};

export const GridView: Story = {
  args: {
    posts: samplePosts,
    viewMode: "grid",
    currentPage: 1,
    totalPages: 3,
  },
};

export const ListView: Story = {
  args: {
    posts: samplePosts,
    viewMode: "list",
    showStats: false,
  },
};

export const WithoutFilters: Story = {
  args: {
    posts: samplePosts.slice(0, 5),
    showFilters: false,
    viewMode: "timeline",
  },
};

export const WithoutSearch: Story = {
  args: {
    posts: samplePosts.slice(0, 5),
    showSearch: false,
    viewMode: "grid",
  },
};

export const MilestonesOnly: Story = {
  args: {
    title: "Major Milestones",
    description: "Key milestones and achievements from our building in public journey",
    posts: samplePosts.filter(post => post.milestone),
    viewMode: "timeline",
    showFilters: false,
  },
};

export const EarlyJourney: Story = {
  args: {
    title: "The Beginning of Our Journey",
    description: "The first steps of building in public - raw, honest, and full of learning moments",
    posts: earlyJourneyPosts,
    viewMode: "timeline",
    showPagination: false,
  },
};

export const RecentUpdates: Story = {
  args: {
    title: "Latest Updates",
    description: "The most recent posts from our ongoing building in public journey",
    posts: recentPosts,
    viewMode: "grid",
    showFilters: false,
    showPagination: false,
  },
};

export const FeaturedPosts: Story = {
  args: {
    title: "Featured Journey Posts",
    description: "Our most impactful and popular posts from the building in public journey",
    posts: samplePosts.filter(post => post.featured),
    viewMode: "grid",
    showFilters: false,
  },
};

export const MinimalLayout: Story = {
  args: {
    title: "Simple Timeline",
    posts: samplePosts.slice(0, 4),
    showFilters: false,
    showSearch: false,
    showStats: false,
    showPagination: false,
    viewMode: "list",
  },
};

export const WithPagination: Story = {
  args: {
    title: "Complete Journey Archive",
    description: "Browse through our complete building in public journey with full pagination support",
    posts: samplePosts,
    currentPage: 2,
    totalPages: 10,
    postsPerPage: 8,
    showPagination: true,
  },
};

export const EmptyState: Story = {
  args: {
    title: "Journey Timeline",
    description: "Your building in public journey will appear here",
    posts: [],
    showFilters: true,
    showSearch: true,
  },
};

export const SinglePost: Story = {
  args: {
    title: "Latest Update",
    posts: [samplePosts[0]],
    showFilters: false,
    showSearch: false,
    showPagination: false,
    viewMode: "timeline",
  },
};

export const DraftPosts: Story = {
  args: {
    title: "Draft Timeline",
    description: "Preview of upcoming posts and drafts in progress",
    posts: [
      {
        ...samplePosts[0],
        id: "draft-1",
        title: "Upcoming Feature: Real-time Collaboration",
        excerpt: "Sneak peek at our upcoming real-time collaboration features. Still in development but we wanted to share our progress.",
        status: "draft" as const,
        publishedAt: "2024-01-25",
      },
      {
        ...samplePosts[1],
        id: "scheduled-1",
        title: "Weekly Update: Performance Improvements",
        excerpt: "This week's focus on performance optimization and the metrics that matter most to our users.",
        status: "scheduled" as const,
        publishedAt: "2024-01-30",
      },
    ],
    viewMode: "list",
    showFilters: false,
  },
};

export const LongContent: Story = {
  args: {
    title: "Complete Journey Archive",
    description: "Every post from our building in public journey, spanning multiple years of transparent development",
    posts: [...recentPosts, ...samplePosts, ...earlyJourneyPosts],
    currentPage: 1,
    totalPages: 15,
    viewMode: "timeline",
  },
  parameters: {
    docs: {
      description: {
        story: "Comprehensive timeline showing the complete journey with all posts and features enabled.",
      },
    },
  },
};