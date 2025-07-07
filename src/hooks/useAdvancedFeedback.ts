"use client";

import { useCallback, useRef } from "react";

export interface FeedbackOptions {
  haptic?: boolean;
  sound?: boolean;
  visual?: boolean;
}

export function useAdvancedFeedback() {
  const audioContext = useRef<AudioContext | null>(null);

  // Initialize audio context on first use
  const getAudioContext = useCallback(() => {
    if (!audioContext.current && typeof window !== "undefined") {
      try {
        audioContext.current = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      } catch (error) {
        console.warn("Audio feedback not available:", error);
      }
    }
    return audioContext.current;
  }, []);

  // Haptic feedback for mobile devices
  const triggerHaptic = useCallback((intensity: "light" | "medium" | "heavy" = "light") => {
    if (typeof window !== "undefined" && "navigator" in window && "vibrate" in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
      };
      navigator.vibrate(patterns[intensity]);
    }
  }, []);

  // Audio feedback
  const playSound = useCallback(
    (type: "success" | "error" | "click" | "progress") => {
      const context = getAudioContext();
      if (!context) return;

      try {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        // Different sounds for different feedback types
        const soundConfig = {
          success: { frequency: 800, duration: 150, gain: 0.1 },
          error: { frequency: 300, duration: 200, gain: 0.15 },
          click: { frequency: 600, duration: 50, gain: 0.05 },
          progress: { frequency: 400, duration: 100, gain: 0.08 },
        };

        const config = soundConfig[type];
        oscillator.frequency.setValueAtTime(config.frequency, context.currentTime);
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0, context.currentTime);
        gainNode.gain.linearRampToValueAtTime(config.gain, context.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          context.currentTime + config.duration / 1000
        );

        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + config.duration / 1000);
      } catch (error) {
        console.warn("Audio feedback failed:", error);
      }
    },
    [getAudioContext]
  );

  // Combined feedback function
  const triggerFeedback = useCallback(
    (
      type: "success" | "error" | "click" | "progress",
      options: FeedbackOptions = { haptic: true, sound: false, visual: true }
    ) => {
      if (options.haptic) {
        const hapticIntensity =
          type === "error" ? "heavy" : type === "success" ? "medium" : "light";
        triggerHaptic(hapticIntensity);
      }

      if (options.sound) {
        playSound(type);
      }

      // Visual feedback is handled by the calling component
      return options.visual;
    },
    [triggerHaptic, playSound]
  );

  // Vote feedback specifically
  const voteSubmitted = useCallback(
    (successful: boolean) => {
      triggerFeedback(successful ? "success" : "error", {
        haptic: true,
        sound: false, // Keep quiet by default
        visual: true,
      });
    },
    [triggerFeedback]
  );

  // Progress feedback
  const progressUpdate = useCallback(() => {
    triggerFeedback("progress", {
      haptic: true,
      sound: false,
      visual: true,
    });
  }, [triggerFeedback]);

  // Click feedback
  const buttonClick = useCallback(() => {
    triggerFeedback("click", {
      haptic: true,
      sound: false,
      visual: false,
    });
  }, [triggerFeedback]);

  return {
    triggerFeedback,
    voteSubmitted,
    progressUpdate,
    buttonClick,
    triggerHaptic,
    playSound,
  };
}
