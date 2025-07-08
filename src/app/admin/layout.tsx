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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--off-white)' }}>
      {/* Elevated Brutalism Admin Header */}
      <header style={{ backgroundColor: 'var(--off-black)' }}>
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between">
            {/* Brand & Context - Brutalist Typography */}
            <div>
              <h1 
                className="font-bold uppercase tracking-tight"
                style={{ 
                  fontSize: 'var(--text-xl)', 
                  color: 'var(--off-white)',
                  letterSpacing: '-0.02em'
                }}
              >
                ADMINISTRATION
              </h1>
              <div 
                className="mt-2 font-medium"
                style={{ 
                  fontSize: 'var(--text-sm)', 
                  color: 'var(--warm-gray)' 
                }}
              >
                {session.user.email}
              </div>
            </div>

            {/* Brutalist Navigation - Connected Buttons */}
            <nav className="flex items-center" style={{ gap: '0' }}>
              <a
                href="/admin"
                className="px-6 py-3 font-medium uppercase transition-all duration-200 ease-out"
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--off-white)',
                  borderRight: '2px solid var(--warm-gray)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--off-black)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--off-white)';
                }}
              >
                Dashboard
              </a>
              <a
                href="/admin/questions"
                className="px-6 py-3 font-medium uppercase transition-all duration-200 ease-out"
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--off-white)',
                  borderRight: '2px solid var(--warm-gray)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--off-black)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--off-white)';
                }}
              >
                Questions
              </a>
              <a
                href="/admin/analytics"
                className="px-6 py-3 font-medium uppercase transition-all duration-200 ease-out"
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--off-white)',
                  borderRight: '2px solid var(--warm-gray)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--off-black)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--off-white)';
                }}
              >
                Analytics
              </a>
              <a
                href="/admin/content"
                className="px-6 py-3 font-medium uppercase transition-all duration-200 ease-out"
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--off-white)',
                  borderRight: '2px solid var(--warm-gray)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--off-black)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--off-white)';
                }}
              >
                Content
              </a>
              <a
                href="/auth/signout"
                className="px-6 py-3 font-medium uppercase transition-all duration-200 ease-out"
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--off-black)',
                  backgroundColor: 'var(--primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--off-white)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary)';
                }}
              >
                Sign Out
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Content with Brutalist Spacing */}
      <main className="mx-auto max-w-7xl px-6" style={{ paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xl)' }}>
        {children}
      </main>
    </div>
  );
}
