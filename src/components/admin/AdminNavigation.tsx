"use client";

interface AdminNavigationProps {
  userEmail: string;
}

export function AdminNavigation({ userEmail }: AdminNavigationProps) {
  return (
    <>
      <style jsx>{`
        .admin-nav-link {
          font-size: var(--text-sm);
          color: var(--off-white);
          border-right: 2px solid var(--warm-gray);
          background-color: transparent;
          padding: 1rem 1.5rem;
          font-weight: 500;
          text-transform: uppercase;
          transition: all 0.2s ease-out;
          text-decoration: none;
        }
        
        .admin-nav-link:hover {
          background-color: var(--primary);
          color: var(--off-black);
        }
        
        .admin-nav-signout {
          font-size: var(--text-sm);
          color: var(--off-black);
          background-color: var(--primary);
          padding: 1rem 1.5rem;
          font-weight: 500;
          text-transform: uppercase;
          transition: all 0.2s ease-out;
          text-decoration: none;
        }
        
        .admin-nav-signout:hover {
          background-color: var(--off-white);
        }
      `}</style>
      
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
                {userEmail}
              </div>
            </div>

            {/* Brutalist Navigation - Connected Buttons */}
            <nav className="flex items-center" style={{ gap: '0' }}>
              <a href="/admin" className="admin-nav-link">
                Dashboard
              </a>
              <a href="/admin/questions" className="admin-nav-link">
                Questions
              </a>
              <a href="/admin/analytics" className="admin-nav-link">
                Analytics
              </a>
              <a href="/admin/content" className="admin-nav-link">
                Content
              </a>
              <a href="/auth/signout" className="admin-nav-signout">
                Sign Out
              </a>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}