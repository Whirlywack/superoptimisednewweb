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
          <p className="text-warm-gray text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Instructions */}
      <div className="text-sm text-warm-gray bg-light-gray p-3 rounded-lg">
        {variant === 'drag' ? (
          <p>Drag and drop items to rank them from most to least important.</p>
        ) : (
          <p>Use the arrow buttons to move items up or down to rank them from most to least important.</p>
        )}
        <p className="mt-1">Position 1 = Most important, Position {ranking.length} = Least important</p>
      </div>

      {/* Item limit warning */}
      {items.length > 6 && (
        <div className="text-xs text-warm-gray bg-light-gray p-3 rounded-lg">
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
                "flex items-center gap-4 p-4 bg-off-white border-2 rounded-lg transition-all",
                "hover:border-primary/50",
                isBeingDragged && "opacity-50 scale-95",
                disabled && "opacity-50",
                variant === 'drag' && !disabled && "cursor-move"
              )}
            >
              {/* Position Number */}
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-off-white rounded-full flex items-center justify-center text-sm font-medium">
                {position}
              </div>

              {/* Drag Handle (for drag variant) */}
              {variant === 'drag' && !disabled && (
                <div className="flex-shrink-0 text-warm-gray cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-5 h-5" />
                </div>
              )}

              {/* Item Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  {item.icon && (
                    <div className="flex-shrink-0 text-primary">
                      {item.icon}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="font-medium text-off-black truncate">
                      {item.label}
                    </h4>
                    {item.description && (
                      <p className="text-sm text-warm-gray mt-1">
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
                      "p-1 rounded border text-warm-gray hover:text-off-black hover:border-primary/50",
                      "disabled:opacity-30 disabled:cursor-not-allowed",
                      "transition-colors"
                    )}
                    aria-label={`Move ${item.label} up`}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === ranking.length - 1}
                    className={cn(
                      "p-1 rounded border text-warm-gray hover:text-off-black hover:border-primary/50",
                      "disabled:opacity-30 disabled:cursor-not-allowed",
                      "transition-colors"
                    )}
                    aria-label={`Move ${item.label} down`}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current Ranking Summary */}
      <div className="text-sm text-warm-gray bg-light-gray p-3 rounded-lg">
        <h4 className="font-medium text-off-black mb-2">Current Ranking:</h4>
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
            onSkip={onSkip}
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