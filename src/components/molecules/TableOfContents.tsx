import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "@/components/ui/Typography";
import { LucideIcon } from "@/components/ui/Icon";
import { List, Bookmark, ChevronRight } from "lucide-react";

interface TocItem {
  id: string;
  title: string;
  level: number;
  children?: TocItem[];
}

interface TableOfContentsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TocItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
  variant?: "sidebar" | "floating" | "inline";
  collapsible?: boolean;
  showNumbers?: boolean;
  maxDepth?: number;
  className?: string;
}

export function TableOfContents({
  items,
  activeId,
  onItemClick,
  variant = "sidebar",
  collapsible = false,
  showNumbers = false,
  maxDepth = 3,
  className,
  ...props
}: TableOfContentsProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleItemClick = (id: string) => {
    onItemClick?.(id);
    
    // Scroll to element if no custom handler
    if (!onItemClick) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
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

  const renderItems = (items: TocItem[], depth = 0): React.ReactNode => {
    if (depth >= maxDepth) return null;

    return items.map((item, index) => {
      const isActive = activeId === item.id;
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedItems.has(item.id);
      const shouldShowChildren = hasChildren && (!collapsible || isExpanded);

      const itemNumber = showNumbers ? `${index + 1}.` : "";
      const indentLevel = depth * 16;

      return (
        <li key={item.id} className="space-y-1">
          <div
            className="flex items-center gap-1 group"
            style={{ paddingLeft: `${indentLevel}px` }}
          >
            {/* Expand/Collapse Button */}
            {hasChildren && collapsible && (
              <button
                onClick={() => toggleExpanded(item.id)}
                className="p-0.5 hover:bg-light-gray dark:hover:bg-warm-gray/20 rounded transition-colors"
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                <LucideIcon
                  icon={ChevronRight}
                  size="xs"
                  className={cn(
                    "text-warm-gray transition-transform",
                    isExpanded && "rotate-90"
                  )}
                />
              </button>
            )}

            {/* Item Link */}
            <Link
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleItemClick(item.id);
              }}
              className={cn(
                "flex-1 text-sm py-1 px-2 rounded transition-colors no-underline",
                "hover:bg-light-gray dark:hover:bg-warm-gray/20",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-warm-gray hover:text-off-black dark:hover:text-off-white"
              )}
            >
              {itemNumber && (
                <span className="mr-2 text-xs opacity-60">{itemNumber}</span>
              )}
              {item.title}
            </Link>
          </div>

          {/* Children */}
          {shouldShowChildren && (
            <ul className="space-y-1">
              {renderItems(item.children!, depth + 1)}
            </ul>
          )}
        </li>
      );
    });
  };

  const variantClasses = {
    sidebar: cn(
      "bg-off-white dark:bg-off-black",
      "border border-light-gray dark:border-warm-gray/30",
      "rounded-lg p-4",
      "max-h-96 overflow-y-auto"
    ),
    floating: cn(
      "bg-off-white dark:bg-off-black",
      "border border-light-gray dark:border-warm-gray/30",
      "rounded-lg p-4 shadow-lg",
      "max-h-80 overflow-y-auto"
    ),
    inline: "space-y-2",
  };

  if (variant === "floating" && collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className={cn(
          "fixed bottom-4 right-4 z-50",
          "bg-primary text-primary-foreground",
          "p-3 rounded-full shadow-lg",
          "hover:bg-primary/90 transition-colors",
          className
        )}
        aria-label="Show table of contents"
      >
        <LucideIcon icon={List} size="sm" />
      </button>
    );
  }

  return (
    <nav
      className={cn(variantClasses[variant], className)}
      aria-label="Table of contents"
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <LucideIcon icon={Bookmark} size="sm" className="text-primary" />
          <span className="font-medium text-off-black dark:text-off-white">
            Contents
          </span>
        </div>

        {variant === "floating" && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 hover:bg-light-gray dark:hover:bg-warm-gray/20 rounded transition-colors"
            aria-label="Hide table of contents"
          >
            <LucideIcon icon={List} size="xs" className="text-warm-gray" />
          </button>
        )}
      </div>

      {/* Items */}
      <ul className="space-y-1">
        {renderItems(items)}
      </ul>
    </nav>
  );
}