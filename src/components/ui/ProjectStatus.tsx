import React from "react";
import { cn } from "@/lib/utils";
import { 
  CheckCircle, 
  Clock, 
  Lightbulb, 
  Pause, 
  AlertCircle, 
  Archive,
  Zap,
  Target,
  Rocket
} from "lucide-react";

interface ProjectStatusProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: "concept" | "planning" | "in-progress" | "paused" | "complete" | "archived" | "featured";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  showLabel?: boolean;
  animated?: boolean;
}

const statusConfig = {
  concept: {
    label: "Concept",
    description: "Initial idea phase",
    icon: Lightbulb,
    colors: "bg-light-gray text-primary border-primary",
  },
  planning: {
    label: "Planning",
    description: "Research and planning stage",
    icon: Target,
    colors: "bg-light-gray text-warm-gray border-warm-gray",
  },
  "in-progress": {
    label: "In Progress",
    description: "Currently being built",
    icon: Zap,
    colors: "bg-light-gray text-off-black border-primary",
  },
  paused: {
    label: "Paused",
    description: "Temporarily on hold",
    icon: Pause,
    colors: "bg-light-gray text-warm-gray border-warm-gray",
  },
  complete: {
    label: "Complete",
    description: "Successfully finished",
    icon: CheckCircle,
    colors: "bg-light-gray text-primary border-primary",
  },
  archived: {
    label: "Archived",
    description: "No longer active",
    icon: Archive,
    colors: "bg-light-gray text-warm-gray border-warm-gray",
  },
  featured: {
    label: "Featured",
    description: "Highlighted project",
    icon: Rocket,
    colors: "bg-light-gray text-primary border-primary",
  },
};

const statusSizes = {
  sm: {
    container: "px-1.5 py-0.5 text-xs",
    icon: "w-3 h-3",
    gap: "gap-1",
  },
  md: {
    container: "px-2 py-1 text-sm",
    icon: "w-3.5 h-3.5",
    gap: "gap-1.5",
  },
  lg: {
    container: "px-2.5 py-1.5 text-sm",
    icon: "w-4 h-4",
    gap: "gap-2",
  },
};

export function ProjectStatus({
  status,
  size = "md",
  showIcon = true,
  showLabel = true,
  animated = false,
  className,
  ...props
}: ProjectStatusProps) {
  const config = statusConfig[status];
  const sizeConfig = statusSizes[size];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        "transition-all duration-200",
        config.colors,
        sizeConfig.container,
        sizeConfig.gap,
        animated && status === "in-progress" && "animate-pulse",
        className
      )}
      title={config.description}
      {...props}
    >
      {showIcon && (
        <Icon 
          className={cn(
            sizeConfig.icon,
            animated && status === "in-progress" && "animate-spin"
          )} 
        />
      )}
      {showLabel && config.label}
    </span>
  );
}

interface ProjectPhaseProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPhase: "concept" | "planning" | "in-progress" | "complete";
  phases?: Array<{
    phase: "concept" | "planning" | "in-progress" | "complete";
    label?: string;
    description?: string;
    completedAt?: string;
  }>;
  showProgress?: boolean;
  compact?: boolean;
}

export function ProjectPhase({
  currentPhase,
  phases,
  showProgress = true,
  compact = false,
  className,
  ...props
}: ProjectPhaseProps) {
  const defaultPhases = [
    { phase: "concept" as const, label: "Concept", description: "Initial idea" },
    { phase: "planning" as const, label: "Planning", description: "Research & design" },
    { phase: "in-progress" as const, label: "Development", description: "Building" },
    { phase: "complete" as const, label: "Complete", description: "Finished" },
  ];

  const phaseList = phases || defaultPhases;
  const currentIndex = phaseList.findIndex(p => p.phase === currentPhase);

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)} {...props}>
        <ProjectStatus 
          status={currentPhase} 
          size="sm" 
          animated={currentPhase === "in-progress"}
        />
        {showProgress && (
          <span className="text-xs text-muted-foreground">
            {currentIndex + 1} of {phaseList.length}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)} {...props}>
      {showProgress && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Project Progress</span>
          <span className="text-muted-foreground">
            {currentIndex + 1} of {phaseList.length} phases
          </span>
        </div>
      )}
      
      <div className="space-y-2">
        {phaseList.map((phase, index) => {
          const isCurrentPhase = phase.phase === currentPhase;
          const isCompleted = index < currentIndex;
          const config = statusConfig[phase.phase];
          const Icon = config.icon;

          return (
            <div
              key={phase.phase}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg transition-all duration-200",
                isCurrentPhase && "bg-muted/50",
                isCompleted && "opacity-60"
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border",
                  isCompleted ? statusConfig.complete.colors : config.colors,
                  isCurrentPhase && "animate-pulse"
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn("font-medium text-sm", isCurrentPhase && "text-foreground")}>
                    {phase.label || config.label}
                  </span>
                  {isCurrentPhase && (
                    <ProjectStatus 
                      status={currentPhase} 
                      size="sm" 
                      showIcon={false}
                      animated={currentPhase === "in-progress"}
                    />
                  )}
                </div>
                
                {phase.description && (
                  <p className="text-xs text-muted-foreground">
                    {phase.description}
                  </p>
                )}
                
                {'completedAt' in phase && phase.completedAt && isCompleted && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Completed {phase.completedAt}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface BuildingStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  project: string;
  status: "concept" | "planning" | "in-progress" | "paused" | "complete";
  progress?: number;
  lastUpdated?: string;
  nextMilestone?: string;
  showDetails?: boolean;
}

export function BuildingStatus({
  project,
  status,
  progress,
  lastUpdated,
  nextMilestone,
  showDetails = true,
  className,
  ...props
}: BuildingStatusProps) {
  return (
    <div 
      className={cn(
        "border rounded-lg p-4 space-y-3",
        "bg-gradient-to-br from-background to-muted/30",
        className
      )} 
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{project}</h3>
          {showDetails && (
            <p className="text-sm text-muted-foreground">Current building focus</p>
          )}
        </div>
        
        <ProjectStatus 
          status={status} 
          animated={status === "in-progress"}
          size="lg"
        />
      </div>

      {showDetails && (
        <>
          {progress !== undefined && status === "in-progress" && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-2 text-sm">
            {lastUpdated && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last updated:</span>
                <span className="font-mono text-xs">{lastUpdated}</span>
              </div>
            )}
            
            {nextMilestone && status === "in-progress" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next milestone:</span>
                <span className="text-xs">{nextMilestone}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}