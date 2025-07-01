import type { Meta, StoryObj } from "@storybook/react";
import { ProjectProgress } from "./ProjectProgress";

const meta = {
  title: "Molecules/ProjectProgress",
  component: ProjectProgress,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Displays project progress with status, progress bar, and metadata information.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Project title",
    },
    description: {
      control: "text",
      description: "Project description",
    },
    progress: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Progress percentage (0-100)",
    },
    status: {
      control: "select",
      options: ["in-progress", "completed", "paused", "planning"],
      description: "Current project status",
    },
    lastUpdated: {
      control: "text",
      description: "Last update timestamp",
    },
    totalTasks: {
      control: "number",
      description: "Total number of tasks",
    },
    completedTasks: {
      control: "number",
      description: "Number of completed tasks",
    },
    variant: {
      control: "select",
      options: ["card", "inline"],
      description: "Visual variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
    showMeta: {
      control: "boolean",
      description: "Whether to show meta information",
    },
  },
} satisfies Meta<typeof ProjectProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InProgress: Story = {
  args: {
    title: "Design System Implementation",
    description: "Building a comprehensive design system with React components and documentation.",
    progress: 65,
    status: "in-progress",
    lastUpdated: "2 hours ago",
    totalTasks: 24,
    completedTasks: 16,
    variant: "card",
    size: "md",
    showMeta: true,
  },
};

export const Completed: Story = {
  args: {
    title: "Component Library",
    description: "Atomic design components with Storybook documentation.",
    progress: 100,
    status: "completed",
    lastUpdated: "1 day ago",
    totalTasks: 18,
    completedTasks: 18,
    variant: "card",
    size: "md",
    showMeta: true,
  },
};

export const Paused: Story = {
  args: {
    title: "Mobile App Development",
    description: "React Native app for iOS and Android platforms.",
    progress: 40,
    status: "paused",
    lastUpdated: "1 week ago",
    totalTasks: 32,
    completedTasks: 13,
    variant: "card",
    size: "md",
    showMeta: true,
  },
};

export const Planning: Story = {
  args: {
    title: "E-commerce Platform",
    description: "Full-stack e-commerce solution with payment integration.",
    progress: 10,
    status: "planning",
    lastUpdated: "3 days ago",
    variant: "card",
    size: "md",
    showMeta: false,
  },
};

export const Inline: Story = {
  args: {
    title: "API Documentation",
    description: "Comprehensive API docs with interactive examples.",
    progress: 80,
    status: "in-progress",
    lastUpdated: "4 hours ago",
    totalTasks: 12,
    completedTasks: 10,
    variant: "inline",
    size: "md",
    showMeta: true,
  },
};

export const Small: Story = {
  args: {
    title: "Bug Fixes",
    progress: 90,
    status: "in-progress",
    lastUpdated: "1 hour ago",
    totalTasks: 8,
    completedTasks: 7,
    variant: "card",
    size: "sm",
    showMeta: true,
  },
};

export const Large: Story = {
  args: {
    title: "Enterprise Dashboard",
    description: "Advanced analytics dashboard with real-time data visualization, user management, and comprehensive reporting features.",
    progress: 45,
    status: "in-progress",
    lastUpdated: "30 minutes ago",
    totalTasks: 56,
    completedTasks: 25,
    variant: "card",
    size: "lg",
    showMeta: true,
  },
};

export const MinimalInline: Story = {
  args: {
    title: "Code Review",
    progress: 75,
    status: "in-progress",
    variant: "inline",
    size: "sm",
    showMeta: false,
  },
};

export const WithoutDescription: Story = {
  args: {
    title: "Security Audit",
    progress: 30,
    status: "in-progress",
    lastUpdated: "6 hours ago",
    totalTasks: 15,
    completedTasks: 5,
    variant: "card",
    size: "md",
    showMeta: true,
  },
};

export const EarlyStage: Story = {
  args: {
    title: "Machine Learning Model",
    description: "Training and optimization of prediction models.",
    progress: 5,
    status: "planning",
    lastUpdated: "2 days ago",
    variant: "card",
    size: "md",
    showMeta: false,
  },
};