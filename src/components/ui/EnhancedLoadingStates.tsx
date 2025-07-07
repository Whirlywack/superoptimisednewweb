"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export function Skeleton({ className, animate = true }: SkeletonProps) {
  return <div className={cn("bg-light-gray", animate && "animate-pulse", className)} />;
}

interface PulsingDotProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "gray" | "green";
  delay?: number;
}

export function PulsingDot({ size = "md", color = "primary", delay = 0 }: PulsingDotProps) {
  const sizeClasses = {
    sm: "size-2",
    md: "size-3",
    lg: "size-4",
  };

  const colorClasses = {
    primary: "bg-primary",
    gray: "bg-warm-gray",
    green: "bg-green-500",
  };

  return (
    <div
      className={cn("animate-pulse rounded-full", sizeClasses[size], colorClasses[color])}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: "1.5s",
      }}
    />
  );
}

interface LoadingDotsProps {
  count?: number;
  spacing?: "sm" | "md" | "lg";
  color?: "primary" | "gray" | "green";
}

export function LoadingDots({ count = 3, spacing = "md", color = "primary" }: LoadingDotsProps) {
  const spacingClasses = {
    sm: "gap-1",
    md: "gap-2",
    lg: "gap-3",
  };

  return (
    <div className={cn("flex items-center", spacingClasses[spacing])}>
      {Array.from({ length: count }).map((_, i) => (
        <PulsingDot key={i} color={color} delay={i * 200} />
      ))}
    </div>
  );
}

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ProgressRing({
  progress,
  size = 40,
  strokeWidth = 3,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-light-gray"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary transition-all duration-300 ease-out"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

interface VoteButtonLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function VoteButtonLoading({
  isLoading,
  children,
  className,
  onClick,
  disabled,
}: VoteButtonLoadingProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        "relative transition-all duration-200",
        isLoading && "cursor-not-allowed",
        className
      )}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <LoadingDots count={3} spacing="sm" color="primary" />
        </div>
      )}

      {/* Button content */}
      <div className={cn("transition-opacity duration-200", isLoading && "opacity-30")}>
        {children}
      </div>
    </button>
  );
}

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
}

export function AnimatedCounter({
  value,
  duration = 1000,
  className,
  suffix = "",
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = React.useState(0);
  const frameRef = React.useRef<number>();
  const startTimeRef = React.useRef<number>();

  React.useEffect(() => {
    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * value);

      setDisplayValue(currentValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    startTimeRef.current = undefined;
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span className={className}>
      {displayValue}
      {suffix}
    </span>
  );
}

interface SlideInProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  className?: string;
}

export function SlideIn({ children, direction = "up", delay = 0, className }: SlideInProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const directionClasses = {
    up: "translate-y-4",
    down: "-translate-y-4",
    left: "translate-x-4",
    right: "-translate-x-4",
  };

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out",
        !isVisible && `opacity-0 ${directionClasses[direction]}`,
        isVisible && "translate-x-0 translate-y-0 opacity-100",
        className
      )}
    >
      {children}
    </div>
  );
}
