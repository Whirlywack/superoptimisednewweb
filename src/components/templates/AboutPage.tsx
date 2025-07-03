'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { HomepageNavigation } from './Homepage/HomepageNavigation';
import { HomepageFooter } from './Homepage/HomepageFooter';
import { XPToastProvider } from './Homepage/XPToastProvider';

export function AboutPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      setShowToast(true);
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }, 1000);
  };

  return (
    <XPToastProvider>
      <div className="flex min-h-screen flex-col bg-off-white">
        {/* Navigation */}
        <HomepageNavigation />

        {/* Main Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-16 bg-gradient-to-br from-primary/[0.02] to-primary/[0.05]">
            <div className="container mx-auto max-w-6xl px-8">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8">
                <div className="mb-4 text-sm font-semibold text-primary uppercase tracking-wide font-mono">
                  Solo Developer Experiment
                </div>
                <h1 className="mb-8 text-5xl font-bold leading-[1.1] text-off-black">
                  Your Input Shapes<br />What Gets Built
                </h1>
                <p className="mb-12 text-lg leading-relaxed text-warm-gray max-w-[65ch]">
                  This is an experiment in building products where the community has direct say 
                  in every decision. We're a small team (just me) sharing failures and wins 
                  transparently, learning together, and letting your feedback guide what gets 
                  created next.
                </p>
                
                {/* Inline Stats */}
                <div className="flex gap-12 p-8 bg-primary/[0.05] rounded-lg border-l-4 border-primary">
                  <div className="flex flex-col items-center min-w-[80px]">
                    <div className="text-lg font-extrabold text-primary font-mono">1</div>
                    <div className="text-xs text-warm-gray text-center mt-2">Day Building</div>
                  </div>
                  <div className="flex flex-col items-center min-w-[80px]">
                    <div className="text-lg font-extrabold text-primary font-mono">17</div>
                    <div className="text-xs text-warm-gray text-center mt-2">Community Votes</div>
                  </div>
                  <div className="flex flex-col items-center min-w-[80px]">
                    <div className="text-lg font-extrabold text-primary font-mono">∞</div>
                    <div className="text-xs text-warm-gray text-center mt-2">Things to Learn</div>
                  </div>
                </div>
              </div>

              <div className="col-span-4">
                {/* Newsletter CTA */}
                <div className="bg-white border-2 border-light-gray rounded-lg p-8 text-center">
                  <h3 className="mb-4 font-semibold text-off-black">Join the Experiment</h3>
                  <p className="mb-8 text-sm text-warm-gray">
                    Get updates when there's something worth sharing. No schedule, 
                    just progress and lessons learned together.
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <input 
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-light-gray rounded bg-white text-base focus:outline-none focus:border-primary"
                      required
                    />
                    <Button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? 'Counting you in...' : 'Count Me In'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-16 pb-24">
          <div className="container mx-auto max-w-6xl px-8">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8">
                <p className="mb-8 text-warm-gray max-w-[65ch]">
                  Like most developers, I've built plenty of things that nobody wanted. 
                  The pattern was always the same: great idea (I thought), months of solo development, 
                  launch to silence, wonder what went wrong.
                </p>
                
                <p className="mb-8 text-warm-gray max-w-[65ch]">
                  The problem wasn't the code—it was the isolation. I was solving problems 
                  that existed mostly in my head, building features based on assumptions 
                  instead of conversations with real people.
                </p>
                
                <div className="my-12 bg-primary/[0.1] border-l-4 border-primary p-8 italic max-w-[65ch]">
                  "What if instead of building and then asking for feedback, 
                  I asked for feedback while building?"
                </div>
                
                <p className="mb-8 text-warm-gray max-w-[65ch]">
                  So here's the experiment: I'm building everything completely in the open. 
                  Every technical decision gets discussed on{' '}
                  <a href="https://x.com/superoptimised" className="text-primary font-medium hover:underline">
                    X (@superoptimised)
                  </a>. 
                  Every mistake gets documented. Every success gets shared transparently.
                </p>
                
                <p className="mb-8 text-warm-gray max-w-[65ch]">
                  Right now, we're building a magic link questionnaire system because the 
                  community voted that traditional signup forms kill honest feedback. But 
                  that choice came from real conversations, not boardroom assumptions.
                </p>
                
                <p className="mb-8 text-warm-gray max-w-[65ch]">
                  I don't know where this experiment will lead. Maybe we'll build something 
                  genuinely useful. Maybe we'll discover that certain approaches don't work. 
                  Maybe we'll learn things that change how we think about building products altogether.
                </p>
                
                <p className="mb-8 text-warm-gray max-w-[65ch]">
                  What I do know is that every conversation so far has been more valuable than 
                  any assumption I would have made alone. <strong>Your input doesn't just inform 
                  the product—it becomes part of the story.</strong>
                </p>
                
                <p className="text-warm-gray max-w-[65ch]">
                  Want to help shape what gets built next? The most interesting conversations 
                  happen in real-time, where your feedback can change the direction before 
                  decisions are locked in.
                </p>
              </div>

              <div className="col-span-4">
                <div className="sticky top-12 space-y-8">
                  {/* Actions */}
                  <div className="bg-white border-2 border-light-gray rounded-lg p-8">
                    <h3 className="mb-4 font-semibold text-off-black">Take Action</h3>
                    <ul className="space-y-4">
                      <li>
                        <Link 
                          href="/journey"
                          className="flex items-center justify-center gap-2 py-3 text-primary font-medium border-2 border-transparent rounded hover:bg-primary/[0.05] hover:border-light-gray transition-all duration-200"
                        >
                          <span>📝</span>
                          <span>Read the full journey</span>
                        </Link>
                      </li>
                      <li>
                        <Link 
                          href="/questionnaire"
                          className="flex items-center justify-center gap-2 py-3 text-primary font-medium border-2 border-transparent rounded hover:bg-primary/[0.05] hover:border-light-gray transition-all duration-200"
                        >
                          <span>🗳️</span>
                          <span>Vote on current decisions</span>
                        </Link>
                      </li>
                      <li>
                        <a 
                          href="https://x.com/superoptimised"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 py-3 text-primary font-medium border-2 border-transparent rounded hover:bg-primary/[0.05] hover:border-light-gray transition-all duration-200"
                        >
                          <span>🐦</span>
                          <span>Join live conversations</span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Current Focus */}
                  <div className="bg-white border-2 border-light-gray rounded-lg p-8">
                    <h3 className="mb-4 font-semibold text-off-black">Right Now</h3>
                    <div className="bg-primary/[0.02] rounded-lg p-4 text-left">
                      <div className="flex justify-between items-center py-2 border-b border-light-gray">
                        <span className="text-sm text-warm-gray">Building</span>
                        <span className="text-sm font-semibold text-primary font-mono">Magic Links</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-light-gray">
                        <span className="text-sm text-warm-gray">Learning</span>
                        <span className="text-sm font-semibold text-primary font-mono">User Feedback</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-warm-gray">Next</span>
                        <span className="text-sm font-semibold text-primary font-mono">You Decide</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </section>
        </main>

        {/* Footer */}
        <HomepageFooter />
      </div>

      {/* XP Toast */}
      {showToast && (
        <div className="fixed top-5 right-5 bg-primary text-white px-6 py-3 rounded-lg font-bold font-mono transform transition-all duration-300 z-50 shadow-lg border-2 border-white/20">
          +5 XP • Thanks for joining the experiment!
        </div>
      )}
    </XPToastProvider>
  );
}