import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import { 
  Mail, 
  ArrowRight, 
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Clock,
  Sparkles,
  Shield,
  Zap,
  RefreshCw,
  ExternalLink,
  User,
  Lock
} from "lucide-react";

interface MagicLinkFormProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  description?: string;
  emailPlaceholder?: string;
  submitButtonText?: string;
  successTitle?: string;
  successMessage?: string;
  errorMessage?: string;
  resendText?: string;
  backToFormText?: string;
  showBenefits?: boolean;
  showSecurity?: boolean;
  benefits?: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
  }>;
  onSubmit?: (email: string) => void;
  onResend?: (email: string) => void;
  onBackToForm?: () => void;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  submittedEmail?: string;
  brandName?: string;
  supportEmail?: string;
  className?: string;
}

export function MagicLinkForm({
  title = "Sign in with Magic Link",
  subtitle = "Enter your email to receive a secure sign-in link",
  description = "We'll send you a magic link for a password-free sign-in experience. No account? We'll create one for you automatically.",
  emailPlaceholder = "Enter your email address",
  submitButtonText = "Send Magic Link",
  successTitle = "Check your email",
  successMessage = "We've sent a magic link to your email address. Click the link to sign in securely.",
  errorMessage = "Something went wrong. Please try again or contact support if the problem persists.",
  resendText = "Didn't receive the email?",
  backToFormText = "Try a different email",
  showBenefits = true,
  showSecurity = true,
  benefits,
  onSubmit,
  onResend,
  onBackToForm,
  isLoading = false,
  isSuccess = false,
  isError = false,
  submittedEmail = "",
  brandName = "Superoptimised",
  supportEmail = "support@superoptimised.com",
  className,
  ...props
}: MagicLinkFormProps) {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState("");

  const defaultBenefits = [
    {
      id: "passwordless",
      title: "No Passwords",
      description: "Sign in securely without remembering complex passwords",
      icon: Lock,
    },
    {
      id: "secure",
      title: "Enhanced Security",
      description: "Magic links are more secure than traditional passwords",
      icon: Shield,
    },
    {
      id: "instant",
      title: "Instant Access",
      description: "Get signed in quickly with just one click",
      icon: Zap,
    },
  ];

  const displayBenefits = benefits || defaultBenefits;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setValidationError("Email address is required");
      return;
    }
    
    if (!validateEmail(email.trim())) {
      setValidationError("Please enter a valid email address");
      return;
    }
    
    setValidationError("");
    onSubmit?.(email.trim());
  };

  const handleResend = () => {
    if (submittedEmail) {
      onResend?.(submittedEmail);
    }
  };

  const handleBackToForm = () => {
    setEmail("");
    setValidationError("");
    onBackToForm?.();
  };

  // Success State
  if (isSuccess) {
    return (
      <div className={cn("min-h-screen bg-off-white dark:bg-off-black flex items-center justify-center p-4", className)} {...props}>
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <LucideIcon icon={CheckCircle} size="xl" className="text-green-600 dark:text-green-400" />
            </div>

            {/* Success Content */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-off-black dark:text-off-white">
                {successTitle}
              </h1>
              
              <p className="text-warm-gray leading-relaxed">
                {successMessage}
              </p>

              {submittedEmail && (
                <div className="bg-light-gray/50 dark:bg-warm-gray/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-warm-gray">
                    <LucideIcon icon={Mail} size="xs" />
                    <span>Sent to: <strong className="text-off-black dark:text-off-white">{submittedEmail}</strong></span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm text-warm-gray">
                <LucideIcon icon={Clock} size="xs" />
                <span>Magic links expire in 15 minutes</span>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleResend}
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LucideIcon icon={RefreshCw} size="xs" className="mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <LucideIcon icon={RefreshCw} size="xs" className="mr-2" />
                      Resend Magic Link
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleBackToForm}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  <LucideIcon icon={ArrowLeft} size="xs" className="mr-2" />
                  {backToFormText}
                </Button>
              </div>
            </div>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-sm text-warm-gray">
                {resendText}{" "}
                <Link href={`mailto:${supportEmail}`} className="text-primary hover:underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form State
  return (
    <div className={cn("min-h-screen bg-off-white dark:bg-off-black", className)} {...props}>
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Form Section */}
        <div className="flex items-center justify-center p-8 lg:p-12">
          <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <LucideIcon icon={Sparkles} size="lg" className="text-primary" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-off-black dark:text-off-white">
                  {title}
                </h1>
                <p className="text-warm-gray">
                  {subtitle}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-light-gray/50 dark:bg-warm-gray/10 rounded-lg p-4">
              <p className="text-sm text-warm-gray leading-relaxed">
                {description}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-off-black dark:text-off-white">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LucideIcon icon={Mail} size="sm" className="text-warm-gray" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={emailPlaceholder}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 border rounded-lg",
                      "bg-off-white dark:bg-off-black text-off-black dark:text-off-white",
                      "placeholder:text-warm-gray",
                      "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                      "transition-colors",
                      (validationError || isError) ? "border-red-500 dark:border-red-400" : "border-light-gray dark:border-warm-gray/30"
                    )}
                  />
                </div>
                
                {validationError && (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <LucideIcon icon={AlertCircle} size="xs" />
                    <span>{validationError}</span>
                  </div>
                )}
                
                {isError && !validationError && (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <LucideIcon icon={AlertCircle} size="xs" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? (
                  <>
                    <LucideIcon icon={RefreshCw} size="sm" className="mr-2 animate-spin" />
                    Sending Magic Link...
                  </>
                ) : (
                  <>
                    <span>{submitButtonText}</span>
                    <LucideIcon icon={ArrowRight} size="sm" className="ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Help Text */}
            <div className="text-center">
              <p className="text-sm text-warm-gray">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-light-gray/30 dark:bg-warm-gray/5 p-8 lg:p-12 flex items-center">
          <div className="max-w-lg space-y-8">
            {/* Brand */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-off-black dark:text-off-white">
                Welcome to {brandName}
              </h2>
              <p className="text-warm-gray leading-relaxed">
                Join thousands of developers building amazing things with our platform. 
                No complex passwords required – just secure, seamless access.
              </p>
            </div>

            {/* Benefits */}
            {showBenefits && displayBenefits.length > 0 && (
              <div className="space-y-6">
                <h3 className="font-medium text-off-black dark:text-off-white">
                  Why Magic Links?
                </h3>
                <div className="space-y-4">
                  {displayBenefits.map((benefit) => (
                    <div key={benefit.id} className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <LucideIcon icon={benefit.icon} size="sm" className="text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium text-off-black dark:text-off-white">
                          {benefit.title}
                        </h4>
                        <p className="text-xs text-warm-gray leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {showSecurity && (
              <div className="bg-off-white/50 dark:bg-off-black/20 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <LucideIcon icon={Shield} size="sm" className="text-primary" />
                  <h4 className="text-sm font-medium text-off-black dark:text-off-white">
                    Secure & Private
                  </h4>
                </div>
                <p className="text-xs text-warm-gray leading-relaxed">
                  Magic links are sent securely and expire after 15 minutes. 
                  We never store passwords and your email is protected according to our privacy policy.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}