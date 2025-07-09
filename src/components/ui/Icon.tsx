import React from "react";
import { cn } from "@/lib/utils";

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const iconSizes = {
  xs: "h-3 w-3",
  sm: "h-4 w-4", 
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

export function Icon({ 
  children, 
  size = "md", 
  className,
  ...props 
}: IconProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center",
        "shrink-0 text-current",
        iconSizes[size],
        className
      )}
      role="img"
      {...props}
    >
      {children}
    </span>
  );
}

interface LucideIconProps extends React.SVGAttributes<SVGElement> {
  icon: React.ComponentType<React.SVGAttributes<SVGElement>>;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function LucideIcon({ 
  icon: IconComponent, 
  size = "md", 
  className,
  ...props 
}: LucideIconProps) {
  return (
    <IconComponent
      className={cn(
        iconSizes[size],
        "shrink-0 text-current",
        className
      )}
      {...props}
    />
  );
}