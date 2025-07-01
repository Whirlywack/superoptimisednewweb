import type { Meta, StoryObj } from "@storybook/react";
import { NotificationBanner } from "./NotificationBanner";

const meta = {
  title: "Molecules/NotificationBanner",
  component: NotificationBanner,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Notification banner component for displaying alerts, messages, and status updates with dismiss functionality.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["info", "success", "warning", "error"],
      description: "Type of notification",
    },
    title: {
      control: "text",
      description: "Optional title for the notification",
    },
    message: {
      control: "text",
      description: "Main notification message",
    },
    dismissible: {
      control: "boolean",
      description: "Whether the notification can be dismissed",
    },
    onDismiss: {
      action: "dismissed",
      description: "Callback when notification is dismissed",
    },
    action: {
      control: "object",
      description: "Optional action button",
    },
    variant: {
      control: "select",
      options: ["banner", "toast", "inline"],
      description: "Visual variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
  },
} satisfies Meta<typeof NotificationBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    type: "info",
    title: "New Feature Available",
    message: "We've added dark mode support to the design system. Check out the new theme toggle in the navigation.",
    dismissible: true,
    variant: "banner",
    size: "md",
  },
};

export const Success: Story = {
  args: {
    type: "success",
    title: "Successfully Updated",
    message: "Your profile has been updated successfully. Changes may take a few minutes to appear.",
    dismissible: true,
    variant: "banner",
    size: "md",
  },
};

export const Warning: Story = {
  args: {
    type: "warning",
    title: "Maintenance Scheduled",
    message: "Scheduled maintenance will occur on Sunday, January 15th from 2:00 AM to 4:00 AM EST. Some features may be unavailable.",
    dismissible: true,
    variant: "banner",
    size: "md",
  },
};

export const Error: Story = {
  args: {
    type: "error",
    title: "Connection Error",
    message: "Unable to connect to the server. Please check your internet connection and try again.",
    dismissible: true,
    variant: "banner",
    size: "md",
  },
};

export const WithAction: Story = {
  args: {
    type: "info",
    title: "Update Available",
    message: "A new version of the application is available with bug fixes and improvements.",
    dismissible: true,
    variant: "banner",
    size: "md",
    action: {
      label: "Update Now",
      onClick: () => console.log("Update clicked"),
    },
  },
};

export const Toast: Story = {
  args: {
    type: "success",
    message: "File uploaded successfully!",
    dismissible: true,
    variant: "toast",
    size: "md",
  },
};

export const Inline: Story = {
  args: {
    type: "warning",
    message: "Please fill in all required fields before submitting.",
    dismissible: false,
    variant: "inline",
    size: "sm",
  },
};

export const NotDismissible: Story = {
  args: {
    type: "error",
    title: "Critical System Error",
    message: "A critical error has occurred. Please contact support immediately.",
    dismissible: false,
    variant: "banner",
    size: "md",
  },
};

export const Small: Story = {
  args: {
    type: "info",
    message: "Remember to save your work regularly.",
    dismissible: true,
    variant: "inline",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    type: "warning",
    title: "Important Security Update",
    message: "We've implemented new security measures to protect your account. Please review your security settings and enable two-factor authentication if you haven't already.",
    dismissible: true,
    variant: "banner",
    size: "lg",
    action: {
      label: "Review Settings",
      onClick: () => console.log("Review settings clicked"),
    },
  },
};

export const MessageOnly: Story = {
  args: {
    type: "info",
    message: "This is a simple notification without a title.",
    dismissible: true,
    variant: "banner",
    size: "md",
  },
};

export const LongMessage: Story = {
  args: {
    type: "warning",
    title: "Data Migration in Progress",
    message: "We are currently migrating your data to our new infrastructure. This process may take several hours to complete. During this time, you may experience slower performance or temporary unavailability of some features. We apologize for any inconvenience and appreciate your patience.",
    dismissible: true,
    variant: "banner",
    size: "md",
  },
};

export const CookieConsent: Story = {
  args: {
    type: "info",
    title: "Cookie Consent",
    message: "We use cookies to enhance your browsing experience and analyze our traffic. By continuing to use this site, you consent to our use of cookies.",
    dismissible: false,
    variant: "banner",
    size: "md",
    action: {
      label: "Accept All",
      onClick: () => console.log("Cookies accepted"),
    },
  },
};