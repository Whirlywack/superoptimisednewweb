import type { Meta, StoryObj } from "@storybook/react";
import { ErrorPage } from "./ErrorPage";
import { fn } from "@storybook/test";
import { 
  Home, 
  ArrowLeft, 
  RefreshCw,
  Search,
  BookOpen,
  Users,
  Server,
  FileX,
  Shield,
  Clock,
  Wifi,
  Settings,
  AlertTriangle,
  ExternalLink,
  MessageCircle,
  Mail,
  HelpCircle,
  Download,
  Smartphone,
  Globe
} from "lucide-react";

const meta = {
  title: "Templates/ErrorPage",
  component: ErrorPage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Error page template for handling various error states including 404, 500, expired links, and maintenance modes. Features customizable actions, suggestions, and contact information.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    errorType: {
      control: "select",
      options: ["404", "403", "500", "expired", "offline", "maintenance", "custom"],
      description: "Type of error to display",
    },
    title: {
      control: "text",
      description: "Error page title",
    },
    message: {
      control: "text",
      description: "Primary error message",
    },
    description: {
      control: "text",
      description: "Detailed error description",
    },
    errorCode: {
      control: "text",
      description: "Error code to display",
    },
    showErrorDetails: {
      control: "boolean",
      description: "Show technical error details",
    },
    showSuggestions: {
      control: "boolean",
      description: "Show helpful suggestions section",
    },
    showContactInfo: {
      control: "boolean",
      description: "Show contact and support information",
    },
    actions: {
      control: "object",
      description: "Array of action buttons",
    },
    suggestions: {
      control: "object",
      description: "Array of helpful suggestions",
    },
    contactEmail: {
      control: "text",
      description: "Support email address",
    },
    supportUrl: {
      control: "text",
      description: "Support/help center URL",
    },
    statusPageUrl: {
      control: "text",
      description: "Status page URL",
    },
    documentationUrl: {
      control: "text",
      description: "Documentation URL",
    },
    homeUrl: {
      control: "text",
      description: "Home page URL",
    },
    searchUrl: {
      control: "text",
      description: "Search page URL",
    },
    timestamp: {
      control: "text",
      description: "Error timestamp",
    },
    requestId: {
      control: "text",
      description: "Request ID for debugging",
    },
  },
} satisfies Meta<typeof ErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultSuggestions = [
  {
    id: "search",
    title: "Search our site",
    description: "Find what you're looking for using our search",
    href: "/search",
    icon: Search,
  },
  {
    id: "docs",
    title: "Browse documentation",
    description: "Check our comprehensive documentation",
    href: "/docs",
    icon: BookOpen,
  },
  {
    id: "community",
    title: "Ask the community",
    description: "Get help from our community forum",
    href: "/community",
    icon: Users,
  },
];

const developerSuggestions = [
  {
    id: "api-docs",
    title: "API Documentation",
    description: "View our complete API reference and guides",
    href: "/api/docs",
    icon: BookOpen,
  },
  {
    id: "status",
    title: "Service Status",
    description: "Check current API status and uptime",
    href: "/status",
    icon: Server,
  },
  {
    id: "support",
    title: "Developer Support",
    description: "Get technical help from our developer community",
    href: "/developer-support",
    icon: Users,
  },
];

const mobileSuggestions = [
  {
    id: "app-store",
    title: "Download Mobile App",
    description: "Get our mobile app for iOS and Android",
    href: "/download",
    icon: Smartphone,
  },
  {
    id: "mobile-site",
    title: "Mobile Website",
    description: "Try our mobile-optimized website",
    href: "/mobile",
    icon: Globe,
  },
  {
    id: "help",
    title: "Mobile Help",
    description: "Get help with mobile-specific issues",
    href: "/mobile-help",
    icon: HelpCircle,
  },
];

export const NotFound404: Story = {
  args: {
    errorType: "404",
  },
};

export const AccessDenied403: Story = {
  args: {
    errorType: "403",
  },
};

export const ServerError500: Story = {
  args: {
    errorType: "500",
    timestamp: new Date().toISOString(),
    requestId: "req_1234567890abcdef",
  },
};

export const ExpiredLink: Story = {
  args: {
    errorType: "expired",
    title: "Magic Link Expired",
    message: "This sign-in link has expired",
    description: "For security reasons, magic links expire after 15 minutes. Please request a new link to continue.",
  },
};

export const OfflineMode: Story = {
  args: {
    errorType: "offline",
    actions: [
      {
        id: "retry",
        label: "Try Again",
        onClick: fn(),
        variant: "primary",
        icon: RefreshCw,
      },
      {
        id: "home",
        label: "Go Home",
        href: "/",
        variant: "outline",
        icon: Home,
      },
    ],
  },
};

export const MaintenanceMode: Story = {
  args: {
    errorType: "maintenance",
    title: "Scheduled Maintenance",
    message: "We'll be back in about 30 minutes",
    description: "We're performing scheduled maintenance to improve our service. Follow us on social media for real-time updates.",
    actions: [
      {
        id: "status",
        label: "Check Status",
        href: "/status",
        variant: "primary",
        icon: Server,
      },
      {
        id: "twitter",
        label: "Follow Updates",
        href: "https://twitter.com/company",
        variant: "outline",
        icon: ExternalLink,
        external: true,
      },
    ],
  },
};

export const CustomError: Story = {
  args: {
    errorType: "custom",
    title: "Payment Processing Error",
    message: "Unable to process your payment",
    description: "There was an issue processing your payment. Your card has not been charged. Please try again or contact support.",
    errorCode: "PAY_001",
    actions: [
      {
        id: "retry",
        label: "Try Again",
        onClick: fn(),
        variant: "primary",
        icon: RefreshCw,
      },
      {
        id: "support",
        label: "Contact Support",
        href: "/support",
        variant: "outline",
        icon: MessageCircle,
      },
    ],
  },
};

export const DeveloperError: Story = {
  args: {
    errorType: "500",
    title: "API Error",
    message: "Internal server error occurred",
    description: "An unexpected error occurred while processing your API request. Our team has been notified and is investigating the issue.",
    errorCode: "API_500",
    suggestions: developerSuggestions,
    timestamp: "2024-01-15T10:30:00Z",
    requestId: "req_api_1234567890",
  },
};

export const MobileOptimized: Story = {
  args: {
    errorType: "404",
    title: "Page Not Found",
    message: "This page isn't available on mobile",
    description: "Some features are only available on desktop. Try our mobile app or the mobile-optimized version of our site.",
    suggestions: mobileSuggestions,
  },
};

export const MinimalError: Story = {
  args: {
    errorType: "404",
    showErrorDetails: false,
    showSuggestions: false,
    showContactInfo: false,
    title: "Not Found",
    message: "The page you're looking for doesn't exist",
    actions: [
      {
        id: "home",
        label: "Go Home",
        href: "/",
        variant: "primary",
        icon: Home,
      },
    ],
  },
};

export const DetailedError: Story = {
  args: {
    errorType: "500",
    title: "Server Error",
    message: "Something went wrong on our end",
    description: "We're experiencing technical difficulties with our servers. Our engineering team has been automatically notified and is working to resolve the issue. Please try again in a few minutes.",
    errorCode: "SRV_500",
    timestamp: "2024-01-15T14:22:33.123Z",
    requestId: "req_srv_9876543210fedcba",
    showErrorDetails: true,
    showSuggestions: true,
    showContactInfo: true,
    contactEmail: "engineering@superoptimised.com",
    supportUrl: "/technical-support",
    statusPageUrl: "https://status.superoptimised.com",
  },
};

export const AuthenticationError: Story = {
  args: {
    errorType: "403",
    title: "Authentication Required",
    message: "You need to sign in to access this page",
    description: "This content requires authentication. Please sign in with your account or create a new one to continue.",
    actions: [
      {
        id: "signin",
        label: "Sign In",
        href: "/auth/signin",
        variant: "primary",
        icon: Shield,
      },
      {
        id: "signup",
        label: "Create Account",
        href: "/auth/signup",
        variant: "outline",
        icon: Users,
      },
    ],
    suggestions: [
      {
        id: "forgot",
        title: "Forgot Password?",
        description: "Reset your password if you can't remember it",
        href: "/auth/forgot-password",
        icon: HelpCircle,
      },
      {
        id: "magic-link",
        title: "Magic Link Sign In",
        description: "Sign in without a password using email",
        href: "/auth/magic-link",
        icon: Mail,
      },
      {
        id: "help",
        title: "Sign In Help",
        description: "Get help with account access issues",
        href: "/auth/help",
        icon: MessageCircle,
      },
    ],
  },
};

export const NetworkError: Story = {
  args: {
    errorType: "offline",
    title: "Connection Problem",
    message: "Unable to connect to our servers",
    description: "There seems to be a network connectivity issue. Please check your internet connection and try again.",
    actions: [
      {
        id: "retry",
        label: "Retry Connection",
        onClick: fn(),
        variant: "primary",
        icon: RefreshCw,
      },
      {
        id: "offline-help",
        label: "Offline Help",
        href: "/offline-help",
        variant: "outline",
        icon: HelpCircle,
      },
    ],
    suggestions: [
      {
        id: "cache",
        title: "View Cached Content",
        description: "Access previously loaded content while offline",
        href: "/offline",
        icon: Download,
      },
      {
        id: "network-tips",
        title: "Connection Tips",
        description: "Troubleshoot common connectivity issues",
        href: "/network-help",
        icon: Wifi,
      },
      {
        id: "status",
        title: "Service Status",
        description: "Check if our services are experiencing issues",
        href: "/status",
        icon: Server,
      },
    ],
  },
};

export const ComingSoon: Story = {
  args: {
    errorType: "custom",
    title: "Coming Soon",
    message: "This feature is under development",
    description: "We're working hard to bring you this new feature. Sign up for updates to be notified when it's ready.",
    errorCode: "COMING_SOON",
    actions: [
      {
        id: "notify",
        label: "Get Notified",
        href: "/notify",
        variant: "primary",
        icon: Mail,
      },
      {
        id: "roadmap",
        label: "View Roadmap",
        href: "/roadmap",
        variant: "outline",
        icon: BookOpen,
      },
    ],
    suggestions: [
      {
        id: "current-features",
        title: "Current Features",
        description: "Explore what's available right now",
        href: "/features",
        icon: Search,
      },
      {
        id: "beta",
        title: "Join Beta Program",
        description: "Get early access to new features",
        href: "/beta",
        icon: Users,
      },
      {
        id: "feedback",
        title: "Share Feedback",
        description: "Help us build what you need",
        href: "/feedback",
        icon: MessageCircle,
      },
    ],
  },
};

export const RateLimited: Story = {
  args: {
    errorType: "403",
    title: "Rate Limit Exceeded",
    message: "Too many requests",
    description: "You've made too many requests in a short period. Please wait a moment before trying again.",
    errorCode: "RATE_LIMITED",
    actions: [
      {
        id: "wait",
        label: "Try Again Later",
        onClick: fn(),
        variant: "primary",
        icon: Clock,
      },
      {
        id: "upgrade",
        label: "Upgrade Plan",
        href: "/pricing",
        variant: "outline",
        icon: ArrowLeft,
      },
    ],
    suggestions: [
      {
        id: "limits",
        title: "Rate Limit Info",
        description: "Learn about our API rate limits",
        href: "/docs/rate-limits",
        icon: BookOpen,
      },
      {
        id: "optimization",
        title: "Optimize Requests",
        description: "Best practices for efficient API usage",
        href: "/docs/optimization",
        icon: Users,
      },
      {
        id: "enterprise",
        title: "Enterprise Plans",
        description: "Higher limits for business accounts",
        href: "/enterprise",
        icon: Server,
      },
    ],
  },
};

export const EmptyState: Story = {
  args: {
    errorType: "custom",
    title: "No Results Found",
    message: "We couldn't find what you're looking for",
    description: "Try adjusting your search terms or browse our available content using the suggestions below.",
    errorCode: "NO_RESULTS",
    showErrorDetails: false,
    actions: [
      {
        id: "search",
        label: "New Search",
        href: "/search",
        variant: "primary",
        icon: Search,
      },
      {
        id: "browse",
        label: "Browse All",
        href: "/browse",
        variant: "outline",
        icon: BookOpen,
      },
    ],
  },
};