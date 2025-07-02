'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface DevIndicatorProps {
  children: React.ReactNode;
  label?: string;
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink';
  showBorder?: boolean;
  showLabel?: boolean;
  showInfo?: boolean;
  className?: string;
}

const colorVariants = {
  red: 'border-red-500 bg-red-500/10',
  blue: 'border-blue-500 bg-blue-500/10',
  green: 'border-green-500 bg-green-500/10',
  yellow: 'border-yellow-500 bg-yellow-500/10',
  purple: 'border-purple-500 bg-purple-500/10',
  pink: 'border-pink-500 bg-pink-500/10',
};

const labelColors = {
  red: 'bg-red-500 text-white',
  blue: 'bg-blue-500 text-white',
  green: 'bg-green-500 text-white',
  yellow: 'bg-yellow-500 text-black',
  purple: 'bg-purple-500 text-white',
  pink: 'bg-pink-500 text-white',
};

export function DevIndicator({
  children,
  label,
  color = 'blue',
  showBorder = true,
  showLabel = true,
  showInfo = false,
  className,
}: DevIndicatorProps) {
  const [isDev, setIsDev] = useState(false);
  const [componentInfo, setComponentInfo] = useState<{
    width: number;
    height: number;
    position: DOMRect | null;
  }>({ width: 0, height: 0, position: null });
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);

  useEffect(() => {
    if (!isDev || !showInfo || !containerRef.current) return;

    const updateInfo = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setComponentInfo({
          width: rect.width,
          height: rect.height,
          position: rect,
        });
      }
    };

    updateInfo();
    window.addEventListener('resize', updateInfo);
    return () => window.removeEventListener('resize', updateInfo);
  }, [isDev, showInfo]);

  // Don't render anything in production
  if (!isDev) {
    return <>{children}</>;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative',
        showBorder && [
          'border-2 border-dashed',
          colorVariants[color],
        ],
        className
      )}
    >
      {/* Label */}
      {showLabel && label && (
        <div
          className={cn(
            'absolute -top-6 left-0 px-2 py-1 text-xs font-mono font-medium rounded z-50',
            labelColors[color]
          )}
        >
          {label}
        </div>
      )}

      {/* Component info */}
      {showInfo && (
        <div
          className={cn(
            'absolute -bottom-8 left-0 px-2 py-1 text-xs font-mono bg-gray-800 text-white rounded z-50',
            'flex gap-2'
          )}
        >
          <span>{Math.round(componentInfo.width)}w</span>
          <span>{Math.round(componentInfo.height)}h</span>
        </div>
      )}

      {children}
    </div>
  );
}

export interface DevGridProps {
  children: React.ReactNode;
  showGrid?: boolean;
  gridSize?: number;
  className?: string;
}

export function DevGrid({
  children,
  showGrid = true,
  gridSize = 8,
  className,
}: DevGridProps) {
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);

  if (!isDev || !showGrid) {
    return <>{children}</>;
  }

  const gridStyle = {
    backgroundImage: `
      linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
    `,
    backgroundSize: `${gridSize * 4}px ${gridSize * 4}px`,
  };

  return (
    <div
      className={cn('relative', className)}
      style={gridStyle}
    >
      {children}
    </div>
  );
}

export interface DevBreakpointIndicatorProps {
  className?: string;
}

export function DevBreakpointIndicator({ className }: DevBreakpointIndicatorProps) {
  const [isDev, setIsDev] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState('');

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);

  useEffect(() => {
    if (!isDev) return;

    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCurrentBreakpoint('xs');
      } else if (width < 768) {
        setCurrentBreakpoint('sm');
      } else if (width < 1024) {
        setCurrentBreakpoint('md');
      } else if (width < 1280) {
        setCurrentBreakpoint('lg');
      } else if (width < 1536) {
        setCurrentBreakpoint('xl');
      } else {
        setCurrentBreakpoint('2xl');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, [isDev]);

  if (!isDev) return null;

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 px-3 py-2 bg-gray-800 text-white text-sm font-mono rounded shadow-lg',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-gray-400">Breakpoint:</span>
        <span className="font-bold">{currentBreakpoint}</span>
        <span className="text-gray-400">({window.innerWidth}px)</span>
      </div>
    </div>
  );
}

export interface DevComponentBoundaryProps {
  children: React.ReactNode;
  name?: string;
  showNesting?: boolean;
  nestingLevel?: number;
  className?: string;
}

export function DevComponentBoundary({
  children,
  name,
  showNesting = false,
  nestingLevel = 0,
  className,
}: DevComponentBoundaryProps) {
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);

  if (!isDev) {
    return <>{children}</>;
  }

  const nestingColors = [
    'border-blue-500',
    'border-green-500',
    'border-yellow-500',
    'border-red-500',
    'border-purple-500',
    'border-pink-500',
  ];

  const borderColor = showNesting 
    ? nestingColors[nestingLevel % nestingColors.length]
    : 'border-blue-500';

  return (
    <div
      className={cn(
        'relative border border-dashed bg-current/5',
        borderColor,
        className
      )}
    >
      {name && (
        <div
          className={cn(
            'absolute -top-5 left-0 px-2 py-1 text-xs font-mono font-medium bg-gray-800 text-white rounded z-10'
          )}
        >
          {name}
          {showNesting && (
            <span className="ml-1 text-gray-400">({nestingLevel})</span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export interface DevSpacingIndicatorProps {
  children: React.ReactNode;
  showSpacing?: boolean;
  className?: string;
}

export function DevSpacingIndicator({
  children,
  showSpacing = true,
  className,
}: DevSpacingIndicatorProps) {
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);

  if (!isDev || !showSpacing) {
    return <>{children}</>;
  }

  return (
    <div className={cn('relative', className)}>
      {/* Add spacing visualization overlay */}
      <style jsx>{`
        div:hover * {
          outline: 1px solid rgba(255, 0, 0, 0.3) !important;
        }
        div:hover *::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 0, 0, 0.1);
          pointer-events: none;
          z-index: 1000;
        }
      `}</style>
      {children}
    </div>
  );
}