'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href: string;
  className?: string;
}

export function SkipLink({ 
  children, 
  href, 
  className, 
  ...props 
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        // Hidden by default, visible when focused
        'sr-only focus:not-sr-only',
        // Positioning and styling when visible
        'focus:absolute focus:top-4 focus:left-4 focus:z-50',
        'focus:px-4 focus:py-2 focus:bg-primary focus:text-off-white',
        'focus:rounded-lg focus:shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-off-white focus:ring-offset-2 focus:ring-offset-primary',
        // Typography
        'font-medium text-base',
        // Transitions
        'transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export interface SkipNavProps {
  links?: Array<{
    href: string;
    label: string;
  }>;
  className?: string;
}

export function SkipNav({ 
  links = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#navigation', label: 'Skip to navigation' },
    { href: '#footer', label: 'Skip to footer' },
  ],
  className 
}: SkipNavProps) {
  return (
    <nav 
      className={cn('sr-only focus-within:not-sr-only', className)}
      aria-label="Skip navigation"
    >
      <ul className="flex gap-2 p-4">
        {links.map(({ href, label }) => (
          <li key={href}>
            <SkipLink href={href}>
              {label}
            </SkipLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export interface SkipToContentProps {
  targetId?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SkipToContent({ 
  targetId = 'main-content',
  children = 'Skip to main content',
  className 
}: SkipToContentProps) {
  return (
    <SkipLink 
      href={`#${targetId}`} 
      className={className}
    >
      {children}
    </SkipLink>
  );
}

export interface FocusTargetProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  id: string;
  label?: string;
  className?: string;
}

export function FocusTarget({ 
  children, 
  id, 
  label,
  className, 
  ...props 
}: FocusTargetProps) {
  return (
    <div
      id={id}
      tabIndex={-1}
      className={cn(
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg',
        className
      )}
      aria-label={label}
      {...props}
    >
      {children}
    </div>
  );
}