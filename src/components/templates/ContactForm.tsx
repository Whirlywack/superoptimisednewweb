import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import { 
  Mail, 
  User, 
  MessageCircle, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  MapPin, 
  Clock, 
  Calendar, 
  Building, 
  Globe, 
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  MessageSquare,
  HelpCircle,
  FileText,
  Briefcase,
  Heart,
  Lightbulb,
  Bug,
  Star,
  Zap,
  Shield,
  Users,
  Code,
  Headphones,
  CreditCard
} from "lucide-react";

interface ContactMethod {
  id: string;
  type: "email" | "phone" | "address" | "social" | "chat";
  label: string;
  value: string;
  href?: string;
  icon: React.ComponentType<any>;
  description?: string;
  available?: boolean;
  hours?: string;
}

interface FormField {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox" | "radio";
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    custom?: (value: string) => string | null;
  };
}

interface ContactFormProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  description?: string;
  successTitle?: string;
  successMessage?: string;
  errorMessage?: string;
  submitButtonText?: string;
  showContactMethods?: boolean;
  showBusinessHours?: boolean;
  showSocialLinks?: boolean;
  contactMethods?: ContactMethod[];
  fields?: FormField[];
  businessHours?: Array<{
    day: string;
    hours: string;
    isToday?: boolean;
  }>;
  socialLinks?: Array<{
    platform: string;
    url: string;
    icon: React.ComponentType<any>;
  }>;
  companyInfo?: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  supportCategories?: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
  }>;
  showSupportCategories?: boolean;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  onSubmit?: (data: Record<string, any>) => void;
  onMethodClick?: (method: ContactMethod) => void;
  className?: string;
}

export function ContactForm({
  title = "Get in Touch",
  subtitle = "We'd love to hear from you",
  description = "Send us a message and we'll respond as soon as possible. Whether you have questions, feedback, or need support, we're here to help.",
  successTitle = "Message Sent!",
  successMessage = "Thank you for reaching out. We'll get back to you within 24 hours.",
  errorMessage = "Something went wrong. Please try again or contact us directly.",
  submitButtonText = "Send Message",
  showContactMethods = true,
  showBusinessHours = true,
  showSocialLinks = true,
  showSupportCategories = false,
  contactMethods,
  fields,
  businessHours,
  socialLinks,
  companyInfo,
  supportCategories,
  isLoading = false,
  isSuccess = false,
  isError = false,
  onSubmit,
  onMethodClick,
  className,
  ...props
}: ContactFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const defaultFields: FormField[] = [
    {
      id: "name",
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your full name",
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100,
      },
    },
    {
      id: "email",
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter your email address",
      required: true,
      validation: {
        pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      },
    },
    {
      id: "subject",
      name: "subject",
      label: "Subject",
      type: "text",
      placeholder: "What's this about?",
      required: true,
      validation: {
        minLength: 5,
        maxLength: 200,
      },
    },
    {
      id: "message",
      name: "message",
      label: "Message",
      type: "textarea",
      placeholder: "Tell us more about your inquiry...",
      required: true,
      validation: {
        minLength: 10,
        maxLength: 2000,
      },
    },
  ];

  const defaultContactMethods: ContactMethod[] = [
    {
      id: "email",
      type: "email",
      label: "Email Us",
      value: "hello@superoptimised.com",
      href: "mailto:hello@superoptimised.com",
      icon: Mail,
      description: "Send us an email anytime",
      available: true,
    },
    {
      id: "phone",
      type: "phone", 
      label: "Call Us",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
      icon: Phone,
      description: "Monday to Friday, 9AM-6PM",
      available: true,
      hours: "9AM-6PM PST",
    },
    {
      id: "chat",
      type: "chat",
      label: "Live Chat",
      value: "Available now",
      icon: MessageSquare,
      description: "Chat with our support team",
      available: true,
    },
  ];

  const defaultBusinessHours = [
    { day: "Monday", hours: "9:00 AM - 6:00 PM", isToday: false },
    { day: "Tuesday", hours: "9:00 AM - 6:00 PM", isToday: false },
    { day: "Wednesday", hours: "9:00 AM - 6:00 PM", isToday: true },
    { day: "Thursday", hours: "9:00 AM - 6:00 PM", isToday: false },
    { day: "Friday", hours: "9:00 AM - 6:00 PM", isToday: false },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM", isToday: false },
    { day: "Sunday", hours: "Closed", isToday: false },
  ];

  const defaultSocialLinks = [
    { platform: "Twitter", url: "https://twitter.com/company", icon: Twitter },
    { platform: "GitHub", url: "https://github.com/company", icon: Github },
    { platform: "LinkedIn", url: "https://linkedin.com/company/company", icon: Linkedin },
  ];

  const defaultSupportCategories = [
    {
      id: "general",
      title: "General Inquiry",
      description: "Questions about our services or general information",
      icon: HelpCircle,
    },
    {
      id: "technical",
      title: "Technical Support",
      description: "Help with technical issues or troubleshooting",
      icon: Code,
    },
    {
      id: "billing",
      title: "Billing & Sales",
      description: "Questions about pricing, billing, or sales",
      icon: CreditCard,
    },
    {
      id: "partnership",
      title: "Partnership",
      description: "Interested in partnering or collaboration",
      icon: Briefcase,
    },
    {
      id: "feedback",
      title: "Feedback",
      description: "Share your thoughts or suggestions",
      icon: Heart,
    },
    {
      id: "bug",
      title: "Bug Report",
      description: "Report a bug or technical issue",
      icon: Bug,
    },
  ];

  const displayFields = fields || defaultFields;
  const displayContactMethods = contactMethods || defaultContactMethods;
  const displayBusinessHours = businessHours || defaultBusinessHours;
  const displaySocialLinks = socialLinks || defaultSocialLinks;
  const displaySupportCategories = supportCategories || defaultSupportCategories;

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value.toString().trim() === "")) {
      return `${field.label} is required`;
    }

    if (value && field.validation) {
      const validation = field.validation;
      
      if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
        if (field.type === "email") {
          return "Please enter a valid email address";
        }
        return `${field.label} format is invalid`;
      }
      
      if (validation.minLength && value.length < validation.minLength) {
        return `${field.label} must be at least ${validation.minLength} characters`;
      }
      
      if (validation.maxLength && value.length > validation.maxLength) {
        return `${field.label} must be no more than ${validation.maxLength} characters`;
      }
      
      if (validation.custom) {
        return validation.custom(value);
      }
    }

    return null;
  };

  const handleInputChange = (field: FormField, value: any) => {
    setFormData(prev => ({ ...prev, [field.name]: value }));
    
    // Clear error when user starts typing
    if (errors[field.name]) {
      setErrors(prev => ({ ...prev, [field.name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    // Validate all fields
    displayFields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    // Add category validation if support categories are shown
    if (showSupportCategories && !selectedCategory) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const submitData = {
        ...formData,
        ...(showSupportCategories && { category: selectedCategory }),
      };
      onSubmit?.(submitData);
    }
  };

  const renderField = (field: FormField) => {
    const hasError = !!errors[field.name];
    
    return (
      <div key={field.id} className="space-y-2">
        <label htmlFor={field.id} className="block text-sm font-medium text-off-black dark:text-off-white">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {field.type === "textarea" ? (
          <textarea
            id={field.id}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={cn(
              "w-full px-3 py-2 border rounded-lg resize-none",
              "bg-off-white dark:bg-off-black text-off-black dark:text-off-white",
              "placeholder:text-warm-gray",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "transition-colors",
              hasError ? "border-red-500 dark:border-red-400" : "border-light-gray dark:border-warm-gray/30"
            )}
          />
        ) : field.type === "select" ? (
          <select
            id={field.id}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className={cn(
              "w-full px-3 py-2 border rounded-lg",
              "bg-off-white dark:bg-off-black text-off-black dark:text-off-white",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "transition-colors",
              hasError ? "border-red-500 dark:border-red-400" : "border-light-gray dark:border-warm-gray/30"
            )}
          >
            <option value="">{field.placeholder || `Select ${field.label.toLowerCase()}`}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={field.id}
            type={field.type}
            value={formData[field.name] || ""}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={field.placeholder}
            className={cn(
              "w-full px-3 py-2 border rounded-lg",
              "bg-off-white dark:bg-off-black text-off-black dark:text-off-white",
              "placeholder:text-warm-gray",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "transition-colors",
              hasError ? "border-red-500 dark:border-red-400" : "border-light-gray dark:border-warm-gray/30"
            )}
          />
        )}
        
        {hasError && (
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <LucideIcon icon={AlertCircle} size="xs" />
            <span>{errors[field.name]}</span>
          </div>
        )}
      </div>
    );
  };

  if (isSuccess) {
    return (
      <div className={cn("min-h-screen bg-off-white dark:bg-off-black flex items-center justify-center p-4", className)} {...props}>
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
            <LucideIcon icon={CheckCircle} size="xl" className="text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-off-black dark:text-off-white">
              {successTitle}
            </h1>
            <p className="text-warm-gray leading-relaxed">
              {successMessage}
            </p>
          </div>
          <Button
            onClick={() => window.location.reload()}
            variant="primary"
            size="lg"
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-off-white dark:bg-off-black py-8", className)} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center lg:text-left space-y-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-off-black dark:text-off-white">
                  {title}
                </h1>
                <p className="text-xl text-warm-gray">
                  {subtitle}
                </p>
                {description && (
                  <p className="text-warm-gray leading-relaxed max-w-2xl">
                    {description}
                  </p>
                )}
              </div>

              {/* Support Categories */}
              {showSupportCategories && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-off-black dark:text-off-white">
                    What can we help you with?
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {displaySupportCategories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        className={cn(
                          "p-4 border rounded-lg text-left transition-colors",
                          "hover:border-primary/50",
                          selectedCategory === category.id
                            ? "border-primary bg-primary/5"
                            : "border-light-gray dark:border-warm-gray/30"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <LucideIcon icon={category.icon} size="lg" className="text-primary flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="font-medium text-off-black dark:text-off-white">
                              {category.title}
                            </h3>
                            <p className="text-sm text-warm-gray mt-1">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.category && (
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                      <LucideIcon icon={AlertCircle} size="xs" />
                      <span>{errors.category}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayFields.map((field) => (
                    <div
                      key={field.id}
                      className={field.type === "textarea" ? "md:col-span-2" : ""}
                    >
                      {renderField(field)}
                    </div>
                  ))}
                </div>

                {isError && (
                  <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <LucideIcon icon={AlertCircle} size="sm" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading}
                  className="w-full md:w-auto"
                >
                  {isLoading ? (
                    <>
                      <LucideIcon icon={Send} size="sm" className="mr-2 animate-pulse" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <LucideIcon icon={Send} size="sm" className="mr-2" />
                      {submitButtonText}
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-8">
            {/* Contact Methods */}
            {showContactMethods && (
              <div className="bg-light-gray/50 dark:bg-warm-gray/10 rounded-lg p-6 space-y-6">
                <h2 className="text-lg font-semibold text-off-black dark:text-off-white">
                  Other Ways to Reach Us
                </h2>
                <div className="space-y-4">
                  {displayContactMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => method.href ? window.open(method.href, '_blank') : onMethodClick?.(method)}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg transition-colors",
                        method.href || onMethodClick ? "cursor-pointer hover:bg-off-white/50 dark:hover:bg-off-black/20" : ""
                      )}
                    >
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <LucideIcon icon={method.icon} size="sm" className="text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-off-black dark:text-off-white">
                          {method.label}
                        </h3>
                        <p className="text-sm text-warm-gray">
                          {method.value}
                        </p>
                        {method.description && (
                          <p className="text-xs text-warm-gray">
                            {method.description}
                          </p>
                        )}
                        {method.hours && (
                          <p className="text-xs text-warm-gray">
                            {method.hours}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Business Hours */}
            {showBusinessHours && (
              <div className="bg-light-gray/50 dark:bg-warm-gray/10 rounded-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold text-off-black dark:text-off-white flex items-center gap-2">
                  <LucideIcon icon={Clock} size="sm" />
                  Business Hours
                </h2>
                <div className="space-y-2">
                  {displayBusinessHours.map((day) => (
                    <div
                      key={day.day}
                      className={cn(
                        "flex justify-between items-center text-sm",
                        day.isToday ? "font-medium text-off-black dark:text-off-white" : "text-warm-gray"
                      )}
                    >
                      <span>{day.day}</span>
                      <span>{day.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {showSocialLinks && displaySocialLinks.length > 0 && (
              <div className="bg-light-gray/50 dark:bg-warm-gray/10 rounded-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold text-off-black dark:text-off-white">
                  Follow Us
                </h2>
                <div className="flex items-center gap-3">
                  {displaySocialLinks.map((social) => (
                    <Link
                      key={social.platform}
                      href={social.url}
                      external
                      className="p-3 bg-off-white dark:bg-off-black rounded-lg hover:bg-primary/10 transition-colors text-warm-gray hover:text-primary"
                    >
                      <LucideIcon icon={social.icon} size="sm" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Company Info */}
            {companyInfo && (
              <div className="bg-light-gray/50 dark:bg-warm-gray/10 rounded-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold text-off-black dark:text-off-white">
                  {companyInfo.name}
                </h2>
                <div className="space-y-3 text-sm text-warm-gray">
                  {companyInfo.address && (
                    <div className="flex items-start gap-2">
                      <LucideIcon icon={MapPin} size="xs" className="mt-0.5" />
                      <span>{companyInfo.address}</span>
                    </div>
                  )}
                  {companyInfo.phone && (
                    <div className="flex items-center gap-2">
                      <LucideIcon icon={Phone} size="xs" />
                      <span>{companyInfo.phone}</span>
                    </div>
                  )}
                  {companyInfo.email && (
                    <div className="flex items-center gap-2">
                      <LucideIcon icon={Mail} size="xs" />
                      <span>{companyInfo.email}</span>
                    </div>
                  )}
                  {companyInfo.website && (
                    <div className="flex items-center gap-2">
                      <LucideIcon icon={Globe} size="xs" />
                      <Link href={companyInfo.website} external className="text-primary hover:underline">
                        {companyInfo.website}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}