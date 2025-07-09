'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function PostNavigation() {
  return (
    <section 
      className="w-full border-t border-light-gray px-4 py-xl"
      style={{ background: 'rgba(100, 116, 139, 0.02)' }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-lg">
          {/* Primary Navigation */}
          <div className="flex flex-wrap justify-center gap-md">
            <Link
              href="/journey"
              className={cn(
                "min-w-[200px] rounded-sm border-none bg-primary px-xl py-md text-white",
                "cursor-pointer text-center font-semibold transition-all duration-200",
                "hover:-translate-y-px hover:bg-off-black"
              )}
              style={{ fontSize: '1.25rem' }}
            >
              Back to Journey
            </Link>
            <Link
              href="/"
              className={cn(
                "min-w-[200px] rounded-sm border-2 border-primary bg-transparent px-xl py-md text-primary",
                "cursor-pointer text-center font-semibold transition-all duration-200",
                "hover:bg-primary hover:text-white"
              )}
              style={{ fontSize: '1.25rem' }}
            >
              View Homepage
            </Link>
          </div>
          
          {/* Secondary Navigation */}
          <div className="flex items-center justify-between gap-md">
            <div 
              className="max-w-[300px] rounded-lg border-2 border-light-gray bg-white p-md"
              style={{ opacity: 0.5 }}
            >
              <div 
                className="mb-xs font-mono text-warm-gray"
                style={{ fontSize: '0.75rem' }}
              >
                ← Previous Post
              </div>
              <div 
                className="font-semibold text-off-black"
                style={{ fontSize: '0.875rem' }}
              >
                No previous posts yet
              </div>
            </div>
            
            <Link
              href="/journey/authentication-decision"
              className="max-w-[300px] rounded-lg border-2 border-light-gray bg-white p-md transition-all duration-200 hover:-translate-y-0.5 hover:border-primary"
            >
              <div 
                className="mb-xs font-mono text-warm-gray"
                style={{ fontSize: '0.75rem' }}
              >
                Next Post →
              </div>
              <div 
                className="font-semibold text-off-black"
                style={{ fontSize: '0.875rem' }}
              >
                Authentication Decision: Magic Links vs Traditional
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}