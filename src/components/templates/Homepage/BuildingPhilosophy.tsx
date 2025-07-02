'use client';

import React from 'react';
import Link from 'next/link';
import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BuildingPhilosophy() {
  return (
    <section 
      className="w-full bg-white px-4 py-16 md:py-20"
      aria-labelledby="philosophy-heading"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Headline */}
        <h2 
          id="philosophy-heading"
          className="text-h1 md:text-3xl font-bold text-off-black text-center mb-12"
        >
          Why Build in Public?
        </h2>

        <div className="space-y-8 max-w-3xl mx-auto">
          {/* Paragraph 1 */}
          <p className="text-body md:text-lg text-warm-gray leading-relaxed">
            Traditional development happens behind closed doors. Decisions are made in isolation, 
            problems are hidden until launch, and communities only see the polished final product.
          </p>

          {/* Paragraph 2 */}
          <p className="text-body md:text-lg text-warm-gray leading-relaxed">
            I'm building differently. Every decision gets documented, every challenge shared, 
            and the community helps shape the direction. This transparency leads to better products, 
            stronger relationships, and genuine learning.
          </p>

          {/* Highlighted Quote */}
          <div className={cn(
            "relative bg-primary/5 border-l-4 border-primary rounded-r-lg p-6 md:p-8 my-8",
            "before:absolute before:top-4 before:left-4 before:text-primary/20 before:text-6xl before:leading-none"
          )}>
            <Quote className="absolute top-4 left-4 h-8 w-8 text-primary/30" aria-hidden="true" />
            <blockquote className="ml-12 text-body md:text-lg font-medium text-off-black leading-relaxed italic">
              "The best feedback comes from real problems, not survey responses. 
              Building transparently creates trust—and trust creates honest input."
            </blockquote>
          </div>

          {/* Paragraph 3 */}
          <p className="text-body md:text-lg text-warm-gray leading-relaxed">
            Most conversations happen on{' '}
            <Link 
              href="https://x.com/superoptimised"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "font-semibold text-primary underline underline-offset-2",
                "hover:text-primary/80 transition-colors duration-200"
              )}
            >
              X (@superoptimised)
            </Link>{' '}
            where you can see live decision-making, vote in polls, and influence the building process. 
            This website documents the complete journey for deeper context.
          </p>
        </div>
      </div>
    </section>
  );
}