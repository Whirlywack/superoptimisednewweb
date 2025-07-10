import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { QuestionLabel } from "@/components/questionnaire/QuestionLabel";
import { ValidationMessage } from "@/components/ui/ValidationMessage";
import { SkipControl } from "@/components/ui/SkipControl";

export interface MatrixItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface MatrixPosition {
  effort: "low" | "high";
  impact: "low" | "high";
}

export interface MatrixSelection {
  itemId: string;
  position: MatrixPosition;
}

export interface PriorityMatrixProps {
  /** Question text */
  question: string;
  /** Optional description or context */
  description?: string;
  /** Array of items to be positioned in the matrix */
  items: MatrixItem[];
  /** Current selections with their positions */
  value?: MatrixSelection[];
  /** Callback when selections change */
  onChange?: (value: MatrixSelection[]) => void;
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
  /** Custom axis labels */
  effortLabel?: { low: string; high: string };
  impactLabel?: { low: string; high: string };
  /** Whether all items must be positioned */
  requireAllItems?: boolean;
  /** Helper text shown below matrix */
  helperText?: string;
  /** Additional CSS classes */
  className?: string;
}

const defaultEffortLabel = { low: "Low Effort", high: "High Effort" };
const defaultImpactLabel = { low: "Low Impact", high: "High Impact" };

const quadrantInfo = {
  "low-high": {
    label: "Quick Wins",
    color: "bg-off-white dark:bg-off-black border-primary text-off-black dark:text-off-white",
  },
  "high-high": {
    label: "Major Projects",
    color: "bg-light-gray border-warm-gray text-off-black dark:text-off-white",
  },
  "low-low": {
    label: "Fill-ins",
    color: "bg-off-white dark:bg-off-black border-light-gray text-warm-gray",
  },
  "high-low": {
    label: "Thankless Tasks",
    color: "bg-warm-gray/10 border-warm-gray text-warm-gray",
  },
};

export function PriorityMatrix({
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
  effortLabel = defaultEffortLabel,
  impactLabel = defaultImpactLabel,
  requireAllItems = false,
  helperText,
  className,
}: PriorityMatrixProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [hoveredQuadrant, setHoveredQuadrant] = useState<string | null>(null);

  const handleDragStart = useCallback(
    (event: React.DragEvent, itemId: string) => {
      if (disabled) return;
      setDraggedItem(itemId);
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", itemId);
    },
    [disabled]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setHoveredQuadrant(null);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const handleDragEnter = useCallback((quadrantKey: string) => {
    setHoveredQuadrant(quadrantKey);
  }, []);

  const handleDragLeave = useCallback(() => {
    setHoveredQuadrant(null);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent, effort: "low" | "high", impact: "low" | "high") => {
      event.preventDefault();
      if (disabled) return;

      const itemId = event.dataTransfer.getData("text/plain");
      if (!itemId) return;

      const newValue = value.filter((selection) => selection.itemId !== itemId);
      newValue.push({ itemId, position: { effort, impact } });

      onChange?.(newValue);
      setDraggedItem(null);
      setHoveredQuadrant(null);
    },
    [disabled, value, onChange]
  );

  const handleRemoveItem = useCallback(
    (itemId: string) => {
      if (disabled) return;
      const newValue = value.filter((selection) => selection.itemId !== itemId);
      onChange?.(newValue);
    },
    [disabled, value, onChange]
  );

  const getItemsInQuadrant = useCallback(
    (effort: "low" | "high", impact: "low" | "high") => {
      return value.filter(
        (selection) => selection.position.effort === effort && selection.position.impact === impact
      );
    },
    [value]
  );

  const getUnplacedItems = useCallback(() => {
    const placedItemIds = new Set(value.map((selection) => selection.itemId));
    return items.filter((item) => !placedItemIds.has(item.id) && !item.disabled);
  }, [items, value]);

  const quadrantKey = (effort: "low" | "high", impact: "low" | "high") => `${effort}-${impact}`;

  const renderQuadrant = (effort: "low" | "high", impact: "low" | "high") => {
    const key = quadrantKey(effort, impact);
    const quadrantItems = getItemsInQuadrant(effort, impact);
    const quadrant = quadrantInfo[key as keyof typeof quadrantInfo];
    const isHovered = hoveredQuadrant === key;

    return (
      <div
        key={key}
        className={cn(
          "relative min-h-[120px] rounded-lg border-2 border-dashed p-4 transition-all duration-200",
          quadrant.color,
          isHovered && "scale-102 border-solid shadow-md",
          disabled && "opacity-50"
        )}
        onDragOver={handleDragOver}
        onDragEnter={() => handleDragEnter(key)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, effort, impact)}
      >
        {/* Quadrant Label */}
        <div className="mb-2 text-center text-xs font-semibold">{quadrant.label}</div>

        {/* Items in this quadrant */}
        <div className="space-y-2">
          {quadrantItems.map((selection) => {
            const item = items.find((i) => i.id === selection.itemId);
            if (!item) return null;

            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-md border border-light-gray bg-off-white p-2 shadow-sm dark:bg-off-black",
                  "flex items-center justify-between gap-2",
                  "transition-all duration-200 hover:shadow-md",
                  draggedItem === item.id && "opacity-50"
                )}
                draggable={!disabled}
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragEnd={handleDragEnd}
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  {item.icon && <span className="shrink-0 text-primary">{item.icon}</span>}
                  <span className="truncate text-sm font-medium">{item.label}</span>
                </div>

                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="flex size-5 shrink-0 items-center justify-center rounded-full bg-light-gray text-xs text-warm-gray transition-colors duration-200 hover:bg-warm-gray/20 hover:text-off-black"
                    aria-label={`Remove ${item.label} from matrix`}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Drop zone hint */}
        {quadrantItems.length === 0 && !disabled && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-warm-gray">
            Drop items here
          </div>
        )}
      </div>
    );
  };

  const unplacedItems = getUnplacedItems();
  const hasUnplacedItems = unplacedItems.length > 0;
  const allItemsPlaced = items.filter((item) => !item.disabled).length === value.length;

  const matrixId = `priority-matrix-${Math.random().toString(36).substr(2, 9)}`;
  const _errorId = error ? `${matrixId}-error` : undefined;
  const helperId = helperText ? `${matrixId}-helper` : undefined;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Question Header */}
      <div className="space-y-2">
        <QuestionLabel required={required}>{question}</QuestionLabel>
        {description && <p className="text-sm leading-relaxed text-warm-gray">{description}</p>}
      </div>

      {/* Unplaced Items */}
      {hasUnplacedItems && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-off-black dark:text-off-white">Items to place:</p>
          <div className="flex flex-wrap gap-2 rounded-lg border border-light-gray bg-light-gray p-3">
            {unplacedItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "rounded-md border border-light-gray bg-off-white p-2 shadow-sm dark:bg-off-black",
                  "flex cursor-move items-center gap-2",
                  "transition-all duration-200 hover:scale-105 hover:shadow-md",
                  draggedItem === item.id && "scale-95 opacity-50",
                  disabled && "cursor-not-allowed opacity-50"
                )}
                draggable={!disabled && !item.disabled}
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragEnd={handleDragEnd}
              >
                {item.icon && <span className="shrink-0 text-primary">{item.icon}</span>}
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority Matrix */}
      <div className="space-y-4">
        {/* Impact Axis Label */}
        <div className="text-center">
          <p className="text-sm font-medium text-off-black dark:text-off-white">
            {impactLabel.high}
          </p>
        </div>

        {/* Matrix Grid */}
        <div className="relative">
          {/* Effort Axis Labels */}
          <div className="absolute -left-16 top-1/2 origin-center -translate-y-1/2 -rotate-90">
            <p className="whitespace-nowrap text-sm font-medium text-off-black dark:text-off-white">
              {effortLabel.low}
            </p>
          </div>
          <div className="absolute -right-16 top-1/2 origin-center -translate-y-1/2 rotate-90">
            <p className="whitespace-nowrap text-sm font-medium text-off-black dark:text-off-white">
              {effortLabel.high}
            </p>
          </div>

          {/* Grid */}
          <div className="mx-20 grid grid-cols-2 gap-4">
            {/* Top Row: High Impact */}
            {renderQuadrant("low", "high")}
            {renderQuadrant("high", "high")}

            {/* Bottom Row: Low Impact */}
            {renderQuadrant("low", "low")}
            {renderQuadrant("high", "low")}
          </div>
        </div>

        {/* Impact Axis Label */}
        <div className="text-center">
          <p className="text-sm font-medium text-off-black dark:text-off-white">
            {impactLabel.low}
          </p>
        </div>
      </div>

      {/* Instructions */}
      {!disabled && hasUnplacedItems && (
        <div className="rounded-lg bg-light-gray p-3 text-sm text-warm-gray">
          <strong>Tip:</strong> Drag and drop items from above into the appropriate quadrant based
          on their effort requirement and expected impact.
        </div>
      )}

      {/* Progress Indicator */}
      {requireAllItems && (
        <div className="text-sm text-warm-gray">
          Progress: {value.length} of {items.filter((item) => !item.disabled).length} items placed
          {allItemsPlaced && <span className="ml-2 font-medium text-primary">Complete</span>}
        </div>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p id={helperId} className="text-sm text-warm-gray">
          {helperText}
        </p>
      )}

      {/* Validation Error */}
      {error && <ValidationMessage type="error" message={error} />}

      {/* Required items warning */}
      {requireAllItems && hasUnplacedItems && (
        <ValidationMessage
          type="warning"
          message="Please place all items in the matrix to continue."
        />
      )}

      {/* Skip Option */}
      {allowSkip && onSkip && (
        <div className="flex justify-center">
          <SkipControl variant="subtle" onClick={onSkip} disabled={disabled}>
            Skip this question
          </SkipControl>
        </div>
      )}
    </div>
  );
}

export default PriorityMatrix;
