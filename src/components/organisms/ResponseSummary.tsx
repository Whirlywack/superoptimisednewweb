import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/Tag';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { 
  CheckCircle, 
  Edit, 
  Flag, 
  AlertTriangle, 
  Clock, 
  User, 
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
  Share,
  Eye,
  EyeOff
} from 'lucide-react';

export interface ResponseData {
  questionId: string;
  questionText: string;
  questionType: string;
  answer: any;
  formattedAnswer?: string;
  isRequired: boolean;
  isCompleted: boolean;
  isFlagged: boolean;
  isSkipped: boolean;
  hasError: boolean;
  errorMessage?: string;
  timestamp?: Date;
  timeSpent?: number;
  confidence?: number;
  category?: string;
}

export interface SummaryStats {
  totalQuestions: number;
  completedQuestions: number;
  skippedQuestions: number;
  flaggedQuestions: number;
  questionsWithErrors: number;
  totalTimeSpent: number;
  averageConfidence?: number;
  completionPercentage: number;
}

export interface ResponseSummaryProps {
  /** Array of all responses */
  responses: ResponseData[];
  /** Summary statistics */
  stats: SummaryStats;
  /** Title for the summary */
  title?: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Show grouped by category */
  groupByCategory?: boolean;
  /** Show time spent per question */
  showTimeSpent?: boolean;
  /** Show confidence levels */
  showConfidence?: boolean;
  /** Show question numbers */
  showQuestionNumbers?: boolean;
  /** Allow editing responses */
  allowEdit?: boolean;
  /** Allow flagging/unflagging responses */
  allowFlag?: boolean;
  /** Show detailed answer formatting */
  showDetailedAnswers?: boolean;
  /** Show export options */
  showExportOptions?: boolean;
  /** Show privacy controls */
  showPrivacyControls?: boolean;
  /** Whether responses are in read-only mode */
  readOnly?: boolean;
  /** Whether to show validation errors */
  showErrors?: boolean;
  /** Callback when edit is clicked for a response */
  onEdit?: (questionId: string) => void;
  /** Callback when flag status changes */
  onFlag?: (questionId: string, isFlagged: boolean) => void;
  /** Callback when export is requested */
  onExport?: (format: 'json' | 'csv' | 'pdf') => void;
  /** Callback when sharing is requested */
  onShare?: () => void;
  /** Callback when privacy setting changes */
  onPrivacyChange?: (isPrivate: boolean) => void;
  /** Callback when submit is clicked */
  onSubmit?: () => void;
  /** Callback when continue editing is clicked */
  onContinueEditing?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export function ResponseSummary({
  responses,
  stats,
  title = "Response Summary",
  subtitle,
  groupByCategory = false,
  showTimeSpent = false,
  showConfidence = false,
  showQuestionNumbers = true,
  allowEdit = true,
  allowFlag = true,
  showDetailedAnswers = true,
  showExportOptions = false,
  showPrivacyControls = false,
  readOnly = false,
  showErrors = true,
  onEdit,
  onFlag,
  onExport,
  onShare,
  onPrivacyChange,
  onSubmit,
  onContinueEditing,
  className,
}: ResponseSummaryProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['completed']));
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedExportFormat, setSelectedExportFormat] = useState<'json' | 'csv' | 'pdf'>('json');

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const formatAnswer = (response: ResponseData): string => {
    if (response.formattedAnswer) {
      return response.formattedAnswer;
    }

    if (response.isSkipped) {
      return 'Skipped';
    }

    if (!response.answer || response.answer === '') {
      return 'No answer provided';
    }

    // Format based on question type
    switch (response.questionType) {
      case 'multiple-choice':
        return Array.isArray(response.answer) 
          ? response.answer.join(', ') 
          : String(response.answer);
      
      case 'yes-no':
        return response.answer === 'yes' ? 'Yes' : response.answer === 'no' ? 'No' : 'Unsure';
      
      case 'rating':
        return `${response.answer}/10`;
      
      case 'time-estimate':
        if (typeof response.answer === 'object' && response.answer.value && response.answer.unit) {
          return `${response.answer.value} ${response.answer.unit}`;
        }
        return String(response.answer);
      
      case 'ranking':
        return Array.isArray(response.answer) 
          ? response.answer.map((item, index) => `${index + 1}. ${item}`).join(', ')
          : String(response.answer);
      
      case 'text':
        const text = String(response.answer);
        return showDetailedAnswers ? text : text.length > 100 ? `${text.substring(0, 100)}...` : text;
      
      default:
        return String(response.answer);
    }
  };

  const formatTimeSpent = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  const getResponseIcon = (response: ResponseData) => {
    if (response.hasError) {
      return <AlertTriangle className="w-4 h-4 text-warm-gray" />;
    }
    if (response.isSkipped) {
      return <Clock className="w-4 h-4 text-warm-gray" />;
    }
    if (response.isCompleted) {
      return <CheckCircle className="w-4 h-4 text-primary" />;
    }
    return <div className="w-4 h-4 rounded-full border-2 border-warm-gray" />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-primary bg-primary/10';
    if (confidence >= 60) return 'text-warm-gray bg-light-gray';
    return 'text-warm-gray bg-light-gray';
  };

  // Group responses by category or status
  const groupedResponses = React.useMemo(() => {
    if (groupByCategory) {
      const groups: Record<string, ResponseData[]> = {};
      responses.forEach(response => {
        const category = response.category || 'General';
        if (!groups[category]) groups[category] = [];
        groups[category].push(response);
      });
      return groups;
    } else {
      // Group by completion status
      return {
        completed: responses.filter(r => r.isCompleted && !r.hasError),
        skipped: responses.filter(r => r.isSkipped),
        errors: responses.filter(r => r.hasError),
        flagged: responses.filter(r => r.isFlagged),
      };
    }
  }, [responses, groupByCategory]);

  const handlePrivacyToggle = () => {
    const newPrivacy = !isPrivate;
    setIsPrivate(newPrivacy);
    onPrivacyChange?.(newPrivacy);
  };

  const handleExport = () => {
    onExport?.(selectedExportFormat);
  };

  return (
    <div className={cn("w-full max-w-6xl mx-auto space-y-6", className)}>
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold text-off-black dark:text-off-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-warm-gray text-base leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="bg-off-white dark:bg-off-black border border-light-gray dark:border-warm-gray/30 rounded-lg p-6">
        <h2 className="text-lg font-medium text-off-black dark:text-off-white mb-4">
          Overview
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-primary">
              {stats.completedQuestions}
            </div>
            <div className="text-sm text-warm-gray">Completed</div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-warm-gray">
              {stats.skippedQuestions}
            </div>
            <div className="text-sm text-warm-gray">Skipped</div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-warm-gray">
              {stats.questionsWithErrors}
            </div>
            <div className="text-sm text-warm-gray">Errors</div>
          </div>
          
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-primary">
              {stats.flaggedQuestions}
            </div>
            <div className="text-sm text-warm-gray">Flagged</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-warm-gray">Progress</span>
            <span className="font-medium text-off-black dark:text-off-white">
              {Math.round(stats.completionPercentage)}% complete
            </span>
          </div>
          <ProgressIndicator
            value={stats.completionPercentage}
            className="h-3"
            showLabel={false}
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-light-gray dark:border-warm-gray/30 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-warm-gray" />
            <span className="text-warm-gray">
              Total time: {formatTimeSpent(stats.totalTimeSpent)}
            </span>
          </div>
          
          {stats.averageConfidence && (
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-warm-gray" />
              <span className="text-warm-gray">
                Avg confidence: {Math.round(stats.averageConfidence)}%
              </span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-warm-gray" />
            <span className="text-warm-gray">
              {stats.totalQuestions} total questions
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-light-gray/30 rounded-lg">
        <div className="flex items-center space-x-4">
          {showPrivacyControls && (
            <button
              type="button"
              onClick={handlePrivacyToggle}
              className="flex items-center space-x-2 text-sm text-warm-gray hover:text-off-black dark:hover:text-off-white"
            >
              {isPrivate ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{isPrivate ? 'Private' : 'Public'}</span>
            </button>
          )}
          
          {showExportOptions && (
            <div className="flex items-center space-x-2">
              <select
                value={selectedExportFormat}
                onChange={(e) => setSelectedExportFormat(e.target.value as any)}
                className="text-sm border border-light-gray rounded px-2 py-1"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="pdf">PDF</option>
              </select>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          )}
          
          {onShare && (
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share className="w-4 h-4 mr-1" />
              Share
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {onContinueEditing && (
            <Button variant="outline" onClick={onContinueEditing}>
              Continue Editing
            </Button>
          )}
          {onSubmit && (
            <Button onClick={onSubmit}>
              Submit Responses
            </Button>
          )}
        </div>
      </div>

      {/* Response Groups */}
      <div className="space-y-4">
        {Object.entries(groupedResponses).map(([groupName, groupResponses]) => {
          if (groupResponses.length === 0) return null;
          
          const isExpanded = expandedSections.has(groupName);
          
          return (
            <div
              key={groupName}
              className="bg-off-white dark:bg-off-black border border-light-gray dark:border-warm-gray/30 rounded-lg overflow-hidden"
            >
              {/* Group Header */}
              <button
                type="button"
                onClick={() => toggleSection(groupName)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-light-gray/30 focus:outline-none focus:bg-light-gray/30"
              >
                <div className="flex items-center space-x-3">
                  <h3 className="font-medium text-off-black dark:text-off-white capitalize">
                    {groupName} ({groupResponses.length})
                  </h3>
                  {groupName === 'errors' && groupResponses.length > 0 && (
                    <Tag variant="error" size="sm">Attention needed</Tag>
                  )}
                  {groupName === 'flagged' && groupResponses.length > 0 && (
                    <Tag variant="warning" size="sm">Review requested</Tag>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-warm-gray" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-warm-gray" />
                )}
              </button>

              {/* Group Content */}
              {isExpanded && (
                <div className="border-t border-light-gray dark:border-warm-gray/30">
                  {groupResponses.map((response, index) => (
                    <div
                      key={response.questionId}
                      className={cn(
                        "p-4 border-b border-light-gray dark:border-warm-gray/30 last:border-b-0",
                        response.hasError && "bg-light-gray dark:bg-gray-700"
                      )}
                    >
                      <div className="flex items-start justify-between space-x-4">
                        <div className="flex-1 min-w-0">
                          {/* Question */}
                          <div className="flex items-start space-x-3 mb-2">
                            {getResponseIcon(response)}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                {showQuestionNumbers && (
                                  <span className="text-xs font-medium text-warm-gray">
                                    Q{index + 1}
                                  </span>
                                )}
                                <h4 className="font-medium text-off-black dark:text-off-white">
                                  {response.questionText}
                                </h4>
                                {response.isRequired && (
                                  <span className="text-warm-gray text-sm">*</span>
                                )}
                              </div>
                              
                              {/* Answer */}
                              <div className="text-sm text-warm-gray mb-2">
                                <span className="font-medium">Answer: </span>
                                <span className={cn(
                                  response.isSkipped && "italic",
                                  response.hasError && "text-warm-gray"
                                )}>
                                  {formatAnswer(response)}
                                </span>
                              </div>

                              {/* Error Message */}
                              {response.hasError && response.errorMessage && showErrors && (
                                <div className="text-sm text-warm-gray mb-2">
                                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                                  {response.errorMessage}
                                </div>
                              )}

                              {/* Metadata */}
                              <div className="flex flex-wrap items-center gap-4 text-xs text-warm-gray">
                                {showTimeSpent && response.timeSpent && (
                                  <span>Time: {formatTimeSpent(response.timeSpent)}</span>
                                )}
                                {showConfidence && response.confidence && (
                                  <span className={cn(
                                    "px-2 py-1 rounded-full",
                                    getConfidenceColor(response.confidence)
                                  )}>
                                    {response.confidence}% confident
                                  </span>
                                )}
                                {response.timestamp && (
                                  <span>
                                    {response.timestamp.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        {!readOnly && (
                          <div className="flex items-center space-x-2">
                            {allowFlag && (
                              <button
                                type="button"
                                onClick={() => onFlag?.(response.questionId, !response.isFlagged)}
                                className={cn(
                                  "p-1 rounded hover:bg-light-gray",
                                  response.isFlagged ? "text-primary" : "text-warm-gray"
                                )}
                                aria-label={response.isFlagged ? "Remove flag" : "Flag for review"}
                              >
                                <Flag className="w-4 h-4" />
                              </button>
                            )}
                            
                            {allowEdit && onEdit && (
                              <button
                                type="button"
                                onClick={() => onEdit(response.questionId)}
                                className="p-1 rounded hover:bg-light-gray text-warm-gray hover:text-primary"
                                aria-label="Edit response"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResponseSummary;