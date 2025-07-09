"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface AnnounceRegionProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  priority?: "polite" | "assertive";
  atomic?: boolean;
  className?: string;
}

export function AnnounceRegion({
  message,
  priority = "polite",
  atomic = true,
  className,
  ...props
}: AnnounceRegionProps) {
  return (
    <div aria-live={priority} aria-atomic={atomic} className={cn("sr-only", className)} {...props}>
      {message}
    </div>
  );
}

export interface LiveAnnouncerProps {
  children?: React.ReactNode | ((announce: (message: string, priority?: "polite" | "assertive") => void) => React.ReactNode);
  className?: string;
}

export function LiveAnnouncer({ children, className }: LiveAnnouncerProps) {
  const [politeMessages, setPoliteMessages] = useState<string[]>([]);
  const [assertiveMessages, setAssertiveMessages] = useState<string[]>([]);
  const politeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const assertiveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const announce = (message: string, priority: "polite" | "assertive" = "polite") => {
    if (priority === "polite") {
      setPoliteMessages((prev) => [...prev, message]);

      // Clear the message after 1 second
      if (politeTimeoutRef.current) {
        clearTimeout(politeTimeoutRef.current);
      }
      politeTimeoutRef.current = setTimeout(() => {
        setPoliteMessages([]);
      }, 1000);
    } else {
      setAssertiveMessages((prev) => [...prev, message]);

      // Clear the message after 1 second
      if (assertiveTimeoutRef.current) {
        clearTimeout(assertiveTimeoutRef.current);
      }
      assertiveTimeoutRef.current = setTimeout(() => {
        setAssertiveMessages([]);
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (politeTimeoutRef.current) {
        clearTimeout(politeTimeoutRef.current);
      }
      if (assertiveTimeoutRef.current) {
        clearTimeout(assertiveTimeoutRef.current);
      }
    };
  }, []);

  // Provide announce function to children via context or props
  return (
    <div className={className}>
      {/* Live regions for announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {politeMessages.join(". ")}
      </div>

      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {assertiveMessages.join(". ")}
      </div>

      {/* Render children with announce function */}
      {typeof children === "function" ? children(announce) : children}
    </div>
  );
}

export interface StatusAnnouncerProps {
  children: React.ReactNode;
  className?: string;
}

export function StatusAnnouncer({ children, className }: StatusAnnouncerProps) {
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState<"polite" | "assertive">("polite");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const announceStatus = (
    message: string,
    priority: "polite" | "assertive" = "polite",
    duration = 3000
  ) => {
    setStatus(message);
    setPriority(priority);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clear the status after the specified duration
    timeoutRef.current = setTimeout(() => {
      setStatus("");
    }, duration);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={className}>
      {/* Status live region */}
      <div aria-live={priority} aria-atomic="true" className="sr-only">
        {status}
      </div>

      {/* Render children with announceStatus function */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            // @ts-expect-error - Adding announceStatus as a prop
            announceStatus,
          });
        }
        return child;
      })}
    </div>
  );
}

export interface LoadingAnnouncerProps {
  isLoading: boolean;
  loadingMessage?: string;
  completedMessage?: string;
  errorMessage?: string;
  error?: boolean;
  className?: string;
}

export function LoadingAnnouncer({
  isLoading,
  loadingMessage = "Loading content, please wait",
  completedMessage = "Content loaded successfully",
  errorMessage = "Error loading content",
  error = false,
  className,
}: LoadingAnnouncerProps) {
  const [previousLoading, setPreviousLoading] = useState(isLoading);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    // Only announce when loading state changes
    if (previousLoading !== isLoading) {
      if (isLoading) {
        setAnnouncement(loadingMessage);
      } else if (error) {
        setAnnouncement(errorMessage);
      } else {
        setAnnouncement(completedMessage);
      }

      setPreviousLoading(isLoading);

      // Clear announcement after 3 seconds
      const timeout = setTimeout(() => {
        setAnnouncement("");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isLoading, error, previousLoading, loadingMessage, completedMessage, errorMessage]);

  return (
    <div aria-live="polite" aria-atomic="true" className={cn("sr-only", className)}>
      {announcement}
    </div>
  );
}

export interface ProgressAnnouncerProps {
  value: number;
  max?: number;
  step?: number;
  announceEvery?: number;
  label?: string;
  className?: string;
}

export function ProgressAnnouncer({
  value,
  max = 100,
  step: _step = 1,
  announceEvery = 10,
  label = "Progress",
  className,
}: ProgressAnnouncerProps) {
  const [lastAnnounced, setLastAnnounced] = useState(-1);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const percentage = Math.round((value / max) * 100);

    // Announce at specified intervals or when complete
    if ((percentage % announceEvery === 0 && percentage !== lastAnnounced) || percentage === 100) {
      const message =
        percentage === 100 ? `${label} completed` : `${label} ${percentage} percent complete`;

      setAnnouncement(message);
      setLastAnnounced(percentage);

      // Clear announcement after 2 seconds
      const timeout = setTimeout(() => {
        setAnnouncement("");
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [value, max, announceEvery, lastAnnounced, label]);

  return (
    <div aria-live="polite" aria-atomic="true" className={cn("sr-only", className)}>
      {announcement}
    </div>
  );
}

export interface FormAnnouncerProps {
  children: React.ReactNode;
  className?: string;
}

export function FormAnnouncer({ children, className }: FormAnnouncerProps) {
  const [validationMessage, setValidationMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const announceValidation = (message: string) => {
    setValidationMessage(message);
    setTimeout(() => setValidationMessage(""), 3000);
  };

  const announceSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const announceError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 5000);
  };

  return (
    <div className={className}>
      {/* Validation messages - polite */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {validationMessage}
      </div>

      {/* Success messages - polite */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {successMessage}
      </div>

      {/* Error messages - assertive */}
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {errorMessage}
      </div>

      {/* Render children with announce functions */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            // @ts-expect-error - Adding announce functions as props
            announceValidation,
            announceSuccess,
            announceError,
          });
        }
        return child;
      })}
    </div>
  );
}

export interface NotificationAnnouncerProps {
  notifications: Array<{
    id: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    announced?: boolean;
  }>;
  onNotificationAnnounced?: (id: string) => void;
  className?: string;
}

export function NotificationAnnouncer({
  notifications,
  onNotificationAnnounced,
  className,
}: NotificationAnnouncerProps) {
  const [currentAnnouncement, setCurrentAnnouncement] = useState("");
  const [priority, setPriority] = useState<"polite" | "assertive">("polite");

  useEffect(() => {
    // Find the first unannounced notification
    const unannounced = notifications.find((n) => !n.announced);

    if (unannounced) {
      const priority = unannounced.type === "error" ? "assertive" : "polite";
      const prefix = {
        info: "Information:",
        success: "Success:",
        warning: "Warning:",
        error: "Error:",
      }[unannounced.type];

      setCurrentAnnouncement(`${prefix} ${unannounced.message}`);
      setPriority(priority);

      // Mark as announced
      onNotificationAnnounced?.(unannounced.id);

      // Clear announcement after 3 seconds
      const timeout = setTimeout(() => {
        setCurrentAnnouncement("");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [notifications, onNotificationAnnounced]);

  return (
    <div aria-live={priority} aria-atomic="true" className={cn("sr-only", className)}>
      {currentAnnouncement}
    </div>
  );
}
