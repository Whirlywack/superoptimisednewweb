'use client';

import React from 'react';
import Link from 'next/link';
import { Twitter, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

const footerLinks = [
  { label: 'Journey', href: '/journey' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const socialLinks = [
  {
    label: 'X (Twitter)',
    href: 'https://x.com/superoptimised',
    icon: Twitter,
  },
];

export function HomepageFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="w-full bg-off-white border-t border-light-gray px-4 py-8"
      role="contentinfo"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div className="text-small text-warm-gray text-center md:text-left">
            © {currentYear} Superoptimised. Built transparently.
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-small">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-warm-gray hover:text-primary transition-colors duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Social Links */}
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-1 text-warm-gray hover:text-primary",
                    "transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
                  )}
                  aria-label={social.label}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">X</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Additional Footer Info */}
        <div className="mt-6 pt-6 border-t border-light-gray text-center">
          <p className="text-small text-warm-gray max-w-2xl mx-auto leading-relaxed">
            This website is built in public with complete transparency. 
            Every decision, challenge, and lesson learned is documented and shared with the community.
          </p>
        </div>
      </div>
    </footer>
  );
}