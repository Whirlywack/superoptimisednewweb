"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff, RotateCcw } from "lucide-react";

interface RealTimeIndicatorProps {
  isConnected: boolean;
  isPolling: boolean;
  lastUpdated?: Date;
  onRefresh?: () => void;
  className?: string;
}

/**
 * Real-time connection indicator for admin dashboard
 * Shows connection status and provides manual refresh capability
 * Follows Elevated Brutalism design system
 */
export function RealTimeIndicator({
  isConnected,
  isPolling,
  lastUpdated,
  onRefresh,
  className = "",
}: RealTimeIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState<string>("");

  // Update time ago display
  useEffect(() => {
    if (!lastUpdated) return;

    const updateTimeAgo = () => {
      const now = new Date();
      const diff = now.getTime() - lastUpdated.getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);

      if (seconds < 60) {
        setTimeAgo(`${seconds}s ago`);
      } else if (minutes < 60) {
        setTimeAgo(`${minutes}m ago`);
      } else {
        setTimeAgo(`${Math.floor(minutes / 60)}h ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  const getStatusColor = () => {
    if (isConnected) return "var(--primary)";
    if (isPolling) return "var(--warm-gray)";
    return "var(--primary)"; // Error state
  };

  const getStatusText = () => {
    if (isConnected) return "Live";
    if (isPolling) return "Polling";
    return "Offline";
  };

  const getStatusIcon = () => {
    if (isConnected) return <Wifi size={14} />;
    if (isPolling) return <RotateCcw size={14} className="animate-spin" />;
    return <WifiOff size={14} />;
  };

  return (
    <div
      className={`flex items-center border-2 px-3 py-2 ${className}`}
      style={{
        borderColor: "var(--light-gray)",
        backgroundColor: "var(--off-white)",
        gap: "var(--space-xs)",
      }}
    >
      {/* Status Icon */}
      <div style={{ color: getStatusColor() }}>
        {getStatusIcon()}
      </div>

      {/* Status Text */}
      <div className="flex flex-col">
        <span
          className="font-medium uppercase"
          style={{
            fontSize: "var(--text-xs)",
            color: getStatusColor(),
            lineHeight: "1.2",
          }}
        >
          {getStatusText()}
        </span>
        
        {lastUpdated && (
          <span
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--warm-gray)",
              lineHeight: "1.2",
            }}
          >
            {timeAgo}
          </span>
        )}
      </div>

      {/* Manual Refresh Button */}
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="flex items-center justify-center transition-colors hover:bg-light-gray"
          style={{
            padding: "var(--space-xs)",
            backgroundColor: "transparent",
            border: "1px solid var(--light-gray)",
            color: "var(--warm-gray)",
            cursor: "pointer",
            marginLeft: "var(--space-xs)",
          }}
          title="Refresh data"
        >
          <RotateCcw size={12} />
        </button>
      )}
    </div>
  );
}

/**
 * Compact real-time indicator for minimal space usage
 */
export function CompactRealTimeIndicator({
  isConnected,
  isPolling,
  className = "",
}: {
  isConnected: boolean;
  isPolling: boolean;
  className?: string;
}) {
  const getStatusColor = () => {
    if (isConnected) return "var(--primary)";
    if (isPolling) return "var(--warm-gray)";
    return "var(--primary)";
  };

  const getStatusIcon = () => {
    if (isConnected) return <Wifi size={12} />;
    if (isPolling) return <RotateCcw size={12} className="animate-spin" />;
    return <WifiOff size={12} />;
  };

  return (
    <div
      className={`flex items-center ${className}`}
      style={{
        gap: "var(--space-xs)",
        color: getStatusColor(),
      }}
      title={isConnected ? "Live updates" : isPolling ? "Polling for updates" : "Offline"}
    >
      {getStatusIcon()}
      <span
        className="font-medium uppercase"
        style={{
          fontSize: "var(--text-xs)",
          letterSpacing: "0.05em",
        }}
      >
        {isConnected ? "Live" : isPolling ? "Polling" : "Offline"}
      </span>
    </div>
  );
}

/**
 * Real-time pulse indicator for subtle visual feedback
 */
export function PulseIndicator({
  isActive,
  className = "",
}: {
  isActive: boolean;
  className?: string;
}) {
  if (!isActive) return null;

  return (
    <div
      className={`flex items-center ${className}`}
      style={{ gap: "var(--space-xs)" }}
    >
      <div
        className="animate-pulse rounded-full"
        style={{
          width: "8px",
          height: "8px",
          backgroundColor: "var(--primary)",
        }}
      />
      <span
        className="font-medium uppercase"
        style={{
          fontSize: "var(--text-xs)",
          color: "var(--primary)",
          letterSpacing: "0.05em",
        }}
      >
        Updating
      </span>
    </div>
  );
}