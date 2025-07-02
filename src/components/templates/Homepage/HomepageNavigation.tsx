'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function HomepageNavigation() {
  return (
    <nav 
      className="w-full bg-off-white border-b border-light-gray px-4 py-4"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link 
            href="/"
            className={cn(
              "text-xl font-extrabold text-off-black",
              "hover:text-primary transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
            )}
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800 }}
          >
            Superoptimised
          </Link>
        </div>

        {/* All Navigation Links - Right Side */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="/journey"
            className={cn(
              "text-body font-medium text-warm-gray",
              "hover:text-primary transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-3 py-2"
            )}
          >
            Journey
          </Link>
          <Link 
            href="/about"
            className={cn(
              "text-body font-medium text-warm-gray",
              "hover:text-primary transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-3 py-2"
            )}
          >
            About
          </Link>
          <a
            href="https://x.com/superoptimised"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Superoptimised on X (Twitter)"
            className={cn(
              "px-3 py-2 text-sm font-medium text-warm-gray",
              "border border-light-gray rounded-sm",
              "hover:text-primary hover:border-primary",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            Follow on X
          </a>
        </div>
      </div>

      {/* Mobile Navigation Links */}
      <div className="md:hidden mt-4 pt-4 border-t border-light-gray">
        <div className="flex items-center justify-center space-x-8">
          <Link 
            href="/journey"
            className={cn(
              "text-body font-medium text-off-black",
              "hover:text-primary transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-3 py-2"
            )}
          >
            Journey
          </Link>
          <Link 
            href="/about"
            className={cn(
              "text-body font-medium text-off-black",
              "hover:text-primary transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-3 py-2"
            )}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}