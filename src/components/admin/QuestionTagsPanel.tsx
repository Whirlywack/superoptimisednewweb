"use client";

import React, { useState } from "react";
import {
  Tags,
  X,
  Plus,
  Eye,
  EyeOff,
  Info,
  Target,
  Users,
  Zap,
  BookOpen,
  Settings,
  FileText,
  Globe,
  Sparkles,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TagSuggestion {
  tag: string;
  category: string;
  confidence: number;
  reasoning: string;
}

interface RelatedTag {
  tag: string;
  relationship: string;
  category: string;
}

interface TagsGenerationResult {
  questionContext: {
    title: string;
    description?: string;
    type: string;
    category: string;
    targetAudience: string;
    config: Record<string, unknown>;
  };
  generatedTags: {
    primary: TagSuggestion[];
    secondary: TagSuggestion[];
    contextual: TagSuggestion[];
  };
  categoryBreakdown: {
    topic: string[];
    methodology: string[];
    audience: string[];
    difficulty: string[];
    purpose: string[];
    domain: string[];
    format: string[];
    context: string[];
  };
  relatedTags: RelatedTag[];
  tagQuality: {
    overallScore: number;
    specificity: "high" | "medium" | "low";
    relevance: "high" | "medium" | "low";
    comprehensiveness: "complete" | "partial" | "minimal";
  };
  recommendations: {
    suggestedAdditions: string[];
    potentialRemovals: string[];
    categoryGaps: string[];
  };
  metadata: {
    totalTags: number;
    averageConfidence: number;
    mostConfidentCategory: string;
    processedAt: string;
    version: string;
  };
}

interface QuestionTagsPanelProps {
  tags: TagsGenerationResult;
  selectedTags?: string[];
  onTagToggle?: (tag: string) => void;
  onClose?: () => void;
  className?: string;
}

const CategoryIcon = ({ category }: { category: string }) => {
  const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
    topic: Target,
    methodology: Settings,
    audience: Users,
    difficulty: Zap,
    purpose: BookOpen,
    domain: Globe,
    format: FileText,
    context: Info,
  };

  const IconComponent = iconMap[category] || Tags;
  return <IconComponent size={16} />;
};

const ConfidenceBar = ({ confidence }: { confidence: number }) => {
  const getColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-500";
    if (confidence >= 0.6) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-16 rounded-full bg-gray-200">
        <div
          className={cn("h-full rounded-full transition-all", getColor(confidence))}
          style={{ width: `${confidence * 100}%` }}
        />
      </div>
      <span className="text-xs text-gray-600">{Math.round(confidence * 100)}%</span>
    </div>
  );
};

const TagBadge = ({
  tag,
  category,
  confidence,
  selected = false,
  onToggle,
  showConfidence = false,
}: {
  tag: string;
  category: string;
  confidence?: number;
  selected?: boolean;
  onToggle?: () => void;
  showConfidence?: boolean;
}) => {
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      topic: "bg-blue-100 text-blue-800 border-blue-200",
      methodology: "bg-purple-100 text-purple-800 border-purple-200",
      audience: "bg-green-100 text-green-800 border-green-200",
      difficulty: "bg-orange-100 text-orange-800 border-orange-200",
      purpose: "bg-pink-100 text-pink-800 border-pink-200",
      domain: "bg-indigo-100 text-indigo-800 border-indigo-200",
      format: "bg-yellow-100 text-yellow-800 border-yellow-200",
      context: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colorMap[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition-all",
        getCategoryColor(category),
        selected && "ring-2 ring-blue-500 ring-offset-1",
        onToggle && "cursor-pointer hover:shadow-sm"
      )}
      onClick={onToggle}
    >
      <CategoryIcon category={category} />
      <span className="font-medium">{tag}</span>
      {showConfidence && confidence !== undefined && <ConfidenceBar confidence={confidence} />}
      {onToggle && (
        <button className="ml-1 transition-opacity hover:opacity-70">
          {selected ? <EyeOff size={12} /> : <Eye size={12} />}
        </button>
      )}
    </div>
  );
};

const CollapsibleTagSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
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

export function QuestionTagsPanel({
  tags,
  selectedTags = [],
  onTagToggle,
  onClose,
  className,
}: QuestionTagsPanelProps) {
  const [showConfidenceLevels, setShowConfidenceLevels] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const allTags = [
    ...tags.generatedTags.primary,
    ...tags.generatedTags.secondary,
    ...tags.generatedTags.contextual,
  ];

  const categories = Object.keys(tags.categoryBreakdown);

  const _filteredTags =
    selectedCategory === "all"
      ? allTags
      : allTags.filter((tag) => tag.category === selectedCategory);

  return (
    <div className={cn("rounded-lg border border-gray-200 bg-white shadow-lg", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Question Tags</h3>
          <p className="mt-1 text-sm text-gray-600">
            AI-generated tags for: &ldquo;{tags.questionContext.title}&rdquo;
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfidenceLevels(!showConfidenceLevels)}
            className={cn(
              "rounded px-3 py-1 text-sm font-medium transition-colors",
              showConfidenceLevels
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {showConfidenceLevels ? "Hide" : "Show"} Confidence
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-full p-2 transition-colors hover:bg-gray-100"
            >
              <X size={20} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Quality Overview */}
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Tag Quality Assessment</h4>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-600" />
              <span className="text-lg font-bold text-blue-600">
                {tags.tagQuality.overallScore.toFixed(1)}/10
              </span>
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            <div className="text-center">
              <p className="text-xs font-medium text-gray-600">Specificity</p>
              <p
                className={cn("text-sm font-bold", {
                  "text-green-600": tags.tagQuality.specificity === "high",
                  "text-yellow-600": tags.tagQuality.specificity === "medium",
                  "text-red-600": tags.tagQuality.specificity === "low",
                })}
              >
                {tags.tagQuality.specificity.toUpperCase()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-600">Relevance</p>
              <p
                className={cn("text-sm font-bold", {
                  "text-green-600": tags.tagQuality.relevance === "high",
                  "text-yellow-600": tags.tagQuality.relevance === "medium",
                  "text-red-600": tags.tagQuality.relevance === "low",
                })}
              >
                {tags.tagQuality.relevance.toUpperCase()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-600">Coverage</p>
              <p
                className={cn("text-sm font-bold", {
                  "text-green-600": tags.tagQuality.comprehensiveness === "complete",
                  "text-yellow-600": tags.tagQuality.comprehensiveness === "partial",
                  "text-red-600": tags.tagQuality.comprehensiveness === "minimal",
                })}
              >
                {tags.tagQuality.comprehensiveness.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter by category:</span>
          <button
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              selectedCategory === "all"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            All ({allTags.length})
          </button>
          {categories.map((category) => {
            const count =
              tags.categoryBreakdown[category as keyof typeof tags.categoryBreakdown]?.length || 0;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  selectedCategory === category
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                <CategoryIcon category={category} />
                {category} ({count})
              </button>
            );
          })}
        </div>

        {/* Generated Tags */}
        <div className="space-y-4">
          {/* Primary Tags */}
          <CollapsibleTagSection
            title="Primary Tags"
            icon={Target}
            badge={
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                {tags.generatedTags.primary.length}
              </span>
            }
          >
            <div className="flex flex-wrap gap-2">
              {tags.generatedTags.primary
                .filter((tag) => selectedCategory === "all" || tag.category === selectedCategory)
                .map((tag, index) => (
                  <TagBadge
                    key={index}
                    tag={tag.tag}
                    category={tag.category}
                    confidence={tag.confidence}
                    selected={selectedTags.includes(tag.tag)}
                    onToggle={onTagToggle ? () => onTagToggle(tag.tag) : undefined}
                    showConfidence={showConfidenceLevels}
                  />
                ))}
            </div>
          </CollapsibleTagSection>

          {/* Secondary Tags */}
          <CollapsibleTagSection
            title="Secondary Tags"
            icon={Plus}
            defaultOpen={false}
            badge={
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                {tags.generatedTags.secondary.length}
              </span>
            }
          >
            <div className="flex flex-wrap gap-2">
              {tags.generatedTags.secondary
                .filter((tag) => selectedCategory === "all" || tag.category === selectedCategory)
                .map((tag, index) => (
                  <TagBadge
                    key={index}
                    tag={tag.tag}
                    category={tag.category}
                    confidence={tag.confidence}
                    selected={selectedTags.includes(tag.tag)}
                    onToggle={onTagToggle ? () => onTagToggle(tag.tag) : undefined}
                    showConfidence={showConfidenceLevels}
                  />
                ))}
            </div>
          </CollapsibleTagSection>

          {/* Contextual Tags */}
          <CollapsibleTagSection
            title="Contextual Tags"
            icon={Globe}
            defaultOpen={false}
            badge={
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                {tags.generatedTags.contextual.length}
              </span>
            }
          >
            <div className="flex flex-wrap gap-2">
              {tags.generatedTags.contextual
                .filter((tag) => selectedCategory === "all" || tag.category === selectedCategory)
                .map((tag, index) => (
                  <TagBadge
                    key={index}
                    tag={tag.tag}
                    category={tag.category}
                    confidence={tag.confidence}
                    selected={selectedTags.includes(tag.tag)}
                    onToggle={onTagToggle ? () => onTagToggle(tag.tag) : undefined}
                    showConfidence={showConfidenceLevels}
                  />
                ))}
            </div>
          </CollapsibleTagSection>
        </div>

        {/* Related Tags */}
        {tags.relatedTags.length > 0 && (
          <CollapsibleTagSection title="Related Tags" icon={Sparkles} defaultOpen={false}>
            <div className="space-y-2">
              {tags.relatedTags.map((relatedTag, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded border border-gray-200 p-2"
                >
                  <div className="flex items-center gap-2">
                    <TagBadge
                      tag={relatedTag.tag}
                      category={relatedTag.category}
                      selected={selectedTags.includes(relatedTag.tag)}
                      onToggle={onTagToggle ? () => onTagToggle(relatedTag.tag) : undefined}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{relatedTag.relationship}</span>
                </div>
              ))}
            </div>
          </CollapsibleTagSection>
        )}

        {/* Recommendations */}
        {(tags.recommendations.suggestedAdditions.length > 0 ||
          tags.recommendations.potentialRemovals.length > 0) && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h4 className="mb-3 flex items-center gap-2 font-medium text-amber-800">
              <Info size={16} />
              Recommendations
            </h4>
            <div className="space-y-3">
              {tags.recommendations.suggestedAdditions.length > 0 && (
                <div>
                  <h5 className="mb-1 text-sm font-medium text-amber-800">Suggested Additions</h5>
                  <div className="flex flex-wrap gap-1">
                    {tags.recommendations.suggestedAdditions.map((addition, index) => (
                      <span
                        key={index}
                        className="rounded bg-green-100 px-2 py-1 text-xs text-green-800"
                      >
                        +{addition}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {tags.recommendations.potentialRemovals.length > 0 && (
                <div>
                  <h5 className="mb-1 text-sm font-medium text-amber-800">Consider Removing</h5>
                  <div className="flex flex-wrap gap-1">
                    {tags.recommendations.potentialRemovals.map((removal, index) => (
                      <span
                        key={index}
                        className="rounded bg-red-100 px-2 py-1 text-xs text-red-800"
                      >
                        -{removal}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="rounded-lg bg-gray-50 p-4">
          <h4 className="mb-3 font-medium text-gray-900">Generation Metadata</h4>
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div>
              <p className="font-medium text-gray-600">Total Tags</p>
              <p className="text-gray-900">{tags.metadata.totalTags}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Avg Confidence</p>
              <p className="text-gray-900">{Math.round(tags.metadata.averageConfidence * 100)}%</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Top Category</p>
              <p className="text-gray-900">{tags.metadata.mostConfidentCategory}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600">Generated</p>
              <p className="text-gray-900">
                {new Date(tags.metadata.processedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionTagsPanel;
