import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarGroup, AvatarWithInfo } from "./Avatar";

const meta: Meta = {
  title: "Design System/Molecules/Avatar",
  component: Avatar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Avatar components for displaying user profile pictures with fallbacks, status indicators, and grouping capabilities.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", "2xl"],
    },
    shape: {
      control: "select",
      options: ["circle", "square"],
    },
    status: {
      control: "select",
      options: ["online", "offline", "away", "busy"],
    },
    showStatus: {
      control: "boolean",
    },
    src: {
      control: "text",
    },
    fallback: {
      control: "text",
    },
  },
};

export default meta;

type AvatarStory = StoryObj<typeof Avatar>;
type AvatarGroupStory = StoryObj<typeof AvatarGroup>;
type AvatarWithInfoStory = StoryObj<typeof AvatarWithInfo>;

// Basic Avatar Stories
export const AvatarDefault: AvatarStory = {
  render: (args) => <Avatar {...args} />,
  args: {
    fallback: "John Doe",
  },
};

export const AvatarWithImage: AvatarStory = {
  render: (args) => <Avatar {...args} />,
  args: {
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    alt: "John Doe",
    fallback: "John Doe",
  },
};

export const AvatarSizes: AvatarStory = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="xs" fallback="John Doe" />
      <Avatar size="sm" fallback="John Doe" />
      <Avatar size="md" fallback="John Doe" />
      <Avatar size="lg" fallback="John Doe" />
      <Avatar size="xl" fallback="John Doe" />
      <Avatar size="2xl" fallback="John Doe" />
    </div>
  ),
};

export const AvatarShapes: AvatarStory = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar 
        shape="circle" 
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        fallback="John Doe" 
      />
      <Avatar 
        shape="square" 
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        fallback="John Doe" 
      />
    </div>
  ),
};

export const AvatarWithStatus: AvatarStory = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar 
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        fallback="John Doe"
        status="online"
        showStatus
      />
      <Avatar 
        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
        fallback="Jane Smith"
        status="away"
        showStatus
      />
      <Avatar 
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        fallback="Bob Johnson"
        status="busy"
        showStatus
      />
      <Avatar 
        fallback="Mike Wilson"
        status="offline"
        showStatus
      />
    </div>
  ),
};

export const AvatarFallbacks: AvatarStory = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar fallback="John Doe" />
      <Avatar fallback="Jane Smith" />
      <Avatar fallback="A" />
      <Avatar fallback="XY" />
      <Avatar /> {/* No fallback - shows default icon */}
    </div>
  ),
};

export const AvatarBrokenImage: AvatarStory = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar 
        src="https://broken-image-url.jpg"
        fallback="John Doe"
        alt="This image will fail to load"
      />
      <Avatar 
        src="https://another-broken-url.jpg"
        fallback="Jane Smith"
        alt="This image will also fail"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Avatars with broken image URLs will automatically fall back to initials or the default icon.",
      },
    },
  },
};

// Avatar Group Stories
export const AvatarGroupBasic: AvatarGroupStory = {
  render: (args) => (
    <AvatarGroup {...args}>
      <Avatar 
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        fallback="John Doe"
      />
      <Avatar 
        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
        fallback="Jane Smith"
      />
      <Avatar 
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        fallback="Bob Johnson"
      />
      <Avatar fallback="Alice Brown" />
    </AvatarGroup>
  ),
  args: {
    max: 5,
  },
};

export const AvatarGroupWithOverflow: AvatarGroupStory = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar 
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        fallback="John Doe"
      />
      <Avatar 
        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
        fallback="Jane Smith"
      />
      <Avatar 
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        fallback="Bob Johnson"
      />
      <Avatar fallback="Alice Brown" />
      <Avatar fallback="Charlie Wilson" />
      <Avatar fallback="Diana Prince" />
    </AvatarGroup>
  ),
};

export const AvatarGroupSizes: AvatarGroupStory = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm mb-2">Small</p>
        <AvatarGroup size="sm">
          <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" fallback="John" />
          <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" fallback="Jane" />
          <Avatar fallback="Bob" />
        </AvatarGroup>
      </div>
      
      <div>
        <p className="text-sm mb-2">Medium</p>
        <AvatarGroup size="md">
          <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" fallback="John" />
          <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" fallback="Jane" />
          <Avatar fallback="Bob" />
        </AvatarGroup>
      </div>
      
      <div>
        <p className="text-sm mb-2">Large</p>
        <AvatarGroup size="lg">
          <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" fallback="John" />
          <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" fallback="Jane" />
          <Avatar fallback="Bob" />
        </AvatarGroup>
      </div>
    </div>
  ),
};

export const AvatarGroupSpacing: AvatarGroupStory = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-sm mb-2">Tight spacing</p>
        <AvatarGroup spacing="tight">
          <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" fallback="John" />
          <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" fallback="Jane" />
          <Avatar fallback="Bob" />
          <Avatar fallback="Alice" />
        </AvatarGroup>
      </div>
      
      <div>
        <p className="text-sm mb-2">Normal spacing</p>
        <AvatarGroup spacing="normal">
          <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" fallback="John" />
          <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" fallback="Jane" />
          <Avatar fallback="Bob" />
          <Avatar fallback="Alice" />
        </AvatarGroup>
      </div>
      
      <div>
        <p className="text-sm mb-2">Loose spacing</p>
        <AvatarGroup spacing="loose">
          <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" fallback="John" />
          <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" fallback="Jane" />
          <Avatar fallback="Bob" />
          <Avatar fallback="Alice" />
        </AvatarGroup>
      </div>
    </div>
  ),
};

// Avatar with Info Stories
export const AvatarWithInfoBasic: AvatarWithInfoStory = {
  render: (args) => <AvatarWithInfo {...args} />,
  args: {
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    name: "John Doe",
    description: "Software Engineer",
  },
};

export const AvatarWithInfoSizes: AvatarWithInfoStory = {
  render: () => (
    <div className="space-y-4 max-w-xs">
      <AvatarWithInfo
        size="sm"
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        name="John Doe"
        description="Software Engineer"
      />
      <AvatarWithInfo
        size="md"
        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
        name="Jane Smith"
        description="Product Manager"
      />
      <AvatarWithInfo
        size="lg"
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        name="Bob Johnson"
        description="UX Designer"
      />
    </div>
  ),
};

export const AvatarWithInfoStatus: AvatarWithInfoStory = {
  render: () => (
    <div className="space-y-4 max-w-xs">
      <AvatarWithInfo
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        name="John Doe"
        description="Available for chat"
        status="online"
        showStatus
      />
      <AvatarWithInfo
        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
        name="Jane Smith"
        description="Away from desk"
        status="away"
        showStatus
      />
      <AvatarWithInfo
        name="Bob Johnson"
        description="In a meeting"
        status="busy"
        showStatus
      />
    </div>
  ),
};

export const AvatarWithInfoNoDescription: AvatarWithInfoStory = {
  render: () => (
    <div className="space-y-3 max-w-xs">
      <AvatarWithInfo
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        name="John Doe"
      />
      <AvatarWithInfo
        name="Jane Smith"
        status="online"
        showStatus
      />
    </div>
  ),
};

// Real-world Examples
export const TeamMembersList = {
  render: () => (
    <div className="max-w-md space-y-3">
      <h3 className="text-h3 mb-4">Team Members</h3>
      
      <AvatarWithInfo
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        name="John Doe"
        description="Engineering Manager"
        status="online"
        showStatus
      />
      
      <AvatarWithInfo
        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
        name="Jane Smith"
        description="Senior Developer"
        status="busy"
        showStatus
      />
      
      <AvatarWithInfo
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        name="Bob Johnson"
        description="UX Designer"
        status="away"
        showStatus
      />
      
      <AvatarWithInfo
        name="Alice Brown"
        description="Product Manager"
        status="offline"
        showStatus
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Real-world example showing a team members list with avatars, names, roles, and status indicators.",
      },
    },
  },
};

export const CollaboratorsList = {
  render: () => (
    <div className="max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3">Collaborators</h3>
        <span className="text-sm text-muted-foreground">8 members</span>
      </div>
      
      <div className="mb-4">
        <AvatarGroup max={5} spacing="normal">
          <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" fallback="John Doe" />
          <Avatar src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" fallback="Jane Smith" />
          <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" fallback="Bob Johnson" />
          <Avatar fallback="Alice Brown" />
          <Avatar fallback="Charlie Wilson" />
          <Avatar fallback="Diana Prince" />
          <Avatar fallback="Eve Davis" />
          <Avatar fallback="Frank Miller" />
        </AvatarGroup>
      </div>
      
      <p className="text-sm text-muted-foreground">
        John, Jane, Bob and 5 others are working on this project
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Example showing how to display project collaborators with an avatar group and summary text.",
      },
    },
  },
};