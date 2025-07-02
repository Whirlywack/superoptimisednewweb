'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function HomepageNavigation() {
  return (
    <nav 
      className="w-full border-b border-light-gray bg-off-white py-8 px-4"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto flex max-w-6xl items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link 
            href="/"
            className={cn(
              "text-xl font-extrabold text-off-black",
              "transition-colors duration-200 hover:text-primary",
              "rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            Superoptimised
          </Link>
        </div>

        {/* All Navigation Links - Right Side */}
        <div className="hidden items-center space-x-8 md:flex">
          <Link 
            href="/journey"
            className={cn(
              "text-body font-medium text-warm-gray",
              "transition-colors duration-200 hover:text-primary",
              "rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            Journey
          </Link>
          <Link 
            href="/about"
            className={cn(
              "text-body font-medium text-warm-gray",
              "transition-colors duration-200 hover:text-primary",
              "rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
              "rounded-sm border border-light-gray",
              "hover:border-primary hover:text-primary",
              "transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            Follow on X
          </a>
        </div>
      </div>

      {/* Mobile Navigation Links */}
      <div className="mt-4 border-t border-light-gray pt-4 md:hidden">
        <div className="flex items-center justify-center space-x-8">
          <Link 
            href="/journey"
            className={cn(
              "text-body font-medium text-off-black",
              "transition-colors duration-200 hover:text-primary",
              "rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            Journey
          </Link>
          <Link 
            href="/about"
            className={cn(
              "text-body font-medium text-off-black",
              "transition-colors duration-200 hover:text-primary",
              "rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}