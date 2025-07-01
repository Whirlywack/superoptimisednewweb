import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "@/components/ui/Typography";
import { LucideIcon } from "@/components/ui/Icon";
import { Github, Twitter, Linkedin, Mail, ExternalLink } from "lucide-react";

interface SocialLink {
  label: string;
  href: string;
  icon: React.ComponentType;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: {
    label: string;
    href: string;
    external?: boolean;
  }[];
}

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  socialLinks?: SocialLink[];
  sections?: FooterSection[];
  copyright?: string;
  showNewsletter?: boolean;
  variant?: "simple" | "detailed" | "minimal";
  className?: string;
}

const defaultSocialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/superoptimised",
    icon: Github,
    external: true,
  },
  {
    label: "Twitter",
    href: "https://twitter.com/superoptimised",
    icon: Twitter,
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/superoptimised",
    icon: Linkedin,
    external: true,
  },
  {
    label: "Email",
    href: "mailto:hello@superoptimised.com",
    icon: Mail,
    external: true,
  },
];

const defaultSections: FooterSection[] = [
  {
    title: "Navigation",
    links: [
      { label: "Home", href: "/" },
      { label: "Journey", href: "/journey" },
      { label: "Projects", href: "/projects" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/api" },
      { label: "Community", href: "/community" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

export function Footer({
  socialLinks = defaultSocialLinks,
  sections = defaultSections,
  copyright = `© ${new Date().getFullYear()} Superoptimised. All rights reserved.`,
  showNewsletter = false,
  variant = "detailed",
  className,
  ...props
}: FooterProps) {
  const renderSocialLinks = () => (
    <div className="flex items-center gap-4">
      {socialLinks.map((social) => (
        <Link
          key={social.label}
          href={social.href}
          external={social.external}
          className={cn(
            "inline-flex items-center justify-center p-2 rounded-md no-underline",
            "text-warm-gray hover:text-off-black dark:hover:text-off-white",
            "hover:bg-light-gray dark:hover:bg-warm-gray/20",
            "transition-colors duration-200"
          )}
          aria-label={social.label}
        >
          <LucideIcon icon={social.icon} size="sm" />
        </Link>
      ))}
    </div>
  );

  const renderFooterSection = (section: FooterSection) => (
    <div key={section.title} className="space-y-3">
      <h3 className="text-sm font-medium text-off-black dark:text-off-white">
        {section.title}
      </h3>
      <ul className="space-y-2">
        {section.links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              external={link.external}
              className={cn(
                "text-sm text-warm-gray hover:text-off-black dark:hover:text-off-white",
                "transition-colors duration-200 no-underline"
              )}
            >
              {link.label}
              {link.external && (
                <LucideIcon
                  icon={ExternalLink}
                  size="xs"
                  className="ml-1 inline"
                />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderNewsletter = () => (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-off-black dark:text-off-white">
        Stay Updated
      </h3>
      <p className="text-sm text-warm-gray">
        Subscribe to get the latest updates and posts.
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          className={cn(
            "flex-1 px-3 py-2 text-sm rounded-md",
            "bg-off-white dark:bg-off-black",
            "border border-light-gray dark:border-warm-gray/30",
            "text-off-black dark:text-off-white",
            "placeholder:text-warm-gray",
            "focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
        />
        <button
          type="submit"
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md",
            "bg-primary text-off-white",
            "hover:bg-primary/90",
            "transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
        >
          Subscribe
        </button>
      </div>
    </div>
  );

  if (variant === "minimal") {
    return (
      <footer
        className={cn(
          "py-6 border-t border-light-gray dark:border-warm-gray/30",
          "bg-off-white dark:bg-off-black",
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-warm-gray">{copyright}</p>
            {renderSocialLinks()}
          </div>
        </div>
      </footer>
    );
  }

  if (variant === "simple") {
    return (
      <footer
        className={cn(
          "py-8 border-t border-light-gray dark:border-warm-gray/30",
          "bg-off-white dark:bg-off-black",
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            {/* Brand and Social */}
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-off-black dark:text-off-white">
                  Superoptimised
                </h2>
                <p className="text-sm text-warm-gray max-w-md">
                  Building in the open. Sharing the journey. Learning together.
                </p>
              </div>
              {renderSocialLinks()}
            </div>

            {/* Newsletter */}
            {showNewsletter && (
              <div className="w-full lg:w-auto lg:max-w-sm">
                {renderNewsletter()}
              </div>
            )}
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-light-gray dark:border-warm-gray/30">
            <p className="text-sm text-warm-gray text-center lg:text-left">
              {copyright}
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className={cn(
        "py-12 border-t border-light-gray dark:border-warm-gray/30",
        "bg-off-white dark:bg-off-black",
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 xl:col-span-2 space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-off-black dark:text-off-white">
                Superoptimised
              </h2>
              <p className="text-sm text-warm-gray max-w-md">
                Documenting the journey of building products in the open.
                Sharing learnings, challenges, and community feedback along the
                way.
              </p>
            </div>
            {renderSocialLinks()}
          </div>

          {/* Navigation Sections */}
          {sections.map(renderFooterSection)}

          {/* Newsletter */}
          {showNewsletter && (
            <div className="lg:col-span-2 xl:col-span-1">
              {renderNewsletter()}
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-light-gray dark:border-warm-gray/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-warm-gray">{copyright}</p>
            
            <div className="flex items-center gap-4 text-sm text-warm-gray">
              <Link
                href="/sitemap"
                className="hover:text-off-black dark:hover:text-off-white transition-colors no-underline"
              >
                Sitemap
              </Link>
              <Link
                href="/rss"
                className="hover:text-off-black dark:hover:text-off-white transition-colors no-underline"
              >
                RSS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}