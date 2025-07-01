import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PaginationControls } from "./PaginationControls";

const meta = {
  title: "Molecules/PaginationControls",
  component: PaginationControls,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Pagination controls with page numbers, navigation arrows, and optional page information display.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    currentPage: {
      control: "number",
      description: "Current active page number",
    },
    totalPages: {
      control: "number",
      description: "Total number of pages",
    },
    showPageInfo: {
      control: "boolean",
      description: "Whether to show page information text",
    },
    showFirstLast: {
      control: "boolean",
      description: "Whether to show first and last page buttons",
    },
    maxVisiblePages: {
      control: "number",
      description: "Maximum number of page buttons to show",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
    variant: {
      control: "select",
      options: ["default", "compact"],
      description: "Visual variant",
    },
  },
} satisfies Meta<typeof PaginationControls>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to handle state
function PaginationWrapper(props: any) {
  const [currentPage, setCurrentPage] = useState(props.currentPage || 1);
  
  return (
    <PaginationControls
      {...props}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    />
  );
}

export const Default: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 1,
    totalPages: 10,
    showPageInfo: true,
    showFirstLast: true,
    maxVisiblePages: 5,
    size: "md",
    variant: "default",
  },
};

export const MiddlePage: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 15,
    totalPages: 30,
    showPageInfo: true,
    showFirstLast: true,
    maxVisiblePages: 5,
    size: "md",
    variant: "default",
  },
};

export const LastPage: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 20,
    totalPages: 20,
    showPageInfo: true,
    showFirstLast: true,
    maxVisiblePages: 5,
    size: "md",
    variant: "default",
  },
};

export const Compact: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 5,
    totalPages: 15,
    showPageInfo: true,
    size: "md",
    variant: "compact",
  },
};

export const SmallSize: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 3,
    totalPages: 8,
    showPageInfo: true,
    showFirstLast: true,
    maxVisiblePages: 5,
    size: "sm",
    variant: "default",
  },
};

export const LargeSize: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 12,
    totalPages: 25,
    showPageInfo: true,
    showFirstLast: true,
    maxVisiblePages: 7,
    size: "lg",
    variant: "default",
  },
};

export const FewPages: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 2,
    totalPages: 3,
    showPageInfo: true,
    showFirstLast: true,
    maxVisiblePages: 5,
    size: "md",
    variant: "default",
  },
};

export const SinglePage: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 1,
    totalPages: 1,
    showPageInfo: true,
    showFirstLast: true,
    maxVisiblePages: 5,
    size: "md",
    variant: "default",
  },
};

export const ManyPages: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 50,
    totalPages: 100,
    showPageInfo: true,
    showFirstLast: true,
    maxVisiblePages: 5,
    size: "md",
    variant: "default",
  },
};

export const WithoutPageInfo: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 7,
    totalPages: 15,
    showPageInfo: false,
    showFirstLast: true,
    maxVisiblePages: 5,
    size: "md",
    variant: "default",
  },
};

export const WithoutFirstLast: Story = {
  render: (args) => <PaginationWrapper {...args} />,
  args: {
    currentPage: 12,
    totalPages: 25,
    showPageInfo: true,
    showFirstLast: false,
    maxVisiblePages: 5,
    size: "md",
    variant: "default",
  },
};