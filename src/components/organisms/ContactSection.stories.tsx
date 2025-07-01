import type { Meta, StoryObj } from "@storybook/react";
import { ContactSection } from "./ContactSection";
import { fn } from "@storybook/test";
import { 
  Mail, 
  MessageCircle, 
  Github, 
  Twitter, 
  Linkedin,
  Globe,
  Phone,
  MapPin,
  Calendar,
  Slack,
  Discord
} from "lucide-react";

const meta = {
  title: "Organisms/ContactSection",
  component: ContactSection,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Contact section component featuring contact methods, forms, and availability information. Perfect for contact pages and footer sections.",
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
    contactMethods: {
      control: "object",
      description: "Array of contact methods",
    },
    showForm: {
      control: "boolean",
      description: "Show contact form",
    },
    formFields: {
      control: "object",
      description: "Array of form fields",
    },
    formTitle: {
      control: "text",
      description: "Form section title",
    },
    formDescription: {
      control: "text",
      description: "Form section description",
    },
    submitText: {
      control: "text",
      description: "Submit button text",
    },
    onSubmit: {
      action: "form-submitted",
      description: "Form submit handler",
    },
    variant: {
      control: "select",
      options: ["default", "split", "form-only", "contact-only"],
      description: "Display variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Component size",
    },
    showAvailability: {
      control: "boolean",
      description: "Show availability information",
    },
  },
  args: {
    onSubmit: fn(),
  },
} satisfies Meta<typeof ContactSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultContactMethods = [
  {
    type: "email" as const,
    label: "Email",
    value: "hello@superoptimised.com",
    href: "mailto:hello@superoptimised.com",
    icon: Mail,
    description: "Best for detailed questions and collaboration inquiries",
    availability: "Usually responds within 24 hours",
  },
  {
    type: "social" as const,
    label: "GitHub",
    value: "@superoptimised",
    href: "https://github.com/superoptimised",
    icon: Github,
    description: "For technical discussions and open source collaboration",
  },
  {
    type: "social" as const,
    label: "Twitter",
    value: "@superoptimised",
    href: "https://twitter.com/superoptimised",
    icon: Twitter,
    description: "Follow our building in public journey",
  },
];

const businessContactMethods = [
  {
    type: "email" as const,
    label: "General Inquiries",
    value: "info@company.com",
    href: "mailto:info@company.com",
    icon: Mail,
    description: "For general questions and information",
    availability: "Monday - Friday, 9 AM - 5 PM EST",
  },
  {
    type: "email" as const,
    label: "Support",
    value: "support@company.com",
    href: "mailto:support@company.com",
    icon: MessageCircle,
    description: "Technical support and customer service",
    availability: "24/7 support available",
  },
  {
    type: "phone" as const,
    label: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
    icon: Phone,
    description: "For urgent matters and direct consultation",
    availability: "Monday - Friday, 9 AM - 6 PM EST",
  },
  {
    type: "form" as const,
    label: "Office Address",
    value: "123 Innovation Street, Tech City, TC 12345",
    icon: MapPin,
    description: "Visit us at our headquarters",
    availability: "Monday - Friday, 9 AM - 5 PM EST",
  },
];

const communityContactMethods = [
  {
    type: "social" as const,
    label: "Discord",
    value: "Join our server",
    href: "https://discord.gg/superoptimised",
    icon: Discord,
    description: "Real-time community chat and support",
  },
  {
    type: "social" as const,
    label: "GitHub Discussions",
    value: "Community Forum",
    href: "https://github.com/superoptimised/discussions",
    icon: Github,
    description: "Async discussions and feature requests",
  },
  {
    type: "social" as const,
    label: "Twitter",
    value: "@superoptimised",
    href: "https://twitter.com/superoptimised",
    icon: Twitter,
    description: "Updates and community highlights",
  },
];

const customFormFields = [
  { name: "name", label: "Full Name", type: "text" as const, required: true, placeholder: "John Doe" },
  { name: "email", label: "Email Address", type: "email" as const, required: true, placeholder: "john@example.com" },
  { name: "company", label: "Company", type: "text" as const, placeholder: "Your company name" },
  { name: "subject", label: "Subject", type: "text" as const, required: true, placeholder: "Partnership Inquiry" },
  { name: "message", label: "Message", type: "textarea" as const, required: true, placeholder: "Tell us about your project..." },
];

export const Default: Story = {
  args: {
    title: "Get in Touch",
    description: "Have questions about our project or want to collaborate? We'd love to hear from you! Reach out through any of the channels below.",
    contactMethods: defaultContactMethods,
    showAvailability: true,
  },
};

export const Split: Story = {
  args: {
    title: "Contact Us",
    description: "Connect with our team through multiple channels or send us a direct message using the form below.",
    contactMethods: defaultContactMethods,
    variant: "split",
    formTitle: "Send a Message",
    formDescription: "Fill out the form below and we'll get back to you as soon as possible.",
    showAvailability: true,
  },
};

export const FormOnly: Story = {
  args: {
    title: "Send Us a Message",
    description: "Have a question or want to get in touch? Fill out the form below and we'll respond promptly.",
    variant: "form-only",
    formTitle: "Contact Form",
    formDescription: "Please provide as much detail as possible to help us assist you better.",
  },
};

export const ContactOnly: Story = {
  args: {
    title: "How to Reach Us",
    description: "Multiple ways to connect with our team and community.",
    contactMethods: defaultContactMethods,
    variant: "contact-only",
    showAvailability: true,
  },
};

export const BusinessContact: Story = {
  args: {
    title: "Business Contact",
    description: "Professional contact information for partnerships, support, and business inquiries.",
    contactMethods: businessContactMethods,
    variant: "split",
    formFields: customFormFields,
    formTitle: "Business Inquiry",
    formDescription: "Tell us about your business needs and we'll connect you with the right team member.",
    submitText: "Submit Inquiry",
    showAvailability: true,
  },
};

export const CommunityContact: Story = {
  args: {
    title: "Join Our Community",
    description: "Connect with fellow developers, ask questions, and participate in our building in public journey.",
    contactMethods: communityContactMethods,
    variant: "contact-only",
  },
};

export const SupportContact: Story = {
  args: {
    title: "Need Help?",
    description: "Our support team is here to help you get the most out of our platform.",
    contactMethods: [
      {
        type: "email" as const,
        label: "Support Email",
        value: "support@superoptimised.com",
        href: "mailto:support@superoptimised.com",
        icon: MessageCircle,
        description: "For technical issues and product questions",
        availability: "24-48 hour response time",
      },
      {
        type: "form" as const,
        label: "Help Center",
        value: "Browse documentation and guides",
        href: "/help",
        icon: Globe,
        description: "Self-service resources and tutorials",
      },
    ],
    formFields: [
      { name: "email", label: "Email", type: "email" as const, required: true },
      { name: "category", label: "Issue Category", type: "text" as const, placeholder: "Bug report, Feature request, etc." },
      { name: "description", label: "Description", type: "textarea" as const, required: true, placeholder: "Describe your issue in detail..." },
    ],
    formTitle: "Submit Support Ticket",
    submitText: "Submit Ticket",
    variant: "split",
  },
};

export const MinimalContact: Story = {
  args: {
    contactMethods: [
      {
        type: "email" as const,
        label: "Email",
        value: "hello@example.com",
        href: "mailto:hello@example.com",
        icon: Mail,
      },
      {
        type: "social" as const,
        label: "GitHub",
        value: "@username",
        href: "https://github.com/username",
        icon: Github,
      },
    ],
    variant: "contact-only",
    size: "sm",
  },
};

export const SmallSize: Story = {
  args: {
    title: "Quick Contact",
    contactMethods: defaultContactMethods.slice(0, 2),
    size: "sm",
    variant: "split",
  },
};

export const LargeSize: Story = {
  args: {
    title: "Let's Build Something Amazing Together",
    description: "Whether you're interested in collaborating, have questions about our process, or want to join our community of builders, we're excited to connect with you.",
    contactMethods: businessContactMethods,
    variant: "split",
    size: "lg",
    formTitle: "Start a Conversation",
    formDescription: "Tell us about your project, ideas, or how we can help you build in public.",
    showAvailability: true,
  },
};

export const WithScheduling: Story = {
  args: {
    title: "Schedule a Meeting",
    description: "Book a time to discuss your project or learn more about our approach to building in public.",
    contactMethods: [
      {
        type: "form" as const,
        label: "Calendar Booking",
        value: "Schedule a 30-minute call",
        href: "https://calendly.com/superoptimised",
        icon: Calendar,
        description: "Book a convenient time for a video call",
        availability: "Monday - Friday, 10 AM - 4 PM EST",
      },
      ...defaultContactMethods,
    ],
    variant: "contact-only",
    showAvailability: true,
  },
};

export const DeveloperFocus: Story = {
  args: {
    title: "Developer Relations",
    description: "Connect with our developer community and contribute to our open source projects.",
    contactMethods: [
      {
        type: "social" as const,
        label: "GitHub",
        value: "Contribute to our projects",
        href: "https://github.com/superoptimised",
        icon: Github,
        description: "Submit issues, PRs, and join discussions",
      },
      {
        type: "social" as const,
        label: "Developer Discord",
        value: "Join our developer community",
        href: "https://discord.gg/dev-superoptimised",
        icon: Discord,
        description: "Real-time chat with other developers",
      },
      {
        type: "email" as const,
        label: "Developer Relations",
        value: "devrel@superoptimised.com",
        href: "mailto:devrel@superoptimised.com",
        icon: Mail,
        description: "For speaking opportunities and partnerships",
      },
    ],
    formFields: [
      { name: "name", label: "Name", type: "text" as const, required: true },
      { name: "email", label: "Email", type: "email" as const, required: true },
      { name: "github", label: "GitHub Username", type: "text" as const, placeholder: "@username" },
      { name: "project", label: "Project/Topic", type: "text" as const, placeholder: "What are you working on?" },
      { name: "message", label: "Message", type: "textarea" as const, required: true },
    ],
    variant: "split",
    formTitle: "Developer Inquiry",
    formDescription: "Tell us about your development project or how you'd like to contribute.",
  },
  parameters: {
    docs: {
      description: {
        story: "Contact section tailored for developer relations and community engagement.",
      },
    },
  },
};

export const InternationalContact: Story = {
  args: {
    title: "Global Contact",
    description: "We're a distributed team serving clients worldwide. Choose the best way to reach us.",
    contactMethods: [
      {
        type: "email" as const,
        label: "Americas",
        value: "americas@company.com",
        href: "mailto:americas@company.com",
        icon: Mail,
        availability: "Monday - Friday, 9 AM - 6 PM EST",
      },
      {
        type: "email" as const,
        label: "Europe",
        value: "europe@company.com", 
        href: "mailto:europe@company.com",
        icon: Mail,
        availability: "Monday - Friday, 9 AM - 6 PM CET",
      },
      {
        type: "email" as const,
        label: "Asia-Pacific",
        value: "apac@company.com",
        href: "mailto:apac@company.com", 
        icon: Mail,
        availability: "Monday - Friday, 9 AM - 6 PM JST",
      },
    ],
    variant: "split",
    showAvailability: true,
  },
};