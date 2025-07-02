'use client';

import React from 'react';
import Link from 'next/link';
import { Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BuildingPhilosophy() {
  return (
    <section 
      className="w-full bg-primary/2 px-4 py-xl"
      aria-labelledby="philosophy-heading"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-9">
          {/* Section Headline - Left aligned, larger typography */}
          <h2 
            id="philosophy-heading"
            className="text-hero font-bold text-off-black mb-lg"
          >
            Why Build in Public?
          </h2>
          {/* Paragraph 1 */}
          <p className="text-base text-warm-gray leading-relaxed mb-md max-w-reading">
            Traditional development happens behind closed doors. Decisions are made in isolation, 
            problems are hidden until launch, and communities only see the polished final product.
          </p>

          {/* Paragraph 2 */}
          <p className="text-base text-warm-gray leading-relaxed mb-lg max-w-reading">
            I'm building differently. Every decision gets documented, every challenge shared, 
            and the community helps shape the direction. This transparency leads to better products, 
            stronger relationships, and genuine learning.
          </p>

          {/* Highlighted Quote */}
          <div className={cn(
            "bg-primary/10 border-l-4 border-primary p-md my-lg",
            "italic"
          )}>
            <Quote className="absolute top-4 left-4 h-8 w-8 text-primary/30" aria-hidden="true" />
            <blockquote className="text-base font-medium text-off-black leading-relaxed italic">
              "The best feedback comes from real problems, not survey responses. 
              Building transparently creates trust—and trust creates honest input."
            </blockquote>
          </div>

          {/* Paragraph 3 */}
          <p className="text-base text-warm-gray leading-relaxed max-w-reading">
            Most conversations happen on{' '}
            <Link 
              href="https://x.com/superoptimised"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-primary font-medium underline",
                "hover:underline transition-colors duration-200"
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