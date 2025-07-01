import type { Meta, StoryObj } from '@storybook/react';
import { QuestionFlow, type QuestionFlowData } from './QuestionFlow';

const meta: Meta<typeof QuestionFlow> = {
  title: 'Organisms/QuestionFlow',
  component: QuestionFlow,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A complete questionnaire flow that handles question sequencing, conditional logic, validation, and state management. Supports all question types with auto-save and auto-advance features.',
      },
    },
  },
  argTypes: {
    allowSkip: {
      control: 'boolean',
      description: 'Allow skipping optional questions',
    },
    showProgress: {
      control: 'boolean',
      description: 'Show progress indicator',
    },
    showCounter: {
      control: 'boolean',
      description: 'Show question counter',
    },
    autoAdvance: {
      control: 'boolean',
      description: 'Auto-advance on answer for single-choice questions',
    },
    autoAdvanceDelay: {
      control: { type: 'number', min: 0, max: 5000, step: 100 },
      description: 'Delay before auto-advance in milliseconds',
    },
    autoSave: {
      control: 'boolean',
      description: 'Enable automatic saving of answers',
    },
    autoSaveInterval: {
      control: { type: 'number', min: 1000, max: 60000, step: 1000 },
      description: 'Auto-save interval in milliseconds',
    },
  },
};

export default meta;
type Story = StoryObj<typeof QuestionFlow>;

const basicQuestions: QuestionFlowData[] = [
  {
    id: 'q1',
    type: 'multiple-choice',
    question: 'What is your primary programming language?',
    description: 'Select the language you use most frequently for development.',
    required: true,
    config: {
      options: [
        { id: 'js', label: 'JavaScript' },
        { id: 'ts', label: 'TypeScript' },
        { id: 'python', label: 'Python' },
        { id: 'java', label: 'Java' },
        { id: 'other', label: 'Other' },
      ],
      layout: 'vertical',
    },
  },
  {
    id: 'q2',
    type: 'yes-no',
    question: 'Do you have experience with React?',
    description: 'This helps us understand your frontend development background.',
    required: false,
    config: {
      showUnsure: true,
    },
  },
  {
    id: 'q3',
    type: 'rating',
    question: 'How would you rate your overall programming experience?',
    description: 'Rate your confidence level on a scale of 1-10.',
    required: true,
    config: {
      min: 1,
      max: 10,
      showLabels: true,
    },
  },
  {
    id: 'q4',
    type: 'text',
    question: 'What motivates you most about programming?',
    description: 'Share what drives your passion for development.',
    required: false,
    config: {
      placeholder: 'Share your thoughts...',
      maxLength: 500,
      showCharacterCount: true,
    },
  },
];

const conditionalQuestions: QuestionFlowData[] = [
  {
    id: 'experience',
    type: 'multiple-choice',
    question: 'What is your experience level?',
    required: true,
    config: {
      options: [
        { id: 'beginner', label: 'Beginner (0-2 years)' },
        { id: 'intermediate', label: 'Intermediate (2-5 years)' },
        { id: 'senior', label: 'Senior (5+ years)' },
      ],
    },
  },
  {
    id: 'beginner-focus',
    type: 'multiple-choice',
    question: 'What would you like to focus on learning?',
    description: 'Select areas most relevant to your current learning goals.',
    required: true,
    conditions: [
      { dependsOn: 'experience', requiredValue: 'beginner' },
    ],
    config: {
      options: [
        { id: 'basics', label: 'Programming fundamentals' },
        { id: 'frontend', label: 'Frontend development' },
        { id: 'backend', label: 'Backend development' },
        { id: 'tools', label: 'Development tools' },
      ],
      allowMultiple: true,
    },
  },
  {
    id: 'senior-interests',
    type: 'ranking',
    question: 'Rank these senior-level topics by interest',
    description: 'Drag to reorder based on your learning priorities.',
    required: true,
    conditions: [
      { dependsOn: 'experience', requiredValue: 'senior' },
    ],
    config: {
      items: [
        { id: 'architecture', label: 'System Architecture' },
        { id: 'leadership', label: 'Technical Leadership' },
        { id: 'performance', label: 'Performance Optimization' },
        { id: 'security', label: 'Security Best Practices' },
        { id: 'mentoring', label: 'Team Mentoring' },
      ],
      maxSelections: 3,
    },
  },
  {
    id: 'tech-stack',
    type: 'multiple-choice',
    question: 'Which technology interests you most?',
    required: true,
    conditions: [
      { dependsOn: 'experience', requiredValue: 'intermediate' },
    ],
    config: {
      options: [
        { id: 'react', label: 'React Ecosystem' },
        { id: 'node', label: 'Node.js/Backend' },
        { id: 'mobile', label: 'Mobile Development' },
        { id: 'devops', label: 'DevOps/Cloud' },
      ],
    },
  },
  {
    id: 'react-experience',
    type: 'rating',
    question: 'Rate your React experience level',
    description: 'How comfortable are you with React development?',
    required: true,
    conditions: [
      { dependsOn: 'tech-stack', requiredValue: 'react' },
    ],
    config: {
      min: 1,
      max: 5,
      showLabels: true,
    },
  },
];

const developerQuestions: QuestionFlowData[] = [
  {
    id: 'code-style',
    type: 'code-comparison',
    question: 'Which coding approach do you prefer?',
    description: 'Compare these two implementation styles.',
    required: true,
    config: {
      approaches: [
        {
          id: 'functional',
          title: 'Functional Style',
          description: 'Immutable, declarative approach',
          language: 'javascript',
          code: `const processUsers = (users) => {
  return users
    .filter(user => user.active)
    .map(user => ({
      ...user,
      displayName: \`\${user.first} \${user.last}\`
    }));
};`,
          pros: ['Immutable', 'Predictable', 'Testable'],
          cons: ['Performance overhead', 'Learning curve'],
        },
        {
          id: 'imperative',
          title: 'Imperative Style',
          description: 'Traditional loop-based approach',
          language: 'javascript',
          code: `const processUsers = (users) => {
  const result = [];
  for (let i = 0; i < users.length; i++) {
    if (users[i].active) {
      users[i].displayName = \`\${users[i].first} \${users[i].last}\`;
      result.push(users[i]);
    }
  }
  return result;
};`,
          pros: ['Performance', 'Familiar', 'Direct'],
          cons: ['Mutation', 'Verbose', 'Error-prone'],
        },
      ],
      layout: 'horizontal',
    },
  },
  {
    id: 'architecture',
    type: 'architecture',
    question: 'Which architecture would you choose for a new project?',
    description: 'Consider scalability, team size, and complexity.',
    required: true,
    config: {
      architectures: [
        {
          id: 'monolith',
          title: 'Monolithic Architecture',
          description: 'Single deployable unit',
          components: ['Frontend', 'Backend', 'Database'],
          complexity: 'simple',
          scalability: 'low',
          cost: 'low',
          pros: ['Simple deployment', 'Easy development'],
          cons: ['Scaling challenges', 'Technology lock-in'],
        },
        {
          id: 'microservices',
          title: 'Microservices Architecture',
          description: 'Distributed services',
          components: ['API Gateway', 'User Service', 'Order Service', 'Database per Service'],
          complexity: 'complex',
          scalability: 'high',
          cost: 'high',
          pros: ['Independent scaling', 'Technology diversity'],
          cons: ['Complexity', 'Network overhead'],
        },
      ],
      layout: 'grid',
      columns: 2,
    },
  },
  {
    id: 'time-estimate',
    type: 'time-estimate',
    question: 'How long would it take you to build a REST API?',
    description: 'Estimate for a basic CRUD API with authentication.',
    required: true,
    config: {
      allowedUnits: ['hours', 'days', 'weeks'],
      showConfidence: true,
      presets: [
        { label: '4 hours', value: { value: 4, unit: 'hours' } },
        { label: '1 day', value: { value: 1, unit: 'days' } },
        { label: '3 days', value: { value: 3, unit: 'days' } },
        { label: '1 week', value: { value: 1, unit: 'weeks' } },
      ],
    },
  },
  {
    id: 'difficulty',
    type: 'difficulty',
    question: 'How difficult is implementing real-time features?',
    description: 'Consider WebSockets, state synchronization, and user experience.',
    required: true,
    config: {
      variant: 'stars',
      showDescriptions: true,
      showExamples: true,
    },
  },
  {
    id: 'tech-debt',
    type: 'tech-debt',
    question: 'How do you handle technical debt?',
    description: 'What is your approach to balancing speed vs. quality?',
    required: true,
    config: {
      variant: 'scenarios',
      scenario: {
        id: 'legacy-refactor',
        title: 'Legacy Code Refactoring',
        description: 'You need to add a feature to legacy code that works but lacks tests and uses outdated patterns.',
        impact: 'high',
        urgency: 'medium',
        effort: 'high',
        tradeoffs: {
          shortTerm: 'Feature delivered 2 weeks faster by working around existing code',
          longTerm: 'Technical debt makes future changes increasingly difficult',
        },
      },
      showTradeoffs: true,
    },
  },
];

export const Basic: Story = {
  args: {
    questions: basicQuestions,
    allowSkip: true,
    showProgress: true,
    showCounter: true,
    autoAdvance: false,
    autoSave: false,
  },
};

export const WithAutoAdvance: Story = {
  args: {
    questions: basicQuestions,
    allowSkip: true,
    showProgress: true,
    showCounter: true,
    autoAdvance: true,
    autoAdvanceDelay: 1500,
    autoSave: false,
  },
};

export const ConditionalLogic: Story = {
  args: {
    questions: conditionalQuestions,
    allowSkip: false,
    showProgress: true,
    showCounter: true,
    autoAdvance: false,
    autoSave: false,
  },
};

export const DeveloperAssessment: Story = {
  args: {
    questions: developerQuestions,
    allowSkip: false,
    showProgress: true,
    showCounter: true,
    autoAdvance: false,
    autoSave: true,
    autoSaveInterval: 5000,
  },
};

export const WithInitialAnswers: Story = {
  args: {
    questions: basicQuestions,
    initialAnswers: {
      q1: 'ts',
      q2: 'yes',
      q3: 8,
    },
    allowSkip: true,
    showProgress: true,
    showCounter: true,
  },
};

export const WithFlaggedQuestions: Story = {
  args: {
    questions: basicQuestions,
    initialFlagged: ['q2', 'q4'],
    allowSkip: true,
    showProgress: true,
    showCounter: true,
  },
};

export const NoProgress: Story = {
  args: {
    questions: basicQuestions.slice(0, 2),
    allowSkip: true,
    showProgress: false,
    showCounter: false,
    autoAdvance: false,
  },
};

export const QuickSurvey: Story = {
  args: {
    questions: [
      {
        id: 'satisfaction',
        type: 'rating',
        question: 'How satisfied are you with our service?',
        required: true,
        config: { min: 1, max: 5, showLabels: true },
      },
      {
        id: 'recommend',
        type: 'yes-no',
        question: 'Would you recommend us to others?',
        required: true,
      },
      {
        id: 'feedback',
        type: 'text',
        question: 'Any additional feedback?',
        required: false,
        config: { placeholder: 'Optional feedback...', maxLength: 200 },
      },
    ],
    allowSkip: true,
    showProgress: true,
    showCounter: true,
    autoAdvance: true,
    autoAdvanceDelay: 800,
  },
};

export const ComplexConditionals: Story = {
  args: {
    questions: [
      {
        id: 'role',
        type: 'multiple-choice',
        question: 'What is your role?',
        required: true,
        config: {
          options: [
            { id: 'developer', label: 'Developer' },
            { id: 'designer', label: 'Designer' },
            { id: 'manager', label: 'Manager' },
          ],
        },
      },
      {
        id: 'experience-years',
        type: 'rating',
        question: 'Years of experience?',
        required: true,
        config: { min: 0, max: 20, showLabels: true },
      },
      {
        id: 'senior-responsibilities',
        type: 'multiple-choice',
        question: 'What are your main responsibilities?',
        required: true,
        conditions: [
          { dependsOn: 'experience-years', requiredValue: 5, operator: 'greater-than' },
        ],
        config: {
          options: [
            { id: 'mentoring', label: 'Mentoring junior developers' },
            { id: 'architecture', label: 'System architecture decisions' },
            { id: 'code-review', label: 'Code review and standards' },
            { id: 'planning', label: 'Project planning' },
          ],
          allowMultiple: true,
        },
      },
      {
        id: 'junior-goals',
        type: 'text',
        question: 'What are your learning goals?',
        required: false,
        conditions: [
          { dependsOn: 'experience-years', requiredValue: 3, operator: 'less-than' },
        ],
        config: {
          placeholder: 'Describe your learning objectives...',
          maxLength: 300,
        },
      },
    ],
    allowSkip: false,
    showProgress: true,
    showCounter: true,
  },
};

export const ValidationDemo: Story = {
  args: {
    questions: [
      {
        id: 'email',
        type: 'text',
        question: 'What is your email address?',
        required: true,
        validation: {
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        },
        config: {
          placeholder: 'your.email@example.com',
        },
      },
      {
        id: 'age',
        type: 'rating',
        question: 'What is your age?',
        required: true,
        validation: {
          min: 18,
          max: 99,
        },
        config: {
          min: 1,
          max: 100,
        },
      },
      {
        id: 'bio',
        type: 'text',
        question: 'Tell us about yourself',
        required: true,
        validation: {
          minLength: 50,
          maxLength: 500,
        },
        config: {
          placeholder: 'Write at least 50 characters...',
          maxLength: 500,
          showCharacterCount: true,
        },
      },
    ],
    allowSkip: false,
    showProgress: true,
    showCounter: true,
  },
};

export const InteractiveDemo: Story = {
  render: () => {
    const [answers, setAnswers] = React.useState<Record<string, any>>({});
    const [flaggedQuestions, setFlaggedQuestions] = React.useState<string[]>([]);
    const [isComplete, setIsComplete] = React.useState(false);

    const handleAnswerChange = (questionId: string, answer: any, allAnswers: Record<string, any>) => {
      console.log('Answer changed:', { questionId, answer, allAnswers });
      setAnswers(allAnswers);
    };

    const handleQuestionFlag = (questionId: string, isFlagged: boolean) => {
      console.log('Question flagged:', { questionId, isFlagged });
      setFlaggedQuestions(prev => 
        isFlagged 
          ? [...prev, questionId]
          : prev.filter(id => id !== questionId)
      );
    };

    const handleComplete = (finalAnswers: Record<string, any>, flagged: string[]) => {
      console.log('Flow completed:', { finalAnswers, flagged });
      setIsComplete(true);
    };

    const handleAutoSave = (currentAnswers: Record<string, any>) => {
      console.log('Auto-saving:', currentAnswers);
    };

    if (isComplete) {
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Demo Complete!</h2>
          <div className="space-y-2 text-left max-w-md mx-auto">
            <div className="font-medium">Final Answers:</div>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(answers, null, 2)}
            </pre>
            <div className="font-medium">Flagged Questions:</div>
            <div className="text-sm">{flaggedQuestions.join(', ') || 'None'}</div>
          </div>
        </div>
      );
    }

    return (
      <QuestionFlow
        questions={basicQuestions}
        allowSkip={true}
        showProgress={true}
        showCounter={true}
        autoAdvance={false}
        autoSave={true}
        autoSaveInterval={3000}
        onAnswerChange={handleAnswerChange}
        onQuestionFlag={handleQuestionFlag}
        onComplete={handleComplete}
        onAutoSave={handleAutoSave}
      />
    );
  },
};