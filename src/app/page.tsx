import React from "react";
import ClientProvider from "@/components/ClientProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

async function getSession() {
  try {
    const session = await getServerSession(authOptions);
    return session;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

export default async function Page() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* {session && <NavigationBar />} */}

      <main className="flex-1 flex flex-col w-full mx-auto">
        <ClientProvider>
          <div className="flex-1 flex items-start justify-center  bg-gradient-to-b from-off-white to-light-gray dark:from-off-black dark:to-off-black">
            {session ? (
              // Authenticated View
              <section className="max-w-7xl w-full space-y-8 animate-fade-in">
                <h1> Welcome {session.user?.name}</h1>
              </section>
            ) : (
              // Marketing View
              <section className="max-w-7xl w-full space-y-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <h1 className="text-4xl font-bold mt-10">
                    Welcome - Click the button below to get started
                  </h1>
                  <Link
                    href="/auth/signin"
                    className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-off-white rounded-lg px-8 py-4 text-lg font-medium shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </section>
            )}
          </div>
        </ClientProvider>
      </main>

      {/* Footer */}
      <footer className="border-t border-light-gray dark:border-warm-gray bg-off-white dark:bg-off-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-warm-gray dark:text-warm-gray">
            © {new Date().getFullYear()} All Rights Reserved
          </span>
          <div className="flex items-center gap-6 text-sm text-warm-gray dark:text-warm-gray">
            <Link
              href="/privacy"
              className="hover:text-primary dark:hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary dark:hover:text-primary"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary dark:hover:text-primary"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
