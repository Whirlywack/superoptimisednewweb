import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "@/components/ui/Typography";
import { LucideIcon } from "@/components/ui/Icon";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLNavElement> {
  items: BreadcrumbItem[];
  showHome?: boolean;
  homeHref?: string;
  separator?: "chevron" | "slash";
  className?: string;
}

export function Breadcrumb({
  items,
  showHome = true,
  homeHref = "/",
  separator = "chevron",
  className,
  ...props
}: BreadcrumbProps) {
  const allItems = showHome 
    ? [{ label: "Home", href: homeHref }, ...items]
    : items;

  const SeparatorComponent = separator === "chevron" 
    ? () => <LucideIcon icon={ChevronRight} size="xs" className="text-warm-gray" />
    : () => <span className="text-warm-gray">/</span>;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1", className)}
      {...props}
    >
      <ol className="flex items-center space-x-1">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isFirst = index === 0;
          
          return (
            <li key={index} className="flex items-center space-x-1">
              {index > 0 && (
                <SeparatorComponent />
              )}
              
              <div className="flex items-center space-x-1">
                {isFirst && showHome && (
                  <LucideIcon 
                    icon={Home} 
                    size="xs" 
                    className="text-warm-gray" 
                  />
                )}
                
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    variant="muted"
                    className={cn(
                      "text-sm transition-colors duration-200 hover:text-primary",
                      "no-underline hover:underline"
                    )}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "text-sm",
                      isLast 
                        ? "font-medium text-off-black dark:text-off-white"
                        : "text-warm-gray"
                    )}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}