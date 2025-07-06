"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { HomepageNavigation } from "@/components/templates/Homepage/HomepageNavigation";
import { HomepageFooter } from "@/components/templates/Homepage/HomepageFooter";
import { Trophy, CheckCircle, ArrowRight, Star } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const totalXp = searchParams.get("totalXp") || "0";
  const email = searchParams.get("email") || "";

  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <HomepageNavigation />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-2xl px-4">
          {/* Success Icon */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="size-10 text-green-600" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-off-black">🎉 XP Successfully Claimed!</h1>
            <p className="text-lg text-warm-gray">
              Congratulations! Your community participation has been officially recognized.
            </p>
          </div>

          {/* XP Display */}
          <div className="mb-8 rounded-lg border-2 border-primary bg-primary/5 p-8 text-center">
            <Trophy className="mx-auto mb-4 size-12 text-primary" />
            <div className="mb-2 font-mono text-4xl font-bold text-primary">
              {parseInt(totalXp).toLocaleString()} XP
            </div>
            <div className="text-warm-gray">Earned through community voting and engagement</div>
            {email && (
              <div className="mt-4 text-sm text-warm-gray">
                Confirmed for: <strong>{email}</strong>
              </div>
            )}
          </div>

          {/* What This Means */}
          <div className="mb-8 rounded-lg border border-light-gray bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-off-black">
              <Star className="size-5 text-primary" />
              What This Means
            </h2>
            <div className="space-y-3 text-warm-gray">
              <p>• Your anonymous votes have helped shape the direction of Superoptimised</p>
              <p>• You&apos;re part of a community-driven development experiment</p>
              <p>• Your XP represents real impact on product decisions</p>
              <p>• This data helps us understand engagement and improve the platform</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-8 rounded-lg border border-light-gray bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-off-black">Keep Building With Us</h2>
            <div className="space-y-4">
              <LinkButton href="/" className="w-full justify-center" size="lg">
                Continue Voting on Current Decisions
                <ArrowRight className="ml-2 size-4" />
              </LinkButton>

              <LinkButton
                href="/journey"
                variant="outline"
                className="w-full justify-center"
                size="lg"
              >
                Follow the Building Journey
              </LinkButton>

              <LinkButton
                href="https://x.com/superoptimised"
                variant="outline"
                className="w-full justify-center"
                external
                size="lg"
              >
                Join Live Discussions on X
              </LinkButton>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="rounded border-l-4 border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-warm-gray">
              <strong>Privacy protected:</strong> Your XP claim doesn&apos;t affect your anonymous
              voting status. You can continue participating without any changes to your privacy.
            </p>
          </div>
        </div>
      </main>

      <HomepageFooter />
    </div>
  );
}

export default function ClaimXpSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-off-white">
          <div className="text-center">
            <Trophy className="mx-auto mb-4 size-12 animate-pulse text-primary" />
            <p className="text-warm-gray">Loading your XP information...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
