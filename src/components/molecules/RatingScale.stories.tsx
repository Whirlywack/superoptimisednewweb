import type { Meta, StoryObj } from '@storybook/react';
import { RatingScale } from './RatingScale';
import { useState } from 'react';

const meta: Meta<typeof RatingScale> = {
  title: 'Design System/Molecules/RatingScale',
  component: RatingScale,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A numeric rating scale component with customizable range and labels. Perfect for satisfaction surveys, quality assessments, and preference ratings.',
      },
    },
  },
  argTypes: {
    question: {
      control: 'text',
      description: 'The main question text',
    },
    description: {
      control: 'text',
      description: 'Optional context or description',
    },
    min: {
      control: 'number',
      description: 'Minimum rating value',
    },
    max: {
      control: 'number',
      description: 'Maximum rating value',
    },
    step: {
      control: 'number',
      description: 'Step increment for ratings',
    },
    required: {
      control: 'boolean',
      description: 'Whether the question is required',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the question is disabled',
    },
    allowSkip: {
      control: 'boolean',
      description: 'Whether to show skip option',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the rating buttons',
    },
    showNumbers: {
      control: 'boolean',
      description: 'Whether to show numbers on buttons',
    },
    error: {
      control: 'text',
      description: 'Validation error message',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RatingScale>;

// Interactive wrapper for stories
function InteractiveRatingScale(props: any) {
  const [value, setValue] = useState<number | undefined>();
  const [skipped, setSkipped] = useState(false);

  if (skipped) {
    return (
      <div className="text-center p-8 bg-light-gray rounded-lg">
        <p className="text-warm-gray">Rating skipped</p>
        <button 
          onClick={() => {
            setSkipped(false);
            setValue(undefined);
          }}
          className="mt-2 text-primary text-sm hover:underline"
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <RatingScale
      {...props}
      value={value}
      onChange={setValue}
      onSkip={props.allowSkip ? () => setSkipped(true) : undefined}
    />
  );
}

export const Default: Story = {
  render: (args) => <InteractiveRatingScale {...args} />,
  args: {
    question: 'How satisfied are you with your current development tools?',
    description: 'Rate from 1 (very unsatisfied) to 10 (very satisfied).',
    min: 1,
    max: 10,
    labels: {
      min: 'Very Unsatisfied',
      max: 'Very Satisfied'
    },
    required: true,
    size: 'md',
    showNumbers: true,
  },
};

export const FivePointScale: Story = {
  render: (args) => <InteractiveRatingScale {...args} />,
  args: {
    question: 'How likely are you to recommend this product?',
    description: 'Please rate on a scale of 1 to 5.',
    min: 1,
    max: 5,
    labels: {
      min: 'Not likely',
      max: 'Very likely'
    },
    size: 'md',
    showNumbers: true,
  },
};

export const NPSScore: Story = {
  render: (args) => <InteractiveRatingScale {...args} />,
  args: {
    question: 'How likely are you to recommend our service to a friend or colleague?',
    description: 'Net Promoter Score (NPS) - 0 means not at all likely, 10 means extremely likely.',
    min: 0,
    max: 10,
    labels: {
      min: 'Not at all likely',
      max: 'Extremely likely'
    },
    size: 'md',
    showNumbers: true,
    required: true,
  },
};

export const WithSkipOption: Story = {
  render: (args) => <InteractiveRatingScale {...args} />,
  args: {
    question: 'Rate the difficulty of this tutorial',
    description: 'This rating is optional and helps us improve our content.',
    min: 1,
    max: 5,
    labels: {
      min: 'Very Easy',
      max: 'Very Difficult'
    },
    allowSkip: true,
    size: 'md',
  },
};

export const SmallSize: Story = {
  render: (args) => <InteractiveRatingScale {...args} />,
  args: {
    question: 'Quick rating: How was your experience?',
    min: 1,
    max: 5,
    size: 'sm',
    showNumbers: true,
  },
};

export const LargeSize: Story = {
  render: (args) => <InteractiveRatingScale {...args} />,
  args: {
    question: 'Please rate the overall quality of this course',
    description: 'Your feedback helps us maintain high standards.',
    min: 1,
    max: 10,
    labels: {
      min: 'Poor Quality',
      max: 'Excellent Quality'
    },
    size: 'lg',
    showNumbers: true,
  },
};

export const WithoutNumbers: Story = {
  render: (args) => <InteractiveRatingScale {...args} />,
  args: {
    question: 'Rate your agreement with this statement',
    description: 'Numbers are shown below the scale instead of on the buttons.',
    min: 1,
    max: 7,
    labels: {
      min: 'Strongly Disagree',
      max: 'Strongly Agree'
    },
    showNumbers: false,
    size: 'md',
  },
};

export const CustomRange: Story = {
  render: (args) => <InteractiveRatingScale {...args} />,
  args: {
    question: 'How many years of experience do you have?',
    description: 'Select the range that best represents your experience level.',
    min: 0,
    max: 20,
    step: 5,
    labels: {
      min: 'Beginner',
      max: 'Expert'
    },
    size: 'md',
    showNumbers: true,
  },
};

export const WithValidationError: Story = {
  render: (args) => <InteractiveRatingScale {...args} />,
  args: {
    question: 'Rate the importance of this feature',
    description: 'This rating is required to proceed.',
    min: 1,
    max: 5,
    labels: {
      min: 'Not Important',
      max: 'Very Important'
    },
    required: true,
    error: 'Please provide a rating to continue.',
    size: 'md',
  },
};

export const DisabledState: Story = {
  render: (args) => <InteractiveRatingScale {...args} />,
  args: {
    question: 'Rate your satisfaction with the support team',
    description: 'This rating is currently disabled for demonstration.',
    min: 1,
    max: 10,
    labels: {
      min: 'Very Unsatisfied',
      max: 'Very Satisfied'
    },
    disabled: true,
    size: 'md',
  },
};

export const MobileView: Story = {
  render: (args) => <InteractiveRatingScale {...args} />,
  args: {
    question: 'How easy is it to use our mobile app?',
    description: 'Rate the user experience on mobile devices.',
    min: 1,
    max: 5,
    labels: {
      min: 'Very Difficult',
      max: 'Very Easy'
    },
    size: 'lg',
    showNumbers: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Real-world Examples
export const PerformanceRating = {
  render: () => <InteractiveRatingScale {...performanceArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for rating application performance.',
      },
    },
  },
};

const performanceArgs = {
  question: 'How would you rate the application\'s performance?',
  description: 'Consider loading times, responsiveness, and overall speed.',
  min: 1,
  max: 10,
  labels: {
    min: 'Very Slow',
    max: 'Lightning Fast'
  },
  size: 'md',
  showNumbers: true,
  required: true,
};

export const CodeQualityAssessment = {
  render: () => <InteractiveRatingScale {...codeQualityArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for assessing code quality.',
      },
    },
  },
};

const codeQualityArgs = {
  question: 'Rate the code quality of this open source project',
  description: 'Consider factors like readability, organization, documentation, and best practices.',
  min: 1,
  max: 5,
  labels: {
    min: 'Needs Improvement',
    max: 'Excellent'
  },
  size: 'md',
  showNumbers: true,
  allowSkip: true,
};

export const FeaturePriority = {
  render: () => <InteractiveRatingScale {...featurePriorityArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for rating feature importance.',
      },
    },
  },
};

const featurePriorityArgs = {
  question: 'How important is dark mode support for your workflow?',
  description: 'Help us prioritize features by rating their importance to you.',
  min: 1,
  max: 5,
  labels: {
    min: 'Not Important',
    max: 'Critical'
  },
  size: 'md',
  showNumbers: true,
  required: false,
};

export const LearningDifficulty = {
  render: () => <InteractiveRatingScale {...learningDifficultyArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for rating learning difficulty.',
      },
    },
  },
};

const learningDifficultyArgs = {
  question: 'How difficult was it to learn this new technology?',
  description: 'Rate based on your experience coming from your previous tech stack.',
  min: 1,
  max: 10,
  labels: {
    min: 'Very Easy',
    max: 'Very Difficult'
  },
  size: 'md',
  showNumbers: true,
  allowSkip: true,
};

export const TeamCollaboration = {
  render: () => <InteractiveRatingScale {...teamCollaborationArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for rating team collaboration tools.',
      },
    },
  },
};

const teamCollaborationArgs = {
  question: 'Rate the effectiveness of your team\'s collaboration tools',
  description: 'Consider communication, project management, and code collaboration tools.',
  min: 1,
  max: 10,
  labels: {
    min: 'Ineffective',
    max: 'Highly Effective'
  },
  size: 'md',
  showNumbers: true,
  required: true,
};

export const DocumentationQuality = {
  render: () => <InteractiveRatingScale {...documentationArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for rating documentation quality.',
      },
    },
  },
};

const documentationArgs = {
  question: 'How would you rate the quality of our API documentation?',
  description: 'Consider clarity, completeness, examples, and ease of navigation.',
  min: 1,
  max: 5,
  labels: {
    min: 'Poor',
    max: 'Excellent'
  },
  size: 'md',
  showNumbers: true,
  allowSkip: false,
  required: true,
};