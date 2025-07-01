import type { Meta, StoryObj } from '@storybook/react';
import { DifficultyRating, type DifficultyOption, type DifficultyLevel } from './DifficultyRating';
import { Code, Database, Zap, Shield, Rocket } from 'lucide-react';

const meta: Meta<typeof DifficultyRating> = {
  title: 'Molecules/DifficultyRating',
  component: DifficultyRating,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component for rating technical difficulty with multiple visual variants and detailed descriptions. Commonly used in project planning and skill assessment questionnaires.',
      },
    },
  },
  argTypes: {
    question: {
      control: 'text',
      description: 'The question text asking for difficulty assessment',
    },
    value: {
      control: 'select',
      options: [undefined, 1, 2, 3, 4, 5],
      description: 'Currently selected difficulty level',
    },
    variant: {
      control: 'select',
      options: ['stars', 'circles', 'bars', 'shapes', 'custom'],
      description: 'Visual style for difficulty indicators',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Layout orientation for difficulty options',
    },
    showDescriptions: {
      control: 'boolean',
      description: 'Whether to show detailed descriptions for each level',
    },
    showExamples: {
      control: 'boolean',
      description: 'Whether to show example tasks for each difficulty level',
    },
    required: {
      control: 'boolean',
      description: 'Whether the question is required',
    },
    allowSkip: {
      control: 'boolean',
      description: 'Whether to show skip option',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DifficultyRating>;

const customTechOptions: DifficultyOption[] = [
  {
    level: 1,
    label: 'Beginner',
    description: 'Basic HTML/CSS changes, simple configuration updates',
    icon: <Code className="w-5 h-5" />,
    color: 'text-green-500',
    examples: ['Update text content', 'Change colors', 'Add simple links']
  },
  {
    level: 2,
    label: 'Junior',
    description: 'Simple JavaScript functions, basic component creation',
    icon: <Database className="w-5 h-5" />,
    color: 'text-green-400',
    examples: ['Create form validation', 'Add event handlers', 'Simple API calls']
  },
  {
    level: 3,
    label: 'Mid-level',
    description: 'Complex business logic, state management, testing',
    icon: <Zap className="w-5 h-5" />,
    color: 'text-yellow-500',
    examples: ['Redux implementation', 'Complex algorithms', 'Integration testing']
  },
  {
    level: 4,
    label: 'Senior',
    description: 'Architecture decisions, performance optimization, mentoring',
    icon: <Shield className="w-5 h-5" />,
    color: 'text-orange-500',
    examples: ['System design', 'Performance tuning', 'Code reviews']
  },
  {
    level: 5,
    label: 'Expert',
    description: 'Research, innovation, cutting-edge technologies',
    icon: <Rocket className="w-5 h-5" />,
    color: 'text-red-500',
    examples: ['New framework creation', 'Research projects', 'Technical leadership']
  }
];

export const Default: Story = {
  args: {
    question: 'How would you rate the technical difficulty of this task?',
    description: 'Consider the complexity, required skills, and time investment needed.',
    variant: 'stars',
    orientation: 'horizontal',
    showDescriptions: true,
    showExamples: false,
    required: false,
    allowSkip: false,
    disabled: false,
  },
};

export const WithSelection: Story = {
  args: {
    ...Default.args,
    value: 3,
    description: 'This example shows a pre-selected difficulty rating.',
  },
};

export const StarRatingSimple: Story = {
  args: {
    question: 'Rate the difficulty of implementing user authentication',
    description: 'Quick star rating without detailed descriptions.',
    variant: 'stars',
    showDescriptions: false,
    showExamples: false,
  },
};

export const CircleVariant: Story = {
  args: {
    question: 'How challenging is database optimization for you?',
    description: 'Circle-based difficulty rating with size progression.',
    variant: 'circles',
    showDescriptions: true,
    showExamples: false,
  },
};

export const BarsVariant: Story = {
  args: {
    question: 'Rate the complexity of this API integration',
    description: 'Bar chart style difficulty rating.',
    variant: 'bars',
    showDescriptions: true,
    showExamples: false,
  },
};

export const ShapesVariant: Story = {
  args: {
    question: 'How difficult is implementing real-time chat?',
    description: 'Different shapes representing increasing difficulty.',
    variant: 'shapes',
    showDescriptions: true,
    showExamples: true,
  },
};

export const CustomTechLevels: Story = {
  args: {
    question: 'What skill level is required for this development task?',
    description: 'Custom difficulty levels tailored for software development roles.',
    variant: 'custom',
    customOptions: customTechOptions,
    showDescriptions: true,
    showExamples: true,
  },
};

export const VerticalLayout: Story = {
  args: {
    ...Default.args,
    orientation: 'vertical',
    question: 'Rate the difficulty of migrating to microservices',
    description: 'Vertical layout works better for detailed descriptions and mobile views.',
    showExamples: true,
  },
};

export const WithExamples: Story = {
  args: {
    ...Default.args,
    question: 'How difficult would this feature be to implement?',
    showDescriptions: true,
    showExamples: true,
    description: 'Detailed view with examples for each difficulty level.',
  },
};

export const MinimalStars: Story = {
  args: {
    question: 'Quick difficulty rating?',
    description: 'Simple star rating for quick assessments.',
    variant: 'stars',
    showDescriptions: false,
    showExamples: false,
  },
};

export const Required: Story = {
  args: {
    ...Default.args,
    required: true,
    error: 'Please select a difficulty level to continue.',
    description: 'This difficulty rating is required for project planning.',
  },
};

export const WithSkipOption: Story = {
  args: {
    ...Default.args,
    allowSkip: true,
    question: 'Optional: How difficult is this for you personally?',
    description: 'This rating is optional and helps us understand skill distribution.',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    value: 4,
    description: 'This difficulty rating has been locked and cannot be modified.',
  },
};

export const ErrorState: Story = {
  args: {
    ...Default.args,
    error: 'Please select a difficulty level.',
    required: true,
  },
};

export const ProjectPlanning: Story = {
  args: {
    question: 'Rate the complexity of building a CI/CD pipeline',
    description: 'Consider setup complexity, maintenance requirements, and team expertise needed.',
    variant: 'shapes',
    showDescriptions: true,
    showExamples: true,
    value: 3,
  },
};

export const SkillAssessment: Story = {
  args: {
    question: 'How challenging is React state management for you?',
    description: 'Self-assessment of your comfort level with React state patterns.',
    variant: 'custom',
    customOptions: [
      {
        level: 1,
        label: 'Beginner',
        description: 'Comfortable with useState only',
        color: 'text-green-500',
        examples: ['useState', 'Basic props', 'Simple state updates']
      },
      {
        level: 2,
        label: 'Developing',
        description: 'Can use useEffect and useContext',
        color: 'text-green-400',
        examples: ['useEffect', 'useContext', 'Custom hooks']
      },
      {
        level: 3,
        label: 'Competent',
        description: 'Comfortable with useReducer and optimization',
        color: 'text-yellow-500',
        examples: ['useReducer', 'useMemo', 'useCallback']
      },
      {
        level: 4,
        label: 'Advanced',
        description: 'Can implement complex state patterns',
        color: 'text-orange-500',
        examples: ['Redux', 'Zustand', 'State machines']
      },
      {
        level: 5,
        label: 'Expert',
        description: 'Can architect state management solutions',
        color: 'text-red-500',
        examples: ['Custom state libraries', 'Performance optimization', 'Architecture design']
      }
    ],
    showDescriptions: true,
    showExamples: true,
  },
};

export const TaskEstimation: Story = {
  args: {
    question: 'How difficult is implementing search functionality?',
    description: 'Rate based on implementation complexity, not time required.',
    variant: 'bars',
    showDescriptions: true,
    showExamples: true,
    orientation: 'vertical',
  },
};

export const MobileOptimized: Story = {
  args: {
    ...Default.args,
    question: 'Mobile difficulty rating',
    description: 'Optimized for mobile interaction with larger touch targets.',
    orientation: 'vertical',
    showDescriptions: true,
    showExamples: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};