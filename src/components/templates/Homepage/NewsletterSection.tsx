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
        className="w-full bg-white px-4 py-xl"
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
      className="w-full bg-primary/2 px-4 py-xl"
      aria-labelledby="newsletter-heading"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-9">
          {/* Section Headline - Left aligned, slightly bigger typography */}
          <h2 
            id="newsletter-heading"
            className="font-bold text-off-black mb-lg"
            style={{ fontSize: '2rem' }}
          >
            Join the Building Journey
          </h2>
          {/* Description */}
          <p className="text-base text-warm-gray leading-relaxed mb-lg max-w-reading">
            Weekly building insights launching when valuable. I won't start sending until I have 
            meaningful weekly content and at least 100 builders to write to. Your early signup 
            helps reach that goal and shows there's genuine interest in this transparent approach.
          </p>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="mb-md">
            <div className="flex gap-sm max-w-lg">
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
                    "w-full px-md py-sm border-2 border-light-gray rounded-sm",
                    "text-base bg-white",
                    "focus:outline-none focus:border-primary",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "h-[44px]"
                  )}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className={cn(
                  "px-lg py-sm bg-primary text-white border-none rounded-sm",
                  "font-semibold cursor-pointer transition-all duration-200",
                  "hover:bg-off-black hover:-translate-y-px",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                  "whitespace-nowrap h-[44px] text-base flex items-center"
                )}
              >
                <Mail className="h-5 w-5 mr-2" />
                Be Among the First 100
              </button>
            </div>
          </form>

          {/* Meta Text */}
          <p className="text-sm text-warm-gray">
            Currently <span className="text-primary font-mono font-semibold">{builderCount} builders</span> signed up. 
            Weekly updates when launched, unsubscribe anytime, absolutely no spam.
          </p>
        </div>
      </div>
    </section>
  );
}