import type { Meta, StoryObj } from "@storybook/react";
import { ProjectProgress } from "./ProjectProgress";

const meta: Meta<typeof ProjectProgress> = {
  title: "Organisms/ProjectProgress",
  component: ProjectProgress,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Displays overall project progress, milestones, and development metrics with real-time data from the backend.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
    showMilestones: {
      control: "boolean",
      description: "Whether to show the detailed milestones section",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showMilestones: true,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl bg-off-white p-8">
        <Story />
      </div>
    ),
  ],
};

export const CompactView: Story = {
  args: {
    showMilestones: false,
    className: "max-w-lg",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl bg-off-white p-8">
        <Story />
      </div>
    ),
  ],
};

export const WithCustomStyling: Story = {
  args: {
    showMilestones: true,
    className: "border-4 border-primary shadow-lg",
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl bg-off-white p-8">
        <Story />
      </div>
    ),
  ],
};
