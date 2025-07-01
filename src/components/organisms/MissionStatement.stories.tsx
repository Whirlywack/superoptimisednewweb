import type { Meta, StoryObj } from "@storybook/react";
import { MissionStatement } from "./MissionStatement";
import { fn } from "@storybook/test";
import { 
  Heart, 
  Target, 
  Users, 
  Lightbulb, 
  Globe,
  BookOpen,
  Code,
  MessageCircle,
  Zap,
  Shield
} from "lucide-react";

const meta = {
  title: "Organisms/MissionStatement",
  component: MissionStatement,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Mission statement component that displays organizational philosophy, values, principles, and goals. Perfect for about pages and company overview sections.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    mission: {
      control: "text",
      description: "Core mission statement",
    },
    vision: {
      control: "text",
      description: "Optional vision statement",
    },
    values: {
      control: "object",
      description: "Array of organizational values",
    },
    principles: {
      control: "object",
      description: "Array of guiding principles",
    },
    goals: {
      control: "object",
      description: "Array of key goals",
    },
    tags: {
      control: "object",
      description: "Related tags",
    },
    ctaText: {
      control: "text",
      description: "Call-to-action button text",
    },
    ctaHref: {
      control: "text",
      description: "CTA link URL",
    },
    onCtaClick: {
      action: "cta-clicked",
      description: "CTA click handler",
    },
    variant: {
      control: "select",
      options: ["default", "hero", "minimal", "detailed"],
      description: "Display variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Component size",
    },
    showValues: {
      control: "boolean",
      description: "Show values section",
    },
    showPrinciples: {
      control: "boolean",
      description: "Show principles section",
    },
    showGoals: {
      control: "boolean",
      description: "Show goals section",
    },
  },
  args: {
    onCtaClick: fn(),
  },
} satisfies Meta<typeof MissionStatement>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultValues = [
  {
    icon: Heart,
    title: "Transparency",
    description: "Building in public, sharing both successes and failures to create authentic learning experiences for the developer community.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Fostering genuine connections and collaboration within the developer ecosystem through shared knowledge and mutual support.",
  },
  {
    icon: Lightbulb,
    title: "Learning",
    description: "Continuous improvement and knowledge sharing, recognizing that the best way to learn is by teaching and building together.",
  },
];

const defaultPrinciples = [
  {
    title: "Authentic Over Perfect",
    description: "We choose honest documentation of the development process over polished marketing. Real struggles create real learning opportunities.",
    example: "Documenting failed experiments and explaining why certain approaches didn't work",
  },
  {
    title: "Community First",
    description: "Every decision is evaluated through the lens of community benefit. We prioritize long-term value over short-term gains.",
    example: "Open sourcing tools and sharing detailed technical decisions",
  },
  {
    title: "Quality Through Iteration",
    description: "We believe in shipping early and improving based on real feedback rather than seeking perfection in isolation.",
    example: "Releasing alpha versions with clear documentation of known limitations",
  },
];

const defaultGoals = [
  "Create a transparent development process that educates and inspires other developers",
  "Build tools and systems that genuinely improve developer productivity and satisfaction",
  "Foster a community where knowledge sharing and mutual support are the norm",
  "Demonstrate that building in public leads to better products and stronger communities",
  "Maintain high standards for code quality while embracing the messiness of real development",
];

export const Default: Story = {
  args: {
    mission: "To build exceptional developer tools in public, sharing every step of the journey to create authentic learning experiences and foster genuine community connections.",
    vision: "A world where developers build together, learn from each other, and create tools that truly matter.",
    values: defaultValues,
    principles: defaultPrinciples,
    goals: defaultGoals,
    tags: ["Building in Public", "Developer Tools", "Community", "Transparency"],
    ctaText: "Join Our Journey",
    ctaHref: "/journey",
  },
};

export const Hero: Story = {
  args: {
    mission: "Empowering developers through transparent building, authentic community, and shared learning experiences.",
    vision: "Creating the future of collaborative software development, one honest conversation at a time.",
    values: [
      {
        icon: Globe,
        title: "Open Development",
        description: "Every line of code, every decision, every failure is shared openly with the community.",
      },
      {
        icon: BookOpen,
        title: "Continuous Learning",
        description: "We learn in public, teach what we discover, and grow together as a community.",
      },
      {
        icon: MessageCircle,
        title: "Authentic Dialogue",
        description: "Real conversations about real challenges, without the marketing polish.",
      },
      {
        icon: Code,
        title: "Quality Code",
        description: "High standards for technical excellence while embracing the iterative nature of development.",
      },
    ],
    variant: "hero",
    size: "lg",
    tags: ["Open Source", "Community", "Education", "Innovation"],
    ctaText: "Start Building With Us",
    ctaHref: "/get-started",
  },
};

export const Minimal: Story = {
  args: {
    mission: "Building developer tools in public to create authentic learning experiences and foster community connections.",
    variant: "minimal",
    ctaText: "Learn More",
    ctaHref: "/about",
  },
};

export const Detailed: Story = {
  args: {
    mission: "To revolutionize how developers build, learn, and connect by creating transparent development processes and authentic community experiences.",
    vision: "A thriving ecosystem where every developer has access to honest, educational content and supportive community relationships.",
    values: [
      {
        icon: Shield,
        title: "Integrity",
        description: "We commit to honest communication about our development process, including our mistakes and learning moments.",
      },
      {
        icon: Zap,
        title: "Innovation",
        description: "We explore new approaches to developer tooling while maintaining focus on practical, real-world applications.",
      },
      {
        icon: Target,
        title: "Impact",
        description: "Every project aims to create meaningful value for the developer community and broader tech ecosystem.",
      },
    ],
    principles: [
      {
        title: "Documentation as Development",
        description: "We treat documentation as a first-class citizen in our development process, not an afterthought.",
        example: "Writing comprehensive README files before starting implementation",
      },
      {
        title: "Feedback-Driven Evolution",
        description: "We actively seek and incorporate community feedback to guide our development decisions.",
        example: "Regular community surveys and open discussion about feature priorities",
      },
    ],
    goals: [
      "Establish new standards for transparent development practices in the tech industry",
      "Create educational content that genuinely helps developers improve their skills",
      "Build sustainable open source projects with active community involvement",
    ],
    variant: "detailed",
    tags: ["Innovation", "Education", "Open Source"],
    ctaText: "Explore Our Projects",
    ctaHref: "/projects",
  },
};

export const NoValues: Story = {
  args: {
    mission: "Focused on creating exceptional developer experiences through thoughtful design and community collaboration.",
    principles: defaultPrinciples.slice(0, 2),
    goals: defaultGoals.slice(0, 3),
    showValues: false,
    tags: ["Developer Experience", "Design"],
  },
};

export const NoPrinciples: Story = {
  args: {
    mission: "Building the next generation of developer tools with community input and transparent development practices.",
    values: defaultValues,
    goals: defaultGoals.slice(0, 4),
    showPrinciples: false,
    tags: ["Tools", "Community"],
  },
};

export const NoGoals: Story = {
  args: {
    mission: "Committed to advancing the state of developer tooling through open source contributions and community engagement.",
    values: defaultValues.slice(0, 2),
    principles: defaultPrinciples,
    showGoals: false,
    tags: ["Open Source", "Developer Tools"],
  },
};

export const JustMission: Story = {
  args: {
    mission: "Creating software that developers actually want to use, built with the input and feedback of the people who will use it.",
    showValues: false,
    showPrinciples: false,
    showGoals: false,
    variant: "default",
  },
};

export const WithoutCTA: Story = {
  args: {
    mission: "Dedicated to improving developer productivity and satisfaction through thoughtful tool design and community-driven development.",
    values: defaultValues.slice(0, 2),
    goals: defaultGoals.slice(0, 3),
    tags: ["Productivity", "Community"],
  },
};

export const SmallSize: Story = {
  args: {
    mission: "Building better tools for developers, one line of code at a time.",
    values: defaultValues.slice(0, 2),
    size: "sm",
    variant: "default",
    ctaText: "Get Started",
    ctaHref: "/start",
  },
};

export const LargeSize: Story = {
  args: {
    mission: "Transforming the developer experience through innovative tools, transparent processes, and authentic community building.",
    vision: "A future where every developer has access to the tools, knowledge, and community support they need to build amazing things.",
    values: defaultValues,
    principles: defaultPrinciples.slice(0, 2),
    goals: defaultGoals.slice(0, 4),
    size: "lg",
    variant: "default",
    tags: ["Innovation", "Community", "Tools", "Education"],
    ctaText: "Join the Movement",
    ctaHref: "/community",
  },
};

export const CompanyValues: Story = {
  args: {
    mission: "To democratize access to high-quality developer tools and educational resources, making software development more accessible and enjoyable for everyone.",
    values: [
      {
        icon: Users,
        title: "Inclusivity",
        description: "We believe great software comes from diverse perspectives and inclusive development practices.",
      },
      {
        icon: BookOpen,
        title: "Education",
        description: "Every interaction should be a learning opportunity, both for us and our community.",
      },
      {
        icon: Heart,
        title: "Empathy",
        description: "We design with deep understanding of developer frustrations and needs.",
      },
      {
        icon: Zap,
        title: "Efficiency",
        description: "We respect developers' time by creating tools that genuinely improve productivity.",
      },
      {
        icon: Shield,
        title: "Reliability",
        description: "Developers depend on our tools, so we build with security and stability as top priorities.",
      },
      {
        icon: Globe,
        title: "Accessibility",
        description: "Our tools and content should be usable by developers regardless of their background or abilities.",
      },
    ],
    variant: "detailed",
    size: "lg",
    tags: ["Inclusivity", "Education", "Accessibility", "Reliability"],
    ctaText: "Read Our Values",
    ctaHref: "/values",
  },
  parameters: {
    docs: {
      description: {
        story: "Example showing a comprehensive company values section with 6 values in a grid layout.",
      },
    },
  },
};

export const StartupMission: Story = {
  args: {
    mission: "Disrupting the traditional software development lifecycle by making building in public the new standard for developer tools and education.",
    principles: [
      {
        title: "Move Fast, Document Everything",
        description: "We ship quickly but never sacrifice documentation or community communication.",
        example: "Daily development logs and weekly community updates",
      },
      {
        title: "Fail Forward",
        description: "Every failure is a learning opportunity that we share with the community.",
        example: "Publishing post-mortems of failed features and pivots",
      },
      {
        title: "Community-Driven Roadmap",
        description: "Our users and community members directly influence what we build next.",
        example: "Monthly roadmap voting and quarterly priority reviews",
      },
    ],
    goals: [
      "Achieve 100% transparency in our development process within 6 months",
      "Build a community of 10,000 developers actively engaged in our building process",
      "Launch 3 open source tools that significantly improve developer productivity",
      "Establish a sustainable model for community-funded development",
    ],
    variant: "hero",
    tags: ["Startup", "Innovation", "Community", "Transparency"],
    ctaText: "Join Early Access",
    onCtaClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: "Mission statement variant focused on startup goals and community building.",
      },
    },
  },
};

export const EducationalFocus: Story = {
  args: {
    mission: "Making advanced software development concepts accessible to developers at every skill level through hands-on learning and real-world examples.",
    values: [
      {
        icon: BookOpen,
        title: "Learning First",
        description: "Every piece of content is designed with pedagogical best practices and learning outcomes in mind.",
      },
      {
        icon: Code,
        title: "Practical Application",
        description: "Theory is always paired with real, working code examples that learners can explore and modify.",
      },
      {
        icon: MessageCircle,
        title: "Interactive Community",
        description: "Learning happens best in community, with peer support and expert guidance readily available.",
      },
    ],
    principles: [
      {
        title: "Scaffolded Learning",
        description: "Complex topics are broken down into manageable steps with clear prerequisites and learning paths.",
        example: "Multi-part series starting with basics and building to advanced implementations",
      },
    ],
    goals: [
      "Create comprehensive learning paths for 10 essential development topics",
      "Support 1,000 developers in their learning journey with personalized feedback",
      "Maintain a 90% completion rate for our structured learning programs",
    ],
    variant: "detailed",
    tags: ["Education", "Learning", "Community", "Skill Development"],
    ctaText: "Start Learning",
    ctaHref: "/learn",
  },
  parameters: {
    docs: {
      description: {
        story: "Mission statement variant emphasizing educational goals and learning-focused values.",
      },
    },
  },
};