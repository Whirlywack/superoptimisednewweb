import React from "react";
import { HomepageNavigation } from "@/components/templates/Homepage/HomepageNavigation";
import { HomepageFooter } from "@/components/templates/Homepage/HomepageFooter";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export default function ClaimXpErrorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <HomepageNavigation />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-2xl px-4">
          {/* Error Icon */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-orange-100">
              <AlertTriangle className="size-10 text-orange-600" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-off-black">Something Went Wrong</h1>
            <p className="text-lg text-warm-gray">
              We encountered an unexpected error while processing your XP claim.
            </p>
          </div>

          {/* Error Info */}
          <div className="mb-8 rounded-lg border border-light-gray bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-off-black">
              Don&apos;t worry, your XP is safe
            </h2>
            <div className="space-y-3 text-warm-gray">
              <p>
                This is likely a temporary issue with our servers. Your XP record is secure and
                hasn&apos;t been lost.
              </p>
              <p>You can try again in a few minutes, or contact support if the problem persists.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-primary py-3 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-off-black"
            >
              <RefreshCw className="size-4" />
              Try Again
            </button>

            <LinkButton href="/" variant="outline" className="w-full justify-center" size="lg">
              <ArrowLeft className="mr-2 size-4" />
              Back to Voting
            </LinkButton>

            <LinkButton
              href="https://x.com/superoptimised"
              variant="outline"
              className="w-full justify-center"
              external
              size="lg"
            >
              Report Issue on X
            </LinkButton>
          </div>

          {/* Support Note */}
          <div className="mt-8 rounded border-l-4 border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-warm-gray">
              <strong>Error Code:</strong> XP_CLAIM_ERROR
              <br />
              <strong>Time:</strong> {new Date().toISOString()}
              <br />
              Include this information when contacting support.
            </p>
          </div>
        </div>
      </main>

      <HomepageFooter />
    </div>
  );
}
