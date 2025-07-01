import type { Meta, StoryObj } from "@storybook/react";
import { JourneyTimeline } from "./JourneyTimeline";
import { fn } from "@storybook/test";

const meta = {
  title: "Organisms/JourneyTimeline",
  component: JourneyTimeline,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Chronological post listing component that displays the development journey over time. Features grouping, filtering, and various display variants for different contexts.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    posts: {
      control: "object",
      description: "Array of timeline posts",
    },
    groupedPosts: {
      control: "object",
      description: "Pre-grouped posts array",
    },
    variant: {
      control: "select",
      options: ["default", "compact", "detailed", "minimal"],
      description: "Display variant",
    },
    groupBy: {
      control: "select",
      options: ["month", "project", "type", "none"],
      description: "How to group posts",
    },
    showConnector: {
      control: "boolean",
      description: "Show connecting lines between posts",
    },
    showEngagement: {
      control: "boolean",
      description: "Show engagement metrics",
    },
    showTags: {
      control: "boolean",
      description: "Show post tags",
    },
    showExcerpt: {
      control: "boolean",
      description: "Show post excerpts",
    },
    maxPostsPerGroup: {
      control: "number",
      description: "Maximum posts to show per group",
    },
    onPostClick: {
      action: "post-clicked",
      description: "Post click handler",
    },
  },
  args: {
    onPostClick: fn(),
  },
} satisfies Meta<typeof JourneyTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const samplePosts = [
  {
    id: "1",
    title: "Starting the Journey: Building in Public",
    excerpt: "Today marks the beginning of an exciting journey. I'm committing to building in public, sharing every step of the development process, the challenges faced, and lessons learned along the way.",
    slug: "starting-journey-building-public",
    date: "Jan 15, 2024",
    readingTime: "5 min read",
    project: "Superoptimised",
    tags: ["Building in Public", "Journey", "Introduction"],
    type: "announcement" as const,
    featured: true,
    status: "published" as const,
    engagementCount: 142,
    responseCount: 28,
  },
  {
    id: "2",
    title: "Setting Up the Foundation",
    excerpt: "Choosing the tech stack and setting up the development environment. After careful consideration, I've decided on Next.js 14, TypeScript, and Supabase for the backend.",
    slug: "setting-up-foundation",
    date: "Jan 12, 2024",
    readingTime: "8 min read",
    project: "Infrastructure",
    tags: ["Setup", "Tech Stack", "Next.js", "TypeScript"],
    type: "milestone" as const,
    status: "published" as const,
    engagementCount: 89,
    responseCount: 15,
  },
  {
    id: "3",
    title: "First Week Learnings",
    excerpt: "Key insights from the first week of development. The importance of planning, setting up proper development workflows, and the unexpected challenges of TypeScript configuration.",
    slug: "first-week-learnings",
    date: "Jan 10, 2024",
    readingTime: "6 min read",
    project: "Superoptimised",
    tags: ["Learning", "Reflection", "TypeScript"],
    type: "learning" as const,
    status: "published" as const,
    engagementCount: 67,
    responseCount: 12,
  },
  {
    id: "4",
    title: "Design System Challenge",
    excerpt: "Struggling with creating a cohesive design system that's both flexible and consistent. The balance between customization and standardization is trickier than expected.",
    slug: "design-system-challenge",
    date: "Jan 8, 2024",
    readingTime: "7 min read",
    project: "Design System",
    tags: ["Design System", "Challenges", "UI/UX"],
    type: "challenge" as const,
    status: "published" as const,
    engagementCount: 45,
    responseCount: 8,
  },
  {
    id: "5",
    title: "Component Library Milestone",
    excerpt: "Completed the first phase of the component library with 25 reusable components. All components are documented in Storybook with comprehensive examples.",
    slug: "component-library-milestone",
    date: "Jan 5, 2024",
    readingTime: "4 min read",
    project: "Design System",
    tags: ["Components", "Storybook", "Milestone"],
    type: "milestone" as const,
    status: "published" as const,
    engagementCount: 156,
    responseCount: 34,
  },
  {
    id: "6",
    title: "Authentication Deep Dive",
    excerpt: "Exploring different authentication strategies. Magic links vs traditional passwords, the security implications, and user experience considerations.",
    slug: "authentication-deep-dive",
    date: "Jan 3, 2024",
    readingTime: "12 min read",
    project: "Authentication",
    tags: ["Authentication", "Security", "UX"],
    type: "learning" as const,
    status: "published" as const,
    engagementCount: 203,
    responseCount: 45,
  },
  {
    id: "7",
    title: "Database Schema Design",
    excerpt: "Designing the database schema for user management, content storage, and community features. The importance of getting the foundation right from the start.",
    slug: "database-schema-design",
    date: "Dec 28, 2023",
    readingTime: "10 min read",
    project: "Backend",
    tags: ["Database", "Schema", "Planning"],
    type: "update" as const,
    status: "published" as const,
    engagementCount: 78,
    responseCount: 19,
  },
  {
    id: "8",
    title: "Project Kickoff",
    excerpt: "The official start of the Superoptimised project. Setting goals, defining the vision, and establishing the roadmap for the coming months.",
    slug: "project-kickoff",
    date: "Dec 25, 2023",
    readingTime: "6 min read",
    project: "Superoptimised",
    tags: ["Kickoff", "Planning", "Vision"],
    type: "announcement" as const,
    featured: true,
    status: "published" as const,
    engagementCount: 234,
    responseCount: 56,
  },
];

export const Default: Story = {
  args: {
    posts: samplePosts,
    variant: "default",
    groupBy: "month",
    showConnector: true,
    showEngagement: true,
    showTags: true,
    showExcerpt: true,
  },
};

export const Compact: Story = {
  args: {
    posts: samplePosts,
    variant: "compact",
    groupBy: "month",
    showConnector: true,
    showEngagement: false,
    showTags: true,
    showExcerpt: false,
  },
};

export const Detailed: Story = {
  args: {
    posts: samplePosts.slice(0, 4),
    variant: "detailed",
    groupBy: "none",
    showConnector: true,
    showEngagement: true,
    showTags: true,
    showExcerpt: true,
  },
};

export const Minimal: Story = {
  args: {
    posts: samplePosts,
    variant: "minimal",
    groupBy: "none",
    showConnector: false,
    showEngagement: false,
    showTags: false,
    showExcerpt: false,
  },
};

export const GroupedByProject: Story = {
  args: {
    posts: samplePosts,
    variant: "default",
    groupBy: "project",
    showConnector: true,
    showEngagement: true,
    showTags: true,
  },
};

export const GroupedByType: Story = {
  args: {
    posts: samplePosts,
    variant: "default",
    groupBy: "type",
    showConnector: true,
    showEngagement: true,
    showTags: true,
  },
};

export const NoGrouping: Story = {
  args: {
    posts: samplePosts.slice(0, 5),
    variant: "default",
    groupBy: "none",
    showConnector: true,
    showEngagement: true,
    showTags: true,
  },
};

export const NoConnector: Story = {
  args: {
    posts: samplePosts.slice(0, 4),
    variant: "default",
    groupBy: "month",
    showConnector: false,
    showEngagement: true,
    showTags: true,
  },
};

export const LimitedPosts: Story = {
  args: {
    posts: samplePosts,
    variant: "default",
    groupBy: "month",
    maxPostsPerGroup: 2,
    showConnector: true,
    showEngagement: true,
    showTags: true,
  },
};

export const FeaturedOnly: Story = {
  args: {
    posts: samplePosts.filter(post => post.featured),
    variant: "detailed",
    groupBy: "none",
    showConnector: true,
    showEngagement: true,
    showTags: true,
  },
};

export const MilestonesOnly: Story = {
  args: {
    posts: samplePosts.filter(post => post.type === "milestone"),
    variant: "default",
    groupBy: "project",
    showConnector: true,
    showEngagement: true,
    showTags: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Timeline showing only milestone posts, grouped by project.",
      },
    },
  },
};

export const RecentUpdates: Story = {
  args: {
    posts: samplePosts.slice(0, 3),
    variant: "compact",
    groupBy: "none",
    showConnector: true,
    showEngagement: false,
    showTags: true,
    showExcerpt: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Compact timeline variant suitable for recent updates sections.",
      },
    },
  },
};

export const SidebarTimeline: Story = {
  args: {
    posts: samplePosts.slice(0, 5),
    variant: "minimal",
    groupBy: "none",
    showConnector: false,
    showEngagement: false,
    showTags: false,
    showExcerpt: false,
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: "Minimal timeline variant perfect for sidebars and narrow layouts.",
      },
    },
  },
};

export const TypeVariants: Story = {
  args: {
    posts: [
      {
        id: "milestone",
        title: "Major Milestone Achieved",
        excerpt: "Successfully completed a significant project milestone.",
        slug: "milestone-achieved",
        date: "Jan 15, 2024",
        readingTime: "3 min read",
        type: "milestone" as const,
        tags: ["Milestone"],
        engagementCount: 45,
      },
      {
        id: "learning",
        title: "Important Learning Discovery",
        excerpt: "Discovered a new approach that will improve our development process.",
        slug: "learning-discovery",
        date: "Jan 12, 2024",
        readingTime: "5 min read",
        type: "learning" as const,
        tags: ["Learning"],
        engagementCount: 23,
      },
      {
        id: "challenge",
        title: "Overcoming Technical Challenge",
        excerpt: "Faced and resolved a complex technical challenge.",
        slug: "technical-challenge",
        date: "Jan 10, 2024",
        readingTime: "7 min read",
        type: "challenge" as const,
        tags: ["Challenge"],
        engagementCount: 67,
      },
      {
        id: "announcement",
        title: "Exciting Announcement",
        excerpt: "Sharing exciting news about the project direction.",
        slug: "exciting-announcement",
        date: "Jan 8, 2024",
        readingTime: "4 min read",
        type: "announcement" as const,
        featured: true,
        tags: ["Announcement"],
        engagementCount: 134,
      },
    ],
    variant: "default",
    groupBy: "none",
    showConnector: true,
    showEngagement: true,
    showTags: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Showcase of different post types with their distinct visual styling.",
      },
    },
  },
};

export const EmptyState: Story = {
  args: {
    posts: [],
    variant: "default",
    groupBy: "month",
  },
};

export const PreGrouped: Story = {
  args: {
    groupedPosts: [
      {
        label: "January 2024",
        posts: samplePosts.slice(0, 4),
      },
      {
        label: "December 2023", 
        posts: samplePosts.slice(4),
      },
    ],
    variant: "default",
    showConnector: true,
    showEngagement: true,
    showTags: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Timeline with pre-grouped posts, useful when you need custom grouping logic.",
      },
    },
  },
};