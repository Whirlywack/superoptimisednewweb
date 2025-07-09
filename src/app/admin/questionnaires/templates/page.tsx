"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  questionnaireTemplates,
  type QuestionnaireTemplate,
} from "@/lib/questionnaire-templates-detailed";

interface TemplatePreviewModalProps {
  template: QuestionnaireTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: QuestionnaireTemplate) => void;
}

function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
  onUseTemplate,
}: TemplatePreviewModalProps) {
  if (!isOpen || !template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Modal Header */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{template.title}</h2>
              <p className="mt-1 text-sm text-gray-500">{template.description}</p>
              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                <span>🕐 {template.estimatedTime}</span>
                <span>📝 {template.questions.length} questions</span>
                <span>👥 {template.targetAudience}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-2xl font-light text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="p-6">
            {/* Best Practices */}
            <div className="mb-6">
              <h3 className="mb-2 font-medium text-gray-900">Research Best Practices</h3>
              <ul className="space-y-1">
                {template.bestPractices.map((practice, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-600">
                    <span className="mr-2 text-green-500">✓</span>
                    {practice}
                  </li>
                ))}
              </ul>
            </div>

            {/* Questions Preview */}
            <div>
              <h3 className="mb-4 font-medium text-gray-900">
                Questions ({template.questions.length})
              </h3>
              <div className="space-y-4">
                {template.questions.map((question, index) => (
                  <div key={question.id} className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-2 flex items-center space-x-2">
                      <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                        Q{index + 1}
                      </span>
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                        {question.questionType}
                      </span>
                      {question.isRequired && (
                        <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-700">
                          Required
                        </span>
                      )}
                      {question.isLocked && (
                        <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                          Locked
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-900">{question.title}</h4>
                    {question.description && (
                      <p className="mt-1 text-sm text-gray-600">{question.description}</p>
                    )}
                    {question.bestPracticeNote && (
                      <p className="mt-2 text-xs italic text-blue-600">
                        💡 {question.bestPracticeNote}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={() => onUseTemplate(template)}
              className="rounded-md bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Use This Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TemplateGalleryPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    template: QuestionnaireTemplate | null;
  }>({ isOpen: false, template: null });

  const categories = [
    { id: "all", name: "All Templates", icon: "📋" },
    { id: "product-research", name: "Product Research", icon: "📊" },
    { id: "ux-research", name: "UX Research", icon: "🎨" },
    { id: "market-research", name: "Market Research", icon: "👥" },
    { id: "customer-satisfaction", name: "Customer Satisfaction", icon: "⭐" },
    { id: "feature-prioritization", name: "Feature Prioritization", icon: "🎯" },
  ];

  const filteredTemplates = questionnaireTemplates.filter((template) => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handlePreviewTemplate = (template: QuestionnaireTemplate) => {
    setPreviewModal({ isOpen: true, template });
  };

  const handleUseTemplate = (template: QuestionnaireTemplate) => {
    // Navigate to questionnaire builder with template data
    const templateData = encodeURIComponent(JSON.stringify(template));
    router.push(`/admin/questionnaires/new?template=${templateData}`);
  };

  const handleStartFromScratch = () => {
    router.push("/admin/questionnaires/new");
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                <span className="text-gray-900">Templates</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">Questionnaire Templates</h1>
              <p className="mt-1 text-sm text-gray-500">
                Choose a research-grade template or start from scratch
              </p>
            </div>
            <button
              onClick={handleStartFromScratch}
              className="rounded-md bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
            >
              Start from Scratch
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {categories.map((category) => {
                  const isActive = selectedCategory === category.id;
                  const count =
                    category.id === "all"
                      ? questionnaireTemplates.length
                      : questionnaireTemplates.filter((t) => t.category === category.id).length;

                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`border-b-2 px-1 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                      <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => {
            const categoryInfo = categories.find((c) => c.id === template.category);

            return (
              <div
                key={template.id}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md"
              >
                {/* Card Header */}
                <div className="p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="text-2xl">{categoryInfo?.icon || "📋"}</div>
                    {template.isLocked && (
                      <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                        Standardized
                      </span>
                    )}
                  </div>

                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{template.title}</h3>
                  <p className="mb-4 text-sm text-gray-600">{template.description}</p>

                  {/* Template Stats */}
                  <div className="mb-4 flex items-center space-x-4 text-xs text-gray-500">
                    <span>🕐 {template.estimatedTime}</span>
                    <span>📝 {template.questions.length} questions</span>
                  </div>

                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      {categoryInfo?.name || template.category}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="mb-4 flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                    {template.tags.length > 3 && (
                      <span className="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                        +{template.tags.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between bg-gray-50 px-6 py-4">
                  <button
                    onClick={() => handlePreviewTemplate(template)}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-800"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <div className="py-12 text-center">
            <div className="mb-4 text-6xl text-gray-400">🔍</div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">No templates found</h3>
            <p className="mb-4 text-gray-500">
              Try adjusting your search or category filter, or start with a blank questionnaire.
            </p>
            <button
              onClick={handleStartFromScratch}
              className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Start from Scratch
            </button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <TemplatePreviewModal
        template={previewModal.template}
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, template: null })}
        onUseTemplate={handleUseTemplate}
      />
    </div>
  );
}
