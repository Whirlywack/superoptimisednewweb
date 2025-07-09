'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  restoreFocus?: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
  className?: string;
  onEscape?: () => void;
}

export function FocusTrap({
  children,
  active = true,
  restoreFocus = true,
  initialFocus,
  className,
  onEscape,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !active) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement;

    const focusableElements = getFocusableElements(containerRef.current);
    
    if (focusableElements.length === 0) return;

    // Set initial focus
    const elementToFocus = initialFocus?.current || focusableElements[0];
    if (elementToFocus) {
      elementToFocus.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      if (e.key !== 'Tab') return;

      const currentFocusableElements = getFocusableElements(containerRef.current);
      const firstElement = currentFocusableElements[0];
      const lastElement = currentFocusableElements[currentFocusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus to previously active element
      if (restoreFocus && previousActiveElement.current) {
        (previousActiveElement.current as HTMLElement).focus?.();
      }
    };
  }, [active, mounted, restoreFocus, initialFocus, onEscape]);

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      className={className}
    >
      {children}
    </div>
  );
}

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];

  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(', ');

  const elements = Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
  
  return elements.filter(element => {
    // Check if element is visible and not inert
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      !element.hasAttribute('inert') &&
      element.tabIndex !== -1
    );
  });
}

interface FocusTrapModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
}

export function FocusTrapModal({
  isOpen,
  onClose,
  children,
  title,
  description,
  className,
  overlayClassName,
  contentClassName,
}: FocusTrapModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  if (!isOpen) return null;

  return (
    <div className={cn('fixed inset-0 z-50', className)}>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-off-black/50 transition-opacity',
          overlayClassName
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <FocusTrap active={isOpen} onEscape={onClose}>
          <div
            className={cn(
              'max-h-[90vh] w-full max-w-md overflow-auto rounded-lg bg-off-white shadow-xl',
              'focus:outline-none',
              contentClassName
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            aria-describedby={description ? 'modal-description' : undefined}
          >
            {title && (
              <div className="border-b border-light-gray px-6 py-4">
                <h2 id="modal-title" className="text-h3 font-semibold text-off-black">
                  {title}
                </h2>
                {description && (
                  <p id="modal-description" className="mt-1 text-warm-gray">
                    {description}
                  </p>
                )}
              </div>
            )}
            
            <div className="px-6 py-4">
              {children}
            </div>

            <div className="flex justify-end gap-3 border-t border-light-gray px-6 py-4">
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-warm-gray transition-colors hover:text-off-black focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="rounded-lg bg-primary px-4 py-2 text-off-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Confirm
              </button>
            </div>
          </div>
        </FocusTrap>
      </div>
    </div>
  );
}

interface FocusTrapDropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  contentClassName?: string;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

export function FocusTrapDropdown({
  trigger,
  children,
  isOpen,
  onOpenChange,
  className,
  contentClassName,
  placement = 'bottom-start',
}: FocusTrapDropdownProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        contentRef.current &&
        triggerRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onOpenChange]);

  const placementClasses = {
    'bottom-start': 'top-full left-0 mt-1',
    'bottom-end': 'top-full right-0 mt-1',
    'top-start': 'bottom-full left-0 mb-1',
    'top-end': 'bottom-full right-0 mb-1',
  };

  return (
    <div className={cn('relative inline-block', className)} ref={triggerRef}>
      {React.cloneElement(trigger as React.ReactElement<any>, {
        onClick: () => onOpenChange(!isOpen),
        'aria-expanded': isOpen,
        'aria-haspopup': true,
      })}

      {isOpen && (
        <FocusTrap active={isOpen} onEscape={() => onOpenChange(false)}>
          <div
            ref={contentRef}
            className={cn(
              'absolute z-50 rounded-lg border border-light-gray bg-off-white py-1 shadow-lg',
              'min-w-[200px] max-w-sm',
              placementClasses[placement],
              contentClassName
            )}
            role="menu"
            aria-orientation="vertical"
          >
            {children}
          </div>
        </FocusTrap>
      )}
    </div>
  );
}

interface FocusTrapPanelProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  className?: string;
  contentClassName?: string;
  overlayClassName?: string;
}

export function FocusTrapPanel({
  children,
  isOpen,
  onClose,
  side = 'right',
  className,
  contentClassName,
  overlayClassName,
}: FocusTrapPanelProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  if (!isOpen) return null;

  const translateClass = side === 'left' ? '-translate-x-full' : 'translate-x-full';
  const positionClass = side === 'left' ? 'left-0' : 'right-0';

  return (
    <div className={cn('fixed inset-0 z-50', className)}>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-off-black/50 transition-opacity',
          overlayClassName
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel content */}
      <FocusTrap active={isOpen} onEscape={onClose}>
        <div
          className={cn(
            'fixed inset-y-0 w-full max-w-sm bg-off-white shadow-xl',
            'transition-transform duration-300 ease-in-out',
            positionClass,
            isOpen ? 'translate-x-0' : translateClass,
            contentClassName
          )}
          role="dialog"
          aria-modal="true"
        >
          {children}
        </div>
      </FocusTrap>
    </div>
  );
}