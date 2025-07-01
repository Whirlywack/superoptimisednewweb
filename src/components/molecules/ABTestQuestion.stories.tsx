import type { Meta, StoryObj } from '@storybook/react';
import { ABTestQuestion, type ABTestOption } from './ABTestQuestion';
import { useState } from 'react';

const meta: Meta<typeof ABTestQuestion> = {
  title: 'Design System/Molecules/ABTestQuestion',
  component: ABTestQuestion,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A specialized question component for comparing two technical approaches. Designed for developer surveys and technical decision-making scenarios.',
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
    error: {
      control: 'text',
      description: 'Validation error message',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ABTestQuestion>;

// Sample data for stories
const reactOptions: { optionA: ABTestOption; optionB: ABTestOption } = {
  optionA: {
    id: 'useState',
    title: 'useState Hook',
    description: 'Use React\'s built-in useState hook for local component state management.',
    codeExample: `const [count, setCount] = useState(0);

const increment = () => {
  setCount(count + 1);
};`,
    pros: [
      'Simple and straightforward',
      'Built into React',
      'Great for local state',
      'Minimal boilerplate'
    ],
    cons: [
      'Limited to component scope',
      'Can cause prop drilling',
      'Not great for complex state'
    ],
    performance: 'Excellent',
    maintainability: 'High'
  },
  optionB: {
    id: 'zustand',
    title: 'Zustand Store',
    description: 'Use Zustand for global state management with a simple API.',
    codeExample: `const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ 
    count: state.count + 1 
  })),
}));`,
    pros: [
      'Global state access',
      'Minimal boilerplate',
      'TypeScript friendly',
      'Devtools support'
    ],
    cons: [
      'Additional dependency',
      'Overkill for simple state',
      'Learning curve'
    ],
    performance: 'Very Good',
    maintainability: 'Very High'
  }
};

const architectureOptions: { optionA: ABTestOption; optionB: ABTestOption } = {
  optionA: {
    id: 'monolith',
    title: 'Monolithic Architecture',
    description: 'Build a single, unified application with all components tightly integrated.',
    pros: [
      'Simpler deployment',
      'Easier debugging',
      'Better performance for small apps',
      'Single codebase'
    ],
    cons: [
      'Harder to scale teams',
      'Technology lock-in',
      'Single point of failure'
    ],
    performance: 'Excellent for small scale',
    maintainability: 'Good initially'
  },
  optionB: {
    id: 'microservices',
    title: 'Microservices Architecture',
    description: 'Break the application into smaller, independent services that communicate via APIs.',
    pros: [
      'Technology flexibility',
      'Independent scaling',
      'Team autonomy',
      'Fault isolation'
    ],
    cons: [
      'Complex deployment',
      'Network overhead',
      'Distributed system challenges'
    ],
    performance: 'Variable',
    maintainability: 'Complex but scalable'
  }
};

// Interactive wrapper for stories
function InteractiveABTest(props: any) {
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
    <ABTestQuestion
      {...props}
      value={value}
      onChange={setValue}
      onSkip={props.allowSkip ? () => setSkipped(true) : undefined}
    />
  );
}

export const Default: Story = {
  render: (args) => <InteractiveABTest {...args} />,
  args: {
    question: 'Which state management approach would you choose for a React application?',
    description: 'Consider factors like complexity, performance, and maintainability when making your choice.',
    optionA: reactOptions.optionA,
    optionB: reactOptions.optionB,
    required: true,
  },
};

export const WithSkipOption: Story = {
  render: (args) => <InteractiveABTest {...args} />,
  args: {
    question: 'Which architecture pattern do you prefer for large-scale applications?',
    description: 'Think about your team size, deployment strategy, and long-term goals.',
    optionA: architectureOptions.optionA,
    optionB: architectureOptions.optionB,
    allowSkip: true,
    required: false,
  },
};

export const WithValidationError: Story = {
  render: (args) => <InteractiveABTest {...args} />,
  args: {
    question: 'Which testing strategy would you implement first?',
    optionA: {
      id: 'unit',
      title: 'Unit Testing',
      description: 'Focus on testing individual functions and components in isolation.',
      pros: ['Fast execution', 'Easy to debug', 'High code coverage'],
      cons: ['Limited integration coverage', 'Can miss system-level issues'],
      performance: 'Excellent',
      maintainability: 'High'
    },
    optionB: {
      id: 'e2e',
      title: 'End-to-End Testing',
      description: 'Test complete user workflows from start to finish.',
      pros: ['Real user scenarios', 'Catches integration issues', 'High confidence'],
      cons: ['Slower execution', 'More complex setup', 'Flaky tests'],
      performance: 'Good',
      maintainability: 'Medium'
    },
    required: true,
    error: 'Please select a testing strategy to continue.',
  },
};

export const DisabledState: Story = {
  render: (args) => <InteractiveABTest {...args} />,
  args: {
    question: 'Which database would you choose for this project?',
    description: 'This question is currently disabled for demonstration.',
    optionA: {
      id: 'postgres',
      title: 'PostgreSQL',
      description: 'Robust relational database with excellent performance and features.',
      pros: ['ACID compliance', 'Rich feature set', 'Strong community'],
      cons: ['Can be complex', 'Resource intensive'],
      performance: 'Excellent',
      maintainability: 'High'
    },
    optionB: {
      id: 'mongodb',
      title: 'MongoDB',
      description: 'Flexible document-based NoSQL database.',
      pros: ['Schema flexibility', 'Easy to scale', 'Developer friendly'],
      cons: ['Eventual consistency', 'Memory usage', 'Complex queries'],
      performance: 'Very Good',
      maintainability: 'Good'
    },
    disabled: true,
  },
};

export const SimpleComparison: Story = {
  render: (args) => <InteractiveABTest {...args} />,
  args: {
    question: 'Which approach do you prefer for handling errors?',
    optionA: {
      id: 'try-catch',
      title: 'Try-Catch Blocks',
      description: 'Use traditional try-catch statements for error handling.',
      codeExample: `try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error(error);
  throw error;
}`
    },
    optionB: {
      id: 'result-pattern',
      title: 'Result Pattern',
      description: 'Use a Result type to explicitly handle success and error cases.',
      codeExample: `const result = await apiCall();
if (result.success) {
  return result.data;
} else {
  console.error(result.error);
  return null;
}`
    },
    required: false,
  },
};

export const DetailedComparison: Story = {
  render: (args) => <InteractiveABTest {...args} />,
  args: {
    question: 'Which CSS solution would you recommend for a large React project?',
    description: 'Consider maintainability, performance, developer experience, and team scalability.',
    optionA: {
      id: 'tailwind',
      title: 'Tailwind CSS',
      description: 'Utility-first CSS framework that provides low-level utility classes.',
      codeExample: `<button className="bg-primary text-off-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors">
  Click me
</button>`,
      pros: [
        'Consistent design system',
        'Small production bundle',
        'Fast development',
        'Responsive design utilities',
        'Great tooling support'
      ],
      cons: [
        'Learning curve for utility classes',
        'Verbose HTML',
        'Requires build step',
        'Can be hard to maintain custom designs'
      ],
      performance: 'Excellent',
      maintainability: 'High'
    },
    optionB: {
      id: 'styled-components',
      title: 'Styled Components',
      description: 'CSS-in-JS library that allows you to write CSS directly in your JavaScript.',
      codeExample: `const Button = styled.button\`
  background: var(--primary);
  color: var(--off-white);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  
  &:hover {
    background: var(--primary-hover);
  }
\`;`,
      pros: [
        'Component-scoped styles',
        'Dynamic styling',
        'No naming conflicts',
        'Theme support',
        'TypeScript integration'
      ],
      cons: [
        'Runtime overhead',
        'Bundle size increase',
        'Debugging complexity',
        'Server-side rendering challenges'
      ],
      performance: 'Good',
      maintainability: 'Very High'
    },
    required: true,
  },
};

export const MobileView: Story = {
  render: (args) => <InteractiveABTest {...args} />,
  args: {
    question: 'Which mobile development approach would you choose?',
    optionA: {
      id: 'native',
      title: 'Native Development',
      description: 'Build separate apps for iOS and Android using platform-specific tools.',
      pros: ['Best performance', 'Full platform access', 'Native UX'],
      cons: ['Separate codebases', 'Higher development cost', 'Longer time to market'],
      performance: 'Excellent',
      maintainability: 'Complex'
    },
    optionB: {
      id: 'react-native',
      title: 'React Native',
      description: 'Build cross-platform mobile apps using React and JavaScript.',
      pros: ['Shared codebase', 'Faster development', 'Web developer friendly'],
      cons: ['Performance limitations', 'Platform-specific code needed', 'Third-party dependencies'],
      performance: 'Very Good',
      maintainability: 'Good'
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Real-world Examples
export const DatabaseChoice = {
  render: () => <InteractiveABTest {...databaseChoiceArgs} />,
  parameters: {
    docs: {
      description: {
        story: 'Real-world example of choosing between database solutions for a new project.',
      },
    },
  },
};

const databaseChoiceArgs = {
  question: 'Which database solution would you choose for a high-traffic e-commerce platform?',
  description: 'Consider scalability, consistency requirements, and development complexity.',
  optionA: {
    id: 'mysql-cluster',
    title: 'MySQL Cluster',
    description: 'Distributed MySQL setup with read replicas and load balancing.',
    codeExample: `// Master-slave replication
const writeDB = mysql.createConnection(masterConfig);
const readDB = mysql.createConnection(slaveConfig);

// Route writes to master, reads to slave
const createUser = (data) => writeDB.query(insertQuery, data);
const getUser = (id) => readDB.query(selectQuery, [id]);`,
    pros: [
      'ACID compliance',
      'Mature ecosystem',
      'Strong consistency',
      'Familiar SQL',
      'Great tooling'
    ],
    cons: [
      'Complex sharding',
      'Vertical scaling limits',
      'Master bottleneck',
      'Maintenance overhead'
    ],
    performance: 'Good',
    maintainability: 'Medium'
  },
  optionB: {
    id: 'dynamodb',
    title: 'Amazon DynamoDB',
    description: 'Managed NoSQL database with automatic scaling and high availability.',
    codeExample: `// DynamoDB with auto-scaling
const params = {
  TableName: 'Users',
  Item: {
    userId: { S: user.id },
    email: { S: user.email },
    createdAt: { N: Date.now().toString() }
  }
};

await dynamodb.putItem(params).promise();`,
    pros: [
      'Automatic scaling',
      'Managed service',
      'High availability',
      'Fast performance',
      'Pay-per-use'
    ],
    cons: [
      'Vendor lock-in',
      'Limited querying',
      'NoSQL learning curve',
      'Cost at scale'
    ],
    performance: 'Excellent',
    maintainability: 'High'
  },
  allowSkip: true,
  required: false,
};