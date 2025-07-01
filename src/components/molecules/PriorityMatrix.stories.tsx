import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PriorityMatrix, MatrixItem, MatrixSelection } from './PriorityMatrix';
import { 
  Rocket, 
  Bug, 
  Wrench, 
  BookOpen, 
  TestTube, 
  Lock, 
  Zap, 
  Palette 
} from 'lucide-react';

// Icon components using Lucide React
const FeatureIcon = () => <Rocket className="w-4 h-4" />;
const BugIcon = () => <Bug className="w-4 h-4" />;
const RefactorIcon = () => <Wrench className="w-4 h-4" />;
const DocumentationIcon = () => <BookOpen className="w-4 h-4" />;
const TestingIcon = () => <TestTube className="w-4 h-4" />;
const SecurityIcon = () => <Lock className="w-4 h-4" />;
const PerformanceIcon = () => <Zap className="w-4 h-4" />;
const UIIcon = () => <Palette className="w-4 h-4" />;

const mockProjectItems: MatrixItem[] = [
  {
    id: 'user-auth',
    label: 'User Authentication',
    description: 'Implement OAuth and JWT authentication',
    icon: <SecurityIcon />,
  },
  {
    id: 'ui-redesign',
    label: 'UI Redesign',
    description: 'Modernize the user interface',
    icon: <UIIcon />,
  },
  {
    id: 'performance',
    label: 'Performance Optimization',
    description: 'Optimize database queries and caching',
    icon: <PerformanceIcon />,
  },
  {
    id: 'bug-fixes',
    label: 'Critical Bug Fixes',
    description: 'Fix high-priority user-reported bugs',
    icon: <BugIcon />,
  },
  {
    id: 'documentation',
    label: 'API Documentation',
    description: 'Complete developer documentation',
    icon: <DocumentationIcon />,
  },
  {
    id: 'testing',
    label: 'Test Coverage',
    description: 'Increase automated test coverage',
    icon: <TestingIcon />,
  },
  {
    id: 'refactoring',
    label: 'Code Refactoring',
    description: 'Clean up legacy code',
    icon: <RefactorIcon />,
  },
  {
    id: 'new-feature',
    label: 'Advanced Analytics',
    description: 'Build comprehensive analytics dashboard',
    icon: <FeatureIcon />,
  },
];

const mockFeatureItems: MatrixItem[] = [
  {
    id: 'dark-mode',
    label: 'Dark Mode',
    description: 'Add dark theme support',
    icon: <UIIcon />,
  },
  {
    id: 'mobile-app',
    label: 'Mobile App',
    description: 'Develop native mobile application',
    icon: <FeatureIcon />,
  },
  {
    id: 'search',
    label: 'Advanced Search',
    description: 'Implement full-text search with filters',
    icon: <FeatureIcon />,
  },
  {
    id: 'notifications',
    label: 'Push Notifications',
    description: 'Real-time notification system',
    icon: <FeatureIcon />,
  },
  {
    id: 'export',
    label: 'Data Export',
    description: 'Export data in multiple formats',
    icon: <FeatureIcon />,
  },
  {
    id: 'integration',
    label: 'Third-party Integrations',
    description: 'Connect with external services',
    icon: <FeatureIcon />,
  },
];

const mockInitialSelections: MatrixSelection[] = [
  { itemId: 'bug-fixes', position: { effort: 'low', impact: 'high' } },
  { itemId: 'new-feature', position: { effort: 'high', impact: 'high' } },
  { itemId: 'documentation', position: { effort: 'low', impact: 'low' } },
];

const meta = {
  title: 'Molecules/PriorityMatrix',
  component: PriorityMatrix,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A questionnaire component for prioritizing items using a 2x2 effort vs impact matrix with drag-and-drop functionality.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    question: { control: 'text' },
    description: { control: 'text' },
    items: { control: 'object' },
    value: { control: 'object' },
    onChange: { action: 'changed' },
    required: { control: 'boolean' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    allowSkip: { control: 'boolean' },
    onSkip: { action: 'skipped' },
    effortLabel: { control: 'object' },
    impactLabel: { control: 'object' },
    requireAllItems: { control: 'boolean' },
    helperText: { control: 'text' },
  },
  args: {
    onChange: fn(),
    onSkip: fn(),
    items: mockProjectItems,
  },
} satisfies Meta<typeof PriorityMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    question: 'Prioritize these development tasks',
    items: mockProjectItems.slice(0, 6),
  },
};

export const WithDescription: Story = {
  args: {
    question: 'Project Prioritization Matrix',
    description: 'Drag and drop each task into the appropriate quadrant based on the effort required and the expected impact on your project goals.',
    items: mockProjectItems,
  },
};

export const WithInitialSelections: Story = {
  args: {
    question: 'Review and adjust task priorities',
    description: 'Some tasks have been pre-positioned. Feel free to move them around based on your assessment.',
    items: mockProjectItems,
    value: mockInitialSelections,
  },
};

export const FeaturePrioritization: Story = {
  args: {
    question: 'Prioritize feature development',
    description: 'Help us understand which features should be developed first by placing them in the effort vs impact matrix.',
    items: mockFeatureItems,
  },
};

export const CustomLabels: Story = {
  args: {
    question: 'Resource allocation matrix',
    description: 'Evaluate initiatives based on resource requirements and business value.',
    items: mockProjectItems.slice(0, 6),
    effortLabel: { low: 'Quick & Easy', high: 'Resource Intensive' },
    impactLabel: { low: 'Minimal Benefit', high: 'High Business Value' },
  },
};

export const Required: Story = {
  args: {
    question: 'Complete task prioritization (Required)',
    description: 'All tasks must be positioned in the matrix before proceeding.',
    items: mockProjectItems.slice(0, 5),
    required: true,
    requireAllItems: true,
  },
};

export const WithError: Story = {
  args: {
    question: 'Prioritize critical tasks',
    description: 'Please position all high-priority tasks in the matrix.',
    items: mockProjectItems.slice(0, 4),
    value: [],
    error: 'At least one task must be placed in the "Quick Wins" quadrant.',
    requireAllItems: true,
  },
};

export const WithSkipOption: Story = {
  args: {
    question: 'Optional task prioritization',
    description: 'This prioritization exercise is optional but can help with project planning.',
    items: mockProjectItems.slice(0, 4),
    allowSkip: true,
  },
};

export const Disabled: Story = {
  args: {
    question: 'Previously submitted prioritization',
    description: 'This prioritization was submitted earlier and cannot be modified.',
    items: mockProjectItems.slice(0, 6),
    value: [
      { itemId: 'user-auth', position: { effort: 'high', impact: 'high' } },
      { itemId: 'bug-fixes', position: { effort: 'low', impact: 'high' } },
      { itemId: 'documentation', position: { effort: 'low', impact: 'low' } },
      { itemId: 'performance', position: { effort: 'high', impact: 'low' } },
    ],
    disabled: true,
    helperText: 'Contact your project manager to request changes.',
  },
};

export const LargeDataset: Story = {
  args: {
    question: 'Comprehensive project prioritization',
    description: 'Position all project initiatives in the effort vs impact matrix.',
    items: [
      ...mockProjectItems,
      ...mockFeatureItems,
      {
        id: 'maintenance',
        label: 'System Maintenance',
        description: 'Regular system upkeep and updates',
        icon: <RefactorIcon />,
      },
      {
        id: 'backup',
        label: 'Backup System',
        description: 'Implement automated backup solutions',
        icon: <SecurityIcon />,
      },
    ],
    requireAllItems: true,
  },
};

export const MixedStates: Story = {
  args: {
    question: 'Task prioritization with constraints',
    description: 'Some tasks are locked due to dependencies or resource constraints.',
    items: [
      ...mockProjectItems.slice(0, 3),
      {
        ...mockProjectItems[3],
        disabled: true,
        label: mockProjectItems[3].label + ' (Blocked)',
      },
      ...mockProjectItems.slice(4, 6),
      {
        ...mockProjectItems[6],
        disabled: true,
        label: mockProjectItems[6].label + ' (On Hold)',
      },
    ],
    value: [
      { itemId: 'user-auth', position: { effort: 'high', impact: 'high' } },
    ],
  },
};

export const QuickWinsExample: Story = {
  args: {
    question: 'Find the quick wins',
    description: 'Identify tasks that provide high impact with low effort - these are your quick wins!',
    items: mockProjectItems.slice(0, 6),
    value: [
      { itemId: 'bug-fixes', position: { effort: 'low', impact: 'high' } },
      { itemId: 'documentation', position: { effort: 'low', impact: 'low' } },
      { itemId: 'new-feature', position: { effort: 'high', impact: 'high' } },
      { itemId: 'refactoring', position: { effort: 'high', impact: 'low' } },
    ],
    helperText: 'Focus on the green "Quick Wins" quadrant for immediate value.',
  },
};

export const TeamCollaboration: Story = {
  args: {
    question: 'Team sprint prioritization',
    description: 'As a team, agree on the priority of these sprint items using the effort vs impact framework.',
    items: [
      {
        id: 'user-story-1',
        label: 'User Registration Flow',
        description: 'Streamline the user signup process',
        icon: <FeatureIcon />,
      },
      {
        id: 'user-story-2',
        label: 'Email Verification',
        description: 'Add email verification step',
        icon: <SecurityIcon />,
      },
      {
        id: 'user-story-3',
        label: 'Password Reset',
        description: 'Implement forgot password functionality',
        icon: <SecurityIcon />,
      },
      {
        id: 'user-story-4',
        label: 'Social Login',
        description: 'Add Google and GitHub authentication',
        icon: <FeatureIcon />,
      },
      {
        id: 'user-story-5',
        label: 'Profile Management',
        description: 'User profile editing interface',
        icon: <UIIcon />,
      },
    ],
    helperText: 'Drag items collaboratively to reach team consensus on priorities.',
  },
};

// Mobile-optimized story
export const MobileOptimized: Story = {
  args: {
    question: 'Mobile task prioritization',
    description: 'Touch-friendly prioritization matrix optimized for mobile devices.',
    items: mockProjectItems.slice(0, 6),
    helperText: 'Drag and drop works on mobile - use your finger to move items between quadrants.',
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
    question: 'Accessible prioritization matrix',
    description: 'This matrix includes proper ARIA labels, keyboard navigation, and screen reader support for drag-and-drop functionality.',
    items: mockProjectItems.slice(0, 5),
    required: true,
    helperText: 'All interactions are accessible via keyboard and screen readers.',
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

export const BusinessStrategy: Story = {
  args: {
    question: 'Strategic initiative prioritization',
    description: 'Position these business initiatives based on implementation effort and expected market impact.',
    items: [
      {
        id: 'expansion',
        label: 'Market Expansion',
        description: 'Enter new geographical markets',
        icon: <FeatureIcon />,
      },
      {
        id: 'product-line',
        label: 'New Product Line',
        description: 'Develop complementary products',
        icon: <FeatureIcon />,
      },
      {
        id: 'automation',
        label: 'Process Automation',
        description: 'Automate manual business processes',
        icon: <PerformanceIcon />,
      },
      {
        id: 'partnerships',
        label: 'Strategic Partnerships',
        description: 'Form key industry partnerships',
        icon: <FeatureIcon />,
      },
      {
        id: 'training',
        label: 'Staff Training',
        description: 'Comprehensive skill development program',
        icon: <DocumentationIcon />,
      },
      {
        id: 'infrastructure',
        label: 'IT Infrastructure',
        description: 'Upgrade technology infrastructure',
        icon: <PerformanceIcon />,
      },
    ],
    effortLabel: { low: 'Low Investment', high: 'High Investment' },
    impactLabel: { low: 'Limited Impact', high: 'Transformational' },
  },
};