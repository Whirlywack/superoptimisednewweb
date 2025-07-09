import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import type {
  Zap} from "lucide-react";
import { 
  ArrowRight, 
  Star, 
  Users, 
  Heart,
  Github,
  ExternalLink,
  Quote,
  Calendar,
  TrendingUp,
  MessageCircle,
  Shield,
  Globe,
  Code,
  BookOpen,
  Play,
  CheckCircle,
  ChevronRight
} from "lucide-react";

interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  primaryCtaText: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  onPrimaryCtaClick?: () => void;
  onSecondaryCtaClick?: () => void;
  stats?: Array<{ value: string; label: string; }>;
}

interface FeatureProps {
  icon: typeof Zap;
  title: string;
  description: string;
  href?: string;
}

interface TestimonialProps {
  content: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  featured?: boolean;
}

interface PostProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  href: string;
  featured?: boolean;
}

interface ProjectProps {
  id: string;
  title: string;
  description: string;
  status: "planning" | "in-progress" | "completed" | "paused";
  progress?: number;
  technologies: string[];
  href: string;
  featured?: boolean;
}

interface HomepageProps extends React.HTMLAttributes<HTMLElement> {
  hero: HeroProps;
  features?: FeatureProps[];
  testimonials?: TestimonialProps[];
  recentPosts?: PostProps[];
  currentProjects?: ProjectProps[];
  showMission?: boolean;
  missionTitle?: string;
  missionContent?: string;
  showCommunity?: boolean;
  communityTitle?: string;
  communityDescription?: string;
  communityStats?: Array<{ value: string; label: string; }>;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  className?: string;
}

export function Homepage({
  hero,
  features = [],
  testimonials = [],
  recentPosts = [],
  currentProjects = [],
  showMission = true,
  missionTitle = "Our Mission",
  missionContent = "Building in public means sharing the complete journey - the successes, challenges, and everything in between. We believe transparency fosters better products, stronger communities, and meaningful connections.",
  showCommunity = true,
  communityTitle = "Join Our Community",
  communityDescription = "Connect with fellow builders, share your journey, and learn from others who are creating amazing things in public.",
  communityStats = [],
  ctaTitle = "Ready to Start Building?",
  ctaDescription = "Join thousands of developers who are building amazing products in public.",
  ctaText = "Get Started",
  ctaHref = "/get-started",
  onCtaClick,
  className,
  ...props
}: HomepageProps) {

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "in-progress":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
      case "planning":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      case "paused":
        return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
      default:
        return "text-warm-gray bg-light-gray dark:bg-warm-gray/20";
    }
  };

  const renderHeroSection = () => (
    <section className="bg-gradient-to-b from-off-white to-light-gray py-20 dark:from-off-black dark:to-warm-gray/10 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 text-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight text-off-black dark:text-off-white lg:text-6xl">
                {hero.title}
              </h1>
              <p className="text-xl font-medium text-primary lg:text-2xl">
                {hero.subtitle}
              </p>
            </div>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-warm-gray lg:text-xl">
              {hero.description}
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button 
              variant="primary" 
              size="lg"
              onClick={hero.onPrimaryCtaClick}
              {...(hero.primaryCtaHref && !hero.onPrimaryCtaClick ? { href: hero.primaryCtaHref } : {})}
            >
              {hero.primaryCtaText}
              <LucideIcon icon={ArrowRight} size="sm" className="ml-2" />
            </Button>
            
            {hero.secondaryCtaText && (
              <Button 
                variant="outline" 
                size="lg"
                onClick={hero.onSecondaryCtaClick}
                {...(hero.secondaryCtaHref && !hero.onSecondaryCtaClick ? { href: hero.secondaryCtaHref } : {})}
              >
                <LucideIcon icon={Play} size="sm" className="mr-2" />
                {hero.secondaryCtaText}
              </Button>
            )}
          </div>
          
          {hero.stats && hero.stats.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-warm-gray">
              {hero.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-2">
                  <LucideIcon icon={Star} size="sm" className="text-yellow-500" />
                  <span className="font-medium text-off-black dark:text-off-white">
                    {stat.value}
                  </span>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const renderFeatures = () => {
    if (!features.length) return null;
    
    return (
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-3xl font-bold text-off-black dark:text-off-white lg:text-4xl">
              Why Build in Public?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-warm-gray">
              Discover the benefits of transparent development and community-driven building
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "space-y-4 rounded-lg border border-light-gray bg-off-white p-6 transition-colors dark:border-warm-gray/30 dark:bg-off-black",
                  feature.href && "cursor-pointer hover:border-primary/50"
                )}
                {...(feature.href ? { onClick: () => window.location.href = feature.href } : {})}
              >
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <LucideIcon icon={feature.icon} size="md" className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-off-black dark:text-off-white">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-warm-gray">
                  {feature.description}
                </p>
                {feature.href && (
                  <div className="flex items-center text-sm font-medium text-primary">
                    Learn more
                    <LucideIcon icon={ChevronRight} size="xs" className="ml-1" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderTestimonials = () => {
    if (!testimonials.length) return null;
    
    return (
      <section className="bg-light-gray/50 py-20 dark:bg-warm-gray/5 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-3xl font-bold text-off-black dark:text-off-white lg:text-4xl">
              What Developers Are Saying
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-warm-gray">
              Feedback from our amazing community of builders and creators
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 6).map((testimonial, index) => (
              <div
                key={index}
                className={cn(
                  "space-y-4 rounded-lg border border-light-gray bg-off-white p-6 dark:border-warm-gray/30 dark:bg-off-black",
                  testimonial.featured && "ring-2 ring-primary/20"
                )}
              >
                <div className="flex justify-start">
                  <LucideIcon icon={Quote} size="sm" className="text-primary" />
                </div>
                
                <blockquote className="leading-relaxed text-warm-gray">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center gap-3">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center rounded-full bg-light-gray dark:bg-warm-gray/20">
                      <span className="text-sm font-medium text-warm-gray">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  <div>
                    <p className="font-medium text-off-black dark:text-off-white">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-warm-gray">
                      {testimonial.role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderCurrentProjects = () => {
    if (!currentProjects.length) return null;
    
    return (
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-off-black dark:text-off-white lg:text-4xl">
                Current Projects
              </h2>
              <p className="text-lg text-warm-gray">
                Follow along as we build these projects in public
              </p>
            </div>
            <Link href="/projects" className="hidden items-center font-medium text-primary no-underline sm:flex">
              View All Projects
              <LucideIcon icon={ChevronRight} size="sm" className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {currentProjects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                className={cn(
                  "space-y-4 rounded-lg border border-light-gray bg-off-white p-6 dark:border-warm-gray/30 dark:bg-off-black",
                  project.featured && "ring-2 ring-primary/20"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-off-black dark:text-off-white">
                      {project.title}
                    </h3>
                    <span className={cn(
                      "inline-flex items-center rounded px-2 py-1 text-xs font-medium capitalize",
                      getStatusColor(project.status)
                    )}>
                      {project.status.replace('-', ' ')}
                    </span>
                  </div>
                  
                  {project.progress !== undefined && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-off-black dark:text-off-white">
                        {project.progress}%
                      </div>
                      <div className="mt-1 h-2 w-16 rounded-full bg-light-gray dark:bg-warm-gray/30">
                        <div 
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <p className="leading-relaxed text-warm-gray">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-light-gray px-2 py-1 text-xs text-warm-gray dark:bg-warm-gray/20"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="py-1 text-xs text-warm-gray">
                      +{project.technologies.length - 4} more
                    </span>
                  )}
                </div>
                
                <Link 
                  href={project.href} 
                  className="inline-flex items-center text-sm font-medium text-primary no-underline"
                >
                  View Project
                  <LucideIcon icon={ChevronRight} size="xs" className="ml-1" />
                </Link>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/projects" className="inline-flex items-center font-medium text-primary no-underline">
              View All Projects
              <LucideIcon icon={ChevronRight} size="sm" className="ml-1" />
            </Link>
          </div>
        </div>
      </section>
    );
  };

  const renderRecentPosts = () => {
    if (!recentPosts.length) return null;
    
    return (
      <section className="bg-light-gray/50 py-20 dark:bg-warm-gray/5 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-off-black dark:text-off-white lg:text-4xl">
                Latest Updates
              </h2>
              <p className="text-lg text-warm-gray">
                Recent posts from our building in public journey
              </p>
            </div>
            <Link href="/blog" className="hidden items-center font-medium text-primary no-underline sm:flex">
              View All Posts
              <LucideIcon icon={ChevronRight} size="sm" className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.slice(0, 6).map((post) => (
              <article
                key={post.id}
                className={cn(
                  "space-y-4 rounded-lg border border-light-gray bg-off-white p-6 transition-colors hover:border-primary/50 dark:border-warm-gray/30 dark:bg-off-black",
                  post.featured && "ring-2 ring-primary/20"
                )}
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold leading-snug text-off-black dark:text-off-white">
                    {post.title}
                  </h3>
                  <p className="line-clamp-3 leading-relaxed text-warm-gray">
                    {post.excerpt}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-warm-gray">
                  <div className="flex items-center gap-2">
                    <LucideIcon icon={Calendar} size="xs" />
                    <span>{post.date}</span>
                  </div>
                  <span>{post.readTime}</span>
                </div>
                
                <Link 
                  href={post.href} 
                  className="inline-flex items-center text-sm font-medium text-primary no-underline"
                >
                  Read More
                  <LucideIcon icon={ChevronRight} size="xs" className="ml-1" />
                </Link>
              </article>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/blog" className="inline-flex items-center font-medium text-primary no-underline">
              View All Posts
              <LucideIcon icon={ChevronRight} size="sm" className="ml-1" />
            </Link>
          </div>
        </div>
      </section>
    );
  };

  const renderMissionSection = () => {
    if (!showMission) return null;
    
    return (
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-4xl space-y-8 px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-off-black dark:text-off-white lg:text-4xl">
            {missionTitle}
          </h2>
          <p className="text-lg leading-relaxed text-warm-gray lg:text-xl">
            {missionContent}
          </p>
        </div>
      </section>
    );
  };

  const renderCommunitySection = () => {
    if (!showCommunity) return null;
    
    return (
      <section className="bg-primary/5 py-20 dark:bg-primary/10 lg:py-32">
        <div className="mx-auto max-w-7xl space-y-12 px-4 text-center sm:px-6 lg:px-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-off-black dark:text-off-white lg:text-4xl">
              {communityTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-warm-gray">
              {communityDescription}
            </p>
          </div>
          
          {communityStats.length > 0 && (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {communityStats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="text-3xl font-bold text-primary lg:text-4xl">
                    {stat.value}
                  </div>
                  <div className="text-warm-gray">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <Button variant="primary" size="lg">
            <LucideIcon icon={MessageCircle} size="sm" className="mr-2" />
            Join Our Community
          </Button>
        </div>
      </section>
    );
  };

  const renderCtaSection = () => (
    <section className="py-20 lg:py-32">
      <div className="mx-auto max-w-4xl space-y-8 px-4 text-center sm:px-6 lg:px-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-off-black dark:text-off-white lg:text-4xl">
            {ctaTitle}
          </h2>
          <p className="text-lg text-warm-gray">
            {ctaDescription}
          </p>
        </div>
        
        <Button 
          variant="primary" 
          size="lg"
          onClick={onCtaClick}
          {...(ctaHref && !onCtaClick ? { href: ctaHref } : {})}
        >
          {ctaText}
          <LucideIcon icon={ArrowRight} size="sm" className="ml-2" />
        </Button>
        
        <div className="flex items-center justify-center gap-6 text-sm text-warm-gray">
          <div className="flex items-center gap-2">
            <LucideIcon icon={CheckCircle} size="sm" className="text-green-500" />
            <span>Free to start</span>
          </div>
          <div className="flex items-center gap-2">
            <LucideIcon icon={CheckCircle} size="sm" className="text-green-500" />
            <span>Open source</span>
          </div>
          <div className="flex items-center gap-2">
            <LucideIcon icon={CheckCircle} size="sm" className="text-green-500" />
            <span>Community driven</span>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className={cn("min-h-screen bg-off-white dark:bg-off-black", className)} {...props}>
      {renderHeroSection()}
      {renderFeatures()}
      {renderCurrentProjects()}
      {renderTestimonials()}
      {renderRecentPosts()}
      {renderMissionSection()}
      {renderCommunitySection()}
      {renderCtaSection()}
    </div>
  );
}