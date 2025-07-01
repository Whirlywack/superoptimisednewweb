import type { Meta, StoryObj } from "@storybook/react";
import { Navigation } from "./Navigation";
import { H3 } from "@/components/ui/Typography";

const meta = {
  title: "Organisms/Navigation",
  component: Navigation,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Main navigation component with desktop and mobile layouts, dropdown support, and responsive behavior.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: "object",
      description: "Navigation items array",
    },
    logo: {
      control: "text",
      description: "Logo component or text",
    },
    logoHref: {
      control: "text",
      description: "Logo link destination",
    },
    variant: {
      control: "select",
      options: ["horizontal", "mobile"],
      description: "Navigation variant",
    },
    showMobileToggle: {
      control: "boolean",
      description: "Whether to show mobile menu toggle",
    },
    onItemClick: {
      action: "item-clicked",
      description: "Callback when navigation item is clicked",
    },
  },
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleNavItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Projects",
    href: "/projects",
    children: [
      { label: "Web Apps", href: "/projects/web" },
      { label: "Mobile Apps", href: "/projects/mobile" },
      { label: "Open Source", href: "/projects/oss" },
    ],
  },
  {
    label: "Blog",
    href: "/blog",
    children: [
      { label: "Latest Posts", href: "/blog/latest" },
      { label: "Technical", href: "/blog/technical" },
      { label: "Design", href: "/blog/design" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

const LogoComponent = () => (
  <H3 className="text-primary font-bold">Superoptimised</H3>
);

export const Default: Story = {
  args: {
    items: sampleNavItems,
    logo: <LogoComponent />,
    logoHref: "/",
    variant: "horizontal",
    showMobileToggle: true,
  },
};

export const SimpleNav: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Contact", href: "/contact" },
    ],
    logo: <LogoComponent />,
    logoHref: "/",
    variant: "horizontal",
    showMobileToggle: true,
  },
};

export const WithExternalLinks: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Docs", href: "/docs" },
      { label: "GitHub", href: "https://github.com/example", external: true },
      { label: "Twitter", href: "https://twitter.com/example", external: true },
    ],
    logo: <LogoComponent />,
    logoHref: "/",
    variant: "horizontal",
    showMobileToggle: true,
  },
};

export const BlogNavigation: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      {
        label: "Categories",
        href: "/categories",
        children: [
          { label: "JavaScript", href: "/categories/javascript" },
          { label: "React", href: "/categories/react" },
          { label: "CSS", href: "/categories/css" },
          { label: "Design", href: "/categories/design" },
        ],
      },
      { label: "Archives", href: "/archives" },
      { label: "About", href: "/about" },
      { label: "RSS", href: "/rss.xml", external: true },
    ],
    logo: <span className="text-xl font-bold text-primary">DevBlog</span>,
    logoHref: "/",
    variant: "horizontal",
    showMobileToggle: true,
  },
};

export const CorporateNav: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      {
        label: "Products",
        href: "/products",
        children: [
          { label: "Enterprise", href: "/products/enterprise" },
          { label: "Small Business", href: "/products/smb" },
          { label: "Personal", href: "/products/personal" },
        ],
      },
      {
        label: "Solutions",
        href: "/solutions",
        children: [
          { label: "Healthcare", href: "/solutions/healthcare" },
          { label: "Finance", href: "/solutions/finance" },
          { label: "Education", href: "/solutions/education" },
        ],
      },
      {
        label: "Resources",
        href: "/resources",
        children: [
          { label: "Documentation", href: "/docs" },
          { label: "API Reference", href: "/api" },
          { label: "Support", href: "/support" },
          { label: "Community", href: "/community" },
        ],
      },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
    logo: <span className="text-xl font-bold text-primary">TechCorp</span>,
    logoHref: "/",
    variant: "horizontal",
    showMobileToggle: true,
  },
};

export const MinimalNav: Story = {
  args: {
    items: [
      { label: "Work", href: "/work" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
    logo: <span className="text-lg font-medium">Portfolio</span>,
    logoHref: "/",
    variant: "horizontal",
    showMobileToggle: true,
  },
};

export const MobileView: Story = {
  args: {
    items: sampleNavItems,
    logo: <LogoComponent />,
    logoHref: "/",
    variant: "mobile",
    showMobileToggle: false,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const WithoutLogo: Story = {
  args: {
    items: sampleNavItems,
    logoHref: "/",
    variant: "horizontal",
    showMobileToggle: true,
  },
};

export const DocumentationNav: Story = {
  args: {
    items: [
      { label: "Guide", href: "/guide" },
      {
        label: "API",
        href: "/api",
        children: [
          { label: "Components", href: "/api/components" },
          { label: "Hooks", href: "/api/hooks" },
          { label: "Utilities", href: "/api/utils" },
        ],
      },
      {
        label: "Examples",
        href: "/examples",
        children: [
          { label: "Basic", href: "/examples/basic" },
          { label: "Advanced", href: "/examples/advanced" },
          { label: "Patterns", href: "/examples/patterns" },
        ],
      },
      { label: "Playground", href: "/playground" },
      { label: "GitHub", href: "https://github.com/example", external: true },
    ],
    logo: <span className="text-lg font-mono font-bold text-primary">docs/</span>,
    logoHref: "/",
    variant: "horizontal",
    showMobileToggle: true,
  },
};