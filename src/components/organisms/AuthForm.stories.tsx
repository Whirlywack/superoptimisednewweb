import type { Meta, StoryObj } from "@storybook/react";
import { AuthForm } from "./AuthForm";
import { fn } from "@storybook/test";

const meta = {
  title: "Organisms/AuthForm",
  component: AuthForm,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Authentication form component supporting sign in, sign up, magic link, and password reset modes with validation and error handling.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    mode: {
      control: "select",
      options: ["signin", "signup", "magic-link", "reset-password"],
      description: "Authentication mode",
    },
    onSubmit: {
      action: "submitted",
      description: "Callback when form is submitted",
    },
    onModeChange: {
      action: "mode-changed",
      description: "Callback when mode is changed",
    },
    loading: {
      control: "boolean",
      description: "Loading state",
    },
    error: {
      control: "text",
      description: "Error message to display",
    },
    success: {
      control: "text",
      description: "Success message to display",
    },
    showSocialAuth: {
      control: "boolean",
      description: "Whether to show social authentication options",
    },
    showMagicLink: {
      control: "boolean",
      description: "Whether to show magic link option",
    },
    showPasswordToggle: {
      control: "boolean",
      description: "Whether to show password visibility toggle",
    },
    variant: {
      control: "select",
      options: ["card", "page", "modal"],
      description: "Visual variant",
    },
  },
  args: {
    onSubmit: fn(),
    onModeChange: fn(),
  },
} satisfies Meta<typeof AuthForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignIn: Story = {
  args: {
    mode: "signin",
    showMagicLink: true,
    showPasswordToggle: true,
    variant: "card",
  },
};

export const SignUp: Story = {
  args: {
    mode: "signup",
    showPasswordToggle: true,
    variant: "card",
  },
};

export const MagicLink: Story = {
  args: {
    mode: "magic-link",
    variant: "card",
  },
};

export const ResetPassword: Story = {
  args: {
    mode: "reset-password",
    variant: "card",
  },
};

export const Loading: Story = {
  args: {
    mode: "signin",
    loading: true,
    variant: "card",
  },
};

export const WithError: Story = {
  args: {
    mode: "signin",
    error: "Invalid email or password. Please try again.",
    variant: "card",
  },
};

export const WithSuccess: Story = {
  args: {
    mode: "magic-link",
    success: "Magic link sent! Check your email to sign in.",
    variant: "card",
  },
};

export const PageVariant: Story = {
  args: {
    mode: "signin",
    variant: "page",
    showMagicLink: true,
  },
  parameters: {
    layout: "fullscreen",
  },
};

export const ModalVariant: Story = {
  args: {
    mode: "signin",
    variant: "modal",
    showMagicLink: false,
  },
};

export const SignUpWithError: Story = {
  args: {
    mode: "signup",
    error: "An account with this email already exists.",
    variant: "card",
  },
};

export const MagicLinkSuccess: Story = {
  args: {
    mode: "magic-link",
    success: "Check your email for a secure sign-in link. The link will expire in 15 minutes.",
    variant: "card",
  },
};

export const ResetPasswordSuccess: Story = {
  args: {
    mode: "reset-password",
    success: "Password reset link sent! Check your email for instructions.",
    variant: "card",
  },
};

export const NoPasswordToggle: Story = {
  args: {
    mode: "signin",
    showPasswordToggle: false,
    variant: "card",
  },
};

export const NoMagicLink: Story = {
  args: {
    mode: "signin",
    showMagicLink: false,
    variant: "card",
  },
};

export const CorporateSignIn: Story = {
  args: {
    mode: "signin",
    variant: "page",
    showMagicLink: false,
    showSocialAuth: true,
  },
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
    },
  },
};

export const QuickSignUp: Story = {
  args: {
    mode: "signup",
    variant: "modal",
    showPasswordToggle: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Compact signup form suitable for modals or quick registration flows.",
      },
    },
  },
};

export const MagicLinkOnlyForm: Story = {
  args: {
    mode: "magic-link",
    variant: "card",
    showMagicLink: false, // Hide toggle since this is magic-link only
  },
  parameters: {
    docs: {
      description: {
        story: "Magic link only authentication for passwordless flows.",
      },
    },
  },
};

export const ValidationErrors: Story = {
  args: {
    mode: "signup",
    variant: "card",
  },
  parameters: {
    docs: {
      description: {
        story: "Form with validation errors displayed. Try submitting empty form to see validation in action.",
      },
    },
  },
};

export const LongFormLabels: Story = {
  args: {
    mode: "signin",
    variant: "card",
    showMagicLink: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Form with longer, more descriptive labels for better accessibility.",
      },
    },
  },
};