'use client';

import React from 'react';
import Link from 'next/link';
import { Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
              "text-h2 font-bold text-off-black",
              "hover:text-primary transition-colors duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
            )}
          >
            Superoptimised
          </Link>
        </div>

        {/* Center Navigation Links - Desktop */}
        <div className="hidden md:flex items-center space-x-8">
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

        {/* Social CTA */}
        <div className="flex items-center">
          <Button
            variant="outline"
            size="md"
            asChild
            className="inline-flex items-center gap-2"
          >
            <a
              href="https://x.com/superoptimised"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Superoptimised on X (Twitter)"
            >
              <Twitter className="h-4 w-4" />
              <span className="hidden sm:inline">Follow on X</span>
              <span className="sm:hidden">Follow</span>
            </a>
          </Button>
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