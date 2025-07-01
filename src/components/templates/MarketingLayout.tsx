import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import { 
  Menu, 
  X,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ExternalLink,
  ArrowRight,
  ChevronDown,
  ArrowUp
} from "lucide-react";

interface NavItem {
  id: string;
  title: string;
  href: string;
  external?: boolean;
  badge?: string;
}

interface SocialLink {
  platform: "github" | "twitter" | "linkedin" | "email" | "custom";
  href: string;
  label: string;
  icon?: typeof Github;
}

interface MarketingLayoutProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  navigation?: NavItem[];
  logoHref?: string;
  logoText?: string;
  logoImage?: string;
  ctaText?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  showBackToTop?: boolean;
  footerContent?: React.ReactNode;
  socialLinks?: SocialLink[];
  copyrightText?: string;
  className?: string;
}

export function MarketingLayout({
  children,
  navigation = [],
  logoHref = "/",
  logoText = "Brand",
  logoImage,
  ctaText = "Get Started",
  ctaHref = "/get-started",
  onCtaClick,
  showBackToTop = true,
  footerContent,
  socialLinks = [],
  copyrightText,
  className,
  ...props
}: MarketingLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [showBackToTopButton, setShowBackToTopButton] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTopButton(window.scrollY > 400);
    };

    if (showBackToTop) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [showBackToTop]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSocialIcon = (platform: string, customIcon?: typeof Github) => {
    if (customIcon) return customIcon;
    
    switch (platform) {
      case "github":
        return Github;
      case "twitter":
        return Twitter;
      case "linkedin":
        return Linkedin;
      case "email":
        return Mail;
      default:
        return ExternalLink;
    }
  };

  const defaultSocialLinks: SocialLink[] = [
    {
      platform: "github",
      href: "https://github.com/superoptimised",
      label: "GitHub",
    },
    {
      platform: "twitter", 
      href: "https://twitter.com/superoptimised",
      label: "Twitter",
    },
    {
      platform: "email",
      href: "mailto:hello@superoptimised.com",
      label: "Email",
    },
  ];

  const finalSocialLinks = socialLinks.length > 0 ? socialLinks : defaultSocialLinks;

  const renderNavItem = (item: NavItem) => (
    <div key={item.id} className="relative">
      <Link
        href={item.href}
        external={item.external}
        className={cn(
          "text-warm-gray hover:text-off-black dark:hover:text-off-white transition-colors font-medium no-underline",
          "flex items-center gap-1"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {item.title}
        {item.badge && (
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium ml-2">
            {item.badge}
          </span>
        )}
        {item.external && (
          <LucideIcon icon={ExternalLink} size="xs" className="ml-1" />
        )}
      </Link>
    </div>
  );

  const renderHeader = () => (
    <header className="bg-off-white/80 dark:bg-off-black/80 backdrop-blur-sm border-b border-light-gray dark:border-warm-gray/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href={logoHref} 
            className="flex items-center gap-2 font-bold text-off-black dark:text-off-white no-underline"
          >
            {logoImage ? (
              <img src={logoImage} alt={logoText} className="h-8 w-auto" />
            ) : (
              <span className="text-xl">{logoText}</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map(renderNavItem)}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={onCtaClick}
              {...(ctaHref && !onCtaClick ? { href: ctaHref } : {})}
            >
              {ctaText}
              <LucideIcon icon={ArrowRight} size="xs" className="ml-2" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
          >
            <LucideIcon icon={isMobileMenuOpen ? X : Menu} size="sm" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-light-gray dark:border-warm-gray/30">
            <nav className="py-4 space-y-4">
              {navigation.map(item => (
                <div key={item.id} className="block">
                  {renderNavItem(item)}
                </div>
              ))}
              <div className="pt-4 border-t border-light-gray dark:border-warm-gray/30">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onCtaClick?.();
                  }}
                  className="w-full"
                  {...(ctaHref && !onCtaClick ? { href: ctaHref } : {})}
                >
                  {ctaText}
                  <LucideIcon icon={ArrowRight} size="xs" className="ml-2" />
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );

  const renderFooter = () => (
    <footer className="bg-off-white dark:bg-off-black border-t border-light-gray dark:border-warm-gray/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {footerContent ? (
          footerContent
        ) : (
          <div className="space-y-8">
            {/* Footer Links and Social */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Logo and Description */}
              <div className="space-y-4">
                <Link 
                  href={logoHref} 
                  className="flex items-center gap-2 font-bold text-off-black dark:text-off-white no-underline"
                >
                  {logoImage ? (
                    <img src={logoImage} alt={logoText} className="h-8 w-auto" />
                  ) : (
                    <span className="text-xl">{logoText}</span>
                  )}
                </Link>
                <p className="text-warm-gray text-sm max-w-md">
                  Building in public, sharing the journey, and fostering community-driven development.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {finalSocialLinks.map((social) => {
                  const Icon = getSocialIcon(social.platform, social.icon);
                  return (
                    <Link
                      key={social.platform}
                      href={social.href}
                      external
                      className="text-warm-gray hover:text-off-black dark:hover:text-off-white transition-colors no-underline"
                      aria-label={social.label}
                    >
                      <LucideIcon icon={Icon} size="md" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Navigation Links */}
            {navigation.length > 0 && (
              <div className="flex flex-wrap gap-6 py-6 border-t border-light-gray dark:border-warm-gray/30">
                {navigation.map(item => (
                  <Link
                    key={item.id}
                    href={item.href}
                    external={item.external}
                    className="text-warm-gray hover:text-off-black dark:hover:text-off-white transition-colors text-sm no-underline"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}

            {/* Copyright */}
            <div className="pt-6 border-t border-light-gray dark:border-warm-gray/30">
              <p className="text-center text-sm text-warm-gray">
                {copyrightText || `© ${new Date().getFullYear()} ${logoText}. Building in public with transparency and community.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </footer>
  );

  return (
    <div className={cn("min-h-screen bg-off-white dark:bg-off-black flex flex-col", className)} {...props}>
      {renderHeader()}
      
      <main className="flex-1">
        {children}
      </main>
      
      {renderFooter()}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-off-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Back to Top Button */}
      {showBackToTop && showBackToTopButton && (
        <Button
          variant="primary"
          size="sm"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 shadow-lg"
        >
          <LucideIcon icon={ArrowUp} size="sm" />
        </Button>
      )}
    </div>
  );
}