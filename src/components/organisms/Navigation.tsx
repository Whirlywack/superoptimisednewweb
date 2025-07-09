import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button, IconButton } from "@/components/ui/button";
import { Link } from "@/components/ui/Typography";
import { LucideIcon } from "@/components/ui/Icon";
import { Menu, X, Home, ChevronDown } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
}

interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
  items: NavItem[];
  logo?: React.ReactNode;
  logoHref?: string;
  variant?: "horizontal" | "mobile";
  showMobileToggle?: boolean;
  onItemClick?: (item: NavItem) => void;
  className?: string;
}

export function Navigation({
  items,
  logo,
  logoHref = "/",
  variant = "horizontal",
  showMobileToggle = true,
  onItemClick,
  className,
  ...props
}: NavigationProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const toggleDropdown = (label: string) => {
    const newOpen = new Set(openDropdowns);
    if (newOpen.has(label)) {
      newOpen.delete(label);
    } else {
      newOpen.add(label);
    }
    setOpenDropdowns(newOpen);
  };

  const handleItemClick = (item: NavItem) => {
    onItemClick?.(item);
    setIsMobileOpen(false);
    setOpenDropdowns(new Set());
  };

  const renderNavItems = (items: NavItem[], isMobile = false) => {
    return items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isDropdownOpen = openDropdowns.has(item.label);

      if (hasChildren) {
        return (
          <div key={item.label} className="relative">
            <button
              onClick={() => toggleDropdown(item.label)}
              className={cn(
                "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium",
                "text-off-black dark:text-off-white",
                "hover:bg-light-gray dark:hover:bg-warm-gray/20",
                "transition-colors duration-200",
                isMobile && "w-full justify-between"
              )}
            >
              {item.label}
              <LucideIcon
                icon={ChevronDown}
                size="xs"
                className={cn(
                  "transition-transform duration-200",
                  isDropdownOpen && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div
                className={cn(
                  isMobile
                    ? "ml-4 mt-1 space-y-1"
                    : "absolute left-0 top-full z-50 mt-1 min-w-48 rounded-md border border-light-gray bg-off-white py-1 shadow-lg dark:border-warm-gray/30 dark:bg-off-black"
                )}
              >
                {item.children?.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href}
                    external={child.external}
                    onClick={() => handleItemClick(child)}
                    className={cn(
                      "block px-3 py-2 text-sm text-warm-gray hover:text-off-black dark:hover:text-off-white",
                      "hover:bg-light-gray dark:hover:bg-warm-gray/20",
                      "no-underline transition-colors duration-200",
                      isMobile ? "rounded-md" : "first:rounded-t-md last:rounded-b-md"
                    )}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      }

      return (
        <Link
          key={item.label}
          href={item.href}
          external={item.external}
          onClick={() => handleItemClick(item)}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-medium no-underline",
            "text-off-black dark:text-off-white",
            "hover:bg-light-gray dark:hover:bg-warm-gray/20",
            "transition-colors duration-200",
            isMobile && "block w-full text-left"
          )}
        >
          {item.label}
        </Link>
      );
    });
  };

  if (variant === "mobile" || isMobileOpen) {
    return (
      <>
        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-off-black/50 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Mobile Navigation */}
        <nav
          className={cn(
            "fixed left-0 top-0 h-full w-80 bg-off-white dark:bg-off-black",
            "border-r border-light-gray dark:border-warm-gray/30",
            "z-50 transition-transform duration-300",
            isMobileOpen ? "translate-x-0" : "-translate-x-full",
            "lg:hidden",
            className
          )}
          {...props}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between border-b border-light-gray p-4 dark:border-warm-gray/30">
            {logo && (
              <Link href={logoHref} className="no-underline">
                {logo}
              </Link>
            )}
            
            <IconButton
              icon={<LucideIcon icon={X} size="md" />}
              onClick={toggleMobile}
              variant="ghost"
              aria-label="Close navigation"
            />
          </div>

          {/* Mobile Menu Items */}
          <div className="space-y-1 overflow-y-auto p-4">
            {renderNavItems(items, true)}
          </div>
        </nav>
      </>
    );
  }

  return (
    <nav
      className={cn(
        "flex items-center justify-between p-4",
        "bg-off-white dark:bg-off-black",
        "border-b border-light-gray dark:border-warm-gray/30",
        className
      )}
      {...props}
    >
      {/* Logo */}
      <div className="flex items-center">
        {logo && (
          <Link href={logoHref} className="no-underline">
            {logo}
          </Link>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden items-center space-x-1 lg:flex">
        {renderNavItems(items)}
      </div>

      {/* Mobile Toggle */}
      {showMobileToggle && (
        <IconButton
          icon={<LucideIcon icon={Menu} size="md" />}
          onClick={toggleMobile}
          variant="ghost"
          className="lg:hidden"
          aria-label="Open navigation"
        />
      )}
    </nav>
  );
}