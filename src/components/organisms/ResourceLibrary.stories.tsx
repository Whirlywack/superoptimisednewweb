import type { Meta, StoryObj } from "@storybook/react";
import { ResourceLibrary } from "./ResourceLibrary";
import { fn } from "@storybook/test";

const meta = {
  title: "Organisms/ResourceLibrary",
  component: ResourceLibrary,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Resource library component for displaying searchable and filterable collections of documents, templates, guides, and other resources. Features multiple view modes and comprehensive metadata display.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Library title",
    },
    description: {
      control: "text",
      description: "Library description",
    },
    resources: {
      control: "object",
      description: "Array of resources to display",
    },
    variant: {
      control: "select",
      options: ["default", "grid", "list", "compact"],
      description: "Display variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Component size",
    },
    showSearch: {
      control: "boolean",
      description: "Show search functionality",
    },
    showFilters: {
      control: "boolean",
      description: "Show filter panel",
    },
    showCategories: {
      control: "boolean",
      description: "Show category filters",
    },
    searchPlaceholder: {
      control: "text",
      description: "Search input placeholder",
    },
    onResourceClick: {
      action: "resource-clicked",
      description: "Resource click handler",
    },
    onDownload: {
      action: "resource-downloaded",
      description: "Download handler",
    },
  },
  args: {
    onResourceClick: fn(),
    onDownload: fn(),
  },
} satisfies Meta<typeof ResourceLibrary>;

export default meta;
type Story = StoryObj<typeof meta>;

const developmentResources = [
  {
    id: "component-library-guide",
    title: "Component Library Design Guide",
    description: "Comprehensive guide to building scalable component libraries with React, TypeScript, and Storybook. Includes design patterns, testing strategies, and documentation best practices.",
    type: "guide" as const,
    category: "Development",
    author: "Sarah Chen",
    date: "2024-01-15",
    downloadUrl: "/downloads/component-library-guide.pdf",
    fileSize: "2.3 MB",
    format: "PDF",
    tags: ["React", "TypeScript", "Storybook", "Design System"],
    featured: true,
    views: 1250,
    downloads: 480,
    rating: 5,
    difficulty: "intermediate" as const,
    estimatedTime: "45 min read",
  },
  {
    id: "nextjs-starter-template",
    title: "Next.js 15 Starter Template",
    description: "Production-ready Next.js template with TypeScript, Tailwind CSS, tRPC, Prisma, and authentication setup. Perfect for building modern web applications quickly.",
    type: "template" as const,
    category: "Development",
    author: "Mike Rodriguez",
    date: "2024-01-10",
    downloadUrl: "/downloads/nextjs-starter.zip",
    externalUrl: "https://github.com/example/nextjs-starter",
    fileSize: "850 KB",
    format: "ZIP",
    tags: ["Next.js", "TypeScript", "Tailwind", "tRPC", "Prisma"],
    views: 890,
    downloads: 325,
    rating: 4,
    difficulty: "beginner" as const,
    estimatedTime: "30 min setup",
  },
  {
    id: "api-design-patterns",
    title: "API Design Patterns & Best Practices",
    description: "Learn modern API design patterns including RESTful principles, GraphQL considerations, and tRPC implementation strategies for type-safe development.",
    type: "document" as const,
    category: "Development",
    author: "Alex Thompson",
    date: "2024-01-08",
    downloadUrl: "/downloads/api-design-patterns.pdf",
    fileSize: "1.8 MB",
    format: "PDF",
    tags: ["API", "REST", "GraphQL", "tRPC", "TypeScript"],
    views: 742,
    downloads: 298,
    rating: 5,
    difficulty: "advanced" as const,
    estimatedTime: "60 min read",
  },
  {
    id: "testing-workshop-video",
    title: "Modern React Testing Workshop",
    description: "Complete video workshop covering React Testing Library, Jest, Vitest, and end-to-end testing with Playwright. Includes practical examples and exercises.",
    type: "video" as const,
    category: "Development",
    author: "Emma Wilson",
    date: "2024-01-05",
    externalUrl: "https://youtube.com/watch?v=example",
    tags: ["Testing", "React", "Jest", "Vitest", "Playwright"],
    views: 1580,
    rating: 5,
    difficulty: "intermediate" as const,
    estimatedTime: "2.5 hours",
  },
];

const designResources = [
  {
    id: "design-system-tokens",
    title: "Design System Token Library",
    description: "Complete set of design tokens including colors, typography, spacing, and component specifications. Compatible with Figma, Sketch, and code implementations.",
    type: "tool" as const,
    category: "Design",
    author: "Jessica Park",
    date: "2024-01-12",
    downloadUrl: "/downloads/design-tokens.json",
    fileSize: "45 KB",
    format: "JSON",
    tags: ["Design Tokens", "Figma", "Sketch", "CSS Variables"],
    featured: true,
    views: 650,
    downloads: 420,
    rating: 4,
    difficulty: "beginner" as const,
  },
  {
    id: "mobile-first-guide",
    title: "Mobile-First Design Principles",
    description: "Essential guide to designing for mobile devices first, including touch targets, responsive layouts, and accessibility considerations for mobile users.",
    type: "guide" as const,
    category: "Design",
    author: "David Kim",
    date: "2024-01-07",
    downloadUrl: "/downloads/mobile-first-guide.pdf",
    fileSize: "3.1 MB",
    format: "PDF",
    tags: ["Mobile", "Responsive", "UX", "Accessibility"],
    views: 890,
    downloads: 340,
    rating: 5,
    difficulty: "beginner" as const,
    estimatedTime: "35 min read",
  },
  {
    id: "figma-component-kit",
    title: "Figma Component Kit",
    description: "Complete Figma component library with variants, auto-layout, and design tokens. Includes atomic design methodology and component documentation.",
    type: "template" as const,
    category: "Design",
    author: "Lisa Wang",
    date: "2024-01-03",
    downloadUrl: "/downloads/figma-kit.fig",
    externalUrl: "https://figma.com/community/file/example",
    fileSize: "12 MB",
    format: "FIG",
    tags: ["Figma", "Components", "Design System", "UI Kit"],
    views: 1200,
    downloads: 560,
    rating: 5,
    difficulty: "intermediate" as const,
  },
];

const businessResources = [
  {
    id: "building-public-playbook",
    title: "Building in Public Playbook",
    description: "Strategic guide to building your project publicly, including content planning, community engagement, and turning transparency into business advantage.",
    type: "document" as const,
    category: "Business",
    author: "Tom Wilson",
    date: "2024-01-14",
    downloadUrl: "/downloads/building-public-playbook.pdf",
    fileSize: "2.7 MB",
    format: "PDF",
    tags: ["Building in Public", "Marketing", "Community", "Strategy"],
    featured: true,
    views: 1450,
    downloads: 680,
    rating: 5,
    difficulty: "beginner" as const,
    estimatedTime: "50 min read",
  },
  {
    id: "startup-legal-checklist",
    title: "Startup Legal Checklist",
    description: "Essential legal considerations for early-stage startups, including incorporation, intellectual property, contracts, and compliance requirements.",
    type: "document" as const,
    category: "Business",
    author: "Jennifer Adams",
    date: "2024-01-09",
    downloadUrl: "/downloads/legal-checklist.pdf",
    fileSize: "950 KB",
    format: "PDF",
    tags: ["Legal", "Startup", "Incorporation", "IP", "Compliance"],
    views: 580,
    downloads: 245,
    rating: 4,
    difficulty: "intermediate" as const,
    estimatedTime: "25 min read",
  },
  {
    id: "mvp-validation-framework",
    title: "MVP Validation Framework",
    description: "Systematic approach to validating your minimum viable product through customer interviews, metrics analysis, and iterative improvement.",
    type: "template" as const,
    category: "Business",
    author: "Marcus Johnson",
    date: "2024-01-06",
    downloadUrl: "/downloads/mvp-framework.xlsx",
    fileSize: "180 KB",
    format: "XLSX",
    tags: ["MVP", "Validation", "Customer Development", "Metrics"],
    views: 720,
    downloads: 290,
    rating: 4,
    difficulty: "intermediate" as const,
    estimatedTime: "20 min setup",
  },
];

const tutorialResources = [
  {
    id: "typescript-migration-guide",
    title: "JavaScript to TypeScript Migration Guide",
    description: "Step-by-step guide for migrating existing JavaScript projects to TypeScript, including tooling setup, type definitions, and common patterns.",
    type: "guide" as const,
    category: "Tutorial",
    author: "Anna Zhang",
    date: "2024-01-11",
    downloadUrl: "/downloads/ts-migration-guide.pdf",
    fileSize: "1.5 MB",
    format: "PDF",
    tags: ["TypeScript", "JavaScript", "Migration", "Types"],
    views: 980,
    downloads: 410,
    rating: 5,
    difficulty: "intermediate" as const,
    estimatedTime: "40 min read",
  },
  {
    id: "deployment-automation",
    title: "Deployment Automation with GitHub Actions",
    description: "Complete tutorial on setting up CI/CD pipelines with GitHub Actions, including testing, building, and deploying to various platforms.",
    type: "guide" as const,
    category: "Tutorial",
    author: "Chris Taylor",
    date: "2024-01-04",
    downloadUrl: "/downloads/github-actions-guide.pdf",
    externalUrl: "https://github.com/example/actions-tutorial",
    fileSize: "2.1 MB",
    format: "PDF",
    tags: ["GitHub Actions", "CI/CD", "Deployment", "Automation"],
    views: 850,
    downloads: 370,
    rating: 4,
    difficulty: "advanced" as const,
    estimatedTime: "55 min read",
  },
];

const toolResources = [
  {
    id: "vscode-extensions-pack",
    title: "Essential VS Code Extensions Pack",
    description: "Curated collection of VS Code extensions for web development, including settings, snippets, and productivity tools for modern development workflows.",
    type: "tool" as const,
    category: "Tools",
    author: "Ryan Foster",
    date: "2024-01-13",
    downloadUrl: "/downloads/vscode-extensions.vsix",
    externalUrl: "https://marketplace.visualstudio.com/items?itemName=example",
    fileSize: "25 KB",
    format: "VSIX",
    tags: ["VS Code", "Extensions", "Productivity", "Development"],
    views: 1100,
    downloads: 520,
    rating: 5,
    difficulty: "beginner" as const,
  },
  {
    id: "performance-audit-script",
    title: "Web Performance Audit Script",
    description: "Automated script for auditing web performance using Lighthouse, Core Web Vitals analysis, and generating detailed performance reports.",
    type: "code" as const,
    category: "Tools",
    author: "Sophia Brown",
    date: "2024-01-02",
    downloadUrl: "/downloads/performance-audit.js",
    externalUrl: "https://github.com/example/perf-audit",
    fileSize: "85 KB",
    format: "JS",
    tags: ["Performance", "Lighthouse", "Core Web Vitals", "Audit"],
    views: 670,
    downloads: 280,
    rating: 4,
    difficulty: "advanced" as const,
    estimatedTime: "15 min setup",
  },
];

const allResources = [
  ...developmentResources,
  ...designResources,
  ...businessResources,
  ...tutorialResources,
  ...toolResources,
];

export const Default: Story = {
  args: {
    title: "Resource Library",
    description: "Comprehensive collection of guides, templates, tools, and documentation to help you build better web applications and grow your development skills.",
    resources: allResources.slice(0, 8),
  },
};

export const GridView: Story = {
  args: {
    title: "Development Resources",
    description: "Essential resources for modern web development",
    resources: developmentResources,
    variant: "grid",
  },
};

export const ListView: Story = {
  args: {
    title: "Design Resources",
    description: "Tools and guides for creating exceptional user experiences",
    resources: designResources,
    variant: "list",
  },
};

export const WithoutFilters: Story = {
  args: {
    title: "Quick Access Resources",
    resources: developmentResources.slice(0, 4),
    showFilters: false,
  },
};

export const WithoutSearch: Story = {
  args: {
    title: "Curated Collection",
    resources: designResources,
    showSearch: false,
  },
};

export const CompactVariant: Story = {
  args: {
    title: "Essential Tools",
    resources: toolResources,
    variant: "compact",
    size: "sm",
  },
};

export const FeaturedOnly: Story = {
  args: {
    title: "Featured Resources",
    description: "Our most popular and highly-rated resources",
    resources: allResources.filter(r => r.featured),
  },
};

export const ByCategory: Story = {
  args: {
    title: "Business Resources",
    description: "Strategic guides and frameworks for building successful products",
    resources: businessResources,
    showCategories: false,
  },
};

export const TutorialFocus: Story = {
  args: {
    title: "Learning Center",
    description: "Step-by-step tutorials and guides for mastering web development",
    resources: tutorialResources,
    showFilters: true,
  },
};

export const ToolsAndUtilities: Story = {
  args: {
    title: "Developer Tools",
    description: "Productivity tools and utilities for efficient development workflows",
    resources: toolResources,
    variant: "grid",
  },
};

export const LargeSize: Story = {
  args: {
    title: "Complete Resource Hub",
    description: "Everything you need to build, design, and grow your web development projects. From technical guides to business strategy, find the resources that will accelerate your journey.",
    resources: allResources,
    size: "lg",
  },
};

export const SmallSize: Story = {
  args: {
    title: "Quick Resources",
    resources: developmentResources.slice(0, 3),
    size: "sm",
    variant: "compact",
  },
};

export const EmptyState: Story = {
  args: {
    title: "Search Results",
    description: "No resources found matching your criteria",
    resources: [],
  },
};

export const SingleResource: Story = {
  args: {
    title: "Featured Guide",
    resources: [allResources[0]],
    showFilters: false,
    showSearch: false,
  },
};

export const HighRatedResources: Story = {
  args: {
    title: "Top Rated Resources",
    description: "Highest rated resources based on community feedback and usage",
    resources: allResources.filter(r => r.rating === 5),
    variant: "grid",
  },
};

export const RecentlyAdded: Story = {
  args: {
    title: "Recently Added",
    description: "Latest additions to our resource library",
    resources: allResources.slice(0, 6),
    showFilters: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Display of recently added resources with minimal filtering options.",
      },
    },
  },
};

export const DeveloperFocused: Story = {
  args: {
    title: "Developer Resources Hub",
    description: "Technical resources, code examples, and development tools for building modern web applications",
    resources: [...developmentResources, ...toolResources],
    searchPlaceholder: "Search development resources...",
  },
  parameters: {
    docs: {
      description: {
        story: "Resource library focused specifically on development tools and technical content.",
      },
    },
  },
};