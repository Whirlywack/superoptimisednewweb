import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../ui/Icon';
import { Check, ChevronRight } from 'lucide-react';

export interface LargeButtonChoiceOption {
  /** Unique identifier for the option */
  value: string;
  /** Display label for the option */
  label: string;
  /** Optional description text */
  description?: string;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Whether this option is disabled */
  disabled?: boolean;
  /** Optional badge text (e.g., "Popular", "Recommended") */
  badge?: string;
  /** Badge variant for styling */
  badgeVariant?: 'default' | 'success' | 'warning' | 'error';
}

export interface LargeButtonChoiceProps {
  /** Array of options to choose from */
  options: LargeButtonChoiceOption[];
  /** Currently selected value(s) */
  value?: string | string[];
  /** Allow multiple selections */
  multiple?: boolean;
  /** Layout orientation */
  layout?: 'vertical' | 'grid';
  /** Grid columns when using grid layout */
  columns?: 2 | 3 | 4;
  /** Button size variant */
  size?: 'medium' | 'large' | 'xl';
  /** Visual style variant */
  variant?: 'default' | 'outlined' | 'filled' | 'minimal';
  /** Show selection indicators */
  showIndicators?: boolean;
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Custom button height (overrides size) */
  height?: number;
  /** Callback when selection changes */
  onChange?: (value: string | string[]) => void;
  /** Additional CSS classes */
  className?: string;
  /** Disable all options */
  disabled?: boolean;
  /** Show loading state */
  loading?: boolean;
}

export function LargeButtonChoice({
  options,
  value,
  multiple = false,
  layout = 'vertical',
  columns = 2,
  size = 'large',
  variant = 'outlined',
  showIndicators = true,
  showArrows = false,
  height,
  onChange,
  className,
  disabled = false,
  loading = false,
}: LargeButtonChoiceProps) {
  const selectedValues = React.useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);
  
  const handleOptionClick = (optionValue: string, optionDisabled?: boolean) => {
    if (disabled || loading || optionDisabled) return;
    
    if (multiple) {
      const newSelection = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange?.(newSelection);
    } else {
      onChange?.(optionValue);
    }
  };
  
  const getSizeStyles = () => {
    if (height) {
      return { minHeight: `${height}px` };
    }
    
    switch (size) {
      case 'medium':
        return { minHeight: '60px' }; // Above 44px minimum
      case 'xl':
        return { minHeight: '80px' };
      default: // large
        return { minHeight: '72px' };
    }
  };
  
  const getVariantStyles = (isSelected: boolean, isDisabled?: boolean) => {
    const baseClasses = [
      'w-full p-4 rounded-lg transition-all duration-200',
      'border-2 font-medium text-left',
      'active:scale-[0.98] active:duration-75',
      'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
      'dark:focus:ring-offset-gray-900',
    ];
    
    if (isDisabled) {
      baseClasses.push('opacity-50 cursor-not-allowed');
    } else if (loading) {
      baseClasses.push('opacity-75 cursor-wait');
    } else {
      baseClasses.push('cursor-pointer');
    }
    
    switch (variant) {
      case 'filled':
        return cn(baseClasses, {
          'bg-primary text-white border-primary': isSelected,
          'bg-light-gray dark:bg-gray-800 text-off-black dark:text-off-white border-light-gray dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700': !isSelected,
        });
      
      case 'minimal':
        return cn(baseClasses, {
          'bg-primary/10 text-primary border-primary/20': isSelected,
          'bg-transparent text-off-black dark:text-off-white border-transparent hover:bg-light-gray dark:hover:bg-gray-800': !isSelected,
        });
      
      case 'default':
        return cn(baseClasses, {
          'bg-primary/5 text-primary border-primary shadow-sm': isSelected,
          'bg-white dark:bg-gray-800 text-off-black dark:text-off-white border-light-gray dark:border-gray-700 shadow-sm hover:shadow-md hover:border-primary/30': !isSelected,
        });
      
      default: // outlined
        return cn(baseClasses, {
          'bg-primary/5 text-primary border-primary': isSelected,
          'bg-white dark:bg-gray-800 text-off-black dark:text-off-white border-light-gray dark:border-gray-700 hover:border-primary/50': !isSelected,
        });
    }
  };
  
  const getBadgeStyles = (badgeVariant?: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    
    switch (badgeVariant) {
      case 'success':
        return cn(baseClasses, 'bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary');
      case 'warning':
        return cn(baseClasses, 'bg-light-gray text-warm-gray dark:bg-gray-800 dark:text-warm-gray');
      case 'error':
        return cn(baseClasses, 'bg-light-gray text-warm-gray dark:bg-gray-800 dark:text-warm-gray');
      default:
        return cn(baseClasses, 'bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary');
    }
  };
  
  const getLayoutClasses = () => {
    if (layout === 'grid') {
      return cn('grid gap-3', {
        'grid-cols-2': columns === 2,
        'grid-cols-3': columns === 3,
        'grid-cols-4': columns === 4,
      });
    }
    return 'flex flex-col gap-3';
  };
  
  if (loading && options.length === 0) {
    return (
      <div className={cn("space-y-3", className)}>
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="w-full h-16 bg-light-gray dark:bg-gray-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }
  
  return (
    <div className={cn(getLayoutClasses(), className)} role="radiogroup" aria-label="Choice options">
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        const isDisabled = disabled || option.disabled;
        
        return (
          <button
            key={option.value}
            type="button"
            role={multiple ? "checkbox" : "radio"}
            aria-checked={isSelected}
            aria-disabled={isDisabled}
            style={getSizeStyles()}
            className={getVariantStyles(isSelected, isDisabled)}
            onClick={() => handleOptionClick(option.value, option.disabled)}
            disabled={isDisabled || loading}
          >
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {option.icon && (
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    <Icon size={20} className={isSelected ? 'text-current' : 'text-warm-gray'}>
                      {option.icon}
                    </Icon>
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-base leading-tight">
                      {option.label}
                    </span>
                    {option.badge && (
                      <span className={getBadgeStyles(option.badgeVariant)}>
                        {option.badge}
                      </span>
                    )}
                  </div>
                  
                  {option.description && (
                    <p className="text-sm text-warm-gray leading-tight line-clamp-2">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {showIndicators && (
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      {
                        'bg-primary border-primary': isSelected,
                        'border-warm-gray': !isSelected,
                        'border-gray-300': isDisabled,
                      }
                    )}
                  >
                    {isSelected && (
                      <Icon size={12} className="text-white">
                        <Check />
                      </Icon>
                    )}
                  </div>
                )}
                
                {showArrows && !showIndicators && (
                  <Icon size={16} className="text-warm-gray">
                    <ChevronRight />
                  </Icon>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default LargeButtonChoice;