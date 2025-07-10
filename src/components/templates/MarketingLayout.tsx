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
  ArrowUp,
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
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [showBackToTop]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          "font-medium text-warm-gray no-underline transition-colors hover:text-off-black dark:hover:text-off-white",
          "flex items-center gap-1"
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {item.title}
        {item.badge && (
          <span className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {item.badge}
          </span>
        )}
        {item.external && <LucideIcon icon={ExternalLink} size="xs" className="ml-1" />}
      </Link>
    </div>
  );

  const renderHeader = () => (
    <header className="sticky top-0 z-50 border-b border-light-gray bg-off-white/80 backdrop-blur-sm dark:border-warm-gray/30 dark:bg-off-black/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={logoHref}
            className="flex items-center gap-2 font-bold text-off-black no-underline dark:text-off-white"
          >
            {logoImage ? (
              <img src={logoImage} alt={logoText} className="h-8 w-auto" />
            ) : (
              <span className="text-xl">{logoText}</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {navigation.map(renderNavItem)}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
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
          <div className="border-t border-light-gray dark:border-warm-gray/30 md:hidden">
            <nav className="space-y-4 py-4">
              {navigation.map((item) => (
                <div key={item.id} className="block">
                  {renderNavItem(item)}
                </div>
              ))}
              <div className="border-t border-light-gray pt-4 dark:border-warm-gray/30">
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
    <footer className="border-t border-light-gray bg-off-white dark:border-warm-gray/30 dark:bg-off-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {footerContent ? (
          footerContent
        ) : (
          <div className="space-y-8">
            {/* Footer Links and Social */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              {/* Logo and Description */}
              <div className="space-y-4">
                <Link
                  href={logoHref}
                  className="flex items-center gap-2 font-bold text-off-black no-underline dark:text-off-white"
                >
                  {logoImage ? (
                    <img src={logoImage} alt={logoText} className="h-8 w-auto" />
                  ) : (
                    <span className="text-xl">{logoText}</span>
                  )}
                </Link>
                <p className="max-w-md text-sm text-warm-gray">
                  Building in public, sharing the journey, and fostering community-driven
                  development.
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
                      className="text-warm-gray no-underline transition-colors hover:text-off-black dark:hover:text-off-white"
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
              <div className="flex flex-wrap gap-6 border-t border-light-gray py-6 dark:border-warm-gray/30">
                {navigation.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    external={item.external}
                    className="text-sm text-warm-gray no-underline transition-colors hover:text-off-black dark:hover:text-off-white"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}

            {/* Copyright */}
            <div className="border-t border-light-gray pt-6 dark:border-warm-gray/30">
              <p className="text-center text-sm text-warm-gray">
                {copyrightText ||
                  `© ${new Date().getFullYear()} ${logoText}. Building in public with transparency and community.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </footer>
  );

  return (
    <div
      className={cn("flex min-h-screen flex-col bg-off-white dark:bg-off-black", className)}
      {...props}
    >
      {renderHeader()}

      <main className="flex-1">{children}</main>

      {renderFooter()}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-off-black/50 md:hidden"
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
