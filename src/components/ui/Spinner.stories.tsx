import type { Meta, StoryObj } from "@storybook/react";
import { Spinner, Loader } from "./Spinner";
import { Button } from "./button";

const meta: Meta = {
  title: "Design System/Spinner & Loader",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Spinner and Loader components for indicating loading states. Includes various animations and styles for different use cases.",
      },
    },
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    variant: {
      control: "select",
      options: ["default", "primary", "secondary"],
    },
    speed: {
      control: "select",
      options: ["slow", "normal", "fast"],
    },
  },
};

export default meta;

type SpinnerStory = StoryObj<typeof Spinner>;
type LoaderStory = StoryObj<typeof Loader>;

// Spinner Stories
export const SpinnerDefault: SpinnerStory = {
  render: (args) => <Spinner {...args} />,
  args: {},
};

export const SpinnerSizes: SpinnerStory = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};

export const SpinnerVariants: SpinnerStory = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner variant="default" />
      <Spinner variant="primary" />
      <Spinner variant="secondary" />
    </div>
  ),
};

export const SpinnerSpeeds: SpinnerStory = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <Spinner speed="slow" />
        <p className="text-sm mt-2">Slow</p>
      </div>
      <div className="text-center">
        <Spinner speed="normal" />
        <p className="text-sm mt-2">Normal</p>
      </div>
      <div className="text-center">
        <Spinner speed="fast" />
        <p className="text-sm mt-2">Fast</p>
      </div>
    </div>
  ),
};

// Loader Stories
export const LoaderDots: LoaderStory = {
  render: (args) => <Loader variant="dots" {...args} />,
  args: {},
};

export const LoaderBars: LoaderStory = {
  render: (args) => <Loader variant="bars" {...args} />,
  args: {},
};

export const LoaderPulse: LoaderStory = {
  render: (args) => <Loader variant="pulse" {...args} />,
  args: {},
};

export const LoaderSpin: LoaderStory = {
  render: (args) => <Loader variant="spin" {...args} />,
  args: {},
};

export const LoaderVariants: LoaderStory = {
  render: () => (
    <div className="grid grid-cols-4 gap-6 text-center">
      <div>
        <Loader variant="dots" />
        <p className="text-sm mt-2">Dots</p>
      </div>
      <div>
        <Loader variant="bars" />
        <p className="text-sm mt-2">Bars</p>
      </div>
      <div>
        <Loader variant="pulse" />
        <p className="text-sm mt-2">Pulse</p>
      </div>
      <div>
        <Loader variant="spin" />
        <p className="text-sm mt-2">Spin</p>
      </div>
    </div>
  ),
};

export const LoaderSizes: LoaderStory = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-h4 mb-3">Dots Loader Sizes</h4>
        <div className="flex items-center gap-4">
          <Loader variant="dots" size="sm" />
          <Loader variant="dots" size="md" />
          <Loader variant="dots" size="lg" />
          <Loader variant="dots" size="xl" />
        </div>
      </div>
      <div>
        <h4 className="text-h4 mb-3">Bars Loader Sizes</h4>
        <div className="flex items-center gap-4">
          <Loader variant="bars" size="sm" />
          <Loader variant="bars" size="md" />
          <Loader variant="bars" size="lg" />
          <Loader variant="bars" size="xl" />
        </div>
      </div>
    </div>
  ),
};

export const LoaderColors: LoaderStory = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-h4 mb-3">Dots - Different Colors</h4>
        <div className="flex items-center gap-4">
          <Loader variant="dots" color="default" />
          <Loader variant="dots" color="primary" />
          <Loader variant="dots" color="secondary" />
        </div>
      </div>
      <div>
        <h4 className="text-h4 mb-3">Bars - Different Colors</h4>
        <div className="flex items-center gap-4">
          <Loader variant="bars" color="default" />
          <Loader variant="bars" color="primary" />
          <Loader variant="bars" color="secondary" />
        </div>
      </div>
    </div>
  ),
};

// Real-world Examples
export const ButtonWithSpinner = {
  render: () => (
    <div className="flex gap-4">
      <Button variant="primary">
        Submit
      </Button>
      <Button variant="primary" loading>
        <Spinner size="sm" variant="primary" />
        Loading...
      </Button>
      <Button variant="outline" disabled>
        <Loader variant="dots" size="sm" />
        Processing...
      </Button>
    </div>
  ),
};

export const LoadingStates = {
  render: () => (
    <div className="max-w-md space-y-6">
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-h3">Dashboard</h3>
          <Spinner size="sm" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader variant="dots" size="lg" color="primary" />
            <p className="text-sm text-muted-foreground mt-3">Loading data...</p>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Loader variant="bars" size="sm" />
          <span className="text-sm">Uploading file... 45%</span>
        </div>
        <div className="mt-2 w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all" style={{ width: "45%" }} />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Real-world examples showing spinners and loaders in different UI contexts like dashboards, data loading, and file uploads.",
      },
    },
  },
};