import React from 'react';
import { cn } from '@/lib/utils';
import { QuestionLabel } from '@/components/questionnaire/QuestionLabel';
import { ChoiceButton } from '@/components/ui/ChoiceButton';
import { ValidationMessage } from '@/components/ui/ValidationMessage';
import { SkipControl } from '@/components/ui/SkipControl';
import { Check, X, HelpCircle } from 'lucide-react';

export interface YesNoQuestionProps {
  /** Question text */
  question: string;
  /** Optional description or context */
  description?: string;
  /** Currently selected value */
  value?: 'yes' | 'no' | 'unsure';
  /** Callback when selection changes */
  onChange?: (value: 'yes' | 'no' | 'unsure') => void;
  /** Whether the question is required */
  required?: boolean;
  /** Validation error message */
  error?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether to show the "unsure" option */
  showUnsure?: boolean;
  /** Whether to show skip option */
  allowSkip?: boolean;
  /** Skip callback */
  onSkip?: () => void;
  /** Layout variant */
  layout?: 'horizontal' | 'vertical';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Custom labels for options */
  labels?: {
    yes?: string;
    no?: string;
    unsure?: string;
  };
  /** Additional CSS classes */
  className?: string;
}

export function YesNoQuestion({
  question,
  description,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  showUnsure = true,
  allowSkip = false,
  onSkip,
  layout = 'horizontal',
  size = 'md',
  labels = {},
  className,
}: YesNoQuestionProps) {
  const {
    yes: yesLabel = 'Yes',
    no: noLabel = 'No',
    unsure: unsureLabel = 'Not sure'
  } = labels;

  const handleSelect = (selectedValue: 'yes' | 'no' | 'unsure') => {
    if (!disabled && onChange) {
      onChange(selectedValue);
    }
  };

  const getLayoutClasses = () => {
    if (layout === 'vertical') {
      return 'space-y-3';
    }
    
    const optionCount = showUnsure ? 3 : 2;
    return cn(
      'flex gap-3',
      optionCount === 2 && 'flex-col sm:flex-row',
      optionCount === 3 && 'flex-col sm:flex-row sm:justify-center'
    );
  };

  const getButtonClasses = () => {
    if (layout === 'horizontal') {
      const optionCount = showUnsure ? 3 : 2;
      return cn(
        'flex-1 justify-center',
        optionCount === 3 && 'sm:max-w-[140px]'
      );
    }
    return 'w-full justify-start';
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Question Header */}
      <div className="space-y-2">
        <QuestionLabel required={required}>
          {question}
        </QuestionLabel>
        {description && (
          <p className="text-sm leading-relaxed text-warm-gray">
            {description}
          </p>
        )}
      </div>

      {/* Yes/No Options */}
      <div className={getLayoutClasses()}>
        {/* Yes Option */}
        <ChoiceButton
          label={yesLabel}
          selected={value === 'yes'}
          variant="default"
          size={size}
          disabled={disabled}
          onClick={() => handleSelect('yes')}
          icon={<Check className="size-5" />}
          className={getButtonClasses()}
          aria-pressed={value === 'yes'}
        />

        {/* No Option */}
        <ChoiceButton
          label={noLabel}
          selected={value === 'no'}
          variant="default"
          size={size}
          disabled={disabled}
          onClick={() => handleSelect('no')}
          icon={<X className="size-5" />}
          className={getButtonClasses()}
          aria-pressed={value === 'no'}
        />

        {/* Unsure Option */}
        {showUnsure && (
          <ChoiceButton
            label={unsureLabel}
            selected={value === 'unsure'}
            variant="default"
            size={size}
            disabled={disabled}
            onClick={() => handleSelect('unsure')}
            icon={<HelpCircle className="size-5" />}
            className={getButtonClasses()}
            aria-pressed={value === 'unsure'}
          />
        )}
      </div>

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

export default YesNoQuestion;