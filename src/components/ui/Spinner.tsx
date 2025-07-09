import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "primary" | "secondary";
  speed?: "slow" | "normal" | "fast";
}

const spinnerSizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6", 
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

const spinnerVariants = {
  default: "border-border border-t-foreground",
  primary: "border-primary/30 border-t-primary",
  secondary: "border-secondary/30 border-t-secondary-foreground",
};

const spinnerSpeeds = {
  slow: "animate-spin [animation-duration:2s]",
  normal: "animate-spin [animation-duration:1s]", 
  fast: "animate-spin [animation-duration:0.5s]",
};

export function Spinner({
  className,
  size = "md",
  variant = "default",
  speed = "normal",
  ...props
}: SpinnerProps) {
  return (
    <div
      className={cn(
        "inline-block rounded-full border-2 border-solid",
        spinnerSizes[size],
        spinnerVariants[variant],
        spinnerSpeeds[speed],
        className
      )}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "dots" | "bars" | "pulse" | "spin";
  color?: "default" | "primary" | "secondary";
}

const loaderSizes = {
  sm: { container: "h-4", item: "h-1 w-1" },
  md: { container: "h-6", item: "h-1.5 w-1.5" },
  lg: { container: "h-8", item: "h-2 w-2" },
  xl: { container: "h-12", item: "h-3 w-3" },
};

const loaderColors = {
  default: "bg-foreground",
  primary: "bg-primary",
  secondary: "bg-secondary-foreground",
};

export function Loader({
  className,
  size = "md",
  variant = "dots",
  color = "default",
  ...props
}: LoaderProps) {
  const sizeConfig = loaderSizes[size];
  const colorClass = loaderColors[color];

  if (variant === "spin") {
    return <Spinner size={size} variant={color} className={className} {...props} />;
  }

  if (variant === "dots") {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center gap-1",
          sizeConfig.container,
          className
        )}
        role="status"
        aria-label="Loading"
        {...props}
      >
        <div
          className={cn(
            "animate-bounce rounded-full",
            sizeConfig.item,
            colorClass,
            "[animation-delay:-0.3s]"
          )}
        />
        <div
          className={cn(
            "animate-bounce rounded-full",
            sizeConfig.item,
            colorClass,
            "[animation-delay:-0.15s]"
          )}
        />
        <div
          className={cn(
            "animate-bounce rounded-full",
            sizeConfig.item,
            colorClass
          )}
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === "bars") {
    return (
      <div
        className={cn(
          "inline-flex items-end justify-center gap-0.5",
          sizeConfig.container,
          className
        )}
        role="status"
        aria-label="Loading"
        {...props}
      >
        <div
          className={cn(
            "w-1 animate-pulse",
            colorClass,
            "[animation-delay:-0.4s] [animation-duration:1.2s]"
          )}
          style={{ height: "40%" }}
        />
        <div
          className={cn(
            "w-1 animate-pulse",
            colorClass,
            "[animation-delay:-0.2s] [animation-duration:1.2s]"
          )}
          style={{ height: "70%" }}
        />
        <div
          className={cn(
            "w-1 animate-pulse",
            colorClass,
            "[animation-duration:1.2s]"
          )}
          style={{ height: "100%" }}
        />
        <div
          className={cn(
            "w-1 animate-pulse",
            colorClass,
            "[animation-delay:-0.2s] [animation-duration:1.2s]"
          )}
          style={{ height: "70%" }}
        />
        <div
          className={cn(
            "w-1 animate-pulse",
            colorClass,
            "[animation-delay:-0.4s] [animation-duration:1.2s]"
          )}
          style={{ height: "40%" }}
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center",
          sizeConfig.container,
          className
        )}
        role="status"
        aria-label="Loading"
        {...props}
      >
        <div
          className={cn(
            "animate-ping rounded-full",
            sizeConfig.item,
            colorClass.replace("bg-", "bg-"),
            "opacity-75"
          )}
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return null;
}