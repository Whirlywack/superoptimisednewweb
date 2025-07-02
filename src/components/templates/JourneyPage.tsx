'use client';

import React from 'react';
import { HomepageNavigation } from './Homepage/HomepageNavigation';
import { HomepageFooter } from './Homepage/HomepageFooter';
import { JourneyHero } from './JourneyPage/JourneyHero';
import { JourneyTimeline } from './JourneyPage/JourneyTimeline';
import { MidNewsletterCTA } from './JourneyPage/MidNewsletterCTA';
import { XPToastProvider } from './Homepage/XPToastProvider';

export function JourneyPage() {
  return (
    <XPToastProvider>
      <div className="min-h-screen flex flex-col bg-off-white">
        {/* Navigation */}
        <HomepageNavigation />

        {/* Main Content */}
        <main className="flex-1">
          {/* Hero Section with Above-the-Fold CTA */}
          <JourneyHero />

          {/* Vertical Timeline */}
          <JourneyTimeline />

          {/* Mid-Content Newsletter CTA */}
          <MidNewsletterCTA />
        </main>

        {/* Footer */}
        <HomepageFooter />
      </div>
    </XPToastProvider>
  );
}