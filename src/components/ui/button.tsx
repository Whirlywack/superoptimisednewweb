import React from "react";
import { cn, accessibility } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

const buttonVariants = {
  primary: [
    "bg-primary text-primary-foreground",
    "hover:bg-primary/90",
    "active:bg-primary/95 active:scale-[0.98]",
    "disabled:bg-primary/50 disabled:cursor-not-allowed",
  ],
  outline: [
    "border border-primary text-primary bg-transparent",
    "hover:bg-primary hover:text-primary-foreground",
    "active:bg-primary/95 active:scale-[0.98]",
    "disabled:border-primary/50 disabled:text-primary/50 disabled:cursor-not-allowed",
  ],
  ghost: [
    "text-primary bg-transparent",
    "hover:bg-primary/10",
    "active:bg-primary/20 active:scale-[0.98]",
    "disabled:text-primary/50 disabled:cursor-not-allowed",
  ],
  link: [
    "text-primary bg-transparent p-0 h-auto",
    "underline underline-offset-4 decoration-2",
    "hover:text-primary/80",
    "active:text-primary/90",
    "disabled:text-primary/50 disabled:cursor-not-allowed",
  ],
};

const buttonSizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-base",
  lg: "h-12 px-6 text-lg",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  asChild = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  
  const isDisabled = disabled || loading;

  return (
    <Comp
      className={cn(
        // Base styles
        "inline-flex items-center justify-center gap-2",
        "rounded-lg font-medium",
        "transition-all duration-200",
        "whitespace-nowrap",
        // Accessibility
        accessibility.focusRing,
        accessibility.touchTarget,
        // Size
        buttonSizes[size],
        // Variant
        buttonVariants[variant],
        // Loading state
        loading && "cursor-wait",
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </Comp>
  );
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon: React.ReactNode;
  loading?: boolean;
  "aria-label": string;
}

const iconButtonSizes = {
  sm: "h-9 w-9",
  md: "h-11 w-11", 
  lg: "h-12 w-12",
};

export function IconButton({
  className,
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  disabled,
  "aria-label": ariaLabel,
  ...props
}: IconButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        // Base styles
        "inline-flex items-center justify-center",
        "rounded-lg",
        "transition-all duration-200",
        // Accessibility
        accessibility.focusRing,
        accessibility.touchTarget,
        // Size
        iconButtonSizes[size],
        // Variant
        buttonVariants[variant],
        // Loading state
        loading && "cursor-wait",
        className
      )}
      disabled={isDisabled}
      aria-label={ariaLabel}
      {...props}
    >
      {loading ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
      )}
    </button>
  );
}

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  external?: boolean;
  children: React.ReactNode;
}

export function LinkButton({
  className,
  variant = "primary",
  size = "md",
  external = false,
  children,
  ...props
}: LinkButtonProps) {
  const externalProps = external 
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a
      className={cn(
        // Base styles
        "inline-flex items-center justify-center gap-2",
        "rounded-lg font-medium",
        "transition-all duration-200",
        "whitespace-nowrap no-underline",
        // Accessibility
        accessibility.focusRing,
        accessibility.touchTarget,
        // Size
        buttonSizes[size],
        // Variant
        buttonVariants[variant],
        className
      )}
      {...externalProps}
      {...props}
    >
      {children}
      {external && (
        <span className="ml-1 text-xs" aria-hidden="true">
          ↗
        </span>
      )}
    </a>
  );
}