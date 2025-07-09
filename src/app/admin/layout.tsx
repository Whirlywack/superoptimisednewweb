import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserRole } from "@/lib/auth";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

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
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log error for debugging and monitoring
        console.error("Admin dashboard error:", error, errorInfo);
        
        // In production, you might want to send this to a monitoring service
        if (process.env.NODE_ENV === "production") {
          // trackEvent("admin_error", { error: error.message, component: errorInfo.componentStack });
        }
      }}
    >
      <div className="min-h-screen" style={{ backgroundColor: 'var(--off-white)' }}>
        <AdminNavigation userEmail={session.user.email || ""} />
        
        {/* Content with Brutalist Spacing */}
        <main className="mx-auto max-w-7xl px-6" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xl)' }}>
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
}
