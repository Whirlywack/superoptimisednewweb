import type { Meta, StoryObj } from "@storybook/react";
import { TableOfContents } from "./TableOfContents";

const meta = {
  title: "Molecules/TableOfContents",
  component: TableOfContents,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Table of contents component for document navigation with hierarchical structure and active item tracking.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: "object",
      description: "Hierarchical array of content items",
    },
    activeId: {
      control: "text",
      description: "ID of currently active item",
    },
    onItemClick: {
      action: "item-clicked",
      description: "Callback when item is clicked",
    },
    variant: {
      control: "select",
      options: ["sidebar", "floating", "inline"],
      description: "Visual variant",
    },
    collapsible: {
      control: "boolean",
      description: "Whether items can be collapsed",
    },
    showNumbers: {
      control: "boolean",
      description: "Whether to show item numbers",
    },
    maxDepth: {
      control: "number",
      description: "Maximum nesting depth to display",
    },
  },
} satisfies Meta<typeof TableOfContents>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleContent = [
  {
    id: "introduction",
    title: "Introduction",
    level: 1,
    children: [
      {
        id: "getting-started",
        title: "Getting Started",
        level: 2,
      },
      {
        id: "prerequisites",
        title: "Prerequisites", 
        level: 2,
      },
    ],
  },
  {
    id: "installation",
    title: "Installation",
    level: 1,
    children: [
      {
        id: "npm-install",
        title: "NPM Installation",
        level: 2,
      },
      {
        id: "yarn-install",
        title: "Yarn Installation",
        level: 2,
      },
      {
        id: "configuration",
        title: "Configuration",
        level: 2,
        children: [
          {
            id: "basic-config",
            title: "Basic Configuration",
            level: 3,
          },
          {
            id: "advanced-config",
            title: "Advanced Configuration",
            level: 3,
          },
        ],
      },
    ],
  },
  {
    id: "usage",
    title: "Usage",
    level: 1,
    children: [
      {
        id: "basic-usage",
        title: "Basic Usage",
        level: 2,
      },
      {
        id: "advanced-usage",
        title: "Advanced Usage",
        level: 2,
      },
    ],
  },
  {
    id: "api-reference",
    title: "API Reference",
    level: 1,
    children: [
      {
        id: "components",
        title: "Components",
        level: 2,
      },
      {
        id: "hooks",
        title: "Hooks",
        level: 2,
      },
      {
        id: "utilities",
        title: "Utilities",
        level: 2,
      },
    ],
  },
];

export const Sidebar: Story = {
  args: {
    items: sampleContent,
    activeId: "getting-started",
    variant: "sidebar",
    collapsible: false,
    showNumbers: false,
    maxDepth: 3,
  },
};

export const Floating: Story = {
  args: {
    items: sampleContent,
    activeId: "npm-install",
    variant: "floating",
    collapsible: false,
    showNumbers: false,
    maxDepth: 3,
  },
};

export const Inline: Story = {
  args: {
    items: sampleContent,
    activeId: "basic-config",
    variant: "inline",
    collapsible: false,
    showNumbers: false,
    maxDepth: 3,
  },
};

export const Collapsible: Story = {
  args: {
    items: sampleContent,
    activeId: "advanced-config",
    variant: "sidebar",
    collapsible: true,
    showNumbers: false,
    maxDepth: 3,
  },
};

export const WithNumbers: Story = {
  args: {
    items: sampleContent,
    activeId: "configuration",
    variant: "sidebar",
    collapsible: false,
    showNumbers: true,
    maxDepth: 3,
  },
};

export const LimitedDepth: Story = {
  args: {
    items: sampleContent,
    activeId: "installation",
    variant: "sidebar",
    collapsible: false,
    showNumbers: false,
    maxDepth: 2,
  },
};

export const BlogPost: Story = {
  args: {
    items: [
      {
        id: "overview",
        title: "Overview",
        level: 1,
      },
      {
        id: "problem-statement",
        title: "Problem Statement",
        level: 1,
      },
      {
        id: "solution",
        title: "Solution",
        level: 1,
        children: [
          {
            id: "approach",
            title: "Our Approach",
            level: 2,
          },
          {
            id: "implementation",
            title: "Implementation Details",
            level: 2,
          },
        ],
      },
      {
        id: "results",
        title: "Results",
        level: 1,
      },
      {
        id: "conclusion",
        title: "Conclusion",
        level: 1,
      },
    ],
    activeId: "approach",
    variant: "sidebar",
    collapsible: false,
    showNumbers: false,
    maxDepth: 3,
  },
};

export const Documentation: Story = {
  args: {
    items: [
      {
        id: "quick-start",
        title: "Quick Start",
        level: 1,
      },
      {
        id: "core-concepts",
        title: "Core Concepts",
        level: 1,
        children: [
          {
            id: "components",
            title: "Components",
            level: 2,
            children: [
              {
                id: "atoms",
                title: "Atoms",
                level: 3,
              },
              {
                id: "molecules",
                title: "Molecules",
                level: 3,
              },
              {
                id: "organisms",
                title: "Organisms",
                level: 3,
              },
            ],
          },
          {
            id: "design-tokens",
            title: "Design Tokens",
            level: 2,
          },
          {
            id: "theming",
            title: "Theming",
            level: 2,
          },
        ],
      },
      {
        id: "guides",
        title: "Guides",
        level: 1,
        children: [
          {
            id: "styling",
            title: "Styling",
            level: 2,
          },
          {
            id: "accessibility",
            title: "Accessibility",
            level: 2,
          },
          {
            id: "testing",
            title: "Testing",
            level: 2,
          },
        ],
      },
    ],
    activeId: "molecules",
    variant: "sidebar",
    collapsible: true,
    showNumbers: true,
    maxDepth: 3,
  },
};

export const Simple: Story = {
  args: {
    items: [
      {
        id: "introduction",
        title: "Introduction",
        level: 1,
      },
      {
        id: "features",
        title: "Features",
        level: 1,
      },
      {
        id: "installation",
        title: "Installation",
        level: 1,
      },
      {
        id: "usage",
        title: "Usage",
        level: 1,
      },
    ],
    activeId: "features",
    variant: "inline",
    collapsible: false,
    showNumbers: false,
    maxDepth: 3,
  },
};