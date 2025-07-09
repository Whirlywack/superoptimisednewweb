import React from 'react';
import { cn } from '@/lib/utils';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Flag, 
  Save, 
  X, 
  Menu,
  ChevronLeft,
  RotateCcw
} from 'lucide-react';

export interface QuestionProgress {
  id: string;
  title: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isFlagged: boolean;
  isSkipped: boolean;
  hasError: boolean;
  isOptional: boolean;
}

export interface ProgressHeaderProps {
  /** Current questionnaire title */
  title?: string;
  /** Optional subtitle or description */
  subtitle?: string;
  /** Current question index (0-based) */
  currentIndex: number;
  /** Total number of questions */
  totalQuestions: number;
  /** Detailed progress for each question */
  questionProgress?: QuestionProgress[];
  /** Overall completion percentage (0-100) */
  completionPercentage?: number;
  /** Estimated time remaining */
  estimatedTimeRemaining?: string;
  /** Time elapsed since start */
  timeElapsed?: string;
  /** Last saved timestamp */
  lastSaved?: Date;
  /** Whether auto-save is enabled */
  autoSaveEnabled?: boolean;
  /** Whether to show detailed progress */
  showDetailedProgress?: boolean;
  /** Whether to show time indicators */
  showTimeIndicators?: boolean;
  /** Whether to show save status */
  showSaveStatus?: boolean;
  /** Whether to show exit option */
  showExit?: boolean;
  /** Whether the header is collapsible on mobile */
  collapsible?: boolean;
  /** Whether progress is in error state */
  hasErrors?: boolean;
  /** Callback when exit is clicked */
  onExit?: () => void;
  /** Callback when save is clicked */
  onSave?: () => void;
  /** Callback when a specific question is clicked */
  onQuestionClick?: (questionId: string, index: number) => void;
  /** Callback when restart is clicked */
  onRestart?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function ProgressHeader({
  title = "Questionnaire",
  subtitle,
  currentIndex,
  totalQuestions,
  questionProgress,
  completionPercentage,
  estimatedTimeRemaining,
  timeElapsed,
  lastSaved,
  autoSaveEnabled = false,
  showDetailedProgress = false,
  showTimeIndicators = true,
  showSaveStatus = true,
  showExit = true,
  collapsible = true,
  hasErrors = false,
  onExit,
  onSave,
  onQuestionClick,
  onRestart,
  className,
}: ProgressHeaderProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const calculatedPercentage = completionPercentage ?? ((currentIndex + 1) / totalQuestions) * 100;
  const completedQuestions = questionProgress?.filter(q => q.isCompleted).length ?? currentIndex;
  const flaggedQuestions = questionProgress?.filter(q => q.isFlagged).length ?? 0;
  const questionsWithErrors = questionProgress?.filter(q => q.hasError).length ?? 0;

  const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  const getQuestionIcon = (question: QuestionProgress) => {
    if (question.hasError) {
      return <X className="size-4 text-warm-gray" />;
    }
    if (question.isCompleted) {
      return <CheckCircle className="size-4 text-primary" />;
    }
    if (question.isCurrent) {
      return <Circle className="size-4 fill-current text-primary" />;
    }
    return <Circle className="size-4 text-warm-gray" />;
  };

  const getQuestionStatus = (question: QuestionProgress): string => {
    if (question.hasError) return 'error';
    if (question.isCompleted) return 'completed';
    if (question.isCurrent) return 'current';
    if (question.isSkipped) return 'skipped';
    return 'pending';
  };

  return (
    <div className={cn(
      "border-b border-light-gray bg-off-white dark:border-warm-gray/30 dark:bg-off-black",
      "transition-all duration-300 ease-in-out",
      isCollapsed && collapsible ? "py-2" : "py-6",
      className
    )}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between">
          {/* Left Section: Title and Progress */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-4">
              {/* Collapse Toggle (Mobile) */}
              {collapsible && (
                <button
                  type="button"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="rounded-lg p-2 hover:bg-light-gray focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:hidden"
                  aria-label={isCollapsed ? "Expand progress" : "Collapse progress"}
                >
                  <Menu className="size-5 text-warm-gray" />
                </button>
              )}

              {/* Title and Basic Progress */}
              <div className="min-w-0 flex-1">
                {!isCollapsed && (
                  <div className="mb-3">
                    <h1 className="truncate text-xl font-semibold text-off-black dark:text-off-white sm:text-2xl">
                      {title}
                    </h1>
                    {subtitle && (
                      <p className="mt-1 truncate text-sm text-warm-gray">
                        {subtitle}
                      </p>
                    )}
                  </div>
                )}

                {/* Progress Bar and Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-warm-gray">
                      Question {currentIndex + 1} of {totalQuestions}
                    </span>
                    <span className="font-medium text-off-black dark:text-off-white">
                      {Math.round(calculatedPercentage)}% complete
                    </span>
                  </div>
                  
                  <ProgressIndicator
                    value={calculatedPercentage}
                    className="h-2"
                    variant={hasErrors ? "error" : "default"}
                    showLabel={false}
                  />

                  {/* Quick Stats */}
                  {!isCollapsed && (
                    <div className="flex items-center space-x-4 text-xs text-warm-gray">
                      <span>✓ {completedQuestions} completed</span>
                      {flaggedQuestions > 0 && (
                        <span className="text-warm-gray">{flaggedQuestions} flagged</span>
                      )}
                      {questionsWithErrors > 0 && (
                        <span className="text-warm-gray">{questionsWithErrors} errors</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Actions and Status */}
          <div className="ml-4 flex items-center space-x-2">
            {/* Time Indicators */}
            {showTimeIndicators && !isCollapsed && (
              <div className="hidden items-center space-x-4 text-xs text-warm-gray sm:flex">
                {timeElapsed && (
                  <div className="flex items-center space-x-1">
                    <Clock className="size-3" />
                    <span>{timeElapsed}</span>
                  </div>
                )}
                {estimatedTimeRemaining && (
                  <div>~{estimatedTimeRemaining} remaining</div>
                )}
              </div>
            )}

            {/* Save Status */}
            {showSaveStatus && (
              <div className="flex items-center space-x-2">
                {autoSaveEnabled ? (
                  <div className="flex items-center space-x-1 text-xs text-primary">
                    <Save className="size-3" />
                    <span className="hidden sm:inline">
                      {lastSaved ? formatTimeAgo(lastSaved) : 'Auto-save'}
                    </span>
                  </div>
                ) : onSave && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSave}
                    className="text-xs"
                  >
                    <Save className="mr-1 size-4" />
                    Save
                  </Button>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              {onRestart && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRestart}
                  className="hidden items-center space-x-1 sm:flex"
                >
                  <RotateCcw className="size-4" />
                  <span>Restart</span>
                </Button>
              )}

              {showExit && onExit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onExit}
                  className="flex items-center space-x-1 text-warm-gray hover:text-primary"
                >
                  <X className="size-4" />
                  <span className="hidden sm:inline">Exit</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Progress (Questions Overview) */}
        {showDetailedProgress && !isCollapsed && questionProgress && (
          <div className="mt-6 border-t border-light-gray pt-6 dark:border-warm-gray/30">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-off-black dark:text-off-white">
                Question Overview
              </h3>
              
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {questionProgress.map((question, index) => (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => onQuestionClick?.(question.id, index)}
                    disabled={!onQuestionClick}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg p-3 text-left transition-colors",
                      "border border-light-gray dark:border-warm-gray/30",
                      question.isCurrent && "border-primary bg-primary/5",
                      question.hasError && "border-light-gray bg-light-gray dark:bg-gray-700",
                      question.isCompleted && "border-primary bg-primary/10 dark:bg-primary/10",
                      onQuestionClick && "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      !onQuestionClick && "cursor-default"
                    )}
                    aria-label={`Question ${index + 1}: ${question.title}`}
                  >
                    <div className="shrink-0">
                      {getQuestionIcon(question)}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-warm-gray">
                          Q{index + 1}
                        </span>
                        {question.isFlagged && (
                          <Flag className="size-3 text-warm-gray" />
                        )}
                        {question.isOptional && (
                          <span className="text-xs text-warm-gray">(optional)</span>
                        )}
                      </div>
                      <p className="truncate text-sm text-off-black dark:text-off-white">
                        {question.title}
                      </p>
                      <div className="text-xs text-warm-gray">
                        {getQuestionStatus(question)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Time Indicators */}
        {showTimeIndicators && !isCollapsed && (
          <div className="mt-4 flex items-center justify-between text-xs text-warm-gray sm:hidden">
            {timeElapsed && (
              <div className="flex items-center space-x-1">
                <Clock className="size-3" />
                <span>{timeElapsed}</span>
              </div>
            )}
            {estimatedTimeRemaining && (
              <div>~{estimatedTimeRemaining} remaining</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressHeader;