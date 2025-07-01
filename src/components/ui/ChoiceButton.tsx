import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ChoiceButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  description?: string;
  selected?: boolean;
  multiSelect?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "card" | "minimal";
  icon?: React.ReactNode;
  shortcut?: string;
}

const optionSizes = {
  sm: {
    container: "min-h-[44px] px-3 py-2 text-sm",
    description: "text-xs",
  },
  md: {
    container: "min-h-[52px] px-4 py-3 text-base",
    description: "text-sm",
  },
  lg: {
    container: "min-h-[60px] px-5 py-4 text-lg",
    description: "text-base",
  },
};

const optionVariants = {
  default: {
    base: "border-2 rounded-lg transition-all duration-200",
    unselected: "border-light-gray bg-off-white dark:bg-off-black hover:border-primary/50 hover:bg-light-gray/50",
    selected: "border-primary bg-primary/5 text-off-black dark:text-off-white",
    active: "scale-[0.98] bg-primary/10",
  },
  card: {
    base: "border rounded-lg shadow-sm transition-all duration-200",
    unselected: "border-light-gray bg-off-white dark:bg-off-black hover:shadow-md hover:border-primary/30",
    selected: "border-primary bg-primary/5 shadow-md",
    active: "scale-[0.98]",
  },
  minimal: {
    base: "border-0 rounded-lg transition-all duration-200",
    unselected: "bg-light-gray/50 hover:bg-light-gray",
    selected: "bg-primary text-off-white",
    active: "scale-[0.98]",
  },
};

export function ChoiceButton({
  label,
  description,
  selected = false,
  multiSelect = false,
  size = "md",
  variant = "default",
  icon,
  shortcut,
  className,
  disabled,
  ...props
}: ChoiceButtonProps) {
  const sizeConfig = optionSizes[size];
  const variantConfig = optionVariants[variant];

  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "w-full text-left font-medium",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "touch-manipulation", // Optimize for touch
        variantConfig.base,
        sizeConfig.container,
        selected ? variantConfig.selected : variantConfig.unselected,
        "active:" + variantConfig.active,
        className
      )}
      role={multiSelect ? "checkbox" : "radio"}
      aria-checked={selected}
      {...props}
    >
      <div className="flex items-center gap-3 w-full">
        {/* Selection Indicator */}
        <div className={cn(
          "flex-shrink-0 flex items-center justify-center",
          "w-5 h-5 rounded border-2 transition-colors",
          multiSelect ? "rounded-sm" : "rounded-full",
          selected 
            ? "border-primary bg-primary text-off-white"
            : "border-warm-gray bg-off-white dark:bg-off-black"
        )}>
          {selected && <Check className="w-3 h-3" />}
        </div>

        {/* Icon */}
        {icon && (
          <div className="flex-shrink-0 text-warm-gray">
            {icon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-medium truncate">{label}</span>
            {shortcut && (
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 border border-light-gray rounded text-xs font-mono bg-light-gray text-warm-gray">
                {shortcut}
              </kbd>
            )}
          </div>
          
          {description && (
            <p className={cn(
              "text-warm-gray mt-1 leading-tight",
              sizeConfig.description
            )}>
              {description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

interface OptionGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  layout?: "vertical" | "horizontal" | "grid";
  spacing?: "tight" | "normal" | "loose";
  columns?: 1 | 2 | 3 | 4;
}

export function OptionGroup({
  children,
  layout = "vertical",
  spacing = "normal",
  columns = 2,
  className,
  ...props
}: OptionGroupProps) {
  const spacingStyles = {
    tight: "gap-2",
    normal: "gap-3",
    loose: "gap-4",
  };

  const layoutStyles = {
    vertical: "flex flex-col",
    horizontal: "flex flex-wrap",
    grid: `grid grid-cols-1 sm:grid-cols-${columns}`,
  };

  return (
    <div
      className={cn(
        layoutStyles[layout],
        spacingStyles[spacing],
        className
      )}
      role="group"
      {...props}
    >
      {children}
    </div>
  );
}

interface LargeButtonChoiceProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  subtitle?: string;
  selected?: boolean;
  emoji?: string;
  badge?: string;
}

export function LargeButtonChoice({
  title,
  subtitle,
  selected = false,
  emoji,
  badge,
  className,
  ...props
}: LargeButtonChoiceProps) {
  return (
    <button
      type="button"
      className={cn(
        "relative w-full min-h-[80px] p-4",
        "border-2 rounded-xl transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "touch-manipulation",
        selected
          ? "border-primary bg-primary/5 text-off-black dark:text-off-white"
          : "border-light-gray bg-off-white dark:bg-off-black hover:border-primary/50 hover:bg-light-gray/50",
        "active:scale-[0.98]",
        className
      )}
      aria-pressed={selected}
      {...props}
    >
      <div className="flex items-center gap-4">
        {emoji && (
          <span className="text-2xl flex-shrink-0" role="img">
            {emoji}
          </span>
        )}
        
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-lg leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-warm-gray mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {badge && (
          <span className="flex-shrink-0 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
            {badge}
          </span>
        )}
      </div>

      {selected && (
        <div className="absolute top-2 right-2">
          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-off-white" />
          </div>
        </div>
      )}
    </button>
  );
}