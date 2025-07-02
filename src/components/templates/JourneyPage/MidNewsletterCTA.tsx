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
    <section className="w-full px-4 my-2xl">
      <div className="max-w-4xl mx-auto">
        <div 
          className="border-2 border-primary rounded-lg p-lg text-center"
          style={{ 
            background: 'rgba(100, 116, 139, 0.05)',
            margin: '6rem 0'
          }}
        >
          <h3 
            className="font-bold text-off-black mb-md"
            style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', 
              fontWeight: 600, 
              lineHeight: 1.2 
            }}
          >
            Don't Miss the Next Decision
          </h3>
          <p 
            className="text-warm-gray mb-lg max-w-[50ch] mx-auto"
            style={{ fontSize: '1rem', lineHeight: 1.6 }}
          >
            Major technical choices happen weekly. Get the full context and influence the direction 
            before decisions are finalized.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-sm">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={isSubmitting}
              className={cn(
                "w-full px-md py-sm border-2 border-light-gray rounded-sm",
                "text-base bg-white",
                "focus:outline-none focus:border-primary",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            />
            <button
              type="submit"
              disabled={isSubmitting || !email}
              className={cn(
                "w-full py-sm bg-primary text-white border-none rounded-sm text-base",
                "font-semibold cursor-pointer transition-all duration-200",
                "hover:bg-off-black hover:-translate-y-px",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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