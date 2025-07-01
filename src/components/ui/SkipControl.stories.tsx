import type { Meta, StoryObj } from '@storybook/react';
import { SkipControl, SkipOptions, OptionalIndicator, TimeoutSkip } from './SkipControl';
import { useState } from 'react';

const meta: Meta<typeof SkipControl> = {
  title: 'UI/SkipControl',
  component: SkipControl,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'subtle', 'link', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    position: {
      control: 'select',
      options: ['left', 'right', 'center'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Skip',
  },
};

export const Subtle: Story = {
  args: {
    variant: 'subtle',
    children: 'Skip this question',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Skip',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Skip for now',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Skip',
    showIcon: true,
    position: 'right',
  },
};

export const IconLeft: Story = {
  args: {
    children: 'Skip',
    showIcon: true,
    position: 'left',
  },
};

export const NoIcon: Story = {
  args: {
    children: 'Skip this question',
    showIcon: false,
  },
};

export const WithReason: Story = {
  args: {
    children: 'Skip',
    reason: 'This question is optional and can be skipped',
  },
};

export const ConfirmSkip: Story = {
  render: () => {
    const [skipped, setSkipped] = useState(false);
    
    if (skipped) {
      return <div className="text-primary">Question skipped!</div>;
    }
    
    return (
      <SkipControl
        confirmSkip={true}
        onConfirmSkip={() => setSkipped(true)}
      >
        Skip Question
      </SkipControl>
    );
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <SkipControl size="sm">Skip</SkipControl>
      <SkipControl size="md">Skip</SkipControl>
      <SkipControl size="lg">Skip</SkipControl>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-3">
      <SkipControl variant="default">Default Skip</SkipControl>
      <SkipControl variant="subtle">Subtle Skip</SkipControl>
      <SkipControl variant="link">Link Skip</SkipControl>
      <SkipControl variant="outline">Outline Skip</SkipControl>
    </div>
  ),
};

// SkipOptions Stories
export const SkipOptionsStory: Story = {
  render: () => {
    const [skipReason, setSkipReason] = useState<string | undefined>();
    
    if (skipReason) {
      return (
        <div className="text-primary">
          Skipped with reason: {skipReason || 'No reason provided'}
        </div>
      );
    }
    
    return (
      <SkipOptions
        onSkip={(reason) => setSkipReason(reason)}
      />
    );
  },
};

export const CustomSkipReasons: Story = {
  render: () => (
    <SkipOptions
      onSkip={(reason) => console.log('Skipped:', reason)}
      reasons={[
        { id: 'not-relevant', label: 'Not relevant to my work' },
        { id: 'dont-understand', label: 'I don\'t understand the question' },
        { id: 'no-experience', label: 'I have no experience with this' },
        { id: 'confidential', label: 'This information is confidential' },
      ]}
    />
  ),
};

export const SkipWithCustomReason: Story = {
  render: () => (
    <SkipOptions
      onSkip={(reason) => console.log('Skipped:', reason)}
      showCustomReason={true}
      customReasonPlaceholder="Please tell us why you're skipping this question..."
      reasons={[
        { id: 'too-personal', label: 'Too personal' },
        { id: 'not-applicable', label: 'Not applicable' },
        { id: 'dont-know', label: 'Don\'t know' },
      ]}
    />
  ),
};

export const DetailedSkipReasons: Story = {
  render: () => (
    <SkipOptions
      onSkip={(reason) => console.log('Skipped:', reason)}
      reasons={[
        { 
          id: 'prefer-not-answer', 
          label: 'Prefer not to answer',
          description: 'You have the right to skip any question'
        },
        { 
          id: 'not-applicable', 
          label: 'Not applicable to me',
          description: 'This question doesn\'t relate to your situation'
        },
        { 
          id: 'need-more-info', 
          label: 'Need more information',
          description: 'The question needs clarification'
        },
        { 
          id: 'technical-issue', 
          label: 'Technical issue',
          description: 'You\'re experiencing a problem with this question'
        },
      ]}
      showCustomReason={true}
    />
  ),
};

// OptionalIndicator Stories
export const OptionalIndicatorStory: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="font-medium">Email notifications</span>
        <OptionalIndicator />
      </div>
      
      <div className="flex items-center gap-2">
        <span className="font-medium">Phone number</span>
        <OptionalIndicator variant="badge" />
      </div>
      
      <div className="flex items-center gap-2">
        <span className="font-medium">LinkedIn profile</span>
        <OptionalIndicator variant="subtle" />
      </div>
    </div>
  ),
};

export const OptionalWithHint: Story = {
  render: () => (
    <div className="space-y-2">
      <label className="block font-medium">
        Additional Comments
        <OptionalIndicator showSkipHint={true} />
      </label>
      <textarea 
        className="w-full p-2 border rounded" 
        placeholder="Share any additional thoughts..."
        rows={3}
      />
    </div>
  ),
};

// TimeoutSkip Stories
export const TimeoutSkipStory: Story = {
  render: () => {
    const [timeoutTriggered, setTimeoutTriggered] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    
    if (timeoutTriggered) {
      return <div className="text-warm-gray">Question automatically skipped due to timeout!</div>;
    }
    
    if (cancelled) {
      return <div className="text-primary">Timeout cancelled - you can continue with this question.</div>;
    }
    
    return (
      <TimeoutSkip
        timeoutSeconds={10}
        onTimeout={() => setTimeoutTriggered(true)}
        onCancel={() => setCancelled(true)}
      />
    );
  },
};

export const CustomTimeoutMessage: Story = {
  render: () => (
    <TimeoutSkip
      timeoutSeconds={15}
      onTimeout={() => console.log('Timeout!')}
      message="Due to inactivity, this question will be skipped in"
      showProgress={true}
    />
  ),
};

export const TimeoutWithoutProgress: Story = {
  render: () => (
    <TimeoutSkip
      timeoutSeconds={8}
      onTimeout={() => console.log('Timeout!')}
      message="Moving to next question in"
      showProgress={false}
    />
  ),
};

export const TimeoutWithoutCancel: Story = {
  render: () => (
    <TimeoutSkip
      timeoutSeconds={5}
      onTimeout={() => console.log('Timeout!')}
      message="Auto-advancing in"
    />
  ),
};

// Complex Examples
export const QuestionWithSkipOptions: Story = {
  render: () => {
    const [skipped, setSkipped] = useState(false);
    
    if (skipped) {
      return (
        <div className="p-4 border border-primary/20 bg-light-gray rounded-lg">
          <p className="text-off-black">Question skipped successfully!</p>
        </div>
      );
    }
    
    return (
      <div className="max-w-md space-y-4">
        <div>
          <h3 className="font-semibold">What is your current salary range?</h3>
          <OptionalIndicator showSkipHint={true} />
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="radio" name="salary" className="mr-2" />
            $50,000 - $75,000
          </label>
          <label className="flex items-center">
            <input type="radio" name="salary" className="mr-2" />
            $75,000 - $100,000
          </label>
          <label className="flex items-center">
            <input type="radio" name="salary" className="mr-2" />
            $100,000 - $150,000
          </label>
          <label className="flex items-center">
            <input type="radio" name="salary" className="mr-2" />
            $150,000+
          </label>
        </div>
        
        <SkipOptions
          onSkip={() => setSkipped(true)}
          reasons={[
            { id: 'prefer-private', label: 'Prefer to keep salary private' },
            { id: 'between-jobs', label: 'Currently between jobs' },
            { id: 'not-applicable', label: 'Not applicable to my situation' },
          ]}
          showCustomReason={true}
          customReasonPlaceholder="Tell us why you're skipping this sensitive question..."
        />
      </div>
    );
  },
};

export const TimedQuestion: Story = {
  render: () => {
    const [answered, setAnswered] = useState(false);
    const [skipped, setSkipped] = useState(false);
    
    if (answered) {
      return <div className="text-primary">Answer submitted!</div>;
    }
    
    if (skipped) {
      return <div className="text-warm-gray">Question timed out and was skipped.</div>;
    }
    
    return (
      <div className="max-w-md space-y-4">
        <div>
          <h3 className="font-semibold">Quick Response</h3>
          <p className="text-sm text-muted-foreground">
            How satisfied are you with your current development tools?
          </p>
        </div>
        
        <div className="space-y-2">
          <button 
            onClick={() => setAnswered(true)}
            className="w-full p-2 text-left border rounded hover:bg-muted"
          >
            Very satisfied
          </button>
          <button 
            onClick={() => setAnswered(true)}
            className="w-full p-2 text-left border rounded hover:bg-muted"
          >
            Somewhat satisfied
          </button>
          <button 
            onClick={() => setAnswered(true)}
            className="w-full p-2 text-left border rounded hover:bg-muted"
          >
            Not satisfied
          </button>
        </div>
        
        <TimeoutSkip
          timeoutSeconds={12}
          onTimeout={() => setSkipped(true)}
          message="This question will auto-skip in"
        />
      </div>
    );
  },
};