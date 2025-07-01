import type { Meta, StoryObj } from "@storybook/react";
import { ContactForm } from "./ContactForm";
import { fn } from "@storybook/test";
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Github, 
  Twitter, 
  Linkedin, 
  Facebook,
  Instagram,
  Youtube,
  HelpCircle,
  Code,
  CreditCard,
  Briefcase,
  Heart,
  Bug,
  Headphones,
  FileText,
  Users,
  Globe,
  Lightbulb,
  Shield,
  Zap
} from "lucide-react";

const meta = {
  title: "Templates/ContactForm",
  component: ContactForm,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Contact form template for customer inquiries with customizable fields, contact methods, business hours, and support categories. Features form validation and success states.",
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
    submitButtonText: {
      control: "text",
      description: "Submit button text",
    },
    showContactMethods: {
      control: "boolean",
      description: "Show contact methods section",
    },
    showBusinessHours: {
      control: "boolean",
      description: "Show business hours section",
    },
    showSocialLinks: {
      control: "boolean",
      description: "Show social links section",
    },
    showSupportCategories: {
      control: "boolean",
      description: "Show support categories section",
    },
    contactMethods: {
      control: "object",
      description: "Array of contact methods",
    },
    fields: {
      control: "object",
      description: "Array of form fields",
    },
    businessHours: {
      control: "object",
      description: "Array of business hours",
    },
    socialLinks: {
      control: "object",
      description: "Array of social media links",
    },
    companyInfo: {
      control: "object",
      description: "Company information object",
    },
    supportCategories: {
      control: "object",
      description: "Array of support categories",
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
    onSubmit: {
      action: "form-submitted",
      description: "Form submit handler",
    },
    onMethodClick: {
      action: "contact-method-clicked",
      description: "Contact method click handler",
    },
  },
  args: {
    onSubmit: fn(),
    onMethodClick: fn(),
  },
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultContactMethods = [
  {
    id: "email",
    type: "email" as const,
    label: "Email Us",
    value: "hello@superoptimised.com",
    href: "mailto:hello@superoptimised.com",
    icon: Mail,
    description: "Send us an email anytime",
    available: true,
  },
  {
    id: "phone",
    type: "phone" as const,
    label: "Call Us",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
    icon: Phone,
    description: "Monday to Friday, 9AM-6PM",
    available: true,
    hours: "9AM-6PM PST",
  },
  {
    id: "chat",
    type: "chat" as const,
    label: "Live Chat",
    value: "Available now",
    icon: MessageSquare,
    description: "Chat with our support team",
    available: true,
  },
];

const defaultSocialLinks = [
  { platform: "Twitter", url: "https://twitter.com/company", icon: Twitter },
  { platform: "GitHub", url: "https://github.com/company", icon: Github },
  { platform: "LinkedIn", url: "https://linkedin.com/company/company", icon: Linkedin },
];

const defaultBusinessHours = [
  { day: "Monday", hours: "9:00 AM - 6:00 PM", isToday: false },
  { day: "Tuesday", hours: "9:00 AM - 6:00 PM", isToday: false },
  { day: "Wednesday", hours: "9:00 AM - 6:00 PM", isToday: true },
  { day: "Thursday", hours: "9:00 AM - 6:00 PM", isToday: false },
  { day: "Friday", hours: "9:00 AM - 6:00 PM", isToday: false },
  { day: "Saturday", hours: "10:00 AM - 4:00 PM", isToday: false },
  { day: "Sunday", hours: "Closed", isToday: false },
];

const supportCategories = [
  {
    id: "general",
    title: "General Inquiry",
    description: "Questions about our services or general information",
    icon: HelpCircle,
  },
  {
    id: "technical",
    title: "Technical Support",
    description: "Help with technical issues or troubleshooting",
    icon: Code,
  },
  {
    id: "billing",
    title: "Billing & Sales",
    description: "Questions about pricing, billing, or sales",
    icon: CreditCard,
  },
  {
    id: "partnership",
    title: "Partnership",
    description: "Interested in partnering or collaboration",
    icon: Briefcase,
  },
  {
    id: "feedback",
    title: "Feedback",
    description: "Share your thoughts or suggestions",
    icon: Heart,
  },
  {
    id: "bug",
    title: "Bug Report",
    description: "Report a bug or technical issue",
    icon: Bug,
  },
];

export const Default: Story = {
  args: {},
};

export const WithSupportCategories: Story = {
  args: {
    showSupportCategories: true,
    supportCategories,
  },
};

export const LoadingState: Story = {
  args: {
    isLoading: true,
  },
};

export const ErrorState: Story = {
  args: {
    isError: true,
    errorMessage: "Unable to send your message at this time. Please try again later or contact us directly.",
  },
};

export const SuccessState: Story = {
  args: {
    isSuccess: true,
  },
};

export const MinimalContact: Story = {
  args: {
    title: "Contact Us",
    subtitle: "Send us a message",
    description: "We'll get back to you as soon as possible.",
    showBusinessHours: false,
    showSocialLinks: false,
    contactMethods: [
      {
        id: "email",
        type: "email" as const,
        label: "Email",
        value: "contact@company.com",
        href: "mailto:contact@company.com",
        icon: Mail,
        available: true,
      },
    ],
  },
};

export const TechnicalSupport: Story = {
  args: {
    title: "Technical Support",
    subtitle: "Need help with our platform?",
    description: "Our technical team is here to help you resolve any issues or answer questions about our platform.",
    showSupportCategories: true,
    supportCategories: [
      {
        id: "bug",
        title: "Bug Report",
        description: "Report a technical issue or bug",
        icon: Bug,
      },
      {
        id: "api",
        title: "API Support",
        description: "Questions about API integration",
        icon: Code,
      },
      {
        id: "account",
        title: "Account Issues",
        description: "Problems with your account or login",
        icon: Users,
      },
      {
        id: "performance",
        title: "Performance Issues",
        description: "Platform speed or performance problems",
        icon: Zap,
      },
    ],
    contactMethods: [
      {
        id: "support",
        type: "email" as const,
        label: "Technical Support",
        value: "support@company.com",
        href: "mailto:support@company.com",
        icon: Headphones,
        description: "Priority support for technical issues",
        available: true,
      },
      {
        id: "chat",
        type: "chat" as const,
        label: "Live Chat",
        value: "Available 24/7",
        icon: MessageSquare,
        description: "Instant help for urgent issues",
        available: true,
      },
    ],
  },
};

export const SalesInquiry: Story = {
  args: {
    title: "Sales Inquiry",
    subtitle: "Interested in our solutions?",
    description: "Get in touch with our sales team to learn more about our pricing, features, and how we can help your business grow.",
    showSupportCategories: true,
    supportCategories: [
      {
        id: "pricing",
        title: "Pricing Information",
        description: "Learn about our pricing plans and options",
        icon: CreditCard,
      },
      {
        id: "demo",
        title: "Request Demo",
        description: "Schedule a personalized product demonstration",
        icon: FileText,
      },
      {
        id: "enterprise",
        title: "Enterprise Solutions",
        description: "Custom solutions for large organizations",
        icon: Briefcase,
      },
      {
        id: "migration",
        title: "Migration Help",
        description: "Assistance with migrating from other platforms",
        icon: Globe,
      },
    ],
    contactMethods: [
      {
        id: "sales",
        type: "email" as const,
        label: "Sales Team",
        value: "sales@company.com",
        href: "mailto:sales@company.com",
        icon: Mail,
        description: "Get a quote or schedule a call",
        available: true,
      },
      {
        id: "phone",
        type: "phone" as const,
        label: "Sales Hotline",
        value: "+1 (555) 987-6543",
        href: "tel:+15559876543",
        icon: Phone,
        description: "Speak with a sales representative",
        available: true,
        hours: "8AM-8PM PST",
      },
    ],
    fields: [
      {
        id: "company",
        name: "company",
        label: "Company Name",
        type: "text" as const,
        placeholder: "Your company name",
        required: true,
      },
      {
        id: "name",
        name: "name",
        label: "Full Name",
        type: "text" as const,
        placeholder: "Your full name",
        required: true,
      },
      {
        id: "email",
        name: "email",
        label: "Work Email",
        type: "email" as const,
        placeholder: "Your work email address",
        required: true,
      },
      {
        id: "phone",
        name: "phone",
        label: "Phone Number",
        type: "tel" as const,
        placeholder: "Your phone number",
        required: false,
      },
      {
        id: "team_size",
        name: "team_size",
        label: "Team Size",
        type: "select" as const,
        required: false,
        options: [
          { value: "1-10", label: "1-10 employees" },
          { value: "11-50", label: "11-50 employees" },
          { value: "51-200", label: "51-200 employees" },
          { value: "201-1000", label: "201-1000 employees" },
          { value: "1000+", label: "1000+ employees" },
        ],
      },
      {
        id: "message",
        name: "message",
        label: "Tell us about your needs",
        type: "textarea" as const,
        placeholder: "What are you looking for? Any specific requirements or questions?",
        required: true,
      },
    ],
  },
};

export const CustomerFeedback: Story = {
  args: {
    title: "Share Your Feedback",
    subtitle: "Help us improve",
    description: "Your feedback is invaluable to us. Let us know how we're doing and how we can make our platform better for you.",
    showSupportCategories: true,
    supportCategories: [
      {
        id: "feature_request",
        title: "Feature Request",
        description: "Suggest new features or improvements",
        icon: Lightbulb,
      },
      {
        id: "user_experience",
        title: "User Experience",
        description: "Feedback about usability and design",
        icon: Heart,
      },
      {
        id: "performance",
        title: "Performance Feedback",
        description: "Comments about speed and reliability",
        icon: Zap,
      },
      {
        id: "general_feedback",
        title: "General Feedback",
        description: "Any other thoughts or suggestions",
        icon: MessageSquare,
      },
    ],
    fields: [
      {
        id: "name",
        name: "name",
        label: "Name (optional)",
        type: "text" as const,
        placeholder: "Your name",
        required: false,
      },
      {
        id: "email",
        name: "email",
        label: "Email (optional)",
        type: "email" as const,
        placeholder: "Your email address",
        required: false,
      },
      {
        id: "rating",
        name: "rating",
        label: "Overall Rating",
        type: "select" as const,
        required: true,
        options: [
          { value: "5", label: "5 - Excellent" },
          { value: "4", label: "4 - Good" },
          { value: "3", label: "3 - Average" },
          { value: "2", label: "2 - Poor" },
          { value: "1", label: "1 - Very Poor" },
        ],
      },
      {
        id: "feedback",
        name: "feedback",
        label: "Your Feedback",
        type: "textarea" as const,
        placeholder: "Tell us what you think...",
        required: true,
      },
    ],
    submitButtonText: "Submit Feedback",
    showBusinessHours: false,
  },
};

export const PartnershipInquiry: Story = {
  args: {
    title: "Partnership Opportunities",
    subtitle: "Let's work together",
    description: "Interested in partnering with us? We're always looking for strategic partnerships that create mutual value.",
    showSupportCategories: true,
    supportCategories: [
      {
        id: "technology",
        title: "Technology Partnership",
        description: "Integration and technical partnerships",
        icon: Code,
      },
      {
        id: "reseller",
        title: "Reseller Program",
        description: "Become a reseller or channel partner",
        icon: Briefcase,
      },
      {
        id: "integration",
        title: "Integration Partnership",
        description: "Build integrations with our platform",
        icon: Globe,
      },
      {
        id: "marketing",
        title: "Marketing Partnership",
        description: "Joint marketing and promotional opportunities",
        icon: Heart,
      },
    ],
    contactMethods: [
      {
        id: "partnerships",
        type: "email" as const,
        label: "Partnership Team",
        value: "partnerships@company.com",
        href: "mailto:partnerships@company.com",
        icon: Mail,
        description: "Reach out to our partnership team",
        available: true,
      },
    ],
    fields: [
      {
        id: "company",
        name: "company",
        label: "Company Name",
        type: "text" as const,
        placeholder: "Your company name",
        required: true,
      },
      {
        id: "website",
        name: "website",
        label: "Company Website",
        type: "text" as const,
        placeholder: "https://yourcompany.com",
        required: false,
      },
      {
        id: "name",
        name: "name",
        label: "Contact Person",
        type: "text" as const,
        placeholder: "Your full name",
        required: true,
      },
      {
        id: "title",
        name: "title",
        label: "Job Title",
        type: "text" as const,
        placeholder: "Your job title",
        required: false,
      },
      {
        id: "email",
        name: "email",
        label: "Business Email",
        type: "email" as const,
        placeholder: "Your business email",
        required: true,
      },
      {
        id: "proposal",
        name: "proposal",
        label: "Partnership Proposal",
        type: "textarea" as const,
        placeholder: "Describe your partnership idea, what you can offer, and what you're looking for...",
        required: true,
      },
    ],
  },
};

export const ExtendedBusinessHours: Story = {
  args: {
    businessHours: [
      { day: "Monday", hours: "6:00 AM - 10:00 PM", isToday: false },
      { day: "Tuesday", hours: "6:00 AM - 10:00 PM", isToday: false },
      { day: "Wednesday", hours: "6:00 AM - 10:00 PM", isToday: true },
      { day: "Thursday", hours: "6:00 AM - 10:00 PM", isToday: false },
      { day: "Friday", hours: "6:00 AM - 10:00 PM", isToday: false },
      { day: "Saturday", hours: "8:00 AM - 8:00 PM", isToday: false },
      { day: "Sunday", hours: "8:00 AM - 6:00 PM", isToday: false },
    ],
    contactMethods: [
      {
        id: "phone_us",
        type: "phone" as const,
        label: "Call Us",
        value: "+1 (555) 123-4567",
        href: "tel:+15551234567",
        icon: Phone,
        description: "6AM-10PM weekdays, 8AM-8PM weekends",
        available: true,
        hours: "Extended hours available",
      },
      {
        id: "emergency",
        type: "phone" as const,
        label: "Emergency Line",
        value: "+1 (555) 911-HELP",
        href: "tel:+15559114357",
        icon: Phone,
        description: "24/7 emergency support",
        available: true,
        hours: "24/7",
      },
      {
        id: "email_us",
        type: "email" as const,
        label: "Email Support",
        value: "support@company.com",
        href: "mailto:support@company.com",
        icon: Mail,
        description: "Response within 2 hours",
        available: true,
      },
    ],
  },
};

export const MultipleContactMethods: Story = {
  args: {
    contactMethods: [
      {
        id: "general_email",
        type: "email" as const,
        label: "General Inquiries",
        value: "hello@company.com",
        href: "mailto:hello@company.com",
        icon: Mail,
        description: "For general questions and information",
        available: true,
      },
      {
        id: "support_email",
        type: "email" as const,
        label: "Technical Support",
        value: "support@company.com",
        href: "mailto:support@company.com",
        icon: Headphones,
        description: "For technical issues and bugs",
        available: true,
      },
      {
        id: "sales_email",
        type: "email" as const,
        label: "Sales Team",
        value: "sales@company.com",
        href: "mailto:sales@company.com",
        icon: CreditCard,
        description: "For pricing and sales inquiries",
        available: true,
      },
      {
        id: "main_phone",
        type: "phone" as const,
        label: "Main Office",
        value: "+1 (555) 123-4567",
        href: "tel:+15551234567",
        icon: Phone,
        description: "Monday to Friday, 9AM-6PM PST",
        available: true,
        hours: "9AM-6PM PST",
      },
      {
        id: "sales_phone",
        type: "phone" as const,
        label: "Sales Hotline",
        value: "+1 (555) 987-6543",
        href: "tel:+15559876543",
        icon: Phone,
        description: "Monday to Friday, 8AM-8PM PST",
        available: true,
        hours: "8AM-8PM PST",
      },
      {
        id: "address",
        type: "address" as const,
        label: "Visit Our Office",
        value: "123 Tech Street, San Francisco, CA 94105",
        icon: MapPin,
        description: "Open to visitors by appointment",
        available: true,
      },
    ],
  },
};

export const SocialMediaFocus: Story = {
  args: {
    socialLinks: [
      { platform: "Twitter", url: "https://twitter.com/company", icon: Twitter },
      { platform: "GitHub", url: "https://github.com/company", icon: Github },
      { platform: "LinkedIn", url: "https://linkedin.com/company/company", icon: Linkedin },
      { platform: "Facebook", url: "https://facebook.com/company", icon: Facebook },
      { platform: "Instagram", url: "https://instagram.com/company", icon: Instagram },
      { platform: "YouTube", url: "https://youtube.com/company", icon: Youtube },
    ],
    companyInfo: {
      name: "Social Tech Company",
      address: "123 Social Media Ave, Digital City, CA 90210",
      phone: "+1 (555) 123-4567",
      email: "hello@socialtech.com",
      website: "https://socialtech.com",
    },
  },
};

export const StartupContact: Story = {
  args: {
    title: "Join Our Journey",
    subtitle: "Building the future together",
    description: "We're a fast-growing startup changing the way people work. Whether you're interested in joining our team, partnering with us, or just want to say hi, we'd love to hear from you!",
    contactMethods: [
      {
        id: "founders",
        type: "email" as const,
        label: "Reach the Founders",
        value: "founders@startup.com",
        href: "mailto:founders@startup.com",
        icon: Mail,
        description: "Direct line to our founding team",
        available: true,
      },
      {
        id: "jobs",
        type: "email" as const,
        label: "Join Our Team",
        value: "jobs@startup.com",
        href: "mailto:jobs@startup.com",
        icon: Users,
        description: "Interested in working with us?",
        available: true,
      },
    ],
    showBusinessHours: false,
    socialLinks: [
      { platform: "Twitter", url: "https://twitter.com/startup", icon: Twitter },
      { platform: "LinkedIn", url: "https://linkedin.com/company/startup", icon: Linkedin },
    ],
  },
};

export const EnterpriseContact: Story = {
  args: {
    title: "Enterprise Solutions",
    subtitle: "Scaling with the largest organizations",
    description: "Our enterprise team specializes in helping large organizations implement and scale our platform. Get white-glove support and custom solutions tailored to your needs.",
    showSupportCategories: true,
    supportCategories: [
      {
        id: "implementation",
        title: "Implementation",
        description: "Help with enterprise deployment and setup",
        icon: Code,
      },
      {
        id: "security",
        title: "Security & Compliance",
        description: "Security assessments and compliance questions",
        icon: Shield,
      },
      {
        id: "training",
        title: "Training & Onboarding",
        description: "Team training and change management",
        icon: Users,
      },
      {
        id: "custom",
        title: "Custom Development",
        description: "Bespoke features and integrations",
        icon: Code,
      },
    ],
    contactMethods: [
      {
        id: "enterprise",
        type: "email" as const,
        label: "Enterprise Team",
        value: "enterprise@company.com",
        href: "mailto:enterprise@company.com",
        icon: Briefcase,
        description: "Dedicated enterprise support",
        available: true,
      },
      {
        id: "enterprise_phone",
        type: "phone" as const,
        label: "Enterprise Hotline",
        value: "+1 (555) 888-0000",
        href: "tel:+15558880000",
        icon: Phone,
        description: "Priority line for enterprise customers",
        available: true,
        hours: "24/7 for enterprise customers",
      },
    ],
    companyInfo: {
      name: "Enterprise Solutions Inc.",
      address: "456 Corporate Blvd, Business District, NY 10001",
      phone: "+1 (555) 888-0000",
      email: "enterprise@company.com",
      website: "https://enterprise.company.com",
    },
  },
};