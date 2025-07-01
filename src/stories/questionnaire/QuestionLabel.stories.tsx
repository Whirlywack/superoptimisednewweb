import type { Meta, StoryObj } from '@storybook/react';
import { QuestionLabel, QuestionHeader, QuestionGroup } from '@/components/questionnaire/QuestionLabel';

const meta: Meta<typeof QuestionLabel> = {
  title: 'Questionnaire/Atoms/QuestionLabel',
  component: QuestionLabel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'large', 'compact'],
    },
    alignment: {
      control: 'select',
      options: ['left', 'center'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    question: 'What is your experience with React?',
  },
};

export const WithSubtitle: Story = {
  args: {
    question: 'Rate your satisfaction with our product',
    subtitle: 'Please consider your overall experience over the last 6 months',
  },
};

export const Required: Story = {
  args: {
    question: 'What is your primary programming language?',
    required: true,
    variant: 'default',
  },
};

export const WithHelpText: Story = {
  args: {
    question: 'How often do you deploy to production?',
    helpText: 'Include both scheduled deployments and hotfixes',
    required: true,
  },
};

export const WithQuestionNumber: Story = {
  args: {
    question: 'Which framework do you prefer for frontend development?',
    questionNumber: 3,
    totalQuestions: 10,
  },
};

export const Centered: Story = {
  args: {
    question: 'Welcome to our developer survey',
    subtitle: 'Your feedback helps us improve our tools',
    alignment: 'center',
    variant: 'large',
  },
};

export const LongQuestion: Story = {
  args: {
    question: 'Considering your current development workflow, team collaboration patterns, deployment processes, and overall satisfaction with your current tech stack, how would you rate the importance of automated testing in your daily development process?',
    subtitle: 'This includes unit tests, integration tests, end-to-end tests, and any other automated quality assurance measures',
    helpText: 'Please think about both the time investment and the confidence it provides',
    required: true,
    questionNumber: 7,
    totalQuestions: 15,
  },
};

// QuestionHeader Stories
export const QuestionHeaderStory: Story = {
  render: () => (
    <QuestionHeader
      title="Developer Experience Survey 2024"
      description="Help us understand how developers work today"
    />
  ),
};

export const QuestionHeaderWithProgress: Story = {
  render: () => (
    <QuestionHeader
      title="Technical Preferences"
      description="Section 2 of 4"
      progress={{
        current: 2,
        total: 4,
        showPercentage: true,
      }}
    />
  ),
};

// QuestionGroup Stories
export const QuestionGroupStory: Story = {
  render: () => (
    <QuestionGroup
      label="Development Environment"
      description="Tell us about your current development setup"
    >
      <QuestionLabel
        question="What operating system do you primarily use for development?"
        required={true}
      />
      <QuestionLabel
        question="Which code editor or IDE do you prefer?"
        helpText="Select your most frequently used editor"
      />
      <QuestionLabel
        question="How many hours per week do you spend coding?"
        subtitle="Include both work and personal projects"
      />
    </QuestionGroup>
  ),
};

export const NestedQuestionGroup: Story = {
  render: () => (
    <QuestionGroup
      label="Framework Experience"
      description="Rate your experience with different frontend frameworks"
      spacing="loose"
    >
      <QuestionLabel
        question="React"
        questionNumber={1}
        totalQuestions={3}
      />
      <QuestionLabel
        question="Vue.js"
        questionNumber={2}
        totalQuestions={3}
      />
      <QuestionLabel
        question="Angular"
        questionNumber={3}
        totalQuestions={3}
      />
    </QuestionGroup>
  ),
};