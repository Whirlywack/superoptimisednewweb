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
    <section className="w-full px-4 py-xl">
      <div className="mx-auto grid max-w-6xl grid-cols-12 gap-6">
        {/* Post Content - Left 8 columns */}
        <div className="col-span-12 md:col-span-8">
          {/* Main Content */}
          <div className="max-w-[65ch]">
            <p className="mb-lg text-base leading-relaxed">
              Traditional development happens behind closed doors. Decisions get made in isolation, 
              problems stay hidden until launch, and communities only see the polished final product. 
              <strong>I'm doing the opposite.</strong>
            </p>

            <p className="mb-lg text-base leading-relaxed">
              Starting today, every technical decision, every design choice, and every mistake will be 
              documented transparently. Not because transparency is trendy, but because it leads to 
              fundamentally better products.
            </p>

            <h2 className="mb-xl mt-2xl text-h2 font-semibold leading-tight">
              The Problem with Secret Development
            </h2>

            <p className="mb-lg text-base leading-relaxed">
              Most products fail not because of poor execution, but because of poor assumptions. 
              When you build in isolation, you're building based on your assumptions about what 
              people need, how they behave, and what problems actually matter to them.
            </p>

            <p className="mb-lg text-base leading-relaxed">
              The feedback loop is broken. By the time you launch and get real user input, you've 
              already committed months of development to potentially wrong directions. Pivoting 
              becomes expensive. Critical insights come too late.
            </p>

            <blockquote 
              className="mx-0 my-xl max-w-[65ch] border-l-4 border-primary bg-primary/10 p-xl text-lg italic"
            >
              "The best feedback comes from real problems, not survey responses. 
              Building transparently creates trust—and trust creates honest input."
            </blockquote>

            {/* Community Impact Section */}
            <div 
              className="mx-0 my-2xl max-w-[65ch] rounded-lg border-2 border-primary bg-primary/5 p-lg"
            >
              <div 
                className="mb-md text-sm font-mono font-semibold text-primary"
              >
                Community Impact on This Post
              </div>
              <div className="mb-md grid grid-cols-3 gap-md">
                {[
                  { number: '5', label: 'Initial Votes' },
                  { number: '12', label: 'X Replies' },
                  { number: '3', label: 'Direction Changes' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div 
                      className="text-xl font-mono font-extrabold text-primary"
                    >
                      {stat.number}
                    </div>
                    <div 
                      className="mt-xs text-xs text-warm-gray"
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              <p 
                className="text-sm text-warm-gray"
              >
                This post itself was shaped by community input. Initial feedback suggested focusing 
                on practical benefits rather than philosophical arguments. The opening was rewritten 
                based on 5 early reader votes.
              </p>
            </div>

            <h2 className="mb-xl mt-2xl text-h2 font-semibold leading-tight">
              Building with Community Input
            </h2>

            <p className="mb-lg text-base leading-relaxed">
              Building in public flips this model. Instead of validating assumptions after building, 
              you test assumptions while building. The community becomes your early warning system 
              for bad decisions and your guide toward better ones.
            </p>

            <p className="mb-lg text-base leading-relaxed">
              But it's not just about avoiding mistakes. Community input often reveals opportunities 
              you'd never consider on your own. Different perspectives highlight use cases you missed, 
              edge cases you didn't think about, and solutions you wouldn't have found alone.
            </p>

            {/* Interactive Poll */}
            <div 
              className="mx-0 my-2xl max-w-[65ch] rounded-lg border-2 border-light-gray bg-white p-lg transition-all duration-200"
            >
              <div 
                className="mb-md text-sm font-semibold leading-relaxed text-off-black"
              >
                What's the biggest benefit of building in public?
              </div>
              <div className="mb-md flex flex-wrap gap-sm">
                {[
                  { value: 'feedback', label: 'Better Feedback' },
                  { value: 'trust', label: 'Building Trust' },
                  { value: 'learning', label: 'Learning Together' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePollVote(option.value)}
                    className={cn(
                      "flex-1 rounded px-md py-sm text-center text-sm font-medium transition-all duration-200",
                      selectedPoll === option.value 
                        ? "border-2 border-primary bg-primary text-white" 
                        : "border-2 border-transparent bg-light-gray hover:border-primary hover:bg-white"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div 
                className="text-center text-xs text-warm-gray"
              >
                <span className="font-mono">Help shape future posts</span> • 
                <a href="https://x.com/superoptimised" className="ml-1 text-primary hover:underline">
                  Discuss on X
                </a>
              </div>
            </div>

            <h3 className="mb-lg mt-xl text-h3 font-semibold leading-snug">
              The Trust Factor
            </h3>

            <p className="mb-lg text-base leading-relaxed">
              When people see your decision-making process, they understand your reasoning. When they 
              understand your reasoning, they trust your conclusions. When they trust your conclusions, 
              they give you honest feedback instead of polite responses.
            </p>

            <p className="mb-lg text-base leading-relaxed">
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
              className="rounded-lg border-2 border-primary bg-white p-lg text-center"
              style={{ margin: '4rem 0', maxWidth: '65ch' }}
            >
              <h3 
                className="mb-md font-bold text-off-black"
                style={{ fontSize: '1.25rem' }}
              >
                Don't Miss a Decision
              </h3>
              <p 
                className="mb-lg text-warm-gray"
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
                    "w-full rounded-sm border-2 border-light-gray px-md py-sm",
                    "bg-white text-base",
                    "focus:border-primary focus:outline-none",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  className={cn(
                    "w-full rounded-sm border-none bg-primary py-sm text-base text-white",
                    "cursor-pointer font-semibold transition-all duration-200",
                    "hover:-translate-y-px hover:bg-off-black",
                    "disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
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
              Follow along on <a href="https://x.com/superoptimised" className="font-medium text-primary hover:underline">X (@superoptimised)</a> 
              for live decisions and vote in real-time polls. This website documents the complete 
              journey for those who want the full context.
            </p>
          </div>
        </div>

        {/* Content Sidebar - Right 4 columns */}
        <div className="col-span-12 md:col-span-4">
          <div className="sticky top-lg space-y-lg">
            {/* Table of Contents */}
            <div className="rounded-lg border-2 border-light-gray bg-white p-md">
              <h3 
                className="mb-md font-semibold text-off-black"
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
            <div className="rounded-lg border-2 border-light-gray bg-white p-md">
              <h3 
                className="mb-md font-semibold text-off-black"
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
                  <div key={index} className="mb-sm flex justify-between">
                    <span>{stat.label}</span>
                    <span className="font-mono text-primary">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coming Next */}
            <div className="rounded-lg border-2 border-light-gray bg-white p-md">
              <h3 
                className="mb-md font-semibold text-off-black"
                style={{ fontSize: '0.875rem' }}
              >
                Coming Next
              </h3>
              <div 
                className="text-warm-gray"
                style={{ fontSize: '0.875rem' }}
              >
                <p className="mb-sm font-semibold">Authentication Decision</p>
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