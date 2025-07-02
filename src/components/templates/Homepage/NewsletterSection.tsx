'use client';

import React, { useState, useContext } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { XPToastContext } from './XPToastProvider';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [builderCount] = useState(0); // This would be fetched from your backend
  const { showXPToast } = useContext(XPToastContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual newsletter signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubscribed(true);
      setEmail('');
      showXPToast('+25 XP • Newsletter signup!');
    } catch (error) {
      console.error('Newsletter signup failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <section 
        className="w-full bg-white px-4 py-xl"
        aria-labelledby="newsletter-heading"
      >
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="size-8 text-primary" />
          </div>
          <h2 className="mb-4 text-h2 font-bold text-off-black">
            Welcome to the Building Journey!
          </h2>
          <p className="text-body leading-relaxed text-warm-gray">
            You&apos;re now part of the transparent building process. You&apos;ll receive weekly insights 
            when valuable content is ready, and your early signup helps reach the 100-builder goal.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="w-full bg-primary/[0.02] px-4 py-24"
      aria-labelledby="newsletter-heading"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-9">
          {/* Section Headline - Left aligned, slightly bigger typography */}
          <h2 
            id="newsletter-heading"
            className="mb-lg text-xl font-bold text-off-black"
          >
            Join the Building Journey
          </h2>
          {/* Description */}
          <p className="mb-lg max-w-reading text-base leading-relaxed text-warm-gray">
            Weekly building insights launching when valuable. I won&apos;t start sending until I have 
            meaningful weekly content and at least 100 builders to write to. Your early signup 
            helps reach that goal and shows there&apos;s genuine interest in this transparent approach.
          </p>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="mb-md">
            <div className="flex max-w-lg gap-sm">
              <div className="flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
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
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "h-[44px]"
                  )}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className={cn(
                  "rounded-sm border-none bg-primary px-lg py-sm text-white",
                  "cursor-pointer font-semibold transition-all duration-200",
                  "hover:-translate-y-px hover:bg-off-black",
                  "disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50",
                  "flex h-[44px] items-center whitespace-nowrap text-base"
                )}
              >
                <Mail className="mr-2 size-5" />
                Be Among the First 100
              </button>
            </div>
          </form>

          {/* Meta Text */}
          <p className="text-sm text-warm-gray">
            Currently <span className="font-mono font-semibold text-primary">{builderCount} builders</span> signed up. 
            Weekly updates when launched, unsubscribe anytime, absolutely no spam.
          </p>
        </div>
      </div>
    </section>
  );
}