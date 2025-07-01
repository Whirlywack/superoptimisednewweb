import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TechStackSelector, TechStackOption } from './TechStackSelector';

// Mock icons for stories (in real app, use actual icons)
const ReactIcon = () => <span>⚛️</span>;
const VueIcon = () => <span>💚</span>;
const AngularIcon = () => <span>🅰️</span>;
const NodeIcon = () => <span>🟢</span>;
const PythonIcon = () => <span>🐍</span>;
const JavaIcon = () => <span>☕</span>;
const DatabaseIcon = () => <span>🗄️</span>;
const CloudIcon = () => <span>☁️</span>;
const DevOpsIcon = () => <span>🔧</span>;

const mockTechOptions: TechStackOption[] = [
  // Frontend
  {
    id: 'react',
    label: 'React',
    description: 'A JavaScript library for building user interfaces',
    category: 'Frontend',
    icon: <ReactIcon />,
    popular: true,
  },
  {
    id: 'vue',
    label: 'Vue.js',
    description: 'Progressive JavaScript framework for building UIs',
    category: 'Frontend',
    icon: <VueIcon />,
    popular: true,
  },
  {
    id: 'angular',
    label: 'Angular',
    description: 'Platform for building mobile and desktop web applications',
    category: 'Frontend',
    icon: <AngularIcon />,
  },
  {
    id: 'svelte',
    label: 'Svelte',
    description: 'Cybernetically enhanced web apps',
    category: 'Frontend',
  },
  {
    id: 'nextjs',
    label: 'Next.js',
    description: 'React framework with hybrid static & server rendering',
    category: 'Frontend',
    icon: <ReactIcon />,
    popular: true,
  },
  {
    id: 'nuxtjs',
    label: 'Nuxt.js',
    description: 'Vue.js framework for universal applications',
    category: 'Frontend',
    icon: <VueIcon />,
  },
  
  // Backend
  {
    id: 'nodejs',
    label: 'Node.js',
    description: 'JavaScript runtime built on Chrome V8 engine',
    category: 'Backend',
    icon: <NodeIcon />,
    popular: true,
  },
  {
    id: 'python',
    label: 'Python',
    description: 'High-level programming language for rapid development',
    category: 'Backend',
    icon: <PythonIcon />,
    popular: true,
  },
  {
    id: 'java',
    label: 'Java',
    description: 'Object-oriented programming language',
    category: 'Backend',
    icon: <JavaIcon />,
  },
  {
    id: 'dotnet',
    label: '.NET',
    description: 'Free, cross-platform, open-source developer platform',
    category: 'Backend',
  },
  {
    id: 'php',
    label: 'PHP',
    description: 'Popular general-purpose scripting language',
    category: 'Backend',
  },
  {
    id: 'ruby',
    label: 'Ruby',
    description: 'Dynamic, open source programming language',
    category: 'Backend',
  },
  {
    id: 'go',
    label: 'Go',
    description: 'Open source programming language by Google',
    category: 'Backend',
  },
  {
    id: 'rust',
    label: 'Rust',
    description: 'Systems programming language focused on safety and performance',
    category: 'Backend',
  },
  
  // Database
  {
    id: 'postgresql',
    label: 'PostgreSQL',
    description: 'Advanced open-source relational database',
    category: 'Database',
    icon: <DatabaseIcon />,
    popular: true,
  },
  {
    id: 'mysql',
    label: 'MySQL',
    description: 'Open-source relational database management system',
    category: 'Database',
    icon: <DatabaseIcon />,
  },
  {
    id: 'mongodb',
    label: 'MongoDB',
    description: 'Document database with scalability and flexibility',
    category: 'Database',
    icon: <DatabaseIcon />,
    popular: true,
  },
  {
    id: 'redis',
    label: 'Redis',
    description: 'In-memory data structure store',
    category: 'Database',
    icon: <DatabaseIcon />,
  },
  
  // Cloud
  {
    id: 'aws',
    label: 'AWS',
    description: 'Amazon Web Services cloud platform',
    category: 'Cloud',
    icon: <CloudIcon />,
    popular: true,
  },
  {
    id: 'gcp',
    label: 'Google Cloud',
    description: 'Google Cloud Platform services',
    category: 'Cloud',
    icon: <CloudIcon />,
  },
  {
    id: 'azure',
    label: 'Azure',
    description: 'Microsoft cloud computing platform',
    category: 'Cloud',
    icon: <CloudIcon />,
  },
  {
    id: 'vercel',
    label: 'Vercel',
    description: 'Platform for frontend frameworks and static sites',
    category: 'Cloud',
  },
  {
    id: 'netlify',
    label: 'Netlify',
    description: 'Platform for web development and deployment',
    category: 'Cloud',
  },
  
  // DevOps
  {
    id: 'docker',
    label: 'Docker',
    description: 'Platform for developing and running applications in containers',
    category: 'DevOps',
    icon: <DevOpsIcon />,
    popular: true,
  },
  {
    id: 'kubernetes',
    label: 'Kubernetes',
    description: 'Container orchestration platform',
    category: 'DevOps',
    icon: <DevOpsIcon />,
  },
  {
    id: 'terraform',
    label: 'Terraform',
    description: 'Infrastructure as code software tool',
    category: 'DevOps',
    icon: <DevOpsIcon />,
  },
];

const meta = {
  title: 'Molecules/TechStackSelector',
  component: TechStackSelector,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A questionnaire component for selecting multiple technologies from a categorized list with search functionality.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    question: { control: 'text' },
    description: { control: 'text' },
    value: { control: 'object' },
    onChange: { action: 'changed' },
    required: { control: 'boolean' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    allowSkip: { control: 'boolean' },
    onSkip: { action: 'skipped' },
    maxSelections: { control: 'number' },
    minSelections: { control: 'number' },
    layout: { 
      control: 'select', 
      options: ['grid', 'list', 'compact'] 
    },
    groupByCategory: { control: 'boolean' },
    showCount: { control: 'boolean' },
    helperText: { control: 'text' },
  },
  args: {
    onChange: fn(),
    onSkip: fn(),
    options: mockTechOptions,
  },
} satisfies Meta<typeof TechStackSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    question: 'What technologies do you work with?',
    options: mockTechOptions.slice(0, 8), // Show fewer options for cleaner default view
  },
};

export const WithDescription: Story = {
  args: {
    question: 'Select your primary technology stack',
    description: 'Choose the technologies you use most frequently in your development work. This helps us understand your technical background.',
    options: mockTechOptions.slice(0, 12),
  },
};

export const GroupedByCategory: Story = {
  args: {
    question: 'What is your technology stack?',
    description: 'Select all technologies you have experience with, organized by category.',
    options: mockTechOptions,
    groupByCategory: true,
    layout: 'grid',
  },
};

export const CompactLayout: Story = {
  args: {
    question: 'Quick tech selection',
    description: 'Compact view for faster selection with more options visible at once.',
    options: mockTechOptions,
    layout: 'compact',
    groupByCategory: true,
  },
};

export const ListLayout: Story = {
  args: {
    question: 'Detailed technology preferences',
    description: 'List view showing full descriptions for informed decision making.',
    options: mockTechOptions.slice(0, 10),
    layout: 'list',
  },
};

export const WithSelectionLimits: Story = {
  args: {
    question: 'Choose your top 3 technologies',
    description: 'Select up to 3 technologies you are most proficient with.',
    options: mockTechOptions.slice(0, 15),
    maxSelections: 3,
    minSelections: 1,
    showCount: true,
    helperText: 'Choose wisely - you can only select 3 technologies.',
  },
};

export const Required: Story = {
  args: {
    question: 'What is your primary frontend framework?',
    description: 'This information is required to customize your experience.',
    options: mockTechOptions.filter(opt => opt.category === 'Frontend'),
    required: true,
    minSelections: 1,
    maxSelections: 2,
    showCount: true,
  },
};

export const WithPreselection: Story = {
  args: {
    question: 'Update your technology stack',
    description: 'Your current selections are shown below. Add or remove technologies as needed.',
    options: mockTechOptions,
    value: ['react', 'nodejs', 'postgresql', 'aws'],
    groupByCategory: true,
    showCount: true,
  },
};

export const WithError: Story = {
  args: {
    question: 'Select your backend technologies',
    description: 'Please choose at least one backend technology from the list.',
    options: mockTechOptions.filter(opt => opt.category === 'Backend'),
    value: [],
    error: 'At least one backend technology must be selected.',
    minSelections: 1,
    required: true,
  },
};

export const WithSkipOption: Story = {
  args: {
    question: 'Any additional technologies not listed?',
    description: 'Feel free to skip if you don\'t use any technologies outside the main categories.',
    options: mockTechOptions.filter(opt => !opt.popular),
    allowSkip: true,
  },
};

export const Disabled: Story = {
  args: {
    question: 'Your registered technology stack',
    description: 'This information was provided during registration and cannot be modified.',
    options: mockTechOptions,
    value: ['react', 'nodejs', 'postgresql'],
    disabled: true,
    helperText: 'Contact support to update your technology preferences.',
  },
};

export const SearchableList: Story = {
  args: {
    question: 'Find and select your technologies',
    description: 'Use the search box to quickly find specific technologies from our comprehensive list.',
    options: mockTechOptions,
    groupByCategory: true,
    helperText: 'Start typing to search through all available technologies.',
  },
};

export const MixedStates: Story = {
  args: {
    question: 'Technology assessment',
    description: 'Some technologies may be disabled based on your current plan.',
    options: [
      ...mockTechOptions.slice(0, 5),
      { 
        ...mockTechOptions[5], 
        disabled: true, 
        label: mockTechOptions[5].label + ' (Pro only)' 
      },
      ...mockTechOptions.slice(6, 10),
      { 
        ...mockTechOptions[10], 
        disabled: true, 
        label: mockTechOptions[10].label + ' (Enterprise only)' 
      },
    ],
    value: ['react', 'nodejs'],
    showCount: true,
  },
};

export const PopularTechnologies: Story = {
  args: {
    question: 'Select from popular technologies',
    description: 'These are the most commonly used technologies in our community.',
    options: mockTechOptions.filter(opt => opt.popular),
    layout: 'grid',
    helperText: 'Popular choices based on community usage.',
  },
};

// Mobile-optimized story
export const MobileOptimized: Story = {
  args: {
    question: 'Mobile-friendly tech selection',
    description: 'Optimized for touch interaction with appropriate spacing and sizing.',
    options: mockTechOptions.slice(0, 12),
    layout: 'list',
    groupByCategory: true,
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
    question: 'Accessible technology selection',
    description: 'This component includes proper ARIA labels, keyboard navigation, and screen reader support.',
    options: mockTechOptions.slice(0, 8),
    required: true,
    maxSelections: 5,
    showCount: true,
    helperText: 'All options are keyboard navigable and screen reader accessible.',
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

// Performance test with many options
export const LargeDataset: Story = {
  args: {
    question: 'Comprehensive technology selection',
    description: 'Testing performance with a large number of options and search functionality.',
    options: [
      ...mockTechOptions,
      // Add more mock options for testing
      ...Array.from({ length: 50 }, (_, i) => ({
        id: `tech-${i}`,
        label: `Technology ${i + 1}`,
        description: `Description for technology ${i + 1}`,
        category: ['Frontend', 'Backend', 'Database', 'Cloud', 'DevOps'][i % 5],
      })),
    ],
    groupByCategory: true,
    layout: 'compact',
    showCount: true,
    helperText: 'Search functionality helps manage large lists efficiently.',
  },
};