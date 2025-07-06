"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function HomepageNavigation() {
  const pathname = usePathname();

  return (
    <nav
      className="w-full border-b border-light-gray bg-off-white px-4 py-8"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto flex max-w-6xl items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link
            href="/"
            className={cn(
              "text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold leading-tight text-off-black",
              "transition-colors duration-200 hover:text-primary",
              "rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            Superoptimised
          </Link>
        </div>

        {/* All Navigation Links - Right Side */}
        <div className="hidden items-center space-x-8 md:flex">
          <Link
            href="/journey"
            className={cn(
              "text-body font-medium",
              pathname === "/journey" ? "font-semibold text-off-black" : "text-warm-gray",
              "transition-colors duration-200 hover:text-primary",
              "rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            Journey
          </Link>
          <Link
            href="/research"
            className={cn(
              "text-body font-medium",
              pathname === "/research" ? "font-semibold text-off-black" : "text-warm-gray",
              "transition-colors duration-200 hover:text-primary",
              "rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            Research
          </Link>
          <Link
            href="/about"
            className={cn(
              "text-body font-medium",
              pathname === "/about" ? "font-semibold text-off-black" : "text-warm-gray",
              "transition-colors duration-200 hover:text-primary",
              "rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            About
          </Link>
          <a
            href="https://x.com/superoptimised"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "text-body font-medium text-warm-gray",
              "transition-colors duration-200 hover:text-primary",
              "rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            Follow on X
          </a>
        </div>
      </div>

      {/* Mobile Navigation Links */}
      <div className="mt-4 border-t border-light-gray pt-4 md:hidden">
        <div className="flex items-center justify-center space-x-6">
          <Link
            href="/journey"
            className={cn(
              "text-body font-medium",
              pathname === "/journey" ? "font-semibold text-off-black" : "text-off-black",
              "transition-colors duration-200 hover:text-primary",
              "rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            Journey
          </Link>
          <Link
            href="/research"
            className={cn(
              "text-body font-medium",
              pathname === "/research" ? "font-semibold text-off-black" : "text-off-black",
              "transition-colors duration-200 hover:text-primary",
              "rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            Research
          </Link>
          <Link
            href="/about"
            className={cn(
              "text-body font-medium",
              pathname === "/about" ? "font-semibold text-off-black" : "text-off-black",
              "transition-colors duration-200 hover:text-primary",
              "rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            )}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
