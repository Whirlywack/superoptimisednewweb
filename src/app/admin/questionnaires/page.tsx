"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  FileText,
  Users,
  BarChart3,
  Calendar,
  Settings,
  Copy,
  Trash2,
  Edit3,
} from "lucide-react";

// Mock data for questionnaires - replace with actual API call
const mockQuestionnaires = [
  {
    id: "1",
    title: "Product Feature Prioritization Survey",
    description: "Comprehensive survey to understand user needs and feature importance",
    status: "published",
    responseCount: 127,
    questionCount: 12,
    createdAt: "2024-01-15",
    category: "research",
  },
  {
    id: "2",
    title: "Customer Satisfaction Survey",
    description: "Monthly satisfaction survey with NPS scoring",
    status: "draft",
    responseCount: 0,
    questionCount: 8,
    createdAt: "2024-01-10",
    category: "feedback",
  },
  {
    id: "3",
    title: "UX Research - Navigation Study",
    description: "User testing questionnaire for new navigation design",
    status: "published",
    responseCount: 45,
    questionCount: 15,
    createdAt: "2024-01-08",
    category: "research",
  },
];

export default function QuestionnairesIndexPage() {
  const [questionnaires] = useState(mockQuestionnaires);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "var(--primary)";
      case "draft":
        return "var(--warm-gray)";
      default:
        return "var(--warm-gray)";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "research":
        return BarChart3;
      case "feedback":
        return Users;
      default:
        return FileText;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--off-white)" }}>
      {/* Header */}
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
              <h1 className="text-3xl font-bold" style={{ color: "var(--off-black)" }}>
                Questionnaires
              </h1>
              <p className="mt-1 text-sm" style={{ color: "var(--warm-gray)" }}>
                Manage your research questionnaires and surveys
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/admin/questionnaires/templates"
                className="px-4 py-2 text-sm font-medium transition-colors hover:opacity-75"
                style={{
                  backgroundColor: "var(--off-white)",
                  color: "var(--off-black)",
                  border: "2px solid var(--off-black)",
                }}
              >
                Browse Templates
              </Link>
              <Link
                href="/admin/questionnaires/new"
                className="inline-flex items-center px-4 py-2 text-sm font-medium transition-colors hover:opacity-90"
                style={{
                  backgroundColor: "var(--off-black)",
                  color: "var(--off-white)",
                }}
              >
                <Plus size={16} className="mr-2" />
                New Questionnaire
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {questionnaires.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-4 flex justify-center" style={{ color: "var(--warm-gray)" }}>
              <FileText size={64} />
            </div>
            <h3 className="mb-2 text-lg font-medium" style={{ color: "var(--off-black)" }}>
              No questionnaires yet
            </h3>
            <p className="mb-6 text-sm" style={{ color: "var(--warm-gray)" }}>
              Create your first questionnaire to start collecting responses
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/admin/questionnaires/templates"
                className="px-6 py-3 text-sm font-medium transition-colors hover:opacity-75"
                style={{
                  backgroundColor: "var(--off-white)",
                  color: "var(--off-black)",
                  border: "2px solid var(--off-black)",
                }}
              >
                Browse Templates
              </Link>
              <Link
                href="/admin/questionnaires/new"
                className="inline-flex items-center px-6 py-3 text-sm font-medium transition-colors hover:opacity-90"
                style={{
                  backgroundColor: "var(--off-black)",
                  color: "var(--off-white)",
                }}
              >
                <Plus size={16} className="mr-2" />
                Create from Scratch
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {questionnaires.map((questionnaire) => {
              const CategoryIcon = getCategoryIcon(questionnaire.category);

              return (
                <div
                  key={questionnaire.id}
                  className="overflow-hidden border-2 shadow-sm transition-all duration-200 hover:shadow-md"
                  style={{
                    backgroundColor: "var(--off-white)",
                    borderColor: "var(--light-gray)",
                  }}
                >
                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <CategoryIcon size={24} style={{ color: "var(--primary)" }} />
                      <div className="flex items-center space-x-2">
                        <span
                          className="px-2 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: getStatusColor(questionnaire.status),
                            color: "var(--off-white)",
                          }}
                        >
                          {questionnaire.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <h3
                      className="mb-2 text-lg font-semibold"
                      style={{ color: "var(--off-black)" }}
                    >
                      {questionnaire.title}
                    </h3>
                    <p className="mb-4 text-sm" style={{ color: "var(--warm-gray)" }}>
                      {questionnaire.description}
                    </p>

                    {/* Stats */}
                    <div
                      className="mb-4 flex items-center space-x-4 text-xs"
                      style={{ color: "var(--warm-gray)" }}
                    >
                      <span className="flex items-center">
                        <Users size={12} className="mr-1" />
                        {questionnaire.responseCount} responses
                      </span>
                      <span className="flex items-center">
                        <FileText size={12} className="mr-1" />
                        {questionnaire.questionCount} questions
                      </span>
                      <span className="flex items-center">
                        <Calendar size={12} className="mr-1" />
                        {questionnaire.createdAt}
                      </span>
                    </div>

                    {/* Category */}
                    <div className="mb-4">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: "var(--light-gray)",
                          color: "var(--off-black)",
                        }}
                      >
                        {questionnaire.category}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className="flex items-center justify-between px-6 py-3"
                    style={{ backgroundColor: "var(--light-gray)" }}
                  >
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-1 transition-colors hover:opacity-75"
                        style={{ color: "var(--warm-gray)" }}
                        title="Duplicate"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        className="p-1 transition-colors hover:opacity-75"
                        style={{ color: "var(--warm-gray)" }}
                        title="Settings"
                      >
                        <Settings size={16} />
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        className="px-3 py-1 text-xs font-medium transition-colors hover:opacity-90"
                        style={{
                          backgroundColor: "var(--off-black)",
                          color: "var(--off-white)",
                        }}
                      >
                        <Edit3 size={12} className="mr-1" />
                        Edit
                      </button>
                      <button
                        className="p-1 transition-colors hover:opacity-75"
                        style={{ color: "var(--warm-gray)" }}
                        title="Delete"
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
  );
}
