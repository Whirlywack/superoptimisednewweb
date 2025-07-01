import type { Meta, StoryObj } from "@storybook/react";
import { AuthorCard } from "./AuthorCard";

const meta = {
  title: "Molecules/AuthorCard",
  component: AuthorCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Author profile card component displaying personal information, bio, and contact details.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Author's name",
    },
    bio: {
      control: "text",
      description: "Author's biography",
    },
    avatar: {
      control: "text",
      description: "URL to author's avatar image",
    },
    location: {
      control: "text",
      description: "Author's location",
    },
    website: {
      control: "text",
      description: "Author's website URL",
    },
    email: {
      control: "text",
      description: "Author's email address",
    },
    joinedDate: {
      control: "text",
      description: "Date when author joined",
    },
    role: {
      control: "text",
      description: "Author's role or title",
    },
    variant: {
      control: "select",
      options: ["card", "inline", "minimal"],
      description: "Visual variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
    showContact: {
      control: "boolean",
      description: "Whether to show contact information",
    },
  },
} satisfies Meta<typeof AuthorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Alex Johnson",
    bio: "Senior Frontend Developer passionate about creating accessible and performant web applications. Expert in React, TypeScript, and modern CSS.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    location: "San Francisco, CA",
    website: "https://alexjohnson.dev",
    email: "alex@example.com",
    joinedDate: "March 2023",
    role: "Senior Frontend Developer",
    variant: "card",
    size: "md",
    showContact: true,
  },
};

export const Inline: Story = {
  args: {
    name: "Sarah Chen",
    bio: "UI/UX Designer and Frontend Developer with a focus on design systems.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
    role: "Design Systems Lead",
    variant: "inline",
    size: "md",
    showContact: false,
  },
};

export const Minimal: Story = {
  args: {
    name: "Jordan Taylor",
    role: "Technical Writer",
    variant: "minimal",
    size: "sm",
    showContact: false,
  },
};

export const WithoutAvatar: Story = {
  args: {
    name: "Morgan Davis",
    bio: "Full-stack developer with expertise in Node.js, React, and cloud architecture.",
    location: "London, UK",
    website: "https://morgandavis.tech",
    joinedDate: "January 2024",
    role: "Full-Stack Developer",
    variant: "card",
    size: "md",
    showContact: true,
  },
};

export const Small: Story = {
  args: {
    name: "Casey Morgan",
    bio: "Accessibility engineer ensuring inclusive digital experiences.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    role: "Accessibility Engineer",
    variant: "card",
    size: "sm",
    showContact: false,
  },
};

export const Large: Story = {
  args: {
    name: "Dr. Riley Johnson",
    bio: "Tech Lead with over 15 years of experience in software architecture and team leadership. Passionate about mentoring developers and building scalable systems that make a positive impact.",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face",
    location: "Seattle, WA",
    website: "https://rileyjohnson.com",
    email: "riley@techcorp.com",
    joinedDate: "2019",
    role: "Principal Engineer & Tech Lead",
    variant: "card",
    size: "lg",
    showContact: true,
  },
};

export const BlogAuthor: Story = {
  args: {
    name: "Avery Williams",
    bio: "Developer advocate sharing insights about modern web development, performance optimization, and developer experience.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face",
    location: "Austin, TX",
    website: "https://averywilliams.blog",
    role: "Developer Advocate",
    variant: "card",
    size: "md",
    showContact: true,
  },
};

export const TeamMember: Story = {
  args: {
    name: "Jamie Park",
    bio: "Product designer focused on user research and interaction design.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",
    location: "New York, NY",
    joinedDate: "June 2023",
    role: "Senior Product Designer",
    variant: "inline",
    size: "md",
    showContact: false,
  },
};

export const ContributorMinimal: Story = {
  args: {
    name: "Sam Lee",
    role: "Open Source Contributor",
    variant: "minimal",
    size: "sm",
    showContact: false,
  },
};

export const LongBio: Story = {
  args: {
    name: "Dr. Cameron Rodriguez",
    bio: "Machine Learning Engineer and Data Scientist with a PhD in Computer Science. Specializes in natural language processing, computer vision, and building AI-powered applications. Previously worked at major tech companies and contributed to several open-source ML frameworks.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face",
    location: "Palo Alto, CA",
    website: "https://cameron-research.ai",
    email: "cameron@ml-research.com",
    joinedDate: "2022",
    role: "Senior ML Engineer",
    variant: "card",
    size: "md",
    showContact: true,
  },
};