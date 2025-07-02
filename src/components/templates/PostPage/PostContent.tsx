'use client';

import React, { useState, useContext } from 'react';
import { cn } from '@/lib/utils';
import { XPToastContext } from '../Homepage/XPToastProvider';
import { BarChart3, MessageCircle, Target } from 'lucide-react';

export function PostContent() {
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showXPToast } = useContext(XPToastContext);

  const handlePollVote = (option: string) => {
    setSelectedPoll(option);
    showXPToast('+10 XP • Building momentum!');
    
    // Auto-refresh poll after vote (simulated)
    setTimeout(() => {
      setSelectedPoll(null);
    }, 2000);
  };

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
    <section className="w-full py-xl px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        {/* Post Content - Left 8 columns */}
        <div className="col-span-12 md:col-span-8">
          {/* Main Content */}
          <div className="max-w-[65ch]">
            <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Traditional development happens behind closed doors. Decisions get made in isolation, 
              problems stay hidden until launch, and communities only see the polished final product. 
              <strong>I'm doing the opposite.</strong>
            </p>

            <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Starting today, every technical decision, every design choice, and every mistake will be 
              documented transparently. Not because transparency is trendy, but because it leads to 
              fundamentally better products.
            </p>

            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 600, 
              lineHeight: 1.2, 
              margin: '4rem 0 3rem 0' 
            }}>
              The Problem with Secret Development
            </h2>

            <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Most products fail not because of poor execution, but because of poor assumptions. 
              When you build in isolation, you're building based on your assumptions about what 
              people need, how they behave, and what problems actually matter to them.
            </p>

            <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              The feedback loop is broken. By the time you launch and get real user input, you've 
              already committed months of development to potentially wrong directions. Pivoting 
              becomes expensive. Critical insights come too late.
            </p>

            <blockquote 
              className="border-l-4 border-primary font-italic"
              style={{ 
                margin: '3rem 0',
                padding: '3rem',
                background: 'rgba(100, 116, 139, 0.1)',
                fontSize: '1.25rem',
                maxWidth: '65ch'
              }}
            >
              "The best feedback comes from real problems, not survey responses. 
              Building transparently creates trust—and trust creates honest input."
            </blockquote>

            {/* Community Impact Section */}
            <div 
              className="border-2 border-primary rounded-lg p-lg"
              style={{ 
                background: 'rgba(100, 116, 139, 0.05)',
                margin: '4rem 0',
                maxWidth: '65ch'
              }}
            >
              <div 
                className="font-semibold text-primary mb-md font-mono"
                style={{ fontSize: '0.875rem' }}
              >
                Community Impact on This Post
              </div>
              <div className="grid grid-cols-3 gap-md mb-md">
                {[
                  { number: '5', label: 'Initial Votes' },
                  { number: '12', label: 'X Replies' },
                  { number: '3', label: 'Direction Changes' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div 
                      className="text-primary font-bold font-mono"
                      style={{ 
                        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', 
                        fontWeight: 800 
                      }}
                    >
                      {stat.number}
                    </div>
                    <div 
                      className="text-warm-gray mt-xs"
                      style={{ fontSize: '0.75rem' }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              <p 
                className="text-warm-gray"
                style={{ fontSize: '0.875rem' }}
              >
                This post itself was shaped by community input. Initial feedback suggested focusing 
                on practical benefits rather than philosophical arguments. The opening was rewritten 
                based on 5 early reader votes.
              </p>
            </div>

            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 600, 
              lineHeight: 1.2, 
              margin: '4rem 0 3rem 0' 
            }}>
              Building with Community Input
            </h2>

            <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Building in public flips this model. Instead of validating assumptions after building, 
              you test assumptions while building. The community becomes your early warning system 
              for bad decisions and your guide toward better ones.
            </p>

            <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              But it's not just about avoiding mistakes. Community input often reveals opportunities 
              you'd never consider on your own. Different perspectives highlight use cases you missed, 
              edge cases you didn't think about, and solutions you wouldn't have found alone.
            </p>

            {/* Interactive Poll */}
            <div 
              className="bg-white border-2 border-light-gray rounded-lg p-lg transition-all duration-200"
              style={{ margin: '4rem 0', maxWidth: '65ch' }}
            >
              <div 
                className="font-semibold text-off-black mb-md"
                style={{ fontSize: '0.875rem', lineHeight: 1.4 }}
              >
                What's the biggest benefit of building in public?
              </div>
              <div className="flex gap-sm mb-md flex-wrap">
                {[
                  { value: 'feedback', label: 'Better Feedback' },
                  { value: 'trust', label: 'Building Trust' },
                  { value: 'learning', label: 'Learning Together' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePollVote(option.value)}
                    className={cn(
                      "flex-1 py-sm px-md text-center font-medium rounded transition-all duration-200",
                      selectedPoll === option.value 
                        ? "bg-primary text-white border-2 border-primary" 
                        : "bg-light-gray hover:bg-white hover:border-primary border-2 border-transparent"
                    )}
                    style={{ fontSize: '0.875rem' }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div 
                className="text-warm-gray text-center"
                style={{ fontSize: '0.75rem' }}
              >
                <span className="font-mono">Help shape future posts</span> • 
                <a href="https://x.com/superoptimised" className="text-primary hover:underline ml-1">
                  Discuss on X
                </a>
              </div>
            </div>

            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              lineHeight: 1.3, 
              margin: '3rem 0 2rem 0' 
            }}>
              The Trust Factor
            </h3>

            <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              When people see your decision-making process, they understand your reasoning. When they 
              understand your reasoning, they trust your conclusions. When they trust your conclusions, 
              they give you honest feedback instead of polite responses.
            </p>

            <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              This creates a virtuous cycle. Transparency builds trust, trust enables honest feedback, 
              honest feedback improves decisions, better decisions build more trust.
            </p>

            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 600, 
              lineHeight: 1.2, 
              margin: '4rem 0 3rem 0' 
            }}>
              What This Journey Will Document
            </h2>

            <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Every week, I'll share the technical decisions made, the community input received, 
              and the lessons learned. This isn't a highlight reel—it's a complete record of 
              the building process.
            </p>

            <ul style={{ marginBottom: '2rem', paddingLeft: '3rem', maxWidth: '65ch' }}>
              <li style={{ marginBottom: '1rem' }}>
                <strong>Technical Decisions:</strong> Why magic links over traditional auth? 
                How should questionnaire data be structured? What's the minimum viable feature set?
              </li>
              <li style={{ marginBottom: '1rem' }}>
                <strong>Community Feedback:</strong> What problems are you actually trying to solve? 
                What alternatives should be considered? What am I missing?
              </li>
              <li style={{ marginBottom: '1rem' }}>
                <strong>Lessons Learned:</strong> What worked, what didn't, and what surprised me. 
                Both the technical lessons and the community building lessons.
              </li>
              <li style={{ marginBottom: '1rem' }}>
                <strong>Mistakes Made:</strong> Failed approaches, wrong assumptions, and course 
                corrections. The messy reality of building something new.
              </li>
            </ul>

            {/* Mid-Content Newsletter CTA */}
            <div 
              className="bg-white border-2 border-primary rounded-lg p-lg text-center"
              style={{ margin: '4rem 0', maxWidth: '65ch' }}
            >
              <h3 
                className="font-bold text-off-black mb-md"
                style={{ fontSize: '1.25rem' }}
              >
                Don't Miss a Decision
              </h3>
              <p 
                className="text-warm-gray mb-lg"
                style={{ fontSize: '0.875rem' }}
              >
                Major technical choices happen weekly. Get the full context and help influence 
                the direction before decisions are final.
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
                  Get Decision Updates
                </button>
              </form>
            </div>

            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 600, 
              lineHeight: 1.2, 
              margin: '4rem 0 3rem 0' 
            }}>
              The Commitment
            </h2>

            <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              This is an experiment in radical transparency. Not just sharing successes, but 
              documenting the complete process—including the uncertainty, the dead ends, and 
              the community-driven course corrections.
            </p>

            <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Most importantly, this isn't just about transparency for its own sake. It's about 
              building better products through better feedback loops. The community isn't just 
              an audience—they're collaborators in the building process.
            </p>

            <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              <strong>Ready to build something together?</strong> The first technical decision is 
              coming this week: authentication strategy for anonymous feedback. Your input will 
              directly influence the implementation.
            </p>

            <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Follow along on <a href="https://x.com/superoptimised" className="text-primary hover:underline font-medium">X (@superoptimised)</a> 
              for live decisions and vote in real-time polls. This website documents the complete 
              journey for those who want the full context.
            </p>
          </div>
        </div>

        {/* Content Sidebar - Right 4 columns */}
        <div className="col-span-12 md:col-span-4">
          <div className="sticky top-lg space-y-lg">
            {/* Table of Contents */}
            <div className="bg-white border-2 border-light-gray rounded-lg p-md">
              <h3 
                className="font-semibold text-off-black mb-md"
                style={{ fontSize: '0.875rem' }}
              >
                In This Post
              </h3>
              <div 
                className="text-warm-gray"
                style={{ fontSize: '0.875rem' }}
              >
                <ul style={{ paddingLeft: '2rem', margin: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a href="#problem" className="text-warm-gray hover:text-primary">
                      The Problem with Secret Development
                    </a>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a href="#community" className="text-warm-gray hover:text-primary">
                      Building with Community Input
                    </a>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a href="#document" className="text-warm-gray hover:text-primary">
                      What This Journey Will Document
                    </a>
                  </li>
                  <li style={{ marginBottom: '0.5rem' }}>
                    <a href="#commitment" className="text-warm-gray hover:text-primary">
                      The Commitment
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Post Stats */}
            <div className="bg-white border-2 border-light-gray rounded-lg p-md">
              <h3 
                className="font-semibold text-off-black mb-md"
                style={{ fontSize: '0.875rem' }}
              >
                Post Impact
              </h3>
              <div 
                className="text-warm-gray"
                style={{ fontSize: '0.875rem' }}
              >
                {[
                  { label: 'Views', value: '247' },
                  { label: 'X Shares', value: '12' },
                  { label: 'Newsletter Signups', value: '8' },
                  { label: 'Community Votes', value: '5' }
                ].map((stat, index) => (
                  <div key={index} className="flex justify-between mb-sm">
                    <span>{stat.label}</span>
                    <span className="font-mono text-primary">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coming Next */}
            <div className="bg-white border-2 border-light-gray rounded-lg p-md">
              <h3 
                className="font-semibold text-off-black mb-md"
                style={{ fontSize: '0.875rem' }}
              >
                Coming Next
              </h3>
              <div 
                className="text-warm-gray"
                style={{ fontSize: '0.875rem' }}
              >
                <p className="font-semibold mb-sm">Authentication Decision</p>
                <p className="mb-sm">
                  Magic links vs traditional login for anonymous feedback. Community vote in progress.
                </p>
                <a href="https://x.com/superoptimised" className="text-primary hover:underline">
                  Vote on X →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}