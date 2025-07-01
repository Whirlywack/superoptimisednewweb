import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../ui/Icon';
import { Star, Heart, ThumbsUp, Smile, Frown, Meh, ChevronLeft, ChevronRight } from 'lucide-react';

export type SwipeRatingIcon = 'star' | 'heart' | 'thumbs' | 'emoji' | 'custom';

export interface SwipeRatingProps {
  /** Current rating value (1-based) */
  value?: number;
  /** Maximum rating value */
  max?: number;
  /** Minimum rating value */
  min?: number;
  /** Icon type to display */
  iconType?: SwipeRatingIcon;
  /** Custom icons array (when iconType is 'custom') */
  customIcons?: React.ReactNode[];
  /** Size of the rating interface */
  size?: 'small' | 'medium' | 'large';
  /** Enable swipe gestures */
  enableSwipe?: boolean;
  /** Enable tap to rate */
  enableTap?: boolean;
  /** Show numeric value */
  showValue?: boolean;
  /** Show min/max labels */
  showLabels?: boolean;
  /** Custom labels for min/max */
  labels?: { min?: string; max?: string };
  /** Show swipe instructions */
  showInstructions?: boolean;
  /** Enable haptic feedback (mobile) */
  enableHaptics?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
  /** Callback when rating changes */
  onChange?: (value: number) => void;
  /** Callback when swipe starts */
  onSwipeStart?: () => void;
  /** Callback when swipe ends */
  onSwipeEnd?: (value: number) => void;
  /** Additional CSS classes */
  className?: string;
  /** Disable the component */
  disabled?: boolean;
}

export function SwipeRating({
  value = 0,
  max = 5,
  min = 1,
  iconType = 'star',
  customIcons = [],
  size = 'medium',
  enableSwipe = true,
  enableTap = true,
  showValue = true,
  showLabels = false,
  labels = { min: 'Poor', max: 'Excellent' },
  showInstructions = false,
  enableHaptics = true,
  animationDuration = 200,
  onChange,
  onSwipeStart,
  onSwipeEnd,
  className,
  disabled = false,
}: SwipeRatingProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const [isActive, setIsActive] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  
  // Update current value when prop changes
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);
  
  // Measure container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  
  // Haptic feedback function
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
  
  // Calculate rating from position
  const getRatingFromPosition = (clientX: number) => {
    if (!containerRef.current) return currentValue;
    
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, relativeX / rect.width));
    const range = max - min;
    const rating = Math.round(min + percentage * range);
    
    return Math.max(min, Math.min(max, rating));
  };
  
  // Handle value change
  const handleValueChange = useCallback((newValue: number) => {
    if (newValue !== currentValue) {
      setCurrentValue(newValue);
      triggerHaptic();
      onChange?.(newValue);
    }
  }, [currentValue, onChange, triggerHaptic]);
  
  // Mouse/Touch event handlers
  const handleStart = (clientX: number) => {
    if (disabled) return;
    
    setIsActive(true);
    setStartX(clientX);
    setCurrentX(clientX);
    setIsDragging(false);
    onSwipeStart?.();
  };
  
  const handleMove = (clientX: number) => {
    if (!isActive || disabled) return;
    
    setCurrentX(clientX);
    const distance = Math.abs(clientX - startX);
    
    if (distance > 5 && !isDragging) {
      setIsDragging(true);
    }
    
    if (isDragging && enableSwipe) {
      const newRating = getRatingFromPosition(clientX);
      handleValueChange(newRating);
    }
  };
  
  const handleEnd = () => {
    if (!isActive || disabled) return;
    
    setIsActive(false);
    
    if (isDragging) {
      onSwipeEnd?.(currentValue);
    }
    
    setIsDragging(false);
  };
  
  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };
  
  const handleMouseUp = () => {
    handleEnd();
  };
  
  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleStart(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleEnd();
  };
  
  // Click handler for tap rating
  const handleClick = (e: React.MouseEvent) => {
    if (!enableTap || disabled || isDragging) return;
    
    const newRating = getRatingFromPosition(e.clientX);
    handleValueChange(newRating);
    onSwipeEnd?.(newRating);
  };
  
  // Get icon component
  const getIcon = (index: number, filled: boolean) => {
    const iconSize = size === 'small' ? 20 : size === 'large' ? 32 : 24;
    
    if (iconType === 'custom' && customIcons[index]) {
      return React.cloneElement(customIcons[index] as React.ReactElement, {
        size: iconSize,
        className: cn('transition-colors duration-200', {
          'text-yellow-400': filled && iconType === 'star',
          'text-red-500': filled && iconType === 'heart',
          'text-blue-500': filled && iconType === 'thumbs',
          'text-warm-gray': !filled,
        }),
      });
    }
    
    const iconProps = {
      size: iconSize,
      className: cn('transition-colors duration-200', {
        'text-yellow-400': filled && iconType === 'star',
        'text-red-500': filled && iconType === 'heart', 
        'text-blue-500': filled && iconType === 'thumbs',
        'text-warm-gray': !filled,
      }),
    };
    
    switch (iconType) {
      case 'heart':
        return <Icon {...iconProps}><Heart fill={filled ? 'currentColor' : 'none'} /></Icon>;
      case 'thumbs':
        return <Icon {...iconProps}><ThumbsUp fill={filled ? 'currentColor' : 'none'} /></Icon>;
      case 'emoji':
        if (index + min <= 2) return <Icon {...iconProps}><Frown /></Icon>;
        if (index + min >= max - 1) return <Icon {...iconProps}><Smile /></Icon>;
        return <Icon {...iconProps}><Meh /></Icon>;
      default: // star
        return <Icon {...iconProps}><Star fill={filled ? 'currentColor' : 'none'} /></Icon>;
    }
  };
  
  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: 'h-12 px-4',
          icon: 'w-8 h-8',
          value: 'text-lg',
          spacing: 'gap-2',
        };
      case 'large':
        return {
          container: 'h-20 px-6',
          icon: 'w-12 h-12',
          value: 'text-2xl',
          spacing: 'gap-4',
        };
      default: // medium
        return {
          container: 'h-16 px-5',
          icon: 'w-10 h-10',
          value: 'text-xl',
          spacing: 'gap-3',
        };
    }
  };
  
  const sizeStyles = getSizeStyles();
  const range = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  
  // Global mouse events for dragging
  useEffect(() => {
    if (!isActive) return;
    
    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };
    
    const handleGlobalMouseUp = () => {
      handleEnd();
    };
    
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isActive, isDragging]);
  
  return (
    <div className={cn("select-none", className)}>
      {/* Instructions */}
      {showInstructions && (
        <div className="text-center mb-4">
          <p className="text-sm text-warm-gray">
            {enableSwipe && enableTap ? 'Swipe or tap to rate' : 
             enableSwipe ? 'Swipe to rate' : 
             'Tap to rate'}
          </p>
        </div>
      )}
      
      {/* Rating Container */}
      <div
        ref={containerRef}
        className={cn(
          "relative flex items-center justify-between rounded-xl border-2 transition-all duration-200",
          sizeStyles.container,
          {
            'bg-white dark:bg-gray-800 border-light-gray dark:border-gray-700': !isActive,
            'bg-primary/5 border-primary': isActive,
            'cursor-pointer': enableTap && !disabled,
            'cursor-grab': enableSwipe && !disabled && !isActive,
            'cursor-grabbing': enableSwipe && !disabled && isActive,
            'opacity-50': disabled,
          }
        )}
        onMouseDown={enableSwipe ? handleMouseDown : undefined}
        onMouseMove={enableSwipe ? handleMouseMove : undefined}
        onMouseUp={enableSwipe ? handleMouseUp : undefined}
        onTouchStart={enableSwipe ? handleTouchStart : undefined}
        onTouchMove={enableSwipe ? handleTouchMove : undefined}
        onTouchEnd={enableSwipe ? handleTouchEnd : undefined}
        onClick={enableTap ? handleClick : undefined}
      >
        {/* Icons */}
        <div className={cn("flex items-center justify-between flex-1", sizeStyles.spacing)}>
          {range.map((rating, index) => (
            <div
              key={rating}
              className={cn(
                "flex items-center justify-center transition-transform duration-200",
                sizeStyles.icon,
                {
                  'scale-110': currentValue === rating,
                  'scale-100': currentValue !== rating,
                }
              )}
            >
              {getIcon(index, rating <= currentValue)}
            </div>
          ))}
        </div>
        
        {/* Swipe Indicator */}
        {enableSwipe && (
          <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
            <Icon size={16} className="text-warm-gray/50">
              <ChevronLeft />
            </Icon>
            <Icon size={16} className="text-warm-gray/50">
              <ChevronRight />
            </Icon>
          </div>
        )}
      </div>
      
      {/* Value Display */}
      {showValue && (
        <div className="text-center mt-4">
          <span className={cn("font-semibold text-off-black dark:text-off-white", sizeStyles.value)}>
            {currentValue > 0 ? currentValue : '—'}
          </span>
          <span className="text-warm-gray text-sm ml-2">
            {currentValue > 0 ? `/ ${max}` : `Rate from ${min} to ${max}`}
          </span>
        </div>
      )}
      
      {/* Labels */}
      {showLabels && (
        <div className="flex justify-between mt-2 text-sm text-warm-gray">
          <span>{labels.min}</span>
          <span>{labels.max}</span>
        </div>
      )}
    </div>
  );
}

export default SwipeRating;