import type { Meta, StoryObj } from "@storybook/react";
import { ProjectShowcase } from "./ProjectShowcase";
import { 
  Code, 
  Database, 
  Layout, 
  Package, 
  Server, 
  Smartphone,
  Globe,
  Lock,
  Zap,
  Cloud
} from "lucide-react";

const meta = {
  title: "Organisms/ProjectShowcase",
  component: ProjectShowcase,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Project showcase component displaying project details, tech stack, progress, and links. Perfect for portfolio sections and project galleries.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "Project name",
    },
    description: {
      control: "text",
      description: "Short project description",
    },
    longDescription: {
      control: "text",
      description: "Detailed project description",
    },
    techStack: {
      control: "object",
      description: "Array of technologies used",
    },
    status: {
      control: "select",
      options: ["planning", "in-progress", "completed", "maintained"],
      description: "Project status",
    },
    progress: {
      control: "range",
      min: 0,
      max: 100,
      description: "Project completion percentage",
    },
    image: {
      control: "text",
      description: "Project screenshot or image URL",
    },
    imageAlt: {
      control: "text",
      description: "Alt text for project image",
    },
    links: {
      control: "object",
      description: "Array of project links",
    },
    stats: {
      control: "object",
      description: "Project statistics",
    },
    startDate: {
      control: "text",
      description: "Project start date",
    },
    completedDate: {
      control: "text",
      description: "Project completion date",
    },
    variant: {
      control: "select",
      options: ["card", "hero", "detailed", "compact"],
      description: "Display variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Component size",
    },
    featured: {
      control: "boolean",
      description: "Whether the project is featured",
    },
    showStats: {
      control: "boolean",
      description: "Show project statistics",
    },
    showProgress: {
      control: "boolean",
      description: "Show progress bar",
    },
  },
} satisfies Meta<typeof ProjectShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultTechStack = [
  { name: "React", icon: Package },
  { name: "TypeScript", icon: Code },
  { name: "Tailwind CSS", icon: Layout },
  { name: "Next.js", icon: Globe },
];

const defaultLinks = [
  { type: "github" as const, url: "https://github.com/superoptimised/design-system" },
  { type: "demo" as const, url: "https://storybook.superoptimised.com" },
  { type: "docs" as const, url: "/docs", label: "Documentation" },
];

const defaultStats = {
  stars: 1234,
  forks: 89,
  contributors: 24,
  commits: 567,
};

export const Default: Story = {
  args: {
    name: "Superoptimised Design System",
    description: "A comprehensive design system built with React, TypeScript, and Tailwind CSS for modern web applications.",
    techStack: defaultTechStack,
    status: "in-progress",
    progress: 75,
    links: defaultLinks,
    stats: defaultStats,
    startDate: "Jan 2024",
  },
};

export const Card: Story = {
  args: {
    name: "Component Library",
    description: "Reusable React components following atomic design principles with full TypeScript support.",
    techStack: ["React", "TypeScript", "Storybook", "Jest"],
    status: "in-progress",
    progress: 60,
    variant: "card",
    links: [
      { type: "github" as const, url: "https://github.com/example" },
      { type: "demo" as const, url: "https://demo.example.com" },
    ],
    stats: {
      stars: 456,
      forks: 23,
    },
  },
};

export const Hero: Story = {
  args: {
    name: "Superoptimised Platform",
    description: "Building in public, sharing the journey.",
    longDescription: "A comprehensive platform for building in public, sharing development journey, and gathering community feedback. Built with modern web technologies and a focus on developer experience.",
    techStack: [
      { name: "Next.js 14", icon: Globe },
      { name: "TypeScript", icon: Code },
      { name: "Supabase", icon: Database },
      { name: "Tailwind CSS", icon: Layout },
      { name: "tRPC", icon: Server },
      { name: "Prisma", icon: Database },
    ],
    status: "in-progress",
    progress: 45,
    variant: "hero",
    size: "lg",
    featured: true,
    links: defaultLinks,
    stats: defaultStats,
    startDate: "Dec 2023",
    image: "https://via.placeholder.com/800x450",
  },
};

export const Detailed: Story = {
  args: {
    name: "Magic Link Authentication",
    description: "Secure, passwordless authentication system using magic links.",
    longDescription: "A modern authentication system that eliminates passwords in favor of secure magic links sent via email. Features anonymous questionnaire responses, rate limiting, and comprehensive security measures.",
    techStack: [
      { name: "Next.js", icon: Globe },
      { name: "NextAuth", icon: Lock },
      { name: "Resend", icon: Server },
      { name: "PostgreSQL", icon: Database },
    ],
    status: "completed",
    variant: "detailed",
    links: [
      { type: "github" as const, url: "https://github.com/example" },
      { type: "docs" as const, url: "/docs/auth" },
    ],
    stats: {
      stars: 234,
      contributors: 8,
    },
    startDate: "Nov 2023",
    completedDate: "Jan 2024",
    image: "https://via.placeholder.com/800x450",
  },
};

export const Compact: Story = {
  args: {
    name: "API Documentation",
    description: "Comprehensive API documentation with interactive examples and TypeScript definitions.",
    techStack: ["TypeScript", "OpenAPI", "Docusaurus"],
    status: "maintained",
    variant: "compact",
    links: [
      { type: "docs" as const, url: "/api" },
    ],
  },
};

export const Featured: Story = {
  args: {
    name: "Open Source Portfolio",
    description: "A collection of open source projects and contributions to the developer community.",
    longDescription: "Showcasing various open source projects, from component libraries to full-stack applications, all built with modern web technologies and shared with the community.",
    techStack: [
      { name: "React", icon: Package },
      { name: "Vue", icon: Package },
      { name: "Node.js", icon: Server },
      { name: "Python", icon: Code },
      { name: "Docker", icon: Cloud },
    ],
    status: "maintained",
    featured: true,
    variant: "card",
    size: "lg",
    links: [
      { type: "github" as const, url: "https://github.com/superoptimised" },
      { type: "website" as const, url: "https://superoptimised.com" },
    ],
    stats: {
      stars: 5678,
      forks: 432,
      contributors: 156,
    },
  },
};

export const Planning: Story = {
  args: {
    name: "Mobile App",
    description: "Native mobile application for iOS and Android with offline support and real-time sync.",
    techStack: [
      { name: "React Native", icon: Smartphone },
      { name: "TypeScript", icon: Code },
      { name: "Expo", icon: Package },
    ],
    status: "planning",
    variant: "card",
    links: [
      { type: "github" as const, url: "https://github.com/example", label: "View Roadmap" },
    ],
  },
};

export const Completed: Story = {
  args: {
    name: "Performance Monitor",
    description: "Real-time performance monitoring dashboard with alerting and analytics.",
    techStack: [
      { name: "Next.js", icon: Globe },
      { name: "Chart.js", icon: Layout },
      { name: "WebSockets", icon: Zap },
    ],
    status: "completed",
    progress: 100,
    variant: "card",
    links: [
      { type: "demo" as const, url: "https://monitor.example.com" },
    ],
    stats: {
      stars: 89,
      forks: 12,
    },
    startDate: "Oct 2023",
    completedDate: "Dec 2023",
  },
};

export const NoStats: Story = {
  args: {
    name: "Private Project",
    description: "Internal tool for team productivity and project management.",
    techStack: ["React", "Node.js", "MongoDB"],
    status: "in-progress",
    progress: 30,
    showStats: false,
    variant: "card",
  },
};

export const NoProgress: Story = {
  args: {
    name: "Documentation Site",
    description: "Comprehensive documentation for all projects and APIs.",
    techStack: ["Markdown", "Docusaurus", "React"],
    status: "maintained",
    showProgress: false,
    variant: "card",
    links: [
      { type: "website" as const, url: "https://docs.example.com" },
    ],
  },
};

export const SimpleStrings: Story = {
  args: {
    name: "CLI Tool",
    description: "Command-line interface for managing cloud resources.",
    techStack: ["Go", "Cobra", "AWS SDK", "Docker"],
    status: "in-progress",
    progress: 80,
    variant: "card",
    links: [
      { type: "github" as const, url: "https://github.com/example/cli" },
    ],
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProjectShowcase
        name="Design System"
        description="Component library with Storybook documentation."
        techStack={["React", "TypeScript", "Tailwind CSS", "Storybook"]}
        status="in-progress"
        progress={75}
        links={[{ type: "github" as const, url: "#" }]}
        stats={{ stars: 234 }}
      />
      <ProjectShowcase
        name="API Gateway"
        description="Microservices API gateway with authentication."
        techStack={["Node.js", "Express", "Redis", "Docker"]}
        status="completed"
        links={[{ type: "docs" as const, url: "#" }]}
        stats={{ stars: 156 }}
      />
      <ProjectShowcase
        name="Mobile App"
        description="Cross-platform mobile application."
        techStack={["React Native", "TypeScript", "Redux"]}
        status="planning"
        featured
      />
      <ProjectShowcase
        name="Analytics Dashboard"
        description="Real-time analytics and reporting platform."
        techStack={["Vue.js", "D3.js", "Python", "PostgreSQL"]}
        status="in-progress"
        progress={40}
        links={[{ type: "demo" as const, url: "#" }]}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Multiple ProjectShowcase components in a grid layout.",
      },
    },
  },
};

export const CompactList: Story = {
  render: () => (
    <div className="space-y-4">
      <ProjectShowcase
        name="Component Library"
        description="Reusable UI components"
        techStack={["React", "TypeScript"]}
        status="maintained"
        variant="compact"
        links={[{ type: "github" as const, url: "#" }]}
      />
      <ProjectShowcase
        name="API Documentation"
        description="Interactive API docs"
        techStack={["OpenAPI", "Swagger"]}
        status="completed"
        variant="compact"
        links={[{ type: "docs" as const, url: "#" }]}
      />
      <ProjectShowcase
        name="Testing Framework"
        description="E2E testing solution"
        techStack={["Playwright", "Jest"]}
        status="in-progress"
        variant="compact"
        links={[{ type: "github" as const, url: "#" }]}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Compact variant suitable for lists and sidebars.",
      },
    },
  },
};