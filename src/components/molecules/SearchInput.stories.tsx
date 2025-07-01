import type { Meta, StoryObj } from "@storybook/react";
import { SearchInput } from "./SearchInput";

const meta = {
  title: "Molecules/SearchInput",
  component: SearchInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A search input component with debounced search, clear functionality, and loading states.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    onSearch: {
      action: "searched",
      description: "Callback fired when search is performed",
    },
    onClear: {
      action: "cleared",
      description: "Callback fired when search is cleared",
    },
    variant: {
      control: "select",
      options: ["default", "filled", "outline"],
      description: "Visual variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
    showClearButton: {
      control: "boolean",
      description: "Whether to show clear button",
    },
    loading: {
      control: "boolean",
      description: "Loading state",
    },
    debounceMs: {
      control: "number",
      description: "Debounce delay in milliseconds",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Search...",
    variant: "default",
    size: "md",
    showClearButton: true,
    loading: false,
    debounceMs: 300,
  },
};

export const Filled: Story = {
  args: {
    placeholder: "Search articles...",
    variant: "filled",
    size: "md",
    showClearButton: true,
    loading: false,
    debounceMs: 300,
  },
};

export const Outline: Story = {
  args: {
    placeholder: "Search projects...",
    variant: "outline",
    size: "md",
    showClearButton: true,
    loading: false,
    debounceMs: 300,
  },
};

export const Small: Story = {
  args: {
    placeholder: "Search",
    variant: "default",
    size: "sm",
    showClearButton: true,
    loading: false,
    debounceMs: 300,
  },
};

export const Large: Story = {
  args: {
    placeholder: "Search the knowledge base...",
    variant: "default",
    size: "lg",
    showClearButton: true,
    loading: false,
    debounceMs: 300,
  },
};

export const Loading: Story = {
  args: {
    placeholder: "Search...",
    variant: "default",
    size: "md",
    showClearButton: true,
    loading: true,
    debounceMs: 300,
    defaultValue: "react components",
  },
};

export const WithoutClearButton: Story = {
  args: {
    placeholder: "Search...",
    variant: "default",
    size: "md",
    showClearButton: false,
    loading: false,
    debounceMs: 300,
  },
};

export const NoDebounce: Story = {
  args: {
    placeholder: "Instant search...",
    variant: "default",
    size: "md",
    showClearButton: true,
    loading: false,
    debounceMs: 0,
  },
};

export const LongDebounce: Story = {
  args: {
    placeholder: "Slow search...",
    variant: "default",
    size: "md",
    showClearButton: true,
    loading: false,
    debounceMs: 1000,
  },
};

export const CustomPlaceholder: Story = {
  args: {
    placeholder: "Type to search for components, patterns, or documentation...",
    variant: "filled",
    size: "lg",
    showClearButton: true,
    loading: false,
    debounceMs: 500,
  },
};