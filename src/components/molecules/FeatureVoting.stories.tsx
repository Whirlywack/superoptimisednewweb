import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FeatureVoting, VotingOption, FeatureVote } from './FeatureVoting';
import { 
  Rocket, 
  Shield, 
  Zap, 
  BarChart3, 
  Cloud, 
  Smartphone, 
  Lock, 
  Link, 
  Bot, 
  Users,
  Bug,
  Wrench,
  BookOpen,
  Palette,
  WifiOff,
  Search
} from 'lucide-react';

// Icon components using Lucide React
const RocketIcon = () => <Rocket className="w-4 h-4" />;
const ShieldIcon = () => <Shield className="w-4 h-4" />;
const SpeedIcon = () => <Zap className="w-4 h-4" />;
const ChartIcon = () => <BarChart3 className="w-4 h-4" />;
const CloudIcon = () => <Cloud className="w-4 h-4" />;
const MobileIcon = () => <Smartphone className="w-4 h-4" />;
const SecurityIcon = () => <Lock className="w-4 h-4" />;
const IntegrationIcon = () => <Link className="w-4 h-4" />;
const AIIcon = () => <Bot className="w-4 h-4" />;
const TeamIcon = () => <Users className="w-4 h-4" />;

const mockFeatureOptions: VotingOption[] = [
  {
    id: 'performance',
    label: 'Performance Improvements',
    description: 'Optimize loading speed and reduce resource usage',
    icon: <SpeedIcon />,
  },
  {
    id: 'security',
    label: 'Enhanced Security',
    description: 'Add two-factor authentication and encryption',
    icon: <ShieldIcon />,
  },
  {
    id: 'analytics',
    label: 'Advanced Analytics',
    description: 'Detailed insights and custom reporting features',
    icon: <ChartIcon />,
  },
  {
    id: 'mobile',
    label: 'Mobile Application',
    description: 'Native iOS and Android apps with offline support',
    icon: <MobileIcon />,
  },
  {
    id: 'ai-features',
    label: 'AI-Powered Features',
    description: 'Smart recommendations and automated workflows',
    icon: <AIIcon />,
  },
  {
    id: 'collaboration',
    label: 'Team Collaboration',
    description: 'Real-time editing and team communication tools',
    icon: <TeamIcon />,
  },
];

const mockPriorityOptions: VotingOption[] = [
  {
    id: 'critical-bugs',
    label: 'Fix Critical Bugs',
    description: 'Address system-breaking issues',
    minPoints: 5, // Must allocate at least 5 points
    icon: <Bug className="w-4 h-4" />,
  },
  {
    id: 'new-features',
    label: 'New Feature Development',
    description: 'Build requested functionality',
    maxPoints: 30, // Can't allocate more than 30 points
    icon: <RocketIcon />,
  },
  {
    id: 'tech-debt',
    label: 'Technical Debt',
    description: 'Refactor and improve code quality',
    icon: <Wrench className="w-4 h-4" />,
  },
  {
    id: 'documentation',
    label: 'Documentation',
    description: 'Improve developer and user docs',
    maxPoints: 20,
    icon: <BookOpen className="w-4 h-4" />,
  },
];

const mockInitialVotes: FeatureVote[] = [
  { optionId: 'performance', points: 30 },
  { optionId: 'security', points: 25 },
  { optionId: 'analytics', points: 15 },
];

const meta = {
  title: 'Molecules/FeatureVoting',
  component: FeatureVoting,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A questionnaire component that allows users to allocate a limited number of points across different options to indicate priority or preference.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    question: { control: 'text' },
    description: { control: 'text' },
    options: { control: 'object' },
    totalPoints: { control: 'number' },
    value: { control: 'object' },
    onChange: { action: 'changed' },
    required: { control: 'boolean' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    allowSkip: { control: 'boolean' },
    onSkip: { action: 'skipped' },
    pointStep: { control: 'number' },
    requireAllPoints: { control: 'boolean' },
    layout: {
      control: 'select',
      options: ['cards', 'list', 'compact'],
    },
    helperText: { control: 'text' },
  },
  args: {
    onChange: fn(),
    onSkip: fn(),
    options: mockFeatureOptions,
    totalPoints: 100,
  },
} satisfies Meta<typeof FeatureVoting>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    question: 'How would you prioritize these features?',
    options: mockFeatureOptions.slice(0, 4),
  },
};

export const WithDescription: Story = {
  args: {
    question: 'Allocate your development budget',
    description: 'You have 100 points to distribute across potential features. Allocate more points to features you consider more important.',
    options: mockFeatureOptions,
  },
};

export const WithInitialVotes: Story = {
  args: {
    question: 'Review your feature priorities',
    description: 'Adjust the point allocation based on your current needs.',
    options: mockFeatureOptions,
    value: mockInitialVotes,
  },
};

export const RequireAllPoints: Story = {
  args: {
    question: 'Complete budget allocation required',
    description: 'All 100 points must be allocated before proceeding.',
    options: mockFeatureOptions.slice(0, 4),
    requireAllPoints: true,
    required: true,
  },
};

export const WithConstraints: Story = {
  args: {
    question: 'Priority allocation with constraints',
    description: 'Some items have minimum or maximum point requirements.',
    options: mockPriorityOptions,
    totalPoints: 100,
    helperText: 'Critical bugs require at least 5 points. Some items have maximum limits.',
  },
};

export const LargePointStep: Story = {
  args: {
    question: 'Allocate resources in increments of 5',
    description: 'Points can only be allocated in multiples of 5.',
    options: mockFeatureOptions.slice(0, 4),
    pointStep: 5,
    totalPoints: 100,
  },
};

export const SmallBudget: Story = {
  args: {
    question: 'Limited budget allocation',
    description: 'You only have 20 points to allocate. Choose wisely!',
    options: mockFeatureOptions.slice(0, 3),
    totalPoints: 20,
    requireAllPoints: true,
  },
};

export const ListLayout: Story = {
  args: {
    question: 'Feature priority list',
    description: 'Allocate points to each feature in the list.',
    options: mockFeatureOptions,
    layout: 'list',
  },
};

export const CompactLayout: Story = {
  args: {
    question: 'Quick priority voting',
    description: 'Compact view for faster point allocation.',
    options: mockFeatureOptions.slice(0, 8),
    layout: 'compact',
    totalPoints: 50,
  },
};

export const WithError: Story = {
  args: {
    question: 'Complete your feature voting',
    description: 'Please allocate points to indicate your preferences.',
    options: mockFeatureOptions.slice(0, 4),
    value: [],
    error: 'You must allocate at least some points to continue.',
    requireAllPoints: false,
  },
};

export const WithSkipOption: Story = {
  args: {
    question: 'Optional feature prioritization',
    description: 'Help us understand your preferences, or skip if you\'re unsure.',
    options: mockFeatureOptions.slice(0, 4),
    allowSkip: true,
  },
};

export const Disabled: Story = {
  args: {
    question: 'Previously submitted priorities',
    description: 'This allocation was submitted earlier and cannot be modified.',
    options: mockFeatureOptions.slice(0, 4),
    value: [
      { optionId: 'performance', points: 40 },
      { optionId: 'security', points: 30 },
      { optionId: 'analytics', points: 20 },
      { optionId: 'mobile', points: 10 },
    ],
    disabled: true,
    helperText: 'Contact your project manager to request changes.',
  },
};

export const TeamBudgeting: Story = {
  args: {
    question: 'Team sprint point allocation',
    description: 'As a team, decide how to allocate your 50 story points across these epics.',
    options: [
      {
        id: 'user-auth',
        label: 'User Authentication Epic',
        description: 'OAuth, SSO, and permission system',
        icon: <SecurityIcon />,
      },
      {
        id: 'api-v2',
        label: 'API v2 Development',
        description: 'RESTful API with GraphQL support',
        icon: <IntegrationIcon />,
      },
      {
        id: 'ui-redesign',
        label: 'UI/UX Redesign',
        description: 'Modern, accessible interface update',
        icon: <Palette className="w-4 h-4" />,
      },
      {
        id: 'cloud-migration',
        label: 'Cloud Migration',
        description: 'Move infrastructure to cloud platform',
        icon: <CloudIcon />,
      },
    ],
    totalPoints: 50,
    pointStep: 5,
    requireAllPoints: true,
    helperText: 'Allocate story points in increments of 5. All points must be allocated.',
  },
};

export const SurveyStyle: Story = {
  args: {
    question: 'How important are these aspects to you?',
    description: 'Distribute 100 points to show the relative importance of each aspect.',
    options: [
      {
        id: 'ease-of-use',
        label: 'Ease of Use',
        description: 'Intuitive interface and user experience',
      },
      {
        id: 'performance',
        label: 'Performance',
        description: 'Speed and responsiveness',
      },
      {
        id: 'features',
        label: 'Feature Set',
        description: 'Comprehensive functionality',
      },
      {
        id: 'price',
        label: 'Price',
        description: 'Value for money',
      },
      {
        id: 'support',
        label: 'Customer Support',
        description: 'Help and documentation quality',
      },
    ],
    totalPoints: 100,
    layout: 'list',
  },
};

// Mobile-optimized story
export const MobileOptimized: Story = {
  args: {
    question: 'Mobile voting interface',
    description: 'Touch-friendly controls for point allocation.',
    options: mockFeatureOptions.slice(0, 4),
    layout: 'cards',
    totalPoints: 50,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Accessibility testing
export const AccessibilityShowcase: Story = {
  args: {
    question: 'Accessible voting interface',
    description: 'This component includes proper ARIA labels, keyboard navigation, and clear visual feedback.',
    options: mockFeatureOptions.slice(0, 4),
    required: true,
    totalPoints: 100,
    helperText: 'Use keyboard arrows or buttons to adjust point allocations.',
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'keyboard-navigation',
            enabled: true,
          },
        ],
      },
    },
  },
};

export const ManyOptions: Story = {
  args: {
    question: 'Comprehensive feature voting',
    description: 'Allocate points across a large number of potential features.',
    options: [
      ...mockFeatureOptions,
      {
        id: 'offline-mode',
        label: 'Offline Mode',
        description: 'Work without internet connection',
        icon: <WifiOff className="w-4 h-4" />,
      },
      {
        id: 'api-webhooks',
        label: 'Webhooks & API',
        description: 'Integration capabilities',
        icon: <IntegrationIcon />,
      },
      {
        id: 'custom-branding',
        label: 'Custom Branding',
        description: 'White-label options',
        icon: <Palette className="w-4 h-4" />,
      },
      {
        id: 'advanced-search',
        label: 'Advanced Search',
        description: 'Powerful search and filtering',
        icon: <Search className="w-4 h-4" />,
      },
    ],
    totalPoints: 200,
    layout: 'compact',
  },
};

export const IncrementalVoting: Story = {
  args: {
    question: 'Rate feature importance (1-10 scale)',
    description: 'Allocate between 1-10 points to each feature.',
    options: mockFeatureOptions.slice(0, 4).map(opt => ({
      ...opt,
      minPoints: 1,
      maxPoints: 10,
    })),
    totalPoints: 40,
    pointStep: 1,
    helperText: 'Each feature must receive between 1 and 10 points.',
  },
};