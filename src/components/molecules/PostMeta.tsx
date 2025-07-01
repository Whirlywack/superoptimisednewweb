import React from "react";
import { cn } from "@/lib/utils";
import { MonoText } from "@/components/ui/Typography";
import { LucideIcon } from "@/components/ui/Icon";
import { Calendar, Folder, Clock } from "lucide-react";

interface PostMetaProps extends React.HTMLAttributes<HTMLDivElement> {
  date: string;
  project?: string;
  readingTime?: string;
  variant?: "horizontal" | "vertical";
  className?: string;
}

export function PostMeta({
  date,
  project,
  readingTime,
  variant = "horizontal",
  className,
  ...props
}: PostMetaProps) {
  const isVertical = variant === "vertical";
  
  return (
    <div
      className={cn(
        "flex items-center gap-4",
        isVertical && "flex-col items-start gap-2",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1.5">
        <LucideIcon 
          icon={Calendar} 
          size="sm" 
          className="text-warm-gray" 
        />
        <MonoText variant="muted" as="time">
          {date}
        </MonoText>
      </div>

      {project && (
        <div className="flex items-center gap-1.5">
          <LucideIcon 
            icon={Folder} 
            size="sm" 
            className="text-warm-gray" 
          />
          <MonoText variant="muted">
            {project}
          </MonoText>
        </div>
      )}

      {readingTime && (
        <div className="flex items-center gap-1.5">
          <LucideIcon 
            icon={Clock} 
            size="sm" 
            className="text-warm-gray" 
          />
          <MonoText variant="muted">
            {readingTime}
          </MonoText>
        </div>
      )}
    </div>
  );
}