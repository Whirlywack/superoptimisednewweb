import Link from "next/link";

/**
 * Unauthorized access page for admin routes
 * Shown when authenticated users try to access admin routes without proper privileges
 */
export default function AdminUnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-off-white px-4">
      <div className="w-full max-w-md text-center">
        <div className="space-y-6">
          {/* Error Icon */}
          <div className="mx-auto flex size-20 items-center justify-center rounded-full border-2 border-red-500 bg-red-50">
            <svg
              className="size-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 14.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-off-black">Access Denied</h1>
            <p className="text-warm-gray">
              You don&apos;t have permission to access the admin dashboard.
            </p>
            <p className="font-mono text-sm text-warm-gray">
              Admin privileges are required to view this content.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full rounded border-2 border-primary bg-primary px-4 py-3 font-mono text-white transition-colors hover:bg-white hover:text-primary"
            >
              Return to Homepage
            </Link>

            <Link
              href="/auth/signout"
              className="block w-full rounded border-2 border-off-black px-4 py-3 font-mono text-off-black transition-colors hover:bg-off-black hover:text-white"
            >
              Sign Out
            </Link>
          </div>

          {/* Help Text */}
          <div className="border-t border-light-gray pt-6">
            <p className="font-mono text-xs text-warm-gray">
              If you believe this is an error, please contact the system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
