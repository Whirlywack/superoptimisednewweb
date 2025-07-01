import type { Meta, StoryObj } from "@storybook/react";
import { MagicLinkForm } from "./MagicLinkForm";
import { fn } from "@storybook/test";
import { 
  Lock, 
  Shield, 
  Zap, 
  Smartphone,
  Globe,
  Users,
  Sparkles,
  Star,
  TrendingUp,
  CheckCircle,
  Mail,
  Github,
  Twitter
} from "lucide-react";

const meta = {
  title: "Templates/MagicLinkForm",
  component: MagicLinkForm,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Magic link authentication form template for passwordless sign-in. Features email validation, loading states, success confirmation, and educational content about magic link benefits.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Form title",
    },
    subtitle: {
      control: "text",
      description: "Form subtitle",
    },
    description: {
      control: "text",
      description: "Form description text",
    },
    emailPlaceholder: {
      control: "text",
      description: "Email input placeholder",
    },
    submitButtonText: {
      control: "text",
      description: "Submit button text",
    },
    successTitle: {
      control: "text",
      description: "Success state title",
    },
    successMessage: {
      control: "text",
      description: "Success state message",
    },
    errorMessage: {
      control: "text",
      description: "Error state message",
    },
    resendText: {
      control: "text",
      description: "Resend link text",
    },
    backToFormText: {
      control: "text",
      description: "Back to form button text",
    },
    showBenefits: {
      control: "boolean",
      description: "Show benefits section",
    },
    showSecurity: {
      control: "boolean",
      description: "Show security information",
    },
    benefits: {
      control: "object",
      description: "Array of benefits to display",
    },
    isLoading: {
      control: "boolean",
      description: "Loading state",
    },
    isSuccess: {
      control: "boolean",
      description: "Success state",
    },
    isError: {
      control: "boolean",
      description: "Error state",
    },
    submittedEmail: {
      control: "text",
      description: "Email that was submitted (for success state)",
    },
    brandName: {
      control: "text",
      description: "Brand name to display",
    },
    supportEmail: {
      control: "text",
      description: "Support email address",
    },
    onSubmit: {
      action: "form-submitted",
      description: "Form submit handler",
    },
    onResend: {
      action: "resend-clicked",
      description: "Resend link handler",
    },
    onBackToForm: {
      action: "back-to-form-clicked",
      description: "Back to form handler",
    },
  },
  args: {
    onSubmit: fn(),
    onResend: fn(),
    onBackToForm: fn(),
  },
} satisfies Meta<typeof MagicLinkForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultBenefits = [
  {
    id: "passwordless",
    title: "No Passwords",
    description: "Sign in securely without remembering complex passwords or dealing with password resets",
    icon: Lock,
  },
  {
    id: "secure",
    title: "Enhanced Security",
    description: "Magic links are more secure than traditional passwords and reduce phishing risks",
    icon: Shield,
  },
  {
    id: "instant",
    title: "Instant Access",
    description: "Get signed in quickly with just one click from your email",
    icon: Zap,
  },
];

const mobileBenefits = [
  {
    id: "mobile-friendly",
    title: "Mobile Optimized",
    description: "Perfect for mobile devices - no typing complex passwords on small screens",
    icon: Smartphone,
  },
  {
    id: "universal",
    title: "Works Everywhere",
    description: "Access your account from any device or browser without sync issues",
    icon: Globe,
  },
  {
    id: "simple",
    title: "Simple & Fast",
    description: "One email, one click, and you're in. No memorization required",
    icon: Sparkles,
  },
];

const enterpriseBenefits = [
  {
    id: "security",
    title: "Enterprise Security",
    description: "SOC 2 compliant authentication with advanced threat protection",
    icon: Shield,
  },
  {
    id: "productivity",
    title: "Team Productivity",
    description: "Reduce IT helpdesk tickets and password-related support requests",
    icon: Users,
  },
  {
    id: "compliance",
    title: "Compliance Ready",
    description: "Meet security requirements without compromising user experience",
    icon: Star,
  },
];

export const Default: Story = {
  args: {},
};

export const LoadingState: Story = {
  args: {
    isLoading: true,
  },
};

export const ErrorState: Story = {
  args: {
    isError: true,
    errorMessage: "Unable to send magic link. Please check your email address and try again.",
  },
};

export const SuccessState: Story = {
  args: {
    isSuccess: true,
    submittedEmail: "user@example.com",
  },
};

export const WithoutBenefits: Story = {
  args: {
    showBenefits: false,
  },
};

export const WithoutSecurity: Story = {
  args: {
    showSecurity: false,
  },
};

export const MinimalLayout: Story = {
  args: {
    showBenefits: false,
    showSecurity: false,
    title: "Sign In",
    subtitle: "Enter your email to continue",
    description: "We'll send you a secure sign-in link.",
  },
};

export const CustomBenefits: Story = {
  args: {
    benefits: mobileBenefits,
    title: "Mobile-First Sign In",
    subtitle: "Designed for the way you actually use your phone",
    description: "Experience the future of mobile authentication with our magic link system designed specifically for mobile users.",
  },
};

export const EnterpriseFocus: Story = {
  args: {
    title: "Enterprise SSO Portal",
    subtitle: "Secure access for your organization",
    description: "Enterprise-grade authentication with magic links. Your IT team will love the security, your users will love the simplicity.",
    benefits: enterpriseBenefits,
    brandName: "Enterprise Portal",
    submitButtonText: "Send Secure Access Link",
    emailPlaceholder: "Enter your work email address",
  },
};

export const DeveloperPortal: Story = {
  args: {
    title: "Developer Portal Access",
    subtitle: "Access your developer dashboard",
    description: "Sign in to access your API keys, documentation, usage analytics, and developer tools. Perfect for developers who value security and simplicity.",
    brandName: "DevPortal",
    submitButtonText: "Access Developer Tools",
    benefits: [
      {
        id: "api-access",
        title: "Secure API Access",
        description: "Protect your API keys and sensitive development resources with passwordless authentication",
        icon: Lock,
      },
      {
        id: "fast-iteration",
        title: "Fast Development",
        description: "Spend time building, not dealing with password resets and authentication issues",
        icon: Zap,
      },
      {
        id: "team-friendly",
        title: "Team Ready",
        description: "Easy for team members to access shared resources without password sharing",
        icon: Users,
      },
    ],
  },
};

export const SaaSApplication: Story = {
  args: {
    title: "Welcome to ProjectFlow",
    subtitle: "Streamline your project management",
    description: "Join thousands of teams using ProjectFlow to manage their projects more effectively. No passwords needed - just secure, instant access.",
    brandName: "ProjectFlow",
    submitButtonText: "Start Free Trial",
    emailPlaceholder: "Enter your business email",
    benefits: [
      {
        id: "trial",
        title: "14-Day Free Trial",
        description: "Full access to all features for 14 days, no credit card required",
        icon: Star,
      },
      {
        id: "secure",
        title: "Bank-Level Security",
        description: "Your project data is protected with enterprise-grade security",
        icon: Shield,
      },
      {
        id: "instant",
        title: "Setup in Minutes",
        description: "Get your team up and running in under 5 minutes",
        icon: Zap,
      },
    ],
  },
};

export const CommunityPlatform: Story = {
  args: {
    title: "Join the Developer Community",
    subtitle: "Connect with fellow developers worldwide",
    description: "Access exclusive content, participate in discussions, and connect with a global community of developers building amazing things.",
    brandName: "DevCommunity",
    submitButtonText: "Join Community",
    benefits: [
      {
        id: "community",
        title: "Global Network",
        description: "Connect with over 50,000 developers from around the world",
        icon: Users,
      },
      {
        id: "content",
        title: "Exclusive Content",
        description: "Access tutorials, case studies, and insights not available anywhere else",
        icon: Star,
      },
      {
        id: "opportunities",
        title: "Career Growth",
        description: "Discover job opportunities and collaboration projects within the community",
        icon: TrendingUp,
      },
    ],
  },
};

export const EducationalPlatform: Story = {
  args: {
    title: "Continue Your Learning Journey",
    subtitle: "Access your courses and progress",
    description: "Sign in to access your personalized learning dashboard, track your progress, and continue building your skills with our comprehensive curriculum.",
    brandName: "CodeAcademy Pro",
    submitButtonText: "Access My Courses",
    emailPlaceholder: "Enter your student email",
    benefits: [
      {
        id: "progress",
        title: "Track Progress",
        description: "See your learning progress across all courses and skill tracks",
        icon: TrendingUp,
      },
      {
        id: "personalized",
        title: "Personalized Learning",
        description: "Get course recommendations based on your interests and skill level",
        icon: Star,
      },
      {
        id: "certificates",
        title: "Earn Certificates",
        description: "Complete courses and earn industry-recognized certificates",
        icon: CheckCircle,
      },
    ],
  },
};

export const StartupLaunch: Story = {
  args: {
    title: "Early Access Portal",
    subtitle: "Be among the first to experience our platform",
    description: "You're invited to try our platform before the public launch. Join a select group of early adopters helping shape the future of our product.",
    brandName: "StartupName",
    submitButtonText: "Claim Early Access",
    emailPlaceholder: "Enter your email for exclusive access",
    successTitle: "Welcome to Early Access!",
    successMessage: "You're now part of our exclusive early access program. Check your email for your secure sign-in link and welcome guide.",
    benefits: [
      {
        id: "exclusive",
        title: "Exclusive Access",
        description: "Be the first to use features before they're publicly available",
        icon: Star,
      },
      {
        id: "influence",
        title: "Shape the Product",
        description: "Your feedback directly influences our product development roadmap",
        icon: Users,
      },
      {
        id: "lifetime",
        title: "Lifetime Benefits",
        description: "Lock in special pricing and features as a founding member",
        icon: Sparkles,
      },
    ],
  },
};

export const FreelancerPortal: Story = {
  args: {
    title: "Freelancer Dashboard",
    subtitle: "Manage your freelance business",
    description: "Access your client projects, track time, manage invoices, and grow your freelance business with our comprehensive management platform.",
    brandName: "FreelanceHub",
    submitButtonText: "Access Dashboard",
    benefits: [
      {
        id: "projects",
        title: "Project Management",
        description: "Keep all your client projects organized and on track",
        icon: Sparkles,
      },
      {
        id: "invoicing",
        title: "Smart Invoicing",
        description: "Generate professional invoices and track payments automatically",
        icon: Star,
      },
      {
        id: "growth",
        title: "Business Growth",
        description: "Analytics and insights to help grow your freelance business",
        icon: TrendingUp,
      },
    ],
  },
};

export const CustomError: Story = {
  args: {
    isError: true,
    errorMessage: "This email domain is not authorized for access. Please contact your administrator or use a different email address.",
    title: "Restricted Access",
    subtitle: "This portal requires authorized access",
  },
};

export const LongSuccessFlow: Story = {
  args: {
    isSuccess: true,
    submittedEmail: "developer@company.com",
    successTitle: "Magic Link Sent Successfully",
    successMessage: "We've sent a secure sign-in link to your email address. The link will expire in 15 minutes for security. If you don't see the email, check your spam folder or contact support.",
    resendText: "Need help or didn't receive the email?",
  },
};