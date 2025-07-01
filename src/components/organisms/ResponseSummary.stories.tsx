import type { Meta, StoryObj } from '@storybook/react';
import { ResponseSummary, type ResponseData, type SummaryStats } from './ResponseSummary';

const meta: Meta<typeof ResponseSummary> = {
  title: 'Organisms/ResponseSummary',
  component: ResponseSummary,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive response summary component that displays completed questionnaire responses with statistics, grouping, and management features.',
      },
    },
  },
  argTypes: {
    groupByCategory: {
      control: 'boolean',
      description: 'Whether to group responses by category or status',
    },
    showTimeSpent: {
      control: 'boolean',
      description: 'Whether to show time spent per question',
    },
    showConfidence: {
      control: 'boolean',
      description: 'Whether to show confidence levels',
    },
    showQuestionNumbers: {
      control: 'boolean',
      description: 'Whether to show question numbers',
    },
    allowEdit: {
      control: 'boolean',
      description: 'Whether to allow editing responses',
    },
    allowFlag: {
      control: 'boolean',
      description: 'Whether to allow flagging responses',
    },
    showDetailedAnswers: {
      control: 'boolean',
      description: 'Whether to show full answer text or truncated',
    },
    showExportOptions: {
      control: 'boolean',
      description: 'Whether to show export functionality',
    },
    showPrivacyControls: {
      control: 'boolean',
      description: 'Whether to show privacy controls',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether responses are in read-only mode',
    },
    showErrors: {
      control: 'boolean',
      description: 'Whether to show validation errors',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ResponseSummary>;

const sampleResponses: ResponseData[] = [
  {
    questionId: 'q1',
    questionText: 'What is your primary programming language?',
    questionType: 'multiple-choice',
    answer: 'TypeScript',
    isRequired: true,
    isCompleted: true,
    isFlagged: false,
    isSkipped: false,
    hasError: false,
    timestamp: new Date('2024-01-15T10:30:00'),
    timeSpent: 25,
    confidence: 95,
    category: 'Technical Skills',
  },
  {
    questionId: 'q2',
    questionText: 'Do you have experience with React?',
    questionType: 'yes-no',
    answer: 'yes',
    isRequired: false,
    isCompleted: true,
    isFlagged: false,
    isSkipped: false,
    hasError: false,
    timestamp: new Date('2024-01-15T10:31:00'),
    timeSpent: 15,
    confidence: 100,
    category: 'Technical Skills',
  },
  {
    questionId: 'q3',
    questionText: 'Rate your overall programming experience',
    questionType: 'rating',
    answer: 8,
    isRequired: true,
    isCompleted: true,
    isFlagged: false,
    isSkipped: false,
    hasError: false,
    timestamp: new Date('2024-01-15T10:32:00'),
    timeSpent: 20,
    confidence: 80,
    category: 'Technical Skills',
  },
  {
    questionId: 'q4',
    questionText: 'What motivates you most about programming?',
    questionType: 'text',
    answer: 'I love solving complex problems and seeing how my code can make a real impact on users. The continuous learning aspect keeps me engaged.',
    isRequired: false,
    isCompleted: true,
    isFlagged: true,
    isSkipped: false,
    hasError: false,
    timestamp: new Date('2024-01-15T10:35:00'),
    timeSpent: 180,
    confidence: 70,
    category: 'Personal',
  },
  {
    questionId: 'q5',
    questionText: 'How long would it take you to build a REST API?',
    questionType: 'time-estimate',
    answer: { value: 2, unit: 'days' },
    isRequired: true,
    isCompleted: true,
    isFlagged: false,
    isSkipped: false,
    hasError: false,
    timestamp: new Date('2024-01-15T10:37:00'),
    timeSpent: 45,
    confidence: 85,
    category: 'Technical Skills',
  },
  {
    questionId: 'q6',
    questionText: 'What is your email address?',
    questionType: 'text',
    answer: 'invalid-email',
    isRequired: true,
    isCompleted: false,
    isFlagged: false,
    isSkipped: false,
    hasError: true,
    errorMessage: 'Please enter a valid email address',
    timestamp: new Date('2024-01-15T10:38:00'),
    timeSpent: 30,
    category: 'Contact',
  },
  {
    questionId: 'q7',
    questionText: 'Any additional comments?',
    questionType: 'text',
    answer: '',
    isRequired: false,
    isCompleted: false,
    isFlagged: false,
    isSkipped: true,
    hasError: false,
    category: 'Personal',
  },
  {
    questionId: 'q8',
    questionText: 'Rank these technologies by preference',
    questionType: 'ranking',
    answer: ['React', 'TypeScript', 'Node.js', 'Python'],
    isRequired: true,
    isCompleted: true,
    isFlagged: false,
    isSkipped: false,
    hasError: false,
    timestamp: new Date('2024-01-15T10:40:00'),
    timeSpent: 90,
    confidence: 75,
    category: 'Technical Skills',
  },
];

const sampleStats: SummaryStats = {
  totalQuestions: 8,
  completedQuestions: 6,
  skippedQuestions: 1,
  flaggedQuestions: 1,
  questionsWithErrors: 1,
  totalTimeSpent: 405, // ~7 minutes
  averageConfidence: 84,
  completionPercentage: 75,
};

export const Default: Story = {
  args: {
    responses: sampleResponses,
    stats: sampleStats,
    title: 'Developer Assessment Summary',
    subtitle: 'Review your responses before final submission',
    groupByCategory: false,
    showTimeSpent: true,
    showConfidence: true,
    showQuestionNumbers: true,
    allowEdit: true,
    allowFlag: true,
    showDetailedAnswers: true,
    showExportOptions: false,
    showPrivacyControls: false,
    readOnly: false,
    showErrors: true,
  },
};

export const GroupedByCategory: Story = {
  args: {
    ...Default.args,
    groupByCategory: true,
    title: 'Responses by Category',
    subtitle: 'Your responses organized by topic area',
  },
};

export const ReadOnlyMode: Story = {
  args: {
    ...Default.args,
    readOnly: true,
    allowEdit: false,
    allowFlag: false,
    title: 'Assessment Results',
    subtitle: 'Final submitted responses - no changes allowed',
  },
};

export const WithExportOptions: Story = {
  args: {
    ...Default.args,
    showExportOptions: true,
    showPrivacyControls: true,
    title: 'Export Your Responses',
    subtitle: 'Download or share your questionnaire results',
  },
};

export const MinimalView: Story = {
  args: {
    responses: sampleResponses,
    stats: sampleStats,
    title: 'Quick Summary',
    groupByCategory: false,
    showTimeSpent: false,
    showConfidence: false,
    showQuestionNumbers: false,
    allowEdit: false,
    allowFlag: false,
    showDetailedAnswers: false,
    showExportOptions: false,
    showPrivacyControls: false,
    readOnly: true,
    showErrors: false,
  },
};

export const HighCompletion: Story = {
  args: {
    responses: sampleResponses.map(r => ({ ...r, isCompleted: true, hasError: false, isSkipped: false })),
    stats: {
      ...sampleStats,
      completedQuestions: 8,
      questionsWithErrors: 0,
      skippedQuestions: 0,
      completionPercentage: 100,
    },
    title: 'Perfect Score!',
    subtitle: 'All questions completed successfully',
    groupByCategory: true,
  },
};

export const ManyErrors: Story = {
  args: {
    responses: sampleResponses.map((r, index) => ({
      ...r,
      hasError: index % 2 === 0,
      errorMessage: index % 2 === 0 ? 'This field requires attention' : undefined,
      isCompleted: index % 2 !== 0,
    })),
    stats: {
      ...sampleStats,
      completedQuestions: 4,
      questionsWithErrors: 4,
      completionPercentage: 50,
    },
    title: 'Review Required',
    subtitle: 'Several responses need attention before submission',
    showErrors: true,
  },
};

export const LongTextResponses: Story = {
  args: {
    responses: [
      {
        questionId: 'essay1',
        questionText: 'Describe your ideal development environment',
        questionType: 'text',
        answer: 'My ideal development environment would include a modern IDE like VS Code with excellent TypeScript support, integrated terminal, and extensive plugin ecosystem. I prefer a clean, distraction-free interface with good syntax highlighting and intelligent code completion. Version control integration is essential, along with debugging tools and testing frameworks. I also value good documentation tools and collaborative features for team development.',
        isRequired: true,
        isCompleted: true,
        isFlagged: false,
        isSkipped: false,
        hasError: false,
        timestamp: new Date('2024-01-15T10:40:00'),
        timeSpent: 300,
        confidence: 90,
        category: 'Preferences',
      },
      {
        questionId: 'essay2',
        questionText: 'What challenges do you face in web development?',
        questionType: 'text',
        answer: 'The biggest challenges I face include keeping up with the rapidly evolving JavaScript ecosystem, managing state in complex applications, ensuring cross-browser compatibility, optimizing performance while maintaining code readability, and balancing feature development with technical debt. Security considerations and accessibility requirements also add complexity to projects.',
        isRequired: true,
        isCompleted: true,
        isFlagged: true,
        isSkipped: false,
        hasError: false,
        timestamp: new Date('2024-01-15T10:45:00'),
        timeSpent: 420,
        confidence: 75,
        category: 'Challenges',
      },
    ],
    stats: {
      totalQuestions: 2,
      completedQuestions: 2,
      skippedQuestions: 0,
      flaggedQuestions: 1,
      questionsWithErrors: 0,
      totalTimeSpent: 720,
      averageConfidence: 82,
      completionPercentage: 100,
    },
    title: 'Essay Responses',
    showDetailedAnswers: true,
  },
};

export const TechnicalAssessment: Story = {
  args: {
    responses: [
      {
        questionId: 'code1',
        questionText: 'Which coding approach do you prefer?',
        questionType: 'code-comparison',
        answer: 'functional',
        formattedAnswer: 'Functional Programming Approach',
        isRequired: true,
        isCompleted: true,
        isFlagged: false,
        isSkipped: false,
        hasError: false,
        timestamp: new Date('2024-01-15T10:30:00'),
        timeSpent: 120,
        confidence: 85,
        category: 'Code Style',
      },
      {
        questionId: 'arch1',
        questionText: 'Which architecture would you choose?',
        questionType: 'architecture',
        answer: 'microservices',
        formattedAnswer: 'Microservices Architecture',
        isRequired: true,
        isCompleted: true,
        isFlagged: false,
        isSkipped: false,
        hasError: false,
        timestamp: new Date('2024-01-15T10:35:00'),
        timeSpent: 180,
        confidence: 70,
        category: 'Architecture',
      },
      {
        questionId: 'difficulty1',
        questionText: 'Rate the difficulty of implementing real-time features',
        questionType: 'difficulty',
        answer: 4,
        formattedAnswer: 'Level 4 - Hard',
        isRequired: true,
        isCompleted: true,
        isFlagged: false,
        isSkipped: false,
        hasError: false,
        timestamp: new Date('2024-01-15T10:38:00'),
        timeSpent: 60,
        confidence: 80,
        category: 'Assessment',
      },
    ],
    stats: {
      totalQuestions: 3,
      completedQuestions: 3,
      skippedQuestions: 0,
      flaggedQuestions: 0,
      questionsWithErrors: 0,
      totalTimeSpent: 360,
      averageConfidence: 78,
      completionPercentage: 100,
    },
    title: 'Technical Assessment Results',
    subtitle: 'Your responses to technical evaluation questions',
    groupByCategory: true,
  },
};

export const InteractiveDemo: Story = {
  render: () => {
    const [responses, setResponses] = React.useState<ResponseData[]>(sampleResponses);
    const [stats, setStats] = React.useState<SummaryStats>(sampleStats);

    const handleEdit = (questionId: string) => {
      console.log('Edit question:', questionId);
      alert(`Edit functionality would navigate to question: ${questionId}`);
    };

    const handleFlag = (questionId: string, isFlagged: boolean) => {
      console.log('Flag question:', { questionId, isFlagged });
      
      setResponses(prev => prev.map(r => 
        r.questionId === questionId ? { ...r, isFlagged } : r
      ));

      setStats(prev => ({
        ...prev,
        flaggedQuestions: responses.filter(r => 
          r.questionId === questionId ? isFlagged : r.isFlagged
        ).length,
      }));
    };

    const handleExport = (format: 'json' | 'csv' | 'pdf') => {
      console.log('Export as:', format);
      alert(`Export functionality would download responses as ${format.toUpperCase()}`);
    };

    const handleShare = () => {
      console.log('Share responses');
      alert('Share functionality would create a shareable link');
    };

    const handlePrivacyChange = (isPrivate: boolean) => {
      console.log('Privacy changed:', isPrivate);
    };

    const handleSubmit = () => {
      console.log('Submit responses');
      alert('Responses would be submitted for final review');
    };

    const handleContinueEditing = () => {
      console.log('Continue editing');
      alert('Would navigate back to questionnaire');
    };

    return (
      <ResponseSummary
        responses={responses}
        stats={stats}
        title="Interactive Demo"
        subtitle="Try the interactive features - flag responses, edit them, or export"
        groupByCategory={false}
        showTimeSpent={true}
        showConfidence={true}
        showQuestionNumbers={true}
        allowEdit={true}
        allowFlag={true}
        showDetailedAnswers={true}
        showExportOptions={true}
        showPrivacyControls={true}
        readOnly={false}
        showErrors={true}
        onEdit={handleEdit}
        onFlag={handleFlag}
        onExport={handleExport}
        onShare={handleShare}
        onPrivacyChange={handlePrivacyChange}
        onSubmit={handleSubmit}
        onContinueEditing={handleContinueEditing}
      />
    );
  },
};

export const MobileOptimized: Story = {
  args: {
    ...Default.args,
    title: 'Mobile Summary',
    showQuestionNumbers: false,
    showTimeSpent: false,
    showDetailedAnswers: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};