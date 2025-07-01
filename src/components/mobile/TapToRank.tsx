import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../ui/Icon';
import { GripVertical, ChevronUp, ChevronDown, Check, X, RotateCcw } from 'lucide-react';

export interface RankableItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Optional description */
  description?: string;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Optional badge text */
  badge?: string;
}

export interface TapToRankProps {
  /** Array of items to rank */
  items: RankableItem[];
  /** Current ranking (array of item IDs in order) */
  value?: string[];
  /** Maximum number of items to rank */
  maxRanked?: number;
  /** Minimum number of items to rank */
  minRanked?: number;
  /** Visual style variant */
  variant?: 'default' | 'numbered' | 'compact';
  /** Interaction mode */
  mode?: 'tap-to-order' | 'tap-to-select' | 'drag-and-drop';
  /** Show ranking numbers */
  showNumbers?: boolean;
  /** Show item descriptions */
  showDescriptions?: boolean;
  /** Show action buttons (up/down arrows) */
  showActionButtons?: boolean;
  /** Show reset button */
  showReset?: boolean;
  /** Show progress indicator */
  showProgress?: boolean;
  /** Enable haptic feedback */
  enableHaptics?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Callback when ranking changes */
  onChange?: (rankedItems: string[]) => void;
  /** Callback when item is selected/deselected */
  onItemToggle?: (itemId: string, isSelected: boolean) => void;
  /** Callback when ranking is reset */
  onReset?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Disable the component */
  disabled?: boolean;
}

export function TapToRank({
  items,
  value = [],
  maxRanked,
  minRanked = 0,
  variant = 'default',
  mode = 'tap-to-order',
  showNumbers = true,
  showDescriptions = true,
  showActionButtons = true,
  showReset = false,
  showProgress = false,
  enableHaptics = true,
  animationDuration = 200,
  onChange,
  onItemToggle,
  onReset,
  className,
  disabled = false,
}: TapToRankProps) {
  const [rankedItems, setRankedItems] = useState<string[]>(value);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(value));
  
  // Sync with external value changes
  React.useEffect(() => {
    setRankedItems(value);
    setSelectedItems(new Set(value));
  }, [value]);
  
  // Haptic feedback
  const triggerHaptic = useCallback(() => {
    if (!enableHaptics || disabled) return;
    
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    } catch (error) {
      // Ignore haptic errors
    }
  }, [enableHaptics, disabled]);
  
  // Handle item selection/ordering
  const handleItemTap = useCallback((itemId: string) => {
    if (disabled) return;
    
    triggerHaptic();
    
    if (mode === 'tap-to-select') {
      const isSelected = selectedItems.has(itemId);
      const newSelected = new Set(selectedItems);
      
      if (isSelected) {
        newSelected.delete(itemId);
        const newRanked = rankedItems.filter(id => id !== itemId);
        setRankedItems(newRanked);
        onChange?.(newRanked);
      } else {
        if (!maxRanked || selectedItems.size < maxRanked) {
          newSelected.add(itemId);
          const newRanked = [...rankedItems, itemId];
          setRankedItems(newRanked);
          onChange?.(newRanked);
        }
      }
      
      setSelectedItems(newSelected);
      onItemToggle?.(itemId, !isSelected);
    } else {
      // tap-to-order mode
      const currentIndex = rankedItems.indexOf(itemId);
      
      if (currentIndex === -1) {
        // Add to ranking
        if (!maxRanked || rankedItems.length < maxRanked) {
          const newRanked = [...rankedItems, itemId];
          setRankedItems(newRanked);
          setSelectedItems(new Set(newRanked));
          onChange?.(newRanked);
        }
      } else {
        // Remove from ranking
        const newRanked = rankedItems.filter(id => id !== itemId);
        setRankedItems(newRanked);
        setSelectedItems(new Set(newRanked));
        onChange?.(newRanked);
      }
    }
  }, [disabled, mode, selectedItems, rankedItems, maxRanked, onChange, onItemToggle, triggerHaptic]);
  
  // Handle move up/down
  const handleMoveItem = useCallback((itemId: string, direction: 'up' | 'down') => {
    if (disabled) return;
    
    const currentIndex = rankedItems.indexOf(itemId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= rankedItems.length) return;
    
    const newRanked = [...rankedItems];
    [newRanked[currentIndex], newRanked[newIndex]] = [newRanked[newIndex], newRanked[currentIndex]];
    
    setRankedItems(newRanked);
    onChange?.(newRanked);
    triggerHaptic();
  }, [disabled, rankedItems, onChange, triggerHaptic]);
  
  // Handle reset
  const handleReset = useCallback(() => {
    if (disabled) return;
    
    setRankedItems([]);
    setSelectedItems(new Set());
    onChange?.([]);
    onReset?.();
    triggerHaptic();
  }, [disabled, onChange, onReset, triggerHaptic]);
  
  // Get item rank
  const getItemRank = (itemId: string): number => {
    return rankedItems.indexOf(itemId) + 1;
  };
  
  // Check if item is selected/ranked
  const isItemRanked = (itemId: string): boolean => {
    return rankedItems.includes(itemId);
  };
  
  // Get variant styles
  const getItemStyles = (item: RankableItem, isRanked: boolean, rank: number) => {
    const baseClasses = [
      'relative flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200',
      'active:scale-[0.98] cursor-pointer',
    ];
    
    if (disabled || item.disabled) {
      baseClasses.push('opacity-50 cursor-not-allowed');
    }
    
    if (variant === 'compact') {
      baseClasses.push('p-3');
    }
    
    if (isRanked) {
      baseClasses.push(
        'border-primary bg-primary/5 shadow-sm',
        'ring-2 ring-primary/20'
      );
    } else {
      baseClasses.push(
        'border-light-gray dark:border-gray-700 bg-white dark:bg-gray-800',
        'hover:border-primary/50 hover:bg-primary/5'
      );
    }
    
    return cn(baseClasses);
  };
  
  // Separate ranked and unranked items
  const unrankedItems = items.filter(item => !isItemRanked(item.id));
  const rankedItemsData = rankedItems
    .map(id => items.find(item => item.id === id))
    .filter(Boolean) as RankableItem[];
  
  // Progress calculation
  const progress = maxRanked ? (rankedItems.length / maxRanked) * 100 : 0;
  const canAddMore = !maxRanked || rankedItems.length < maxRanked;
  const hasEnoughItems = rankedItems.length >= minRanked;
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Progress */}
      {showProgress && maxRanked && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-warm-gray">
              {mode === 'tap-to-select' ? 'Selected' : 'Ranked'}: {rankedItems.length} / {maxRanked}
            </span>
            <span className="text-warm-gray">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-light-gray dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div className="text-center space-y-1">
        <p className="text-sm text-warm-gray">
          {mode === 'tap-to-select' 
            ? 'Tap to select items' 
            : 'Tap to add items to your ranking'}
        </p>
        {maxRanked && (
          <p className="text-xs text-warm-gray">
            {mode === 'tap-to-select' 
              ? `Select up to ${maxRanked} items`
              : `Rank up to ${maxRanked} items`}
          </p>
        )}
      </div>
      
      {/* Ranked Items */}
      {rankedItemsData.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-off-black dark:text-off-white">
              {mode === 'tap-to-select' ? 'Selected Items' : 'Your Ranking'}
            </h3>
            {showReset && (
              <button
                onClick={handleReset}
                disabled={disabled}
                className="flex items-center gap-1 px-3 py-1 text-sm text-warm-gray hover:text-primary transition-colors"
              >
                <Icon size={14}>
                  <RotateCcw />
                </Icon>
                Reset
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            {rankedItemsData.map((item, index) => {
              const rank = index + 1;
              
              return (
                <div
                  key={item.id}
                  className={getItemStyles(item, true, rank)}
                  onClick={() => handleItemTap(item.id)}
                >
                  {/* Rank Number */}
                  {showNumbers && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                      {rank}
                    </div>
                  )}
                  
                  {/* Icon */}
                  {item.icon && (
                    <div className="flex-shrink-0 w-6 h-6 text-primary">
                      <Icon size={20}>
                        {item.icon}
                      </Icon>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-off-black dark:text-off-white">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-1 text-xs bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    
                    {showDescriptions && item.description && (
                      <p className="text-sm text-warm-gray mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  {showActionButtons && mode === 'tap-to-order' && (
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveItem(item.id, 'up');
                        }}
                        disabled={disabled || index === 0}
                        className="p-1 text-warm-gray hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Icon size={16}>
                          <ChevronUp />
                        </Icon>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveItem(item.id, 'down');
                        }}
                        disabled={disabled || index === rankedItemsData.length - 1}
                        className="p-1 text-warm-gray hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Icon size={16}>
                          <ChevronDown />
                        </Icon>
                      </button>
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemTap(item.id);
                    }}
                    disabled={disabled}
                    className="flex-shrink-0 p-1 text-warm-gray hover:text-primary transition-colors"
                  >
                    <Icon size={16}>
                      <X />
                    </Icon>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Available Items */}
      {unrankedItems.length > 0 && canAddMore && (
        <div className="space-y-3">
          <h3 className="font-semibold text-off-black dark:text-off-white">
            Available Items
          </h3>
          
          <div className="space-y-2">
            {unrankedItems.map((item) => (
              <div
                key={item.id}
                className={getItemStyles(item, false, 0)}
                onClick={() => handleItemTap(item.id)}
              >
                {/* Icon */}
                {item.icon && (
                  <div className="flex-shrink-0 w-6 h-6 text-warm-gray">
                    <Icon size={20}>
                      {item.icon}
                    </Icon>
                  </div>
                )}
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-off-black dark:text-off-white">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  
                  {showDescriptions && item.description && (
                    <p className="text-sm text-warm-gray mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
                
                {/* Add Button */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-warm-gray flex items-center justify-center transition-colors group-hover:border-primary">
                  <Icon size={16} className="text-warm-gray group-hover:text-primary">
                    <Check />
                  </Icon>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Validation Message */}
      {!hasEnoughItems && minRanked > 0 && (
        <div className="text-center p-3 bg-light-gray dark:bg-gray-800 border border-light-gray dark:border-gray-700 rounded-lg">
          <p className="text-sm text-warm-gray dark:text-warm-gray">
            Please {mode === 'tap-to-select' ? 'select' : 'rank'} at least {minRanked} item{minRanked !== 1 ? 's' : ''}.
          </p>
        </div>
      )}
    </div>
  );
}

export default TapToRank;