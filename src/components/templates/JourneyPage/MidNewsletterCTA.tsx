'use client';

import React, { useState, useContext } from 'react';
import { cn } from '@/lib/utils';
import { XPToastContext } from '../Homepage/XPToastProvider';

export function MidNewsletterCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showXPToast } = useContext(XPToastContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual newsletter signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmail('');
      showXPToast('+25 XP • Newsletter signup!');
    } catch (error) {
      console.error('Newsletter signup failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="my-2xl w-full px-4">
      <div className="mx-auto max-w-4xl">
        <div 
          className="rounded-lg border-2 border-primary p-lg text-center"
          style={{ 
            background: 'rgba(100, 116, 139, 0.05)',
            margin: '6rem 0'
          }}
        >
          <h3 className="mb-md text-xl font-semibold text-off-black">
            Don't Miss the Next Decision
          </h3>
          <p className="mx-auto mb-lg max-w-[50ch] text-base leading-relaxed text-warm-gray">
            Major technical choices happen weekly. Get the full context and influence the direction 
            before decisions are finalized.
          </p>
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-sm">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={isSubmitting}
              className={cn(
                "w-full rounded-sm border-2 border-light-gray px-md py-sm",
                "bg-white text-base",
                "focus:border-primary focus:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            />
            <button
              type="submit"
              disabled={isSubmitting || !email}
              className={cn(
                "w-full rounded-sm border-none bg-primary py-sm text-base text-white",
                "cursor-pointer font-semibold transition-all duration-200",
                "hover:-translate-y-px hover:bg-off-black",
                "disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              Get Weekly Updates
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}