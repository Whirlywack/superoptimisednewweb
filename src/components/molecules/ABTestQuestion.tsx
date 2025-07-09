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
        "group relative w-full rounded-lg border-2 p-6 text-left transition-all duration-200",
        "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-light-gray bg-off-white hover:bg-light-gray/50",
        disabled && "cursor-not-allowed opacity-50",
        "sm:max-w-none"
      )}
      aria-pressed={isSelected}
      aria-label={`${label}: ${option.title}`}
    >
      {/* Option Label */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium uppercase tracking-wide text-primary">
          {label}
        </span>
        <div
          className={cn(
            "size-4 rounded-full border-2 transition-colors",
            isSelected
              ? "border-primary bg-primary"
              : "border-warm-gray group-hover:border-primary/50"
          )}
        >
          {isSelected && (
            <div className="m-0.5 size-2 rounded-full bg-off-white" />
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-semibold text-off-black">
        {option.title}
      </h3>

      {/* Description */}
      <p className="mb-4 text-sm leading-relaxed text-warm-gray">
        {option.description}
      </p>

      {/* Code Example */}
      {option.codeExample && (
        <div className="mb-4">
          <pre className="overflow-x-auto rounded bg-light-gray p-3 font-mono text-xs text-off-black">
            <code>{option.codeExample}</code>
          </pre>
        </div>
      )}

      {/* Metrics */}
      {(option.performance || option.maintainability) && (
        <div className="mb-4 grid grid-cols-2 gap-3">
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
              <span className="mb-1 block text-xs font-medium text-primary">Pros</span>
              <ul className="space-y-1">
                {option.pros.map((pro, index) => (
                  <li key={index} className="flex items-start text-xs text-warm-gray">
                    <span className="mr-2 mt-0.5 text-primary">+</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {option.cons && option.cons.length > 0 && (
            <div>
              <span className="mb-1 block text-xs font-medium text-warm-gray">Cons</span>
              <ul className="space-y-1">
                {option.cons.map((con, index) => (
                  <li key={index} className="flex items-start text-xs text-warm-gray">
                    <span className="mr-2 mt-0.5 text-warm-gray">-</span>
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
          <p className="text-sm leading-relaxed text-warm-gray">
            {description}
          </p>
        )}
      </div>

      {/* A/B Options */}
      <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
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
            onClick={onSkip}
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