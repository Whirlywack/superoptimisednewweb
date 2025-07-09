"use client";

import { useState } from "react";
import Link from "next/link";

interface Question {
  id: string;
  type: string;
  title: string;
  description?: string;
  config: Record<string, unknown>;
  required: boolean;
}

export default function NewQuestionnairePage() {
  const [questionnaire, setQuestionnaire] = useState({
    title: "",
    description: "",
    category: "research",
    questions: [] as Question[]
  });

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const questionTypes = [
    { id: "binary", name: "Yes/No", description: "Simple binary choice" },
    { id: "multi-choice", name: "Multiple Choice", description: "Select one or multiple options" },
    { id: "rating-scale", name: "Rating Scale", description: "1-10 numerical rating" },
    { id: "text-response", name: "Text Response", description: "Open-ended text input" },
    { id: "ranking", name: "Ranking", description: "Drag to reorder items" },
    { id: "ab-test", name: "A/B Test", description: "Compare two options" }
  ];

  const addQuestion = (type: string) => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type,
      title: "New Question",
      required: true,
      config: {}
    };
    setEditingQuestion(newQuestion);
    setShowQuestionModal(true);
  };

  const saveQuestion = (question: Question) => {
    if (questionnaire.questions.find(q => q.id === question.id)) {
      // Update existing
      setQuestionnaire(prev => ({
        ...prev,
        questions: prev.questions.map(q => q.id === question.id ? question : q)
      }));
    } else {
      // Add new
      setQuestionnaire(prev => ({
        ...prev,
        questions: [...prev.questions, question]
      }));
    }
    setShowQuestionModal(false);
    setEditingQuestion(null);
  };

  const removeQuestion = (id: string) => {
    setQuestionnaire(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  const moveQuestion = (id: string, direction: 'up' | 'down') => {
    const questions = [...questionnaire.questions];
    const index = questions.findIndex(q => q.id === id);
    if (direction === 'up' && index > 0) {
      [questions[index], questions[index - 1]] = [questions[index - 1], questions[index]];
    } else if (direction === 'down' && index < questions.length - 1) {
      [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]];
    }
    setQuestionnaire(prev => ({ ...prev, questions }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <nav className="flex space-x-4 text-sm text-gray-500 mb-2">
                <Link href="/admin" className="hover:text-gray-700">Admin</Link>
                <span>/</span>
                <Link href="/admin/questionnaires" className="hover:text-gray-700">Questionnaires</Link>
                <span>/</span>
                <span className="text-gray-900">New</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">Create Questionnaire</h1>
              <p className="mt-1 text-sm text-gray-500">Build a multi-question survey for your research</p>
            </div>
            <div className="flex space-x-4">
              <button 
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                onClick={() => {/* Save as draft */}}
              >
                Save Draft
              </button>
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => {/* Publish */}}
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Questionnaire Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Questionnaire Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={questionnaire.title}
                    onChange={(e) => setQuestionnaire(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Product Feature Research Survey"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={questionnaire.description}
                    onChange={(e) => setQuestionnaire(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of what this questionnaire is about..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={questionnaire.category}
                    onChange={(e) => setQuestionnaire(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">
                    Questions ({questionnaire.questions.length})
                  </h2>
                  <button
                    onClick={() => setShowQuestionModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Question
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {questionnaire.questions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
                    <p className="text-gray-500 mb-4">Add your first question to get started</p>
                    <button
                      onClick={() => setShowQuestionModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add First Question
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questionnaire.questions.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium">
                                Q{index + 1}
                              </span>
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                                {questionTypes.find(t => t.id === question.type)?.name}
                              </span>
                              {question.required && (
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                                  Required
                                </span>
                              )}
                            </div>
                            <h3 className="font-medium text-gray-900">{question.title}</h3>
                            {question.description && (
                              <p className="text-sm text-gray-500 mt-1">{question.description}</p>
                            )}
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => moveQuestion(question.id, 'up')}
                              disabled={index === 0}
                              className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveQuestion(question.id, 'down')}
                              disabled={index === questionnaire.questions.length - 1}
                              className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              ↓
                            </button>
                            <button
                              onClick={() => {
                                setEditingQuestion(question);
                                setShowQuestionModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => removeQuestion(question.id)}
                              className="text-red-600 hover:text-red-800"
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
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Add Question</h2>
              </div>
              <div className="p-6 space-y-3">
                {questionTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => addQuestion(type.id)}
                    className="w-full text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-3 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{type.name}</div>
                    <div className="text-sm text-gray-500">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Preview</h2>
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 space-y-2">
                  <div><strong>Title:</strong> {questionnaire.title || "Untitled Questionnaire"}</div>
                  <div><strong>Questions:</strong> {questionnaire.questions.length}</div>
                  <div><strong>Estimated time:</strong> {Math.ceil(questionnaire.questions.length * 0.5)} min</div>
                </div>
                <button className="w-full mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 hover:bg-green-100 transition-colors">
                  Preview Full Survey
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Modal (simplified for now) */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingQuestion?.id.startsWith('q_') ? 'Add Question' : 'Edit Question'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                <input
                  type="text"
                  value={editingQuestion?.title || ""}
                  onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter your question..."
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingQuestion?.required || false}
                    onChange={(e) => setEditingQuestion(prev => prev ? { ...prev, required: e.target.checked } : null)}
                    className="mr-2"
                  />
                  Required question
                </label>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowQuestionModal(false);
                  setEditingQuestion(null);
                }}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => editingQuestion && saveQuestion(editingQuestion)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
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