"use client";

import React, { useState, useContext } from "react";
import { Mail, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { XPToastContext } from "./XPToastProvider";
import { api } from "@/lib/trpc/react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState("");
  const { showXPToast } = useContext(XPToastContext);

  // Get real newsletter subscriber count
  const { data: stats } = api.newsletter.getStats.useQuery();
  const builderCount = stats?.confirmedSubscribers || 0;

  // Newsletter subscription mutation
  const subscribeMutation = api.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setIsSubscribed(true);
      setEmail("");
      setError("");
      showXPToast("+5 XP • Newsletter signup!");
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
    setError("");

    try {
      await subscribeMutation.mutateAsync({
        email,
        sourcePage: "homepage",
      });
    } catch (error) {
      // Error handling is done in the mutation's onError callback
      console.error("Newsletter signup failed:", error);
    }
  };

  if (isSubscribed) {
    return (
      <section className="w-full bg-white px-4 py-xl" aria-labelledby="newsletter-heading">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="size-8 text-primary" />
          </div>
          <h2 className="mb-4 text-xl font-bold text-off-black">
            Check Your Email!
          </h2>
          <p className="text-body leading-relaxed text-warm-gray">
            We&apos;ve sent you a confirmation email. Please click the link to complete your
            subscription and join the building journey. You&apos;ll receive weekly insights
            when valuable content is ready.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-primary/[0.02] px-4 py-24" aria-labelledby="newsletter-heading">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-9">
          {/* Section Headline - Left aligned, slightly bigger typography */}
          <h2 id="newsletter-heading" className="mb-lg text-xl font-bold text-off-black">
            Join the Building Journey
          </h2>
          {/* Description */}
          <p className="mb-lg max-w-reading text-base leading-relaxed text-warm-gray">
            Weekly building insights launching when valuable. I won&apos;t start sending until I
            have meaningful weekly content and at least 100 builders to write to. Your early signup
            helps reach that goal and shows there&apos;s genuine interest in this transparent
            approach.
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
                    "h-[44px]",
                    error && "border-red-500 focus:border-red-500"
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

          {/* Error Message */}
          {error && (
            <div className="mb-md text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Meta Text */}
          <p className="text-sm text-warm-gray">
            Currently{" "}
            <span className="font-mono font-semibold text-primary">{builderCount} builders</span>{" "}
            signed up. Weekly updates when launched, unsubscribe anytime, absolutely no spam.
          </p>
        </div>
      </div>
    </section>
  );
}
