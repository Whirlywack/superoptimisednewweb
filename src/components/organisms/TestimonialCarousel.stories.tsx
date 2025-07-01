import type { Meta, StoryObj } from "@storybook/react";
import { TestimonialCarousel } from "./TestimonialCarousel";

const meta = {
  title: "Organisms/TestimonialCarousel",
  component: TestimonialCarousel,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Testimonial carousel component for displaying customer feedback, reviews, and community voices. Features navigation, auto-play, and multiple display variants.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    testimonials: {
      control: "object",
      description: "Array of testimonials to display",
    },
    title: {
      control: "text",
      description: "Carousel title",
    },
    description: {
      control: "text",
      description: "Carousel description",
    },
    variant: {
      control: "select",
      options: ["default", "minimal", "cards", "centered"],
      description: "Display variant",
    },
    autoPlay: {
      control: "boolean",
      description: "Enable auto-play functionality",
    },
    autoPlayInterval: {
      control: "number",
      description: "Auto-play interval in milliseconds",
    },
    showNavigation: {
      control: "boolean",
      description: "Show navigation arrows",
    },
    showDots: {
      control: "boolean",
      description: "Show dot indicators",
    },
    showRating: {
      control: "boolean",
      description: "Show star ratings",
    },
    showSource: {
      control: "boolean",
      description: "Show source platform icons",
    },
    itemsPerView: {
      control: "select",
      options: [1, 2, 3],
      description: "Number of testimonials to show at once",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Component size",
    },
  },
} satisfies Meta<typeof TestimonialCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTestimonials = [
  {
    id: "1",
    content: "This platform has completely transformed how I approach building in public. The transparency and community feedback have been invaluable to my development process.",
    author: "Sarah Chen",
    role: "Senior Frontend Developer",
    company: "TechCorp",
    avatar: "https://via.placeholder.com/48x48",
    rating: 5,
    source: "twitter" as const,
    sourceUrl: "https://twitter.com/sarahchen/status/123",
    date: "2 weeks ago",
  },
  {
    id: "2",
    content: "The component library and documentation are outstanding. It's rare to find such attention to detail and developer experience in open source projects.",
    author: "Marcus Rodriguez",
    role: "Full Stack Engineer",
    company: "StartupXYZ",
    avatar: "https://via.placeholder.com/48x48",
    rating: 5,
    source: "github" as const,
    sourceUrl: "https://github.com/superoptimised/issues/45",
    date: "1 week ago",
  },
  {
    id: "3",
    content: "I've learned more about modern development practices from following this project than from any course. The real-world examples and honest discussions about challenges are incredibly valuable.",
    author: "Emily Taylor",
    role: "Junior Developer",
    avatar: "https://via.placeholder.com/48x48",
    rating: 5,
    source: "linkedin" as const,
    date: "3 days ago",
    featured: true,
  },
  {
    id: "4",
    content: "The API design is clean and intuitive. Integration was seamless, and the TypeScript support made development a breeze. Highly recommend for any team building modern web applications.",
    author: "David Kim",
    role: "Tech Lead",
    company: "Innovation Labs",
    avatar: "https://via.placeholder.com/48x48",
    rating: 4,
    source: "email" as const,
    date: "1 week ago",
  },
  {
    id: "5",
    content: "What sets this project apart is the genuine commitment to community. Every piece of feedback is considered, and the development process is truly collaborative.",
    author: "Jessica Park",
    role: "Product Manager",
    company: "Digital Solutions",
    rating: 5,
    source: "direct" as const,
    date: "5 days ago",
  },
  {
    id: "6",
    content: "The performance optimizations and best practices implemented here serve as an excellent reference for our own projects. The code quality is exceptional.",
    author: "Alex Thompson",
    role: "Software Architect",
    company: "Enterprise Tech",
    avatar: "https://via.placeholder.com/48x48",
    rating: 5,
    source: "github" as const,
    sourceUrl: "https://github.com/superoptimised/discussions/12",
    date: "4 days ago",
  },
];

const shortTestimonials = [
  {
    id: "short1",
    content: "Incredible developer experience and attention to detail.",
    author: "Mike Johnson",
    role: "Frontend Developer",
    rating: 5,
    source: "twitter" as const,
  },
  {
    id: "short2",
    content: "Best component library I've used this year.",
    author: "Lisa Wang",
    role: "UI Engineer",
    rating: 5,
    source: "github" as const,
  },
  {
    id: "short3",
    content: "Learning so much from the building in public approach.",
    author: "Tom Wilson",
    role: "Developer",
    rating: 4,
    source: "linkedin" as const,
  },
];

export const Default: Story = {
  args: {
    testimonials: sampleTestimonials,
    title: "What Developers Are Saying",
    description: "Feedback from our amazing community of developers and creators who are building alongside us.",
  },
};

export const AutoPlay: Story = {
  args: {
    testimonials: sampleTestimonials,
    title: "Community Voices",
    description: "Hear from developers who are part of our building in public journey.",
    autoPlay: true,
    autoPlayInterval: 3000,
  },
};

export const Minimal: Story = {
  args: {
    testimonials: shortTestimonials,
    title: "Quick Reviews",
    variant: "minimal",
  },
};

export const Cards: Story = {
  args: {
    testimonials: sampleTestimonials,
    title: "Developer Testimonials",
    description: "Real feedback from real developers using our platform and tools.",
    variant: "cards",
    showRating: true,
    showSource: true,
  },
};

export const Centered: Story = {
  args: {
    testimonials: sampleTestimonials.slice(0, 3),
    title: "Featured Testimonials",
    description: "Highlighted feedback from our most engaged community members.",
    variant: "centered",
    size: "lg",
  },
};

export const TwoPerView: Story = {
  args: {
    testimonials: sampleTestimonials,
    title: "Community Feedback",
    description: "Testimonials from developers, designers, and product managers.",
    itemsPerView: 2,
    variant: "cards",
  },
};

export const ThreePerView: Story = {
  args: {
    testimonials: sampleTestimonials,
    title: "Developer Reviews",
    itemsPerView: 3,
    variant: "cards",
    size: "sm",
  },
};

export const NoNavigation: Story = {
  args: {
    testimonials: sampleTestimonials.slice(0, 3),
    title: "Static Testimonials",
    showNavigation: false,
    showDots: false,
  },
};

export const NoRatings: Story = {
  args: {
    testimonials: sampleTestimonials,
    title: "Community Feedback",
    showRating: false,
  },
};

export const NoSource: Story = {
  args: {
    testimonials: sampleTestimonials,
    title: "Anonymous Feedback",
    showSource: false,
  },
};

export const SmallSize: Story = {
  args: {
    testimonials: shortTestimonials,
    size: "sm",
    variant: "cards",
  },
};

export const LargeSize: Story = {
  args: {
    testimonials: sampleTestimonials.slice(0, 3),
    title: "Featured Community Voices",
    description: "Comprehensive feedback from our most active community members who have been with us throughout the journey.",
    size: "lg",
    variant: "centered",
  },
};

export const SingleTestimonial: Story = {
  args: {
    testimonials: [sampleTestimonials[0]],
    title: "Featured Review",
    variant: "centered",
    showNavigation: false,
    showDots: false,
  },
};

export const WithoutAvatars: Story = {
  args: {
    testimonials: sampleTestimonials.map(t => ({ ...t, avatar: undefined })),
    title: "Text-Only Testimonials",
    description: "Clean testimonial layout focusing on the content and attribution.",
  },
};

export const TwitterTestimonials: Story = {
  args: {
    testimonials: [
      {
        id: "twitter1",
        content: "Just discovered this amazing building in public project. The transparency and community involvement is exactly what the dev community needs! 🚀",
        author: "@devbuilder",
        role: "Indie Developer",
        rating: 5,
        source: "twitter" as const,
        sourceUrl: "https://twitter.com/devbuilder/status/123",
        date: "2 hours ago",
      },
      {
        id: "twitter2",
        content: "The component library documentation is *chef's kiss* 👌 This is how all open source projects should be documented.",
        author: "@uxengineer",
        role: "UX Engineer",
        company: "Design Co",
        rating: 5,
        source: "twitter" as const,
        sourceUrl: "https://twitter.com/uxengineer/status/124",
        date: "1 day ago",
      },
      {
        id: "twitter3",
        content: "Following this project has been like getting a masterclass in modern web development. So much learning happening! 📚",
        author: "@learningdev",
        role: "Student Developer",
        rating: 5,
        source: "twitter" as const,
        sourceUrl: "https://twitter.com/learningdev/status/125",
        date: "3 days ago",
      },
    ],
    title: "Twitter Buzz",
    description: "What the developer community is saying on Twitter",
    variant: "cards",
    autoPlay: true,
  },
};

export const GitHubFeedback: Story = {
  args: {
    testimonials: [
      {
        id: "github1",
        content: "This is exactly the kind of project the React community needs. The code quality and documentation standards are exemplary.",
        author: "opensourcedev",
        role: "Maintainer",
        company: "React Ecosystem",
        rating: 5,
        source: "github" as const,
        sourceUrl: "https://github.com/superoptimised/discussions/1",
        date: "1 week ago",
      },
      {
        id: "github2",
        content: "I've been following the development process and the attention to accessibility and performance is remarkable. Great work!",
        author: "a11yadvocate",
        role: "Accessibility Engineer",
        rating: 5,
        source: "github" as const,
        sourceUrl: "https://github.com/superoptimised/issues/23",
        date: "5 days ago",
      },
    ],
    title: "GitHub Community",
    description: "Feedback from fellow developers on GitHub",
    variant: "detailed",
  },
};

export const MixedSources: Story = {
  args: {
    testimonials: [
      ...sampleTestimonials.slice(0, 2),
      {
        id: "mixed1",
        content: "The API documentation is comprehensive and the examples are practical. Made integration straightforward.",
        author: "Backend Developer",
        role: "Anonymous",
        rating: 4,
        source: "email" as const,
        date: "2 weeks ago",
      },
    ],
    title: "Multi-Platform Feedback",
    description: "Testimonials from various platforms and communication channels",
    variant: "cards",
    showSource: true,
  },
};

export const ProductLaunch: Story = {
  args: {
    testimonials: [
      {
        id: "launch1",
        content: "Been following since day one. The journey from concept to launch has been incredible to witness. The final product exceeds expectations!",
        author: "Early Adopter",
        role: "Beta Tester",
        rating: 5,
        source: "direct" as const,
        date: "Launch day",
        featured: true,
      },
      {
        id: "launch2",
        content: "The building in public approach created such a strong community around this project. Proud to be part of it from the beginning.",
        author: "Community Member",
        role: "Contributor",
        rating: 5,
        source: "github" as const,
        date: "Launch week",
      },
      {
        id: "launch3",
        content: "This launch proves that transparent development and community involvement create better products. Congratulations to the team!",
        author: "Industry Observer",
        role: "Tech Analyst",
        rating: 5,
        source: "linkedin" as const,
        date: "Post-launch",
      },
    ],
    title: "Launch Celebration",
    description: "Reactions from our community celebrating the successful product launch",
    variant: "centered",
    size: "lg",
    autoPlay: true,
    autoPlayInterval: 4000,
  },
  parameters: {
    docs: {
      description: {
        story: "Special testimonial carousel celebrating a product launch with community reactions.",
      },
    },
  },
};