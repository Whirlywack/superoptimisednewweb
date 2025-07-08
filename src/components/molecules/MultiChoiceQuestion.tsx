import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { QuestionLabel } from '@/components/questionnaire/QuestionLabel';
import { ValidationMessage } from '@/components/ui/ValidationMessage';
import { SkipControl } from '@/components/ui/SkipControl';
import { Check } from 'lucide-react';

export interface MultiChoiceOption {
  id: string;
  text: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface MultiChoiceQuestionProps {
  /** Question text */
  question: string;
  /** Optional description or context */
  description?: string;
  /** Available options to choose from */
  options: MultiChoiceOption[];
  /** Currently selected options */
  value?: string[];
  /** Callback when selection changes */
  onChange?: (value: string[]) => void;
  /** Minimum number of selections required */
  minSelections?: number;
  /** Maximum number of selections allowed */
  maxSelections?: number;
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
  /** Additional CSS classes */
  className?: string;
}

export function MultiChoiceQuestion({
  question,
  description,
  options,
  value = [],
  onChange,
  minSelections = 1,
  maxSelections = 3,
  required = false,
  error,
  disabled = false,
  allowSkip = false,
  onSkip,
  className,
}: MultiChoiceQuestionProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(value);

  const handleOptionToggle = (optionId: string) => {
    if (disabled) return;

    const newSelection = selectedOptions.includes(optionId)
      ? selectedOptions.filter(id => id !== optionId)
      : [...selectedOptions, optionId];

    // Enforce max selections limit
    if (newSelection.length > maxSelections) {
      return;
    }

    setSelectedOptions(newSelection);
    if (onChange) {
      onChange(newSelection);
    }
  };

  const isOptionSelected = (optionId: string) => selectedOptions.includes(optionId);
  const canSelectMore = selectedOptions.length < maxSelections;
  const _hasMinimumSelections = selectedOptions.length >= minSelections;

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
        <div className="text-xs text-warm-gray">
          Select {minSelections === maxSelections 
            ? `exactly ${minSelections}` 
            : `${minSelections}-${maxSelections}`
          } option{maxSelections > 1 ? 's' : ''}
        </div>
      </div>

      {/* Selection Counter */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-warm-gray">
          {selectedOptions.length} of {maxSelections} selected
        </span>
        {_hasMinimumSelections && (
          <span className="text-primary font-medium">
            ✓ Minimum requirement met
          </span>
        )}
      </div>

      {/* Options Grid */}
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = isOptionSelected(option.id);
          const canToggle = disabled ? false : (isSelected || canSelectMore);

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleOptionToggle(option.id)}
              disabled={!canToggle}
              className={cn(
                "group relative w-full p-4 text-left border-2 rounded-lg transition-all duration-200",
                "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-light-gray bg-off-white hover:bg-light-gray/50",
                !canToggle && "opacity-50 cursor-not-allowed",
                "sm:max-w-none"
              )}
              aria-pressed={isSelected}
              aria-label={`${option.text}${isSelected ? ' (selected)' : ''}`}
            >
              {/* Selection Indicator */}
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex-shrink-0 w-6 h-6 border-2 rounded transition-colors mt-0.5",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-warm-gray group-hover:border-primary/50"
                  )}
                >
                  {isSelected && (
                    <Check className="w-4 h-4 text-off-white m-0.5" />
                  )}
                </div>

                {/* Option Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    {option.icon && (
                      <div className="flex-shrink-0 text-primary">
                        {option.icon}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h4 className="font-medium text-off-black">
                        {option.text}
                      </h4>
                      {option.description && (
                        <p className="text-sm text-warm-gray mt-1">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selection Summary */}
      {selectedOptions.length > 0 && (
        <div className="bg-light-gray p-4 rounded-lg">
          <h4 className="font-medium text-off-black mb-2">Selected Options:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedOptions.map((optionId) => {
              const option = options.find(opt => opt.id === optionId);
              return option ? (
                <span
                  key={optionId}
                  className="inline-flex items-center gap-1 bg-primary text-off-white px-3 py-1 rounded-full text-sm"
                >
                  {option.text}
                  <button
                    type="button"
                    onClick={() => handleOptionToggle(optionId)}
                    disabled={disabled}
                    className="hover:bg-white/20 rounded-full p-0.5 ml-1"
                    aria-label={`Remove ${option.text}`}
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Validation Error */}
      {error && (
        <ValidationMessage type="error" message={error} />
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

export default MultiChoiceQuestion;