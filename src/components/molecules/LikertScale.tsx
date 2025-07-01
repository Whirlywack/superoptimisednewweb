import React from 'react';
import { cn } from '@/lib/utils';
import { QuestionLabel } from '@/components/questionnaire/QuestionLabel';
import { ChoiceButton } from '@/components/ui/ChoiceButton';
import { ValidationMessage } from '@/components/ui/ValidationMessage';
import { SkipControl } from '@/components/ui/SkipControl';

export interface LikertOption {
  value: number;
  label: string;
  shortLabel?: string;
}

export interface LikertScaleProps {
  /** Question or statement text */
  question: string;
  /** Optional description or context */
  description?: string;
  /** Currently selected value */
  value?: number;
  /** Callback when selection changes */
  onChange?: (value: number) => void;
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
  /** Scale type preset */
  scaleType?: 'agreement' | 'satisfaction' | 'frequency' | 'importance' | 'likelihood' | 'custom';
  /** Custom scale options (overrides scaleType) */
  customOptions?: LikertOption[];
  /** Layout variant */
  layout?: 'horizontal' | 'vertical';
  /** Size of the scale options */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

// Predefined scale options
const scalePresets: Record<string, LikertOption[]> = {
  agreement: [
    { value: 1, label: 'Strongly Disagree', shortLabel: 'Disagree' },
    { value: 2, label: 'Disagree', shortLabel: 'Disagree' },
    { value: 3, label: 'Neutral', shortLabel: 'Neutral' },
    { value: 4, label: 'Agree', shortLabel: 'Agree' },
    { value: 5, label: 'Strongly Agree', shortLabel: 'Agree' },
  ],
  satisfaction: [
    { value: 1, label: 'Very Unsatisfied', shortLabel: 'Poor' },
    { value: 2, label: 'Unsatisfied', shortLabel: 'Fair' },
    { value: 3, label: 'Neutral', shortLabel: 'Neutral' },
    { value: 4, label: 'Satisfied', shortLabel: 'Good' },
    { value: 5, label: 'Very Satisfied', shortLabel: 'Excellent' },
  ],
  frequency: [
    { value: 1, label: 'Never', shortLabel: 'Never' },
    { value: 2, label: 'Rarely', shortLabel: 'Rarely' },
    { value: 3, label: 'Sometimes', shortLabel: 'Sometimes' },
    { value: 4, label: 'Often', shortLabel: 'Often' },
    { value: 5, label: 'Always', shortLabel: 'Always' },
  ],
  importance: [
    { value: 1, label: 'Not Important', shortLabel: 'Low' },
    { value: 2, label: 'Slightly Important', shortLabel: 'Low' },
    { value: 3, label: 'Moderately Important', shortLabel: 'Medium' },
    { value: 4, label: 'Important', shortLabel: 'High' },
    { value: 5, label: 'Very Important', shortLabel: 'High' },
  ],
  likelihood: [
    { value: 1, label: 'Very Unlikely', shortLabel: 'Unlikely' },
    { value: 2, label: 'Unlikely', shortLabel: 'Unlikely' },
    { value: 3, label: 'Neutral', shortLabel: 'Neutral' },
    { value: 4, label: 'Likely', shortLabel: 'Likely' },
    { value: 5, label: 'Very Likely', shortLabel: 'Likely' },
  ],
};

export function LikertScale({
  question,
  description,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  allowSkip = false,
  onSkip,
  scaleType = 'agreement',
  customOptions,
  layout = 'horizontal',
  size = 'md',
  className,
}: LikertScaleProps) {
  const options = customOptions || scalePresets[scaleType] || scalePresets.agreement;

  const handleSelect = (selectedValue: number) => {
    if (!disabled && onChange) {
      onChange(selectedValue);
    }
  };

  const getLayoutClasses = () => {
    if (layout === 'vertical') {
      return 'space-y-3';
    }
    
    return cn(
      'flex gap-2',
      'flex-col sm:flex-row sm:justify-center',
      options.length > 4 && 'lg:gap-3'
    );
  };

  const getOptionClasses = () => {
    if (layout === 'horizontal') {
      return cn(
        'flex-1 justify-center text-center',
        'sm:max-w-[120px] lg:max-w-[140px]'
      );
    }
    return 'w-full justify-start text-left';
  };

  const getSelectedOption = () => {
    return options.find(option => option.value === value);
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

      {/* Scale Instructions */}
      {layout === 'horizontal' && (
        <div className="text-sm text-warm-gray text-center">
          <p>Select your level of {scaleType === 'custom' ? 'response' : scaleType}</p>
        </div>
      )}

      {/* Likert Scale Options */}
      <div className={getLayoutClasses()}>
        {options.map((option) => (
          <ChoiceButton
            key={option.value}
            label={layout === 'horizontal' && option.shortLabel ? option.shortLabel : option.label}
            description={`(${option.value})`}
            selected={value === option.value}
            variant="default"
            size={size}
            disabled={disabled}
            onClick={() => handleSelect(option.value)}
            className={getOptionClasses()}
            aria-pressed={value === option.value}
          />
        ))}
      </div>

      {/* Current Selection Display */}
      {value !== undefined && (
        <div className="text-center p-3 bg-light-gray rounded-lg">
          <span className="text-sm text-warm-gray">
            Selected: <span className="font-medium text-off-black">
              {getSelectedOption()?.label}
            </span>
          </span>
        </div>
      )}

      {/* Scale Endpoints (for horizontal layout) */}
      {layout === 'horizontal' && options.length > 0 && (
        <div className="flex justify-between text-xs text-warm-gray px-2">
          <span>{options[0].shortLabel || options[0].label}</span>
          <span>{options[options.length - 1].shortLabel || options[options.length - 1].label}</span>
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

export default LikertScale;