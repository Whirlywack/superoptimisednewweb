import type { Meta, StoryObj } from "@storybook/react";
import { PostCard } from "./PostCard";
import { fn } from "@storybook/test";

const meta = {
  title: "Organisms/PostCard",
  component: PostCard,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Complete journey post card component with title, excerpt, metadata, tags, and engagement metrics. Perfect for blog listings and content grids.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Post title",
    },
    slug: {
      control: "text",
      description: "URL slug for the post",
    },
    excerpt: {
      control: "text",
      description: "Post excerpt or summary",
    },
    date: {
      control: "text",
      description: "Publication date",
    },
    readingTime: {
      control: "text",
      description: "Estimated reading time",
    },
    project: {
      control: "text",
      description: "Associated project name",
    },
    tags: {
      control: "object",
      description: "Array of post tags",
    },
    featured: {
      control: "boolean",
      description: "Whether the post is featured",
    },
    status: {
      control: "select",
      options: ["published", "draft", "updated"],
      description: "Post status",
    },
    engagementCount: {
      control: "number",
      description: "Number of likes/hearts",
    },
    responseCount: {
      control: "number",
      description: "Number of responses/comments",
    },
    variant: {
      control: "select",
      options: ["default", "featured", "compact", "minimal"],
      description: "Card display variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Card size",
    },
    showMeta: {
      control: "boolean",
      description: "Show metadata (date, reading time, project)",
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
      description: "Show post excerpt",
    },
    onClick: {
      action: "clicked",
      description: "Click handler",
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Building a Modern React Component Library",
    slug: "building-modern-react-component-library",
    excerpt: "Learn how to create a scalable and maintainable component library using React, TypeScript, and Storybook. We'll cover everything from setup to deployment.",
    date: "Jan 15, 2024",
    readingTime: "8 min read",
    project: "Design System",
    tags: ["React", "TypeScript", "Storybook"],
    featured: false,
    status: "published",
    engagementCount: 42,
    responseCount: 12,
  },
};

export const Featured: Story = {
  args: {
    title: "The Journey of Building in Public",
    slug: "journey-building-in-public",
    excerpt: "Sharing my experience of building products in the open, the challenges faced, and the incredible community feedback that shaped the development process.",
    date: "Jan 20, 2024",
    readingTime: "12 min read",
    project: "Superoptimised",
    tags: ["Building in Public", "Community", "Journey"],
    featured: true,
    status: "published",
    engagementCount: 156,
    responseCount: 48,
    variant: "featured",
    size: "lg",
  },
};

export const Compact: Story = {
  args: {
    title: "Quick Update: New Features Released",
    slug: "quick-update-new-features",
    excerpt: "A brief overview of the latest features added to the platform based on community feedback.",
    date: "Jan 18, 2024",
    readingTime: "3 min read",
    tags: ["Updates", "Features"],
    variant: "compact",
    size: "sm",
    engagementCount: 24,
    responseCount: 8,
  },
};

export const Minimal: Story = {
  args: {
    title: "Implementing Dark Mode with Tailwind CSS",
    slug: "implementing-dark-mode-tailwind",
    excerpt: "A practical guide to adding dark mode support to your application using Tailwind CSS.",
    date: "Jan 10, 2024",
    readingTime: "5 min read",
    variant: "minimal",
    showEngagement: false,
    showTags: false,
  },
};

export const Draft: Story = {
  args: {
    title: "Work in Progress: Authentication System Redesign",
    slug: "wip-auth-system-redesign",
    excerpt: "Early thoughts on redesigning the authentication system for better user experience and security.",
    date: "Jan 22, 2024",
    readingTime: "6 min read",
    project: "Authentication",
    tags: ["WIP", "Security", "UX"],
    status: "draft",
    variant: "default",
  },
};

export const Updated: Story = {
  args: {
    title: "Performance Optimization Techniques",
    slug: "performance-optimization-techniques",
    excerpt: "Updated with new findings: Advanced techniques for optimizing React application performance.",
    date: "Dec 28, 2023",
    readingTime: "15 min read",
    project: "Performance",
    tags: ["Performance", "React", "Optimization"],
    status: "updated",
    engagementCount: 89,
    responseCount: 23,
  },
};

export const NoEngagement: Story = {
  args: {
    title: "Getting Started with TypeScript",
    slug: "getting-started-typescript",
    excerpt: "A beginner-friendly introduction to TypeScript and its benefits for JavaScript developers.",
    date: "Jan 5, 2024",
    readingTime: "10 min read",
    tags: ["TypeScript", "Tutorial", "Beginners"],
    engagementCount: 0,
    responseCount: 0,
  },
};

export const LongTitle: Story = {
  args: {
    title: "A Comprehensive Guide to Building Accessible Web Applications with Modern JavaScript Frameworks and Best Practices",
    slug: "comprehensive-guide-accessible-web-apps",
    excerpt: "Learn how to create web applications that are accessible to all users, including those with disabilities, using modern tools and techniques.",
    date: "Jan 12, 2024",
    readingTime: "20 min read",
    project: "Accessibility",
    tags: ["Accessibility", "Web Development", "Best Practices", "JavaScript"],
    engagementCount: 67,
    responseCount: 19,
  },
};

export const ManyTags: Story = {
  args: {
    title: "Full-Stack Development with Next.js 14",
    slug: "fullstack-nextjs-14",
    excerpt: "Explore the latest features in Next.js 14 and how to build full-stack applications.",
    date: "Jan 8, 2024",
    readingTime: "18 min read",
    tags: ["Next.js", "React", "TypeScript", "Full-Stack", "Server Components", "App Router", "Database"],
    engagementCount: 134,
    responseCount: 41,
  },
};

export const ExternalLink: Story = {
  args: {
    title: "My Talk at React Conference 2024",
    slug: "react-conference-2024-talk",
    excerpt: "Watch my presentation on building design systems at scale from React Conference 2024.",
    date: "Jan 16, 2024",
    readingTime: "45 min watch",
    href: "https://youtube.com/watch?v=example",
    external: true,
    tags: ["Conference", "Video", "Design Systems"],
    engagementCount: 203,
    responseCount: 0,
  },
};

export const NoExcerpt: Story = {
  args: {
    title: "Quick Tip: CSS Grid Shortcuts",
    slug: "css-grid-shortcuts",
    date: "Jan 19, 2024",
    readingTime: "2 min read",
    tags: ["CSS", "Tips"],
    showExcerpt: false,
    size: "sm",
  },
};

export const NoMeta: Story = {
  args: {
    title: "Understanding React Hooks",
    slug: "understanding-react-hooks",
    excerpt: "A deep dive into React Hooks and how they can simplify your component logic.",
    showMeta: false,
    showEngagement: false,
    tags: ["React", "Hooks"],
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PostCard
        title="Building a Modern React Component Library"
        slug="building-modern-react-component-library"
        excerpt="Learn how to create a scalable and maintainable component library using React, TypeScript, and Storybook."
        date="Jan 15, 2024"
        readingTime="8 min read"
        project="Design System"
        tags={["React", "TypeScript", "Storybook"]}
        engagementCount={42}
        responseCount={12}
      />
      <PostCard
        title="The Journey of Building in Public"
        slug="journey-building-in-public"
        excerpt="Sharing my experience of building products in the open and the community feedback received."
        date="Jan 20, 2024"
        readingTime="12 min read"
        featured
        tags={["Building in Public", "Community"]}
        engagementCount={156}
        responseCount={48}
        variant="featured"
      />
      <PostCard
        title="Performance Optimization Techniques"
        slug="performance-optimization-techniques"
        excerpt="Advanced techniques for optimizing React application performance."
        date="Dec 28, 2023"
        readingTime="15 min read"
        status="updated"
        tags={["Performance", "React"]}
        engagementCount={89}
        responseCount={23}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Example of PostCard components in a responsive grid layout.",
      },
    },
  },
};

export const CompactList: Story = {
  render: () => (
    <div className="space-y-0 divide-y divide-light-gray dark:divide-warm-gray/30">
      <PostCard
        title="Quick Update: New Features Released"
        slug="quick-update-new-features"
        excerpt="A brief overview of the latest features added to the platform."
        date="Jan 18, 2024"
        readingTime="3 min read"
        variant="compact"
        size="sm"
        tags={["Updates"]}
      />
      <PostCard
        title="CSS Grid vs Flexbox: When to Use What"
        slug="css-grid-vs-flexbox"
        excerpt="Understanding the differences and use cases for CSS layout methods."
        date="Jan 10, 2024"
        readingTime="6 min read"
        variant="compact"
        size="sm"
        tags={["CSS", "Layout"]}
      />
      <PostCard
        title="Implementing Authentication with NextAuth"
        slug="implementing-authentication-nextauth"
        excerpt="A step-by-step guide to adding authentication to your Next.js app."
        date="Jan 5, 2024"
        readingTime="10 min read"
        variant="compact"
        size="sm"
        tags={["Authentication", "Next.js"]}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Compact PostCard variant in a list layout, perfect for sidebars or dense content areas.",
      },
    },
  },
};