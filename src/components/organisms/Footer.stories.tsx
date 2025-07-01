import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "./Footer";
import { Github, Twitter, Linkedin, Mail, Rss, Youtube } from "lucide-react";

const meta = {
  title: "Organisms/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Footer component with social links, navigation sections, and optional newsletter signup. Supports multiple variants and customizable content.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    socialLinks: {
      control: "object",
      description: "Array of social media links with icons",
    },
    sections: {
      control: "object", 
      description: "Array of footer sections with links",
    },
    copyright: {
      control: "text",
      description: "Copyright text",
    },
    showNewsletter: {
      control: "boolean",
      description: "Whether to show newsletter signup",
    },
    variant: {
      control: "select",
      options: ["simple", "detailed", "minimal"],
      description: "Footer variant",
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Detailed: Story = {
  args: {
    variant: "detailed",
    showNewsletter: true,
  },
};

export const Simple: Story = {
  args: {
    variant: "simple",
    showNewsletter: true,
  },
};

export const Minimal: Story = {
  args: {
    variant: "minimal",
    showNewsletter: false,
  },
};

export const WithoutNewsletter: Story = {
  args: {
    variant: "detailed",
    showNewsletter: false,
  },
};

export const CustomSocials: Story = {
  args: {
    variant: "detailed",
    showNewsletter: true,
    socialLinks: [
      {
        label: "GitHub",
        href: "https://github.com/example",
        icon: Github,
        external: true,
      },
      {
        label: "Twitter",
        href: "https://twitter.com/example",
        icon: Twitter,
        external: true,
      },
      {
        label: "LinkedIn", 
        href: "https://linkedin.com/company/example",
        icon: Linkedin,
        external: true,
      },
      {
        label: "YouTube",
        href: "https://youtube.com/@example",
        icon: Youtube,
        external: true,
      },
      {
        label: "RSS",
        href: "/rss.xml",
        icon: Rss,
        external: true,
      },
    ],
  },
};

export const BlogFooter: Story = {
  args: {
    variant: "detailed",
    showNewsletter: true,
    sections: [
      {
        title: "Content",
        links: [
          { label: "Latest Posts", href: "/blog" },
          { label: "Categories", href: "/categories" },
          { label: "Archives", href: "/archives" },
          { label: "RSS Feed", href: "/rss.xml", external: true },
        ],
      },
      {
        title: "Topics",
        links: [
          { label: "JavaScript", href: "/topics/javascript" },
          { label: "React", href: "/topics/react" },
          { label: "Design", href: "/topics/design" },
          { label: "Performance", href: "/topics/performance" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Newsletter", href: "/newsletter" },
          { label: "Tools", href: "/tools" },
          { label: "Books", href: "/books" },
          { label: "Courses", href: "/courses" },
        ],
      },
    ],
    copyright: "© 2024 DevBlog. Made with ❤️ for developers.",
  },
};

export const CorporateFooter: Story = {
  args: {
    variant: "detailed",
    showNewsletter: false,
    sections: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "/features" },
          { label: "Pricing", href: "/pricing" },
          { label: "Enterprise", href: "/enterprise" },
          { label: "API", href: "/api" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Careers", href: "/careers" },
          { label: "Press", href: "/press" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Documentation", href: "/docs" },
          { label: "Support", href: "/support" },
          { label: "Status", href: "https://status.example.com", external: true },
          { label: "Community", href: "/community" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
          { label: "Security", href: "/security" },
          { label: "Compliance", href: "/compliance" },
        ],
      },
    ],
    socialLinks: [
      {
        label: "Twitter",
        href: "https://twitter.com/company",
        icon: Twitter,
        external: true,
      },
      {
        label: "LinkedIn",
        href: "https://linkedin.com/company/example",
        icon: Linkedin,
        external: true,
      },
      {
        label: "GitHub",
        href: "https://github.com/company",
        icon: Github,
        external: true,
      },
    ],
    copyright: "© 2024 TechCorp Inc. All rights reserved.",
  },
};

export const PortfolioFooter: Story = {
  args: {
    variant: "simple",
    showNewsletter: false,
    sections: [
      {
        title: "Work",
        links: [
          { label: "Projects", href: "/projects" },
          { label: "Case Studies", href: "/case-studies" },
          { label: "Resume", href: "/resume.pdf", external: true },
        ],
      },
    ],
    socialLinks: [
      {
        label: "GitHub",
        href: "https://github.com/designer",
        icon: Github,
        external: true,
      },
      {
        label: "LinkedIn",
        href: "https://linkedin.com/in/designer",
        icon: Linkedin,
        external: true,
      },
      {
        label: "Email",
        href: "mailto:hello@designer.com",
        icon: Mail,
        external: true,
      },
    ],
    copyright: "© 2024 Jane Designer. Available for new projects.",
  },
};

export const DocumentationFooter: Story = {
  args: {
    variant: "detailed",
    showNewsletter: false,
    sections: [
      {
        title: "Documentation",
        links: [
          { label: "Getting Started", href: "/docs/getting-started" },
          { label: "API Reference", href: "/docs/api" },
          { label: "Examples", href: "/docs/examples" },
          { label: "Migration", href: "/docs/migration" },
        ],
      },
      {
        title: "Community",
        links: [
          { label: "Discord", href: "https://discord.gg/example", external: true },
          { label: "GitHub Discussions", href: "https://github.com/example/discussions", external: true },
          { label: "Stack Overflow", href: "https://stackoverflow.com/questions/tagged/example", external: true },
          { label: "Reddit", href: "https://reddit.com/r/example", external: true },
        ],
      },
      {
        title: "Project",
        links: [
          { label: "Changelog", href: "/changelog" },
          { label: "Roadmap", href: "/roadmap" },
          { label: "Contributing", href: "/contributing" },
          { label: "License", href: "/license" },
        ],
      },
    ],
    socialLinks: [
      {
        label: "GitHub",
        href: "https://github.com/project",
        icon: Github,
        external: true,
      },
      {
        label: "Twitter",
        href: "https://twitter.com/project",
        icon: Twitter,
        external: true,
      },
    ],
    copyright: "© 2024 Open Source Project. MIT Licensed.",
  },
};

export const LandingPageFooter: Story = {
  args: {
    variant: "detailed",
    showNewsletter: true,
    sections: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "FAQ", href: "#faq" },
          { label: "Demo", href: "/demo" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Blog", href: "/blog" },
          { label: "Careers", href: "/careers" },
          { label: "Press Kit", href: "/press" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "Help Center", href: "/help" },
          { label: "Contact Us", href: "/contact" },
          { label: "System Status", href: "https://status.example.com", external: true },
          { label: "Bug Reports", href: "https://github.com/example/issues", external: true },
        ],
      },
    ],
    copyright: "© 2024 StartupName. Building the future, one feature at a time.",
  },
};