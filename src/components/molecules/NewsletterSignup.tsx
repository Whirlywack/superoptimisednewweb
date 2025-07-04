import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/Input";
import { H3, Paragraph } from "@/components/ui/Typography";
import { LucideIcon } from "@/components/ui/Icon";
import { Mail, Check } from "lucide-react";

interface NewsletterSignupProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "card" | "inline" | "banner";
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  onSubmit?: (email: string) => Promise<void> | void;
  showIcon?: boolean;
  className?: string;
}

export function NewsletterSignup({
  variant = "card",
  title = "Stay Updated",
  description = "Get the latest updates on my building journey and new posts.",
  placeholder = "Enter your email",
  buttonText = "Subscribe",
  onSubmit,
  showIcon = true,
  className,
  ...props
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(email);
      }
      setIsSuccess(true);
      setEmail("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const variantStyles = {
    card: cn(
      "bg-off-white dark:bg-off-black",
      "border border-light-gray dark:border-warm-gray/30",
      "rounded-lg p-6",
      "space-y-4"
    ),
    inline: "space-y-3",
    banner: cn(
      "bg-light-gray dark:bg-warm-gray/10",
      "border border-light-gray dark:border-warm-gray/30",
      "rounded-lg p-4",
      "space-y-3"
    ),
  };

  if (isSuccess) {
    return (
      <div
        className={cn(variantStyles[variant], className)}
        {...props}
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
            <LucideIcon 
              icon={Check} 
              size="lg" 
              className="text-primary" 
            />
          </div>
          <H3 className="text-off-black dark:text-off-white">
            Thanks for subscribing!
          </H3>
          <Paragraph variant="muted" className="text-center">
            You'll receive updates on my latest posts and building progress.
          </Paragraph>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(variantStyles[variant], className)}
      {...props}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {showIcon && (
            <LucideIcon 
              icon={Mail} 
              size="md" 
              className="text-primary" 
            />
          )}
          <H3 className="text-off-black dark:text-off-white">
            {title}
          </H3>
        </div>
        
        {description && (
          <Paragraph variant="muted">
            {description}
          </Paragraph>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className={cn(
          variant === "inline" ? "flex gap-2" : "space-y-3",
          variant === "banner" && "flex gap-2"
        )}>
          <div className="flex-1">
            <TextField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              error={error}
              disabled={isSubmitting}
              aria-label="Email address"
            />
          </div>
          
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={!email.trim() || isSubmitting}
            className={cn(
              variant === "inline" && "mt-0",
              variant === "banner" && "mt-0"
            )}
          >
            {buttonText}
          </Button>
        </div>
      </form>
    </div>
  );
}