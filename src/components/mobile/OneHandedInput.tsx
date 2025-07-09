import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '../ui/Icon';
import { 
  Send, 
  Mic, 
  MicOff, 
  X, 
  Check, 
  CornerDownLeft,
  Smile,
  Hash,
  AtSign,
  Type,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export type OneHandedInputType = 'text' | 'textarea' | 'email' | 'password' | 'number' | 'tel' | 'url';
export type OneHandedInputSize = 'compact' | 'comfortable' | 'spacious';
export type OneHandedInputPosition = 'bottom' | 'middle' | 'top' | 'auto';

export interface OneHandedInputAction {
  /** Unique identifier */
  id: string;
  /** Icon to display */
  icon: React.ReactNode;
  /** Tooltip/label text */
  label: string;
  /** Action callback */
  onClick: () => void;
  /** Whether action is active/selected */
  active?: boolean;
  /** Whether action is disabled */
  disabled?: boolean;
  /** Action color variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export interface OneHandedInputProps {
  /** Input type */
  type?: OneHandedInputType;
  /** Current input value */
  value?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Maximum character length */
  maxLength?: number;
  /** Minimum character length */
  minLength?: number;
  /** Size variant affecting touch targets and spacing */
  size?: OneHandedInputSize;
  /** Position on screen for optimal thumb reach */
  position?: OneHandedInputPosition;
  /** Show character counter */
  showCounter?: boolean;
  /** Show word counter (for textarea) */
  showWordCounter?: boolean;
  /** Auto-resize textarea */
  autoResize?: boolean;
  /** Maximum textarea rows */
  maxRows?: number;
  /** Minimum textarea rows */
  minRows?: number;
  /** Show action buttons */
  showActions?: boolean;
  /** Array of action buttons */
  actions?: OneHandedInputAction[];
  /** Show voice input button */
  enableVoiceInput?: boolean;
  /** Show emoji button */
  enableEmoji?: boolean;
  /** Show clear button */
  showClearButton?: boolean;
  /** Show submit button */
  showSubmitButton?: boolean;
  /** Submit button text */
  submitText?: string;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Disable the input */
  disabled?: boolean;
  /** Show validation state */
  validationState?: 'none' | 'success' | 'warning' | 'error';
  /** Validation message */
  validationMessage?: string;
  /** Enable haptic feedback */
  enableHaptics?: boolean;
  /** Callback when value changes */
  onChange?: (value: string) => void;
  /** Callback when input is submitted */
  onSubmit?: (value: string) => void;
  /** Callback when input is cleared */
  onClear?: () => void;
  /** Callback when voice input starts */
  onVoiceStart?: () => void;
  /** Callback when voice input ends */
  onVoiceEnd?: (transcript: string) => void;
  /** Callback when emoji picker opens */
  onEmojiClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function OneHandedInput({
  type = 'text',
  value = '',
  placeholder = 'Type your message...',
  maxLength,
  minLength,
  size = 'comfortable',
  position = 'auto',
  showCounter = false,
  showWordCounter = false,
  autoResize = true,
  maxRows = 6,
  minRows = 1,
  showActions = true,
  actions = [],
  enableVoiceInput = false,
  enableEmoji = false,
  showClearButton = true,
  showSubmitButton = true,
  submitText = 'Send',
  autoFocus = false,
  disabled = false,
  validationState = 'none',
  validationMessage,
  enableHaptics = true,
  onChange,
  onSubmit,
  onClear,
  onVoiceStart,
  onVoiceEnd,
  onEmojiClick,
  className,
}: OneHandedInputProps) {
  const [currentValue, setCurrentValue] = useState(value);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState('auto');
  
  // Sync with external value changes
  useEffect(() => {
    setCurrentValue(value);
  }, [value]);
  
  // Auto-focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  // Auto-resize textarea
  useEffect(() => {
    if (type === 'textarea' && autoResize && inputRef.current) {
      const textarea = inputRef.current as HTMLTextAreaElement;
      
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate new height
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
      const minHeight = lineHeight * minRows;
      const maxHeight = lineHeight * maxRows;
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      
      setTextareaHeight(`${newHeight}px`);
    }
  }, [currentValue, type, autoResize, minRows, maxRows]);
  
  // Haptic feedback
  const triggerHaptic = () => {
    if (!enableHaptics || disabled) return;
    
    try {
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }
    } catch (error) {
      // Ignore haptic errors
    }
  };
  
  // Handle value change
  const handleChange = (newValue: string) => {
    if (disabled) return;
    
    // Apply length constraints
    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
    }
    
    setCurrentValue(newValue);
    onChange?.(newValue);
  };
  
  // Handle input events
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e.target.value);
  };
  
  // Handle submit
  const handleSubmit = () => {
    if (disabled || !currentValue.trim()) return;
    
    triggerHaptic();
    onSubmit?.(currentValue.trim());
  };
  
  // Handle clear
  const handleClear = () => {
    if (disabled) return;
    
    setCurrentValue('');
    onChange?.('');
    onClear?.();
    triggerHaptic();
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Handle voice input
  const handleVoiceToggle = () => {
    if (disabled) return;
    
    if (isVoiceActive) {
      setIsVoiceActive(false);
      onVoiceEnd?.(currentValue);
    } else {
      setIsVoiceActive(true);
      onVoiceStart?.();
    }
    
    triggerHaptic();
  };
  
  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (type === 'textarea' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      } else if (type !== 'textarea') {
        e.preventDefault();
        handleSubmit();
      }
    }
  };
  
  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'compact':
        return {
          container: 'p-3',
          input: 'px-4 py-3 text-base',
          button: 'w-10 h-10',
          iconSize: 18,
        };
      case 'spacious':
        return {
          container: 'p-5',
          input: 'px-5 py-4 text-lg',
          button: 'w-14 h-14',
          iconSize: 22,
        };
      default: // comfortable
        return {
          container: 'p-4',
          input: 'px-4 py-3 text-base',
          button: 'w-12 h-12',
          iconSize: 20,
        };
    }
  };
  
  // Get position styles
  const getPositionStyles = () => {
    switch (position) {
      case 'bottom':
        return 'fixed bottom-0 left-0 right-0 z-50';
      case 'top':
        return 'fixed top-0 left-0 right-0 z-50';
      case 'middle':
        return 'sticky top-1/2 z-40';
      default: // auto
        return 'relative';
    }
  };
  
  // Get validation styles
  const getValidationStyles = () => {
    switch (validationState) {
      case 'success':
        return 'border-primary focus:ring-primary';
      case 'warning':
        return 'border-warm-gray focus:ring-warm-gray';
      case 'error':
        return 'border-warm-gray focus:ring-warm-gray';
      default:
        return 'border-light-gray dark:border-gray-700 focus:ring-primary focus:border-primary';
    }
  };
  
  const sizeStyles = getSizeStyles();
  const isTextarea = type === 'textarea';
  const canSubmit = currentValue.trim().length > 0 && (!minLength || currentValue.length >= minLength);
  const wordCount = currentValue.trim().split(/\s+/).filter(word => word.length > 0).length;
  
  // Default actions
  const defaultActions: OneHandedInputAction[] = [
    ...(enableEmoji ? [{
      id: 'emoji',
      icon: <Smile />,
      label: 'Add emoji',
      onClick: () => onEmojiClick?.(),
    }] : []),
    ...(enableVoiceInput ? [{
      id: 'voice',
      icon: isVoiceActive ? <MicOff /> : <Mic />,
      label: isVoiceActive ? 'Stop recording' : 'Voice input',
      onClick: handleVoiceToggle,
      active: isVoiceActive,
      variant: isVoiceActive ? 'danger' as const : 'default' as const,
    }] : []),
    ...(type === 'password' ? [{
      id: 'toggle-password',
      icon: showPassword ? <EyeOff /> : <Eye />,
      label: showPassword ? 'Hide password' : 'Show password',
      onClick: () => setShowPassword(!showPassword),
    }] : []),
  ];
  
  const allActions = [...defaultActions, ...actions];
  
  return (
    <div className={cn(getPositionStyles(), className)}>
      <div 
        className={cn(
          "border-t border-light-gray bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900",
          sizeStyles.container
        )}
      >
        {/* Validation Message */}
        {validationMessage && (
          <div className={cn(
            "mb-3 rounded-lg px-4 py-2 text-sm",
            {
              'bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary': validationState === 'success',
              'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400': validationState === 'warning',
              'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400': validationState === 'error',
            }
          )}>
            {validationMessage}
          </div>
        )}
        
        {/* Input Container */}
        <div className="relative">
          <div className={cn(
            "flex items-end gap-3 rounded-xl border-2 bg-light-gray transition-colors dark:bg-gray-800",
            getValidationStyles(),
            {
              'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900': isFocused,
            }
          )}>
            {/* Actions (Left Side) */}
            {showActions && allActions.length > 0 && (
              <div className="flex items-center gap-1 pl-2">
                {allActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.onClick}
                    disabled={disabled || action.disabled}
                    className={cn(
                      "flex items-center justify-center rounded-lg transition-colors",
                      sizeStyles.button,
                      {
                        'bg-primary text-white': action.active && (!action.variant || action.variant === 'default'),
                        'text-warm-gray hover:text-primary hover:bg-primary/10': !action.active && !action.disabled,
                        'opacity-50 cursor-not-allowed': action.disabled || disabled,
                        'bg-red-500 text-white': action.variant === 'danger' && action.active,
                        'bg-green-500 text-white': action.variant === 'success' && action.active,
                      }
                    )}
                    title={action.label}
                  >
                    <Icon size={sizeStyles.iconSize >= 22 ? "lg" : "md"}>
                      {action.icon}
                    </Icon>
                  </button>
                ))}
              </div>
            )}
            
            {/* Input Field */}
            <div className="min-w-0 flex-1">
              {isTextarea ? (
                <textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  value={currentValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  rows={minRows}
                  disabled={disabled}
                  className={cn(
                    "w-full resize-none border-none bg-transparent text-off-black outline-none placeholder:text-warm-gray dark:text-off-white",
                    sizeStyles.input
                  )}
                  style={{ height: autoResize ? textareaHeight : 'auto' }}
                />
              ) : (
                <input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                  value={currentValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  disabled={disabled}
                  className={cn(
                    "w-full border-none bg-transparent text-off-black outline-none placeholder:text-warm-gray dark:text-off-white",
                    sizeStyles.input
                  )}
                />
              )}
            </div>
            
            {/* Right Actions */}
            <div className="flex items-center gap-2 pr-2">
              {/* Clear Button */}
              {showClearButton && currentValue && (
                <button
                  onClick={handleClear}
                  disabled={disabled}
                  className={cn(
                    "flex items-center justify-center rounded-full text-warm-gray transition-colors hover:text-primary",
                    "size-8"
                  )}
                  title="Clear input"
                >
                  <Icon size="sm">
                    <X />
                  </Icon>
                </button>
              )}
              
              {/* Submit Button */}
              {showSubmitButton && (
                <button
                  onClick={handleSubmit}
                  disabled={disabled || !canSubmit}
                  className={cn(
                    "flex items-center justify-center rounded-lg font-medium transition-all",
                    sizeStyles.button,
                    {
                      'bg-primary text-white hover:bg-primary/90 active:scale-95': canSubmit && !disabled,
                      'bg-light-gray text-warm-gray cursor-not-allowed': !canSubmit || disabled,
                    }
                  )}
                  title={`${submitText} (Enter)`}
                >
                  <Icon size={sizeStyles.iconSize >= 22 ? "lg" : "md"}>
                    <Send />
                  </Icon>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Footer Info */}
        {(showCounter || showWordCounter) && (
          <div className="mt-2 flex items-center justify-between px-2 text-xs text-warm-gray">
            <div className="flex gap-4">
              {showWordCounter && isTextarea && (
                <span>
                  {wordCount} word{wordCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            {showCounter && (
              <span className={cn({
                'text-red-500': maxLength && currentValue.length > maxLength * 0.9,
                'text-yellow-500': maxLength && currentValue.length > maxLength * 0.75 && currentValue.length <= maxLength * 0.9,
              })}>
                {currentValue.length}{maxLength && ` / ${maxLength}`}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OneHandedInput;