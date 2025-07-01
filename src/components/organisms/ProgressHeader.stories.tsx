import type { Meta, StoryObj } from '@storybook/react';
import { ProgressHeader, type QuestionProgress } from './ProgressHeader';

const meta: Meta<typeof ProgressHeader> = {
  title: 'Organisms/ProgressHeader',
  component: ProgressHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive progress header for questionnaires that shows completion status, question overview, time tracking, and navigation controls.',
      },
    },
  },
  argTypes: {
    currentIndex: {
      control: { type: 'number', min: 0, max: 20 },
      description: 'Current question index (0-based)',
    },
    totalQuestions: {
      control: { type: 'number', min: 1, max: 50 },
      description: 'Total number of questions',
    },
    completionPercentage: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Overall completion percentage (0-100)',
    },
    showDetailedProgress: {
      control: 'boolean',
      description: 'Whether to show detailed question overview',
    },
    showTimeIndicators: {
      control: 'boolean',
      description: 'Whether to show time tracking information',
    },
    showSaveStatus: {
      control: 'boolean',
      description: 'Whether to show save status and controls',
    },
    showExit: {
      control: 'boolean',
      description: 'Whether to show exit option',
    },
    collapsible: {
      control: 'boolean',
      description: 'Whether the header is collapsible on mobile',
    },
    autoSaveEnabled: {
      control: 'boolean',
      description: 'Whether auto-save is enabled',
    },
    hasErrors: {
      control: 'boolean',
      description: 'Whether there are validation errors',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressHeader>;

const sampleQuestionProgress: QuestionProgress[] = [
  {
    id: 'q1',
    title: 'Programming Language Preference',
    isCompleted: true,
    isCurrent: false,
    isFlagged: false,
    isSkipped: false,
    hasError: false,
    isOptional: false,
  },
  {
    id: 'q2',
    title: 'Experience with React',
    isCompleted: true,
    isCurrent: false,
    isFlagged: false,
    isSkipped: false,
    hasError: false,
    isOptional: true,
  },
  {
    id: 'q3',
    title: 'Rate Your Skills',
    isCompleted: false,
    isCurrent: true,
    isFlagged: false,
    isSkipped: false,
    hasError: false,
    isOptional: false,
  },
  {
    id: 'q4',
    title: 'Development Challenges',
    isCompleted: false,
    isCurrent: false,
    isFlagged: true,
    isSkipped: false,
    hasError: false,
    isOptional: true,
  },
  {
    id: 'q5',
    title: 'Project Architecture',
    isCompleted: false,
    isCurrent: false,
    isFlagged: false,
    isSkipped: false,
    hasError: false,
    isOptional: false,
  },
  {
    id: 'q6',
    title: 'Time Estimation',
    isCompleted: false,
    isCurrent: false,
    isFlagged: false,
    isSkipped: false,
    hasError: true,
    isOptional: false,
  },
];

export const Default: Story = {
  args: {
    title: 'Developer Assessment',
    subtitle: 'Help us understand your programming background and preferences',
    currentIndex: 2,
    totalQuestions: 6,
    showDetailedProgress: false,
    showTimeIndicators: true,
    showSaveStatus: true,
    showExit: true,
    collapsible: true,
    autoSaveEnabled: false,
    hasErrors: false,
  },
};

export const WithDetailedProgress: Story = {
  args: {
    ...Default.args,
    showDetailedProgress: true,
    questionProgress: sampleQuestionProgress,
  },
};

export const WithTimeTracking: Story = {
  args: {
    ...Default.args,
    timeElapsed: '5m 32s',
    estimatedTimeRemaining: '3m 15s',
    lastSaved: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    autoSaveEnabled: true,
  },
};

export const WithErrors: Story = {
  args: {
    ...Default.args,
    hasErrors: true,
    showDetailedProgress: true,
    questionProgress: sampleQuestionProgress,
  },
};

export const HighProgress: Story = {
  args: {
    title: 'Technical Questionnaire',
    subtitle: 'Almost complete! Just a few more questions.',
    currentIndex: 8,
    totalQuestions: 10,
    completionPercentage: 85,
    timeElapsed: '12m 45s',
    estimatedTimeRemaining: '2m 30s',
    showDetailedProgress: true,
    autoSaveEnabled: true,
    lastSaved: new Date(Date.now() - 30 * 1000), // 30 seconds ago
    questionProgress: [
      ...sampleQuestionProgress.map(q => ({ ...q, isCompleted: true, isCurrent: false })),
      {
        id: 'q7',
        title: 'Tech Debt Tolerance',
        isCompleted: true,
        isCurrent: false,
        isFlagged: false,
        isSkipped: false,
        hasError: false,
        isOptional: false,
      },
      {
        id: 'q8',
        title: 'Difficulty Assessment',
        isCompleted: true,
        isCurrent: false,
        isFlagged: false,
        isSkipped: false,
        hasError: false,
        isOptional: false,
      },
      {
        id: 'q9',
        title: 'Team Collaboration',
        isCompleted: false,
        isCurrent: true,
        isFlagged: false,
        isSkipped: false,
        hasError: false,
        isOptional: false,
      },
      {
        id: 'q10',
        title: 'Final Feedback',
        isCompleted: false,
        isCurrent: false,
        isFlagged: false,
        isSkipped: false,
        hasError: false,
        isOptional: true,
      },
    ],
  },
};

export const JustStarted: Story = {
  args: {
    title: 'Welcome Survey',
    subtitle: 'Tell us about yourself to get started',
    currentIndex: 0,
    totalQuestions: 5,
    completionPercentage: 0,
    timeElapsed: '12s',
    showDetailedProgress: false,
    autoSaveEnabled: false,
  },
};

export const WithFlaggedQuestions: Story = {
  args: {
    ...Default.args,
    showDetailedProgress: true,
    questionProgress: sampleQuestionProgress.map((q, index) => ({
      ...q,
      isFlagged: index === 1 || index === 3,
    })),
  },
};

export const MultipleErrors: Story = {
  args: {
    title: 'Form Validation Required',
    subtitle: 'Please review and correct the highlighted issues',
    currentIndex: 5,
    totalQuestions: 8,
    hasErrors: true,
    showDetailedProgress: true,
    questionProgress: [
      ...sampleQuestionProgress.slice(0, 3).map(q => ({ ...q, isCompleted: true, isCurrent: false })),
      {
        id: 'q4',
        title: 'Email Address',
        isCompleted: false,
        isCurrent: false,
        isFlagged: false,
        isSkipped: false,
        hasError: true,
        isOptional: false,
      },
      {
        id: 'q5',
        title: 'Phone Number',
        isCompleted: false,
        isCurrent: false,
        isFlagged: false,
        isSkipped: false,
        hasError: true,
        isOptional: false,
      },
      {
        id: 'q6',
        title: 'Current Question',
        isCompleted: false,
        isCurrent: true,
        isFlagged: false,
        isSkipped: false,
        hasError: false,
        isOptional: false,
      },
      {
        id: 'q7',
        title: 'Additional Info',
        isCompleted: false,
        isCurrent: false,
        isFlagged: false,
        isSkipped: false,
        hasError: false,
        isOptional: true,
      },
      {
        id: 'q8',
        title: 'Final Review',
        isCompleted: false,
        isCurrent: false,
        isFlagged: false,
        isSkipped: false,
        hasError: false,
        isOptional: false,
      },
    ],
  },
};

export const NoActions: Story = {
  args: {
    ...Default.args,
    showExit: false,
    showSaveStatus: false,
    showTimeIndicators: false,
  },
};

export const LongQuestionnaire: Story = {
  args: {
    title: 'Comprehensive Developer Survey',
    subtitle: 'In-depth assessment of your technical skills and preferences',
    currentIndex: 15,
    totalQuestions: 25,
    completionPercentage: 60,
    timeElapsed: '18m 23s',
    estimatedTimeRemaining: '8m 45s',
    autoSaveEnabled: true,
    lastSaved: new Date(Date.now() - 45 * 1000),
    showDetailedProgress: true,
    questionProgress: Array.from({ length: 25 }, (_, index) => ({
      id: `q${index + 1}`,
      title: `Question ${index + 1}`,
      isCompleted: index < 15,
      isCurrent: index === 15,
      isFlagged: index === 8 || index === 12,
      isSkipped: index === 7,
      hasError: index === 5,
      isOptional: index % 5 === 4, // Every 5th question is optional
    })),
  },
};

export const MobileCollapsed: Story = {
  args: {
    ...Default.args,
    showDetailedProgress: true,
    questionProgress: sampleQuestionProgress,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const InteractiveDemo: Story = {
  render: () => {
    const [currentIndex, setCurrentIndex] = React.useState(2);
    const [questionProgress, setQuestionProgress] = React.useState<QuestionProgress[]>(sampleQuestionProgress);
    const [timeElapsed, setTimeElapsed] = React.useState('5m 32s');
    const [lastSaved, setLastSaved] = React.useState<Date>(new Date(Date.now() - 2 * 60 * 1000));

    const handleQuestionClick = (questionId: string, index: number) => {
      console.log('Navigate to question:', { questionId, index });
      
      // Update progress state
      const newProgress = questionProgress.map((q, i) => ({
        ...q,
        isCurrent: i === index,
      }));
      
      setQuestionProgress(newProgress);
      setCurrentIndex(index);
    };

    const handleSave = () => {
      console.log('Manual save triggered');
      setLastSaved(new Date());
    };

    const handleExit = () => {
      console.log('Exit questionnaire');
      alert('Are you sure you want to exit? Your progress will be saved.');
    };

    const handleRestart = () => {
      console.log('Restart questionnaire');
      if (confirm('Are you sure you want to restart? All progress will be lost.')) {
        setCurrentIndex(0);
        setQuestionProgress(prev => prev.map((q, i) => ({
          ...q,
          isCompleted: false,
          isCurrent: i === 0,
          hasError: false,
        })));
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <ProgressHeader
          title="Interactive Demo"
          subtitle="Click on questions to navigate, try the controls"
          currentIndex={currentIndex}
          totalQuestions={questionProgress.length}
          questionProgress={questionProgress}
          timeElapsed={timeElapsed}
          estimatedTimeRemaining="3m 15s"
          lastSaved={lastSaved}
          showDetailedProgress={true}
          showTimeIndicators={true}
          showSaveStatus={true}
          showExit={true}
          autoSaveEnabled={false}
          onQuestionClick={handleQuestionClick}
          onSave={handleSave}
          onExit={handleExit}
          onRestart={handleRestart}
        />
        
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Current Question: {questionProgress[currentIndex]?.title}
            </h2>
            <p className="text-gray-600 mb-4">
              This is a demo of the interactive progress header. Try clicking on different questions
              in the overview above to navigate between them.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div>• Click on question cards to jump to specific questions</div>
              <div>• Use the Save button to update the last saved time</div>
              <div>• Try the Exit and Restart options</div>
              <div>• Resize the window to see mobile responsive behavior</div>
            </div>
          </div>
        </div>
      </div>
    );
  },
};