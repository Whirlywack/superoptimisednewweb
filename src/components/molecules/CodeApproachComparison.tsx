import React from 'react';
import { cn } from '@/lib/utils';
import { QuestionLabel } from '@/components/questionnaire/QuestionLabel';
import { ValidationMessage } from '@/components/ui/ValidationMessage';
import { SkipControl } from '@/components/ui/SkipControl';

export interface CodeApproach {
  id: string;
  title: string;
  description?: string;
  code: string;
  language?: string;
  pros?: string[];
  cons?: string[];
  metadata?: {
    performance?: 'high' | 'medium' | 'low';
    complexity?: 'simple' | 'moderate' | 'complex';
    maintainability?: 'easy' | 'moderate' | 'difficult';
  };
}

export interface CodeApproachComparisonProps {
  /** Question text */
  question: string;
  /** Optional description or context */
  description?: string;
  /** Array of code approaches to compare (typically 2) */
  approaches: CodeApproach[];
  /** Currently selected approach */
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
  /** Layout orientation */
  layout?: 'horizontal' | 'vertical';
  /** Whether to show code metadata */
  showMetadata?: boolean;
  /** Whether to show pros/cons */
  showProsAndCons?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function CodeApproachComparison({
  question,
  description,
  approaches,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  allowSkip = false,
  onSkip,
  layout = 'horizontal',
  showMetadata = true,
  showProsAndCons = true,
  className,
}: CodeApproachComparisonProps) {
  // Limit to 2 approaches for optimal comparison
  const limitedApproaches = approaches.slice(0, 2);

  const handleSelect = (approachId: string) => {
    if (!disabled && onChange) {
      onChange(approachId);
    }
  };

  const getMetadataColor = (level: string) => {
    switch (level) {
      case 'high':
      case 'easy':
      case 'simple':
        return 'text-primary bg-primary/10';
      case 'medium':
      case 'moderate':
        return 'text-warm-gray bg-light-gray dark:bg-warm-gray/20';
      case 'low':
      case 'difficult':
      case 'complex':
        return 'text-off-black dark:text-off-white bg-light-gray dark:bg-warm-gray/20';
      default:
        return 'text-warm-gray bg-light-gray';
    }
  };

  const getLayoutClasses = () => {
    if (layout === 'horizontal' && limitedApproaches.length === 2) {
      return 'grid grid-cols-1 lg:grid-cols-2 gap-6';
    }
    return 'space-y-6';
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

      {/* Code Approaches */}
      <div className={getLayoutClasses()}>
        {limitedApproaches.map((approach) => {
          const isSelected = value === approach.id;
          
          return (
            <div
              key={approach.id}
              className={cn(
                "relative rounded-lg border-2 transition-all duration-200 cursor-pointer",
                "bg-off-white dark:bg-off-black",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-light-gray dark:border-warm-gray/30 hover:border-primary/50",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !disabled && handleSelect(approach.id)}
              role="radio"
              aria-checked={isSelected}
              aria-labelledby={`approach-${approach.id}-title`}
              aria-describedby={`approach-${approach.id}-description`}
              tabIndex={disabled ? -1 : 0}
              onKeyDown={(e) => {
                if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleSelect(approach.id);
                }
              }}
            >
              {/* Selection Indicator */}
              <div className={cn(
                "absolute top-4 right-4 w-4 h-4 rounded-full border-2 transition-colors",
                isSelected
                  ? "border-primary bg-primary"
                  : "border-light-gray dark:border-warm-gray/30"
              )}>
                {isSelected && (
                  <div className="w-2 h-2 bg-off-white rounded-full m-0.5" />
                )}
              </div>

              <div className="p-6 space-y-4">
                {/* Approach Header */}
                <div className="space-y-2">
                  <h3
                    id={`approach-${approach.id}-title`}
                    className="text-lg font-semibold text-off-black dark:text-off-white"
                  >
                    {approach.title}
                  </h3>
                  {approach.description && (
                    <p
                      id={`approach-${approach.id}-description`}
                      className="text-warm-gray text-sm"
                    >
                      {approach.description}
                    </p>
                  )}
                </div>

                {/* Code Block */}
                <div className="relative">
                  <div className="bg-off-black dark:bg-warm-gray/10 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm">
                      <code className="text-off-white dark:text-off-black font-mono">
                        {approach.code}
                      </code>
                    </pre>
                  </div>
                  {approach.language && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-warm-gray/20 rounded text-xs font-mono text-warm-gray">
                      {approach.language}
                    </div>
                  )}
                </div>

                {/* Metadata */}
                {showMetadata && approach.metadata && (
                  <div className="flex flex-wrap gap-2">
                    {approach.metadata.performance && (
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getMetadataColor(approach.metadata.performance)
                      )}>
                        Performance: {approach.metadata.performance}
                      </span>
                    )}
                    {approach.metadata.complexity && (
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getMetadataColor(approach.metadata.complexity)
                      )}>
                        Complexity: {approach.metadata.complexity}
                      </span>
                    )}
                    {approach.metadata.maintainability && (
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getMetadataColor(approach.metadata.maintainability)
                      )}>
                        Maintainability: {approach.metadata.maintainability}
                      </span>
                    )}
                  </div>
                )}

                {/* Pros and Cons */}
                {showProsAndCons && (approach.pros || approach.cons) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {approach.pros && approach.pros.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-primary">
                          Pros
                        </h4>
                        <ul className="space-y-1 text-warm-gray">
                          {approach.pros.map((pro, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary mt-1 text-xs">✓</span>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {approach.cons && approach.cons.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-off-black dark:text-off-white">
                          Cons
                        </h4>
                        <ul className="space-y-1 text-warm-gray">
                          {approach.cons.map((con, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-warm-gray mt-1 text-xs">✗</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Approach limit warning */}
      {approaches.length > 2 && (
        <div className="text-xs text-warm-gray bg-light-gray p-3 rounded-lg">
          Note: Only the first 2 approaches are shown for optimal comparison.
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

export default CodeApproachComparison;