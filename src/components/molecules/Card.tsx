import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "outline" | "filled";
  hover?: boolean;
  clickable?: boolean;
}

const cardVariants = {
  default: "bg-card text-card-foreground border border-border shadow-sm",
  outline: "bg-transparent border border-border",
  filled: "bg-muted text-muted-foreground border-0",
};

export function Card({
  className,
  variant = "default",
  hover = false,
  clickable = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg transition-all duration-200",
        cardVariants[variant],
        hover && "hover:shadow-md hover:shadow-primary/5",
        clickable && "cursor-pointer hover:border-primary/50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn("p-6 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function CardTitle({ 
  className, 
  children, 
  as: Component = "h3",
  ...props 
}: CardTitleProps) {
  return (
    <Component 
      className={cn("text-lg font-semibold leading-none tracking-tight", className)} 
      {...props}
    >
      {children}
    </Component>
  );
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function CardDescription({ className, children, ...props }: CardDescriptionProps) {
  return (
    <p className={cn("mt-1.5 text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

interface ImageCardProps extends Omit<CardProps, 'children'> {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  imageClassName?: string;
  aspectRatio?: "square" | "video" | "portrait";
  children?: React.ReactNode;
}

const aspectRatios = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
};

export function ImageCard({
  src,
  alt,
  title,
  description,
  imageClassName,
  aspectRatio = "video",
  children,
  className,
  ...props
}: ImageCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <div className={cn("relative overflow-hidden", aspectRatios[aspectRatio])}>
        <img
          src={src}
          alt={alt}
          className={cn(
            "size-full object-cover transition-transform duration-300 hover:scale-105",
            imageClassName
          )}
        />
      </div>
      
      {(title || description || children) && (
        <>
          {(title || description) && (
            <CardHeader>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
          )}
          
          {children}
        </>
      )}
    </Card>
  );
}

interface StatCardProps extends Omit<CardProps, 'children'> {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    label?: string;
    direction: "up" | "down" | "neutral";
  };
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  description,
  trend,
  icon,
  children,
  className,
  ...props
}: StatCardProps) {
  const trendColors = {
    up: "text-primary",
    down: "text-warm-gray", 
    neutral: "text-muted-foreground",
  };

  const trendSymbols = {
    up: "↗",
    down: "↘",
    neutral: "→",
  };

  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="size-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        
        {(description || trend) && (
          <div className="mt-1 flex items-center gap-2">
            {trend && (
              <span className={cn("text-xs font-medium", trendColors[trend.direction])}>
                {trendSymbols[trend.direction]} {Math.abs(trend.value)}%
                {trend.label && ` ${trend.label}`}
              </span>
            )}
            
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ActionCardProps extends Omit<CardProps, 'children'> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}

export function ActionCard({
  title,
  description,
  icon,
  action,
  badge,
  className,
  children,
  ...props
}: ActionCardProps) {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {icon && (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                {icon}
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{title}</CardTitle>
                {badge}
              </div>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
          </div>
        </div>
      </CardHeader>
      
      {children && <CardContent>{children}</CardContent>}
      
      {action && <CardFooter>{action}</CardFooter>}
    </Card>
  );
}