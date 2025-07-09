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
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type,
      title: "New Question",
      required: true,
      config: {},
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
    <div className="min-h-screen bg-gray-50">
      {/* Loading Template State */}
      {isLoadingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
          <div className="text-center">
            <div className="mx-auto mb-4 size-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading template...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <nav className="mb-2 flex space-x-4 text-sm text-gray-500">
                <Link href="/admin" className="hover:text-gray-700">
                  Admin
                </Link>
                <span>/</span>
                <Link href="/admin/questionnaires" className="hover:text-gray-700">
                  Questionnaires
                </Link>
                <span>/</span>
                <span className="text-gray-900">New</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">Create Questionnaire</h1>
              <p className="mt-1 text-sm text-gray-500">
                Build a multi-question survey for your research
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/admin/questionnaires/templates"
                className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
              >
                📋 Use Template
              </Link>
              <button
                className="rounded-md bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
                onClick={() => {
                  /* Save as draft */
                }}
              >
                Save Draft
              </button>
              <button
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
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
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Questionnaire Details</h2>
                {searchParams.get("template") && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    📋 From Template
                  </span>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Title *</label>
                  <input
                    type="text"
                    value={questionnaire.title}
                    onChange={(e) =>
                      setQuestionnaire((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Product Feature Research Survey"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={questionnaire.description}
                    onChange={(e) =>
                      setQuestionnaire((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of what this questionnaire is about..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={questionnaire.category}
                    onChange={(e) =>
                      setQuestionnaire((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="rounded-lg bg-white shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">
                    Questions ({questionnaire.questions.length})
                  </h2>
                  <button
                    onClick={() => setShowQuestionModal(true)}
                    className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
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

      {/* Question Modal (simplified for now) */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              {editingQuestion?.id.startsWith("q_") ? "Add Question" : "Edit Question"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Question Text
                </label>
                <input
                  type="text"
                  value={editingQuestion?.title || ""}
                  onChange={(e) =>
                    setEditingQuestion((prev) => (prev ? { ...prev, title: e.target.value } : null))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Enter your question..."
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingQuestion?.required || false}
                    onChange={(e) =>
                      setEditingQuestion((prev) =>
                        prev ? { ...prev, required: e.target.checked } : null
                      )
                    }
                    className="mr-2"
                  />
                  Required question
                </label>
              </div>
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => {
                  setShowQuestionModal(false);
                  setEditingQuestion(null);
                }}
                className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => editingQuestion && saveQuestion(editingQuestion)}
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Save Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
