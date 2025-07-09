import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Filter, X } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  options: FilterOption[];
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  variant?: "pills" | "buttons";
  size?: "sm" | "md" | "lg";
  allowMultiple?: boolean;
  showClearAll?: boolean;
  showFilterIcon?: boolean;
  className?: string;
}

export function FilterButtonGroup({
  options,
  selectedIds,
  onSelectionChange,
  variant = "pills",
  size = "md",
  allowMultiple = true,
  showClearAll = true,
  showFilterIcon = false,
  className,
  ...props
}: FilterButtonGroupProps) {
  const handleOptionClick = (optionId: string) => {
    if (allowMultiple) {
      if (selectedIds.includes(optionId)) {
        onSelectionChange(selectedIds.filter(id => id !== optionId));
      } else {
        onSelectionChange([...selectedIds, optionId]);
      }
    } else {
      if (selectedIds.includes(optionId)) {
        onSelectionChange([]);
      } else {
        onSelectionChange([optionId]);
      }
    }
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const hasActiveFilters = selectedIds.length > 0;

  const buttonSizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-5 text-base",
  };

  const pillVariantClasses = "rounded-full";
  const buttonVariantClasses = "rounded-lg";

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      {showFilterIcon && (
        <div className="mr-2 flex items-center gap-2">
          <LucideIcon 
            icon={Filter} 
            size="sm" 
            className="text-warm-gray" 
          />
          <span className="text-sm text-warm-gray">Filter:</span>
        </div>
      )}

      {options.map((option) => {
        const isSelected = selectedIds.includes(option.id);
        
        return (
          <button
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            className={cn(
              // Base styles
              "inline-flex items-center justify-center gap-1.5",
              "font-medium transition-all duration-200",
              "border",
              // Size
              buttonSizes[size],
              // Variant shape
              variant === "pills" ? pillVariantClasses : buttonVariantClasses,
              // Selection state
              isSelected
                ? [
                    "bg-primary text-primary-foreground",
                    "border-primary",
                    "hover:bg-primary/90",
                  ]
                : [
                    "bg-off-white dark:bg-off-black",
                    "text-off-black dark:text-off-white",
                    "border-light-gray dark:border-warm-gray/30",
                    "hover:bg-light-gray dark:hover:bg-warm-gray/20",
                    "hover:border-primary/50",
                  ],
              // Focus state
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            )}
          >
            <span>{option.label}</span>
            {option.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs",
                  isSelected
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-warm-gray/20 text-warm-gray"
                )}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}

      {showClearAll && hasActiveFilters && (
        <button
          onClick={handleClearAll}
          className={cn(
            // Base styles
            "inline-flex items-center justify-center gap-1.5",
            "font-medium transition-all duration-200",
            "text-warm-gray hover:text-off-black dark:hover:text-off-white",
            "hover:bg-light-gray dark:hover:bg-warm-gray/20",
            // Size
            buttonSizes[size],
            // Variant shape
            variant === "pills" ? pillVariantClasses : buttonVariantClasses,
            // Focus state
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          )}
        >
          <LucideIcon icon={X} size="xs" />
          <span>Clear all</span>
        </button>
      )}
    </div>
  );
}