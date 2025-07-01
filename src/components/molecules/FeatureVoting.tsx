import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { QuestionLabel } from '@/components/questionnaire/QuestionLabel';
import { ValidationMessage } from '@/components/ui/ValidationMessage';
import { SkipControl } from '@/components/ui/SkipControl';
import { Plus, Minus, Coins } from 'lucide-react';

export interface VotingOption {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  minPoints?: number;
  maxPoints?: number;
  disabled?: boolean;
}

export interface FeatureVote {
  optionId: string;
  points: number;
}

export interface FeatureVotingProps {
  /** Question text */
  question: string;
  /** Optional description or context */
  description?: string;
  /** Array of options to vote on */
  options: VotingOption[];
  /** Total points available to allocate */
  totalPoints: number;
  /** Current vote allocations */
  value?: FeatureVote[];
  /** Callback when votes change */
  onChange?: (value: FeatureVote[]) => void;
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
  /** Step size for point allocation */
  pointStep?: number;
  /** Whether all points must be allocated */
  requireAllPoints?: boolean;
  /** Layout variant */
  layout?: 'cards' | 'list' | 'compact';
  /** Helper text shown below voting area */
  helperText?: string;
  /** Additional CSS classes */
  className?: string;
}

export function FeatureVoting({
  question,
  description,
  options,
  totalPoints,
  value = [],
  onChange,
  required = false,
  error,
  disabled = false,
  allowSkip = false,
  onSkip,
  pointStep = 1,
  requireAllPoints = false,
  layout = 'cards',
  helperText,
  className,
}: FeatureVotingProps) {
  const [focusedOption, setFocusedOption] = useState<string | null>(null);

  // Calculate points allocated and remaining
  const pointsAllocated = useMemo(() => {
    return value.reduce((sum, vote) => sum + vote.points, 0);
  }, [value]);

  const pointsRemaining = totalPoints - pointsAllocated;

  // Get points for a specific option
  const getOptionPoints = useCallback((optionId: string) => {
    const vote = value.find(v => v.optionId === optionId);
    return vote?.points || 0;
  }, [value]);

  // Update points for an option
  const updatePoints = useCallback((optionId: string, newPoints: number) => {
    if (disabled) return;

    const option = options.find(opt => opt.id === optionId);
    if (!option || option.disabled) return;

    // Enforce min/max constraints
    const minPoints = option.minPoints || 0;
    const maxPoints = option.maxPoints || totalPoints;
    const constrainedPoints = Math.max(minPoints, Math.min(maxPoints, newPoints));

    // Calculate if this would exceed total points
    const currentPoints = getOptionPoints(optionId);
    const pointDifference = constrainedPoints - currentPoints;
    
    if (pointDifference > pointsRemaining) {
      // Can't allocate more points than remaining
      const maxAllowable = currentPoints + pointsRemaining;
      const finalPoints = Math.min(maxAllowable, constrainedPoints);
      
      if (finalPoints === currentPoints) return; // No change
      
      updateVotes(optionId, finalPoints);
    } else {
      updateVotes(optionId, constrainedPoints);
    }
  }, [disabled, options, totalPoints, getOptionPoints, pointsRemaining]);

  // Update the votes array
  const updateVotes = useCallback((optionId: string, points: number) => {
    const newVotes = [...value];
    const existingIndex = newVotes.findIndex(v => v.optionId === optionId);

    if (points === 0) {
      // Remove vote if points are 0
      if (existingIndex >= 0) {
        newVotes.splice(existingIndex, 1);
      }
    } else {
      // Add or update vote
      if (existingIndex >= 0) {
        newVotes[existingIndex] = { optionId, points };
      } else {
        newVotes.push({ optionId, points });
      }
    }

    onChange?.(newVotes);
  }, [value, onChange]);

  // Handle increment/decrement
  const handleIncrement = useCallback((optionId: string) => {
    const currentPoints = getOptionPoints(optionId);
    updatePoints(optionId, currentPoints + pointStep);
  }, [getOptionPoints, updatePoints, pointStep]);

  const handleDecrement = useCallback((optionId: string) => {
    const currentPoints = getOptionPoints(optionId);
    updatePoints(optionId, currentPoints - pointStep);
  }, [getOptionPoints, updatePoints, pointStep]);

  // Handle direct input
  const handleInputChange = useCallback((optionId: string, inputValue: string) => {
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue)) {
      updatePoints(optionId, numValue);
    }
  }, [updatePoints]);

  // Reset all votes
  const handleReset = useCallback(() => {
    onChange?.([]);
  }, [onChange]);

  const renderOption = (option: VotingOption) => {
    const points = getOptionPoints(option.id);
    const isDisabled = disabled || option.disabled;
    const canIncrement = !isDisabled && (pointsRemaining > 0 || points > 0) && 
                        (!option.maxPoints || points < option.maxPoints);
    const canDecrement = !isDisabled && points > (option.minPoints || 0);
    const isFocused = focusedOption === option.id;

    const optionContent = (
      <>
        {/* Option Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {option.icon && (
              <span className="flex-shrink-0 text-primary">
                {option.icon}
              </span>
            )}
            <h3 className="font-medium text-off-black dark:text-off-white truncate">
              {option.label}
            </h3>
          </div>
          {option.description && (
            <p className="text-sm text-warm-gray mt-1 leading-relaxed">
              {option.description}
            </p>
          )}
        </div>

        {/* Points Control */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleDecrement(option.id)}
            disabled={!canDecrement}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              canDecrement
                ? "bg-light-gray hover:bg-warm-gray/20 text-off-black dark:text-off-white"
                : "bg-light-gray/50 text-warm-gray/50 cursor-not-allowed"
            )}
            aria-label={`Decrease points for ${option.label}`}
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="w-16 text-center">
            <input
              type="number"
              value={points}
              onChange={(e) => handleInputChange(option.id, e.target.value)}
              onFocus={() => setFocusedOption(option.id)}
              onBlur={() => setFocusedOption(null)}
              disabled={isDisabled}
              min={option.minPoints || 0}
              max={option.maxPoints || totalPoints}
              step={pointStep}
              className={cn(
                "w-full text-center rounded-md px-2 py-1",
                "text-lg font-semibold tabular-nums",
                "border-2 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isFocused
                  ? "border-primary bg-primary/5"
                  : "border-light-gray bg-off-white dark:bg-off-black",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              aria-label={`Points for ${option.label}`}
            />
          </div>

          <button
            type="button"
            onClick={() => handleIncrement(option.id)}
            disabled={!canIncrement}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              canIncrement
                ? "bg-light-gray hover:bg-warm-gray/20 text-off-black dark:text-off-white"
                : "bg-light-gray/50 text-warm-gray/50 cursor-not-allowed"
            )}
            aria-label={`Increase points for ${option.label}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </>
    );

    // Render based on layout
    switch (layout) {
      case 'list':
        return (
          <div
            key={option.id}
            className={cn(
              "flex items-center gap-4 p-4",
              "border-b border-light-gray last:border-b-0",
              isDisabled && "opacity-50"
            )}
          >
            {optionContent}
          </div>
        );

      case 'compact':
        return (
          <div
            key={option.id}
            className={cn(
              "flex items-center justify-between gap-3 p-3",
              "rounded-lg bg-light-gray/30",
              isDisabled && "opacity-50"
            )}
          >
            <span className="font-medium text-sm truncate">{option.label}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleDecrement(option.id)}
                disabled={!canDecrement}
                className={cn(
                  "w-6 h-6 rounded flex items-center justify-center text-sm",
                  canDecrement
                    ? "bg-off-white hover:bg-light-gray text-off-black"
                    : "bg-light-gray text-warm-gray/50 cursor-not-allowed"
                )}
              >
                -
              </button>
              <span className="w-8 text-center font-semibold text-sm">
                {points}
              </span>
              <button
                type="button"
                onClick={() => handleIncrement(option.id)}
                disabled={!canIncrement}
                className={cn(
                  "w-6 h-6 rounded flex items-center justify-center text-sm",
                  canIncrement
                    ? "bg-off-white hover:bg-light-gray text-off-black"
                    : "bg-light-gray text-warm-gray/50 cursor-not-allowed"
                )}
              >
                +
              </button>
            </div>
          </div>
        );

      case 'cards':
      default:
        return (
          <div
            key={option.id}
            className={cn(
              "flex items-center gap-4 p-4",
              "border rounded-lg transition-all duration-200",
              points > 0
                ? "border-primary bg-primary/5"
                : "border-light-gray bg-off-white dark:bg-off-black",
              !isDisabled && "hover:border-primary/50",
              isDisabled && "opacity-50"
            )}
          >
            {optionContent}
          </div>
        );
    }
  };

  const votingId = `feature-voting-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${votingId}-error` : undefined;
  const helperId = helperText ? `${votingId}-helper` : undefined;

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

      {/* Points Status Bar */}
      <div className="bg-light-gray rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary" />
            <span className="font-medium text-off-black dark:text-off-white">
              Points Available
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className={cn(
              "text-2xl font-bold tabular-nums",
              pointsRemaining === 0 ? "text-primary" : "text-off-black dark:text-off-white"
            )}>
              {pointsRemaining}
            </span>
            <span className="text-sm text-warm-gray">
              of {totalPoints}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-warm-gray/20 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(pointsAllocated / totalPoints) * 100}%` }}
          />
        </div>

        {/* Quick Actions */}
        {pointsAllocated > 0 && (
          <button
            type="button"
            onClick={handleReset}
            disabled={disabled}
            className="mt-3 text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset all votes
          </button>
        )}
      </div>

      {/* Voting Options */}
      <div className={cn(
        layout === 'cards' && "space-y-3",
        layout === 'list' && "border border-light-gray rounded-lg overflow-hidden",
        layout === 'compact' && "grid grid-cols-1 sm:grid-cols-2 gap-2"
      )}>
        {options.map(option => renderOption(option))}
      </div>

      {/* Helper Text */}
      {helperText && !error && (
        <p id={helperId} className="text-sm text-warm-gray">
          {helperText}
        </p>
      )}

      {/* Validation Error */}
      {error && (
        <ValidationMessage type="error" message={error} />
      )}

      {/* All Points Required Warning */}
      {requireAllPoints && pointsRemaining > 0 && (
        <ValidationMessage 
          type="warning" 
          message={`Please allocate all ${totalPoints} points. You have ${pointsRemaining} points remaining.`} 
        />
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

export default FeatureVoting;