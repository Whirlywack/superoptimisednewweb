import React from 'react';
import { cn } from '@/lib/utils';
import { QuestionLabel } from '@/components/questionnaire/QuestionLabel';
import { ChoiceButton } from '@/components/ui/ChoiceButton';
import { ValidationMessage } from '@/components/ui/ValidationMessage';
import { SkipControl } from '@/components/ui/SkipControl';

export interface ABTestOption {
  id: string;
  title: string;
  description: string;
  codeExample?: string;
  pros?: string[];
  cons?: string[];
  performance?: string;
  maintainability?: string;
}

export interface ABTestQuestionProps {
  /** Question text */
  question: string;
  /** Optional description or context */
  description?: string;
  /** The two options to compare */
  optionA: ABTestOption;
  optionB: ABTestOption;
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
  /** Additional CSS classes */
  className?: string;
}

const OptionCard = React.forwardRef<
  HTMLButtonElement,
  {
    option: ABTestOption;
    isSelected: boolean;
    onClick: () => void;
    disabled?: boolean;
    label: string;
  }
>(({ option, isSelected, onClick, disabled, label }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative w-full p-6 text-left border-2 rounded-lg transition-all duration-200",
        "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-light-gray bg-off-white hover:bg-light-gray/50",
        disabled && "opacity-50 cursor-not-allowed",
        "sm:max-w-none"
      )}
      aria-pressed={isSelected}
      aria-label={`${label}: ${option.title}`}
    >
      {/* Option Label */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-primary uppercase tracking-wide">
          {label}
        </span>
        <div
          className={cn(
            "w-4 h-4 border-2 rounded-full transition-colors",
            isSelected
              ? "border-primary bg-primary"
              : "border-warm-gray group-hover:border-primary/50"
          )}
        >
          {isSelected && (
            <div className="w-2 h-2 bg-off-white rounded-full m-0.5" />
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-off-black mb-2">
        {option.title}
      </h3>

      {/* Description */}
      <p className="text-warm-gray text-sm mb-4 leading-relaxed">
        {option.description}
      </p>

      {/* Code Example */}
      {option.codeExample && (
        <div className="mb-4">
          <pre className="bg-light-gray p-3 rounded text-xs font-mono text-off-black overflow-x-auto">
            <code>{option.codeExample}</code>
          </pre>
        </div>
      )}

      {/* Metrics */}
      {(option.performance || option.maintainability) && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {option.performance && (
            <div>
              <span className="text-xs font-medium text-warm-gray">Performance</span>
              <div className="text-sm text-off-black">{option.performance}</div>
            </div>
          )}
          {option.maintainability && (
            <div>
              <span className="text-xs font-medium text-warm-gray">Maintainability</span>
              <div className="text-sm text-off-black">{option.maintainability}</div>
            </div>
          )}
        </div>
      )}

      {/* Pros and Cons */}
      {(option.pros || option.cons) && (
        <div className="space-y-3">
          {option.pros && option.pros.length > 0 && (
            <div>
              <span className="text-xs font-medium text-primary mb-1 block">Pros</span>
              <ul className="space-y-1">
                {option.pros.map((pro, index) => (
                  <li key={index} className="text-xs text-warm-gray flex items-start">
                    <span className="text-primary mr-2 mt-0.5">+</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {option.cons && option.cons.length > 0 && (
            <div>
              <span className="text-xs font-medium text-warm-gray mb-1 block">Cons</span>
              <ul className="space-y-1">
                {option.cons.map((con, index) => (
                  <li key={index} className="text-xs text-warm-gray flex items-start">
                    <span className="text-warm-gray mr-2 mt-0.5">-</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </button>
  );
});

OptionCard.displayName = 'OptionCard';

export function ABTestQuestion({
  question,
  description,
  optionA,
  optionB,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  allowSkip = false,
  onSkip,
  className,
}: ABTestQuestionProps) {
  const handleSelect = (optionId: string) => {
    if (!disabled && onChange) {
      onChange(optionId);
    }
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

      {/* A/B Options */}
      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
        <OptionCard
          option={optionA}
          isSelected={value === optionA.id}
          onClick={() => handleSelect(optionA.id)}
          disabled={disabled}
          label="Option A"
        />
        <OptionCard
          option={optionB}
          isSelected={value === optionB.id}
          onClick={() => handleSelect(optionB.id)}
          disabled={disabled}
          label="Option B"
        />
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
            onSkip={onSkip}
            disabled={disabled}
          >
            Skip this comparison
          </SkipControl>
        </div>
      )}
    </div>
  );
}

export default ABTestQuestion;