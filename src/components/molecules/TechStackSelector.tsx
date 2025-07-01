import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { QuestionLabel } from '@/components/questionnaire/QuestionLabel';
import { ValidationMessage } from '@/components/ui/ValidationMessage';
import { SkipControl } from '@/components/ui/SkipControl';
import { Checkbox } from '@/components/ui/Input';
import { Tag } from '@/components/ui/Tag';

export interface TechStackOption {
  id: string;
  label: string;
  description?: string;
  category?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  popular?: boolean;
}

export interface TechStackSelectorProps {
  /** Question text */
  question: string;
  /** Optional description or context */
  description?: string;
  /** Array of technology options */
  options: TechStackOption[];
  /** Currently selected option IDs */
  value?: string[];
  /** Callback when selection changes */
  onChange?: (value: string[]) => void;
  /** Whether the question is required */
  required?: boolean;
  /** Validation error message */
  error?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether to show skip option */
  allowSkip?: boolean;
  /** Skip callback */
  onSkip?: () => void;
  /** Maximum number of selections allowed */
  maxSelections?: number;
  /** Minimum number of selections required */
  minSelections?: number;
  /** Layout variant for options */
  layout?: 'grid' | 'list' | 'compact';
  /** Whether to group options by category */
  groupByCategory?: boolean;
  /** Whether to show selection count */
  showCount?: boolean;
  /** Helper text shown below input */
  helperText?: string;
  /** Additional CSS classes */
  className?: string;
}

export function TechStackSelector({
  question,
  description,
  options,
  value = [],
  onChange,
  required = false,
  error,
  disabled = false,
  allowSkip = false,
  onSkip,
  maxSelections,
  minSelections,
  layout = 'grid',
  groupByCategory = false,
  showCount = false,
  helperText,
  className,
}: TechStackSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggle = useCallback((optionId: string) => {
    if (disabled) return;

    const newValue = value.includes(optionId)
      ? value.filter(id => id !== optionId)
      : [...value, optionId];

    // Check max selections
    if (maxSelections && newValue.length > maxSelections && !value.includes(optionId)) {
      return;
    }

    onChange?.(newValue);
  }, [disabled, value, onChange, maxSelections]);

  const handleRemoveTag = useCallback((optionId: string) => {
    if (disabled) return;
    const newValue = value.filter(id => id !== optionId);
    onChange?.(newValue);
  }, [disabled, value, onChange]);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  }, []);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group options by category if requested
  const groupedOptions = groupByCategory
    ? filteredOptions.reduce((groups, option) => {
        const category = option.category || 'Other';
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(option);
        return groups;
      }, {} as Record<string, TechStackOption[]>)
    : { 'All': filteredOptions };

  // Get selected options for tag display
  const selectedOptions = options.filter(option => value.includes(option.id));

  const getLayoutClasses = () => {
    switch (layout) {
      case 'grid':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3';
      case 'list':
        return 'space-y-2';
      case 'compact':
        return 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2';
      default:
        return 'space-y-3';
    }
  };

  const isAtMaxSelections = maxSelections && value.length >= maxSelections;
  const isUnderMinSelections = minSelections && value.length < minSelections;

  const inputId = `tech-stack-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const counterId = showCount ? `${inputId}-counter` : undefined;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Question Header */}
      <div className="space-y-2">
        <QuestionLabel required={required}>
          {question}
        </QuestionLabel>
        {description && (
          <p className="text-warm-gray text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Search Input */}
      {options.length > 8 && (
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search technologies..."
            disabled={disabled}
            className={cn(
              "w-full rounded-lg px-4 py-3 text-base",
              "text-off-black dark:text-off-white",
              "placeholder:text-warm-gray",
              "border border-light-gray dark:border-warm-gray/30",
              "bg-off-white dark:bg-off-black",
              "focus:border-primary focus:ring-2 focus:ring-primary/20",
              "focus:outline-none transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          />
        </div>
      )}

      {/* Selected Technologies Tags */}
      {selectedOptions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-off-black dark:text-off-white">
            Selected Technologies:
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedOptions.map(option => (
              <Tag
                key={option.id}
variant="default"
                size="sm"
                removable={!disabled}
                onRemove={() => handleRemoveTag(option.id)}
              >
                {option.icon && <span className="mr-1">{option.icon}</span>}
                {option.label}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {/* Technology Options */}
      <div className="space-y-6">
        {Object.entries(groupedOptions).map(([category, categoryOptions]) => (
          <div key={category} className="space-y-3">
            {groupByCategory && category !== 'All' && (
              <h3 className="text-sm font-semibold text-off-black dark:text-off-white border-b border-light-gray pb-2">
                {category}
              </h3>
            )}
            
            <div className={getLayoutClasses()}>
              {categoryOptions.map(option => {
                const isSelected = value.includes(option.id);
                const isDisabled = disabled || option.disabled || 
                  (isAtMaxSelections && !isSelected);

                return (
                  <div
                    key={option.id}
                    className={cn(
                      "relative rounded-lg border transition-all duration-200",
                      "hover:border-primary/50 focus-within:border-primary",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-light-gray dark:border-warm-gray/30",
                      isDisabled && "opacity-50 cursor-not-allowed",
                      layout === 'compact' ? "p-3" : "p-4"
                    )}
                  >
                    <label
                      className={cn(
                        "flex items-start gap-3 cursor-pointer",
                        isDisabled && "cursor-not-allowed"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleToggle(option.id)}
                        disabled={!!isDisabled}
                        size={layout === 'compact' ? 'sm' : 'md'}
                        className="mt-0.5"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {option.icon && (
                            <span className="flex-shrink-0 text-primary">
                              {option.icon}
                            </span>
                          )}
                          <span
                            className={cn(
                              "font-medium truncate",
                              layout === 'compact' ? "text-sm" : "text-base"
                            )}
                          >
                            {option.label}
                          </span>
                          {option.popular && (
                            <Tag variant="secondary" size="sm">
                              Popular
                            </Tag>
                          )}
                        </div>
                        
                        {option.description && layout !== 'compact' && (
                          <p className="text-sm text-warm-gray mt-1 leading-relaxed">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* No results message */}
      {filteredOptions.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-warm-gray">
            No technologies found matching "{searchTerm}"
          </p>
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="text-primary hover:underline text-sm mt-2"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Selection Info */}
      <div className="flex justify-between items-center text-sm">
        <div className="space-y-1">
          {helperText && !error && (
            <p id={helperId} className="text-warm-gray">
              {helperText}
            </p>
          )}
          
          {isUnderMinSelections && minSelections && (
            <p className="text-warm-gray">
              Please select at least {minSelections} technolog{minSelections === 1 ? 'y' : 'ies'}.
            </p>
          )}
        </div>

        {showCount && (maxSelections || minSelections) && (
          <div
            id={counterId}
            className={cn(
              "text-sm tabular-nums",
              isAtMaxSelections ? "text-warm-gray font-medium" : "text-warm-gray"
            )}
            aria-live="polite"
          >
            {value.length}
            {maxSelections && `/${maxSelections}`}
            {maxSelections && value.length === 1 ? ' selection' : ' selections'}
          </div>
        )}
      </div>

      {/* Validation Error */}
      {error && (
        <ValidationMessage type="error" message={error} />
      )}

      {/* Max selections warning */}
      {isAtMaxSelections && maxSelections && (
        <ValidationMessage 
          type="info" 
          message={`Maximum of ${maxSelections} technolog${maxSelections === 1 ? 'y' : 'ies'} can be selected.`} 
        />
      )}

      {/* Skip Option */}
      {allowSkip && onSkip && (
        <div className="flex justify-center">
          <SkipControl
            variant="subtle"
            onClick={onSkip}
            disabled={disabled}
          >
            Skip this question
          </SkipControl>
        </div>
      )}
    </div>
  );
}

export default TechStackSelector;