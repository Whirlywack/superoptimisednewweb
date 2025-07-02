'use client';

import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { XPToastContext } from '../Homepage/XPToastProvider';
import { ChevronRight } from 'lucide-react';

export function PostHeader() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showXPToast } = useContext(XPToastContext);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual newsletter signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmail('');
      showXPToast('+25 XP • Newsletter signup!');
    } catch (error) {
      console.error('Newsletter signup failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <header 
      className="w-full py-lg px-4 border-b border-light-gray"
      aria-labelledby="post-header-heading"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        {/* Post Header Content - Left 8 columns */}
        <div className="col-span-12 md:col-span-8">
          {/* Inline Breadcrumb */}
          <nav className="flex items-center gap-sm text-warm-gray mb-md" style={{ fontSize: '0.875rem' }}>
            <Link href="/" className="text-primary hover:underline font-medium">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-light-gray" />
            <Link href="/journey" className="text-primary hover:underline font-medium">
              Journey
            </Link>
            <ChevronRight className="w-4 h-4 text-light-gray" />
            <span>Day 1 Foundation</span>
          </nav>

          {/* Article Labels */}
          <div className="flex gap-sm mb-sm flex-wrap">
            {['Foundation', 'Philosophy', 'Day 1'].map((label) => (
              <span 
                key={label}
                className="px-sm py-xs rounded font-semibold"
                style={{ 
                  background: 'rgba(100, 116, 139, 0.1)', 
                  color: 'var(--primary)',
                  fontSize: '0.75rem'
                }}
              >
                {label}
              </span>
            ))}
          </div>
          
          {/* Article Info */}
          <div 
            className="flex gap-md text-warm-gray font-mono mb-md flex-wrap"
            style={{ fontSize: '0.875rem' }}
          >
            <time dateTime="2024-01-02">January 2, 2024</time>
            <span>4 min read</span>
            <span>5 comments on X</span>
          </div>

          {/* Article Title */}
          <h1 
            id="post-header-heading"
            className="font-bold text-off-black mb-md"
            style={{ 
              fontSize: 'clamp(3rem, 6vw, 5rem)', 
              fontWeight: 700, 
              lineHeight: 1.1, 
              letterSpacing: '-0.01em' 
            }}
          >
            Why Building in Public Creates Better Products
          </h1>

          {/* Article Description */}
          <p 
            className="text-warm-gray max-w-[65ch]"
            style={{ fontSize: '1.25rem', lineHeight: 1.4 }}
          >
            Day 1 of transparent development. Why community feedback leads to better products, 
            stronger relationships, and authentic learning for everyone involved. Every decision 
            documented, every challenge shared openly.
          </p>
        </div>

        {/* Post Header Sidebar - Right 4 columns */}
        <div className="col-span-12 md:col-span-4">
          {/* Newsletter CTA */}
          <div className="bg-white border-2 border-primary rounded-lg p-lg text-center">
            <h3 
              className="font-bold text-off-black mb-md"
              style={{ fontSize: '1.25rem' }}
            >
              Follow This Journey
            </h3>
            <p 
              className="text-warm-gray mb-lg"
              style={{ fontSize: '0.875rem' }}
            >
              Get weekly insights when this experiment produces valuable lessons. 
              Be part of shaping every decision.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={isSubmitting}
                className={cn(
                  "w-full px-md py-sm border-2 border-light-gray rounded-sm",
                  "text-base bg-white",
                  "focus:outline-none focus:border-primary",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              />
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className={cn(
                  "w-full py-sm bg-primary text-white border-none rounded-sm text-base",
                  "font-semibold cursor-pointer transition-all duration-200",
                  "hover:bg-off-black hover:-translate-y-px",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                )}
              >
                Get Updates
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}