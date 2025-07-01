import React from 'react';
import { cn } from '@/lib/utils';
import { QuestionLabel } from '@/components/questionnaire/QuestionLabel';
import { ChoiceButton } from '@/components/ui/ChoiceButton';
import { ValidationMessage } from '@/components/ui/ValidationMessage';
import { SkipControl } from '@/components/ui/SkipControl';

export interface MultipleChoiceOption {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface MultipleChoiceProps {
  /** Question text */
  question: string;
  /** Optional description or context */
  description?: string;
  /** Array of options (max 4 for mobile optimization) */
  options: MultipleChoiceOption[];
  /** Currently selected option */
  value?: string;
  /** Callback when selection changes */
  onChange?: (value: string) => void;
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
  /** Layout variant for options */
  layout?: 'vertical' | 'grid';
  /** Option size for touch targets */
  optionSize?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

export function MultipleChoice({
  question,
  description,
  options,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  allowSkip = false,
  onSkip,
  layout = 'vertical',
  optionSize = 'md',
  className,
}: MultipleChoiceProps) {
  // Limit to 4 options for mobile optimization
  const limitedOptions = options.slice(0, 4);

  const handleSelect = (optionId: string) => {
    if (!disabled && onChange) {
      onChange(optionId);
    }
  };

  const getLayoutClasses = () => {
    if (layout === 'grid') {
      return cn(
        'grid gap-3',
        limitedOptions.length === 2 && 'grid-cols-1 sm:grid-cols-2',
        limitedOptions.length === 3 && 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
        limitedOptions.length === 4 && 'grid-cols-1 sm:grid-cols-2'
      );
    }
    return 'space-y-3';
  };

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

      {/* Options */}
      <div className={getLayoutClasses()}>
        {limitedOptions.map((option) => (
          <ChoiceButton
            key={option.id}
            variant={value === option.id ? 'selected' : 'default'}
            size={optionSize}
            disabled={disabled || option.disabled}
            onClick={() => handleSelect(option.id)}
            icon={option.icon}
            className="w-full text-left justify-start"
            aria-pressed={value === option.id}
          >
            <div className="flex-1">
              <div className="font-medium text-off-black">
                {option.label}
              </div>
              {option.description && (
                <div className="text-sm text-warm-gray mt-1">
                  {option.description}
                </div>
              )}
            </div>
          </ChoiceButton>
        ))}
      </div>

      {/* Option limit warning */}
      {options.length > 4 && (
        <div className="text-xs text-warm-gray bg-light-gray p-3 rounded-lg">
          Note: Only the first 4 options are shown for optimal mobile experience.
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
            onSkip={onSkip}
            disabled={disabled}
          >
            Skip this question
          </SkipControl>
        </div>
      )}
    </div>
  );
}

export default MultipleChoice;