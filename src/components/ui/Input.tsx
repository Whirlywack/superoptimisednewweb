import React from "react";
import { cn, accessibility } from "@/lib/utils";

interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: "default" | "filled";
  size?: "sm" | "md" | "lg";
}

const inputSizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-base",
  lg: "h-12 px-4 text-lg",
};

const inputVariants = {
  default: [
    "border border-light-gray dark:border-warm-gray/30",
    "bg-off-white dark:bg-off-black",
    "focus:border-primary focus:ring-2 focus:ring-primary/20",
  ],
  filled: [
    "border-0",
    "bg-light-gray dark:bg-warm-gray/20",
    "focus:bg-off-white dark:focus:bg-warm-gray/10",
    "focus:ring-2 focus:ring-primary/20",
  ],
};

export function TextField({
  label,
  error,
  helperText,
  variant = "default",
  size = "md",
  className,
  id,
  ...props
}: TextFieldProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-small font-medium text-off-black dark:text-off-white mb-2"
        >
          {label}
          {props.required && (
            <span className="text-warm-gray ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      
      <input
        id={inputId}
        className={cn(
          // Base styles
          "w-full rounded-lg",
          "text-off-black dark:text-off-white",
          "placeholder:text-warm-gray",
          "transition-all duration-200",
          // Accessibility
          accessibility.focusRing,
          accessibility.touchTarget,
          // Size
          inputSizes[size],
          // Variant
          inputVariants[variant],
          // Error state
          error && [
            "border-warm-gray",
            "focus:border-warm-gray focus:ring-warm-gray/20",
          ],
          // Disabled state
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={cn(
          errorId,
          helperId
        ).trim() || undefined}
        {...props}
      />
      
      {error && (
        <p
          id={errorId}
          className="mt-2 text-small text-warm-gray"
          role="alert"
        >
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p
          id={helperId}
          className="mt-2 text-small text-warm-gray"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
}

const checkboxSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function Checkbox({
  label,
  error,
  size = "md",
  className,
  id,
  ...props
}: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${checkboxId}-error` : undefined;

  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        id={checkboxId}
        className={cn(
          // Base styles
          "rounded border-2 border-light-gray dark:border-warm-gray/30",
          "text-primary bg-off-white dark:bg-off-black",
          "focus:ring-2 focus:ring-primary/20 focus:ring-offset-0",
          "transition-all duration-200",
          // Accessibility
          accessibility.touchTarget,
          // Size
          checkboxSizes[size],
          // Error state
          error && "border-warm-gray",
          // Disabled state
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={errorId}
        {...props}
      />
      
      <div className="flex-1">
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-body text-off-black dark:text-off-white cursor-pointer"
          >
            {label}
            {props.required && (
              <span className="text-warm-gray ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        
        {error && (
          <p
            id={errorId}
            className="mt-1 text-small text-warm-gray"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  size?: "sm" | "md" | "lg";
}

const radioSizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5", 
  lg: "h-6 w-6",
};

export function Radio({
  label,
  size = "md",
  className,
  id,
  ...props
}: RadioProps) {
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="flex items-center gap-3">
      <input
        type="radio"
        id={radioId}
        className={cn(
          // Base styles
          "border-2 border-light-gray dark:border-warm-gray/30",
          "text-primary bg-off-white dark:bg-off-black",
          "focus:ring-2 focus:ring-primary/20 focus:ring-offset-0",
          "transition-all duration-200",
          // Accessibility
          accessibility.touchTarget,
          // Size
          radioSizes[size],
          // Disabled state
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
      
      {label && (
        <label
          htmlFor={radioId}
          className="text-body text-off-black dark:text-off-white cursor-pointer"
        >
          {label}
          {props.required && (
            <span className="text-warm-gray ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
    </div>
  );
}

interface RadioGroupProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function RadioGroup({
  label,
  error,
  children,
  className,
}: RadioGroupProps) {
  const groupId = `radio-group-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${groupId}-error` : undefined;

  return (
    <fieldset className={cn("w-full", className)}>
      {label && (
        <legend className="block text-small font-medium text-off-black dark:text-off-white mb-3">
          {label}
        </legend>
      )}
      
      <div
        className="space-y-3"
        role="radiogroup"
        aria-describedby={errorId}
      >
        {children}
      </div>
      
      {error && (
        <p
          id={errorId}
          className="mt-2 text-small text-warm-gray"
          role="alert"
        >
          {error}
        </p>
      )}
    </fieldset>
  );
}