import type { Meta, StoryObj } from "@storybook/react";
import { IndividualPost } from "./IndividualPost";
import { fn } from "@storybook/test";

const meta = {
  title: "Templates/IndividualPost",
  component: IndividualPost,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Individual post template for displaying blog posts, articles, and community content with comments, author information, and social features.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    post: {
      control: "object",
      description: "Post data",
    },
    comments: {
      control: "object",
      description: "Array of comments",
    },
    relatedPosts: {
      control: "object",
      description: "Related posts to display",
    },
    previousPost: {
      control: "object",
      description: "Previous post navigation",
    },
    nextPost: {
      control: "object",
      description: "Next post navigation",
    },
    showComments: {
      control: "boolean",
      description: "Show comments section",
    },
    showRelated: {
      control: "boolean",
      description: "Show related posts",
    },
    showNavigation: {
      control: "boolean",
      description: "Show post navigation",
    },
    showAuthorCard: {
      control: "boolean",
      description: "Show author information card",
    },
    showStats: {
      control: "boolean",
      description: "Show post statistics",
    },
    onLike: {
      action: "post-liked",
      description: "Post like handler",
    },
    onBookmark: {
      action: "post-bookmarked",
      description: "Post bookmark handler",
    },
    onShare: {
      action: "post-shared",
      description: "Post share handler",
    },
    onCommentSubmit: {
      action: "comment-submitted",
      description: "Comment submit handler",
    },
    onCommentLike: {
      action: "comment-liked",
      description: "Comment like handler",
    },
  },
  args: {
    onLike: fn(),
    onBookmark: fn(),
    onShare: fn(),
    onCommentSubmit: fn(),
    onCommentLike: fn(),
  },
} satisfies Meta<typeof IndividualPost>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleAuthor = {
  id: "author-1",
  name: "Sarah Chen",
  avatar: "https://via.placeholder.com/64x64",
  bio: "Senior Frontend Developer passionate about building in public and sharing knowledge with the developer community.",
  role: "Senior Developer",
  social: {
    github: "https://github.com/sarahchen",
    twitter: "https://twitter.com/sarahchen",
    linkedin: "https://linkedin.com/in/sarahchen",
  },
};

const samplePost = {
  id: "post-1",
  title: "Building a Component Library: Lessons from 6 Months of Open Development",
  content: `
    <p>Six months ago, we decided to build our component library completely in the open. Every decision, every mistake, and every breakthrough has been shared with our community. Here's what we've learned along the way.</p>
    
    <h2>The Decision to Build in Public</h2>
    <p>Building in public wasn't just a marketing strategy for us—it was a fundamental shift in how we approach product development. We wanted to create something that truly served the developer community, and the only way to do that was to include them in every step of the process.</p>
    
    <p>The initial fear was real. What if we made mistakes? What if our code wasn't perfect? What if people criticized our decisions? But these fears quickly turned into our greatest strengths.</p>
    
    <h2>Key Learnings</h2>
    
    <h3>1. Community Feedback is Invaluable</h3>
    <p>The feedback we received from our community shaped every major decision we made. From API design to component naming conventions, having real developers using and commenting on our work made the library infinitely better than anything we could have built in isolation.</p>
    
    <h3>2. Transparency Builds Trust</h3>
    <p>By sharing our struggles and failures alongside our successes, we built a level of trust with our community that traditional development approaches simply can't achieve. People understood our constraints and were more willing to contribute solutions rather than just complaints.</p>
    
    <h3>3. Documentation is a Living Process</h3>
    <p>One of the biggest surprises was how documentation became a collaborative effort. Community members would submit improvements, examples, and clarifications that made our docs far more comprehensive than we ever imagined.</p>
    
    <h2>The Technical Journey</h2>
    <p>From a technical standpoint, building in public forced us to maintain higher standards from day one. Knowing that every commit would be scrutinized made us more thoughtful about our code quality, testing, and architectural decisions.</p>
    
    <p>We implemented:</p>
    <ul>
      <li>Comprehensive TypeScript interfaces for all components</li>
      <li>Automated testing with 95% coverage</li>
      <li>Storybook documentation for every component variant</li>
      <li>Accessibility compliance with WCAG 2.1 AA standards</li>
    </ul>
    
    <h2>Challenges We Faced</h2>
    <p>Not everything was smooth sailing. We faced several significant challenges:</p>
    
    <p><strong>Managing Breaking Changes:</strong> With an active community using our components, every change had to be carefully considered. We developed a robust deprecation strategy and clear communication channels.</p>
    
    <p><strong>Balancing Feedback:</strong> Sometimes community requests conflicted with our vision or technical constraints. Learning to say "no" while explaining our reasoning became a crucial skill.</p>
    
    <p><strong>Time Management:</strong> Engaging with the community took significant time. We had to balance development work with community management, documentation, and support.</p>
    
    <h2>Results and Impact</h2>
    <p>The results speak for themselves:</p>
    <ul>
      <li>2,500+ GitHub stars in 6 months</li>
      <li>150+ community contributors</li>
      <li>500+ components and variants</li>
      <li>Used by 10,000+ developers across 50+ companies</li>
    </ul>
    
    <h2>What's Next</h2>
    <p>We're continuing to build in public as we work on version 2.0 of our component library. The lessons we've learned will shape not just this project, but how we approach all future development work.</p>
    
    <p>Building in public isn't just about transparency—it's about creating better products through genuine collaboration with the people who will use them.</p>
    
    <p>If you're considering building your next project in public, our advice is simple: start today. The community is waiting to help you build something amazing.</p>
  `,
  excerpt: "Six months ago, we decided to build our component library completely in the open. Every decision, every mistake, and every breakthrough has been shared with our community. Here's what we've learned along the way.",
  publishedAt: "2024-01-15",
  updatedAt: "2024-01-16",
  readTime: "12 min read",
  author: sampleAuthor,
  tags: ["Building in Public", "Component Library", "Open Source", "Community", "Development"],
  stats: {
    views: 12500,
    likes: 342,
    comments: 67,
    shares: 89,
  },
  isLiked: false,
  isBookmarked: false,
  category: "Development",
  series: {
    title: "Building in Public Series",
    part: 3,
    total: 5,
  },
};

const sampleComments = [
  {
    id: "comment-1",
    content: "This is such an inspiring approach to development! I've been following your journey and it's amazing to see how the community has shaped the library. The transparency really does build trust.",
    author: {
      id: "user-1",
      name: "Marcus Rodriguez",
      avatar: "https://via.placeholder.com/32x32",
      role: "Full Stack Developer",
    },
    createdAt: "2024-01-15T10:30:00Z",
    likes: 23,
    isLiked: false,
    replies: [
      {
        id: "reply-1",
        content: "Completely agree! Sarah's approach has been a masterclass in community-driven development. Looking forward to v2.0!",
        author: {
          id: "user-2",
          name: "Emily Taylor",
          avatar: "https://via.placeholder.com/32x32",
          role: "Frontend Engineer",
        },
        createdAt: "2024-01-15T11:15:00Z",
        likes: 8,
        isLiked: true,
      },
    ],
  },
  {
    id: "comment-2",
    content: "The documentation point really resonates with me. I've contributed a few examples to the docs and it felt great to be part of the process rather than just a consumer.",
    author: {
      id: "user-3",
      name: "David Kim",
      avatar: "https://via.placeholder.com/32x32",
      role: "Tech Lead",
    },
    createdAt: "2024-01-15T14:22:00Z",
    likes: 15,
    isLiked: false,
  },
  {
    id: "comment-3",
    content: "Question about the breaking changes strategy - how do you handle deprecations while maintaining backward compatibility? This is something we're struggling with in our own library.",
    author: {
      id: "user-4",
      name: "Jessica Park",
      role: "Senior Developer",
    },
    createdAt: "2024-01-15T16:45:00Z",
    likes: 7,
    isLiked: false,
    replies: [
      {
        id: "reply-2",
        content: "Great question! We typically maintain deprecated APIs for at least 2 major versions with clear migration guides. The community feedback helps us prioritize which changes are most important.",
        author: sampleAuthor,
        createdAt: "2024-01-15T17:30:00Z",
        likes: 12,
        isAuthor: true,
        isLiked: false,
      },
    ],
  },
];

const sampleRelatedPosts = [
  {
    id: "related-1",
    title: "Getting Started with Building in Public",
    excerpt: "A beginner's guide to transparent development and community engagement",
    href: "/blog/getting-started-building-public",
    readTime: "8 min read",
    publishedAt: "2024-01-10",
  },
  {
    id: "related-2",
    title: "Open Source Sustainability: Balancing Community and Business",
    excerpt: "How to build sustainable open source projects that serve both community needs and business goals",
    href: "/blog/open-source-sustainability",
    readTime: "15 min read",
    publishedAt: "2024-01-08",
  },
  {
    id: "related-3",
    title: "Component API Design: Lessons from 500+ Components",
    excerpt: "Best practices for designing component APIs that are both powerful and easy to use",
    href: "/blog/component-api-design",
    readTime: "10 min read",
    publishedAt: "2024-01-05",
  },
  {
    id: "related-4",
    title: "Building Trust Through Transparency",
    excerpt: "How radical transparency in development creates stronger relationships with users",
    href: "/blog/building-trust-transparency",
    readTime: "6 min read",
    publishedAt: "2024-01-03",
  },
];

export const Default: Story = {
  args: {
    post: samplePost,
    comments: sampleComments,
    relatedPosts: sampleRelatedPosts,
    previousPost: {
      title: "The Psychology of Building in Public",
      href: "/blog/psychology-building-public",
    },
    nextPost: {
      title: "Community-Driven Feature Development",
      href: "/blog/community-driven-features",
    },
  },
};

export const WithoutComments: Story = {
  args: {
    post: samplePost,
    comments: [],
    relatedPosts: sampleRelatedPosts,
    showComments: false,
  },
};

export const WithoutRelated: Story = {
  args: {
    post: samplePost,
    comments: sampleComments,
    relatedPosts: [],
    showRelated: false,
  },
};

export const WithoutNavigation: Story = {
  args: {
    post: samplePost,
    comments: sampleComments,
    relatedPosts: sampleRelatedPosts,
    showNavigation: false,
  },
};

export const WithoutAuthorCard: Story = {
  args: {
    post: samplePost,
    comments: sampleComments,
    relatedPosts: sampleRelatedPosts,
    showAuthorCard: false,
  },
};

export const MinimalPost: Story = {
  args: {
    post: {
      ...samplePost,
      series: undefined,
    },
    comments: [],
    relatedPosts: [],
    showComments: false,
    showRelated: false,
    showNavigation: false,
    showAuthorCard: false,
    showStats: false,
  },
};

export const ShortPost: Story = {
  args: {
    post: {
      id: "short-post",
      title: "Quick Update: New Component Release",
      content: `
        <p>We're excited to announce the release of three new components in our library:</p>
        <ul>
          <li><strong>DatePicker</strong> - A fully accessible date selection component</li>
          <li><strong>MultiSelect</strong> - Enhanced select component with multiple selection</li>
          <li><strong>LoadingSpinner</strong> - Customizable loading indicators</li>
        </ul>
        <p>All components follow our design system principles and include comprehensive documentation. Check out the updated Storybook for examples and usage guidelines.</p>
        <p>As always, we'd love to hear your feedback and see how you're using these components in your projects!</p>
      `,
      excerpt: "Announcing three new components: DatePicker, MultiSelect, and LoadingSpinner with full documentation and examples.",
      publishedAt: "2024-01-20",
      readTime: "3 min read",
      author: sampleAuthor,
      tags: ["Release", "Components", "Update"],
      stats: {
        views: 3200,
        likes: 89,
        comments: 12,
        shares: 15,
      },
      isLiked: true,
      isBookmarked: false,
      category: "Release Notes",
    },
    comments: sampleComments.slice(0, 2),
    relatedPosts: sampleRelatedPosts.slice(0, 2),
  },
};

export const TechnicalDeepDive: Story = {
  args: {
    post: {
      id: "technical-post",
      title: "Deep Dive: Building Type-Safe Component APIs with TypeScript",
      content: `
        <p>Creating truly type-safe component APIs requires careful consideration of TypeScript's capabilities and limitations. In this deep dive, we'll explore advanced patterns for building components that provide excellent developer experience while maintaining runtime safety.</p>
        
        <h2>The Challenge</h2>
        <p>Building component APIs that are both flexible and type-safe is one of the most challenging aspects of library development. We need to balance:</p>
        <ul>
          <li>Developer experience and autocomplete</li>
          <li>Runtime safety and error handling</li>
          <li>API flexibility and extensibility</li>
          <li>Bundle size and performance</li>
        </ul>
        
        <h2>Generic Constraints and Conditional Types</h2>
        <p>One of the most powerful patterns we've discovered involves using generic constraints with conditional types to create APIs that adapt based on props:</p>
        
        <pre><code>type ButtonProps<T extends 'button' | 'link'> = {
  variant: T;
} & (T extends 'link' ? { href: string } : { onClick: () => void });</code></pre>
        
        <p>This pattern ensures that link variants require an href prop, while button variants require an onClick handler.</p>
        
        <h2>Polymorphic Components</h2>
        <p>For maximum flexibility, we've implemented polymorphic components that can render as different HTML elements while maintaining full type safety:</p>
        
        <pre><code>interface PolymorphicProps<T extends ElementType> {
  as?: T;
  children: ReactNode;
}

type Props<T extends ElementType> = PolymorphicProps<T> & 
  Omit<ComponentPropsWithoutRef<T>, keyof PolymorphicProps<T>>;</code></pre>
        
        <h2>Runtime Validation</h2>
        <p>TypeScript provides compile-time safety, but we also need runtime validation for props that come from external sources. We've integrated Zod for runtime schema validation:</p>
        
        <pre><code>const ButtonSchema = z.object({
  variant: z.enum(['primary', 'secondary', 'outline']),
  size: z.enum(['sm', 'md', 'lg']).optional(),
});</code></pre>
        
        <h2>Performance Considerations</h2>
        <p>Advanced TypeScript patterns can impact compilation time and bundle size. We've learned to balance type safety with performance through:</p>
        <ul>
          <li>Strategic use of module augmentation</li>
          <li>Lazy type evaluation for complex unions</li>
          <li>Tree-shaking friendly exports</li>
        </ul>
        
        <h2>Developer Tooling</h2>
        <p>Great TypeScript APIs require great tooling. We've invested heavily in:</p>
        <ul>
          <li>Custom ESLint rules for API usage</li>
          <li>VS Code snippets and IntelliSense</li>
          <li>Automated type testing with tsd</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Building type-safe component APIs is an ongoing process of iteration and refinement. The patterns we've shared here have served us well, but we're always learning and improving based on community feedback.</p>
      `,
      excerpt: "Advanced patterns for building TypeScript component APIs that provide excellent developer experience while maintaining runtime safety.",
      publishedAt: "2024-01-18",
      readTime: "18 min read",
      author: {
        ...sampleAuthor,
        name: "Alex Thompson",
        role: "TypeScript Architect",
        bio: "TypeScript expert specializing in advanced type patterns and developer tooling. Passionate about creating APIs that are both powerful and delightful to use.",
      },
      tags: ["TypeScript", "Component API", "Developer Experience", "Advanced", "Type Safety"],
      stats: {
        views: 8900,
        likes: 267,
        comments: 43,
        shares: 76,
      },
      isLiked: false,
      isBookmarked: true,
      category: "Technical Deep Dive",
    },
    comments: sampleComments,
    relatedPosts: sampleRelatedPosts,
  },
};

export const SeriesPost: Story = {
  args: {
    post: {
      ...samplePost,
      title: "Part 3: Community Feedback Integration",
      series: {
        title: "Building in Public: A Complete Guide",
        part: 3,
        total: 8,
      },
    },
    comments: sampleComments,
    relatedPosts: sampleRelatedPosts,
    previousPost: {
      title: "Part 2: Setting Up Transparent Development",
      href: "/series/building-public/part-2",
    },
    nextPost: {
      title: "Part 4: Managing Community Expectations",
      href: "/series/building-public/part-4",
    },
  },
};

export const PopularPost: Story = {
  args: {
    post: {
      ...samplePost,
      title: "Why Building in Public is the Future of Software Development",
      stats: {
        views: 45600,
        likes: 1234,
        comments: 189,
        shares: 432,
      },
      isLiked: true,
      isBookmarked: true,
    },
    comments: [
      ...sampleComments,
      ...Array.from({ length: 5 }, (_, i) => ({
        id: `popular-comment-${i}`,
        content: `This really changed my perspective on development. Thank you for sharing your experience!`,
        author: {
          id: `popular-user-${i}`,
          name: `Developer ${i + 1}`,
          role: "Software Engineer",
        },
        createdAt: `2024-01-15T${10 + i}:00:00Z`,
        likes: Math.floor(Math.random() * 50),
        isLiked: Math.random() > 0.7,
      })),
    ],
    relatedPosts: sampleRelatedPosts,
  },
};

export const NoComments: Story = {
  args: {
    post: {
      ...samplePost,
      title: "Getting Started: Your First Building in Public Project",
      stats: {
        views: 1200,
        likes: 34,
        comments: 0,
        shares: 8,
      },
    },
    comments: [],
    relatedPosts: sampleRelatedPosts,
  },
};

export const GuestAuthor: Story = {
  args: {
    post: {
      ...samplePost,
      title: "Guest Post: Building Developer Communities",
      author: {
        id: "guest-author",
        name: "Maria Rodriguez",
        avatar: "https://via.placeholder.com/64x64",
        bio: "Community manager and developer advocate with 8 years of experience building and nurturing developer communities.",
        role: "Guest Author",
        social: {
          twitter: "https://twitter.com/mariarodriguez",
          linkedin: "https://linkedin.com/in/mariarodriguez",
        },
      },
    },
    comments: sampleComments,
    relatedPosts: sampleRelatedPosts,
  },
};