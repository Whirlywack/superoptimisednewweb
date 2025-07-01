import type { Meta, StoryObj } from "@storybook/react";
import { StatsDisplay } from "./StatsDisplay";
import { Download, Heart } from "lucide-react";

const meta = {
  title: "Molecules/StatsDisplay",
  component: StatsDisplay,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Displays statistical data with icons, values, and trend indicators in various layouts.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    stats: {
      control: "object",
      description: "Array of statistics to display",
    },
    variant: {
      control: "select",
      options: ["cards", "inline", "compact"],
      description: "Layout variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
    showIcons: {
      control: "boolean",
      description: "Whether to show icons",
    },
    showChanges: {
      control: "boolean",
      description: "Whether to show trend changes",
    },
    columns: {
      control: "number",
      description: "Number of columns (for grid layouts)",
    },
  },
} satisfies Meta<typeof StatsDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultStats = [
  {
    label: "Total Views",
    value: 124500,
    change: { value: 12.5, type: "increase" as const },
    icon: "eye" as const,
  },
  {
    label: "Active Users",
    value: 2847,
    change: { value: 8.2, type: "increase" as const },
    icon: "users" as const,
  },
  {
    label: "Avg. Rating",
    value: "4.8",
    change: { value: 2.1, type: "decrease" as const },
    icon: "star" as const,
  },
  {
    label: "Response Time",
    value: "245ms",
    change: { value: 0, type: "neutral" as const },
    icon: "clock" as const,
  },
];

export const Cards: Story = {
  args: {
    stats: defaultStats,
    variant: "cards",
    size: "md",
    showIcons: true,
    showChanges: true,
  },
};

export const Inline: Story = {
  args: {
    stats: defaultStats.slice(0, 3),
    variant: "inline",
    size: "md",
    showIcons: true,
    showChanges: true,
  },
};

export const Compact: Story = {
  args: {
    stats: [
      { label: "Posts", value: 156, icon: "chart" as const },
      { label: "Comments", value: 892, icon: "users" as const },
      { label: "Likes", value: 3420, icon: "star" as const },
      { label: "Shares", value: 234, icon: "eye" as const },
    ],
    variant: "compact",
    size: "sm",
    showIcons: true,
    showChanges: false,
  },
};

export const Large: Story = {
  args: {
    stats: [
      {
        label: "Revenue",
        value: 1250000,
        change: { value: 15.3, type: "increase" as const },
        icon: "chart" as const,
      },
      {
        label: "Customers",
        value: 12400,
        change: { value: 23.1, type: "increase" as const },
        icon: "users" as const,
      },
    ],
    variant: "cards",
    size: "lg",
    showIcons: true,
    showChanges: true,
  },
};

export const Small: Story = {
  args: {
    stats: [
      { label: "Views", value: 1245, icon: "eye" as const },
      { label: "Likes", value: 89, icon: "star" as const },
      { label: "Comments", value: 23, icon: "users" as const },
    ],
    variant: "cards",
    size: "sm",
    showIcons: true,
    showChanges: false,
  },
};

export const WithoutIcons: Story = {
  args: {
    stats: defaultStats,
    variant: "cards",
    size: "md",
    showIcons: false,
    showChanges: true,
  },
};

export const WithoutChanges: Story = {
  args: {
    stats: [
      { label: "Total Projects", value: 42, icon: "chart" as const },
      { label: "Team Members", value: 8, icon: "users" as const },
      { label: "Client Rating", value: "4.9", icon: "star" as const },
    ],
    variant: "cards",
    size: "md",
    showIcons: true,
    showChanges: false,
  },
};

export const CustomIcons: Story = {
  args: {
    stats: [
      {
        label: "Downloads",
        value: 5420,
        change: { value: 18.7, type: "increase" as const },
        icon: "custom" as const,
        customIcon: Download,
      },
      {
        label: "Favorites",
        value: 1234,
        change: { value: 5.2, type: "increase" as const },
        icon: "custom" as const,
        customIcon: Heart,
      },
    ],
    variant: "cards",
    size: "md",
    showIcons: true,
    showChanges: true,
  },
};

export const MixedTrends: Story = {
  args: {
    stats: [
      {
        label: "Page Views",
        value: 89500,
        change: { value: 12.3, type: "increase" as const },
        icon: "eye" as const,
      },
      {
        label: "Bounce Rate",
        value: "32%",
        change: { value: 8.1, type: "decrease" as const },
        icon: "chart" as const,
      },
      {
        label: "Session Duration",
        value: "3m 24s",
        change: { value: 0, type: "neutral" as const },
        icon: "clock" as const,
      },
    ],
    variant: "cards",
    size: "md",
    showIcons: true,
    showChanges: true,
  },
};

export const TwoColumns: Story = {
  args: {
    stats: defaultStats,
    variant: "cards",
    size: "md",
    showIcons: true,
    showChanges: true,
    columns: 2,
  },
};

export const BlogStats: Story = {
  args: {
    stats: [
      {
        label: "Articles Published",
        value: 47,
        change: { value: 4, type: "increase" as const },
        icon: "chart" as const,
      },
      {
        label: "Total Readers",
        value: 15600,
        change: { value: 21.5, type: "increase" as const },
        icon: "users" as const,
      },
      {
        label: "Avg. Read Time",
        value: "6m 30s",
        change: { value: 1.2, type: "increase" as const },
        icon: "clock" as const,
      },
      {
        label: "Engagement Rate",
        value: "78%",
        change: { value: 3.4, type: "decrease" as const },
        icon: "star" as const,
      },
    ],
    variant: "cards",
    size: "md",
    showIcons: true,
    showChanges: true,
  },
};