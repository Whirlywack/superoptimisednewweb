import type { Meta, StoryObj } from "@storybook/react";
import { DocSiteLayout } from "./DocSiteLayout";
import { fn } from "@storybook/test";
import { 
  FileText, 
  Book, 
  Code, 
  Settings, 
  HelpCircle, 
  Home,
  Zap,
  Globe,
  Shield,
  Database,
  Palette,
  Users,
  Search,
  Star
} from "lucide-react";

const meta = {
  title: "Templates/DocSiteLayout",
  component: DocSiteLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Documentation site layout template with sidebar navigation, search functionality, and responsive design. Perfect for technical documentation, guides, and knowledge bases.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Page title",
    },
    description: {
      control: "text", 
      description: "Page description",
    },
    navigation: {
      control: "object",
      description: "Navigation structure",
    },
    currentPath: {
      control: "text",
      description: "Current page path for highlighting active items",
    },
    showSearch: {
      control: "boolean",
      description: "Show search functionality",
    },
    searchPlaceholder: {
      control: "text",
      description: "Search input placeholder",
    },
    logoHref: {
      control: "text",
      description: "Logo link URL",
    },
    logoText: {
      control: "text",
      description: "Logo text",
    },
    version: {
      control: "text",
      description: "Version number to display",
    },
    githubUrl: {
      control: "text",
      description: "GitHub repository URL",
    },
    showThemeToggle: {
      control: "boolean",
      description: "Show theme toggle button",
    },
    showBackToTop: {
      control: "boolean",
      description: "Show back to top button",
    },
    onSearch: {
      action: "search-performed",
      description: "Search handler",
    },
    onThemeToggle: {
      action: "theme-toggled",
      description: "Theme toggle handler",
    },
  },
  args: {
    onSearch: fn(),
    onThemeToggle: fn(),
  },
} satisfies Meta<typeof DocSiteLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicNavigation = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Home,
    children: [
      { id: "introduction", title: "Introduction", href: "/docs/introduction" },
      { id: "installation", title: "Installation", href: "/docs/installation" },
      { id: "quick-start", title: "Quick Start", href: "/docs/quick-start" },
      { id: "examples", title: "Examples", href: "/docs/examples" },
    ],
  },
  {
    id: "guides",
    title: "Guides",
    icon: Book,
    children: [
      { id: "building-components", title: "Building Components", href: "/docs/guides/components" },
      { id: "styling", title: "Styling Guide", href: "/docs/guides/styling" },
      { id: "state-management", title: "State Management", href: "/docs/guides/state" },
      { id: "testing", title: "Testing", href: "/docs/guides/testing" },
    ],
  },
  {
    id: "api",
    title: "API Reference",
    icon: Code,
    children: [
      { id: "components", title: "Components", href: "/docs/api/components" },
      { id: "hooks", title: "Hooks", href: "/docs/api/hooks" },
      { id: "utilities", title: "Utilities", href: "/docs/api/utilities" },
      { id: "types", title: "TypeScript Types", href: "/docs/api/types" },
    ],
  },
  {
    id: "help",
    title: "Help & Support",
    icon: HelpCircle,
    href: "/docs/help",
  },
];

const comprehensiveNavigation = [
  {
    id: "overview",
    title: "Overview",
    icon: Home,
    children: [
      { id: "introduction", title: "Introduction", href: "/docs/introduction" },
      { id: "what-is-building-public", title: "What is Building in Public?", href: "/docs/building-public" },
      { id: "philosophy", title: "Our Philosophy", href: "/docs/philosophy" },
      { id: "roadmap", title: "Roadmap", href: "/docs/roadmap", badge: "New" },
    ],
  },
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Zap,
    children: [
      { id: "installation", title: "Installation", href: "/docs/installation" },
      { id: "setup", title: "Project Setup", href: "/docs/setup" },
      { id: "first-steps", title: "First Steps", href: "/docs/first-steps" },
      { id: "configuration", title: "Configuration", href: "/docs/configuration" },
      { id: "environment", title: "Environment Variables", href: "/docs/environment" },
    ],
  },
  {
    id: "development",
    title: "Development",
    icon: Code,
    children: [
      { id: "architecture", title: "Architecture", href: "/docs/development/architecture" },
      { id: "components", title: "Component Library", href: "/docs/development/components" },
      { id: "styling", title: "Styling & Design System", href: "/docs/development/styling" },
      { id: "state-management", title: "State Management", href: "/docs/development/state" },
      { id: "api-design", title: "API Design", href: "/docs/development/api" },
      { id: "testing", title: "Testing Strategy", href: "/docs/development/testing" },
    ],
  },
  {
    id: "features",
    title: "Features",
    icon: Star,
    children: [
      { id: "authentication", title: "Authentication", href: "/docs/features/auth" },
      { id: "database", title: "Database", href: "/docs/features/database" },
      { id: "file-uploads", title: "File Uploads", href: "/docs/features/uploads" },
      { id: "email", title: "Email System", href: "/docs/features/email" },
      { id: "analytics", title: "Analytics", href: "/docs/features/analytics", badge: "Beta" },
    ],
  },
  {
    id: "deployment",
    title: "Deployment",
    icon: Globe,
    children: [
      { id: "vercel", title: "Vercel Deployment", href: "/docs/deployment/vercel" },
      { id: "environment-setup", title: "Environment Setup", href: "/docs/deployment/environment" },
      { id: "domain-configuration", title: "Domain Configuration", href: "/docs/deployment/domain" },
      { id: "ci-cd", title: "CI/CD Pipeline", href: "/docs/deployment/ci-cd" },
    ],
  },
  {
    id: "api-reference",
    title: "API Reference",
    icon: Database,
    children: [
      { id: "authentication-api", title: "Authentication", href: "/docs/api/auth" },
      { id: "users-api", title: "Users", href: "/docs/api/users" },
      { id: "content-api", title: "Content", href: "/docs/api/content" },
      { id: "webhooks", title: "Webhooks", href: "/docs/api/webhooks" },
      { id: "rate-limiting", title: "Rate Limiting", href: "/docs/api/rate-limiting" },
    ],
  },
  {
    id: "community",
    title: "Community",
    icon: Users,
    children: [
      { id: "contributing", title: "Contributing", href: "/docs/community/contributing" },
      { id: "code-of-conduct", title: "Code of Conduct", href: "/docs/community/code-of-conduct" },
      { id: "discussions", title: "GitHub Discussions", href: "https://github.com/example/discussions", external: true },
      { id: "discord", title: "Discord Community", href: "https://discord.gg/example", external: true },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    icon: FileText,
    children: [
      { id: "examples", title: "Example Projects", href: "/docs/resources/examples" },
      { id: "tutorials", title: "Tutorials", href: "/docs/resources/tutorials" },
      { id: "blog", title: "Blog Posts", href: "/docs/resources/blog" },
      { id: "videos", title: "Video Content", href: "/docs/resources/videos" },
    ],
  },
  {
    id: "help",
    title: "Help & Support",
    icon: HelpCircle,
    children: [
      { id: "faq", title: "FAQ", href: "/docs/help/faq" },
      { id: "troubleshooting", title: "Troubleshooting", href: "/docs/help/troubleshooting" },
      { id: "support", title: "Get Support", href: "/docs/help/support" },
      { id: "changelog", title: "Changelog", href: "/docs/help/changelog" },
    ],
  },
];

const sampleContent = (
  <div className="space-y-8">
    <div className="prose max-w-none">
      <h1>Introduction to Building in Public</h1>
      <p className="text-lg text-warm-gray leading-relaxed">
        Building in public means developing projects transparently, sharing progress, challenges, 
        and learnings openly with the community. This approach fosters trust, enables collaborative 
        learning, and creates stronger products through community feedback.
      </p>
      
      <h2>Why Build in Public?</h2>
      <p>
        There are several compelling reasons to embrace the building in public philosophy:
      </p>
      
      <ul>
        <li><strong>Transparency</strong> - Share the real journey, including failures and setbacks</li>
        <li><strong>Community</strong> - Build an engaged audience that grows with your project</li>
        <li><strong>Feedback</strong> - Get valuable input early and often from real users</li>
        <li><strong>Learning</strong> - Document and share knowledge for others to benefit from</li>
        <li><strong>Accountability</strong> - Public commitment helps maintain momentum</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>
        Ready to begin your building in public journey? Here are the essential first steps:
      </p>
      
      <ol>
        <li>Choose your platform for sharing updates</li>
        <li>Define your project goals and target audience</li>
        <li>Create a content strategy for regular updates</li>
        <li>Set up systems for collecting and responding to feedback</li>
        <li>Begin documenting your process from day one</li>
      </ol>
      
      <div className="bg-light-gray dark:bg-warm-gray/10 p-6 rounded-lg">
        <h3 className="mt-0">Pro Tip</h3>
        <p className="mb-0">
          Start small and be consistent. It's better to share brief, regular updates 
          than to overwhelm yourself with lengthy posts. Focus on authenticity over perfection.
        </p>
      </div>
      
      <h2>Technical Implementation</h2>
      <p>
        This documentation site itself is built using modern web technologies and follows 
        the principles we advocate:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="bg-off-white dark:bg-off-black border border-light-gray dark:border-warm-gray/30 p-4 rounded-lg">
          <h4 className="font-semibold text-off-black dark:text-off-white mb-2">Frontend</h4>
          <ul className="text-sm text-warm-gray space-y-1">
            <li>Next.js 15 with App Router</li>
            <li>TypeScript for type safety</li>
            <li>Tailwind CSS for styling</li>
            <li>Storybook for component docs</li>
          </ul>
        </div>
        
        <div className="bg-off-white dark:bg-off-black border border-light-gray dark:border-warm-gray/30 p-4 rounded-lg">
          <h4 className="font-semibold text-off-black dark:text-off-white mb-2">Backend</h4>
          <ul className="text-sm text-warm-gray space-y-1">
            <li>tRPC for type-safe APIs</li>
            <li>Prisma ORM with PostgreSQL</li>
            <li>Supabase for authentication</li>
            <li>Vercel for deployment</li>
          </ul>
        </div>
      </div>
      
      <h2>Next Steps</h2>
      <p>
        Explore the sidebar navigation to dive deeper into specific topics. Each section 
        provides detailed guidance, code examples, and practical insights from our 
        building in public journey.
      </p>
    </div>
  </div>
);

const footerContent = (
  <div className="text-center text-sm text-warm-gray">
    <p>
      Built with transparency and community in mind. 
      <a href="https://github.com/example/docs" className="text-primary hover:text-primary/80 ml-1">
        View source on GitHub
      </a>
    </p>
  </div>
);

export const Default: Story = {
  args: {
    title: "Introduction",
    description: "Learn about building in public and transparent development",
    navigation: basicNavigation,
    currentPath: "/docs/introduction",
    children: sampleContent,
    footerContent,
  },
};

export const ComprehensiveNavigation: Story = {
  args: {
    title: "Building in Public Documentation",
    description: "Complete guide to transparent development and community building",
    navigation: comprehensiveNavigation,
    currentPath: "/docs/development/components",
    logoText: "BuildInPublic",
    version: "v2.1.0",
    githubUrl: "https://github.com/example/build-in-public",
    children: sampleContent,
    footerContent,
  },
};

export const WithoutSearch: Story = {
  args: {
    title: "Quick Reference",
    navigation: basicNavigation.slice(0, 3),
    currentPath: "/docs/api/components",
    showSearch: false,
    children: sampleContent,
  },
};

export const MinimalLayout: Story = {
  args: {
    title: "Simple Docs",
    navigation: [
      { id: "home", title: "Home", href: "/", icon: Home },
      { id: "docs", title: "Documentation", href: "/docs", icon: FileText },
      { id: "api", title: "API", href: "/api", icon: Code },
    ],
    currentPath: "/docs",
    showThemeToggle: false,
    showBackToTop: false,
    children: (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-off-black dark:text-off-white">
          Simple Documentation
        </h1>
        <p className="text-warm-gray">
          This is a minimal documentation layout with basic navigation and no extra features.
        </p>
      </div>
    ),
  },
};

export const APIReference: Story = {
  args: {
    title: "API Reference",
    description: "Complete API documentation and examples",
    navigation: [
      {
        id: "authentication",
        title: "Authentication",
        icon: Shield,
        children: [
          { id: "magic-links", title: "Magic Links", href: "/api/auth/magic-links" },
          { id: "jwt-tokens", title: "JWT Tokens", href: "/api/auth/tokens" },
          { id: "sessions", title: "Sessions", href: "/api/auth/sessions" },
        ],
      },
      {
        id: "endpoints",
        title: "Endpoints",
        icon: Database,
        children: [
          { id: "users", title: "Users", href: "/api/users" },
          { id: "content", title: "Content", href: "/api/content" },
          { id: "feedback", title: "Feedback", href: "/api/feedback" },
          { id: "analytics", title: "Analytics", href: "/api/analytics" },
        ],
      },
      {
        id: "sdks",
        title: "SDKs & Libraries",
        icon: Code,
        children: [
          { id: "javascript", title: "JavaScript SDK", href: "/api/sdk/javascript" },
          { id: "python", title: "Python SDK", href: "/api/sdk/python" },
          { id: "react", title: "React Components", href: "/api/sdk/react" },
        ],
      },
    ],
    currentPath: "/api/auth/magic-links",
    logoText: "API Docs",
    children: (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-off-black dark:text-off-white mb-4">
            Magic Link Authentication
          </h1>
          <p className="text-lg text-warm-gray">
            Secure, passwordless authentication using time-limited magic links sent via email.
          </p>
        </div>
        
        <div className="bg-light-gray dark:bg-warm-gray/10 p-4 rounded-lg">
          <h3 className="font-semibold text-off-black dark:text-off-white mb-2">
            POST /api/auth/magic-link
          </h3>
          <p className="text-sm text-warm-gray">
            Generate and send a magic link to the specified email address.
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold text-off-black dark:text-off-white mb-2">
            Example Request
          </h3>
          <pre className="bg-off-black text-off-white p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X POST \\
  https://api.example.com/auth/magic-link \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@example.com"}'`}
          </pre>
        </div>
      </div>
    ),
  },
};

export const TutorialLayout: Story = {
  args: {
    title: "Getting Started Tutorial",
    description: "Step-by-step guide to building your first application",
    navigation: [
      {
        id: "tutorial",
        title: "Tutorial Steps",
        icon: Book,
        children: [
          { id: "step-1", title: "Step 1: Setup", href: "/tutorial/setup" },
          { id: "step-2", title: "Step 2: Components", href: "/tutorial/components" },
          { id: "step-3", title: "Step 3: Styling", href: "/tutorial/styling" },
          { id: "step-4", title: "Step 4: Data", href: "/tutorial/data" },
          { id: "step-5", title: "Step 5: Deploy", href: "/tutorial/deploy" },
        ],
      },
      {
        id: "resources",
        title: "Resources",
        icon: FileText,
        children: [
          { id: "starter-code", title: "Starter Code", href: "/tutorial/starter" },
          { id: "final-code", title: "Final Code", href: "/tutorial/final" },
          { id: "troubleshooting", title: "Troubleshooting", href: "/tutorial/help" },
        ],
      },
    ],
    currentPath: "/tutorial/components",
    logoText: "Tutorial",
    searchPlaceholder: "Search tutorial...",
    children: (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
              Step 2 of 5
            </span>
            <h1 className="text-2xl font-bold text-off-black dark:text-off-white mt-2">
              Building Your First Component
            </h1>
          </div>
          <div className="text-right text-sm text-warm-gray">
            <p>Estimated time: 15 minutes</p>
          </div>
        </div>
        
        <p className="text-warm-gray">
          In this step, you'll learn how to create reusable React components using our 
          design system and best practices.
        </p>
        
        <div className="bg-light-gray dark:bg-warm-gray/10 p-4 rounded-lg">
          <h3 className="font-semibold text-off-black dark:text-off-white mb-2">
            What You'll Learn
          </h3>
          <ul className="text-sm text-warm-gray space-y-1">
            <li>• Component structure and organization</li>
            <li>• Props and TypeScript interfaces</li>
            <li>• Styling with Tailwind CSS</li>
            <li>• Component composition patterns</li>
          </ul>
        </div>
      </div>
    ),
  },
};

export const LongContent: Story = {
  args: {
    title: "Comprehensive Guide",
    description: "In-depth documentation with extensive content",
    navigation: comprehensiveNavigation,
    currentPath: "/docs/development/architecture",
    logoText: "Docs",
    version: "v1.0.0",
    showBackToTop: true,
    children: (
      <div className="space-y-8">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i}>
            <h2 className="text-xl font-semibold text-off-black dark:text-off-white mb-4">
              Section {i + 1}: Advanced Topics
            </h2>
            <p className="text-warm-gray mb-4">
              This is a long content section to demonstrate the back-to-top functionality 
              and overall layout behavior with extensive content.
            </p>
            <div className="space-y-4">
              {Array.from({ length: 5 }, (_, j) => (
                <p key={j} className="text-warm-gray">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
    footerContent,
  },
};

export const EmptyNavigation: Story = {
  args: {
    title: "Single Page",
    description: "Documentation with minimal navigation",
    navigation: [],
    children: (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-off-black dark:text-off-white mb-4">
          Standalone Documentation Page
        </h1>
        <p className="text-warm-gray">
          This layout works even with no navigation items, perfect for single-page documentation.
        </p>
      </div>
    ),
  },
};