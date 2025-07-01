import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Toast, ToastProvider, useToast } from "./Toast";
import { Button } from "@/components/ui/button";
import { Heart, Download } from "lucide-react";

const meta: Meta = {
  title: "Design System/Molecules/Toast",
  component: Toast,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Toast notification components for displaying temporary messages to users. Includes a provider for managing multiple toasts and auto-dismiss functionality.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "error", "info"],
    },
    title: {
      control: "text",
    },
    description: {
      control: "text",
    },
    closable: {
      control: "boolean",
    },
    duration: {
      control: "number",
    },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};

export default meta;

type ToastStory = StoryObj<typeof Toast>;

// Basic Toast Stories
export const ToastDefault: ToastStory = {
  render: (args) => <Toast {...args} />,
  args: {
    title: "Notification",
    description: "This is a default toast notification.",
  },
};

export const ToastVariants: ToastStory = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <Toast
        variant="default"
        title="Default"
        description="This is a default notification."
      />
      <Toast
        variant="success"
        title="Success"
        description="Your changes have been saved successfully."
      />
      <Toast
        variant="warning"
        title="Warning"
        description="Please review your input before continuing."
      />
      <Toast
        variant="error"
        title="Error"
        description="Something went wrong. Please try again."
      />
      <Toast
        variant="info"
        title="Information"
        description="Here's some helpful information for you."
      />
    </div>
  ),
};

export const ToastWithActions: ToastStory = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <Toast
        variant="success"
        title="File uploaded"
        description="Your file has been uploaded successfully."
        action={
          <Button size="sm" variant="outline">
            View file
          </Button>
        }
      />
      <Toast
        variant="error"
        title="Upload failed"
        description="There was an error uploading your file."
        action={
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Retry
            </Button>
            <Button size="sm" variant="ghost">
              Cancel
            </Button>
          </div>
        }
      />
    </div>
  ),
};

export const ToastCustomIcon: ToastStory = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <Toast
        title="Liked!"
        description="You liked this post."
        icon={<Heart className="h-5 w-5 text-warm-gray" />}
      />
      <Toast
        variant="info"
        title="Download starting"
        description="Your download will begin shortly."
        icon={<Download className="h-5 w-5" />}
      />
    </div>
  ),
};

export const ToastTitleOnly: ToastStory = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <Toast
        variant="success"
        title="Saved!"
      />
      <Toast
        variant="error"
        title="Failed to save"
      />
    </div>
  ),
};

export const ToastDescriptionOnly: ToastStory = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <Toast
        variant="info"
        description="Your session will expire in 5 minutes."
      />
      <Toast
        variant="warning"
        description="You have unsaved changes."
      />
    </div>
  ),
};

// Interactive Toast Examples with Provider
function ToastDemo() {
  const { toast } = useToast();

  const showDefaultToast = () => {
    toast({
      title: "Default Toast",
      description: "This is a default toast notification.",
    });
  };

  const showSuccessToast = () => {
    toast({
      variant: "success",
      title: "Success!",
      description: "Your action was completed successfully.",
    });
  };

  const showWarningToast = () => {
    toast({
      variant: "warning",
      title: "Warning",
      description: "Please check your input and try again.",
    });
  };

  const showErrorToast = () => {
    toast({
      variant: "error",
      title: "Error",
      description: "Something went wrong. Please try again.",
    });
  };

  const showInfoToast = () => {
    toast({
      variant: "info",
      title: "Information",
      description: "Here's some helpful information.",
    });
  };

  const showToastWithAction = () => {
    toast({
      variant: "success",
      title: "File uploaded",
      description: "Your file has been uploaded successfully.",
      action: (
        <Button size="sm" variant="outline" onClick={() => alert("View file clicked!")}>
          View file
        </Button>
      ),
    });
  };

  const showPersistentToast = () => {
    toast({
      variant: "warning",
      title: "Important Notice",
      description: "This toast will not auto-dismiss.",
      duration: 0, // 0 means no auto-dismiss
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4 max-w-2xl">
      <Button onClick={showDefaultToast} variant="outline">
        Show Default
      </Button>
      <Button onClick={showSuccessToast} variant="outline">
        Show Success
      </Button>
      <Button onClick={showWarningToast} variant="outline">
        Show Warning
      </Button>
      <Button onClick={showErrorToast} variant="outline">
        Show Error
      </Button>
      <Button onClick={showInfoToast} variant="outline">
        Show Info
      </Button>
      <Button onClick={showToastWithAction} variant="outline">
        With Action
      </Button>
      <Button onClick={showPersistentToast} variant="outline">
        Persistent
      </Button>
    </div>
  );
}

export const InteractiveToasts = {
  render: () => <ToastDemo />,
  parameters: {
    docs: {
      description: {
        story: "Interactive demo showing how to trigger different types of toasts using the useToast hook. Click the buttons to see toasts appear in the top-right corner.",
      },
    },
  },
};

// Real-world Examples
function FormWithToasts() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    toast({
      variant: "info",
      title: "Submitting...",
      description: "Please wait while we process your request.",
      duration: 2000,
    });

    setTimeout(() => {
      setIsLoading(false);
      
      // Simulate success or error
      if (Math.random() > 0.3) {
        toast({
          variant: "success",
          title: "Form submitted!",
          description: "Thank you for your submission. We'll get back to you soon.",
          action: (
            <Button size="sm" variant="outline">
              View submission
            </Button>
          ),
        });
      } else {
        toast({
          variant: "error",
          title: "Submission failed",
          description: "There was an error submitting your form. Please try again.",
          action: (
            <Button size="sm" variant="outline">
              Retry
            </Button>
          ),
        });
      }
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Email Address
        </label>
        <input
          type="email"
          required
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter your email"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          Message
        </label>
        <textarea
          required
          rows={4}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter your message"
        />
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Submitting..." : "Submit Form"}
      </Button>
    </form>
  );
}

export const FormToastExample = {
  render: () => <FormWithToasts />,
  parameters: {
    docs: {
      description: {
        story: "Real-world example showing how toasts can be used in a form submission flow to provide feedback to users.",
      },
    },
  },
};