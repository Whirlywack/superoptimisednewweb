import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  removable?: boolean;
  onRemove?: () => void;
  children: React.ReactNode;
}

const tagVariants = {
  default: [
    "bg-primary/10 text-primary",
    "border-primary/20",
  ],
  secondary: [
    "bg-muted text-muted-foreground",
    "border-border",
  ],
  success: [
    "bg-light-gray text-primary",
    "border-primary",
  ],
  warning: [
    "bg-light-gray text-warm-gray",
    "border-warm-gray",
  ],
  danger: [
    "bg-light-gray text-warm-gray",
    "border-warm-gray",
  ],
};

const tagSizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

export function Tag({
  className,
  variant = "default",
  size = "md",
  removable = false,
  onRemove,
  children,
  ...props
}: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1",
        "rounded-full font-medium",
        "border",
        "transition-colors",
        tagSizes[size],
        tagVariants[variant],
        className
      )}
      {...props}
    >
      {children}
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            "inline-flex items-center justify-center",
            "rounded-full",
            "hover:bg-current hover:bg-opacity-20",
            "transition-colors",
            "focus:outline-none focus:ring-1 focus:ring-current",
            size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5"
          )}
          aria-label="Remove tag"
        >
          <X className={size === "sm" ? "h-2 w-2" : size === "md" ? "h-2.5 w-2.5" : "h-3 w-3"} />
        </button>
      )}
    </span>
  );
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const badgeVariants = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  outline: "border border-input bg-background text-foreground",
  success: "bg-primary text-off-white",
  warning: "bg-warm-gray text-off-white",
  danger: "bg-warm-gray text-off-white",
};

const badgeSizes = {
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-2 py-1 text-xs",
  lg: "px-2.5 py-1 text-sm",
};

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        "rounded-md font-semibold",
        "transition-colors",
        badgeSizes[size],
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}