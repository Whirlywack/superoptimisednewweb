'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  overlayClassName?: string;
  drawerClassName?: string;
  'aria-label'?: string;
}

export function MobileNav({
  children,
  className,
  triggerClassName,
  overlayClassName,
  drawerClassName,
  'aria-label': ariaLabel = 'Navigation menu',
  ...props
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const toggleNav = () => setIsOpen(!isOpen);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  const drawer = (
    <div
      className={cn(
        'fixed inset-0 z-50 lg:hidden',
        overlayClassName
      )}
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-off-white shadow-xl transition-transform duration-300 ease-in-out',
          'transform',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          drawerClassName
        )}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b border-light-gray">
            <h2 className="text-h4 font-medium text-off-black">Menu</h2>
            <button
              onClick={() => setIsOpen(false)}
              className={cn(
                'inline-flex h-11 w-11 items-center justify-center rounded-lg',
                'text-warm-gray hover:bg-light-gray hover:text-off-black',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                'transition-colors duration-200'
              )}
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4">
            <div onClick={() => setIsOpen(false)}>
              {children}
            </div>
          </nav>
        </div>
      </div>
      
      {isOpen && (
        <div className="fixed inset-0 bg-off-black/50 transition-opacity duration-300" />
      )}
    </div>
  );

  return (
    <>
      <button
        onClick={toggleNav}
        className={cn(
          'inline-flex h-11 w-11 items-center justify-center rounded-lg lg:hidden',
          'text-warm-gray hover:bg-light-gray hover:text-off-black',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          'transition-colors duration-200',
          triggerClassName
        )}
        aria-label={`${isOpen ? 'Close' : 'Open'} navigation menu`}
        aria-expanded={isOpen}
        {...props}
      >
        <Menu className="h-5 w-5" />
      </button>

      {mounted && createPortal(drawer, document.body)}
    </>
  );
}

export interface MobileNavItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  active?: boolean;
}

export function MobileNavItem({ 
  children, 
  active = false, 
  className, 
  ...props 
}: MobileNavItemProps) {
  return (
    <a
      className={cn(
        'block py-3 px-4 text-base font-medium rounded-lg transition-colors duration-200',
        'hover:bg-light-gray hover:text-off-black',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        active 
          ? 'bg-primary/10 text-primary' 
          : 'text-warm-gray',
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export interface MobileNavGroupProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function MobileNavGroup({ title, children, className }: MobileNavGroupProps) {
  return (
    <div className={cn('mb-6', className)}>
      <h3 className="px-4 py-2 text-small font-semibold text-off-black uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}