import type { Meta, StoryObj } from '@storybook/react';
import { CodeApproachComparison, type CodeApproach } from './CodeApproachComparison';

const meta: Meta<typeof CodeApproachComparison> = {
  title: 'Molecules/CodeApproachComparison',
  component: CodeApproachComparison,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component for comparing different code approaches side by side, commonly used in technical questionnaires to evaluate developer preferences for implementation strategies.',
      },
    },
  },
  argTypes: {
    question: {
      control: 'text',
      description: 'The question text asking users to compare approaches',
    },
    approaches: {
      control: 'object',
      description: 'Array of code approaches to compare (typically 2)',
    },
    value: {
      control: 'text',
      description: 'Currently selected approach ID',
    },
    layout: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Layout orientation for the comparison',
    },
    showMetadata: {
      control: 'boolean',
      description: 'Whether to show performance metadata badges',
    },
    showProsAndCons: {
      control: 'boolean',
      description: 'Whether to show pros and cons lists',
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
type Story = StoryObj<typeof CodeApproachComparison>;

const sampleApproaches: CodeApproach[] = [
  {
    id: 'functional',
    title: 'Functional Approach',
    description: 'Using functional programming principles with immutability',
    language: 'TypeScript',
    code: `// Functional approach with immutability
const processUsers = (users: User[]) => {
  return users
    .filter(user => user.isActive)
    .map(user => ({
      ...user,
      displayName: \`\${user.firstName} \${user.lastName}\`
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
};`,
    pros: [
      'Immutable data structures',
      'Pure functions with no side effects',
      'Easy to test and reason about',
      'Functional composition'
    ],
    cons: [
      'May create more objects',
      'Learning curve for new developers',
      'Can be verbose for simple operations'
    ],
    metadata: {
      performance: 'medium',
      complexity: 'moderate',
      maintainability: 'easy'
    }
  },
  {
    id: 'imperative',
    title: 'Imperative Approach',
    description: 'Using traditional imperative style with mutations',
    language: 'TypeScript',
    code: `// Imperative approach with mutations
const processUsers = (users: User[]) => {
  const result: ProcessedUser[] = [];
  
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (user.isActive) {
      user.displayName = \`\${user.firstName} \${user.lastName}\`;
      result.push(user);
    }
  }
  
  result.sort((a, b) => a.displayName.localeCompare(b.displayName));
  return result;
};`,
    pros: [
      'More performant for large datasets',
      'Familiar to most developers',
      'Direct control over execution',
      'Less memory allocation'
    ],
    cons: [
      'Mutates original data',
      'More complex control flow',
      'Harder to parallelize',
      'Side effects possible'
    ],
    metadata: {
      performance: 'high',
      complexity: 'simple',
      maintainability: 'moderate'
    }
  }
];

const complexApproaches: CodeApproach[] = [
  {
    id: 'class-based',
    title: 'Class-Based Architecture',
    description: 'Object-oriented approach with inheritance',
    language: 'TypeScript',
    code: `class UserProcessor {
  private users: User[];
  
  constructor(users: User[]) {
    this.users = users;
  }
  
  filterActive(): this {
    this.users = this.users.filter(user => user.isActive);
    return this;
  }
  
  addDisplayName(): this {
    this.users.forEach(user => {
      user.displayName = \`\${user.firstName} \${user.lastName}\`;
    });
    return this;
  }
  
  sort(): this {
    this.users.sort((a, b) => 
      a.displayName.localeCompare(b.displayName)
    );
    return this;
  }
  
  getResult(): User[] {
    return this.users;
  }
}

const processUsers = (users: User[]) => {
  return new UserProcessor(users)
    .filterActive()
    .addDisplayName()
    .sort()
    .getResult();
};`,
    pros: [
      'Method chaining for readability',
      'Encapsulation of logic',
      'Reusable processor class',
      'Clear separation of concerns'
    ],
    cons: [
      'More complex setup',
      'Object creation overhead',
      'Potential memory leaks',
      'Over-engineering for simple tasks'
    ],
    metadata: {
      performance: 'low',
      complexity: 'complex',
      maintainability: 'moderate'
    }
  },
  {
    id: 'pipeline',
    title: 'Pipeline Architecture',
    description: 'Composable pipeline with middleware pattern',
    language: 'TypeScript',
    code: `type Pipeline<T> = (data: T) => T;

const createPipeline = <T>(...steps: Pipeline<T>[]): Pipeline<T> => {
  return (data: T) => steps.reduce((acc, step) => step(acc), data);
};

const filterActive: Pipeline<User[]> = users => 
  users.filter(user => user.isActive);

const addDisplayName: Pipeline<User[]> = users =>
  users.map(user => ({
    ...user,
    displayName: \`\${user.firstName} \${user.lastName}\`
  }));

const sortByName: Pipeline<User[]> = users =>
  [...users].sort((a, b) => 
    a.displayName.localeCompare(b.displayName)
  );

const processUsers = createPipeline(
  filterActive,
  addDisplayName,
  sortByName
);`,
    pros: [
      'Highly composable',
      'Testable individual steps',
      'Functional composition',
      'Reusable pipeline steps'
    ],
    cons: [
      'Higher abstraction overhead',
      'May be overkill for simple cases',
      'Learning curve required',
      'Debugging can be complex'
    ],
    metadata: {
      performance: 'medium',
      complexity: 'complex',
      maintainability: 'easy'
    }
  }
];

export const Default: Story = {
  args: {
    question: 'Which approach would you prefer for processing user data?',
    description: 'Compare these two implementation strategies and select the one you find more suitable for a typical web application.',
    approaches: sampleApproaches,
    layout: 'horizontal',
    showMetadata: true,
    showProsAndCons: true,
    required: false,
    allowSkip: false,
    disabled: false,
  },
};

export const WithSelection: Story = {
  args: {
    ...Default.args,
    value: 'functional',
    description: 'This example shows a pre-selected approach.',
  },
};

export const VerticalLayout: Story = {
  args: {
    ...Default.args,
    layout: 'vertical',
    description: 'Vertical layout works better on mobile devices and for longer code snippets.',
  },
};

export const WithoutMetadata: Story = {
  args: {
    ...Default.args,
    showMetadata: false,
    description: 'Simplified view without performance metadata badges.',
  },
};

export const WithoutProsAndCons: Story = {
  args: {
    ...Default.args,
    showProsAndCons: false,
    description: 'Focus only on the code without detailed pros and cons.',
  },
};

export const MinimalView: Story = {
  args: {
    ...Default.args,
    showMetadata: false,
    showProsAndCons: false,
    description: 'Clean, minimal view showing only the code approaches.',
    approaches: sampleApproaches.map(approach => ({
      ...approach,
      description: undefined,
    })),
  },
};

export const ComplexComparison: Story = {
  args: {
    question: 'Which architectural pattern would you choose for a large-scale application?',
    description: 'Evaluate these more complex architectural approaches for building scalable systems.',
    approaches: complexApproaches,
    layout: 'vertical',
    showMetadata: true,
    showProsAndCons: true,
    required: true,
    allowSkip: false,
  },
};

export const Required: Story = {
  args: {
    ...Default.args,
    required: true,
    error: 'Please select an approach to continue.',
  },
};

export const WithSkipOption: Story = {
  args: {
    ...Default.args,
    allowSkip: true,
    description: 'This question includes a skip option for optional responses.',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    value: 'functional',
    description: 'Disabled state showing a previously selected approach.',
  },
};

export const ErrorState: Story = {
  args: {
    ...Default.args,
    error: 'Please select one of the code approaches above.',
    required: true,
  },
};

export const SingleApproach: Story = {
  args: {
    question: 'Do you approve of this implementation approach?',
    description: 'Sometimes you need to show just one approach for approval.',
    approaches: [sampleApproaches[0]],
    layout: 'vertical',
    showMetadata: true,
    showProsAndCons: true,
  },
};

export const MobileOptimized: Story = {
  args: {
    ...Default.args,
    layout: 'vertical',
    showMetadata: true,
    showProsAndCons: false,
    description: 'Optimized for mobile viewing with vertical layout and simplified content.',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};