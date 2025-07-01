import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SwipeRating } from './SwipeRating';
import { Zap, Shield, Rocket, Target, Trophy } from 'lucide-react';

const meta: Meta<typeof SwipeRating> = {
  title: 'Mobile/SwipeRating',
  component: SwipeRating,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A mobile-optimized rating component that supports both swipe gestures and tap interactions. Perfect for touch devices with haptic feedback and smooth animations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    iconType: {
      control: { type: 'select' },
      options: ['star', 'heart', 'thumbs', 'emoji', 'custom'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    max: {
      control: { type: 'range', min: 3, max: 10, step: 1 },
    },
    min: {
      control: { type: 'range', min: 0, max: 3, step: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SwipeRating>;

function ControlledExample({ initialValue = 0, ...props }: { initialValue?: number; [key: string]: any }) {
  const [rating, setRating] = useState(initialValue);
  
  return (
    <div className="max-w-md mx-auto space-y-4">
      <SwipeRating
        value={rating}
        onChange={setRating}
        {...props}
      />
      
      <div className="text-center text-sm text-warm-gray">
        Current rating: <span className="font-semibold">{rating || 'None'}</span>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <ControlledExample />,
  parameters: {
    docs: {
      description: {
        story: 'Default 5-star rating with swipe and tap interactions enabled.',
      },
    },
  },
};

export const HeartRating: Story = {
  render: () => (
    <ControlledExample 
      iconType="heart"
      showLabels={true}
      labels={{ min: 'Dislike', max: 'Love' }}
      showInstructions={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Heart-based rating system perfect for social features and user feedback.',
      },
    },
  },
};

export const ThumbsRating: Story = {
  render: () => (
    <ControlledExample 
      iconType="thumbs"
      max={3}
      min={1}
      showValue={true}
      showLabels={true}
      labels={{ min: 'Poor', max: 'Great' }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Simple 3-level thumbs rating for quick feedback collection.',
      },
    },
  },
};

export const EmojiRating: Story = {
  render: () => (
    <ControlledExample 
      iconType="emoji"
      max={5}
      min={1}
      size="large"
      showValue={true}
      showLabels={true}
      labels={{ min: 'Very unsatisfied', max: 'Very satisfied' }}
      showInstructions={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Emoji-based rating using facial expressions for satisfaction surveys.',
      },
    },
  },
};

export const CustomIcons: Story = {
  render: () => {
    const customIcons = [
      <Rocket key="1" />,
      <Target key="2" />,
      <Zap key="3" />,
      <Shield key="4" />,
      <Trophy key="5" />,
    ];
    
    return (
      <ControlledExample 
        iconType="custom"
        customIcons={customIcons}
        max={5}
        min={1}
        showValue={true}
        showLabels={true}
        labels={{ min: 'Beginner', max: 'Expert' }}
      />
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom icons representing skill levels or progression stages.',
      },
    },
  },
};

export const LargeSize: Story = {
  render: () => (
    <ControlledExample 
      size="large"
      iconType="star"
      max={5}
      showValue={true}
      showInstructions={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Large size variant for better accessibility and touch targets.',
      },
    },
  },
};

export const SmallSize: Story = {
  render: () => (
    <ControlledExample 
      size="small"
      iconType="heart"
      max={5}
      showValue={false}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compact size variant for embedded use or space-constrained layouts.',
      },
    },
  },
};

export const TenPointScale: Story = {
  render: () => (
    <ControlledExample 
      max={10}
      min={1}
      iconType="star"
      size="small"
      showValue={true}
      showLabels={true}
      labels={{ min: 'Terrible', max: 'Perfect' }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: '10-point rating scale for more granular feedback collection.',
      },
    },
  },
};

export const TapOnly: Story = {
  render: () => (
    <ControlledExample 
      enableSwipe={false}
      enableTap={true}
      iconType="thumbs"
      showInstructions={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tap-only interaction mode, disabling swipe gestures.',
      },
    },
  },
};

export const SwipeOnly: Story = {
  render: () => (
    <ControlledExample 
      enableSwipe={true}
      enableTap={false}
      iconType="star"
      showInstructions={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Swipe-only interaction mode, requiring gesture to rate.',
      },
    },
  },
};

export const MobileOptimized: Story = {
  render: () => (
    <div className="max-w-sm mx-auto space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center">Rate Your Experience</h3>
        <ControlledExample 
          iconType="emoji"
          size="large"
          max={5}
          min={1}
          showValue={true}
          showLabels={true}
          labels={{ min: 'Poor', max: 'Excellent' }}
          showInstructions={true}
          enableHaptics={true}
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center">Difficulty Level</h3>
        <ControlledExample 
          iconType="custom"
          customIcons={[
            <Rocket key="1" />,
            <Target key="2" />,
            <Zap key="3" />,
            <Shield key="4" />,
            <Trophy key="5" />,
          ]}
          size="medium"
          max={5}
          min={1}
          showValue={true}
          showLabels={true}
          labels={{ min: 'Easy', max: 'Expert' }}
        />
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized layout with multiple rating questions and haptic feedback.',
      },
    },
  },
};

export const DisabledState: Story = {
  render: () => (
    <ControlledExample 
      initialValue={3}
      disabled={true}
      iconType="star"
      showValue={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled state showing a previously submitted rating.',
      },
    },
  },
};

export const QuestionnaireExample: Story = {
  render: () => {
    const [ratings, setRatings] = useState<Record<string, number>>({});
    
    const questions = [
      {
        id: 'satisfaction',
        question: 'How satisfied are you with our service?',
        iconType: 'emoji' as const,
        labels: { min: 'Very unsatisfied', max: 'Very satisfied' },
      },
      {
        id: 'recommend',
        question: 'How likely are you to recommend us?',
        iconType: 'thumbs' as const,
        max: 10,
        min: 0,
        labels: { min: 'Not likely', max: 'Very likely' },
      },
      {
        id: 'usability',
        question: 'How would you rate the ease of use?',
        iconType: 'star' as const,
        labels: { min: 'Very difficult', max: 'Very easy' },
      },
    ];
    
    const updateRating = (questionId: string, value: number) => {
      setRatings(prev => ({ ...prev, [questionId]: value }));
    };
    
    const allAnswered = questions.every(q => ratings[q.id] > 0);
    
    return (
      <div className="max-w-lg mx-auto space-y-8">
        <h2 className="text-xl font-semibold text-center">Customer Feedback</h2>
        
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-4">
            <div className="text-center">
              <span className="text-sm text-warm-gray">Question {index + 1} of {questions.length}</span>
              <h3 className="text-lg font-medium mt-1">{question.question}</h3>
            </div>
            
            <SwipeRating
              value={ratings[question.id] || 0}
              onChange={(value) => updateRating(question.id, value)}
              iconType={question.iconType}
              max={question.max || 5}
              min={question.min || 1}
              size="medium"
              showValue={true}
              showLabels={true}
              labels={question.labels}
              showInstructions={index === 0}
              enableHaptics={true}
            />
          </div>
        ))}
        
        <div className="text-center pt-4">
          <button
            disabled={!allAnswered}
            className={cn(
              "px-8 py-3 rounded-lg font-medium transition-colors",
              allAnswered 
                ? "bg-primary text-white hover:bg-primary/90" 
                : "bg-light-gray text-warm-gray cursor-not-allowed"
            )}
          >
            Submit Feedback
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-light-gray dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold mb-2">Current Ratings:</h4>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(ratings, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete questionnaire example with multiple rating questions and form validation.',
      },
    },
  },
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}