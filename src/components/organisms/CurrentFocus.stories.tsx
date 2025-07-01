import type { Meta, StoryObj } from "@storybook/react";
import { CurrentFocus } from "./CurrentFocus";
import { fn } from "@storybook/test";

const meta = {
  title: "Organisms/CurrentFocus",
  component: CurrentFocus,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Building progress section component that displays current project focus, progress, milestones, and recent updates. Perfect for showcasing what you're currently working on.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Focus area title",
    },
    description: {
      control: "text",
      description: "Focus area description",
    },
    progress: {
      control: "range",
      min: 0,
      max: 100,
      description: "Progress percentage",
    },
    startDate: {
      control: "text",
      description: "Start date",
    },
    targetDate: {
      control: "text",
      description: "Target completion date",
    },
    milestones: {
      control: "object",
      description: "Array of project milestones",
    },
    recentUpdates: {
      control: "object",
      description: "Array of recent updates",
    },
    tags: {
      control: "object",
      description: "Related tags",
    },
    metrics: {
      control: "object",
      description: "Key metrics to display",
    },
    ctaText: {
      control: "text",
      description: "Call-to-action button text",
    },
    ctaHref: {
      control: "text",
      description: "CTA link URL",
    },
    onCtaClick: {
      action: "cta-clicked",
      description: "CTA click handler",
    },
    variant: {
      control: "select",
      options: ["default", "card", "hero", "minimal"],
      description: "Display variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Component size",
    },
    showMilestones: {
      control: "boolean",
      description: "Show milestones section",
    },
    showUpdates: {
      control: "boolean",
      description: "Show recent updates section",
    },
    showMetrics: {
      control: "boolean",
      description: "Show metrics section",
    },
  },
  args: {
    onCtaClick: fn(),
  },
} satisfies Meta<typeof CurrentFocus>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultMilestones = [
  { id: "1", title: "Project setup and configuration", completed: true, date: "Jan 5" },
  { id: "2", title: "Core component development", completed: true, date: "Jan 12" },
  { id: "3", title: "API integration", completed: false },
  { id: "4", title: "Testing and documentation", completed: false },
  { id: "5", title: "Launch preparation", completed: false },
];

const defaultUpdates = [
  {
    date: "2 hours ago",
    content: "Completed the authentication system implementation",
    type: "milestone" as const,
  },
  {
    date: "Yesterday",
    content: "Discovered performance bottleneck in data fetching",
    type: "challenge" as const,
  },
  {
    date: "3 days ago",
    content: "Learned about React Server Components optimization techniques",
    type: "learning" as const,
  },
];

const defaultMetrics = [
  { label: "Components", value: 42, trend: "up" as const },
  { label: "Test Coverage", value: "87%", trend: "up" as const },
  { label: "Contributors", value: 8, trend: "stable" as const },
];

export const Default: Story = {
  args: {
    title: "Building Magic Link Authentication",
    description: "Creating a secure, passwordless authentication system with anonymous questionnaire support and rate limiting.",
    progress: 65,
    startDate: "Jan 1, 2024",
    targetDate: "Feb 15, 2024",
    milestones: defaultMilestones,
    recentUpdates: defaultUpdates,
    tags: ["Authentication", "Security", "Backend"],
    metrics: defaultMetrics,
    ctaText: "Follow Progress",
    ctaHref: "/journey/magic-link-auth",
  },
};

export const Card: Story = {
  args: {
    title: "Component Library Development",
    description: "Building a comprehensive React component library with TypeScript and Storybook.",
    progress: 75,
    startDate: "Dec 15, 2023",
    targetDate: "Jan 30, 2024",
    variant: "card",
    milestones: defaultMilestones,
    tags: ["React", "TypeScript", "Design System"],
    ctaText: "View Components",
    ctaHref: "/storybook",
  },
};

export const Hero: Story = {
  args: {
    title: "Superoptimised Platform Launch",
    description: "Building in public - creating a platform for sharing development journey and gathering community feedback. Follow along as we build everything from authentication to real-time features.",
    progress: 45,
    startDate: "Dec 1, 2023",
    targetDate: "Mar 1, 2024",
    variant: "hero",
    size: "lg",
    milestones: [
      { id: "1", title: "Foundation & Infrastructure", completed: true, date: "Dec 15" },
      { id: "2", title: "Authentication System", completed: true, date: "Jan 5" },
      { id: "3", title: "Component Library", completed: true, date: "Jan 15" },
      { id: "4", title: "API Development", completed: false },
      { id: "5", title: "Community Features", completed: false },
      { id: "6", title: "Public Launch", completed: false },
    ],
    recentUpdates: [
      {
        date: "Today",
        content: "Launched the component library documentation site",
        type: "milestone" as const,
      },
      {
        date: "Yesterday",
        content: "Received amazing feedback from early testers",
        type: "progress" as const,
      },
    ],
    metrics: [
      { label: "Early Access Users", value: 127, trend: "up" as const },
      { label: "Components Built", value: 56, trend: "up" as const },
      { label: "Community Feedback", value: 89, trend: "up" as const },
      { label: "Days Until Launch", value: 45, trend: "down" as const },
    ],
    tags: ["Building in Public", "Platform", "Community"],
    ctaText: "Join Early Access",
    onCtaClick: fn(),
  },
};

export const Minimal: Story = {
  args: {
    title: "Quick Feature Update",
    description: "Adding search functionality to the documentation site.",
    progress: 30,
    startDate: "Jan 20, 2024",
    variant: "minimal",
    ctaText: "View Details",
    ctaHref: "/updates/search-feature",
  },
};

export const NoMilestones: Story = {
  args: {
    title: "Research Phase",
    description: "Exploring new technologies and architectural patterns for the next major feature.",
    progress: 15,
    startDate: "Jan 18, 2024",
    showMilestones: false,
    recentUpdates: defaultUpdates,
    tags: ["Research", "Architecture"],
  },
};

export const NoUpdates: Story = {
  args: {
    title: "API Documentation",
    description: "Creating comprehensive API documentation with interactive examples.",
    progress: 80,
    startDate: "Jan 10, 2024",
    targetDate: "Jan 25, 2024",
    milestones: defaultMilestones.slice(0, 3),
    showUpdates: false,
    tags: ["Documentation", "API"],
  },
};

export const NoMetrics: Story = {
  args: {
    title: "Bug Fixing Sprint",
    description: "Addressing reported issues and improving overall stability.",
    progress: 60,
    startDate: "Jan 22, 2024",
    showMetrics: false,
    milestones: [
      { id: "1", title: "Critical bugs", completed: true },
      { id: "2", title: "Performance issues", completed: false },
      { id: "3", title: "UI/UX improvements", completed: false },
    ],
  },
};

export const Completed: Story = {
  args: {
    title: "Design System Implementation",
    description: "Successfully implemented a comprehensive design system with all core components.",
    progress: 100,
    startDate: "Nov 1, 2023",
    targetDate: "Jan 15, 2024",
    milestones: defaultMilestones.map(m => ({ ...m, completed: true })),
    metrics: [
      { label: "Components", value: 75, trend: "stable" as const },
      { label: "Adoption Rate", value: "100%", trend: "up" as const },
    ],
    ctaText: "View Case Study",
    ctaHref: "/case-studies/design-system",
  },
};

export const JustStarted: Story = {
  args: {
    title: "Mobile App Development",
    description: "Beginning development of a React Native mobile application for iOS and Android.",
    progress: 5,
    startDate: "Jan 20, 2024",
    targetDate: "Apr 30, 2024",
    milestones: [
      { id: "1", title: "Setup development environment", completed: true },
      { id: "2", title: "Design UI/UX mockups", completed: false },
      { id: "3", title: "Implement core features", completed: false },
      { id: "4", title: "Beta testing", completed: false },
    ],
    tags: ["Mobile", "React Native", "New"],
  },
};

export const WithAllFeatures: Story = {
  args: {
    title: "Full-Stack Application Development",
    description: "Building a complete full-stack application with Next.js, TypeScript, and PostgreSQL. This project showcases modern web development practices.",
    progress: 55,
    startDate: "Dec 10, 2023",
    targetDate: "Feb 28, 2024",
    variant: "card",
    size: "lg",
    milestones: [
      { id: "1", title: "Database schema design", completed: true, date: "Dec 15" },
      { id: "2", title: "API development", completed: true, date: "Dec 28" },
      { id: "3", title: "Frontend components", completed: true, date: "Jan 10" },
      { id: "4", title: "Authentication system", completed: false },
      { id: "5", title: "Real-time features", completed: false },
      { id: "6", title: "Deployment setup", completed: false },
    ],
    recentUpdates: [
      {
        date: "4 hours ago",
        content: "Implemented real-time notifications using WebSockets",
        type: "milestone" as const,
      },
      {
        date: "Yesterday",
        content: "Optimized database queries for 3x performance improvement",
        type: "learning" as const,
      },
      {
        date: "2 days ago",
        content: "Struggling with TypeScript generics in the API layer",
        type: "challenge" as const,
      },
      {
        date: "3 days ago",
        content: "Completed user authentication flow",
        type: "milestone" as const,
      },
    ],
    metrics: [
      { label: "API Endpoints", value: 24, trend: "up" as const },
      { label: "Test Coverage", value: "92%", trend: "up" as const },
      { label: "Load Time", value: "1.2s", trend: "down" as const },
      { label: "Active Users", value: 342, trend: "up" as const },
      { label: "Code Quality", value: "A", trend: "stable" as const },
      { label: "Open Issues", value: 8, trend: "down" as const },
    ],
    tags: ["Full-Stack", "Next.js", "TypeScript", "PostgreSQL", "Real-time"],
    ctaText: "View Live Demo",
    ctaHref: "https://demo.example.com",
    ctaExternal: true,
  },
};

export const MultipleInstances: Story = {
  render: () => (
    <div className="space-y-8">
      <CurrentFocus
        title="Primary Focus: Design System"
        description="Building a comprehensive component library"
        progress={75}
        startDate="Jan 1, 2024"
        variant="card"
        milestones={defaultMilestones.slice(0, 3)}
        ctaText="View Progress"
        ctaHref="#"
      />
      <CurrentFocus
        title="Secondary: API Development"
        description="Creating RESTful APIs for the platform"
        progress={40}
        startDate="Jan 15, 2024"
        variant="minimal"
        ctaText="Details"
        ctaHref="#"
      />
      <CurrentFocus
        title="Upcoming: Mobile App"
        description="Planning native mobile application"
        progress={10}
        startDate="Jan 20, 2024"
        variant="minimal"
        ctaText="Roadmap"
        ctaHref="#"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Multiple CurrentFocus components showing different project focuses.",
      },
    },
  },
};