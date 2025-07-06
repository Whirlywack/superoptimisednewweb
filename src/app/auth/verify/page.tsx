"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function VerifyRequest() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-off-white to-light-gray px-4 dark:from-off-black dark:to-off-black">
      <Link
        href="/"
        className="group absolute left-4 top-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-warm-gray transition-colors hover:text-off-black dark:text-warm-gray dark:hover:text-off-white"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        Back
      </Link>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-light-gray dark:bg-warm-gray">
            <Mail className="size-6 text-primary dark:text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-off-black dark:text-off-white">
            Check your email
          </h1>
          <p className="mt-3 text-warm-gray dark:text-warm-gray">
            A sign in link has been sent to your email address. Please check your inbox and click
            the link to continue.
          </p>
        </div>

        <div className="rounded-2xl bg-off-white p-8 shadow-xl dark:bg-off-black/50">
          <div className="space-y-4 text-sm text-warm-gray dark:text-warm-gray">
            <p>
              <strong>Didn&apos;t receive the email?</strong>
            </p>
            <ul className="list-disc space-y-2 pl-4">
              <li>Check your spam folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>
                If you still haven&apos;t received it after a few minutes,{" "}
                <Link
                  href="/auth/signin"
                  className="text-primary hover:text-primary dark:text-primary"
                >
                  try signing in again
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
