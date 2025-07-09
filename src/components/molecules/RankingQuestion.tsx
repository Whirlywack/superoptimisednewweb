import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { QuestionLabel } from '@/components/questionnaire/QuestionLabel';
import { ValidationMessage } from '@/components/ui/ValidationMessage';
import { SkipControl } from '@/components/ui/SkipControl';
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

export interface RankingItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface RankingQuestionProps {
  /** Question text */
  question: string;
  /** Optional description or context */
  description?: string;
  /** Items to be ranked (max 6 for usability) */
  items: RankingItem[];
  /** Current ranking order (array of item IDs) */
  value?: string[];
  /** Callback when ranking changes */
  onChange?: (value: string[]) => void;
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
  /** Interaction method */
  variant?: 'drag' | 'buttons';
  /** Additional CSS classes */
  className?: string;
}

export function RankingQuestion({
  question,
  description,
  items,
  value = [],
  onChange,
  required = false,
  error,
  disabled = false,
  allowSkip = false,
  onSkip,
  variant = 'buttons',
  className,
}: RankingQuestionProps) {
  // Limit to 6 items for optimal mobile experience
  const limitedItems = items.slice(0, 6);
  
  // Initialize ranking with provided value or default order
  const [ranking, setRanking] = useState<string[]>(() => {
    if (value.length > 0) {
      return value;
    }
    return limitedItems.map(item => item.id);
  });

  // For drag and drop
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const draggedOverIndex = useRef<number | null>(null);

  const handleRankingChange = (newRanking: string[]) => {
    setRanking(newRanking);
    if (onChange) {
      onChange(newRanking);
    }
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (disabled) return;
    
    const newRanking = [...ranking];
    const item = newRanking.splice(fromIndex, 1)[0];
    newRanking.splice(toIndex, 0, item);
    handleRankingChange(newRanking);
  };

  const moveUp = (index: number) => {
    if (index > 0) {
      moveItem(index, index - 1);
    }
  };

  const moveDown = (index: number) => {
    if (index < ranking.length - 1) {
      moveItem(index, index + 1);
    }
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    draggedOverIndex.current = index;
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && draggedOverIndex.current !== null) {
      moveItem(draggedIndex, draggedOverIndex.current);
    }
    setDraggedIndex(null);
    draggedOverIndex.current = null;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleDragEnd();
  };

  const getItemByRankingId = (id: string) => {
    return limitedItems.find(item => item.id === id);
  };

  const getRankingPosition = (index: number) => {
    return index + 1;
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

      {/* Instructions */}
      <div className="rounded-lg bg-light-gray p-3 text-sm text-warm-gray">
        {variant === 'drag' ? (
          <p>Drag and drop items to rank them from most to least important.</p>
        ) : (
          <p>Use the arrow buttons to move items up or down to rank them from most to least important.</p>
        )}
        <p className="mt-1">Position 1 = Most important, Position {ranking.length} = Least important</p>
      </div>

      {/* Item limit warning */}
      {items.length > 6 && (
        <div className="rounded-lg bg-light-gray p-3 text-xs text-warm-gray">
          Note: Only the first 6 items are shown for optimal mobile experience.
        </div>
      )}

      {/* Ranking List */}
      <div className="space-y-3">
        {ranking.map((itemId, index) => {
          const item = getItemByRankingId(itemId);
          if (!item) return null;

          const position = getRankingPosition(index);
          const isBeingDragged = draggedIndex === index;

          return (
            <div
              key={item.id}
              draggable={variant === 'drag' && !disabled}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              className={cn(
                "flex items-center gap-4 rounded-lg border-2 bg-off-white p-4 transition-all",
                "hover:border-primary/50",
                isBeingDragged && "scale-95 opacity-50",
                disabled && "opacity-50",
                variant === 'drag' && !disabled && "cursor-move"
              )}
            >
              {/* Position Number */}
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-off-white">
                {position}
              </div>

              {/* Drag Handle (for drag variant) */}
              {variant === 'drag' && !disabled && (
                <div className="shrink-0 cursor-grab text-warm-gray active:cursor-grabbing">
                  <GripVertical className="size-5" />
                </div>
              )}

              {/* Item Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  {item.icon && (
                    <div className="shrink-0 text-primary">
                      {item.icon}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="truncate font-medium text-off-black">
                      {item.label}
                    </h4>
                    {item.description && (
                      <p className="mt-1 text-sm text-warm-gray">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Move Buttons (for buttons variant) */}
              {variant === 'buttons' && !disabled && (
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className={cn(
                      "rounded border p-1 text-warm-gray hover:border-primary/50 hover:text-off-black",
                      "disabled:cursor-not-allowed disabled:opacity-30",
                      "transition-colors"
                    )}
                    aria-label={`Move ${item.label} up`}
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === ranking.length - 1}
                    className={cn(
                      "rounded border p-1 text-warm-gray hover:border-primary/50 hover:text-off-black",
                      "disabled:cursor-not-allowed disabled:opacity-30",
                      "transition-colors"
                    )}
                    aria-label={`Move ${item.label} down`}
                  >
                    <ArrowDown className="size-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current Ranking Summary */}
      <div className="rounded-lg bg-light-gray p-3 text-sm text-warm-gray">
        <h4 className="mb-2 font-medium text-off-black">Current Ranking:</h4>
        <ol className="space-y-1">
          {ranking.map((itemId, index) => {
            const item = getItemByRankingId(itemId);
            return item ? (
              <li key={item.id} className="flex items-center gap-2">
                <span className="font-medium">{index + 1}.</span>
                <span>{item.label}</span>
              </li>
            ) : null;
          })}
        </ol>
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
            Skip this ranking
          </SkipControl>
        </div>
      )}
    </div>
  );
}

export default RankingQuestion;