import React from "react";
import { HomepageNavigation } from "@/components/templates/Homepage/HomepageNavigation";
import { HomepageFooter } from "@/components/templates/Homepage/HomepageFooter";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export default function ClaimXpInvalidPage() {
  return (
    <div className="flex min-h-screen flex-col bg-off-white">
      <HomepageNavigation />
      
      <main className="flex-1 py-16">
        <div className="mx-auto max-w-2xl px-4">
          {/* Error Icon */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="size-10 text-red-600" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-off-black">
              Invalid or Expired Link
            </h1>
            <p className="text-lg text-warm-gray">
              This XP claim link is either invalid, expired, or has already been used.
            </p>
          </div>

          {/* Possible Reasons */}
          <div className="mb-8 rounded-lg border border-light-gray bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-off-black">
              What might have happened?
            </h2>
            <div className="space-y-3 text-warm-gray">
              <p>• The link has expired (links are valid for 24 hours)</p>
              <p>• The XP has already been claimed using this link</p>
              <p>• The link was copied incorrectly or is malformed</p>
              <p>• There was an issue with the email delivery</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mb-8 rounded-lg border border-light-gray bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-off-black">
              What you can do
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-1 size-5 text-primary" />
                <div>
                  <p className="font-medium text-off-black">Check your email</p>
                  <p className="text-sm text-warm-gray">
                    Look for the most recent XP claim email and use that link. 
                    Check your spam folder too.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-1 size-5 text-primary" />
                <div>
                  <p className="font-medium text-off-black">Request a new link</p>
                  <p className="text-sm text-warm-gray">
                    Go back to the voting page and try claiming your XP again 
                    if the link has expired.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <LinkButton
              href="/"
              className="w-full justify-center"
              size="lg"
            >
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
              Contact Support on X
            </LinkButton>
          </div>

          {/* Help Note */}
          <div className="mt-8 rounded border-l-4 border-primary/20 bg-primary/5 p-4">
            <p className="text-sm text-warm-gray">
              <strong>Need help?</strong> If you continue having issues claiming your XP, 
              reach out on X (@superoptimised) and we'll help you resolve it.
            </p>
          </div>
        </div>
      </main>
      
      <HomepageFooter />
    </div>
  );
}