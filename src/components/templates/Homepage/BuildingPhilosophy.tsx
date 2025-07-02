'use client';

import React from 'react';
import Link from 'next/link';
import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BuildingPhilosophy() {
  return (
    <section 
      className="w-full bg-primary/[0.02] px-4 py-24"
      aria-labelledby="philosophy-heading"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-9">
          {/* Section Headline - Left aligned, larger typography */}
          <h2 
            id="philosophy-heading"
            className="mb-lg text-hero font-bold text-off-black"
          >
            Why Build in Public?
          </h2>
          {/* Paragraph 1 */}
          <p className="mb-md max-w-reading text-base leading-relaxed text-warm-gray">
            Traditional development happens behind closed doors. Decisions are made in isolation, 
            problems are hidden until launch, and communities only see the polished final product.
          </p>

          {/* Paragraph 2 */}
          <p className="mb-lg max-w-reading text-base leading-relaxed text-warm-gray">
            I&apos;m building differently. Every decision gets documented, every challenge shared, 
            and the community helps shape the direction. This transparency leads to better products, 
            stronger relationships, and genuine learning.
          </p>

          {/* Highlighted Quote */}
          <div className={cn(
            "my-lg border-l-4 border-primary bg-primary/10 p-md",
            "italic"
          )}>
            <Quote className="absolute left-4 top-4 size-8 text-primary/30" aria-hidden="true" />
            <blockquote className="text-base font-medium italic leading-relaxed text-off-black">
              &quot;The best feedback comes from real problems, not survey responses. 
              Building transparently creates trust—and trust creates honest input.&quot;
            </blockquote>
          </div>

          {/* Paragraph 3 */}
          <p className="max-w-reading text-base leading-relaxed text-warm-gray">
            Most conversations happen on{' '}
            <Link 
              href="https://x.com/superoptimised"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "font-medium text-primary underline",
                "transition-colors duration-200 hover:underline"
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