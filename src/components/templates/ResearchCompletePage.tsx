"use client";

import React, { useState, useContext } from "react";
import { cn } from "@/lib/utils";
import { HomepageNavigation } from "./Homepage/HomepageNavigation";
import { HomepageFooter } from "./Homepage/HomepageFooter";
import { XPToastProvider, XPToastContext } from "./Homepage/XPToastProvider";
import { Share } from "lucide-react";

function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showXPToast } = useContext(XPToastContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEmail("");
      showXPToast("newsletter");
    } catch (error) {
      console.error("Newsletter signup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full border-t border-light-gray bg-white px-4 py-xl">
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="mb-sm text-xl font-bold text-off-black">Get Decision Updates</h3>
        <p className="mb-lg text-warm-gray">
          Be the first to know when new community decisions need your input.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-sm">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={isSubmitting}
            className={cn(
              "flex-1 border-2 border-light-gray px-md py-sm",
              "bg-white text-base",
              "focus:border-primary focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          />
          <button
            type="submit"
            disabled={isSubmitting || !email}
            className={cn(
              "bg-primary px-lg py-sm text-base font-semibold text-white",
              "transition-all duration-200",
              "hover:bg-off-black disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            {isSubmitting ? "..." : "Join"}
          </button>
        </form>
      </div>
    </section>
  );
}

export function ResearchCompletePage() {
  const { showXPToast } = useContext(XPToastContext);
  const [showResponses, setShowResponses] = useState(false);
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});

  // Load user responses from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem("research-responses");
    if (stored) {
      setUserResponses(JSON.parse(stored));
    }
  }, []);

  // Mock questions data - in real app, this would come from API
  const questions = [
    {
      id: "auth-method",
      title: "How should users authenticate to vote?",
      options: {
        "magic-links": "Magic Links",
        "social-auth": "Social Login",
      },
    },
    {
      id: "mobile-experience",
      title: "Which platform should we prioritize first?",
      options: {
        "mobile-first": "Mobile-First",
        "desktop-first": "Desktop-First",
      },
    },
    {
      id: "notifications",
      title: "How would you like decision updates?",
      options: {
        "email-weekly": "Weekly Email",
        "real-time": "Real-time Alerts",
      },
    },
    {
      id: "voting-style",
      title: "What voting system feels most fair?",
      options: {
        "ranked-choice": "Ranked Choice",
        "point-system": "Point Allocation",
      },
    },
  ];

  const handleShare = () => {
    const responseCount = Object.keys(userResponses).length;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just completed ${responseCount}/4 research questions for @superoptimised's building project! 🗳️ Your voice shapes what gets built:`)}&url=${encodeURIComponent(window.location.origin + "/research")}`;
    window.open(url, "_blank");
    showXPToast("social-share");
  };

  return (
    <XPToastProvider>
      <div className="flex min-h-screen flex-col bg-off-white">
        {/* Navigation */}
        <HomepageNavigation />

        {/* Main Content */}
        <main className="flex flex-1 items-center justify-center px-4 py-xl">
          <div className="w-full max-w-2xl text-center">
            {/* Success Message */}
            <div className="mb-xl">
              <h1 className="mb-md text-6xl font-bold leading-none text-off-black md:text-8xl">
                Done!
              </h1>
              <p className="mb-lg text-xl font-medium leading-tight text-primary md:text-2xl">
                Thanks for shaping the project
              </p>
            </div>

            {/* XP Breakdown */}
            <div className="mb-xl">
              <div className="border-2 border-primary bg-off-white p-lg">
                <h3 className="mb-md font-mono text-sm font-semibold uppercase tracking-wide text-primary">
                  XP Breakdown
                </h3>
                <div className="space-y-sm">
                  <div className="flex justify-between">
                    <span className="font-mono text-sm text-warm-gray">4 questions × 10 XP</span>
                    <span className="font-mono text-sm font-bold text-off-black">40</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-sm text-warm-gray">Completion bonus</span>
                    <span className="font-mono text-sm font-bold text-off-black">0</span>
                  </div>
                  <div className="border-t border-light-gray pt-sm">
                    <div className="flex justify-between">
                      <span className="font-mono text-base font-bold text-off-black">Total XP</span>
                      <span className="font-mono text-xl font-bold text-primary">+40</span>
                    </div>
                  </div>

                  {/* Progress to next level */}
                  <div className="mt-md">
                    <div className="mb-xs flex justify-between">
                      <span className="font-mono text-xs text-warm-gray">Level Progress</span>
                      <span className="font-mono text-xs text-warm-gray">40/100 XP</span>
                    </div>
                    <div className="h-2 w-full bg-light-gray">
                      <div className="h-2 w-2/5 bg-primary transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Responses */}
            <div className="mb-xl">
              <button
                onClick={() => setShowResponses(!showResponses)}
                className="w-full border border-light-gray bg-off-white p-md font-mono text-sm font-medium text-off-black transition-all duration-100 hover:border-primary"
              >
                {showResponses ? "▼" : "▶"} Your Responses
              </button>

              {showResponses && (
                <div className="mt-md space-y-md border border-light-gray bg-off-white p-md">
                  {questions.map((question, index) => {
                    const responseId = userResponses[index.toString()];
                    const responseText = responseId
                      ? question.options[responseId as keyof typeof question.options]
                      : "No response";

                    return (
                      <div
                        key={question.id}
                        className="border-b border-light-gray pb-sm last:border-b-0"
                      >
                        <div className="font-mono text-xs font-semibold uppercase tracking-wide text-primary">
                          Question {index + 1}
                        </div>
                        <div className="mb-xs text-sm font-medium text-off-black">
                          {question.title}
                        </div>
                        <div className="font-mono text-sm text-primary">→ {responseText}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="mx-auto mb-xl max-w-md">
              <button
                onClick={handleShare}
                className="flex w-full items-center justify-center gap-sm border-2 border-primary bg-primary p-lg font-semibold text-off-white transition-all duration-100 hover:bg-off-black"
              >
                <Share className="size-5" />
                Share Research
              </button>
            </div>

            {/* Back Link */}
            <div className="text-center">
              <button
                onClick={() => (window.location.href = "/")}
                className="font-mono text-sm text-warm-gray transition-all duration-100 hover:text-primary"
              >
                ← Back to Homepage
              </button>
            </div>
          </div>
        </main>

        {/* Newsletter Signup */}
        <NewsletterSignup />

        {/* Footer */}
        <HomepageFooter />
      </div>
    </XPToastProvider>
  );
}
