"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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

export default function NewQuestionnairePage() {
  const searchParams = useSearchParams();
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
                <Link href="/admin/questionnaires" className="hover:opacity-75">
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
                className="px-4 py-2 text-sm font-medium transition-colors hover:opacity-90"
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
                className="px-4 py-2 text-sm font-medium transition-colors hover:opacity-90"
                style={{
                  backgroundColor: "var(--off-black)",
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
                    onClick={startNewQuestion}
                    className="px-4 py-2 font-mono text-sm font-medium transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: "var(--off-black)",
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
                    {questionnaire.questions.map((question, index) => {
                      const questionType = questionTypes.find((t) => t.id === question.type);
                      const QuestionIcon = questionType?.icon || Type;

                      return (
                        <div
                          key={question.id}
                          className="overflow-hidden border-2 shadow-sm transition-all duration-200 hover:shadow-md"
                          style={{
                            backgroundColor: "var(--off-white)",
                            borderColor: "var(--light-gray)",
                          }}
                        >
                          <div className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4">
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
                                      Q{index + 1}
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
                                <button
                                  className="p-1 transition-colors hover:opacity-75"
                                  style={{ color: "var(--warm-gray)" }}
                                  title="Drag to reorder"
                                >
                                  <GripVertical size={16} />
                                </button>
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
                <button className="mt-4 w-full rounded-lg border border-green-200 bg-green-50 p-3 text-green-700 transition-colors hover:bg-green-100">
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
    </div>
  );
}
