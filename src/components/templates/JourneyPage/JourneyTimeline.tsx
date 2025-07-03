"use client";

import React, { useState, useContext } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { XPToastContext } from "../Homepage/XPToastProvider";
import { BarChart3, MessageCircle, Target, Repeat2, Heart } from "lucide-react";

interface CommunityImpact {
  votes: string;
  replies: string;
  outcome: string;
}

interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  status: "Foundation" | "In Progress" | "Complete";
  href: string;
  readTime: string;
  featured?: boolean;
  communityImpact?: CommunityImpact;
}

const timelineEntries: TimelineEntry[] = [
  {
    id: "1",
    date: "Day 1 • January 2, 2024",
    title: "Why Building in Public Creates Better Products",
    excerpt:
      "Traditional development happens behind closed doors—decisions made in isolation, problems hidden until launch. I'm documenting every choice, sharing every challenge, and letting community feedback guide the direction. This transparency leads to better products and stronger relationships with the people who'll actually use what I build.",
    status: "Foundation",
    href: "/journey/day-1-foundation",
    readTime: "4 min read",
    featured: true,
    communityImpact: {
      votes: "5 initial votes on direction",
      replies: "12 replies on X thread",
      outcome: "Project scope refined based on feedback",
    },
  },
  {
    id: "2",
    date: "Coming This Week",
    title: "Authentication Decision: Magic Links vs Traditional Login",
    excerpt:
      "The community is helping decide between magic link authentication and traditional username/password. Current vote: 67% favor magic links for anonymous feedback systems. This post will break down the technical implications and final implementation decision.",
    status: "In Progress",
    href: "https://x.com/superoptimised",
    readTime: "Live voting",
    communityImpact: {
      votes: "17 votes and counting",
      replies: "8 alternative suggestions",
      outcome: "Decision deadline: Friday",
    },
  },
];

export function JourneyTimeline() {
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
  const { showXPToast } = useContext(XPToastContext);

  const handlePollVote = (option: string) => {
    setSelectedPoll(option);
    showXPToast("poll");

    // Auto-refresh poll after vote (simulated)
    setTimeout(() => {
      setSelectedPoll(null);
    }, 2000);
  };

  return (
    <section className="w-full px-4 py-2xl">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6">
        {/* Timeline Header */}
        <div className="col-span-12 mb-2xl text-center">
          <h2 className="mb-md text-xl font-semibold text-off-black">Building Timeline</h2>
          <p className="text-base text-warm-gray">
            Every decision documented. Community influence tracked. Lessons shared transparently.
          </p>
        </div>

        {/* Timeline Content - Left 8 columns */}
        <div className="col-span-12 md:col-span-8">
          <div className="space-y-xl">
            {timelineEntries.map((entry, _index) => (
              <article
                key={entry.id}
                className={cn(
                  "relative pl-lg",
                  "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:content-['']",
                  entry.featured ? "before:bg-primary" : "before:bg-light-gray"
                )}
              >
                {entry.href.startsWith("http") ? (
                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block cursor-pointer rounded-lg border-2 border-light-gray bg-white p-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-primary"
                  >
                    {/* Entry Meta */}
                    <div className="mb-md flex flex-wrap items-center justify-between gap-4">
                      <time className="font-mono text-sm text-warm-gray">{entry.date}</time>
                      <span
                        className="rounded px-sm py-xs text-xs font-semibold"
                        style={{
                          background: "rgba(100, 116, 139, 0.1)",
                          color: "var(--primary)",
                        }}
                      >
                        {entry.status}
                      </span>
                    </div>

                    {/* Entry Title */}
                    <h3 className="mb-md text-xl font-semibold text-off-black">{entry.title}</h3>

                    {/* Entry Excerpt */}
                    <p className="mb-md max-w-prose text-base text-warm-gray">{entry.excerpt}</p>

                    {/* Community Impact */}
                    {entry.communityImpact && (
                      <div
                        className="my-md rounded p-md"
                        style={{ background: "rgba(100, 116, 139, 0.05)" }}
                      >
                        <div className="mb-sm text-sm font-semibold text-primary">
                          Community Impact
                        </div>
                        <div className="flex flex-wrap gap-lg font-mono text-sm text-warm-gray">
                          <div className="flex items-center gap-1">
                            <BarChart3 className="size-4" />
                            <span>{entry.communityImpact.votes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="size-4" />
                            <span>{entry.communityImpact.replies}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="size-4" />
                            <span>{entry.communityImpact.outcome}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Entry Actions */}
                    <div className="mt-md flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">
                        Join the discussion on X →
                      </span>
                      <span className="font-mono text-sm text-warm-gray">{entry.readTime}</span>
                    </div>
                  </a>
                ) : (
                  <Link
                    href={entry.href}
                    className="block cursor-pointer rounded-lg border-2 border-light-gray bg-white p-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-primary"
                  >
                    {/* Entry Meta */}
                    <div className="mb-md flex flex-wrap items-center justify-between gap-4">
                      <time className="font-mono text-sm text-warm-gray">{entry.date}</time>
                      <span
                        className="rounded px-sm py-xs text-xs font-semibold"
                        style={{
                          background: "rgba(100, 116, 139, 0.1)",
                          color: "var(--primary)",
                        }}
                      >
                        {entry.status}
                      </span>
                    </div>

                    {/* Entry Title */}
                    <h3 className="mb-md text-xl font-semibold text-off-black">{entry.title}</h3>

                    {/* Entry Excerpt */}
                    <p className="mb-md max-w-prose text-base text-warm-gray">{entry.excerpt}</p>

                    {/* Community Impact */}
                    {entry.communityImpact && (
                      <div
                        className="my-md rounded p-md"
                        style={{ background: "rgba(100, 116, 139, 0.05)" }}
                      >
                        <div className="mb-sm text-sm font-semibold text-primary">
                          Community Impact
                        </div>
                        <div className="flex flex-wrap gap-lg font-mono text-sm text-warm-gray">
                          <div className="flex items-center gap-1">
                            <BarChart3 className="size-4" />
                            <span>{entry.communityImpact.votes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="size-4" />
                            <span>{entry.communityImpact.replies}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="size-4" />
                            <span>{entry.communityImpact.outcome}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Entry Actions */}
                    <div className="mt-md flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">Read full post →</span>
                      <span className="font-mono text-sm text-warm-gray">{entry.readTime}</span>
                    </div>
                  </Link>
                )}
              </article>
            ))}

            {/* Content Strategy Poll */}
            <div className="rounded-lg border-2 border-light-gray bg-white p-md transition-all duration-200">
              <div className="mb-md text-base font-semibold text-off-black">
                What type of content would be most valuable next?
              </div>
              <div className="mb-md flex flex-wrap gap-sm">
                <button
                  onClick={() => handlePollVote("technical")}
                  className={cn(
                    "flex-1 rounded px-md py-sm text-center text-sm font-medium transition-all duration-200",
                    selectedPoll === "technical"
                      ? "border-2 border-primary bg-primary text-white"
                      : "border-2 border-transparent bg-light-gray hover:border-primary hover:bg-white"
                  )}
                >
                  Technical Deep-Dives
                </button>
                <button
                  onClick={() => handlePollVote("decisions")}
                  className={cn(
                    "flex-1 rounded px-md py-sm text-center text-sm font-medium transition-all duration-200",
                    selectedPoll === "decisions"
                      ? "border-2 border-primary bg-primary text-white"
                      : "border-2 border-transparent bg-light-gray hover:border-primary hover:bg-white"
                  )}
                >
                  Decision Breakdowns
                </button>
                <button
                  onClick={() => handlePollVote("lessons")}
                  className={cn(
                    "flex-1 rounded px-md py-sm text-center text-sm font-medium transition-all duration-200",
                    selectedPoll === "lessons"
                      ? "border-2 border-primary bg-primary text-white"
                      : "border-2 border-transparent bg-light-gray hover:border-primary hover:bg-white"
                  )}
                >
                  Weekly Lessons
                </button>
              </div>
              <div className="text-center text-xs text-warm-gray">
                <span className="font-mono">Shape upcoming content</span> •
                <a
                  href="https://x.com/superoptimised"
                  className="ml-1 text-primary hover:underline"
                >
                  Suggest on X
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Sidebar - Right 4 columns */}
        <div className="col-span-12 md:col-span-4">
          <div className="sticky top-lg space-y-lg">
            {/* Journey Stats */}
            <div className="rounded-lg border-2 border-light-gray bg-white p-md">
              <h3 className="mb-md text-lg font-semibold text-off-black">Journey Stats</h3>
              <div className="space-y-sm">
                {[
                  { label: "Days Building", value: "1" },
                  { label: "Posts Published", value: "1" },
                  { label: "Community Votes", value: "17" },
                  { label: "Decisions Made", value: "3" },
                  { label: "Project Complete", value: "15%" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-light-gray py-xs last:border-b-0"
                  >
                    <span className="text-sm text-warm-gray">{stat.label}</span>
                    <span className="font-mono text-sm font-bold text-primary">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent X Activity */}
            <div className="rounded-lg border-2 border-light-gray bg-white p-md">
              <h3 className="mb-md text-lg font-semibold text-off-black">Live from X</h3>
              <div className="rounded-lg border-2 border-light-gray bg-white p-lg">
                {/* X Header */}
                <div className="mb-md flex items-center gap-sm">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    SO
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-off-black">Superoptimised</div>
                    <div className="font-mono text-xs text-warm-gray">@superoptimised</div>
                  </div>
                </div>

                {/* X Content */}
                <div className="mb-md text-base text-off-black">
                  Day 1 of building in public: Community is already shaping technical decisions.
                  Magic links vs traditional auth poll results coming in. This is exactly why
                  transparent building works.
                </div>

                {/* X Stats */}
                <div className="flex gap-md font-mono text-sm text-warm-gray">
                  <div className="flex items-center gap-1">
                    <Repeat2 className="size-4" />
                    <span>8</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="size-4" />
                    <span>15</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="size-4" />
                    <span>5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
