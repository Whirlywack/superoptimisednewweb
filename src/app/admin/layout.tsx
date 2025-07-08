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
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen bg-off-white">
      {/* Elevated Brutalism Admin Header */}
      <header className="bg-off-black">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Brand & User Context */}
            <div className="space-y-1">
              <h1 className="font-mono text-xl font-bold text-off-white">/admin</h1>
              <div className="font-mono text-xs text-warm-gray">{session.user.email}</div>
            </div>

            {/* Minimal Navigation */}
            <nav className="flex items-center gap-0">
              <a
                href="/admin"
                className="border-r border-warm-gray px-4 py-2 font-mono text-sm text-off-white transition-colors hover:bg-primary hover:text-off-black"
              >
                Dashboard
              </a>
              <a
                href="/admin/questions"
                className="border-r border-warm-gray px-4 py-2 font-mono text-sm text-off-white transition-colors hover:bg-primary hover:text-off-black"
              >
                Questions
              </a>
              <a
                href="/admin/analytics"
                className="border-r border-warm-gray px-4 py-2 font-mono text-sm text-off-white transition-colors hover:bg-primary hover:text-off-black"
              >
                Analytics
              </a>
              <a
                href="/admin/content"
                className="border-r border-warm-gray px-4 py-2 font-mono text-sm text-off-white transition-colors hover:bg-primary hover:text-off-black"
              >
                Content
              </a>
              <a
                href="/auth/signout"
                className="bg-primary px-4 py-2 font-mono text-sm text-off-black transition-colors hover:bg-off-white"
              >
                Exit
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Content with Proper Spacing */}
      <main className="mx-auto max-w-7xl space-y-12 px-4 py-12">{children}</main>
    </div>
  );
}
