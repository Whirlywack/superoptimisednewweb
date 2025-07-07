"use client";

import { useEffect, useRef, useState } from "react";

export interface AccessibilityOptions {
  enableScreenReader?: boolean;
  enableKeyboardNavigation?: boolean;
  enableHighContrast?: boolean;
  enableReducedMotion?: boolean;
}

export function useAccessibility(options: AccessibilityOptions = {}) {
  const {
    enableScreenReader = true,
    enableKeyboardNavigation = true,
    enableHighContrast = true,
    enableReducedMotion = true,
  } = options;

  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);
  const [isVirtualKeyboardVisible, setIsVirtualKeyboardVisible] = useState(false);

  const lastFocusedElement = useRef<HTMLElement | null>(null);

  // Detect screen reader usage
  useEffect(() => {
    if (!enableScreenReader) return;

    const detectScreenReader = () => {
      // Check for common screen reader indicators
      const hasAccessibilityAPI = "speechSynthesis" in window;
      const hasScreenReader =
        window.navigator.userAgent.includes("NVDA") ||
        window.navigator.userAgent.includes("JAWS") ||
        window.navigator.userAgent.includes("VoiceOver");

      setIsScreenReaderActive(hasAccessibilityAPI || hasScreenReader);
    };

    detectScreenReader();
  }, [enableScreenReader]);

  // Detect keyboard navigation
  useEffect(() => {
    if (!enableKeyboardNavigation) return;

    let isUsingKeyboard = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key === "Enter" || e.key === " " || e.key.startsWith("Arrow")) {
        isUsingKeyboard = true;
        setIsKeyboardUser(true);
      }
    };

    const handleMouseDown = () => {
      if (isUsingKeyboard) {
        isUsingKeyboard = false;
        setIsKeyboardUser(false);
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      if (e.target instanceof HTMLElement) {
        lastFocusedElement.current = e.target;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [enableKeyboardNavigation]);

  // Detect reduced motion preference
  useEffect(() => {
    if (!enableReducedMotion) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [enableReducedMotion]);

  // Detect high contrast preference
  useEffect(() => {
    if (!enableHighContrast) return;

    const mediaQuery = window.matchMedia("(prefers-contrast: high)");
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [enableHighContrast]);

  // Detect virtual keyboard (mobile)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initialHeight = window.innerHeight;

    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialHeight - currentHeight;

      // Consider virtual keyboard visible if height decreased by more than 150px
      setIsVirtualKeyboardVisible(heightDifference > 150);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Announce to screen readers
  const announceToScreenReader = (message: string, priority: "polite" | "assertive" = "polite") => {
    if (!enableScreenReader || !isScreenReaderActive) return;

    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Focus management
  const focusFirstInteractiveElement = (container?: HTMLElement) => {
    const root = container || document;
    const focusableElements = root.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    if (firstElement) {
      firstElement.focus();
    }
  };

  const restoreFocus = () => {
    if (lastFocusedElement.current) {
      lastFocusedElement.current.focus();
    }
  };

  // Skip link functionality
  const createSkipLink = (targetId: string, text: string = "Skip to main content") => {
    return {
      href: `#${targetId}`,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: "smooth" });
        }
      },
      className:
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded",
      children: text,
    };
  };

  return {
    // State
    isScreenReaderActive,
    isKeyboardUser,
    prefersReducedMotion,
    prefersHighContrast,
    isVirtualKeyboardVisible,

    // Actions
    announceToScreenReader,
    focusFirstInteractiveElement,
    restoreFocus,
    createSkipLink,

    // Helper properties
    shouldReduceMotion: prefersReducedMotion,
    shouldUseHighContrast: prefersHighContrast,
    isMobileKeyboard: isVirtualKeyboardVisible,
  };
}
