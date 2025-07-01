import type { Meta, StoryObj } from "@storybook/react";
import { FocusRing, Focusable, FocusTrap, SkipLink, useFocus } from "./FocusRing";
import { Button } from "./button";
import { TextField } from "./Input";
import React from "react";

const meta: Meta = {
  title: "Design System/FocusRing",
  component: FocusRing,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Focus management components for creating accessible interfaces. Includes focus rings, focusable wrappers, focus traps, and skip links for keyboard navigation.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "success", "warning", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    shape: {
      control: "select",
      options: ["rounded", "square", "circle"],
    },
    offset: {
      control: "select",
      options: ["none", "sm", "md", "lg"],
    },
    visible: {
      control: "boolean",
    },
  },
};

export default meta;

type FocusRingStory = StoryObj<typeof FocusRing>;
type FocusableStory = StoryObj<typeof Focusable>;
type FocusTrapStory = StoryObj<typeof FocusTrap>;

// Basic FocusRing Stories
export const FocusRingDefault: FocusRingStory = {
  render: (args) => (
    <FocusRing {...args}>
      <Button>Focusable Button</Button>
    </FocusRing>
  ),
  args: {
    visible: true,
  },
};

export const FocusRingVariants: FocusRingStory = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <FocusRing variant="default" visible>
        <Button variant="outline">Default</Button>
      </FocusRing>
      <FocusRing variant="primary" visible>
        <Button variant="outline">Primary</Button>
      </FocusRing>
      <FocusRing variant="success" visible>
        <Button variant="outline">Success</Button>
      </FocusRing>
      <FocusRing variant="warning" visible>
        <Button variant="outline">Warning</Button>
      </FocusRing>
      <FocusRing variant="danger" visible>
        <Button variant="outline">Danger</Button>
      </FocusRing>
    </div>
  ),
};

export const FocusRingSizes: FocusRingStory = {
  render: () => (
    <div className="flex gap-4 items-center">
      <FocusRing size="sm" visible>
        <Button variant="outline">Small Ring</Button>
      </FocusRing>
      <FocusRing size="md" visible>
        <Button variant="outline">Medium Ring</Button>
      </FocusRing>
      <FocusRing size="lg" visible>
        <Button variant="outline">Large Ring</Button>
      </FocusRing>
    </div>
  ),
};

export const FocusRingShapes: FocusRingStory = {
  render: () => (
    <div className="flex gap-4 items-center">
      <FocusRing shape="square" visible>
        <div className="w-12 h-12 bg-muted flex items-center justify-center">
          Square
        </div>
      </FocusRing>
      <FocusRing shape="rounded" visible>
        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
          Rounded
        </div>
      </FocusRing>
      <FocusRing shape="circle" visible>
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
          Circle
        </div>
      </FocusRing>
    </div>
  ),
};

export const FocusRingOffsets: FocusRingStory = {
  render: () => (
    <div className="flex gap-6 items-center">
      <FocusRing offset="none" visible>
        <Button variant="outline">No Offset</Button>
      </FocusRing>
      <FocusRing offset="sm" visible>
        <Button variant="outline">Small Offset</Button>
      </FocusRing>
      <FocusRing offset="md" visible>
        <Button variant="outline">Medium Offset</Button>
      </FocusRing>
      <FocusRing offset="lg" visible>
        <Button variant="outline">Large Offset</Button>
      </FocusRing>
    </div>
  ),
};

// Focusable Component Stories
export const FocusableDefault: FocusableStory = {
  render: (args) => (
    <Focusable {...args}>
      <div className="p-4 bg-muted rounded-lg">
        Click or tab to focus this element
      </div>
    </Focusable>
  ),
  args: {},
};

export const FocusableElements: FocusableStory = {
  render: () => (
    <div className="space-y-4">
      <Focusable as="div">
        <div className="p-4 bg-muted rounded-lg cursor-pointer">
          Focusable div (click or tab to focus)
        </div>
      </Focusable>
      
      <Focusable as="span" className="inline-block">
        <span className="p-2 bg-primary text-primary-foreground rounded cursor-pointer">
          Focusable span
        </span>
      </Focusable>
      
      <Focusable as="button" className="p-4 bg-background border rounded-lg w-full text-left">
        Focusable button with custom styling
      </Focusable>
    </div>
  ),
};

export const FocusableVariants: FocusableStory = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Focusable variant="default">
        <div className="p-4 bg-muted rounded-lg">Default focus</div>
      </Focusable>
      <Focusable variant="primary">
        <div className="p-4 bg-muted rounded-lg">Primary focus</div>
      </Focusable>
      <Focusable variant="success">
        <div className="p-4 bg-muted rounded-lg">Success focus</div>
      </Focusable>
      <Focusable variant="danger">
        <div className="p-4 bg-muted rounded-lg">Danger focus</div>
      </Focusable>
    </div>
  ),
};

export const FocusableDisabled: FocusableStory = {
  render: () => (
    <div className="space-y-4">
      <Focusable>
        <div className="p-4 bg-muted rounded-lg">Enabled (tab to focus)</div>
      </Focusable>
      <Focusable disabled>
        <div className="p-4 bg-muted rounded-lg">Disabled (cannot focus)</div>
      </Focusable>
    </div>
  ),
};

// Focus Trap Stories
function FocusTrapDemo() {
  const [isActive, setIsActive] = React.useState(false);

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsActive(!isActive)}>
        {isActive ? "Deactivate" : "Activate"} Focus Trap
      </Button>
      
      {isActive && (
        <FocusTrap active className="border-2 border-primary rounded-lg p-4 space-y-3">
          <h3 className="text-h3">Focus Trap Active</h3>
          <p className="text-sm text-muted-foreground">
            Tab and Shift+Tab will cycle through elements within this container.
          </p>
          
          <div className="flex gap-2">
            <Button size="sm">First Button</Button>
            <Button size="sm" variant="outline">Second Button</Button>
          </div>
          
          <TextField placeholder="Input field" />
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline">Third Button</Button>
            <Button size="sm" onClick={() => setIsActive(false)}>
              Close Trap
            </Button>
          </div>
        </FocusTrap>
      )}
      
      <p className="text-sm text-muted-foreground">
        Content outside the focus trap (not focusable when trap is active)
      </p>
      <Button variant="outline">Outside Button</Button>
    </div>
  );
}

export const FocusTrapExample = {
  render: () => <FocusTrapDemo />,
  parameters: {
    docs: {
      description: {
        story: "Interactive focus trap that constrains keyboard navigation to elements within the container.",
      },
    },
  },
};

// Skip Link Stories
export const SkipLinkExample = {
  render: () => (
    <div className="relative">
      <SkipLink href="#main-content">
        Skip to main content
      </SkipLink>
      
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Press Tab to see the skip link appear. Click it to jump to the main content.
        </p>
        
        <div className="space-y-2">
          <Button>Navigation Button 1</Button>
          <Button>Navigation Button 2</Button>
          <Button>Navigation Button 3</Button>
        </div>
        
        <div id="main-content" className="mt-8 p-4 bg-muted rounded-lg">
          <h2 className="text-h2 mb-2">Main Content</h2>
          <p>This is the main content area that users can skip to.</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Skip link that appears when focused, allowing keyboard users to jump to main content.",
      },
    },
  },
};

// useFocus Hook Example
function UseFocusDemo() {
  const { focus, blur, focusFirst, focusLast, focusedId } = useFocus();

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button onClick={() => focus("target-button")} size="sm">
          Focus Target Button
        </Button>
        <Button onClick={() => focus("target-input")} size="sm">
          Focus Target Input
        </Button>
        <Button onClick={blur} size="sm" variant="outline">
          Blur Current
        </Button>
        <Button onClick={() => focusFirst("focus-container")} size="sm" variant="outline">
          Focus First
        </Button>
        <Button onClick={() => focusLast("focus-container")} size="sm" variant="outline">
          Focus Last
        </Button>
      </div>
      
      <div className="text-sm text-muted-foreground">
        Currently focused: {focusedId || "none"}
      </div>
      
      <div id="focus-container" className="border rounded-lg p-4 space-y-3">
        <h3 className="text-h3">Focus Container</h3>
        
        <div className="space-y-2">
          <Button id="container-button-1" variant="outline" size="sm">
            Container Button 1
          </Button>
          <Button id="target-button" variant="primary" size="sm">
            Target Button
          </Button>
          <TextField id="target-input" placeholder="Target input field" />
          <Button id="container-button-2" variant="outline" size="sm">
            Container Button 2
          </Button>
        </div>
      </div>
    </div>
  );
}

export const UseFocusHook = {
  render: () => <UseFocusDemo />,
  parameters: {
    docs: {
      description: {
        story: "Demonstration of the useFocus hook for programmatic focus management.",
      },
    },
  },
};

// Real-world Examples
export const AccessibleModal = {
  render: () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <div>
        <Button onClick={() => setIsOpen(true)}>
          Open Modal
        </Button>
        
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <FocusTrap active className="bg-background border rounded-lg shadow-lg max-w-md w-full mx-4">
              <div className="p-6 space-y-4">
                <h2 className="text-h2">Accessible Modal</h2>
                <p className="text-sm text-muted-foreground">
                  This modal traps focus and provides proper keyboard navigation.
                </p>
                
                <TextField placeholder="Enter your name" />
                <TextField placeholder="Enter your email" />
                
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsOpen(false)}>
                    Submit
                  </Button>
                </div>
              </div>
            </FocusTrap>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Modal dialog with proper focus management and keyboard navigation.",
      },
    },
  },
};

export const KeyboardNavigationDemo = {
  render: () => (
    <div className="space-y-6">
      <div className="relative">
        <SkipLink href="#navigation-demo-content">
          Skip to content
        </SkipLink>
        
        <div className="space-y-4">
          <nav className="flex gap-2 p-4 bg-muted rounded-lg">
            <Button variant="ghost" size="sm">Home</Button>
            <Button variant="ghost" size="sm">About</Button>
            <Button variant="ghost" size="sm">Services</Button>
            <Button variant="ghost" size="sm">Contact</Button>
          </nav>
          
          <div id="navigation-demo-content" className="p-4 border rounded-lg">
            <h2 className="text-h2 mb-4">Main Content</h2>
            
            <div className="space-y-4">
              <Focusable>
                <div className="p-3 bg-muted rounded cursor-pointer">
                  Custom focusable card component
                </div>
              </Focusable>
              
              <div className="grid grid-cols-2 gap-4">
                <Focusable variant="primary" shape="rounded">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-center cursor-pointer">
                    Primary focus style
                  </div>
                </Focusable>
                
                <Focusable variant="primary" shape="rounded">
                  <div className="p-4 bg-light-gray border border-primary/20 rounded-lg text-center cursor-pointer">
                    Secondary focus style
                  </div>
                </Focusable>
              </div>
              
              <TextField placeholder="Accessible form input" />
              
              <div className="flex gap-2">
                <Button>Primary Action</Button>
                <Button variant="outline">Secondary Action</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Complete keyboard navigation example with skip links, focus management, and accessible components.",
      },
    },
  },
};