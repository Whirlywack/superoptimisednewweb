import React from "react";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";

interface QuestionLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  question?: string;
  children?: React.ReactNode;
  subtitle?: string;
  required?: boolean;
  helpText?: string;
  questionNumber?: number;
  totalQuestions?: number;
  variant?: "default" | "large" | "compact";
  alignment?: "left" | "center";
}

const questionVariants = {
  default: {
    question: "text-lg md:text-xl font-semibold leading-tight",
    subtitle: "text-sm text-warm-gray mt-1",
    container: "space-y-2",
  },
  large: {
    question: "text-xl md:text-2xl font-bold leading-tight",
    subtitle: "text-base text-warm-gray mt-2",
    container: "space-y-3",
  },
  compact: {
    question: "text-base md:text-lg font-medium leading-snug",
    subtitle: "text-xs text-warm-gray mt-1",
    container: "space-y-1",
  },
};

export function QuestionLabel({
  question,
  children,
  subtitle,
  required = false,
  helpText,
  questionNumber,
  totalQuestions,
  variant = "default",
  alignment = "left",
  className,
  ...props
}: QuestionLabelProps) {
  const [showHelp, setShowHelp] = React.useState(false);
  const variantStyles = questionVariants[variant] || questionVariants.default;
  const questionText = question || children;

  return (
    <div
      className={cn(
        variantStyles.container,
        alignment === "center" && "text-center",
        className
      )}
      {...props}
    >
      {/* Question Number Indicator */}
      {questionNumber && totalQuestions && (
        <div className={cn(
          "text-xs font-mono text-warm-gray",
          alignment === "center" ? "text-center" : "text-left"
        )}>
          Question {questionNumber} of {totalQuestions}
        </div>
      )}

      {/* Main Question */}
      <div className="relative">
        <h2 
          className={cn(
            variantStyles.question,
            "text-off-black dark:text-off-white max-w-none",
            alignment === "center" && "text-center"
          )}
        >
          {questionText}
          {required && (
            <span className="text-warm-gray ml-1" aria-label="Required">
              *
            </span>
          )}
          
          {helpText && (
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className={cn(
                "inline-flex items-center justify-center ml-2",
                "w-5 h-5 text-warm-gray hover:text-off-black dark:hover:text-off-white",
                "transition-colors rounded-full",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              )}
              aria-label="Show help text"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          )}
        </h2>

        {/* Help Text */}
        {helpText && showHelp && (
          <div className={cn(
            "mt-2 p-3 bg-light-gray rounded-lg border border-light-gray",
            "text-sm text-warm-gray",
            "animate-in slide-in-from-top-2 fade-in-0"
          )}>
            {helpText}
          </div>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className={cn(
          variantStyles.subtitle,
          alignment === "center" && "text-center"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

interface QuestionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  progress?: {
    current: number;
    total: number;
    showPercentage?: boolean;
  };
  variant?: "default" | "minimal" | "detailed";
}

export function QuestionHeader({
  title,
  description,
  progress,
  variant = "default",
  className,
  ...props
}: QuestionHeaderProps) {
  const progressPercentage = progress 
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {/* Progress Indicator */}
      {progress && variant !== "minimal" && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-warm-gray">
              Progress
            </span>
            <span className="font-mono text-xs">
              {progress.showPercentage 
                ? `${progressPercentage}%`
                : `${progress.current}/${progress.total}`
              }
            </span>
          </div>
          
          <div className="w-full bg-light-gray rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Header Content */}
      <div className="space-y-2">
        <h1 className={cn(
          "font-bold text-off-black dark:text-off-white leading-tight",
          variant === "detailed" ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
        )}>
          {title}
        </h1>
        
        {description && (
          <p className={cn(
            "text-warm-gray leading-relaxed",
            variant === "detailed" ? "text-base" : "text-sm"
          )}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

interface QuestionGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
  spacing?: "tight" | "normal" | "loose";
}

export function QuestionGroup({
  label,
  description,
  required = false,
  children,
  error,
  spacing = "normal",
  className,
  ...props
}: QuestionGroupProps) {
  const spacingStyles = {
    tight: "space-y-2",
    normal: "space-y-4", 
    loose: "space-y-6",
  };

  return (
    <fieldset className={cn(spacingStyles[spacing], className)} {...props}>
      <legend className="sr-only">{label}</legend>
      
      <QuestionLabel
        question={label}
        subtitle={description}
        required={required}
        variant="default"
      />
      
      <div className="space-y-3">
        {children}
      </div>
      
      {error && (
        <div className="text-sm text-warm-gray" role="alert">
          {error}
        </div>
      )}
    </fieldset>
  );
}