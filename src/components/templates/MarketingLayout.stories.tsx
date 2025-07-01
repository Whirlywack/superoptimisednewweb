import type { Meta, StoryObj } from "@storybook/react";
import { MarketingLayout } from "./MarketingLayout";
import { fn } from "@storybook/test";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { 
  ArrowRight, 
  Star, 
  Users, 
  Zap, 
  Shield, 
  Github,
  Play,
  CheckCircle,
  Globe,
  Heart,
  Code,
  Palette,
  MessageCircle
} from "lucide-react";

const meta = {
  title: "Templates/MarketingLayout",
  component: MarketingLayout,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Marketing website layout template with hero sections, feature grids, and responsive navigation. Perfect for landing pages, product sites, and marketing campaigns.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    navigation: {
      control: "object",
      description: "Navigation menu items",
    },
    logoHref: {
      control: "text",
      description: "Logo link URL",
    },
    logoText: {
      control: "text",
      description: "Logo text",
    },
    logoImage: {
      control: "text",
      description: "Logo image URL",
    },
    ctaText: {
      control: "text",
      description: "Call-to-action button text",
    },
    ctaHref: {
      control: "text",
      description: "CTA button URL",
    },
    onCtaClick: {
      action: "cta-clicked",
      description: "CTA click handler",
    },
    showBackToTop: {
      control: "boolean",
      description: "Show back to top button",
    },
    socialLinks: {
      control: "object",
      description: "Social media links",
    },
    copyrightText: {
      control: "text",
      description: "Footer copyright text",
    },
  },
  args: {
    onCtaClick: fn(),
  },
} satisfies Meta<typeof MarketingLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultNavigation = [
  { id: "features", title: "Features", href: "/features" },
  { id: "docs", title: "Documentation", href: "/docs" },
  { id: "community", title: "Community", href: "/community" },
  { id: "blog", title: "Blog", href: "/blog" },
  { id: "about", title: "About", href: "/about" },
];

const expandedNavigation = [
  { id: "features", title: "Features", href: "/features" },
  { id: "pricing", title: "Pricing", href: "/pricing", badge: "New" },
  { id: "docs", title: "Documentation", href: "/docs" },
  { id: "community", title: "Community", href: "/community" },
  { id: "blog", title: "Blog", href: "/blog" },
  { id: "github", title: "GitHub", href: "https://github.com/example", external: true },
  { id: "about", title: "About", href: "/about" },
];

const heroContent = (
  <div className="bg-gradient-to-b from-off-white to-light-gray dark:from-off-black dark:to-warm-gray/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl lg:text-6xl font-bold text-off-black dark:text-off-white leading-tight">
            Build Better Software{" "}
            <span className="text-primary">in Public</span>
          </h1>
          <p className="text-xl lg:text-2xl text-warm-gray max-w-3xl mx-auto leading-relaxed">
            Join our transparent development journey. Share progress, get feedback, 
            and create amazing products with community involvement.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" size="lg">
            Start Building
            <LucideIcon icon={ArrowRight} size="sm" className="ml-2" />
          </Button>
          <Button variant="outline" size="lg">
            <LucideIcon icon={Play} size="sm" className="mr-2" />
            Watch Demo
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-8 text-sm text-warm-gray">
          <div className="flex items-center gap-2">
            <LucideIcon icon={Star} size="sm" className="text-yellow-500" />
            <span>4.9/5 rating</span>
          </div>
          <div className="flex items-center gap-2">
            <LucideIcon icon={Users} size="sm" />
            <span>10k+ developers</span>
          </div>
          <div className="flex items-center gap-2">
            <LucideIcon icon={Globe} size="sm" />
            <span>50+ countries</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const featuresContent = (
  <div className="py-20 lg:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-off-black dark:text-off-white">
          Everything You Need to Build in Public
        </h2>
        <p className="text-lg text-warm-gray max-w-2xl mx-auto">
          Comprehensive tools and community support for transparent development
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            icon: Zap,
            title: "Lightning Fast",
            description: "Built with modern technologies for optimal performance and developer experience.",
          },
          {
            icon: Shield,
            title: "Secure by Default",
            description: "Security best practices implemented from day one with regular audits and updates.",
          },
          {
            icon: Code,
            title: "Developer Friendly",
            description: "Comprehensive APIs, detailed documentation, and extensive code examples.",
          },
          {
            icon: Palette,
            title: "Customizable",
            description: "Flexible design system and theming options to match your brand.",
          },
          {
            icon: MessageCircle,
            title: "Community Driven",
            description: "Active community contributing ideas, feedback, and improvements.",
          },
          {
            icon: Heart,
            title: "Open Source",
            description: "Fully open source with transparent development and collaborative growth.",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="bg-off-white dark:bg-off-black border border-light-gray dark:border-warm-gray/30 rounded-lg p-6 space-y-4"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <LucideIcon icon={feature.icon} size="md" className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-off-black dark:text-off-white">
              {feature.title}
            </h3>
            <p className="text-warm-gray leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ctaContent = (
  <div className="bg-primary/5 dark:bg-primary/10 py-20">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl lg:text-4xl font-bold text-off-black dark:text-off-white">
          Ready to Start Building?
        </h2>
        <p className="text-lg text-warm-gray">
          Join thousands of developers who are building amazing products in public. 
          Start your transparent development journey today.
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button variant="primary" size="lg">
          Get Started Free
          <LucideIcon icon={ArrowRight} size="sm" className="ml-2" />
        </Button>
        <Button variant="outline" size="lg">
          View Documentation
        </Button>
      </div>
      
      <div className="flex items-center justify-center gap-6 text-sm text-warm-gray">
        <div className="flex items-center gap-2">
          <LucideIcon icon={CheckCircle} size="sm" className="text-green-500" />
          <span>No credit card required</span>
        </div>
        <div className="flex items-center gap-2">
          <LucideIcon icon={CheckCircle} size="sm" className="text-green-500" />
          <span>Free forever plan</span>
        </div>
      </div>
    </div>
  </div>
);

const fullLandingPage = (
  <div>
    {heroContent}
    {featuresContent}
    {ctaContent}
  </div>
);

export const Default: Story = {
  args: {
    navigation: defaultNavigation,
    logoText: "BuildInPublic",
    ctaText: "Get Started",
    ctaHref: "/get-started",
    children: fullLandingPage,
  },
};

export const WithExpandedNavigation: Story = {
  args: {
    navigation: expandedNavigation,
    logoText: "SuperOptimised",
    ctaText: "Start Building",
    children: fullLandingPage,
  },
};

export const MinimalLayout: Story = {
  args: {
    navigation: [
      { id: "docs", title: "Docs", href: "/docs" },
      { id: "github", title: "GitHub", href: "https://github.com/example", external: true },
    ],
    logoText: "Simple",
    ctaText: "Learn More",
    showBackToTop: false,
    children: (
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h1 className="text-4xl font-bold text-off-black dark:text-off-white">
            Simple Marketing Page
          </h1>
          <p className="text-xl text-warm-gray">
            Clean, minimal layout perfect for simple landing pages and product announcements.
          </p>
          <Button variant="primary" size="lg">
            Get Started
          </Button>
        </div>
      </div>
    ),
  },
};

export const ProductLaunch: Story = {
  args: {
    navigation: [
      { id: "features", title: "Features", href: "/features" },
      { id: "pricing", title: "Pricing", href: "/pricing" },
      { id: "docs", title: "Docs", href: "/docs" },
      { id: "waitlist", title: "Join Waitlist", href: "/waitlist", badge: "Coming Soon" },
    ],
    logoText: "ProductName",
    ctaText: "Join Beta",
    children: (
      <div>
        <div className="bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <LucideIcon icon={Star} size="xs" />
                Now in Beta
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-off-black dark:text-off-white">
                The Future of Development
              </h1>
              <p className="text-xl text-warm-gray max-w-3xl mx-auto">
                Revolutionary tools that transform how you build, deploy, and scale applications. 
                Experience the next generation of development workflow.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="primary" size="lg">
                  Join Beta Program
                  <LucideIcon icon={ArrowRight} size="sm" className="ml-2" />
                </Button>
                <Button variant="outline" size="lg">
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-off-black dark:text-off-white mb-8">
              Trusted by Industry Leaders
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
              {["Company A", "Company B", "Company C", "Company D"].map((company) => (
                <div
                  key={company}
                  className="bg-light-gray dark:bg-warm-gray/20 rounded-lg p-4 text-center text-warm-gray font-medium"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
  },
};

export const CommunityFocus: Story = {
  args: {
    navigation: [
      { id: "community", title: "Community", href: "/community" },
      { id: "events", title: "Events", href: "/events" },
      { id: "blog", title: "Blog", href: "/blog" },
      { id: "discord", title: "Discord", href: "https://discord.gg/example", external: true },
    ],
    logoText: "DevCommunity",
    ctaText: "Join Community",
    socialLinks: [
      { platform: "github", href: "https://github.com/example", label: "GitHub" },
      { platform: "twitter", href: "https://twitter.com/example", label: "Twitter" },
      { platform: "custom", href: "https://discord.gg/example", label: "Discord", icon: MessageCircle },
    ],
    children: (
      <div>
        <div className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-off-black dark:text-off-white">
                Join Our Developer Community
              </h1>
              <p className="text-xl text-warm-gray max-w-3xl mx-auto">
                Connect with passionate developers, share knowledge, and build amazing things together. 
                Our community is built on collaboration, learning, and mutual support.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { number: "10,000+", label: "Active Members" },
                { number: "500+", label: "Projects Shared" },
                { number: "50+", label: "Countries" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <div className="text-3xl lg:text-4xl font-bold text-primary">
                    {stat.number}
                  </div>
                  <div className="text-warm-gray">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="primary" size="lg">
              Join Discord Community
              <LucideIcon icon={MessageCircle} size="sm" className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    ),
  },
};

export const WithCustomFooter: Story = {
  args: {
    navigation: defaultNavigation,
    logoText: "CustomBrand",
    footerContent: (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-off-black dark:text-off-white">Product</h3>
            <div className="space-y-2">
              {["Features", "Pricing", "Documentation", "Changelog"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-warm-gray hover:text-off-black dark:hover:text-off-white transition-colors text-sm"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-off-black dark:text-off-white">Company</h3>
            <div className="space-y-2">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-warm-gray hover:text-off-black dark:hover:text-off-white transition-colors text-sm"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-off-black dark:text-off-white">Resources</h3>
            <div className="space-y-2">
              {["Tutorials", "Examples", "Templates", "Community"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-warm-gray hover:text-off-black dark:hover:text-off-white transition-colors text-sm"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-off-black dark:text-off-white">Legal</h3>
            <div className="space-y-2">
              {["Privacy", "Terms", "Security", "Compliance"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block text-warm-gray hover:text-off-black dark:hover:text-off-white transition-colors text-sm"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-light-gray dark:border-warm-gray/30 pt-8 text-center">
          <p className="text-sm text-warm-gray">
            © 2024 CustomBrand. All rights reserved. Building the future with transparency and community.
          </p>
        </div>
      </div>
    ),
    children: heroContent,
  },
};

export const NoNavigation: Story = {
  args: {
    navigation: [],
    logoText: "Standalone",
    ctaText: "Contact Us",
    showBackToTop: false,
    children: (
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h1 className="text-4xl font-bold text-off-black dark:text-off-white">
            Coming Soon
          </h1>
          <p className="text-xl text-warm-gray">
            Something amazing is being built. Stay tuned for updates.
          </p>
          <div className="inline-flex items-center gap-2 bg-light-gray dark:bg-warm-gray/20 px-4 py-2 rounded-lg text-warm-gray">
            <LucideIcon icon={Users} size="sm" />
            <span>Join 1,000+ people on the waitlist</span>
          </div>
        </div>
      </div>
    ),
  },
};

export const WithLogo: Story = {
  args: {
    navigation: defaultNavigation,
    logoImage: "https://via.placeholder.com/120x40/6366f1/ffffff?text=LOGO",
    logoText: "Brand",
    children: fullLandingPage,
  },
};

export const LongScrollContent: Story = {
  args: {
    navigation: defaultNavigation,
    logoText: "ScrollDemo",
    showBackToTop: true,
    children: (
      <div className="space-y-20">
        {heroContent}
        {featuresContent}
        
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
              <h2 className="text-3xl font-bold text-off-black dark:text-off-white">
                Section {i + 1}
              </h2>
              <p className="text-warm-gray">
                This is additional content to demonstrate the back-to-top functionality. 
                Scroll down to see more sections and the back-to-top button will appear.
              </p>
              <div className="space-y-4">
                {Array.from({ length: 3 }, (_, j) => (
                  <p key={j} className="text-warm-gray">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        {ctaContent}
      </div>
    ),
  },
};