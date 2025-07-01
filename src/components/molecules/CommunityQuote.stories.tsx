import type { Meta, StoryObj } from "@storybook/react";
import { CommunityQuote } from "./CommunityQuote";

const meta = {
  title: "Molecules/CommunityQuote",
  component: CommunityQuote,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A blockquote component for displaying community feedback and testimonials with author attribution.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    quote: {
      control: "text",
      description: "The quote text content",
    },
    author: {
      control: "text",
      description: "Name of the person being quoted",
    },
    role: {
      control: "text",
      description: "Author's role or title",
    },
    company: {
      control: "text",
      description: "Author's company or organization",
    },
    avatar: {
      control: "text",
      description: "URL to author's avatar image",
    },
    variant: {
      control: "select",
      options: ["default", "highlighted", "minimal"],
      description: "Visual style variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
    showQuoteIcon: {
      control: "boolean",
      description: "Whether to show the quote icon",
    },
  },
} satisfies Meta<typeof CommunityQuote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    quote: "This design system has completely transformed how our team builds components. The consistency and quality are outstanding.",
    author: "Sarah Chen",
    role: "Frontend Developer",
    company: "TechStart Inc",
    variant: "default",
    size: "md",
    showQuoteIcon: true,
  },
};

export const WithAvatar: Story = {
  args: {
    quote: "The component library is incredibly well thought out. Every detail has been considered for both developer experience and user accessibility.",
    author: "Marcus Rodriguez",
    role: "UI/UX Designer",
    company: "Design Co",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    variant: "default",
    size: "md",
    showQuoteIcon: true,
  },
};

export const Highlighted: Story = {
  args: {
    quote: "I've been following this project since the beginning. The transparency in the building process is refreshing and educational.",
    author: "Alex Kim",
    role: "Senior Developer",
    company: "StartupXYZ",
    variant: "highlighted",
    size: "md",
    showQuoteIcon: true,
  },
};

export const Minimal: Story = {
  args: {
    quote: "Simple, clean, and effective. This is how design systems should be built.",
    author: "Jordan Taylor",
    role: "Product Manager",
    variant: "minimal",
    size: "md",
    showQuoteIcon: false,
  },
};

export const Small: Story = {
  args: {
    quote: "Great work on the accessibility features!",
    author: "Casey Morgan",
    role: "Accessibility Engineer",
    company: "WebAccess",
    variant: "default",
    size: "sm",
    showQuoteIcon: true,
  },
};

export const Large: Story = {
  args: {
    quote: "This project demonstrates exceptional attention to detail and a deep understanding of modern web development practices. The component architecture is both flexible and maintainable.",
    author: "Dr. Riley Johnson",
    role: "Tech Lead",
    company: "Enterprise Solutions",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    variant: "default",
    size: "lg",
    showQuoteIcon: true,
  },
};

export const WithoutRole: Story = {
  args: {
    quote: "Love the clean design and thoughtful implementation details.",
    author: "Jamie Park",
    variant: "default",
    size: "md",
    showQuoteIcon: true,
  },
};

export const WithoutQuoteIcon: Story = {
  args: {
    quote: "The documentation and examples make it so easy to get started. Excellent developer experience.",
    author: "Avery Williams",
    role: "Full Stack Developer",
    company: "DevStudio",
    variant: "default",
    size: "md",
    showQuoteIcon: false,
  },
};

export const LongQuote: Story = {
  args: {
    quote: "As someone who has worked with dozens of design systems over the years, I can confidently say this is one of the most well-crafted implementations I've encountered. The balance between flexibility and consistency is perfect, and the attention to accessibility is commendable. This will definitely serve as a reference for future projects.",
    author: "Morgan Davis",
    role: "Principal Engineer",
    company: "Design Systems Corp",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    variant: "highlighted",
    size: "lg",
    showQuoteIcon: true,
  },
};