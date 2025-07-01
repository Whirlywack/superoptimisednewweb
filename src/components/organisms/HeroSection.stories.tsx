import type { Meta, StoryObj } from "@storybook/react";
import { HeroSection } from "./HeroSection";
import { fn } from "@storybook/test";
import { 
  ArrowRight, 
  Star, 
  Github, 
  Play, 
  Download, 
  Zap, 
  Shield, 
  Rocket, 
  Users, 
  Code, 
  Sparkles 
} from "lucide-react";

const meta = {
  title: "Organisms/HeroSection",
  component: HeroSection,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Hero section component for landing pages with support for titles, descriptions, actions, features, metrics, and background media. Perfect for showcasing current building focus and project highlights.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Main hero title",
    },
    subtitle: {
      control: "text",
      description: "Optional subtitle or badge text",
    },
    description: {
      control: "text",
      description: "Hero description text",
    },
    actions: {
      control: "object",
      description: "Array of action buttons",
    },
    features: {
      control: "object",
      description: "Array of feature highlights",
    },
    backgroundImage: {
      control: "text",
      description: "Background image URL",
    },
    backgroundVideo: {
      control: "text",
      description: "Background video URL",
    },
    variant: {
      control: "select",
      options: ["default", "centered", "split", "minimal", "gradient"],
      description: "Hero layout variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "Hero size and spacing",
    },
    showMetrics: {
      control: "boolean",
      description: "Whether to show metrics section",
    },
    metrics: {
      control: "object",
      description: "Array of metrics to display",
    },
  },
  args: {
    title: "Build Better, Ship Faster",
    description: "Create exceptional digital experiences with our comprehensive design system and development tools.",
  },
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultActions = [
  {
    label: "Get Started",
    onClick: fn(),
    variant: "primary" as const,
    icon: ArrowRight,
  },
  {
    label: "View Demo",
    onClick: fn(),
    variant: "outline" as const,
    icon: Play,
  },
];

const githubActions = [
  {
    label: "View on GitHub",
    href: "https://github.com/superoptimised",
    external: true,
    variant: "primary" as const,
    icon: Github,
  },
  {
    label: "Download",
    onClick: fn(),
    variant: "outline" as const,
    icon: Download,
  },
];

const sampleFeatures = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for performance with minimal bundle size and fast loading times.",
  },
  {
    icon: Shield,
    title: "Type Safe",
    description: "Built with TypeScript for better developer experience and fewer runtime errors.",
  },
  {
    icon: Rocket,
    title: "Production Ready",
    description: "Battle-tested components used in production by teams around the world.",
  },
];

const sampleMetrics = [
  { value: "50+", label: "Components" },
  { value: "10k+", label: "Downloads" },
  { value: "99%", label: "Uptime" },
  { value: "5★", label: "Rating" },
];

export const Default: Story = {
  args: {
    title: "Building in the Open",
    subtitle: "Current Focus",
    description: "Follow my journey as I build products in public, sharing learnings, challenges, and community feedback along the way. Join the conversation and help shape the future of open development.",
    actions: defaultActions,
    variant: "default",
    size: "lg",
  },
};

export const Centered: Story = {
  args: {
    title: "Transform Your Development Workflow",
    subtitle: "Superoptimised Design System",
    description: "A comprehensive toolkit for modern web development. From design tokens to deployment, everything you need to create exceptional digital experiences.",
    actions: defaultActions,
    variant: "centered",
    size: "xl",
  },
};

export const WithFeatures: Story = {
  args: {
    title: "Next Generation Component Library",
    description: "Built for developers who demand excellence. Our component library provides everything you need to build modern, accessible, and performant web applications.",
    actions: defaultActions,
    features: sampleFeatures,
    variant: "default",
    size: "lg",
  },
};

export const WithMetrics: Story = {
  args: {
    title: "Trusted by Developers Worldwide",
    description: "Join thousands of developers who are already building better products with our tools and components.",
    actions: [
      {
        label: "Join Community",
        onClick: fn(),
        variant: "primary" as const,
        icon: Users,
      },
      {
        label: "Explore Components",
        onClick: fn(),
        variant: "outline" as const,
        icon: Code,
      },
    ],
    showMetrics: true,
    metrics: sampleMetrics,
    variant: "centered",
    size: "lg",
  },
};

export const SplitLayout: Story = {
  args: {
    title: "Code with Confidence",
    subtitle: "Developer Tools",
    description: "Our comprehensive suite of development tools helps you write better code, catch bugs early, and ship with confidence.",
    actions: [
      {
        label: "Start Coding",
        onClick: fn(),
        variant: "primary" as const,
        icon: Code,
      },
      {
        label: "View Documentation",
        onClick: fn(),
        variant: "outline" as const,
      },
    ],
    variant: "split",
    size: "lg",
  },
};

export const GradientBackground: Story = {
  args: {
    title: "Innovation Meets Simplicity",
    subtitle: "New Release",
    description: "Experience the perfect balance of powerful features and intuitive design. Our latest release brings you closer to your goals with every interaction.",
    actions: [
      {
        label: "Explore Features",
        onClick: fn(),
        variant: "primary" as const,
        icon: Sparkles,
      },
      {
        label: "Read Release Notes",
        onClick: fn(),
        variant: "outline" as const,
      },
    ],
    variant: "gradient",
    size: "xl",
  },
};

export const Minimal: Story = {
  args: {
    title: "Simple. Powerful. Effective.",
    description: "Sometimes less is more. Focus on what matters most with our minimalist approach to design and development.",
    actions: [
      {
        label: "Learn More",
        onClick: fn(),
        variant: "primary" as const,
        size: "md" as const,
      },
    ],
    variant: "minimal",
    size: "md",
  },
};

export const OpenSourceProject: Story = {
  args: {
    title: "Superoptimised Design System",
    subtitle: "Open Source",
    description: "A modern, accessible, and customizable design system built with React, TypeScript, and Tailwind CSS. Available for free under MIT license.",
    actions: githubActions,
    features: [
      {
        icon: Star,
        title: "Open Source",
        description: "Free to use, modify, and distribute under MIT license.",
      },
      {
        icon: Users,
        title: "Community Driven",
        description: "Built with feedback and contributions from the developer community.",
      },
      {
        icon: Code,
        title: "Developer Friendly",
        description: "Well-documented, tested, and easy to integrate into your projects.",
      },
    ],
    showMetrics: true,
    metrics: [
      { value: "2.5k", label: "GitHub Stars" },
      { value: "150+", label: "Contributors" },
      { value: "95%", label: "Test Coverage" },
    ],
    variant: "default",
    size: "lg",
  },
  parameters: {
    docs: {
      description: {
        story: "Example of an open source project hero with GitHub integration, community metrics, and feature highlights.",
      },
    },
  },
};

export const ProductLaunch: Story = {
  args: {
    title: "Introducing the Future of Web Development",
    subtitle: "Now Available",
    description: "After months of development and testing, we're excited to launch our most powerful toolset yet. Built for modern teams who want to move fast without breaking things.",
    actions: [
      {
        label: "Get Early Access",
        onClick: fn(),
        variant: "primary" as const,
        icon: Rocket,
      },
      {
        label: "Watch Launch Video",
        onClick: fn(),
        variant: "outline" as const,
        icon: Play,
      },
      {
        label: "Read Documentation",
        href: "/docs",
        variant: "ghost" as const,
      },
    ],
    showMetrics: true,
    metrics: [
      { value: "10x", label: "Faster Development" },
      { value: "99.9%", label: "Reliability" },
      { value: "24/7", label: "Support" },
    ],
    variant: "centered",
    size: "xl",
  },
  parameters: {
    docs: {
      description: {
        story: "Product launch hero with multiple CTAs, metrics, and promotional messaging.",
      },
    },
  },
};

export const DeveloperFocused: Story = {
  args: {
    title: "Built by Developers, for Developers",
    subtitle: "Developer Experience",
    description: "Every component, every API, and every feature is designed with the developer experience in mind. Because when developers are happy, amazing things happen.",
    actions: [
      {
        label: "Start Building",
        onClick: fn(),
        variant: "primary" as const,
        icon: Code,
      },
      {
        label: "API Reference",
        href: "/api",
        variant: "outline" as const,
      },
    ],
    features: [
      {
        icon: Zap,
        title: "Zero Configuration",
        description: "Works out of the box with sensible defaults. Customize when you need to.",
      },
      {
        icon: Shield,
        title: "Type Safety",
        description: "Full TypeScript support with comprehensive type definitions.",
      },
      {
        icon: Sparkles,
        title: "Modern Stack",
        description: "Built with the latest technologies and best practices.",
      },
    ],
    variant: "split",
    size: "lg",
  },
  parameters: {
    docs: {
      description: {
        story: "Developer-focused hero emphasizing technical benefits and developer experience.",
      },
    },
  },
};

export const CommunityDriven: Story = {
  args: {
    title: "Join the Building Community",
    subtitle: "Community",
    description: "Connect with like-minded developers, share your projects, get feedback, and learn from others who are also building in the open.",
    actions: [
      {
        label: "Join Discord",
        onClick: fn(),
        variant: "primary" as const,
        icon: Users,
      },
      {
        label: "Share Your Project",
        onClick: fn(),
        variant: "outline" as const,
        icon: Star,
      },
    ],
    showMetrics: true,
    metrics: [
      { value: "5k+", label: "Community Members" },
      { value: "200+", label: "Projects Shared" },
      { value: "1k+", label: "Discussions" },
    ],
    variant: "centered",
    size: "lg",
  },
  parameters: {
    docs: {
      description: {
        story: "Community-focused hero highlighting engagement and social aspects.",
      },
    },
  },
};

export const BlogHomepage: Story = {
  args: {
    title: "The Building Journey",
    subtitle: "Developer Blog",
    description: "Follow along as I document the process of building products in public. Real challenges, honest reflections, and practical insights from the development trenches.",
    actions: [
      {
        label: "Read Latest Posts",
        href: "/blog",
        variant: "primary" as const,
      },
      {
        label: "Subscribe to Updates",
        onClick: fn(),
        variant: "outline" as const,
      },
    ],
    variant: "default",
    size: "lg",
  },
  parameters: {
    docs: {
      description: {
        story: "Blog homepage hero focusing on content and storytelling.",
      },
    },
  },
};