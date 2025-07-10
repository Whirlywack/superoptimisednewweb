"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client.ts";
import {
  ToggleLeft,
  List,
  Star,
  Type,
  ArrowUpDown,
  Split,
  Plus,
  Trash2,
  GripVertical,
  X,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Sparkles,
  Wand2,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import type { QuestionnaireTemplate } from "@/lib/questionnaire-templates-detailed";

interface Question {
  id: string;
  type: string;
  title: string;
  description?: string;
  config: Record<string, unknown>;
  required: boolean;
}

interface QuestionType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  category: string;
}

const questionTypes: QuestionType[] = [
  {
    id: "binary",
    name: "Yes/No",
    description: "Simple binary choice",
    icon: ToggleLeft,
    category: "basic",
  },
  {
    id: "multi-choice",
    name: "Multiple Choice",
    description: "Select one or multiple options",
    icon: List,
    category: "basic",
  },
  {
    id: "rating-scale",
    name: "Rating Scale",
    description: "1-10 numerical rating",
    icon: Star,
    category: "advanced",
  },
  {
    id: "text-response",
    name: "Text Response",
    description: "Open-ended text input",
    icon: Type,
    category: "basic",
  },
  {
    id: "ranking",
    name: "Ranking",
    description: "Drag to reorder items",
    icon: ArrowUpDown,
    category: "advanced",
  },
  {
    id: "ab-test",
    name: "A/B Test",
    description: "Compare two options",
    icon: Split,
    category: "advanced",
  },
];

// Configuration panel for different question types
function QuestionConfigurationPanel({
  question,
  onConfigChange,
}: {
  question: Question;
  onConfigChange: (config: Record<string, unknown>) => void;
}) {
  const config = question.config || {};

  const updateConfig = (updates: Record<string, unknown>) => {
    onConfigChange({ ...config, ...updates });
  };

  const addOption = (key: string) => {
    const options = (config[key] as Array<{ id: string; text: string }>) || [];
    const newOption = { id: `opt_${Date.now()}`, text: "" };
    updateConfig({ [key]: [...options, newOption] });
  };

  const updateOption = (key: string, index: number, field: string, value: string) => {
    const options = (config[key] as Array<{ id: string; text: string }>) || [];
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    updateConfig({ [key]: updatedOptions });
  };

  const removeOption = (key: string, index: number) => {
    const options = (config[key] as Array<{ id: string; text: string }>) || [];
    updateConfig({ [key]: options.filter((_, i) => i !== index) });
  };

  switch (question.type) {
    case "binary":
      return (
        <div className="space-y-4">
          <div className="font-mono text-sm font-medium" style={{ color: "var(--off-black)" }}>
            Binary Options
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-mono text-xs" style={{ color: "var(--warm-gray)" }}>
                Option A
              </label>
              <input
                type="text"
                value={(config.optionA as { text: string })?.text || ""}
                onChange={(e) => updateConfig({ optionA: { id: "a", text: e.target.value } })}
                className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: "var(--light-gray)",
                  backgroundColor: "var(--off-white)",
                  color: "var(--off-black)",
                  padding: "0.5rem",
                }}
                placeholder="Yes, True, Option A..."
              />
            </div>
            <div>
              <label className="mb-2 block font-mono text-xs" style={{ color: "var(--warm-gray)" }}>
                Option B
              </label>
              <input
                type="text"
                value={(config.optionB as { text: string })?.text || ""}
                onChange={(e) => updateConfig({ optionB: { id: "b", text: e.target.value } })}
                className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: "var(--light-gray)",
                  backgroundColor: "var(--off-white)",
                  color: "var(--off-black)",
                  padding: "0.5rem",
                }}
                placeholder="No, False, Option B..."
              />
            </div>
          </div>
        </div>
      );

    case "multi-choice":
      const multiOptions = (config.options as Array<{ id: string; text: string }>) || [];
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-mono text-sm font-medium" style={{ color: "var(--off-black)" }}>
              Choice Options
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => generateQuestionOptions(question.id)}
                disabled={isGeneratingOptions}
                className="px-3 py-1 font-mono text-xs transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--off-white)",
                }}
              >
                {isGeneratingOptions ? (
                  <RefreshCw size={12} className="animate-spin" />
                ) : (
                  <Sparkles size={12} />
                )}
                {isGeneratingOptions ? " Generating..." : " AI Options"}
              </button>
              <button
                type="button"
                onClick={() => addOption("options")}
                className="px-3 py-1 font-mono text-xs transition-colors"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--off-white)",
                }}
              >
                Add Option
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {multiOptions.map((option, index) => (
              <div key={option.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => updateOption("options", index, "text", e.target.value)}
                  className="flex-1 border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                  style={{
                    borderColor: "var(--light-gray)",
                    backgroundColor: "var(--off-white)",
                    color: "var(--off-black)",
                    padding: "0.5rem",
                  }}
                  placeholder={`Option ${index + 1}...`}
                />
                <button
                  type="button"
                  onClick={() => removeOption("options", index)}
                  className="px-2 py-1 font-mono text-xs transition-colors"
                  style={{
                    backgroundColor: "var(--warm-gray)",
                    color: "var(--off-white)",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div>
            <label className="mb-2 block font-mono text-xs" style={{ color: "var(--warm-gray)" }}>
              Max Selections
            </label>
            <input
              type="number"
              value={(config.maxSelections as number) || 1}
              onChange={(e) => updateConfig({ maxSelections: parseInt(e.target.value) || 1 })}
              min="1"
              max={multiOptions.length || 1}
              className="w-24 border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
              style={{
                borderColor: "var(--light-gray)",
                backgroundColor: "var(--off-white)",
                color: "var(--off-black)",
                padding: "0.5rem",
              }}
            />
          </div>
        </div>
      );

    case "rating-scale":
      return (
        <div className="space-y-4">
          <div className="font-mono text-sm font-medium" style={{ color: "var(--off-black)" }}>
            Rating Scale
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-mono text-xs" style={{ color: "var(--warm-gray)" }}>
                Scale Max
              </label>
              <select
                value={(config.scale as number) || 5}
                onChange={(e) => updateConfig({ scale: parseInt(e.target.value) })}
                className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: "var(--light-gray)",
                  backgroundColor: "var(--off-white)",
                  color: "var(--off-black)",
                  padding: "0.5rem",
                }}
              >
                <option value="5">1-5 Scale</option>
                <option value="10">1-10 Scale</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block font-mono text-xs" style={{ color: "var(--warm-gray)" }}>
                Display Type
              </label>
              <select
                value={(config.variant as string) || "numbers"}
                onChange={(e) => updateConfig({ variant: e.target.value })}
                className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: "var(--light-gray)",
                  backgroundColor: "var(--off-white)",
                  color: "var(--off-black)",
                  padding: "0.5rem",
                }}
              >
                <option value="numbers">Numbers</option>
                <option value="stars">Stars</option>
                <option value="emoji">Emoji</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-mono text-xs" style={{ color: "var(--warm-gray)" }}>
                Min Label
              </label>
              <input
                type="text"
                value={(config.labels as { min: string })?.min || ""}
                onChange={(e) =>
                  updateConfig({
                    labels: { ...((config.labels as object) || {}), min: e.target.value },
                  })
                }
                className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: "var(--light-gray)",
                  backgroundColor: "var(--off-white)",
                  color: "var(--off-black)",
                  padding: "0.5rem",
                }}
                placeholder="Poor, Disagree..."
              />
            </div>
            <div>
              <label className="mb-2 block font-mono text-xs" style={{ color: "var(--warm-gray)" }}>
                Max Label
              </label>
              <input
                type="text"
                value={(config.labels as { max: string })?.max || ""}
                onChange={(e) =>
                  updateConfig({
                    labels: { ...((config.labels as object) || {}), max: e.target.value },
                  })
                }
                className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: "var(--light-gray)",
                  backgroundColor: "var(--off-white)",
                  color: "var(--off-black)",
                  padding: "0.5rem",
                }}
                placeholder="Excellent, Agree..."
              />
            </div>
          </div>
        </div>
      );

    case "text-response":
      return (
        <div className="space-y-4">
          <div className="font-mono text-sm font-medium" style={{ color: "var(--off-black)" }}>
            Text Configuration
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-mono text-xs" style={{ color: "var(--warm-gray)" }}>
                Max Length
              </label>
              <input
                type="number"
                value={(config.maxLength as number) || 500}
                onChange={(e) => updateConfig({ maxLength: parseInt(e.target.value) || 500 })}
                min="10"
                max="5000"
                className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: "var(--light-gray)",
                  backgroundColor: "var(--off-white)",
                  color: "var(--off-black)",
                  padding: "0.5rem",
                }}
              />
            </div>
            <div>
              <label className="flex items-center font-mono text-xs">
                <input
                  type="checkbox"
                  checked={(config.multiline as boolean) || false}
                  onChange={(e) => updateConfig({ multiline: e.target.checked })}
                  className="mr-2"
                />
                <span style={{ color: "var(--off-black)" }}>Multiline</span>
              </label>
            </div>
          </div>
          <div>
            <label className="mb-2 block font-mono text-xs" style={{ color: "var(--warm-gray)" }}>
              Placeholder
            </label>
            <input
              type="text"
              value={(config.placeholder as string) || ""}
              onChange={(e) => updateConfig({ placeholder: e.target.value })}
              className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
              style={{
                borderColor: "var(--light-gray)",
                backgroundColor: "var(--off-white)",
                color: "var(--off-black)",
                padding: "0.5rem",
              }}
              placeholder="Enter placeholder text..."
            />
          </div>
        </div>
      );

    case "ranking":
      const rankingItems = (config.items as Array<{ id: string; text: string }>) || [];
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-mono text-sm font-medium" style={{ color: "var(--off-black)" }}>
              Ranking Items
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => generateQuestionOptions(question.id)}
                disabled={isGeneratingOptions}
                className="px-3 py-1 font-mono text-xs transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--off-white)",
                }}
              >
                {isGeneratingOptions ? (
                  <RefreshCw size={12} className="animate-spin" />
                ) : (
                  <Sparkles size={12} />
                )}
                {isGeneratingOptions ? " Generating..." : " AI Items"}
              </button>
              <button
                type="button"
                onClick={() => addOption("items")}
                className="px-3 py-1 font-mono text-xs transition-colors"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--off-white)",
                }}
              >
                Add Item
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {rankingItems.map((item, index) => (
              <div key={item.id} className="flex items-center space-x-2">
                <div className="font-mono text-xs" style={{ color: "var(--warm-gray)" }}>
                  {index + 1}.
                </div>
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateOption("items", index, "text", e.target.value)}
                  className="flex-1 border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                  style={{
                    borderColor: "var(--light-gray)",
                    backgroundColor: "var(--off-white)",
                    color: "var(--off-black)",
                    padding: "0.5rem",
                  }}
                  placeholder={`Item ${index + 1}...`}
                />
                <button
                  type="button"
                  onClick={() => removeOption("items", index)}
                  className="px-2 py-1 font-mono text-xs transition-colors"
                  style={{
                    backgroundColor: "var(--warm-gray)",
                    color: "var(--off-white)",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      );

    case "ab-test":
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-mono text-sm font-medium" style={{ color: "var(--off-black)" }}>
              A/B Test Options
            </div>
            <button
              type="button"
              onClick={() => generateQuestionOptions(question.id)}
              disabled={isGeneratingOptions}
              className="px-3 py-1 font-mono text-xs transition-colors disabled:opacity-50"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--off-white)",
              }}
            >
              {isGeneratingOptions ? (
                <RefreshCw size={12} className="animate-spin" />
              ) : (
                <Sparkles size={12} />
              )}
              {isGeneratingOptions ? " Generating..." : " AI Options"}
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block font-mono text-xs" style={{ color: "var(--warm-gray)" }}>
                Option A_TITLE
              </label>
              <input
                type="text"
                value={(config.optionA as { title: string })?.title || ""}
                onChange={(e) =>
                  updateConfig({
                    optionA: {
                      ...((config.optionA as object) || {}),
                      title: e.target.value,
                    },
                  })
                }
                className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: "var(--light-gray)",
                  backgroundColor: "var(--off-white)",
                  color: "var(--off-black)",
                  padding: "0.5rem",
                }}
                placeholder="Option A Title..."
              />
              <textarea
                value={(config.optionA as { description: string })?.description || ""}
                onChange={(e) =>
                  updateConfig({
                    optionA: {
                      ...((config.optionA as object) || {}),
                      description: e.target.value,
                    },
                  })
                }
                rows={2}
                className="mt-2 w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: "var(--light-gray)",
                  backgroundColor: "var(--off-white)",
                  color: "var(--off-black)",
                  padding: "0.5rem",
                }}
                placeholder="Option A Description..."
              />
            </div>
            <div>
              <label className="mb-2 block font-mono text-xs" style={{ color: "var(--warm-gray)" }}>
                Option B_TITLE
              </label>
              <input
                type="text"
                value={(config.optionB as { title: string })?.title || ""}
                onChange={(e) =>
                  updateConfig({
                    optionB: {
                      ...((config.optionB as object) || {}),
                      title: e.target.value,
                    },
                  })
                }
                className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: "var(--light-gray)",
                  backgroundColor: "var(--off-white)",
                  color: "var(--off-black)",
                  padding: "0.5rem",
                }}
                placeholder="Option B Title..."
              />
              <textarea
                value={(config.optionB as { description: string })?.description || ""}
                onChange={(e) =>
                  updateConfig({
                    optionB: {
                      ...((config.optionB as object) || {}),
                      description: e.target.value,
                    },
                  })
                }
                rows={2}
                className="mt-2 w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: "var(--light-gray)",
                  backgroundColor: "var(--off-white)",
                  color: "var(--off-black)",
                  padding: "0.5rem",
                }}
                placeholder="Option B Description..."
              />
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// Card-based question type selector
function QuestionTypeSelector({
  onSelectType,
  onClose,
}: {
  onSelectType: (type: string) => void;
  onClose: () => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Types" },
    { id: "basic", name: "Basic" },
    { id: "advanced", name: "Advanced" },
  ];

  const filteredTypes =
    selectedCategory === "all"
      ? questionTypes
      : questionTypes.filter((type) => type.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="max-h-[90vh] w-full max-w-5xl overflow-hidden shadow-xl"
        style={{ backgroundColor: "var(--off-white)" }}
      >
        {/* Header */}
        <div
          className="border-b-2 px-6 py-4"
          style={{
            backgroundColor: "var(--off-black)",
            borderColor: "var(--off-black)",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold" style={{ color: "var(--off-white)" }}>
                Add Question
              </h2>
              <p className="mt-1 text-sm" style={{ color: "var(--warm-gray)" }}>
                Choose a question type to add to your questionnaire
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="transition-colors hover:opacity-75"
              style={{ color: "var(--warm-gray)" }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="border-b-2 px-6" style={{ borderColor: "var(--light-gray)" }}>
          <nav className="-mb-px flex space-x-8">
            {categories.map((category) => {
              const isActive = selectedCategory === category.id;
              const count =
                category.id === "all"
                  ? questionTypes.length
                  : questionTypes.filter((t) => t.category === category.id).length;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                    isActive ? "border-current" : "border-transparent hover:opacity-75"
                  }`}
                  style={{
                    color: isActive ? "var(--primary)" : "var(--warm-gray)",
                  }}
                >
                  {category.name}
                  <span
                    className="ml-2 px-2 py-1 text-xs"
                    style={{
                      backgroundColor: "var(--light-gray)",
                      color: "var(--off-black)",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Question Type Cards */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTypes.map((questionType) => (
              <div
                key={questionType.id}
                className="cursor-pointer overflow-hidden border-2 shadow-sm transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: "var(--off-white)",
                  borderColor: "var(--light-gray)",
                }}
                onClick={() => onSelectType(questionType.id)}
              >
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <questionType.icon size={32} style={{ color: "var(--primary)" }} />
                    <span
                      className="px-2 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "var(--off-white)",
                      }}
                    >
                      {questionType.category}
                    </span>
                  </div>

                  <h3 className="mb-2 text-lg font-semibold" style={{ color: "var(--off-black)" }}>
                    {questionType.name}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--warm-gray)" }}>
                    {questionType.description}
                  </p>
                </div>

                <div
                  className="px-6 py-3 text-center transition-colors hover:opacity-90"
                  style={{ backgroundColor: "var(--off-black)" }}
                >
                  <span className="text-sm font-medium" style={{ color: "var(--off-white)" }}>
                    Select
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Template Generator Form Component
function TemplateGeneratorForm({
  onGenerate,
  onCancel,
  isGenerating,
}: {
  onGenerate: (params: {
    researchGoal: string;
    researchType: string;
    targetAudience: string;
    industry?: string;
    timeConstraint: string;
    questionCount: number;
    complexity: string;
    context?: string;
  }) => void;
  onCancel: () => void;
  isGenerating: boolean;
}) {
  const [researchGoal, setResearchGoal] = useState("");
  const [researchType, setResearchType] = useState("user-satisfaction");
  const [targetAudience, setTargetAudience] = useState("");
  const [industry, setIndustry] = useState("");
  const [timeConstraint, setTimeConstraint] = useState("medium");
  const [questionCount, setQuestionCount] = useState(10);
  const [complexity, setComplexity] = useState("intermediate");
  const [context, setContext] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (researchGoal.trim() && targetAudience.trim()) {
      onGenerate({
        researchGoal,
        researchType,
        targetAudience,
        industry: industry || undefined,
        timeConstraint,
        questionCount,
        complexity,
        context: context || undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Research Goal */}
      <div>
        <label className="mb-2 block text-sm font-medium">Research Goal *</label>
        <textarea
          value={researchGoal}
          onChange={(e) => setResearchGoal(e.target.value)}
          placeholder="Describe what you want to learn or measure with this questionnaire..."
          className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          rows={3}
          required
        />
      </div>

      {/* Research Type */}
      <div>
        <label className="mb-2 block text-sm font-medium">Research Type *</label>
        <select
          value={researchType}
          onChange={(e) => setResearchType(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        >
          <option value="user-satisfaction">User Satisfaction</option>
          <option value="product-feedback">Product Feedback</option>
          <option value="market-research">Market Research</option>
          <option value="ux-validation">UX Validation</option>
          <option value="feature-prioritization">Feature Prioritization</option>
          <option value="demographic-analysis">Demographic Analysis</option>
          <option value="brand-perception">Brand Perception</option>
          <option value="competitive-analysis">Competitive Analysis</option>
          <option value="customer-journey">Customer Journey</option>
          <option value="pain-point-discovery">Pain Point Discovery</option>
        </select>
      </div>

      {/* Target Audience */}
      <div>
        <label className="mb-2 block text-sm font-medium">Target Audience *</label>
        <input
          type="text"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          placeholder="Who will be answering this questionnaire?"
          className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Industry (Optional) */}
      <div>
        <label className="mb-2 block text-sm font-medium">Industry</label>
        <input
          type="text"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder="e.g., Technology, Healthcare, Retail..."
          className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Time Constraint and Question Count */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Time Constraint</label>
          <select
            value={timeConstraint}
            onChange={(e) => setTimeConstraint(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="short">Short (3-5 minutes)</option>
            <option value="medium">Medium (8-12 minutes)</option>
            <option value="long">Long (15-20 minutes)</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Question Count</label>
          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            {[5, 8, 10, 12, 15, 20, 25].map((count) => (
              <option key={count} value={count}>
                {count} questions
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Complexity */}
      <div>
        <label className="mb-2 block text-sm font-medium">Complexity Level</label>
        <select
          value={complexity}
          onChange={(e) => setComplexity(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        >
          <option value="basic">Basic - Simple, straightforward questions</option>
          <option value="intermediate">Intermediate - Mix of basic and nuanced questions</option>
          <option value="advanced">
            Advanced - Sophisticated questions with complex branching
          </option>
        </select>
      </div>

      {/* Additional Context */}
      <div>
        <label className="mb-2 block text-sm font-medium">Additional Context</label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Any specific requirements, constraints, or additional information..."
          className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          rows={2}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          disabled={isGenerating}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isGenerating || !researchGoal.trim() || !targetAudience.trim()}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="mr-2 inline size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 inline size-4" />
              Generate Template
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function NewQuestionnairePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [questionnaire, setQuestionnaire] = useState({
    title: "",
    description: "",
    category: "research",
    questions: [] as Question[],
  });

  const [showQuestionTypeSelector, setShowQuestionTypeSelector] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedQuestion, setDraggedQuestion] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Advanced filtering state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterRequired, setFilterRequired] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("order");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);

  // AI features state
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<
    Array<{
      title: string;
      description?: string;
      type: string;
      reasoning?: string;
      config: Record<string, unknown>;
    }>
  >([]);
  const [showQuestionImprovement, setShowQuestionImprovement] = useState(false);
  const [improvingQuestionId, setImprovingQuestionId] = useState<string | null>(null);
  const [questionImprovement, setQuestionImprovement] = useState<{
    original: {
      title: string;
      description?: string;
      type: string;
      config?: Record<string, unknown>;
    };
    improved: { title: string; description?: string; config?: Record<string, unknown> };
    analysis: {
      summary: string;
      improvements: Array<{ area: string; before: string; after: string; reasoning: string }>;
      alternatives: Array<{ title: string; reasoning: string }>;
    };
  } | null>(null);
  const [smartRecommendations, setSmartRecommendations] = useState<
    Array<{
      title: string;
      type: string;
      reasoning: string;
      priority: string;
      category: string;
      config: Record<string, unknown>;
    }>
  >([]);
  const [showSmartRecommendations, setShowSmartRecommendations] = useState(false);
  const [recommendationContext, setRecommendationContext] = useState<{
    basedOnQuestion?: string;
    insertPosition?: number;
  }>({});
  const [showOptionGeneration, setShowOptionGeneration] = useState(false);
  const [optionGenerationQuestionId, setOptionGenerationQuestionId] = useState<string | null>(null);
  const [generatedOptions, setGeneratedOptions] = useState<
    Array<{
      id: string;
      text: string;
      description: string;
      reasoning: string;
    }>
  >([]);
  const [isGeneratingOptions, setIsGeneratingOptions] = useState(false); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [showTemplateGenerator, setShowTemplateGenerator] = useState(false);
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState<{
    id: string;
    title: string;
    description: string;
    category: string;
    estimatedTime: string;
    targetAudience: string;
    questions: Array<{
      id: string;
      title: string;
      description?: string;
      questionType: string;
      category: string;
      questionData: Record<string, unknown>;
      isRequired: boolean;
      displayOrder: number;
      tags: string[];
      bestPracticeNote?: string;
    }>;
    tags: string[];
    bestPractices: string[];
    metadata: Record<string, unknown>;
  } | null>(null);

  // tRPC mutations
  const createQuestionnaireMutation = trpc.questionnaire.create.useMutation();
  const createQuestionMutation = trpc.admin.createQuestion.useMutation();
  const addQuestionToQuestionnaireMutation = trpc.questionnaire.addQuestion.useMutation();
  const updateQuestionnaireMutation = trpc.questionnaire.update.useMutation();

  // AI tRPC mutations
  const generateQuestionSuggestionsMutation = trpc.admin.generateQuestionSuggestions.useMutation();
  const improveQuestionMutation = trpc.admin.improveQuestion.useMutation();
  const getSmartRecommendationsMutation = trpc.admin.getSmartRecommendations.useMutation();
  const generateQuestionOptionsMutation = trpc.admin.generateQuestionOptions.useMutation();
  const generateSmartTemplateMutation = trpc.admin.generateSmartTemplate.useMutation();

  // Save/Publish functions
  const saveQuestionnaire = async (status: "draft" | "active") => {
    if (!questionnaire.title.trim()) {
      alert("Please enter a questionnaire title");
      return;
    }

    if (questionnaire.questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    setIsSaving(true);
    try {
      // Create the questionnaire
      const newQuestionnaire = await createQuestionnaireMutation.mutateAsync({
        title: questionnaire.title,
        description: questionnaire.description || undefined,
        category: questionnaire.category || undefined,
      });

      // Create each question and add to questionnaire
      for (let i = 0; i < questionnaire.questions.length; i++) {
        const question = questionnaire.questions[i];

        const newQuestion = await createQuestionMutation.mutateAsync({
          title: question.title,
          description: question.description || undefined,
          questionType: question.type as
            | "binary"
            | "multi-choice"
            | "rating-scale"
            | "text-response"
            | "ranking"
            | "ab-test",
          config: question.config,
          category: questionnaire.category,
          isActive: status === "active",
          displayOrder: i,
        });

        await addQuestionToQuestionnaireMutation.mutateAsync({
          questionnaireId: newQuestionnaire.id,
          questionId: newQuestion.id,
          displayOrder: i,
          isRequired: question.required,
        });
      }

      // Update questionnaire status
      if (status === "active") {
        await updateQuestionnaireMutation.mutateAsync({
          id: newQuestionnaire.id,
          status: "active",
        });
      }

      // Redirect to questionnaire list
      router.push("/admin/questionnaires");
    } catch (error) {
      console.error("Failed to save questionnaire:", error);
      alert("Failed to save questionnaire. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = () => saveQuestionnaire("draft");
  const handlePublish = () => saveQuestionnaire("active");

  // Drag & Drop functions
  const handleDragStart = (e: React.DragEvent, questionId: string) => {
    setDraggedQuestion(questionId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", "");
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!draggedQuestion) return;

    const draggedIndex = questionnaire.questions.findIndex((q) => q.id === draggedQuestion);
    if (draggedIndex === -1 || draggedIndex === dropIndex) {
      setDraggedQuestion(null);
      setDragOverIndex(null);
      return;
    }

    const updatedQuestions = [...questionnaire.questions];
    const [draggedItem] = updatedQuestions.splice(draggedIndex, 1);
    updatedQuestions.splice(dropIndex, 0, draggedItem);

    setQuestionnaire((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));

    setDraggedQuestion(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedQuestion(null);
    setDragOverIndex(null);
  };

  // Multi-select and bulk operations
  const toggleQuestionSelection = (questionId: string) => {
    setSelectedQuestions((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(questionId)) {
        newSelection.delete(questionId);
      } else {
        newSelection.add(questionId);
      }
      return newSelection;
    });
  };

  const selectAllQuestions = () => {
    setSelectedQuestions(new Set(questionnaire.questions.map((q) => q.id)));
  };

  const clearSelection = () => {
    setSelectedQuestions(new Set());
    setIsSelectionMode(false);
  };

  const bulkDeleteQuestions = () => {
    if (selectedQuestions.size === 0) return;

    if (confirm(`Delete ${selectedQuestions.size} selected questions?`)) {
      setQuestionnaire((prev) => ({
        ...prev,
        questions: prev.questions.filter((q) => !selectedQuestions.has(q.id)),
      }));
      clearSelection();
    }
  };

  const bulkDuplicateQuestions = () => {
    if (selectedQuestions.size === 0) return;

    const questionsToClone = questionnaire.questions.filter((q) => selectedQuestions.has(q.id));
    const clonedQuestions = questionsToClone.map((q) => ({
      ...q,
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `${q.title} (Copy)`,
    }));

    setQuestionnaire((prev) => ({
      ...prev,
      questions: [...prev.questions, ...clonedQuestions],
    }));
    clearSelection();
  };

  const bulkToggleRequired = (required: boolean) => {
    if (selectedQuestions.size === 0) return;

    setQuestionnaire((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (selectedQuestions.has(q.id) ? { ...q, required } : q)),
    }));
    clearSelection();
  };

  // Import/Export functions
  const exportQuestionnaireAsJSON = () => {
    const exportData = {
      ...questionnaire,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${questionnaire.title || "questionnaire"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportQuestionnaireAsCSV = () => {
    if (questionnaire.questions.length === 0) {
      alert("No questions to export");
      return;
    }

    const headers = [
      "Question Number",
      "Question Type",
      "Title",
      "Description",
      "Required",
      "Config",
    ];
    const rows = questionnaire.questions.map((q, index) => [
      index + 1,
      q.type,
      `"${q.title.replace(/"/g, '""')}"`,
      `"${(q.description || "").replace(/"/g, '""')}"`,
      q.required ? "Yes" : "No",
      `"${JSON.stringify(q.config).replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const dataBlob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${questionnaire.title || "questionnaire"}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importQuestionnaire = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let importedData;

        if (file.type === "application/json" || file.name.endsWith(".json")) {
          importedData = JSON.parse(content);

          // Validate imported data structure
          if (importedData.title && Array.isArray(importedData.questions)) {
            if (
              confirm(
                `Import questionnaire "${importedData.title}"? This will replace the current questionnaire.`
              )
            ) {
              setQuestionnaire({
                title: importedData.title || "",
                description: importedData.description || "",
                category: importedData.category || "research",
                questions: importedData.questions.map(
                  (q: {
                    id?: string;
                    type?: string;
                    title?: string;
                    description?: string;
                    required?: boolean;
                    config?: Record<string, unknown>;
                  }) => ({
                    id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    type: q.type || "text-response",
                    title: q.title || "Imported Question",
                    description: q.description || "",
                    required: q.required || false,
                    config: q.config || {},
                  })
                ),
              });
              clearSelection();
            }
          } else {
            alert("Invalid questionnaire format. Please check the JSON structure.");
          }
        } else if (file.name.endsWith(".csv")) {
          // Basic CSV import (simplified)
          const lines = content.split("\n").filter((line) => line.trim());
          const _headers = lines[0].split(",");

          if (lines.length > 1) {
            const questions = lines.slice(1).map((line, index) => {
              const values = line.split(",");
              return {
                id: `csv_import_${Date.now()}_${index}`,
                type: values[1] || "text-response",
                title:
                  values[2]?.replace(/^"|"$/g, "").replace(/""/g, '"') ||
                  `Imported Question ${index + 1}`,
                description: values[3]?.replace(/^"|"$/g, "").replace(/""/g, '"') || "",
                required: values[4] === "Yes",
                config: {},
              };
            });

            if (
              confirm(
                `Import ${questions.length} questions from CSV? This will replace the current questionnaire.`
              )
            ) {
              setQuestionnaire({
                title: `Imported from ${file.name}`,
                description: "Imported questionnaire from CSV",
                category: "research",
                questions,
              });
              clearSelection();
            }
          }
        }
      } catch (error) {
        console.error("Import error:", error);
        alert("Failed to import file. Please check the file format and try again.");
      }
    };

    reader.readAsText(file);
    // Reset input value so the same file can be imported again
    event.target.value = "";
  };

  // Advanced filtering and sorting functions
  const getFilteredAndSortedQuestions = () => {
    let filtered = [...questionnaire.questions];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (q) =>
          q.title.toLowerCase().includes(query) ||
          q.description?.toLowerCase().includes(query) ||
          q.type.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((q) => q.type === filterType);
    }

    // Apply required filter
    if (filterRequired !== "all") {
      const isRequired = filterRequired === "required";
      filtered = filtered.filter((q) => q.required === isRequired);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
        case "required":
          comparison = a.required === b.required ? 0 : a.required ? -1 : 1;
          break;
        case "order":
        default:
          // Use original order (index in the original questions array)
          const aIndex = questionnaire.questions.findIndex((q) => q.id === a.id);
          const bIndex = questionnaire.questions.findIndex((q) => q.id === b.id);
          comparison = aIndex - bIndex;
          break;
      }

      return sortDirection === "desc" ? -comparison : comparison;
    });

    return filtered;
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterType("all");
    setFilterRequired("all");
    setSortBy("order");
    setSortDirection("asc");
  };

  const hasActiveFilters = () => {
    return (
      searchQuery.trim() !== "" ||
      filterType !== "all" ||
      filterRequired !== "all" ||
      sortBy !== "order" ||
      sortDirection !== "asc"
    );
  };

  // AI-powered functions
  const generateAIQuestionSuggestions = async (questionType?: string) => {
    if (!questionnaire.title.trim()) {
      alert("Please enter a questionnaire title first to get better AI suggestions");
      return;
    }

    setIsGeneratingAI(true);
    try {
      const result = await generateQuestionSuggestionsMutation.mutateAsync({
        questionnaireTitle: questionnaire.title,
        questionnaireDescription: questionnaire.description,
        category: questionnaire.category,
        existingQuestions: questionnaire.questions.map((q) => q.title),
        questionType: questionType as
          | "binary"
          | "multi-choice"
          | "rating-scale"
          | "text-response"
          | "ranking"
          | "ab-test"
          | undefined,
        count: 5,
      });

      setAISuggestions(result.suggestions);
      setShowAISuggestions(true);
    } catch (error) {
      console.error("Failed to generate AI suggestions:", error);
      alert("Failed to generate AI suggestions. Please try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const addAISuggestionToQuestionnaire = (suggestion: {
    title: string;
    description?: string;
    type: string;
    config: Record<string, unknown>;
  }) => {
    const newQuestion: Question = {
      id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: suggestion.type,
      title: suggestion.title,
      description: suggestion.description,
      required: false,
      config: suggestion.config || {},
    };

    setQuestionnaire((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const improveQuestionWithAI = async (questionId: string) => {
    const question = questionnaire.questions.find((q) => q.id === questionId);
    if (!question) return;

    setImprovingQuestionId(questionId);
    setIsGeneratingAI(true);
    try {
      const result = await improveQuestionMutation.mutateAsync({
        questionTitle: question.title,
        questionDescription: question.description,
        questionType: question.type as
          | "binary"
          | "multi-choice"
          | "rating-scale"
          | "text-response"
          | "ranking"
          | "ab-test",
        questionConfig: question.config,
        category: questionnaire.category,
        improvementAreas: ["clarity", "engagement", "bias-reduction"],
      });

      setQuestionImprovement(result);
      setShowQuestionImprovement(true);
    } catch (error) {
      console.error("Failed to improve question:", error);
      alert("Failed to improve question. Please try again.");
    } finally {
      setIsGeneratingAI(false);
      setImprovingQuestionId(null);
    }
  };

  const applyQuestionImprovement = () => {
    if (!questionImprovement || !improvingQuestionId) return;

    setQuestionnaire((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === improvingQuestionId
          ? {
              ...q,
              title: questionImprovement.improved.title,
              description: questionImprovement.improved.description || q.description,
              config: questionImprovement.improved.config || q.config,
            }
          : q
      ),
    }));

    setShowQuestionImprovement(false);
    setQuestionImprovement(null);
    setImprovingQuestionId(null);
  };

  const getSmartRecommendations = async (afterQuestionIndex?: number) => {
    if (questionnaire.questions.length === 0) {
      alert("Add at least one question first to get smart recommendations");
      return;
    }

    setIsGeneratingAI(true);
    try {
      const result = await getSmartRecommendationsMutation.mutateAsync({
        currentQuestions: questionnaire.questions.map((q) => ({
          title: q.title,
          type: q.type,
          description: q.description,
        })),
        questionnaireTitle: questionnaire.title,
        category: questionnaire.category,
        insertAfterIndex: afterQuestionIndex,
        count: 3,
      });

      setSmartRecommendations(result.recommendations);
      setRecommendationContext({
        basedOnQuestion: result.context.basedOnQuestion || undefined,
        insertPosition: result.context.suggestedInsertPosition,
      });
      setShowSmartRecommendations(true);
    } catch (error) {
      console.error("Failed to get smart recommendations:", error);
      alert("Failed to get recommendations. Please try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const addRecommendedQuestion = (
    recommendation: (typeof smartRecommendations)[0],
    insertAt?: number
  ) => {
    const newQuestion: Question = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: recommendation.type,
      title: recommendation.title,
      description: "",
      required: false,
      config: recommendation.config || {},
    };

    if (insertAt !== undefined) {
      // Insert at specific position
      setQuestionnaire((prev) => ({
        ...prev,
        questions: [
          ...prev.questions.slice(0, insertAt),
          newQuestion,
          ...prev.questions.slice(insertAt),
        ],
      }));
    } else {
      // Add to end
      setQuestionnaire((prev) => ({
        ...prev,
        questions: [...prev.questions, newQuestion],
      }));
    }
  };

  // AI-powered option generation for multi-choice questions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const generateQuestionOptions = async (questionId: string) => {
    const question = questionnaire.questions.find((q) => q.id === questionId);
    if (!question) return;

    if (!["multi-choice", "ranking", "ab-test"].includes(question.type)) {
      alert(
        "Option generation is only available for multiple choice, ranking, and A/B test questions"
      );
      return;
    }

    setOptionGenerationQuestionId(questionId);
    setIsGeneratingOptions(true);
    try {
      const existingOptions =
        question.type === "multi-choice"
          ? ((question.config.options as Array<{ text: string }>) || []).map((opt) => opt.text)
          : question.type === "ranking"
            ? ((question.config.items as Array<{ text: string }>) || []).map((item) => item.text)
            : [];

      const result = await generateQuestionOptionsMutation.mutateAsync({
        questionTitle: question.title,
        questionDescription: question.description,
        questionType: question.type as "multi-choice" | "ranking" | "ab-test",
        category: questionnaire.category,
        context: questionnaire.description || questionnaire.title,
        optionCount: question.type === "ab-test" ? 2 : 4,
        existingOptions,
      });

      setGeneratedOptions(result.options);
      setShowOptionGeneration(true);
    } catch (error) {
      console.error("Failed to generate options:", error);
      alert("Failed to generate options. Please try again.");
    } finally {
      setIsGeneratingOptions(false);
    }
  };

  const applyGeneratedOptions = (selectedOptions: typeof generatedOptions) => {
    if (!optionGenerationQuestionId) return;

    const questionIndex = questionnaire.questions.findIndex(
      (q) => q.id === optionGenerationQuestionId
    );
    if (questionIndex === -1) return;

    const question = questionnaire.questions[questionIndex];
    const newConfig = { ...question.config };

    if (question.type === "multi-choice") {
      newConfig.options = selectedOptions.map((opt) => ({
        id: opt.id,
        text: opt.text,
      }));
    } else if (question.type === "ranking") {
      newConfig.items = selectedOptions.map((opt) => ({
        id: opt.id,
        text: opt.text,
      }));
    } else if (question.type === "ab-test") {
      if (selectedOptions.length >= 2) {
        newConfig.optionA = { id: "a", text: selectedOptions[0].text };
        newConfig.optionB = { id: "b", text: selectedOptions[1].text };
      }
    }

    setQuestionnaire((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === optionGenerationQuestionId ? { ...q, config: newConfig } : q
      ),
    }));

    setShowOptionGeneration(false);
    setOptionGenerationQuestionId(null);
    setGeneratedOptions([]);
  };

  // AI-powered smart template generation
  const generateSmartTemplate = async (templateRequest: {
    researchGoal: string;
    researchType: string;
    targetAudience: string;
    industry?: string;
    timeConstraint: "short" | "medium" | "long";
    questionCount: number;
    complexity: "basic" | "intermediate" | "advanced";
    context?: string;
  }) => {
    setIsGeneratingTemplate(true);
    try {
      const result = await generateSmartTemplateMutation.mutateAsync(templateRequest);
      setGeneratedTemplate(result);
      setShowTemplateGenerator(false);

      // Show a success message or automatically apply the template
      alert("AI template generated successfully! You can now review and apply it.");
    } catch (error) {
      console.error("Failed to generate smart template:", error);
      alert("Failed to generate template. Please try again.");
    } finally {
      setIsGeneratingTemplate(false);
    }
  };

  const applyGeneratedTemplate = () => {
    if (!generatedTemplate) return;

    // Convert generated template questions to questionnaire format
    const convertedQuestions: Question[] = generatedTemplate.questions.map((q) => ({
      id: q.id,
      type: q.questionType,
      title: q.title,
      description: q.description || "",
      config: q.questionData,
      required: q.isRequired,
    }));

    setQuestionnaire({
      title: generatedTemplate.title,
      description: generatedTemplate.description,
      category: generatedTemplate.category === "customer-satisfaction" ? "feedback" : "research",
      questions: convertedQuestions,
    });

    setGeneratedTemplate(null);
  };

  // Load template data from URL parameter
  useEffect(() => {
    const templateParam = searchParams.get("template");
    if (templateParam) {
      setIsLoadingTemplate(true);
      try {
        const templateData: QuestionnaireTemplate = JSON.parse(decodeURIComponent(templateParam));

        // Convert template questions to questionnaire questions
        const convertedQuestions: Question[] = templateData.questions.map((q) => ({
          id: q.id,
          type: q.questionType,
          title: q.title,
          description: q.description || "",
          config: q.questionData,
          required: q.isRequired,
        }));

        setQuestionnaire({
          title: templateData.title,
          description: templateData.description,
          category:
            templateData.category === "product-research"
              ? "research"
              : templateData.category === "ux-research"
                ? "research"
                : templateData.category === "market-research"
                  ? "research"
                  : templateData.category === "customer-satisfaction"
                    ? "feedback"
                    : "research",
          questions: convertedQuestions,
        });
      } catch (error) {
        console.error("Failed to parse template data:", error);
      }
      setIsLoadingTemplate(false);
    }
  }, [searchParams]);

  const questionTypes = [
    { id: "binary", name: "Yes/No", description: "Simple binary choice" },
    { id: "multi-choice", name: "Multiple Choice", description: "Select one or multiple options" },
    { id: "rating-scale", name: "Rating Scale", description: "1-10 numerical rating" },
    { id: "text-response", name: "Text Response", description: "Open-ended text input" },
    { id: "ranking", name: "Ranking", description: "Drag to reorder items" },
    { id: "ab-test", name: "A/B Test", description: "Compare two options" },
  ];

  // Smart defaults based on questionnaire category and question type
  const getSmartDefaults = (type: string, category: string, _questionCount: number) => {
    const defaults: Record<string, unknown> = {};

    switch (type) {
      case "binary":
        if (category === "feedback") {
          defaults.optionA = { id: "a", text: "Satisfied" };
          defaults.optionB = { id: "b", text: "Unsatisfied" };
        } else if (category === "research") {
          defaults.optionA = { id: "a", text: "Agree" };
          defaults.optionB = { id: "b", text: "Disagree" };
        } else {
          defaults.optionA = { id: "a", text: "Yes" };
          defaults.optionB = { id: "b", text: "No" };
        }
        break;

      case "multi-choice":
        if (category === "feedback") {
          defaults.options = [
            { id: "opt1", text: "Very Satisfied" },
            { id: "opt2", text: "Satisfied" },
            { id: "opt3", text: "Neutral" },
            { id: "opt4", text: "Dissatisfied" },
            { id: "opt5", text: "Very Dissatisfied" },
          ];
        } else if (category === "research") {
          defaults.options = [
            { id: "opt1", text: "Strongly Agree" },
            { id: "opt2", text: "Agree" },
            { id: "opt3", text: "Neutral" },
            { id: "opt4", text: "Disagree" },
            { id: "opt5", text: "Strongly Disagree" },
          ];
        } else {
          defaults.options = [
            { id: "opt1", text: "Option 1" },
            { id: "opt2", text: "Option 2" },
            { id: "opt3", text: "Option 3" },
          ];
        }
        defaults.maxSelections = 1;
        break;

      case "rating-scale":
        if (category === "feedback") {
          defaults.scale = 5;
          defaults.variant = "stars";
          defaults.labels = { min: "Poor", max: "Excellent" };
        } else if (category === "research") {
          defaults.scale = 7;
          defaults.variant = "numbers";
          defaults.labels = { min: "Strongly Disagree", max: "Strongly Agree" };
        } else {
          defaults.scale = 5;
          defaults.variant = "numbers";
          defaults.labels = { min: "Low", max: "High" };
        }
        break;

      case "text-response":
        if (category === "feedback") {
          defaults.maxLength = 1000;
          defaults.placeholder = "Please share your thoughts and suggestions...";
          defaults.multiline = true;
        } else if (category === "research") {
          defaults.maxLength = 500;
          defaults.placeholder = "Please explain your reasoning...";
          defaults.multiline = true;
        } else {
          defaults.maxLength = 250;
          defaults.placeholder = "Enter your response...";
          defaults.multiline = false;
        }
        break;

      case "ranking":
        if (category === "feedback") {
          defaults.items = [
            { id: "item1", text: "Product Quality" },
            { id: "item2", text: "Customer Service" },
            { id: "item3", text: "Value for Money" },
            { id: "item4", text: "Ease of Use" },
          ];
        } else if (category === "research") {
          defaults.items = [
            { id: "item1", text: "Feature A" },
            { id: "item2", text: "Feature B" },
            { id: "item3", text: "Feature C" },
            { id: "item4", text: "Feature D" },
          ];
        } else {
          defaults.items = [
            { id: "item1", text: "Item 1" },
            { id: "item2", text: "Item 2" },
            { id: "item3", text: "Item 3" },
          ];
        }
        break;

      case "ab-test":
        if (category === "feedback") {
          defaults.optionA = {
            title: "Current Version",
            description: "Rate the current experience",
          };
          defaults.optionB = { title: "New Version", description: "Rate the improved experience" };
        } else if (category === "research") {
          defaults.optionA = { title: "Approach A", description: "Traditional method" };
          defaults.optionB = { title: "Approach B", description: "Alternative method" };
        } else {
          defaults.optionA = { title: "Option A", description: "Description for option A" };
          defaults.optionB = { title: "Option B", description: "Description for option B" };
        }
        break;
    }

    return defaults;
  };

  // Smart title suggestions based on question type and position
  const getSmartTitle = (type: string, category: string, questionCount: number) => {
    const isFirst = questionCount === 0;
    const isLast = questionCount > 3;

    if (isFirst) {
      if (category === "feedback") {
        return type === "rating-scale"
          ? "How would you rate your overall experience?"
          : type === "binary"
            ? "Are you satisfied with our service?"
            : type === "multi-choice"
              ? "What is your overall satisfaction level?"
              : type === "text-response"
                ? "What brought you here today?"
                : "How would you describe your experience?";
      } else if (category === "research") {
        return type === "rating-scale"
          ? "How important is this feature to you?"
          : type === "binary"
            ? "Do you agree with this statement?"
            : type === "multi-choice"
              ? "Which option best describes your opinion?"
              : type === "text-response"
                ? "What are your thoughts on this topic?"
                : "What is your primary concern?";
      }
    }

    if (isLast && category === "feedback") {
      return type === "text-response"
        ? "Any additional comments or suggestions?"
        : type === "rating-scale"
          ? "How likely are you to recommend us?"
          : "Is there anything else you'd like to share?";
    }

    // Default titles based on type
    const typeTitles = {
      binary: "Do you agree with this statement?",
      "multi-choice": "Which option best applies to you?",
      "rating-scale": "How would you rate this aspect?",
      "text-response": "Please share your thoughts",
      ranking: "Please rank these items in order of importance",
      "ab-test": "Which option do you prefer?",
    };

    return typeTitles[type as keyof typeof typeTitles] || "New Question";
  };

  const addQuestion = (type: string) => {
    const questionCount = questionnaire.questions.length;
    const smartConfig = getSmartDefaults(type, questionnaire.category, questionCount);
    const smartTitle = getSmartTitle(type, questionnaire.category, questionCount);

    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type,
      title: smartTitle,
      required: questionCount < 3, // First 3 questions are required by default
      config: smartConfig,
    };
    setEditingQuestion(newQuestion);
    setShowQuestionModal(true);
    return newQuestion;
  };

  const saveQuestion = (question: Question) => {
    if (questionnaire.questions.find((q) => q.id === question.id)) {
      // Update existing
      setQuestionnaire((prev) => ({
        ...prev,
        questions: prev.questions.map((q) => (q.id === question.id ? question : q)),
      }));
    } else {
      // Add new
      setQuestionnaire((prev) => ({
        ...prev,
        questions: [...prev.questions, question],
      }));
    }
    setShowQuestionModal(false);
    setEditingQuestion(null);
  };

  // Handler for question type selection
  const handleSelectQuestionType = (type: string) => {
    setShowQuestionTypeSelector(false);

    // Create new question with selected type
    const newQuestion = addQuestion(type);
    setEditingQuestion(newQuestion);
    setShowQuestionModal(true);
  };

  // Start new question flow
  const startNewQuestion = () => {
    setShowQuestionTypeSelector(true);
  };

  const removeQuestion = (id: string) => {
    setQuestionnaire((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  };

  const duplicateQuestion = (id: string) => {
    const questionToDuplicate = questionnaire.questions.find((q) => q.id === id);
    if (questionToDuplicate) {
      const duplicatedQuestion: Question = {
        ...questionToDuplicate,
        id: `q_${Date.now()}`,
        title: `${questionToDuplicate.title} (Copy)`,
      };
      setQuestionnaire((prev) => ({
        ...prev,
        questions: [...prev.questions, duplicatedQuestion],
      }));
    }
  };

  const moveQuestion = (id: string, direction: "up" | "down") => {
    const questions = [...questionnaire.questions];
    const index = questions.findIndex((q) => q.id === id);
    if (direction === "up" && index > 0) {
      [questions[index], questions[index - 1]] = [questions[index - 1], questions[index]];
    } else if (direction === "down" && index < questions.length - 1) {
      [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]];
    }
    setQuestionnaire((prev) => ({ ...prev, questions }));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--off-white)" }}>
      {/* Loading Template State */}
      {isLoadingTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(250, 250, 250, 0.9)" }}
        >
          <div className="text-center">
            <div
              className="mx-auto mb-4 size-12 animate-spin rounded-full border-b-2"
              style={{ borderColor: "var(--primary)" }}
            ></div>
            <p className="font-mono text-sm" style={{ color: "var(--warm-gray)" }}>
              Loading Template...
            </p>
          </div>
        </div>
      )}

      {/* Clean Header */}
      <div
        className="border-b"
        style={{
          backgroundColor: "var(--off-white)",
          borderColor: "var(--light-gray)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <nav className="mb-2 flex space-x-4 text-sm" style={{ color: "var(--warm-gray)" }}>
                <Link href="/admin" className="hover:opacity-75">
                  Admin
                </Link>
                <span>/</span>
                <Link href="/admin/questionnaires/templates" className="hover:opacity-75">
                  Questionnaires
                </Link>
                <span>/</span>
                <span style={{ color: "var(--off-black)" }}>New</span>
              </nav>
              <h1 className="text-3xl font-bold" style={{ color: "var(--off-black)" }}>
                Create Questionnaire
              </h1>
              <p className="mt-1 text-sm" style={{ color: "var(--warm-gray)" }}>
                Build a multi-question survey for your research
              </p>
            </div>
            <div className="flex space-x-4">
              {/* Import/Export Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium transition-colors hover:opacity-75"
                  style={{
                    backgroundColor: "var(--light-gray)",
                    color: "var(--off-black)",
                    border: "1px solid var(--warm-gray)",
                  }}
                  onClick={() => {
                    const menu = document.getElementById("import-export-menu");
                    if (menu) {
                      menu.style.display = menu.style.display === "block" ? "none" : "block";
                    }
                  }}
                >
                  <Download size={16} className="mr-2" />
                  Export
                </button>
                <div
                  id="import-export-menu"
                  className="absolute right-0 z-10 mt-2 w-48 border-2 shadow-lg"
                  style={{
                    backgroundColor: "var(--off-white)",
                    borderColor: "var(--light-gray)",
                    display: "none",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      exportQuestionnaireAsJSON();
                      document.getElementById("import-export-menu")!.style.display = "none";
                    }}
                    className="w-full px-4 py-2 text-left text-sm transition-colors hover:opacity-75"
                    style={{ color: "var(--off-black)" }}
                  >
                    Export as JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      exportQuestionnaireAsCSV();
                      document.getElementById("import-export-menu")!.style.display = "none";
                    }}
                    className="w-full px-4 py-2 text-left text-sm transition-colors hover:opacity-75"
                    style={{ color: "var(--off-black)" }}
                  >
                    Export as CSV
                  </button>
                  <div className="border-t" style={{ borderColor: "var(--light-gray)" }}>
                    <label
                      className="block w-full cursor-pointer px-4 py-2 text-left text-sm transition-colors hover:opacity-75"
                      style={{ color: "var(--off-black)" }}
                    >
                      <Upload size={16} className="mr-2 inline" />
                      Import from File
                      <input
                        type="file"
                        accept=".json,.csv"
                        onChange={(e) => {
                          importQuestionnaire(e);
                          document.getElementById("import-export-menu")!.style.display = "none";
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <Link
                href="/admin/questionnaires/templates"
                className="inline-flex items-center px-4 py-2 text-sm font-medium transition-colors hover:opacity-75"
                style={{
                  backgroundColor: "var(--off-white)",
                  color: "var(--off-black)",
                  border: "2px solid var(--off-black)",
                }}
              >
                Use Template
              </Link>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: "var(--warm-gray)",
                  color: "var(--off-white)",
                }}
                onClick={handleSaveDraft}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Draft"}
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: "var(--off-black)",
                  color: "var(--off-white)",
                }}
                onClick={handlePublish}
                disabled={isSaving}
              >
                {isSaving ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Questionnaire Info */}
            <div
              className="border-2 p-6 shadow"
              style={{
                backgroundColor: "var(--off-white)",
                borderColor: "var(--light-gray)",
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-mono text-lg font-medium" style={{ color: "var(--off-black)" }}>
                  Questionnaire Details
                </h2>
                {searchParams.get("template") && (
                  <span
                    className="px-3 py-1 font-mono text-sm font-medium"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--off-white)",
                    }}
                  >
                    From Template
                  </span>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label
                    className="mb-1 block font-mono text-sm font-medium"
                    style={{ color: "var(--off-black)" }}
                  >
                    Title *
                  </label>
                  <input
                    type="text"
                    value={questionnaire.title}
                    onChange={(e) =>
                      setQuestionnaire((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                    style={{
                      borderColor: "var(--off-black)",
                      backgroundColor: "var(--off-white)",
                      color: "var(--off-black)",
                      padding: "0.75rem",
                    }}
                    placeholder="e.g., Product Feature Research Survey"
                  />
                </div>
                <div>
                  <label
                    className="mb-1 block font-mono text-sm font-medium"
                    style={{ color: "var(--off-black)" }}
                  >
                    Description
                  </label>
                  <textarea
                    value={questionnaire.description}
                    onChange={(e) =>
                      setQuestionnaire((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={3}
                    className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                    style={{
                      borderColor: "var(--off-black)",
                      backgroundColor: "var(--off-white)",
                      color: "var(--off-black)",
                      padding: "0.75rem",
                    }}
                    placeholder="Brief description of what this questionnaire is about..."
                  />
                </div>
                <div>
                  <label
                    className="mb-1 block font-mono text-sm font-medium"
                    style={{ color: "var(--off-black)" }}
                  >
                    Category
                  </label>
                  <select
                    value={questionnaire.category}
                    onChange={(e) =>
                      setQuestionnaire((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                    style={{
                      borderColor: "var(--off-black)",
                      backgroundColor: "var(--off-white)",
                      color: "var(--off-black)",
                      padding: "0.75rem",
                    }}
                  >
                    <option value="research">Research</option>
                    <option value="feedback">Feedback</option>
                    <option value="survey">Survey</option>
                    <option value="poll">Poll</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div
              className="border-2 shadow"
              style={{
                backgroundColor: "var(--off-white)",
                borderColor: "var(--light-gray)",
              }}
            >
              <div className="border-b-2 px-6 py-4" style={{ borderColor: "var(--light-gray)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h2
                      className="font-mono text-lg font-medium"
                      style={{ color: "var(--off-black)" }}
                    >
                      Questions ({questionnaire.questions.length})
                    </h2>
                    {questionnaire.questions.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsSelectionMode(!isSelectionMode)}
                        className="px-3 py-1 font-mono text-xs font-medium transition-colors hover:opacity-90"
                        style={{
                          backgroundColor: isSelectionMode ? "var(--primary)" : "var(--light-gray)",
                          color: isSelectionMode ? "var(--off-white)" : "var(--off-black)",
                        }}
                      >
                        {isSelectionMode ? "Cancel Selection" : "Select Multiple"}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {isSelectionMode && selectedQuestions.size > 0 && (
                      <>
                        <span className="font-mono text-xs" style={{ color: "var(--warm-gray)" }}>
                          {selectedQuestions.size} selected
                        </span>
                        <button
                          type="button"
                          onClick={bulkDuplicateQuestions}
                          className="px-3 py-1 font-mono text-xs font-medium transition-colors hover:opacity-90"
                          style={{ backgroundColor: "var(--primary)", color: "var(--off-white)" }}
                        >
                          Duplicate
                        </button>
                        <button
                          type="button"
                          onClick={() => bulkToggleRequired(true)}
                          className="px-3 py-1 font-mono text-xs font-medium transition-colors hover:opacity-90"
                          style={{ backgroundColor: "var(--warm-gray)", color: "var(--off-white)" }}
                        >
                          Mark Required
                        </button>
                        <button
                          type="button"
                          onClick={() => bulkToggleRequired(false)}
                          className="px-3 py-1 font-mono text-xs font-medium transition-colors hover:opacity-90"
                          style={{
                            backgroundColor: "var(--light-gray)",
                            color: "var(--off-black)",
                          }}
                        >
                          Mark Optional
                        </button>
                        <button
                          type="button"
                          onClick={bulkDeleteQuestions}
                          className="px-3 py-1 font-mono text-xs font-medium transition-colors hover:opacity-90"
                          style={{ backgroundColor: "#dc2626", color: "var(--off-white)" }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {isSelectionMode && questionnaire.questions.length > 0 && (
                      <button
                        type="button"
                        onClick={
                          selectedQuestions.size === questionnaire.questions.length
                            ? clearSelection
                            : selectAllQuestions
                        }
                        className="px-3 py-1 font-mono text-xs font-medium transition-colors hover:opacity-90"
                        style={{ backgroundColor: "var(--off-black)", color: "var(--off-white)" }}
                      >
                        {selectedQuestions.size === questionnaire.questions.length
                          ? "Deselect All"
                          : "Select All"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={startNewQuestion}
                      className="px-4 py-2 font-mono text-sm font-medium transition-colors hover:opacity-90"
                      style={{
                        backgroundColor: "var(--off-black)",
                        color: "var(--off-white)",
                      }}
                    >
                      Add Question
                    </button>
                    <button
                      type="button"
                      onClick={() => generateAIQuestionSuggestions()}
                      disabled={isGeneratingAI}
                      className="flex items-center space-x-2 px-4 py-2 font-mono text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "var(--off-white)",
                      }}
                    >
                      {isGeneratingAI ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          <span>AI Suggestions</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => getSmartRecommendations()}
                      disabled={isGeneratingAI || questionnaire.questions.length === 0}
                      className="flex items-center space-x-2 px-4 py-2 font-mono text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                      style={{
                        backgroundColor: "var(--warm-gray)",
                        color: "var(--off-white)",
                      }}
                    >
                      <Lightbulb size={16} />
                      <span>Smart Recommendations</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTemplateGenerator(true)}
                      disabled={isGeneratingTemplate}
                      className="flex items-center space-x-2 px-4 py-2 font-mono text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                      style={{
                        backgroundColor: "var(--accent)",
                        color: "var(--off-white)",
                      }}
                    >
                      {isGeneratingTemplate ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 size={16} />
                          <span>AI Template</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Filtering Controls */}
              {questionnaire.questions.length > 0 && (
                <div
                  className="border-b-2 px-6 py-4"
                  style={{ borderColor: "var(--light-gray)", backgroundColor: "var(--off-white)" }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Search size={16} style={{ color: "var(--primary)" }} />
                      <span
                        className="font-mono text-sm font-medium"
                        style={{ color: "var(--off-black)" }}
                      >
                        Filter & Sort Questions
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center space-x-1 px-3 py-1 font-mono text-xs transition-colors hover:opacity-75"
                      style={{
                        backgroundColor: showFilters ? "var(--primary)" : "var(--light-gray)",
                        color: showFilters ? "var(--off-white)" : "var(--off-black)",
                      }}
                    >
                      <Filter size={14} />
                      <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="mb-3">
                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: "var(--warm-gray)" }}
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search questions by title, description, or type..."
                        className="w-full border-2 pl-10 font-mono text-sm transition-all duration-200 focus:outline-none"
                        style={{
                          borderColor: "var(--light-gray)",
                          backgroundColor: "var(--off-white)",
                          color: "var(--off-black)",
                          padding: "0.5rem 0.75rem 0.5rem 2.5rem",
                        }}
                      />
                    </div>
                  </div>

                  {/* Advanced Filters */}
                  {showFilters && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      {/* Question Type Filter */}
                      <div>
                        <label
                          className="mb-1 block font-mono text-xs"
                          style={{ color: "var(--warm-gray)" }}
                        >
                          Question Type
                        </label>
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                          style={{
                            borderColor: "var(--light-gray)",
                            backgroundColor: "var(--off-white)",
                            color: "var(--off-black)",
                            padding: "0.5rem",
                          }}
                        >
                          <option value="all">All Types</option>
                          {questionTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Required Status Filter */}
                      <div>
                        <label
                          className="mb-1 block font-mono text-xs"
                          style={{ color: "var(--warm-gray)" }}
                        >
                          Required Status
                        </label>
                        <select
                          value={filterRequired}
                          onChange={(e) => setFilterRequired(e.target.value)}
                          className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                          style={{
                            borderColor: "var(--light-gray)",
                            backgroundColor: "var(--off-white)",
                            color: "var(--off-black)",
                            padding: "0.5rem",
                          }}
                        >
                          <option value="all">All Questions</option>
                          <option value="required">Required Only</option>
                          <option value="optional">Optional Only</option>
                        </select>
                      </div>

                      {/* Sort By */}
                      <div>
                        <label
                          className="mb-1 block font-mono text-xs"
                          style={{ color: "var(--warm-gray)" }}
                        >
                          Sort By
                        </label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                          style={{
                            borderColor: "var(--light-gray)",
                            backgroundColor: "var(--off-white)",
                            color: "var(--off-black)",
                            padding: "0.5rem",
                          }}
                        >
                          <option value="order">Original Order</option>
                          <option value="title">Title</option>
                          <option value="type">Question Type</option>
                          <option value="required">Required Status</option>
                        </select>
                      </div>

                      {/* Sort Direction */}
                      <div>
                        <label
                          className="mb-1 block font-mono text-xs"
                          style={{ color: "var(--warm-gray)" }}
                        >
                          Sort Direction
                        </label>
                        <button
                          type="button"
                          onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                          className="flex w-full items-center justify-center space-x-2 border-2 font-mono text-sm transition-all duration-200 hover:opacity-75 focus:outline-none"
                          style={{
                            borderColor: "var(--light-gray)",
                            backgroundColor: "var(--off-white)",
                            color: "var(--off-black)",
                            padding: "0.5rem",
                          }}
                        >
                          {sortDirection === "asc" ? (
                            <>
                              <SortAsc size={16} />
                              <span>Ascending</span>
                            </>
                          ) : (
                            <>
                              <SortDesc size={16} />
                              <span>Descending</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Filter Status and Clear */}
                  {hasActiveFilters() && (
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-mono text-xs" style={{ color: "var(--warm-gray)" }}>
                        {getFilteredAndSortedQuestions().length} of {questionnaire.questions.length}{" "}
                        questions shown
                      </span>
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="px-3 py-1 font-mono text-xs transition-colors hover:opacity-75"
                        style={{
                          backgroundColor: "var(--warm-gray)",
                          color: "var(--off-white)",
                        }}
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="p-6">
                {questionnaire.questions.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="mb-4 flex justify-center" style={{ color: "var(--warm-gray)" }}>
                      <Type size={64} />
                    </div>
                    <h3 className="mb-2 text-lg font-medium" style={{ color: "var(--off-black)" }}>
                      No questions yet
                    </h3>
                    <p className="mb-4 text-sm" style={{ color: "var(--warm-gray)" }}>
                      Add your first question to get started
                    </p>
                    <button
                      onClick={startNewQuestion}
                      className="px-6 py-3 font-mono text-sm font-medium transition-colors hover:opacity-90"
                      style={{
                        backgroundColor: "var(--off-black)",
                        color: "var(--off-white)",
                      }}
                    >
                      Add First Question
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getFilteredAndSortedQuestions().map((question, _filteredIndex) => {
                      const questionType = questionTypes.find((t) => t.id === question.type);
                      const QuestionIcon = (questionType as QuestionType)?.icon || Type;
                      const originalIndex = questionnaire.questions.findIndex(
                        (q) => q.id === question.id
                      );

                      return (
                        <div
                          key={question.id}
                          draggable={!hasActiveFilters()} // Disable drag when filters are active
                          onDragStart={(e) => handleDragStart(e, question.id)}
                          onDragOver={(e) => handleDragOver(e, originalIndex)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, originalIndex)}
                          onDragEnd={handleDragEnd}
                          className={`${hasActiveFilters() ? "cursor-default" : "cursor-move"} overflow-hidden border-2 shadow-sm transition-all duration-200 hover:shadow-md ${
                            draggedQuestion === question.id ? "scale-95 opacity-50" : ""
                          } ${dragOverIndex === originalIndex ? "scale-105 border-4" : ""}`}
                          style={{
                            backgroundColor: "var(--off-white)",
                            borderColor:
                              dragOverIndex === originalIndex
                                ? "var(--primary)"
                                : "var(--light-gray)",
                          }}
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
                                {isSelectionMode && (
                                  <div className="shrink-0 pt-1">
                                    <input
                                      type="checkbox"
                                      checked={selectedQuestions.has(question.id)}
                                      onChange={() => toggleQuestionSelection(question.id)}
                                      className="size-4 cursor-pointer"
                                      style={{ accentColor: "var(--primary)" }}
                                    />
                                  </div>
                                )}
                                <div className="shrink-0">
                                  <QuestionIcon size={24} style={{ color: "var(--primary)" }} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="mb-2 flex items-center space-x-2">
                                    <span
                                      className="px-2 py-1 font-mono text-xs font-medium"
                                      style={{
                                        backgroundColor: "var(--light-gray)",
                                        color: "var(--off-black)",
                                      }}
                                    >
                                      Q{originalIndex + 1}
                                    </span>
                                    <span
                                      className="px-2 py-1 font-mono text-xs"
                                      style={{
                                        backgroundColor: "var(--primary)",
                                        color: "var(--off-white)",
                                      }}
                                    >
                                      {questionType?.name}
                                    </span>
                                    {question.required && (
                                      <span
                                        className="px-2 py-1 font-mono text-xs"
                                        style={{
                                          backgroundColor: "var(--warm-gray)",
                                          color: "var(--off-white)",
                                        }}
                                      >
                                        REQUIRED
                                      </span>
                                    )}
                                  </div>
                                  <h3
                                    className="mb-1 font-medium"
                                    style={{ color: "var(--off-black)" }}
                                  >
                                    {question.title}
                                  </h3>
                                  {question.description && (
                                    <p className="text-sm" style={{ color: "var(--warm-gray)" }}>
                                      {question.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Drag Handle */}
                              <div className="ml-4 flex items-center space-x-2">
                                <div
                                  className={`p-1 transition-colors ${hasActiveFilters() ? "cursor-not-allowed opacity-50" : "cursor-grab hover:opacity-75 active:cursor-grabbing"}`}
                                  style={{ color: "var(--warm-gray)" }}
                                  title={
                                    hasActiveFilters()
                                      ? "Clear filters to enable drag and drop"
                                      : "Drag to reorder"
                                  }
                                  onMouseDown={(e) => e.stopPropagation()}
                                >
                                  <GripVertical size={16} />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div
                            className="flex items-center justify-between px-6 py-3"
                            style={{ backgroundColor: "var(--light-gray)" }}
                          >
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => moveQuestion(question.id, "up")}
                                disabled={index === 0}
                                className="p-1 transition-colors hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-25"
                                style={{ color: "var(--warm-gray)" }}
                                title="Move up"
                              >
                                ↑
                              </button>
                              <button
                                onClick={() => moveQuestion(question.id, "down")}
                                disabled={index === questionnaire.questions.length - 1}
                                className="p-1 transition-colors hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-25"
                                style={{ color: "var(--warm-gray)" }}
                                title="Move down"
                              >
                                ↓
                              </button>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => duplicateQuestion(question.id)}
                                className="p-1 transition-colors hover:opacity-75"
                                style={{ color: "var(--primary)" }}
                                title="Duplicate question"
                              >
                                <Plus size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingQuestion(question);
                                  setShowQuestionModal(true);
                                }}
                                className="px-3 py-1 text-xs font-medium transition-colors hover:opacity-90"
                                style={{
                                  backgroundColor: "var(--off-black)",
                                  color: "var(--off-white)",
                                }}
                                title="Edit question"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => improveQuestionWithAI(question.id)}
                                disabled={isGeneratingAI || improvingQuestionId === question.id}
                                className="flex items-center space-x-1 px-3 py-1 text-xs font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                                style={{
                                  backgroundColor: "var(--primary)",
                                  color: "var(--off-white)",
                                }}
                                title="Improve question with AI"
                              >
                                {improvingQuestionId === question.id ? (
                                  <RefreshCw size={14} className="animate-spin" />
                                ) : (
                                  <Wand2 size={14} />
                                )}
                                <span>AI</span>
                              </button>
                              <button
                                onClick={() => getSmartRecommendations(originalIndex)}
                                disabled={isGeneratingAI}
                                className="flex items-center space-x-1 px-3 py-1 text-xs font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                                style={{
                                  backgroundColor: "var(--warm-gray)",
                                  color: "var(--off-white)",
                                }}
                                title="Get recommendations after this question"
                              >
                                <Lightbulb size={14} />
                                <span>Rec</span>
                              </button>
                              <button
                                onClick={() => removeQuestion(question.id)}
                                className="p-1 transition-colors hover:opacity-75"
                                style={{ color: "var(--warm-gray)" }}
                                title="Delete question"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Add Questions */}
            <div className="rounded-lg bg-white shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Add Question</h2>
              </div>
              <div className="space-y-3 p-6">
                {questionTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => addQuestion(type.id)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-left transition-colors hover:bg-gray-100"
                  >
                    <div className="font-medium text-gray-900">{type.name}</div>
                    <div className="text-sm text-gray-500">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-lg bg-white shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Preview</h2>
              </div>
              <div className="p-6">
                <div className="space-y-2 text-sm text-gray-500">
                  <div>
                    <strong>Title:</strong> {questionnaire.title || "Untitled Questionnaire"}
                  </div>
                  <div>
                    <strong>Questions:</strong> {questionnaire.questions.length}
                  </div>
                  <div>
                    <strong>Estimated time:</strong>{" "}
                    {Math.ceil(questionnaire.questions.length * 0.5)} min
                  </div>
                </div>
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="mt-4 w-full rounded-lg border border-green-200 bg-green-50 p-3 text-green-700 transition-colors hover:bg-green-100"
                >
                  Preview Full Survey
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Type Selector Modal */}
      {showQuestionTypeSelector && (
        <QuestionTypeSelector
          onSelectType={handleSelectQuestionType}
          onClose={() => setShowQuestionTypeSelector(false)}
        />
      )}

      {/* Question Modal with Full Configuration */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg shadow-xl"
            style={{ backgroundColor: "var(--off-white)" }}
          >
            {/* Terminal-style Header */}
            <div
              className="border-b-2 p-4"
              style={{
                backgroundColor: "var(--off-black)",
                borderColor: "var(--off-black)",
              }}
            >
              <div className="font-mono text-sm" style={{ color: "var(--primary)" }}>
                $ admin/questionnaires/questions --config
              </div>
              <div
                className="font-mono font-bold uppercase tracking-wide"
                style={{ color: "var(--off-white)" }}
              >
                Question Editor
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Question Type Selection */}
                <div>
                  <label
                    className="mb-2 block font-mono text-sm font-medium"
                    style={{ color: "var(--off-black)" }}
                  >
                    Question Type
                  </label>
                  <select
                    value={editingQuestion?.type || "binary"}
                    onChange={(e) =>
                      setEditingQuestion((prev) =>
                        prev ? { ...prev, type: e.target.value, config: {} } : null
                      )
                    }
                    className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                    style={{
                      borderColor: "var(--off-black)",
                      backgroundColor: "var(--off-white)",
                      color: "var(--off-black)",
                      padding: "0.75rem",
                    }}
                  >
                    {questionTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} - {type.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Question Title */}
                <div>
                  <label
                    className="mb-2 block font-mono text-sm font-medium"
                    style={{ color: "var(--off-black)" }}
                  >
                    Question Text *
                  </label>
                  <input
                    type="text"
                    value={editingQuestion?.title || ""}
                    onChange={(e) =>
                      setEditingQuestion((prev) =>
                        prev ? { ...prev, title: e.target.value } : null
                      )
                    }
                    className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                    style={{
                      borderColor: "var(--off-black)",
                      backgroundColor: "var(--off-white)",
                      color: "var(--off-black)",
                      padding: "0.75rem",
                    }}
                    placeholder="Enter your question..."
                  />
                </div>

                {/* Question Description */}
                <div>
                  <label
                    className="mb-2 block font-mono text-sm font-medium"
                    style={{ color: "var(--off-black)" }}
                  >
                    Description
                  </label>
                  <textarea
                    value={editingQuestion?.description || ""}
                    onChange={(e) =>
                      setEditingQuestion((prev) =>
                        prev ? { ...prev, description: e.target.value } : null
                      )
                    }
                    rows={3}
                    className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                    style={{
                      borderColor: "var(--off-black)",
                      backgroundColor: "var(--off-white)",
                      color: "var(--off-black)",
                      padding: "0.75rem",
                    }}
                    placeholder="Optional description or help text..."
                  />
                </div>

                {/* Question Configuration - Dynamic based on type */}
                {editingQuestion && (
                  <QuestionConfigurationPanel
                    question={editingQuestion}
                    onConfigChange={(config) =>
                      setEditingQuestion((prev) => (prev ? { ...prev, config } : null))
                    }
                  />
                )}

                {/* Required Checkbox */}
                <div>
                  <label className="flex items-center font-mono text-sm">
                    <input
                      type="checkbox"
                      checked={editingQuestion?.required || false}
                      onChange={(e) =>
                        setEditingQuestion((prev) =>
                          prev ? { ...prev, required: e.target.checked } : null
                        )
                      }
                      className="mr-3 size-4"
                    />
                    <span style={{ color: "var(--off-black)" }}>Required Question</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowQuestionModal(false);
                    setEditingQuestion(null);
                  }}
                  className="flex-1 px-6 py-3 font-mono text-sm transition-colors"
                  style={{
                    backgroundColor: "var(--warm-gray)",
                    color: "var(--off-white)",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => editingQuestion && saveQuestion(editingQuestion)}
                  className="flex-1 px-6 py-3 font-mono text-sm transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--off-white)",
                  }}
                >
                  Save Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto border-2 shadow-lg"
            style={{
              backgroundColor: "var(--off-white)",
              borderColor: "var(--off-black)",
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between border-b-2 px-6 py-4"
              style={{ borderColor: "var(--light-gray)" }}
            >
              <div className="flex items-center space-x-3">
                <Eye size={24} style={{ color: "var(--primary)" }} />
                <h2 className="font-mono text-xl font-bold" style={{ color: "var(--off-black)" }}>
                  Survey Preview
                </h2>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 transition-colors hover:opacity-75"
                style={{ color: "var(--warm-gray)" }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content - Survey Preview */}
            <div className="p-8">
              {/* Survey Header */}
              <div className="mb-8 text-center">
                <h1 className="mb-4 text-3xl font-bold" style={{ color: "var(--off-black)" }}>
                  {questionnaire.title || "Untitled Questionnaire"}
                </h1>
                {questionnaire.description && (
                  <p className="mb-4 text-lg" style={{ color: "var(--warm-gray)" }}>
                    {questionnaire.description}
                  </p>
                )}
                <div
                  className="flex items-center justify-center space-x-6 text-sm"
                  style={{ color: "var(--warm-gray)" }}
                >
                  <span>{questionnaire.questions.length} questions</span>
                  <span>•</span>
                  <span>~{Math.ceil(questionnaire.questions.length * 0.5)} minutes</span>
                  <span>•</span>
                  <span className="capitalize">{questionnaire.category}</span>
                </div>
              </div>

              {/* Questions Preview */}
              {questionnaire.questions.length === 0 ? (
                <div className="py-12 text-center">
                  <Type size={64} style={{ color: "var(--warm-gray)" }} className="mx-auto mb-4" />
                  <h3 className="mb-2 text-lg font-medium" style={{ color: "var(--off-black)" }}>
                    No questions added yet
                  </h3>
                  <p style={{ color: "var(--warm-gray)" }}>
                    Add some questions to see how your survey will look to respondents
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {questionnaire.questions.map((question, index) => {
                    const questionType = questionTypes.find((t) => t.id === question.type);
                    return (
                      <div
                        key={question.id}
                        className="border-b pb-8 last:border-b-0"
                        style={{ borderColor: "var(--light-gray)" }}
                      >
                        {/* Question Header */}
                        <div className="mb-4">
                          <div className="mb-2 flex items-center space-x-2">
                            <span
                              className="px-2 py-1 font-mono text-xs font-medium"
                              style={{
                                backgroundColor: "var(--light-gray)",
                                color: "var(--off-black)",
                              }}
                            >
                              {index + 1} of {questionnaire.questions.length}
                            </span>
                            <span
                              className="px-2 py-1 font-mono text-xs"
                              style={{
                                backgroundColor: "var(--primary)",
                                color: "var(--off-white)",
                              }}
                            >
                              {questionType?.name}
                            </span>
                            {question.required && (
                              <span
                                className="px-2 py-1 font-mono text-xs"
                                style={{
                                  backgroundColor: "var(--warm-gray)",
                                  color: "var(--off-white)",
                                }}
                              >
                                REQUIRED
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-medium" style={{ color: "var(--off-black)" }}>
                            {question.title}
                          </h3>
                          {question.description && (
                            <p className="mt-2" style={{ color: "var(--warm-gray)" }}>
                              {question.description}
                            </p>
                          )}
                        </div>

                        {/* Question Preview based on type */}
                        <div className="space-y-3">
                          {question.type === "binary" && (
                            <div className="flex space-x-4">
                              <button
                                className="flex-1 border-2 px-4 py-3 text-center transition-colors hover:opacity-75"
                                style={{
                                  borderColor: "var(--light-gray)",
                                  backgroundColor: "var(--off-white)",
                                }}
                              >
                                {question.config.optionA?.text || "Yes"}
                              </button>
                              <button
                                className="flex-1 border-2 px-4 py-3 text-center transition-colors hover:opacity-75"
                                style={{
                                  borderColor: "var(--light-gray)",
                                  backgroundColor: "var(--off-white)",
                                }}
                              >
                                {question.config.optionB?.text || "No"}
                              </button>
                            </div>
                          )}

                          {question.type === "multi-choice" && (
                            <div className="space-y-2">
                              {(question.config.options as Array<{ text: string }>)?.map(
                                (option: { text: string }, optIndex: number) => (
                                  <label
                                    key={optIndex}
                                    className="flex cursor-pointer items-center space-x-3"
                                  >
                                    <input
                                      type="radio"
                                      name={`preview-${question.id}`}
                                      className="size-4"
                                    />
                                    <span style={{ color: "var(--off-black)" }}>{option.text}</span>
                                  </label>
                                )
                              )}
                            </div>
                          )}

                          {question.type === "rating-scale" && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm" style={{ color: "var(--warm-gray)" }}>
                                {question.config.labels?.min || "Poor"}
                              </span>
                              <div className="flex space-x-2">
                                {Array.from({ length: question.config.scale || 5 }, (_, i) => (
                                  <button
                                    key={i}
                                    className="size-10 border-2 transition-colors hover:opacity-75"
                                    style={{
                                      borderColor: "var(--light-gray)",
                                      backgroundColor: "var(--off-white)",
                                    }}
                                  >
                                    {i + 1}
                                  </button>
                                ))}
                              </div>
                              <span className="text-sm" style={{ color: "var(--warm-gray)" }}>
                                {question.config.labels?.max || "Excellent"}
                              </span>
                            </div>
                          )}

                          {question.type === "text-response" && (
                            <textarea
                              placeholder={question.config.placeholder || "Enter your response..."}
                              rows={question.config.multiline ? 4 : 1}
                              className="w-full border-2 p-3"
                              style={{
                                borderColor: "var(--light-gray)",
                                backgroundColor: "var(--off-white)",
                              }}
                              disabled
                            />
                          )}

                          {question.type === "ranking" && (
                            <div className="space-y-2">
                              {(question.config.items as Array<{ text: string }>)?.map(
                                (item: { text: string }, rankIndex: number) => (
                                  <div
                                    key={rankIndex}
                                    className="flex items-center space-x-3 border-2 p-3"
                                    style={{
                                      borderColor: "var(--light-gray)",
                                      backgroundColor: "var(--off-white)",
                                    }}
                                  >
                                    <span
                                      className="size-6 rounded-full border text-center text-sm leading-6"
                                      style={{ borderColor: "var(--warm-gray)" }}
                                    >
                                      {rankIndex + 1}
                                    </span>
                                    <span style={{ color: "var(--off-black)" }}>{item.text}</span>
                                    <div className="ml-auto" style={{ color: "var(--warm-gray)" }}>
                                      <GripVertical size={16} />
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                          {question.type === "ab-test" && (
                            <div className="grid grid-cols-2 gap-4">
                              <div
                                className="border-2 p-4 text-center"
                                style={{
                                  borderColor: "var(--light-gray)",
                                  backgroundColor: "var(--off-white)",
                                }}
                              >
                                <h4
                                  className="mb-2 font-medium"
                                  style={{ color: "var(--off-black)" }}
                                >
                                  Option A
                                </h4>
                                <p style={{ color: "var(--warm-gray)" }}>
                                  {question.config.optionA?.description ||
                                    "Description for option A"}
                                </p>
                              </div>
                              <div
                                className="border-2 p-4 text-center"
                                style={{
                                  borderColor: "var(--light-gray)",
                                  backgroundColor: "var(--off-white)",
                                }}
                              >
                                <h4
                                  className="mb-2 font-medium"
                                  style={{ color: "var(--off-black)" }}
                                >
                                  Option B
                                </h4>
                                <p style={{ color: "var(--warm-gray)" }}>
                                  {question.config.optionB?.description ||
                                    "Description for option B"}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Survey Footer */}
              {questionnaire.questions.length > 0 && (
                <div
                  className="mt-8 border-t pt-8 text-center"
                  style={{ borderColor: "var(--light-gray)" }}
                >
                  <button
                    className="px-8 py-3 font-medium transition-colors hover:opacity-90"
                    style={{ backgroundColor: "var(--primary)", color: "var(--off-white)" }}
                    disabled
                  >
                    Submit Survey
                  </button>
                  <p className="mt-4 text-sm" style={{ color: "var(--warm-gray)" }}>
                    This is a preview - responses will not be recorded
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Question Suggestions Modal */}
      {showAISuggestions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="max-h-[80vh] w-full max-w-4xl overflow-y-auto border-2 shadow-lg"
            style={{
              backgroundColor: "var(--off-white)",
              borderColor: "var(--off-black)",
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between border-b-2 px-6 py-4"
              style={{ borderColor: "var(--light-gray)" }}
            >
              <div className="flex items-center space-x-3">
                <Sparkles size={24} style={{ color: "var(--primary)" }} />
                <h2 className="font-mono text-xl font-bold" style={{ color: "var(--off-black)" }}>
                  AI Question Suggestions
                </h2>
              </div>
              <button
                onClick={() => setShowAISuggestions(false)}
                className="transition-colors hover:opacity-75"
                style={{ color: "var(--warm-gray)" }}
              >
                ✕
              </button>
            </div>

            {/* Suggestions List */}
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm" style={{ color: "var(--warm-gray)" }}>
                  AI-generated question suggestions based on your questionnaire context. Click
                  &quot;Add&quot; to include a suggestion.
                </p>
              </div>

              <div className="space-y-4">
                {aiSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="border-2 p-4"
                    style={{
                      backgroundColor: "var(--off-white)",
                      borderColor: "var(--light-gray)",
                    }}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center space-x-2">
                          <span
                            className="px-2 py-1 font-mono text-xs"
                            style={{
                              backgroundColor: "var(--primary)",
                              color: "var(--off-white)",
                            }}
                          >
                            {suggestion.type}
                          </span>
                          <span
                            className="px-2 py-1 font-mono text-xs"
                            style={{
                              backgroundColor: "var(--light-gray)",
                              color: "var(--off-black)",
                            }}
                          >
                            AI Generated
                          </span>
                        </div>
                        <h4 className="mb-2 font-medium" style={{ color: "var(--off-black)" }}>
                          {suggestion.title}
                        </h4>
                        {suggestion.description && (
                          <p className="mb-2 text-sm" style={{ color: "var(--warm-gray)" }}>
                            {suggestion.description}
                          </p>
                        )}
                        {suggestion.reasoning && (
                          <p className="text-xs" style={{ color: "var(--warm-gray)" }}>
                            <strong>AI Reasoning:</strong> {suggestion.reasoning}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          addAISuggestionToQuestionnaire(suggestion);
                          setShowAISuggestions(false);
                        }}
                        className="ml-4 px-4 py-2 font-mono text-sm font-medium transition-colors hover:opacity-90"
                        style={{
                          backgroundColor: "var(--off-black)",
                          color: "var(--off-white)",
                        }}
                      >
                        Add Question
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {aiSuggestions.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm" style={{ color: "var(--warm-gray)" }}>
                    No suggestions generated. Try adding a questionnaire title and description
                    first.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Question Improvement Modal */}
      {showQuestionImprovement && questionImprovement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="max-h-[80vh] w-full max-w-4xl overflow-y-auto border-2 shadow-lg"
            style={{
              backgroundColor: "var(--off-white)",
              borderColor: "var(--off-black)",
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between border-b-2 px-6 py-4"
              style={{ borderColor: "var(--light-gray)" }}
            >
              <div className="flex items-center space-x-3">
                <Lightbulb size={24} style={{ color: "var(--primary)" }} />
                <h2 className="font-mono text-xl font-bold" style={{ color: "var(--off-black)" }}>
                  AI Question Improvement
                </h2>
              </div>
              <button
                onClick={() => setShowQuestionImprovement(false)}
                className="transition-colors hover:opacity-75"
                style={{ color: "var(--warm-gray)" }}
              >
                ✕
              </button>
            </div>

            {/* Improvement Content */}
            <div className="p-6">
              <div className="mb-6">
                <h3
                  className="mb-3 font-mono text-lg font-bold"
                  style={{ color: "var(--off-black)" }}
                >
                  Original Question
                </h3>
                <div
                  className="border-2 p-4"
                  style={{
                    backgroundColor: "var(--light-gray)",
                    borderColor: "var(--warm-gray)",
                  }}
                >
                  <p className="font-medium" style={{ color: "var(--off-black)" }}>
                    {questionImprovement.original.title}
                  </p>
                  {questionImprovement.original.description && (
                    <p className="mt-2 text-sm" style={{ color: "var(--warm-gray)" }}>
                      {questionImprovement.original.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3
                  className="mb-3 font-mono text-lg font-bold"
                  style={{ color: "var(--off-black)" }}
                >
                  AI-Improved Question
                </h3>
                <div
                  className="border-2 p-4"
                  style={{
                    backgroundColor: "var(--off-white)",
                    borderColor: "var(--primary)",
                  }}
                >
                  <p className="font-medium" style={{ color: "var(--off-black)" }}>
                    {questionImprovement.improved.title}
                  </p>
                  {questionImprovement.improved.description && (
                    <p className="mt-2 text-sm" style={{ color: "var(--warm-gray)" }}>
                      {questionImprovement.improved.description}
                    </p>
                  )}
                </div>
              </div>

              {questionImprovement.analysis.summary && (
                <div className="mb-6">
                  <h4
                    className="mb-2 font-mono text-sm font-bold"
                    style={{ color: "var(--off-black)" }}
                  >
                    Improvement Summary
                  </h4>
                  <p className="text-sm" style={{ color: "var(--warm-gray)" }}>
                    {questionImprovement.analysis.summary}
                  </p>
                </div>
              )}

              {questionImprovement.analysis.improvements.length > 0 && (
                <div className="mb-6">
                  <h4
                    className="mb-3 font-mono text-sm font-bold"
                    style={{ color: "var(--off-black)" }}
                  >
                    Specific Improvements
                  </h4>
                  <div className="space-y-3">
                    {questionImprovement.analysis.improvements.map((improvement, index: number) => (
                      <div
                        key={index}
                        className="border-2 p-3"
                        style={{
                          backgroundColor: "var(--off-white)",
                          borderColor: "var(--light-gray)",
                        }}
                      >
                        <div className="mb-2">
                          <span
                            className="px-2 py-1 font-mono text-xs font-medium"
                            style={{
                              backgroundColor: "var(--primary)",
                              color: "var(--off-white)",
                            }}
                          >
                            {improvement.area}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: "var(--off-black)" }}>
                          <strong>Before:</strong> {improvement.before}
                        </p>
                        <p className="text-sm" style={{ color: "var(--off-black)" }}>
                          <strong>After:</strong> {improvement.after}
                        </p>
                        <p className="text-xs" style={{ color: "var(--warm-gray)" }}>
                          <strong>Why:</strong> {improvement.reasoning}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowQuestionImprovement(false)}
                  className="flex-1 px-6 py-3 font-mono text-sm transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: "var(--warm-gray)",
                    color: "var(--off-white)",
                  }}
                >
                  Keep Original
                </button>
                <button
                  onClick={applyQuestionImprovement}
                  className="flex-1 px-6 py-3 font-mono text-sm transition-colors hover:opacity-90"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--off-white)",
                  }}
                >
                  Apply Improvement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Smart Recommendations Modal */}
      {showSmartRecommendations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="max-h-[80vh] w-full max-w-4xl overflow-y-auto border-2 shadow-lg"
            style={{
              backgroundColor: "var(--off-white)",
              borderColor: "var(--off-black)",
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between border-b-2 px-6 py-4"
              style={{ borderColor: "var(--light-gray)" }}
            >
              <div className="flex items-center space-x-3">
                <Lightbulb size={24} style={{ color: "var(--primary)" }} />
                <h2 className="font-mono text-xl font-bold" style={{ color: "var(--off-black)" }}>
                  Smart Question Recommendations
                </h2>
              </div>
              <button
                onClick={() => setShowSmartRecommendations(false)}
                className="transition-colors hover:opacity-75"
                style={{ color: "var(--warm-gray)" }}
              >
                ✕
              </button>
            </div>

            {/* Recommendations Content */}
            <div className="p-6">
              {recommendationContext.basedOnQuestion && (
                <div className="mb-6">
                  <div
                    className="border-2 p-4"
                    style={{
                      backgroundColor: "var(--light-gray)",
                      borderColor: "var(--warm-gray)",
                    }}
                  >
                    <h3
                      className="mb-2 font-mono text-sm font-bold"
                      style={{ color: "var(--off-black)" }}
                    >
                      Context Question
                    </h3>
                    <p className="text-sm" style={{ color: "var(--warm-gray)" }}>
                      Based on: &quot;{recommendationContext.basedOnQuestion}&quot;
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm" style={{ color: "var(--warm-gray)" }}>
                  AI-powered recommendations based on your questionnaire flow and context. These
                  questions are designed to enhance your research goals.
                </p>
              </div>

              <div className="space-y-4">
                {smartRecommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="border-2 p-4"
                    style={{
                      backgroundColor: "var(--off-white)",
                      borderColor: "var(--light-gray)",
                    }}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center space-x-2">
                          <span
                            className="px-2 py-1 font-mono text-xs"
                            style={{
                              backgroundColor: "var(--primary)",
                              color: "var(--off-white)",
                            }}
                          >
                            {recommendation.type}
                          </span>
                          <span
                            className={`px-2 py-1 font-mono text-xs ${
                              recommendation.priority === "high"
                                ? "bg-red-500"
                                : recommendation.priority === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                            style={{ color: "var(--off-white)" }}
                          >
                            {recommendation.priority} priority
                          </span>
                          <span
                            className="px-2 py-1 font-mono text-xs"
                            style={{
                              backgroundColor: "var(--light-gray)",
                              color: "var(--off-black)",
                            }}
                          >
                            {recommendation.category}
                          </span>
                        </div>
                        <h4 className="mb-2 font-medium" style={{ color: "var(--off-black)" }}>
                          {recommendation.title}
                        </h4>
                        {recommendation.reasoning && (
                          <p className="text-xs" style={{ color: "var(--warm-gray)" }}>
                            <strong>Why this fits:</strong> {recommendation.reasoning}
                          </p>
                        )}
                      </div>
                      <div className="ml-4 flex flex-col space-y-2">
                        <button
                          onClick={() => {
                            addRecommendedQuestion(
                              recommendation,
                              recommendationContext.insertPosition
                            );
                            setShowSmartRecommendations(false);
                          }}
                          className="px-4 py-2 font-mono text-sm font-medium transition-colors hover:opacity-90"
                          style={{
                            backgroundColor: "var(--off-black)",
                            color: "var(--off-white)",
                          }}
                        >
                          Add Here
                        </button>
                        <button
                          onClick={() => {
                            addRecommendedQuestion(recommendation);
                            setShowSmartRecommendations(false);
                          }}
                          className="px-4 py-2 font-mono text-sm font-medium transition-colors hover:opacity-90"
                          style={{
                            backgroundColor: "var(--warm-gray)",
                            color: "var(--off-white)",
                          }}
                        >
                          Add to End
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {smartRecommendations.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm" style={{ color: "var(--warm-gray)" }}>
                    No recommendations available. Add more questions to get better suggestions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Option Generation Modal */}
      {showOptionGeneration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="max-h-[80vh] w-full max-w-3xl overflow-y-auto border-2 shadow-lg"
            style={{
              backgroundColor: "var(--off-white)",
              borderColor: "var(--off-black)",
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between border-b-2 px-6 py-4"
              style={{ borderColor: "var(--light-gray)" }}
            >
              <div className="flex items-center space-x-3">
                <Sparkles size={24} style={{ color: "var(--primary)" }} />
                <h2 className="font-mono text-xl font-bold" style={{ color: "var(--off-black)" }}>
                  AI-Generated Options
                </h2>
              </div>
              <button
                onClick={() => setShowOptionGeneration(false)}
                className="transition-colors hover:opacity-75"
                style={{ color: "var(--warm-gray)" }}
              >
                ✕
              </button>
            </div>

            {/* Generated Options */}
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm" style={{ color: "var(--warm-gray)" }}>
                  AI-generated options for your question. Select the options you want to use and
                  click &quot;Apply Selected&quot;.
                </p>
              </div>

              <div className="space-y-3">
                {generatedOptions.map((option, _index) => (
                  <div
                    key={option.id}
                    className="border-2 p-4"
                    style={{
                      backgroundColor: "var(--off-white)",
                      borderColor: "var(--light-gray)",
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <input type="checkbox" checked={true} readOnly className="mt-1" />
                      <div className="flex-1">
                        <div
                          className="font-mono text-sm font-medium"
                          style={{ color: "var(--off-black)" }}
                        >
                          {option.text}
                        </div>
                        {option.description && (
                          <div className="mt-1 text-xs" style={{ color: "var(--warm-gray)" }}>
                            {option.description}
                          </div>
                        )}
                        {option.reasoning && (
                          <div className="mt-2 text-xs" style={{ color: "var(--primary)" }}>
                            <strong>Why this option:</strong> {option.reasoning}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {generatedOptions.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm" style={{ color: "var(--warm-gray)" }}>
                    No options generated. Please try again.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowOptionGeneration(false)}
                  className="px-4 py-2 font-mono text-sm transition-colors"
                  style={{
                    backgroundColor: "var(--warm-gray)",
                    color: "var(--off-white)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => applyGeneratedOptions(generatedOptions)}
                  disabled={generatedOptions.length === 0}
                  className="px-4 py-2 font-mono text-sm transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--off-white)",
                  }}
                >
                  Apply All Options
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Template Generator Modal */}
      {showTemplateGenerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="max-h-[80vh] w-full max-w-4xl overflow-y-auto border-2 shadow-lg"
            style={{
              backgroundColor: "var(--off-white)",
              borderColor: "var(--off-black)",
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between border-b-2 px-6 py-4"
              style={{ borderColor: "var(--light-gray)" }}
            >
              <div className="flex items-center space-x-3">
                <Wand2 size={24} style={{ color: "var(--primary)" }} />
                <h2 className="font-mono text-xl font-bold" style={{ color: "var(--off-black)" }}>
                  AI Template Generator
                </h2>
              </div>
              <button
                onClick={() => setShowTemplateGenerator(false)}
                className="transition-colors hover:opacity-75"
                style={{ color: "var(--warm-gray)" }}
              >
                ✕
              </button>
            </div>

            {/* Template Generator Form */}
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm" style={{ color: "var(--warm-gray)" }}>
                  Generate a complete questionnaire template tailored to your research goals using
                  AI.
                </p>
              </div>

              <TemplateGeneratorForm
                onGenerate={generateSmartTemplate}
                isGenerating={isGeneratingTemplate}
                onCancel={() => setShowTemplateGenerator(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Generated Template Preview Modal */}
      {generatedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="max-h-[80vh] w-full max-w-5xl overflow-y-auto border-2 shadow-lg"
            style={{
              backgroundColor: "var(--off-white)",
              borderColor: "var(--off-black)",
            }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between border-b-2 px-6 py-4"
              style={{ borderColor: "var(--light-gray)" }}
            >
              <div className="flex items-center space-x-3">
                <Wand2 size={24} style={{ color: "var(--primary)" }} />
                <div>
                  <h2 className="font-mono text-xl font-bold" style={{ color: "var(--off-black)" }}>
                    Generated Template Preview
                  </h2>
                  <p className="text-sm" style={{ color: "var(--warm-gray)" }}>
                    {generatedTemplate.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setGeneratedTemplate(null)}
                className="transition-colors hover:opacity-75"
                style={{ color: "var(--warm-gray)" }}
              >
                ✕
              </button>
            </div>

            {/* Template Preview */}
            <div className="p-6">
              <div className="mb-6">
                <div className="mb-4">
                  <h3 className="font-mono text-lg font-bold" style={{ color: "var(--off-black)" }}>
                    Template Details
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: "var(--warm-gray)" }}>
                    {generatedTemplate.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong style={{ color: "var(--off-black)" }}>Target Audience:</strong>
                    <span style={{ color: "var(--warm-gray)" }}>
                      {" "}
                      {generatedTemplate.targetAudience}
                    </span>
                  </div>
                  <div>
                    <strong style={{ color: "var(--off-black)" }}>Estimated Time:</strong>
                    <span style={{ color: "var(--warm-gray)" }}>
                      {" "}
                      {generatedTemplate.estimatedTime}
                    </span>
                  </div>
                  <div>
                    <strong style={{ color: "var(--off-black)" }}>Question Count:</strong>
                    <span style={{ color: "var(--warm-gray)" }}>
                      {" "}
                      {generatedTemplate.questions.length}
                    </span>
                  </div>
                  <div>
                    <strong style={{ color: "var(--off-black)" }}>Category:</strong>
                    <span style={{ color: "var(--warm-gray)" }}> {generatedTemplate.category}</span>
                  </div>
                </div>
              </div>

              {/* Questions Preview */}
              <div className="mb-6">
                <h3
                  className="mb-4 font-mono text-lg font-bold"
                  style={{ color: "var(--off-black)" }}
                >
                  Questions ({generatedTemplate.questions.length})
                </h3>
                <div className="space-y-4">
                  {generatedTemplate.questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="border-2 p-4"
                      style={{
                        backgroundColor: "var(--off-white)",
                        borderColor: "var(--light-gray)",
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center space-x-2">
                            <span
                              className="font-mono text-xs"
                              style={{
                                backgroundColor: "var(--primary)",
                                color: "var(--off-white)",
                                padding: "0.25rem 0.5rem",
                              }}
                            >
                              {index + 1}
                            </span>
                            <span
                              className="font-mono text-xs"
                              style={{
                                backgroundColor: "var(--warm-gray)",
                                color: "var(--off-white)",
                                padding: "0.25rem 0.5rem",
                              }}
                            >
                              {question.questionType}
                            </span>
                            {question.isRequired && (
                              <span
                                className="font-mono text-xs"
                                style={{
                                  backgroundColor: "var(--accent)",
                                  color: "var(--off-white)",
                                  padding: "0.25rem 0.5rem",
                                }}
                              >
                                Required
                              </span>
                            )}
                          </div>
                          <h4
                            className="mb-2 font-mono text-sm font-medium"
                            style={{ color: "var(--off-black)" }}
                          >
                            {question.title}
                          </h4>
                          {question.description && (
                            <p className="mb-2 text-xs" style={{ color: "var(--warm-gray)" }}>
                              {question.description}
                            </p>
                          )}
                          {question.bestPracticeNote && (
                            <p className="text-xs italic" style={{ color: "var(--primary)" }}>
                              💡 {question.bestPracticeNote}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Practices */}
              {generatedTemplate.bestPractices.length > 0 && (
                <div className="mb-6">
                  <h3
                    className="mb-4 font-mono text-lg font-bold"
                    style={{ color: "var(--off-black)" }}
                  >
                    Best Practices
                  </h3>
                  <ul className="space-y-2">
                    {generatedTemplate.bestPractices.map((practice, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <span style={{ color: "var(--primary)" }}>•</span>
                        <span style={{ color: "var(--warm-gray)" }}>{practice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setGeneratedTemplate(null)}
                  className="px-4 py-2 font-mono text-sm transition-colors"
                  style={{
                    backgroundColor: "var(--warm-gray)",
                    color: "var(--off-white)",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={applyGeneratedTemplate}
                  className="px-4 py-2 font-mono text-sm transition-colors"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--off-white)",
                  }}
                >
                  Apply Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
