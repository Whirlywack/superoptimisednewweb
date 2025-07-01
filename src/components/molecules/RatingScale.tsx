import React from 'react';
import { cn } from '@/lib/utils';
import { QuestionLabel } from '@/components/questionnaire/QuestionLabel';
import { ValidationMessage } from '@/components/ui/ValidationMessage';
import { SkipControl } from '@/components/ui/SkipControl';

export interface RatingScaleProps {
  /** Question text */
  question: string;
  /** Optional description or context */
  description?: string;
  /** Minimum rating value */
  min?: number;
  /** Maximum rating value */
  max?: number;
  /** Currently selected rating */
  value?: number;
  /** Callback when rating changes */
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
  /** Labels for the endpoints */
  labels?: {
    min?: string;
    max?: string;
  };
  /** Size of the rating scale */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show numeric labels */
  showNumbers?: boolean;
  /** Custom step increment */
  step?: number;
  /** Additional CSS classes */
  className?: string;
}

export function RatingScale({
  question,
  description,
  min = 1,
  max = 10,
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  allowSkip = false,
  onSkip,
  labels,
  size = 'md',
  showNumbers = true,
  step = 1,
  className,
}: RatingScaleProps) {
  const handleRatingClick = (rating: number) => {
    if (!disabled && onChange) {
      onChange(rating);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, rating: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleRatingClick(rating);
    }
  };

  // Generate rating options based on min, max, and step
  const ratings = [];
  for (let i = min; i <= max; i += step) {
    ratings.push(i);
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          button: 'w-8 h-8 text-xs',
          container: 'gap-1',
          label: 'text-xs',
        };
      case 'lg':
        return {
          button: 'w-12 h-12 text-base',
          container: 'gap-3',
          label: 'text-sm',
        };
      default:
        return {
          button: 'w-10 h-10 text-sm',
          container: 'gap-2',
          label: 'text-xs',
        };
    }
  };

  const sizeClasses = getSizeClasses();

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

      {/* Rating Scale */}
      <div className="space-y-4">
        {/* Scale Labels */}
        {labels && (labels.min || labels.max) && (
          <div className="flex justify-between text-sm text-warm-gray">
            <span>{labels.min}</span>
            <span>{labels.max}</span>
          </div>
        )}

        {/* Rating Buttons */}
        <div className={cn(
          "flex justify-center items-center flex-wrap",
          sizeClasses.container
        )}>
          {ratings.map((rating) => (
            <button
              key={rating}
              type="button"
              disabled={disabled}
              onClick={() => handleRatingClick(rating)}
              onKeyDown={(e) => handleKeyDown(e, rating)}
              className={cn(
                "rounded-full border-2 font-medium transition-all duration-200",
                "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                "flex items-center justify-center",
                sizeClasses.button,
                value === rating
                  ? "border-primary bg-primary text-off-white"
                  : "border-light-gray bg-off-white text-warm-gray hover:bg-light-gray/50",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              aria-pressed={value === rating}
              aria-label={`Rate ${rating} out of ${max}`}
            >
              {showNumbers ? rating : ''}
            </button>
          ))}
        </div>

        {/* Current Selection Display */}
        {value !== undefined && (
          <div className="text-center">
            <span className="text-sm text-warm-gray">
              Selected: <span className="font-medium text-off-black">{value}</span>
              {max && ` out of ${max}`}
            </span>
          </div>
        )}

        {/* Scale Numbers (when not showing on buttons) */}
        {!showNumbers && (
          <div className={cn(
            "flex justify-center items-center",
            sizeClasses.container
          )}>
            {ratings.map((rating) => (
              <span
                key={rating}
                className={cn(
                  "text-center font-medium",
                  sizeClasses.button.split(' ')[0], // width only
                  sizeClasses.label,
                  value === rating ? "text-primary" : "text-warm-gray"
                )}
              >
                {rating}
              </span>
            ))}
          </div>
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
            Skip this rating
          </SkipControl>
        </div>
      )}
    </div>
  );
}

export default RatingScale;