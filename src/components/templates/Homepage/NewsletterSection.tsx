'use client';

import React, { useState, useContext } from 'react';
import { Mail, Users, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
        className="w-full bg-white px-4 py-16 md:py-20"
        aria-labelledby="newsletter-heading"
      >
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-h2 font-bold text-off-black mb-4">
            Welcome to the Building Journey!
          </h2>
          <p className="text-body text-warm-gray leading-relaxed">
            You're now part of the transparent building process. You'll receive weekly insights 
            when valuable content is ready, and your early signup helps reach the 100-builder goal.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="w-full bg-white px-4 py-16 md:py-20"
      aria-labelledby="newsletter-heading"
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Section Headline */}
        <h2 
          id="newsletter-heading"
          className="text-h1 md:text-3xl font-bold text-off-black mb-6"
        >
          Join the Building Journey
        </h2>

        {/* Description */}
        <p className="text-body md:text-lg text-warm-gray leading-relaxed mb-8">
          Weekly building insights launching when valuable. I won't start sending until I have 
          meaningful weekly content and at least 100 builders to write to. Your early signup 
          helps reach that goal and shows there's genuine interest in this transparent approach.
        </p>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
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
                  "w-full px-4 py-3 rounded-lg border border-light-gray",
                  "text-body placeholder-warm-gray/60",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "min-h-[44px]"
                )}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              variant="primary"
              loading={isSubmitting}
              disabled={isSubmitting || !email}
              className="w-full sm:w-auto whitespace-nowrap min-h-[44px]"
            >
              <Mail className="h-5 w-5 mr-2" />
              Be Among the First 100
            </Button>
          </div>
        </form>

        {/* Meta Text */}
        <div className="flex items-center justify-center gap-4 text-small text-warm-gray">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              Currently <strong className="font-semibold text-off-black">{builderCount} builders</strong> signed up
            </span>
          </div>
        </div>
        
        <p className="text-small text-warm-gray mt-2">
          Weekly updates when launched, unsubscribe anytime, absolutely no spam.
        </p>

        {/* Progress to 100 */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-2 text-small">
            <span className="text-warm-gray">Progress to 100 builders</span>
            <span className="font-semibold text-primary">
              {builderCount}/100
            </span>
          </div>
          <div className="w-full bg-light-gray rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((builderCount / 100) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}