import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TapToRank, type RankableItem } from './TapToRank';
import { 
  Code, 
  Palette, 
  Users, 
  Zap, 
  Coffee,
  Book,
  Music,
  Camera,
  Car,
  Gamepad2,
  Dumbbell,
  Plane,
  Heart,
  Star,
  Trophy,
  Shield,
  Target,
  Rocket
} from 'lucide-react';

const meta: Meta<typeof TapToRank> = {
  title: 'Mobile/TapToRank',
  component: TapToRank,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A mobile-optimized ranking component that allows users to select and order items through touch interactions. Perfect for priority ranking, preference ordering, and selection tasks.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: { type: 'select' },
      options: ['tap-to-order', 'tap-to-select', 'drag-and-drop'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'numbered', 'compact'],
    },
    maxRanked: {
      control: { type: 'number', min: 1, max: 10 },
    },
    minRanked: {
      control: { type: 'number', min: 0, max: 5 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TapToRank>;

const programmingLanguages: RankableItem[] = [
  {
    id: 'javascript',
    label: 'JavaScript',
    description: 'Versatile language for web development, both frontend and backend',
    icon: <Code />,
    badge: 'Popular',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    description: 'JavaScript with static type definitions for better development experience',
    icon: <Code />,
    badge: 'Trending',
  },
  {
    id: 'python',
    label: 'Python',
    description: 'Simple, readable language great for data science and web development',
    icon: <Code />,
  },
  {
    id: 'java',
    label: 'Java',
    description: 'Enterprise-focused language with strong ecosystem and performance',
    icon: <Code />,
  },
  {
    id: 'csharp',
    label: 'C#',
    description: 'Microsoft\'s modern, object-oriented programming language',
    icon: <Code />,
  },
  {
    id: 'go',
    label: 'Go',
    description: 'Fast, simple language designed for modern distributed systems',
    icon: <Code />,
    badge: 'Fast',
  },
];

const hobbies: RankableItem[] = [
  {
    id: 'reading',
    label: 'Reading',
    description: 'Books, articles, and educational content',
    icon: <Book />,
  },
  {
    id: 'music',
    label: 'Music',
    description: 'Listening to music, playing instruments, or composing',
    icon: <Music />,
  },
  {
    id: 'photography',
    label: 'Photography',
    description: 'Capturing moments and creating visual art',
    icon: <Camera />,
  },
  {
    id: 'driving',
    label: 'Driving',
    description: 'Road trips, car maintenance, or motorsports',
    icon: <Car />,
  },
  {
    id: 'gaming',
    label: 'Gaming',
    description: 'Video games, board games, or mobile games',
    icon: <Gamepad2 />,
  },
  {
    id: 'fitness',
    label: 'Fitness',
    description: 'Working out, sports, or physical activities',
    icon: <Dumbbell />,
  },
  {
    id: 'travel',
    label: 'Travel',
    description: 'Exploring new places and cultures',
    icon: <Plane />,
  },
  {
    id: 'cooking',
    label: 'Cooking',
    description: 'Preparing meals and trying new recipes',
    icon: <Coffee />,
  },
];

const features: RankableItem[] = [
  {
    id: 'performance',
    label: 'Performance',
    description: 'Fast loading times and smooth interactions',
    icon: <Rocket />,
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Data protection and privacy features',
    icon: <Shield />,
  },
  {
    id: 'usability',
    label: 'Usability',
    description: 'Intuitive interface and user experience',
    icon: <Target />,
  },
  {
    id: 'reliability',
    label: 'Reliability',
    description: 'Consistent uptime and stable functionality',
    icon: <Star />,
  },
  {
    id: 'innovation',
    label: 'Innovation',
    description: 'Cutting-edge features and technology',
    icon: <Zap />,
  },
];

function ControlledExample({ 
  items, 
  initialValue = [], 
  ...props 
}: { 
  items: RankableItem[]; 
  initialValue?: string[]; 
  [key: string]: any; 
}) {
  const [ranking, setRanking] = useState<string[]>(initialValue);
  
  return (
    <div className="max-w-lg mx-auto space-y-4">
      <TapToRank
        items={items}
        value={ranking}
        onChange={setRanking}
        {...props}
      />
      
      <div className="mt-6 p-4 bg-light-gray dark:bg-gray-800 rounded-lg">
        <h4 className="font-semibold mb-2">Current Ranking:</h4>
        <div className="space-y-1">
          {ranking.length > 0 ? (
            ranking.map((id, index) => {
              const item = items.find(item => item.id === id);
              return (
                <div key={id} className="text-sm">
                  {index + 1}. {item?.label}
                </div>
              );
            })
          ) : (
            <div className="text-sm text-warm-gray">No items ranked yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <ControlledExample 
      items={programmingLanguages}
      maxRanked={5}
      minRanked={3}
      showProgress={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Default tap-to-order ranking with progress tracking and validation.',
      },
    },
  },
};

export const TapToSelect: Story = {
  render: () => (
    <ControlledExample 
      items={hobbies}
      mode="tap-to-select"
      maxRanked={4}
      showNumbers={false}
      showActionButtons={false}
      showProgress={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tap-to-select mode for choosing items without specific ordering.',
      },
    },
  },
};

export const FeaturePriority: Story = {
  render: () => (
    <ControlledExample 
      items={features}
      maxRanked={3}
      minRanked={3}
      showProgress={true}
      showReset={true}
      showDescriptions={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Feature prioritization example requiring exactly 3 ranked items.',
      },
    },
  },
};

export const CompactVariant: Story = {
  render: () => (
    <ControlledExample 
      items={programmingLanguages.slice(0, 4)}
      variant="compact"
      maxRanked={3}
      showDescriptions={false}
      showActionButtons={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compact variant with reduced padding and no descriptions.',
      },
    },
  },
};

export const WithoutDescriptions: Story = {
  render: () => {
    const simpleItems: RankableItem[] = [
      { id: 'red', label: 'Red', icon: <Heart /> },
      { id: 'blue', label: 'Blue', icon: <Star /> },
      { id: 'green', label: 'Green', icon: <Trophy /> },
      { id: 'yellow', label: 'Yellow', icon: <Zap /> },
      { id: 'purple', label: 'Purple', icon: <Shield /> },
    ];
    
    return (
      <ControlledExample 
        items={simpleItems}
        maxRanked={3}
        showDescriptions={false}
        showNumbers={true}
        showActionButtons={false}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Simple ranking with just labels and icons, no descriptions.',
      },
    },
  },
};

export const MobileOptimized: Story = {
  render: () => (
    <div className="max-w-sm mx-auto">
      <ControlledExample 
        items={hobbies.slice(0, 6)}
        maxRanked={3}
        minRanked={2}
        showProgress={true}
        showReset={true}
        enableHaptics={true}
        variant="default"
      />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized layout with haptic feedback and touch-friendly controls.',
      },
    },
  },
};

export const TopThreeSelection: Story = {
  render: () => (
    <ControlledExample 
      items={programmingLanguages}
      maxRanked={3}
      minRanked={3}
      showProgress={true}
      showNumbers={true}
      showActionButtons={true}
      showReset={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Top 3 selection requiring exactly 3 items to be ranked.',
      },
    },
  },
};

export const QuestionnaireExample: Story = {
  render: () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string[]>>({});
    
    const questions = [
      {
        id: 'languages',
        question: 'Rank your top 3 programming languages',
        items: programmingLanguages,
        maxRanked: 3,
        minRanked: 3,
        mode: 'tap-to-order' as const,
      },
      {
        id: 'hobbies',
        question: 'Select your favorite hobbies (up to 4)',
        items: hobbies,
        maxRanked: 4,
        minRanked: 1,
        mode: 'tap-to-select' as const,
      },
      {
        id: 'features',
        question: 'Prioritize these features (rank all 5)',
        items: features,
        maxRanked: 5,
        minRanked: 5,
        mode: 'tap-to-order' as const,
      },
    ];
    
    const currentQuestion = questions[currentStep];
    const canProgress = answers[currentQuestion.id]?.length >= currentQuestion.minRanked;
    
    const handleAnswer = (ranking: string[]) => {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: ranking }));
    };
    
    const handleNext = () => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    };
    
    const handlePrevious = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    };
    
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">
            Question {currentStep + 1} of {questions.length}
          </h2>
          <p className="text-warm-gray">{currentQuestion.question}</p>
        </div>
        
        <TapToRank
          items={currentQuestion.items}
          value={answers[currentQuestion.id] || []}
          onChange={handleAnswer}
          mode={currentQuestion.mode}
          maxRanked={currentQuestion.maxRanked}
          minRanked={currentQuestion.minRanked}
          showProgress={true}
          showReset={true}
          showNumbers={currentQuestion.mode === 'tap-to-order'}
          showActionButtons={currentQuestion.mode === 'tap-to-order'}
        />
        
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 text-warm-gray disabled:opacity-50"
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={!canProgress || currentStep === questions.length - 1}
            className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
          >
            {currentStep === questions.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-light-gray dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold mb-2">All Answers:</h4>
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
        story: 'Complete questionnaire example with multiple ranking questions and different modes.',
      },
    },
  },
};

export const DisabledState: Story = {
  render: () => (
    <ControlledExample 
      items={features}
      initialValue={['performance', 'security', 'usability']}
      disabled={true}
      showNumbers={true}
      showActionButtons={false}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled state showing a previously submitted ranking.',
      },
    },
  },
};

export const MinimalSetup: Story = {
  render: () => {
    const minimalItems: RankableItem[] = [
      { id: 'option1', label: 'Option 1' },
      { id: 'option2', label: 'Option 2' },
      { id: 'option3', label: 'Option 3' },
      { id: 'option4', label: 'Option 4' },
    ];
    
    return (
      <ControlledExample 
        items={minimalItems}
        maxRanked={2}
        showDescriptions={false}
        showNumbers={true}
        showActionButtons={false}
        showProgress={false}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal setup with basic text labels and reduced UI elements.',
      },
    },
  },
};