"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { QuestionnaireTemplate } from "@/lib/questionnaire-templates-detailed";

interface Question {
  id: string;
  type: string;
  title: string;
  description?: string;
  config: Record<string, unknown>;
  required: boolean;
}

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
          <div className="font-mono text-sm font-medium" style={{ color: "var(--off-black)" }}>
            A/B Test Options
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

export default function NewQuestionnairePage() {
  const searchParams = useSearchParams();
  const [questionnaire, setQuestionnaire] = useState({
    title: "",
    description: "",
    category: "research",
    questions: [] as Question[],
  });

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

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

  const addQuestion = (type: string) => {
    // Initialize with default config based on question type
    let defaultConfig = {};
    switch (type) {
      case "binary":
        defaultConfig = {
          optionA: { id: "a", text: "Yes" },
          optionB: { id: "b", text: "No" },
        };
        break;
      case "multi-choice":
        defaultConfig = {
          options: [
            { id: "opt1", text: "Option 1" },
            { id: "opt2", text: "Option 2" },
          ],
          maxSelections: 1,
        };
        break;
      case "rating-scale":
        defaultConfig = {
          scale: 5,
          variant: "numbers",
          labels: { min: "Poor", max: "Excellent" },
        };
        break;
      case "text-response":
        defaultConfig = {
          maxLength: 500,
          placeholder: "Enter your response...",
          multiline: false,
        };
        break;
      case "ranking":
        defaultConfig = {
          items: [
            { id: "item1", text: "Item 1" },
            { id: "item2", text: "Item 2" },
          ],
        };
        break;
      case "ab-test":
        defaultConfig = {
          optionA: { title: "Option A", description: "Description A" },
          optionB: { title: "Option B", description: "Description B" },
        };
        break;
    }

    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type,
      title: "New Question",
      required: true,
      config: defaultConfig,
    };
    setEditingQuestion(newQuestion);
    setShowQuestionModal(true);
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

      {/* Terminal-style Header */}
      <div
        className="border-b-2"
        style={{
          backgroundColor: "var(--off-black)",
          borderColor: "var(--off-black)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <div className="mb-2 font-mono text-sm" style={{ color: "var(--primary)" }}>
                $ admin/questionnaires/new --create
              </div>
              <h1
                className="font-mono text-3xl font-bold uppercase tracking-wide"
                style={{ color: "var(--off-white)" }}
              >
                Create Questionnaire
              </h1>
              <p className="mt-1 font-mono text-sm" style={{ color: "var(--warm-gray)" }}>
                Build a multi-question survey for your research
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/admin/questionnaires/templates"
                className="inline-flex items-center px-4 py-2 font-mono text-sm font-medium transition-colors hover:opacity-90"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--off-white)",
                }}
              >
                Use Template
              </Link>
              <button
                type="button"
                className="px-4 py-2 font-mono text-sm font-medium transition-colors hover:opacity-90"
                style={{
                  backgroundColor: "var(--warm-gray)",
                  color: "var(--off-white)",
                }}
                onClick={() => {
                  /* Save as draft */
                }}
              >
                Save Draft
              </button>
              <button
                type="button"
                className="px-4 py-2 font-mono text-sm font-medium transition-colors hover:opacity-90"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--off-white)",
                }}
                onClick={() => {
                  /* Publish */
                }}
              >
                Publish
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
                  <h2
                    className="font-mono text-lg font-medium"
                    style={{ color: "var(--off-black)" }}
                  >
                    Questions ({questionnaire.questions.length})
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowQuestionModal(true)}
                    className="px-4 py-2 font-mono text-sm font-medium transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--off-white)",
                    }}
                  >
                    Add Question
                  </button>
                </div>
              </div>

              <div className="p-6">
                {questionnaire.questions.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="mb-4 text-6xl text-gray-400">📝</div>
                    <h3 className="mb-2 text-lg font-medium text-gray-900">No questions yet</h3>
                    <p className="mb-4 text-gray-500">Add your first question to get started</p>
                    <button
                      onClick={() => setShowQuestionModal(true)}
                      className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                    >
                      Add First Question
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questionnaire.questions.map((question, index) => (
                      <div key={question.id} className="rounded-lg border border-gray-200 p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center space-x-2">
                              <span className="rounded bg-gray-100 px-2 py-1 text-sm font-medium text-gray-700">
                                Q{index + 1}
                              </span>
                              <span className="rounded bg-blue-100 px-2 py-1 text-sm text-blue-700">
                                {questionTypes.find((t) => t.id === question.type)?.name}
                              </span>
                              {question.required && (
                                <span className="rounded bg-red-100 px-2 py-1 text-sm text-red-700">
                                  Required
                                </span>
                              )}
                            </div>
                            <h3 className="font-medium text-gray-900">{question.title}</h3>
                            {question.description && (
                              <p className="mt-1 text-sm text-gray-500">{question.description}</p>
                            )}
                          </div>
                          <div className="ml-4 flex space-x-2">
                            <button
                              onClick={() => moveQuestion(question.id, "up")}
                              disabled={index === 0}
                              className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveQuestion(question.id, "down")}
                              disabled={index === questionnaire.questions.length - 1}
                              className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => duplicateQuestion(question.id)}
                              className="text-green-600 hover:text-green-800"
                              title="Duplicate question"
                            >
                              📋
                            </button>
                            <button
                              onClick={() => {
                                setEditingQuestion(question);
                                setShowQuestionModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit question"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => removeQuestion(question.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete question"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
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
                <button className="mt-4 w-full rounded-lg border border-green-200 bg-green-50 p-3 text-green-700 transition-colors hover:bg-green-100">
                  Preview Full Survey
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}
