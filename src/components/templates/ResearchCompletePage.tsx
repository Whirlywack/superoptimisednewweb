"use client";

import React, { useState, useContext } from "react";
import { cn } from "@/lib/utils";
import { HomepageNavigation } from "./Homepage/HomepageNavigation";
import { HomepageFooter } from "./Homepage/HomepageFooter";
import { XPToastProvider, XPToastContext } from "./Homepage/XPToastProvider";
import { Share, ArrowRight, Check } from "lucide-react";

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
    <section className="w-full bg-white border-t border-light-gray px-4 py-xl">
      <div className="mx-auto max-w-2xl text-center">
        <h3 className="text-xl font-bold text-off-black mb-sm">
          Get Decision Updates
        </h3>
        <p className="text-warm-gray mb-lg">
          Be the first to know when new community decisions need your input.
        </p>
        
        <form onSubmit={handleSubmit} className="flex gap-sm max-w-md mx-auto">
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
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent("Just completed the community research for @superoptimised's building project! 🗳️ Your voice can shape what gets built next:")}&url=${encodeURIComponent(window.location.origin + '/research')}`;
    window.open(url, '_blank');
    showXPToast("social-share");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/research');
    showXPToast("link-copy");
  };

  return (
    <XPToastProvider>
      <div className="min-h-screen flex flex-col bg-off-white">
        {/* Navigation */}
        <HomepageNavigation />

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-xl">
          <div className="w-full max-w-2xl text-center">
            {/* Success Icon */}
            <div className="mb-xl">
              <div className="w-24 h-24 bg-primary flex items-center justify-center mx-auto mb-lg">
                <Check className="w-12 h-12 text-white" strokeWidth={3} />
              </div>
              <h1 className="text-hero font-bold text-off-black mb-lg leading-tight">
                Thank You for
                <br />
                Your Input!
              </h1>
              <p className="text-warm-gray text-lg leading-relaxed max-w-prose mx-auto">
                Your votes help shape the future of this project. The community voice drives every major decision, 
                and your input is now part of that process.
              </p>
            </div>

            {/* Stats */}
            <div className="mb-xl">
              <div className="bg-white border border-light-gray p-lg">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wide text-primary mb-md">
                  Your Impact
                </h3>
                <div className="grid grid-cols-2 gap-lg">
                  <div className="text-center">
                    <div className="font-mono text-2xl font-bold text-off-black">4</div>
                    <div className="text-sm text-warm-gray">Questions Answered</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-2xl font-bold text-primary">+40</div>
                    <div className="text-sm text-warm-gray">XP Earned</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-md mb-xl max-w-md mx-auto">
              <button
                onClick={handleShare}
                className="w-full bg-primary text-white p-lg font-semibold transition-all duration-200 hover:bg-off-black flex items-center justify-center gap-sm"
              >
                <Share className="w-5 h-5" />
                Share on X to get more input
              </button>
              
              <button
                onClick={handleCopyLink}
                className="w-full border-2 border-light-gray text-off-black p-lg font-semibold transition-all duration-200 hover:border-primary"
              >
                Copy Research Link
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full border-2 border-light-gray text-off-black p-lg font-semibold transition-all duration-200 hover:border-primary flex items-center justify-center gap-sm"
              >
                Back to Homepage
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Community Impact */}
            <div className="bg-white border-2 border-primary p-lg">
              <h3 className="font-bold text-off-black mb-sm">What Happens Next?</h3>
              <div className="text-left space-y-sm text-warm-gray">
                <div className="flex items-start gap-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">Your votes are analyzed with the community input</span>
                </div>
                <div className="flex items-start gap-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">Decisions are made based on majority preference</span>
                </div>
                <div className="flex items-start gap-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">Implementation progress is shared transparently</span>
                </div>
                <div className="flex items-start gap-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">New decisions are posted when input is needed</span>
                </div>
              </div>
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