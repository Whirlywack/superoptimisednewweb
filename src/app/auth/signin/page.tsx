"use client";

import React, { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-off-white to-light-gray dark:from-off-black dark:to-off-black px-4">
      <Link
        href="/"
        className="group absolute left-4 top-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-warm-gray transition-colors hover:text-off-black dark:text-warm-gray dark:hover:text-off-white"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back
      </Link>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary dark:from-primary dark:to-primary">
              Welcome
            </span>
          </h1>
          <p className="mt-3 text-warm-gray dark:text-warm-gray">
            Enter your email to sign in or create an account
          </p>
        </div>

        <div className="rounded-2xl bg-off-white dark:bg-off-black/50 p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-warm-gray dark:text-warm-gray"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-light-gray dark:border-warm-gray px-4 py-3 text-off-black dark:text-off-white placeholder-warm-gray dark:placeholder-warm-gray shadow-sm dark:bg-off-black focus:border-primary dark:focus:border-primary focus:ring-primary dark:focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary px-4 py-3 text-off-white shadow-lg shadow-primary/20 transition-all hover:from-primary hover:to-primary hover:shadow-xl hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail className="h-5 w-5" />
              {isLoading ? "Sending link..." : "Sign in with Email"}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-warm-gray dark:text-warm-gray">
              By signing in, you agree to our{" "}
              <Link
                href="https://example.com/legal"
                className="font-medium text-primary dark:text-primary hover:text-primary"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
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
