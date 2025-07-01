import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
  external?: boolean;
}

interface ActionButton {
  label: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  variant?: "primary" | "outline";
  icon?: React.ComponentType;
}

interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  showBackButton?: boolean;
  backButtonHref?: string;
  backButtonLabel?: string;
  actions?: ActionButton[];
  variant?: "default" | "centered" | "minimal" | "hero";
  background?: "none" | "subtle" | "gradient";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  showBackButton = false,
  backButtonHref,
  backButtonLabel = "Back",
  actions,
  variant = "default",
  background = "none",
  size = "lg",
  className,
  ...props
}: PageHeaderProps) {
  const sizeClasses = {
    sm: "py-6",
    md: "py-8",
    lg: "py-12",
    xl: "py-16",
  };

  const backgroundClasses = {
    none: "",
    subtle: "bg-light-gray/30 dark:bg-warm-gray/10",
    gradient: "bg-gradient-to-b from-light-gray/50 to-transparent dark:from-warm-gray/20 dark:to-transparent",
  };

  const titleSizes = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl lg:text-5xl",
    xl: "text-5xl lg:text-6xl",
  };

  const descriptionSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  const renderBreadcrumbs = () => {
    if (!breadcrumbs || breadcrumbs.length === 0) return null;

    return (
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-2 text-sm text-warm-gray">
          {breadcrumbs.map((item, index) => (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-warm-gray/50">/</span>
              )}
              <Link
                href={item.href}
                external={item.external}
                className={cn(
                  "hover:text-off-black dark:hover:text-off-white transition-colors no-underline",
                  index === breadcrumbs.length - 1 && "text-off-black dark:text-off-white font-medium"
                )}
              >
                {item.label}
                {item.external && (
                  <LucideIcon
                    icon={ExternalLink}
                    size="xs"
                    className="ml-1 inline"
                  />
                )}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    );
  };

  const renderBackButton = () => {
    if (!showBackButton) return null;

    if (backButtonHref) {
      return (
        <Link
          href={backButtonHref}
          className={cn(
            "inline-flex items-center gap-2 mb-4 text-sm text-warm-gray",
            "hover:text-off-black dark:hover:text-off-white transition-colors no-underline"
          )}
        >
          <LucideIcon icon={ArrowLeft} size="sm" />
          {backButtonLabel}
        </Link>
      );
    }

    return (
      <button
        onClick={() => window.history.back()}
        className={cn(
          "inline-flex items-center gap-2 mb-4 text-sm text-warm-gray",
          "hover:text-off-black dark:hover:text-off-white transition-colors"
        )}
      >
        <LucideIcon icon={ArrowLeft} size="sm" />
        {backButtonLabel}
      </button>
    );
  };

  const renderActions = () => {
    if (!actions || actions.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center gap-3 mt-6">
        {actions.map((action, index) => {
          if (action.href) {
            return (
              <Link
                key={index}
                href={action.href}
                external={action.external}
                className="no-underline"
              >
                <Button variant={action.variant || "primary"}>
                  <span className="flex items-center gap-2">
                    {action.icon && <LucideIcon icon={action.icon} size="sm" />}
                    {action.label}
                    {action.external && <LucideIcon icon={ExternalLink} size="xs" />}
                  </span>
                </Button>
              </Link>
            );
          }

          return (
            <Button
              key={index}
              variant={action.variant || "primary"}
              onClick={action.onClick}
            >
              <span className="flex items-center gap-2">
                {action.icon && <LucideIcon icon={action.icon} size="sm" />}
                {action.label}
              </span>
            </Button>
          );
        })}
      </div>
    );
  };

  const contentAlignment = variant === "centered" ? "text-center" : "text-left";
  const maxWidth = variant === "centered" ? "max-w-4xl mx-auto" : "max-w-none";

  return (
    <header
      className={cn(
        sizeClasses[size],
        backgroundClasses[background],
        "border-b border-light-gray dark:border-warm-gray/30",
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4">
        <div className={cn(maxWidth, contentAlignment)}>
          {renderBreadcrumbs()}
          {renderBackButton()}

          {variant === "minimal" ? (
            <div className="space-y-2">
              <h1 className={cn(
                titleSizes[size],
                "font-semibold text-off-black dark:text-off-white leading-tight"
              )}>
                {title}
              </h1>
              {description && (
                <p className={cn(
                  descriptionSizes[size],
                  "text-warm-gray"
                )}>
                  {description}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <h1 className={cn(
                titleSizes[size],
                "font-bold text-off-black dark:text-off-white leading-tight",
                variant === "hero" && "tracking-tight"
              )}>
                {title}
              </h1>
              {description && (
                <p className={cn(
                  descriptionSizes[size],
                  "text-warm-gray leading-relaxed",
                  variant === "centered" && "mx-auto",
                  size === "xl" ? "max-w-4xl" : "max-w-3xl"
                )}>
                  {description}
                </p>
              )}
            </div>
          )}

          {renderActions()}
        </div>
      </div>
    </header>
  );
}