import type { Meta, StoryObj } from "@storybook/react";
import { FAQAccordion } from "./FAQAccordion";
import { fn } from "@storybook/test";

const meta = {
  title: "Organisms/FAQAccordion",
  component: FAQAccordion,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "FAQ accordion component for displaying frequently asked questions with expand/collapse functionality. Features search, categorization, and multiple display variants.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Section title",
    },
    description: {
      control: "text",
      description: "Section description",
    },
    faqs: {
      control: "object",
      description: "Array of FAQ items",
    },
    variant: {
      control: "select",
      options: ["default", "simple", "categorized", "searchable"],
      description: "Display variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Component size",
    },
    allowMultiple: {
      control: "boolean",
      description: "Allow multiple items to be open simultaneously",
    },
    showSearch: {
      control: "boolean",
      description: "Show search functionality",
    },
    searchPlaceholder: {
      control: "text",
      description: "Search input placeholder text",
    },
    onQuestionClick: {
      action: "question-clicked",
      description: "Question click handler",
    },
  },
  args: {
    onQuestionClick: fn(),
  },
} satisfies Meta<typeof FAQAccordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const generalFAQs = [
  {
    id: "what-is-building-public",
    question: "What does 'building in public' mean?",
    answer: "Building in public means developing projects transparently, sharing progress, challenges, and learnings openly with the community. It involves documenting the entire development process, from initial ideas to final implementation, allowing others to follow along, provide feedback, and learn from the journey.",
    category: "General",
    featured: true,
    keywords: ["transparency", "development", "community", "open"],
  },
  {
    id: "how-to-contribute",
    question: "How can I contribute to the projects?",
    answer: "There are many ways to contribute! You can provide feedback on current features, suggest new ideas, report bugs, contribute code through pull requests, or simply engage with the community by sharing your thoughts and experiences. Every form of participation helps make the projects better.",
    category: "General",
    keywords: ["contribute", "feedback", "community", "participation"],
  },
  {
    id: "tech-stack",
    question: "What technologies are being used?",
    answer: "The primary tech stack includes Next.js 15 with App Router, TypeScript, Tailwind CSS, Prisma ORM, Supabase for database and authentication, tRPC for type-safe APIs, and Storybook for component documentation. All choices are made with transparency and learning in mind.",
    category: "Technical",
    keywords: ["nextjs", "typescript", "tailwind", "prisma", "supabase", "trpc"],
  },
  {
    id: "follow-progress",
    question: "How can I follow the development progress?",
    answer: "You can follow progress through the journey timeline on this site, subscribe to the newsletter for updates, watch the GitHub repository, or join the community discussions. Regular updates are shared about milestones, challenges, and new features being developed.",
    category: "General",
    keywords: ["progress", "timeline", "newsletter", "github", "updates"],
  },
];

const technicalFAQs = [
  {
    id: "authentication",
    question: "How does the magic link authentication work?",
    answer: "Magic link authentication uses secure, time-limited tokens sent via email. When you request access, a unique link is generated and sent to your email address. Clicking the link authenticates you without requiring a password, providing both security and convenience.",
    category: "Technical",
    keywords: ["auth", "magic link", "security", "tokens"],
  },
  {
    id: "component-library",
    question: "Can I use the component library in my own projects?",
    answer: "Yes! The component library is built with reusability in mind and follows modern React patterns. All components are documented in Storybook with examples and are designed to be easily integrated into other projects. The design system principles can be adapted to different brands.",
    category: "Technical",
    keywords: ["components", "library", "react", "storybook", "reusable"],
  },
  {
    id: "performance",
    question: "What performance optimizations are implemented?",
    answer: "Performance optimizations include server-side rendering with Next.js, image optimization, code splitting, edge caching, and careful bundle size management. Real-world performance metrics are tracked and shared as part of the building in public philosophy.",
    category: "Technical",
    keywords: ["performance", "ssr", "optimization", "caching", "metrics"],
  },
  {
    id: "accessibility",
    question: "What accessibility standards are followed?",
    answer: "All components follow WCAG 2.1 AA guidelines, including proper color contrast, keyboard navigation, screen reader support, and semantic HTML. Accessibility is tested continuously and improvements are documented throughout the development process.",
    category: "Technical",
    keywords: ["accessibility", "wcag", "a11y", "keyboard", "screen reader"],
  },
];

const communityFAQs = [
  {
    id: "feedback-system",
    question: "How does the anonymous feedback system work?",
    answer: "The feedback system allows community members to share thoughts and suggestions without requiring registration. Responses are collected securely and aggregated to inform development decisions while maintaining privacy and encouraging honest feedback.",
    category: "Community",
    keywords: ["feedback", "anonymous", "privacy", "community"],
  },
  {
    id: "community-guidelines",
    question: "What are the community guidelines?",
    answer: "Our community values respectful dialogue, constructive feedback, and collaborative learning. We encourage sharing experiences, asking questions, and supporting fellow developers. The focus is on building together and learning from each other's journeys.",
    category: "Community",
    keywords: ["guidelines", "community", "respect", "collaboration"],
  },
  {
    id: "getting-started",
    question: "I'm new to development. How can I get started?",
    answer: "Welcome! Start by exploring the learning resources and following the development journey. The project documentation includes beginner-friendly explanations of technical decisions. Don't hesitate to ask questions - the community is supportive of developers at all levels.",
    category: "Community",
    keywords: ["beginner", "learning", "getting started", "resources"],
  },
];

const troubleshootingFAQs = [
  {
    id: "magic-link-not-working",
    question: "My magic link isn't working. What should I do?",
    answer: "Magic links expire after 15 minutes for security. Check your spam folder, ensure you're using the most recent link, and try requesting a new one if needed. If problems persist, the issue might be documented in our troubleshooting guide.",
    category: "Troubleshooting",
    keywords: ["magic link", "expired", "spam", "troubleshooting"],
  },
  {
    id: "mobile-issues",
    question: "The site isn't working properly on mobile. How can I report this?",
    answer: "Mobile experience is a priority! Please report mobile issues by describing your device, browser, and the specific problem you encountered. Screenshots are helpful. Most mobile issues are addressed quickly as part of the mobile-first development approach.",
    category: "Troubleshooting",
    keywords: ["mobile", "responsive", "bug report", "device"],
  },
  {
    id: "slow-loading",
    question: "Why is the site loading slowly?",
    answer: "Performance is continuously monitored and optimized. Slow loading might be due to network conditions, browser cache, or temporary server load. Try refreshing the page or clearing your browser cache. Performance metrics and optimizations are shared transparently.",
    category: "Troubleshooting",
    keywords: ["performance", "loading", "cache", "optimization"],
  },
];

const allFAQs = [...generalFAQs, ...technicalFAQs, ...communityFAQs, ...troubleshootingFAQs];

export const Default: Story = {
  args: {
    title: "Frequently Asked Questions",
    description: "Find answers to common questions about building in public, the technology stack, and how to get involved with the community.",
    faqs: generalFAQs,
  },
};

export const Simple: Story = {
  args: {
    title: "Quick Questions",
    faqs: generalFAQs.slice(0, 3),
    variant: "simple",
  },
};

export const Categorized: Story = {
  args: {
    title: "Help Center",
    description: "Browse questions organized by topic to find the information you need.",
    faqs: allFAQs,
    variant: "categorized",
  },
};

export const Searchable: Story = {
  args: {
    title: "Searchable FAQ",
    description: "Search through our comprehensive FAQ database to find specific answers.",
    faqs: allFAQs,
    variant: "searchable",
    showSearch: true,
    searchPlaceholder: "Search for answers...",
  },
};

export const AllowMultiple: Story = {
  args: {
    title: "Technical Documentation",
    description: "Detailed technical information with multiple sections that can be opened simultaneously.",
    faqs: technicalFAQs,
    allowMultiple: true,
  },
};

export const WithSearch: Story = {
  args: {
    title: "Community Support",
    description: "Search through community questions and answers to find what you need.",
    faqs: communityFAQs,
    showSearch: true,
    allowMultiple: true,
  },
};

export const SmallSize: Story = {
  args: {
    title: "Quick Help",
    faqs: generalFAQs.slice(0, 3),
    size: "sm",
    variant: "simple",
  },
};

export const LargeSize: Story = {
  args: {
    title: "Comprehensive Guide",
    description: "Complete documentation and frequently asked questions about building in public, technical implementation, and community involvement.",
    faqs: allFAQs.slice(0, 6),
    size: "lg",
    variant: "categorized",
    allowMultiple: true,
  },
};

export const TechnicalFocus: Story = {
  args: {
    title: "Technical FAQ",
    description: "Developer-focused questions about implementation, architecture, and technical decisions.",
    faqs: technicalFAQs,
    showSearch: true,
    searchPlaceholder: "Search technical questions...",
  },
};

export const CommunityFocus: Story = {
  args: {
    title: "Community Questions",
    description: "Everything you need to know about participating in our building in public community.",
    faqs: communityFAQs,
    variant: "simple",
    allowMultiple: true,
  },
};

export const Troubleshooting: Story = {
  args: {
    title: "Troubleshooting Guide",
    description: "Solutions to common issues and problems you might encounter.",
    faqs: troubleshootingFAQs,
    showSearch: true,
    searchPlaceholder: "Describe your issue...",
  },
};

export const MinimalExample: Story = {
  args: {
    faqs: [
      {
        id: "single",
        question: "What is this project about?",
        answer: "This is a demonstration of building software in public, sharing the complete development journey with transparency and community involvement.",
      },
    ],
    variant: "simple",
    size: "sm",
  },
};

export const NoDescription: Story = {
  args: {
    title: "FAQ",
    faqs: generalFAQs.slice(0, 4),
  },
};

export const FeaturedQuestions: Story = {
  args: {
    title: "Most Important Questions",
    description: "Key questions that most visitors want answered, highlighted for easy access.",
    faqs: [
      {
        id: "featured-1",
        question: "What makes this project different?",
        answer: "Complete transparency in the development process, from technical decisions to business considerations. Everything is shared openly with the community, including failures and challenges.",
        featured: true,
        keywords: ["unique", "transparency", "difference"],
      },
      {
        id: "featured-2", 
        question: "How can I learn from this project?",
        answer: "Follow the journey timeline, read the detailed documentation of technical decisions, join community discussions, and see real examples of modern web development practices in action.",
        featured: true,
        keywords: ["learning", "education", "examples"],
      },
      ...generalFAQs.slice(2),
    ],
  },
};

export const OnlyFeatured: Story = {
  args: {
    title: "Essential Information",
    faqs: [
      {
        id: "essential-1",
        question: "Is this project open source?",
        answer: "Yes! The entire project is open source and available on GitHub. You can see the code, contribute improvements, and use components in your own projects.",
        featured: true,
      },
      {
        id: "essential-2",
        question: "Can I use this code in commercial projects?",
        answer: "Absolutely! The code is released under a permissive license that allows both personal and commercial use. Attribution is appreciated but not required.",
        featured: true,
      },
    ],
    variant: "simple",
  },
};

export const EmptyState: Story = {
  args: {
    title: "Search Results",
    description: "No FAQs found matching your search criteria.",
    faqs: [],
    showSearch: true,
  },
};

export const SingleCategory: Story = {
  args: {
    title: "Getting Started",
    faqs: communityFAQs,
    variant: "categorized",
  },
  parameters: {
    docs: {
      description: {
        story: "FAQ accordion showing questions from a single category with categorized variant.",
      },
    },
  },
};