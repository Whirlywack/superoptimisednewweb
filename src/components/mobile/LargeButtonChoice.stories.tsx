import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LargeButtonChoice, type LargeButtonChoiceOption } from './LargeButtonChoice';
import { 
  Smartphone, 
  Laptop, 
  Monitor, 
  Tablet, 
  Code, 
  Palette, 
  Users, 
  Zap,
  Star,
  TrendingUp,
  Shield,
  Heart,
  Coffee,
  Rocket
} from 'lucide-react';

const meta: Meta<typeof LargeButtonChoice> = {
  title: 'Mobile/LargeButtonChoice',
  component: LargeButtonChoice,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Large, touch-friendly button choices optimized for mobile devices. Ensures 44px+ touch targets and provides clear visual feedback for user selections.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: { type: 'select' },
      options: ['vertical', 'grid'],
    },
    columns: {
      control: { type: 'select' },
      options: [2, 3, 4],
      if: { arg: 'layout', eq: 'grid' },
    },
    size: {
      control: { type: 'select' },
      options: ['medium', 'large', 'xl'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'outlined', 'filled', 'minimal'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof LargeButtonChoice>;

const deviceOptions: LargeButtonChoiceOption[] = [
  {
    value: 'mobile',
    label: 'Mobile Phone',
    description: 'iOS and Android smartphones',
    icon: <Smartphone />,
    badge: 'Popular',
    badgeVariant: 'success',
  },
  {
    value: 'tablet',
    label: 'Tablet',
    description: 'iPad, Android tablets, and 2-in-1 devices',
    icon: <Tablet />,
  },
  {
    value: 'laptop',
    label: 'Laptop',
    description: 'MacBook, Windows laptops, and Chromebooks',
    icon: <Laptop />,
    badge: 'Recommended',
    badgeVariant: 'default',
  },
  {
    value: 'desktop',
    label: 'Desktop Computer',
    description: 'Traditional desktop setups with external monitor',
    icon: <Monitor />,
  },
];

const roleOptions: LargeButtonChoiceOption[] = [
  {
    value: 'developer',
    label: 'Software Developer',
    description: 'Frontend, backend, full-stack, mobile, or game development',
    icon: <Code />,
  },
  {
    value: 'designer',
    label: 'UI/UX Designer',
    description: 'User interface and user experience design',
    icon: <Palette />,
  },
  {
    value: 'manager',
    label: 'Project Manager',
    description: 'Product management, project coordination, and team leadership',
    icon: <Users />,
  },
  {
    value: 'other',
    label: 'Other Role',
    description: 'QA, DevOps, Data Science, or another technical role',
    icon: <Zap />,
  },
];

function ControlledExample({ 
  options, 
  multiple = false, 
  ...props 
}: { 
  options: LargeButtonChoiceOption[]; 
  multiple?: boolean; 
  [key: string]: any; 
}) {
  const [selected, setSelected] = useState<string | string[]>(multiple ? [] : '');
  
  return (
    <div className="max-w-lg mx-auto">
      <LargeButtonChoice
        options={options}
        value={selected}
        multiple={multiple}
        onChange={setSelected}
        {...props}
      />
      
      <div className="mt-6 p-4 bg-light-gray dark:bg-gray-800 rounded-lg">
        <h4 className="font-semibold mb-2">Selected:</h4>
        <pre className="text-sm">
          {JSON.stringify(selected, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <ControlledExample options={roleOptions} />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Default large button choice with single selection and outlined style.',
      },
    },
  },
};

export const MultipleSelection: Story = {
  render: () => (
    <ControlledExample 
      options={deviceOptions} 
      multiple={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple selection mode allowing users to choose several options.',
      },
    },
  },
};

export const GridLayout: Story = {
  render: () => (
    <ControlledExample 
      options={deviceOptions}
      layout="grid"
      columns={2}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Grid layout with 2 columns for more compact presentation.',
      },
    },
  },
};

export const FilledVariant: Story = {
  render: () => (
    <ControlledExample 
      options={roleOptions}
      variant="filled"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Filled variant with solid background colors for selected state.',
      },
    },
  },
};

export const MinimalVariant: Story = {
  render: () => (
    <ControlledExample 
      options={roleOptions}
      variant="minimal"
      showIndicators={false}
      showArrows={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Minimal variant with subtle styling and navigation arrows.',
      },
    },
  },
};

export const ExtraLargeSize: Story = {
  render: () => (
    <ControlledExample 
      options={roleOptions.slice(0, 3)}
      size="xl"
      variant="default"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Extra large size for maximum touch accessibility and readability.',
      },
    },
  },
};

export const WithoutDescriptions: Story = {
  render: () => {
    const simpleOptions: LargeButtonChoiceOption[] = [
      { value: 'yes', label: 'Yes', icon: <Heart /> },
      { value: 'no', label: 'No', icon: <Coffee /> },
      { value: 'maybe', label: 'Maybe', icon: <Star /> },
    ];
    
    return (
      <ControlledExample 
        options={simpleOptions}
        variant="filled"
        size="medium"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Simple options without descriptions for quick yes/no type questions.',
      },
    },
  },
};

export const MobileOptimized: Story = {
  render: () => {
    const mobileOptions: LargeButtonChoiceOption[] = [
      {
        value: 'beginner',
        label: 'Beginner',
        description: 'Just getting started with coding',
        icon: <Rocket />,
        badge: 'Start here',
        badgeVariant: 'success',
      },
      {
        value: 'intermediate',
        label: 'Intermediate',
        description: '1-3 years of experience',
        icon: <TrendingUp />,
        badge: 'Popular',
        badgeVariant: 'default',
      },
      {
        value: 'advanced',
        label: 'Advanced',
        description: '3+ years, leading projects',
        icon: <Shield />,
      },
    ];
    
    return (
      <div className="max-w-sm mx-auto">
        <ControlledExample 
          options={mobileOptions}
          size="large"
          variant="outlined"
        />
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized version with large touch targets and clear visual hierarchy.',
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    options: [],
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with skeleton placeholders while options are being fetched.',
      },
    },
  },
};

export const DisabledOptions: Story = {
  render: () => {
    const optionsWithDisabled: LargeButtonChoiceOption[] = [
      {
        value: 'free',
        label: 'Free Plan',
        description: 'Basic features with limited usage',
        icon: <Star />,
        badge: 'Current',
        badgeVariant: 'default',
      },
      {
        value: 'pro',
        label: 'Pro Plan',
        description: 'Advanced features and higher limits',
        icon: <Zap />,
        badge: 'Recommended',
        badgeVariant: 'success',
      },
      {
        value: 'enterprise',
        label: 'Enterprise Plan',
        description: 'Custom solutions for large teams',
        icon: <Shield />,
        disabled: true,
        badge: 'Coming soon',
        badgeVariant: 'warning',
      },
    ];
    
    return (
      <ControlledExample 
        options={optionsWithDisabled}
        variant="default"
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with some disabled options that cannot be selected.',
      },
    },
  },
};

export const CustomHeight: Story = {
  render: () => (
    <ControlledExample 
      options={roleOptions.slice(0, 2)}
      height={100}
      variant="filled"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Custom height override for specific design requirements.',
      },
    },
  },
};

export const QuestionnaireExample: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    
    const questions = [
      {
        question: "What's your primary development platform?",
        key: 'platform',
        options: deviceOptions,
      },
      {
        question: "What's your role in development?",
        key: 'role', 
        options: roleOptions,
      },
      {
        question: "Which programming languages do you use? (Select all that apply)",
        key: 'languages',
        multiple: true,
        options: [
          { value: 'javascript', label: 'JavaScript', icon: <Code /> },
          { value: 'typescript', label: 'TypeScript', icon: <Code />, badge: 'Popular' },
          { value: 'python', label: 'Python', icon: <Code /> },
          { value: 'java', label: 'Java', icon: <Code /> },
          { value: 'csharp', label: 'C#', icon: <Code /> },
          { value: 'go', label: 'Go', icon: <Code /> },
        ],
      },
    ];
    
    const currentQuestion = questions[currentStep];
    
    const handleAnswer = (value: string | string[]) => {
      setAnswers(prev => ({ ...prev, [currentQuestion.key]: value }));
    };
    
    const canProgress = answers[currentQuestion.key] !== undefined;
    
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">
            Question {currentStep + 1} of {questions.length}
          </h2>
          <p className="text-warm-gray">{currentQuestion.question}</p>
        </div>
        
        <LargeButtonChoice
          options={currentQuestion.options}
          value={answers[currentQuestion.key] || (currentQuestion.multiple ? [] : '')}
          multiple={currentQuestion.multiple}
          onChange={handleAnswer}
          layout={currentQuestion.multiple ? 'grid' : 'vertical'}
          columns={2}
        />
        
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-warm-gray disabled:opacity-50"
          >
            Previous
          </button>
          
          <button
            onClick={() => setCurrentStep(Math.min(questions.length - 1, currentStep + 1))}
            disabled={!canProgress || currentStep === questions.length - 1}
            className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
          >
            {currentStep === questions.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-light-gray dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold mb-2">Current Answers:</h4>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(answers, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete questionnaire example showing how LargeButtonChoice works in a multi-step form.',
      },
    },
  },
};