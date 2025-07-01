import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar, CircularProgress, StepProgress } from "./ProgressBar";
import { Button } from "./button";
import React from "react";

const meta: Meta = {
  title: "Design System/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Progress indicators for showing completion status, loading states, and step-by-step processes. Includes linear, circular, and step-based progress components.",
      },
    },
  },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
    max: {
      control: "number",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["default", "success", "warning", "danger"],
    },
    showLabel: {
      control: "boolean",
    },
    animated: {
      control: "boolean",
    },
    striped: {
      control: "boolean",
    },
  },
};

export default meta;

type ProgressBarStory = StoryObj<typeof ProgressBar>;
type CircularProgressStory = StoryObj<typeof CircularProgress>;
type StepProgressStory = StoryObj<typeof StepProgress>;

// Linear Progress Bar Stories
export const ProgressBarDefault: ProgressBarStory = {
  render: (args) => <ProgressBar {...args} className="max-w-sm" />,
  args: {
    value: 65,
    showLabel: true,
  },
};

export const ProgressBarSizes: ProgressBarStory = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <div>
        <p className="text-sm mb-2">Small</p>
        <ProgressBar value={40} size="sm" showLabel />
      </div>
      <div>
        <p className="text-sm mb-2">Medium (default)</p>
        <ProgressBar value={65} size="md" showLabel />
      </div>
      <div>
        <p className="text-sm mb-2">Large</p>
        <ProgressBar value={80} size="lg" showLabel />
      </div>
    </div>
  ),
};

export const ProgressBarVariants: ProgressBarStory = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <div>
        <p className="text-sm mb-2">Default</p>
        <ProgressBar value={65} variant="default" showLabel />
      </div>
      <div>
        <p className="text-sm mb-2">Success</p>
        <ProgressBar value={100} variant="success" showLabel />
      </div>
      <div>
        <p className="text-sm mb-2">Warning</p>
        <ProgressBar value={75} variant="warning" showLabel />
      </div>
      <div>
        <p className="text-sm mb-2">Danger</p>
        <ProgressBar value={25} variant="danger" showLabel />
      </div>
    </div>
  ),
};

export const ProgressBarAnimated: ProgressBarStory = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <div>
        <p className="text-sm mb-2">Animated</p>
        <ProgressBar value={45} animated showLabel />
      </div>
      <div>
        <p className="text-sm mb-2">Striped</p>
        <ProgressBar value={60} striped showLabel />
      </div>
      <div>
        <p className="text-sm mb-2">Animated + Striped</p>
        <ProgressBar value={80} animated striped showLabel />
      </div>
    </div>
  ),
};

export const ProgressBarCustomLabels: ProgressBarStory = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <ProgressBar value={7} max={10} showLabel label="Tasks Completed" />
      <ProgressBar value={2.5} max={5} showLabel label="Hours Worked" />
      <ProgressBar value={150} max={200} showLabel label="Downloads" />
    </div>
  ),
};

// Circular Progress Stories
export const CircularProgressDefault: CircularProgressStory = {
  render: (args) => <CircularProgress {...args} />,
  args: {
    value: 75,
    showLabel: true,
  },
};

export const CircularProgressSizes: CircularProgressStory = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="text-center">
        <CircularProgress value={65} size={80} showLabel />
        <p className="text-sm mt-2">Small</p>
      </div>
      <div className="text-center">
        <CircularProgress value={75} size={120} showLabel />
        <p className="text-sm mt-2">Medium</p>
      </div>
      <div className="text-center">
        <CircularProgress value={85} size={160} showLabel />
        <p className="text-sm mt-2">Large</p>
      </div>
    </div>
  ),
};

export const CircularProgressVariants: CircularProgressStory = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center">
        <CircularProgress value={65} variant="default" showLabel />
        <p className="text-sm mt-2">Default</p>
      </div>
      <div className="text-center">
        <CircularProgress value={100} variant="success" showLabel />
        <p className="text-sm mt-2">Success</p>
      </div>
      <div className="text-center">
        <CircularProgress value={75} variant="warning" showLabel />
        <p className="text-sm mt-2">Warning</p>
      </div>
      <div className="text-center">
        <CircularProgress value={25} variant="danger" showLabel />
        <p className="text-sm mt-2">Danger</p>
      </div>
    </div>
  ),
};

export const CircularProgressCustom: CircularProgressStory = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="text-center">
        <CircularProgress 
          value={8} 
          max={10} 
          showLabel 
          label="8/10"
          size={100}
          strokeWidth={12}
        />
        <p className="text-sm mt-2">Thick stroke</p>
      </div>
      <div className="text-center">
        <CircularProgress 
          value={45} 
          max={60} 
          showLabel 
          label="45 min"
          size={120}
          strokeWidth={4}
          variant="success"
        />
        <p className="text-sm mt-2">Thin stroke</p>
      </div>
    </div>
  ),
};

// Step Progress Stories
export const StepProgressDefault: StepProgressStory = {
  render: (args) => <StepProgress {...args} className="max-w-lg" />,
  args: {
    currentStep: 2,
    totalSteps: 4,
  },
};

export const StepProgressWithLabels: StepProgressStory = {
  render: () => (
    <StepProgress
      currentStep={3}
      totalSteps={4}
      showLabels
      steps={[
        { label: "Order", description: "Review your order" },
        { label: "Payment", description: "Enter payment details" },
        { label: "Shipping", description: "Choose shipping method" },
        { label: "Confirmation", description: "Order confirmed" },
      ]}
      className="max-w-2xl"
    />
  ),
};

export const StepProgressSizes: StepProgressStory = {
  render: () => (
    <div className="space-y-8">
      <div>
        <p className="text-sm mb-4">Small</p>
        <StepProgress
          currentStep={2}
          totalSteps={3}
          size="sm"
          showLabels
          steps={[
            { label: "Start" },
            { label: "Progress" },
            { label: "Complete" },
          ]}
          className="max-w-md"
        />
      </div>
      <div>
        <p className="text-sm mb-4">Medium</p>
        <StepProgress
          currentStep={2}
          totalSteps={3}
          size="md"
          showLabels
          steps={[
            { label: "Start" },
            { label: "Progress" },
            { label: "Complete" },
          ]}
          className="max-w-md"
        />
      </div>
      <div>
        <p className="text-sm mb-4">Large</p>
        <StepProgress
          currentStep={2}
          totalSteps={3}
          size="lg"
          showLabels
          steps={[
            { label: "Start" },
            { label: "Progress" },
            { label: "Complete" },
          ]}
          className="max-w-md"
        />
      </div>
    </div>
  ),
};

export const StepProgressVariants: StepProgressStory = {
  render: () => (
    <div className="space-y-6">
      <div>
        <p className="text-sm mb-4">Default</p>
        <StepProgress currentStep={3} totalSteps={4} className="max-w-md" />
      </div>
      <div>
        <p className="text-sm mb-4">Success</p>
        <StepProgress currentStep={4} totalSteps={4} variant="success" className="max-w-md" />
      </div>
      <div>
        <p className="text-sm mb-4">Warning</p>
        <StepProgress currentStep={2} totalSteps={4} variant="warning" className="max-w-md" />
      </div>
      <div>
        <p className="text-sm mb-4">Danger</p>
        <StepProgress currentStep={1} totalSteps={4} variant="danger" className="max-w-md" />
      </div>
    </div>
  ),
};

// Interactive Examples
function InteractiveProgressDemo() {
  const [progress, setProgress] = React.useState(0);

  const startProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
  };

  return (
    <div className="space-y-6 max-w-md">
      <div className="space-y-4">
        <ProgressBar value={progress} showLabel animated />
        <CircularProgress value={progress} showLabel />
      </div>
      
      <div className="flex gap-2">
        <Button onClick={startProgress} size="sm">
          Start Progress
        </Button>
        <Button onClick={() => setProgress(0)} variant="outline" size="sm">
          Reset
        </Button>
      </div>
    </div>
  );
}

export const InteractiveProgress = {
  render: () => <InteractiveProgressDemo />,
  parameters: {
    docs: {
      description: {
        story: "Interactive demo showing animated progress bars that can be controlled with buttons.",
      },
    },
  },
};

// Real-world Examples
export const FileUploadProgress = {
  render: () => (
    <div className="max-w-md space-y-4">
      <div className="border rounded-lg p-4">
        <h3 className="text-h3 mb-4">File Uploads</h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>document.pdf</span>
              <span className="text-muted-foreground">2.4 MB</span>
            </div>
            <ProgressBar value={100} variant="success" size="sm" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>image.jpg</span>
              <span className="text-muted-foreground">1.8 MB</span>
            </div>
            <ProgressBar value={65} animated striped size="sm" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>presentation.pptx</span>
              <span className="text-muted-foreground">5.2 MB</span>
            </div>
            <ProgressBar value={0} size="sm" />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "File upload progress tracking with different states (complete, uploading, pending).",
      },
    },
  },
};

export const ProjectBuildStatus = {
  render: () => (
    <div className="max-w-lg space-y-6">
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-h3">Build Progress</h3>
          <CircularProgress value={75} size={60} showLabel />
        </div>
        
        <StepProgress
          currentStep={3}
          totalSteps={4}
          showLabels
          steps={[
            { label: "Install", description: "Installing dependencies" },
            { label: "Build", description: "Compiling source code" },
            { label: "Test", description: "Running test suite" },
            { label: "Deploy", description: "Deploying to production" },
          ]}
        />
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Current: Running tests</span>
            <span className="text-muted-foreground">Est. 2 min remaining</span>
          </div>
          <ProgressBar value={75} animated showLabel />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Project build pipeline showing step progress and overall completion status.",
      },
    },
  },
};