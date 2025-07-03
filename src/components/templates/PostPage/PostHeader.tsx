"use client";

import React, { useState, useContext } from "react";
import { cn } from "@/lib/utils";
import { XPToastContext } from "../Homepage/XPToastProvider";

export function PostHeader() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showXPToast } = useContext(XPToastContext);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual newsletter signup
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setEmail("");
      showXPToast("+25 XP • Newsletter signup!");
    } catch (error) {
      console.error("Newsletter signup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <header
      className="w-full border-b border-light-gray px-4 py-lg"
      aria-labelledby="post-header-heading"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6">
        {/* Post Header Content - Left 8 columns */}
        <div className="col-span-12 md:col-span-8">
          {/* Post Label */}
          <div className="mb-sm font-mono text-sm font-semibold uppercase tracking-wide text-primary">
            Building Journey
          </div>

          {/* Article Title */}
          <h1 id="post-header-heading" className="mb-md text-hero font-bold text-off-black">
            Why Building in Public Creates Better Products
          </h1>

          {/* Article Description */}
          <p className="max-w-prose text-lg text-warm-gray">
            Day 1 of transparent development. Why community feedback leads to better products,
            stronger relationships, and authentic learning for everyone involved. Every decision
            documented, every challenge shared openly.
          </p>
        </div>

        {/* Post Header Sidebar - Right 4 columns */}
        <div className="col-span-12 md:col-span-4">
          {/* Newsletter CTA */}
          <div className="rounded-lg border-2 border-primary bg-white p-lg text-center">
            <h3 className="mb-md text-lg font-bold text-off-black">Follow This Journey</h3>
            <p className="mb-lg text-sm text-warm-gray">
              Get weekly insights when this experiment produces valuable lessons. Be part of shaping
              every decision.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-sm">
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
                Get Updates
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
