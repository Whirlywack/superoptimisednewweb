import React from "react";
import { cn } from "@/lib/utils";
import { TextField, Checkbox, Radio } from "@/components/ui/Input";

interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormGroup({
  className,
  label,
  error,
  helperText,
  required = false,
  children,
  ...props
}: FormGroupProps) {
  const hasError = !!error;
  const hasHelper = !!helperText && !hasError;

  return (
    <div
      className={cn("space-y-2", className)}
      {...props}
    >
      {label && (
        <label className={cn(
          "block text-sm font-medium",
          hasError ? "text-warm-gray" : "text-off-black dark:text-off-white",
          required && "after:content-['*'] after:ml-0.5 after:text-warm-gray"
        )}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {children}
      </div>
      
      {hasError && (
        <p className="text-sm text-warm-gray" role="alert">
          {error}
        </p>
      )}
      
      {hasHelper && (
        <p className="text-sm text-warm-gray">
          {helperText}
        </p>
      )}
    </div>
  );
}

interface TextFieldGroupProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  id?: string;
  className?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "filled";
}

export function TextFieldGroup({
  label,
  error,
  helperText,
  required = false,
  id,
  className,
  ...textFieldProps
}: TextFieldGroupProps) {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <FormGroup
      label={label}
      error={error}
      helperText={helperText}
      required={required}
      className={className}
    >
      <TextField
        id={fieldId}
        aria-describedby={
          error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
        }
        aria-invalid={!!error}
        {...textFieldProps}
      />
    </FormGroup>
  );
}

interface CheckboxGroupProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  id?: string;
  className?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export function CheckboxGroup({
  label,
  error,
  helperText,
  required = false,
  id,
  className,
  ...checkboxProps
}: CheckboxGroupProps) {
  const fieldId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <FormGroup
      error={error}
      helperText={helperText}
      className={className}
    >
      <Checkbox
        id={fieldId}
        label={label}
        required={required}
        aria-describedby={
          error ? `${fieldId}-error` : helperText ? `${fieldId}-helper` : undefined
        }
        aria-invalid={!!error}
        {...checkboxProps}
      />
    </FormGroup>
  );
}

interface RadioGroupOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  name: string;
  options: RadioGroupOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RadioButtonGroup({
  label,
  error,
  helperText,
  required = false,
  name,
  options,
  value,
  defaultValue,
  onChange,
  disabled = false,
  size = "md",
  className,
}: RadioGroupProps) {
  const groupId = `radio-group-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <FormGroup
      label={label}
      error={error}
      helperText={helperText}
      required={required}
      className={className}
    >
      <div
        role="radiogroup"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        aria-describedby={
          error ? `${groupId}-error` : helperText ? `${groupId}-helper` : undefined
        }
        className="space-y-2"
      >
        {options.map((option, index) => (
          <Radio
            key={option.value}
            id={`${groupId}-${index}`}
            name={name}
            value={option.value}
            label={option.label}
            checked={value === option.value}
            defaultChecked={!value && defaultValue === option.value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled || option.disabled}
            size={size}
            aria-invalid={!!error}
          />
        ))}
      </div>
    </FormGroup>
  );
}