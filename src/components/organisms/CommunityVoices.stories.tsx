import type { Meta, StoryObj } from "@storybook/react";
import { CommunityVoices } from "./CommunityVoices";

const meta = {
  title: "Organisms/CommunityVoices",
  component: CommunityVoices,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Grid of community quotes component showcasing feedback, testimonials, and responses from the community. Supports multiple layouts and highlighting featured quotes.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    quotes: {
      control: "object",
      description: "Array of community quotes to display",
    },
    title: {
      control: "text",
      description: "Section title",
    },
    description: {
      control: "text",
      description: "Section description",
    },
    variant: {
      control: "select",
      options: ["grid", "masonry", "carousel", "featured"],
      description: "Display variant",
    },
    columns: {
      control: "select",
      options: [1, 2, 3, 4],
      description: "Number of columns in grid layout",
    },
    showSource: {
      control: "boolean",
      description: "Show quote source (Twitter, GitHub, etc.)",
    },
    showLikes: {
      control: "boolean",
      description: "Show like count",
    },
    maxQuotes: {
      control: "number",
      description: "Maximum number of quotes to display",
    },
  },
} satisfies Meta<typeof CommunityVoices>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleQuotes = [
  {
    id: "1",
    content: "This design system has completely transformed how we build our products. The attention to detail and developer experience is outstanding.",
    author: "Sarah Chen",
    role: "Frontend Developer",
    source: "twitter" as const,
    date: "2024-01-15",
    url: "https://twitter.com/sarahchen/status/example",
    highlighted: true,
    likes: 42,
  },
  {
    id: "2",
    content: "Finally, a component library that actually follows accessibility best practices out of the box. WCAG compliance made easy!",
    author: "Marcus Johnson",
    role: "UX Engineer",
    source: "github" as const,
    date: "2024-01-10",
    likes: 28,
  },
  {
    id: "3",
    content: "The documentation is incredibly thorough. Every component has clear examples and the Storybook integration is perfect for our team.",
    author: "Emily Rodriguez",
    source: "questionnaire" as const,
    date: "2024-01-08",
    likes: 15,
  },
  {
    id: "4",
    content: "We've cut our development time in half since adopting this system. The consistency across our products has improved dramatically.",
    author: "David Park",
    role: "Tech Lead",
    source: "email" as const,
    date: "2024-01-05",
    likes: 34,
  },
  {
    id: "5",
    content: "Love the minimal color palette approach. It forces us to focus on content hierarchy rather than relying on colors.",
    author: "Lisa Wang",
    role: "Product Designer",
    source: "twitter" as const,
    date: "2024-01-03",
    url: "https://twitter.com/lisawang/status/example",
    likes: 19,
  },
  {
    id: "6",
    content: "The TypeScript support is excellent. Every prop is well-typed and the IntelliSense experience is smooth.",
    author: "Alex Thompson",
    source: "github" as const,
    date: "2023-12-28",
    likes: 22,
  },
  {
    id: "7",
    content: "Building in public has been such an inspiring journey to follow. The transparency and community engagement is refreshing.",
    author: "Rachel Green",
    role: "Indie Hacker",
    source: "twitter" as const,
    date: "2023-12-25",
    highlighted: true,
    likes: 56,
  },
  {
    id: "8",
    content: "The mobile-first approach really shows. Everything works perfectly on all screen sizes without any extra effort.",
    author: "Tom Wilson",
    source: "questionnaire" as const,
    date: "2023-12-20",
    likes: 11,
  },
];

export const Default: Story = {
  args: {
    quotes: sampleQuotes,
    title: "Community Voices",
    description: "What developers are saying about building with our design system",
    variant: "grid",
    columns: 3,
    showSource: true,
    showLikes: true,
  },
};

export const Grid: Story = {
  args: {
    quotes: sampleQuotes.slice(0, 6),
    variant: "grid",
    columns: 3,
  },
};

export const TwoColumns: Story = {
  args: {
    quotes: sampleQuotes.slice(0, 4),
    variant: "grid",
    columns: 2,
  },
};

export const FourColumns: Story = {
  args: {
    quotes: sampleQuotes,
    variant: "grid",
    columns: 4,
  },
};

export const Masonry: Story = {
  args: {
    quotes: sampleQuotes,
    variant: "masonry",
    columns: 3,
    title: "Community Feedback",
    description: "Real voices from our community of builders",
  },
};

export const Featured: Story = {
  args: {
    quotes: sampleQuotes,
    variant: "featured",
    columns: 3,
    title: "What Our Community Says",
    description: "Highlighted feedback from developers using our system",
  },
};

export const Carousel: Story = {
  args: {
    quotes: sampleQuotes,
    variant: "carousel",
    title: "Community Testimonials",
  },
  parameters: {
    docs: {
      description: {
        story: "Horizontal scrolling carousel variant for showcasing quotes in a compact space.",
      },
    },
  },
};

export const WithMaxQuotes: Story = {
  args: {
    quotes: sampleQuotes,
    maxQuotes: 3,
    variant: "grid",
    columns: 3,
    title: "Recent Feedback",
  },
};

export const NoMeta: Story = {
  args: {
    quotes: sampleQuotes.map(q => ({ ...q, likes: 0 })),
    showSource: false,
    showLikes: false,
    variant: "grid",
    columns: 3,
  },
};

export const SingleColumn: Story = {
  args: {
    quotes: sampleQuotes.slice(0, 3),
    variant: "grid",
    columns: 1,
    title: "Community Highlights",
  },
};

export const TwitterOnly: Story = {
  args: {
    quotes: sampleQuotes.filter(q => q.source === "twitter"),
    title: "Twitter Feedback",
    description: "What people are saying about us on Twitter",
    variant: "grid",
    columns: 2,
  },
};

export const NoHeaderText: Story = {
  args: {
    quotes: sampleQuotes.slice(0, 6),
    variant: "grid",
    columns: 3,
  },
};

export const LongQuotes: Story = {
  args: {
    quotes: [
      {
        id: "long1",
        content: "This design system has been a game-changer for our team. The comprehensive documentation, well-thought-out components, and excellent TypeScript support have made our development process so much smoother. We've been able to maintain consistency across multiple products while still having the flexibility to customize when needed. The community support has been incredible too!",
        author: "Jennifer Martinez",
        role: "Engineering Manager",
        source: "email" as const,
        highlighted: true,
        likes: 87,
      },
      {
        id: "long2",
        content: "I've worked with many component libraries over the years, but this one stands out for its attention to accessibility and performance. Every component is built with WCAG compliance in mind, and the bundle size optimization is impressive. The fact that it's being built in public adds an extra layer of trust and transparency that's rare in the industry.",
        author: "Michael Brown",
        role: "Senior Developer",
        source: "github" as const,
        likes: 64,
      },
      {
        id: "long3",
        content: "The minimal color palette philosophy really resonates with our brand. It's helped us create a clean, professional look that doesn't feel generic. The design tokens are well-organized and the theming system is flexible enough to accommodate our specific needs without breaking the overall consistency.",
        author: "Amanda Taylor",
        role: "Design Lead",
        source: "twitter" as const,
        likes: 45,
      },
    ],
    variant: "featured",
    columns: 2,
    title: "In-Depth Reviews",
  },
  parameters: {
    docs: {
      description: {
        story: "Example with longer, more detailed quotes from the community.",
      },
    },
  },
};

export const Homepage: Story = {
  args: {
    quotes: sampleQuotes.filter(q => q.highlighted).concat(sampleQuotes.filter(q => !q.highlighted).slice(0, 2)),
    variant: "featured",
    columns: 3,
    title: "Loved by Developers",
    description: "Join thousands of developers building better products",
    maxQuotes: 4,
  },
  parameters: {
    docs: {
      description: {
        story: "Homepage variant showing featured quote prominently with a few additional quotes.",
      },
    },
  },
};