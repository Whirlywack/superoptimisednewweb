import type { Meta, StoryObj } from '@storybook/react';
import { ArchitectureChoice, type ArchitectureDiagram } from './ArchitectureChoice';

const meta: Meta<typeof ArchitectureChoice> = {
  title: 'Molecules/ArchitectureChoice',
  component: ArchitectureChoice,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component for selecting between different architectural patterns with visual diagrams, commonly used in technical questionnaires to evaluate system design preferences.',
      },
    },
  },
  argTypes: {
    question: {
      control: 'text',
      description: 'The question text asking users to choose architecture',
    },
    architectures: {
      control: 'object',
      description: 'Array of architecture options with diagrams',
    },
    value: {
      control: 'text',
      description: 'Currently selected architecture ID',
    },
    layout: {
      control: 'select',
      options: ['grid', 'list'],
      description: 'Layout arrangement for architecture options',
    },
    columns: {
      control: 'select',
      options: [2, 3, 4],
      description: 'Number of columns for grid layout',
    },
    showMetadata: {
      control: 'boolean',
      description: 'Whether to show complexity and scalability metadata',
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
type Story = StoryObj<typeof ArchitectureChoice>;

const webAppArchitectures: ArchitectureDiagram[] = [
  {
    id: 'monolith',
    title: 'Monolithic Architecture',
    description: 'Single deployable unit with all components bundled together',
    components: ['Frontend', 'Backend API', 'Database', 'Auth Service'],
    pros: [
      'Simple to develop and test',
      'Easy deployment and monitoring',
      'Strong consistency',
      'Lower operational complexity'
    ],
    cons: [
      'Scaling challenges',
      'Technology lock-in',
      'Large codebase complexity',
      'Team coordination issues'
    ],
    complexity: 'simple',
    scalability: 'low',
    cost: 'low'
  },
  {
    id: 'microservices',
    title: 'Microservices Architecture',
    description: 'Distributed system with loosely coupled, independently deployable services',
    components: ['API Gateway', 'User Service', 'Order Service', 'Payment Service', 'Database per Service'],
    pros: [
      'Independent scaling',
      'Technology diversity',
      'Team autonomy',
      'Fault isolation'
    ],
    cons: [
      'Distributed system complexity',
      'Network latency',
      'Data consistency challenges',
      'Higher operational overhead'
    ],
    complexity: 'complex',
    scalability: 'high',
    cost: 'high'
  }
];

const cloudArchitectures: ArchitectureDiagram[] = [
  {
    id: 'serverless',
    title: 'Serverless Architecture',
    description: 'Event-driven architecture using cloud functions and managed services',
    components: ['API Gateway', 'Lambda Functions', 'DynamoDB', 'S3', 'CloudFront'],
    pros: [
      'No server management',
      'Automatic scaling',
      'Pay-per-use pricing',
      'High availability'
    ],
    cons: [
      'Vendor lock-in',
      'Cold start latency',
      'Limited execution time',
      'Debugging complexity'
    ],
    complexity: 'moderate',
    scalability: 'high',
    cost: 'medium'
  },
  {
    id: 'containerized',
    title: 'Containerized Architecture',
    description: 'Container-based deployment with orchestration platform',
    components: ['Load Balancer', 'Kubernetes Cluster', 'Container Registry', 'Monitoring', 'CI/CD'],
    pros: [
      'Environment consistency',
      'Resource efficiency',
      'Easy scaling',
      'Portable deployments'
    ],
    cons: [
      'Orchestration complexity',
      'Learning curve',
      'Storage challenges',
      'Security considerations'
    ],
    complexity: 'moderate',
    scalability: 'high',
    cost: 'medium'
  },
  {
    id: 'jamstack',
    title: 'JAMstack Architecture',
    description: 'JavaScript, APIs, and Markup with static site generation',
    components: ['Static Site Generator', 'CDN', 'Headless CMS', 'Third-party APIs', 'Build Pipeline'],
    pros: [
      'Fast performance',
      'High security',
      'Excellent scalability',
      'Developer experience'
    ],
    cons: [
      'Limited real-time features',
      'Build time complexity',
      'API dependency',
      'Dynamic content challenges'
    ],
    complexity: 'simple',
    scalability: 'high',
    cost: 'low'
  }
];

const dataArchitectures: ArchitectureDiagram[] = [
  {
    id: 'lambda',
    title: 'Lambda Architecture',
    description: 'Hybrid approach combining batch and real-time processing',
    components: ['Data Sources', 'Batch Layer', 'Speed Layer', 'Serving Layer', 'Query Interface'],
    pros: [
      'Handles all data types',
      'Fault tolerant',
      'Low latency queries',
      'Comprehensive analytics'
    ],
    cons: [
      'High complexity',
      'Maintenance overhead',
      'Duplicate logic',
      'Resource intensive'
    ],
    complexity: 'complex',
    scalability: 'high',
    cost: 'high'
  },
  {
    id: 'kappa',
    title: 'Kappa Architecture',
    description: 'Stream-processing architecture for real-time data processing',
    components: ['Event Streams', 'Stream Processor', 'Serving Database', 'Real-time Views'],
    pros: [
      'Simplified architecture',
      'Real-time processing',
      'Single codebase',
      'Lower complexity'
    ],
    cons: [
      'Limited batch processing',
      'Stream processing challenges',
      'Data reprocessing complexity',
      'Tool limitations'
    ],
    complexity: 'moderate',
    scalability: 'medium',
    cost: 'medium'
  }
];

export const Default: Story = {
  args: {
    question: 'Which architectural pattern would you choose for a new web application?',
    description: 'Consider factors like team size, expected scale, and operational complexity when making your choice.',
    architectures: webAppArchitectures,
    layout: 'grid',
    columns: 2,
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
    value: 'microservices',
    description: 'This example shows a pre-selected architecture choice.',
  },
};

export const CloudArchitectures: Story = {
  args: {
    question: 'What cloud architecture would you recommend for a startup?',
    description: 'Evaluate these cloud-native approaches considering cost, scalability, and team expertise.',
    architectures: cloudArchitectures,
    layout: 'grid',
    columns: 3,
    showMetadata: true,
    showProsAndCons: true,
  },
};

export const DataArchitectures: Story = {
  args: {
    question: 'Which data architecture fits your big data processing needs?',
    description: 'Choose the data processing architecture that best matches your requirements.',
    architectures: dataArchitectures,
    layout: 'grid',
    columns: 2,
    showMetadata: true,
    showProsAndCons: true,
  },
};

export const ListLayout: Story = {
  args: {
    ...Default.args,
    layout: 'list',
    description: 'List layout provides more detailed comparison view.',
  },
};

export const WithoutMetadata: Story = {
  args: {
    ...Default.args,
    showMetadata: false,
    description: 'Simplified view without complexity and scalability indicators.',
  },
};

export const WithoutProsAndCons: Story = {
  args: {
    ...Default.args,
    showProsAndCons: false,
    description: 'Focus on architecture components without detailed analysis.',
  },
};

export const MinimalView: Story = {
  args: {
    ...Default.args,
    showMetadata: false,
    showProsAndCons: false,
    description: 'Clean, minimal view showing only architecture titles and components.',
    architectures: webAppArchitectures.map(arch => ({
      ...arch,
      description: undefined,
    })),
  },
};

export const Required: Story = {
  args: {
    ...Default.args,
    required: true,
    error: 'Please select an architectural pattern to continue.',
  },
};

export const WithSkipOption: Story = {
  args: {
    ...Default.args,
    allowSkip: true,
    description: 'This question includes a skip option for optional architectural choices.',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    value: 'monolith',
    description: 'Disabled state showing a previously selected architecture.',
  },
};

export const ErrorState: Story = {
  args: {
    ...Default.args,
    error: 'Please select one of the architectural patterns above.',
    required: true,
  },
};

export const SingleOption: Story = {
  args: {
    question: 'Do you approve of this proposed architecture?',
    description: 'Review this architectural approach and indicate your approval.',
    architectures: [webAppArchitectures[0]],
    layout: 'grid',
    columns: 1,
    showMetadata: true,
    showProsAndCons: true,
  },
};

export const FourColumnGrid: Story = {
  args: {
    question: 'Select the most suitable architecture for your project',
    description: 'Compare all available options in a wide grid layout.',
    architectures: [
      ...webAppArchitectures,
      cloudArchitectures[0],
      cloudArchitectures[2],
    ],
    layout: 'grid',
    columns: 4,
    showMetadata: true,
    showProsAndCons: false,
  },
};

export const MobileOptimized: Story = {
  args: {
    ...Default.args,
    layout: 'list',
    showMetadata: true,
    showProsAndCons: false,
    description: 'Mobile-optimized view with list layout and simplified content.',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};