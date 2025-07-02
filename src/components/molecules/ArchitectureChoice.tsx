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
          className="w-full h-48 flex items-center justify-center bg-light-gray/30 rounded-lg"
          dangerouslySetInnerHTML={{ __html: architecture.svg }}
        />
      );
    }
    
    if (architecture.imageUrl) {
      return (
        <div className="w-full h-48 bg-light-gray/30 rounded-lg overflow-hidden">
          <img
            src={architecture.imageUrl}
            alt={`${architecture.title} architecture diagram`}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    // Fallback: Simple component diagram
    return (
      <div className="w-full h-48 bg-light-gray/30 rounded-lg p-4 flex flex-col items-center justify-center">
        <div className="text-center space-y-3">
          <h4 className="text-sm font-medium text-warm-gray">Components:</h4>
          <div className="flex flex-wrap justify-center gap-2">
            {architecture.components.slice(0, 4).map((component, index) => (
              <div
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
              >
                {component}
              </div>
            ))}
            {architecture.components.length > 4 && (
              <div className="px-3 py-1 bg-warm-gray/20 text-warm-gray text-xs rounded-full">
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
          <p className="text-warm-gray text-sm leading-relaxed">
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
                "relative rounded-lg border-2 transition-all duration-200 cursor-pointer",
                "bg-off-white dark:bg-off-black",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-light-gray dark:border-warm-gray/30 hover:border-primary/50",
                disabled && "opacity-50 cursor-not-allowed"
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
                "absolute top-4 right-4 w-4 h-4 rounded-full border-2 transition-colors z-10",
                isSelected
                  ? "border-primary bg-primary"
                  : "border-light-gray dark:border-warm-gray/30"
              )}>
                {isSelected && (
                  <div className="w-2 h-2 bg-off-white rounded-full m-0.5" />
                )}
              </div>

              <div className="p-6 space-y-4">
                {/* Architecture Header */}
                <div className="space-y-2">
                  <h3
                    id={`architecture-${architecture.id}-title`}
                    className="text-lg font-semibold text-off-black dark:text-off-white pr-8"
                  >
                    {architecture.title}
                  </h3>
                  {architecture.description && (
                    <p
                      id={`architecture-${architecture.id}-description`}
                      className="text-warm-gray text-sm"
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
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getMetadataColor(architecture.complexity)
                      )}>
                        Complexity: {architecture.complexity}
                      </span>
                    )}
                    {architecture.scalability && (
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getMetadataColor(architecture.scalability)
                      )}>
                        Scalability: {architecture.scalability}
                      </span>
                    )}
                    {architecture.cost && (
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
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
                          className="px-2 py-1 bg-warm-gray/10 text-warm-gray text-xs rounded"
                        >
                          {component}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pros and Cons */}
                {showProsAndCons && (architecture.pros || architecture.cons) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {architecture.pros && architecture.pros.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-primary">
                          Pros
                        </h4>
                        <ul className="space-y-1 text-warm-gray">
                          {architecture.pros.map((pro, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary mt-1 text-xs">✓</span>
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