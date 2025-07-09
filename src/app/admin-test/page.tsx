import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminTestPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="p-8">
        <h1>No Session</h1>
        <p>User is not logged in</p>
      </div>
    );
  }

  // Get user from database
  let dbUser = null;
  try {
    dbUser = await prisma.user.findUnique({
      where: { email: session.user?.email || "" },
      select: {
        id: true,
        email: true,
        role: true,
        isAdmin: true,
        name: true
      }
    });
  } catch (error) {
    console.error("Database error:", error);
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Admin Test Page</h1>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Session Info:</h2>
        <pre className="text-sm">{JSON.stringify(session, null, 2)}</pre>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Database User:</h2>
        <pre className="text-sm">{JSON.stringify(dbUser, null, 2)}</pre>
      </div>

      <div className="bg-blue-100 p-4 rounded">
        <h2 className="font-bold mb-2">Admin Check:</h2>
        <p>session.user.role: {session.user?.role}</p>
        <p>session.user.isAdmin: {String(session.user?.isAdmin)}</p>
        <p>DB role: {dbUser?.role}</p>
        <p>DB isAdmin: {String(dbUser?.isAdmin)}</p>
        <p>Is admin: {String(session.user?.role === "admin" || session.user?.isAdmin)}</p>
      </div>

      <a href="/admin" className="inline-block bg-blue-500 text-white px-4 py-2 rounded">
        Try Admin Page
      </a>
    </div>
  );
}