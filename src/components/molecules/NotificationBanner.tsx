import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/button";
import { Paragraph } from "@/components/ui/Typography";
import { LucideIcon } from "@/components/ui/Icon";
import { X, AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react";

interface NotificationBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "banner" | "toast" | "inline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const typeConfig = {
  info: {
    icon: Info,
    bgColor: "bg-primary/10 dark:bg-primary/20",
    borderColor: "border-primary/20 dark:border-primary/30",
    textColor: "text-primary",
    iconColor: "text-primary",
  },
  success: {
    icon: CheckCircle,
    bgColor: "bg-primary/10 dark:bg-primary/20",
    borderColor: "border-primary/20 dark:border-primary/30",
    textColor: "text-primary",
    iconColor: "text-primary",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-warm-gray/10 dark:bg-warm-gray/20",
    borderColor: "border-warm-gray/20 dark:border-warm-gray/30",
    textColor: "text-warm-gray",
    iconColor: "text-warm-gray",
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-warm-gray/10 dark:bg-warm-gray/20",
    borderColor: "border-warm-gray/20 dark:border-warm-gray/30",
    textColor: "text-warm-gray",
    iconColor: "text-warm-gray",
  },
};

export function NotificationBanner({
  type = "info",
  title,
  message,
  dismissible = true,
  onDismiss,
  action,
  variant = "banner",
  size = "md",
  className,
  ...props
}: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  const config = typeConfig[type];
  const IconComponent = config.icon;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const sizeClasses = {
    sm: {
      container: "p-3",
      text: "text-sm",
      icon: "sm" as const,
      spacing: "gap-3",
    },
    md: {
      container: "p-4",
      text: "text-base",
      icon: "md" as const,
      spacing: "gap-4",
    },
    lg: {
      container: "p-6",
      text: "text-lg",
      icon: "lg" as const,
      spacing: "gap-4",
    },
  };

  const variantClasses = {
    banner: "w-full",
    toast: "max-w-md rounded-lg shadow-lg",
    inline: "rounded-md",
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "flex items-start border",
        config.bgColor,
        config.borderColor,
        variantClasses[variant],
        sizeClasses[size].container,
        sizeClasses[size].spacing,
        variant === "banner" && "border-y-0 border-l-4 border-r-0 border-l-current",
        variant !== "banner" && "border",
        className
      )}
      role="alert"
      {...props}
    >
      {/* Icon */}
      <LucideIcon
        icon={IconComponent}
        size={sizeClasses[size].icon}
        className={cn(config.iconColor, "mt-0.5 shrink-0")}
      />

      {/* Content */}
      <div className="min-w-0 flex-1">
        {title && (
          <div className={cn("mb-1 font-semibold", config.textColor, sizeClasses[size].text)}>
            {title}
          </div>
        )}
        
        <Paragraph 
          className={cn(
            "m-0 leading-relaxed", 
            config.textColor,
            sizeClasses[size].text
          )}
        >
          {message}
        </Paragraph>

        {/* Action Button */}
        {action && (
          <button
            onClick={action.onClick}
            className={cn(
              "mt-3 rounded-md px-3 py-1.5 text-sm font-medium",
              "border border-current",
              "hover:bg-current hover:bg-opacity-10",
              "transition-colors duration-200",
              config.textColor
            )}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Dismiss Button */}
      {dismissible && (
        <IconButton
          icon={<LucideIcon icon={X} size="sm" />}
          onClick={handleDismiss}
          variant="ghost"
          size="sm"
          aria-label="Dismiss notification"
          className={cn(
            "ml-2 shrink-0",
            config.textColor,
            "hover:bg-current hover:bg-opacity-20"
          )}
        />
      )}
    </div>
  );
}