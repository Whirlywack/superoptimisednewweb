import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className, ...props }: TypographyProps) {
  return (
    <h1
      className={cn("text-h1 text-off-black dark:text-off-white", className)}
      {...props}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className, ...props }: TypographyProps) {
  return (
    <h2
      className={cn("text-h2 text-off-black dark:text-off-white", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className, ...props }: TypographyProps) {
  return (
    <h3
      className={cn("text-h3 text-off-black dark:text-off-white", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function H4({ children, className, ...props }: TypographyProps) {
  return (
    <h4
      className={cn("text-h4 text-off-black dark:text-off-white", className)}
      {...props}
    >
      {children}
    </h4>
  );
}

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "muted" | "small";
}

export function Paragraph({ 
  children, 
  className, 
  variant = "default",
  ...props 
}: ParagraphProps) {
  const variantClasses = {
    default: "text-body text-off-black dark:text-off-white",
    muted: "text-body text-warm-gray",
    small: "text-small text-warm-gray",
  };

  return (
    <p
      className={cn(variantClasses[variant], "max-w-reading", className)}
      {...props}
    >
      {children}
    </p>
  );
}

interface InlineCodeProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

export function InlineCode({ children, className, ...props }: InlineCodeProps) {
  return (
    <code
      className={cn(
        "text-code font-mono",
        "bg-light-gray dark:bg-warm-gray/20",
        "text-off-black dark:text-off-white",
        "px-1.5 py-0.5 rounded-md",
        "border border-light-gray dark:border-warm-gray/30",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "muted";
  external?: boolean;
}

export function Link({ 
  children, 
  className, 
  variant = "default",
  external = false,
  ...props 
}: LinkProps) {
  const variantClasses = {
    default: "text-primary hover:text-primary/80",
    muted: "text-warm-gray hover:text-off-black dark:hover:text-off-white",
  };

  const externalProps = external 
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a
      className={cn(
        variantClasses[variant],
        "underline underline-offset-4 decoration-2",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className
      )}
      {...externalProps}
      {...props}
    >
      {children}
      {external && (
        <span className="ml-1 text-xs" aria-hidden="true">
          ↗
        </span>
      )}
    </a>
  );
}

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  children: React.ReactNode;
  className?: string;
  language?: string;
}

export function CodeBlock({ 
  children, 
  className, 
  language,
  ...props 
}: CodeBlockProps) {
  return (
    <pre
      className={cn(
        "text-code font-mono",
        "bg-light-gray dark:bg-warm-gray/10",
        "text-off-black dark:text-off-white",
        "p-4 rounded-lg",
        "border border-light-gray dark:border-warm-gray/30",
        "overflow-x-auto",
        "max-w-full",
        className
      )}
      {...props}
    >
      {language && (
        <div className="text-small text-warm-gray mb-2 font-sans">
          {language}
        </div>
      )}
      <code>{children}</code>
    </pre>
  );
}

interface MonoTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "muted" | "small";
  as?: "span" | "div" | "time";
}

export function MonoText({ 
  children, 
  className, 
  variant = "default",
  as: Component = "span",
  ...props 
}: MonoTextProps) {
  const variantClasses = {
    default: "text-sm text-off-black dark:text-off-white",
    muted: "text-sm text-warm-gray",
    small: "text-xs text-warm-gray",
  };

  return (
    <Component
      className={cn(
        "font-mono tracking-tight",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}