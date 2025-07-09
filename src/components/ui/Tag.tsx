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
  default: ["bg-primary/10 text-primary", "border-primary/20"],
  secondary: ["bg-light-gray text-warm-gray", "border-light-gray"],
  success: ["bg-light-gray text-primary", "border-primary"],
  warning: ["bg-light-gray text-warm-gray", "border-warm-gray"],
  danger: ["bg-light-gray text-warm-gray", "border-warm-gray"],
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
      data-testid="tag"
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
            "hover:bg-current/20",
            "transition-colors",
            "focus:outline-none focus:ring-1 focus:ring-current",
            size === "sm" ? "size-3" : size === "md" ? "size-4" : "size-5"
          )}
          aria-label="Remove tag"
          data-testid="remove-tag"
        >
          <X className={size === "sm" ? "size-2" : size === "md" ? "size-2.5" : "size-3"} />
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
  default: "bg-primary text-off-white",
  secondary: "bg-light-gray text-warm-gray",
  outline:
    "border border-light-gray bg-off-white dark:bg-off-black text-off-black dark:text-off-white",
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
