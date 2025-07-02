'use client';

import React, { useState, useContext } from 'react';
import { cn } from '@/lib/utils';
import { XPToastContext } from '../Homepage/XPToastProvider';

export function JourneyHero() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
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

  const handlePollVote = (option: string) => {
    setSelectedPoll(option);
    showXPToast('+5 XP • Thanks for your input!');
    
    // Auto-refresh poll after vote (simulated)
    setTimeout(() => {
      setSelectedPoll(null);
    }, 2000);
  };

  return (
    <section 
      className="w-full py-2xl px-4" 
      style={{ background: 'linear-gradient(135deg, rgba(100, 116, 139, 0.02), rgba(100, 116, 139, 0.05))' }}
      aria-labelledby="journey-hero-heading"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        {/* Hero Content - Left 8 columns */}
        <div className="col-span-12 md:col-span-8">
          {/* Hero Label */}
          <div className="text-sm text-primary font-semibold uppercase tracking-wide mb-sm font-mono">
            Building Journey
          </div>
          
          {/* Hero Title */}
          <h1 
            id="journey-hero-heading"
            className="font-bold text-off-black mb-lg"
            style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.01em' }}
          >
            Every Decision<br />
            Shaped By<br />
            Community
          </h1>
          
          {/* Hero Description */}
          <p className="text-lg text-warm-gray leading-relaxed mb-xl max-w-[65ch]">
            This is the complete building journey where your input drives every technical decision. 
            From initial planning to launch, nothing is hidden. Watch how community feedback 
            transforms ideas into reality, one decision at a time.
          </p>
          
          {/* Current Status */}
          <div 
            className="p-lg mb-xl border-l-4 border-primary"
            style={{ background: 'rgba(100, 116, 139, 0.1)' }}
          >
            <div className="text-sm text-primary font-semibold mb-sm font-mono">
              Current Focus
            </div>
            <div className="text-off-black font-medium mb-sm">
              Building Magic Link Questionnaire System
            </div>
            <div className="text-sm text-warm-gray font-mono">
              Community input: 17 votes across 4 active decisions
            </div>
          </div>

          {/* Journey-Specific Poll */}
          <div className="bg-white border-2 border-light-gray rounded-lg p-md transition-all duration-200">
            <div className="text-sm font-semibold text-off-black mb-md leading-relaxed">
              What's most valuable in a building journey?
            </div>
            <div className="flex gap-sm mb-md">
              <button
                onClick={() => handlePollVote('decisions')}
                className={cn(
                  "flex-1 py-sm px-md text-center text-sm font-medium rounded transition-all duration-200",
                  selectedPoll === 'decisions' 
                    ? "bg-primary text-white border-2 border-primary" 
                    : "bg-light-gray hover:bg-white hover:border-primary border-2 border-transparent"
                )}
              >
                Decision Process
              </button>
              <button
                onClick={() => handlePollVote('lessons')}
                className={cn(
                  "flex-1 py-sm px-md text-center text-sm font-medium rounded transition-all duration-200",
                  selectedPoll === 'lessons' 
                    ? "bg-primary text-white border-2 border-primary" 
                    : "bg-light-gray hover:bg-white hover:border-primary border-2 border-transparent"
                )}
              >
                Lessons Learned
              </button>
            </div>
            <div className="text-xs text-warm-gray text-center">
              <span className="font-mono">Help shape future content</span> • 
              <a href="https://x.com/superoptimised" className="text-primary hover:underline ml-1">
                Discuss on X
              </a>
            </div>
          </div>
        </div>

        {/* Hero Sidebar - Right 4 columns */}
        <div className="col-span-12 md:col-span-4 flex flex-col gap-md">
          {/* Primary Newsletter CTA */}
          <div className="bg-white border-2 border-primary rounded-lg p-lg text-center">
            <h3 className="text-lg font-bold text-off-black mb-md">
              Follow Every Decision
            </h3>
            <p className="text-sm text-warm-gray mb-lg">
              Weekly insights when valuable content is ready. Be among the first 100 builders 
              to get behind-the-scenes development updates.
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
                Get Inside Access
              </button>
            </form>
          </div>

          {/* Live Community Metrics */}
          <div 
            className="rounded-lg p-md text-center"
            style={{ background: 'rgba(100, 116, 139, 0.05)' }}
          >
            <div 
              className="font-bold text-primary font-mono"
              style={{ 
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', 
                fontWeight: 800 
              }}
            >
              17
            </div>
            <div 
              className="text-warm-gray mt-xs"
              style={{ fontSize: '0.75rem' }}
            >
              Community Votes This Week
            </div>
          </div>
          
          <div 
            className="rounded-lg p-md text-center"
            style={{ background: 'rgba(100, 116, 139, 0.05)' }}
          >
            <div 
              className="font-bold text-primary font-mono"
              style={{ 
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', 
                fontWeight: 800 
              }}
            >
              3
            </div>
            <div 
              className="text-warm-gray mt-xs"
              style={{ fontSize: '0.75rem' }}
            >
              Decisions Influenced
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}