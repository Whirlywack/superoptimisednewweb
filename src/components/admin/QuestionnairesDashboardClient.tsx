"use client";

import { api } from "@/lib/trpc/react";
import { questionnaireTemplates } from "@/lib/questionnaire-templates";
import {
  BarChart3,
  Plus,
  Edit,
  Eye,
  Copy,
  Trash2,
  Calendar,
  Users,
  FileText,
  Settings,
  Zap,
  Search,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface QuestionnairesDashboardClientProps {
  userEmail: string;
}

export function QuestionnairesDashboardClient({
  userEmail: _userEmail,
}: QuestionnairesDashboardClientProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Real questionnaire data via tRPC
  const { data: questionnaires, isLoading: questionnairesLoading } =
    api.questionnaire.getAll.useQuery({
      limit: 20,
    });

  const { data: stats, isLoading: statsLoading } = api.questionnaire.getStats.useQuery();

  const filters = [
    { id: "all", label: "All" },
    { id: "draft", label: "Draft" },
    { id: "published", label: "Published" },
    { id: "archived", label: "Archived" },
  ];

  const filteredQuestionnaires =
    questionnaires?.questionnaires.filter((questionnaire) => {
      const matchesFilter = selectedFilter === "all" || questionnaire.status === selectedFilter;
      const matchesSearch = questionnaire.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    }) || [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--off-white)" }}>
      {/* Header */}
      <div
        style={{ backgroundColor: "var(--off-white)", borderBottom: "2px solid var(--light-gray)" }}
      >
        <div
          className="mx-auto max-w-7xl px-6"
          style={{ paddingTop: "var(--space-lg)", paddingBottom: "var(--space-lg)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="font-bold uppercase tracking-tight"
                style={{
                  fontSize: "var(--text-xl)",
                  color: "var(--off-black)",
                  marginBottom: "var(--space-xs)",
                }}
              >
                Questionnaires
              </h1>
              <p style={{ fontSize: "var(--text-base)", color: "var(--warm-gray)" }}>
                Manage questionnaires, templates, and surveys
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
              <Link
                href="/admin/questionnaires/templates"
                className="flex items-center font-medium uppercase transition-colors"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--off-black)",
                  backgroundColor: "var(--light-gray)",
                  padding: "var(--space-sm) var(--space-md)",
                  border: "2px solid var(--light-gray)",
                  textDecoration: "none",
                  gap: "var(--space-xs)",
                }}
              >
                <Zap size={16} />
                Templates
              </Link>

              <Link
                href="/admin/questionnaires/new"
                className="flex items-center font-medium uppercase transition-colors"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--off-white)",
                  backgroundColor: "var(--off-black)",
                  padding: "var(--space-sm) var(--space-md)",
                  border: "2px solid var(--off-black)",
                  textDecoration: "none",
                  gap: "var(--space-xs)",
                }}
              >
                <Plus size={16} />
                New Questionnaire
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mx-auto max-w-7xl px-6"
        style={{ paddingTop: "var(--space-lg)", paddingBottom: "var(--space-lg)" }}
      >
        {/* Stats Overview */}
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            marginBottom: "var(--space-xl)",
            border: "2px solid var(--light-gray)",
          }}
        >
          <div
            className="border-r-2 text-center"
            style={{
              borderColor: "var(--light-gray)",
              backgroundColor: "var(--off-white)",
              padding: "var(--space-md)",
            }}
          >
            <div
              className="font-bold"
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--off-black)",
                marginBottom: "var(--space-xs)",
              }}
            >
              {statsLoading ? "..." : stats?.activeQuestionnaires || 0}
            </div>
            <div
              className="font-medium uppercase"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--warm-gray)",
                letterSpacing: "0.05em",
              }}
            >
              Active
            </div>
          </div>

          <div
            className="border-r-2 text-center"
            style={{
              borderColor: "var(--light-gray)",
              backgroundColor: "var(--off-white)",
              padding: "var(--space-md)",
            }}
          >
            <div
              className="font-bold"
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--primary)",
                marginBottom: "var(--space-xs)",
              }}
            >
              {statsLoading ? "..." : stats?.totalResponses || 0}
            </div>
            <div
              className="font-medium uppercase"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--warm-gray)",
                letterSpacing: "0.05em",
              }}
            >
              Total Responses
            </div>
          </div>

          <div
            className="border-r-2 text-center"
            style={{
              borderColor: "var(--light-gray)",
              backgroundColor: "var(--off-white)",
              padding: "var(--space-md)",
            }}
          >
            <div
              className="font-bold"
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--off-black)",
                marginBottom: "var(--space-xs)",
              }}
            >
              {questionnaireTemplates.length}
            </div>
            <div
              className="font-medium uppercase"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--warm-gray)",
                letterSpacing: "0.05em",
              }}
            >
              Templates
            </div>
          </div>

          <div
            className="text-center"
            style={{
              backgroundColor: "var(--off-white)",
              padding: "var(--space-md)",
            }}
          >
            <div
              className="font-bold"
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--primary)",
                marginBottom: "var(--space-xs)",
              }}
            >
              {statsLoading ? "..." : `${stats?.completionRate || 0}%`}
            </div>
            <div
              className="font-medium uppercase"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--warm-gray)",
                letterSpacing: "0.05em",
              }}
            >
              Avg Completion
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div
          className="flex items-center justify-between border-2"
          style={{
            borderColor: "var(--light-gray)",
            backgroundColor: "var(--off-white)",
            padding: "var(--space-md)",
            marginBottom: "var(--space-lg)",
          }}
        >
          {/* Search */}
          <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
            <Search size={16} style={{ color: "var(--warm-gray)" }} />
            <input
              type="text"
              placeholder="Search questionnaires..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="font-mono text-sm"
              style={{
                border: "2px solid var(--light-gray)",
                backgroundColor: "var(--off-white)",
                color: "var(--off-black)",
                padding: "var(--space-xs) var(--space-sm)",
                width: "300px",
              }}
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex" style={{ gap: "0" }}>
            {filters.map((filter) => {
              const isActive = selectedFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className="font-medium uppercase transition-colors"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: isActive ? "var(--off-white)" : "var(--off-black)",
                    backgroundColor: isActive ? "var(--off-black)" : "var(--light-gray)",
                    padding: "var(--space-sm) var(--space-md)",
                    border: "2px solid var(--light-gray)",
                    borderRight:
                      filter.id === "archived"
                        ? "2px solid var(--light-gray)"
                        : "1px solid var(--light-gray)",
                  }}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Questionnaires List */}
        {questionnairesLoading ? (
          <div
            className="border-2 text-center"
            style={{
              borderColor: "var(--light-gray)",
              backgroundColor: "var(--off-white)",
              padding: "var(--space-xl)",
            }}
          >
            <div style={{ color: "var(--warm-gray)", fontSize: "var(--text-base)" }}>
              Loading questionnaires...
            </div>
          </div>
        ) : filteredQuestionnaires.length === 0 ? (
          <div
            className="border-2 text-center"
            style={{
              borderColor: "var(--light-gray)",
              backgroundColor: "var(--off-white)",
              padding: "var(--space-xl)",
            }}
          >
            {searchTerm ? (
              <>
                <h3
                  className="font-bold uppercase"
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--off-black)",
                    marginBottom: "var(--space-sm)",
                  }}
                >
                  No Results Found
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-base)",
                    color: "var(--warm-gray)",
                    marginBottom: "var(--space-md)",
                  }}
                >
                  No questionnaires match &quot;{searchTerm}&quot;
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="font-medium uppercase transition-colors"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--off-black)",
                    backgroundColor: "var(--light-gray)",
                    padding: "var(--space-sm) var(--space-md)",
                    border: "2px solid var(--light-gray)",
                  }}
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <FileText
                  size={48}
                  style={{ color: "var(--warm-gray)", margin: "0 auto var(--space-md)" }}
                />
                <h3
                  className="font-bold uppercase"
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--off-black)",
                    marginBottom: "var(--space-sm)",
                  }}
                >
                  No Questionnaires Yet
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-base)",
                    color: "var(--warm-gray)",
                    marginBottom: "var(--space-md)",
                  }}
                >
                  Create your first questionnaire to start collecting responses
                </p>
                <div className="flex justify-center" style={{ gap: "var(--space-sm)" }}>
                  <Link
                    href="/admin/questionnaires/templates"
                    className="font-medium uppercase transition-colors"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--off-black)",
                      backgroundColor: "var(--light-gray)",
                      padding: "var(--space-sm) var(--space-md)",
                      border: "2px solid var(--light-gray)",
                      textDecoration: "none",
                    }}
                  >
                    Browse Templates
                  </Link>
                  <Link
                    href="/admin/questionnaires/new"
                    className="flex items-center font-medium uppercase transition-colors"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--off-white)",
                      backgroundColor: "var(--off-black)",
                      padding: "var(--space-sm) var(--space-md)",
                      border: "2px solid var(--off-black)",
                      textDecoration: "none",
                      gap: "var(--space-xs)",
                    }}
                  >
                    <Plus size={16} />
                    Create from Scratch
                  </Link>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuestionnaires.map((questionnaire) => (
              <div
                key={questionnaire.id}
                className="border-2 transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: "var(--off-white)",
                  borderColor: "var(--light-gray)",
                }}
              >
                <div style={{ padding: "var(--space-md)" }}>
                  <div className="mb-3 flex items-center justify-between">
                    <BarChart3 size={20} style={{ color: "var(--primary)" }} />
                    <div className="flex items-center" style={{ gap: "var(--space-xs)" }}>
                      <span
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "bold",
                          color:
                            questionnaire.status === "published"
                              ? "var(--off-white)"
                              : "var(--warm-gray)",
                          backgroundColor:
                            questionnaire.status === "published"
                              ? "var(--primary)"
                              : "var(--light-gray)",
                          padding: "2px var(--space-xs)",
                          textTransform: "uppercase",
                        }}
                      >
                        {questionnaire.status}
                      </span>
                    </div>
                  </div>

                  <h3
                    className="mb-2 font-semibold"
                    style={{
                      fontSize: "var(--text-base)",
                      color: "var(--off-black)",
                    }}
                  >
                    {questionnaire.title}
                  </h3>

                  {questionnaire.description && (
                    <p
                      className="mb-4"
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--warm-gray)",
                      }}
                    >
                      {questionnaire.description.length > 80
                        ? questionnaire.description.substring(0, 80) + "..."
                        : questionnaire.description}
                    </p>
                  )}

                  {/* Stats */}
                  <div
                    className="mb-4 flex items-center"
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--warm-gray)",
                      gap: "var(--space-md)",
                    }}
                  >
                    <span className="flex items-center" style={{ gap: "var(--space-xs)" }}>
                      <Users size={12} />
                      {questionnaire.responseCount} responses
                    </span>
                    <span className="flex items-center" style={{ gap: "var(--space-xs)" }}>
                      <FileText size={12} />
                      {questionnaire.questionCount} questions
                    </span>
                    <span className="flex items-center" style={{ gap: "var(--space-xs)" }}>
                      <Calendar size={12} />
                      {new Date(questionnaire.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Category */}
                  {questionnaire.category && (
                    <div className="mb-4">
                      <span
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "bold",
                          color: "var(--off-black)",
                          backgroundColor: "var(--light-gray)",
                          padding: "2px var(--space-xs)",
                          textTransform: "uppercase",
                        }}
                      >
                        {questionnaire.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div
                  className="flex items-center justify-between"
                  style={{
                    backgroundColor: "var(--light-gray)",
                    padding: "var(--space-sm) var(--space-md)",
                  }}
                >
                  <div className="flex items-center" style={{ gap: "var(--space-xs)" }}>
                    <button
                      className="transition-colors hover:opacity-75"
                      style={{ color: "var(--warm-gray)" }}
                      title="Duplicate"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      className="transition-colors hover:opacity-75"
                      style={{ color: "var(--warm-gray)" }}
                      title="Settings"
                    >
                      <Settings size={16} />
                    </button>
                  </div>

                  <div className="flex items-center" style={{ gap: "var(--space-xs)" }}>
                    <Link
                      href={`/admin/questionnaires/${questionnaire.id}`}
                      className="transition-colors hover:opacity-75"
                      style={{ color: "var(--warm-gray)" }}
                      title="View Results"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/admin/questionnaires/${questionnaire.id}/edit`}
                      className="flex items-center font-medium uppercase transition-colors"
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--off-white)",
                        backgroundColor: "var(--off-black)",
                        padding: "var(--space-xs) var(--space-sm)",
                        border: "2px solid var(--off-black)",
                        textDecoration: "none",
                        gap: "var(--space-xs)",
                      }}
                    >
                      <Edit size={12} />
                      Edit
                    </Link>
                    <button
                      className="transition-colors hover:opacity-75"
                      style={{ color: "var(--warm-gray)" }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
