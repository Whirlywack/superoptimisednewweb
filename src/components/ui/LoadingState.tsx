"use client";

import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullHeight?: boolean;
  className?: string;
}

/**
 * Standardized loading state component following Elevated Brutalism design
 * Provides consistent loading indicators across the admin dashboard
 */
export function LoadingState({
  message = "Loading...",
  size = "md",
  fullHeight = false,
  className = "",
}: LoadingStateProps) {
  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  const textSizes = {
    sm: "var(--text-sm)",
    md: "var(--text-base)",
    lg: "var(--text-lg)",
  };

  const spacing = {
    sm: "var(--space-sm)",
    md: "var(--space-md)",
    lg: "var(--space-lg)",
  };

  return (
    <div
      className={`flex items-center justify-center ${fullHeight ? "min-h-screen" : ""} ${className}`}
      style={{
        backgroundColor: "var(--off-white)",
        padding: spacing[size],
      }}
    >
      <div className="flex flex-col items-center text-center">
        <Loader2
          size={iconSizes[size]}
          className="animate-spin"
          style={{ color: "var(--primary)", marginBottom: "var(--space-sm)" }}
        />
        <p
          className="font-medium"
          style={{
            fontSize: textSizes[size],
            color: "var(--warm-gray)",
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}

/**
 * Skeleton loading component for specific content areas
 */
export function SkeletonLoader({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="mb-3 h-4 rounded"
          style={{
            backgroundColor: "var(--light-gray)",
            width: index === lines - 1 ? "75%" : "100%",
          }}
        />
      ))}
    </div>
  );
}

/**
 * Card skeleton for dashboard cards
 */
export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse border-2 p-6 ${className}`}
      style={{
        borderColor: "var(--light-gray)",
        backgroundColor: "var(--off-white)",
      }}
    >
      <div
        className="mb-4 h-8 w-1/3 rounded"
        style={{ backgroundColor: "var(--light-gray)" }}
      />
      <div
        className="mb-2 h-4 w-full rounded"
        style={{ backgroundColor: "var(--light-gray)" }}
      />
      <div
        className="h-4 w-3/4 rounded"
        style={{ backgroundColor: "var(--light-gray)" }}
      />
    </div>
  );
}

/**
 * Table skeleton for data tables
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  className = "",
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse border-2 ${className}`}
      style={{
        borderColor: "var(--light-gray)",
        backgroundColor: "var(--off-white)",
      }}
    >
      {/* Header */}
      <div
        className="border-b-2 p-4"
        style={{ borderColor: "var(--light-gray)" }}
      >
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div
              key={index}
              className="h-4 flex-1 rounded"
              style={{ backgroundColor: "var(--light-gray)" }}
            />
          ))}
        </div>
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="border-b border-light-gray p-4"
        >
          <div className="flex gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 flex-1 rounded"
                style={{ backgroundColor: "var(--light-gray)" }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}