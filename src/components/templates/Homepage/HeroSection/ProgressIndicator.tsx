'use client';

import React from 'react';

export function ProgressIndicator() {
  const progressValue = 15;

  return (
    <div className="my-12 border-l-4 border-primary bg-primary/5 p-8">
      {/* Progress Label */}
      <div className="mb-2 text-sm font-semibold text-primary">
        Current Progress
      </div>

      {/* Visual Progress Bar - 6px height to match HTML */}
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-sm bg-light-gray">
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