import type { Meta, StoryObj } from "@storybook/react";
import { SocialShare } from "./SocialShare";

const meta = {
  title: "Molecules/SocialShare",
  component: SocialShare,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Social sharing component with platform-specific share buttons and copy link functionality.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    url: {
      control: "text",
      description: "URL to share",
    },
    title: {
      control: "text",
      description: "Title for the shared content",
    },
    description: {
      control: "text",
      description: "Description for the shared content",
    },
    platforms: {
      control: "check",
      options: ["twitter", "facebook", "linkedin", "copy"],
      description: "Social platforms to include",
    },
    variant: {
      control: "select",
      options: ["buttons", "dropdown", "minimal"],
      description: "Visual variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
    showLabels: {
      control: "boolean",
      description: "Whether to show platform labels",
    },
    onShare: {
      action: "shared",
      description: "Callback when share action is performed",
    },
  },
} satisfies Meta<typeof SocialShare>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    url: "https://superoptimised.com/blog/design-system",
    title: "Building a Modern Design System",
    description: "A comprehensive guide to creating scalable design systems with React and TypeScript.",
    platforms: ["twitter", "facebook", "linkedin", "copy"],
    variant: "buttons",
    size: "md",
    showLabels: false,
  },
};

export const WithLabels: Story = {
  args: {
    url: "https://superoptimised.com/blog/component-testing",
    title: "Component Testing Strategies",
    description: "Effective approaches to testing React components with Jest and React Testing Library.",
    platforms: ["twitter", "facebook", "linkedin", "copy"],
    variant: "buttons",
    size: "md",
    showLabels: true,
  },
};

export const TwitterOnly: Story = {
  args: {
    url: "https://superoptimised.com/blog/typescript-tips",
    title: "TypeScript Best Practices",
    description: "Essential TypeScript patterns for better type safety.",
    platforms: ["twitter"],
    variant: "buttons",
    size: "md",
    showLabels: true,
  },
};

export const ProfessionalPlatforms: Story = {
  args: {
    url: "https://superoptimised.com/blog/enterprise-architecture",
    title: "Enterprise Architecture Patterns",
    description: "Scalable architecture patterns for large-scale applications.",
    platforms: ["linkedin", "copy"],
    variant: "buttons",
    size: "md",
    showLabels: true,
  },
};

export const Minimal: Story = {
  args: {
    url: "https://superoptimised.com/blog/quick-tip",
    variant: "minimal",
    size: "md",
    showLabels: false,
  },
};

export const Small: Story = {
  args: {
    url: "https://superoptimised.com/blog/css-tips",
    title: "CSS Grid Tips",
    platforms: ["twitter", "copy"],
    variant: "buttons",
    size: "sm",
    showLabels: false,
  },
};

export const Large: Story = {
  args: {
    url: "https://superoptimised.com/blog/accessibility-guide",
    title: "Complete Accessibility Guide",
    description: "An in-depth guide to web accessibility and WCAG compliance.",
    platforms: ["twitter", "facebook", "linkedin", "copy"],
    variant: "buttons",
    size: "lg",
    showLabels: true,
  },
};

export const CopyOnly: Story = {
  args: {
    url: "https://superoptimised.com/api/docs",
    title: "API Documentation",
    platforms: ["copy"],
    variant: "buttons",
    size: "md",
    showLabels: true,
  },
};

export const AllPlatforms: Story = {
  args: {
    url: "https://superoptimised.com/blog/react-patterns",
    title: "Advanced React Patterns",
    description: "Learn advanced React patterns including render props, compound components, and custom hooks.",
    platforms: ["twitter", "facebook", "linkedin", "copy"],
    variant: "buttons",
    size: "md",
    showLabels: false,
  },
};

export const LongContent: Story = {
  args: {
    url: "https://superoptimised.com/blog/comprehensive-guide-to-modern-web-development",
    title: "The Complete Guide to Modern Web Development: From Frontend Frameworks to Backend Architecture",
    description: "An exhaustive exploration of modern web development practices, covering everything from React and TypeScript to Node.js, databases, deployment strategies, and performance optimization techniques.",
    platforms: ["twitter", "facebook", "linkedin", "copy"],
    variant: "buttons",
    size: "md",
    showLabels: true,
  },
};