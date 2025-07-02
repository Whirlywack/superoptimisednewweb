'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function ProgressIndicator() {
  const progressValue = 15;

  return (
    <div className="bg-primary/5 border-l-4 border-primary p-8 my-12">
      {/* Progress Label */}
      <div className="text-sm text-primary font-semibold mb-2">
        Current Progress
      </div>

      {/* Visual Progress Bar - 6px height to match HTML */}
      <div className="w-full h-1.5 bg-light-gray rounded-sm overflow-hidden mb-4">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progressValue}%` }}
          aria-label={`Project progress: ${progressValue}% complete`}
        />
      </div>
      
      {/* Progress Metadata */}
      <div className="flex items-center justify-between text-sm text-warm-gray">
        <span className="font-mono">Initial Planning Complete</span>
        <span>15% Complete</span>
      </div>
    </div>
  );
}