import type { Meta, StoryObj } from "@storybook/react";
import { PostPreview } from "./PostPreview";

const meta = {
  title: "Molecules/PostPreview",
  component: PostPreview,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A preview card for blog posts or articles with title, excerpt, metadata, and tags.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Post title",
    },
    excerpt: {
      control: "text",
      description: "Post excerpt or summary",
    },
    href: {
      control: "text",
      description: "Link to the full post",
    },
    date: {
      control: "text",
      description: "Publication date",
    },
    project: {
      control: "text",
      description: "Associated project name",
    },
    readingTime: {
      control: "text",
      description: "Estimated reading time",
    },
    tags: {
      control: "object",
      description: "Array of tag strings",
    },
    variant: {
      control: "select",
      options: ["card", "list", "minimal"],
      description: "Visual variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
    external: {
      control: "boolean",
      description: "Whether the link is external",
    },
    showMeta: {
      control: "boolean",
      description: "Whether to show metadata",
    },
    showExcerpt: {
      control: "boolean",
      description: "Whether to show excerpt",
    },
    showTags: {
      control: "boolean",
      description: "Whether to show tags",
    },
  },
} satisfies Meta<typeof PostPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Building a Modern Design System",
    excerpt: "A comprehensive guide to creating scalable design systems with React, TypeScript, and Tailwind CSS. Learn about atomic design principles, component architecture, and best practices for maintainable UI libraries.",
    href: "/blog/building-design-system",
    date: "2024-01-15",
    project: "Design System",
    readingTime: "8 min read",
    tags: ["React", "TypeScript", "Design System", "Tailwind CSS"],
    variant: "card",
    size: "md",
    external: false,
    showMeta: true,
    showExcerpt: true,
    showTags: true,
  },
};

export const List: Story = {
  args: {
    title: "Component Testing Strategies",
    excerpt: "Effective approaches to testing React components with Jest, React Testing Library, and Storybook visual regression tests.",
    href: "/blog/component-testing",
    date: "2024-01-12",
    project: "Testing",
    readingTime: "12 min read",
    tags: ["Testing", "Jest", "React Testing Library"],
    variant: "list",
    size: "md",
    external: false,
    showMeta: true,
    showExcerpt: true,
    showTags: true,
  },
};

export const Minimal: Story = {
  args: {
    title: "TypeScript Best Practices",
    excerpt: "Essential TypeScript patterns for better type safety and developer experience.",
    href: "/blog/typescript-practices",
    date: "2024-01-10",
    tags: ["TypeScript", "JavaScript"],
    variant: "minimal",
    size: "md",
    external: false,
    showMeta: true,
    showExcerpt: true,
    showTags: true,
  },
};

export const External: Story = {
  args: {
    title: "React 19 New Features",
    excerpt: "Exploring the latest features and improvements in React 19, including concurrent rendering enhancements and new hooks.",
    href: "https://react.dev/blog/react-19",
    date: "2024-01-08",
    readingTime: "15 min read",
    tags: ["React", "JavaScript", "Web Development"],
    variant: "card",
    size: "md",
    external: true,
    showMeta: true,
    showExcerpt: true,
    showTags: true,
  },
};

export const Small: Story = {
  args: {
    title: "CSS Grid Layout Tips",
    excerpt: "Quick tips for mastering CSS Grid layouts in modern web development.",
    href: "/blog/css-grid-tips",
    date: "2024-01-05",
    project: "CSS",
    readingTime: "5 min read",
    tags: ["CSS", "Layout"],
    variant: "card",
    size: "sm",
    external: false,
    showMeta: true,
    showExcerpt: true,
    showTags: true,
  },
};

export const Large: Story = {
  args: {
    title: "Complete Guide to Accessibility in Web Development",
    excerpt: "An in-depth exploration of web accessibility principles, WCAG guidelines, and practical implementation strategies for creating inclusive digital experiences. This comprehensive guide covers everything from semantic HTML to ARIA attributes and screen reader optimization.",
    href: "/blog/web-accessibility-guide",
    date: "2024-01-01",
    project: "Accessibility",
    readingTime: "25 min read",
    tags: ["Accessibility", "WCAG", "HTML", "ARIA", "UX"],
    variant: "card",
    size: "lg",
    external: false,
    showMeta: true,
    showExcerpt: true,
    showTags: true,
  },
};

export const WithoutMeta: Story = {
  args: {
    title: "JavaScript Performance Optimization",
    excerpt: "Techniques for improving JavaScript performance in modern web applications.",
    href: "/blog/js-performance",
    date: "2024-01-03",
    tags: ["JavaScript", "Performance"],
    variant: "card",
    size: "md",
    external: false,
    showMeta: false,
    showExcerpt: true,
    showTags: true,
  },
};

export const WithoutExcerpt: Story = {
  args: {
    title: "Docker for Frontend Developers",
    href: "/blog/docker-frontend",
    date: "2024-01-02",
    project: "DevOps",
    readingTime: "10 min read",
    tags: ["Docker", "DevOps", "Frontend"],
    variant: "card",
    size: "md",
    external: false,
    showMeta: true,
    showExcerpt: false,
    showTags: true,
  },
};

export const WithoutTags: Story = {
  args: {
    title: "Getting Started with Next.js 14",
    excerpt: "A beginner's guide to building applications with the latest version of Next.js.",
    href: "/blog/nextjs-getting-started",
    date: "2023-12-28",
    project: "Next.js",
    readingTime: "7 min read",
    variant: "card",
    size: "md",
    external: false,
    showMeta: true,
    showExcerpt: true,
    showTags: false,
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Quick Update on Project Status",
    href: "/blog/project-update",
    date: "2023-12-25",
    variant: "minimal",
    size: "sm",
    external: false,
    showMeta: false,
    showExcerpt: false,
    showTags: false,
  },
};