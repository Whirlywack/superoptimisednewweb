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

  const handleShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent("Just voted on @superoptimised's building decisions! 🗳️ Your voice shapes what gets built:")}&url=${encodeURIComponent(window.location.origin + "/research")}`;
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

            {/* Stats */}
            <div className="mb-xl">
              <div className="border border-light-gray bg-off-white p-lg">
                <div className="grid grid-cols-2 gap-lg">
                  <div className="text-center">
                    <div className="font-mono text-3xl font-bold text-off-black">4</div>
                    <div className="font-mono text-sm text-warm-gray">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-3xl font-bold text-primary">+40</div>
                    <div className="font-mono text-sm text-warm-gray">XP Earned</div>
                  </div>
                </div>
              </div>
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
