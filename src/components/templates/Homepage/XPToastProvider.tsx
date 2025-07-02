'use client';

import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface XPToast {
  id: string;
  message: string;
  xpAmount: number;
  isMilestone: boolean;
  timestamp: number;
}

interface XPToastContextType {
  showXPToast: (type?: 'poll' | 'newsletter') => void;
  getParticipationCount: () => number;
  getStreak: () => number;
}

export const XPToastContext = createContext<XPToastContextType>({
  showXPToast: () => {},
  getParticipationCount: () => 0,
  getStreak: () => 0,
});

interface XPToastProviderProps {
  children: ReactNode;
}

// Progressive XP Messages from specification
const XP_MESSAGES = [
  { count: 1, xp: 5, message: "+5 XP • First input!", isMilestone: false },
  { count: 2, xp: 10, message: "+10 XP • Getting involved!", isMilestone: false },
  { count: 3, xp: 15, message: "+15 XP • Building momentum!", isMilestone: false },
  { count: 4, xp: 20, message: "+20 XP • Community champion!", isMilestone: false },
  { count: 5, xp: 25, message: "+25 XP • Feedback hero!", isMilestone: false },
  { count: 10, xp: 50, message: "+50 XP • Super contributor!", isMilestone: true },
  { count: 20, xp: 100, message: "+100 XP • Building legend!", isMilestone: true },
];

export function XPToastProvider({ children }: XPToastProviderProps) {
  const [toasts, setToasts] = useState<XPToast[]>([]);

  // Get progressive XP message based on participation count
  const getXPMessage = (count: number) => {
    // Find the appropriate message for this count
    let selectedMessage = XP_MESSAGES[0]; // Default to first message
    
    for (const message of XP_MESSAGES) {
      if (count >= message.count) {
        selectedMessage = message;
      } else {
        break;
      }
    }
    
    return selectedMessage;
  };

  const showXPToast = useCallback((type: 'poll' | 'newsletter' = 'poll') => {
    // Get current participation count
    const currentCount = parseInt(localStorage.getItem('participationCount') || '0', 10);
    const newCount = currentCount + 1;
    
    // Update participation count
    localStorage.setItem('participationCount', newCount.toString());
    
    // Update streak tracking
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('lastParticipationDate');
    const currentStreak = parseInt(localStorage.getItem('feedbackStreak') || '0', 10);
    
    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDate === yesterday.toDateString()) {
        // Consecutive day - increment streak
        localStorage.setItem('feedbackStreak', (currentStreak + 1).toString());
      } else {
        // Reset streak
        localStorage.setItem('feedbackStreak', '1');
      }
      localStorage.setItem('lastParticipationDate', today);
    }

    // Get appropriate XP message
    const xpData = getXPMessage(newCount);
    
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: XPToast = {
      id,
      message: xpData.message,
      xpAmount: xpData.xp,
      isMilestone: xpData.isMilestone,
      timestamp: Date.now(),
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  }, []);

  const getParticipationCount = useCallback(() => {
    return parseInt(localStorage.getItem('participationCount') || '0', 10);
  }, []);

  const getStreak = useCallback(() => {
    return parseInt(localStorage.getItem('feedbackStreak') || '0', 10);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <XPToastContext.Provider value={{ showXPToast }}>
      {children}
      
      {/* Toast Container */}
      <div 
        className="fixed top-4 right-4 z-50 space-y-2"
        aria-live="polite"
        aria-label="XP notifications"
      >
        {toasts.map((toast) => (
          <XPToastItem
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </div>
    </XPToastContext.Provider>
  );
}

interface XPToastItemProps {
  toast: XPToast;
  onRemove: (id: string) => void;
}

function XPToastItem({ toast, onRemove }: XPToastItemProps) {
  const gradientClass = toast.isMilestone 
    ? "bg-gradient-to-r from-primary-dark to-primary" 
    : "bg-gradient-to-r from-primary to-primary-light";

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl",
        "border border-white/20 backdrop-blur-sm",
        "animate-in slide-in-from-right-full duration-300 bounce-in",
        "min-w-72 max-w-96",
        gradientClass
      )}
      role="status"
      aria-label={toast.message}
    >
      {/* XP Icon */}
      <div className="flex-shrink-0">
        <div className={cn(
          "w-10 h-10 rounded-full bg-white/20 flex items-center justify-center",
          "border-2 border-white/30",
          toast.isMilestone && "animate-pulse"
        )}>
          <span className={cn(
            "font-bold",
            toast.isMilestone ? "text-lg" : "text-base"
          )}>
            {toast.isMilestone ? "🎉" : "⚡"}
          </span>
        </div>
      </div>
      
      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-mono font-bold text-white leading-tight",
          toast.isMilestone ? "text-base" : "text-sm"
        )}>
          {toast.message}
        </p>
        {toast.isMilestone && (
          <p className="text-xs text-white/80 font-mono mt-1">
            Milestone reached! 🎯
          </p>
        )}
      </div>
      
      {/* Close Button */}
      <button
        onClick={() => onRemove(toast.id)}
        className={cn(
          "flex-shrink-0 p-1.5 rounded-full hover:bg-white/20 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-white/50 text-white/80 hover:text-white"
        )}
        aria-label="Dismiss notification"
      >
        <span className="text-sm font-bold">×</span>
      </button>
    </div>
  );
}