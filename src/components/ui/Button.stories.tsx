import type { Meta, StoryObj } from "@storybook/react";
import { Button, IconButton, LinkButton } from "./button";

const meta: Meta = {
  title: "Design System/Button",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Button components following the Superoptimised Design System. Includes accessibility features, loading states, and proper touch targets for mobile.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "outline", "ghost", "link"],
    },
    size: {
      control: "select", 
      options: ["sm", "md", "lg"],
    },
    loading: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;

type ButtonStory = StoryObj<typeof Button>;
type IconButtonStory = StoryObj<typeof IconButton>;
type LinkButtonStory = StoryObj<typeof LinkButton>;

// Basic Button Stories
export const Primary: ButtonStory = {
  render: (args) => <Button {...args} />,
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

export const Outline: ButtonStory = {
  render: (args) => <Button {...args} />,
  args: {
    variant: "outline",
    children: "Outline Button",
  },
};

export const Ghost: ButtonStory = {
  render: (args) => <Button {...args} />,
  args: {
    variant: "ghost",
    children: "Ghost Button",
  },
};

export const Link: ButtonStory = {
  render: (args) => <Button {...args} />,
  args: {
    variant: "link",
    children: "Link Button",
  },
};

// Size Variations
export const Small: ButtonStory = {
  render: (args) => <Button {...args} />,
  args: {
    size: "sm",
    children: "Small Button",
  },
};

export const Medium: ButtonStory = {
  render: (args) => <Button {...args} />,
  args: {
    size: "md",
    children: "Medium Button",
  },
};

export const Large: ButtonStory = {
  render: (args) => <Button {...args} />,
  args: {
    size: "lg",
    children: "Large Button",
  },
};

// State Variations
export const Loading: ButtonStory = {
  render: (args) => <Button {...args} />,
  args: {
    loading: true,
    children: "Loading...",
  },
};

export const Disabled: ButtonStory = {
  render: (args) => <Button {...args} />,
  args: {
    disabled: true,
    children: "Disabled Button",
  },
};

// Icon Button Stories
const MenuIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const IconPrimary: IconButtonStory = {
  render: (args) => <IconButton {...args} />,
  args: {
    variant: "primary",
    icon: <MenuIcon />,
    "aria-label": "Open menu",
  },
};

export const IconOutline: IconButtonStory = {
  render: (args) => <IconButton {...args} />,
  args: {
    variant: "outline",
    icon: <CloseIcon />,
    "aria-label": "Close dialog",
  },
};

export const IconGhost: IconButtonStory = {
  render: (args) => <IconButton {...args} />,
  args: {
    variant: "ghost",
    icon: <MenuIcon />,
    "aria-label": "Toggle menu",
  },
};

export const IconLoading: IconButtonStory = {
  render: (args) => <IconButton {...args} />,
  args: {
    loading: true,
    icon: <MenuIcon />,
    "aria-label": "Loading...",
  },
};

// Link Button Stories
export const LinkPrimary: LinkButtonStory = {
  render: (args) => <LinkButton {...args} />,
  args: {
    variant: "primary",
    href: "/projects",
    children: "View Projects",
  },
};

export const LinkOutline: LinkButtonStory = {
  render: (args) => <LinkButton {...args} />,
  args: {
    variant: "outline",
    href: "/contact",
    children: "Contact Us",
  },
};

export const LinkExternal: LinkButtonStory = {
  render: (args) => <LinkButton {...args} />,
  args: {
    variant: "primary",
    href: "https://github.com/superoptimised",
    external: true,
    children: "GitHub Profile",
  },
};

// Interactive Examples
export const AllVariants = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-h3 mb-4">Button Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-h3 mb-4">Button Sizes</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-h3 mb-4">Button States</h3>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-h3 mb-4">Icon Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <IconButton variant="primary" icon={<MenuIcon />} aria-label="Primary menu" />
          <IconButton variant="outline" icon={<CloseIcon />} aria-label="Close" />
          <IconButton variant="ghost" icon={<MenuIcon />} aria-label="Toggle menu" />
        </div>
      </div>
      
      <div>
        <h3 className="text-h3 mb-4">Link Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <LinkButton variant="primary" href="/projects">Internal Link</LinkButton>
          <LinkButton variant="outline" href="https://example.com" external>External Link</LinkButton>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Comprehensive overview of all button variants, sizes, and states available in the design system.",
      },
    },
  },
};
