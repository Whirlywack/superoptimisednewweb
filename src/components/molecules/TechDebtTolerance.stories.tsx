import type { Meta, StoryObj } from '@storybook/react';
import { TechDebtTolerance, type TechDebtScenario, type ToleranceLevel } from './TechDebtTolerance';

const meta: Meta<typeof TechDebtTolerance> = {
  title: 'Molecules/TechDebtTolerance',
  component: TechDebtTolerance,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A component for assessing technical debt tolerance with different scenarios and trade-off analysis. Commonly used in team assessment and project planning questionnaires.',
      },
    },
  },
  argTypes: {
    question: {
      control: 'text',
      description: 'The question text asking about technical debt tolerance',
    },
    value: {
      control: 'select',
      options: [undefined, 'low', 'medium', 'high'],
      description: 'Currently selected tolerance level',
    },
    variant: {
      control: 'select',
      options: ['scale', 'cards', 'scenarios'],
      description: 'Visual style for the tolerance assessment',
    },
    showTradeoffs: {
      control: 'boolean',
      description: 'Whether to show trade-off analysis in scenarios',
    },
    showTraits: {
      control: 'boolean',
      description: 'Whether to show personality traits for each tolerance level',
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
type Story = StoryObj<typeof TechDebtTolerance>;

const legacyCodeScenario: TechDebtScenario = {
  id: 'legacy-refactor',
  title: 'Legacy Code Refactoring',
  description: 'Your team needs to add a new feature to a 3-year-old codebase. The existing code works but lacks tests, uses outdated patterns, and would benefit from significant refactoring before adding new functionality.',
  impact: 'high',
  urgency: 'medium',
  effort: 'high',
  tradeoffs: {
    shortTerm: 'Feature can be delivered 2 weeks faster by working around existing code',
    longTerm: 'Technical debt will make future changes increasingly difficult and risky'
  }
};

const performanceScenario: TechDebtScenario = {
  id: 'performance-optimization',
  title: 'Performance Optimization',
  description: 'The application has known performance issues in data-heavy pages. Users are complaining, but the current implementation meets business requirements. Fixing it would require significant database and frontend changes.',
  impact: 'medium',
  urgency: 'high',
  effort: 'medium',
  tradeoffs: {
    shortTerm: 'Can focus on new features while performance issues affect some users',
    longTerm: 'User experience degradation may lead to customer churn and reputation damage'
  }
};

const securityScenario: TechDebtScenario = {
  id: 'security-update',
  title: 'Security Dependencies',
  description: 'Several npm packages have security vulnerabilities. The fixes are available but require code changes due to breaking changes in the updated packages. No active exploits are known.',
  impact: 'high',
  urgency: 'low',
  effort: 'low',
  tradeoffs: {
    shortTerm: 'Current implementation works fine with no immediate security threats',
    longTerm: 'Security vulnerabilities may be discovered and exploited in the future'
  }
};

const testingScenario: TechDebtScenario = {
  id: 'testing-coverage',
  title: 'Test Coverage',
  description: 'A critical business module has no automated tests. Manual testing catches most issues, but releases are stressful and bugs occasionally slip through. Adding comprehensive tests would take significant time.',
  impact: 'medium',
  urgency: 'low',
  effort: 'medium',
  tradeoffs: {
    shortTerm: 'Team can continue shipping features at current pace with manual testing',
    longTerm: 'Risk of production bugs and slower development as complexity increases'
  }
};

export const Default: Story = {
  args: {
    question: 'What is your general approach to technical debt?',
    description: 'Consider how you typically balance feature development speed against code quality and maintainability.',
    variant: 'cards',
    showTradeoffs: true,
    showTraits: false,
    required: false,
    allowSkip: false,
    disabled: false,
  },
};

export const WithSelection: Story = {
  args: {
    ...Default.args,
    value: 'medium',
    description: 'This example shows a pre-selected tolerance level.',
  },
};

export const ScaleVariant: Story = {
  args: {
    question: 'How do you balance speed vs. quality in development?',
    description: 'Use the slider to indicate your preference on the spectrum.',
    variant: 'scale',
    showTradeoffs: false,
    showTraits: false,
  },
};

export const WithTraits: Story = {
  args: {
    ...Default.args,
    question: 'Which development philosophy aligns with your thinking?',
    showTraits: true,
    description: 'Consider the personality traits that resonate with your approach to technical debt.',
  },
};

export const LegacyCodeScenario: Story = {
  args: {
    question: 'How would you handle this legacy code situation?',
    description: 'Consider the trade-offs between speed and long-term maintainability.',
    variant: 'scenarios',
    scenario: legacyCodeScenario,
    showTradeoffs: true,
    showTraits: false,
  },
};

export const PerformanceScenario: Story = {
  args: {
    question: 'What would be your approach to this performance issue?',
    description: 'Balance user experience concerns with development priorities.',
    variant: 'scenarios',
    scenario: performanceScenario,
    showTradeoffs: true,
    showTraits: true,
  },
};

export const SecurityScenario: Story = {
  args: {
    question: 'How would you prioritize this security update?',
    description: 'Consider the risk vs. effort trade-off for security improvements.',
    variant: 'scenarios',
    scenario: securityScenario,
    showTradeoffs: true,
    showTraits: false,
  },
};

export const TestingScenario: Story = {
  args: {
    question: 'What is your approach to this testing situation?',
    description: 'Evaluate the importance of test coverage vs. feature development speed.',
    variant: 'scenarios',
    scenario: testingScenario,
    showTradeoffs: true,
    showTraits: false,
  },
};

export const NoTradeoffs: Story = {
  args: {
    ...LegacyCodeScenario.args,
    showTradeoffs: false,
    description: 'Simplified scenario view without detailed trade-off analysis.',
  },
};

export const TeamAssessment: Story = {
  args: {
    question: 'How does your team typically handle technical debt?',
    description: 'Assess your team\'s collective approach to balancing speed and quality.',
    variant: 'cards',
    showTradeoffs: false,
    showTraits: true,
  },
};

export const ProjectPlanning: Story = {
  args: {
    question: 'For this project, what level of technical debt is acceptable?',
    description: 'Consider project timeline, team experience, and long-term maintenance needs.',
    variant: 'scale',
    value: 'medium',
    showTradeoffs: false,
    showTraits: false,
  },
};

export const Required: Story = {
  args: {
    ...Default.args,
    required: true,
    error: 'Please select your technical debt tolerance level.',
    description: 'This assessment is required for team matching and project assignment.',
  },
};

export const WithSkipOption: Story = {
  args: {
    ...Default.args,
    allowSkip: true,
    question: 'Optional: What is your personal technical debt philosophy?',
    description: 'This helps us understand different perspectives within the team.',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
    value: 'low',
    description: 'This assessment has been completed and cannot be modified.',
  },
};

export const ErrorState: Story = {
  args: {
    ...Default.args,
    error: 'Please select your approach to technical debt.',
    required: true,
  },
};

export const StartupContext: Story = {
  args: {
    question: 'In a startup environment, how much technical debt would you accept?',
    description: 'Consider the need for rapid iteration and market validation vs. long-term sustainability.',
    variant: 'cards',
    showTradeoffs: false,
    showTraits: true,
    value: 'high',
  },
};

export const EnterpriseContext: Story = {
  args: {
    question: 'In an enterprise setting, what is your technical debt tolerance?',
    description: 'Consider compliance requirements, long-term maintenance, and risk management.',
    variant: 'cards',
    showTradeoffs: false,
    showTraits: true,
    value: 'low',
  },
};

export const CrisisMode: Story = {
  args: {
    question: 'During a critical production issue, how much technical debt would you accept in the fix?',
    variant: 'scenarios',
    scenario: {
      id: 'production-crisis',
      title: 'Production Outage',
      description: 'A critical service is down affecting 50% of users. You can implement a quick workaround in 2 hours or a proper fix in 8 hours. The workaround would add significant technical debt.',
      impact: 'high',
      urgency: 'high',
      effort: 'low',
      tradeoffs: {
        shortTerm: 'Service restored quickly with minimal downtime',
        longTerm: 'Workaround creates instability and makes future maintenance harder'
      }
    },
    showTradeoffs: true,
    showTraits: false,
  },
};

export const CodeReview: Story = {
  args: {
    question: 'When reviewing code, how strict are you about technical debt?',
    description: 'Consider your approach to balancing perfect code vs. team velocity.',
    variant: 'scale',
    showTradeoffs: false,
    showTraits: false,
  },
};

export const MobileOptimized: Story = {
  args: {
    ...Default.args,
    question: 'Your technical debt tolerance?',
    description: 'Mobile-optimized interface for quick assessment.',
    variant: 'scale',
    showTraits: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};