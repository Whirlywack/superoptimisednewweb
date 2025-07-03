"use client";

import React, { useState, useContext } from "react";
import { cn } from "@/lib/utils";
import { XPToastContext } from "../Homepage/XPToastProvider";

export function PostContent() {
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showXPToast } = useContext(XPToastContext);

  const handlePollVote = (option: string) => {
    setSelectedPoll(option);
    showXPToast("+10 XP • Building momentum!");

    // Auto-refresh poll after vote (simulated)
    setTimeout(() => {
      setSelectedPoll(null);
    }, 2000);
  };

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
    <section className="w-full px-4 py-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6">
        {/* Post Content - Left 8 columns */}
        <div className="col-span-12 md:col-span-8">
          {/* Main Content */}
          <div className="max-w-prose">
            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              Traditional development happens behind closed doors. Decisions get made in isolation,
              problems stay hidden until launch, and communities only see the polished final
              product.
              <strong>I&apos;m doing the opposite.</strong>
            </p>

            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              Starting today, every technical decision, every design choice, and every mistake will
              be documented transparently. Not because transparency is trendy, but because it leads
              to fundamentally better products.
            </p>

            <h2 className="mb-xl mt-2xl text-xl font-semibold leading-tight text-off-black">
              The Problem with Secret Development
            </h2>

            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              Most products fail not because of poor execution, but because of poor assumptions.
              When you build in isolation, you&apos;re building based on your assumptions about what
              people need, how they behave, and what problems actually matter to them.
            </p>

            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              The feedback loop is broken. By the time you launch and get real user input,
              you&apos;ve already committed months of development to potentially wrong directions.
              Pivoting becomes expensive. Critical insights come too late.
            </p>

            <blockquote className="mx-0 my-xl max-w-prose border-l-4 border-primary bg-primary/10 p-xl text-lg italic text-off-black">
              &ldquo;The best feedback comes from real problems, not survey responses. Building
              transparently creates trust—and trust creates honest input.&rdquo;
            </blockquote>

            {/* Community Impact Section */}
            <div className="mx-0 my-2xl max-w-prose rounded-lg border-2 border-primary bg-primary/5 p-lg">
              <div className="mb-md font-mono text-sm font-semibold text-primary">
                Community Impact on This Post
              </div>
              <div className="mb-md grid grid-cols-3 gap-md">
                {[
                  { number: "5", label: "Initial Votes" },
                  { number: "12", label: "X Replies" },
                  { number: "3", label: "Direction Changes" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="font-mono text-xl font-extrabold text-primary">
                      {stat.number}
                    </div>
                    <div className="mt-xs text-xs text-warm-gray">{stat.label}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-warm-gray">
                This post itself was shaped by community input. Initial feedback suggested focusing
                on practical benefits rather than philosophical arguments. The opening was rewritten
                based on 5 early reader votes.
              </p>
            </div>

            <h2 className="mb-xl mt-2xl text-xl font-semibold leading-tight text-off-black">
              Building with Community Input
            </h2>

            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              Building in public flips this model. Instead of validating assumptions after building,
              you test assumptions while building. The community becomes your early warning system
              for bad decisions and your guide toward better ones.
            </p>

            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              But it&apos;s not just about avoiding mistakes. Community input often reveals
              opportunities you&apos;d never consider on your own. Different perspectives highlight
              use cases you missed, edge cases you didn&apos;t think about, and solutions you
              wouldn&apos;t have found alone.
            </p>

            {/* Interactive Poll */}
            <div className="mx-0 my-2xl max-w-prose rounded-lg border-2 border-light-gray bg-white p-lg transition-all duration-200">
              <div className="mb-md text-sm font-semibold leading-relaxed text-off-black">
                What&apos;s the biggest benefit of building in public?
              </div>
              <div className="mb-md flex flex-wrap gap-sm">
                {[
                  { value: "feedback", label: "Better Feedback" },
                  { value: "trust", label: "Building Trust" },
                  { value: "learning", label: "Learning Together" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePollVote(option.value)}
                    className={cn(
                      "flex-1 rounded px-md py-sm text-center text-sm font-medium transition-all duration-200",
                      selectedPoll === option.value
                        ? "border-2 border-primary bg-primary text-white"
                        : "border-2 border-transparent bg-light-gray text-off-black hover:border-primary hover:bg-white"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="text-center text-xs text-warm-gray">
                <span className="font-mono">Help shape future posts</span> •
                <a
                  href="https://x.com/superoptimised"
                  className="ml-1 text-primary hover:underline"
                >
                  Discuss on X
                </a>
              </div>
            </div>

            <h3 className="mb-lg mt-xl text-lg font-semibold leading-snug text-off-black">
              The Trust Factor
            </h3>

            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              When people see your decision-making process, they understand your reasoning. When
              they understand your reasoning, they trust your conclusions. When they trust your
              conclusions, they give you honest feedback instead of polite responses.
            </p>

            <p className="mb-lg text-base leading-relaxed text-warm-gray">
              This creates a virtuous cycle. Transparency builds trust, trust enables honest
              feedback, honest feedback improves decisions, better decisions build more trust.
            </p>

            <h2
              className="text-xl font-semibold text-off-black"
              style={{
                margin: "4rem 0 3rem 0",
              }}
            >
              What This Journey Will Document
            </h2>

            <p className="text-base text-warm-gray" style={{ marginBottom: "2rem" }}>
              Every week, I&apos;ll share the technical decisions made, the community input
              received, and the lessons learned. This isn&apos;t a highlight reel—it&apos;s a
              complete record of the building process.
            </p>

            <ul
              className="text-warm-gray"
              style={{ marginBottom: "2rem", paddingLeft: "3rem", maxWidth: "65ch" }}
            >
              <li className="text-warm-gray" style={{ marginBottom: "1rem" }}>
                <strong>Technical Decisions:</strong> Why magic links over traditional auth? How
                should questionnaire data be structured? What&apos;s the minimum viable feature set?
              </li>
              <li className="text-warm-gray" style={{ marginBottom: "1rem" }}>
                <strong>Community Feedback:</strong> What problems are you actually trying to solve?
                What alternatives should be considered? What am I missing?
              </li>
              <li className="text-warm-gray" style={{ marginBottom: "1rem" }}>
                <strong>Lessons Learned:</strong> What worked, what didn&apos;t, and what surprised
                me. Both the technical lessons and the community building lessons.
              </li>
              <li className="text-warm-gray" style={{ marginBottom: "1rem" }}>
                <strong>Mistakes Made:</strong> Failed approaches, wrong assumptions, and course
                corrections. The messy reality of building something new.
              </li>
            </ul>

            {/* Mid-Content Newsletter CTA */}
            <div
              className="max-w-prose rounded-lg border-2 border-primary bg-white p-lg text-center"
              style={{ margin: "4rem 0" }}
            >
              <h3 className="mb-md text-lg font-bold text-off-black">Don&apos;t Miss a Decision</h3>
              <p className="mb-lg text-sm text-warm-gray">
                Major technical choices happen weekly. Get the full context and help influence the
                direction before decisions are final.
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
                  Get Decision Updates
                </button>
              </form>
            </div>

            <h2
              className="text-xl font-semibold text-off-black"
              style={{
                margin: "4rem 0 3rem 0",
              }}
            >
              The Commitment
            </h2>

            <p className="text-base text-warm-gray" style={{ marginBottom: "2rem" }}>
              This is an experiment in radical transparency. Not just sharing successes, but
              documenting the complete process—including the uncertainty, the dead ends, and the
              community-driven course corrections.
            </p>

            <p className="text-base text-warm-gray" style={{ marginBottom: "2rem" }}>
              Most importantly, this isn&apos;t just about transparency for its own sake. It&apos;s
              about building better products through better feedback loops. The community isn&apos;t
              just an audience—they&apos;re collaborators in the building process.
            </p>

            <p className="text-base text-warm-gray" style={{ marginBottom: "2rem" }}>
              <strong>Ready to build something together?</strong> The first technical decision is
              coming this week: authentication strategy for anonymous feedback. Your input will
              directly influence the implementation.
            </p>

            <p className="text-base text-warm-gray" style={{ marginBottom: "2rem" }}>
              Follow along on{" "}
              <a
                href="https://x.com/superoptimised"
                className="font-medium text-primary hover:underline"
              >
                X (@superoptimised)
              </a>
              for live decisions and vote in real-time polls. This website documents the complete
              journey for those who want the full context.
            </p>
          </div>
        </div>

        {/* Content Sidebar - Right 4 columns */}
        <div className="col-span-12 md:col-span-4">
          <div className="sticky top-lg space-y-lg">
            {/* Table of Contents */}
            <div className="rounded-lg border-2 border-light-gray bg-white p-md">
              <h3 className="mb-md text-sm font-semibold text-off-black">In This Post</h3>
              <div className="text-sm text-warm-gray">
                <ul className="text-sm" style={{ paddingLeft: "2rem", margin: 0 }}>
                  <li className="text-sm" style={{ marginBottom: "0.5rem" }}>
                    <a href="#problem" className="text-warm-gray hover:text-primary">
                      The Problem with Secret Development
                    </a>
                  </li>
                  <li className="text-sm" style={{ marginBottom: "0.5rem" }}>
                    <a href="#community" className="text-warm-gray hover:text-primary">
                      Building with Community Input
                    </a>
                  </li>
                  <li className="text-sm" style={{ marginBottom: "0.5rem" }}>
                    <a href="#document" className="text-warm-gray hover:text-primary">
                      What This Journey Will Document
                    </a>
                  </li>
                  <li className="text-sm" style={{ marginBottom: "0.5rem" }}>
                    <a href="#commitment" className="text-warm-gray hover:text-primary">
                      The Commitment
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Post Stats */}
            <div className="rounded-lg border-2 border-light-gray bg-white p-md">
              <h3 className="mb-md text-sm font-semibold text-off-black">Post Impact</h3>
              <div className="text-sm text-warm-gray">
                {[
                  { label: "Views", value: "247" },
                  { label: "X Shares", value: "12" },
                  { label: "Newsletter Signups", value: "8" },
                  { label: "Community Votes", value: "5" },
                ].map((stat, index) => (
                  <div key={index} className="mb-sm flex justify-between">
                    <span>{stat.label}</span>
                    <span className="font-mono text-primary">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coming Next */}
            <div className="rounded-lg border-2 border-light-gray bg-white p-md">
              <h3 className="mb-md text-sm font-semibold text-off-black">Coming Next</h3>
              <div className="text-sm text-warm-gray">
                <p className="mb-sm font-semibold">Authentication Decision</p>
                <p className="mb-sm">
                  Magic links vs traditional login for anonymous feedback. Community vote in
                  progress.
                </p>
                <a href="https://x.com/superoptimised" className="text-primary hover:underline">
                  Vote on X →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
