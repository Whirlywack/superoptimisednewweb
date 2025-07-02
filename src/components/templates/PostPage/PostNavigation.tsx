'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function PostNavigation() {
  return (
    <section 
      className="w-full py-xl px-4 border-t border-light-gray"
      style={{ background: 'rgba(100, 116, 139, 0.02)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-lg">
          {/* Primary Navigation */}
          <div className="flex justify-center gap-md flex-wrap">
            <Link
              href="/journey"
              className={cn(
                "min-w-[200px] py-md px-xl bg-primary text-white border-none rounded-sm",
                "font-semibold cursor-pointer transition-all duration-200 text-center",
                "hover:bg-off-black hover:-translate-y-px"
              )}
              style={{ fontSize: '1.25rem' }}
            >
              Back to Journey
            </Link>
            <Link
              href="/"
              className={cn(
                "min-w-[200px] py-md px-xl bg-transparent text-primary border-2 border-primary rounded-sm",
                "font-semibold cursor-pointer transition-all duration-200 text-center",
                "hover:bg-primary hover:text-white"
              )}
              style={{ fontSize: '1.25rem' }}
            >
              View Homepage
            </Link>
          </div>
          
          {/* Secondary Navigation */}
          <div className="flex justify-between items-center gap-md">
            <div 
              className="bg-white border-2 border-light-gray rounded-lg p-md max-w-[300px]"
              style={{ opacity: 0.5 }}
            >
              <div 
                className="text-warm-gray font-mono mb-xs"
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
              className="bg-white border-2 border-light-gray rounded-lg p-md transition-all duration-200 hover:border-primary hover:-translate-y-0.5 max-w-[300px]"
            >
              <div 
                className="text-warm-gray font-mono mb-xs"
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