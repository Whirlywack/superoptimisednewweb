import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Main admin dashboard page
 * Displays overview statistics and quick access to admin functions
 */
export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-off-black">Admin Dashboard</h1>
        <p className="text-warm-gray">
          Welcome back, {session?.user?.name || session?.user?.email}
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded border-2 border-light-gray bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm text-warm-gray">Total Questions</p>
              <p className="text-2xl font-bold text-off-black">--</p>
            </div>
            <div className="rounded-full border-2 border-primary bg-primary/10 p-3">
              <svg
                className="size-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded border-2 border-light-gray bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm text-warm-gray">Total Votes</p>
              <p className="text-2xl font-bold text-off-black">--</p>
            </div>
            <div className="rounded-full border-2 border-primary bg-primary/10 p-3">
              <svg
                className="size-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded border-2 border-light-gray bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm text-warm-gray">Newsletter Subscribers</p>
              <p className="text-2xl font-bold text-off-black">--</p>
            </div>
            <div className="rounded-full border-2 border-primary bg-primary/10 p-3">
              <svg
                className="size-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded border-2 border-light-gray bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-sm text-warm-gray">Active Users</p>
              <p className="text-2xl font-bold text-off-black">--</p>
            </div>
            <div className="rounded-full border-2 border-primary bg-primary/10 p-3">
              <svg
                className="size-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-off-black">Quick Actions</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <a
            href="/admin/questions"
            className="block rounded border-2 border-light-gray bg-white p-6 transition-colors hover:border-primary hover:bg-primary/5"
          >
            <div className="space-y-2">
              <h3 className="font-mono font-semibold text-off-black">Manage Questions</h3>
              <p className="text-sm text-warm-gray">Create, edit, and manage research questions</p>
            </div>
          </a>

          <a
            href="/admin/analytics"
            className="block rounded border-2 border-light-gray bg-white p-6 transition-colors hover:border-primary hover:bg-primary/5"
          >
            <div className="space-y-2">
              <h3 className="font-mono font-semibold text-off-black">View Analytics</h3>
              <p className="text-sm text-warm-gray">Monitor voting patterns and engagement</p>
            </div>
          </a>

          <a
            href="/admin/content"
            className="block rounded border-2 border-light-gray bg-white p-6 transition-colors hover:border-primary hover:bg-primary/5"
          >
            <div className="space-y-2">
              <h3 className="font-mono font-semibold text-off-black">Content Management</h3>
              <p className="text-sm text-warm-gray">Edit site content and blog posts</p>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-off-black">Recent Activity</h2>

        <div className="rounded border-2 border-light-gray bg-white p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-light-gray pb-4">
              <div>
                <p className="font-mono text-sm text-off-black">System Status</p>
                <p className="text-xs text-warm-gray">All systems operational</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="size-2 rounded-full bg-green-500"></div>
                <span className="font-mono text-xs text-green-600">Online</span>
              </div>
            </div>

            <p className="font-mono text-sm text-warm-gray">
              Recent activity will be displayed here once analytics are connected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
