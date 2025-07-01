import type { Meta, StoryObj } from "@storybook/react";
import { Homepage } from "./Homepage";
import { fn } from "@storybook/test";
import { 
  Zap, 
  Shield, 
  Globe, 
  Code, 
  Users, 
  Heart,
  Lightbulb,
  Target,
  BookOpen,
  MessageCircle,
  TrendingUp,
  Database,
  Palette,
  Search
} from "lucide-react";

const meta = {
  title: "Templates/Homepage",
  component: Homepage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Complete homepage template for building in public projects. Features hero section, features grid, project showcase, testimonials, blog posts, and community sections.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    hero: {
      control: "object",
      description: "Hero section configuration",
    },
    features: {
      control: "object",
      description: "Features to display",
    },
    testimonials: {
      control: "object",
      description: "Customer testimonials",
    },
    recentPosts: {
      control: "object",
      description: "Recent blog posts",
    },
    currentProjects: {
      control: "object",
      description: "Current projects showcase",
    },
    showMission: {
      control: "boolean",
      description: "Show mission section",
    },
    missionTitle: {
      control: "text",
      description: "Mission section title",
    },
    missionContent: {
      control: "text",
      description: "Mission section content",
    },
    showCommunity: {
      control: "boolean",
      description: "Show community section",
    },
    communityTitle: {
      control: "text",
      description: "Community section title",
    },
    communityDescription: {
      control: "text",
      description: "Community section description",
    },
    communityStats: {
      control: "object",
      description: "Community statistics",
    },
    ctaTitle: {
      control: "text",
      description: "CTA section title",
    },
    ctaDescription: {
      control: "text",
      description: "CTA section description",
    },
    ctaText: {
      control: "text",
      description: "CTA button text",
    },
    ctaHref: {
      control: "text",
      description: "CTA button URL",
    },
    onCtaClick: {
      action: "cta-clicked",
      description: "CTA click handler",
    },
  },
  args: {
    onCtaClick: fn(),
  },
} satisfies Meta<typeof Homepage>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultHero = {
  title: "Build Amazing Software in Public",
  subtitle: "Transparency • Community • Growth",
  description: "Join our transparent development journey where we share everything - successes, failures, and lessons learned. Build better products through community feedback and collaborative development.",
  primaryCtaText: "Start Building",
  primaryCtaHref: "/get-started",
  secondaryCtaText: "Watch Demo",
  secondaryCtaHref: "/demo",
  stats: [
    { value: "10,000+", label: "Developers" },
    { value: "500+", label: "Projects" },
    { value: "4.9/5", label: "Rating" },
  ],
};

const defaultFeatures = [
  {
    icon: Zap,
    title: "Lightning Fast Development",
    description: "Modern stack with Next.js, TypeScript, and optimized tooling for rapid iteration and deployment.",
    href: "/features/performance",
  },
  {
    icon: Shield,
    title: "Security First",
    description: "Built-in security best practices, authentication, and data protection from day one.",
    href: "/features/security",
  },
  {
    icon: Globe,
    title: "Global Community",
    description: "Connect with developers worldwide who share knowledge and build together openly.",
    href: "/community",
  },
  {
    icon: Code,
    title: "Open Source",
    description: "Fully open source codebase with transparent development process and community contributions.",
    href: "/open-source",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Docs",
    description: "Detailed documentation, tutorials, and examples for every aspect of building in public.",
    href: "/docs",
  },
  {
    icon: Heart,
    title: "Community Driven",
    description: "Features and roadmap shaped by real user feedback and community needs.",
    href: "/feedback",
  },
];

const defaultTestimonials = [
  {
    content: "This platform has completely transformed how I approach building in public. The transparency and community feedback have been invaluable to my development process.",
    author: "Sarah Chen",
    role: "Senior Frontend Developer",
    company: "TechCorp",
    avatar: "https://via.placeholder.com/40x40",
    featured: true,
  },
  {
    content: "The component library and documentation are outstanding. It's rare to find such attention to detail and developer experience in open source projects.",
    author: "Marcus Rodriguez",
    role: "Full Stack Engineer",
    company: "StartupXYZ",
    avatar: "https://via.placeholder.com/40x40",
  },
  {
    content: "I've learned more about modern development practices from following this project than from any course. The real-world examples are incredibly valuable.",
    author: "Emily Taylor",
    role: "Junior Developer",
  },
  {
    content: "The API design is clean and intuitive. Integration was seamless, and the TypeScript support made development a breeze.",
    author: "David Kim",
    role: "Tech Lead",
    company: "Innovation Labs",
    avatar: "https://via.placeholder.com/40x40",
  },
  {
    content: "What sets this project apart is the genuine commitment to community. Every piece of feedback is considered and valued.",
    author: "Jessica Park",
    role: "Product Manager",
    company: "Digital Solutions",
  },
  {
    content: "The performance optimizations and best practices implemented here serve as an excellent reference for our own projects.",
    author: "Alex Thompson",
    role: "Software Architect",
    company: "Enterprise Tech",
    avatar: "https://via.placeholder.com/40x40",
  },
];

const defaultCurrentProjects = [
  {
    id: "component-library",
    title: "Component Library v2.0",
    description: "Complete redesign of our component system with improved accessibility, performance, and developer experience. Building 50+ new components.",
    status: "in-progress" as const,
    progress: 75,
    technologies: ["React", "TypeScript", "Storybook", "Tailwind CSS", "Radix UI"],
    href: "/projects/component-library",
    featured: true,
  },
  {
    id: "api-platform",
    title: "Developer API Platform",
    description: "Type-safe API platform with comprehensive documentation, SDKs, and developer tools for seamless integration.",
    status: "in-progress" as const,
    progress: 45,
    technologies: ["tRPC", "Prisma", "PostgreSQL", "Redis", "OpenAPI"],
    href: "/projects/api-platform",
  },
  {
    id: "mobile-app",
    title: "Mobile Companion App",
    description: "Native mobile applications for iOS and Android providing optimized access to all platform features on the go.",
    status: "planning" as const,
    technologies: ["React Native", "Expo", "TypeScript", "Zustand"],
    href: "/projects/mobile-app",
  },
  {
    id: "ai-assistant",
    title: "AI Code Assistant",
    description: "Intelligent code suggestions and development assistance powered by machine learning and community knowledge.",
    status: "planning" as const,
    technologies: ["Python", "TensorFlow", "OpenAI", "Langchain"],
    href: "/projects/ai-assistant",
  },
];

const defaultRecentPosts = [
  {
    id: "building-component-library",
    title: "Building a Scalable Component Library from Scratch",
    excerpt: "Lessons learned from designing and implementing a comprehensive component system that serves thousands of developers.",
    date: "January 15, 2024",
    readTime: "8 min read",
    href: "/blog/building-component-library",
    featured: true,
  },
  {
    id: "api-design-patterns",
    title: "Modern API Design Patterns for Developer Experience",
    excerpt: "How we designed our API to be intuitive, type-safe, and enjoyable to work with, including real examples and decision rationale.",
    date: "January 12, 2024",
    readTime: "6 min read",
    href: "/blog/api-design-patterns",
  },
  {
    id: "community-feedback-integration",
    title: "Integrating Community Feedback into Product Development",
    excerpt: "Our systematic approach to collecting, evaluating, and implementing feedback from our growing developer community.",
    date: "January 10, 2024",
    readTime: "5 min read",
    href: "/blog/community-feedback",
  },
  {
    id: "performance-optimization",
    title: "Performance Optimization: From 3s to 300ms",
    excerpt: "Deep dive into the performance improvements we made, including bundle optimization, caching strategies, and rendering improvements.",
    date: "January 8, 2024",
    readTime: "10 min read",
    href: "/blog/performance-optimization",
  },
  {
    id: "open-source-sustainability",
    title: "Building Sustainable Open Source Projects",
    excerpt: "Balancing community contribution with project sustainability, including funding models and maintainer wellbeing.",
    date: "January 5, 2024",
    readTime: "7 min read",
    href: "/blog/open-source-sustainability",
  },
  {
    id: "developer-experience",
    title: "What Makes Great Developer Experience?",
    excerpt: "Analyzing the key factors that contribute to exceptional developer experience, with examples from successful projects.",
    date: "January 3, 2024",
    readTime: "6 min read",
    href: "/blog/developer-experience",
  },
];

const defaultCommunityStats = [
  { value: "10,000+", label: "Active Developers" },
  { value: "500+", label: "Open Source Projects" },
  { value: "50+", label: "Countries Represented" },
];

export const Default: Story = {
  args: {
    hero: defaultHero,
    features: defaultFeatures,
    testimonials: defaultTestimonials,
    recentPosts: defaultRecentPosts,
    currentProjects: defaultCurrentProjects,
    communityStats: defaultCommunityStats,
  },
};

export const StartupFocus: Story = {
  args: {
    hero: {
      title: "Launch Your Startup in Public",
      subtitle: "Transparency • Validation • Growth",
      description: "Build your startup with complete transparency. Share your journey, validate ideas with real users, and grow a community around your product from day one.",
      primaryCtaText: "Start Your Journey",
      primaryCtaHref: "/start",
      secondaryCtaText: "See Examples",
      secondaryCtaHref: "/examples",
      stats: [
        { value: "50+", label: "Successful Launches" },
        { value: "$2M+", label: "Funding Raised" },
        { value: "95%", label: "User Retention" },
      ],
    },
    features: [
      {
        icon: Target,
        title: "Market Validation",
        description: "Test your ideas with real users before investing significant time and resources.",
      },
      {
        icon: TrendingUp,
        title: "Growth Tracking",
        description: "Monitor your progress with detailed analytics and community feedback metrics.",
      },
      {
        icon: Users,
        title: "Audience Building",
        description: "Build an engaged community of early adopters and potential customers.",
      },
      {
        icon: Lightbulb,
        title: "Idea Refinement",
        description: "Continuously improve your product based on transparent user feedback.",
      },
    ],
    missionTitle: "Our Startup Mission",
    missionContent: "We believe the best startups are built in public, with transparency and community involvement from day one. By sharing your journey openly, you create trust, gather valuable feedback, and build a loyal user base that grows with you.",
    communityTitle: "Join Fellow Entrepreneurs",
    communityDescription: "Connect with other founders who are building their startups in public, share experiences, and learn from each other's successes and challenges.",
    currentProjects: defaultCurrentProjects.slice(0, 2),
    recentPosts: defaultRecentPosts.slice(0, 3),
    testimonials: defaultTestimonials.slice(0, 3),
  },
};

export const DeveloperFocus: Story = {
  args: {
    hero: {
      title: "Build Better Code Together",
      subtitle: "Open Source • Learning • Collaboration",
      description: "Join a community of developers who believe in transparent development, knowledge sharing, and building amazing software together in the open.",
      primaryCtaText: "Start Coding",
      primaryCtaHref: "/code",
      secondaryCtaText: "Browse Projects",
      secondaryCtaHref: "/projects",
      stats: [
        { value: "15,000+", label: "Contributors" },
        { value: "1,000+", label: "Repositories" },
        { value: "4.8/5", label: "Code Quality" },
      ],
    },
    features: [
      {
        icon: Code,
        title: "Clean Code Practices",
        description: "Learn and implement industry best practices through real-world examples and peer review.",
        href: "/learn/clean-code",
      },
      {
        icon: Database,
        title: "Modern Architecture",
        description: "Explore cutting-edge architectural patterns and system design principles.",
        href: "/learn/architecture",
      },
      {
        icon: Palette,
        title: "UI/UX Excellence",
        description: "Master the art of creating beautiful, accessible, and user-friendly interfaces.",
        href: "/learn/design",
      },
      {
        icon: Search,
        title: "Code Reviews",
        description: "Participate in collaborative code reviews that improve skills and code quality.",
        href: "/reviews",
      },
    ],
    missionTitle: "Developer Mission",
    missionContent: "We're building a platform where developers can learn, share, and grow together. Every line of code, every decision, and every challenge is shared openly to create the ultimate learning environment.",
    communityTitle: "Developer Community",
    communityDescription: "Join thousands of developers who are passionate about writing great code, sharing knowledge, and building the future of software together.",
    communityStats: [
      { value: "15,000+", label: "Developers" },
      { value: "2,500+", label: "Code Reviews" },
      { value: "100+", label: "Learning Paths" },
    ],
  },
};

export const MinimalHomepage: Story = {
  args: {
    hero: {
      title: "Simple. Transparent. Effective.",
      subtitle: "Building in Public Made Easy",
      description: "The essential platform for transparent development. No complexity, just the tools you need to build and share your journey.",
      primaryCtaText: "Get Started",
      primaryCtaHref: "/start",
    },
    features: [
      {
        icon: Zap,
        title: "Quick Setup",
        description: "Get started in minutes with our streamlined onboarding process.",
      },
      {
        icon: Users,
        title: "Community",
        description: "Connect with like-minded builders and creators.",
      },
      {
        icon: Heart,
        title: "Open Source",
        description: "Free, open, and community-driven development.",
      },
    ],
    showMission: false,
    showCommunity: false,
    recentPosts: defaultRecentPosts.slice(0, 3),
    currentProjects: defaultCurrentProjects.slice(0, 2),
    testimonials: defaultTestimonials.slice(0, 3),
    ctaTitle: "Ready to Start?",
    ctaDescription: "Join hundreds of developers building in public.",
    ctaText: "Start Building",
  },
};

export const CommunityFocus: Story = {
  args: {
    hero: {
      title: "Where Builders Connect and Grow",
      subtitle: "Community • Collaboration • Success",
      description: "Join the most supportive community of builders, creators, and entrepreneurs who believe in the power of building in public together.",
      primaryCtaText: "Join Community",
      primaryCtaHref: "/join",
      secondaryCtaText: "Explore Posts",
      secondaryCtaHref: "/explore",
      stats: [
        { value: "25,000+", label: "Members" },
        { value: "5,000+", label: "Projects Shared" },
        { value: "100+", label: "Success Stories" },
      ],
    },
    features: [
      {
        icon: MessageCircle,
        title: "Active Discussions",
        description: "Engage in meaningful conversations about building, entrepreneurship, and technology.",
      },
      {
        icon: Users,
        title: "Peer Support",
        description: "Get help, give advice, and support fellow builders on their journeys.",
      },
      {
        icon: TrendingUp,
        title: "Success Stories",
        description: "Learn from others who have successfully built and launched their projects.",
      },
      {
        icon: Heart,
        title: "Inclusive Environment",
        description: "A welcoming community for builders of all backgrounds and experience levels.",
      },
    ],
    missionTitle: "Community First",
    missionContent: "We believe that the best products are built by communities, not individuals. Our platform is designed to foster collaboration, knowledge sharing, and mutual support among builders worldwide.",
    communityStats: [
      { value: "25,000+", label: "Community Members" },
      { value: "1,500+", label: "Daily Interactions" },
      { value: "95%", label: "Member Satisfaction" },
    ],
    testimonials: [
      {
        content: "This community has been instrumental in my startup's success. The feedback and support I received here made all the difference.",
        author: "Maria Rodriguez",
        role: "Founder",
        company: "TechStartup",
        featured: true,
      },
      {
        content: "I've made genuine friendships and business partnerships through this platform. It's more than just a community - it's a family.",
        author: "James Wilson",
        role: "Indie Developer",
      },
      {
        content: "The quality of discussions and the willingness to help each other is unmatched. This is what community should be like.",
        author: "Lisa Chang",
        role: "Product Manager",
        company: "Growth Co",
      },
    ],
  },
};

export const ProductLaunch: Story = {
  args: {
    hero: {
      title: "The Future of Development is Here",
      subtitle: "Introducing Platform 2.0",
      description: "After 12 months of building in public, we're excited to launch the most comprehensive platform for transparent development and community building.",
      primaryCtaText: "Try Platform 2.0",
      primaryCtaHref: "/v2",
      secondaryCtaText: "Read Launch Story",
      secondaryCtaHref: "/blog/v2-launch",
      stats: [
        { value: "2.0", label: "New Version" },
        { value: "50+", label: "New Features" },
        { value: "10x", label: "Performance Boost" },
      ],
    },
    features: [
      {
        icon: Zap,
        title: "Lightning Performance",
        description: "10x faster than v1.0 with optimized rendering and caching.",
      },
      {
        icon: Shield,
        title: "Enterprise Security",
        description: "Bank-grade security with SOC2 compliance and advanced encryption.",
      },
      {
        icon: Palette,
        title: "Beautiful Design",
        description: "Completely redesigned interface with improved user experience.",
      },
      {
        icon: Database,
        title: "Advanced APIs",
        description: "Type-safe APIs with comprehensive documentation and SDKs.",
      },
    ],
    currentProjects: [
      {
        id: "v2-platform",
        title: "Platform 2.0 Launch",
        description: "Complete platform rewrite with modern architecture, improved performance, and enhanced user experience.",
        status: "completed" as const,
        progress: 100,
        technologies: ["Next.js 15", "React 18", "TypeScript 5", "Tailwind CSS"],
        href: "/projects/v2-platform",
        featured: true,
      },
      {
        id: "enterprise-features",
        title: "Enterprise Features",
        description: "Advanced features for enterprise customers including SSO, advanced analytics, and custom integrations.",
        status: "in-progress" as const,
        progress: 80,
        technologies: ["SAML", "OAuth", "Analytics", "Webhooks"],
        href: "/projects/enterprise",
      },
    ],
    missionTitle: "Our Launch Promise",
    missionContent: "Version 2.0 represents our commitment to building the best possible platform for transparent development. Every feature was shaped by community feedback and real-world usage.",
    ctaTitle: "Experience Platform 2.0 Today",
    ctaDescription: "Join thousands of developers who are already building amazing things with our new platform.",
    ctaText: "Start with Platform 2.0",
  },
};

export const NoContent: Story = {
  args: {
    hero: {
      title: "Clean Slate",
      subtitle: "Minimal Homepage",
      description: "Sometimes less is more. This homepage focuses purely on the essential message without distractions.",
      primaryCtaText: "Learn More",
      primaryCtaHref: "/learn",
    },
    features: [],
    testimonials: [],
    recentPosts: [],
    currentProjects: [],
    showMission: false,
    showCommunity: false,
    ctaTitle: "Simple Call to Action",
    ctaDescription: "One clear message, one clear action.",
    ctaText: "Take Action",
  },
};