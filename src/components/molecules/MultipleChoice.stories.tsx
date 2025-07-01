import type { Meta, StoryObj } from '@storybook/react';
import { MultipleChoice, type MultipleChoiceOption } from './MultipleChoice';
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
  Layers
} from 'lucide-react';

const meta: Meta<typeof MultipleChoice> = {
  title: 'Design System/Molecules/MultipleChoice',
  component: MultipleChoice,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A multiple choice question component optimized for mobile with a maximum of 4 options. Supports various layouts and option configurations.',
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
    layout: {
      control: 'select',
      options: ['vertical', 'grid'],
      description: 'Layout arrangement for options',
    },
    optionSize: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of option buttons',
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
    error: {
      control: 'text',
      description: 'Validation error message',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MultipleChoice>;

// Sample options data
const experienceLevels: MultipleChoiceOption[] = [
  {
    id: 'beginner',
    label: 'Beginner',
    description: 'Less than 1 year of experience',
    icon: <Users className="w-5 h-5" />
  },
  {
    id: 'intermediate',
    label: 'Intermediate',
    description: '1-3 years of experience',
    icon: <Code className="w-5 h-5" />
  },
  {
    id: 'advanced',
    label: 'Advanced',
    description: '3-5 years of experience',
    icon: <Zap className="w-5 h-5" />
  },
  {
    id: 'expert',
    label: 'Expert',
    description: '5+ years of experience',
    icon: <Shield className="w-5 h-5" />
  }
];

const frameworks: MultipleChoiceOption[] = [
  {
    id: 'react',
    label: 'React',
    description: 'A JavaScript library for building user interfaces',
    icon: <Code className="w-5 h-5" />
  },
  {
    id: 'vue',
    label: 'Vue.js',
    description: 'The Progressive JavaScript Framework',
    icon: <Layers className="w-5 h-5" />
  },
  {
    id: 'angular',
    label: 'Angular',
    description: 'Platform for building mobile and desktop web applications',
    icon: <Monitor className="w-5 h-5" />
  },
  {
    id: 'svelte',
    label: 'Svelte',
    description: 'Cybernetically enhanced web apps',
    icon: <Zap className="w-5 h-5" />
  }
];

const platforms: MultipleChoiceOption[] = [
  {
    id: 'web',
    label: 'Web Development',
    icon: <Globe className="w-5 h-5" />
  },
  {
    id: 'mobile',
    label: 'Mobile Development',
    icon: <Smartphone className="w-5 h-5" />
  },
  {
    id: 'desktop',
    label: 'Desktop Applications',
    icon: <Monitor className="w-5 h-5" />
  },
  {
    id: 'backend',
    label: 'Backend Services',
    icon: <Database className="w-5 h-5" />
  }
];

const simpleOptions: MultipleChoiceOption[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
  { id: 'maybe', label: 'Maybe' },
  { id: 'unsure', label: 'Not sure' }
];

// Interactive wrapper for stories
function InteractiveMultipleChoice(props: any) {
  const [value, setValue] = useState<string | undefined>();
  const [skipped, setSkipped] = useState(false);

  if (skipped) {
    return (
      <div className="text-center p-8 bg-light-gray rounded-lg">
        <p className="text-warm-gray">Question skipped</p>
        <button 
          onClick={() => {
            setSkipped(false);
            setValue(undefined);
          }}
          className="mt-2 text-primary text-sm hover:underline"
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <MultipleChoice
      {...props}
      value={value}
      onChange={setValue}
      onSkip={props.allowSkip ? () => setSkipped(true) : undefined}
    />
  );
}

export const Default: Story = {
  render: (args) => <InteractiveMultipleChoice {...args} />,
  args: {
    question: 'What is your current experience level with React?',
    description: 'This helps us tailor the content to your skill level.',
    options: experienceLevels,
    required: true,
    layout: 'vertical',
    optionSize: 'md',
  },
};

export const GridLayout: Story = {
  render: (args) => <InteractiveMultipleChoice {...args} />,
  args: {
    question: 'Which platform do you primarily develop for?',
    options: platforms,
    layout: 'grid',
    optionSize: 'md',
    required: false,
  },
};

export const WithSkipOption: Story = {
  render: (args) => <InteractiveMultipleChoice {...args} />,
  args: {
    question: 'Which JavaScript framework do you prefer?',
    description: 'Choose the framework you are most comfortable working with.',
    options: frameworks,
    allowSkip: true,
    layout: 'vertical',
    optionSize: 'md',
  },
};

export const SimpleChoices: Story = {
  render: (args) => <InteractiveMultipleChoice {...args} />,
  args: {
    question: 'Would you recommend this tool to a colleague?',
    options: simpleOptions,
    layout: 'grid',
    optionSize: 'sm',
    required: true,
  },
};

export const WithValidationError: Story = {
  render: (args) => <InteractiveMultipleChoice {...args} />,
  args: {
    question: 'Which deployment platform do you use most often?',
    options: [
      {
        id: 'vercel',
        label: 'Vercel',
        description: 'Frontend cloud platform',
        icon: <Cloud className="w-5 h-5" />
      },
      {
        id: 'netlify',
        label: 'Netlify',
        description: 'All-in-one platform for modern web',
        icon: <Globe className="w-5 h-5" />
      },
      {
        id: 'aws',
        label: 'AWS',
        description: 'Amazon Web Services',
        icon: <Database className="w-5 h-5" />
      },
      {
        id: 'heroku',
        label: 'Heroku',
        description: 'Cloud application platform',
        icon: <Cloud className="w-5 h-5" />
      }
    ],
    required: true,
    error: 'Please select a deployment platform to continue.',
    layout: 'vertical',
  },
};

export const DisabledState: Story = {
  render: (args) => <InteractiveMultipleChoice {...args} />,
  args: {
    question: 'Which testing framework do you prefer?',
    description: 'This question is currently disabled for demonstration.',
    options: [
      {
        id: 'jest',
        label: 'Jest',
        description: 'JavaScript testing framework',
        icon: <Code className="w-5 h-5" />
      },
      {
        id: 'vitest',
        label: 'Vitest',
        description: 'A blazing fast unit test framework',
        icon: <Zap className="w-5 h-5" />
      },
      {
        id: 'cypress',
        label: 'Cypress',
        description: 'End-to-end testing framework',
        icon: <Monitor className="w-5 h-5" />
      },
      {
        id: 'playwright',
        label: 'Playwright',
        description: 'Web testing and automation library',
        icon: <Globe className="w-5 h-5" />
      }
    ],
    disabled: true,
    layout: 'grid',
  },
};

export const LargeOptions: Story = {
  render: (args) => <InteractiveMultipleChoice {...args} />,
  args: {
    question: 'Which describes your current role best?',
    options: [
      {
        id: 'frontend',
        label: 'Frontend Developer',
        description: 'Focuses on user interface and user experience',
        icon: <Monitor className="w-5 h-5" />
      },
      {
        id: 'backend',
        label: 'Backend Developer',
        description: 'Focuses on server-side logic and databases',
        icon: <Database className="w-5 h-5" />
      },
      {
        id: 'fullstack',
        label: 'Full-Stack Developer',
        description: 'Works on both frontend and backend',
        icon: <Layers className="w-5 h-5" />
      },
      {
        id: 'devops',
        label: 'DevOps Engineer',
        description: 'Focuses on deployment and infrastructure',
        icon: <Cloud className="w-5 h-5" />
      }
    ],
    layout: 'vertical',
    optionSize: 'lg',
    required: true,
  },
};

export const WithDisabledOption: Story = {
  render: (args) => <InteractiveMultipleChoice {...args} />,
  args: {
    question: 'Which feature would you like to see next?',
    options: [
      {
        id: 'dark-mode',
        label: 'Dark Mode',
        description: 'Support for dark theme',
        icon: <Monitor className="w-5 h-5" />
      },
      {
        id: 'mobile-app',
        label: 'Mobile App',
        description: 'Native mobile application',
        icon: <Smartphone className="w-5 h-5" />
      },
      {
        id: 'api-v2',
        label: 'API v2',
        description: 'Coming soon - under development',
        icon: <Code className="w-5 h-5" />,
        disabled: true
      },
      {
        id: 'collaboration',
        label: 'Team Collaboration',
        description: 'Multi-user features',
        icon: <Users className="w-5 h-5" />
      }
    ],
    layout: 'grid',
  },
};

export const MobileView: Story = {
  render: (args) => <InteractiveMultipleChoice {...args} />,
  args: {
    question: 'How do you prefer to learn new technologies?',
    options: [
      {
        id: 'documentation',
        label: 'Official Documentation',
        description: 'Reading official docs and guides'
      },
      {
        id: 'tutorials',
        label: 'Video Tutorials',
        description: 'Following along with video content'
      },
      {
        id: 'practice',
        label: 'Hands-on Practice',
        description: 'Building projects and experimenting'
      },
      {
        id: 'courses',
        label: 'Online Courses',
        description: 'Structured learning programs'
      }
    ],
    layout: 'vertical',
    optionSize: 'lg',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Real-world Examples
export const TeamSizeQuestion = {
  render: () => <InteractiveMultipleChoice {...teamSizeArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for surveying team size and structure.',
      },
    },
  },
};

const teamSizeArgs = {
  question: 'What is the size of your development team?',
  description: 'Include all developers, designers, and product people.',
  options: [
    {
      id: 'solo',
      label: 'Solo Developer',
      description: 'Just me working on projects',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'small',
      label: 'Small Team (2-5)',
      description: '2-5 people including designers',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'medium',
      label: 'Medium Team (6-15)',
      description: '6-15 people across multiple roles',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'large',
      label: 'Large Team (16+)',
      description: '16+ people with specialized roles',
      icon: <Users className="w-5 h-5" />
    }
  ],
  required: true,
  layout: 'vertical',
  optionSize: 'md',
};

export const TechStackPreference = {
  render: () => <InteractiveMultipleChoice {...techStackArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for choosing preferred technology stack.',
      },
    },
  },
};

const techStackArgs = {
  question: 'Which full-stack combination do you prefer?',
  description: 'Consider your experience and project requirements.',
  options: [
    {
      id: 'mern',
      label: 'MERN Stack',
      description: 'MongoDB, Express, React, Node.js',
      icon: <Code className="w-5 h-5" />
    },
    {
      id: 'mean',
      label: 'MEAN Stack',
      description: 'MongoDB, Express, Angular, Node.js',
      icon: <Layers className="w-5 h-5" />
    },
    {
      id: 'lamp',
      label: 'LAMP Stack',
      description: 'Linux, Apache, MySQL, PHP',
      icon: <Database className="w-5 h-5" />
    },
    {
      id: 'jamstack',
      label: 'JAMstack',
      description: 'JavaScript, APIs, Markup',
      icon: <Globe className="w-5 h-5" />
    }
  ],
  allowSkip: true,
  layout: 'grid',
  optionSize: 'md',
};