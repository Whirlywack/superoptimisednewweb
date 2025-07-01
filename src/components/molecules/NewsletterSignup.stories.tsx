import type { Meta, StoryObj } from "@storybook/react";
import { NewsletterSignup } from "./NewsletterSignup";

const meta = {
  title: "Molecules/NewsletterSignup",
  component: NewsletterSignup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Newsletter signup form with multiple variants and success states.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["card", "inline", "banner"],
      description: "Visual variant of the newsletter signup",
    },
    title: {
      control: "text",
      description: "Title text",
    },
    description: {
      control: "text",
      description: "Description text",
    },
    placeholder: {
      control: "text",
      description: "Email input placeholder",
    },
    buttonText: {
      control: "text",
      description: "Submit button text",
    },
    showIcon: {
      control: "boolean",
      description: "Whether to show the mail icon",
    },
    onSubmit: {
      action: "submitted",
      description: "Callback when form is submitted",
    },
  },
} satisfies Meta<typeof NewsletterSignup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {
  args: {
    variant: "card",
    title: "Stay Updated",
    description: "Get the latest updates on my building journey and new posts.",
    placeholder: "Enter your email",
    buttonText: "Subscribe",
    showIcon: true,
  },
};

export const Inline: Story = {
  args: {
    variant: "inline",
    title: "Newsletter",
    description: "Subscribe for weekly updates",
    placeholder: "your@email.com",
    buttonText: "Join",
    showIcon: true,
  },
};

export const Banner: Story = {
  args: {
    variant: "banner",
    title: "Don't Miss Out",
    description: "Get notified when new articles are published.",
    placeholder: "Enter email address",
    buttonText: "Subscribe",
    showIcon: false,
  },
};

export const WithoutIcon: Story = {
  args: {
    variant: "card",
    title: "Email Updates",
    description: "Stay in the loop with my latest thoughts and projects.",
    placeholder: "Enter your email",
    buttonText: "Subscribe",
    showIcon: false,
  },
};

export const MinimalInline: Story = {
  args: {
    variant: "inline",
    title: "Subscribe",
    placeholder: "Email",
    buttonText: "Join",
    showIcon: false,
  },
};

export const CustomContent: Story = {
  args: {
    variant: "card",
    title: "Join the Community",
    description: "Be the first to know about new features, updates, and behind-the-scenes content from my development journey.",
    placeholder: "your.email@domain.com",
    buttonText: "Get Updates",
    showIcon: true,
  },
};

export const BannerWithoutDescription: Story = {
  args: {
    variant: "banner",
    title: "Quick Subscribe",
    placeholder: "Email address",
    buttonText: "Subscribe",
    showIcon: true,
  },
};

export const LongContent: Story = {
  args: {
    variant: "card",
    title: "Developer Newsletter Subscription",
    description: "Join thousands of developers who receive weekly insights, tutorials, and updates about modern web development, design systems, and the latest tools and technologies.",
    placeholder: "professional@email.com",
    buttonText: "Subscribe Now",
    showIcon: true,
  },
};