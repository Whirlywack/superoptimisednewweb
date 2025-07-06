"use client";

import React, { useState } from "react";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HomepageNavigation } from "./Homepage/HomepageNavigation";
import { HomepageFooter } from "./Homepage/HomepageFooter";
import { XPToastProvider } from "./Homepage/XPToastProvider";
import { useCommunityStats } from "@/hooks/useCommunityStats";
import { BookOpen, Vote, Twitter } from "lucide-react";
import type { AboutPageContent } from "./AboutPageWrapper";

interface AboutPageProps {
  content: AboutPageContent;
}

export function AboutPage({ content }: AboutPageProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Get real community stats
  const { stats } = useCommunityStats();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      setShowToast(true);

      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }, 1000);
  };

  return (
    <XPToastProvider>
      <div className="flex min-h-screen flex-col bg-off-white">
        {/* Navigation */}
        <HomepageNavigation />

        {/* Main Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <section
            className="w-full px-4 py-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(100, 116, 139, 0.02), rgba(100, 116, 139, 0.05))",
            }}
          >
            <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-8">
                <div className="mb-sm font-mono text-sm font-semibold uppercase tracking-wide text-primary">
                  {content.hero.label}
                </div>
                <h1 className="mb-8 text-hero font-bold leading-[1.1] text-off-black">
                  {content.hero.title.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < content.hero.title.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h1>
                <p className="mb-12 max-w-prose text-lg leading-relaxed text-warm-gray">
                  {content.hero.description}
                </p>

                {/* Inline Stats */}
                <div className="flex gap-12 rounded-lg border-l-4 border-primary bg-primary/[0.05] p-8">
                  <div className="flex min-w-[80px] flex-col items-center">
                    <div className="font-mono text-lg font-extrabold text-primary">
                      {Math.ceil(
                        (Date.now() - new Date("2024-01-01").getTime()) / (1000 * 60 * 60 * 24)
                      )}
                    </div>
                    <div className="mt-2 text-center text-xs text-warm-gray">Days Building</div>
                  </div>
                  <div className="flex min-w-[80px] flex-col items-center">
                    <div className="font-mono text-lg font-extrabold text-primary">
                      {stats?.totalVotes?.toLocaleString() || "17"}
                    </div>
                    <div className="mt-2 text-center text-xs text-warm-gray">Community Votes</div>
                  </div>
                  <div className="flex min-w-[80px] flex-col items-center">
                    <div className="font-mono text-lg font-extrabold text-primary">
                      {stats?.uniqueVoters?.toLocaleString() || "3"}
                    </div>
                    <div className="mt-2 text-center text-xs text-warm-gray">Unique Voters</div>
                  </div>
                  <div className="flex min-w-[80px] flex-col items-center">
                    <div className="font-mono text-lg font-extrabold text-primary">∞</div>
                    <div className="mt-2 text-center text-xs text-warm-gray">Things to Learn</div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-4">
                {/* Newsletter CTA */}
                <div className="rounded-lg border-2 border-primary bg-white p-lg text-center">
                  <h3 className="mb-md text-lg font-bold text-off-black">
                    {content.newsletter.title}
                  </h3>
                  <p className="mb-lg text-sm text-warm-gray">{content.newsletter.description}</p>
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
                      {content.newsletter.buttonText}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="w-full px-4 py-16 pb-24">
            <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-8">
                <p className="mb-8 max-w-prose text-warm-gray">{content.story.intro}</p>

                <p className="mb-8 max-w-prose text-warm-gray">{content.story.problem}</p>

                <div className="my-12 max-w-prose border-l-4 border-primary bg-primary/[0.1] p-8 italic text-off-black">
                  &ldquo;{content.story.quote}&rdquo;
                </div>

                <p className="mb-8 max-w-prose text-warm-gray">
                  {content.story.experiment.includes("@superoptimised") ? (
                    <>
                      {content.story.experiment.split("@superoptimised")[0]}
                      <a
                        href="https://x.com/superoptimised"
                        className="font-medium text-primary hover:underline"
                      >
                        X (@superoptimised)
                      </a>
                      {content.story.experiment.split("@superoptimised")[1]}
                    </>
                  ) : (
                    content.story.experiment
                  )}
                </p>

                <p className="mb-8 max-w-prose text-warm-gray">{content.story.currentFocus}</p>

                <p className="mb-8 max-w-prose text-warm-gray">{content.story.uncertainty}</p>

                <p className="mb-8 max-w-prose text-warm-gray">
                  {content.story.conclusion.includes("**") ? (
                    <>
                      {content.story.conclusion.split("**")[0]}
                      <strong>{content.story.conclusion.split("**")[1]}</strong>
                      {content.story.conclusion.split("**")[2]}
                    </>
                  ) : (
                    content.story.conclusion
                  )}
                </p>

                <p className="max-w-prose text-warm-gray">{content.story.callToAction}</p>
              </div>

              <div className="col-span-12 md:col-span-4">
                <div className="sticky top-12 space-y-8">
                  {/* Actions */}
                  <div className="rounded-lg border-2 border-light-gray bg-white p-8">
                    <h3 className="mb-4 text-left font-semibold text-off-black">
                      {content.sidebar.takeActionTitle}
                    </h3>
                    <div className="space-y-4 text-left">
                      <LinkButton
                        href="/journey"
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <BookOpen className="size-4" />
                        <span>Read the full journey</span>
                      </LinkButton>
                      <LinkButton
                        href="/research"
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <Vote className="size-4" />
                        <span>Vote on current decisions</span>
                      </LinkButton>
                      <LinkButton
                        href="https://x.com/superoptimised"
                        variant="outline"
                        size="sm"
                        external
                        className="w-full justify-start"
                      >
                        <Twitter className="size-4" />
                        <span>Join live conversations</span>
                      </LinkButton>
                    </div>
                  </div>

                  {/* Current Focus */}
                  <div className="rounded-lg border-2 border-light-gray bg-white p-8">
                    <h3 className="mb-4 font-semibold text-off-black">
                      {content.sidebar.currentFocusTitle}
                    </h3>
                    <div className="rounded-lg bg-primary/[0.02] p-4 text-left">
                      <div className="flex items-center justify-between border-b border-light-gray py-2">
                        <span className="text-sm text-warm-gray">Building</span>
                        <span className="font-mono text-sm font-semibold text-primary">
                          {content.sidebar.currentFocusData.building}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-light-gray py-2">
                        <span className="text-sm text-warm-gray">Learning</span>
                        <span className="font-mono text-sm font-semibold text-primary">
                          {content.sidebar.currentFocusData.learning}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-warm-gray">Next</span>
                        <span className="font-mono text-sm font-semibold text-primary">
                          {content.sidebar.currentFocusData.next}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <HomepageFooter />
      </div>

      {/* XP Toast */}
      {showToast && (
        <div className="fixed right-5 top-5 z-50 rounded-lg border-2 border-white/20 bg-primary px-6 py-3 font-mono font-bold text-white shadow-lg transition-all duration-300">
          +5 XP • Thanks for joining the experiment!
        </div>
      )}
    </XPToastProvider>
  );
}
