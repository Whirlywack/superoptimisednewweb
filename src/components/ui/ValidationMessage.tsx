import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from "lucide-react";

interface ValidationMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  type?: "error" | "warning" | "success" | "info";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "subtle" | "bordered" | "inline";
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  showIcon?: boolean;
  animate?: boolean;
}

const messageTypes = {
  error: {
    icon: AlertCircle,
    colors: {
      default: "bg-light-gray border-warm-gray text-off-black",
      subtle: "bg-light-gray/50 text-warm-gray",
      bordered: "border-2 border-warm-gray bg-light-gray text-off-black",
      inline: "text-warm-gray",
    },
    iconColor: "text-warm-gray",
  },
  warning: {
    icon: AlertTriangle,
    colors: {
      default: "bg-light-gray border-warm-gray text-off-black",
      subtle: "bg-light-gray/50 text-warm-gray",
      bordered: "border-2 border-warm-gray bg-light-gray text-off-black",
      inline: "text-warm-gray",
    },
    iconColor: "text-warm-gray",
  },
  success: {
    icon: CheckCircle,
    colors: {
      default: "bg-light-gray border-primary text-off-black",
      subtle: "bg-light-gray/50 text-primary",
      bordered: "border-2 border-primary bg-light-gray text-off-black",
      inline: "text-primary",
    },
    iconColor: "text-primary",
  },
  info: {
    icon: Info,
    colors: {
      default: "bg-light-gray border-primary text-off-black",
      subtle: "bg-light-gray/50 text-primary",
      bordered: "border-2 border-primary bg-light-gray text-off-black",
      inline: "text-primary",
    },
    iconColor: "text-primary",
  },
};

const messageSizes = {
  sm: {
    container: "p-2 text-sm",
    icon: "w-4 h-4",
    dismissButton: "w-4 h-4",
  },
  md: {
    container: "p-3 text-sm",
    icon: "w-5 h-5",
    dismissButton: "w-5 h-5",
  },
  lg: {
    container: "p-4 text-base",
    icon: "w-6 h-6",
    dismissButton: "w-6 h-6",
  },
};

export function ValidationMessage({
  message,
  type = "error",
  size = "md",
  variant = "default",
  dismissible = false,
  onDismiss,
  icon,
  showIcon = true,
  animate = true,
  className,
  ...props
}: ValidationMessageProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const typeConfig = messageTypes[type];
  const sizeConfig = messageSizes[size];
  const IconComponent = icon ? () => <>{icon}</> : typeConfig.icon;

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss?.(), 150);
  };

  if (!isVisible) return null;

  const containerClasses = cn(
    "flex items-start gap-2 rounded-lg transition-all duration-200",
    variant !== "inline" && [
      sizeConfig.container,
      typeConfig.colors[variant],
    ],
    variant === "inline" && "py-1",
    animate && "animate-in fade-in-0 slide-in-from-top-1",
    className
  );

  if (variant === "inline") {
    return (
      <div className={containerClasses} role="alert" {...props}>
        {showIcon && (
          <IconComponent className={cn(sizeConfig.icon, typeConfig.iconColor, "flex-shrink-0 mt-0.5")} />
        )}
        <span className={cn("flex-1", typeConfig.colors.inline)}>
          {message}
        </span>
      </div>
    );
  }

  return (
    <div className={containerClasses} role="alert" {...props}>
      {showIcon && (
        <IconComponent className={cn(sizeConfig.icon, typeConfig.iconColor, "flex-shrink-0 mt-0.5")} />
      )}
      
      <div className="flex-1 min-w-0">
        <p className="leading-relaxed">{message}</p>
      </div>
      
      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={handleDismiss}
          className={cn(
            "flex-shrink-0 rounded-md p-1 transition-colors",
            "hover:bg-black/10 dark:hover:bg-white/10",
            "focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2"
          )}
          aria-label="Dismiss message"
        >
          <X className={sizeConfig.dismissButton} />
        </button>
      )}
    </div>
  );
}

interface ValidationSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  errors: string[];
  warnings?: string[];
  title?: string;
  maxVisible?: number;
  collapsible?: boolean;
}

export function ValidationSummary({
  errors,
  warnings = [],
  title = "Please fix the following issues:",
  maxVisible = 5,
  collapsible = false,
  className,
  ...props
}: ValidationSummaryProps) {
  const [isExpanded, setIsExpanded] = React.useState(!collapsible);
  const totalIssues = errors.length + warnings.length;

  if (totalIssues === 0) return null;

  const visibleErrors = isExpanded ? errors : errors.slice(0, maxVisible);
  const visibleWarnings = isExpanded ? warnings : warnings.slice(0, Math.max(0, maxVisible - errors.length));
  const hiddenCount = totalIssues - visibleErrors.length - visibleWarnings.length;

  return (
    <div
      className={cn(
        "border border-warm-gray bg-light-gray rounded-lg p-4 space-y-3",
        className
      )}
      role="alert"
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-off-black flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {title}
        </h3>
        
        {collapsible && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-warm-gray hover:text-off-black text-sm font-medium"
          >
            {isExpanded ? "Show less" : `Show all (${totalIssues})`}
          </button>
        )}
      </div>

      {/* Issues List */}
      <div className="space-y-2">
        {/* Errors */}
        {visibleErrors.map((error, index) => (
          <ValidationMessage
            key={`error-${index}`}
            message={error}
            type="error"
            variant="inline"
            size="sm"
            showIcon={false}
          />
        ))}
        
        {/* Warnings */}
        {visibleWarnings.map((warning, index) => (
          <ValidationMessage
            key={`warning-${index}`}
            message={warning}
            type="warning"
            variant="inline"
            size="sm"
            showIcon={false}
          />
        ))}
        
        {/* Hidden Count */}
        {hiddenCount > 0 && !isExpanded && (
          <p className="text-sm text-warm-gray">
            ... and {hiddenCount} more issue{hiddenCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
}

interface FieldValidationProps extends React.HTMLAttributes<HTMLDivElement> {
  errors?: string[];
  warnings?: string[];
  success?: string;
  info?: string;
  showCount?: boolean;
}

export function FieldValidation({
  errors = [],
  warnings = [],
  success,
  info,
  showCount = false,
  className,
  ...props
}: FieldValidationProps) {
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;

  return (
    <div className={cn("space-y-1", className)} {...props}>
      {/* Errors */}
      {errors.map((error, index) => (
        <ValidationMessage
          key={`error-${index}`}
          message={error}
          type="error"
          variant="inline"
          size="sm"
        />
      ))}
      
      {/* Warnings */}
      {warnings.map((warning, index) => (
        <ValidationMessage
          key={`warning-${index}`}
          message={warning}
          type="warning"
          variant="inline"
          size="sm"
        />
      ))}
      
      {/* Success */}
      {success && !hasErrors && !hasWarnings && (
        <ValidationMessage
          message={success}
          type="success"
          variant="inline"
          size="sm"
        />
      )}
      
      {/* Info */}
      {info && !hasErrors && !hasWarnings && !success && (
        <ValidationMessage
          message={info}
          type="info"
          variant="inline"
          size="sm"
        />
      )}
      
      {/* Count */}
      {showCount && (hasErrors || hasWarnings) && (
        <p className="text-xs text-muted-foreground">
          {hasErrors && `${errors.length} error${errors.length !== 1 ? 's' : ''}`}
          {hasErrors && hasWarnings && ', '}
          {hasWarnings && `${warnings.length} warning${warnings.length !== 1 ? 's' : ''}`}
        </p>
      )}
    </div>
  );
}

// Hook for form validation
export function useValidation() {
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});
  const [warnings, setWarnings] = React.useState<Record<string, string[]>>({});

  const addError = (field: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), message],
    }));
  };

  const addWarning = (field: string, message: string) => {
    setWarnings(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), message],
    }));
  };

  const clearField = (field: string) => {
    setErrors(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
    setWarnings(prev => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  };

  const clearAll = () => {
    setErrors({});
    setWarnings({});
  };

  const hasErrors = (field?: string) => {
    if (field) return (errors[field]?.length || 0) > 0;
    return Object.keys(errors).length > 0;
  };

  const hasWarnings = (field?: string) => {
    if (field) return (warnings[field]?.length || 0) > 0;
    return Object.keys(warnings).length > 0;
  };

  const getFieldErrors = (field: string) => errors[field] || [];
  const getFieldWarnings = (field: string) => warnings[field] || [];

  const getAllErrors = () => {
    return Object.values(errors).flat();
  };

  const getAllWarnings = () => {
    return Object.values(warnings).flat();
  };

  return {
    errors,
    warnings,
    addError,
    addWarning,
    clearField,
    clearAll,
    hasErrors,
    hasWarnings,
    getFieldErrors,
    getFieldWarnings,
    getAllErrors,
    getAllWarnings,
  };
}