import type { Meta, StoryObj } from "@storybook/react";
import { Divider, SectionDivider, Spacer } from "./Divider";
import { Star, Calendar, Settings, Heart } from "lucide-react";

const meta: Meta = {
  title: "Design System/Divider",
  component: Divider,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Divider components for creating visual separation between content sections. Includes simple dividers, labeled dividers, section dividers, and spacers.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    variant: {
      control: "select",
      options: ["default", "dashed", "dotted", "gradient"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    spacing: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    labelPosition: {
      control: "select",
      options: ["left", "center", "right"],
    },
  },
};

export default meta;

type DividerStory = StoryObj<typeof Divider>;
type SectionDividerStory = StoryObj<typeof SectionDivider>;
type SpacerStory = StoryObj<typeof Spacer>;

// Basic Divider Stories
export const DividerDefault: DividerStory = {
  render: (args) => (
    <div className="max-w-md">
      <p className="text-sm">Content above the divider.</p>
      <Divider {...args} />
      <p className="text-sm">Content below the divider.</p>
    </div>
  ),
  args: {},
};

export const DividerVariants: DividerStory = {
  render: () => (
    <div className="max-w-md space-y-6">
      <div>
        <p className="text-sm mb-2">Default</p>
        <Divider variant="default" />
        <p className="text-sm">Content after default divider</p>
      </div>
      
      <div>
        <p className="text-sm mb-2">Dashed</p>
        <Divider variant="dashed" />
        <p className="text-sm">Content after dashed divider</p>
      </div>
      
      <div>
        <p className="text-sm mb-2">Dotted</p>
        <Divider variant="dotted" />
        <p className="text-sm">Content after dotted divider</p>
      </div>
      
      <div>
        <p className="text-sm mb-2">Gradient</p>
        <Divider variant="gradient" />
        <p className="text-sm">Content after gradient divider</p>
      </div>
    </div>
  ),
};

export const DividerSizes: DividerStory = {
  render: () => (
    <div className="max-w-md space-y-6">
      <div>
        <p className="text-sm mb-2">Small</p>
        <Divider size="sm" />
        <p className="text-sm">Content after small divider</p>
      </div>
      
      <div>
        <p className="text-sm mb-2">Medium</p>
        <Divider size="md" />
        <p className="text-sm">Content after medium divider</p>
      </div>
      
      <div>
        <p className="text-sm mb-2">Large</p>
        <Divider size="lg" />
        <p className="text-sm">Content after large divider</p>
      </div>
    </div>
  ),
};

export const DividerSpacing: DividerStory = {
  render: () => (
    <div className="max-w-md">
      <div>
        <p className="text-sm">Content before small spacing</p>
        <Divider spacing="sm" />
        <p className="text-sm">Content after small spacing</p>
        <Divider spacing="md" />
        <p className="text-sm">Content after medium spacing</p>
        <Divider spacing="lg" />
        <p className="text-sm">Content after large spacing</p>
        <Divider spacing="xl" />
        <p className="text-sm">Content after extra large spacing</p>
      </div>
    </div>
  ),
};

export const DividerVertical: DividerStory = {
  render: () => (
    <div className="flex items-center gap-4 h-20">
      <span className="text-sm">Left content</span>
      <Divider orientation="vertical" />
      <span className="text-sm">Middle content</span>
      <Divider orientation="vertical" size="md" />
      <span className="text-sm">Right content</span>
    </div>
  ),
};

// Labeled Divider Stories
export const DividerWithLabel: DividerStory = {
  render: () => (
    <div className="max-w-md space-y-8">
      <div>
        <p className="text-sm">Content before section</p>
        <Divider label="OR" />
        <p className="text-sm">Content after section</p>
      </div>
      
      <div>
        <p className="text-sm">Content before section</p>
        <Divider label="Settings" labelPosition="left" />
        <p className="text-sm">Settings content</p>
      </div>
      
      <div>
        <p className="text-sm">Content before section</p>
        <Divider label="End of Content" labelPosition="right" />
        <p className="text-sm">Footer content</p>
      </div>
    </div>
  ),
};

export const DividerLabeledVariants: DividerStory = {
  render: () => (
    <div className="max-w-md space-y-8">
      <div>
        <Divider label="Default" variant="default" />
        <p className="text-sm">Content after default labeled divider</p>
      </div>
      
      <div>
        <Divider label="Dashed Section" variant="dashed" />
        <p className="text-sm">Content after dashed labeled divider</p>
      </div>
      
      <div>
        <Divider label="Gradient Section" variant="gradient" />
        <p className="text-sm">Content after gradient labeled divider</p>
      </div>
    </div>
  ),
};

// Section Divider Stories
export const SectionDividerBasic: SectionDividerStory = {
  render: (args) => (
    <div className="max-w-md">
      <p className="text-sm">Content before section</p>
      <SectionDivider {...args} />
      <p className="text-sm">Content after section divider</p>
    </div>
  ),
  args: {
    title: "New Section",
    subtitle: "Important content below",
  },
};

export const SectionDividerWithIcon: SectionDividerStory = {
  render: () => (
    <div className="max-w-md space-y-8">
      <div>
        <p className="text-sm">User profile content</p>
        <SectionDivider
          title="Account Settings"
          subtitle="Manage your account preferences"
          icon={<Settings className="w-4 h-4" />}
        />
        <p className="text-sm">Settings content here</p>
      </div>
      
      <div>
        <p className="text-sm">Project list content</p>
        <SectionDivider
          title="Favorites"
          icon={<Heart className="w-4 h-4" />}
        />
        <p className="text-sm">Favorite projects here</p>
      </div>
    </div>
  ),
};

export const SectionDividerVariants: SectionDividerStory = {
  render: () => (
    <div className="max-w-md space-y-8">
      <div>
        <p className="text-sm">Content before default section</p>
        <SectionDivider
          title="Default Section"
          subtitle="Normal emphasis"
          variant="default"
        />
        <p className="text-sm">Content after default section</p>
      </div>
      
      <div>
        <p className="text-sm">Content before emphasized section</p>
        <SectionDivider
          title="Important Section"
          subtitle="High emphasis"
          variant="emphasized"
        />
        <p className="text-sm">Content after emphasized section</p>
      </div>
      
      <div>
        <p className="text-sm">Content before subtle section</p>
        <SectionDivider
          title="Subtle Section"
          subtitle="Low emphasis"
          variant="subtle"
        />
        <p className="text-sm">Content after subtle section</p>
      </div>
    </div>
  ),
};

// Spacer Stories
export const SpacerVertical: SpacerStory = {
  render: () => (
    <div className="max-w-md">
      <p className="text-sm">Content before spacer</p>
      <Spacer size="xs" />
      <p className="text-sm">After xs spacer</p>
      <Spacer size="sm" />
      <p className="text-sm">After sm spacer</p>
      <Spacer size="md" />
      <p className="text-sm">After md spacer</p>
      <Spacer size="lg" />
      <p className="text-sm">After lg spacer</p>
      <Spacer size="xl" />
      <p className="text-sm">After xl spacer</p>
      <Spacer size="2xl" />
      <p className="text-sm">After 2xl spacer</p>
    </div>
  ),
};

export const SpacerHorizontal: SpacerStory = {
  render: () => (
    <div className="flex items-center">
      <span className="text-sm">Left</span>
      <Spacer axis="horizontal" size="xs" />
      <span className="text-sm">xs</span>
      <Spacer axis="horizontal" size="sm" />
      <span className="text-sm">sm</span>
      <Spacer axis="horizontal" size="md" />
      <span className="text-sm">md</span>
      <Spacer axis="horizontal" size="lg" />
      <span className="text-sm">lg</span>
      <Spacer axis="horizontal" size="xl" />
      <span className="text-sm">Right</span>
    </div>
  ),
};

// Real-world Examples
export const BlogPostSections = {
  render: () => (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-h1 mb-4">Building Better Components</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Published on March 15, 2024 by John Doe
        </p>
        <p className="text-body">
          In this post, we'll explore best practices for building reusable components
          that scale across different projects and teams.
        </p>
      </div>

      <SectionDivider
        title="Introduction"
        subtitle="Setting the foundation"
        icon={<Star className="w-4 h-4" />}
      />

      <div>
        <p className="text-body mb-4">
          Component design is crucial for maintaining consistent user interfaces
          across applications. A well-designed component system enables teams
          to work more efficiently and ensures visual consistency.
        </p>
        <p className="text-body">
          Let's dive into the key principles that make components truly reusable.
        </p>
      </div>

      <Divider label="Key Principles" />

      <div>
        <h3 className="text-h3 mb-3">1. Single Responsibility</h3>
        <p className="text-body mb-4">
          Each component should have a single, well-defined purpose. This makes
          components easier to understand, test, and maintain.
        </p>
      </div>

      <Divider variant="dashed" />

      <div>
        <h3 className="text-h3 mb-3">2. Composition over Configuration</h3>
        <p className="text-body mb-4">
          Prefer composable components that can be combined in different ways
          rather than components with many configuration options.
        </p>
      </div>

      <SectionDivider
        title="Conclusion"
        subtitle="Wrapping up our discussion"
        variant="emphasized"
      />

      <div>
        <p className="text-body">
          By following these principles, you'll build components that stand the
          test of time and scale with your application's growth.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Real-world example showing how dividers can be used to structure a blog post with clear sections.",
      },
    },
  },
};

export const FormSections = {
  render: () => (
    <div className="max-w-md space-y-6">
      <div>
        <h2 className="text-h2 mb-4">User Registration</h2>
      </div>

      <div className="space-y-4">
        <h3 className="text-h3">Personal Information</h3>
        <div className="space-y-3">
          <input className="w-full p-2 border rounded" placeholder="First Name" />
          <input className="w-full p-2 border rounded" placeholder="Last Name" />
          <input className="w-full p-2 border rounded" placeholder="Email" />
        </div>
      </div>

      <Divider label="OR" />

      <div className="text-center">
        <button className="px-4 py-2 bg-primary text-off-white rounded">
          Sign up with Google
        </button>
      </div>

      <SectionDivider
        title="Account Security"
        subtitle="Protect your account"
        icon={<Settings className="w-4 h-4" />}
      />

      <div className="space-y-3">
        <input className="w-full p-2 border rounded" type="password" placeholder="Password" />
        <input className="w-full p-2 border rounded" type="password" placeholder="Confirm Password" />
      </div>

      <Divider variant="gradient" spacing="lg" />

      <div className="flex items-center space-x-2">
        <input type="checkbox" id="terms" />
        <label htmlFor="terms" className="text-sm">
          I agree to the terms and conditions
        </label>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Form layout using different divider types to separate sections and create visual hierarchy.",
      },
    },
  },
};