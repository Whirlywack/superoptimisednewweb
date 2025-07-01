"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

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
          <h1 className="text-4xl font-bold text-warm-gray dark:text-warm-gray">
            Authentication Error
          </h1>
          <p className="mt-3 text-warm-gray dark:text-warm-gray">
            {error === "AccessDenied"
              ? "Access denied."
              : "An error occurred during authentication. Please try again."}
          </p>
        </div>

        <div className="flex justify-center">
          <Link
            href="/auth/signin"
            className="rounded-lg bg-gradient-to-r from-primary to-primary px-6 py-3 text-off-white shadow-lg shadow-primary/20 transition-all hover:from-primary hover:to-primary hover:shadow-xl hover:shadow-primary/30"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
