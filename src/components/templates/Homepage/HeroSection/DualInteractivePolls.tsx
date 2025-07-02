'use client';

import React, { useState, useContext } from 'react';
import { Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { XPToastContext } from '../XPToastProvider';

interface PollOption {
  id: string;
  label: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVoted: boolean;
}

const initialPolls: Poll[] = [
  {
    id: 'auth-poll',
    question: "Quick input: Which authentication approach feels more trustworthy for anonymous feedback?",
    options: [
      { id: 'magic-links', label: 'Magic Links', votes: 1 },
      { id: 'anonymous-ids', label: 'Anonymous IDs', votes: 1 }
    ],
    totalVotes: 2,
    userVoted: false
  },
  {
    id: 'platform-poll',
    question: "Mobile vs Desktop priority for the questionnaire interface?",
    options: [
      { id: 'mobile-first', label: 'Mobile-First', votes: 0 },
      { id: 'desktop-rich', label: 'Desktop-Rich', votes: 0 }
    ],
    totalVotes: 0,
    userVoted: false
  }
];

const replacementQuestions = {
  'auth-poll': [
    {
      question: "After magic links are chosen, what's the backup authentication method?",
      options: [
        { id: 'email-code', label: 'Email Code', votes: 0 },
        { id: 'simple-password', label: 'Simple Password', votes: 0 }
      ]
    },
    {
      question: "How long should magic links remain valid?",
      options: [
        { id: '15-minutes', label: '15 minutes', votes: 0 },
        { id: '24-hours', label: '24 hours', votes: 0 }
      ]
    }
  ],
  'platform-poll': [
    {
      question: "What's more important for mobile questionnaires?",
      options: [
        { id: 'speed', label: 'Speed', votes: 0 },
        { id: 'rich-features', label: 'Rich Features', votes: 0 }
      ]
    },
    {
      question: "Should questionnaires work offline?",
      options: [
        { id: 'yes-essential', label: 'Yes, Essential', votes: 0 },
        { id: 'no-online-only', label: 'No, Online Only', votes: 0 }
      ]
    }
  ]
};

export function DualInteractivePolls() {
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [replacementIndex, setReplacementIndex] = useState<Record<string, number>>({
    'auth-poll': 0,
    'platform-poll': 0
  });
  const { showXPToast } = useContext(XPToastContext);

  const handleVote = (pollId: string, optionId: string) => {
    if (polls.find(p => p.id === pollId)?.userVoted) return;

    // Update poll with vote
    setPolls(prevPolls => 
      prevPolls.map(poll => {
        if (poll.id !== pollId) return poll;

        const updatedOptions = poll.options.map(option =>
          option.id === optionId
            ? { ...option, votes: option.votes + 1 }
            : option
        );

        const newPoll = {
          ...poll,
          options: updatedOptions,
          totalVotes: poll.totalVotes + 1,
          userVoted: true
        };

        // Replace with new question after vote
        setTimeout(() => {
          const currentIndex = replacementIndex[pollId];
          const replacements = replacementQuestions[pollId as keyof typeof replacementQuestions];
          
          if (currentIndex < replacements.length) {
            const newQuestion = replacements[currentIndex];
            setPolls(prev => prev.map(p => 
              p.id === pollId 
                ? {
                    ...p,
                    question: newQuestion.question,
                    options: newQuestion.options,
                    totalVotes: 0,
                    userVoted: false
                  }
                : p
            ));
            setReplacementIndex(prev => ({ ...prev, [pollId]: currentIndex + 1 }));
          }
        }, 2000);

        return newPoll;
      })
    );

    // Show XP toast
    showXPToast('+10 XP • Getting involved!');
  };

  const getPercentage = (votes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  const shareOnTwitter = (poll: Poll) => {
    const tweetText = `${poll.question} ${poll.options.map(opt => `${opt.label}`).join(' vs ')} - Vote and join the building process at superoptimised.com`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {polls.map((poll) => (
        <div 
          key={poll.id}
          className={cn(
            "bg-white border border-light-gray rounded-lg p-6",
            "shadow-sm hover:shadow-md transition-shadow duration-200"
          )}
        >
          {/* Question */}
          <h3 className="text-h4 font-semibold text-off-black mb-4 leading-snug">
            {poll.question}
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-4">
            {poll.options.map((option) => {
              const percentage = getPercentage(option.votes, poll.totalVotes);
              const isWinning = poll.totalVotes > 0 && option.votes === Math.max(...poll.options.map(o => o.votes));
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleVote(poll.id, option.id)}
                  disabled={poll.userVoted}
                  className={cn(
                    "w-full p-4 rounded-lg border transition-all duration-200",
                    "min-h-[44px] text-left relative overflow-hidden",
                    poll.userVoted
                      ? "cursor-default"
                      : "hover:bg-primary/5 hover:border-primary/30 cursor-pointer",
                    isWinning && poll.userVoted
                      ? "border-primary/50 bg-primary/10"
                      : "border-light-gray bg-white"
                  )}
                  aria-label={`Vote for ${option.label}${poll.userVoted ? `. ${option.votes} votes, ${percentage}%` : ''}`}
                >
                  {/* Progress background for voted state */}
                  {poll.userVoted && (
                    <div 
                      className="absolute inset-0 bg-primary/5 transition-all duration-500 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  )}
                  
                  <div className="relative flex items-center justify-between">
                    <span className="font-medium text-off-black">
                      {option.label}
                    </span>
                    {poll.userVoted && (
                      <div className="flex items-center gap-2 text-small text-warm-gray">
                        <span>{option.votes} votes</span>
                        <span className="font-semibold text-primary">
                          {percentage}%
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-small text-warm-gray">
            <span>
              {poll.totalVotes} vote{poll.totalVotes !== 1 ? 's' : ''} so far
            </span>
            <button
              onClick={() => shareOnTwitter(poll)}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded",
                "hover:bg-primary/10 hover:text-primary transition-colors duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              )}
              aria-label="Share poll on X (Twitter)"
            >
              <Twitter className="h-3 w-3" />
              <span>Share on X</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}