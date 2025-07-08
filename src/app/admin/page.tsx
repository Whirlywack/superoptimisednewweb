import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Elevated Brutalism Admin Interface
 * Designed for authentic transparency and honest communication
 * Avoids generic admin dashboard patterns
 */
export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="font-mono">
      {/* Terminal-style Welcome */}
      <div className="border-b-2 border-off-black bg-off-black p-8">
        <div className="font-mono text-sm text-green-400">$ whoami</div>
        <div className="mt-1 font-mono text-lg text-off-white">{session?.user?.email}</div>
        <div className="mt-4 font-mono text-sm text-warm-gray">
          Connected to superoptimised production environment
        </div>
      </div>

      {/* Command Line Interface Style */}
      <div className="border-b-2 border-off-black bg-white p-8">
        <div className="space-y-6">
          <div>
            <div className="font-mono text-sm text-warm-gray">$ ls -la /admin/</div>
            <div className="mt-3 space-y-1">
              <div className="font-mono text-sm text-off-black">
                drwxr-xr-x questions/ &nbsp;&nbsp;&nbsp;[manage research database]
              </div>
              <div className="font-mono text-sm text-off-black">
                drwxr-xr-x analytics/ &nbsp;&nbsp;&nbsp;[voting patterns & export]
              </div>
              <div className="font-mono text-sm text-off-black">
                drwxr-xr-x content/ &nbsp;&nbsp;&nbsp;[edit published content]
              </div>
            </div>
          </div>

          <div>
            <div className="font-mono text-sm text-warm-gray">$ status --all</div>
            <div className="mt-3 space-y-1">
              <div className="font-mono text-sm text-off-black">
                ✓ database.connection &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;online
              </div>
              <div className="font-mono text-sm text-off-black">
                ✓ trpc.api &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;responding
              </div>
              <div className="font-mono text-sm text-off-black">
                ✓ realtime.updates &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;active
              </div>
              <div className="font-mono text-sm text-off-black">
                ✓ email.service &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ready
              </div>
            </div>
          </div>

          <div>
            <div className="font-mono text-sm text-warm-gray">$ count --summary</div>
            <div className="mt-3 space-y-1">
              <div className="font-mono text-sm text-off-black">
                research.questions: &nbsp;&nbsp;&nbsp;-- (loading...)
              </div>
              <div className="font-mono text-sm text-off-black">
                votes.total: &nbsp;&nbsp;&nbsp;-- (calculating...)
              </div>
              <div className="font-mono text-sm text-off-black">
                newsletter.subscribers: &nbsp;&nbsp;&nbsp;-- (fetching...)
              </div>
              <div className="font-mono text-sm text-off-black">
                activity.today: &nbsp;&nbsp;&nbsp;-- (analyzing...)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Action Links */}
      <div className="bg-light-gray p-8">
        <div className="mb-6 font-mono text-sm text-warm-gray">Available commands:</div>

        <div className="space-y-0">
          <a
            href="/admin/questions"
            className="block border-b border-warm-gray bg-white p-4 font-mono text-sm text-off-black transition-colors hover:bg-off-black hover:text-off-white"
          >
            cd questions/ {/* Research question management */}
          </a>
          <a
            href="/admin/analytics"
            className="block border-b border-warm-gray bg-white p-4 font-mono text-sm text-off-black transition-colors hover:bg-off-black hover:text-off-white"
          >
            cd analytics/ {/* Data analysis & export tools */}
          </a>
          <a
            href="/admin/content"
            className="block border-b border-warm-gray bg-white p-4 font-mono text-sm text-off-black transition-colors hover:bg-off-black hover:text-off-white"
          >
            cd content/ {/* Content editing interface */}
          </a>
          <div className="block bg-white p-4 font-mono text-sm text-warm-gray">
            exit {/* handled by header navigation */}
          </div>
        </div>
      </div>

      {/* System Notes - Raw & Honest */}
      <div className="border-t-2 border-off-black bg-off-white p-8">
        <div className="mb-4 font-mono text-sm text-warm-gray">{"// Developer notes:"}</div>
        <div className="space-y-2 font-mono text-sm text-off-black">
          <div>• This interface prioritizes function over form</div>
          <div>• No unnecessary dashboards, just direct access to tools</div>
          <div>• Built for administrators who prefer honest, efficient UX</div>
          <div className="mt-4 font-mono text-xs text-warm-gray">
            Last deployed: {new Date().toLocaleDateString()} • Build: production
          </div>
        </div>
      </div>
    </div>
  );
}
