import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { QuestionLabel } from "@/components/questionnaire/QuestionLabel";
import { ValidationMessage } from "@/components/ui/ValidationMessage";
import { SkipControl } from "@/components/ui/SkipControl";
import { Star, ThumbsUp } from "lucide-react";

export interface RatingQuestionProps {
  /** Question text */
  question: string;
  /** Optional description or context */
  description?: string;
  /** Rating scale (e.g., 5 for 1-5, 10 for 1-10) */
  scale?: number;
  /** Visual style of the rating */
  variant?: "stars" | "numbers" | "thumbs";
  /** Current rating value */
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
  /** Custom labels for scale endpoints */
  scaleLabels?: { min: string; max: string };
  /** Additional CSS classes */
  className?: string;
}

export function RatingQuestion({
  question,
  description,
  scale = 10,
  variant = "numbers",
  value,
  onChange,
  required = false,
  error,
  disabled = false,
  allowSkip = false,
  onSkip,
  scaleLabels,
  className,
}: RatingQuestionProps) {
  const [rating, setRating] = useState<number | null>(value || null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleRatingSelect = (selectedRating: number) => {
    if (disabled) return;

    setRating(selectedRating);
    if (onChange) {
      onChange(selectedRating);
    }
  };

  const handleMouseEnter = (ratingValue: number) => {
    if (!disabled) {
      setHoverRating(ratingValue);
    }
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  const _getDisplayRating = () => hoverRating || rating || 0;

  const renderStarRating = () => {
    const stars = [];
    const displayRating = _getDisplayRating();

    for (let i = 1; i <= scale; i++) {
      const isActive = i <= displayRating;
      const isHovered = hoverRating && i <= hoverRating;

      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleRatingSelect(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          disabled={disabled}
          className={cn(
            "rounded p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
            disabled && "cursor-not-allowed opacity-50"
          )}
          aria-label={`Rate ${i} out of ${scale} stars`}
        >
          <Star
            className={cn(
              "size-8 transition-colors",
              isActive || isHovered
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-warm-gray hover:text-yellow-300"
            )}
          />
        </button>
      );
    }

    return <div className="flex items-center justify-center gap-1 py-4">{stars}</div>;
  };

  const renderNumberRating = () => {
    const numbers = [];
    const _displayRating = _getDisplayRating();

    for (let i = 1; i <= scale; i++) {
      const isSelected = i === rating;
      const isHovered = hoverRating === i;

      numbers.push(
        <button
          key={i}
          type="button"
          onClick={() => handleRatingSelect(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          disabled={disabled}
          className={cn(
            "size-12 rounded-lg border-2 transition-all duration-200",
            "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20",
            isSelected || isHovered
              ? "border-primary bg-primary text-off-white"
              : "border-light-gray bg-off-white text-off-black hover:border-primary/50",
            disabled && "cursor-not-allowed opacity-50 hover:scale-100"
          )}
          aria-label={`Rate ${i} out of ${scale}`}
          aria-pressed={isSelected}
        >
          <span className="font-semibold">{i}</span>
        </button>
      );
    }

    return <div className="flex flex-wrap items-center justify-center gap-2 py-4">{numbers}</div>;
  };

  const renderThumbsRating = () => {
    // Simplified thumbs rating (good for 2-5 scale)
    const displayScale = Math.min(scale, 5);
    const thumbs = [];
    const displayRating = _getDisplayRating();

    for (let i = 1; i <= displayScale; i++) {
      const isActive = i <= displayRating;
      const isHovered = hoverRating && i <= hoverRating;

      thumbs.push(
        <button
          key={i}
          type="button"
          onClick={() => handleRatingSelect(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          disabled={disabled}
          className={cn(
            "rounded-lg border-2 p-3 transition-all duration-200",
            "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/20",
            isActive || isHovered
              ? "border-primary bg-primary text-off-white"
              : "border-light-gray bg-off-white text-off-black hover:border-primary/50",
            disabled && "cursor-not-allowed opacity-50 hover:scale-100"
          )}
          aria-label={`Rate ${i} out of ${displayScale}`}
          aria-pressed={isActive && !hoverRating}
        >
          <ThumbsUp className="size-6" />
        </button>
      );
    }

    return <div className="flex items-center justify-center gap-3 py-4">{thumbs}</div>;
  };

  const getRatingComponent = () => {
    switch (variant) {
      case "stars":
        return renderStarRating();
      case "thumbs":
        return renderThumbsRating();
      case "numbers":
      default:
        return renderNumberRating();
    }
  };

  const getVariantDescription = () => {
    switch (variant) {
      case "stars":
        return `Rate from 1 to ${scale} stars`;
      case "thumbs":
        return "Rate your satisfaction level";
      case "numbers":
      default:
        return `Rate from 1 to ${scale}`;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Question Header */}
      <div className="space-y-2">
        <QuestionLabel required={required}>{question}</QuestionLabel>
        {description && <p className="text-sm leading-relaxed text-warm-gray">{description}</p>}
        <p className="text-xs text-warm-gray">{getVariantDescription()}</p>
      </div>

      {/* Rating Component */}
      <div className="rounded-lg border-2 border-light-gray bg-off-white p-6">
        {getRatingComponent()}

        {/* Scale Labels */}
        {scaleLabels && (
          <div className="mt-4 flex justify-between text-xs text-warm-gray">
            <span>{scaleLabels.min}</span>
            <span>{scaleLabels.max}</span>
          </div>
        )}
      </div>

      {/* Selected Rating Display */}
      {rating && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-off-white">
            <span className="font-medium">Your Rating:</span>
            <span className="text-lg font-bold">
              {rating}/{scale}
            </span>
            {variant === "stars" && <Star className="size-4 fill-current" />}
          </div>
        </div>
      )}

      {/* Validation Error */}
      {error && <ValidationMessage type="error" message={error} />}

      {/* Skip Option */}
      {allowSkip && onSkip && (
        <div className="flex justify-center">
          <SkipControl variant="subtle" onClick={onSkip} disabled={disabled}>
            Skip this rating
          </SkipControl>
        </div>
      )}
    </div>
  );
}

export default RatingQuestion;
