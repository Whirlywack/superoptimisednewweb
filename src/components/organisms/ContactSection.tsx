import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import type { 
  Mail} from "lucide-react";
import { 
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

interface ContactMethod {
  type: "email" | "phone" | "social" | "form";
  label: string;
  value: string;
  href?: string;
  icon: typeof Mail;
  description?: string;
  availability?: string;
}

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "tel";
  required?: boolean;
  placeholder?: string;
}

interface ContactSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSubmit'> {
  title?: string;
  description?: string;
  contactMethods?: ContactMethod[];
  showForm?: boolean;
  formFields?: FormField[];
  formTitle?: string;
  formDescription?: string;
  submitText?: string;
  onSubmit?: (data: Record<string, string>) => Promise<void>;
  variant?: "default" | "split" | "form-only" | "contact-only";
  size?: "sm" | "md" | "lg";
  showAvailability?: boolean;
  className?: string;
}

export function ContactSection({
  title = "Get in Touch",
  description,
  contactMethods = [],
  showForm = true,
  formFields = [
    { name: "name", label: "Name", type: "text", required: true, placeholder: "Your name" },
    { name: "email", label: "Email", type: "email", required: true, placeholder: "your.email@example.com" },
    { name: "subject", label: "Subject", type: "text", required: true, placeholder: "What's this about?" },
    { name: "message", label: "Message", type: "textarea", required: true, placeholder: "Tell us more..." },
  ],
  formTitle = "Send a Message",
  formDescription,
  submitText = "Send Message",
  onSubmit,
  variant = "default",
  size = "md",
  showAvailability = false,
  className,
  ...props
}: ContactSectionProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const sizeClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
  };

  const titleSizes = {
    sm: "text-xl",
    md: "text-2xl lg:text-3xl",
    lg: "text-3xl lg:text-4xl",
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit || isSubmitting) return;

    // Validate required fields
    const missingFields = formFields
      .filter(field => field.required && !formData[field.name]?.trim())
      .map(field => field.label);

    if (missingFields.length > 0) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await onSubmit(formData);
      setSubmitStatus("success");
      setFormData({});
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContactMethod = (method: ContactMethod) => (
    <div key={method.type + method.value} className="space-y-3">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <LucideIcon icon={method.icon} size="md" className="text-primary" />
        </div>
        
        <div className="space-y-1">
          <h3 className="font-medium text-off-black dark:text-off-white">
            {method.label}
          </h3>
          
          {method.href ? (
            <Link 
              href={method.href} 
              external={method.type === "social"}
              className="text-warm-gray transition-colors hover:text-primary"
            >
              {method.value}
            </Link>
          ) : (
            <p className="text-warm-gray">{method.value}</p>
          )}
          
          {method.description && (
            <p className="text-sm text-warm-gray">{method.description}</p>
          )}
          
          {showAvailability && method.availability && (
            <div className="flex items-center gap-2 text-sm text-warm-gray">
              <LucideIcon icon={Clock} size="xs" />
              <span>{method.availability}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-off-black dark:text-off-white">
          {formTitle}
        </h3>
        {formDescription && (
          <p className="text-warm-gray">{formDescription}</p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {formFields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label 
              htmlFor={field.name}
              className="block text-sm font-medium text-off-black dark:text-off-white"
            >
              {field.label}
              {field.required && <span className="ml-1 text-red-500">*</span>}
            </label>
            
            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                rows={4}
                className={cn(
                  "w-full rounded-lg border border-light-gray px-3 py-2 dark:border-warm-gray/30",
                  "bg-off-white text-off-black dark:bg-off-black dark:text-off-white",
                  "placeholder:text-warm-gray",
                  "focus:border-primary focus:ring-2 focus:ring-primary/20",
                  "resize-y transition-colors"
                )}
              />
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                placeholder={field.placeholder}
                className={cn(
                  "w-full rounded-lg border border-light-gray px-3 py-2 dark:border-warm-gray/30",
                  "bg-off-white text-off-black dark:bg-off-black dark:text-off-white",
                  "placeholder:text-warm-gray",
                  "focus:border-primary focus:ring-2 focus:ring-primary/20",
                  "transition-colors"
                )}
              />
            )}
          </div>
        ))}

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            <span className="flex items-center gap-2">
              {isSubmitting ? (
                <LucideIcon icon={Loader2} size="sm" className="animate-spin" />
              ) : (
                <LucideIcon icon={Send} size="sm" />
              )}
              {isSubmitting ? "Sending..." : submitText}
            </span>
          </Button>
        </div>

        {/* Status Messages */}
        {submitStatus === "success" && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <LucideIcon icon={CheckCircle} size="sm" />
            <span>Message sent successfully! We&apos;ll get back to you soon.</span>
          </div>
        )}
        
        {submitStatus === "error" && (
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <LucideIcon icon={AlertCircle} size="sm" />
            <span>Please fill in all required fields and try again.</span>
          </div>
        )}
      </form>
    </div>
  );

  if (variant === "form-only") {
    return (
      <div className={cn(sizeClasses[size], className)} {...props}>
        <div className="mx-auto max-w-2xl">
          {title && (
            <div className="mb-8 space-y-4 text-center">
              <h2 className={cn(
                titleSizes[size],
                "font-bold text-off-black dark:text-off-white"
              )}>
                {title}
              </h2>
              {description && (
                <p className="leading-relaxed text-warm-gray">
                  {description}
                </p>
              )}
            </div>
          )}
          {renderForm()}
        </div>
      </div>
    );
  }

  if (variant === "contact-only") {
    return (
      <div className={cn(sizeClasses[size], className)} {...props}>
        <div className="mx-auto max-w-2xl space-y-8">
          {title && (
            <div className="space-y-4 text-center">
              <h2 className={cn(
                titleSizes[size],
                "font-bold text-off-black dark:text-off-white"
              )}>
                {title}
              </h2>
              {description && (
                <p className="leading-relaxed text-warm-gray">
                  {description}
                </p>
              )}
            </div>
          )}
          
          <div className="space-y-6">
            {contactMethods.map(renderContactMethod)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(sizeClasses[size], className)} {...props}>
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h2 className={cn(
            titleSizes[size],
            "font-bold text-off-black dark:text-off-white"
          )}>
            {title}
          </h2>
          {description && (
            <p className={cn(
              "mx-auto max-w-3xl leading-relaxed text-warm-gray",
              size === "lg" ? "text-lg" : "text-base"
            )}>
              {description}
            </p>
          )}
        </div>

        {/* Content */}
        <div className={cn(
          "grid gap-8",
          variant === "split" 
            ? "lg:grid-cols-2 lg:gap-12"
            : "grid-cols-1"
        )}>
          {/* Contact Methods */}
          {contactMethods.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-off-black dark:text-off-white">
                Contact Information
              </h3>
              <div className="space-y-6">
                {contactMethods.map(renderContactMethod)}
              </div>
            </div>
          )}

          {/* Form */}
          {showForm && renderForm()}
        </div>
      </div>
    </div>
  );
}