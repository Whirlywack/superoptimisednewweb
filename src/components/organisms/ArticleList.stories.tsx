import type { Meta, StoryObj } from "@storybook/react";
import { ArticleList } from "./ArticleList";
import { fn } from "@storybook/test";

const meta = {
  title: "Organisms/ArticleList",
  component: ArticleList,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Article list component with responsive grid, view toggles, filtering, and pagination support.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    articles: {
      control: "object",
      description: "Array of articles to display",
    },
    loading: {
      control: "boolean",
      description: "Loading state",
    },
    onArticleClick: {
      action: "article-clicked",
      description: "Callback when article is clicked",
    },
    showViewToggle: {
      control: "boolean",
      description: "Whether to show grid/list view toggle",
    },
    showFilters: {
      control: "boolean",
      description: "Whether to show sorting and filtering controls",
    },
    showLoadMore: {
      control: "boolean",
      description: "Whether to show load more button",
    },
    onLoadMore: {
      action: "load-more",
      description: "Callback when load more is clicked",
    },
    hasMore: {
      control: "boolean",
      description: "Whether there are more articles to load",
    },
    variant: {
      control: "select",
      options: ["grid", "list", "compact"],
      description: "Display variant",
    },
    defaultView: {
      control: "select",
      options: ["grid", "list"],
      description: "Default view mode",
    },
    gridCols: {
      control: "select",
      options: [1, 2, 3, 4],
      description: "Number of grid columns",
    },
    showMeta: {
      control: "boolean",
      description: "Whether to show article metadata",
    },
  },
  args: {
    onArticleClick: fn(),
    onLoadMore: fn(),
  },
} satisfies Meta<typeof ArticleList>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleArticles = [
  {
    id: "1",
    title: "Building a Modern React Component Library",
    excerpt: "Learn how to create a scalable and maintainable component library using React, TypeScript, and Storybook. We'll cover everything from setup to deployment.",
    slug: "building-modern-react-component-library",
    project: "Design System",
    tags: ["React", "TypeScript", "Storybook", "Design System"],
    date: "2024-01-15",
    readingTime: "8 min read",
    featured: true,
    status: "published",
  },
  {
    id: "2",
    title: "Advanced TypeScript Patterns for Better Code",
    excerpt: "Explore advanced TypeScript patterns that will make your code more type-safe, maintainable, and developer-friendly.",
    slug: "advanced-typescript-patterns",
    project: "Code Quality",
    tags: ["TypeScript", "Patterns", "Best Practices"],
    date: "2024-01-10",
    readingTime: "12 min read",
    status: "published",
  },
  {
    id: "3",
    title: "Optimizing React Performance with Profiler",
    excerpt: "Deep dive into React's profiler tools and learn how to identify and fix performance bottlenecks in your applications.",
    slug: "optimizing-react-performance",
    project: "Performance",
    tags: ["React", "Performance", "Optimization"],
    date: "2024-01-05",
    readingTime: "15 min read",
    status: "published",
  },
  {
    id: "4",
    title: "CSS Grid vs Flexbox: When to Use What",
    excerpt: "A comprehensive guide to understanding the differences between CSS Grid and Flexbox, with practical examples and use cases.",
    slug: "css-grid-vs-flexbox",
    project: "Frontend",
    tags: ["CSS", "Layout", "Grid", "Flexbox"],
    date: "2024-01-01",
    readingTime: "6 min read",
    status: "published",
  },
  {
    id: "5",
    title: "Building Accessible Web Components",
    excerpt: "Learn how to create web components that are accessible to all users, including those who rely on assistive technologies.",
    slug: "accessible-web-components",
    project: "Accessibility",
    tags: ["Accessibility", "Web Components", "ARIA"],
    date: "2023-12-28",
    readingTime: "10 min read",
    status: "published",
  },
  {
    id: "6",
    title: "State Management with Zustand",
    excerpt: "Explore Zustand as a lightweight alternative to Redux for state management in React applications.",
    slug: "state-management-zustand",
    project: "State Management",
    tags: ["React", "State Management", "Zustand"],
    date: "2023-12-20",
    readingTime: "7 min read",
    status: "published",
  },
  {
    id: "7",
    title: "Modern CSS Features You Should Know",
    excerpt: "Stay up-to-date with the latest CSS features that can improve your development workflow and user experience.",
    slug: "modern-css-features",
    project: "Frontend",
    tags: ["CSS", "Modern CSS", "Features"],
    date: "2023-12-15",
    readingTime: "9 min read",
    status: "updated",
  },
  {
    id: "8",
    title: "Testing React Components with Jest and RTL",
    excerpt: "A comprehensive guide to testing React components using Jest and React Testing Library with best practices.",
    slug: "testing-react-components",
    project: "Testing",
    tags: ["Testing", "Jest", "React Testing Library"],
    date: "2023-12-10",
    readingTime: "11 min read",
    status: "draft",
  },
];

export const Default: Story = {
  args: {
    articles: sampleArticles,
    showViewToggle: true,
    showFilters: true,
    showMeta: true,
    variant: "grid",
    gridCols: 3,
  },
};

export const GridView: Story = {
  args: {
    articles: sampleArticles,
    defaultView: "grid",
    showViewToggle: true,
    variant: "grid",
    gridCols: 3,
  },
};

export const ListView: Story = {
  args: {
    articles: sampleArticles,
    defaultView: "list",
    showViewToggle: true,
    variant: "list",
  },
};

export const CompactView: Story = {
  args: {
    articles: sampleArticles,
    variant: "compact",
    showViewToggle: false,
    showMeta: true,
  },
};

export const TwoColumns: Story = {
  args: {
    articles: sampleArticles,
    gridCols: 2,
    showViewToggle: true,
    showFilters: true,
  },
};

export const FourColumns: Story = {
  args: {
    articles: sampleArticles,
    gridCols: 4,
    showViewToggle: true,
    showFilters: true,
  },
};

export const WithPagination: Story = {
  args: {
    articles: sampleArticles.slice(0, 4),
    showLoadMore: true,
    hasMore: true,
    showViewToggle: true,
    showFilters: true,
  },
};

export const Loading: Story = {
  args: {
    articles: [],
    loading: true,
    showViewToggle: true,
    showFilters: true,
  },
};

export const Empty: Story = {
  args: {
    articles: [],
    loading: false,
    showViewToggle: true,
    showFilters: true,
  },
};

export const NoViewToggle: Story = {
  args: {
    articles: sampleArticles,
    showViewToggle: false,
    showFilters: true,
    variant: "grid",
  },
};

export const NoFilters: Story = {
  args: {
    articles: sampleArticles,
    showViewToggle: true,
    showFilters: false,
    variant: "grid",
  },
};

export const BlogArchive: Story = {
  args: {
    articles: sampleArticles,
    showViewToggle: true,
    showFilters: true,
    showMeta: true,
    variant: "grid",
    gridCols: 2,
  },
  parameters: {
    docs: {
      description: {
        story: "Blog archive layout with 2-column grid and full filtering options.",
      },
    },
  },
};

export const PortfolioProjects: Story = {
  args: {
    articles: sampleArticles.map(article => ({
      ...article,
      title: article.title.replace("Building", "Project:").replace("Advanced", "Case Study:"),
      excerpt: `Project overview: ${article.excerpt}`,
      tags: ["Portfolio", ...article.tags.slice(0, 2)],
    })),
    showViewToggle: true,
    showFilters: false,
    variant: "grid",
    gridCols: 3,
  },
  parameters: {
    docs: {
      description: {
        story: "Portfolio projects display with modified content for showcasing work.",
      },
    },
  },
};

export const NewsListing: Story = {
  args: {
    articles: sampleArticles.map(article => ({
      ...article,
      readingTime: "2 min read",
      tags: ["News", article.tags[0]],
      project: undefined,
    })),
    defaultView: "list",
    showViewToggle: false,
    showFilters: true,
    variant: "compact",
    showMeta: true,
  },
  parameters: {
    docs: {
      description: {
        story: "News listing with compact view and simplified metadata.",
      },
    },
  },
};

export const DocumentationIndex: Story = {
  args: {
    articles: [
      {
        id: "1",
        title: "Getting Started",
        excerpt: "Learn the basics and get up and running quickly with our comprehensive getting started guide.",
        slug: "getting-started",
        tags: ["Basics", "Setup"],
        date: "2024-01-15",
        readingTime: "5 min read",
        status: "published",
      },
      {
        id: "2", 
        title: "API Reference",
        excerpt: "Complete API documentation with examples and best practices for all available endpoints.",
        slug: "api-reference",
        tags: ["API", "Reference"],
        date: "2024-01-10",
        readingTime: "15 min read",
        status: "published",
      },
      {
        id: "3",
        title: "Advanced Configuration",
        excerpt: "Deep dive into advanced configuration options and customization possibilities.",
        slug: "advanced-configuration",
        tags: ["Advanced", "Configuration"],
        date: "2024-01-05",
        readingTime: "8 min read",
        status: "updated",
      },
    ],
    variant: "list",
    showViewToggle: false,
    showFilters: false,
    showMeta: false,
    gridCols: 1,
  },
  parameters: {
    docs: {
      description: {
        story: "Documentation index with simplified layout focusing on content hierarchy.",
      },
    },
  },
};