import type { Meta, StoryObj } from "@storybook/react";
import { Tag, Badge } from "./Tag";

const meta: Meta = {
  title: "Design System/Tag & Badge",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Tag and Badge components for labeling, categorizing, and displaying status information. Tags are typically removable while badges are static indicators.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "success", "warning", "danger"],
    },
    size: {
      control: "select", 
      options: ["sm", "md", "lg"],
    },
    removable: {
      control: "boolean",
    },
  },
};

export default meta;

type TagStory = StoryObj<typeof Tag>;
type BadgeStory = StoryObj<typeof Badge>;

// Tag Stories
export const TagDefault: TagStory = {
  render: (args) => <Tag {...args} />,
  args: {
    children: "Design",
  },
};

export const TagRemovable: TagStory = {
  render: (args) => <Tag {...args} />,
  args: {
    children: "React",
    removable: true,
    onRemove: () => alert("Tag removed!"),
  },
};

export const TagVariants: TagStory = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag variant="default">Default</Tag>
      <Tag variant="secondary">Secondary</Tag>
      <Tag variant="success">Success</Tag>
      <Tag variant="warning">Warning</Tag>
      <Tag variant="danger">Danger</Tag>
    </div>
  ),
};

export const TagSizes: TagStory = {
  render: () => (
    <div className="flex items-center gap-3">
      <Tag size="sm">Small</Tag>
      <Tag size="md">Medium</Tag>
      <Tag size="lg">Large</Tag>
    </div>
  ),
};

export const TagRemovableVariants: TagStory = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag variant="default" removable onRemove={() => console.log("Removed default")}>
        JavaScript
      </Tag>
      <Tag variant="secondary" removable onRemove={() => console.log("Removed secondary")}>
        TypeScript
      </Tag>
      <Tag variant="success" removable onRemove={() => console.log("Removed success")}>
        Approved
      </Tag>
      <Tag variant="warning" removable onRemove={() => console.log("Removed warning")}>
        Review
      </Tag>
      <Tag variant="danger" removable onRemove={() => console.log("Removed danger")}>
        Urgent
      </Tag>
    </div>
  ),
};

// Badge Stories
export const BadgeDefault: BadgeStory = {
  render: (args) => <Badge {...args} />,
  args: {
    children: "New",
  },
};

export const BadgeVariants: BadgeStory = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
    </div>
  ),
};

export const BadgeSizes: BadgeStory = {
  render: () => (
    <div className="flex items-center gap-3">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

export const BadgeWithNumbers: BadgeStory = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span>Notifications</span>
        <Badge variant="danger" size="sm">3</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Messages</span>
        <Badge variant="success" size="sm">12</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span>Drafts</span>
        <Badge variant="outline" size="sm">5</Badge>
      </div>
    </div>
  ),
};

// Combined Example
export const TagsAndBadges = {
  render: () => (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="text-h3 mb-3">Product Tags</h3>
        <div className="flex flex-wrap gap-2">
          <Tag variant="default" removable>Frontend</Tag>
          <Tag variant="default" removable>React</Tag>
          <Tag variant="secondary" removable>TypeScript</Tag>
          <Tag variant="success" removable>Production Ready</Tag>
        </div>
      </div>
      
      <div>
        <h3 className="text-h3 mb-3">Status Badges</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>API Documentation</span>
            <Badge variant="success">Complete</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>User Testing</span>
            <Badge variant="warning">In Progress</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Performance Optimization</span>
            <Badge variant="outline">Pending</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Security Audit</span>
            <Badge variant="danger">Blocked</Badge>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-h3 mb-3">Notification Counts</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span>Inbox</span>
            <Badge variant="default" size="sm">24</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Urgent</span>
            <Badge variant="danger" size="sm">3</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Completed</span>
            <Badge variant="success" size="sm">156</Badge>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Real-world example showing tags and badges used together in a typical application interface.",
      },
    },
  },
};