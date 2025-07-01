import type { Meta, StoryObj } from '@storybook/react';
import { RankingQuestion, type RankingItem } from './RankingQuestion';
import { useState } from 'react';
import { 
  Code, 
  Database, 
  Globe, 
  Smartphone, 
  Monitor, 
  Cloud,
  Users,
  Zap,
  Shield,
  Layers,
  Coffee,
  Book,
  Target,
  Lightbulb,
  Heart,
  Star
} from 'lucide-react';

const meta: Meta<typeof RankingQuestion> = {
  title: 'Design System/Molecules/RankingQuestion',
  component: RankingQuestion,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A drag-and-drop or button-based ranking component for prioritizing items. Limited to 6 items for optimal mobile experience.',
      },
    },
  },
  argTypes: {
    question: {
      control: 'text',
      description: 'The main question text',
    },
    description: {
      control: 'text',
      description: 'Optional context or description',
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
    variant: {
      control: 'select',
      options: ['drag', 'buttons'],
      description: 'Interaction method for ranking',
    },
    error: {
      control: 'text',
      description: 'Validation error message',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RankingQuestion>;

// Sample data for stories
const programmingLanguages: RankingItem[] = [
  {
    id: 'javascript',
    label: 'JavaScript',
    description: 'Versatile language for web development',
    icon: <Code className="w-5 h-5" />
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    description: 'JavaScript with static type definitions',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: 'python',
    label: 'Python',
    description: 'High-level programming language',
    icon: <Globe className="w-5 h-5" />
  },
  {
    id: 'rust',
    label: 'Rust',
    description: 'Systems programming language',
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: 'go',
    label: 'Go',
    description: 'Open source programming language',
    icon: <Cloud className="w-5 h-5" />
  }
];

const developerPriorities: RankingItem[] = [
  {
    id: 'performance',
    label: 'Performance',
    description: 'Fast loading and responsive applications',
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: 'maintainability',
    label: 'Code Maintainability',
    description: 'Clean, readable, and well-documented code',
    icon: <Book className="w-5 h-5" />
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Protection against vulnerabilities',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: 'scalability',
    label: 'Scalability',
    description: 'Ability to handle growth',
    icon: <Layers className="w-5 h-5" />
  },
  {
    id: 'ux',
    label: 'User Experience',
    description: 'Intuitive and enjoyable interfaces',
    icon: <Heart className="w-5 h-5" />
  },
  {
    id: 'testing',
    label: 'Testing Coverage',
    description: 'Comprehensive test suites',
    icon: <Target className="w-5 h-5" />
  }
];

const learningTopics: RankingItem[] = [
  {
    id: 'react',
    label: 'React Development',
    description: 'Component-based UI library'
  },
  {
    id: 'backend',
    label: 'Backend Development',
    description: 'Server-side programming'
  },
  {
    id: 'databases',
    label: 'Database Design',
    description: 'Data modeling and optimization'
  },
  {
    id: 'devops',
    label: 'DevOps Practices',
    description: 'Deployment and infrastructure'
  }
];

const features: RankingItem[] = [
  {
    id: 'dark-mode',
    label: 'Dark Mode',
    description: 'Toggle between light and dark themes',
    icon: <Monitor className="w-5 h-5" />
  },
  {
    id: 'mobile-app',
    label: 'Mobile App',
    description: 'Native mobile application',
    icon: <Smartphone className="w-5 h-5" />
  },
  {
    id: 'real-time',
    label: 'Real-time Updates',
    description: 'Live data synchronization',
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: 'collaboration',
    label: 'Team Collaboration',
    description: 'Multi-user features',
    icon: <Users className="w-5 h-5" />
  },
  {
    id: 'integrations',
    label: 'Third-party Integrations',
    description: 'Connect with external services',
    icon: <Globe className="w-5 h-5" />
  }
];

// Interactive wrapper for stories
function InteractiveRanking(props: any) {
  const [value, setValue] = useState<string[]>(props.value || []);
  const [skipped, setSkipped] = useState(false);

  if (skipped) {
    return (
      <div className="text-center p-8 bg-light-gray rounded-lg">
        <p className="text-warm-gray">Ranking skipped</p>
        <button 
          onClick={() => {
            setSkipped(false);
            setValue(props.value || []);
          }}
          className="mt-2 text-primary text-sm hover:underline"
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <RankingQuestion
      {...props}
      value={value}
      onChange={setValue}
      onSkip={props.allowSkip ? () => setSkipped(true) : undefined}
    />
  );
}

export const Default: Story = {
  render: (args) => <InteractiveRanking {...args} />,
  args: {
    question: 'Rank these programming languages by your preference',
    description: 'Order them from most preferred (1) to least preferred (5).',
    items: programmingLanguages,
    variant: 'buttons',
    required: true,
  },
};

export const DragAndDrop: Story = {
  render: (args) => <InteractiveRanking {...args} />,
  args: {
    question: 'Rank these development priorities',
    description: 'Drag and drop to order by importance for your projects.',
    items: developerPriorities,
    variant: 'drag',
    required: true,
  },
};

export const WithSkipOption: Story = {
  render: (args) => <InteractiveRanking {...args} />,
  args: {
    question: 'Rank these learning topics by your interest level',
    description: 'This ranking is optional and helps us suggest relevant content.',
    items: learningTopics,
    variant: 'buttons',
    allowSkip: true,
    required: false,
  },
};

export const FeaturePrioritization: Story = {
  render: (args) => <InteractiveRanking {...args} />,
  args: {
    question: 'Which features should we prioritize for the next release?',
    description: 'Rank these potential features by importance to your workflow.',
    items: features,
    variant: 'buttons',
    required: true,
  },
};

export const SimpleRanking: Story = {
  render: (args) => <InteractiveRanking {...args} />,
  args: {
    question: 'Rank your preferred work environments',
    items: [
      {
        id: 'office',
        label: 'Office',
        description: 'Traditional office environment'
      },
      {
        id: 'remote',
        label: 'Remote',
        description: 'Work from home'
      },
      {
        id: 'hybrid',
        label: 'Hybrid',
        description: 'Mix of office and remote'
      },
      {
        id: 'coworking',
        label: 'Co-working Space',
        description: 'Shared workspace'
      }
    ],
    variant: 'buttons',
  },
};

export const WithValidationError: Story = {
  render: (args) => <InteractiveRanking {...args} />,
  args: {
    question: 'Rank these skills by learning priority',
    description: 'This ranking is required to generate your learning path.',
    items: [
      {
        id: 'frontend',
        label: 'Frontend Development',
        icon: <Monitor className="w-5 h-5" />
      },
      {
        id: 'backend',
        label: 'Backend Development',
        icon: <Database className="w-5 h-5" />
      },
      {
        id: 'mobile',
        label: 'Mobile Development',
        icon: <Smartphone className="w-5 h-5" />
      },
      {
        id: 'devops',
        label: 'DevOps',
        icon: <Cloud className="w-5 h-5" />
      }
    ],
    variant: 'buttons',
    required: true,
    error: 'Please rank all skills to continue.',
  },
};

export const DisabledState: Story = {
  render: (args) => <InteractiveRanking {...args} />,
  args: {
    question: 'Rank these technologies by adoption rate',
    description: 'This ranking is currently disabled for demonstration.',
    items: [
      {
        id: 'react',
        label: 'React',
        icon: <Code className="w-5 h-5" />
      },
      {
        id: 'vue',
        label: 'Vue.js',
        icon: <Layers className="w-5 h-5" />
      },
      {
        id: 'angular',
        label: 'Angular',
        icon: <Monitor className="w-5 h-5" />
      }
    ],
    variant: 'buttons',
    disabled: true,
  },
};

export const MobileView: Story = {
  render: (args) => <InteractiveRanking {...args} />,
  args: {
    question: 'Rank these mobile development approaches',
    description: 'Consider your experience and project requirements.',
    items: [
      {
        id: 'native',
        label: 'Native Development',
        description: 'Platform-specific apps',
        icon: <Smartphone className="w-5 h-5" />
      },
      {
        id: 'react-native',
        label: 'React Native',
        description: 'Cross-platform framework',
        icon: <Code className="w-5 h-5" />
      },
      {
        id: 'flutter',
        label: 'Flutter',
        description: 'Google\'s UI toolkit',
        icon: <Zap className="w-5 h-5" />
      },
      {
        id: 'pwa',
        label: 'Progressive Web App',
        description: 'Web-based mobile experience',
        icon: <Globe className="w-5 h-5" />
      }
    ],
    variant: 'buttons',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Real-world Examples
export const ProjectPriorities = {
  render: () => <InteractiveRanking {...projectPrioritiesArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for ranking project priorities in a development team.',
      },
    },
  },
};

const projectPrioritiesArgs = {
  question: 'Rank these project priorities for the next quarter',
  description: 'Help us allocate resources by ranking these initiatives.',
  items: [
    {
      id: 'performance',
      label: 'Performance Optimization',
      description: 'Improve loading times and responsiveness',
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 'new-features',
      label: 'New Feature Development',
      description: 'Build requested user features',
      icon: <Lightbulb className="w-5 h-5" />
    },
    {
      id: 'bug-fixes',
      label: 'Bug Fixes',
      description: 'Address existing issues',
      icon: <Target className="w-5 h-5" />
    },
    {
      id: 'technical-debt',
      label: 'Technical Debt',
      description: 'Refactor and improve code quality',
      icon: <Book className="w-5 h-5" />
    },
    {
      id: 'documentation',
      label: 'Documentation',
      description: 'Improve developer and user docs',
      icon: <Book className="w-5 h-5" />
    }
  ],
  variant: 'drag',
  required: true,
};

export const TechStackPreferences = {
  render: () => <InteractiveRanking {...techStackArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for ranking technology preferences.',
      },
    },
  },
};

const techStackArgs = {
  question: 'Rank these backend technologies by your expertise',
  description: 'This helps us match you with relevant projects and opportunities.',
  items: [
    {
      id: 'nodejs',
      label: 'Node.js',
      description: 'JavaScript runtime for backend',
      icon: <Code className="w-5 h-5" />
    },
    {
      id: 'python',
      label: 'Python',
      description: 'Django, Flask, FastAPI',
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: 'java',
      label: 'Java',
      description: 'Spring Boot, enterprise applications',
      icon: <Coffee className="w-5 h-5" />
    },
    {
      id: 'dotnet',
      label: '.NET',
      description: 'C# and ASP.NET ecosystem',
      icon: <Monitor className="w-5 h-5" />
    },
    {
      id: 'go',
      label: 'Go',
      description: 'Google\'s systems language',
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 'rust',
      label: 'Rust',
      description: 'Systems programming language',
      icon: <Shield className="w-5 h-5" />
    }
  ],
  variant: 'buttons',
  allowSkip: true,
};