import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TextFeedback } from './TextFeedback';

const meta = {
  title: 'Molecules/TextFeedback',
  component: TextFeedback,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A questionnaire component for collecting open-ended text feedback with character limits and validation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    question: { control: 'text' },
    description: { control: 'text' },
    value: { control: 'text' },
    onChange: { action: 'changed' },
    required: { control: 'boolean' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    allowSkip: { control: 'boolean' },
    onSkip: { action: 'skipped' },
    maxLength: { control: 'number' },
    minLength: { control: 'number' },
    placeholder: { control: 'text' },
    rows: { control: 'number' },
    helperText: { control: 'text' },
  },
  args: {
    onChange: fn(),
    onSkip: fn(),
  },
} satisfies Meta<typeof TextFeedback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    question: 'What are your thoughts on this feature?',
    placeholder: 'Share your thoughts...',
  },
};

export const WithDescription: Story = {
  args: {
    question: 'How would you improve our development workflow?',
    description: 'Please provide specific suggestions for tools, processes, or practices that could enhance our team productivity.',
    placeholder: 'Describe your ideas...',
  },
};

export const WithCharacterLimit: Story = {
  args: {
    question: 'Brief feedback on the new design system',
    description: 'Keep it concise - what are the key improvements you\'d like to see?',
    maxLength: 200,
    placeholder: 'Your feedback...',
  },
};

export const WithMinimumLength: Story = {
  args: {
    question: 'Detailed project retrospective',
    description: 'Please provide a comprehensive review of the project outcomes and lessons learned.',
    minLength: 100,
    maxLength: 1000,
    rows: 6,
    placeholder: 'Share your detailed thoughts...',
    helperText: 'Minimum 100 characters required for a complete response.',
  },
};

export const Required: Story = {
  args: {
    question: 'What is your primary role in the development team?',
    description: 'This information helps us tailor our questions to your experience.',
    required: true,
    placeholder: 'e.g., Frontend Developer, Backend Engineer, DevOps...',
    rows: 3,
  },
};

export const WithError: Story = {
  args: {
    question: 'Describe the technical challenge you faced',
    value: 'Too short',
    error: 'Response must be at least 50 characters to provide meaningful feedback.',
    minLength: 50,
    placeholder: 'Describe the challenge and how you resolved it...',
  },
};

export const WithSkipOption: Story = {
  args: {
    question: 'Any additional comments or suggestions?',
    description: 'This is optional - feel free to share any other thoughts you have.',
    allowSkip: true,
    placeholder: 'Optional feedback...',
  },
};

export const Disabled: Story = {
  args: {
    question: 'Previous feedback (readonly)',
    value: 'This was submitted earlier and cannot be modified.',
    disabled: true,
    helperText: 'This response has been locked and cannot be edited.',
  },
};

export const LongForm: Story = {
  args: {
    question: 'Project retrospective and lessons learned',
    description: 'Please provide a comprehensive review covering what went well, what could be improved, and key takeaways for future projects.',
    maxLength: 2000,
    minLength: 200,
    rows: 8,
    placeholder: 'Share your detailed retrospective...',
    helperText: 'Take your time to provide thoughtful feedback that will help improve future projects.',
  },
};

export const CompactForm: Story = {
  args: {
    question: 'Quick feedback',
    description: 'Just a few words about your experience.',
    maxLength: 100,
    rows: 2,
    placeholder: 'Brief thoughts...',
  },
};

export const NearCharacterLimit: Story = {
  args: {
    question: 'What features would you like to see next?',
    value: 'I think we need better documentation, more examples, improved error handling, and maybe some performance optimizations. The current system works well but could use some refinement in the user experience department.',
    maxLength: 250,
    placeholder: 'List your feature requests...',
  },
};

export const WithHelperText: Story = {
  args: {
    question: 'Technical implementation details',
    description: 'Describe the technical approach you would recommend for this feature.',
    helperText: 'Include architecture decisions, technology choices, and implementation considerations.',
    maxLength: 800,
    rows: 6,
    placeholder: 'Describe your technical approach...',
  },
};

// Responsive testing
export const MobileOptimized: Story = {
  args: {
    question: 'Mobile-friendly feedback form',
    description: 'This form is optimized for mobile devices with appropriate touch targets and spacing.',
    maxLength: 300,
    placeholder: 'Tap to start typing...',
    helperText: 'Designed for easy mobile input',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Accessibility testing
export const AccessibilityShowcase: Story = {
  args: {
    question: 'Accessibility-focused feedback form',
    description: 'This form includes proper ARIA labels, keyboard navigation, and screen reader support.',
    required: true,
    maxLength: 500,
    helperText: 'All form elements are properly labeled for assistive technologies.',
    placeholder: 'Your accessible feedback...',
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'keyboard-navigation',
            enabled: true,
          },
        ],
      },
    },
  },
};