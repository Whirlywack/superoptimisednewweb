import React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, SkipForward, ArrowRight, Clock } from "lucide-react";

interface SkipControlProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "subtle" | "link" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  showIcon?: boolean;
  position?: "left" | "right" | "center";
  reason?: string;
  confirmSkip?: boolean;
  onConfirmSkip?: () => void;
}

const skipVariants = {
  default: {
    button: "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border",
    focus: "focus:ring-muted-foreground",
  },
  subtle: {
    button: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50",
    focus: "focus:ring-primary",
  },
  link: {
    button: "bg-transparent text-primary hover:text-primary/80 underline underline-offset-4",
    focus: "focus:ring-primary",
  },
  outline: {
    button: "bg-transparent border border-border text-muted-foreground hover:border-primary hover:text-foreground",
    focus: "focus:ring-primary",
  },
};

const skipSizes = {
  sm: "px-3 py-1.5 text-sm min-h-[36px]",
  md: "px-4 py-2 text-sm min-h-[40px]",
  lg: "px-5 py-3 text-base min-h-[44px]",
};

export function SkipControl({
  variant = "subtle",
  size = "md",
  icon,
  showIcon = true,
  position = "right",
  reason,
  confirmSkip = false,
  onConfirmSkip,
  className,
  children = "Skip",
  onClick,
  ...props
}: SkipControlProps) {
  const [showConfirm, setShowConfirm] = React.useState(false);
  const variantConfig = skipVariants[variant];
  const defaultIcon = icon || <ChevronRight className="size-4" />;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (confirmSkip && !showConfirm) {
      e.preventDefault();
      setShowConfirm(true);
      return;
    }
    
    if (showConfirm && onConfirmSkip) {
      onConfirmSkip();
      setShowConfirm(false);
    }
    
    onClick?.(e);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Skip this question?</span>
        <button
          type="button"
          onClick={handleClick}
          className="font-medium text-primary hover:text-primary/80"
        >
          Yes
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="text-muted-foreground hover:text-foreground"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "touch-manipulation",
        skipSizes[size],
        variantConfig.button,
        variantConfig.focus,
        position === "center" && "justify-center",
        className
      )}
      title={reason}
      {...props}
    >
      {showIcon && position === "left" && defaultIcon}
      <span>{children}</span>
      {showIcon && position === "right" && defaultIcon}
    </button>
  );
}

interface SkipOptionsProps extends React.HTMLAttributes<HTMLDivElement> {
  onSkip: (reason?: string) => void;
  reasons?: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
  showCustomReason?: boolean;
  customReasonPlaceholder?: string;
}

export function SkipOptions({
  onSkip,
  reasons = [
    { id: "prefer-not-to-answer", label: "Prefer not to answer" },
    { id: "not-applicable", label: "Not applicable to me" },
    { id: "dont-know", label: "Don't know" },
    { id: "too-complex", label: "Question is too complex" },
  ],
  showCustomReason = false,
  customReasonPlaceholder = "Tell us why you're skipping...",
  className,
  ...props
}: SkipOptionsProps) {
  const [selectedReason, setSelectedReason] = React.useState<string>("");
  const [customReason, setCustomReason] = React.useState("");
  const [showReasons, setShowReasons] = React.useState(false);

  const handleSkip = () => {
    const reason = selectedReason === "custom" ? customReason : selectedReason;
    onSkip(reason || undefined);
  };

  const handleQuickSkip = () => {
    onSkip();
  };

  if (!showReasons) {
    return (
      <div className={cn("flex items-center gap-3", className)} {...props}>
        <SkipControl onClick={handleQuickSkip} variant="subtle">
          Skip
        </SkipControl>
        
        <button
          type="button"
          onClick={() => setShowReasons(true)}
          className="text-xs text-muted-foreground underline hover:text-foreground"
        >
          Why skip?
        </button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4 rounded-lg border border-border bg-muted/30 p-4", className)} {...props}>
      <h4 className="text-sm font-medium">Why are you skipping this question?</h4>
      
      <div className="space-y-2">
        {reasons.map((reason) => (
          <label key={reason.id} className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="skip-reason"
              value={reason.id}
              checked={selectedReason === reason.id}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="mt-1 size-4 border-border text-primary focus:ring-primary"
            />
            <div className="flex-1">
              <div className="text-sm font-medium">{reason.label}</div>
              {reason.description && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {reason.description}
                </div>
              )}
            </div>
          </label>
        ))}
        
        {showCustomReason && (
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="skip-reason"
              value="custom"
              checked={selectedReason === "custom"}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="mt-1 size-4 border-border text-primary focus:ring-primary"
            />
            <div className="flex-1 space-y-2">
              <div className="text-sm font-medium">Other reason</div>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder={customReasonPlaceholder}
                className="w-full rounded border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                rows={2}
                disabled={selectedReason !== "custom"}
              />
            </div>
          </label>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setShowReasons(false)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
        
        <div className="flex gap-2">
          <SkipControl
            onClick={handleQuickSkip}
            variant="outline"
            size="sm"
          >
            Skip anyway
          </SkipControl>
          
          <SkipControl
            onClick={handleSkip}
            disabled={!selectedReason || (selectedReason === "custom" && !customReason.trim())}
            size="sm"
          >
            Skip with reason
          </SkipControl>
        </div>
      </div>
    </div>
  );
}

interface OptionalIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "text" | "badge" | "subtle";
  showSkipHint?: boolean;
}

export function OptionalIndicator({
  variant = "text",
  showSkipHint = false,
  className,
  ...props
}: OptionalIndicatorProps) {
  const variants = {
    text: "text-muted-foreground text-sm",
    badge: "bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs font-medium",
    subtle: "text-muted-foreground text-xs font-mono",
  };

  return (
    <span className={cn(variants[variant], className)} {...props}>
      Optional
      {showSkipHint && variant === "text" && (
        <span className="ml-1 text-xs">• You can skip this</span>
      )}
    </span>
  );
}

interface TimeoutSkipProps extends React.HTMLAttributes<HTMLDivElement> {
  timeoutSeconds: number;
  onTimeout: () => void;
  onCancel?: () => void;
  message?: string;
  showProgress?: boolean;
}

export function TimeoutSkip({
  timeoutSeconds,
  onTimeout,
  onCancel,
  message = "This question will be automatically skipped in",
  showProgress = true,
  className,
  ...props
}: TimeoutSkipProps) {
  const [secondsLeft, setSecondsLeft] = React.useState(timeoutSeconds);
  
  React.useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeout();
      return;
    }
    
    const timer = setTimeout(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [secondsLeft, onTimeout]);

  const progressPercentage = ((timeoutSeconds - secondsLeft) / timeoutSeconds) * 100;

  return (
    <div className={cn("space-y-3 rounded-lg border border-warm-gray bg-light-gray p-4", className)} {...props}>
      <div className="flex items-center gap-2 text-off-black">
        <Clock className="size-4" />
        <span className="text-sm">
          {message} <span className="font-mono font-bold">{secondsLeft}</span> second{secondsLeft !== 1 ? 's' : ''}
        </span>
      </div>
      
      {showProgress && (
        <div className="h-1 w-full rounded-full bg-warm-gray/30">
          <div 
            className="h-1 rounded-full bg-warm-gray transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}
      
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-warm-gray underline hover:text-off-black"
        >
          Stay on this question
        </button>
      )}
    </div>
  );
}