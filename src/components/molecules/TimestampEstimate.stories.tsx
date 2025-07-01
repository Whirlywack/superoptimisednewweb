import type { Meta, StoryObj } from '@storybook/react';
import { TimestampEstimate, type TimeUnit } from './TimestampEstimate';

const meta: Meta<typeof TimestampEstimate> = {
  title: 'Molecules/TimestampEstimate',
  component: TimestampEstimate,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component for estimating development time with flexible time units, confidence levels, and preset options. Commonly used in project planning and technical questionnaires.',
      },
    },
  },
  argTypes: {
    question: {
      control: 'text',
      description: 'The question text asking for time estimation',
    },
    value: {
      control: 'object',
      description: 'Current time estimate value',
    },
    allowedUnits: {
      control: 'check',
      options: ['minutes', 'hours', 'days', 'weeks', 'months'],
      description: 'Available time units for selection',
    },
    min: {
      control: 'number',
      description: 'Minimum allowed value',
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value',
    },
    showConfidence: {
      control: 'boolean',
      description: 'Whether to show confidence level slider',
    },
    confidence: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Current confidence level (0-100)',
    },
    required: {
      control: 'boolean',
      description: 'Whether the question is required',
    },
    allowSkip: {
      control: 'boolean',
      description: 'Whether to show skip option',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimestampEstimate>;

const defaultValue: TimeUnit = { value: 3, unit: 'days' };

const customPresets = [
  { label: '1 hour', value: { value: 1, unit: 'hours' as const } },
  { label: '4 hours', value: { value: 4, unit: 'hours' as const } },
  { label: '1 day', value: { value: 1, unit: 'days' as const } },
  { label: '3 days', value: { value: 3, unit: 'days' as const } },
  { label: '1 week', value: { value: 1, unit: 'weeks' as const } },
  { label: '2 weeks', value: { value: 2, unit: 'weeks' as const } },
];

export const Default: Story = {
  args: {
    question: 'How long do you estimate this feature will take to implement?',
    description: 'Consider development, testing, and code review time in your estimate.',
    value: defaultValue,
    allowedUnits: ['hours', 'days', 'weeks', 'months'],
    min: 1,
    max: 100,
    showConfidence: false,
    required: false,
    allowSkip: false,
    disabled: false,
  },
};

export const WithConfidence: Story = {
  args: {
    ...Default.args,
    question: 'How long will it take to build a user authentication system?',
    showConfidence: true,
    confidence: 75,
    description: 'Include implementation, testing, security review, and documentation time. Also indicate your confidence in this estimate.',
  },
};

export const CustomPresets: Story = {
  args: {
    ...Default.args,
    question: 'Estimate the time needed for code review and testing?',
    presets: customPresets,
    value: { value: 4, unit: 'hours' },
    description: 'Choose from common estimates or enter a custom value.',
  },
};

export const ShortTasks: Story = {
  args: {
    question: 'How long to fix this bug?',
    description: 'Consider investigation, fix implementation, and testing time.',
    value: { value: 2, unit: 'hours' },
    allowedUnits: ['minutes', 'hours', 'days'],
    min: 15,
    max: 48,
    showConfidence: true,
    confidence: 60,
    presets: [
      { label: '30 min', value: { value: 30, unit: 'minutes' as const } },
      { label: '1 hour', value: { value: 1, unit: 'hours' as const } },
      { label: '2 hours', value: { value: 2, unit: 'hours' as const } },
      { label: '4 hours', value: { value: 4, unit: 'hours' as const } },
      { label: '1 day', value: { value: 1, unit: 'days' as const } },
    ],
  },
};

export const LongTermProject: Story = {
  args: {
    question: 'What is your estimate for the entire project timeline?',
    description: 'Consider all phases: planning, development, testing, deployment, and documentation.',
    value: { value: 3, unit: 'months' },
    allowedUnits: ['weeks', 'months'],
    min: 2,
    max: 12,
    showConfidence: true,
    confidence: 45,
    presets: [
      { label: '2 weeks', value: { value: 2, unit: 'weeks' as const } },
      { label: '1 month', value: { value: 1, unit: 'months' as const } },
      { label: '2 months', value: { value: 2, unit: 'months' as const } },
      { label: '3 months', value: { value: 3, unit: 'months' as const } },
      { label: '6 months', value: { value: 6, unit: 'months' as const } },
    ],
  },
};

export const HighConfidence: Story = {
  args: {
    ...Default.args,
    question: 'Time to implement a simple CRUD API?',
    value: { value: 2, unit: 'days' },
    showConfidence: true,
    confidence: 90,
    description: 'This is a well-understood task with high confidence in the estimate.',
  },
};

export const LowConfidence: Story = {
  args: {
    ...Default.args,
    question: 'How long to integrate with an unknown third-party API?',
    value: { value: 2, unit: 'weeks' },
    showConfidence: true,
    confidence: 30,
    description: 'Unknown complexity requires exploration time, leading to low confidence.',
  },
};

export const Required: Story = {
  args: {
    ...Default.args,
    required: true,
    error: 'Please provide a time estimate to continue.',
    description: 'This estimate is required for project planning.',
  },
};

export const WithSkipOption: Story = {
  args: {
    ...Default.args,
    allowSkip: true,
    question: 'Optional: How long would you personally take for this task?',
    description: 'This estimate is optional and helps us understand different skill levels.',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    value: { value: 5, unit: 'days' },
    showConfidence: true,
    confidence: 80,
    description: 'This estimate has been locked and cannot be modified.',
  },
};

export const ErrorState: Story = {
  args: {
    ...Default.args,
    error: 'Estimate must be between 1 and 100 units.',
    required: true,
    value: { value: 0, unit: 'days' },
  },
};

export const MinutesOnly: Story = {
  args: {
    question: 'How long for a quick code review?',
    description: 'Estimate time for reviewing a small pull request.',
    value: { value: 30, unit: 'minutes' },
    allowedUnits: ['minutes'],
    min: 5,
    max: 120,
    presets: [
      { label: '15 min', value: { value: 15, unit: 'minutes' as const } },
      { label: '30 min', value: { value: 30, unit: 'minutes' as const } },
      { label: '45 min', value: { value: 45, unit: 'minutes' as const } },
      { label: '1 hour', value: { value: 60, unit: 'minutes' as const } },
    ],
  },
};

export const NoPresets: Story = {
  args: {
    ...Default.args,
    presets: [],
    question: 'Custom estimate only - how long for database migration?',
    description: 'No preset options available, please enter your custom estimate.',
  },
};

export const ComplexTask: Story = {
  args: {
    question: 'Estimate time for implementing real-time collaboration features?',
    description: 'Include WebSocket setup, conflict resolution, UI updates, and testing. This is a complex feature with many unknowns.',
    value: { value: 4, unit: 'weeks' },
    allowedUnits: ['days', 'weeks', 'months'],
    min: 1,
    max: 6,
    showConfidence: true,
    confidence: 40,
    presets: [
      { label: '1 week', value: { value: 1, unit: 'weeks' as const } },
      { label: '2 weeks', value: { value: 2, unit: 'weeks' as const } },
      { label: '1 month', value: { value: 1, unit: 'months' as const } },
      { label: '2 months', value: { value: 2, unit: 'months' as const } },
    ],
  },
};

export const MobileOptimized: Story = {
  args: {
    ...Default.args,
    question: 'Mobile development estimate?',
    description: 'Optimized for mobile input with larger touch targets.',
    showConfidence: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};