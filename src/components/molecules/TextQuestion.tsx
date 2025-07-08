import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { QuestionLabel } from '@/components/questionnaire/QuestionLabel';
import { ValidationMessage } from '@/components/ui/ValidationMessage';
import { SkipControl } from '@/components/ui/SkipControl';
import { MessageCircle, CheckCircle } from 'lucide-react';

export interface TextQuestionProps {
  /** Question text */
  question: string;
  /** Optional description or context */
  description?: string;
  /** Current text value */
  value?: string;
  /** Callback when text changes */
  onChange?: (value: string) => void;
  /** Minimum character length */
  minLength?: number;
  /** Maximum character length */
  maxLength?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the question is required */
  required?: boolean;
  /** Input variant */
  variant?: 'textarea' | 'input';
  /** Validation error message */
  error?: string;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether to show skip option */
  allowSkip?: boolean;
  /** Skip callback */
  onSkip?: () => void;
  /** Auto-resize textarea */
  autoResize?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function TextQuestion({
  question,
  description,
  value = '',
  onChange,
  minLength = 0,
  maxLength = 1000,
  placeholder = 'Enter your response...',
  required = false,
  variant = 'textarea',
  error,
  disabled = false,
  allowSkip = false,
  onSkip,
  autoResize = true,
  className,
}: TextQuestionProps) {
  const [text, setText] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (autoResize && variant === 'textarea' && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text, autoResize, variant]);

  const handleTextChange = (newText: string) => {
    // Enforce max length
    if (newText.length > maxLength) {
      return;
    }

    setText(newText);
    if (onChange) {
      onChange(newText);
    }
  };

  const isValid = text.length >= minLength && text.length <= maxLength;
  const characterCount = text.length;
  const remainingChars = maxLength - characterCount;
  const meetsMinimum = characterCount >= minLength;

  const getCharacterCountColor = () => {
    if (characterCount === 0) return 'text-warm-gray';
    if (!meetsMinimum) return 'text-orange-600';
    if (remainingChars <= 50) return 'text-yellow-600';
    return 'text-primary';
  };

  const commonInputClasses = cn(
    "w-full px-4 py-3 border-2 rounded-lg transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-primary/20",
    isFocused ? "border-primary" : "border-light-gray",
    disabled ? "bg-light-gray cursor-not-allowed opacity-50" : "bg-off-white",
    "text-off-black placeholder-warm-gray",
    "resize-none" // Prevent manual resize for textarea
  );

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
        <div className="flex items-center justify-between text-xs text-warm-gray">
          <span>
            {minLength > 0 ? `Minimum ${minLength} characters` : 'Optional response'}
          </span>
          <span>Maximum {maxLength} characters</span>
        </div>
      </div>

      {/* Input Field */}
      <div className="relative">
        {variant === 'textarea' ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={4}
            className={cn(commonInputClasses, "min-h-[120px]")}
            aria-describedby="character-count"
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            className={commonInputClasses}
            aria-describedby="character-count"
          />
        )}

        {/* Input Status Icon */}
        <div className="absolute right-3 top-3 pointer-events-none">
          {text.length > 0 && (
            <>
              {isValid ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <MessageCircle className="w-5 h-5 text-warm-gray" />
              )}
            </>
          )}
        </div>
      </div>

      {/* Character Count and Status */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {meetsMinimum ? (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              Minimum requirement met
            </span>
          ) : minLength > 0 ? (
            <span className="text-orange-600">
              {minLength - characterCount} more characters needed
            </span>
          ) : (
            <span className="text-warm-gray">Optional</span>
          )}
        </div>
        
        <div id="character-count" className={getCharacterCountColor()}>
          <span className="font-mono">
            {characterCount}/{maxLength}
          </span>
          {remainingChars <= 50 && remainingChars > 0 && (
            <span className="ml-1 text-xs">
              ({remainingChars} remaining)
            </span>
          )}
        </div>
      </div>

      {/* Text Preview */}
      {text.length > 0 && (
        <div className="bg-light-gray p-4 rounded-lg">
          <h4 className="font-medium text-off-black mb-2 flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Your Response Preview:
          </h4>
          <div className="text-sm text-warm-gray bg-off-white p-3 rounded border italic">
            &quot;{text}&quot;
          </div>
        </div>
      )}

      {/* Writing Tips */}
      {isFocused && text.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">💡 Writing Tips:</h4>
          <ul className="text-sm text-blue-600 space-y-1">
            <li>• Be specific and detailed in your response</li>
            <li>• Share your personal experience or perspective</li>
            <li>• Use examples to illustrate your points</li>
            {minLength > 0 && (
              <li>• Aim for at least {minLength} characters for a complete response</li>
            )}
          </ul>
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

export default TextQuestion;