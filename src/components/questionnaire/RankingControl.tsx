import React from "react";
import { cn } from "@/lib/utils";
import { GripVertical, ArrowUp, ArrowDown, X } from "lucide-react";

interface RankingControlProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  description?: string;
  rank: number;
  totalItems: number;
  selected?: boolean;
  dragging?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove?: () => void;
  removable?: boolean;
  variant?: "default" | "compact" | "detailed";
  showRankNumber?: boolean;
}

export function RankingControl({
  label,
  description,
  rank,
  totalItems,
  selected = false,
  dragging = false,
  onMoveUp,
  onMoveDown,
  onRemove,
  removable = false,
  variant = "default",
  showRankNumber = true,
  className,
  ...props
}: RankingControlProps) {
  const canMoveUp = rank > 1;
  const canMoveDown = rank < totalItems;

  return (
    <div
      className={cn(
        "relative flex items-center gap-3 rounded-lg border p-3 transition-all duration-200",
        "bg-background hover:bg-muted/50",
        selected && "border-primary bg-primary/5",
        dragging && "scale-[1.02] border-primary bg-background shadow-lg",
        variant === "compact" && "p-2",
        variant === "detailed" && "p-4",
        className
      )}
      {...props}
    >
      {/* Rank Number */}
      {showRankNumber && (
        <div className={cn(
          "size-8 shrink-0 rounded-full bg-primary text-primary-foreground",
          "flex items-center justify-center text-sm font-bold",
          variant === "compact" && "size-6 text-xs"
        )}>
          {rank}
        </div>
      )}

      {/* Drag Handle */}
      <div className={cn(
        "shrink-0 cursor-grab active:cursor-grabbing",
        "rounded p-1 transition-colors hover:bg-muted",
        dragging && "cursor-grabbing"
      )}>
        <GripVertical className={cn(
          "size-5 text-muted-foreground",
          variant === "compact" && "size-4"
        )} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h3 className={cn(
          "truncate font-medium text-foreground",
          variant === "compact" ? "text-sm" : "text-base"
        )}>
          {label}
        </h3>
        {description && variant !== "compact" && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex shrink-0 items-center gap-1">
        {/* Move Up/Down Buttons */}
        <div className="hidden flex-col gap-1 sm:flex">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className={cn(
              "rounded p-1 transition-colors hover:bg-muted",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              !canMoveUp && "cursor-not-allowed opacity-30"
            )}
            aria-label="Move up"
          >
            <ArrowUp className="size-3" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className={cn(
              "rounded p-1 transition-colors hover:bg-muted",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              !canMoveDown && "cursor-not-allowed opacity-30"
            )}
            aria-label="Move down"
          >
            <ArrowDown className="size-3" />
          </button>
        </div>

        {/* Remove Button */}
        {removable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className={cn(
              "hover:bg-destructive hover:text-destructive-foreground rounded p-1 transition-colors",
              "focus:ring-destructive focus:outline-none focus:ring-2 focus:ring-offset-2"
            )}
            aria-label="Remove item"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

interface RankableItemProps {
  id: string;
  label: string;
  description?: string;
  rank: number;
  totalItems: number;
  selected?: boolean;
  removable?: boolean;
  variant?: "default" | "compact" | "detailed";
}

interface RankingListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: RankableItemProps[];
  onChange: (newItems: RankableItemProps[]) => void;
  maxItems?: number;
  variant?: "default" | "compact" | "detailed";
  showInstructions?: boolean;
  dragEnabled?: boolean;
}

export function RankingList({
  items,
  onChange,
  maxItems,
  variant = "default",
  showInstructions = true,
  dragEnabled = true,
  className,
  ...props
}: RankingListProps) {
  const [draggedItem, setDraggedItem] = React.useState<string | null>(null);

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    
    // Update ranks
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
    
    onChange(updatedItems);
  };

  const moveUp = (index: number) => {
    if (index > 0) {
      moveItem(index, index - 1);
    }
  };

  const moveDown = (index: number) => {
    if (index < items.length - 1) {
      moveItem(index, index + 1);
    }
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    const updatedItems = newItems.map((item, i) => ({
      ...item,
      rank: i + 1,
    }));
    onChange(updatedItems);
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    if (!dragEnabled) return;
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", itemId);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!dragEnabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (!dragEnabled) return;
    e.preventDefault();
    
    const draggedId = e.dataTransfer.getData("text/html");
    const dragIndex = items.findIndex(item => item.id === draggedId);
    
    if (dragIndex !== -1 && dragIndex !== dropIndex) {
      moveItem(dragIndex, dropIndex);
    }
    
    setDraggedItem(null);
  };

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {/* Instructions */}
      {showInstructions && (
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>Drag items to reorder them, or use the arrow buttons.</p>
          {maxItems && (
            <p>Rank your top {maxItems} choices in order of preference.</p>
          )}
        </div>
      )}

      {/* Ranking List */}
      <div className="space-y-2" role="list">
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable={dragEnabled}
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            role="listitem"
          >
            <RankingControl
              label={item.label}
              description={item.description}
              rank={item.rank}
              totalItems={items.length}
              selected={item.selected}
              dragging={draggedItem === item.id}
              onMoveUp={() => moveUp(index)}
              onMoveDown={() => moveDown(index)}
              onRemove={item.removable ? () => removeItem(index) : undefined}
              removable={item.removable}
              variant={variant}
            />
          </div>
        ))}
      </div>

      {/* Items Count */}
      <div className="text-center text-xs text-muted-foreground">
        {items.length} item{items.length !== 1 ? 's' : ''} ranked
        {maxItems && ` (${maxItems} max)`}
      </div>
    </div>
  );
}

interface SimpleDragDropProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: Array<{ id: string; content: React.ReactNode }>;
  onChange: (itemIds: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SimpleDragDrop({
  items,
  onChange,
  placeholder = "Drag items here",
  disabled = false,
  className,
  ...props
}: SimpleDragDropProps) {
  const [draggedOver, setDraggedOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setDraggedOver(true);
  };

  const handleDragLeave = () => {
    setDraggedOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    setDraggedOver(false);
    
    const itemId = e.dataTransfer.getData("text/html");
    const currentIds = items.map(item => item.id);
    
    if (!currentIds.includes(itemId)) {
      onChange([...currentIds, itemId]);
    }
  };

  return (
    <div
      className={cn(
        "min-h-[120px] rounded-lg border-2 border-dashed p-4 transition-colors",
        draggedOver ? "border-primary bg-primary/5" : "border-border",
        disabled && "opacity-50",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      {...props}
    >
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">
                {index + 1}.
              </span>
              <div className="flex-1">{item.content}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          {placeholder}
        </div>
      )}
    </div>
  );
}