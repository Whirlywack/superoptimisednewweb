import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { Link } from "@/components/ui/Typography";
import { 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  Star,
  User,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Play,
  Pause
} from "lucide-react";

interface Testimonial {
  id: string;
  content: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating?: number;
  source?: "twitter" | "github" | "linkedin" | "email" | "direct";
  sourceUrl?: string;
  featured?: boolean;
  date?: string;
}

interface TestimonialCarouselProps extends React.HTMLAttributes<HTMLElement> {
  testimonials: Testimonial[];
  title?: string;
  description?: string;
  variant?: "default" | "minimal" | "cards" | "centered";
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showNavigation?: boolean;
  showDots?: boolean;
  showRating?: boolean;
  showSource?: boolean;
  itemsPerView?: 1 | 2 | 3;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TestimonialCarousel({
  testimonials,
  title,
  description,
  variant = "default",
  autoPlay = false,
  autoPlayInterval = 5000,
  showNavigation = true,
  showDots = true,
  showRating = true,
  showSource = true,
  itemsPerView = 1,
  size = "md",
  className,
  ...props
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  
  const totalItems = testimonials.length;
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  useEffect(() => {
    if (!isPlaying || totalItems <= itemsPerView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, maxIndex, autoPlayInterval, totalItems, itemsPerView]);

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

  const getSourceIcon = (source?: string) => {
    switch (source) {
      case "twitter":
        return Twitter;
      case "github":
        return Github;
      case "linkedin":
        return Linkedin;
      default:
        return Globe;
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => prev === 0 ? maxIndex : prev - 1);
  };

  const goToNext = () => {
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <LucideIcon
        key={i}
        icon={Star}
        size="xs"
        className={cn(
          i < rating ? "text-yellow-500" : "text-light-gray dark:text-warm-gray/30"
        )}
      />
    ));
  };

  const renderTestimonial = (testimonial: Testimonial, index: number) => {
    const SourceIcon = getSourceIcon(testimonial.source);
    
    return (
      <div
        key={testimonial.id}
        className={cn(
          "space-y-6",
          variant === "cards" && "rounded-lg border border-light-gray bg-off-white p-6 dark:border-warm-gray/30 dark:bg-off-black",
          variant === "centered" && "mx-auto max-w-3xl text-center"
        )}
      >
        {/* Quote Icon */}
        {variant !== "minimal" && (
          <div className={cn(
            "flex",
            variant === "centered" ? "justify-center" : "justify-start"
          )}>
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
              <LucideIcon icon={Quote} size="sm" className="text-primary" />
            </div>
          </div>
        )}

        {/* Content */}
        <blockquote className={cn(
          "leading-relaxed text-warm-gray",
          size === "sm" ? "text-base" : size === "md" ? "text-lg" : "text-xl",
          variant === "centered" && "text-center"
        )}>
          "{testimonial.content}"
        </blockquote>

        {/* Rating */}
        {showRating && testimonial.rating && (
          <div className={cn(
            "flex gap-1",
            variant === "centered" ? "justify-center" : "justify-start"
          )}>
            {renderStars(testimonial.rating)}
          </div>
        )}

        {/* Author */}
        <div className={cn(
          "flex items-center gap-4",
          variant === "centered" && "justify-center"
        )}>
          {/* Avatar */}
          <div className="shrink-0">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className="size-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-12 items-center justify-center rounded-full bg-light-gray dark:bg-warm-gray/20">
                <LucideIcon icon={User} size="sm" className="text-warm-gray" />
              </div>
            )}
          </div>

          {/* Author Info */}
          <div className={cn(
            "space-y-1",
            variant === "centered" && "text-center"
          )}>
            <p className="font-medium text-off-black dark:text-off-white">
              {testimonial.author}
            </p>
            {(testimonial.role || testimonial.company) && (
              <p className="text-sm text-warm-gray">
                {testimonial.role}
                {testimonial.role && testimonial.company && " at "}
                {testimonial.company}
              </p>
            )}
            {testimonial.date && (
              <p className="text-xs text-warm-gray">{testimonial.date}</p>
            )}
          </div>

          {/* Source */}
          {showSource && testimonial.source && (
            <div className="ml-auto">
              {testimonial.sourceUrl ? (
                <Link href={testimonial.sourceUrl} external className="no-underline">
                  <div className="flex size-8 items-center justify-center rounded-full bg-light-gray transition-colors hover:bg-primary/10 dark:bg-warm-gray/20">
                    <LucideIcon icon={SourceIcon} size="xs" className="text-warm-gray" />
                  </div>
                </Link>
              ) : (
                <div className="flex size-8 items-center justify-center rounded-full bg-light-gray dark:bg-warm-gray/20">
                  <LucideIcon icon={SourceIcon} size="xs" className="text-warm-gray" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (variant === "minimal") {
    return (
      <div className={cn("space-y-6", className)} {...props}>
        {title && (
          <h2 className="text-xl font-semibold text-off-black dark:text-off-white">
            {title}
          </h2>
        )}
        
        <div className="space-y-6">
          {testimonials.slice(currentIndex, currentIndex + itemsPerView).map((testimonial) =>
            renderTestimonial(testimonial, 0)
          )}
        </div>

        {showNavigation && totalItems > itemsPerView && (
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
            >
              <LucideIcon icon={ChevronLeft} size="sm" />
            </Button>
            
            <span className="text-sm text-warm-gray">
              {currentIndex + 1} of {totalItems}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              disabled={currentIndex >= maxIndex}
            >
              <LucideIcon icon={ChevronRight} size="sm" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn(sizeClasses[size], className)} {...props}>
      <div className="space-y-8">
        {/* Header */}
        {(title || description) && (
          <div className="space-y-4 text-center">
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
                "mx-auto max-w-3xl leading-relaxed text-warm-gray",
                size === "lg" ? "text-lg" : "text-base"
              )}>
                {description}
              </p>
            )}
          </div>
        )}

        {/* Carousel Container */}
        <div className="relative">
          {/* Testimonials */}
          <div className="overflow-hidden">
            <div 
              className={cn(
                "flex transition-transform duration-500 ease-in-out",
                itemsPerView > 1 && "gap-6"
              )}
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                width: `${(totalItems * 100) / itemsPerView}%`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={cn(
                    "shrink-0",
                    itemsPerView === 1 && "w-full",
                    itemsPerView === 2 && "w-1/2",
                    itemsPerView === 3 && "w-1/3"
                  )}
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  {renderTestimonial(testimonial, index)}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {showNavigation && totalItems > itemsPerView && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2"
                onClick={goToPrevious}
                disabled={currentIndex === 0}
              >
                <LucideIcon icon={ChevronLeft} size="md" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4"
                onClick={goToNext}
                disabled={currentIndex >= maxIndex}
              >
                <LucideIcon icon={ChevronRight} size="md" />
              </Button>
            </>
          )}
        </div>

        {/* Controls */}
        {(showDots || autoPlay) && totalItems > itemsPerView && (
          <div className="flex items-center justify-center gap-4">
            {/* Dots */}
            {showDots && (
              <div className="flex gap-2">
                {Array.from({ length: maxIndex + 1 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={cn(
                      "size-2 rounded-full transition-all",
                      i === currentIndex
                        ? "w-6 bg-primary"
                        : "bg-light-gray hover:bg-warm-gray dark:bg-warm-gray/30"
                    )}
                  />
                ))}
              </div>
            )}

            {/* Auto Play Toggle */}
            {autoPlay && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAutoPlay}
                className="text-warm-gray hover:text-primary"
              >
                <LucideIcon icon={isPlaying ? Pause : Play} size="sm" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}