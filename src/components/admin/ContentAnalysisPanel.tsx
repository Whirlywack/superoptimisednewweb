"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Info, // eslint-disable-line @typescript-eslint/no-unused-vars
  X,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Eye,
  Users,
  Shield,
  Target, // eslint-disable-line @typescript-eslint/no-unused-vars
  Brain,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BiasIssue {
  type: string;
  severity: "high" | "medium" | "low";
  description: string;
  location: string;
  example: string;
  impact: string;
}

interface Ambiguity {
  phrase: string;
  issue: string;
  suggestion: string;
}

interface ImprovementSuggestion {
  issue: string;
  suggestion: string;
  reasoning: string;
  priority: "critical" | "high" | "medium" | "low";
}

interface Alternative {
  alternative: string;
  pros: string[];
  cons: string[];
  whenToUse: string;
}

interface WarningFlag {
  flag: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
}

interface ContentAnalysisResult {
  questionContext: {
    title: string;
    description?: string;
    type: string;
    category: string;
    targetAudience: string;
    config: Record<string, unknown>;
  };
  overallAssessment: {
    qualityScore: number;
    scoreExplanation: string;
    primaryStrengths: string[];
    criticalIssues: string[];
    recommendationPriority: "high" | "medium" | "low";
  };
  detailedAnalysis: {
    biasDetection: {
      score: number;
      issues: BiasIssue[];
      recommendations: string[];
    };
    clarityAssessment: {
      score: number;
      readabilityLevel: string;
      ambiguities: Ambiguity[];
      recommendations: string[];
    };
    responseQuality: {
      score: number;
      reliabilityFactors: string[];
      cognitiveLoad: "low" | "medium" | "high";
      completionLikelihood: "high" | "medium" | "low";
      dataActionability: "high" | "medium" | "low";
      recommendations: string[];
    };
    technicalAssessment: {
      answerFormatAppropriate: boolean;
      scaleAppropriate: boolean;
      optionCompleteness: "complete" | "incomplete" | "needs-review";
      questionTypeMatch: boolean;
      configurationIssues: string[];
      recommendations: string[];
    };
    accessibilityReview: {
      score: number;
      readingComplexity: "appropriate" | "too-complex" | "too-simple";
      culturalSensitivity: "high" | "medium" | "low";
      inclusivityIssues: string[];
      languageBarriers: string[];
      recommendations: string[];
    };
  };
  improvementSuggestions: {
    immediate: ImprovementSuggestion[];
    consideredAlternatives: Alternative[];
    enhancementOpportunities: string[];
  };
  bestPracticesApplied: string[];
  warningFlags: WarningFlag[];
  metadata: {
    analysisDepth: "basic" | "comprehensive";
    focusAreas: string[];
    questionComplexity: "simple" | "moderate" | "complex";
    recommendedTesting: string;
    confidenceLevel: "high" | "medium" | "low";
    processedAt: string;
    version: string;
  };
}

interface ContentAnalysisPanelProps {
  analysis: ContentAnalysisResult;
  onClose?: () => void;
  className?: string;
}

const ScoreIndicator = ({
  score,
  label,
  className,
}: {
  score: number;
  label: string;
  className?: string;
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return "bg-green-100";
    if (score >= 6) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className={cn("text-center", className)}>
      <div
        className={cn(
          "inline-flex size-16 items-center justify-center rounded-full text-lg font-bold",
          getScoreBg(score),
          getScoreColor(score)
        )}
      >
        {score.toFixed(1)}
      </div>
      <p className="mt-2 text-sm font-medium text-gray-700">{label}</p>
    </div>
  );
};

const SeverityBadge = ({ severity }: { severity: "critical" | "high" | "medium" | "low" }) => {
  const getColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium",
        getColor(severity)
      )}
    >
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
};

const CollapsibleSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  badge,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between bg-gray-50 p-4 transition-colors hover:bg-gray-100"
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className="text-gray-600" />
          <span className="font-medium text-gray-900">{title}</span>
          {badge}
        </div>
        {isOpen ? (
          <ChevronDown size={20} className="text-gray-500" />
        ) : (
          <ChevronRight size={20} className="text-gray-500" />
        )}
      </button>
      {isOpen && <div className="border-t border-gray-200 p-4">{children}</div>}
    </div>
  );
};

export function ContentAnalysisPanel({ analysis, onClose, className }: ContentAnalysisPanelProps) {
  const { overallAssessment, detailedAnalysis, improvementSuggestions, warningFlags } = analysis;

  return (
    <div className={cn("rounded-lg border border-gray-200 bg-white shadow-lg", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Content Analysis Report</h3>
          <p className="mt-1 text-sm text-gray-600">
            AI-powered quality and bias analysis for: &ldquo;{analysis.questionContext.title}&rdquo;
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <X size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      <div className="space-y-6 p-6">
        {/* Overall Assessment */}
        <div className="rounded-lg bg-blue-50 p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h4 className="mb-2 text-lg font-semibold text-gray-900">Overall Assessment</h4>
              <p className="text-gray-700">{overallAssessment.scoreExplanation}</p>
            </div>
            <ScoreIndicator score={overallAssessment.qualityScore} label="Quality Score" />
          </div>

          {/* Strengths and Issues */}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {overallAssessment.primaryStrengths.length > 0 && (
              <div>
                <h5 className="mb-2 flex items-center gap-2 font-medium text-green-800">
                  <CheckCircle size={16} />
                  Primary Strengths
                </h5>
                <ul className="space-y-1">
                  {overallAssessment.primaryStrengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-green-500" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {overallAssessment.criticalIssues.length > 0 && (
              <div>
                <h5 className="mb-2 flex items-center gap-2 font-medium text-red-800">
                  <AlertTriangle size={16} />
                  Critical Issues
                </h5>
                <ul className="space-y-1">
                  {overallAssessment.criticalIssues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-red-700">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-red-500" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <ScoreIndicator score={detailedAnalysis.biasDetection.score} label="Bias Detection" />
          <ScoreIndicator score={detailedAnalysis.clarityAssessment.score} label="Clarity" />
          <ScoreIndicator score={detailedAnalysis.responseQuality.score} label="Response Quality" />
          <ScoreIndicator
            score={detailedAnalysis.accessibilityReview.score}
            label="Accessibility"
          />
          <div className="text-center">
            <div
              className={cn(
                "inline-flex size-16 items-center justify-center rounded-full text-lg font-bold",
                detailedAnalysis.technicalAssessment.questionTypeMatch &&
                  detailedAnalysis.technicalAssessment.answerFormatAppropriate
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              )}
            >
              {detailedAnalysis.technicalAssessment.questionTypeMatch &&
              detailedAnalysis.technicalAssessment.answerFormatAppropriate
                ? "✓"
                : "✗"}
            </div>
            <p className="mt-2 text-sm font-medium text-gray-700">Technical</p>
          </div>
        </div>

        {/* Warning Flags */}
        {warningFlags.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h4 className="mb-3 flex items-center gap-2 font-medium text-amber-800">
              <AlertTriangle size={16} />
              Warning Flags
            </h4>
            <div className="space-y-2">
              {warningFlags.map((warning, index) => (
                <div key={index} className="flex items-start gap-3">
                  <SeverityBadge severity={warning.severity} />
                  <div>
                    <p className="font-medium text-amber-800">{warning.flag}</p>
                    <p className="text-sm text-amber-700">{warning.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Analysis Sections */}
        <div className="space-y-4">
          {/* Bias Detection */}
          <CollapsibleSection
            title="Bias Detection Analysis"
            icon={Shield}
            badge={
              <SeverityBadge
                severity={detailedAnalysis.biasDetection.issues.length > 0 ? "high" : "low"}
              />
            }
          >
            <div className="space-y-4">
              {detailedAnalysis.biasDetection.issues.map((issue, index) => (
                <div key={index} className="rounded border border-gray-200 p-3">
                  <div className="mb-2 flex items-start justify-between">
                    <h5 className="font-medium text-gray-900">{issue.type}</h5>
                    <SeverityBadge severity={issue.severity} />
                  </div>
                  <p className="mb-2 text-sm text-gray-700">{issue.description}</p>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>
                      <span className="font-medium">Location:</span> {issue.location}
                    </p>
                    <p>
                      <span className="font-medium">Example:</span> &ldquo;{issue.example}&rdquo;
                    </p>
                    <p>
                      <span className="font-medium">Impact:</span> {issue.impact}
                    </p>
                  </div>
                </div>
              ))}

              {detailedAnalysis.biasDetection.recommendations.length > 0 && (
                <div>
                  <h5 className="mb-2 font-medium text-gray-900">Recommendations</h5>
                  <ul className="space-y-1">
                    {detailedAnalysis.biasDetection.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-blue-500" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Clarity Assessment */}
          <CollapsibleSection
            title="Clarity Assessment"
            icon={Eye}
            badge={
              <span className="text-sm text-gray-600">
                {detailedAnalysis.clarityAssessment.readabilityLevel}
              </span>
            }
          >
            <div className="space-y-4">
              {detailedAnalysis.clarityAssessment.ambiguities.map((ambiguity, index) => (
                <div key={index} className="rounded border border-gray-200 p-3">
                  <h5 className="mb-1 font-medium text-gray-900">Ambiguous Phrase</h5>
                  <p className="mb-2 text-sm text-red-700">&ldquo;{ambiguity.phrase}&rdquo;</p>
                  <p className="mb-2 text-sm text-gray-700">
                    <span className="font-medium">Issue:</span> {ambiguity.issue}
                  </p>
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Suggestion:</span> {ambiguity.suggestion}
                  </p>
                </div>
              ))}

              {detailedAnalysis.clarityAssessment.recommendations.length > 0 && (
                <div>
                  <h5 className="mb-2 font-medium text-gray-900">Clarity Recommendations</h5>
                  <ul className="space-y-1">
                    {detailedAnalysis.clarityAssessment.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-blue-500" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Response Quality */}
          <CollapsibleSection title="Response Quality Analysis" icon={TrendingUp}>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded bg-gray-50 p-3 text-center">
                  <p className="text-sm font-medium text-gray-600">Cognitive Load</p>
                  <p
                    className={cn("mt-1 text-lg font-bold", {
                      "text-green-600": detailedAnalysis.responseQuality.cognitiveLoad === "low",
                      "text-yellow-600":
                        detailedAnalysis.responseQuality.cognitiveLoad === "medium",
                      "text-red-600": detailedAnalysis.responseQuality.cognitiveLoad === "high",
                    })}
                  >
                    {detailedAnalysis.responseQuality.cognitiveLoad.toUpperCase()}
                  </p>
                </div>
                <div className="rounded bg-gray-50 p-3 text-center">
                  <p className="text-sm font-medium text-gray-600">Completion Likelihood</p>
                  <p
                    className={cn("mt-1 text-lg font-bold", {
                      "text-green-600":
                        detailedAnalysis.responseQuality.completionLikelihood === "high",
                      "text-yellow-600":
                        detailedAnalysis.responseQuality.completionLikelihood === "medium",
                      "text-red-600":
                        detailedAnalysis.responseQuality.completionLikelihood === "low",
                    })}
                  >
                    {detailedAnalysis.responseQuality.completionLikelihood.toUpperCase()}
                  </p>
                </div>
                <div className="rounded bg-gray-50 p-3 text-center">
                  <p className="text-sm font-medium text-gray-600">Data Actionability</p>
                  <p
                    className={cn("mt-1 text-lg font-bold", {
                      "text-green-600":
                        detailedAnalysis.responseQuality.dataActionability === "high",
                      "text-yellow-600":
                        detailedAnalysis.responseQuality.dataActionability === "medium",
                      "text-red-600": detailedAnalysis.responseQuality.dataActionability === "low",
                    })}
                  >
                    {detailedAnalysis.responseQuality.dataActionability.toUpperCase()}
                  </p>
                </div>
              </div>

              {detailedAnalysis.responseQuality.reliabilityFactors.length > 0 && (
                <div>
                  <h5 className="mb-2 font-medium text-gray-900">Reliability Factors</h5>
                  <ul className="space-y-1">
                    {detailedAnalysis.responseQuality.reliabilityFactors.map((factor, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-blue-500" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Accessibility Review */}
          <CollapsibleSection title="Accessibility Review" icon={Users}>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h5 className="mb-2 font-medium text-gray-900">Reading Complexity</h5>
                  <p
                    className={cn("text-sm font-medium", {
                      "text-green-600":
                        detailedAnalysis.accessibilityReview.readingComplexity === "appropriate",
                      "text-red-600":
                        detailedAnalysis.accessibilityReview.readingComplexity !== "appropriate",
                    })}
                  >
                    {detailedAnalysis.accessibilityReview.readingComplexity
                      .replace("-", " ")
                      .toUpperCase()}
                  </p>
                </div>
                <div>
                  <h5 className="mb-2 font-medium text-gray-900">Cultural Sensitivity</h5>
                  <p
                    className={cn("text-sm font-medium", {
                      "text-green-600":
                        detailedAnalysis.accessibilityReview.culturalSensitivity === "high",
                      "text-yellow-600":
                        detailedAnalysis.accessibilityReview.culturalSensitivity === "medium",
                      "text-red-600":
                        detailedAnalysis.accessibilityReview.culturalSensitivity === "low",
                    })}
                  >
                    {detailedAnalysis.accessibilityReview.culturalSensitivity.toUpperCase()}
                  </p>
                </div>
              </div>

              {(detailedAnalysis.accessibilityReview.inclusivityIssues.length > 0 ||
                detailedAnalysis.accessibilityReview.languageBarriers.length > 0) && (
                <div className="space-y-3">
                  {detailedAnalysis.accessibilityReview.inclusivityIssues.length > 0 && (
                    <div>
                      <h5 className="mb-2 font-medium text-red-800">Inclusivity Issues</h5>
                      <ul className="space-y-1">
                        {detailedAnalysis.accessibilityReview.inclusivityIssues.map(
                          (issue, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-red-700">
                              <span className="mt-2 size-1 shrink-0 rounded-full bg-red-500" />
                              {issue}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {detailedAnalysis.accessibilityReview.languageBarriers.length > 0 && (
                    <div>
                      <h5 className="mb-2 font-medium text-orange-800">Language Barriers</h5>
                      <ul className="space-y-1">
                        {detailedAnalysis.accessibilityReview.languageBarriers.map(
                          (barrier, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2 text-sm text-orange-700"
                            >
                              <span className="mt-2 size-1 shrink-0 rounded-full bg-orange-500" />
                              {barrier}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CollapsibleSection>
        </div>

        {/* Improvement Suggestions */}
        {improvementSuggestions.immediate.length > 0 && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-6">
            <h4 className="mb-4 flex items-center gap-2 font-semibold text-green-800">
              <Zap size={16} />
              Immediate Improvement Suggestions
            </h4>
            <div className="space-y-4">
              {improvementSuggestions.immediate.map((suggestion, index) => (
                <div key={index} className="rounded border border-green-200 bg-white p-3">
                  <div className="mb-2 flex items-start justify-between">
                    <h5 className="font-medium text-gray-900">{suggestion.issue}</h5>
                    <SeverityBadge severity={suggestion.priority} />
                  </div>
                  <p className="mb-2 text-sm text-gray-700">{suggestion.suggestion}</p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Why:</span> {suggestion.reasoning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alternative Approaches */}
        {improvementSuggestions.consideredAlternatives.length > 0 && (
          <CollapsibleSection title="Alternative Approaches" icon={Brain}>
            <div className="space-y-4">
              {improvementSuggestions.consideredAlternatives.map((alternative, index) => (
                <div key={index} className="rounded border border-gray-200 p-4">
                  <h5 className="mb-2 font-medium text-gray-900">{alternative.alternative}</h5>
                  <div className="mb-3 grid gap-4 md:grid-cols-2">
                    <div>
                      <h6 className="mb-1 text-sm font-medium text-green-800">Pros</h6>
                      <ul className="space-y-1">
                        {alternative.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-green-700">
                            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-green-500" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6 className="mb-1 text-sm font-medium text-red-800">Cons</h6>
                      <ul className="space-y-1">
                        {alternative.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-red-700">
                            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-red-500" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Best used when:</span> {alternative.whenToUse}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Metadata */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h4 className="mb-3 font-medium text-gray-900">Analysis Metadata</h4>
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <p className="font-medium text-gray-600">Complexity</p>
              <p className="text-gray-900">{analysis.metadata.questionComplexity}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Confidence</p>
              <p className="text-gray-900">{analysis.metadata.confidenceLevel}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Recommended Testing</p>
              <p className="text-gray-900">{analysis.metadata.recommendedTesting}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Analysis Depth</p>
              <p className="text-gray-900">{analysis.metadata.analysisDepth}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentAnalysisPanel;
