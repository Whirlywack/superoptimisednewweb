import type { Meta, StoryObj } from '@storybook/react';
import { ChoiceButton, OptionGroup, LargeButtonChoice } from './ChoiceButton';
import { Code, Smartphone, Monitor, Coffee, Zap } from 'lucide-react';
import React from 'react';

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
  render: () => {
    const [selected, setSelected] = React.useState('react');
    
    return (
      <OptionGroup layout="vertical" spacing="normal">
        <ChoiceButton
          label="React"
          description="A JavaScript library for building user interfaces"
          selected={selected === 'react'}
          onClick={() => setSelected('react')}
        />
        <ChoiceButton
          label="Vue.js"
          description="The Progressive JavaScript Framework"
          selected={selected === 'vue'}
          onClick={() => setSelected('vue')}
        />
        <ChoiceButton
          label="Angular"
          description="Platform for building mobile and desktop web applications"
          selected={selected === 'angular'}
          onClick={() => setSelected('angular')}
        />
        <ChoiceButton
          label="Svelte"
          description="Cybernetically enhanced web apps"
          selected={selected === 'svelte'}
          onClick={() => setSelected('svelte')}
        />
      </OptionGroup>
    );
  },
};

export const MultiSelectGroup: Story = {
  render: () => {
    const [selected, setSelected] = React.useState(['typescript', 'python']);
    
    const handleToggle = (value: string) => {
      setSelected(prev => 
        prev.includes(value) 
          ? prev.filter(v => v !== value)
          : [...prev, value]
      );
    };
    
    return (
      <OptionGroup layout="vertical" spacing="normal">
        <ChoiceButton
          label="JavaScript"
          description="Dynamic web programming"
          selected={selected.includes('javascript')}
          onClick={() => handleToggle('javascript')}
        />
        <ChoiceButton
          label="TypeScript"
          description="Typed superset of JavaScript"
          selected={selected.includes('typescript')}
          onClick={() => handleToggle('typescript')}
        />
        <ChoiceButton
          label="Python"
          description="General-purpose programming language"
          selected={selected.includes('python')}
          onClick={() => handleToggle('python')}
        />
        <ChoiceButton
          label="Rust"
          description="Systems programming language"
          selected={selected.includes('rust')}
          onClick={() => handleToggle('rust')}
        />
        <ChoiceButton
          label="Go"
          description="Open source programming language by Google"
          selected={selected.includes('go')}
          onClick={() => handleToggle('go')}
        />
      </OptionGroup>
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    const [selected, setSelected] = React.useState('mobile');
    
    return (
      <OptionGroup layout="vertical" spacing="normal">
        <ChoiceButton
          label="Mobile Development"
          description="iOS and Android applications"
          icon={<Smartphone className="w-5 h-5" />}
          selected={selected === 'mobile'}
          onClick={() => setSelected('mobile')}
        />
        <ChoiceButton
          label="Web Development"
          description="Frontend and backend web applications"
          icon={<Monitor className="w-5 h-5" />}
          selected={selected === 'web'}
          onClick={() => setSelected('web')}
        />
        <ChoiceButton
          label="API Development"
          description="RESTful and GraphQL APIs"
          icon={<Zap className="w-5 h-5" />}
          selected={selected === 'api'}
          onClick={() => setSelected('api')}
        />
      </OptionGroup>
    );
  },
};

// LargeButtonChoice Stories
export const LargeButtonChoiceStory: Story = {
  render: () => {
    const [selected, setSelected] = React.useState('coffee');
    
    return (
      <div className="space-y-4">
        <LargeButtonChoice
          title="Coffee"
          subtitle="Rich, bold, and energizing"
          emoji="☕"
          selected={selected === 'coffee'}
          onClick={() => setSelected('coffee')}
        />
        <LargeButtonChoice
          title="Tea"
          subtitle="Calming, diverse, and refreshing"
          emoji="🍵"
          selected={selected === 'tea'}
          onClick={() => setSelected('tea')}
        />
      </div>
    );
  },
};

export const LargeButtonChoiceGrid: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<string>();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LargeButtonChoice
          title="Frontend"
          subtitle="User interfaces and experiences"
          selected={selected === 'frontend'}
          onClick={() => setSelected('frontend')}
          badge="Popular"
        />
        <LargeButtonChoice
          title="Backend"
          subtitle="Server-side logic and APIs"
          selected={selected === 'backend'}
          onClick={() => setSelected('backend')}
        />
        <LargeButtonChoice
          title="Mobile"
          subtitle="iOS and Android apps"
          selected={selected === 'mobile'}
          onClick={() => setSelected('mobile')}
        />
        <LargeButtonChoice
          title="Full Stack"
          subtitle="End-to-end development"
          selected={selected === 'fullstack'}
          onClick={() => setSelected('fullstack')}
        />
      </div>
    );
  },
};