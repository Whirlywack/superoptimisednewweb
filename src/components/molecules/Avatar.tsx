import React from "react";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  shape?: "circle" | "square";
  status?: "online" | "offline" | "away" | "busy";
  showStatus?: boolean;
}

const avatarSizes = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm", 
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
  xl: "h-16 w-16 text-xl",
  "2xl": "h-20 w-20 text-2xl",
};

const statusColors = {
  online: "bg-primary",
  offline: "bg-warm-gray", 
  away: "bg-warm-gray",
  busy: "bg-warm-gray",
};

const statusSizes = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5", 
  lg: "h-3 w-3",
  xl: "h-3.5 w-3.5",
  "2xl": "h-4 w-4",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  shape = "circle",
  status,
  showStatus = false,
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  React.useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [src]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const showImage = src && !imageError;
  const showFallback = !showImage;
  const initials = fallback ? getInitials(fallback) : "";

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        "bg-muted font-medium text-muted-foreground",
        "overflow-hidden",
        avatarSizes[size],
        shape === "circle" ? "rounded-full" : "rounded-lg",
        className
      )}
      {...props}
    >
      {showImage && (
        <img
          src={src}
          alt={alt || fallback || "Avatar"}
          onError={handleImageError}
          onLoad={handleImageLoad}
          className={cn(
            "size-full object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
      
      {showFallback && (
        <>
          {initials ? (
            <span className="select-none">{initials}</span>
          ) : (
            <User className="size-1/2" />
          )}
        </>
      )}

      {showStatus && status && (
        <div
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-background",
            statusColors[status],
            statusSizes[size]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  max?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  spacing?: "tight" | "normal" | "loose";
}

const spacingOffsets = {
  tight: "-ml-1",
  normal: "-ml-2", 
  loose: "-ml-3",
};

export function AvatarGroup({
  children,
  max = 5,
  size = "md",
  spacing = "normal",
  className,
  ...props
}: AvatarGroupProps) {
  const childrenArray = React.Children.toArray(children);
  const displayChildren = childrenArray.slice(0, max);
  const remainingCount = Math.max(0, childrenArray.length - max);

  return (
    <div
      className={cn("flex items-center", className)}
      {...props}
    >
      {displayChildren.map((child, index) => (
        <div
          key={index}
          className={cn(
            "relative rounded-full border-2 border-background",
            index > 0 && spacingOffsets[spacing]
          )}
          style={{ zIndex: displayChildren.length - index }}
        >
          {React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<AvatarProps>, {
                size,
                shape: "circle",
              })
            : child}
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div
          className={cn(
            "relative inline-flex shrink-0 items-center justify-center",
            "bg-muted text-xs font-medium text-muted-foreground",
            "rounded-full border-2 border-background",
            avatarSizes[size],
            spacingOffsets[spacing]
          )}
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

interface AvatarWithInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  status?: "online" | "offline" | "away" | "busy";
  showStatus?: boolean;
}

export function AvatarWithInfo({
  src,
  alt,
  name,
  description,
  size = "md",
  status,
  showStatus = false,
  className,
  ...props
}: AvatarWithInfoProps) {
  const avatarSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "md";
  const textSize = size === "sm" ? "text-sm" : size === "lg" ? "text-base" : "text-sm";
  const descriptionSize = size === "sm" ? "text-xs" : size === "lg" ? "text-sm" : "text-xs";

  return (
    <div
      className={cn("flex items-center gap-3", className)}
      {...props}
    >
      <Avatar
        src={src}
        alt={alt}
        fallback={name}
        size={avatarSize}
        status={status}
        showStatus={showStatus}
      />
      
      <div className="min-w-0 flex-1">
        <div className={cn("truncate font-medium", textSize)}>
          {name}
        </div>
        {description && (
          <div className={cn("truncate text-muted-foreground", descriptionSize)}>
            {description}
          </div>
        )}
      </div>
    </div>
  );
}