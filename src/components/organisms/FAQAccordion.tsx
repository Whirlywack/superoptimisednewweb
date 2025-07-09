import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "@/components/ui/Icon";
import { ChevronDown, ChevronUp, HelpCircle, Search } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  featured?: boolean;
  keywords?: string[];
}

interface FAQAccordionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  faqs: FAQItem[];
  variant?: "default" | "simple" | "categorized" | "searchable";
  size?: "sm" | "md" | "lg";
  allowMultiple?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onQuestionClick?: (faq: FAQItem) => void;
  className?: string;
}

export function FAQAccordion({
  title = "Frequently Asked Questions",
  description,
  faqs,
  variant = "default",
  size = "md",
  allowMultiple = false,
  showSearch = false,
  searchPlaceholder = "Search FAQs...",
  onQuestionClick,
  className,
  ...props
}: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const sizeClasses = {
    sm: "py-6",
    md: "py-8",
    lg: "py-12",
  };

  const titleSizes = {
    sm: "text-xl",
    md: "text-2xl lg:text-3xl",
    lg: "text-3xl lg:text-4xl",
  };

  const handleToggle = (id: string) => {
    const newOpenItems = new Set(openItems);
    
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      if (!allowMultiple) {
        newOpenItems.clear();
      }
      newOpenItems.add(id);
    }
    
    setOpenItems(newOpenItems);
    
    const faq = faqs.find(f => f.id === id);
    if (faq && onQuestionClick) {
      onQuestionClick(faq);
    }
  };

  const filteredFAQs = React.useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    
    const query = searchQuery.toLowerCase();
    return faqs.filter(faq => 
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.category?.toLowerCase().includes(query) ||
      faq.keywords?.some(keyword => keyword.toLowerCase().includes(query))
    );
  }, [faqs, searchQuery]);

  const categorizedFAQs = React.useMemo(() => {
    if (variant !== "categorized") return { "": filteredFAQs };
    
    return filteredFAQs.reduce((acc, faq) => {
      const category = faq.category || "General";
      if (!acc[category]) acc[category] = [];
      acc[category].push(faq);
      return acc;
    }, {} as Record<string, FAQItem[]>);
  }, [filteredFAQs, variant]);

  const renderFAQItem = (faq: FAQItem) => {
    const isOpen = openItems.has(faq.id);
    
    return (
      <div
        key={faq.id}
        className={cn(
          "rounded-lg border border-light-gray dark:border-warm-gray/30",
          variant === "simple" && "rounded-none border-0 border-b border-light-gray last:border-b-0 dark:border-warm-gray/30",
          faq.featured && "ring-2 ring-primary/20"
        )}
      >
        <button
          onClick={() => handleToggle(faq.id)}
          className={cn(
            "flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-light-gray/50 dark:hover:bg-warm-gray/10",
            variant === "simple" && "px-0",
            isOpen && "bg-light-gray/30 dark:bg-warm-gray/10"
          )}
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${faq.id}`}
        >
          <span className={cn(
            "font-medium leading-relaxed text-off-black dark:text-off-white",
            size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg"
          )}>
            {faq.question}
          </span>
          
          <div className="shrink-0">
            <LucideIcon 
              icon={isOpen ? ChevronUp : ChevronDown} 
              size="sm" 
              className={cn(
                "text-warm-gray transition-colors",
                isOpen && "text-primary"
              )} 
            />
          </div>
        </button>
        
        {isOpen && (
          <div
            id={`faq-answer-${faq.id}`}
            className={cn(
              "px-6 pb-4 leading-relaxed text-warm-gray",
              variant === "simple" && "px-0",
              size === "sm" ? "text-sm" : size === "md" ? "text-base" : "text-lg"
            )}
          >
            {faq.answer}
          </div>
        )}
      </div>
    );
  };

  const renderSearchInput = () => (
    <div className="relative mb-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <LucideIcon icon={Search} size="sm" className="text-warm-gray" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={searchPlaceholder}
        className={cn(
          "w-full rounded-lg border border-light-gray py-3 pl-10 pr-4 dark:border-warm-gray/30",
          "bg-off-white text-off-black dark:bg-off-black dark:text-off-white",
          "placeholder:text-warm-gray",
          "focus:border-primary focus:ring-2 focus:ring-primary/20",
          "transition-colors"
        )}
      />
    </div>
  );

  const renderSimpleVariant = () => (
    <div className={cn(sizeClasses[size], className)} {...props}>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        {(title || description) && (
          <div className="space-y-4">
            {title && (
              <h2 className={cn(
                titleSizes[size],
                "font-bold text-off-black dark:text-off-white"
              )}>
                {title}
              </h2>
            )}
            {description && (
              <p className={cn(
                "leading-relaxed text-warm-gray",
                size === "lg" ? "text-lg" : "text-base"
              )}>
                {description}
              </p>
            )}
          </div>
        )}

        {/* Search */}
        {(showSearch || variant === "searchable") && renderSearchInput()}

        {/* FAQ Items */}
        <div className="space-y-1">
          {filteredFAQs.map(renderFAQItem)}
        </div>

        {/* No Results */}
        {searchQuery && filteredFAQs.length === 0 && (
          <div className="py-8 text-center text-warm-gray">
            <LucideIcon icon={Search} size="lg" className="mx-auto mb-3 opacity-50" />
            <p>No FAQs found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );

  if (variant === "simple") {
    return renderSimpleVariant();
  }

  return (
    <div className={cn(sizeClasses[size], className)} {...props}>
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        {(title || description) && (
          <div className="space-y-4 text-center">
            {title && (
              <div className="mb-4 flex items-center justify-center gap-3">
                <LucideIcon icon={HelpCircle} size="lg" className="text-primary" />
                <h2 className={cn(
                  titleSizes[size],
                  "font-bold text-off-black dark:text-off-white"
                )}>
                  {title}
                </h2>
              </div>
            )}
            {description && (
              <p className={cn(
                "mx-auto max-w-2xl leading-relaxed text-warm-gray",
                size === "lg" ? "text-lg" : "text-base"
              )}>
                {description}
              </p>
            )}
          </div>
        )}

        {/* Search */}
        {(showSearch || variant === "searchable") && (
          <div className="mx-auto max-w-2xl">
            {renderSearchInput()}
          </div>
        )}

        {/* FAQ Content */}
        {variant === "categorized" ? (
          <div className="space-y-8">
            {Object.entries(categorizedFAQs).map(([category, categoryFAQs]) => (
              <div key={category} className="space-y-4">
                {category && (
                  <h3 className="border-b border-light-gray pb-2 text-xl font-semibold text-off-black dark:border-warm-gray/30 dark:text-off-white">
                    {category}
                  </h3>
                )}
                <div className="space-y-4">
                  {categoryFAQs.map(renderFAQItem)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFAQs.map(renderFAQItem)}
          </div>
        )}

        {/* No Results */}
        {searchQuery && filteredFAQs.length === 0 && (
          <div className="py-12 text-center text-warm-gray">
            <LucideIcon icon={Search} size="xl" className="mx-auto mb-4 opacity-50" />
            <h3 className="mb-2 text-lg font-medium">No results found</h3>
            <p>No FAQs found matching "{searchQuery}". Try different keywords or browse all questions.</p>
          </div>
        )}
      </div>
    </div>
  );
}