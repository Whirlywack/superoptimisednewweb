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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Confirming Subscription</h1>
            <p className="text-gray-600 mb-6">Please wait while we confirm your newsletter subscription...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (confirmationState === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-green-800 mb-2">Subscription Confirmed!</h1>
            <p className="text-gray-600 mb-6">
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
              <Link href="/" className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Home className="w-4 h-4 mr-2" />
                Back to Homepage
              </Link>
              <Link href="/research" className="w-full bg-gray-200 text-gray-800 rounded-lg px-4 py-2 flex items-center justify-center hover:bg-gray-300 transition-colors">
                <ArrowRight className="w-4 h-4 mr-2" />
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-xl font-bold text-red-800 mb-2">Invalid Link</h1>
            <p className="text-gray-600 mb-6">
              The confirmation link is missing or invalid. Please check your email for the correct link.
            </p>
            <Link href="/" className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center hover:bg-blue-700 transition-colors">
              <Home className="w-4 h-4 mr-2" />
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-red-800 mb-2">Confirmation Failed</h1>
          <p className="text-gray-600 mb-6">
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
            <Link href="/" className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center justify-center hover:bg-blue-700 transition-colors">
              <Home className="w-4 h-4 mr-2" />
              Back to Homepage
            </Link>
            <Link href="/" className="w-full bg-gray-200 text-gray-800 rounded-lg px-4 py-2 flex items-center justify-center hover:bg-gray-300 transition-colors">
              <Mail className="w-4 h-4 mr-2" />
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}