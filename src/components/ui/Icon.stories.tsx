import type { Meta, StoryObj } from "@storybook/react";
import { Icon, LucideIcon } from "./Icon";

const meta: Meta = {
  title: "Design System/Icon",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Icon components for displaying SVG icons with consistent sizing and styling. Supports both generic wrapper and Lucide icon integration.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
  },
};

export default meta;

type IconStory = StoryObj<typeof Icon>;
type LucideIconStory = StoryObj<typeof LucideIcon>;

// Sample SVG icons for demonstration
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"></path>
  </svg>
);

// Icon wrapper stories
export const Default: IconStory = {
  render: (args) => (
    <Icon {...args}>
      <MenuIcon />
    </Icon>
  ),
  args: {
    size: "md",
  },
};

export const ExtraSmall: IconStory = {
  render: (args) => (
    <Icon {...args}>
      <SearchIcon />
    </Icon>
  ),
  args: {
    size: "xs",
  },
};

export const Small: IconStory = {
  render: (args) => (
    <Icon {...args}>
      <SearchIcon />
    </Icon>
  ),
  args: {
    size: "sm",
  },
};

export const Medium: IconStory = {
  render: (args) => (
    <Icon {...args}>
      <SearchIcon />
    </Icon>
  ),
  args: {
    size: "md",
  },
};

export const Large: IconStory = {
  render: (args) => (
    <Icon {...args}>
      <SearchIcon />
    </Icon>
  ),
  args: {
    size: "lg",
  },
};

export const ExtraLarge: IconStory = {
  render: (args) => (
    <Icon {...args}>
      <HeartIcon />
    </Icon>
  ),
  args: {
    size: "xl",
  },
};

// Lucide icon stories (would require lucide-react package)
export const LucideExample: LucideIconStory = {
  render: (args) => (
    <div className="text-primary">
      <LucideIcon {...args} />
    </div>
  ),
  args: {
    icon: MenuIcon,
    size: "md",
  },
};

// Size comparison
export const AllSizes = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-h3 mb-4">Icon Sizes</h3>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <Icon size="xs"><SearchIcon /></Icon>
            <span className="text-small">xs (12px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon size="sm"><SearchIcon /></Icon>
            <span className="text-small">sm (16px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon size="md"><SearchIcon /></Icon>
            <span className="text-small">md (20px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon size="lg"><SearchIcon /></Icon>
            <span className="text-small">lg (24px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon size="xl"><HeartIcon /></Icon>
            <span className="text-small">xl (32px)</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-h3 mb-4">Icon Usage Examples</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Icon size="sm"><MenuIcon /></Icon>
            <span className="text-body">Menu navigation</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon size="sm"><SearchIcon /></Icon>
            <span className="text-body">Search functionality</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon size="sm" className="text-warm-gray"><HeartIcon /></Icon>
            <span className="text-body">Favorite or like action</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-h3 mb-4">Color Inheritance</h3>
        <div className="space-y-2">
          <div className="text-primary flex items-center gap-2">
            <Icon size="md"><SearchIcon /></Icon>
            <span>Primary color</span>
          </div>
          <div className="text-warm-gray flex items-center gap-2">
            <Icon size="md"><SearchIcon /></Icon>
            <span>Warm gray color</span>
          </div>
          <div className="text-warm-gray flex items-center gap-2">
            <Icon size="md"><HeartIcon /></Icon>
            <span>Custom color</span>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Complete overview of icon sizes and usage patterns in the design system.",
      },
    },
  },
};