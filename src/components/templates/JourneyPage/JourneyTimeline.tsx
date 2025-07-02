'use client';

import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { XPToastContext } from '../Homepage/XPToastProvider';
import { BarChart3, MessageCircle, Target, Twitter, Repeat2, Heart } from 'lucide-react';

interface CommunityImpact {
  votes: string;
  replies: string;
  outcome: string;
}

interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  status: 'Foundation' | 'In Progress' | 'Complete';
  href: string;
  readTime: string;
  featured?: boolean;
  communityImpact?: CommunityImpact;
}

const timelineEntries: TimelineEntry[] = [
  {
    id: '1',
    date: 'Day 1 • January 2, 2024',
    title: 'Why Building in Public Creates Better Products',
    excerpt: 'Traditional development happens behind closed doors—decisions made in isolation, problems hidden until launch. I\'m documenting every choice, sharing every challenge, and letting community feedback guide the direction. This transparency leads to better products and stronger relationships with the people who\'ll actually use what I build.',
    status: 'Foundation',
    href: '/journey/day-1-foundation',
    readTime: '4 min read',
    featured: true,
    communityImpact: {
      votes: '5 initial votes on direction',
      replies: '12 replies on X thread',
      outcome: 'Project scope refined based on feedback'
    }
  },
  {
    id: '2',
    date: 'Coming This Week',
    title: 'Authentication Decision: Magic Links vs Traditional Login',
    excerpt: 'The community is helping decide between magic link authentication and traditional username/password. Current vote: 67% favor magic links for anonymous feedback systems. This post will break down the technical implications and final implementation decision.',
    status: 'In Progress',
    href: 'https://x.com/superoptimised',
    readTime: 'Live voting',
    communityImpact: {
      votes: '17 votes and counting',
      replies: '8 alternative suggestions',
      outcome: 'Decision deadline: Friday'
    }
  }
];

export function JourneyTimeline() {
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
  const { showXPToast } = useContext(XPToastContext);

  const handlePollVote = (option: string) => {
    setSelectedPoll(option);
    showXPToast('+10 XP • Building momentum!');
    
    // Auto-refresh poll after vote (simulated)
    setTimeout(() => {
      setSelectedPoll(null);
    }, 2000);
  };

  return (
    <section className="w-full py-2xl px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        {/* Timeline Header */}
        <div className="col-span-12 text-center mb-2xl">
          <h2 
            className="font-semibold text-off-black mb-md"
            style={{ 
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', 
              fontWeight: 600, 
              lineHeight: 1.2 
            }}
          >
            Building Timeline
          </h2>
          <p 
            className="text-warm-gray"
            style={{ fontSize: '1rem', lineHeight: 1.6 }}
          >
            Every decision documented. Community influence tracked. Lessons shared transparently.
          </p>
        </div>

        {/* Timeline Content - Left 8 columns */}
        <div className="col-span-12 md:col-span-8">
          <div className="space-y-xl">
            {timelineEntries.map((entry, index) => (
              <article 
                key={entry.id}
                className={cn(
                  "relative pl-lg",
                  "before:content-[''] before:absolute before:left-0 before:top-0 before:w-1 before:h-full",
                  entry.featured ? "before:bg-primary" : "before:bg-light-gray"
                )}
              >
                {entry.href.startsWith('http') ? (
                  <a 
                    href={entry.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white border-2 border-light-gray rounded-lg p-lg transition-all duration-200 hover:border-primary hover:-translate-y-0.5 cursor-pointer"
                  >
                    {/* Entry Meta */}
                    <div className="flex items-center justify-between gap-4 mb-md flex-wrap">
                      <time 
                        className="text-warm-gray font-mono"
                        style={{ fontSize: '0.875rem' }}
                      >
                        {entry.date}
                      </time>
                      <span 
                        className="px-sm py-xs rounded font-semibold"
                        style={{ 
                          background: 'rgba(100, 116, 139, 0.1)', 
                          color: 'var(--primary)',
                          fontSize: '0.75rem'
                        }}
                      >
                        {entry.status}
                      </span>
                    </div>
                    
                    {/* Entry Title */}
                    <h3 
                      className="font-semibold text-off-black mb-md"
                      style={{ 
                        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', 
                        fontWeight: 600, 
                        lineHeight: 1.2 
                      }}
                    >
                      {entry.title}
                    </h3>
                    
                    {/* Entry Excerpt */}
                    <p 
                      className="text-warm-gray mb-md max-w-[65ch]"
                      style={{ fontSize: '1rem', lineHeight: 1.6 }}
                    >
                      {entry.excerpt}
                    </p>
                    
                    {/* Community Impact */}
                    {entry.communityImpact && (
                      <div 
                        className="p-md my-md rounded"
                        style={{ background: 'rgba(100, 116, 139, 0.05)' }}
                      >
                        <div 
                          className="font-semibold text-primary mb-sm"
                          style={{ fontSize: '0.875rem' }}
                        >
                          Community Impact
                        </div>
                        <div className="flex gap-lg text-warm-gray font-mono flex-wrap" style={{ fontSize: '0.875rem' }}>
                          <div className="flex items-center gap-1">
                            <BarChart3 className="w-4 h-4" />
                            <span>{entry.communityImpact.votes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{entry.communityImpact.replies}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            <span>{entry.communityImpact.outcome}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Entry Actions */}
                    <div className="flex items-center justify-between mt-md">
                      <span 
                        className="text-primary font-semibold"
                        style={{ fontSize: '0.875rem' }}
                      >
                        Join the discussion on X →
                      </span>
                      <span 
                        className="text-warm-gray font-mono"
                        style={{ fontSize: '0.875rem' }}
                      >
                        {entry.readTime}
                      </span>
                    </div>
                  </a>
                ) : (
                  <Link 
                    href={entry.href}
                    className="block bg-white border-2 border-light-gray rounded-lg p-lg transition-all duration-200 hover:border-primary hover:-translate-y-0.5 cursor-pointer"
                  >
                    {/* Entry Meta */}
                    <div className="flex items-center justify-between gap-4 mb-md flex-wrap">
                      <time 
                        className="text-warm-gray font-mono"
                        style={{ fontSize: '0.875rem' }}
                      >
                        {entry.date}
                      </time>
                      <span 
                        className="px-sm py-xs rounded font-semibold"
                        style={{ 
                          background: 'rgba(100, 116, 139, 0.1)', 
                          color: 'var(--primary)',
                          fontSize: '0.75rem'
                        }}
                      >
                        {entry.status}
                      </span>
                    </div>
                    
                    {/* Entry Title */}
                    <h3 
                      className="font-semibold text-off-black mb-md"
                      style={{ 
                        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', 
                        fontWeight: 600, 
                        lineHeight: 1.2 
                      }}
                    >
                      {entry.title}
                    </h3>
                    
                    {/* Entry Excerpt */}
                    <p 
                      className="text-warm-gray mb-md max-w-[65ch]"
                      style={{ fontSize: '1rem', lineHeight: 1.6 }}
                    >
                      {entry.excerpt}
                    </p>
                    
                    {/* Community Impact */}
                    {entry.communityImpact && (
                      <div 
                        className="p-md my-md rounded"
                        style={{ background: 'rgba(100, 116, 139, 0.05)' }}
                      >
                        <div 
                          className="font-semibold text-primary mb-sm"
                          style={{ fontSize: '0.875rem' }}
                        >
                          Community Impact
                        </div>
                        <div className="flex gap-lg text-warm-gray font-mono flex-wrap" style={{ fontSize: '0.875rem' }}>
                          <div className="flex items-center gap-1">
                            <BarChart3 className="w-4 h-4" />
                            <span>{entry.communityImpact.votes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{entry.communityImpact.replies}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            <span>{entry.communityImpact.outcome}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Entry Actions */}
                    <div className="flex items-center justify-between mt-md">
                      <span 
                        className="text-primary font-semibold"
                        style={{ fontSize: '0.875rem' }}
                      >
                        Read full post →
                      </span>
                      <span 
                        className="text-warm-gray font-mono"
                        style={{ fontSize: '0.875rem' }}
                      >
                        {entry.readTime}
                      </span>
                    </div>
                  </Link>
                )}
              </article>
            ))}

            {/* Content Strategy Poll */}
            <div className="bg-white border-2 border-light-gray rounded-lg p-md transition-all duration-200">
              <div 
                className="font-semibold text-off-black mb-md"
                style={{ fontSize: '0.875rem', lineHeight: 1.4 }}
              >
                What type of content would be most valuable next?
              </div>
              <div className="flex gap-sm mb-md flex-wrap">
                <button
                  onClick={() => handlePollVote('technical')}
                  className={cn(
                    "flex-1 py-sm px-md text-center font-medium rounded transition-all duration-200",
                    selectedPoll === 'technical' 
                      ? "bg-primary text-white border-2 border-primary" 
                      : "bg-light-gray hover:bg-white hover:border-primary border-2 border-transparent"
                  )}
                  style={{ fontSize: '0.875rem' }}
                >
                  Technical Deep-Dives
                </button>
                <button
                  onClick={() => handlePollVote('decisions')}
                  className={cn(
                    "flex-1 py-sm px-md text-center font-medium rounded transition-all duration-200",
                    selectedPoll === 'decisions' 
                      ? "bg-primary text-white border-2 border-primary" 
                      : "bg-light-gray hover:bg-white hover:border-primary border-2 border-transparent"
                  )}
                  style={{ fontSize: '0.875rem' }}
                >
                  Decision Breakdowns
                </button>
                <button
                  onClick={() => handlePollVote('lessons')}
                  className={cn(
                    "flex-1 py-sm px-md text-center font-medium rounded transition-all duration-200",
                    selectedPoll === 'lessons' 
                      ? "bg-primary text-white border-2 border-primary" 
                      : "bg-light-gray hover:bg-white hover:border-primary border-2 border-transparent"
                  )}
                  style={{ fontSize: '0.875rem' }}
                >
                  Weekly Lessons
                </button>
              </div>
              <div 
                className="text-warm-gray text-center"
                style={{ fontSize: '0.75rem' }}
              >
                <span className="font-mono">Shape upcoming content</span> • 
                <a href="https://x.com/superoptimised" className="text-primary hover:underline ml-1">
                  Suggest on X
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Sidebar - Right 4 columns */}
        <div className="col-span-12 md:col-span-4">
          <div className="sticky top-lg space-y-lg">
            {/* Journey Stats */}
            <div className="bg-white border-2 border-light-gray rounded-lg p-md">
              <h3 
                className="font-semibold text-off-black mb-md"
                style={{ fontSize: '0.875rem' }}
              >
                Journey Stats
              </h3>
              <div className="space-y-sm">
                {[
                  { label: 'Days Building', value: '1' },
                  { label: 'Posts Published', value: '1' },
                  { label: 'Community Votes', value: '17' },
                  { label: 'Decisions Made', value: '3' },
                  { label: 'Project Complete', value: '15%' }
                ].map((stat, index) => (
                  <div key={index} className="flex justify-between items-center py-xs border-b border-light-gray last:border-b-0">
                    <span 
                      className="text-warm-gray"
                      style={{ fontSize: '0.875rem' }}
                    >
                      {stat.label}
                    </span>
                    <span 
                      className="text-primary font-semibold font-mono"
                      style={{ fontSize: '0.875rem' }}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent X Activity */}
            <div className="bg-white border-2 border-light-gray rounded-lg p-md">
              <h3 
                className="font-semibold text-off-black mb-md"
                style={{ fontSize: '0.875rem' }}
              >
                Live from X
              </h3>
              <div className="bg-white border-2 border-light-gray rounded-lg p-lg">
                {/* X Header */}
                <div className="flex items-center gap-sm mb-md">
                  <div 
                    className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold"
                    style={{ fontSize: '0.875rem' }}
                  >
                    SO
                  </div>
                  <div>
                    <div 
                      className="font-semibold text-off-black"
                      style={{ fontSize: '0.875rem' }}
                    >
                      Superoptimised
                    </div>
                    <div 
                      className="text-warm-gray font-mono"
                      style={{ fontSize: '0.75rem' }}
                    >
                      @superoptimised
                    </div>
                  </div>
                </div>
                
                {/* X Content */}
                <div 
                  className="mb-md text-off-black"
                  style={{ fontSize: '1rem', lineHeight: 1.5 }}
                >
                  Day 1 of building in public: Community is already shaping technical decisions. 
                  Magic links vs traditional auth poll results coming in. This is exactly why 
                  transparent building works.
                </div>
                
                {/* X Stats */}
                <div 
                  className="flex gap-md text-warm-gray font-mono"
                  style={{ fontSize: '0.875rem' }}
                >
                  <div className="flex items-center gap-1">
                    <Repeat2 className="w-4 h-4" />
                    <span>8</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>15</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}