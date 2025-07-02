'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: {
    mobile?: 1 | 2;
    tablet?: 1 | 2 | 3 | 4;
    desktop?: 1 | 2 | 3 | 4 | 5 | 6;
  };
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const gapVariants = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const colVariants = {
  mobile: {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
  },
  tablet: {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  },
  desktop: {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
  },
};

export function ResponsiveGrid({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className,
  ...props
}: ResponsiveGridProps) {
  const mobileClass = cols.mobile ? colVariants.mobile[cols.mobile] : 'grid-cols-1';
  const tabletClass = cols.tablet ? colVariants.tablet[cols.tablet] : '';
  const desktopClass = cols.desktop ? colVariants.desktop[cols.desktop] : '';
  
  return (
    <div
      className={cn(
        'grid w-full',
        mobileClass,
        tabletClass,
        desktopClass,
        gapVariants[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ResponsiveStackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  direction?: 'column' | 'row-mobile' | 'row-tablet' | 'row-desktop';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  className?: string;
}

const alignVariants = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyVariants = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const directionVariants = {
  column: 'flex-col',
  'row-mobile': 'flex-row',
  'row-tablet': 'flex-col md:flex-row',
  'row-desktop': 'flex-col lg:flex-row',
};

export function ResponsiveStack({
  children,
  direction = 'column',
  gap = 'md',
  align = 'start',
  justify = 'start',
  className,
  ...props
}: ResponsiveStackProps) {
  return (
    <div
      className={cn(
        'flex w-full',
        directionVariants[direction],
        gapVariants[gap],
        alignVariants[align],
        justifyVariants[justify],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ResponsiveCardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  minItemWidth?: string;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function ResponsiveCardGrid({
  children,
  minItemWidth = '280px',
  gap = 'md',
  className,
  ...props
}: ResponsiveCardGridProps) {
  return (
    <div
      className={cn(
        'grid w-full',
        gapVariants[gap],
        className
      )}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export interface MasonryGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: {
    mobile?: 1 | 2;
    tablet?: 1 | 2 | 3;
    desktop?: 1 | 2 | 3 | 4;
  };
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function MasonryGrid({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  className,
  ...props
}: MasonryGridProps) {
  const gapValue = {
    none: '0',
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  }[gap];

  return (
    <div
      className={cn('w-full', className)}
      style={{
        columnCount: cols.mobile,
        columnGap: gapValue,
        // @ts-ignore
        '--md-cols': cols.tablet,
        '--lg-cols': cols.desktop,
      }}
      {...props}
    >
      <style jsx>{`
        @media (min-width: 768px) {
          div {
            column-count: var(--md-cols);
          }
        }
        @media (min-width: 1024px) {
          div {
            column-count: var(--lg-cols);
          }
        }
      `}</style>
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className="break-inside-avoid"
          style={{ marginBottom: gapValue }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

export interface ResponsiveLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'grid' | 'stack' | 'cards' | 'masonry';
  breakpoint?: 'mobile' | 'tablet' | 'desktop';
  className?: string;
}

export function ResponsiveLayout({
  children,
  variant = 'grid',
  breakpoint = 'tablet',
  className,
  ...props
}: ResponsiveLayoutProps) {
  if (variant === 'grid') {
    const cols = breakpoint === 'mobile' 
      ? { mobile: 1, tablet: 1, desktop: 2 }
      : breakpoint === 'tablet'
      ? { mobile: 1, tablet: 2, desktop: 3 }
      : { mobile: 1, tablet: 3, desktop: 4 };
    
    return (
      <ResponsiveGrid cols={cols} className={className} {...props}>
        {children}
      </ResponsiveGrid>
    );
  }

  if (variant === 'stack') {
    const direction = breakpoint === 'mobile' 
      ? 'column'
      : breakpoint === 'tablet'
      ? 'row-tablet'
      : 'row-desktop';
    
    return (
      <ResponsiveStack direction={direction} className={className} {...props}>
        {children}
      </ResponsiveStack>
    );
  }

  if (variant === 'cards') {
    return (
      <ResponsiveCardGrid className={className} {...props}>
        {children}
      </ResponsiveCardGrid>
    );
  }

  if (variant === 'masonry') {
    const cols = breakpoint === 'mobile' 
      ? { mobile: 1, tablet: 1, desktop: 2 }
      : breakpoint === 'tablet'
      ? { mobile: 1, tablet: 2, desktop: 3 }
      : { mobile: 2, tablet: 3, desktop: 4 };
    
    return (
      <MasonryGrid cols={cols} className={className} {...props}>
        {children}
      </MasonryGrid>
    );
  }

  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}