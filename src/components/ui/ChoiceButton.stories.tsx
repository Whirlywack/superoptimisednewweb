import type { Meta, StoryObj } from '@storybook/react';
import { ChoiceButton, OptionGroup, LargeButtonChoice } from './ChoiceButton';
import { Code, Smartphone, Monitor, Coffee, Zap } from 'lucide-react';

const meta: Meta<typeof ChoiceButton> = {
  title: 'UI/ChoiceButton',
  component: ChoiceButton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'outline', 'minimal'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'React',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'TypeScript',
    description: 'Strongly typed programming language that builds on JavaScript',
  },
};

export const Selected: Story = {
  args: {
    label: 'Node.js',
    description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
    selected: true,
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Visual Studio Code',
    description: 'Free source-code editor made by Microsoft',
    icon: <Code className="w-5 h-5" />,
  },
};

export const WithShortcut: Story = {
  args: {
    label: 'Yes',
    shortcut: 'Y',
  },
};

export const MultiSelect: Story = {
  args: {
    label: 'JavaScript',
    description: 'Dynamic programming language for web development',
    multiSelect: true,
    selected: true,
  },
};

export const LargeSize: Story = {
  args: {
    label: 'Frontend Development',
    description: 'Building user interfaces and client-side applications',
    size: 'lg',
    icon: <Monitor className="w-6 h-6" />,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Coming Soon',
    description: 'This option will be available in the next version',
    disabled: true,
  },
};

// OptionGroup Stories
export const OptionGroupStory: Story = {
  render: () => (
    <OptionGroup
      value="react"
      onChange={(value) => console.log('Selected:', value)}
      options={[
        { value: 'react', label: 'React', description: 'A JavaScript library for building user interfaces' },
        { value: 'vue', label: 'Vue.js', description: 'The Progressive JavaScript Framework' },
        { value: 'angular', label: 'Angular', description: 'Platform for building mobile and desktop web applications' },
        { value: 'svelte', label: 'Svelte', description: 'Cybernetically enhanced web apps' },
      ]}
    />
  ),
};

export const MultiSelectGroup: Story = {
  render: () => (
    <OptionGroup
      value={['typescript', 'python']}
      onChange={(value) => console.log('Selected:', value)}
      multiSelect={true}
      maxSelections={3}
      options={[
        { value: 'javascript', label: 'JavaScript', description: 'Dynamic web programming' },
        { value: 'typescript', label: 'TypeScript', description: 'Typed superset of JavaScript' },
        { value: 'python', label: 'Python', description: 'General-purpose programming language' },
        { value: 'rust', label: 'Rust', description: 'Systems programming language' },
        { value: 'go', label: 'Go', description: 'Open source programming language by Google' },
      ]}
    />
  ),
};

export const WithIcons: Story = {
  render: () => (
    <OptionGroup
      value="mobile"
      onChange={(value) => console.log('Selected:', value)}
      options={[
        { 
          value: 'mobile', 
          label: 'Mobile Development', 
          description: 'iOS and Android applications',
          icon: <Smartphone className="w-5 h-5" />
        },
        { 
          value: 'web', 
          label: 'Web Development', 
          description: 'Frontend and backend web applications',
          icon: <Monitor className="w-5 h-5" />
        },
        { 
          value: 'api', 
          label: 'API Development', 
          description: 'RESTful and GraphQL APIs',
          icon: <Zap className="w-5 h-5" />
        },
      ]}
    />
  ),
};

// LargeButtonChoice Stories
export const LargeButtonChoiceStory: Story = {
  render: () => (
    <div className="space-y-4">
      <LargeButtonChoice
        title="Coffee or Tea?"
        subtitle="What's your preferred morning beverage?"
        value="coffee"
        onChange={(value) => console.log('Selected:', value)}
        options={[
          { 
            value: 'coffee', 
            label: 'Coffee', 
            description: 'Rich, bold, and energizing',
            icon: <Coffee className="w-8 h-8" />
          },
          { 
            value: 'tea', 
            label: 'Tea', 
            description: 'Calming, diverse, and refreshing',
            icon: '🍵'
          },
        ]}
      />
    </div>
  ),
};

export const LargeButtonChoiceGrid: Story = {
  render: () => (
    <LargeButtonChoice
      title="Development Focus"
      subtitle="What type of development interests you most?"
      value={undefined}
      onChange={(value) => console.log('Selected:', value)}
      layout="grid"
      options={[
        { 
          value: 'frontend', 
          label: 'Frontend', 
          description: 'User interfaces and experiences',
          icon: <Monitor className="w-8 h-8" />
        },
        { 
          value: 'backend', 
          label: 'Backend', 
          description: 'Server-side logic and APIs',
          icon: <Zap className="w-8 h-8" />
        },
        { 
          value: 'mobile', 
          label: 'Mobile', 
          description: 'iOS and Android apps',
          icon: <Smartphone className="w-8 h-8" />
        },
        { 
          value: 'fullstack', 
          label: 'Full Stack', 
          description: 'End-to-end development',
          icon: <Code className="w-8 h-8" />
        },
      ]}
    />
  ),
};