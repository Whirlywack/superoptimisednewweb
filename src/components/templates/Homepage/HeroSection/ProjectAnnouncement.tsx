'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function ProjectAnnouncement() {
  return (
    <div className="text-center space-y-6">
      {/* Small Label */}
      <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
        <span className="text-small font-medium text-primary tracking-wide uppercase">
          Building Decision Made
        </span>
      </div>

      {/* Main Headline */}
      <h1 
        id="hero-heading"
        className={cn(
          "text-h1 md:text-4xl lg:text-5xl font-bold text-off-black",
          "leading-tight tracking-tight max-w-3xl mx-auto"
        )}
      >
        <span className="block">Magic Link</span>
        <span className="block">Questionnaire</span>
        <span className="block text-primary">System</span>
      </h1>

      {/* Description Paragraph */}
      <div className="max-w-2xl mx-auto">
        <p className="text-body md:text-lg text-warm-gray leading-relaxed">
          I've decided to build an anonymous community feedback system for developers. 
          Traditional sign-ups kill honest feedback—magic links solve this.{' '}
          <strong className="font-semibold text-off-black">
            Your input helps refine every technical decision along the way.
          </strong>
        </p>
      </div>
    </div>
  );
}