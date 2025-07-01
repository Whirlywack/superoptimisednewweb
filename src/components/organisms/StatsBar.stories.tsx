import type { Meta, StoryObj } from "@storybook/react";
import { StatsBar } from "./StatsBar";
import { 
  FileText, 
  Clock, 
  Folder, 
  Users, 
  GitCommit,
  Star,
  Eye,
  Download,
  Heart,
  MessageCircle,
  Calendar,
  Activity,
  Globe,
  Code,
  Database
} from "lucide-react";

const meta = {
  title: "Organisms/StatsBar",
  component: StatsBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Statistics bar component displaying key metrics with icons, trends, and optional interactivity. Perfect for dashboards, project overviews, and progress tracking.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    stats: {
      control: "object",
      description: "Array of statistics to display",
    },
    title: {
      control: "text",
      description: "Optional title for the stats section",
    },
    description: {
      control: "text",
      description: "Optional description for the stats section",
    },
    variant: {
      control: "select",
      options: ["default", "compact", "detailed", "grid"],
      description: "Display variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Component size",
    },
    showTrends: {
      control: "boolean",
      description: "Show trend indicators",
    },
    showIcons: {
      control: "boolean",
      description: "Show stat icons",
    },
    highlightBest: {
      control: "boolean",
      description: "Highlight the highest numeric value",
    },
  },
} satisfies Meta<typeof StatsBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const blogStats = [
  { 
    label: "Posts", 
    value: 42, 
    icon: FileText,
    trend: "up" as const,
    trendValue: "+3",
    href: "/journey",
    description: "Published articles and development updates",
  },
  { 
    label: "Last Updated", 
    value: "2 hours ago", 
    icon: Clock,
    description: "Most recent content publication",
  },
  { 
    label: "Projects", 
    value: 8, 
    icon: Folder,
    trend: "up" as const,
    trendValue: "+1",
    href: "/projects",
    description: "Active and completed development projects",
  },
  { 
    label: "Contributors", 
    value: 24, 
    icon: Users,
    trend: "up" as const,
    trendValue: "+5",
    description: "Community members who have contributed",
  },
];

const projectStats = [
  { 
    label: "Stars", 
    value: 1234, 
    icon: Star,
    trend: "up" as const,
    trendValue: "+89",
    href: "https://github.com/superoptimised",
  },
  { 
    label: "Forks", 
    value: 156, 
    icon: GitCommit,
    trend: "up" as const,
    trendValue: "+12",
  },
  { 
    label: "Views", 
    value: 45678, 
    icon: Eye,
    trend: "stable" as const,
  },
  { 
    label: "Downloads", 
    value: 9876, 
    icon: Download,
    trend: "up" as const,
    trendValue: "+234",
  },
];

const engagementStats = [
  { 
    label: "Likes", 
    value: 892, 
    icon: Heart,
    trend: "up" as const,
    trendValue: "+45",
  },
  { 
    label: "Comments", 
    value: 234, 
    icon: MessageCircle,
    trend: "up" as const,
    trendValue: "+18",
  },
  { 
    label: "Shares", 
    value: 156, 
    icon: Globe,
    trend: "stable" as const,
  },
];

const developmentStats = [
  { 
    label: "Components", 
    value: 67, 
    icon: Code,
    trend: "up" as const,
    trendValue: "+8",
    description: "Reusable UI components in the library",
  },
  { 
    label: "API Endpoints", 
    value: 23, 
    icon: Database,
    trend: "up" as const,
    trendValue: "+3",
    description: "RESTful API endpoints available",
  },
  { 
    label: "Test Coverage", 
    value: "87%", 
    icon: Activity,
    trend: "up" as const,
    trendValue: "+2%",
    description: "Percentage of codebase covered by tests",
  },
  { 
    label: "Uptime", 
    value: "99.9%", 
    icon: Globe,
    trend: "stable" as const,
    description: "Service availability percentage",
  },
];

export const Default: Story = {
  args: {
    stats: blogStats,
    title: "Blog Statistics",
    description: "Key metrics from our development blog and community engagement",
  },
};

export const Compact: Story = {
  args: {
    stats: engagementStats,
    variant: "compact",
  },
};

export const Detailed: Story = {
  args: {
    stats: developmentStats,
    variant: "detailed",
    title: "Development Metrics",
    description: "Technical statistics and quality metrics from our development process",
    showTrends: true,
    highlightBest: true,
  },
};

export const Grid: Story = {
  args: {
    stats: [
      ...blogStats.slice(0, 2),
      ...projectStats.slice(0, 2),
      ...engagementStats.slice(0, 2),
    ],
    variant: "grid",
    title: "Platform Overview",
    showTrends: true,
  },
};

export const WithTrends: Story = {
  args: {
    stats: projectStats,
    title: "GitHub Statistics",
    description: "Repository metrics with trend indicators",
    showTrends: true,
  },
};

export const WithoutIcons: Story = {
  args: {
    stats: blogStats,
    title: "Content Metrics",
    showIcons: false,
    showTrends: true,
  },
};

export const HighlightBest: Story = {
  args: {
    stats: projectStats,
    title: "Project Performance",
    description: "Key performance indicators with best metric highlighted",
    highlightBest: true,
    showTrends: true,
  },
};

export const SmallSize: Story = {
  args: {
    stats: engagementStats,
    size: "sm",
    showTrends: true,
  },
};

export const LargeSize: Story = {
  args: {
    stats: blogStats,
    size: "lg",
    title: "Community Growth",
    description: "Measuring our impact and community engagement over time",
    showTrends: true,
    highlightBest: true,
  },
};

export const NoTitleOrDescription: Story = {
  args: {
    stats: projectStats.slice(0, 3),
    showTrends: true,
  },
};

export const SingleStat: Story = {
  args: {
    stats: [
      { 
        label: "Community Members", 
        value: 1547, 
        icon: Users,
        trend: "up" as const,
        trendValue: "+127",
        description: "Active members in our developer community",
      },
    ],
    variant: "detailed",
    title: "Community Size",
    highlightBest: true,
  },
};

export const TwoStats: Story = {
  args: {
    stats: [
      { 
        label: "Active Projects", 
        value: 12, 
        icon: Folder,
        trend: "up" as const,
        trendValue: "+2",
      },
      { 
        label: "Contributors", 
        value: 56, 
        icon: Users,
        trend: "up" as const,
        trendValue: "+8",
      },
    ],
    showTrends: true,
  },
};

export const ManyStats: Story = {
  args: {
    stats: [
      ...blogStats,
      ...projectStats.slice(0, 2),
      ...engagementStats,
    ],
    title: "Complete Platform Statistics",
    description: "Comprehensive overview of all platform metrics and community engagement",
    showTrends: true,
    highlightBest: true,
  },
};

export const StringValues: Story = {
  args: {
    stats: [
      { 
        label: "Status", 
        value: "Active", 
        icon: Activity,
        description: "Current operational status",
      },
      { 
        label: "Version", 
        value: "v2.1.0", 
        icon: Code,
        description: "Latest stable release version",
      },
      { 
        label: "License", 
        value: "MIT", 
        icon: FileText,
        description: "Open source license type",
      },
      { 
        label: "Updated", 
        value: "Today", 
        icon: Calendar,
        description: "Last update timestamp",
      },
    ],
    variant: "detailed",
    title: "Project Information",
  },
};

export const MixedValues: Story = {
  args: {
    stats: [
      { 
        label: "Downloads", 
        value: 52341, 
        icon: Download,
        trend: "up" as const,
        trendValue: "+1.2K",
      },
      { 
        label: "Version", 
        value: "v3.0.2", 
        icon: Code,
      },
      { 
        label: "Rating", 
        value: "4.8/5", 
        icon: Star,
        trend: "up" as const,
        trendValue: "+0.1",
      },
      { 
        label: "Bundle Size", 
        value: "12.4 KB", 
        icon: Database,
        trend: "down" as const,
        trendValue: "-0.8 KB",
      },
    ],
    title: "Package Statistics",
    description: "NPM package metrics and performance indicators",
    showTrends: true,
  },
};

export const InteractiveStats: Story = {
  args: {
    stats: [
      { 
        label: "Blog Posts", 
        value: 42, 
        icon: FileText,
        href: "/blog",
        description: "Click to view all blog posts",
      },
      { 
        label: "Projects", 
        value: 8, 
        icon: Folder,
        href: "/projects",
        description: "Click to explore projects",
      },
      { 
        label: "GitHub", 
        value: 1234, 
        icon: Star,
        href: "https://github.com/superoptimised",
        description: "Click to view on GitHub",
      },
      { 
        label: "Community", 
        value: 567, 
        icon: Users,
        href: "/community",
        description: "Click to join community",
      },
    ],
    variant: "detailed",
    title: "Quick Navigation",
    description: "Click any metric to navigate to the related section",
  },
  parameters: {
    docs: {
      description: {
        story: "Statistics with clickable links for navigation. Hover effects show interactive states.",
      },
    },
  },
};