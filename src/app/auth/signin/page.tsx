"use client";

import React, { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
// No icons needed - pure terminal aesthetic
import Link from "next/link";

function SignInContent() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn("email", { email, callbackUrl });
  };

  return (
    <div className="min-h-screen bg-off-white font-mono">
      {/* Terminal Header */}
      <div className="border-b-2 border-off-black bg-off-black p-4">
        <div className="font-mono text-sm text-green-400">$ sudo login --admin</div>
        <div className="mt-1 font-mono text-sm text-warm-gray">
          Authentication required for administrative access
        </div>
      </div>

      {/* Main Auth Form */}
      <div className="mx-auto max-w-2xl p-8">
        <div className="border-2 border-off-black bg-white">
          {/* Form Header */}
          <div className="border-b border-off-black bg-light-gray p-4">
            <div className="font-mono text-sm text-off-black">ADMIN LOGIN REQUIRED</div>
            <div className="font-mono text-xs text-warm-gray">
              {callbackUrl !== "/" ? `Target: ${callbackUrl}` : "Default access"}
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="mb-2 font-mono text-sm text-off-black">email:</div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-off-black bg-off-white p-3 font-mono text-sm text-off-black placeholder:text-warm-gray focus:border-primary focus:outline-none"
                  placeholder="admin@superoptimised.com"
                />
              </div>

              <div className="border-t border-light-gray pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full border-2 border-off-black bg-off-black p-3 font-mono text-sm text-off-white transition-colors hover:bg-primary hover:text-off-black disabled:bg-warm-gray disabled:text-light-gray"
                >
                  {isLoading ? "[sending magic link...]" : "AUTHENTICATE"}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-off-black bg-light-gray p-4">
            <div className="font-mono text-xs text-warm-gray">
              • Magic link will be sent to your email
            </div>
            <div className="font-mono text-xs text-warm-gray">
              • Admin access only for authorized users
            </div>
            <div className="font-mono text-xs text-warm-gray">• Session expires after 24 hours</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6">
          <Link
            href="/"
            className="font-mono text-sm text-warm-gray transition-colors hover:text-off-black"
          >
            ← back to public site
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
