'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ProgressBar } from '@/components/ui/ProgressBar';

export function ProgressIndicator() {
  const progressValue = 15;
  const progressLabel = "Initial Planning Complete";

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Progress Label */}
      <div className="text-center">
        <h2 className="text-h4 font-semibold text-off-black mb-2">
          Current Progress
        </h2>
      </div>

      {/* Visual Progress Bar */}
      <div className="space-y-3">
        <ProgressBar
          value={progressValue}
          max={100}
          size="lg"
          variant="default"
          className="w-full"
          aria-label={`Project progress: ${progressValue}% complete`}
        />
        
        {/* Progress Text */}
        <div className="flex items-center justify-between text-small">
          <span className="font-medium text-off-black">
            {progressLabel}
          </span>
          <span className="text-primary font-semibold">
            {progressValue}% Complete
          </span>
        </div>
      </div>
    </div>
  );
}