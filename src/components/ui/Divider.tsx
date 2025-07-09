import React from "react";
import { cn } from "@/lib/utils";

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "dashed" | "dotted" | "gradient";
  size?: "sm" | "md" | "lg";
  label?: string;
  labelPosition?: "left" | "center" | "right";
  spacing?: "sm" | "md" | "lg" | "xl";
}

const horizontalSizes = {
  sm: "h-px",
  md: "h-0.5",
  lg: "h-1",
};

const verticalSizes = {
  sm: "w-px",
  md: "w-0.5", 
  lg: "w-1",
};

const spacingStyles = {
  sm: "my-4",
  md: "my-6",
  lg: "my-8",
  xl: "my-12",
};

const dividerVariants = {
  default: "bg-border",
  dashed: "border-dashed border-t border-border bg-transparent",
  dotted: "border-dotted border-t border-border bg-transparent",
  gradient: "bg-gradient-to-r from-transparent via-border to-transparent",
};

export function Divider({
  orientation = "horizontal",
  variant = "default",
  size = "sm",
  label,
  labelPosition = "center",
  spacing = "md",
  className,
  ...props
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        className={cn(
          "inline-block",
          verticalSizes[size],
          variant === "default" ? "bg-border" : "border-l border-border",
          variant === "dashed" && "border-dashed",
          variant === "dotted" && "border-dotted",
          className
        )}
        role="separator"
        aria-orientation="vertical"
        {...props}
      />
    );
  }

  if (label) {
    const labelPositionStyles = {
      left: "justify-start",
      center: "justify-center", 
      right: "justify-end",
    };

    return (
      <div
        className={cn("flex items-center", spacingStyles[spacing], className)}
        role="separator"
        aria-orientation="horizontal"
        {...props}
      >
        {labelPosition !== "left" && (
          <div className={cn("flex-1", horizontalSizes[size], dividerVariants[variant])} />
        )}
        
        <div className={cn("whitespace-nowrap px-3 text-sm text-muted-foreground")}>
          {label}
        </div>
        
        {labelPosition !== "right" && (
          <div className={cn("flex-1", horizontalSizes[size], dividerVariants[variant])} />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full",
        horizontalSizes[size],
        dividerVariants[variant],
        spacingStyles[spacing],
        className
      )}
      role="separator"
      aria-orientation="horizontal"
      {...props}
    />
  );
}

interface SectionDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  variant?: "default" | "emphasized" | "subtle";
  spacing?: "sm" | "md" | "lg" | "xl";
}

export function SectionDivider({
  title,
  subtitle,
  icon,
  variant = "default",
  spacing = "lg",
  className,
  ...props
}: SectionDividerProps) {
  const variantStyles = {
    default: "border-border",
    emphasized: "border-border border-2",
    subtle: "border-border/50",
  };

  return (
    <div
      className={cn("text-center", spacingStyles[spacing], className)}
      {...props}
    >
      {(title || subtitle || icon) && (
        <div className="relative">
          <div className={cn("absolute inset-0 flex items-center")}>
            <div className={cn("w-full border-t", variantStyles[variant])} />
          </div>
          
          <div className="relative flex justify-center">
            <div className="flex items-center gap-2 bg-background px-4">
              {icon && <span className="text-muted-foreground">{icon}</span>}
              
              <div className="text-center">
                {title && (
                  <h3 className="text-sm font-semibold text-foreground">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  axis?: "vertical" | "horizontal";
}

const spacerSizes = {
  xs: "2",
  sm: "4", 
  md: "6",
  lg: "8",
  xl: "12",
  "2xl": "16",
};

export function Spacer({
  size = "md",
  axis = "vertical",
  className,
  ...props
}: SpacerProps) {
  const sizeValue = spacerSizes[size];
  
  return (
    <div
      className={cn(
        axis === "vertical" ? `h-${sizeValue}` : `w-${sizeValue}`,
        axis === "vertical" ? "w-full" : "h-full",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}