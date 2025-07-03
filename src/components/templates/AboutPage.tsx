"use client";

import React, { useState } from "react";
import { LinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HomepageNavigation } from "./Homepage/HomepageNavigation";
import { HomepageFooter } from "./Homepage/HomepageFooter";
import { XPToastProvider } from "./Homepage/XPToastProvider";
import { BookOpen, Vote, Twitter } from "lucide-react";

export function AboutPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

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
                  Solo Developer Experiment
                </div>
                <h1 className="mb-8 text-hero font-bold leading-[1.1] text-off-black">
                  Your Input Shapes
                  <br />
                  What Gets Built
                </h1>
                <p className="mb-12 max-w-prose text-lg leading-relaxed text-warm-gray">
                  This is an experiment in building products where the community has direct say in
                  every decision. We&apos;re a small team (just me) sharing failures and wins
                  transparently, learning together, and letting your feedback guide what gets
                  created next.
                </p>

                {/* Inline Stats */}
                <div className="flex gap-12 rounded-lg border-l-4 border-primary bg-primary/[0.05] p-8">
                  <div className="flex min-w-[80px] flex-col items-center">
                    <div className="font-mono text-lg font-extrabold text-primary">1</div>
                    <div className="mt-2 text-center text-xs text-warm-gray">Day Building</div>
                  </div>
                  <div className="flex min-w-[80px] flex-col items-center">
                    <div className="font-mono text-lg font-extrabold text-primary">17</div>
                    <div className="mt-2 text-center text-xs text-warm-gray">Community Votes</div>
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
                  <h3 className="mb-md text-lg font-bold text-off-black">Follow Every Decision</h3>
                  <p className="mb-lg text-sm text-warm-gray">
                    Weekly insights when valuable content is ready. Be among the first 100 builders
                    to get behind-the-scenes development updates.
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
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-16 pb-24">
            <div className="container mx-auto max-w-6xl px-8">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8">
                  <p className="mb-8 max-w-prose text-warm-gray">
                    Like most developers, I&apos;ve built plenty of things that nobody wanted. The
                    pattern was always the same: great idea (I thought), months of solo development,
                    launch to silence, wonder what went wrong.
                  </p>

                  <p className="mb-8 max-w-prose text-warm-gray">
                    The problem wasn&apos;t the code—it was the isolation. I was solving problems
                    that existed mostly in my head, building features based on assumptions instead
                    of conversations with real people.
                  </p>

                  <div className="my-12 max-w-prose border-l-4 border-primary bg-primary/[0.1] p-8 italic text-off-black">
                    &ldquo;What if instead of building and then asking for feedback, I asked for
                    feedback while building?&rdquo;
                  </div>

                  <p className="mb-8 max-w-prose text-warm-gray">
                    So here&apos;s the experiment: I&apos;m building everything completely in the
                    open. Every technical decision gets discussed on{" "}
                    <a
                      href="https://x.com/superoptimised"
                      className="font-medium text-primary hover:underline"
                    >
                      X (@superoptimised)
                    </a>
                    . Every mistake gets documented. Every success gets shared transparently.
                  </p>

                  <p className="mb-8 max-w-prose text-warm-gray">
                    Right now, we&apos;re building a magic link questionnaire system because the
                    community voted that traditional signup forms kill honest feedback. But that
                    choice came from real conversations, not boardroom assumptions.
                  </p>

                  <p className="mb-8 max-w-prose text-warm-gray">
                    I don&apos;t know where this experiment will lead. Maybe we&apos;ll build
                    something genuinely useful. Maybe we&apos;ll discover that certain approaches
                    don&apos;t work. Maybe we&apos;ll learn things that change how we think about
                    building products altogether.
                  </p>

                  <p className="mb-8 max-w-prose text-warm-gray">
                    What I do know is that every conversation so far has been more valuable than any
                    assumption I would have made alone.{" "}
                    <strong>
                      Your input doesn&apos;t just inform the product—it becomes part of the story.
                    </strong>
                  </p>

                  <p className="max-w-prose text-warm-gray">
                    Want to help shape what gets built next? The most interesting conversations
                    happen in real-time, where your feedback can change the direction before
                    decisions are locked in.
                  </p>
                </div>

                <div className="col-span-4">
                  <div className="sticky top-12 space-y-8">
                    {/* Actions */}
                    <div className="rounded-lg border-2 border-light-gray bg-white p-8">
                      <h3 className="mb-4 font-semibold text-off-black">Take Action</h3>
                      <div className="space-y-4">
                        <LinkButton href="/journey" variant="outline" size="sm" className="w-full">
                          <BookOpen className="size-4" />
                          <span>Read the full journey</span>
                        </LinkButton>
                        <LinkButton
                          href="/questionnaire"
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Vote className="size-4" />
                          <span>Vote on current decisions</span>
                        </LinkButton>
                        <LinkButton
                          href="https://x.com/superoptimised"
                          variant="outline"
                          size="sm"
                          external
                          className="w-full"
                        >
                          <Twitter className="size-4" />
                          <span>Join live conversations</span>
                        </LinkButton>
                      </div>
                    </div>

                    {/* Current Focus */}
                    <div className="rounded-lg border-2 border-light-gray bg-white p-8">
                      <h3 className="mb-4 font-semibold text-off-black">Right Now</h3>
                      <div className="rounded-lg bg-primary/[0.02] p-4 text-left">
                        <div className="flex items-center justify-between border-b border-light-gray py-2">
                          <span className="text-sm text-warm-gray">Building</span>
                          <span className="font-mono text-sm font-semibold text-primary">
                            Magic Links
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-light-gray py-2">
                          <span className="text-sm text-warm-gray">Learning</span>
                          <span className="font-mono text-sm font-semibold text-primary">
                            User Feedback
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-warm-gray">Next</span>
                          <span className="font-mono text-sm font-semibold text-primary">
                            You Decide
                          </span>
                        </div>
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
