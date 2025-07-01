import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { QuestionLabel } from '@/components/questionnaire/QuestionLabel';
import { ValidationMessage } from '@/components/ui/ValidationMessage';
import { SkipControl } from '@/components/ui/SkipControl';

export interface TextFeedbackProps {
  /** Question text */
  question: string;
  /** Optional description or context */
  description?: string;
  /** Current text value */
  value?: string;
  /** Callback when text changes */
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
  /** Maximum character limit */
  maxLength?: number;
  /** Minimum character limit */
  minLength?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Number of visible text lines */
  rows?: number;
  /** Helper text shown below input */
  helperText?: string;
  /** Additional CSS classes */
  className?: string;
}

export function TextFeedback({
  question,
  description,
  value = '',
  onChange,
  required = false,
  error,
  disabled = false,
  allowSkip = false,
  onSkip,
  maxLength = 500,
  minLength,
  placeholder = 'Share your thoughts...',
  rows = 4,
  helperText,
  className,
}: TextFeedbackProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    
    // Enforce max length
    if (maxLength && newValue.length > maxLength) {
      return;
    }
    
    onChange?.(newValue);
  }, [onChange, maxLength]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const characterCount = value.length;
  const isAtMaxLength = maxLength && characterCount >= maxLength;
  const isUnderMinLength = minLength && characterCount < minLength;
  
  // Character count color based on remaining characters
  const getCharacterCountColor = () => {
    if (!maxLength) return 'text-warm-gray';
    
    const remaining = maxLength - characterCount;
    if (remaining <= 0) return 'text-warm-gray';
    if (remaining <= 50) return 'text-warm-gray';
    return 'text-warm-gray';
  };

  const inputId = `text-feedback-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const counterId = maxLength ? `${inputId}-counter` : undefined;

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

      {/* Text Input */}
      <div className="space-y-2">
        <div className="relative">
          <textarea
            id={inputId}
            value={value}
            onChange={handleTextChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            className={cn(
              // Base styles
              "w-full rounded-lg resize-none",
              "text-off-black dark:text-off-white",
              "placeholder:text-warm-gray",
              "transition-all duration-200",
              // Size and spacing
              "px-4 py-3 text-base leading-relaxed",
              // Border and background
              "border border-light-gray dark:border-warm-gray/30",
              "bg-off-white dark:bg-off-black",
              // Focus styles
              "focus:border-primary focus:ring-2 focus:ring-primary/20",
              "focus:outline-none",
              // Error state
              error && [
                "border-warm-gray",
                "focus:border-warm-gray focus:ring-warm-gray/20",
              ],
              // Disabled state
              "disabled:opacity-50 disabled:cursor-not-allowed",
              // Touch target optimization
              "min-h-[44px]"
            )}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={cn(
              errorId,
              helperId,
              counterId
            ).trim() || undefined}
            aria-required={required}
          />
          
          {/* Focus ring enhancement */}
          {isFocused && !disabled && (
            <div className="absolute inset-0 rounded-lg ring-2 ring-primary/20 pointer-events-none" />
          )}
        </div>

        {/* Character count and helper text */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            {helperText && !error && (
              <p
                id={helperId}
                className="text-sm text-warm-gray"
              >
                {helperText}
              </p>
            )}
          </div>
          
          {maxLength && (
            <div
              id={counterId}
              className={cn(
                "text-sm tabular-nums",
                getCharacterCountColor(),
                isAtMaxLength && "font-medium"
              )}
              aria-live="polite"
              aria-label={`${characterCount} of ${maxLength} characters used`}
            >
              {characterCount}/{maxLength}
            </div>
          )}
        </div>
      </div>

      {/* Validation Error */}
      {error && (
        <ValidationMessage type="error" message={error} />
      )}

      {/* Minimum length warning */}
      {minLength && characterCount > 0 && isUnderMinLength && (
        <ValidationMessage 
          type="warning" 
          message={`Please provide at least ${minLength} characters for a complete response.`} 
        />
      )}

      {/* Skip Option */}
      {allowSkip && onSkip && (
        <div className="flex justify-center">
          <SkipControl
            variant="subtle"
            onSkip={onSkip}
            disabled={disabled}
          >
            Skip this question
          </SkipControl>
        </div>
      )}
    </div>
  );
}

export default TextFeedback;