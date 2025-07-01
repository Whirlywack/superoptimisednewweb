import type { Meta, StoryObj } from "@storybook/react";
import { PostMeta } from "./PostMeta";

const meta = {
  title: "Molecules/PostMeta",
  component: PostMeta,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Displays post metadata including date, project, and reading time with appropriate icons.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    date: {
      control: "text",
      description: "Publication date of the post",
    },
    project: {
      control: "text",
      description: "Project name associated with the post",
    },
    readingTime: {
      control: "text",
      description: "Estimated reading time",
    },
    variant: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Layout orientation",
    },
  },
} satisfies Meta<typeof PostMeta>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    date: "2024-01-15",
    project: "Superoptimised Web",
    readingTime: "5 min read",
    variant: "horizontal",
  },
};

export const Vertical: Story = {
  args: {
    date: "2024-01-15",
    project: "Superoptimised Web",
    readingTime: "5 min read",
    variant: "vertical",
  },
};

export const DateOnly: Story = {
  args: {
    date: "2024-01-15",
    variant: "horizontal",
  },
};

export const WithProject: Story = {
  args: {
    date: "2024-01-15",
    project: "Design System Implementation",
    variant: "horizontal",
  },
};

export const WithReadingTime: Story = {
  args: {
    date: "2024-01-15",
    readingTime: "12 min read",
    variant: "horizontal",
  },
};

export const Complete: Story = {
  args: {
    date: "2024-01-15",
    project: "Component Library",
    readingTime: "8 min read",
    variant: "horizontal",
  },
};

export const LongContent: Story = {
  args: {
    date: "2024-01-15",
    project: "Building a Comprehensive Design System for Modern Web Applications",
    readingTime: "25 min read",
    variant: "horizontal",
  },
};