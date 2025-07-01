import type { Meta, StoryObj } from '@storybook/react';
import { ThankYouScreen, type NextStep, type SocialShare } from './ThankYouScreen';
import { ExternalLink, FileText, Users, MessageCircle, Download, Zap, Star, TrendingUp } from 'lucide-react';

const meta: Meta<typeof ThankYouScreen> = {
  title: 'Organisms/ThankYouScreen',
  component: ThankYouScreen,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive completion screen for questionnaires with progress tracking, next steps, social sharing, and newsletter signup. Designed to maintain engagement and provide clear next actions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['celebration', 'professional', 'minimalist', 'community'],
    },
    completionProgress: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    questionsAnswered: {
      control: { type: 'number', min: 0, max: 100 },
    },
    totalQuestions: {
      control: { type: 'number', min: 0, max: 100 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThankYouScreen>;

const sampleNextSteps: NextStep[] = [
  {
    id: 'view-results',
    title: 'View Detailed Results',
    description: 'See a breakdown of your responses and how they compare to the community.',
    icon: <FileText />,
    action: {
      type: 'link',
      label: 'View Results',
      url: '/results',
      variant: 'primary',
    },
    priority: 1,
  },
  {
    id: 'join-community',
    title: 'Join Our Community',
    description: 'Connect with other developers and share experiences.',
    icon: <Users />,
    action: {
      type: 'link',
      label: 'Join Discord',
      url: 'https://discord.gg/developers',
      variant: 'outline',
    },
    priority: 2,
  },
  {
    id: 'share-feedback',
    title: 'Share Feedback',
    description: 'Help us improve this questionnaire with your suggestions.',
    icon: <MessageCircle />,
    action: {
      type: 'callback',
      label: 'Give Feedback',
      onClick: () => alert('Feedback form would open here'),
      variant: 'outline',
    },
    priority: 3,
  },
];

const sampleSocialSharing: SocialShare[] = [
  {
    platform: 'twitter',
    url: 'https://example.com/questionnaire',
    text: 'Just completed an insightful developer questionnaire!',
    hashtags: ['developer', 'survey', 'community'],
  },
  {
    platform: 'linkedin',
    url: 'https://example.com/questionnaire',
    text: 'Participated in a developer community survey',
  },
  {
    platform: 'email',
    url: 'https://example.com/questionnaire',
    text: 'Check out this interesting developer questionnaire',
  },
  {
    platform: 'copy-link',
    url: 'https://example.com/questionnaire',
  },
];

export const Default: Story = {
  args: {
    title: 'Thank you for your responses!',
    subtitle: 'Your insights are valuable to our community',
    description: 'Your feedback has been recorded and will help improve our understanding of the developer community.',
    variant: 'professional',
    showProgress: true,
    completionProgress: 100,
    timeTaken: '4m 32s',
    questionsAnswered: 15,
    totalQuestions: 15,
    nextSteps: sampleNextSteps,
    onRetake: () => alert('Retaking questionnaire...'),
    onViewResults: () => alert('Viewing results...'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default thank you screen with progress tracking and next steps.',
      },
    },
  },
};

export const Celebration: Story = {
  args: {
    ...Default.args,
    title: 'Congratulations!',
    subtitle: 'You\'ve completed the Developer Skills Assessment',
    variant: 'celebration',
    nextSteps: [
      {
        id: 'certificate',
        title: 'Download Certificate',
        description: 'Get a certificate of completion for your portfolio.',
        icon: <Download />,
        action: {
          type: 'download',
          label: 'Download PDF',
          url: '/certificate.pdf',
          variant: 'primary',
        },
        priority: 1,
      },
      {
        id: 'skill-badge',
        title: 'Claim Skill Badge',
        description: 'Add your validated skills to your LinkedIn profile.',
        icon: <Star />,
        action: {
          type: 'link',
          label: 'Claim Badge',
          url: 'https://linkedin.com/skills',
          variant: 'outline',
        },
        priority: 2,
      },
      {
        id: 'level-up',
        title: 'Level Up Your Skills',
        description: 'Get personalized learning recommendations based on your responses.',
        icon: <TrendingUp />,
        action: {
          type: 'link',
          label: 'See Recommendations',
          url: '/learning-path',
          variant: 'outline',
        },
        priority: 3,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Celebration variant with achievement-focused next steps and vibrant styling.',
      },
    },
  },
};

export const WithSocialSharing: Story = {
  args: {
    ...Default.args,
    title: 'Thanks for participating!',
    subtitle: 'Help others discover this questionnaire',
    showSharing: true,
    socialSharing: sampleSocialSharing,
  },
  parameters: {
    docs: {
      description: {
        story: 'Thank you screen with social sharing options to increase questionnaire reach.',
      },
    },
  },
};

export const WithNewsletterSignup: Story = {
  args: {
    ...Default.args,
    title: 'Thank you for your time!',
    subtitle: 'Stay connected with our community',
    newsletterSignup: {
      title: 'Get Weekly Developer Insights',
      description: 'Join 10,000+ developers receiving curated content and community highlights.',
      placeholder: 'your.email@example.com',
      onSubmit: (email: string) => {
        alert(`Newsletter signup: ${email}`);
        return Promise.resolve();
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Thank you screen with newsletter signup to build an email list.',
      },
    },
  },
};

export const CommunityFocused: Story = {
  args: {
    title: 'Welcome to the community!',
    subtitle: 'Your voice matters in shaping our shared future',
    description: 'Thank you for taking the time to share your thoughts. Your responses will be anonymized and used to create insights that benefit everyone.',
    variant: 'community',
    showProgress: true,
    completionProgress: 100,
    timeTaken: '6m 15s',
    questionsAnswered: 20,
    totalQuestions: 20,
    nextSteps: [
      {
        id: 'community-results',
        title: 'See Community Insights',
        description: 'Explore aggregated results from the developer community.',
        icon: <TrendingUp />,
        action: {
          type: 'link',
          label: 'View Insights',
          url: '/community-insights',
          variant: 'primary',
        },
        priority: 1,
      },
      {
        id: 'join-discussion',
        title: 'Join the Discussion',
        description: 'Share your thoughts and read what others are saying.',
        icon: <MessageCircle />,
        action: {
          type: 'link',
          label: 'Join Conversation',
          url: '/discussion',
          variant: 'outline',
        },
        priority: 2,
      },
      {
        id: 'spread-word',
        title: 'Spread the Word',
        description: 'Help us reach more developers by sharing this questionnaire.',
        icon: <Users />,
        action: {
          type: 'callback',
          label: 'Share with Friends',
          onClick: () => alert('Sharing options would appear here'),
          variant: 'outline',
        },
        priority: 3,
      },
    ],
    showSharing: true,
    socialSharing: sampleSocialSharing,
    newsletterSignup: {
      title: 'Community Updates',
      description: 'Get notified when we publish community insights and new questionnaires.',
      onSubmit: async (email: string) => {
        alert(`Community newsletter signup: ${email}`);
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Community-focused variant emphasizing collective contribution and shared insights.',
      },
    },
  },
};

export const Minimalist: Story = {
  args: {
    title: 'Complete',
    description: 'Your responses have been saved.',
    variant: 'minimalist',
    showProgress: false,
    nextSteps: [
      {
        id: 'results',
        title: 'Results',
        description: 'View your results',
        action: {
          type: 'link',
          label: 'View',
          url: '/results',
          variant: 'outline',
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimalist variant with reduced visual elements and simple messaging.',
      },
    },
  },
};

export const MobileOptimized: Story = {
  args: {
    ...Default.args,
    title: 'Thank you!',
    subtitle: 'You\'re all set',
    nextSteps: [
      {
        id: 'view-results',
        title: 'View Results',
        description: 'See your personalized report',
        icon: <FileText />,
        action: {
          type: 'link',
          label: 'View Results',
          url: '/results',
          variant: 'primary',
        },
      },
      {
        id: 'join-community',
        title: 'Join Community',
        description: 'Connect with other developers',
        icon: <Users />,
        action: {
          type: 'link',
          label: 'Join Now',
          url: '/community',
          variant: 'outline',
        },
      },
    ],
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile-optimized layout with simplified content and touch-friendly interactions.',
      },
    },
  },
};

export const WithCompletedSteps: Story = {
  args: {
    ...Default.args,
    title: 'Great progress!',
    subtitle: 'You\'ve completed several milestones',
    nextSteps: [
      {
        id: 'view-results',
        title: 'View Results',
        description: 'Your personalized report is ready.',
        icon: <FileText />,
        completed: true,
        priority: 1,
      },
      {
        id: 'join-community',
        title: 'Join Community',
        description: 'Connect with other developers in our Discord.',
        icon: <Users />,
        action: {
          type: 'link',
          label: 'Join Discord',
          url: '/discord',
          variant: 'primary',
        },
        priority: 2,
      },
      {
        id: 'newsletter',
        title: 'Subscribe to Updates',
        description: 'Get notified about new questionnaires and insights.',
        icon: <Zap />,
        completed: true,
        priority: 3,
      },
      {
        id: 'share',
        title: 'Share with Friends',
        description: 'Help others discover this questionnaire.',
        icon: <ExternalLink />,
        action: {
          type: 'callback',
          label: 'Share Now',
          onClick: () => alert('Sharing...'),
          variant: 'outline',
        },
        priority: 4,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Thank you screen showing a mix of completed and pending next steps.',
      },
    },
  },
};

export const CustomFooter: Story = {
  args: {
    ...Default.args,
    footerContent: (
      <div className="space-y-2">
        <p>
          This questionnaire is part of our ongoing research into developer productivity and satisfaction.
        </p>
        <p>
          Questions? Contact us at{' '}
          <a href="mailto:research@example.com" className="text-primary hover:underline">
            research@example.com
          </a>
        </p>
        <p className="text-xs">
          Your responses are anonymous and will be used solely for research purposes.
        </p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Thank you screen with custom footer content for additional information and contact details.',
      },
    },
  },
};