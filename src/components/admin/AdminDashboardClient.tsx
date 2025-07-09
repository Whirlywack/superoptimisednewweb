"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/trpc/react";
import { questionnaireTemplates } from "@/lib/questionnaire-templates";
import { LoadingState, CardSkeleton } from "@/components/ui/LoadingState";
import { RealTimeIndicator, CompactRealTimeIndicator, PulseIndicator } from "@/components/ui/RealTimeIndicator";
import { useRealtimeStats } from "@/hooks/useRealtimeStats";
import {
  Plus,
  BarChart3,
  FileText,
  Target,
  Zap,
  Eye,
  Edit,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface AdminDashboardClientProps {
  userEmail: string;
}

export function AdminDashboardClient({ userEmail: _userEmail }: AdminDashboardClientProps) {
  const [_activeQuickAction, _setActiveQuickAction] = useState<string | null>(null);

  // Real-time stats hook
  const realtimeStats = useRealtimeStats({ enabled: true });

  // Error state component
  const ErrorMessage = ({ error, title }: { error: any; title: string }) => (
    <div
      className="flex items-center border-2 p-4"
      style={{
        borderColor: "var(--primary)",
        backgroundColor: "var(--off-white)",
        color: "var(--primary)",
      }}
    >
      <AlertCircle size={20} className="mr-2" />
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm">{error?.message || "An error occurred"}</p>
      </div>
    </div>
  );
  
  const { data: stats, isLoading: statsLoading, error: statsError } = api.questionnaire.getStats.useQuery();
  const { data: questionnaires, isLoading: questionnairesLoading, error: questionnairesError } =
    api.questionnaire.getAll.useQuery({
      limit: 4,
    });

  // Real data from tRPC APIs
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = api.analytics.getWebsiteStats.useQuery();
  const { data: questionnaireAnalytics, error: questionnaireAnalyticsError } = api.analytics.getQuestionnaireAnalytics.useQuery();
  const { data: contentStats, error: contentStatsError } = api.content.getContentStats.useQuery();
  const { data: blogPosts, error: blogPostsError } = api.blog.getBlogPosts.useQuery({ limit: 3 });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--off-white)" }}>
      {/* Streamlined Header */}
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
                Admin Dashboard
              </h1>
              <p style={{ fontSize: "var(--text-base)", color: "var(--warm-gray)" }}>
                Questionnaires • Analytics • Content
              </p>
            </div>
            
            {/* Real-time Status & Quick Action Bar */}
            <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
              {/* Real-time Status Indicator */}
              <RealTimeIndicator
                isConnected={realtimeStats.isConnected}
                isPolling={realtimeStats.isPolling}
                lastUpdated={realtimeStats.stats?.lastUpdated}
                onRefresh={() => window.location.reload()}
              />
              
              {/* Quick Actions */}
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
            </div>
          </div>
        </div>
      </div>

      <div
        className="mx-auto max-w-7xl px-6"
        style={{ paddingTop: "var(--space-lg)", paddingBottom: "var(--space-lg)" }}
      >
        {/* Unified Stats Dashboard */}
        {statsError || analyticsError ? (
          <div style={{ marginBottom: "var(--space-xl)" }}>
            <ErrorMessage error={statsError || analyticsError} title="Failed to load dashboard stats" />
          </div>
        ) : (
          <div style={{ marginBottom: "var(--space-xl)" }}>
            {/* Real-time Update Indicator */}
            <div
              className="flex items-center justify-between border-b-2 px-4 py-2"
              style={{
                borderColor: "var(--light-gray)",
                backgroundColor: "var(--off-white)",
              }}
            >
              <h2
                className="font-medium uppercase"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--off-black)",
                  letterSpacing: "0.05em",
                }}
              >
                Dashboard Statistics
              </h2>
              <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
                <PulseIndicator isActive={realtimeStats.isLoading} />
                <CompactRealTimeIndicator
                  isConnected={realtimeStats.isConnected}
                  isPolling={realtimeStats.isPolling}
                />
              </div>
            </div>
            
            <div
              className="grid gap-0"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                border: "2px solid var(--light-gray)",
                borderTop: "none",
              }}
            >
            {/* Questionnaire Stats */}
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
                {statsLoading ? (
                  <div className="animate-pulse h-6 w-8 bg-light-gray rounded mx-auto"></div>
                ) : (
                  realtimeStats.stats?.activeQuestions || stats?.activeQuestionnaires || 0
                )}
              </div>
              <div
                className="font-medium uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--warm-gray)",
                  letterSpacing: "0.05em",
                }}
              >
                Active Surveys
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
                {statsLoading ? (
                  <div className="animate-pulse h-6 w-8 bg-light-gray rounded mx-auto"></div>
                ) : (
                  realtimeStats.stats?.totalVotes || stats?.totalResponses || 0
                )}
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
          
          {/* Analytics Stats */}
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
              {analyticsLoading ? (
                <div className="animate-pulse h-6 w-12 bg-light-gray rounded mx-auto"></div>
              ) : (
                realtimeStats.stats?.uniqueVoters.toLocaleString() || analyticsData?.totalVisitors.toLocaleString() || 0
              )}
            </div>
            <div
              className="font-medium uppercase"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--warm-gray)",
                letterSpacing: "0.05em",
              }}
            >
              Unique Visitors
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
              {analyticsLoading ? (
                <div className="animate-pulse h-6 w-12 bg-light-gray rounded mx-auto"></div>
              ) : (
                realtimeStats.stats?.totalXpEarned.toLocaleString() || analyticsData?.totalSubmissions.toLocaleString() || 0
              )}
            </div>
            <div
              className="font-medium uppercase"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--warm-gray)",
                letterSpacing: "0.05em",
              }}
            >
              XP Earned
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
                color: "var(--off-black)",
                marginBottom: "var(--space-xs)",
              }}
            >
              {analyticsLoading ? "..." : analyticsData?.engagementRate || "0%"}
            </div>
            <div
              className="font-medium uppercase"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--warm-gray)",
                letterSpacing: "0.05em",
              }}
            >
              Conversion Rate
            </div>
          </div>
        </div>

        {/* Three-Column Content Layout */}
        <div
          className="grid grid-cols-1 gap-0 lg:grid-cols-3"
          style={{ marginBottom: "var(--space-xl)" }}
        >
          {/* Questionnaires Section */}
          <div
            className="border-2 border-r-0"
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
              <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
                <BarChart3 size={20} style={{ color: "var(--primary)" }} />
                <h2
                  className="font-bold uppercase"
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--off-black)",
                  }}
                >
                  Questionnaires
                </h2>
              </div>
              <Link
                href="/admin/questionnaires/new"
                className="flex items-center transition-colors"
                style={{
                  color: "var(--primary)",
                  textDecoration: "none",
                  gap: "var(--space-xs)",
                }}
              >
                <Plus size={16} />
              </Link>
            </div>
            
            {/* Popular Templates - Direct Action */}
            <div style={{ padding: "var(--space-md)" }}>
              <div
                className="font-medium uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--warm-gray)",
                  marginBottom: "var(--space-sm)",
                  letterSpacing: "0.05em",
                }}
              >
                Popular Templates
              </div>
              
              <div style={{ marginBottom: "var(--space-md)" }}>
                {questionnaireTemplates.slice(0, 2).map((template) => (
                  <div
                    key={template.id}
                    className="border-2 border-b-0 last:border-b-2"
                    style={{
                      borderColor: "var(--light-gray)",
                      backgroundColor: "var(--off-white)",
                      padding: "var(--space-sm)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3
                          className="font-medium"
                          style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--off-black)",
                            marginBottom: "2px",
                          }}
                        >
                          {template.title}
                        </h3>
                        <div
                          className="font-mono"
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--warm-gray)",
                          }}
                        >
                          {template.questions.length} questions
                        </div>
                      </div>
                      <Link
                        href={`/admin/questionnaires/new?template=${template.id}`}
                        className="flex items-center transition-colors"
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--off-white)",
                          backgroundColor: "var(--off-black)",
                          padding: "var(--space-xs)",
                          border: "2px solid var(--off-black)",
                          textDecoration: "none",
                          gap: "var(--space-xs)",
                        }}
                      >
                        <Zap size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Recent Work */}
              <div
                className="font-medium uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--warm-gray)",
                  marginBottom: "var(--space-sm)",
                  letterSpacing: "0.05em",
                }}
              >
                Recent Work
              </div>
              
              {questionnairesLoading ? (
                <div className="py-4 text-center">
                  <div style={{ color: "var(--warm-gray)", fontSize: "var(--text-sm)" }}>Loading...</div>
                </div>
              ) : questionnaires?.questionnaires.length === 0 ? (
                <div className="py-4 text-center">
                  <div style={{ color: "var(--warm-gray)", fontSize: "var(--text-sm)" }}>No questionnaires yet</div>
                  <Link
                    href="/admin/questionnaires/new"
                    className="mt-2 inline-flex items-center font-medium transition-colors"
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--primary)",
                      textDecoration: "none",
                      gap: "var(--space-xs)",
                    }}
                  >
                    <Plus size={12} />
                    Create First
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                  {questionnaires?.questionnaires.slice(0, 3).map((questionnaire) => (
                    <div
                      key={questionnaire.id}
                      className="border-2"
                      style={{
                        borderColor: "var(--light-gray)",
                        backgroundColor: "var(--off-white)",
                        padding: "var(--space-sm)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "bold",
                              color: "var(--off-black)",
                              marginBottom: "2px",
                            }}
                          >
                            {questionnaire.title.length > 20 ? questionnaire.title.substring(0, 20) + "..." : questionnaire.title}
                          </h3>
                          <div
                            className="flex items-center"
                            style={{ gap: "var(--space-sm)" }}
                          >
                            <span
                              className="font-mono"
                              style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--warm-gray)",
                              }}
                            >
                              {questionnaire.responseCount} responses
                            </span>
                            <span
                              style={{
                                fontSize: "var(--text-xs)",
                                fontWeight: "bold",
                                color: questionnaire.status === 'published' ? "var(--primary)" : "var(--warm-gray)",
                                backgroundColor: "var(--light-gray)",
                                padding: "2px var(--space-xs)",
                                textTransform: "uppercase",
                              }}
                            >
                              {questionnaire.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex" style={{ gap: "var(--space-xs)" }}>
                          <Link
                            href={`/admin/questionnaires/${questionnaire.id}/edit`}
                            style={{ color: "var(--warm-gray)" }}
                          >
                            <Edit size={14} />
                          </Link>
                          <Link
                            href={`/admin/questionnaires/${questionnaire.id}`}
                            style={{ color: "var(--warm-gray)" }}
                          >
                            <Eye size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Link
                href="/admin/questionnaires/templates"
                className="mt-4 block text-center font-medium uppercase transition-colors"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--off-black)",
                  backgroundColor: "var(--light-gray)",
                  padding: "var(--space-sm)",
                  border: "2px solid var(--light-gray)",
                  textDecoration: "none",
                }}
              >
                All Templates
              </Link>
            </div>
          </div>

          {/* Analytics Section */}
          <div
            className="border-2 border-r-0"
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
              <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
                <Target size={20} style={{ color: "var(--primary)" }} />
                <h2
                  className="font-bold uppercase"
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--off-black)",
                  }}
                >
                  Analytics
                </h2>
              </div>
            </div>
            
            <div style={{ padding: "var(--space-md)" }}>
              {/* Quick Metrics */}
              <div
                className="grid grid-cols-2 gap-0"
                style={{
                  border: "2px solid var(--light-gray)",
                  marginBottom: "var(--space-md)",
                }}
              >
                <div
                  className="border-r-2 text-center"
                  style={{
                    borderColor: "var(--light-gray)",
                    backgroundColor: "var(--off-white)",
                    padding: "var(--space-sm)",
                  }}
                >
                  <div
                    className="font-bold"
                    style={{
                      fontSize: "var(--text-base)",
                      color: "var(--off-black)",
                      marginBottom: "2px",
                    }}
                  >
                    {analyticsLoading ? "..." : analyticsData?.engagementRate || "0%"}
                  </div>
                  <div
                    className="font-medium uppercase"
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--warm-gray)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Conversion
                  </div>
                </div>
                
                <div
                  className="text-center"
                  style={{
                    backgroundColor: "var(--off-white)",
                    padding: "var(--space-sm)",
                  }}
                >
                  <div
                    className="font-bold"
                    style={{
                      fontSize: "var(--text-base)",
                      color: "var(--primary)",
                      marginBottom: "2px",
                    }}
                  >
                    {analyticsLoading ? "..." : contentStats?.blogPosts || 0}
                  </div>
                  <div
                    className="font-medium uppercase"
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--warm-gray)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Total Posts
                  </div>
                </div>
              </div>
              
              {/* Top Performing Content */}
              <div
                className="font-medium uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--warm-gray)",
                  marginBottom: "var(--space-sm)",
                  letterSpacing: "0.05em",
                }}
              >
                Top Performing
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                {questionnaireAnalytics?.popularQuestions?.length ? (
                  questionnaireAnalytics.popularQuestions.slice(0, 3).map((item, index) => (
                  <div
                    key={index}
                    className="border-2"
                    style={{
                      borderColor: "var(--light-gray)",
                      backgroundColor: "var(--off-white)",
                      padding: "var(--space-sm)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "bold",
                            color: "var(--off-black)",
                            marginBottom: "2px",
                          }}
                        >
                          {item.title.length > 18 ? item.title.substring(0, 18) + "..." : item.title}
                        </h3>
                        <div
                          className="flex items-center"
                          style={{ gap: "var(--space-sm)" }}
                        >
                          <span
                            className="font-mono"
                            style={{
                              fontSize: "var(--text-xs)",
                              color: "var(--warm-gray)",
                            }}
                          >
                            {item.submissions} responses
                          </span>
                          <span
                            style={{
                              fontSize: "var(--text-xs)",
                              fontWeight: "bold",
                              color: "var(--primary)",
                              backgroundColor: "var(--light-gray)",
                              padding: "2px var(--space-xs)",
                            }}
                          >
                            {item.completionRate}%
                          </span>
                        </div>
                      </div>
                      <Eye size={14} style={{ color: "var(--warm-gray)" }} />
                    </div>
                  </div>
                  ))
                ) : (
                  <div className="py-4 text-center">
                    <div style={{ color: "var(--warm-gray)", fontSize: "var(--text-sm)" }}>
                      No questionnaire data yet
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Content Section */}
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
              <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
                <FileText size={20} style={{ color: "var(--primary)" }} />
                <h2
                  className="font-bold uppercase"
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--off-black)",
                  }}
                >
                  Content
                </h2>
              </div>
              <button
                className="flex items-center transition-colors"
                style={{
                  color: "var(--primary)",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  gap: "var(--space-xs)",
                }}
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div style={{ padding: "var(--space-md)" }}>
              {/* Content Stats */}
              <div
                className="grid grid-cols-2 gap-0"
                style={{
                  border: "2px solid var(--light-gray)",
                  marginBottom: "var(--space-md)",
                }}
              >
                <div
                  className="border-r-2 text-center"
                  style={{
                    borderColor: "var(--light-gray)",
                    backgroundColor: "var(--off-white)",
                    padding: "var(--space-sm)",
                  }}
                >
                  <div
                    className="font-bold"
                    style={{
                      fontSize: "var(--text-base)",
                      color: "var(--off-black)",
                      marginBottom: "2px",
                    }}
                  >
                    {contentStats?.blogPosts || 0}
                  </div>
                  <div
                    className="font-medium uppercase"
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--warm-gray)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Total Posts
                  </div>
                </div>
                
                <div
                  className="text-center"
                  style={{
                    backgroundColor: "var(--off-white)",
                    padding: "var(--space-sm)",
                  }}
                >
                  <div
                    className="font-bold"
                    style={{
                      fontSize: "var(--text-base)",
                      color: "var(--primary)",
                      marginBottom: "2px",
                    }}
                  >
                    {contentStats?.publishedPosts || 0}
                  </div>
                  <div
                    className="font-medium uppercase"
                    style={{
                      fontSize: "var(--text-xs)",
                      color: "var(--warm-gray)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Published
                  </div>
                </div>
              </div>
              
              {/* Recent Posts */}
              <div
                className="font-medium uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--warm-gray)",
                  marginBottom: "var(--space-sm)",
                  letterSpacing: "0.05em",
                }}
              >
                Recent Posts
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                {blogPosts?.posts?.length ? (
                  blogPosts.posts.map((post) => (
                    <div
                      key={post.id}
                      className="border-2"
                      style={{
                        borderColor: "var(--light-gray)",
                        backgroundColor: "var(--off-white)",
                        padding: "var(--space-sm)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "bold",
                              color: "var(--off-black)",
                              marginBottom: "2px",
                            }}
                          >
                            {post.title.length > 16 ? post.title.substring(0, 16) + "..." : post.title}
                          </h3>
                          <div
                            className="flex items-center"
                            style={{ gap: "var(--space-sm)" }}
                          >
                            <span
                              style={{
                                fontSize: "var(--text-xs)",
                                fontWeight: "bold",
                                color: post.status === 'published' ? "var(--primary)" : "var(--warm-gray)",
                                backgroundColor: "var(--light-gray)",
                                padding: "2px var(--space-xs)",
                                textTransform: "uppercase",
                              }}
                            >
                              {post.status}
                            </span>
                            <span
                              className="font-mono"
                              style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--warm-gray)",
                              }}
                            >
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/admin/posts/${post.id}`}
                          style={{ color: "var(--warm-gray)" }}
                        >
                          <Edit size={14} />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center">
                    <div style={{ color: "var(--warm-gray)", fontSize: "var(--text-sm)" }}>
                      No blog posts yet
                    </div>
                    <Link
                      href="/admin/posts/new"
                      className="mt-2 inline-flex items-center font-medium transition-colors"
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--primary)",
                        textDecoration: "none",
                        gap: "var(--space-xs)",
                      }}
                    >
                      <Plus size={12} />
                      Create First Post
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
