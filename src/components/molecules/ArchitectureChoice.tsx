import React from 'react';
import { cn } from '@/lib/utils';
import { QuestionLabel } from '@/components/questionnaire/QuestionLabel';
import { ValidationMessage } from '@/components/ui/ValidationMessage';
import { SkipControl } from '@/components/ui/SkipControl';

export interface ArchitectureDiagram {
  id: string;
  title: string;
  description?: string;
  svg?: string;
  imageUrl?: string;
  components: string[];
  pros?: string[];
  cons?: string[];
  complexity?: 'simple' | 'moderate' | 'complex';
  scalability?: 'low' | 'medium' | 'high';
  cost?: 'low' | 'medium' | 'high';
}

export interface ArchitectureChoiceProps {
  /** Question text */
  question: string;
  /** Optional description or context */
  description?: string;
  /** Array of architecture options to choose from */
  architectures: ArchitectureDiagram[];
  /** Currently selected architecture */
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
  /** Layout for multiple options */
  layout?: 'grid' | 'list';
  /** Number of columns for grid layout */
  columns?: 2 | 3 | 4;
  /** Whether to show detailed metadata */
  showMetadata?: boolean;
  /** Whether to show pros/cons */
  showProsAndCons?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function ArchitectureChoice({
  question,
  description,
  architectures,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  allowSkip = false,
  onSkip,
  layout = 'grid',
  columns = 2,
  showMetadata = true,
  showProsAndCons = true,
  className,
}: ArchitectureChoiceProps) {
  const handleSelect = (architectureId: string) => {
    if (!disabled && onChange) {
      onChange(architectureId);
    }
  };

  const getMetadataColor = (level: string) => {
    switch (level) {
      case 'low':
      case 'simple':
        return 'text-primary bg-primary/10';
      case 'medium':
      case 'moderate':
        return 'text-warm-gray bg-light-gray dark:bg-warm-gray/20';
      case 'high':
      case 'complex':
        return 'text-off-black dark:text-off-white bg-light-gray dark:bg-warm-gray/20';
      default:
        return 'text-warm-gray bg-light-gray';
    }
  };

  const getLayoutClasses = () => {
    if (layout === 'grid') {
      const colsMap = {
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      };
      return `grid ${colsMap[columns]} gap-6`;
    }
    return 'space-y-6';
  };

  const renderDiagram = (architecture: ArchitectureDiagram) => {
    if (architecture.svg) {
      return (
        <div 
          className="flex h-48 w-full items-center justify-center rounded-lg bg-light-gray/30"
          dangerouslySetInnerHTML={{ __html: architecture.svg }}
        />
      );
    }
    
    if (architecture.imageUrl) {
      return (
        <div className="h-48 w-full overflow-hidden rounded-lg bg-light-gray/30">
          <img
            src={architecture.imageUrl}
            alt={`${architecture.title} architecture diagram`}
            className="size-full object-cover"
          />
        </div>
      );
    }

    // Fallback: Simple component diagram
    return (
      <div className="flex h-48 w-full flex-col items-center justify-center rounded-lg bg-light-gray/30 p-4">
        <div className="space-y-3 text-center">
          <h4 className="text-sm font-medium text-warm-gray">Components:</h4>
          <div className="flex flex-wrap justify-center gap-2">
            {architecture.components.slice(0, 4).map((component, index) => (
              <div
                key={index}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
              >
                {component}
              </div>
            ))}
            {architecture.components.length > 4 && (
              <div className="rounded-full bg-warm-gray/20 px-3 py-1 text-xs text-warm-gray">
                +{architecture.components.length - 4} more
              </div>
            )}
          </div>
        </div>
      </div>
    );
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

      {/* Architecture Options */}
      <div className={getLayoutClasses()}>
        {architectures.map((architecture) => {
          const isSelected = value === architecture.id;
          
          return (
            <div
              key={architecture.id}
              className={cn(
                "relative cursor-pointer rounded-lg border-2 transition-all duration-200",
                "bg-off-white dark:bg-off-black",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-light-gray hover:border-primary/50 dark:border-warm-gray/30",
                disabled && "cursor-not-allowed opacity-50"
              )}
              onClick={() => !disabled && handleSelect(architecture.id)}
              role="radio"
              aria-checked={isSelected}
              aria-labelledby={`architecture-${architecture.id}-title`}
              aria-describedby={`architecture-${architecture.id}-description`}
              tabIndex={disabled ? -1 : 0}
              onKeyDown={(e) => {
                if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleSelect(architecture.id);
                }
              }}
            >
              {/* Selection Indicator */}
              <div className={cn(
                "absolute right-4 top-4 z-10 size-4 rounded-full border-2 transition-colors",
                isSelected
                  ? "border-primary bg-primary"
                  : "border-light-gray dark:border-warm-gray/30"
              )}>
                {isSelected && (
                  <div className="m-0.5 size-2 rounded-full bg-off-white" />
                )}
              </div>

              <div className="space-y-4 p-6">
                {/* Architecture Header */}
                <div className="space-y-2">
                  <h3
                    id={`architecture-${architecture.id}-title`}
                    className="pr-8 text-lg font-semibold text-off-black dark:text-off-white"
                  >
                    {architecture.title}
                  </h3>
                  {architecture.description && (
                    <p
                      id={`architecture-${architecture.id}-description`}
                      className="text-sm text-warm-gray"
                    >
                      {architecture.description}
                    </p>
                  )}
                </div>

                {/* Architecture Diagram */}
                {renderDiagram(architecture)}

                {/* Metadata */}
                {showMetadata && (
                  <div className="flex flex-wrap gap-2">
                    {architecture.complexity && (
                      <span className={cn(
                        "rounded-full px-2 py-1 text-xs font-medium",
                        getMetadataColor(architecture.complexity)
                      )}>
                        Complexity: {architecture.complexity}
                      </span>
                    )}
                    {architecture.scalability && (
                      <span className={cn(
                        "rounded-full px-2 py-1 text-xs font-medium",
                        getMetadataColor(architecture.scalability)
                      )}>
                        Scalability: {architecture.scalability}
                      </span>
                    )}
                    {architecture.cost && (
                      <span className={cn(
                        "rounded-full px-2 py-1 text-xs font-medium",
                        getMetadataColor(architecture.cost)
                      )}>
                        Cost: {architecture.cost}
                      </span>
                    )}
                  </div>
                )}

                {/* Components List */}
                {architecture.components.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-off-black dark:text-off-white">
                      Key Components:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {architecture.components.map((component, index) => (
                        <span
                          key={index}
                          className="rounded bg-warm-gray/10 px-2 py-1 text-xs text-warm-gray"
                        >
                          {component}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pros and Cons */}
                {showProsAndCons && (architecture.pros || architecture.cons) && (
                  <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                    {architecture.pros && architecture.pros.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-primary">
                          Pros
                        </h4>
                        <ul className="space-y-1 text-warm-gray">
                          {architecture.pros.map((pro, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="mt-1 text-xs text-primary">✓</span>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {architecture.cons && architecture.cons.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-off-black dark:text-off-white">
                          Cons
                        </h4>
                        <ul className="space-y-1 text-warm-gray">
                          {architecture.cons.map((con, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="mt-1 text-xs text-warm-gray">✗</span>
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

export default ArchitectureChoice;