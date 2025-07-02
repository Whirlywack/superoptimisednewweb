'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function CallToActionButtons() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
      {/* Primary Button */}
      <Button
        size="lg"
        variant="primary"
        asChild
        className="w-full sm:w-auto min-h-[44px] px-6 py-3"
      >
        <Link 
          href="/journey"
          className="inline-flex items-center gap-2"
        >
          <span>Follow the Building Process</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>

      {/* Secondary Button */}
      <Button
        size="lg"
        variant="outline"
        asChild
        className="w-full sm:w-auto min-h-[44px] px-6 py-3"
      >
        <Link 
          href="/questionnaire"
          className="inline-flex items-center gap-2"
        >
          <FileText className="h-5 w-5" />
          <span>Take Full Questionnaire</span>
        </Link>
      </Button>
    </div>
  );
}