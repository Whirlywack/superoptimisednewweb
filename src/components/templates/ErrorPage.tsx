import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import {
  AlertTriangle,
  Home,
  ArrowLeft,
  Mail,
  Search,
  FileX,
  Clock,
  Wifi,
  Server,
  Shield,
  ExternalLink,
  MessageCircle,
  Settings,
  BookOpen,
  Users,
} from "lucide-react";

interface ErrorAction {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  icon: React.ComponentType<any>;
  external?: boolean;
}

interface ErrorPageProps extends React.HTMLAttributes<HTMLElement> {
  errorType?: "404" | "403" | "500" | "expired" | "offline" | "maintenance" | "custom";
  title?: string;
  message?: string;
  description?: string;
  errorCode?: string;
  showErrorDetails?: boolean;
  showSuggestions?: boolean;
  showContactInfo?: boolean;
  actions?: ErrorAction[];
  suggestions?: Array<{
    id: string;
    title: string;
    description: string;
    href: string;
    icon: React.ComponentType<any>;
  }>;
  contactEmail?: string;
  supportUrl?: string;
  statusPageUrl?: string;
  documentationUrl?: string;
  homeUrl?: string;
  searchUrl?: string;
  timestamp?: string;
  requestId?: string;
  className?: string;
}

export function ErrorPage({
  errorType = "404",
  title,
  message,
  description,
  errorCode,
  showErrorDetails = true,
  showSuggestions = true,
  showContactInfo = true,
  actions,
  suggestions,
  contactEmail = "support@superoptimised.com",
  supportUrl = "/support",
  statusPageUrl = "/status",
  documentationUrl = "/docs",
  homeUrl = "/",
  searchUrl = "/search",
  timestamp,
  requestId,
  className,
  ...props
}: ErrorPageProps) {
  const getErrorConfig = () => {
    switch (errorType) {
      case "404":
        return {
          icon: FileX,
          title: title || "Page Not Found",
          message: message || "The page you're looking for doesn't exist",
          description:
            description ||
            "The URL you entered may be incorrect, or the page has been moved or deleted.",
          code: errorCode || "404",
        };
      case "403":
        return {
          icon: Shield,
          title: title || "Access Denied",
          message: message || "You don't have permission to access this resource",
          description:
            description ||
            "This content is restricted. Please check your permissions or contact support if you believe this is an error.",
          code: errorCode || "403",
        };
      case "500":
        return {
          icon: Server,
          title: title || "Server Error",
          message: message || "Something went wrong on our end",
          description:
            description ||
            "We're experiencing technical difficulties. Our team has been notified and is working to resolve the issue.",
          code: errorCode || "500",
        };
      case "expired":
        return {
          icon: Clock,
          title: title || "Link Expired",
          message: message || "This link has expired and is no longer valid",
          description:
            description ||
            "Magic links and temporary access links expire for security reasons. Please request a new link or sign in again.",
          code: errorCode || "EXPIRED",
        };
      case "offline":
        return {
          icon: Wifi,
          title: title || "No Internet Connection",
          message: message || "You appear to be offline",
          description:
            description ||
            "Please check your internet connection and try again. Some features may be limited while offline.",
          code: errorCode || "OFFLINE",
        };
      case "maintenance":
        return {
          icon: Settings,
          title: title || "Scheduled Maintenance",
          message: message || "We're currently performing scheduled maintenance",
          description:
            description ||
            "Our service will be back online shortly. Thank you for your patience during this brief maintenance window.",
          code: errorCode || "MAINTENANCE",
        };
      default:
        return {
          icon: AlertTriangle,
          title: title || "Something went wrong",
          message: message || "An unexpected error occurred",
          description:
            description ||
            "We encountered an unexpected error. Please try again or contact support if the problem persists.",
          code: errorCode || "ERROR",
        };
    }
  };

  const errorConfig = getErrorConfig();
  const ErrorIcon = errorConfig.icon;

  const defaultActions: ErrorAction[] = [
    {
      id: "home",
      label: "Go Home",
      href: homeUrl,
      variant: "primary",
      icon: Home,
    },
    {
      id: "back",
      label: "Go Back",
      onClick: () => window.history.back(),
      variant: "outline",
      icon: ArrowLeft,
    },
  ];

  const getDefaultSuggestions = () => {
    const baseSuggestions = [
      {
        id: "search",
        title: "Search our site",
        description: "Find what you're looking for using our search",
        href: searchUrl,
        icon: Search,
      },
      {
        id: "docs",
        title: "Browse documentation",
        description: "Check our comprehensive documentation",
        href: documentationUrl,
        icon: BookOpen,
      },
      {
        id: "community",
        title: "Ask the community",
        description: "Get help from our community forum",
        href: "/community",
        icon: Users,
      },
    ];

    if (errorType === "500" || errorType === "maintenance") {
      baseSuggestions.unshift({
        id: "status",
        title: "Check service status",
        description: "View our current system status and updates",
        href: statusPageUrl,
        icon: Server,
      });
    }

    return baseSuggestions;
  };

  const displayActions = actions || defaultActions;
  const displaySuggestions = suggestions || getDefaultSuggestions();

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center bg-off-white p-4 dark:bg-off-black",
        className
      )}
      {...props}
    >
      <div className="w-full max-w-2xl space-y-8 text-center">
        {/* Error Icon and Code */}
        <div className="space-y-6">
          <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-warm-gray/10 dark:bg-warm-gray/20">
            <LucideIcon icon={ErrorIcon} size="xl" className="text-warm-gray" />
          </div>

          {showErrorDetails && (
            <div className="inline-flex items-center gap-2 rounded-full bg-light-gray px-3 py-1 text-sm text-warm-gray dark:bg-warm-gray/20">
              <span>Error {errorConfig.code}</span>
            </div>
          )}
        </div>

        {/* Error Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-off-black dark:text-off-white lg:text-4xl">
            {errorConfig.title}
          </h1>

          <p className="text-xl text-warm-gray">{errorConfig.message}</p>

          {errorConfig.description && (
            <p className="mx-auto max-w-lg leading-relaxed text-warm-gray">
              {errorConfig.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {displayActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant || "primary"}
              size="lg"
              asChild={!!action.href}
              onClick={action.onClick}
              className="min-w-0"
            >
              {action.href ? (
                <Link
                  href={action.href}
                  external={action.external}
                  className="inline-flex items-center gap-2 no-underline"
                >
                  <LucideIcon icon={action.icon} size="sm" />
                  <span>{action.label}</span>
                  {action.external && <LucideIcon icon={ExternalLink} size="xs" />}
                </Link>
              ) : (
                <>
                  <LucideIcon icon={action.icon} size="sm" />
                  <span>{action.label}</span>
                </>
              )}
            </Button>
          ))}
        </div>

        {/* Suggestions */}
        {showSuggestions && displaySuggestions.length > 0 && (
          <div className="space-y-6">
            <div className="h-px w-full bg-light-gray dark:bg-warm-gray/30" />

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-off-black dark:text-off-white">
                Try these instead
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {displaySuggestions.map((suggestion) => (
                  <Link
                    key={suggestion.id}
                    href={suggestion.href}
                    className="group block rounded-lg bg-light-gray/50 p-4 no-underline transition-colors hover:bg-light-gray dark:bg-warm-gray/10 dark:hover:bg-warm-gray/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 rounded-lg bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
                        <LucideIcon icon={suggestion.icon} size="sm" className="text-primary" />
                      </div>
                      <div className="space-y-1 text-left">
                        <h3 className="text-sm font-medium text-off-black dark:text-off-white">
                          {suggestion.title}
                        </h3>
                        <p className="text-xs leading-relaxed text-warm-gray">
                          {suggestion.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error Details */}
        {showErrorDetails && (timestamp || requestId) && (
          <div className="space-y-4">
            <div className="h-px w-full bg-light-gray dark:bg-warm-gray/30" />

            <div className="space-y-2 text-center">
              <p className="text-sm text-warm-gray">Error Details</p>
              <div className="space-y-1 text-xs text-warm-gray">
                {timestamp && <div>Timestamp: {timestamp}</div>}
                {requestId && <div>Request ID: {requestId}</div>}
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        {showContactInfo && (
          <div className="space-y-4">
            <div className="h-px w-full bg-light-gray dark:bg-warm-gray/30" />

            <div className="space-y-3 text-center">
              <p className="text-sm font-medium text-off-black dark:text-off-white">Need help?</p>

              <div className="flex items-center justify-center gap-6 text-sm">
                <Link
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <LucideIcon icon={Mail} size="xs" />
                  Email Support
                </Link>

                <Link
                  href={supportUrl}
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <LucideIcon icon={MessageCircle} size="xs" />
                  Help Center
                </Link>

                <Link
                  href={statusPageUrl}
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  <LucideIcon icon={Server} size="xs" />
                  Status Page
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
