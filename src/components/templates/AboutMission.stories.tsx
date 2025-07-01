import type { Meta, StoryObj } from "@storybook/react";
import { AboutMission } from "./AboutMission";
import { fn } from "@storybook/test";
import { 
  Heart, 
  Users, 
  Lightbulb, 
  Target,
  Shield,
  Zap,
  Globe,
  Code,
  BookOpen,
  Star
} from "lucide-react";

const meta = {
  title: "Templates/AboutMission",
  component: AboutMission,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "About and mission template for showcasing company story, values, team, milestones, and contact information. Perfect for building trust and transparency with users.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Main page title",
    },
    subtitle: {
      control: "text", 
      description: "Page subtitle/tagline",
    },
    story: {
      control: "text",
      description: "Company/project story text",
    },
    mission: {
      control: "text",
      description: "Mission statement",
    },
    vision: {
      control: "text",
      description: "Vision statement",
    },
    values: {
      control: "object",
      description: "Array of company values",
    },
    team: {
      control: "object",
      description: "Array of team members",
    },
    milestones: {
      control: "object",
      description: "Array of company milestones",
    },
    contactMethods: {
      control: "object",
      description: "Array of contact methods",
    },
    showTeam: {
      control: "boolean",
      description: "Show team section",
    },
    showMilestones: {
      control: "boolean",
      description: "Show milestones section",
    },
    showContact: {
      control: "boolean",
      description: "Show contact section",
    },
    showValues: {
      control: "boolean",
      description: "Show values section",
    },
    onContactClick: {
      action: "contact-method-clicked",
      description: "Contact method click handler",
    },
    onTeamMemberClick: {
      action: "team-member-clicked",
      description: "Team member click handler",
    },
  },
  args: {
    onContactClick: fn(),
    onTeamMemberClick: fn(),
  },
} satisfies Meta<typeof AboutMission>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleValues = [
  {
    id: "transparency",
    title: "Radical Transparency",
    description: "We share our successes, failures, metrics, and decision-making process openly with the community. Every update, challenge, and breakthrough is documented publicly.",
    icon: BookOpen,
  },
  {
    id: "community",
    title: "Community First",
    description: "Every feature, design decision, and strategic choice is influenced by genuine community feedback. Our users help shape the product through continuous dialogue.",
    icon: Users,
  },
  {
    id: "learning",
    title: "Continuous Learning",
    description: "We approach every challenge as a learning opportunity and share our insights with others. Growth happens when knowledge is shared freely.",
    icon: Lightbulb,
  },
  {
    id: "quality",
    title: "Sustainable Quality",
    description: "Building tools that stand the test of time through thoughtful architecture, user-centered design, and rigorous testing processes.",
    icon: Target,
  },
  {
    id: "security",
    title: "Security & Privacy",
    description: "Protecting user data and maintaining privacy standards while building trust through transparent security practices and regular audits.",
    icon: Shield,
  },
  {
    id: "innovation",
    title: "Purposeful Innovation", 
    description: "Innovation guided by real user needs rather than technology trends. We build solutions that solve genuine problems.",
    icon: Zap,
  },
];

const sampleTeam = [
  {
    id: "founder",
    name: "Alex Chen",
    role: "Founder & Lead Developer",
    bio: "Full-stack developer with 8 years of experience building scalable web applications. Passionate about developer tooling and building in public.",
    avatar: "https://via.placeholder.com/80x80",
    social: {
      github: "https://github.com/alexchen",
      twitter: "https://twitter.com/alexchen",
      linkedin: "https://linkedin.com/in/alexchen",
      website: "https://alexchen.dev",
    },
  },
  {
    id: "design-lead",
    name: "Sarah Rodriguez",
    role: "Design Lead",
    bio: "Product designer focused on creating intuitive experiences for developer tools. Previously at GitHub and Figma, now building design systems in public.",
    avatar: "https://via.placeholder.com/80x80",
    social: {
      twitter: "https://twitter.com/sarahrodriguez",
      linkedin: "https://linkedin.com/in/sarahrodriguez",
    },
  },
  {
    id: "community-manager",
    name: "Marcus Thompson",
    role: "Community Manager",
    bio: "Developer advocate who helps bridge the gap between our team and community. Organizes feedback sessions and ensures every voice is heard.",
    social: {
      github: "https://github.com/marcusthompson",
      twitter: "https://twitter.com/marcusthompson",
    },
  },
  {
    id: "backend-engineer",
    name: "Emily Park",
    role: "Backend Engineer",
    bio: "Infrastructure engineer specializing in scalable API design and database optimization. Loves sharing performance insights and architecture decisions.",
    avatar: "https://via.placeholder.com/80x80",
    social: {
      github: "https://github.com/emilypark",
      linkedin: "https://linkedin.com/in/emilypark",
    },
  },
];

const sampleMilestones = [
  {
    id: "idea",
    title: "The Idea",
    description: "Started with a simple idea: what if we built developer tools completely transparently, sharing every decision and challenge with the community?",
    date: "2023-01-01",
  },
  {
    id: "first-user",
    title: "First User",
    description: "Celebrated our first external user signup and began incorporating feedback into our development process immediately.",
    date: "2023-02-15",
    metric: "1 user",
  },
  {
    id: "public-launch",
    title: "Public Launch",
    description: "Officially launched our platform publicly with core features and comprehensive documentation. The community response was overwhelming.",
    date: "2023-04-01",
    metric: "100 users",
  },
  {
    id: "community-milestone",
    title: "Community Growth",
    description: "Reached our first major community milestone with active contributors providing feature requests and bug reports daily.",
    date: "2023-07-01",
    metric: "1,000 users",
  },
  {
    id: "feature-expansion",
    title: "Feature Expansion",
    description: "Released advanced features based directly on community feedback, including real-time collaboration and enhanced API capabilities.",
    date: "2023-10-01",
    metric: "5,000 users",
  },
  {
    id: "platform-maturity",
    title: "Platform Maturity",
    description: "Achieved platform stability with 99.9% uptime and comprehensive developer tools that serve our growing community.",
    date: "2024-01-01",
    metric: "10,000 users",
  },
];

const sampleContactMethods = [
  {
    type: "email",
    label: "Email Us",
    value: "hello@superoptimised.com",
    href: "mailto:hello@superoptimised.com",
    icon: require("lucide-react").Mail,
  },
  {
    type: "github",
    label: "GitHub Discussions",
    value: "Join the conversation",
    href: "https://github.com/superoptimised/discussions",
    icon: require("lucide-react").Github,
  },
  {
    type: "twitter",
    label: "Twitter",
    value: "@superoptimised",
    href: "https://twitter.com/superoptimised",
    icon: require("lucide-react").Twitter,
  },
];

export const Default: Story = {
  args: {},
};

export const WithCustomContent: Story = {
  args: {
    title: "About Superoptimised",
    subtitle: "Building the future of developer tools through radical transparency and community collaboration",
    story: "What started as a side project to solve our own developer productivity challenges has grown into a platform used by thousands of developers worldwide. Every line of code, every design decision, and every strategic choice is made transparently with our community.",
    mission: "To democratize access to high-quality development tools and knowledge by building everything in public, sharing the complete journey, and empowering developers to build amazing things.",
    vision: "A world where every developer has access to the tools, knowledge, and community they need to succeed, regardless of their background or resources.",
    values: sampleValues,
    team: sampleTeam,
    milestones: sampleMilestones,
    contactMethods: sampleContactMethods,
  },
};

export const MinimalAbout: Story = {
  args: {
    title: "About Us",
    subtitle: "A small team building developer tools in public",
    story: "We're a small but passionate team dedicated to creating better developer experiences through transparent development and community-driven product decisions.",
    showValues: false,
    showMilestones: false,
    team: sampleTeam.slice(0, 2),
  },
};

export const ValuesOnly: Story = {
  args: {
    title: "Our Values",
    subtitle: "The principles that guide everything we build",
    values: sampleValues,
    showTeam: false,
    showMilestones: false,
    showContact: false,
  },
};

export const TeamFocus: Story = {
  args: {
    title: "Meet Our Team",
    subtitle: "The people building Superoptimised and sharing the journey with you",
    team: sampleTeam,
    showValues: false,
    showMilestones: false,
    showContact: false,
  },
};

export const JourneyTimeline: Story = {
  args: {
    title: "Our Journey",
    subtitle: "From idea to platform - building in public since day one",
    milestones: sampleMilestones,
    showValues: false,
    showTeam: false,
    showContact: false,
  },
};

export const ContactPage: Story = {
  args: {
    title: "Get in Touch",
    subtitle: "We'd love to hear from you",
    story: "Whether you have questions about our platform, want to provide feedback, or are interested in collaborating, we're always open to connecting with fellow developers and builders.",
    contactMethods: sampleContactMethods,
    showValues: false,
    showTeam: false,
    showMilestones: false,
  },
};

export const StartupStory: Story = {
  args: {
    title: "Our Startup Story",
    subtitle: "Building the next generation of developer tools",
    story: "Founded in 2023 by a team of experienced developers who were frustrated with the lack of transparency in the tools they used daily. We decided to build something different - a platform where every decision is made in public.",
    mission: "To revolutionize how developer tools are built by making the entire process transparent, community-driven, and educational.",
    vision: "A future where all developer tools are built with radical transparency, creating better products and stronger communities.",
    values: sampleValues.slice(0, 4),
    team: sampleTeam.slice(0, 3),
    milestones: sampleMilestones.slice(0, 4),
  },
};

export const LargeTeam: Story = {
  args: {
    title: "Our Growing Team",
    subtitle: "Talented individuals united by a shared mission",
    team: [
      ...sampleTeam,
      {
        id: "frontend-dev",
        name: "Lisa Wang",
        role: "Frontend Developer",
        bio: "React specialist focused on creating delightful user experiences. Passionate about accessibility and performance optimization.",
        social: {
          github: "https://github.com/lisawang",
          twitter: "https://twitter.com/lisawang",
        },
      },
      {
        id: "devops-engineer",
        name: "James Miller",
        role: "DevOps Engineer",
        bio: "Infrastructure expert ensuring our platform scales reliably. Shares insights about cloud architecture and deployment strategies.",
        avatar: "https://via.placeholder.com/80x80",
        social: {
          github: "https://github.com/jamesmiller",
          linkedin: "https://linkedin.com/in/jamesmiller",
        },
      },
    ],
    showValues: false,
    showMilestones: false,
  },
};

export const CorporateAbout: Story = {
  args: {
    title: "About TechCorp Solutions",
    subtitle: "Enterprise-grade developer tools with transparency at our core",
    story: "TechCorp Solutions brings enterprise reliability to developer tools while maintaining the transparency and community focus that drives innovation. Our platform serves teams from startups to Fortune 500 companies.",
    mission: "To provide enterprise-grade developer tools that don't compromise on transparency, community input, or developer experience.",
    vision: "Making powerful developer tools accessible to organizations of all sizes through transparent development and community collaboration.",
    values: [
      {
        id: "reliability",
        title: "Enterprise Reliability",
        description: "99.99% uptime SLA with comprehensive monitoring and instant incident response for mission-critical development workflows.",
        icon: Shield,
      },
      {
        id: "transparency",
        title: "Transparent Operations",
        description: "Full visibility into our development process, security practices, and business decisions. Nothing hidden behind corporate walls.",
        icon: Globe,
      },
      {
        id: "scalability",
        title: "Infinite Scalability",
        description: "Built to handle teams of any size, from solo developers to thousands of engineers, with consistent performance.",
        icon: Zap,
      },
      {
        id: "community",
        title: "Community Partnership",
        description: "Enterprise features driven by real developer needs, validated through community feedback and open development.",
        icon: Users,
      },
    ],
    showMilestones: false,
  },
};

export const NonProfitMission: Story = {
  args: {
    title: "Developer Education Initiative",
    subtitle: "Democratizing access to quality developer education worldwide",
    story: "Our non-profit organization is dedicated to making high-quality developer education accessible to everyone, regardless of economic background or geographic location.",
    mission: "To eliminate barriers to developer education by providing free, high-quality resources and mentorship to aspiring developers worldwide.",
    vision: "A world where anyone with passion and dedication can become a skilled developer, regardless of their starting point.",
    values: [
      {
        id: "accessibility",
        title: "Universal Accessibility",
        description: "Education should be available to everyone, everywhere. We create resources that work across devices, languages, and learning styles.",
        icon: Globe,
      },
      {
        id: "quality",
        title: "No-Compromise Quality",
        description: "Free doesn't mean lower quality. Our educational content meets the same standards as premium paid resources.",
        icon: Star,
      },
      {
        id: "community",
        title: "Peer Learning",
        description: "Learning happens best in community. We foster environments where students teach each other and grow together.",
        icon: Users,
      },
      {
        id: "practice",
        title: "Hands-On Practice",
        description: "Real learning comes from building real things. Every concept is reinforced with practical, portfolio-worthy projects.",
        icon: Code,
      },
    ],
    showTeam: false,
    contactMethods: [
      {
        type: "email",
        label: "Partner With Us",
        value: "partnerships@devedu.org",
        href: "mailto:partnerships@devedu.org",
        icon: require("lucide-react").Mail,
      },
      {
        type: "volunteer",
        label: "Volunteer",
        value: "Join our educator network",
        href: "/volunteer",
        icon: Heart,
      },
      {
        type: "donate",
        label: "Support Our Mission",
        value: "Help fund free education",
        href: "/donate",
        icon: require("lucide-react").Heart,
      },
    ],
  },
};

export const WithoutSections: Story = {
  args: {
    title: "Simple About Page",
    subtitle: "Clean and minimal company information",
    story: "Sometimes less is more. This layout focuses on the essential information without overwhelming visitors with too many sections.",
    showValues: false,
    showTeam: false, 
    showMilestones: false,
    showContact: false,
  },
};

export const FounderStory: Story = {
  args: {
    title: "Founder's Story",
    subtitle: "The personal journey behind building in public",
    story: "After years of working at large tech companies where decisions were made behind closed doors, I decided to try something different. What if we built a company where every decision, every challenge, and every success was shared openly with the community? This is that experiment.",
    mission: "To prove that radical transparency in business isn't just possible, but actually creates better products and stronger relationships with users.",
    vision: "A business world where transparency is the default, not the exception.",
    team: [sampleTeam[0]],
    milestones: sampleMilestones.slice(0, 3),
    showValues: false,
  },
};