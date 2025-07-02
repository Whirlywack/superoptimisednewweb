'use client';

import React from 'react';
import Link from 'next/link';
import { Twitter, MessageCircle, BarChart3, Users, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const communityStats = [
  { 
    icon: BarChart3,
    value: "17", 
    label: "Total Votes",
    description: "Community decisions made"
  },
  { 
    icon: Users,
    value: "3", 
    label: "Decisions Influenced",
    description: "Features shaped by feedback"
  },
  { 
    icon: MessageCircle,
    value: "4", 
    label: "Active Polls",
    description: "Current voting opportunities"
  },
  { 
    icon: Calendar,
    value: "1", 
    label: "Days Building",
    description: "Transparent development time"
  },
];

export function CommunityProof() {
  return (
    <section 
      className="w-full px-4 py-xl"
      aria-labelledby="community-heading"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Title - Centered, slightly bigger heading */}
        <h2 
          id="community-heading"
          className="font-bold text-off-black text-center mb-2xl"
          style={{ fontSize: '2rem' }}
        >
          Community Input Shapes Every Decision
        </h2>

        {/* Twitter Example - Full width block above stats */}
        <div className="mb-2xl">
          <div className="w-full">
            <div className={cn(
              "bg-white border-2 border-light-gray rounded-lg p-lg"
            )}>
              {/* Tweet Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Twitter className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-off-black">
                    Superoptimised
                  </div>
                  <div className="text-small text-warm-gray">
                    @superoptimised
                  </div>
                </div>
              </div>

              {/* Tweet Content */}
              <div className="mb-4">
                <p className="text-body text-off-black leading-relaxed">
                  Should I prioritize mobile-first design or desktop experience for the questionnaire system? 
                  Mobile = better accessibility, Desktop = richer interactions. Your thoughts?
                </p>
              </div>

              {/* Tweet Stats */}
              <div className="flex items-center gap-6 text-small text-warm-gray">
                <div className="flex items-center gap-1">
                  <span>📱</span>
                  <span className="font-medium">Mobile-first: 67%</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>💻</span>
                  <span className="font-medium">Desktop: 33%</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-4 w-4" />
                  <span>15 votes</span>
                </div>
              </div>

              {/* View on X Link */}
              <div className="mt-4 pt-4 border-t border-light-gray">
                <Link
                  href="https://x.com/superoptimised"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 text-small text-primary",
                    "hover:text-primary/80 transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
                  )}
                >
                  <Twitter className="h-4 w-4" />
                  View full conversation on X
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Community Stats Grid - Full width with light gray background */}
        <div className="w-full bg-primary/5 rounded-lg p-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-md">
              {communityStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div 
                    key={index}
                    className="text-center"
                  >
                    <div className="font-bold text-primary font-mono mb-2" style={{ fontSize: '3rem' }}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-warm-gray">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Footer Note */}
          <p className="text-xs text-warm-gray text-center italic leading-relaxed">
            Real-time community input from X polls and website questionnaires 
            shapes every technical decision.
          </p>
        </div>
      </div>
    </section>
  );
}