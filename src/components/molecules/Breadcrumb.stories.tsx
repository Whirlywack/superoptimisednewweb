import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";

const meta = {
  title: "Molecules/Breadcrumb",
  component: Breadcrumb,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Navigation breadcrumb component that shows the current page's location within the site hierarchy.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: "object",
      description: "Array of breadcrumb items",
    },
    showHome: {
      control: "boolean",
      description: "Whether to show home icon and item",
    },
    homeHref: {
      control: "text",
      description: "Home link href",
    },
    separator: {
      control: "select",
      options: ["chevron", "slash"],
      description: "Separator style between items",
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: "Projects", href: "/projects" },
      { label: "Web Development", href: "/projects/web" },
      { label: "React Components", current: true },
    ],
    showHome: true,
    homeHref: "/",
    separator: "chevron",
  },
};

export const WithSlashSeparator: Story = {
  args: {
    items: [
      { label: "Blog", href: "/blog" },
      { label: "Design System", href: "/blog/design-system" },
      { label: "Component Library", current: true },
    ],
    showHome: true,
    homeHref: "/",
    separator: "slash",
  },
};

export const WithoutHome: Story = {
  args: {
    items: [
      { label: "Documentation", href: "/docs" },
      { label: "Components", href: "/docs/components" },
      { label: "Button", current: true },
    ],
    showHome: false,
    separator: "chevron",
  },
};

export const SimpleTwoLevel: Story = {
  args: {
    items: [
      { label: "About", current: true },
    ],
    showHome: true,
    homeHref: "/",
    separator: "chevron",
  },
};

export const DeepNesting: Story = {
  args: {
    items: [
      { label: "Projects", href: "/projects" },
      { label: "E-commerce", href: "/projects/ecommerce" },
      { label: "Shopping Cart", href: "/projects/ecommerce/cart" },
      { label: "Payment Flow", href: "/projects/ecommerce/cart/payment" },
      { label: "Stripe Integration", current: true },
    ],
    showHome: true,
    homeHref: "/",
    separator: "chevron",
  },
};

export const LongLabels: Story = {
  args: {
    items: [
      { label: "Enterprise Solutions", href: "/enterprise" },
      { label: "Customer Relationship Management", href: "/enterprise/crm" },
      { label: "Advanced Analytics Dashboard Implementation", current: true },
    ],
    showHome: true,
    homeHref: "/",
    separator: "chevron",
  },
};

export const BlogPost: Story = {
  args: {
    items: [
      { label: "Blog", href: "/blog" },
      { label: "2024", href: "/blog/2024" },
      { label: "Building a Design System from Scratch", current: true },
    ],
    showHome: true,
    homeHref: "/",
    separator: "slash",
  },
};

export const ProductCatalog: Story = {
  args: {
    items: [
      { label: "Products", href: "/products" },
      { label: "Electronics", href: "/products/electronics" },
      { label: "Computers", href: "/products/electronics/computers" },
      { label: "Laptops", href: "/products/electronics/computers/laptops" },
      { label: "Gaming Laptops", current: true },
    ],
    showHome: true,
    homeHref: "/",
    separator: "chevron",
  },
};