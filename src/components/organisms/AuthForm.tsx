import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Check, AlertCircle } from "lucide-react";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  mode?: "signin" | "signup" | "magic-link" | "reset-password";
  onSubmit?: (data: AuthFormData) => void | Promise<void>;
  onModeChange?: (mode: string) => void;
  loading?: boolean;
  error?: string;
  success?: string;
  showSocialAuth?: boolean;
  showMagicLink?: boolean;
  showPasswordToggle?: boolean;
  variant?: "card" | "page" | "modal";
  className?: string;
}

interface AuthFormData {
  email: string;
  password?: string;
  name?: string;
  confirmPassword?: string;
}

export function AuthForm({
  mode = "signin",
  onSubmit,
  onModeChange,
  loading = false,
  error,
  success,
  showSocialAuth = false,
  showMagicLink = true,
  showPasswordToggle = true,
  variant = "card",
  className,
  ...props
}: AuthFormProps) {
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation (not for magic link)
    if (mode !== "magic-link") {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }

      // Confirm password for signup
      if (mode === "signup") {
        if (!formData.name) {
          errors.name = "Name is required";
        }
        if (!formData.confirmPassword) {
          errors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = "Passwords do not match";
        }
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit?.(formData);
  };

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "signup":
        return "Create Account";
      case "magic-link":
        return "Sign In with Magic Link";
      case "reset-password":
        return "Reset Password";
      default:
        return "Sign In";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "signup":
        return "Create your account to get started";
      case "magic-link":
        return "Enter your email to receive a secure sign-in link";
      case "reset-password":
        return "Enter your email to receive a password reset link";
      default:
        return "Welcome back! Please sign in to your account";
    }
  };

  const getSubmitText = () => {
    if (loading) return "Please wait...";
    
    switch (mode) {
      case "signup":
        return "Create Account";
      case "magic-link":
        return "Send Magic Link";
      case "reset-password":
        return "Send Reset Link";
      default:
        return "Sign In";
    }
  };

  const variantClasses = {
    card: cn(
      "bg-off-white dark:bg-off-black",
      "border border-light-gray dark:border-warm-gray/30",
      "mx-auto max-w-md rounded-lg p-6"
    ),
    page: "max-w-md mx-auto",
    modal: "max-w-sm mx-auto",
  };

  return (
    <div
      className={cn(variantClasses[variant], className)}
      {...props}
    >
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="mb-2 text-2xl font-semibold text-off-black dark:text-off-white">
          {getTitle()}
        </h1>
        <p className="text-sm text-warm-gray">
          {getDescription()}
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className={cn(
          "mb-4 flex items-center gap-2 rounded-md p-3",
          "bg-green-50 dark:bg-green-900/20",
          "border border-green-200 dark:border-green-800/30"
        )}>
          <LucideIcon icon={Check} size="sm" className="text-green-600 dark:text-green-400" />
          <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={cn(
          "mb-4 flex items-center gap-2 rounded-md p-3",
          "bg-red-50 dark:bg-red-900/20",
          "border border-red-200 dark:border-red-800/30"
        )}>
          <LucideIcon icon={AlertCircle} size="sm" className="text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field (Signup only) */}
        {mode === "signup" && (
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-off-black dark:text-off-white"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={cn(
                "w-full rounded-md px-3 py-2",
                "bg-off-white dark:bg-off-black",
                "border border-light-gray dark:border-warm-gray/30",
                "text-off-black dark:text-off-white",
                "placeholder:text-warm-gray",
                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                fieldErrors.name && "border-red-300 dark:border-red-700"
              )}
              placeholder="Enter your full name"
              autoComplete="name"
            />
            {fieldErrors.name && (
              <p className="text-sm text-red-600 dark:text-red-400">{fieldErrors.name}</p>
            )}
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-off-black dark:text-off-white"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LucideIcon icon={Mail} size="sm" className="text-warm-gray" />
            </div>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={cn(
                "w-full rounded-md py-2 pl-10 pr-3",
                "bg-off-white dark:bg-off-black",
                "border border-light-gray dark:border-warm-gray/30",
                "text-off-black dark:text-off-white",
                "placeholder:text-warm-gray",
                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                fieldErrors.email && "border-red-300 dark:border-red-700"
              )}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>
          {fieldErrors.email && (
            <p className="text-sm text-red-600 dark:text-red-400">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password Field (Not for magic link) */}
        {mode !== "magic-link" && mode !== "reset-password" && (
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-off-black dark:text-off-white"
            >
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LucideIcon icon={Lock} size="sm" className="text-warm-gray" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={cn(
                  "w-full rounded-md px-10 py-2",
                  "bg-off-white dark:bg-off-black",
                  "border border-light-gray dark:border-warm-gray/30",
                  "text-off-black dark:text-off-white",
                  "placeholder:text-warm-gray",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50",
                  fieldErrors.password && "border-red-300 dark:border-red-700"
                )}
                placeholder="Enter your password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
              />
              {showPasswordToggle && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <LucideIcon
                    icon={showPassword ? EyeOff : Eye}
                    size="sm"
                    className="text-warm-gray hover:text-off-black dark:hover:text-off-white"
                  />
                </button>
              )}
            </div>
            {fieldErrors.password && (
              <p className="text-sm text-red-600 dark:text-red-400">{fieldErrors.password}</p>
            )}
          </div>
        )}

        {/* Confirm Password Field (Signup only) */}
        {mode === "signup" && (
          <div className="space-y-1">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-off-black dark:text-off-white"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <LucideIcon icon={Lock} size="sm" className="text-warm-gray" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={cn(
                  "w-full rounded-md px-10 py-2",
                  "bg-off-white dark:bg-off-black",
                  "border border-light-gray dark:border-warm-gray/30",
                  "text-off-black dark:text-off-white",
                  "placeholder:text-warm-gray",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50",
                  fieldErrors.confirmPassword && "border-red-300 dark:border-red-700"
                )}
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
              />
              {showPasswordToggle && (
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <LucideIcon
                    icon={showConfirmPassword ? EyeOff : Eye}
                    size="sm"
                    className="text-warm-gray hover:text-off-black dark:hover:text-off-white"
                  />
                </button>
              )}
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-sm text-red-600 dark:text-red-400">{fieldErrors.confirmPassword}</p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
          variant="primary"
        >
          <span className="flex items-center justify-center gap-2">
            {getSubmitText()}
            {!loading && <LucideIcon icon={ArrowRight} size="sm" />}
          </span>
        </Button>
      </form>

      {/* Mode Switching */}
      <div className="mt-6 space-y-3">
        {/* Forgot Password Link */}
        {mode === "signin" && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => onModeChange?.("reset-password")}
              className="text-sm text-primary transition-colors hover:text-primary/80"
            >
              Forgot your password?
            </button>
          </div>
        )}

        {/* Magic Link Option */}
        {showMagicLink && mode === "signin" && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => onModeChange?.("magic-link")}
              className="text-sm text-primary transition-colors hover:text-primary/80"
            >
              Sign in with magic link instead
            </button>
          </div>
        )}

        {/* Sign Up / Sign In Toggle */}
        <div className="text-center">
          {mode === "signin" ? (
            <p className="text-sm text-warm-gray">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => onModeChange?.("signup")}
                className="font-medium text-primary transition-colors hover:text-primary/80"
              >
                Sign up
              </button>
            </p>
          ) : mode === "signup" ? (
            <p className="text-sm text-warm-gray">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => onModeChange?.("signin")}
                className="font-medium text-primary transition-colors hover:text-primary/80"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p className="text-sm text-warm-gray">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => onModeChange?.("signin")}
                className="font-medium text-primary transition-colors hover:text-primary/80"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Terms and Privacy */}
      {mode === "signup" && (
        <div className="mt-4 text-center">
          <p className="text-xs text-warm-gray">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:text-primary/80">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:text-primary/80">
              Privacy Policy
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}