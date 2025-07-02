'use client';

import React from 'react';

export function ProjectAnnouncement() {
  return (
    <>
      {/* Hero Label - Exact HTML match */}
      <div className="mb-4 font-mono text-sm font-semibold uppercase tracking-wider text-primary">
        Building Decision Made
      </div>

      {/* Main Headline - Exact HTML match */}
      <h1 
        id="hero-heading"
        className="mb-8 text-mega font-extrabold uppercase text-off-black"
      >
        Magic Link<br/>
        Questionnaire<br/>
        System
      </h1>

      {/* Description Paragraph - Exact HTML match */}
      <p className="mb-12 max-w-prose text-lg leading-relaxed text-warm-gray">
        I&apos;ve decided to build an anonymous community feedback system for developers. 
        Traditional sign-ups kill honest feedback—magic links solve this.{' '}
        <strong className="font-bold text-warm-gray">
          Your input helps refine every technical decision along the way.
        </strong>
      </p>
    </>
  );
}