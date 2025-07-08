import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Main admin dashboard page
 * Displays overview statistics and quick access to admin functions
 */
export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-12">
      {/* Header Block - Elevated Brutalism Style */}
      <div className="border-2 border-off-black bg-off-black p-8">
        <h1 className="font-mono text-2xl font-bold text-off-white">System Overview</h1>
        <p className="mt-2 font-mono text-sm text-warm-gray">
          {session?.user?.name || session?.user?.email?.split("@")[0]} • Administrator Access
        </p>
      </div>

      {/* Stats Grid - Minimal Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="border-2 border-off-black bg-white p-6">
          <div className="font-mono text-xs uppercase tracking-wide text-warm-gray">Questions</div>
          <div className="mt-2 font-mono text-3xl font-bold text-off-black">--</div>
        </div>

        <div className="border-2 border-off-black bg-white p-6">
          <div className="font-mono text-xs uppercase tracking-wide text-warm-gray">
            Total Votes
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-off-black">--</div>
        </div>

        <div className="border-2 border-off-black bg-white p-6">
          <div className="font-mono text-xs uppercase tracking-wide text-warm-gray">
            Subscribers
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-off-black">--</div>
        </div>

        <div className="border-2 border-off-black bg-white p-6">
          <div className="font-mono text-xs uppercase tracking-wide text-warm-gray">
            Active Today
          </div>
          <div className="mt-2 font-mono text-3xl font-bold text-off-black">--</div>
        </div>
      </div>

      {/* Action Matrix */}
      <div className="space-y-4">
        <h2 className="font-mono text-lg font-bold text-off-black">Management Actions</h2>

        <div className="grid grid-cols-1 gap-0 border-2 border-off-black md:grid-cols-3">
          <a
            href="/admin/questions"
            className="border-b border-off-black bg-white p-8 transition-colors hover:bg-primary hover:text-off-black md:border-b-0 md:border-r"
          >
            <div className="font-mono text-sm font-bold text-off-black">/questions</div>
            <div className="mt-1 text-sm text-warm-gray">
              Create, activate, and schedule research questions
            </div>
          </a>

          <a
            href="/admin/analytics"
            className="border-b border-off-black bg-white p-8 transition-colors hover:bg-primary hover:text-off-black md:border-b-0 md:border-r"
          >
            <div className="font-mono text-sm font-bold text-off-black">/analytics</div>
            <div className="mt-1 text-sm text-warm-gray">View voting patterns and export data</div>
          </a>

          <a
            href="/admin/content"
            className="bg-white p-8 transition-colors hover:bg-primary hover:text-off-black"
          >
            <div className="font-mono text-sm font-bold text-off-black">/content</div>
            <div className="mt-1 text-sm text-warm-gray">Edit content blocks and publish posts</div>
          </a>
        </div>
      </div>

      {/* System Status - Terminal Style */}
      <div className="space-y-4">
        <h2 className="font-mono text-lg font-bold text-off-black">System Status</h2>

        <div className="border-2 border-off-black bg-off-black p-6">
          <div className="space-y-2 font-mono text-sm">
            <div className="flex items-center justify-between">
              <span className="text-off-white">Database Connection</span>
              <span className="text-green-400">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-off-white">tRPC API</span>
              <span className="text-green-400">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-off-white">Real-time Updates</span>
              <span className="text-green-400">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-off-white">Email Service</span>
              <span className="text-green-400">ACTIVE</span>
            </div>
            <div className="mt-4 border-t border-warm-gray pt-2">
              <span className="text-warm-gray">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
