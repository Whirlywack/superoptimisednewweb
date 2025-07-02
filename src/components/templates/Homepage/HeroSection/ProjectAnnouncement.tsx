'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function ProjectAnnouncement() {
  return (
    <>
      {/* Hero Label - Exact HTML match */}
      <div className="text-sm font-mono text-primary font-semibold tracking-wider uppercase mb-4">
        Building Decision Made
      </div>

      {/* Main Headline - Exact HTML match */}
      <h1 
        id="hero-heading"
        className="text-mega font-extrabold text-off-black leading-none tracking-tighter uppercase mb-8"
      >
        Magic Link<br/>
        Questionnaire<br/>
        System
      </h1>

      {/* Description Paragraph - Exact HTML match */}
      <p className="text-lg text-warm-gray leading-relaxed max-w-[65ch] mb-12">
        I&apos;ve decided to build an anonymous community feedback system for developers. 
        Traditional sign-ups kill honest feedback—magic links solve this.{' '}
        <strong className="font-bold text-warm-gray">
          Your input helps refine every technical decision along the way.
        </strong>
      </p>
    </>
  );
}