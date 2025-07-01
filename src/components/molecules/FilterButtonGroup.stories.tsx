import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FilterButtonGroup } from "./FilterButtonGroup";

const meta = {
  title: "Molecules/FilterButtonGroup",
  component: FilterButtonGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A group of filter buttons that allow users to select from multiple options with optional counts and clear functionality.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    options: {
      control: "object",
      description: "Array of filter options",
    },
    selectedIds: {
      control: "object",
      description: "Array of currently selected option IDs",
    },
    variant: {
      control: "select",
      options: ["pills", "buttons"],
      description: "Visual style variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
    allowMultiple: {
      control: "boolean",
      description: "Whether multiple options can be selected",
    },
    showClearAll: {
      control: "boolean",
      description: "Whether to show clear all button",
    },
    showFilterIcon: {
      control: "boolean",
      description: "Whether to show filter icon and label",
    },
  },
} satisfies Meta<typeof FilterButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions = [
  { id: "all", label: "All Posts", count: 24 },
  { id: "react", label: "React", count: 8 },
  { id: "typescript", label: "TypeScript", count: 12 },
  { id: "design", label: "Design System", count: 6 },
  { id: "nextjs", label: "Next.js", count: 4 },
];

// Wrapper component to handle state
function FilterButtonGroupWrapper(props: any) {
  const [selectedIds, setSelectedIds] = useState<string[]>(props.selectedIds || []);
  
  return (
    <FilterButtonGroup
      {...props}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
    />
  );
}

export const Default: Story = {
  render: (args) => <FilterButtonGroupWrapper {...args} />,
  args: {
    options: defaultOptions,
    selectedIds: ["react"],
    variant: "pills",
    size: "md",
    allowMultiple: true,
    showClearAll: true,
    showFilterIcon: false,
  },
};

export const WithFilterIcon: Story = {
  render: (args) => <FilterButtonGroupWrapper {...args} />,
  args: {
    options: defaultOptions,
    selectedIds: ["react", "typescript"],
    variant: "pills",
    size: "md",
    allowMultiple: true,
    showClearAll: true,
    showFilterIcon: true,
  },
};

export const ButtonVariant: Story = {
  render: (args) => <FilterButtonGroupWrapper {...args} />,
  args: {
    options: defaultOptions,
    selectedIds: ["design"],
    variant: "buttons",
    size: "md",
    allowMultiple: true,
    showClearAll: true,
    showFilterIcon: false,
  },
};

export const SingleSelection: Story = {
  render: (args) => <FilterButtonGroupWrapper {...args} />,
  args: {
    options: defaultOptions,
    selectedIds: ["all"],
    variant: "pills",
    size: "md",
    allowMultiple: false,
    showClearAll: false,
    showFilterIcon: true,
  },
};

export const SmallSize: Story = {
  render: (args) => <FilterButtonGroupWrapper {...args} />,
  args: {
    options: defaultOptions.slice(0, 3),
    selectedIds: ["react"],
    variant: "pills",
    size: "sm",
    allowMultiple: true,
    showClearAll: true,
    showFilterIcon: false,
  },
};

export const LargeSize: Story = {
  render: (args) => <FilterButtonGroupWrapper {...args} />,
  args: {
    options: defaultOptions,
    selectedIds: ["react", "typescript"],
    variant: "buttons",
    size: "lg",
    allowMultiple: true,
    showClearAll: true,
    showFilterIcon: true,
  },
};

export const WithoutCounts: Story = {
  render: (args) => <FilterButtonGroupWrapper {...args} />,
  args: {
    options: [
      { id: "all", label: "All" },
      { id: "react", label: "React" },
      { id: "typescript", label: "TypeScript" },
      { id: "design", label: "Design" },
    ],
    selectedIds: ["react"],
    variant: "pills",
    size: "md",
    allowMultiple: true,
    showClearAll: true,
    showFilterIcon: false,
  },
};

export const ManyOptions: Story = {
  render: (args) => <FilterButtonGroupWrapper {...args} />,
  args: {
    options: [
      { id: "all", label: "All", count: 156 },
      { id: "react", label: "React", count: 45 },
      { id: "vue", label: "Vue.js", count: 23 },
      { id: "angular", label: "Angular", count: 18 },
      { id: "typescript", label: "TypeScript", count: 67 },
      { id: "javascript", label: "JavaScript", count: 89 },
      { id: "css", label: "CSS", count: 34 },
      { id: "html", label: "HTML", count: 12 },
      { id: "design", label: "Design System", count: 28 },
      { id: "ux", label: "UX", count: 15 },
      { id: "accessibility", label: "Accessibility", count: 9 },
    ],
    selectedIds: ["react", "typescript", "design"],
    variant: "pills",
    size: "md",
    allowMultiple: true,
    showClearAll: true,
    showFilterIcon: true,
  },
};