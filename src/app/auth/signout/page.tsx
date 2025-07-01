"use client";

import React from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, LogOut } from "lucide-react";

export default function SignOut() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: "/" });
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
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-light-gray dark:bg-warm-gray">
            <LogOut className="h-6 w-6 text-primary dark:text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-off-black dark:text-off-white">
            Sign out
          </h1>
          <p className="mt-3 text-warm-gray dark:text-warm-gray">
            Are you sure you want to sign out?
          </p>
        </div>

        <div className="rounded-2xl bg-off-white dark:bg-off-black/50 p-8 shadow-xl">
          <div className="flex flex-col gap-4">
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary px-4 py-3 text-off-white shadow-lg shadow-primary/20 transition-all hover:from-primary hover:to-primary hover:shadow-xl hover:shadow-primary/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="h-5 w-5" />
              {isLoading ? "Signing out..." : "Sign out"}
            </button>

            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-light-gray dark:border-warm-gray bg-off-white dark:bg-off-black px-4 py-3 text-warm-gray dark:text-warm-gray shadow-sm transition-all hover:bg-light-gray dark:hover:bg-warm-gray focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
