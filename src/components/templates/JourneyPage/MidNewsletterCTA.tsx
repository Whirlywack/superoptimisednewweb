'use client';

import React, { useState, useContext } from 'react';
import { cn } from '@/lib/utils';
import { XPToastContext } from '../Homepage/XPToastProvider';
import { api } from '@/lib/trpc/react';

export function MidNewsletterCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const { showXPToast } = useContext(XPToastContext);

  // Newsletter subscription mutation
  const subscribeMutation = api.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
      setEmail('');
      setError('');
      showXPToast('+5 XP • Newsletter signup!');
    },
    onError: (error) => {
      setError(error.message);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      await subscribeMutation.mutateAsync({
        email,
        sourcePage: 'journey',
      });
    } catch (error) {
      // Error handling is done in the mutation's onError callback
      console.error('Newsletter signup failed:', error);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <section className="my-2xl w-full px-4">
        <div className="mx-auto max-w-4xl">
          <div 
            className="rounded-lg border-2 border-green-500 p-lg text-center"
            style={{ 
              background: 'rgba(34, 197, 94, 0.05)',
              margin: '6rem 0'
            }}
          >
            <h3 className="mb-md text-xl font-semibold text-off-black">
              Check Your Email!
            </h3>
            <p className="mx-auto mb-lg max-w-[50ch] text-base leading-relaxed text-warm-gray">
              We&apos;ve sent you a confirmation link. Click it to complete your subscription and 
              stay updated on all the major decisions.
            </p>
          </div>
        </div>
      </section>
    );
  }

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
            Don&apos;t Miss the Next Decision
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
                "disabled:cursor-not-allowed disabled:opacity-50",
                error && "border-red-500 focus:border-red-500"
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
            {error && (
              <div className="mt-2 text-sm text-red-600">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}