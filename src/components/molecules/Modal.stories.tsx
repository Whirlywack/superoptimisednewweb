import type { Meta, StoryObj } from "@storybook/react";
import { Modal, ModalContent, ModalFooter, ConfirmDialog, AlertDialog } from "./Modal";
import { Button } from "@/components/ui/button";
import { TextFieldGroup } from "./FormGroup";
import React from "react";

const meta: Meta = {
  title: "Design System/Molecules/Modal",
  component: Modal,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Modal dialog components for displaying content in an overlay. Includes specialized variants for confirmations and alerts.",
      },
    },
  },
  argTypes: {
    open: {
      control: "boolean",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "full"],
    },
    closable: {
      control: "boolean",
    },
    title: {
      control: "text",
    },
    description: {
      control: "text",
    },
  },
};

export default meta;

type ModalStory = StoryObj<typeof Modal>;

// Interactive Modal Demo Component
function ModalDemo({ size = "md", title, description, closable = true }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        size={size}
        title={title}
        description={description}
        closable={closable}
      >
        <ModalContent>
          <p className="text-muted-foreground">
            This is the modal content area. You can put any content here including forms, 
            text, images, or other components.
          </p>
        </ModalContent>
        
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Save Changes
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

// Basic Modal Stories
export const ModalDefault: ModalStory = {
  render: (args) => <ModalDemo {...args} />,
  args: {
    title: "Default Modal",
    description: "This is a basic modal dialog.",
  },
};

export const ModalSizes: ModalStory = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <ModalDemo size="sm" title="Small Modal" />
      <ModalDemo size="md" title="Medium Modal" />
      <ModalDemo size="lg" title="Large Modal" />
      <ModalDemo size="xl" title="Extra Large Modal" />
    </div>
  ),
};

export const ModalWithoutHeader: ModalStory = {
  render: () => <ModalDemo closable={false} />,
};

export const ModalNotClosable: ModalStory = {
  render: () => <ModalDemo closable={false} title="Cannot Close" description="This modal cannot be closed with the X button or escape key." />,
};

// Form Modal Example
function FormModalDemo() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Add New User
      </Button>
      
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New User"
        description="Fill out the form below to add a new user to your organization."
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <ModalContent>
            <div className="space-y-4">
              <TextFieldGroup
                label="Full Name"
                placeholder="Enter full name"
                required
              />
              
              <TextFieldGroup
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                required
              />
              
              <TextFieldGroup
                label="Job Title"
                placeholder="Enter job title"
              />
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Department
                </label>
                <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Select department</option>
                  <option value="engineering">Engineering</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                </select>
              </div>
            </div>
          </ModalContent>
          
          <ModalFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              {isLoading ? "Adding User..." : "Add User"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}

export const FormModal = {
  render: () => <FormModalDemo />,
  parameters: {
    docs: {
      description: {
        story: "Example of a modal containing a form with proper loading states and validation.",
      },
    },
  },
};

// Confirmation Dialog Stories
function ConfirmDialogDemo() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    
    // Simulate async action
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsOpen(false);
    alert("Action confirmed!");
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        Delete Item
      </Button>
      
      <ConfirmDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        loading={isLoading}
      />
    </>
  );
}

export const ConfirmationDialog = {
  render: () => <ConfirmDialogDemo />,
  parameters: {
    docs: {
      description: {
        story: "Confirmation dialog for destructive actions with loading state support.",
      },
    },
  },
};

// Alert Dialog Stories
function AlertDialogDemo() {
  const [alertType, setAlertType] = React.useState<"success" | "warning" | "error" | null>(null);

  return (
    <>
      <div className="flex gap-4">
        <Button onClick={() => setAlertType("success")} variant="outline">
          Show Success
        </Button>
        <Button onClick={() => setAlertType("warning")} variant="outline">
          Show Warning
        </Button>
        <Button onClick={() => setAlertType("error")} variant="outline">
          Show Error
        </Button>
      </div>
      
      <AlertDialog
        open={alertType === "success"}
        onClose={() => setAlertType(null)}
        title="Success!"
        description="Your action was completed successfully."
        variant="success"
      />
      
      <AlertDialog
        open={alertType === "warning"}
        onClose={() => setAlertType(null)}
        title="Warning"
        description="Please review your input before proceeding."
        variant="warning"
      />
      
      <AlertDialog
        open={alertType === "error"}
        onClose={() => setAlertType(null)}
        title="Error"
        description="Something went wrong. Please try again later."
        variant="error"
      />
    </>
  );
}

export const AlertDialogs = {
  render: () => <AlertDialogDemo />,
  parameters: {
    docs: {
      description: {
        story: "Alert dialogs for displaying important messages to users.",
      },
    },
  },
};

// Complex Modal Example
function ComplexModalDemo() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("general");

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Settings
      </Button>
      
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="User Settings"
        description="Manage your account settings and preferences."
        size="xl"
      >
        <ModalContent>
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-48 flex-shrink-0">
              <nav className="space-y-1">
                {[
                  { id: "general", label: "General" },
                  { id: "security", label: "Security" },
                  { id: "notifications", label: "Notifications" },
                  { id: "billing", label: "Billing" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-h-[300px]">
              {activeTab === "general" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">General Settings</h3>
                  <TextFieldGroup
                    label="Display Name"
                    placeholder="Enter your display name"
                    defaultValue="John Doe"
                  />
                  <TextFieldGroup
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    defaultValue="john@example.com"
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Time Zone
                    </label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg">
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (Greenwich Mean Time)</option>
                    </select>
                  </div>
                </div>
              )}
              
              {activeTab === "security" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Security Settings</h3>
                  <TextFieldGroup
                    label="Current Password"
                    type="password"
                    placeholder="Enter current password"
                  />
                  <TextFieldGroup
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                  />
                  <TextFieldGroup
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
              )}
              
              {activeTab === "notifications" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Notification Settings</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked />
                      <span>Email notifications</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked />
                      <span>Push notifications</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" />
                      <span>SMS notifications</span>
                    </label>
                  </div>
                </div>
              )}
              
              {activeTab === "billing" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Billing Information</h3>
                  <p className="text-muted-foreground">
                    Manage your billing information and view your usage.
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="font-medium">Current Plan: Pro</p>
                    <p className="text-sm text-muted-foreground">$29/month</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ModalContent>
        
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Save Changes
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export const ComplexModal = {
  render: () => <ComplexModalDemo />,
  parameters: {
    docs: {
      description: {
        story: "Complex modal example with tabbed navigation and different content sections.",
      },
    },
  },
};