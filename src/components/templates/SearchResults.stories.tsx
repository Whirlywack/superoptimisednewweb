import type { Meta, StoryObj } from "@storybook/react";
import { SearchResults } from "./SearchResults";
import { fn } from "@storybook/test";

const meta = {
  title: "Templates/SearchResults",
  component: SearchResults,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Search results template for displaying filtered and sorted search results. Features multiple view modes, filtering, sorting, and pagination capabilities.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    query: {
      control: "text",
      description: "Search query string",
    },
    results: {
      control: "object",
      description: "Array of search results to display",
    },
    totalResults: {
      control: "number",
      description: "Total number of search results",
    },
    searchTime: {
      control: "number",
      description: "Search execution time in seconds",
    },
    currentPage: {
      control: "number",
      description: "Current page number",
    },
    totalPages: {
      control: "number",
      description: "Total number of pages",
    },
    viewMode: {
      control: "select",
      options: ["grid", "list"],
      description: "Display mode for results",
    },
    sortBy: {
      control: "select",
      options: ["relevance", "date", "popularity", "title"],
      description: "Sort criteria",
    },
    sortOrder: {
      control: "select",
      options: ["asc", "desc"],
      description: "Sort order",
    },
    showFilters: {
      control: "boolean",
      description: "Show filters panel",
    },
    showStats: {
      control: "boolean",
      description: "Show search statistics",
    },
    showPagination: {
      control: "boolean",
      description: "Show pagination controls",
    },
    searchPlaceholder: {
      control: "text",
      description: "Search input placeholder",
    },
    emptyStateTitle: {
      control: "text",
      description: "Empty state title",
    },
    emptyStateMessage: {
      control: "text",
      description: "Empty state message",
    },
    onSearch: {
      action: "search-performed",
      description: "Search handler",
    },
    onFilterChange: {
      action: "filter-changed",
      description: "Filter change handler",
    },
    onSortChange: {
      action: "sort-changed",
      description: "Sort change handler",
    },
    onViewModeChange: {
      action: "view-mode-changed",
      description: "View mode change handler",
    },
    onPageChange: {
      action: "page-changed",
      description: "Page change handler",
    },
    onResultClick: {
      action: "result-clicked",
      description: "Result click handler",
    },
    onBookmarkToggle: {
      action: "bookmark-toggled",
      description: "Bookmark toggle handler",
    },
    onShare: {
      action: "share-clicked",
      description: "Share handler",
    },
  },
  args: {
    onSearch: fn(),
    onFilterChange: fn(),
    onSortChange: fn(),
    onViewModeChange: fn(),
    onPageChange: fn(),
    onResultClick: fn(),
    onBookmarkToggle: fn(),
    onShare: fn(),
  },
} satisfies Meta<typeof SearchResults>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleResults = [
  {
    id: "1",
    title: "Building a Modern React Component Library",
    description: "Learn how to create a scalable, accessible component library using React, TypeScript, and Storybook. This comprehensive guide covers everything from setup to publishing.",
    type: "post" as const,
    url: "/blog/react-component-library",
    thumbnail: "https://via.placeholder.com/400x200",
    author: {
      name: "Sarah Johnson",
      avatar: "https://via.placeholder.com/32x32",
      url: "/authors/sarah-johnson",
    },
    date: "2024-01-10",
    readTime: 12,
    tags: ["React", "TypeScript", "Component Library", "Storybook"],
    metadata: {
      views: 2340,
      likes: 89,
      comments: 23,
    },
    isBookmarked: true,
    isFeatured: true,
    excerpt: "A complete guide to building modern React component libraries...",
    highlightedText: "Learn how to create a scalable, accessible component library using React, TypeScript, and Storybook.",
  },
  {
    id: "2",
    title: "TypeScript Best Practices for Large Applications",
    description: "Discover essential TypeScript patterns and practices that help maintain code quality in large-scale applications.",
    type: "post" as const,
    url: "/blog/typescript-best-practices",
    author: {
      name: "Mike Chen",
      avatar: "https://via.placeholder.com/32x32",
      url: "/authors/mike-chen",
    },
    date: "2024-01-08",
    readTime: 8,
    tags: ["TypeScript", "Best Practices", "Architecture"],
    metadata: {
      views: 1890,
      likes: 67,
      comments: 15,
    },
    isBookmarked: false,
    excerpt: "Essential TypeScript patterns for maintaining code quality...",
  },
  {
    id: "3",
    title: "E-commerce Platform",
    description: "Full-featured e-commerce platform built with Next.js, featuring cart management, payment processing, and admin dashboard.",
    type: "project" as const,
    url: "/projects/ecommerce-platform",
    thumbnail: "https://via.placeholder.com/400x200",
    author: {
      name: "Alex Rivera",
      avatar: "https://via.placeholder.com/32x32",
      url: "/authors/alex-rivera",
    },
    date: "2023-12-15",
    tags: ["Next.js", "E-commerce", "Stripe", "PostgreSQL"],
    metadata: {
      views: 890,
      downloads: 156,
    },
    isBookmarked: false,
    isFeatured: true,
  },
  {
    id: "4",
    title: "API Design Guidelines",
    description: "Comprehensive documentation on designing RESTful APIs that are scalable, maintainable, and developer-friendly.",
    type: "document" as const,
    url: "/docs/api-design-guidelines",
    author: {
      name: "Emma Thompson",
      avatar: "https://via.placeholder.com/32x32",
      url: "/authors/emma-thompson",
    },
    date: "2024-01-05",
    readTime: 15,
    tags: ["API", "REST", "Documentation", "Guidelines"],
    metadata: {
      views: 3420,
      likes: 145,
    },
    isBookmarked: true,
  },
  {
    id: "5",
    title: "Introduction to React Hooks",
    description: "Learn the fundamentals of React Hooks and how they can simplify your component logic and state management.",
    type: "video" as const,
    url: "/videos/react-hooks-intro",
    thumbnail: "https://via.placeholder.com/400x200",
    author: {
      name: "David Park",
      avatar: "https://via.placeholder.com/32x32",
      url: "/authors/david-park",
    },
    date: "2024-01-03",
    tags: ["React", "Hooks", "Tutorial", "Video"],
    metadata: {
      views: 5670,
      likes: 234,
      duration: "25:30",
    },
    isBookmarked: false,
  },
  {
    id: "6",
    title: "CSS Grid Layout Cheat Sheet",
    description: "Quick reference guide for CSS Grid properties with visual examples and practical use cases.",
    type: "document" as const,
    url: "/docs/css-grid-cheat-sheet",
    thumbnail: "https://via.placeholder.com/400x200",
    author: {
      name: "Lisa Wong",
      avatar: "https://via.placeholder.com/32x32",
      url: "/authors/lisa-wong",
    },
    date: "2023-12-28",
    readTime: 5,
    tags: ["CSS", "Grid", "Layout", "Cheat Sheet"],
    metadata: {
      views: 1230,
      downloads: 89,
    },
    isBookmarked: true,
  },
  {
    id: "7",
    title: "Building Accessible Web Components",
    description: "Learn how to create web components that are accessible to all users, including those using assistive technologies.",
    type: "post" as const,
    url: "/blog/accessible-web-components",
    author: {
      name: "Jordan Kim",
      avatar: "https://via.placeholder.com/32x32",
      url: "/authors/jordan-kim",
    },
    date: "2024-01-01",
    readTime: 10,
    tags: ["Accessibility", "Web Components", "A11y"],
    metadata: {
      views: 890,
      likes: 45,
      comments: 8,
    },
    isBookmarked: false,
  },
  {
    id: "8",
    title: "Database Schema Design Tool",
    description: "Interactive tool for designing and visualizing database schemas with support for multiple database systems.",
    type: "project" as const,
    url: "/projects/db-schema-tool",
    thumbnail: "https://via.placeholder.com/400x200",
    author: {
      name: "Carlos Rodriguez",
      avatar: "https://via.placeholder.com/32x32",
      url: "/authors/carlos-rodriguez",
    },
    date: "2023-12-20",
    tags: ["Database", "Schema", "Tool", "Visualization"],
    metadata: {
      views: 2100,
      downloads: 67,
    },
    isBookmarked: false,
  },
];

const sampleFilters = {
  type: [
    { id: "post", label: "Blog Posts", value: "post", count: 124 },
    { id: "project", label: "Projects", value: "project", count: 45 },
    { id: "document", label: "Documentation", value: "document", count: 67 },
    { id: "video", label: "Videos", value: "video", count: 23 },
    { id: "code", label: "Code Samples", value: "code", count: 89 },
  ],
  dateRange: [
    { id: "week", label: "Past Week", value: "week", count: 12 },
    { id: "month", label: "Past Month", value: "month", count: 45 },
    { id: "year", label: "Past Year", value: "year", count: 234 },
    { id: "older", label: "Older", value: "older", count: 67 },
  ],
  tags: [
    { id: "react", label: "React", value: "React", count: 89 },
    { id: "typescript", label: "TypeScript", value: "TypeScript", count: 67 },
    { id: "nextjs", label: "Next.js", value: "Next.js", count: 45 },
    { id: "css", label: "CSS", value: "CSS", count: 34 },
    { id: "javascript", label: "JavaScript", value: "JavaScript", count: 123 },
  ],
};

export const Default: Story = {
  args: {
    query: "React components",
    results: sampleResults,
    totalResults: 348,
    searchTime: 0.23,
    currentPage: 1,
    totalPages: 35,
    filters: sampleFilters,
  },
};

export const GridView: Story = {
  args: {
    query: "TypeScript",
    results: sampleResults.slice(0, 6),
    totalResults: 156,
    searchTime: 0.18,
    viewMode: "grid",
    filters: sampleFilters,
  },
};

export const ListView: Story = {
  args: {
    query: "API design",
    results: sampleResults,
    totalResults: 89,
    searchTime: 0.15,
    viewMode: "list",
    filters: sampleFilters,
  },
};

export const NoFilters: Story = {
  args: {
    query: "JavaScript",
    results: sampleResults.slice(0, 5),
    totalResults: 234,
    searchTime: 0.12,
    showFilters: false,
  },
};

export const EmptyResults: Story = {
  args: {
    query: "quantum computing blockchain ai",
    results: [],
    totalResults: 0,
    searchTime: 0.05,
    filters: sampleFilters,
  },
};

export const SingleResult: Story = {
  args: {
    query: "specific tutorial",
    results: [sampleResults[0]],
    totalResults: 1,
    searchTime: 0.08,
    showPagination: false,
    filters: sampleFilters,
  },
};

export const WithActiveFilters: Story = {
  args: {
    query: "React",
    results: sampleResults.filter(r => r.tags?.includes("React")),
    totalResults: 45,
    searchTime: 0.14,
    filters: sampleFilters,
    activeFilters: {
      type: ["post"],
      tags: ["React"],
      dateRange: ["month"],
    },
  },
};

export const DocumentationSearch: Story = {
  args: {
    query: "API reference",
    results: sampleResults.filter(r => r.type === "document"),
    totalResults: 67,
    searchTime: 0.11,
    sortBy: "title",
    sortOrder: "asc",
    filters: {
      type: [
        { id: "guide", label: "Guides", value: "guide", count: 34 },
        { id: "reference", label: "Reference", value: "reference", count: 23 },
        { id: "tutorial", label: "Tutorials", value: "tutorial", count: 45 },
        { id: "example", label: "Examples", value: "example", count: 67 },
      ],
      difficulty: [
        { id: "beginner", label: "Beginner", value: "beginner", count: 45 },
        { id: "intermediate", label: "Intermediate", value: "intermediate", count: 67 },
        { id: "advanced", label: "Advanced", value: "advanced", count: 23 },
      ],
    },
  },
};

export const ProjectSearch: Story = {
  args: {
    query: "open source projects",
    results: sampleResults.filter(r => r.type === "project"),
    totalResults: 123,
    searchTime: 0.19,
    viewMode: "grid",
    sortBy: "popularity",
    filters: {
      type: [
        { id: "web", label: "Web Apps", value: "web", count: 45 },
        { id: "mobile", label: "Mobile Apps", value: "mobile", count: 23 },
        { id: "library", label: "Libraries", value: "library", count: 34 },
        { id: "tool", label: "Tools", value: "tool", count: 21 },
      ],
      license: [
        { id: "mit", label: "MIT", value: "mit", count: 67 },
        { id: "apache", label: "Apache 2.0", value: "apache", count: 34 },
        { id: "gpl", label: "GPL", value: "gpl", count: 12 },
      ],
      language: [
        { id: "javascript", label: "JavaScript", value: "javascript", count: 89 },
        { id: "typescript", label: "TypeScript", value: "typescript", count: 67 },
        { id: "python", label: "Python", value: "python", count: 45 },
        { id: "rust", label: "Rust", value: "rust", count: 23 },
      ],
    },
  },
};

export const VideoSearch: Story = {
  args: {
    query: "tutorial videos",
    results: sampleResults.filter(r => r.type === "video"),
    totalResults: 89,
    searchTime: 0.16,
    viewMode: "grid",
    sortBy: "date",
    filters: {
      duration: [
        { id: "short", label: "Under 10 min", value: "short", count: 23 },
        { id: "medium", label: "10-30 min", value: "medium", count: 45 },
        { id: "long", label: "Over 30 min", value: "long", count: 21 },
      ],
      quality: [
        { id: "720p", label: "720p", value: "720p", count: 12 },
        { id: "1080p", label: "1080p", value: "1080p", count: 67 },
        { id: "4k", label: "4K", value: "4k", count: 10 },
      ],
    },
  },
};

export const AuthorSearch: Story = {
  args: {
    query: "Sarah Johnson",
    results: sampleResults.filter(r => r.author?.name.includes("Sarah")),
    totalResults: 23,
    searchTime: 0.09,
    sortBy: "date",
    showFilters: false,
  },
};

export const TagSearch: Story = {
  args: {
    query: "#React",
    results: sampleResults.filter(r => r.tags?.includes("React")),
    totalResults: 156,
    searchTime: 0.13,
    filters: {
      popularity: [
        { id: "trending", label: "Trending", value: "trending", count: 23 },
        { id: "popular", label: "Popular", value: "popular", count: 67 },
        { id: "rising", label: "Rising", value: "rising", count: 34 },
      ],
    },
  },
};

export const FastSearch: Story = {
  args: {
    query: "quick search",
    results: sampleResults.slice(0, 3),
    totalResults: 12,
    searchTime: 0.03,
    showFilters: false,
    showPagination: false,
    showStats: false,
  },
};

export const SlowSearch: Story = {
  args: {
    query: "complex database query optimization performance",
    results: sampleResults,
    totalResults: 2340,
    searchTime: 2.45,
    currentPage: 5,
    totalPages: 234,
    filters: sampleFilters,
  },
};

export const MobileOptimized: Story = {
  args: {
    query: "mobile development",
    results: sampleResults.slice(0, 4),
    totalResults: 67,
    searchTime: 0.12,
    viewMode: "list",
    showFilters: true,
    filters: {
      platform: [
        { id: "ios", label: "iOS", value: "ios", count: 23 },
        { id: "android", label: "Android", value: "android", count: 34 },
        { id: "cross", label: "Cross-platform", value: "cross", count: 10 },
      ],
    },
  },
};

export const LargeResultSet: Story = {
  args: {
    query: "JavaScript",
    results: sampleResults,
    totalResults: 15420,
    searchTime: 0.89,
    currentPage: 47,
    totalPages: 1542,
    filters: sampleFilters,
    activeFilters: {
      type: ["post", "project"],
    },
  },
};