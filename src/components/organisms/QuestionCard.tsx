import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { ValidationMessage } from '@/components/ui/ValidationMessage';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, SkipForward, Flag } from 'lucide-react';

export interface QuestionData {
  id: string;
  type: 'multiple-choice' | 'yes-no' | 'rating' | 'text' | 'ranking' | 'code-comparison' | 'architecture' | 'time-estimate' | 'difficulty' | 'tech-debt';
  question: string;
  description?: string;
  required?: boolean;
  options?: any;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface QuestionCardProps {
  /** Current question data */
  question: QuestionData;
  /** Current question index (0-based) */
  currentIndex: number;
  /** Total number of questions */
  totalQuestions: number;
  /** Current answer value */
  value?: any;
  /** Validation error message */
  error?: string;
  /** Whether the question is being validated */
  isValidating?: boolean;
  /** Whether navigation is disabled */
  disabled?: boolean;
  /** Show progress indicator */
  showProgress?: boolean;
  /** Show question counter */
  showCounter?: boolean;
  /** Allow skipping questions */
  allowSkip?: boolean;
  /** Show previous button */
  showPrevious?: boolean;
  /** Show next button */
  showNext?: boolean;
  /** Custom next button text */
  nextButtonText?: string;
  /** Custom previous button text */
  previousButtonText?: string;
  /** Callback when answer changes */
  onChange?: (value: any) => void;
  /** Callback when next is clicked */
  onNext?: () => void;
  /** Callback when previous is clicked */
  onPrevious?: () => void;
  /** Callback when skip is clicked */
  onSkip?: () => void;
  /** Callback when question is flagged */
  onFlag?: () => void;
  /** Whether question is flagged for review */
  isFlagged?: boolean;
  /** Custom question renderer */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export function QuestionCard({
  question,
  currentIndex,
  totalQuestions,
  value,
  error,
  isValidating = false,
  disabled = false,
  showProgress = true,
  showCounter = true,
  allowSkip = false,
  showPrevious = true,
  showNext = true,
  nextButtonText = "Next",
  previousButtonText = "Previous",
  onChange,
  onNext,
  onPrevious,
  onSkip,
  onFlag,
  isFlagged = false,
  children,
  className,
}: QuestionCardProps) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, [question.id]);

  const handleValueChange = (newValue: any) => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    onChange?.(newValue);
  };

  const handleNext = () => {
    if (disabled || isValidating) return;
    onNext?.();
  };

  const handlePrevious = () => {
    if (disabled || isValidating) return;
    onPrevious?.();
  };

  const handleSkip = () => {
    if (disabled || isValidating) return;
    onSkip?.();
  };

  const handleFlag = () => {
    if (disabled) return;
    onFlag?.();
  };

  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const hasValue = value !== undefined && value !== null && value !== '';

  return (
    <div className={cn(
      "mx-auto w-full max-w-4xl transition-all duration-500 ease-out",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      className
    )}>
      {/* Progress Header */}
      {showProgress && (
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            {showCounter && (
              <span className="text-sm font-medium text-warm-gray">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
            )}
            <button
              type="button"
              onClick={handleFlag}
              disabled={disabled}
              className={cn(
                "rounded-lg p-2 transition-colors",
                "hover:bg-light-gray focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isFlagged ? "bg-primary/10 text-primary" : "text-warm-gray",
                disabled && "cursor-not-allowed opacity-50"
              )}
              aria-label={isFlagged ? "Remove flag" : "Flag for review"}
            >
              <Flag className="size-4" />
            </button>
          </div>
          <ProgressIndicator 
            value={progressPercentage}
            className="h-2"
            showLabel={false}
          />
        </div>
      )}

      {/* Question Card */}
      <div className={cn(
        "rounded-lg border-2 bg-off-white shadow-sm transition-colors duration-200 dark:bg-off-black",
        "space-y-6 p-6 sm:p-8",
        "border-light-gray dark:border-warm-gray/30",
        "focus-within:border-primary hover:border-primary/50",
        hasValue && "border-primary/30",
        isValidating && "animate-pulse border-primary"
      )}>
        {/* Question Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h2 className="pr-4 text-xl font-semibold leading-tight text-off-black dark:text-off-white sm:text-2xl">
              {question.question}
            </h2>
            {question.required && (
              <span className="shrink-0 text-lg text-warm-gray" aria-label="Required">
                *
              </span>
            )}
          </div>
          
          {question.description && (
            <p className="text-base leading-relaxed text-warm-gray">
              {question.description}
            </p>
          )}
        </div>

        {/* Question Content */}
        <div className="space-y-4">
          {children ? (
            <div onChange={handleValueChange}>
              {children}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-warm-gray">
              <div className="space-y-2 text-center">
                <div className="text-lg">Question content placeholder</div>
                <div className="text-sm">
                  Pass a question component as children or implement question rendering
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Validation Error */}
        {error && hasInteracted && (
          <ValidationMessage type="error" message={error} />
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-light-gray pt-6 dark:border-warm-gray/30">
          {/* Previous Button */}
          <div className="flex items-center space-x-3">
            {showPrevious && !isFirstQuestion ? (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={disabled || isValidating}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="size-4" />
                <span>{previousButtonText}</span>
              </Button>
            ) : (
              <div /> // Spacer
            )}
          </div>

          {/* Center Actions */}
          <div className="flex items-center space-x-3">
            {allowSkip && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                disabled={disabled || isValidating}
                className="flex items-center space-x-2 text-warm-gray hover:text-off-black dark:hover:text-off-white"
              >
                <SkipForward className="size-4" />
                <span>Skip</span>
              </Button>
            )}
          </div>

          {/* Next Button */}
          <div className="flex items-center space-x-3">
            {showNext ? (
              <Button
                onClick={handleNext}
                disabled={
                  disabled || 
                  isValidating || 
                  (question.required && !hasValue)
                }
                className="flex items-center space-x-2"
              >
                <span>{isLastQuestion ? "Complete" : nextButtonText}</span>
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <div /> // Spacer
            )}
          </div>
        </div>
      </div>

      {/* Question Type Indicator */}
      <div className="mt-4 flex items-center justify-center">
        <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {question.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;