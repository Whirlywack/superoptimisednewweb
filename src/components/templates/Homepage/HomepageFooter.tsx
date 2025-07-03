"use client";

import React from "react";
import Link from "next/link";

const footerLinks = [
  { label: "Journey", href: "/journey" },
  { label: "About", href: "/about" },
];

export function HomepageFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t border-light-gray bg-primary/[0.02] px-4 py-16"
      role="contentinfo"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 flex items-center justify-between">
            <div>
              <span className="text-sm text-warm-gray">
                © {currentYear} Superoptimised. Built transparently.
              </span>
            </div>
            <div className="flex items-center gap-lg">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-warm-gray transition-colors duration-200 hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}

              {/* X Link */}
              <a
                href="https://x.com/superoptimised"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-warm-gray transition-colors duration-200 hover:text-primary"
              >
                X
              </a>

              {/* Contact Link */}
              <a
                href="mailto:hello@superoptimised.com"
                className="text-sm text-warm-gray transition-colors duration-200 hover:text-primary"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
