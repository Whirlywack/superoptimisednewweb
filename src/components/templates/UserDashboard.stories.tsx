import type { Meta, StoryObj } from "@storybook/react";
import { UserDashboard } from "./UserDashboard";
import { fn } from "@storybook/test";
import { 
  Star, 
  Award, 
  Trophy, 
  Target, 
  Zap, 
  Users, 
  Heart, 
  CheckCircle, 
  TrendingUp,
  BookOpen,
  Code,
  Lightbulb,
  Rocket,
  Shield,
  Crown,
  Gift,
  Flame,
  ThumbsUp
} from "lucide-react";

const meta = {
  title: "Templates/UserDashboard",
  component: UserDashboard,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "User dashboard template for displaying user profile, statistics, content, achievements, and activity. Features customizable sections and content management capabilities.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    user: {
      control: "object",
      description: "User profile information",
    },
    stats: {
      control: "object",
      description: "User statistics and metrics",
    },
    recentContent: {
      control: "object",
      description: "Array of recent user content",
    },
    achievements: {
      control: "object",
      description: "Array of user achievements",
    },
    recentActivity: {
      control: "object",
      description: "Array of recent user activity",
    },
    showProfile: {
      control: "boolean",
      description: "Show profile section",
    },
    showStats: {
      control: "boolean",
      description: "Show statistics section",
    },
    showContent: {
      control: "boolean",
      description: "Show content section",
    },
    showAchievements: {
      control: "boolean",
      description: "Show achievements section",
    },
    showActivity: {
      control: "boolean",
      description: "Show activity section",
    },
    showQuickActions: {
      control: "boolean",
      description: "Show quick actions section",
    },
    contentViewMode: {
      control: "select",
      options: ["grid", "list"],
      description: "Content display mode",
    },
    onEditProfile: {
      action: "edit-profile-clicked",
      description: "Edit profile handler",
    },
    onCreateContent: {
      action: "create-content-clicked",
      description: "Create content handler",
    },
    onContentAction: {
      action: "content-action-clicked",
      description: "Content action handler",
    },
    onFollowUser: {
      action: "follow-user-clicked",
      description: "Follow user handler",
    },
    onViewAll: {
      action: "view-all-clicked",
      description: "View all handler",
    },
  },
  args: {
    onEditProfile: fn(),
    onCreateContent: fn(),
    onContentAction: fn(),
    onFollowUser: fn(),
    onViewAll: fn(),
  },
} satisfies Meta<typeof UserDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleUser = {
  id: "user_123",
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  avatar: "https://via.placeholder.com/80x80",
  bio: "Full-stack developer passionate about React, TypeScript, and building great user experiences. Open source contributor and tech blogger.",
  location: "San Francisco, CA",
  website: "https://sarahjohnson.dev",
  joinDate: "2022-03-15",
  lastActive: "2024-01-14",
  isVerified: true,
  role: "Senior Developer",
  socialLinks: {
    github: "https://github.com/sarahjohnson",
    twitter: "https://twitter.com/sarahjohnson",
    linkedin: "https://linkedin.com/in/sarahjohnson",
  },
};

const sampleStats = {
  totalViews: 45230,
  totalLikes: 1890,
  totalBookmarks: 567,
  totalDownloads: 2340,
  followerCount: 1250,
  followingCount: 340,
  contentCount: 89,
  achievementCount: 23,
};

const sampleContent = [
  {
    id: "content_1",
    title: "Building Accessible React Components",
    type: "post" as const,
    status: "published" as const,
    publishDate: "2024-01-10",
    lastModified: "2024-01-10",
    views: 2340,
    likes: 89,
    comments: 23,
    thumbnail: "https://via.placeholder.com/300x200",
    url: "/blog/accessible-react-components",
  },
  {
    id: "content_2",
    title: "E-commerce Platform",
    type: "project" as const,
    status: "published" as const,
    publishDate: "2024-01-08",
    lastModified: "2024-01-12",
    views: 1890,
    likes: 67,
    comments: 15,
    downloads: 234,
    thumbnail: "https://via.placeholder.com/300x200",
    url: "/projects/ecommerce-platform",
  },
  {
    id: "content_3",
    title: "React Hooks Deep Dive",
    type: "video" as const,
    status: "published" as const,
    publishDate: "2024-01-05",
    lastModified: "2024-01-05",
    views: 5670,
    likes: 234,
    comments: 67,
    thumbnail: "https://via.placeholder.com/300x200",
    url: "/videos/react-hooks-deep-dive",
  },
  {
    id: "content_4",
    title: "TypeScript Best Practices Guide",
    type: "document" as const,
    status: "draft" as const,
    publishDate: "2024-01-15",
    lastModified: "2024-01-14",
    views: 0,
    likes: 0,
    comments: 0,
    url: "/docs/typescript-best-practices",
  },
  {
    id: "content_5",
    title: "Component Library Showcase",
    type: "image" as const,
    status: "scheduled" as const,
    publishDate: "2024-01-20",
    lastModified: "2024-01-13",
    views: 0,
    likes: 0,
    comments: 0,
    thumbnail: "https://via.placeholder.com/300x200",
    url: "/gallery/component-library-showcase",
  },
];

const sampleAchievements = [
  {
    id: "achievement_1",
    title: "First Post",
    description: "Published your first blog post",
    icon: Star,
    unlockedDate: "2022-03-20",
    category: "content" as const,
    rarity: "common" as const,
  },
  {
    id: "achievement_2",
    title: "Popular Creator",
    description: "Reached 1000 total likes across all content",
    icon: Heart,
    unlockedDate: "2023-08-15",
    category: "engagement" as const,
    rarity: "rare" as const,
  },
  {
    id: "achievement_3",
    title: "Viral Content",
    description: "One of your posts reached 10,000 views",
    icon: TrendingUp,
    unlockedDate: "2023-11-22",
    category: "milestone" as const,
    rarity: "epic" as const,
  },
  {
    id: "achievement_4",
    title: "Open Source Hero",
    description: "Contributed to 50+ open source projects",
    icon: Code,
    unlockedDate: "2024-01-01",
    category: "special" as const,
    rarity: "legendary" as const,
  },
  {
    id: "achievement_5",
    title: "Community Builder",
    description: "Helped 100+ developers in the community",
    icon: Users,
    unlockedDate: "2023-12-10",
    category: "engagement" as const,
    rarity: "epic" as const,
  },
  {
    id: "achievement_6",
    title: "Knowledge Sharer",
    description: "Published 50 educational posts",
    icon: BookOpen,
    unlockedDate: "2023-09-05",
    category: "content" as const,
    rarity: "rare" as const,
  },
];

const sampleActivity = [
  {
    id: "activity_1",
    type: "like" as const,
    title: "Alex Rivera liked your post",
    description: "Building Accessible React Components",
    date: "2024-01-14",
    relatedItem: {
      title: "Building Accessible React Components",
      url: "/blog/accessible-react-components",
    },
    user: {
      name: "Alex Rivera",
      avatar: "https://via.placeholder.com/32x32",
    },
  },
  {
    id: "activity_2",
    type: "comment" as const,
    title: "New comment on your project",
    description: "Emma Thompson commented on E-commerce Platform",
    date: "2024-01-13",
    relatedItem: {
      title: "E-commerce Platform",
      url: "/projects/ecommerce-platform",
    },
    user: {
      name: "Emma Thompson",
      avatar: "https://via.placeholder.com/32x32",
    },
  },
  {
    id: "activity_3",
    type: "follow" as const,
    title: "New follower",
    description: "Mike Chen started following you",
    date: "2024-01-12",
    user: {
      name: "Mike Chen",
      avatar: "https://via.placeholder.com/32x32",
    },
  },
  {
    id: "activity_4",
    type: "publish" as const,
    title: "Content published",
    description: "React Hooks Deep Dive video is now live",
    date: "2024-01-05",
    relatedItem: {
      title: "React Hooks Deep Dive",
      url: "/videos/react-hooks-deep-dive",
    },
  },
  {
    id: "activity_5",
    type: "achievement" as const,
    title: "Achievement unlocked",
    description: "You earned the 'Viral Content' achievement",
    date: "2023-11-22",
  },
  {
    id: "activity_6",
    type: "bookmark" as const,
    title: "Content bookmarked",
    description: "Jordan Kim bookmarked your TypeScript guide",
    date: "2024-01-11",
    user: {
      name: "Jordan Kim",
      avatar: "https://via.placeholder.com/32x32",
    },
  },
];

export const Default: Story = {
  args: {
    user: sampleUser,
    stats: sampleStats,
    recentContent: sampleContent,
    achievements: sampleAchievements,
    recentActivity: sampleActivity,
  },
};

export const NewUser: Story = {
  args: {
    user: {
      ...sampleUser,
      name: "Alex Chen",
      email: "alex.chen@example.com",
      avatar: undefined,
      bio: "New to the platform, excited to start sharing my development journey!",
      isVerified: false,
      role: "Junior Developer",
      joinDate: "2024-01-10",
      lastActive: "2024-01-14",
      socialLinks: {
        github: "https://github.com/alexchen",
      },
    },
    stats: {
      totalViews: 124,
      totalLikes: 12,
      totalBookmarks: 3,
      totalDownloads: 0,
      followerCount: 5,
      followingCount: 25,
      contentCount: 2,
      achievementCount: 1,
    },
    recentContent: sampleContent.slice(0, 2),
    achievements: sampleAchievements.slice(0, 1),
    recentActivity: sampleActivity.slice(0, 3),
  },
};

export const PowerUser: Story = {
  args: {
    user: {
      ...sampleUser,
      name: "Dr. Maria Rodriguez",
      email: "maria.rodriguez@university.edu",
      bio: "Computer Science professor, researcher, and tech evangelist. Author of 3 programming books and 200+ technical articles. Conference speaker and open source maintainer.",
      role: "Professor & Researcher",
      isVerified: true,
    },
    stats: {
      totalViews: 890234,
      totalLikes: 45670,
      totalBookmarks: 12340,
      totalDownloads: 67890,
      followerCount: 25600,
      followingCount: 890,
      contentCount: 456,
      achievementCount: 89,
    },
    recentContent: sampleContent,
    achievements: sampleAchievements,
    recentActivity: sampleActivity,
  },
};

export const CreatorFocus: Story = {
  args: {
    user: {
      ...sampleUser,
      name: "Taylor Swift",
      role: "Content Creator",
      bio: "Full-time content creator focusing on web development tutorials, live coding, and developer productivity tips.",
    },
    stats: {
      ...sampleStats,
      totalViews: 234567,
      followerCount: 15600,
      contentCount: 234,
    },
    recentContent: sampleContent.map(content => ({
      ...content,
      type: content.id === "content_1" ? "video" as const : content.type,
      views: content.views * 3,
    })),
    achievements: sampleAchievements.filter(a => a.category === "content" || a.category === "engagement"),
    recentActivity: sampleActivity.filter(a => a.type === "like" || a.type === "comment" || a.type === "follow"),
  },
};

export const DeveloperPortfolio: Story = {
  args: {
    user: {
      ...sampleUser,
      name: "Jamie Liu",
      role: "Full Stack Engineer",
      bio: "Passionate about building scalable web applications with modern technologies. Currently working at a fast-growing startup.",
    },
    stats: sampleStats,
    recentContent: sampleContent.filter(c => c.type === "project" || c.type === "post"),
    achievements: sampleAchievements.filter(a => a.category === "content" || a.category === "special"),
    recentActivity: sampleActivity,
    showAchievements: false,
  },
};

export const MinimalDashboard: Story = {
  args: {
    user: {
      id: "user_minimal",
      name: "Sam Parker",
      email: "sam.parker@example.com",
      joinDate: "2024-01-01",
      lastActive: "2024-01-14",
      bio: "Learning to code and sharing my journey.",
    },
    stats: {
      totalViews: 89,
      totalLikes: 5,
      totalBookmarks: 2,
      totalDownloads: 0,
      followerCount: 3,
      followingCount: 15,
      contentCount: 1,
      achievementCount: 1,
    },
    recentContent: [sampleContent[0]],
    achievements: [sampleAchievements[0]],
    recentActivity: sampleActivity.slice(0, 2),
    showQuickActions: false,
  },
};

export const GridContentView: Story = {
  args: {
    user: sampleUser,
    stats: sampleStats,
    recentContent: sampleContent,
    achievements: sampleAchievements,
    recentActivity: sampleActivity,
    contentViewMode: "grid",
  },
};

export const ListContentView: Story = {
  args: {
    user: sampleUser,
    stats: sampleStats,
    recentContent: sampleContent,
    achievements: sampleAchievements,
    recentActivity: sampleActivity,
    contentViewMode: "list",
  },
};

export const NoContent: Story = {
  args: {
    user: {
      ...sampleUser,
      name: "New Creator",
      bio: "Just getting started on my content creation journey!",
    },
    stats: {
      totalViews: 0,
      totalLikes: 0,
      totalBookmarks: 0,
      totalDownloads: 0,
      followerCount: 0,
      followingCount: 5,
      contentCount: 0,
      achievementCount: 0,
    },
    recentContent: [],
    achievements: [],
    recentActivity: [],
  },
};

export const AchievementFocus: Story = {
  args: {
    user: {
      ...sampleUser,
      name: "Achievement Hunter",
      role: "Community Champion",
    },
    stats: {
      ...sampleStats,
      achievementCount: 156,
    },
    recentContent: sampleContent.slice(0, 3),
    achievements: [
      ...sampleAchievements,
      {
        id: "achievement_new_1",
        title: "Master Educator",
        description: "Created 100+ educational resources",
        icon: Award,
        unlockedDate: "2024-01-10",
        category: "content" as const,
        rarity: "legendary" as const,
      },
      {
        id: "achievement_new_2",
        title: "Inspiration Source",
        description: "Your content inspired 1000+ developers",
        icon: Lightbulb,
        unlockedDate: "2024-01-05",
        category: "milestone" as const,
        rarity: "epic" as const,
      },
    ],
    recentActivity: sampleActivity.filter(a => a.type === "achievement"),
  },
};

export const InfluencerDashboard: Story = {
  args: {
    user: {
      ...sampleUser,
      name: "Tech Influencer",
      role: "Developer Advocate",
      bio: "Helping developers build better software. Conference speaker, book author, and community builder. Follow for daily dev tips!",
      isVerified: true,
    },
    stats: {
      totalViews: 1234567,
      totalLikes: 89012,
      totalBookmarks: 23456,
      totalDownloads: 45678,
      followerCount: 125000,
      followingCount: 2500,
      contentCount: 890,
      achievementCount: 234,
    },
    recentContent: sampleContent.map(content => ({
      ...content,
      views: content.views * 10,
      likes: content.likes * 5,
      comments: content.comments * 3,
    })),
    achievements: sampleAchievements.map(achievement => ({
      ...achievement,
      rarity: achievement.rarity === "common" ? "rare" as const : 
              achievement.rarity === "rare" ? "epic" as const : 
              "legendary" as const,
    })),
    recentActivity: sampleActivity,
  },
};

export const StudentDashboard: Story = {
  args: {
    user: {
      ...sampleUser,
      name: "Computer Science Student",
      email: "student@university.edu",
      role: "CS Student",
      bio: "Computer Science major passionate about learning new technologies and building cool projects. Always eager to contribute to open source!",
      isVerified: false,
    },
    stats: {
      totalViews: 1250,
      totalLikes: 89,
      totalBookmarks: 156,
      totalDownloads: 23,
      followerCount: 67,
      followingCount: 234,
      contentCount: 12,
      achievementCount: 8,
    },
    recentContent: sampleContent.slice(0, 3),
    achievements: sampleAchievements.filter(a => a.category === "content" || a.rarity === "common"),
    recentActivity: sampleActivity.slice(0, 4),
  },
};

export const CompanyDashboard: Story = {
  args: {
    user: {
      ...sampleUser,
      name: "TechCorp Engineering",
      email: "engineering@techcorp.com",
      role: "Company Account",
      bio: "Official account for TechCorp's engineering team. Sharing insights, tutorials, and open source projects from our talented developers.",
      isVerified: true,
      location: "Multiple Locations",
    },
    stats: {
      totalViews: 567890,
      totalLikes: 12345,
      totalBookmarks: 5678,
      totalDownloads: 23456,
      followerCount: 45000,
      followingCount: 1200,
      contentCount: 234,
      achievementCount: 45,
    },
    recentContent: sampleContent.map(content => ({
      ...content,
      type: content.type === "post" ? "document" as const : content.type,
    })),
    achievements: sampleAchievements.filter(a => a.category !== "engagement"),
    recentActivity: sampleActivity,
  },
};

export const FreelancerDashboard: Story = {
  args: {
    user: {
      ...sampleUser,
      name: "Independent Developer",
      role: "Freelance Developer",
      bio: "Freelance full-stack developer specializing in React and Node.js. Available for hire! Check out my portfolio and client testimonials.",
      website: "https://freelancer-portfolio.com",
    },
    stats: {
      totalViews: 34567,
      totalLikes: 1234,
      totalBookmarks: 567,
      totalDownloads: 890,
      followerCount: 2345,
      followingCount: 456,
      contentCount: 67,
      achievementCount: 19,
    },
    recentContent: sampleContent.filter(c => c.type === "project"),
    achievements: sampleAchievements,
    recentActivity: sampleActivity.filter(a => a.type !== "follow"),
  },
};