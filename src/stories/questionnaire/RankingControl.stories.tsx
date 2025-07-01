import type { Meta, StoryObj } from '@storybook/react';
import { RankingControl, RankingList, SimpleDragDrop } from '@/components/questionnaire/RankingControl';
import { useState } from 'react';

const meta: Meta<typeof RankingControl> = {
  title: 'Questionnaire/RankingControl',
  component: RankingControl,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'React',
    description: 'A JavaScript library for building user interfaces',
    rank: 1,
    totalItems: 5,
  },
};

export const Compact: Story = {
  args: {
    label: 'TypeScript',
    rank: 2,
    totalItems: 5,
    variant: 'compact',
  },
};

export const Detailed: Story = {
  args: {
    label: 'Next.js',
    description: 'The React Framework for Production - with features like hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more.',
    rank: 3,
    totalItems: 5,
    variant: 'detailed',
  },
};

export const Selected: Story = {
  args: {
    label: 'Node.js',
    description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
    rank: 1,
    totalItems: 3,
    selected: true,
  },
};

export const Dragging: Story = {
  args: {
    label: 'Vue.js',
    description: 'The Progressive JavaScript Framework',
    rank: 2,
    totalItems: 4,
    dragging: true,
  },
};

export const Removable: Story = {
  args: {
    label: 'Angular',
    description: 'Platform for building mobile and desktop web applications',
    rank: 4,
    totalItems: 4,
    removable: true,
  },
};

export const NoRankNumber: Story = {
  args: {
    label: 'Svelte',
    description: 'Cybernetically enhanced web apps',
    rank: 1,
    totalItems: 1,
    showRankNumber: false,
  },
};

// RankingList Stories
export const RankingListStory: Story = {
  render: () => {
    const [items, setItems] = useState([
      {
        id: 'react',
        label: 'React',
        description: 'A JavaScript library for building user interfaces',
        rank: 1,
        totalItems: 5,
      },
      {
        id: 'vue',
        label: 'Vue.js',
        description: 'The Progressive JavaScript Framework',
        rank: 2,
        totalItems: 5,
      },
      {
        id: 'angular',
        label: 'Angular',
        description: 'Platform for building mobile and desktop web applications',
        rank: 3,
        totalItems: 5,
      },
      {
        id: 'svelte',
        label: 'Svelte',
        description: 'Cybernetically enhanced web apps',
        rank: 4,
        totalItems: 5,
      },
      {
        id: 'solid',
        label: 'SolidJS',
        description: 'Simple and performant reactivity for building user interfaces',
        rank: 5,
        totalItems: 5,
      },
    ]);

    const handleChange = (newItems: any[]) => {
      setItems(newItems);
    };

    return (
      <RankingList
        items={items}
        onChange={handleChange}
        maxItems={5}
      />
    );
  },
};

export const CompactRanking: Story = {
  render: () => {
    const [items, setItems] = useState([
      {
        id: 'js',
        label: 'JavaScript',
        rank: 1,
        totalItems: 4,
      },
      {
        id: 'ts',
        label: 'TypeScript',
        rank: 2,
        totalItems: 4,
      },
      {
        id: 'python',
        label: 'Python',
        rank: 3,
        totalItems: 4,
      },
      {
        id: 'rust',
        label: 'Rust',
        rank: 4,
        totalItems: 4,
      },
    ]);

    return (
      <RankingList
        items={items}
        onChange={(newItems: any[]) => setItems(newItems)}
        variant="compact"
        showInstructions={false}
      />
    );
  },
};

export const RemovableItems: Story = {
  render: () => {
    const [items, setItems] = useState([
      {
        id: 'docker',
        label: 'Docker',
        description: 'Containerization platform',
        rank: 1,
        totalItems: 3,
        removable: true,
      },
      {
        id: 'kubernetes',
        label: 'Kubernetes',
        description: 'Container orchestration system',
        rank: 2,
        totalItems: 3,
        removable: true,
      },
      {
        id: 'aws',
        label: 'AWS',
        description: 'Amazon Web Services cloud platform',
        rank: 3,
        totalItems: 3,
        removable: true,
      },
    ]);

    return (
      <RankingList
        items={items}
        onChange={(newItems: any[]) => setItems(newItems)}
        variant="detailed"
      />
    );
  },
};

export const DragDisabled: Story = {
  render: () => {
    const [items, setItems] = useState([
      {
        id: 'readonly1',
        label: 'Item 1',
        description: 'This ranking is read-only',
        rank: 1,
        totalItems: 3,
      },
      {
        id: 'readonly2',
        label: 'Item 2',
        description: 'Drag functionality is disabled',
        rank: 2,
        totalItems: 3,
      },
      {
        id: 'readonly3',
        label: 'Item 3',
        description: 'Use arrow buttons to reorder',
        rank: 3,
        totalItems: 3,
      },
    ]);

    return (
      <RankingList
        items={items}
        onChange={(newItems: any[]) => setItems(newItems)}
        dragEnabled={false}
      />
    );
  },
};

// SimpleDragDrop Stories
export const SimpleDragDropStory: Story = {
  render: () => {
    const [items, setItems] = useState([
      { id: 'item1', content: 'Frontend Development' },
      { id: 'item2', content: 'Backend Development' },
    ]);

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Drag items from the source list to the drop zone below:
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium">Available Options</h3>
            <div className="space-y-2">
              {['API Development', 'Database Design', 'DevOps', 'Testing'].map((item, index) => (
                <div
                  key={item}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/html', `source-${index}`)}
                  className="p-3 border rounded-lg bg-background cursor-grab active:cursor-grabbing hover:bg-muted/50"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Your Top Interests</h3>
            <SimpleDragDrop
              items={items}
              onChange={(itemIds) => {
                // This would normally map IDs back to full items
                console.log('Changed:', itemIds);
              }}
              placeholder="Drop your top interests here"
            />
          </div>
        </div>
      </div>
    );
  },
};

export const EmptyDragDrop: Story = {
  render: () => {
    const [items, setItems] = useState<Array<{ id: string; content: React.ReactNode }>>([]);

    return (
      <SimpleDragDrop
        items={items}
        onChange={(itemIds) => console.log('Changed:', itemIds)}
        placeholder="Drop your preferred technologies here"
      />
    );
  },
};

export const DeveloperSkillsRanking: Story = {
  render: () => {
    const [items, setItems] = useState([
      {
        id: 'problem-solving',
        label: 'Problem Solving',
        description: 'Ability to analyze and solve complex technical challenges',
        rank: 1,
        totalItems: 6,
      },
      {
        id: 'communication',
        label: 'Communication',
        description: 'Clear technical communication with team members and stakeholders',
        rank: 2,
        totalItems: 6,
      },
      {
        id: 'learning',
        label: 'Continuous Learning',
        description: 'Staying updated with new technologies and best practices',
        rank: 3,
        totalItems: 6,
      },
      {
        id: 'debugging',
        label: 'Debugging',
        description: 'Efficiently identifying and fixing bugs in code',
        rank: 4,
        totalItems: 6,
      },
      {
        id: 'architecture',
        label: 'System Design',
        description: 'Designing scalable and maintainable software architecture',
        rank: 5,
        totalItems: 6,
      },
      {
        id: 'collaboration',
        label: 'Team Collaboration',
        description: 'Working effectively in agile development teams',
        rank: 6,
        totalItems: 6,
      },
    ]);

    return (
      <div className="max-w-2xl">
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Rank Developer Skills by Importance</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Rank these skills from most important (1) to least important (6) for your role
          </p>
        </div>
        <RankingList
          items={items}
          onChange={(newItems: any[]) => setItems(newItems)}
          variant="detailed"
          maxItems={6}
        />
      </div>
    );
  },
};