import type { Meta, StoryObj } from "@storybook/react";
import { ProjectPortfolio } from "./ProjectPortfolio";
import { fn } from "@storybook/test";

const meta = {
  title: "Templates/ProjectPortfolio",
  component: ProjectPortfolio,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Project portfolio template for showcasing development projects with filtering, search, and detailed project information. Perfect for developers building in public.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Portfolio title",
    },
    description: {
      control: "text",
      description: "Portfolio description",
    },
    projects: {
      control: "object",
      description: "Array of projects to display",
    },
    showFilters: {
      control: "boolean",
      description: "Show filter panel",
    },
    showSearch: {
      control: "boolean",
      description: "Show search functionality",
    },
    showStats: {
      control: "boolean",
      description: "Show project statistics",
    },
    viewMode: {
      control: "select",
      options: ["grid", "list"],
      description: "Default view mode",
    },
    searchPlaceholder: {
      control: "text",
      description: "Search input placeholder",
    },
    onProjectClick: {
      action: "project-clicked",
      description: "Project click handler",
    },
    onFilterChange: {
      action: "filter-changed",
      description: "Filter change handler",
    },
    onSearch: {
      action: "search-performed",
      description: "Search handler",
    },
  },
  args: {
    onProjectClick: fn(),
    onFilterChange: fn(),
    onSearch: fn(),
  },
} satisfies Meta<typeof ProjectPortfolio>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleProjects = [
  {
    id: "component-library",
    title: "React Component Library",
    description: "Comprehensive component library built with React, TypeScript, and Storybook. Features 200+ components following atomic design principles.",
    longDescription: "A complete design system and component library that started as an internal tool and grew into a fully-featured open source project. Built with modern development practices and extensive documentation.",
    status: "completed" as const,
    progress: 100,
    startDate: "2023-01-15",
    endDate: "2023-12-20",
    category: "Open Source",
    technologies: ["React", "TypeScript", "Storybook", "Tailwind CSS", "Vite"],
    features: ["200+ Components", "Design System", "Accessibility", "Documentation", "Testing"],
    links: {
      demo: "https://storybook.example.com",
      github: "https://github.com/example/component-library",
      documentation: "https://docs.example.com",
      blog: "/blog/component-library-journey",
    },
    stats: {
      stars: 2340,
      forks: 456,
      downloads: 125000,
      users: 8900,
    },
    image: "https://via.placeholder.com/400x240",
    featured: true,
    buildingInPublic: true,
    learnings: ["Component API design", "Testing strategies", "Documentation practices"],
    challenges: ["Performance optimization", "Accessibility compliance", "Breaking changes"],
  },
  {
    id: "api-platform",
    title: "Developer API Platform",
    description: "Type-safe API platform with comprehensive documentation, SDKs, and developer tools for seamless integration.",
    status: "in-progress" as const,
    progress: 75,
    startDate: "2023-06-01",
    estimatedCompletion: "2024-03-01",
    category: "SaaS",
    technologies: ["Node.js", "TypeScript", "tRPC", "Prisma", "PostgreSQL", "Redis"],
    features: ["Type-safe APIs", "Auto-generated docs", "Rate limiting", "Analytics", "SDKs"],
    links: {
      demo: "https://api-demo.example.com",
      github: "https://github.com/example/api-platform",
      documentation: "https://api-docs.example.com",
    },
    stats: {
      users: 1200,
      downloads: 45000,
    },
    image: "https://via.placeholder.com/400x240",
    buildingInPublic: true,
    learnings: ["API design patterns", "Developer experience", "Scaling strategies"],
    challenges: ["Complex authentication", "Rate limiting design", "SDK generation"],
  },
  {
    id: "mobile-app",
    title: "Mobile Companion App",
    description: "Cross-platform mobile application built with React Native, providing optimized access to platform features.",
    status: "planning" as const,
    startDate: "2024-02-01",
    estimatedCompletion: "2024-08-01",
    category: "Mobile",
    technologies: ["React Native", "Expo", "TypeScript", "Zustand", "React Query"],
    features: ["Cross-platform", "Offline support", "Push notifications", "Biometric auth"],
    links: {
      github: "https://github.com/example/mobile-app",
    },
    stats: {},
    buildingInPublic: true,
    learnings: [],
    challenges: ["Platform differences", "Performance optimization", "Offline functionality"],
  },
  {
    id: "analytics-dashboard",
    title: "Analytics Dashboard",
    description: "Real-time analytics dashboard with customizable widgets, data visualization, and comprehensive reporting.",
    status: "completed" as const,
    progress: 100,
    startDate: "2022-08-01",
    endDate: "2023-04-15",
    category: "Internal Tool",
    technologies: ["React", "D3.js", "Node.js", "MongoDB", "Socket.io"],
    features: ["Real-time data", "Custom widgets", "Export reports", "Team sharing"],
    links: {
      demo: "https://analytics-demo.example.com",
      documentation: "https://analytics-docs.example.com",
      blog: "/blog/analytics-dashboard",
    },
    stats: {
      users: 2500,
    },
    image: "https://via.placeholder.com/400x240",
    featured: true,
    learnings: ["Data visualization", "Real-time systems", "User experience design"],
    challenges: ["Performance with large datasets", "Complex queries", "User customization"],
  },
  {
    id: "cli-tool",
    title: "Developer CLI Tool",
    description: "Command-line interface for streamlining development workflows with project scaffolding and automation.",
    status: "completed" as const,
    progress: 100,
    startDate: "2023-03-01",
    endDate: "2023-09-01",
    category: "Developer Tool",
    technologies: ["Node.js", "TypeScript", "Commander.js", "Inquirer.js"],
    features: ["Project scaffolding", "Code generation", "Workflow automation", "Plugin system"],
    links: {
      github: "https://github.com/example/cli-tool",
      documentation: "https://cli-docs.example.com",
    },
    stats: {
      downloads: 89000,
      stars: 1200,
    },
    buildingInPublic: true,
    learnings: ["CLI design principles", "User experience in terminal", "Plugin architecture"],
    challenges: ["Cross-platform compatibility", "Error handling", "Performance"],
  },
  {
    id: "design-system",
    title: "Design System Documentation",
    description: "Comprehensive design system with tokens, guidelines, and interactive examples for consistent product design.",
    status: "in-progress" as const,
    progress: 60,
    startDate: "2023-10-01",
    estimatedCompletion: "2024-02-01",
    category: "Design",
    technologies: ["Figma", "Storybook", "Design Tokens", "CSS Variables"],
    features: ["Design tokens", "Component guidelines", "Accessibility guides", "Brand guidelines"],
    links: {
      demo: "https://design-system.example.com",
      documentation: "https://design-docs.example.com",
    },
    stats: {},
    image: "https://via.placeholder.com/400x240",
    buildingInPublic: true,
    learnings: ["Design systems theory", "Cross-platform consistency", "Design-dev collaboration"],
    challenges: ["Token organization", "Documentation maintenance", "Adoption across teams"],
  },
  {
    id: "ml-experiment",
    title: "Machine Learning Experiment",
    description: "Experimental ML project for automated code analysis and suggestion generation using modern language models.",
    status: "paused" as const,
    progress: 30,
    startDate: "2023-11-01",
    category: "Research",
    technologies: ["Python", "TensorFlow", "Transformers", "FastAPI", "Docker"],
    features: ["Code analysis", "Suggestion generation", "Pattern recognition", "Learning pipeline"],
    links: {
      github: "https://github.com/example/ml-experiment",
    },
    stats: {},
    learnings: ["ML model training", "Code analysis techniques", "Model deployment"],
    challenges: ["Data quality", "Model accuracy", "Computational resources"],
  },
  {
    id: "legacy-migration",
    title: "Legacy System Migration",
    description: "Migration of legacy monolith to modern microservices architecture with improved performance and scalability.",
    status: "archived" as const,
    progress: 80,
    startDate: "2022-01-01",
    endDate: "2022-12-01",
    category: "Migration",
    technologies: ["Java", "Spring Boot", "Docker", "Kubernetes", "PostgreSQL"],
    features: ["Microservices", "API Gateway", "Service discovery", "Monitoring"],
    links: {
      documentation: "https://migration-docs.example.com",
      blog: "/blog/legacy-migration",
    },
    stats: {},
    learnings: ["Migration strategies", "Microservices patterns", "System architecture"],
    challenges: ["Data consistency", "Service boundaries", "Rollback strategies"],
  },
];

const openSourceProjects = sampleProjects.filter(p => p.category === "Open Source" || p.buildingInPublic);

const completedProjects = sampleProjects.filter(p => p.status === "completed");

const inProgressProjects = sampleProjects.filter(p => p.status === "in-progress");

const featuredProjects = sampleProjects.filter(p => p.featured);

export const Default: Story = {
  args: {
    projects: sampleProjects,
  },
};

export const GridView: Story = {
  args: {
    projects: sampleProjects,
    viewMode: "grid",
  },
};

export const ListView: Story = {
  args: {
    projects: sampleProjects,
    viewMode: "list",
  },
};

export const WithoutFilters: Story = {
  args: {
    projects: sampleProjects.slice(0, 4),
    showFilters: false,
  },
};

export const WithoutSearch: Story = {
  args: {
    projects: sampleProjects.slice(0, 4),
    showSearch: false,
  },
};

export const OpenSourceFocus: Story = {
  args: {
    title: "Open Source Projects",
    description: "Explore our open source contributions and projects built transparently with community involvement.",
    projects: openSourceProjects,
    showStats: true,
  },
};

export const CompletedProjects: Story = {
  args: {
    title: "Completed Projects",
    description: "Successfully delivered projects showcasing our development capabilities and lessons learned.",
    projects: completedProjects,
    showFilters: false,
  },
};

export const CurrentWork: Story = {
  args: {
    title: "Current Projects",
    description: "Projects currently in development, built in public with transparent progress updates.",
    projects: inProgressProjects,
    showFilters: false,
    viewMode: "list",
  },
};

export const FeaturedWork: Story = {
  args: {
    title: "Featured Projects",
    description: "Our most impactful and innovative projects that showcase our expertise and commitment to excellence.",
    projects: featuredProjects,
    showFilters: false,
    viewMode: "grid",
  },
};

export const BuildingInPublic: Story = {
  args: {
    title: "Building in Public Portfolio",
    description: "Transparent development journey with real-time progress, challenges, and learnings shared openly with the community.",
    projects: sampleProjects.filter(p => p.buildingInPublic),
    searchPlaceholder: "Search building in public projects...",
  },
};

export const DeveloperTools: Story = {
  args: {
    title: "Developer Tools & Utilities",
    description: "Tools and utilities built to improve developer productivity and streamline development workflows.",
    projects: sampleProjects.filter(p => 
      p.category === "Developer Tool" || 
      p.category === "Internal Tool" ||
      p.technologies.some(tech => ["CLI", "Node.js", "TypeScript"].includes(tech))
    ),
    showStats: true,
  },
};

export const MinimalPortfolio: Story = {
  args: {
    title: "Simple Portfolio",
    projects: sampleProjects.slice(0, 3),
    showFilters: false,
    showSearch: false,
    showStats: false,
    viewMode: "grid",
  },
};

export const LargePortfolio: Story = {
  args: {
    title: "Complete Project Archive",
    description: "Comprehensive archive of all projects spanning multiple years of development, experimentation, and learning.",
    projects: [
      ...sampleProjects,
      // Add more projects to demonstrate large portfolio
      {
        id: "project-9",
        title: "E-commerce Platform",
        description: "Full-featured e-commerce platform with cart, payments, and admin dashboard.",
        status: "completed" as const,
        startDate: "2022-03-01",
        endDate: "2022-11-01",
        category: "E-commerce",
        technologies: ["Next.js", "Stripe", "Prisma", "PostgreSQL"],
        features: ["Shopping cart", "Payment processing", "Admin dashboard", "Inventory management"],
        links: {
          demo: "https://ecommerce-demo.example.com",
          github: "https://github.com/example/ecommerce",
        },
        stats: {
          users: 5600,
        },
        image: "https://via.placeholder.com/400x240",
      },
      {
        id: "project-10",
        title: "Chat Application",
        description: "Real-time chat application with channels, direct messages, and file sharing.",
        status: "completed" as const,
        startDate: "2022-06-01",
        endDate: "2022-09-01",
        category: "Social",
        technologies: ["React", "Socket.io", "Express", "MongoDB"],
        features: ["Real-time messaging", "File sharing", "Channels", "User presence"],
        links: {
          demo: "https://chat-demo.example.com",
          github: "https://github.com/example/chat-app",
        },
        stats: {
          users: 3400,
        },
      },
    ],
  },
};

export const EmptyState: Story = {
  args: {
    title: "Project Portfolio",
    description: "Your projects will appear here as you build and share them",
    projects: [],
  },
};

export const SingleProject: Story = {
  args: {
    title: "Featured Project",
    projects: [sampleProjects[0]],
    showFilters: false,
    showSearch: false,
    viewMode: "grid",
  },
};

export const MobileOptimized: Story = {
  args: {
    title: "Mobile Projects",
    description: "Projects optimized for mobile experiences and cross-platform development",
    projects: sampleProjects.filter(p => 
      p.category === "Mobile" || 
      p.technologies.some(tech => ["React Native", "Expo", "Flutter"].includes(tech))
    ),
    viewMode: "list",
  },
};

export const WithoutStats: Story = {
  args: {
    title: "Clean Portfolio View",
    projects: sampleProjects.slice(0, 6),
    showStats: false,
  },
};