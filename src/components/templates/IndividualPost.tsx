import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import { 
  Calendar, 
  Clock, 
  User,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  Tag,
  ArrowLeft,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Reply,
  Send,
  MoreVertical,
  Flag,
  Edit,
  Trash2,
  Github,
  Twitter,
  Linkedin,
  Copy,
  CheckCircle,
  TrendingUp,
  Eye
} from "lucide-react";

interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  role?: string;
  social?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

interface Comment {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  replies?: Comment[];
  isLiked?: boolean;
  isAuthor?: boolean;
}

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  readTime: string;
  author: Author;
  tags: string[];
  stats: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  isLiked?: boolean;
  isBookmarked?: boolean;
  category?: string;
  series?: {
    title: string;
    part: number;
    total: number;
  };
}

interface RelatedPost {
  id: string;
  title: string;
  excerpt: string;
  href: string;
  readTime: string;
  publishedAt: string;
}

interface IndividualPostProps extends React.HTMLAttributes<HTMLElement> {
  post: Post;
  comments?: Comment[];
  relatedPosts?: RelatedPost[];
  previousPost?: { title: string; href: string };
  nextPost?: { title: string; href: string };
  showComments?: boolean;
  showRelated?: boolean;
  showNavigation?: boolean;
  showAuthorCard?: boolean;
  showStats?: boolean;
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onShare?: (platform: string) => void;
  onCommentSubmit?: (content: string, parentId?: string) => void;
  onCommentLike?: (commentId: string) => void;
  className?: string;
}

export function IndividualPost({
  post,
  comments = [],
  relatedPosts = [],
  previousPost,
  nextPost,
  showComments = true,
  showRelated = true,
  showNavigation = true,
  showAuthorCard = true,
  showStats = true,
  onLike,
  onBookmark,
  onShare,
  onCommentSubmit,
  onCommentLike,
  className,
  ...props
}: IndividualPostProps) {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const text = `${post.title} by ${post.author.name}`;
    
    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    }
    
    if (onShare && platform) {
      onShare(platform);
    }
    setShowShareMenu(false);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && onCommentSubmit) {
      onCommentSubmit(newComment.trim(), replyTo || undefined);
      setNewComment("");
      setReplyTo(null);
    }
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div
      key={comment.id}
      className={cn(
        "space-y-3",
        isReply && "ml-8 pl-4 border-l-2 border-light-gray dark:border-warm-gray/30"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {comment.author.avatar ? (
          <img
            src={comment.author.avatar}
            alt={comment.author.name}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-light-gray dark:bg-warm-gray/20 flex items-center justify-center flex-shrink-0">
            <LucideIcon icon={User} size="xs" className="text-warm-gray" />
          </div>
        )}

        <div className="flex-1 space-y-2">
          {/* Comment Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-off-black dark:text-off-white">
              {comment.author.name}
            </span>
            {comment.author.role && (
              <span className="text-xs text-warm-gray bg-light-gray dark:bg-warm-gray/20 px-2 py-0.5 rounded">
                {comment.author.role}
              </span>
            )}
            <span className="text-sm text-warm-gray">
              {formatRelativeTime(comment.createdAt)}
            </span>
            {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
              <span className="text-xs text-warm-gray">(edited)</span>
            )}
          </div>

          {/* Comment Content */}
          <div className="text-warm-gray leading-relaxed">
            {comment.content}
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={() => onCommentLike?.(comment.id)}
              className={cn(
                "flex items-center gap-1 text-warm-gray hover:text-primary transition-colors",
                comment.isLiked && "text-red-500"
              )}
            >
              <LucideIcon icon={Heart} size="xs" />
              <span>{comment.likes}</span>
            </button>
            
            <button
              onClick={() => setReplyTo(comment.id)}
              className="flex items-center gap-1 text-warm-gray hover:text-primary transition-colors"
            >
              <LucideIcon icon={Reply} size="xs" />
              <span>Reply</span>
            </button>

            {comment.isAuthor && (
              <div className="flex items-center gap-2">
                <button className="text-warm-gray hover:text-primary transition-colors">
                  <LucideIcon icon={Edit} size="xs" />
                </button>
                <button className="text-warm-gray hover:text-red-500 transition-colors">
                  <LucideIcon icon={Trash2} size="xs" />
                </button>
              </div>
            )}

            <button className="text-warm-gray hover:text-primary transition-colors ml-auto">
              <LucideIcon icon={MoreVertical} size="xs" />
            </button>
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("min-h-screen bg-off-white dark:bg-off-black", className)} {...props}>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Post Header */}
        <header className="space-y-6 mb-8">
          {/* Series Info */}
          {post.series && (
            <div className="bg-light-gray/50 dark:bg-warm-gray/10 px-4 py-3 rounded-lg">
              <div className="text-sm text-warm-gray">
                Part {post.series.part} of {post.series.total} in the series:
              </div>
              <div className="font-medium text-off-black dark:text-off-white">
                {post.series.title}
              </div>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-off-black dark:text-off-white leading-tight">
            {post.title}
          </h1>

          {/* Post Meta */}
          <div className="flex items-center gap-4 flex-wrap text-sm text-warm-gray">
            <div className="flex items-center gap-1">
              <LucideIcon icon={Calendar} size="xs" />
              <time>{formatDate(post.publishedAt)}</time>
            </div>
            
            <div className="flex items-center gap-1">
              <LucideIcon icon={Clock} size="xs" />
              <span>{post.readTime}</span>
            </div>

            {post.category && (
              <div className="flex items-center gap-1">
                <LucideIcon icon={Tag} size="xs" />
                <span>{post.category}</span>
              </div>
            )}

            {showStats && (
              <>
                <div className="flex items-center gap-1">
                  <LucideIcon icon={Eye} size="xs" />
                  <span>{post.stats.views.toLocaleString()} views</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <LucideIcon icon={Heart} size="xs" />
                  <span>{post.stats.likes} likes</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <LucideIcon icon={MessageCircle} size="xs" />
                  <span>{post.stats.comments} comments</span>
                </div>
              </>
            )}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-light-gray dark:bg-warm-gray/20 text-warm-gray px-2 py-1 rounded text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-light-gray dark:border-warm-gray/30">
            <Button
              variant={post.isLiked ? "primary" : "outline"}
              size="sm"
              onClick={() => onLike?.(post.id)}
              className="flex items-center gap-2"
            >
              <LucideIcon icon={Heart} size="xs" />
              <span>{post.stats.likes}</span>
            </Button>

            <Button
              variant={post.isBookmarked ? "primary" : "outline"}
              size="sm"
              onClick={() => onBookmark?.(post.id)}
            >
              <LucideIcon icon={Bookmark} size="xs" />
            </Button>

            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareMenu(!showShareMenu)}
              >
                <LucideIcon icon={Share} size="xs" />
              </Button>

              {showShareMenu && (
                <div className="absolute top-full left-0 mt-2 bg-off-white dark:bg-off-black border border-light-gray dark:border-warm-gray/30 rounded-lg shadow-lg z-10 min-w-[160px]">
                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-full px-4 py-2 text-left text-sm text-off-black dark:text-off-white hover:bg-light-gray dark:hover:bg-warm-gray/10 flex items-center gap-2"
                  >
                    <LucideIcon icon={Twitter} size="xs" />
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="w-full px-4 py-2 text-left text-sm text-off-black dark:text-off-white hover:bg-light-gray dark:hover:bg-warm-gray/10 flex items-center gap-2"
                  >
                    <LucideIcon icon={Linkedin} size="xs" />
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare("copy")}
                    className="w-full px-4 py-2 text-left text-sm text-off-black dark:text-off-white hover:bg-light-gray dark:hover:bg-warm-gray/10 flex items-center gap-2"
                  >
                    <LucideIcon icon={copied ? CheckCircle : Copy} size="xs" />
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Post Content */}
        <div className="prose max-w-none mb-12">
          <div 
            className="text-warm-gray leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Author Card */}
        {showAuthorCard && (
          <div className="bg-light-gray/50 dark:bg-warm-gray/10 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-light-gray dark:bg-warm-gray/20 flex items-center justify-center flex-shrink-0">
                  <LucideIcon icon={User} size="md" className="text-warm-gray" />
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-off-black dark:text-off-white">
                  {post.author.name}
                </h3>
                {post.author.role && (
                  <p className="text-sm text-primary font-medium">{post.author.role}</p>
                )}
                {post.author.bio && (
                  <p className="text-warm-gray">{post.author.bio}</p>
                )}
                {post.author.social && (
                  <div className="flex items-center gap-3">
                    {post.author.social.github && (
                      <Link href={post.author.social.github} external className="text-warm-gray hover:text-primary">
                        <LucideIcon icon={Github} size="sm" />
                      </Link>
                    )}
                    {post.author.social.twitter && (
                      <Link href={post.author.social.twitter} external className="text-warm-gray hover:text-primary">
                        <LucideIcon icon={Twitter} size="sm" />
                      </Link>
                    )}
                    {post.author.social.linkedin && (
                      <Link href={post.author.social.linkedin} external className="text-warm-gray hover:text-primary">
                        <LucideIcon icon={Linkedin} size="sm" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-8 mb-8">
            <h2 className="text-2xl font-bold text-off-black dark:text-off-white">
              Comments ({comments.length})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div>
                <label htmlFor="comment" className="sr-only">
                  Add a comment
                </label>
                <textarea
                  id="comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={replyTo ? "Write a reply..." : "Share your thoughts..."}
                  rows={4}
                  className={cn(
                    "w-full px-4 py-3 border border-light-gray dark:border-warm-gray/30 rounded-lg",
                    "bg-off-white dark:bg-off-black text-off-black dark:text-off-white",
                    "placeholder:text-warm-gray resize-y",
                    "focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  )}
                />
              </div>
              
              <div className="flex items-center justify-between">
                {replyTo && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyTo(null)}
                  >
                    Cancel Reply
                  </Button>
                )}
                
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!newComment.trim()}
                  className="ml-auto"
                >
                  <LucideIcon icon={Send} size="xs" className="mr-2" />
                  {replyTo ? "Reply" : "Comment"}
                </Button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map(comment => renderComment(comment))}
            </div>

            {comments.length === 0 && (
              <div className="text-center py-8 text-warm-gray">
                <LucideIcon icon={MessageCircle} size="lg" className="mx-auto mb-3 opacity-50" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        )}

        {/* Related Posts */}
        {showRelated && relatedPosts.length > 0 && (
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-off-black dark:text-off-white">
              Related Posts
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article
                  key={relatedPost.id}
                  className="bg-light-gray/50 dark:bg-warm-gray/10 rounded-lg p-6 space-y-3"
                >
                  <h3 className="font-semibold text-off-black dark:text-off-white leading-snug">
                    <Link href={relatedPost.href} className="hover:text-primary no-underline">
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <p className="text-warm-gray text-sm leading-relaxed">
                    {relatedPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-warm-gray">
                    <span>{formatDate(relatedPost.publishedAt)}</span>
                    <span>{relatedPost.readTime}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Post Navigation */}
        {showNavigation && (previousPost || nextPost) && (
          <nav className="flex items-center justify-between gap-4 pt-8 border-t border-light-gray dark:border-warm-gray/30">
            <div className="flex-1">
              {previousPost && (
                <Link href={previousPost.href} className="group flex items-center gap-2 text-warm-gray hover:text-primary no-underline">
                  <LucideIcon icon={ArrowLeft} size="sm" />
                  <div>
                    <div className="text-xs">Previous</div>
                    <div className="font-medium group-hover:underline">{previousPost.title}</div>
                  </div>
                </Link>
              )}
            </div>
            
            <div className="flex-1 text-right">
              {nextPost && (
                <Link href={nextPost.href} className="group flex items-center justify-end gap-2 text-warm-gray hover:text-primary no-underline">
                  <div>
                    <div className="text-xs">Next</div>
                    <div className="font-medium group-hover:underline">{nextPost.title}</div>
                  </div>
                  <LucideIcon icon={ArrowRight} size="sm" />
                </Link>
              )}
            </div>
          </nav>
        )}
      </article>
    </div>
  );
}