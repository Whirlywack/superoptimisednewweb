import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import { 
  User, 
  Settings, 
  Bell, 
  Star, 
  Eye, 
  Heart, 
  Bookmark, 
  Download, 
  Upload, 
  Share, 
  Edit, 
  Trash2, 
  Plus, 
  Calendar, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Users, 
  FileText, 
  Image, 
  Video, 
  Code, 
  MessageCircle, 
  Mail, 
  Shield, 
  Key, 
  CreditCard, 
  Globe, 
  Github, 
  Twitter, 
  Linkedin, 
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  Grid,
  List,
  MoreHorizontal,
  Award,
  Target,
  Zap,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate: string;
  lastActive: string;
  isVerified?: boolean;
  role?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

interface DashboardStats {
  totalViews: number;
  totalLikes: number;
  totalBookmarks: number;
  totalDownloads: number;
  followerCount: number;
  followingCount: number;
  contentCount: number;
  achievementCount: number;
}

interface ContentItem {
  id: string;
  title: string;
  type: "post" | "project" | "video" | "document" | "image";
  status: "published" | "draft" | "private" | "scheduled";
  publishDate: string;
  lastModified: string;
  views: number;
  likes: number;
  comments: number;
  downloads?: number;
  thumbnail?: string;
  url: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  unlockedDate: string;
  category: "content" | "engagement" | "milestone" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface Activity {
  id: string;
  type: "like" | "comment" | "bookmark" | "follow" | "publish" | "achievement";
  title: string;
  description: string;
  date: string;
  relatedItem?: {
    title: string;
    url: string;
  };
  user?: {
    name: string;
    avatar?: string;
  };
}

interface UserDashboardProps extends React.HTMLAttributes<HTMLElement> {
  user: UserProfile;
  stats: DashboardStats;
  recentContent?: ContentItem[];
  achievements?: Achievement[];
  recentActivity?: Activity[];
  showProfile?: boolean;
  showStats?: boolean;
  showContent?: boolean;
  showAchievements?: boolean;
  showActivity?: boolean;
  showQuickActions?: boolean;
  contentViewMode?: "grid" | "list";
  onEditProfile?: () => void;
  onCreateContent?: (type: string) => void;
  onContentAction?: (action: string, item: ContentItem) => void;
  onFollowUser?: (userId: string) => void;
  onViewAll?: (section: string) => void;
  className?: string;
}

export function UserDashboard({
  user,
  stats,
  recentContent = [],
  achievements = [],
  recentActivity = [],
  showProfile = true,
  showStats = true,
  showContent = true,
  showAchievements = true,
  showActivity = true,
  showQuickActions = true,
  contentViewMode = "grid",
  onEditProfile,
  onCreateContent,
  onContentAction,
  onFollowUser,
  onViewAll,
  className,
  ...props
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentContentView, setCurrentContentView] = useState(contentViewMode);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "post":
        return FileText;
      case "project":
        return Code;
      case "video":
        return Video;
      case "document":
        return FileText;
      case "image":
        return Image;
      default:
        return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "draft":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      case "private":
        return "text-primary bg-primary/10";
      case "scheduled":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
      default:
        return "text-warm-gray bg-light-gray dark:bg-warm-gray/20";
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-300 dark:border-gray-600";
      case "rare":
        return "border-blue-400 dark:border-blue-500";
      case "epic":
        return "border-purple-400 dark:border-purple-500";
      case "legendary":
        return "border-yellow-400 dark:border-yellow-500";
      default:
        return "border-light-gray dark:border-warm-gray/30";
    }
  };

  const renderProfileSection = () => (
    <div className="rounded-lg border border-light-gray bg-off-white p-6 dark:border-warm-gray/30 dark:bg-off-black">
      <div className="flex items-start gap-6">
        <div className="relative shrink-0">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="size-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-20 items-center justify-center rounded-full bg-light-gray dark:bg-warm-gray/20">
              <LucideIcon icon={User} size="xl" className="text-warm-gray" />
            </div>
          )}
          {user.isVerified && (
            <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary">
              <LucideIcon icon={CheckCircle} size="xs" className="text-off-white" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-off-black dark:text-off-white">
                {user.name}
              </h1>
              {user.role && (
                <p className="text-sm font-medium text-primary">{user.role}</p>
              )}
              <p className="text-warm-gray">{user.email}</p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onEditProfile}
              className="shrink-0"
            >
              <LucideIcon icon={Edit} size="xs" className="mr-2" />
              Edit Profile
            </Button>
          </div>

          {user.bio && (
            <p className="leading-relaxed text-warm-gray">{user.bio}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-warm-gray">
            {user.location && (
              <div className="flex items-center gap-1">
                <LucideIcon icon={Globe} size="xs" />
                <span>{user.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <LucideIcon icon={Calendar} size="xs" />
              <span>Joined {formatDate(user.joinDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <LucideIcon icon={Clock} size="xs" />
              <span>Active {formatRelativeTime(user.lastActive)}</span>
            </div>
          </div>

          {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
            <div className="flex items-center gap-3">
              {user.socialLinks.github && (
                <Link href={user.socialLinks.github} external className="text-warm-gray hover:text-primary">
                  <LucideIcon icon={Github} size="sm" />
                </Link>
              )}
              {user.socialLinks.twitter && (
                <Link href={user.socialLinks.twitter} external className="text-warm-gray hover:text-primary">
                  <LucideIcon icon={Twitter} size="sm" />
                </Link>
              )}
              {user.socialLinks.linkedin && (
                <Link href={user.socialLinks.linkedin} external className="text-warm-gray hover:text-primary">
                  <LucideIcon icon={Linkedin} size="sm" />
                </Link>
              )}
              {user.website && (
                <Link href={user.website} external className="text-warm-gray hover:text-primary">
                  <LucideIcon icon={ExternalLink} size="sm" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStatsSection = () => (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[
        { icon: Eye, label: "Total Views", value: stats.totalViews.toLocaleString() },
        { icon: Heart, label: "Total Likes", value: stats.totalLikes.toLocaleString() },
        { icon: Users, label: "Followers", value: stats.followerCount.toLocaleString() },
        { icon: FileText, label: "Content", value: stats.contentCount.toLocaleString() },
      ].map((stat, index) => (
        <div
          key={index}
          className="rounded-lg border border-light-gray bg-off-white p-4 dark:border-warm-gray/30 dark:bg-off-black"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-off-black dark:text-off-white">
                {stat.value}
              </p>
              <p className="text-sm text-warm-gray">{stat.label}</p>
            </div>
            <LucideIcon icon={stat.icon} size="lg" className="text-primary" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderQuickActions = () => (
    <div className="rounded-lg border border-light-gray bg-off-white p-6 dark:border-warm-gray/30 dark:bg-off-black">
      <h2 className="mb-4 text-lg font-semibold text-off-black dark:text-off-white">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { icon: Plus, label: "New Post", action: () => onCreateContent?.("post") },
          { icon: Code, label: "New Project", action: () => onCreateContent?.("project") },
          { icon: Upload, label: "Upload Media", action: () => onCreateContent?.("media") },
          { icon: Settings, label: "Settings", action: () => onViewAll?.("settings") },
        ].map((action, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={action.action}
            className="flex h-auto flex-col items-center gap-2 py-3"
          >
            <LucideIcon icon={action.icon} size="lg" />
            <span className="text-xs">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );

  const renderContentSection = () => (
    <div className="rounded-lg border border-light-gray bg-off-white p-6 dark:border-warm-gray/30 dark:bg-off-black">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-off-black dark:text-off-white">
          Recent Content
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant={currentContentView === "grid" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setCurrentContentView("grid")}
          >
            <LucideIcon icon={Grid} size="xs" />
          </Button>
          <Button
            variant={currentContentView === "list" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setCurrentContentView("list")}
          >
            <LucideIcon icon={List} size="xs" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewAll?.("content")}
          >
            View All
          </Button>
        </div>
      </div>

      {recentContent.length > 0 ? (
        <div className={cn(
          "gap-4",
          currentContentView === "grid" ? "grid grid-cols-1 lg:grid-cols-2" : "space-y-3"
        )}>
          {recentContent.map((item) => {
            const ContentIcon = getContentIcon(item.type);
            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-lg border border-light-gray p-4 transition-colors hover:border-primary/50 dark:border-warm-gray/30",
                  currentContentView === "list" && "flex items-center gap-4"
                )}
              >
                {item.thumbnail && currentContentView === "grid" && (
                  <div className="mb-3 h-32 w-full overflow-hidden rounded-lg bg-light-gray dark:bg-warm-gray/20">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="size-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <LucideIcon icon={ContentIcon} size="xs" className="text-warm-gray" />
                        <span className={cn(
                          "rounded px-2 py-1 text-xs capitalize",
                          getStatusColor(item.status)
                        )}>
                          {item.status}
                        </span>
                      </div>
                      <h3 className="font-medium leading-snug text-off-black dark:text-off-white">
                        {item.title}
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="size-8 shrink-0 p-1"
                    >
                      <LucideIcon icon={MoreHorizontal} size="xs" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-warm-gray">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <LucideIcon icon={Eye} size="xs" />
                        <span>{item.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <LucideIcon icon={Heart} size="xs" />
                        <span>{item.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <LucideIcon icon={MessageCircle} size="xs" />
                        <span>{item.comments}</span>
                      </div>
                    </div>
                    <span>{formatRelativeTime(item.lastModified)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center text-warm-gray">
          <LucideIcon icon={FileText} size="xl" className="mx-auto mb-4 opacity-50" />
          <p>No content yet. Create your first post!</p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onCreateContent?.("post")}
            className="mt-3"
          >
            <LucideIcon icon={Plus} size="xs" className="mr-2" />
            Create Content
          </Button>
        </div>
      )}
    </div>
  );

  const renderAchievementsSection = () => (
    <div className="rounded-lg border border-light-gray bg-off-white p-6 dark:border-warm-gray/30 dark:bg-off-black">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-off-black dark:text-off-white">
          Recent Achievements
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewAll?.("achievements")}
        >
          View All
        </Button>
      </div>

      {achievements.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {achievements.slice(0, 4).map((achievement) => (
            <div
              key={achievement.id}
              className={cn(
                "rounded-lg border-2 p-4",
                getRarityColor(achievement.rarity)
              )}
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-lg bg-primary/10 p-2">
                  <LucideIcon icon={achievement.icon} size="lg" className="text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium text-off-black dark:text-off-white">
                    {achievement.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-warm-gray">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-warm-gray">
                    Unlocked {formatRelativeTime(achievement.unlockedDate)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-warm-gray">
          <LucideIcon icon={Award} size="xl" className="mx-auto mb-4 opacity-50" />
          <p>No achievements yet. Keep creating to unlock rewards!</p>
        </div>
      )}
    </div>
  );

  const renderActivitySection = () => (
    <div className="rounded-lg border border-light-gray bg-off-white p-6 dark:border-warm-gray/30 dark:bg-off-black">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-off-black dark:text-off-white">
          Recent Activity
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewAll?.("activity")}
        >
          View All
        </Button>
      </div>

      {recentActivity.length > 0 ? (
        <div className="space-y-4">
          {recentActivity.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <LucideIcon 
                  icon={activity.type === "like" ? Heart : 
                        activity.type === "comment" ? MessageCircle :
                        activity.type === "bookmark" ? Bookmark :
                        activity.type === "follow" ? Users :
                        activity.type === "publish" ? FileText : Award} 
                  size="xs" 
                  className="text-primary" 
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm text-off-black dark:text-off-white">
                  {activity.title}
                </p>
                <p className="text-xs text-warm-gray">
                  {activity.description}
                </p>
                <p className="text-xs text-warm-gray">
                  {formatRelativeTime(activity.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-warm-gray">
          <LucideIcon icon={Activity} size="xl" className="mx-auto mb-4 opacity-50" />
          <p>No recent activity to show.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("min-h-screen bg-light-gray/30 py-8 dark:bg-warm-gray/5", className)} {...props}>
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Profile Section */}
        {showProfile && renderProfileSection()}

        {/* Stats Section */}
        {showStats && renderStatsSection()}

        {/* Quick Actions */}
        {showQuickActions && renderQuickActions()}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-2">
            {showContent && renderContentSection()}
            {showAchievements && renderAchievementsSection()}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {showActivity && renderActivitySection()}
          </div>
        </div>
      </div>
    </div>
  );
}