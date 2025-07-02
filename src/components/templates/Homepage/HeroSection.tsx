'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ProjectAnnouncement } from './HeroSection/ProjectAnnouncement';
import { ProgressIndicator } from './HeroSection/ProgressIndicator';
import { DualInteractivePolls } from './HeroSection/DualInteractivePolls';
import { CallToActionButtons } from './HeroSection/CallToActionButtons';

export function HeroSection() {
  return (
    <section 
      className={cn(
        "w-full bg-gradient-to-b from-off-white to-light-gray/30",
        "px-4 py-12 md:py-16 lg:py-20"
      )}
      aria-labelledby="hero-heading"
    >
      <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
        {/* Block 2A: Project Announcement */}
        <ProjectAnnouncement />

        {/* Block 2B: Progress Indicator */}
        <ProgressIndicator />

        {/* Block 2C: Dual Interactive Polls */}
        <DualInteractivePolls />

        {/* Block 2D: Call-to-Action Buttons */}
        <CallToActionButtons />
      </div>
    </section>
  );
}