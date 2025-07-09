"use client";

import React, { useState } from "react";
import { api } from "@/lib/trpc/react";
import { cn } from "@/lib/utils";
import { X, Trophy, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ClaimXpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentXp: number;
  voterTokenHash?: string;
}

export function ClaimXpModal({ isOpen, onClose, currentXp, voterTokenHash }: ClaimXpModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const claimXpMutation = api.vote.claimXP.useMutation({
    onSuccess: () => {
      setIsEmailSent(true);
      toast.success("Verification email sent!", {
        description: "Check your inbox to complete the XP claim process.",
      });
    },
    onError: (error) => {
      toast.error("Failed to send verification email", {
        description: error.message,
      });
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !voterTokenHash) return;

    setIsSubmitting(true);
    
    try {
      await claimXpMutation.mutateAsync({
        email,
        voterTokenHash,
      });
    } catch (error) {
      // Error handled by mutation's onError
    }
  };

  const handleClose = () => {
    setEmail("");
    setIsSubmitting(false);
    setIsEmailSent(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative mx-4 w-full max-w-md rounded-lg border-2 border-light-gray bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="size-6 text-primary" />
            <h2 className="text-xl font-bold text-off-black">Claim Your XP</h2>
          </div>
          <button
            onClick={handleClose}
            className="rounded-sm p-1 text-warm-gray hover:bg-light-gray hover:text-off-black"
          >
            <X className="size-5" />
          </button>
        </div>

        {!isEmailSent ? (
          <>
            {/* XP Display */}
            <div className="mb-6 rounded-lg bg-primary/5 p-4 text-center">
              <div className="font-mono text-3xl font-bold text-primary">
                {currentXp.toLocaleString()} XP
              </div>
              <div className="mt-1 text-sm text-warm-gray">
                Total earned through community participation
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-off-black">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-warm-gray" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={isSubmitting}
                    className={cn(
                      "w-full rounded-sm border-2 border-light-gray bg-white py-3 pl-10 pr-4",
                      "text-base text-off-black placeholder:text-warm-gray",
                      "focus:border-primary focus:outline-none",
                      "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                  />
                </div>
                <p className="mt-1 text-xs text-warm-gray">
                  We'll send you a magic link to claim your XP securely
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !email}
                className={cn(
                  "w-full rounded-sm bg-primary py-3 text-base font-semibold text-white",
                  "transition-all duration-200",
                  "hover:-translate-y-px hover:bg-off-black",
                  "disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                {isSubmitting ? "Sending..." : "Send Claim Link"}
              </button>
            </form>

            {/* Disclaimer */}
            <div className="mt-4 rounded border-l-4 border-primary/20 bg-primary/5 p-3">
              <p className="text-xs text-warm-gray">
                <strong>Privacy notice:</strong> Your email will only be used for XP claiming and 
                optional project updates. We never share your data or link it to your anonymous votes.
              </p>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="text-center">
            <CheckCircle className="mx-auto mb-4 size-12 text-green-600" />
            <h3 className="mb-2 text-lg font-semibold text-off-black">
              Verification Email Sent!
            </h3>
            <p className="mb-4 text-sm text-warm-gray">
              We've sent a secure magic link to <strong>{email}</strong>. 
              Click the link to complete your XP claim.
            </p>
            <p className="text-xs text-warm-gray">
              Check your spam folder if you don't see the email within a few minutes.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 rounded-sm bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-off-black"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClaimXpModal;