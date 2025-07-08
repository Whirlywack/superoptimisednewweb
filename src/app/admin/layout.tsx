import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@/lib/auth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin layout that enforces authentication and admin role requirements
 * This layout wraps all /admin/* routes and ensures only admin users can access them
 */
export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getServerSession(authOptions);

  // Redirect to sign-in if not authenticated
  if (!session || !session.user) {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  // Check if user has admin privileges
  const isAdmin = session.user.role === UserRole.admin || session.user.isAdmin;

  if (!isAdmin) {
    // Redirect to unauthorized page or home with error
    redirect("/admin/unauthorized");
  }

  return (
    <div className="min-h-screen bg-off-white">
      {/* Admin Navigation Header */}
      <header className="border-b-2 border-off-black bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="font-mono text-lg font-bold text-off-black">Admin Dashboard</h1>
              <div className="flex space-x-1 text-sm text-warm-gray">
                <span>•</span>
                <span className="font-mono">{session.user.email}</span>
              </div>
            </div>

            <nav className="flex items-center space-x-6">
              <a
                href="/admin"
                className="font-mono text-sm text-off-black transition-colors hover:text-primary"
              >
                Dashboard
              </a>
              <a
                href="/admin/questions"
                className="font-mono text-sm text-off-black transition-colors hover:text-primary"
              >
                Questions
              </a>
              <a
                href="/admin/analytics"
                className="font-mono text-sm text-off-black transition-colors hover:text-primary"
              >
                Analytics
              </a>
              <a
                href="/admin/content"
                className="font-mono text-sm text-off-black transition-colors hover:text-primary"
              >
                Content
              </a>
              <a
                href="/auth/signout"
                className="rounded border-2 border-off-black bg-off-black px-3 py-1 font-mono text-sm text-white transition-colors hover:bg-white hover:text-off-black"
              >
                Sign Out
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
