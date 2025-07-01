import type { Meta, StoryObj } from "@storybook/react";
import { EngagementMetrics } from "./EngagementMetrics";

const meta = {
  title: "Molecules/EngagementMetrics",
  component: EngagementMetrics,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Displays engagement metrics (likes, comments, shares) with icons and formatted counts.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    metrics: {
      control: "object",
      description: "Array of engagement metrics to display",
    },
    variant: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Layout orientation",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
    showLabels: {
      control: "boolean",
      description: "Whether to show text labels",
    },
  },
} satisfies Meta<typeof EngagementMetrics>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    metrics: [
      { type: "likes", count: 42 },
      { type: "comments", count: 8 },
      { type: "shares", count: 3 },
    ],
    variant: "horizontal",
    size: "md",
    showLabels: false,
  },
};

export const WithLabels: Story = {
  args: {
    metrics: [
      { type: "likes", count: 42 },
      { type: "comments", count: 8 },
      { type: "shares", count: 3 },
    ],
    variant: "horizontal",
    size: "md",
    showLabels: true,
  },
};

export const Vertical: Story = {
  args: {
    metrics: [
      { type: "likes", count: 156 },
      { type: "comments", count: 23 },
      { type: "shares", count: 7 },
    ],
    variant: "vertical",
    size: "md",
    showLabels: true,
  },
};

export const HighNumbers: Story = {
  args: {
    metrics: [
      { type: "likes", count: 1247 },
      { type: "comments", count: 89 },
      { type: "shares", count: 156 },
    ],
    variant: "horizontal",
    size: "md",
    showLabels: false,
  },
};

export const VeryHighNumbers: Story = {
  args: {
    metrics: [
      { type: "likes", count: 125000 },
      { type: "comments", count: 2400 },
      { type: "shares", count: 5600 },
    ],
    variant: "horizontal",
    size: "lg",
    showLabels: true,
  },
};

export const MillionViews: Story = {
  args: {
    metrics: [
      { type: "likes", count: 2500000 },
      { type: "comments", count: 45000 },
      { type: "shares", count: 120000 },
    ],
    variant: "horizontal",
    size: "lg",
    showLabels: true,
  },
};

export const SmallSize: Story = {
  args: {
    metrics: [
      { type: "likes", count: 24 },
      { type: "comments", count: 5 },
    ],
    variant: "horizontal",
    size: "sm",
    showLabels: false,
  },
};

export const SingleMetric: Story = {
  args: {
    metrics: [
      { type: "likes", count: 89 },
    ],
    variant: "horizontal",
    size: "md",
    showLabels: true,
  },
};

export const CustomLabels: Story = {
  args: {
    metrics: [
      { type: "likes", count: 42, label: "reactions" },
      { type: "comments", count: 8, label: "responses" },
      { type: "shares", count: 3, label: "reposts" },
    ],
    variant: "horizontal",
    size: "md",
    showLabels: true,
  },
};