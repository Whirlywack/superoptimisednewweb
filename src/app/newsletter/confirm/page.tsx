'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/trpc/react';
import { CheckCircle, XCircle, Mail, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [confirmationState, setConfirmationState] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading');
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const confirmMutation = api.newsletter.confirm.useMutation({
    onSuccess: (data) => {
      setConfirmationState('success');
      setEmail(data.email);
    },
    onError: (error) => {
      setConfirmationState('error');
      setErrorMessage(error.message);
    },
  });

  useEffect(() => {
    if (!token) {
      setConfirmationState('invalid');
      return;
    }

    confirmMutation.mutate({ token });
  }, [token, confirmMutation]);

  if (confirmationState === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100">
              <Mail className="size-8 animate-pulse text-blue-600" />
            </div>
            <h1 className="mb-2 text-xl font-bold text-gray-900">Confirming Subscription</h1>
            <p className="mb-6 text-gray-600">Please wait while we confirm your newsletter subscription...</p>
            <div className="mx-auto size-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (confirmationState === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="size-8 text-green-600" />
            </div>
            <h1 className="mb-2 text-xl font-bold text-green-800">Subscription Confirmed!</h1>
            <p className="mb-6 text-gray-600">
              Thank you for subscribing to our newsletter. You&apos;ll receive updates at{' '}
              <strong>{email}</strong>
            </p>
          </div>
          <div className="space-y-4">
            <div className="text-center text-sm text-gray-600">
              <p>You&apos;ll receive:</p>
              <ul className="mt-2 space-y-1">
                <li>• Weekly project updates</li>
                <li>• New research insights</li>
                <li>• Community highlights</li>
                <li>• Early access to new features</li>
              </ul>
            </div>
            <div className="flex flex-col space-y-2">
              <Link href="/" className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                <Home className="mr-2 size-4" />
                Back to Homepage
              </Link>
              <Link href="/research" className="flex w-full items-center justify-center rounded-lg bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300">
                <ArrowRight className="mr-2 size-4" />
                Start Voting
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (confirmationState === 'invalid') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="size-8 text-red-600" />
            </div>
            <h1 className="mb-2 text-xl font-bold text-red-800">Invalid Link</h1>
            <p className="mb-6 text-gray-600">
              The confirmation link is missing or invalid. Please check your email for the correct link.
            </p>
            <Link href="/" className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
              <Home className="mr-2 size-4" />
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="size-8 text-red-600" />
          </div>
          <h1 className="mb-2 text-xl font-bold text-red-800">Confirmation Failed</h1>
          <p className="mb-6 text-gray-600">
            We couldn&apos;t confirm your subscription. {errorMessage}
          </p>
        </div>
        <div className="space-y-4">
          <div className="text-center text-sm text-gray-600">
            <p>Possible reasons:</p>
            <ul className="mt-2 space-y-1 text-left">
              <li>• The link has expired</li>
              <li>• The link has already been used</li>
              <li>• The email is already confirmed</li>
            </ul>
          </div>
          <div className="flex flex-col space-y-2">
            <Link href="/" className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
              <Home className="mr-2 size-4" />
              Back to Homepage
            </Link>
            <Link href="/" className="flex w-full items-center justify-center rounded-lg bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300">
              <Mail className="mr-2 size-4" />
              Try Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewsletterConfirmPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="size-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}