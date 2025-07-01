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
      "w-full max-w-4xl mx-auto transition-all duration-500 ease-out",
      isVisible ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-4",
      className
    )}>
      {/* Progress Header */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
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
                "p-2 rounded-lg transition-colors",
                "hover:bg-light-gray focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isFlagged ? "text-yellow-600 bg-yellow-50" : "text-warm-gray",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              aria-label={isFlagged ? "Remove flag" : "Flag for review"}
            >
              <Flag className="w-4 h-4" />
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
        "bg-off-white dark:bg-off-black border-2 rounded-lg shadow-sm transition-colors duration-200",
        "p-6 sm:p-8 space-y-6",
        "border-light-gray dark:border-warm-gray/30",
        "hover:border-primary/50 focus-within:border-primary",
        hasValue && "border-primary/30",
        isValidating && "animate-pulse border-primary"
      )}>
        {/* Question Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold text-off-black dark:text-off-white leading-tight pr-4">
              {question.question}
            </h2>
            {question.required && (
              <span className="flex-shrink-0 text-red-500 text-lg" aria-label="Required">
                *
              </span>
            )}
          </div>
          
          {question.description && (
            <p className="text-warm-gray text-base leading-relaxed">
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
              <div className="text-center space-y-2">
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
        <div className="flex items-center justify-between pt-6 border-t border-light-gray dark:border-warm-gray/30">
          {/* Previous Button */}
          <div className="flex items-center space-x-3">
            {showPrevious && !isFirstQuestion ? (
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={disabled || isValidating}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
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
                <SkipForward className="w-4 h-4" />
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
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <div /> // Spacer
            )}
          </div>
        </div>
      </div>

      {/* Question Type Indicator */}
      <div className="mt-4 flex items-center justify-center">
        <div className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
          {question.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;