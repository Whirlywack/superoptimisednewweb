import React from "react";
import { cn } from "@/lib/utils";
import { H4, Paragraph, MonoText, Link } from "@/components/ui/Typography";
import { LucideIcon } from "@/components/ui/Icon";
import { MapPin, Link as LinkIcon, Mail, Calendar } from "lucide-react";

interface AuthorCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  email?: string;
  joinedDate?: string;
  role?: string;
  variant?: "card" | "inline" | "minimal";
  size?: "sm" | "md" | "lg";
  showContact?: boolean;
  className?: string;
}

export function AuthorCard({
  name,
  bio,
  avatar,
  location,
  website,
  email,
  joinedDate,
  role,
  variant = "card",
  size = "md",
  showContact = true,
  className,
  ...props
}: AuthorCardProps) {
  const sizeClasses = {
    sm: {
      container: variant === "card" ? "p-4" : "",
      avatar: "h-12 w-12",
      name: "text-lg",
      spacing: "space-y-2",
      gap: "gap-3",
    },
    md: {
      container: variant === "card" ? "p-6" : "",
      avatar: "h-16 w-16",
      name: "text-xl",
      spacing: "space-y-3",
      gap: "gap-4",
    },
    lg: {
      container: variant === "card" ? "p-8" : "",
      avatar: "h-20 w-20",
      name: "text-2xl",
      spacing: "space-y-4",
      gap: "gap-6",
    },
  };

  const variantClasses = {
    card: cn(
      "bg-off-white dark:bg-off-black",
      "border border-light-gray dark:border-warm-gray/30",
      "rounded-lg"
    ),
    inline: "flex items-center",
    minimal: "text-center",
  };

  const isInline = variant === "inline";

  return (
    <div
      className={cn(
        variantClasses[variant],
        sizeClasses[size].container,
        !isInline && sizeClasses[size].spacing,
        isInline && sizeClasses[size].gap,
        className
      )}
      {...props}
    >
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0",
        isInline ? "" : "flex justify-center"
      )}>
        {avatar ? (
          <img
            src={avatar}
            alt={`${name} avatar`}
            className={cn(
              "rounded-full object-cover bg-light-gray dark:bg-warm-gray/20",
              sizeClasses[size].avatar
            )}
          />
        ) : (
          <div
            className={cn(
              "rounded-full bg-primary/10 flex items-center justify-center",
              sizeClasses[size].avatar
            )}
          >
            <span className="text-primary font-medium text-lg">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn(
        "flex-1 min-w-0",
        !isInline && variant === "minimal" && "text-center"
      )}>
        {/* Name and Role */}
        <div className={cn(!isInline && "space-y-1")}>
          <H4 className={cn(sizeClasses[size].name, "mb-0")}>
            {name}
          </H4>
          
          {role && (
            <MonoText variant="muted" className="text-sm">
              {role}
            </MonoText>
          )}
        </div>

        {/* Bio */}
        {bio && (
          <Paragraph variant="muted" className={cn(
            "text-sm leading-relaxed",
            isInline ? "mt-1" : "mt-2"
          )}>
            {bio}
          </Paragraph>
        )}

        {/* Meta Information */}
        {(location || joinedDate) && (
          <div className={cn(
            "flex flex-wrap items-center gap-4 text-sm text-warm-gray",
            isInline ? "mt-2" : "mt-3"
          )}>
            {location && (
              <div className="flex items-center gap-1">
                <LucideIcon icon={MapPin} size="xs" />
                <MonoText variant="muted" className="text-xs">
                  {location}
                </MonoText>
              </div>
            )}

            {joinedDate && (
              <div className="flex items-center gap-1">
                <LucideIcon icon={Calendar} size="xs" />
                <MonoText variant="muted" className="text-xs">
                  Joined {joinedDate}
                </MonoText>
              </div>
            )}
          </div>
        )}

        {/* Contact Links */}
        {showContact && (website || email) && (
          <div className={cn(
            "flex items-center gap-3",
            isInline ? "mt-2" : "mt-3"
          )}>
            {website && (
              <Link
                href={website}
                external
                variant="muted"
                className="flex items-center gap-1 text-sm no-underline hover:underline"
              >
                <LucideIcon icon={LinkIcon} size="xs" />
                <span>Website</span>
              </Link>
            )}

            {email && (
              <Link
                href={`mailto:${email}`}
                variant="muted"
                className="flex items-center gap-1 text-sm no-underline hover:underline"
              >
                <LucideIcon icon={Mail} size="xs" />
                <span>Email</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}