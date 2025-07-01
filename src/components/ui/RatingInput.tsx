import React from "react";
import { cn } from "@/lib/utils";

interface RatingInputProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: number;
  selected?: boolean;
  hovered?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "dot" | "number" | "star" | "emoji";
  label?: string;
  color?: "default" | "primary" | "success" | "warning" | "danger";
}

const dotSizes = {
  sm: {
    container: "w-8 h-8 text-xs",
    touch: "min-w-[44px] min-h-[44px] -m-2 p-2", // Extended touch target
  },
  md: {
    container: "w-10 h-10 text-sm", 
    touch: "min-w-[44px] min-h-[44px] -m-1 p-1",
  },
  lg: {
    container: "w-12 h-12 text-base",
    touch: "min-w-[48px] min-h-[48px]",
  },
};

const dotColors = {
  default: {
    unselected: "border-border bg-background text-muted-foreground hover:border-primary/50",
    selected: "border-primary bg-primary text-primary-foreground",
    hovered: "border-primary/70 bg-primary/10 text-primary",
  },
  primary: {
    unselected: "border-light-gray bg-off-white text-warm-gray hover:border-primary/50",
    selected: "border-primary bg-primary text-off-white",
    hovered: "border-primary/70 bg-primary/10 text-primary",
  },
  success: {
    unselected: "border-light-gray bg-off-white text-warm-gray hover:border-primary/50",
    selected: "border-primary bg-primary text-off-white",
    hovered: "border-primary/70 bg-primary/10 text-primary",
  },
  warning: {
    unselected: "border-light-gray bg-off-white text-warm-gray hover:border-warm-gray/50",
    selected: "border-warm-gray bg-warm-gray text-off-white",
    hovered: "border-warm-gray/70 bg-warm-gray/10 text-warm-gray",
  },
  danger: {
    unselected: "border-light-gray bg-off-white text-warm-gray hover:border-warm-gray/50",
    selected: "border-warm-gray bg-warm-gray text-off-white",
    hovered: "border-warm-gray/70 bg-warm-gray/10 text-warm-gray",
  },
};

export function RatingInput({
  value,
  selected = false,
  hovered = false,
  size = "md",
  variant = "dot",
  label,
  color = "default",
  className,
  ...props
}: RatingInputProps) {
  const sizeConfig = dotSizes[size];
  const colorConfig = dotColors[color];

  const getColorClass = () => {
    if (selected) return colorConfig.selected;
    if (hovered) return colorConfig.hovered;
    return colorConfig.unselected;
  };

  const renderContent = () => {
    switch (variant) {
      case "number":
        return value;
      case "star":
        return "★";
      case "emoji":
        // Return different emojis based on value (1-10 scale)
        const emojiMap = {
          1: "😢", 2: "😞", 3: "😐", 4: "🙂", 5: "😊",
          6: "😀", 7: "😃", 8: "😄", 9: "😍", 10: "🤩"
        };
        return emojiMap[value as keyof typeof emojiMap] || "⭐";
      default:
        return null;
    }
  };

  return (
    <button
      type="button"
      className={cn(
        "relative flex items-center justify-center",
        "border-2 rounded-full transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "font-medium touch-manipulation",
        sizeConfig.touch, // Extended touch target
        className
      )}
      aria-label={label || `Rating ${value}`}
      aria-pressed={selected}
      {...props}
    >
      <div className={cn(
        "flex items-center justify-center rounded-full transition-all duration-200",
        sizeConfig.container,
        getColorClass()
      )}>
        {renderContent()}
      </div>
    </button>
  );
}

interface RatingScaleProps extends React.HTMLAttributes<HTMLDivElement> {
  min?: number;
  max?: number;
  value?: number;
  onChange?: (value: number) => void;
  labels?: { min?: string; max?: string; mid?: string };
  size?: "sm" | "md" | "lg";
  variant?: "dot" | "number" | "star" | "emoji";
  color?: "default" | "primary" | "success" | "warning" | "danger";
  allowHalf?: boolean;
  showValue?: boolean;
  disabled?: boolean;
}

export function RatingScale({
  min = 1,
  max = 10,
  value,
  onChange,
  labels,
  size = "md",
  variant = "number",
  color = "default",
  allowHalf = false,
  showValue = false,
  disabled = false,
  className,
  ...props
}: RatingScaleProps) {
  const [hoveredValue, setHoveredValue] = React.useState<number | null>(null);
  
  const range = max - min + 1;
  const values = Array.from({ length: range }, (_, i) => min + i);

  const handleClick = (clickedValue: number) => {
    if (disabled) return;
    onChange?.(clickedValue);
  };

  const handleMouseEnter = (hoveredVal: number) => {
    if (disabled) return;
    setHoveredValue(hoveredVal);
  };

  const handleMouseLeave = () => {
    setHoveredValue(null);
  };

  return (
    <div className={cn("space-y-3", className)} {...props}>
      {/* Rating Dots */}
      <div 
        className="flex items-center justify-center gap-2 flex-wrap"
        role="radiogroup"
        aria-label="Rating scale"
      >
        {values.map((dotValue) => (
          <RatingInput
            key={dotValue}
            value={dotValue}
            selected={value === dotValue}
            hovered={hoveredValue === dotValue || (hoveredValue !== null && dotValue <= hoveredValue)}
            size={size}
            variant={variant}
            color={color}
            disabled={disabled}
            onClick={() => handleClick(dotValue)}
            onMouseEnter={() => handleMouseEnter(dotValue)}
            onMouseLeave={handleMouseLeave}
          />
        ))}
      </div>

      {/* Labels */}
      {labels && (
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{labels.min}</span>
          {labels.mid && range > 6 && (
            <span className="hidden sm:inline">{labels.mid}</span>
          )}
          <span>{labels.max}</span>
        </div>
      )}

      {/* Current Value Display */}
      {showValue && value !== undefined && (
        <div className="text-center">
          <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
            {value} / {max}
          </span>
        </div>
      )}
    </div>
  );
}

interface LikertScaleProps extends React.HTMLAttributes<HTMLDivElement> {
  options: Array<{
    value: string;
    label: string;
    shortLabel?: string;
  }>;
  value?: string;
  onChange?: (value: string) => void;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  disabled?: boolean;
}

export function LikertScale({
  options,
  value,
  onChange,
  size = "md",
  layout = "horizontal",
  disabled = false,
  className,
  ...props
}: LikertScaleProps) {
  const isVertical = layout === "vertical";
  
  return (
    <div 
      className={cn(
        "space-y-3",
        className
      )} 
      {...props}
    >
      <div 
        className={cn(
          "flex gap-2",
          isVertical ? "flex-col" : "flex-row items-center justify-center flex-wrap"
        )}
        role="radiogroup"
        aria-label="Likert scale"
      >
        {options.map((option, index) => {
          const isSelected = value === option.value;
          const isMiddle = Math.floor(options.length / 2) === index;
          
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              className={cn(
                "px-3 py-2 rounded-lg border-2 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "touch-manipulation min-h-[44px]",
                size === "sm" && "px-2 py-1 text-sm min-h-[40px]",
                size === "lg" && "px-4 py-3 text-lg min-h-[48px]",
                isVertical ? "w-full text-left" : "flex-1 text-center",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:border-primary/50 hover:bg-muted/50",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => onChange?.(option.value)}
              aria-pressed={isSelected}
            >
              <span className={cn(
                "font-medium",
                !isVertical && "sm:hidden"
              )}>
                {option.shortLabel || option.label}
              </span>
              <span className={cn(
                "font-medium",
                !isVertical && "hidden sm:inline"
              )}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}