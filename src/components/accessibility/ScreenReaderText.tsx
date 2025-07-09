"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ScreenReaderTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

export function ScreenReaderText({
  children,
  className,
  asChild = false,
  ...props
}: ScreenReaderTextProps) {
  const Component = asChild ? React.Fragment : "span";

  if (asChild) {
    return (
      <>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              className: cn("sr-only", (child.props as any)?.className),
              ...props,
            });
          }
          return child;
        })}
      </>
    );
  }

  return (
    <Component className={cn("sr-only", className)} {...props}>
      {children}
    </Component>
  );
}

export interface VisuallyHiddenProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function VisuallyHidden({
  children,
  className,
  as: Component = "span",
}: VisuallyHiddenProps) {
  return (
    <Component
      className={cn(
        "absolute -m-px size-px overflow-hidden p-0",
        "whitespace-nowrap border-0",
        "[clip:rect(0,0,0,0)]",
        className
      )}
    >
      {children}
    </Component>
  );
}

export interface SROnlyProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  focusable?: boolean;
  className?: string;
}

export function SROnly({ children, focusable = false, className, ...props }: SROnlyProps) {
  return (
    <span
      className={cn(
        "sr-only",
        focusable && "focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-50",
        focusable && "focus:rounded focus:bg-off-black focus:px-4 focus:py-2 focus:text-off-white",
        className
      )}
      tabIndex={focusable ? 0 : undefined}
      {...props}
    >
      {children}
    </span>
  );
}

export interface AccessibleLabelProps {
  children: React.ReactNode;
  label: string;
  description?: string;
  required?: boolean;
  className?: string;
}

export function AccessibleLabel({
  children,
  label,
  description,
  required = false,
  className,
}: AccessibleLabelProps) {
  const labelId = React.useId();
  const descriptionId = React.useId();

  return (
    <div className={className}>
      <label id={labelId} className="mb-2 block text-base font-medium text-off-black">
        {label}
        {required && (
          <>
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
            <ScreenReaderText>required</ScreenReaderText>
          </>
        )}
      </label>

      {description && (
        <p id={descriptionId} className="mb-3 text-small text-warm-gray">
          {description}
        </p>
      )}

      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            "aria-labelledby": labelId,
            "aria-describedby": description ? descriptionId : undefined,
            "aria-required": required,
          });
        }
        return child;
      })}
    </div>
  );
}

export interface IconWithTextProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  iconDescription: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function IconWithText({
  icon,
  children,
  iconDescription,
  className,
  iconClassName,
  textClassName,
}: IconWithTextProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className={iconClassName} aria-hidden="true">
        {icon}
      </span>
      <ScreenReaderText>{iconDescription}</ScreenReaderText>
      <span className={textClassName}>{children}</span>
    </span>
  );
}

export interface ButtonWithSRTextProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  srText?: string;
  className?: string;
}

export function ButtonWithSRText({ children, srText, className, ...props }: ButtonWithSRTextProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-4 py-2",
        "bg-primary text-off-white hover:bg-primary/90",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "transition-colors duration-200",
        className
      )}
      {...props}
    >
      {children}
      {srText && <ScreenReaderText>{srText}</ScreenReaderText>}
    </button>
  );
}

export interface StatusAnnouncementProps {
  message: string;
  type?: "polite" | "assertive";
  className?: string;
}

export function StatusAnnouncement({
  message,
  type = "polite",
  className,
}: StatusAnnouncementProps) {
  return (
    <div aria-live={type} aria-atomic="true" className={cn("sr-only", className)}>
      {message}
    </div>
  );
}
