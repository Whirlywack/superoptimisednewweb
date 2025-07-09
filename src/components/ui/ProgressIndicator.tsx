import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProgressDotProps extends React.HTMLAttributes<HTMLDivElement> {
  current: number;
  total: number;
  variant?: "dots" | "line" | "steps" | "minimal";
  size?: "sm" | "md" | "lg";
  showNumbers?: boolean;
  showLabels?: boolean;
  labels?: string[];
  color?: "default" | "primary" | "success";
  clickable?: boolean;
  onStepClick?: (step: number) => void;
}

const dotSizes = {
  sm: {
    dot: "w-2 h-2",
    activeDot: "w-3 h-3",
    container: "gap-1",
    line: "h-0.5",
    step: "w-6 h-6 text-xs",
    activeStep: "w-7 h-7 text-sm",
  },
  md: {
    dot: "w-3 h-3",
    activeDot: "w-4 h-4",
    container: "gap-2",
    line: "h-1",
    step: "w-8 h-8 text-sm",
    activeStep: "w-9 h-9 text-base",
  },
  lg: {
    dot: "w-4 h-4",
    activeDot: "w-5 h-5",
    container: "gap-3",
    line: "h-1.5",
    step: "w-10 h-10 text-base",
    activeStep: "w-11 h-11 text-lg",
  },
};

const progressColors = {
  default: {
    completed: "bg-foreground",
    current: "bg-primary border-primary",
    upcoming: "bg-muted border-border",
    line: "bg-foreground",
  },
  primary: {
    completed: "bg-primary",
    current: "bg-primary border-primary",
    upcoming: "bg-muted border-border",
    line: "bg-primary",
  },
  success: {
    completed: "bg-primary",
    current: "bg-primary border-primary",
    upcoming: "bg-light-gray border-light-gray",
    line: "bg-primary",
  },
};

export function ProgressIndicator({
  current,
  total,
  variant = "dots",
  size = "md",
  showNumbers = false,
  showLabels = false,
  labels = [],
  color = "default",
  clickable = false,
  onStepClick,
  className,
  ...props
}: ProgressDotProps) {
  const sizeConfig = dotSizes[size];
  const colorConfig = progressColors[color];

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < current - 1) return "completed";
    if (stepIndex === current - 1) return "current";
    return "upcoming";
  };

  const renderDots = () => (
    <div className={cn("flex items-center", sizeConfig.container, className)} {...props}>
      {Array.from({ length: total }, (_, index) => {
        const stepNumber = index + 1;
        const status = getStepStatus(index);
        const isClickable = clickable && onStepClick;

        return (
          <button
            key={index}
            type="button"
            onClick={isClickable ? () => onStepClick(stepNumber) : undefined}
            disabled={!isClickable}
            className={cn(
              "rounded-full transition-all duration-200",
              status === "current" ? sizeConfig.activeDot : sizeConfig.dot,
              status === "completed" && colorConfig.completed,
              status === "current" && cn(colorConfig.current, "border-2"),
              status === "upcoming" && colorConfig.upcoming,
              isClickable &&
                "cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              !isClickable && "cursor-default"
            )}
            aria-label={`Step ${stepNumber}${labels[index] ? `: ${labels[index]}` : ""}`}
            aria-current={status === "current" ? "step" : undefined}
          />
        );
      })}
    </div>
  );

  const renderLine = () => {
    const progressPercentage = ((current - 1) / (total - 1)) * 100;

    return (
      <div className={cn("relative w-full", className)} {...props}>
        <div className={cn("w-full rounded-full", sizeConfig.line, colorConfig.upcoming)} />
        <div
          className={cn(
            "absolute left-0 top-0 rounded-full transition-all duration-300",
            sizeConfig.line,
            colorConfig.line
          )}
          style={{ width: `${Math.max(0, progressPercentage)}%` }}
        />
      </div>
    );
  };

  const renderSteps = () => (
    <div className={cn("flex w-full items-center justify-between", className)} {...props}>
      {Array.from({ length: total }, (_, index) => {
        const stepNumber = index + 1;
        const status = getStepStatus(index);
        const isClickable = clickable && onStepClick;

        return (
          <div key={index} className="flex flex-col items-center">
            <button
              type="button"
              onClick={isClickable ? () => onStepClick(stepNumber) : undefined}
              disabled={!isClickable}
              className={cn(
                "flex items-center justify-center rounded-full border-2 font-medium transition-all duration-200",
                status === "current" ? sizeConfig.activeStep : sizeConfig.step,
                status === "completed" &&
                  cn(colorConfig.completed, "border-transparent text-white"),
                status === "current" && cn(colorConfig.current, "text-primary-foreground"),
                status === "upcoming" && cn(colorConfig.upcoming, "text-muted-foreground"),
                isClickable &&
                  "cursor-pointer hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                !isClickable && "cursor-default"
              )}
              aria-label={`Step ${stepNumber}${labels[index] ? `: ${labels[index]}` : ""}`}
              aria-current={status === "current" ? "step" : undefined}
            >
              {status === "completed" && !showNumbers ? <Check className="size-4" /> : stepNumber}
            </button>

            {showLabels && labels[index] && (
              <span
                className={cn(
                  "mt-2 max-w-16 text-center text-xs leading-tight",
                  status === "current" ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {labels[index]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderMinimal = () => (
    <div className={cn("flex items-center gap-1", className)} {...props}>
      <span className="font-mono text-sm text-muted-foreground">
        {current}/{total}
      </span>
      <div className="ml-2 flex items-center gap-1">
        {Array.from({ length: total }, (_, index) => (
          <div
            key={index}
            className={cn(
              "size-1.5 rounded-full transition-colors duration-200",
              index < current ? colorConfig.completed : colorConfig.upcoming
            )}
          />
        ))}
      </div>
    </div>
  );

  switch (variant) {
    case "line":
      return renderLine();
    case "steps":
      return renderSteps();
    case "minimal":
      return renderMinimal();
    default:
      return renderDots();
  }
}

interface QuestionnaireProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  currentQuestion: number;
  totalQuestions: number;
  completedQuestions?: number;
  skippedQuestions?: number;
  showPercentage?: boolean;
  showDetails?: boolean;
  variant?: "default" | "compact" | "detailed";
}

export function QuestionnaireProgress({
  currentQuestion,
  totalQuestions,
  completedQuestions = currentQuestion - 1,
  skippedQuestions = 0,
  showPercentage = true,
  showDetails = false,
  variant = "default",
  className,
  ...props
}: QuestionnaireProgressProps) {
  const percentage = Math.round((completedQuestions / totalQuestions) * 100);
  const remainingQuestions = totalQuestions - completedQuestions - skippedQuestions;

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-3", className)} {...props}>
        <ProgressIndicator
          current={currentQuestion}
          total={totalQuestions}
          variant="minimal"
          size="sm"
        />
        {showPercentage && (
          <span className="font-mono text-sm text-muted-foreground">{percentage}%</span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)} {...props}>
      {/* Progress Header */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">
          Question {currentQuestion} of {totalQuestions}
        </span>
        {showPercentage && (
          <span className="font-mono text-muted-foreground">{percentage}% complete</span>
        )}
      </div>

      {/* Progress Bar */}
      <ProgressIndicator
        current={currentQuestion}
        total={totalQuestions}
        variant="line"
        size={variant === "detailed" ? "lg" : "md"}
      />

      {/* Progress Details */}
      {showDetails && (
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="text-center">
            <div className="font-mono text-primary">{completedQuestions}</div>
            <div className="text-muted-foreground">Completed</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-warm-gray">{skippedQuestions}</div>
            <div className="text-muted-foreground">Skipped</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-muted-foreground">{remainingQuestions}</div>
            <div className="text-muted-foreground">Remaining</div>
          </div>
        </div>
      )}
    </div>
  );
}

interface MultiStepProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Array<{
    id: string;
    label: string;
    description?: string;
    completed?: boolean;
    current?: boolean;
    error?: boolean;
  }>;
  onStepClick?: (stepId: string) => void;
  variant?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
}

export function MultiStepProgress({
  steps,
  onStepClick,
  variant = "horizontal",
  size: _size = "md",
  className,
  ...props
}: MultiStepProgressProps) {
  if (variant === "vertical") {
    return (
      <div className={cn("space-y-4", className)} {...props}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-3">
            <button
              type="button"
              onClick={onStepClick ? () => onStepClick(step.id) : undefined}
              disabled={!onStepClick}
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full border-2 font-medium transition-all duration-200",
                step.completed && "border-primary bg-primary text-off-white",
                step.current && "border-primary bg-primary text-primary-foreground",
                step.error && "border-warm-gray bg-warm-gray text-off-white",
                !step.completed &&
                  !step.current &&
                  !step.error &&
                  "border-border bg-muted text-muted-foreground",
                onStepClick &&
                  "cursor-pointer hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              )}
            >
              {step.completed ? <Check className="size-4" /> : index + 1}
            </button>

            <div className="min-w-0 flex-1">
              <h3
                className={cn(
                  "font-medium leading-tight",
                  step.current ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </h3>
              {step.description && (
                <p className="mt-1 text-xs text-muted-foreground">{step.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex w-full items-center justify-between", className)} {...props}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={onStepClick ? () => onStepClick(step.id) : undefined}
              disabled={!onStepClick}
              className={cn(
                "flex size-10 items-center justify-center rounded-full border-2 font-medium transition-all duration-200",
                step.completed && "border-primary bg-primary text-off-white",
                step.current && "border-primary bg-primary text-primary-foreground",
                step.error && "border-warm-gray bg-warm-gray text-off-white",
                !step.completed &&
                  !step.current &&
                  !step.error &&
                  "border-border bg-muted text-muted-foreground",
                onStepClick &&
                  "cursor-pointer hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              )}
            >
              {step.completed ? <Check className="size-5" /> : index + 1}
            </button>

            <span
              className={cn(
                "mt-2 max-w-20 text-center text-xs leading-tight",
                step.current ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div
              className={cn(
                "mx-2 h-0.5 flex-1 rounded-full transition-colors duration-200",
                step.completed ? "bg-primary" : "bg-light-gray"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
