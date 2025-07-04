'use client';

import React from 'react';
import { LinkButton } from '@/components/ui/button';

export function CallToActionButtons() {
  return (
    <div className="mt-12 flex flex-wrap gap-8">
      {/* Primary Button */}
      <LinkButton 
        href="/journey"
        variant="primary"
        size="md"
      >
        Follow the Building Process
      </LinkButton>

      {/* Secondary Button */}
      <LinkButton 
        href="/questionnaire"
        variant="outline"
        size="md"
      >
        Take Full Questionnaire
      </LinkButton>
    </div>
  );
}