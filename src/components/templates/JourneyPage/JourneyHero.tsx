"use client";

import React, { useState, useContext } from "react";
import { cn } from "@/lib/utils";
import { XPToastContext } from "../Homepage/XPToastProvider";

export function JourneyHero() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
  const { showXPToast } = useContext(XPToastContext);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual newsletter signup
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setEmail("");
      showXPToast("newsletter");
    } catch (error) {
      console.error("Newsletter signup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePollVote = (option: string) => {
    setSelectedPoll(option);
    showXPToast("poll");

    // Auto-refresh poll after vote (simulated)
    setTimeout(() => {
      setSelectedPoll(null);
    }, 2000);
  };

  return (
    <section
      className="w-full px-4 py-2xl"
      style={{
        background: "linear-gradient(135deg, rgba(100, 116, 139, 0.02), rgba(100, 116, 139, 0.05))",
      }}
      aria-labelledby="journey-hero-heading"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6">
        {/* Hero Content - Left 8 columns */}
        <div className="col-span-12 md:col-span-8">
          {/* Hero Label */}
          <div className="mb-sm font-mono text-sm font-semibold uppercase tracking-wide text-primary">
            Building Journey
          </div>

          {/* Hero Title */}
          <h1 id="journey-hero-heading" className="mb-lg text-hero font-bold text-off-black">
            Every Decision
            <br />
            Shaped By
            <br />
            Community
          </h1>

          {/* Hero Description */}
          <p className="mb-xl max-w-prose text-lg leading-relaxed text-warm-gray">
            This is the complete building journey where your input drives every technical decision.
            From initial planning to launch, nothing is hidden. Watch how community feedback
            transforms ideas into reality, one decision at a time.
          </p>

          {/* Current Status */}
          <div
            className="mb-xl border-l-4 border-primary p-lg"
            style={{ background: "rgba(100, 116, 139, 0.1)" }}
          >
            <div className="mb-sm font-mono text-sm font-semibold text-primary">Current Focus</div>
            <div className="mb-sm font-medium text-off-black">
              Building Magic Link Questionnaire System
            </div>
            <div className="font-mono text-sm text-warm-gray">
              Community input: 17 votes across 4 active decisions
            </div>
          </div>

          {/* Journey-Specific Poll */}
          <div className="rounded-lg border-2 border-light-gray bg-white p-md transition-all duration-200">
            <div className="mb-md text-sm font-semibold leading-relaxed text-off-black">
              What&apos;s most valuable in a building journey?
            </div>
            <div className="mb-md flex gap-sm">
              <button
                onClick={() => handlePollVote("decisions")}
                className={cn(
                  "flex-1 rounded px-md py-sm text-center text-sm font-medium transition-all duration-200",
                  selectedPoll === "decisions"
                    ? "border-2 border-primary bg-primary text-white"
                    : "border-2 border-transparent bg-light-gray text-off-black hover:border-primary hover:bg-white"
                )}
              >
                Decision Process
              </button>
              <button
                onClick={() => handlePollVote("lessons")}
                className={cn(
                  "flex-1 rounded px-md py-sm text-center text-sm font-medium transition-all duration-200",
                  selectedPoll === "lessons"
                    ? "border-2 border-primary bg-primary text-white"
                    : "border-2 border-transparent bg-light-gray text-off-black hover:border-primary hover:bg-white"
                )}
              >
                Lessons Learned
              </button>
            </div>
            <div className="text-center text-xs text-warm-gray">
              <span className="font-mono">Help shape future content</span> •
              <a href="https://x.com/superoptimised" className="ml-1 text-primary hover:underline">
                Discuss on X
              </a>
            </div>
          </div>
        </div>

        {/* Hero Sidebar - Right 4 columns */}
        <div className="col-span-12 flex flex-col gap-md md:col-span-4">
          {/* Primary Newsletter CTA */}
          <div className="rounded-lg border-2 border-primary bg-white p-lg text-center">
            <h3 className="mb-md text-lg font-bold text-off-black">Follow Every Decision</h3>
            <p className="mb-lg text-sm text-warm-gray">
              Weekly insights when valuable content is ready. Be among the first 100 builders to get
              behind-the-scenes development updates.
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
                Get Inside Access
              </button>
            </form>
          </div>

          {/* Live Community Metrics */}
          <div
            className="rounded-lg p-md text-center"
            style={{ background: "rgba(100, 116, 139, 0.05)" }}
          >
            <div className="font-mono text-xl font-bold text-primary">17</div>
            <div className="mt-xs text-xs text-warm-gray">Community Votes This Week</div>
          </div>

          <div
            className="rounded-lg p-md text-center"
            style={{ background: "rgba(100, 116, 139, 0.05)" }}
          >
            <div className="font-mono text-xl font-bold text-primary">3</div>
            <div className="mt-xs text-xs text-warm-gray">Decisions Influenced</div>
          </div>
        </div>
      </div>
    </section>
  );
}
