'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TouchTargetProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'link' | 'icon' | 'custom';
  interactive?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
  onMouseUp?: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
  onTouchStart?: React.TouchEventHandler<HTMLButtonElement | HTMLDivElement>;
  onTouchEnd?: React.TouchEventHandler<HTMLButtonElement | HTMLDivElement>;
  style?: React.CSSProperties;
  id?: string;
  tabIndex?: number;
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'data-testid'?: string;
}

const sizeVariants = {
  sm: 'min-h-[44px] min-w-[44px]', // WCAG minimum
  md: 'min-h-[48px] min-w-[48px]', // Comfortable default
  lg: 'min-h-[56px] min-w-[56px]', // Large touch areas
};

const variantStyles = {
  button: 'flex items-center justify-center rounded-lg bg-primary text-off-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200',
  link: 'flex items-center justify-center text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg transition-colors duration-200',
  icon: 'flex items-center justify-center text-warm-gray hover:text-off-black hover:bg-light-gray focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg transition-colors duration-200',
  custom: '',
};

export function TouchTarget({
  children,
  size = 'md',
  variant = 'custom',
  interactive = true,
  className,
  ...props
}: TouchTargetProps) {
  const Component = interactive ? 'button' : 'div';
  
  return (
    <Component
      className={cn(
        'touch-manipulation', // Optimizes touch events
        sizeVariants[size],
        interactive && variantStyles[variant],
        interactive && 'cursor-pointer select-none',
        className
      )}
      {...(interactive && { tabIndex: 0 })}
      {...props}
    >
      {children}
    </Component>
  );
}

export interface TouchTargetWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingVariants = {
  none: '',
  sm: 'p-1',
  md: 'p-2',
  lg: 'p-3',
};

export function TouchTargetWrapper({
  children,
  className,
  padding = 'md',
  ...props
}: TouchTargetWrapperProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center',
        paddingVariants[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TouchListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  direction?: 'vertical' | 'horizontal';
}

const spacingVariants = {
  none: '',
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-4',
};

export function TouchList({
  children,
  className,
  spacing = 'md',
  direction = 'vertical',
  ...props
}: TouchListProps) {
  return (
    <div
      className={cn(
        'flex',
        direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        spacingVariants[spacing],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TouchAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
  interactive?: boolean;
}

export function TouchArea({
  children,
  className,
  minHeight = '44px',
  interactive = false,
  ...props
}: TouchAreaProps) {
  return (
    <div
      className={cn(
        'flex w-full items-start',
        interactive && 'cursor-pointer transition-colors duration-200 hover:bg-light-gray',
        className
      )}
      style={{ minHeight }}
      {...props}
    >
      {children}
    </div>
  );
}