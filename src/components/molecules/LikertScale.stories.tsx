import type { Meta, StoryObj } from '@storybook/react';
import { LikertScale, type LikertOption } from './LikertScale';
import { useState } from 'react';

const meta: Meta<typeof LikertScale> = {
  title: 'Design System/Molecules/LikertScale',
  component: LikertScale,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A Likert scale component for measuring attitudes, opinions, and perceptions. Includes preset scales for common survey types and supports custom options.',
      },
    },
  },
  argTypes: {
    question: {
      control: 'text',
      description: 'The question or statement text',
    },
    description: {
      control: 'text',
      description: 'Optional context or description',
    },
    scaleType: {
      control: 'select',
      options: ['agreement', 'satisfaction', 'frequency', 'importance', 'likelihood', 'custom'],
      description: 'Type of Likert scale to use',
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
    error: {
      control: 'text',
      description: 'Validation error message',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LikertScale>;

// Interactive wrapper for stories
function InteractiveLikert(props: any) {
  const [value, setValue] = useState<number | undefined>();
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
    <LikertScale
      {...props}
      value={value}
      onChange={setValue}
      onSkip={props.allowSkip ? () => setSkipped(true) : undefined}
    />
  );
}

export const Agreement: Story = {
  render: (args) => <InteractiveLikert {...args} />,
  args: {
    question: 'TypeScript improves code quality and developer productivity',
    description: 'Based on your experience working with TypeScript in projects.',
    scaleType: 'agreement',
    layout: 'horizontal',
    size: 'md',
    required: true,
  },
};

export const Satisfaction: Story = {
  render: (args) => <InteractiveLikert {...args} />,
  args: {
    question: 'How satisfied are you with your current development environment?',
    description: 'Consider your IDE, tools, and overall setup.',
    scaleType: 'satisfaction',
    layout: 'horizontal',
    size: 'md',
  },
};

export const Frequency: Story = {
  render: (args) => <InteractiveLikert {...args} />,
  args: {
    question: 'How often do you write unit tests for your code?',
    description: 'Think about your regular development practices.',
    scaleType: 'frequency',
    layout: 'horizontal',
    size: 'md',
  },
};

export const Importance: Story = {
  render: (args) => <InteractiveLikert {...args} />,
  args: {
    question: 'How important is code review in your development process?',
    description: 'Consider the impact on code quality and team collaboration.',
    scaleType: 'importance',
    layout: 'horizontal',
    size: 'md',
  },
};

export const Likelihood: Story = {
  render: (args) => <InteractiveLikert {...args} />,
  args: {
    question: 'How likely are you to adopt a new JavaScript framework?',
    description: 'Consider your willingness to learn and integrate new technologies.',
    scaleType: 'likelihood',
    layout: 'horizontal',
    size: 'md',
  },
};

export const VerticalLayout: Story = {
  render: (args) => <InteractiveLikert {...args} />,
  args: {
    question: 'Remote work has improved my work-life balance',
    description: 'Reflect on your experience with remote work arrangements.',
    scaleType: 'agreement',
    layout: 'vertical',
    size: 'md',
  },
};

export const WithSkipOption: Story = {
  render: (args) => <InteractiveLikert {...args} />,
  args: {
    question: 'Artificial Intelligence will replace most programming jobs',
    description: 'This question is optional and reflects your personal opinion.',
    scaleType: 'agreement',
    layout: 'horizontal',
    size: 'md',
    allowSkip: true,
    required: false,
  },
};

export const CustomScale: Story = {
  render: (args) => <InteractiveLikert {...args} />,
  args: {
    question: 'Rate your experience level with React development',
    description: 'Select the option that best describes your current skill level.',
    scaleType: 'custom',
    customOptions: [
      { value: 1, label: 'Beginner', shortLabel: 'Beginner' },
      { value: 2, label: 'Intermediate', shortLabel: 'Intermediate' },
      { value: 3, label: 'Advanced', shortLabel: 'Advanced' },
      { value: 4, label: 'Expert', shortLabel: 'Expert' },
    ] as LikertOption[],
    layout: 'horizontal',
    size: 'md',
  },
};

export const SmallSize: Story = {
  render: (args) => <InteractiveLikert {...args} />,
  args: {
    question: 'Quick feedback: Was this tutorial helpful?',
    scaleType: 'agreement',
    layout: 'horizontal',
    size: 'sm',
  },
};

export const LargeSize: Story = {
  render: (args) => <InteractiveLikert {...args} />,
  args: {
    question: 'Microservices architecture is suitable for most applications',
    description: 'Consider complexity, team size, and maintenance overhead.',
    scaleType: 'agreement',
    layout: 'horizontal',
    size: 'lg',
  },
};

export const WithValidationError: Story = {
  render: (args) => <InteractiveLikert {...args} />,
  args: {
    question: 'Code reviews should be mandatory for all changes',
    description: 'This question is required to proceed.',
    scaleType: 'agreement',
    layout: 'horizontal',
    size: 'md',
    required: true,
    error: 'Please select your level of agreement to continue.',
  },
};

export const DisabledState: Story = {
  render: (args) => <InteractiveLikert {...args} />,
  args: {
    question: 'Agile methodologies improve development efficiency',
    description: 'This question is currently disabled for demonstration.',
    scaleType: 'agreement',
    layout: 'horizontal',
    size: 'md',
    disabled: true,
  },
};

export const MobileView: Story = {
  render: (args) => <InteractiveLikert {...args} />,
  args: {
    question: 'Mobile-first development should be the default approach',
    description: 'Consider the prevalence of mobile usage.',
    scaleType: 'agreement',
    layout: 'vertical',
    size: 'lg',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Real-world Examples
export const DeveloperSatisfaction = {
  render: () => <InteractiveLikert {...developerSatisfactionArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for measuring developer satisfaction with tools and processes.',
      },
    },
  },
};

const developerSatisfactionArgs = {
  question: 'How satisfied are you with your team\'s deployment process?',
  description: 'Consider speed, reliability, and ease of use of your CI/CD pipeline.',
  scaleType: 'satisfaction',
  layout: 'horizontal',
  size: 'md',
  required: true,
};

export const TechnicalAgreement = {
  render: () => <InteractiveLikert {...technicalAgreementArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for measuring agreement with technical statements.',
      },
    },
  },
};

const technicalAgreementArgs = {
  question: 'Test-driven development leads to better software design',
  description: 'Based on your experience with TDD practices.',
  scaleType: 'agreement',
  layout: 'horizontal',
  size: 'md',
  allowSkip: true,
};

export const FeatureImportance = {
  render: () => <InteractiveLikert {...featureImportanceArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for rating the importance of product features.',
      },
    },
  },
};

const featureImportanceArgs = {
  question: 'How important is real-time collaboration in your code editor?',
  description: 'Features like Live Share, pair programming, and shared editing sessions.',
  scaleType: 'importance',
  layout: 'horizontal',
  size: 'md',
  required: false,
};

export const LearningFrequency = {
  render: () => <InteractiveLikert {...learningFrequencyArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for measuring frequency of learning activities.',
      },
    },
  },
};

const learningFrequencyArgs = {
  question: 'How often do you learn new programming languages or frameworks?',
  description: 'Consider both formal learning and experimentation.',
  scaleType: 'frequency',
  layout: 'horizontal',
  size: 'md',
  allowSkip: false,
};

export const AdoptionLikelihood = {
  render: () => <InteractiveLikert {...adoptionLikelihoodArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for measuring likelihood of technology adoption.',
      },
    },
  },
};

const adoptionLikelihoodArgs = {
  question: 'How likely are you to migrate from REST to GraphQL APIs?',
  description: 'Consider your current project needs and team expertise.',
  scaleType: 'likelihood',
  layout: 'horizontal',
  size: 'md',
  allowSkip: true,
};

export const CustomSkillLevel = {
  render: () => <InteractiveLikert {...customSkillArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example using a custom scale for skill assessment.',
      },
    },
  },
};

const customSkillArgs = {
  question: 'What is your proficiency level with Docker and containerization?',
  description: 'Select the level that best matches your current capabilities.',
  scaleType: 'custom',
  customOptions: [
    { value: 1, label: 'No Experience', shortLabel: 'None' },
    { value: 2, label: 'Basic Understanding', shortLabel: 'Basic' },
    { value: 3, label: 'Can Use Existing Configs', shortLabel: 'User' },
    { value: 4, label: 'Can Create Custom Setups', shortLabel: 'Creator' },
    { value: 5, label: 'Expert Level', shortLabel: 'Expert' },
  ] as LikertOption[],
  layout: 'horizontal',
  size: 'md',
  required: true,
};

export const WorkStylePreference = {
  render: () => <InteractiveLikert {...workStyleArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for measuring work style preferences.',
      },
    },
  },
};

const workStyleArgs = {
  question: 'Pair programming improves code quality more than individual code reviews',
  description: 'Compare the effectiveness of real-time collaboration vs. asynchronous review.',
  scaleType: 'agreement',
  layout: 'vertical',
  size: 'md',
  allowSkip: true,
};