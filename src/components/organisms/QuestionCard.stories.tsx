import type { Meta, StoryObj } from '@storybook/react';
import { QuestionCard, type QuestionData } from './QuestionCard';
import { MultipleChoice } from '../molecules/MultipleChoice';
import { YesNoQuestion } from '../molecules/YesNoQuestion';
import { RatingScale } from '../molecules/RatingScale';
import { TextFeedback } from '../molecules/TextFeedback';
import { DifficultyRating } from '../molecules/DifficultyRating';

const meta: Meta<typeof QuestionCard> = {
  title: 'Organisms/QuestionCard',
  component: QuestionCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive question card container that handles question display, progress tracking, navigation, and validation. Forms the core building block of questionnaire flows.',
      },
    },
  },
  argTypes: {
    currentIndex: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'Current question index (0-based)',
    },
    totalQuestions: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Total number of questions in the questionnaire',
    },
    showProgress: {
      control: 'boolean',
      description: 'Whether to show progress indicator',
    },
    showCounter: {
      control: 'boolean',
      description: 'Whether to show question counter',
    },
    allowSkip: {
      control: 'boolean',
      description: 'Whether to allow skipping questions',
    },
    showPrevious: {
      control: 'boolean',
      description: 'Whether to show previous button',
    },
    showNext: {
      control: 'boolean',
      description: 'Whether to show next button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether navigation is disabled',
    },
    isValidating: {
      control: 'boolean',
      description: 'Whether the question is being validated',
    },
    isFlagged: {
      control: 'boolean',
      description: 'Whether the question is flagged for review',
    },
  },
};

export default meta;
type Story = StoryObj<typeof QuestionCard>;

const sampleQuestions: QuestionData[] = [
  {
    id: 'q1',
    type: 'multiple-choice',
    question: 'What is your preferred programming language?',
    description: 'Select the language you use most frequently for development projects.',
    required: true,
  },
  {
    id: 'q2',
    type: 'yes-no',
    question: 'Do you have experience with TypeScript?',
    description: 'This helps us understand your background with type-safe JavaScript.',
    required: false,
  },
  {
    id: 'q3',
    type: 'rating',
    question: 'How would you rate your React skills?',
    description: 'Rate your confidence level with React development on a scale of 1-10.',
    required: true,
  },
  {
    id: 'q4',
    type: 'text',
    question: 'What is your biggest challenge in web development?',
    description: 'Share any specific areas where you would like to improve or learn more.',
    required: false,
  },
  {
    id: 'q5',
    type: 'difficulty',
    question: 'How difficult is implementing real-time features?',
    description: 'Consider WebSockets, server-sent events, and real-time synchronization.',
    required: true,
  },
];

export const Default: Story = {
  args: {
    question: sampleQuestions[0],
    currentIndex: 0,
    totalQuestions: 5,
    showProgress: true,
    showCounter: true,
    allowSkip: false,
    showPrevious: true,
    showNext: true,
    disabled: false,
    isValidating: false,
    isFlagged: false,
  },
  render: (args) => (
    <QuestionCard {...args}>
      <MultipleChoice
        questionId="q1"
        questionText=""
        options={[
          { id: 'js', label: 'JavaScript' },
          { id: 'ts', label: 'TypeScript' },
          { id: 'python', label: 'Python' },
          { id: 'java', label: 'Java' },
          { id: 'go', label: 'Go' },
        ]}
        onChange={(value) => console.log('Selected:', value)}
      />
    </QuestionCard>
  ),
};

export const WithAnswer: Story = {
  args: {
    ...Default.args,
    value: 'ts',
  },
  render: (args) => (
    <QuestionCard {...args}>
      <MultipleChoice
        questionId="q1"
        questionText=""
        options={[
          { id: 'js', label: 'JavaScript' },
          { id: 'ts', label: 'TypeScript' },
          { id: 'python', label: 'Python' },
          { id: 'java', label: 'Java' },
          { id: 'go', label: 'Go' },
        ]}
        value="ts"
        onChange={(value) => console.log('Selected:', value)}
      />
    </QuestionCard>
  ),
};

export const YesNoQuestion_Story: Story = {
  args: {
    question: sampleQuestions[1],
    currentIndex: 1,
    totalQuestions: 5,
    showProgress: true,
    showCounter: true,
    allowSkip: true,
  },
  render: (args) => (
    <QuestionCard {...args}>
      <YesNoQuestion
        questionId="q2"
        questionText=""
        onChange={(value) => console.log('Selected:', value)}
      />
    </QuestionCard>
  ),
};

export const RatingQuestion: Story = {
  args: {
    question: sampleQuestions[2],
    currentIndex: 2,
    totalQuestions: 5,
    value: 7,
  },
  render: (args) => (
    <QuestionCard {...args}>
      <RatingScale
        questionId="q3"
        questionText=""
        min={1}
        max={10}
        value={7}
        onChange={(value) => console.log('Rating:', value)}
      />
    </QuestionCard>
  ),
};

export const TextQuestion: Story = {
  args: {
    question: sampleQuestions[3],
    currentIndex: 3,
    totalQuestions: 5,
    allowSkip: true,
  },
  render: (args) => (
    <QuestionCard {...args}>
      <TextFeedback
        questionId="q4"
        questionText=""
        placeholder="Share your thoughts..."
        maxLength={500}
        showCharacterCount={true}
        onChange={(value) => console.log('Text:', value)}
      />
    </QuestionCard>
  ),
};

export const DifficultyQuestion: Story = {
  args: {
    question: sampleQuestions[4],
    currentIndex: 4,
    totalQuestions: 5,
    nextButtonText: "Complete",
  },
  render: (args) => (
    <QuestionCard {...args}>
      <DifficultyRating
        question=""
        variant="stars"
        showDescriptions={true}
        onChange={(value) => console.log('Difficulty:', value)}
      />
    </QuestionCard>
  ),
};

export const FirstQuestion: Story = {
  args: {
    ...Default.args,
    currentIndex: 0,
    totalQuestions: 5,
    showPrevious: true, // Will be hidden automatically for first question
  },
  render: Default.render,
};

export const LastQuestion: Story = {
  args: {
    ...Default.args,
    currentIndex: 4,
    totalQuestions: 5,
    nextButtonText: "Complete",
  },
  render: Default.render,
};

export const WithError: Story = {
  args: {
    ...Default.args,
    error: "Please select an option to continue.",
    question: { ...sampleQuestions[0], required: true },
  },
  render: Default.render,
};

export const RequiredQuestion: Story = {
  args: {
    ...Default.args,
    question: { ...sampleQuestions[0], required: true },
  },
  render: Default.render,
};

export const OptionalQuestion: Story = {
  args: {
    ...Default.args,
    question: { ...sampleQuestions[1], required: false },
    allowSkip: true,
  },
  render: (args) => (
    <QuestionCard {...args}>
      <YesNoQuestion
        questionId="q2"
        questionText=""
        allowSkip={true}
        onChange={(value) => console.log('Selected:', value)}
      />
    </QuestionCard>
  ),
};

export const Validating: Story = {
  args: {
    ...Default.args,
    isValidating: true,
    value: 'ts',
  },
  render: Default.render,
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    value: 'python',
  },
  render: Default.render,
};

export const Flagged: Story = {
  args: {
    ...Default.args,
    isFlagged: true,
    value: 'js',
  },
  render: Default.render,
};

export const NoProgress: Story = {
  args: {
    ...Default.args,
    showProgress: false,
    showCounter: false,
  },
  render: Default.render,
};

export const NoNavigation: Story = {
  args: {
    ...Default.args,
    showPrevious: false,
    showNext: false,
    allowSkip: false,
  },
  render: Default.render,
};

export const CustomButtonText: Story = {
  args: {
    ...Default.args,
    nextButtonText: "Continue",
    previousButtonText: "Go Back",
  },
  render: Default.render,
};

export const LongQuestion: Story = {
  args: {
    question: {
      id: 'long',
      type: 'multiple-choice',
      question: 'What are the most important factors when choosing a technology stack for a new project?',
      description: 'Consider factors such as team expertise, project requirements, scalability needs, development speed, long-term maintenance, community support, and integration capabilities. Select the option that best represents your primary consideration when making technology decisions.',
      required: true,
    },
    currentIndex: 2,
    totalQuestions: 8,
  },
  render: (args) => (
    <QuestionCard {...args}>
      <MultipleChoice
        questionId="long"
        questionText=""
        options={[
          { id: 'team', label: 'Team expertise and learning curve' },
          { id: 'performance', label: 'Performance and scalability requirements' },
          { id: 'speed', label: 'Development speed and time to market' },
          { id: 'maintenance', label: 'Long-term maintenance and support' },
          { id: 'ecosystem', label: 'Ecosystem and community support' },
          { id: 'integration', label: 'Integration with existing systems' },
        ]}
        layout="vertical"
        onChange={(value) => console.log('Selected:', value)}
      />
    </QuestionCard>
  ),
};

export const MobileOptimized: Story = {
  args: {
    ...Default.args,
    showCounter: true,
    allowSkip: true,
  },
  render: Default.render,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const InteractiveFlow: Story = {
  render: () => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [answers, setAnswers] = React.useState<Record<string, any>>({});
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const handleNext = () => {
      const current = sampleQuestions[currentIndex];
      if (current.required && !answers[current.id]) {
        setErrors({ [current.id]: 'This question is required.' });
        return;
      }
      setErrors({});
      if (currentIndex < sampleQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };

    const handlePrevious = () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setErrors({});
      }
    };

    const handleSkip = () => {
      setErrors({});
      if (currentIndex < sampleQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };

    const handleChange = (value: any) => {
      setAnswers({ ...answers, [sampleQuestions[currentIndex].id]: value });
      setErrors({});
    };

    return (
      <QuestionCard
        question={sampleQuestions[currentIndex]}
        currentIndex={currentIndex}
        totalQuestions={sampleQuestions.length}
        value={answers[sampleQuestions[currentIndex].id]}
        error={errors[sampleQuestions[currentIndex].id]}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSkip={handleSkip}
        allowSkip={!sampleQuestions[currentIndex].required}
      >
        {currentIndex === 0 && (
          <MultipleChoice
            questionId={sampleQuestions[0].id}
            questionText=""
            options={[
              { id: 'js', label: 'JavaScript' },
              { id: 'ts', label: 'TypeScript' },
              { id: 'python', label: 'Python' },
              { id: 'java', label: 'Java' },
            ]}
            value={answers[sampleQuestions[0].id]}
            onChange={handleChange}
          />
        )}
        {currentIndex === 1 && (
          <YesNoQuestion
            questionId={sampleQuestions[1].id}
            questionText=""
            value={answers[sampleQuestions[1].id]}
            onChange={handleChange}
          />
        )}
        {currentIndex === 2 && (
          <RatingScale
            questionId={sampleQuestions[2].id}
            questionText=""
            min={1}
            max={10}
            value={answers[sampleQuestions[2].id]}
            onChange={handleChange}
          />
        )}
        {currentIndex === 3 && (
          <TextFeedback
            questionId={sampleQuestions[3].id}
            questionText=""
            value={answers[sampleQuestions[3].id]}
            onChange={handleChange}
          />
        )}
        {currentIndex === 4 && (
          <DifficultyRating
            question=""
            value={answers[sampleQuestions[4].id]}
            onChange={handleChange}
          />
        )}
      </QuestionCard>
    );
  },
};