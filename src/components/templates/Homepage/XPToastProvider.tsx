'use client';

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface XPToast {
  id: string;
  message: string;
  timestamp: number;
}

interface XPToastContextType {
  showXPToast: (message: string) => void;
}

export const XPToastContext = createContext<XPToastContextType>({
  showXPToast: () => {},
});

interface XPToastProviderProps {
  children: ReactNode;
}

export function XPToastProvider({ children }: XPToastProviderProps) {
  const [toasts, setToasts] = useState<XPToast[]>([]);

  const showXPToast = useCallback((message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: XPToast = {
      id,
      message,
      timestamp: Date.now(),
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
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
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 bg-primary text-off-white rounded-lg shadow-lg",
        "border border-primary/20 backdrop-blur-sm",
        "animate-in slide-in-from-right-full duration-300",
        "min-w-64 max-w-80"
      )}
      role="status"
      aria-label={toast.message}
    >
      {/* XP Icon */}
      <div className="flex-shrink-0">
        <div className={cn(
          "w-8 h-8 rounded-full bg-off-white/20 flex items-center justify-center",
          "border border-off-white/30"
        )}>
          <span className="text-sm font-bold">⭐</span>
        </div>
      </div>
      
      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {toast.message}
        </p>
      </div>
      
      {/* Close Button */}
      <button
        onClick={() => onRemove(toast.id)}
        className={cn(
          "flex-shrink-0 p-1 rounded hover:bg-off-white/20 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-off-white/50"
        )}
        aria-label="Dismiss notification"
      >
        <span className="text-xs">×</span>
      </button>
    </div>
  );
}