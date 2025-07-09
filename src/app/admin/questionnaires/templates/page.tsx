"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ClipboardList,
  BarChart3,
  Palette,
  Users,
  Star,
  Target,
  Clock,
  FileText,
  X,
} from "lucide-react";
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
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-hidden shadow-xl"
        style={{ backgroundColor: "var(--off-white)" }}
      >
        {/* Terminal-style Modal Header */}
        <div
          className="border-b-2 px-6 py-4"
          style={{
            backgroundColor: "var(--off-black)",
            borderColor: "var(--off-black)",
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xl font-bold" style={{ color: "var(--off-white)" }}>
                {template.title}
              </div>
              <div className="mt-1 text-sm" style={{ color: "var(--warm-gray)" }}>
                {template.description}
              </div>
              <div
                className="mt-2 flex items-center space-x-4 text-xs"
                style={{ color: "var(--warm-gray)" }}
              >
                <span className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  {template.estimatedTime}
                </span>
                <span className="flex items-center">
                  <FileText size={12} className="mr-1" />
                  {template.questions.length} questions
                </span>
                <span className="flex items-center">
                  <Users size={12} className="mr-1" />
                  {template.targetAudience}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="transition-colors hover:opacity-75"
              style={{ color: "var(--warm-gray)" }}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="p-6">
            {/* Best Practices */}
            <div className="mb-6">
              <h3
                className="mb-2 font-mono text-sm font-medium"
                style={{ color: "var(--off-black)" }}
              >
                RESEARCH_BEST_PRACTICES
              </h3>
              <ul className="space-y-1">
                {template.bestPractices.map((practice, index) => (
                  <li
                    key={index}
                    className="flex items-start font-mono text-sm"
                    style={{ color: "var(--warm-gray)" }}
                  >
                    <span className="mr-2" style={{ color: "var(--primary)" }}>
                      ✓
                    </span>
                    {practice}
                  </li>
                ))}
              </ul>
            </div>

            {/* Questions Preview */}
            <div>
              <h3
                className="mb-4 font-mono text-sm font-medium"
                style={{ color: "var(--off-black)" }}
              >
                QUESTIONS_PREVIEW ({template.questions.length})
              </h3>
              <div className="space-y-4">
                {template.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border-2 p-4"
                    style={{ borderColor: "var(--light-gray)" }}
                  >
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
                        {question.questionType}
                      </span>
                      {question.isRequired && (
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
                      {question.isLocked && (
                        <span
                          className="px-2 py-1 font-mono text-xs"
                          style={{
                            backgroundColor: "var(--off-black)",
                            color: "var(--off-white)",
                          }}
                        >
                          LOCKED
                        </span>
                      )}
                    </div>
                    <h4 className="font-mono font-medium" style={{ color: "var(--off-black)" }}>
                      {question.title}
                    </h4>
                    {question.description && (
                      <p className="mt-1 font-mono text-sm" style={{ color: "var(--warm-gray)" }}>
                        {question.description}
                      </p>
                    )}
                    {question.bestPracticeNote && (
                      <p
                        className="mt-2 font-mono text-xs italic"
                        style={{ color: "var(--primary)" }}
                      >
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
        <div
          className="border-t-2 px-6 py-4"
          style={{
            borderColor: "var(--light-gray)",
            backgroundColor: "var(--light-gray)",
          }}
        >
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 font-mono text-sm font-medium transition-colors hover:opacity-75"
              style={{
                backgroundColor: "var(--warm-gray)",
                color: "var(--off-white)",
              }}
            >
              CLOSE
            </button>
            <button
              type="button"
              onClick={() => onUseTemplate(template)}
              className="px-6 py-3 font-mono text-sm font-medium transition-colors hover:opacity-90"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--off-white)",
              }}
            >
              USE_TEMPLATE
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
    { id: "all", name: "All Templates", icon: ClipboardList },
    { id: "product-research", name: "Product Research", icon: BarChart3 },
    { id: "ux-research", name: "UX Research", icon: Palette },
    { id: "market-research", name: "Market Research", icon: Users },
    { id: "customer-satisfaction", name: "Customer Satisfaction", icon: Star },
    { id: "feature-prioritization", name: "Feature Prioritization", icon: Target },
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
    <div className="min-h-screen" style={{ backgroundColor: "var(--off-white)" }}>
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
                <span style={{ color: "var(--off-black)" }}>Templates</span>
              </nav>
              <h1 className="text-3xl font-bold" style={{ color: "var(--off-black)" }}>
                Questionnaire Templates
              </h1>
              <p className="mt-1 text-sm" style={{ color: "var(--warm-gray)" }}>
                Choose a research-grade template or start from scratch
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartFromScratch}
              className="px-6 py-3 text-sm font-medium transition-colors hover:opacity-90"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--off-white)",
              }}
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
                className="w-full border-2 font-mono text-sm transition-all duration-200 focus:outline-none"
                style={{
                  borderColor: "var(--off-black)",
                  backgroundColor: "var(--off-white)",
                  color: "var(--off-black)",
                  padding: "0.75rem",
                }}
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-6">
            <div className="border-b-2" style={{ borderColor: "var(--light-gray)" }}>
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
                      type="button"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`border-b-2 px-1 py-2 text-sm font-medium transition-colors ${
                        isActive ? "border-current" : "border-transparent hover:opacity-75"
                      }`}
                      style={{
                        color: isActive ? "var(--primary)" : "var(--warm-gray)",
                      }}
                    >
                      {category.icon && (
                        <category.icon
                          size={16}
                          className="mr-2"
                          style={{ color: isActive ? "var(--primary)" : "var(--warm-gray)" }}
                        />
                      )}
                      {category.name}
                      {category.id !== "all" && (
                        <span
                          className="ml-2 px-2 py-1 text-xs"
                          style={{
                            backgroundColor: "var(--light-gray)",
                            color: "var(--off-black)",
                          }}
                        >
                          {count}
                        </span>
                      )}
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
                className="overflow-hidden border-2 shadow-sm transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: "var(--off-white)",
                  borderColor: "var(--light-gray)",
                }}
              >
                {/* Card Header */}
                <div className="p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="text-2xl">
                      {categoryInfo?.icon ? (
                        <categoryInfo.icon size={32} style={{ color: "var(--primary)" }} />
                      ) : (
                        <ClipboardList size={32} style={{ color: "var(--primary)" }} />
                      )}
                    </div>
                    {template.isLocked && (
                      <span
                        className="px-2 py-1 font-mono text-xs font-medium"
                        style={{
                          backgroundColor: "var(--off-black)",
                          color: "var(--off-white)",
                        }}
                      >
                        STANDARDIZED
                      </span>
                    )}
                  </div>

                  <h3 className="mb-2 text-lg font-semibold" style={{ color: "var(--off-black)" }}>
                    {template.title}
                  </h3>
                  <p className="mb-4 text-sm" style={{ color: "var(--warm-gray)" }}>
                    {template.description}
                  </p>

                  {/* Template Stats */}
                  <div
                    className="mb-4 flex items-center space-x-4 text-xs"
                    style={{ color: "var(--warm-gray)" }}
                  >
                    <span className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      {template.estimatedTime}
                    </span>
                    <span className="flex items-center">
                      <FileText size={12} className="mr-1" />
                      {template.questions.length} questions
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="mb-4">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: "var(--primary)",
                        color: "var(--off-white)",
                      }}
                    >
                      {categoryInfo?.name || template.category}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="mb-4 flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: "var(--light-gray)",
                          color: "var(--off-black)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {template.tags.length > 3 && (
                      <span
                        className="inline-flex items-center px-2 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: "var(--light-gray)",
                          color: "var(--off-black)",
                        }}
                      >
                        +{template.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div
                  className="flex items-center justify-between px-6 py-4"
                  style={{ backgroundColor: "var(--light-gray)" }}
                >
                  <button
                    type="button"
                    onClick={() => handlePreviewTemplate(template)}
                    className="text-sm transition-colors hover:opacity-75"
                    style={{ color: "var(--warm-gray)" }}
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUseTemplate(template)}
                    className="px-4 py-2 text-sm font-medium transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "var(--off-white)",
                    }}
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
            <div className="mb-4 flex justify-center" style={{ color: "var(--warm-gray)" }}>
              <ClipboardList size={64} />
            </div>
            <h3 className="mb-2 text-lg font-medium" style={{ color: "var(--off-black)" }}>
              No templates found
            </h3>
            <p className="mb-4 text-sm" style={{ color: "var(--warm-gray)" }}>
              Try adjusting your search or category filter, or start with a blank questionnaire.
            </p>
            <button
              type="button"
              onClick={handleStartFromScratch}
              className="px-6 py-3 font-mono text-sm font-medium transition-colors hover:opacity-90"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--off-white)",
              }}
            >
              START_FROM_SCRATCH
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
