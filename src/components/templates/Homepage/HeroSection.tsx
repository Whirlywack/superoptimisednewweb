'use client';

import React from 'react';
import { ProjectAnnouncement } from './HeroSection/ProjectAnnouncement';
import { ProgressIndicator } from './HeroSection/ProgressIndicator';
import { DualInteractivePolls } from './HeroSection/DualInteractivePolls';
import { CallToActionButtons } from './HeroSection/CallToActionButtons';

export function HeroSection() {
  return (
    <section 
      className="py-24"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            {/* Project Announcement */}
            <ProjectAnnouncement />

            {/* Progress Indicator */}
            <ProgressIndicator />

            {/* Dual Interactive Polls */}
            <DualInteractivePolls />

            {/* Call-to-Action Buttons */}
            <CallToActionButtons />
          </div>
        </div>
      </div>
    </section>
  );
}