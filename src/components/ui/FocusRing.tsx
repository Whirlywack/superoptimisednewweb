import React from "react";
import { cn } from "@/lib/utils";

interface FocusRingProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  shape?: "rounded" | "square" | "circle";
  offset?: "none" | "sm" | "md" | "lg";
  visible?: boolean;
  className?: string;
}

const focusVariants = {
  default: "ring-ring ring-offset-background",
  primary: "ring-primary ring-offset-background",
  success: "ring-primary ring-offset-background",
  warning: "ring-warm-gray ring-offset-background",
  danger: "ring-warm-gray ring-offset-background",
};

const focusSizes = {
  sm: "ring-1",
  md: "ring-2",
  lg: "ring-4",
};

const focusOffsets = {
  none: "ring-offset-0",
  sm: "ring-offset-1",
  md: "ring-offset-2",
  lg: "ring-offset-4",
};

const focusShapes = {
  rounded: "rounded-md",
  square: "rounded-none",
  circle: "rounded-full",
};

export function FocusRing({
  children,
  variant = "default",
  size = "md",
  shape = "rounded",
  offset = "md",
  visible = false,
  className,
  ...props
}: FocusRingProps) {
  return (
    <div
      className={cn(
        "relative inline-block",
        visible && [
          "ring-opacity-50",
          focusVariants[variant],
          focusSizes[size],
          focusOffsets[offset],
          focusShapes[shape],
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface FocusableProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  shape?: "rounded" | "square" | "circle";
  offset?: "none" | "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export function Focusable({
  children,
  as: Component = "div",
  variant = "default",
  size = "md",
  shape = "rounded",
  offset = "md",
  disabled = false,
  className,
  ...props
}: FocusableProps) {
  return (
    <Component
      className={cn(
        "focus:outline-none transition-all duration-200",
        !disabled && [
          "focus-visible:ring-opacity-50",
          focusVariants[variant],
          focusSizes[size],
          focusOffsets[offset],
          focusShapes[shape],
        ],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {children}
    </Component>
  );
}

interface FocusTrapProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  active?: boolean;
  restoreFocus?: boolean;
  className?: string;
}

export function FocusTrap({
  children,
  active = true,
  restoreFocus = true,
  className,
  ...props
}: FocusTrapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!active) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    // Get all focusable elements within the container
    const getFocusableElements = () => {
      const selector = [
        'button:not([disabled])',
        'input:not([disabled])',
        'textarea:not([disabled])',
        'select:not([disabled])',
        'a[href]',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
      ].join(', ');
      
      return Array.from(container.querySelectorAll(selector)) as HTMLElement[];
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab: move to previous element
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: move to next element
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Focus the first focusable element
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Add event listener
    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus to the previously focused element
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [active, restoreFocus]);

  if (!active) {
    return <>{children}</>;
  }

  return (
    <div
      ref={containerRef}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({
  href,
  children,
  className,
  ...props
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "absolute left-0 top-0 z-50",
        "px-4 py-2 bg-primary text-primary-foreground",
        "font-medium text-sm",
        "transform -translate-y-full",
        "focus:translate-y-0 focus:outline-none",
        "transition-transform duration-200",
        focusVariants.primary,
        focusSizes.md,
        focusOffsets.md,
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

// Hook for managing focus programmatically
export function useFocus() {
  const [focusedId, setFocusedId] = React.useState<string | null>(null);

  const focus = React.useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.focus();
      setFocusedId(id);
    }
  }, []);

  const blur = React.useCallback(() => {
    if (focusedId) {
      const element = document.getElementById(focusedId);
      if (element) {
        element.blur();
      }
    }
    setFocusedId(null);
  }, [focusedId]);

  const focusFirst = React.useCallback((containerId?: string) => {
    const container = containerId 
      ? document.getElementById(containerId)
      : document;
    
    if (!container) return;

    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const firstFocusable = container.querySelector(selector) as HTMLElement;
    if (firstFocusable) {
      firstFocusable.focus();
      setFocusedId(firstFocusable.id);
    }
  }, []);

  const focusLast = React.useCallback((containerId?: string) => {
    const container = containerId 
      ? document.getElementById(containerId)
      : document;
    
    if (!container) return;

    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const focusableElements = Array.from(container.querySelectorAll(selector)) as HTMLElement[];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    if (lastFocusable) {
      lastFocusable.focus();
      setFocusedId(lastFocusable.id);
    }
  }, []);

  return {
    focusedId,
    focus,
    blur,
    focusFirst,
    focusLast,
  };
}