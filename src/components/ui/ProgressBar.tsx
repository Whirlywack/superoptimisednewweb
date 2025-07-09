import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "danger";
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  striped?: boolean;
}

const progressSizes = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const progressVariants = {
  default: "bg-primary",
  success: "bg-primary",
  warning: "bg-warm-gray",
  danger: "bg-warm-gray",
};

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showLabel = false,
  label,
  animated = false,
  striped = false,
  className,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const displayLabel = label || `${Math.round(percentage)}%`;

  return (
    <div className={cn("w-full", className)} {...props}>
      {showLabel && (
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm font-medium text-off-black">
            {displayLabel}
          </span>
          <span className="text-sm text-warm-gray">
            {value}/{max}
          </span>
        </div>
      )}
      
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-light-gray",
          progressSizes[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `${percentage}% complete`}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            progressVariants[variant],
            animated && "animate-pulse",
            striped && "animate-[progress-stripes_1s_linear_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:1rem_1rem]"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: "default" | "success" | "warning" | "danger";
  showLabel?: boolean;
  label?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = "default",
  showLabel = false,
  label,
  className,
  ...props
}: CircularProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const displayLabel = label || `${Math.round(percentage)}%`;

  const variantColors = {
    default: "stroke-primary",
    success: "stroke-primary",
    warning: "stroke-warm-gray",
    danger: "stroke-warm-gray",
  };

  return (
    <div 
      className={cn("relative inline-flex items-center justify-center", className)}
      {...props}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `${percentage}% complete`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted opacity-20"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn("transition-all duration-300 ease-out", variantColors[variant])}
        />
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-foreground">
            {displayLabel}
          </span>
        </div>
      )}
    </div>
  );
}

interface StepProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep: number;
  totalSteps: number;
  completedSteps?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "danger";
  showLabels?: boolean;
  steps?: Array<{ label: string; description?: string }>;
}

const stepSizes = {
  sm: {
    circle: "w-6 h-6",
    text: "text-xs",
    connector: "h-0.5",
  },
  md: {
    circle: "w-8 h-8", 
    text: "text-sm",
    connector: "h-1",
  },
  lg: {
    circle: "w-10 h-10",
    text: "text-base",
    connector: "h-1.5",
  },
};

export function StepProgress({
  currentStep,
  totalSteps,
  completedSteps = currentStep - 1,
  size = "md",
  variant = "default",
  showLabels = false,
  steps,
  className,
  ...props
}: StepProgressProps) {
  const sizeConfig = stepSizes[size];
  
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < completedSteps) return "completed";
    if (stepIndex === currentStep - 1) return "current";
    return "upcoming";
  };

  const getStepStyles = (status: string) => {
    switch (status) {
      case "completed":
        return cn(
          "border-primary bg-primary text-primary-foreground",
          variant === "success" && "border-primary bg-primary",
          variant === "warning" && "border-warm-gray bg-warm-gray",
          variant === "danger" && "border-warm-gray bg-warm-gray"
        );
      case "current":
        return "bg-background text-primary border-primary border-2";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const status = getStepStatus(index);
          const stepData = steps?.[index];
          
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full border transition-all duration-200",
                    sizeConfig.circle,
                    getStepStyles(status)
                  )}
                >
                  <span className={cn("font-medium", sizeConfig.text)}>
                    {stepNumber}
                  </span>
                </div>
                
                {showLabels && stepData && (
                  <div className="mt-2 text-center">
                    <div className={cn("font-medium", sizeConfig.text)}>
                      {stepData.label}
                    </div>
                    {stepData.description && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {stepData.description}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {index < totalSteps - 1 && (
                <div
                  className={cn(
                    "mx-2 flex-1 rounded-full transition-all duration-200",
                    sizeConfig.connector,
                    index < completedSteps ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}