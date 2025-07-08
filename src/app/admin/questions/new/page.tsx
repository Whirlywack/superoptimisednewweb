"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc/client";

/**
 * Admin New Question Form
 * Terminal-style interface for creating research questions
 * Supports all question types with dynamic configuration
 */

type QuestionType =
  | "binary"
  | "multi-choice"
  | "rating-scale"
  | "text-response"
  | "ranking"
  | "ab-test";

interface BinaryConfig {
  optionA: { id: string; text: string; description?: string };
  optionB: { id: string; text: string; description?: string };
}

interface MultiChoiceConfig {
  options: Array<{ id: string; text: string }>;
  maxSelections: number;
}

interface RatingConfig {
  scale: number;
  variant: string;
  labels?: { min: string; max: string };
}

interface TextConfig {
  maxLength: number;
  placeholder: string;
  multiline?: boolean;
}

interface RankingConfig {
  items: Array<{ id: string; text: string }>;
}

interface ABTestConfig {
  optionA: { title: string; description: string };
  optionB: { title: string; description: string };
}

type QuestionConfig =
  | BinaryConfig
  | MultiChoiceConfig
  | RatingConfig
  | TextConfig
  | RankingConfig
  | ABTestConfig;

interface QuestionData {
  title: string;
  description: string;
  questionType: QuestionType;
  category: string;
  isActive: boolean;
  config: QuestionConfig;
}

export default function NewQuestionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<QuestionData>({
    title: "",
    description: "",
    questionType: "binary",
    category: "general",
    isActive: false,
    config: {},
  });

  const [isCreating, setIsCreating] = useState(false);

  const createQuestionMutation = api.admin.createQuestion.useMutation({
    onSuccess: (data) => {
      console.log("Question created successfully:", data);
      router.push("/admin/questions");
    },
    onError: (error) => {
      console.error("Failed to create question:", error);
      setIsCreating(false);
    },
  });

  // Configure question-specific options based on type
  const updateQuestionConfig = (type: QuestionType) => {
    let defaultConfig: QuestionConfig;

    switch (type) {
      case "binary":
        defaultConfig = {
          optionA: { id: "a", text: "Option A", description: "" },
          optionB: { id: "b", text: "Option B", description: "" },
        } as BinaryConfig;
        break;
      case "multi-choice":
        defaultConfig = {
          options: [
            { id: "opt1", text: "Option 1" },
            { id: "opt2", text: "Option 2" },
          ],
          maxSelections: 1,
        } as MultiChoiceConfig;
        break;
      case "rating-scale":
        defaultConfig = {
          scale: 10,
          variant: "numbers",
          labels: { min: "Poor", max: "Excellent" },
        } as RatingConfig;
        break;
      case "text-response":
        defaultConfig = {
          maxLength: 500,
          placeholder: "Enter your response...",
          multiline: true,
        } as TextConfig;
        break;
      case "ranking":
        defaultConfig = {
          items: [
            { id: "item1", text: "Item 1" },
            { id: "item2", text: "Item 2" },
          ],
        } as RankingConfig;
        break;
      case "ab-test":
        defaultConfig = {
          optionA: { title: "Version A", description: "Description A" },
          optionB: { title: "Version B", description: "Description B" },
        } as ABTestConfig;
        break;
    }

    setFormData((prev) => ({
      ...prev,
      questionType: type,
      config: defaultConfig,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await createQuestionMutation.mutateAsync({
        title: formData.title,
        description: formData.description || "",
        questionType: formData.questionType,
        config: formData.config,
        category: formData.category,
        isActive: formData.isActive,
        displayOrder: 0,
      });
    } catch (error) {
      // Error is handled in the mutation's onError callback
      console.error("Failed to create question:", error);
      setIsCreating(false);
    }
  };

  const updateConfig = (key: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      config: { ...prev.config, [key]: value },
    }));
  };

  const addOption = (type: "options" | "items") => {
    const currentItems =
      type === "options"
        ? (formData.config as MultiChoiceConfig).options || []
        : (formData.config as RankingConfig).items || [];
    const newId =
      type === "options" ? `opt${currentItems.length + 1}` : `item${currentItems.length + 1}`;
    const newItem = {
      id: newId,
      text: `${type === "options" ? "Option" : "Item"} ${currentItems.length + 1}`,
    };

    updateConfig(type, [...currentItems, newItem]);
  };

  const removeOption = (type: "options" | "items", index: number) => {
    const currentItems =
      type === "options"
        ? (formData.config as MultiChoiceConfig).options || []
        : (formData.config as RankingConfig).items || [];
    updateConfig(
      type,
      currentItems.filter((_, i) => i !== index)
    );
  };

  const updateOption = (type: "options" | "items", index: number, field: string, value: string) => {
    const currentItems =
      type === "options"
        ? (formData.config as MultiChoiceConfig).options || []
        : (formData.config as RankingConfig).items || [];
    const updated = [...currentItems];
    updated[index] = { ...updated[index], [field]: value };
    updateConfig(type, updated);
  };

  return (
    <div className="font-mono">
      {/* Brutalist Factory Header */}
      <div
        className="border-b-2 border-off-black bg-off-black"
        style={{ padding: "var(--space-lg)" }}
      >
        <div className="space-y-4">
          <div className="font-mono text-sm text-green-400">
            $ cd /admin/questions/ && touch new-question.config
          </div>
          <div
            className="font-mono font-bold uppercase tracking-wide text-off-white"
            style={{ fontSize: "var(--text-hero)", lineHeight: "1.1" }}
          >
            QUESTION_FACTORY
          </div>
          <div className="space-y-1">
            <div className="font-mono text-sm text-warm-gray">
              factory.mode: INTERACTIVE_CONFIGURATION
            </div>
            <div className="font-mono text-sm text-warm-gray">
              question.types: {formData.questionType.toUpperCase()}
            </div>
            <div className="font-mono text-sm text-warm-gray">
              status: {formData.title ? "CONFIGURED" : "AWAITING_INPUT"}
            </div>
          </div>
        </div>
      </div>

      {/* Brutalist Configuration Interface */}
      <div className="bg-light-gray" style={{ padding: "var(--space-lg)" }}>
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-0">
          {/* Core Configuration Block */}
          <div className="border-2 border-off-black bg-white">
            <div
              className="border-b-2 border-off-black bg-off-black"
              style={{ padding: "var(--space-md)" }}
            >
              <div
                className="font-mono font-bold uppercase tracking-wide text-off-white"
                style={{ fontSize: "var(--text-lg)" }}
              >
                CORE_CONFIGURATION
              </div>
            </div>
            <div style={{ padding: "var(--space-lg)" }}>
              <div style={{ marginBottom: "var(--space-lg)" }}>
                <div style={{ marginBottom: "var(--space-md)" }}>
                  <label
                    className="block font-mono text-sm font-bold uppercase tracking-wide text-off-black"
                    style={{ marginBottom: "var(--space-xs)" }}
                  >
                    QUESTION_TITLE:
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full border-2 border-off-black bg-off-white font-mono text-sm text-off-black transition-all duration-200 placeholder:text-warm-gray focus:border-primary focus:outline-none"
                    style={{ padding: "var(--space-sm)" }}
                    placeholder="WHAT_SHOULD_USERS_DECIDE_ABOUT"
                    required
                  />
                </div>

                <div style={{ marginBottom: "var(--space-md)" }}>
                  <label
                    className="block font-mono text-sm font-bold uppercase tracking-wide text-off-black"
                    style={{ marginBottom: "var(--space-xs)" }}
                  >
                    DESCRIPTION:
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full resize-none border-2 border-off-black bg-off-white font-mono text-sm text-off-black transition-all duration-200 placeholder:text-warm-gray focus:border-primary focus:outline-none"
                    style={{ padding: "var(--space-sm)", height: "6rem" }}
                    placeholder="ADDITIONAL_CONTEXT_OR_INSTRUCTIONS"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6" style={{ marginBottom: "var(--space-md)" }}>
                  <div>
                    <label
                      className="block font-mono text-sm font-bold uppercase tracking-wide text-off-black"
                      style={{ marginBottom: "var(--space-xs)" }}
                    >
                      QUESTION_TYPE:
                    </label>
                    <select
                      value={formData.questionType}
                      onChange={(e) => updateQuestionConfig(e.target.value as QuestionType)}
                      className="w-full border-2 border-off-black bg-off-white font-mono text-sm text-off-black transition-all duration-200 focus:border-primary focus:outline-none"
                      style={{ padding: "var(--space-sm)" }}
                    >
                      <option value="binary">BINARY (YES/NO, A/B)</option>
                      <option value="multi-choice">MULTI_CHOICE (CHECKBOXES)</option>
                      <option value="rating-scale">RATING_SCALE (1-10, STARS)</option>
                      <option value="text-response">TEXT_RESPONSE (OPEN_TEXT)</option>
                      <option value="ranking">RANKING (DRAG_DROP)</option>
                      <option value="ab-test">AB_TEST (A/B_COMPARISON)</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="block font-mono text-sm font-bold uppercase tracking-wide text-off-black"
                      style={{ marginBottom: "var(--space-xs)" }}
                    >
                      CATEGORY:
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, category: e.target.value }))
                      }
                      className="w-full border-2 border-off-black bg-off-white font-mono text-sm text-off-black transition-all duration-200 focus:border-primary focus:outline-none"
                      style={{ padding: "var(--space-sm)" }}
                    >
                      <option value="general">GENERAL</option>
                      <option value="technical">TECHNICAL</option>
                      <option value="design">DESIGN</option>
                      <option value="business">BUSINESS</option>
                      <option value="research">RESEARCH</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                      }
                      className="size-5 border-2 border-off-black"
                    />
                    <span className="font-mono text-sm font-bold uppercase tracking-wide text-off-black">
                      ACTIVATE_IMMEDIATELY
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Question Type Specific Configuration */}
          <div className="border-2 border-off-black bg-white">
            <div className="border-b border-off-black bg-off-black p-4">
              <div className="font-mono text-sm text-off-white">
                {formData.questionType.toUpperCase()} CONFIGURATION
              </div>
            </div>
            <div className="space-y-6 p-6">
              {/* Binary Question Config */}
              {formData.questionType === "binary" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block font-mono text-sm text-off-black">
                        Option A:
                      </label>
                      <input
                        type="text"
                        value={(formData.config as BinaryConfig).optionA?.text || ""}
                        onChange={(e) =>
                          updateConfig("optionA", {
                            ...(formData.config as BinaryConfig).optionA,
                            text: e.target.value,
                          })
                        }
                        className="w-full border-2 border-off-black bg-off-white p-3 font-mono text-sm"
                        placeholder="First choice"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block font-mono text-sm text-off-black">
                        Option B:
                      </label>
                      <input
                        type="text"
                        value={(formData.config as BinaryConfig).optionB?.text || ""}
                        onChange={(e) =>
                          updateConfig("optionB", {
                            ...(formData.config as BinaryConfig).optionB,
                            text: e.target.value,
                          })
                        }
                        className="w-full border-2 border-off-black bg-off-white p-3 font-mono text-sm"
                        placeholder="Second choice"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Multi-Choice Config */}
              {formData.questionType === "multi-choice" && (
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="font-mono text-sm text-off-black">Options:</label>
                      <button
                        type="button"
                        onClick={() => addOption("options")}
                        className="bg-off-black px-3 py-1 font-mono text-xs text-off-white hover:bg-primary hover:text-off-black"
                      >
                        + add option
                      </button>
                    </div>
                    <div className="space-y-2">
                      {((formData.config as MultiChoiceConfig).options || []).map(
                        (option, index) => (
                          <div key={option.id} className="flex gap-2">
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) =>
                                updateOption("options", index, "text", e.target.value)
                              }
                              className="flex-1 border-2 border-off-black bg-off-white p-2 font-mono text-sm"
                              placeholder={`Option ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeOption("options", index)}
                              className="border-2 border-red-600 bg-white px-3 py-2 font-mono text-xs text-red-600 hover:bg-red-600 hover:text-white"
                            >
                              rm
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block font-mono text-sm text-off-black">
                      Max selections:
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={(formData.config as MultiChoiceConfig).maxSelections || 1}
                      onChange={(e) => updateConfig("maxSelections", parseInt(e.target.value))}
                      className="w-32 border-2 border-off-black bg-off-white p-2 font-mono text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Rating Scale Config */}
              {formData.questionType === "rating-scale" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block font-mono text-sm text-off-black">
                        Scale (1 to):
                      </label>
                      <input
                        type="number"
                        min="3"
                        max="10"
                        value={(formData.config as RatingConfig).scale || 10}
                        onChange={(e) => updateConfig("scale", parseInt(e.target.value))}
                        className="w-full border-2 border-off-black bg-off-white p-3 font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block font-mono text-sm text-off-black">Style:</label>
                      <select
                        value={(formData.config as RatingConfig).variant || "numbers"}
                        onChange={(e) => updateConfig("variant", e.target.value)}
                        className="w-full border-2 border-off-black bg-off-white p-3 font-mono text-sm"
                      >
                        <option value="numbers">Numbers</option>
                        <option value="stars">Stars</option>
                        <option value="emoji">Emoji</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Text Response Config */}
              {formData.questionType === "text-response" && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block font-mono text-sm text-off-black">
                      Max characters:
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="2000"
                      value={(formData.config as TextConfig).maxLength || 500}
                      onChange={(e) => updateConfig("maxLength", parseInt(e.target.value))}
                      className="w-32 border-2 border-off-black bg-off-white p-2 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-mono text-sm text-off-black">
                      Placeholder:
                    </label>
                    <input
                      type="text"
                      value={(formData.config as TextConfig).placeholder || ""}
                      onChange={(e) => updateConfig("placeholder", e.target.value)}
                      className="w-full border-2 border-off-black bg-off-white p-3 font-mono text-sm"
                      placeholder="Placeholder text..."
                    />
                  </div>
                </div>
              )}

              {/* Ranking Config */}
              {formData.questionType === "ranking" && (
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="font-mono text-sm text-off-black">Items to rank:</label>
                      <button
                        type="button"
                        onClick={() => addOption("items")}
                        className="bg-off-black px-3 py-1 font-mono text-xs text-off-white hover:bg-primary hover:text-off-black"
                      >
                        + add item
                      </button>
                    </div>
                    <div className="space-y-2">
                      {((formData.config as RankingConfig).items || []).map((item, index) => (
                        <div key={item.id} className="flex gap-2">
                          <div className="flex w-8 items-center justify-center bg-warm-gray font-mono text-xs text-off-white">
                            {index + 1}
                          </div>
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => updateOption("items", index, "text", e.target.value)}
                            className="flex-1 border-2 border-off-black bg-off-white p-2 font-mono text-sm"
                            placeholder={`Item ${index + 1}`}
                          />
                          <button
                            type="button"
                            onClick={() => removeOption("items", index)}
                            className="border-2 border-red-600 bg-white px-3 py-2 font-mono text-xs text-red-600 hover:bg-red-600 hover:text-white"
                          >
                            rm
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* A/B Test Config */}
              {formData.questionType === "ab-test" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block font-mono text-sm text-off-black">
                        Version A:
                      </label>
                      <input
                        type="text"
                        value={(formData.config as ABTestConfig).optionA?.title || ""}
                        onChange={(e) =>
                          updateConfig("optionA", {
                            ...(formData.config as ABTestConfig).optionA,
                            title: e.target.value,
                          })
                        }
                        className="mb-2 w-full border-2 border-off-black bg-off-white p-3 font-mono text-sm"
                        placeholder="Version A title"
                      />
                      <textarea
                        value={(formData.config as ABTestConfig).optionA?.description || ""}
                        onChange={(e) =>
                          updateConfig("optionA", {
                            ...(formData.config as ABTestConfig).optionA,
                            description: e.target.value,
                          })
                        }
                        className="h-20 w-full resize-none border-2 border-off-black bg-off-white p-3 font-mono text-sm"
                        placeholder="Description of version A"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block font-mono text-sm text-off-black">
                        Version B:
                      </label>
                      <input
                        type="text"
                        value={(formData.config as ABTestConfig).optionB?.title || ""}
                        onChange={(e) =>
                          updateConfig("optionB", {
                            ...(formData.config as ABTestConfig).optionB,
                            title: e.target.value,
                          })
                        }
                        className="mb-2 w-full border-2 border-off-black bg-off-white p-3 font-mono text-sm"
                        placeholder="Version B title"
                      />
                      <textarea
                        value={(formData.config as ABTestConfig).optionB?.description || ""}
                        onChange={(e) =>
                          updateConfig("optionB", {
                            ...(formData.config as ABTestConfig).optionB,
                            description: e.target.value,
                          })
                        }
                        className="h-20 w-full resize-none border-2 border-off-black bg-off-white p-3 font-mono text-sm"
                        placeholder="Description of version B"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="border-2 border-off-black bg-white">
            <div className="flex gap-4 p-6">
              <button
                type="submit"
                disabled={isCreating || !formData.title}
                className="bg-off-black px-6 py-3 font-mono text-sm text-off-white transition-colors hover:bg-primary hover:text-off-black disabled:bg-warm-gray disabled:text-light-gray"
              >
                {isCreating ? "[creating question...]" : "CREATE QUESTION"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/questions")}
                className="border-2 border-off-black bg-white px-6 py-3 font-mono text-sm text-off-black transition-colors hover:bg-light-gray"
              >
                CANCEL
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Preview */}
      <div className="border-t-2 border-off-black bg-off-white p-8">
        <div className="mb-4 font-mono text-sm text-warm-gray">
          {"// Preview mode - question will appear like this:"}
        </div>
        <div className="mx-auto max-w-2xl border-2 border-warm-gray bg-white p-6">
          <h2 className="font-mono text-lg font-bold text-off-black">
            {formData.title || "Question title..."}
          </h2>
          {formData.description && (
            <p className="mt-2 font-mono text-sm text-warm-gray">{formData.description}</p>
          )}
          <div className="mt-4 font-mono text-xs text-warm-gray">
            Type: {formData.questionType} • Category: {formData.category}
          </div>
        </div>
      </div>
    </div>
  );
}
