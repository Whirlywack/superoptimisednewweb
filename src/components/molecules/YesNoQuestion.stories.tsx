import type { Meta, StoryObj } from '@storybook/react';
import { YesNoQuestion } from './YesNoQuestion';
import { useState } from 'react';

const meta: Meta<typeof YesNoQuestion> = {
  title: 'Design System/Molecules/YesNoQuestion',
  component: YesNoQuestion,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A binary decision question component with optional "unsure" option. Perfect for simple yes/no questions, feature preferences, and decision-making scenarios.',
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
    required: {
      control: 'boolean',
      description: 'Whether the question is required',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the question is disabled',
    },
    showUnsure: {
      control: 'boolean',
      description: 'Whether to show the "unsure" option',
    },
    allowSkip: {
      control: 'boolean',
      description: 'Whether to show skip option',
    },
    layout: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Layout arrangement for options',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of option buttons',
    },
    error: {
      control: 'text',
      description: 'Validation error message',
    },
  },
};

export default meta;
type Story = StoryObj<typeof YesNoQuestion>;

// Interactive wrapper for stories
function InteractiveYesNo(props: any) {
  const [value, setValue] = useState<'yes' | 'no' | 'unsure' | undefined>();
  const [skipped, setSkipped] = useState(false);

  if (skipped) {
    return (
      <div className="text-center p-8 bg-light-gray rounded-lg">
        <p className="text-warm-gray">Question skipped</p>
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
    <YesNoQuestion
      {...props}
      value={value}
      onChange={setValue}
      onSkip={props.allowSkip ? () => setSkipped(true) : undefined}
    />
  );
}

export const Default: Story = {
  render: (args) => <InteractiveYesNo {...args} />,
  args: {
    question: 'Do you enjoy working with TypeScript?',
    description: 'TypeScript adds static type checking to JavaScript.',
    required: true,
    showUnsure: true,
    layout: 'horizontal',
    size: 'md',
  },
};

export const WithoutUnsure: Story = {
  render: (args) => <InteractiveYesNo {...args} />,
  args: {
    question: 'Have you used React hooks in production?',
    description: 'React hooks were introduced in React 16.8.',
    showUnsure: false,
    layout: 'horizontal',
    size: 'md',
    required: true,
  },
};

export const VerticalLayout: Story = {
  render: (args) => <InteractiveYesNo {...args} />,
  args: {
    question: 'Would you recommend Next.js for new projects?',
    description: 'Consider your experience with the framework and its ecosystem.',
    layout: 'vertical',
    size: 'md',
    showUnsure: true,
  },
};

export const WithSkipOption: Story = {
  render: (args) => <InteractiveYesNo {...args} />,
  args: {
    question: 'Do you prefer working remotely?',
    description: 'This question is optional and can be skipped.',
    allowSkip: true,
    layout: 'horizontal',
    size: 'md',
    required: false,
  },
};

export const CustomLabels: Story = {
  render: (args) => <InteractiveYesNo {...args} />,
  args: {
    question: 'How do you feel about the new design?',
    description: 'Your feedback helps us improve the user experience.',
    labels: {
      yes: 'Love it! 👍',
      no: 'Not a fan 👎',
      unsure: 'Need more time 🤔'
    },
    layout: 'horizontal',
    size: 'md',
  },
};

export const SmallSize: Story = {
  render: (args) => <InteractiveYesNo {...args} />,
  args: {
    question: 'Quick question: Is this helpful?',
    size: 'sm',
    layout: 'horizontal',
    showUnsure: false,
  },
};

export const LargeSize: Story = {
  render: (args) => <InteractiveYesNo {...args} />,
  args: {
    question: 'Would you be interested in beta testing new features?',
    description: 'Beta testers get early access to new functionality and help shape the product.',
    size: 'lg',
    layout: 'horizontal',
    showUnsure: true,
  },
};

export const WithValidationError: Story = {
  render: (args) => <InteractiveYesNo {...args} />,
  args: {
    question: 'Do you agree to the terms and conditions?',
    description: 'You must accept the terms to continue.',
    required: true,
    showUnsure: false,
    error: 'Please accept the terms and conditions to proceed.',
    layout: 'horizontal',
    size: 'md',
  },
};

export const DisabledState: Story = {
  render: (args) => <InteractiveYesNo {...args} />,
  args: {
    question: 'Are you satisfied with the current performance?',
    description: 'This question is currently disabled for demonstration.',
    disabled: true,
    layout: 'horizontal',
    size: 'md',
  },
};

export const MobileView: Story = {
  render: (args) => <InteractiveYesNo {...args} />,
  args: {
    question: 'Do you primarily code on mobile devices?',
    description: 'This includes tablets and smartphones.',
    layout: 'vertical',
    size: 'lg',
    showUnsure: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Real-world Examples
export const FeatureRequest = {
  render: () => <InteractiveYesNo {...featureRequestArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for collecting feature preference feedback.',
      },
    },
  },
};

const featureRequestArgs = {
  question: 'Would you use a dark mode feature?',
  description: 'Dark mode reduces eye strain and saves battery on OLED screens.',
  layout: 'horizontal',
  size: 'md',
  showUnsure: true,
  allowSkip: false,
  required: false,
};

export const TechnicalPreference = {
  render: () => <InteractiveYesNo {...technicalPreferenceArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for technical preference questions.',
      },
    },
  },
};

const technicalPreferenceArgs = {
  question: 'Do you prefer functional programming over object-oriented programming?',
  description: 'Consider your experience and the types of projects you work on.',
  layout: 'horizontal',
  size: 'md',
  showUnsure: true,
  labels: {
    yes: 'Prefer Functional',
    no: 'Prefer OOP',
    unsure: 'Depends on Context'
  },
  allowSkip: true,
};

export const ConsentQuestion = {
  render: () => <InteractiveYesNo {...consentArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for consent and agreement questions.',
      },
    },
  },
};

const consentArgs = {
  question: 'Can we send you occasional updates about new features?',
  description: 'We respect your privacy and won\'t spam you. You can unsubscribe anytime.',
  layout: 'horizontal',
  size: 'md',
  showUnsure: false,
  labels: {
    yes: 'Yes, keep me updated',
    no: 'No, thanks'
  },
  required: true,
};

export const ExperienceQuestion = {
  render: () => <InteractiveYesNo {...experienceArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for experience-based questions.',
      },
    },
  },
};

const experienceArgs = {
  question: 'Have you ever contributed to open source projects?',
  description: 'This includes code contributions, documentation, or issue reporting.',
  layout: 'horizontal',
  size: 'md',
  showUnsure: true,
  labels: {
    yes: 'Yes, I have',
    no: 'No, not yet',
    unsure: 'Planning to'
  },
  allowSkip: true,
};

export const QuickFeedback = {
  render: () => <InteractiveYesNo {...quickFeedbackArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for quick feedback collection.',
      },
    },
  },
};

const quickFeedbackArgs = {
  question: 'Was this tutorial helpful?',
  description: 'Your feedback helps us create better content.',
  layout: 'horizontal',
  size: 'sm',
  showUnsure: false,
  labels: {
    yes: '👍 Helpful',
    no: '👎 Not helpful'
  },
  allowSkip: true,
  required: false,
};

export const LongQuestion = {
  render: () => <InteractiveYesNo {...longQuestionArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Example with longer question text and detailed description.',
      },
    },
  },
};

const longQuestionArgs = {
  question: 'Based on your experience, would you recommend implementing a microservices architecture for a team of 5-10 developers working on a customer-facing web application?',
  description: 'Consider factors like team size, complexity requirements, deployment overhead, and long-term maintainability when making your decision.',
  layout: 'vertical',
  size: 'md',
  showUnsure: true,
  labels: {
    yes: 'Yes, recommend microservices',
    no: 'No, stick with monolith',
    unsure: 'Depends on specific requirements'
  },
  allowSkip: true,
};