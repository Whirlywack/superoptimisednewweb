import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "./PageHeader";
import { fn } from "@storybook/test";
import { Download, Github, Share2, Star, Users } from "lucide-react";

const meta = {
  title: "Organisms/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Versatile page header component with dramatic titles, descriptions, breadcrumbs, actions, and multiple variants for different page types.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Main page title",
    },
    description: {
      control: "text",
      description: "Optional page description",
    },
    breadcrumbs: {
      control: "object",
      description: "Navigation breadcrumb items",
    },
    showBackButton: {
      control: "boolean",
      description: "Whether to show back button",
    },
    backButtonHref: {
      control: "text",
      description: "URL for back button (uses browser history if not provided)",
    },
    backButtonLabel: {
      control: "text",
      description: "Label for back button",
    },
    actions: {
      control: "object",
      description: "Action buttons array",
    },
    variant: {
      control: "select",
      options: ["default", "centered", "minimal", "hero"],
      description: "Header layout variant",
    },
    background: {
      control: "select",
      options: ["none", "subtle", "gradient"],
      description: "Background treatment",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
      description: "Header size and spacing",
    },
  },
  args: {
    title: "Page Title",
    description: "This is a page description that provides context about the content below.",
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleBreadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Design System", href: "/projects/design-system" },
];

const sampleActions = [
  {
    label: "Download",
    onClick: fn(),
    icon: Download,
    variant: "primary" as const,
  },
  {
    label: "View on GitHub",
    href: "https://github.com/superoptimised",
    external: true,
    icon: Github,
    variant: "outline" as const,
  },
];

export const Default: Story = {
  args: {
    title: "Building a Modern React Component Library",
    description: "Learn how to create a scalable and maintainable component library using React, TypeScript, and Storybook. This comprehensive guide covers everything from initial setup to deployment and maintenance.",
    variant: "default",
    size: "lg",
    background: "none",
  },
};

export const WithBreadcrumbs: Story = {
  args: {
    title: "Design System Documentation",
    description: "Complete reference for our design system including components, tokens, and usage guidelines.",
    breadcrumbs: sampleBreadcrumbs,
    variant: "default",
    size: "lg",
  },
};

export const WithBackButton: Story = {
  args: {
    title: "Project Details",
    description: "Detailed view of the project including timeline, technologies used, and key learnings from the development process.",
    showBackButton: true,
    backButtonLabel: "Back to Projects",
    backButtonHref: "/projects",
    variant: "default",
    size: "md",
  },
};

export const WithActions: Story = {
  args: {
    title: "Open Source Project",
    description: "A collection of reusable React components built with TypeScript and Tailwind CSS. Perfect for rapid prototyping and production applications.",
    actions: sampleActions,
    variant: "default",
    size: "lg",
  },
};

export const CenteredVariant: Story = {
  args: {
    title: "Welcome to Superoptimised",
    description: "Documenting the journey of building products in the open. Sharing learnings, challenges, and community feedback along the way.",
    variant: "centered",
    size: "xl",
    background: "gradient",
    actions: [
      {
        label: "Get Started",
        onClick: fn(),
        variant: "primary" as const,
      },
      {
        label: "Learn More",
        onClick: fn(),
        variant: "outline" as const,
      },
    ],
  },
};

export const HeroVariant: Story = {
  args: {
    title: "Transform Your Development Workflow",
    description: "Build faster, ship with confidence, and create exceptional user experiences with our comprehensive design system and component library.",
    variant: "hero",
    size: "xl",
    background: "gradient",
    actions: [
      {
        label: "Start Building",
        onClick: fn(),
        icon: Star,
        variant: "primary" as const,
      },
      {
        label: "View Documentation",
        href: "/docs",
        variant: "outline" as const,
      },
      {
        label: "Join Community",
        onClick: fn(),
        icon: Users,
        variant: "outline" as const,
      },
    ],
  },
};

export const MinimalVariant: Story = {
  args: {
    title: "Settings",
    description: "Manage your account preferences and application settings.",
    variant: "minimal",
    size: "sm",
    showBackButton: true,
    backButtonLabel: "Back to Dashboard",
  },
};

export const BlogPost: Story = {
  args: {
    title: "Advanced TypeScript Patterns for Better Code",
    description: "Explore advanced TypeScript patterns that will make your code more type-safe, maintainable, and developer-friendly.",
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: "TypeScript", href: "/blog/typescript" },
    ],
    actions: [
      {
        label: "Share",
        onClick: fn(),
        icon: Share2,
        variant: "outline" as const,
      },
    ],
    variant: "default",
    size: "lg",
    showBackButton: true,
    backButtonLabel: "Back to Blog",
  },
  parameters: {
    docs: {
      description: {
        story: "Example of a blog post header with breadcrumbs, back button, and sharing action.",
      },
    },
  },
};

export const ProjectShowcase: Story = {
  args: {
    title: "Superoptimised Design System",
    description: "A comprehensive design system built for modern web applications. Features a complete component library, design tokens, and documentation.",
    actions: [
      {
        label: "Live Demo",
        href: "https://storybook.superoptimised.com",
        external: true,
        variant: "primary" as const,
      },
      {
        label: "View Code",
        href: "https://github.com/superoptimised/design-system",
        external: true,
        icon: Github,
        variant: "outline" as const,
      },
      {
        label: "Download",
        onClick: fn(),
        icon: Download,
        variant: "outline" as const,
      },
    ],
    variant: "centered",
    size: "xl",
    background: "subtle",
  },
  parameters: {
    docs: {
      description: {
        story: "Project showcase header with multiple action buttons and centered layout.",
      },
    },
  },
};

export const DocumentationPage: Story = {
  args: {
    title: "API Reference",
    description: "Complete API documentation with examples and best practices for all available endpoints and components.",
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Documentation", href: "/docs" },
      { label: "API", href: "/docs/api" },
    ],
    variant: "default",
    size: "md",
    background: "subtle",
  },
  parameters: {
    docs: {
      description: {
        story: "Documentation page header with breadcrumb navigation and subtle background.",
      },
    },
  },
};

export const LandingPageHero: Story = {
  args: {
    title: "Build Better, Ship Faster",
    description: "The complete toolkit for modern web development. From design tokens to deployment, we've got everything you need to create exceptional digital experiences.",
    variant: "hero",
    size: "xl",
    background: "gradient",
    actions: [
      {
        label: "Get Started Free",
        onClick: fn(),
        variant: "primary" as const,
      },
      {
        label: "Watch Demo",
        onClick: fn(),
        variant: "outline" as const,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Landing page hero header with dramatic copy and call-to-action buttons.",
      },
    },
  },
};

export const ErrorPage: Story = {
  args: {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist or has been moved. Let's get you back on track.",
    variant: "centered",
    size: "lg",
    actions: [
      {
        label: "Go Home",
        href: "/",
        variant: "primary" as const,
      },
      {
        label: "Contact Support",
        href: "/contact",
        variant: "outline" as const,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Error page header with centered layout and navigation actions.",
      },
    },
  },
};

export const CompactLayout: Story = {
  args: {
    title: "User Profile",
    variant: "minimal",
    size: "sm",
    showBackButton: true,
    actions: [
      {
        label: "Edit",
        onClick: fn(),
        variant: "outline" as const,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Compact header layout suitable for secondary pages and forms.",
      },
    },
  },
};