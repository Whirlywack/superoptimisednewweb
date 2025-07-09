"use client";

import Link from "next/link";
import { api } from "@/lib/trpc/react";
import { questionnaireTemplates } from "@/lib/questionnaire-templates";

interface AdminDashboardClientProps {
  userEmail: string;
}

export function AdminDashboardClient({ userEmail: _userEmail }: AdminDashboardClientProps) {
  const { data: stats, isLoading: statsLoading } = api.questionnaire.getStats.useQuery();
  const { data: questionnaires, isLoading: questionnairesLoading } =
    api.questionnaire.getAll.useQuery({
      limit: 5,
    });

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
                Questionnaire Management
              </h1>
              <p style={{ fontSize: "var(--text-base)", color: "var(--warm-gray)" }}>
                Build and manage research questionnaires
              </p>
            </div>
            <div className="flex" style={{ gap: "0" }}>
              <Link
                href="/admin/questionnaires/new"
                className="font-medium uppercase transition-colors"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--off-white)",
                  backgroundColor: "var(--primary)",
                  padding: "var(--space-sm) var(--space-md)",
                  border: "2px solid var(--primary)",
                  borderRight: "1px solid var(--primary)",
                  textDecoration: "none",
                }}
              >
                New Questionnaire
              </Link>
              <Link
                href="/admin/questions/new"
                className="font-medium uppercase transition-colors"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--off-black)",
                  backgroundColor: "var(--off-white)",
                  padding: "var(--space-sm) var(--space-md)",
                  border: "2px solid var(--primary)",
                  borderLeft: "1px solid var(--primary)",
                  textDecoration: "none",
                }}
              >
                Add Question
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mx-auto max-w-7xl px-6"
        style={{ paddingTop: "var(--space-lg)", paddingBottom: "var(--space-lg)" }}
      >
        {/* Quick Stats */}
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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
              Active Questionnaires
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
              {statsLoading ? "..." : stats?.totalQuestions || 0}
            </div>
            <div
              className="font-medium uppercase"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--warm-gray)",
                letterSpacing: "0.05em",
              }}
            >
              Questions in Bank
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
              Completion Rate
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div
          className="grid grid-cols-1 gap-0 lg:grid-cols-2"
          style={{ marginBottom: "var(--space-xl)" }}
        >
          {/* Quick Templates */}
          <div
            className="border-2 border-r-0"
            style={{
              borderColor: "var(--light-gray)",
              backgroundColor: "var(--off-white)",
            }}
          >
            <div
              className="border-b-2"
              style={{
                borderColor: "var(--light-gray)",
                padding: "var(--space-md)",
                backgroundColor: "var(--off-white)",
              }}
            >
              <h2
                className="font-bold uppercase"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--off-black)",
                }}
              >
                Quick Start Templates
              </h2>
              <p
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--warm-gray)",
                  marginTop: "var(--space-xs)",
                }}
              >
                Create questionnaires instantly from proven templates
              </p>
            </div>
            <div style={{ padding: "var(--space-md)" }}>
              <div style={{ marginBottom: "var(--space-lg)" }}>
                {questionnaireTemplates.slice(0, 3).map((template) => (
                  <div
                    key={template.id}
                    className="border-2 border-b-0 last:border-b-2"
                    style={{
                      borderColor: "var(--light-gray)",
                      backgroundColor: "var(--off-white)",
                      padding: "var(--space-sm)",
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3
                          className="font-medium"
                          style={{
                            fontSize: "var(--text-base)",
                            color: "var(--off-black)",
                            marginBottom: "var(--space-xs)",
                          }}
                        >
                          {template.title}
                        </h3>
                        <p
                          style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--warm-gray)",
                            marginBottom: "var(--space-xs)",
                          }}
                        >
                          {template.description}
                        </p>
                        <div
                          className="font-mono"
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--primary)",
                          }}
                        >
                          {template.questions.length} questions • {template.category}
                        </div>
                      </div>
                      <Link
                        href={`/admin/questionnaires/new?template=${template.id}`}
                        className="ml-4 font-medium uppercase transition-colors"
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--off-white)",
                          backgroundColor: "var(--primary)",
                          padding: "var(--space-xs) var(--space-sm)",
                          border: "2px solid var(--primary)",
                          textDecoration: "none",
                        }}
                      >
                        Use Template
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/admin/questionnaires/templates"
                className="block text-center font-medium uppercase transition-colors"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--off-black)",
                  backgroundColor: "var(--light-gray)",
                  padding: "var(--space-sm)",
                  border: "2px solid var(--light-gray)",
                  textDecoration: "none",
                }}
              >
                View All Templates
              </Link>
            </div>
          </div>

          {/* Recent Questionnaires */}
          <div
            className="border-2"
            style={{
              borderColor: "var(--light-gray)",
              backgroundColor: "var(--off-white)",
            }}
          >
            <div
              className="flex items-center justify-between border-b-2"
              style={{
                borderColor: "var(--light-gray)",
                padding: "var(--space-md)",
                backgroundColor: "var(--off-white)",
              }}
            >
              <h2
                className="font-bold uppercase"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--off-black)",
                }}
              >
                Recent Questionnaires
              </h2>
              <Link
                href="/admin/questionnaires"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--primary)",
                  textDecoration: "none",
                }}
              >
                View All
              </Link>
            </div>
            <div style={{ padding: "var(--space-md)" }}>
              {questionnairesLoading ? (
                <div className="py-8 text-center">
                  <div style={{ color: "var(--warm-gray)" }}>Loading questionnaires...</div>
                </div>
              ) : questionnaires?.questionnaires.length === 0 ? (
                <div className="py-8 text-center">
                  <div
                    style={{
                      color: "var(--warm-gray)",
                      fontSize: "2rem",
                      marginBottom: "var(--space-sm)",
                    }}
                  >
                    📋
                  </div>
                  <h3
                    style={{
                      fontSize: "var(--text-lg)",
                      fontWeight: "bold",
                      color: "var(--off-black)",
                      marginBottom: "var(--space-xs)",
                    }}
                  >
                    No questionnaires yet
                  </h3>
                  <p
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--warm-gray)",
                      marginBottom: "var(--space-md)",
                    }}
                  >
                    Create your first questionnaire to get started
                  </p>
                  <Link
                    href="/admin/questionnaires/new"
                    className="font-medium uppercase transition-colors"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--off-white)",
                      backgroundColor: "var(--primary)",
                      padding: "var(--space-sm) var(--space-md)",
                      border: "2px solid var(--primary)",
                      textDecoration: "none",
                    }}
                  >
                    Create Questionnaire
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
                  {questionnaires?.questionnaires.map((questionnaire) => (
                    <div
                      key={questionnaire.id}
                      style={{
                        border: "2px solid var(--light-gray)",
                        backgroundColor: "var(--off-white)",
                        padding: "var(--space-sm)",
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3
                            style={{
                              fontSize: "var(--text-base)",
                              fontWeight: "bold",
                              color: "var(--off-black)",
                            }}
                          >
                            {questionnaire.title}
                          </h3>
                          <p
                            style={{
                              fontSize: "var(--text-sm)",
                              color: "var(--warm-gray)",
                              marginTop: "var(--space-xs)",
                            }}
                          >
                            {questionnaire.questionCount} questions • Created{" "}
                            {new Date(questionnaire.createdAt).toLocaleDateString()}
                          </p>
                          <div
                            className="flex items-center"
                            style={{ marginTop: "var(--space-xs)", gap: "var(--space-md)" }}
                          >
                            <span
                              style={{
                                fontSize: "var(--text-xs)",
                                fontWeight: "bold",
                                color: "var(--primary)",
                                backgroundColor: "var(--light-gray)",
                                padding: "var(--space-xs)",
                                textTransform: "uppercase",
                              }}
                            >
                              {questionnaire.status}
                            </span>
                            <span style={{ fontSize: "var(--text-sm)", color: "var(--warm-gray)" }}>
                              {questionnaire.responseCount} responses
                            </span>
                          </div>
                        </div>
                        <div className="flex" style={{ gap: "var(--space-xs)" }}>
                          <Link
                            href={`/admin/questionnaires/${questionnaire.id}/edit`}
                            style={{ color: "var(--warm-gray)" }}
                          >
                            ✏️
                          </Link>
                          <Link
                            href={`/admin/questionnaires/${questionnaire.id}`}
                            style={{ color: "var(--warm-gray)" }}
                          >
                            👁️
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
