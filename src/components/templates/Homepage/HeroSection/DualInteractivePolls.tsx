'use client';

import React, { useState, useContext, useEffect } from 'react';
import { Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { XPToastContext } from '../XPToastProvider';
import { questionBank, Question } from '../questionBank';

interface PollState {
  id: string;
  question: Question;
  selectedOption: string | null;
  isAnimating: boolean;
}

const generateVoteCount = () => Math.floor(Math.random() * 15) + 3; // 3-18 votes

export function DualInteractivePolls() {
  const { showXPToast } = useContext(XPToastContext);
  const [polls, setPolls] = useState<PollState[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize polls on mount with default questions
  useEffect(() => {
    if (!isInitialized) {
      setPolls([
        {
          id: 'poll-1',
          question: {
            id: 'auth-default',
            category: 'auth',
            text: 'Quick input: Which authentication approach feels more trustworthy for anonymous feedback?',
            options: ['Magic Links', 'Anonymous IDs']
          },
          selectedOption: null,
          isAnimating: false,
        },
        {
          id: 'poll-2', 
          question: {
            id: 'platform-default',
            category: 'platform', 
            text: 'Mobile vs Desktop priority for the questionnaire interface?',
            options: ['Mobile-First', 'Desktop-Rich']
          },
          selectedOption: null,
          isAnimating: false,
        }
      ]);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const handleVote = async (pollId: string, optionIndex: number) => {
    // Find the poll
    const pollIndex = polls.findIndex(p => p.id === pollId);
    if (pollIndex === -1) return;

    const poll = polls[pollIndex];
    if (poll.selectedOption !== null) return; // Already voted

    // Mark as selected
    setPolls(prev => prev.map(p => 
      p.id === pollId 
        ? { ...p, selectedOption: poll.question.options[optionIndex] }
        : p
    ));

    // Show XP toast after 100ms
    setTimeout(() => {
      showXPToast('poll');
    }, 100);

    // Start question replacement after 600ms
    setTimeout(() => {
      setPolls(prev => prev.map(p => 
        p.id === pollId 
          ? { ...p, isAnimating: true }
          : p
      ));

      // Replace question after fade out (200ms)
      setTimeout(() => {
        const newQuestion = questionBank.getNextQuestion();
        if (newQuestion) {
          setPolls(prev => prev.map(p => 
            p.id === pollId 
              ? {
                  ...p,
                  question: newQuestion,
                  selectedOption: null,
                  isAnimating: false,
                }
              : p
          ));
        }
      }, 200);
    }, 600);
  };

  const shareToTwitter = (poll: PollState) => {
    const text = `Just voted on: "${poll.question.text}" 

Building in public with @superoptimised 🚀

#BuildInPublic #DeveloperFeedback`;
    
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (polls.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PollSkeleton />
        <PollSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
      {polls.map((poll) => (
        <PollWidget 
          key={poll.id}
          poll={poll}
          onVote={(optionIndex) => handleVote(poll.id, optionIndex)}
          onShare={() => shareToTwitter(poll)}
        />
      ))}
    </div>
  );
}

interface PollWidgetProps {
  poll: PollState;
  onVote: (optionIndex: number) => void;
  onShare: () => void;
}

function PollWidget({ poll, onVote, onShare }: PollWidgetProps) {
  const hasVoted = poll.selectedOption !== null;
  const totalVotes = poll.question.id === 'auth-default' ? 2 : 0;

  return (
    <div 
      className={cn(
        "bg-white border-2 border-light-gray rounded-lg p-8 transition-all duration-200",
        poll.isAnimating && "opacity-0 transform translate-y-1"
      )}
    >
      {/* Question */}
      <div className="text-sm font-semibold text-off-black leading-snug mb-8">
        {poll.question.text}
      </div>

      {/* Options */}
      <div className="flex gap-4 mb-8">
        {poll.question.options.map((option, index) => {
          const isSelected = poll.selectedOption === option;
          
          return (
            <button
              key={index}
              onClick={() => onVote(index)}
              disabled={hasVoted}
              className={cn(
                "flex-1 p-4 text-sm font-medium text-center rounded transition-all duration-200",
                "border-2 border-transparent cursor-pointer",
                isSelected 
                  ? "bg-primary text-white border-primary" 
                  : "bg-light-gray text-off-black hover:border-primary hover:bg-white"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Meta */}
      <div className="text-xs text-warm-gray text-center">
        <span className="font-mono">{totalVotes} votes so far</span>
        <span className="mx-2">•</span>
        <button 
          onClick={onShare}
          className="text-primary hover:underline"
        >
          {hasVoted ? 'Discuss on X' : 'Share on X'}
        </button>
      </div>
    </div>
  );
}

function PollSkeleton() {
  return (
    <div className="bg-white border-2 border-light-gray rounded-lg p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-light-gray rounded w-3/4"></div>
        <div className="h-3 bg-light-gray rounded w-1/2"></div>
        <div className="space-y-3">
          <div className="h-12 bg-light-gray rounded"></div>
          <div className="h-12 bg-light-gray rounded"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-light-gray rounded w-20"></div>
          <div className="h-3 bg-light-gray rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}