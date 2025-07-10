import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import type { FileText } from "lucide-react";
import {
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Github,
  ExternalLink,
  Book,
  ChevronDown,
  ArrowUp,
} from "lucide-react";

interface NavItem {
  id: string;
  title: string;
  href?: string;
  icon?: typeof FileText;
  badge?: string;
  children?: NavItem[];
  external?: boolean;
}

interface DocSiteLayoutProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  title?: string;
  description?: string;
  navigation: NavItem[];
  currentPath?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  logoHref?: string;
  logoText?: string;
  version?: string;
  githubUrl?: string;
  showThemeToggle?: boolean;
  showBackToTop?: boolean;
  footerContent?: React.ReactNode;
  onSearch?: (query: string) => void;
  onThemeToggle?: () => void;
  className?: string;
}

export function DocSiteLayout({
  children,
  title = "Documentation",
  description,
  navigation,
  currentPath = "/",
  showSearch = true,
  searchPlaceholder = "Search documentation...",
  logoHref = "/",
  logoText = "Docs",
  version,
  githubUrl,
  showThemeToggle = true,
  showBackToTop = true,
  footerContent,
  onSearch,
  onThemeToggle,
  className,
  ...props
}: DocSiteLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showBackToTopButton, setShowBackToTopButton] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTopButton(window.scrollY > 400);
    };

    if (showBackToTop) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [showBackToTop]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return currentPath === href || currentPath.startsWith(href + "/");
  };

  const hasActiveChild = (item: NavItem): boolean => {
    if (isActive(item.href)) return true;
    if (item.children) {
      return item.children.some((child) => hasActiveChild(child));
    }
    return false;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const itemIsActive = isActive(item.href);
    const hasActiveDescendant = hasActiveChild(item);

    return (
      <div key={item.id} className="space-y-1">
        <div
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
            level > 0 && "ml-4",
            itemIsActive
              ? "bg-primary/10 font-medium text-primary"
              : hasActiveDescendant
                ? "text-off-black dark:text-off-white"
                : "text-warm-gray hover:bg-light-gray/50 hover:text-off-black dark:hover:bg-warm-gray/10 dark:hover:text-off-white"
          )}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else if (item.href) {
              setIsSidebarOpen(false);
            }
          }}
        >
          {item.icon && (
            <LucideIcon
              icon={item.icon}
              size="xs"
              className={cn("shrink-0", itemIsActive ? "text-primary" : "text-warm-gray")}
            />
          )}

          {item.href ? (
            <Link
              href={item.href}
              external={item.external}
              className={cn(
                "flex-1 no-underline",
                itemIsActive ? "font-medium text-primary" : "text-current hover:text-current"
              )}
            >
              {item.title}
            </Link>
          ) : (
            <span className="flex-1">{item.title}</span>
          )}

          {item.badge && (
            <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {item.badge}
            </span>
          )}

          {item.external && <LucideIcon icon={ExternalLink} size="xs" className="text-warm-gray" />}

          {hasChildren && (
            <LucideIcon
              icon={ChevronDown}
              size="xs"
              className={cn("text-warm-gray transition-transform", isExpanded ? "rotate-180" : "")}
            />
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {item.children!.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderSidebar = () => (
    <aside
      className={cn(
        "flex w-64 flex-col border-r border-light-gray bg-off-white dark:border-warm-gray/30 dark:bg-off-black",
        "fixed inset-y-0 left-0 z-50 transition-transform lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-light-gray p-4 dark:border-warm-gray/30">
        <Link
          href={logoHref}
          className="flex items-center gap-2 font-semibold text-off-black no-underline dark:text-off-white"
        >
          <LucideIcon icon={Book} size="md" className="text-primary" />
          <span>{logoText}</span>
          {version && (
            <span className="rounded bg-light-gray px-2 py-0.5 text-xs text-warm-gray dark:bg-warm-gray/20">
              {version}
            </span>
          )}
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden"
        >
          <LucideIcon icon={X} size="sm" />
        </Button>
      </div>

      {/* Search */}
      {showSearch && (
        <div className="border-b border-light-gray p-4 dark:border-warm-gray/30">
          <form onSubmit={handleSearch} className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LucideIcon icon={Search} size="sm" className="text-warm-gray" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className={cn(
                "w-full rounded-lg border border-light-gray py-2 pl-10 pr-4 dark:border-warm-gray/30",
                "bg-off-white text-sm text-off-black dark:bg-off-black dark:text-off-white",
                "placeholder:text-warm-gray",
                "focus:border-primary focus:ring-2 focus:ring-primary/20",
                "transition-colors"
              )}
            />
          </form>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {navigation.map((item) => renderNavItem(item))}
      </nav>

      {/* Sidebar Footer */}
      <div className="space-y-3 border-t border-light-gray p-4 dark:border-warm-gray/30">
        <div className="flex items-center gap-2">
          {githubUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(githubUrl, "_blank")}
              className="flex-1"
            >
              <LucideIcon icon={Github} size="xs" className="mr-2" />
              GitHub
            </Button>
          )}

          {showThemeToggle && (
            <Button variant="ghost" size="sm" onClick={onThemeToggle}>
              <LucideIcon icon={Sun} size="xs" className="dark:hidden" />
              <LucideIcon icon={Moon} size="xs" className="hidden dark:block" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <div className={cn("min-h-screen bg-off-white dark:bg-off-black", className)} {...props}>
      <div className="flex">
        {/* Sidebar */}
        {renderSidebar()}

        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-off-black/50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="border-b border-light-gray bg-off-white px-4 py-3 dark:border-warm-gray/30 dark:bg-off-black lg:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden"
              >
                <LucideIcon icon={Menu} size="sm" />
              </Button>

              <div className="flex-1">
                {title && (
                  <h1 className="text-xl font-semibold text-off-black dark:text-off-white">
                    {title}
                  </h1>
                )}
                {description && <p className="mt-1 text-sm text-warm-gray">{description}</p>}
              </div>

              <div className="flex items-center gap-2">
                {githubUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(githubUrl, "_blank")}
                    className="hidden sm:flex"
                  >
                    <LucideIcon icon={Github} size="xs" className="mr-2" />
                    GitHub
                  </Button>
                )}

                {showThemeToggle && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onThemeToggle}
                    className="hidden lg:flex"
                  >
                    <LucideIcon icon={Sun} size="xs" className="dark:hidden" />
                    <LucideIcon icon={Moon} size="xs" className="hidden dark:block" />
                  </Button>
                )}
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 px-4 py-6 lg:p-8">
            <div className="mx-auto max-w-4xl">{children}</div>
          </main>

          {/* Footer */}
          {footerContent && (
            <footer className="border-t border-light-gray px-4 py-6 dark:border-warm-gray/30 lg:px-8">
              <div className="mx-auto max-w-4xl">{footerContent}</div>
            </footer>
          )}
        </div>
      </div>

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
