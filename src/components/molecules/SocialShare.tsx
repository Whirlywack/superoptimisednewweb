import React from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/button";
import { LucideIcon } from "@/components/ui/Icon";
import { MonoText } from "@/components/ui/Typography";
import { Share, Twitter, Facebook, Linkedin, Link as LinkIcon, Copy } from "lucide-react";

interface SocialShareProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string;
  title?: string;
  description?: string;
  platforms?: ("twitter" | "facebook" | "linkedin" | "copy")[];
  variant?: "buttons" | "dropdown" | "minimal";
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  onShare?: (platform: string, url: string) => void;
  className?: string;
}

const platformConfig = {
  twitter: {
    icon: Twitter,
    label: "Twitter",
    color: "hover:text-blue-500",
    getUrl: (url: string, title?: string) => 
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title || "")}`,
  },
  facebook: {
    icon: Facebook,
    label: "Facebook", 
    color: "hover:text-blue-600",
    getUrl: (url: string) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  linkedin: {
    icon: Linkedin,
    label: "LinkedIn",
    color: "hover:text-blue-700",
    getUrl: (url: string, title?: string, description?: string) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title || "")}&summary=${encodeURIComponent(description || "")}`,
  },
  copy: {
    icon: Copy,
    label: "Copy Link",
    color: "hover:text-primary",
    getUrl: () => "",
  },
};

export function SocialShare({
  url,
  title,
  description,
  platforms = ["twitter", "facebook", "linkedin", "copy"],
  variant = "buttons",
  size = "md",
  showLabels = false,
  onShare,
  className,
  ...props
}: SocialShareProps) {
  const [copySuccess, setCopySuccess] = React.useState(false);

  const handleShare = async (platform: keyof typeof platformConfig) => {
    const config = platformConfig[platform];
    
    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(url);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        onShare?.(platform, url);
      } catch (err) {
        console.error("Failed to copy URL:", err);
      }
    } else {
      const shareUrl = config.getUrl(url, title, description);
      window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
      onShare?.(platform, shareUrl);
    }
  };

  const buttonSizes = {
    sm: "sm" as const,
    md: "md" as const,
    lg: "lg" as const,
  };

  const iconSizes = {
    sm: "sm" as const,
    md: "md" as const,
    lg: "lg" as const,
  };

  if (variant === "minimal") {
    return (
      <div
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        <Share className="size-4 text-warm-gray" />
        <MonoText variant="muted" className="text-sm">
          Share
        </MonoText>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center",
        variant === "buttons" ? "gap-2" : "gap-1",
        className
      )}
      {...props}
    >
      {variant === "buttons" && showLabels && (
        <MonoText variant="muted" className="mr-2 text-sm">
          Share:
        </MonoText>
      )}

      {platforms.map((platform) => {
        const config = platformConfig[platform];
        const IconComponent = config.icon;
        const isCopySuccess = platform === "copy" && copySuccess;
        
        return (
          <div key={platform} className="flex items-center gap-2">
            <IconButton
              icon={
                <LucideIcon
                  icon={isCopySuccess ? LinkIcon : IconComponent}
                  size={iconSizes[size]}
                />
              }
              onClick={() => handleShare(platform)}
              variant="ghost"
              size={buttonSizes[size]}
              aria-label={`Share on ${config.label}`}
              className={cn(
                "text-warm-gray transition-colors duration-200",
                config.color,
                isCopySuccess && "text-primary"
              )}
            />
            
            {showLabels && variant === "buttons" && (
              <MonoText variant="muted" className="text-sm">
                {isCopySuccess ? "Copied!" : config.label}
              </MonoText>
            )}
          </div>
        );
      })}
    </div>
  );
}