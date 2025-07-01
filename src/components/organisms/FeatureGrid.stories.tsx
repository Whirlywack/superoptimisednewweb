import type { Meta, StoryObj } from "@storybook/react";
import { FeatureGrid } from "./FeatureGrid";
import { fn } from "@storybook/test";
import { 
  Zap, 
  Shield, 
  Globe, 
  Code, 
  Users, 
  Lightbulb,
  Target,
  Heart,
  Cpu,
  Lock,
  Smartphone,
  Search,
  BarChart,
  Database,
  Cloud,
  GitBranch,
  FileText,
  Settings,
  MessageCircle,
  Palette,
  Monitor,
  RefreshCw
} from "lucide-react";

const meta = {
  title: "Organisms/FeatureGrid",
  component: FeatureGrid,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Feature grid component for showcasing product features, capabilities, or service offerings. Supports various layouts, status indicators, and interactive elements.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Grid title",
    },
    description: {
      control: "text",
      description: "Grid description",
    },
    features: {
      control: "object",
      description: "Array of features to display",
    },
    variant: {
      control: "select",
      options: ["default", "compact", "detailed", "minimal"],
      description: "Display variant",
    },
    columns: {
      control: "select",
      options: [1, 2, 3, 4],
      description: "Number of columns (overrides automatic layout)",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Component size",
    },
    showStatus: {
      control: "boolean",
      description: "Show status badges",
    },
    showTags: {
      control: "boolean",
      description: "Show feature tags",
    },
    highlightNew: {
      control: "boolean",
      description: "Highlight new features",
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
    onFeatureClick: {
      action: "feature-clicked",
      description: "Feature click handler",
    },
  },
  args: {
    onCtaClick: fn(),
    onFeatureClick: fn(),
  },
} satisfies Meta<typeof FeatureGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const platformFeatures = [
  {
    id: "transparency",
    title: "Building in Public",
    description: "Follow our complete development journey with transparent documentation of successes, failures, and learning moments.",
    icon: Globe,
    status: "available" as const,
    href: "/journey",
    tags: ["Transparency", "Learning", "Community"],
    highlighted: true,
  },
  {
    id: "community",
    title: "Community Feedback",
    description: "Integrated feedback system allowing community members to influence development decisions and share insights.",
    icon: Users,
    status: "available" as const,
    href: "/feedback",
    tags: ["Community", "Feedback", "Collaboration"],
  },
  {
    id: "tools",
    title: "Developer Tools",
    description: "Comprehensive toolkit for modern web development including component libraries, APIs, and automation scripts.",
    icon: Code,
    status: "beta" as const,
    href: "/tools",
    tags: ["Tools", "Development", "Automation"],
  },
  {
    id: "education",
    title: "Learning Resources",
    description: "Curated educational content covering modern development practices, architectural decisions, and technical deep-dives.",
    icon: Lightbulb,
    status: "available" as const,
    href: "/learn",
    tags: ["Education", "Resources", "Best Practices"],
  },
  {
    id: "api",
    title: "Public API",
    description: "RESTful API providing access to our development data, metrics, and community insights for integration projects.",
    icon: Database,
    status: "coming-soon" as const,
    tags: ["API", "Integration", "Data"],
  },
  {
    id: "mobile",
    title: "Mobile Experience",
    description: "Native mobile applications for iOS and Android providing optimized access to all platform features on the go.",
    icon: Smartphone,
    status: "coming-soon" as const,
    tags: ["Mobile", "iOS", "Android"],
  },
];

const developerFeatures = [
  {
    id: "components",
    title: "Component Library",
    description: "50+ React components built with TypeScript and Tailwind CSS, fully documented in Storybook.",
    icon: Palette,
    status: "available" as const,
    href: "/storybook",
  },
  {
    id: "api-first",
    title: "API-First Design",
    description: "Type-safe APIs built with tRPC ensuring seamless frontend-backend integration.",
    icon: Zap,
    status: "available" as const,
  },
  {
    id: "security",
    title: "Security Built-In",
    description: "Magic link authentication, rate limiting, and secure anonymous feedback collection.",
    icon: Shield,
    status: "available" as const,
  },
  {
    id: "performance",
    title: "Performance Optimized",
    description: "Server-side rendering, image optimization, and edge caching for lightning-fast load times.",
    icon: Cpu,
    status: "available" as const,
  },
];

const productFeatures = [
  {
    id: "analytics",
    title: "Real-time Analytics",
    description: "Comprehensive analytics dashboard with real-time metrics and performance insights.",
    icon: BarChart,
    status: "new" as const,
    highlighted: true,
  },
  {
    id: "search",
    title: "Advanced Search",
    description: "Powerful search functionality with filters, sorting, and intelligent content discovery.",
    icon: Search,
    status: "available" as const,
  },
  {
    id: "collaboration",
    title: "Team Collaboration",
    description: "Built-in tools for team communication, project management, and collaborative development.",
    icon: MessageCircle,
    status: "beta" as const,
  },
  {
    id: "deployment",
    title: "One-Click Deployment",
    description: "Seamless deployment pipeline with automatic builds, testing, and production releases.",
    icon: Cloud,
    status: "available" as const,
  },
  {
    id: "monitoring",
    title: "System Monitoring",
    description: "Comprehensive monitoring with alerts, logs, and performance tracking across all services.",
    icon: Monitor,
    status: "available" as const,
  },
  {
    id: "automation",
    title: "Workflow Automation",
    description: "Customizable automation workflows for repetitive tasks and development processes.",
    icon: RefreshCw,
    status: "coming-soon" as const,
  },
];

export const Default: Story = {
  args: {
    title: "Platform Features",
    description: "Discover the powerful features that make our platform perfect for building in public and fostering developer communities.",
    features: platformFeatures,
  },
};

export const Compact: Story = {
  args: {
    title: "Developer Tools",
    description: "Essential tools for modern web development",
    features: developerFeatures,
    variant: "compact",
  },
};

export const Detailed: Story = {
  args: {
    title: "Product Capabilities",
    description: "Comprehensive feature set designed for professional development teams and growing communities.",
    features: productFeatures,
    variant: "detailed",
    showTags: true,
    highlightNew: true,
    ctaText: "Explore All Features",
    ctaHref: "/features",
  },
};

export const Minimal: Story = {
  args: {
    title: "Core Features",
    features: developerFeatures.slice(0, 4),
    variant: "minimal",
  },
};

export const TwoColumns: Story = {
  args: {
    title: "Key Capabilities",
    features: developerFeatures,
    columns: 2,
  },
};

export const ThreeColumns: Story = {
  args: {
    title: "Feature Overview",
    features: platformFeatures,
    columns: 3,
  },
};

export const FourColumns: Story = {
  args: {
    features: [
      {
        id: "fast",
        title: "Lightning Fast",
        description: "Optimized for speed and performance",
        icon: Zap,
        status: "available" as const,
      },
      {
        id: "secure",
        title: "Secure by Default",
        description: "Built-in security best practices",
        icon: Shield,
        status: "available" as const,
      },
      {
        id: "scalable",
        title: "Highly Scalable",
        description: "Grows with your needs",
        icon: Globe,
        status: "available" as const,
      },
      {
        id: "developer",
        title: "Developer Friendly",
        description: "Great developer experience",
        icon: Code,
        status: "available" as const,
      },
    ],
    columns: 4,
    variant: "compact",
  },
};

export const WithStatus: Story = {
  args: {
    title: "Development Roadmap",
    description: "Track the progress of our feature development with real-time status updates",
    features: platformFeatures,
    showStatus: true,
    highlightNew: true,
  },
};

export const WithTags: Story = {
  args: {
    title: "Categorized Features",
    description: "Features organized by category and technology stack",
    features: platformFeatures,
    showTags: true,
    variant: "detailed",
  },
};

export const WithoutStatus: Story = {
  args: {
    title: "Clean Feature Grid",
    features: developerFeatures,
    showStatus: false,
  },
};

export const SmallSize: Story = {
  args: {
    features: developerFeatures.slice(0, 4),
    size: "sm",
    variant: "compact",
  },
};

export const LargeSize: Story = {
  args: {
    title: "Enterprise Features",
    description: "Professional-grade capabilities for large-scale development teams and organizations",
    features: productFeatures,
    size: "lg",
    showTags: true,
    ctaText: "Request Enterprise Demo",
    ctaHref: "/enterprise",
  },
};

export const SingleFeature: Story = {
  args: {
    features: [
      {
        id: "flagship",
        title: "Flagship Feature",
        description: "Our most important and comprehensive feature that showcases the full potential of the platform.",
        icon: Target,
        status: "new" as const,
        highlighted: true,
        tags: ["Featured", "Popular", "New"],
      },
    ],
    variant: "detailed",
    showTags: true,
  },
};

export const ComingSoonFeatures: Story = {
  args: {
    title: "Coming Soon",
    description: "Exciting features currently in development",
    features: [
      {
        id: "ai",
        title: "AI Assistant",
        description: "Intelligent code suggestions and development assistance powered by machine learning.",
        icon: Lightbulb,
        status: "coming-soon" as const,
        tags: ["AI", "ML", "Assistant"],
      },
      {
        id: "realtime",
        title: "Real-time Collaboration",
        description: "Live collaborative editing and real-time synchronization across team members.",
        icon: Users,
        status: "coming-soon" as const,
        tags: ["Collaboration", "Real-time", "Teams"],
      },
      {
        id: "advanced",
        title: "Advanced Analytics",
        description: "Deep insights into code quality, performance metrics, and development patterns.",
        icon: BarChart,
        status: "coming-soon" as const,
        tags: ["Analytics", "Metrics", "Insights"],
      },
    ],
    showStatus: true,
    showTags: true,
  },
};

export const InteractiveFeatures: Story = {
  args: {
    title: "Interactive Demo",
    description: "Click on any feature to explore its capabilities",
    features: developerFeatures,
    onFeatureClick: fn(),
  },
};

export const TechStackShowcase: Story = {
  args: {
    title: "Technology Stack",
    description: "Modern technologies powering our development platform",
    features: [
      {
        id: "react",
        title: "React 18",
        description: "Latest React with concurrent features and improved performance",
        icon: Code,
        status: "available" as const,
        tags: ["Frontend", "React", "JavaScript"],
      },
      {
        id: "typescript",
        title: "TypeScript",
        description: "Full type safety across the entire application stack",
        icon: FileText,
        status: "available" as const,
        tags: ["Types", "Safety", "Development"],
      },
      {
        id: "nextjs",
        title: "Next.js 14",
        description: "App Router, Server Components, and edge runtime support",
        icon: Globe,
        status: "available" as const,
        tags: ["Framework", "SSR", "Performance"],
      },
      {
        id: "supabase",
        title: "Supabase",
        description: "PostgreSQL database with real-time subscriptions and auth",
        icon: Database,
        status: "available" as const,
        tags: ["Database", "Auth", "Real-time"],
      },
      {
        id: "tailwind",
        title: "Tailwind CSS",
        description: "Utility-first CSS framework with custom design system",
        icon: Palette,
        status: "available" as const,
        tags: ["CSS", "Design", "Responsive"],
      },
      {
        id: "vercel",
        title: "Vercel Platform",
        description: "Edge deployment with automatic scaling and performance optimization",
        icon: Cloud,
        status: "available" as const,
        tags: ["Deployment", "Edge", "Performance"],
      },
    ],
    columns: 3,
    showTags: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Showcase of the technology stack with detailed descriptions and categorization.",
      },
    },
  },
};