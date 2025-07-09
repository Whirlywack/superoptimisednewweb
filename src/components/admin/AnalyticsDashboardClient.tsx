"use client";

import { api } from "@/lib/trpc/react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Target,
  ArrowUp,
  ArrowDown,
  Download,
  Calendar,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface AnalyticsDashboardClientProps {
  userEmail: string;
}

export function AnalyticsDashboardClient({ userEmail: _userEmail }: AnalyticsDashboardClientProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");

  // Real analytics data from tRPC
  const { data: websiteStats, isLoading: websiteLoading } = api.analytics.getWebsiteStats.useQuery();
  const { data: questionnaireStats, isLoading: questionnaireLoading } = api.questionnaire.getStats.useQuery();
  const { data: topPages } = api.analytics.getTopPages.useQuery();
  const { data: questionnaireAnalytics } = api.analytics.getQuestionnaireAnalytics.useQuery();
  const { data: trafficData } = api.analytics.getTrafficOverTime.useQuery({ period: selectedTimeRange as "7d" | "30d" | "90d" });

  // Fallback analytics data for gradual migration
  const analyticsData = {
    websiteTraffic: {
      pageViews: websiteStats?.totalVisitors || 15420,
      uniqueVisitors: websiteStats?.totalVisitors || 4285,
      sessions: 5890,
      avgSessionDuration: "4m 32s",
      bounceRate: "34.5%",
      conversionRate: websiteStats?.engagementRate || "12.4%",
    },
    questionnaireMetrics: {
      totalQuestionnaires: questionnaireStats?.activeQuestionnaires || 0,
      totalResponses: questionnaireAnalytics?.totalSubmissions || questionnaireStats?.totalResponses || 0,
      avgCompletionRate: questionnaireAnalytics?.avgCompletionRate ? `${questionnaireAnalytics.avgCompletionRate}%` : "78.3%",
      avgResponseTime: "2m 15s",
    },
    topPages: topPages || [
      { page: "/", views: 4520, change: "+12.3%" },
      { page: "/research", views: 3850, change: "+8.7%" },
      { page: "/journey", views: 2440, change: "+15.2%" },
      { page: "/about", views: 1890, change: "+3.1%" },
    ],
    topQuestionnaires: questionnaireAnalytics?.popularQuestions || [
      { title: "Product Feature Survey", submissions: 245, completionRate: 89 },
      { title: "User Experience Research", submissions: 189, completionRate: 76 },
      { title: "Market Analysis Survey", submissions: 156, completionRate: 82 },
    ],
  };

  const timeRanges = [
    { id: "24h", label: "24 Hours" },
    { id: "7d", label: "7 Days" },
    { id: "30d", label: "30 Days" },
    { id: "90d", label: "90 Days" },
  ];

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
                Analytics Dashboard
              </h1>
              <p style={{ fontSize: "var(--text-base)", color: "var(--warm-gray)" }}>
                Website traffic, questionnaire performance, user engagement
              </p>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
              <div className="flex" style={{ gap: "0" }}>
                {timeRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setSelectedTimeRange(range.id)}
                    className="font-medium uppercase transition-colors"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: selectedTimeRange === range.id ? "var(--off-white)" : "var(--off-black)",
                      backgroundColor: selectedTimeRange === range.id ? "var(--off-black)" : "var(--light-gray)",
                      padding: "var(--space-sm) var(--space-md)",
                      border: "2px solid var(--light-gray)",
                      borderRight: range.id === "90d" ? "2px solid var(--light-gray)" : "1px solid var(--light-gray)",
                    }}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
              
              <button
                className="flex items-center font-medium uppercase transition-colors"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--off-black)",
                  backgroundColor: "var(--light-gray)",
                  padding: "var(--space-sm) var(--space-md)",
                  border: "2px solid var(--light-gray)",
                  gap: "var(--space-xs)",
                }}
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mx-auto max-w-7xl px-6"
        style={{ paddingTop: "var(--space-lg)", paddingBottom: "var(--space-lg)" }}
      >
        {/* Key Metrics Grid */}
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            marginBottom: "var(--space-xl)",
            border: "2px solid var(--light-gray)",
          }}
        >
          {/* Website Traffic */}
          <div
            className="border-r-2 text-center"
            style={{
              borderColor: "var(--light-gray)",
              backgroundColor: "var(--off-white)",
              padding: "var(--space-md)",
            }}
          >
            <div className="flex items-center justify-center" style={{ marginBottom: "var(--space-sm)" }}>
              <Eye size={20} style={{ color: "var(--primary)", marginRight: "var(--space-xs)" }} />
              <span
                className="font-medium uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--warm-gray)",
                  letterSpacing: "0.05em",
                }}
              >
                Page Views
              </span>
            </div>
            <div
              className="font-bold"
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--off-black)",
                marginBottom: "var(--space-xs)",
              }}
            >
              {websiteLoading ? "..." : analyticsData.websiteTraffic.pageViews.toLocaleString()}
            </div>
            <div className="flex items-center justify-center" style={{ gap: "var(--space-xs)" }}>
              <ArrowUp size={12} style={{ color: "var(--primary)" }} />
              <span style={{ fontSize: "var(--text-xs)", color: "var(--primary)" }}>+12.3%</span>
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
            <div className="flex items-center justify-center" style={{ marginBottom: "var(--space-sm)" }}>
              <Users size={20} style={{ color: "var(--primary)", marginRight: "var(--space-xs)" }} />
              <span
                className="font-medium uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--warm-gray)",
                  letterSpacing: "0.05em",
                }}
              >
                Unique Visitors
              </span>
            </div>
            <div
              className="font-bold"
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--off-black)",
                marginBottom: "var(--space-xs)",
              }}
            >
              {websiteLoading ? "..." : analyticsData.websiteTraffic.uniqueVisitors.toLocaleString()}
            </div>
            <div className="flex items-center justify-center" style={{ gap: "var(--space-xs)" }}>
              <ArrowUp size={12} style={{ color: "var(--primary)" }} />
              <span style={{ fontSize: "var(--text-xs)", color: "var(--primary)" }}>+8.7%</span>
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
            <div className="flex items-center justify-center" style={{ marginBottom: "var(--space-sm)" }}>
              <Target size={20} style={{ color: "var(--primary)", marginRight: "var(--space-xs)" }} />
              <span
                className="font-medium uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--warm-gray)",
                  letterSpacing: "0.05em",
                }}
              >
                Conversion Rate
              </span>
            </div>
            <div
              className="font-bold"
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--off-black)",
                marginBottom: "var(--space-xs)",
              }}
            >
              {websiteLoading ? "..." : analyticsData.websiteTraffic.conversionRate}
            </div>
            <div className="flex items-center justify-center" style={{ gap: "var(--space-xs)" }}>
              <ArrowUp size={12} style={{ color: "var(--primary)" }} />
              <span style={{ fontSize: "var(--text-xs)", color: "var(--primary)" }}>+2.1%</span>
            </div>
          </div>

          <div
            className="text-center"
            style={{
              backgroundColor: "var(--off-white)",
              padding: "var(--space-md)",
            }}
          >
            <div className="flex items-center justify-center" style={{ marginBottom: "var(--space-sm)" }}>
              <Clock size={20} style={{ color: "var(--primary)", marginRight: "var(--space-xs)" }} />
              <span
                className="font-medium uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--warm-gray)",
                  letterSpacing: "0.05em",
                }}
              >
                Avg Session
              </span>
            </div>
            <div
              className="font-bold"
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--off-black)",
                marginBottom: "var(--space-xs)",
              }}
            >
              {websiteLoading ? "..." : analyticsData.websiteTraffic.avgSessionDuration}
            </div>
            <div className="flex items-center justify-center" style={{ gap: "var(--space-xs)" }}>
              <ArrowUp size={12} style={{ color: "var(--primary)" }} />
              <span style={{ fontSize: "var(--text-xs)", color: "var(--primary)" }}>+5.4%</span>
            </div>
          </div>
        </div>

        {/* Analytics Content Grid */}
        <div
          className="grid grid-cols-1 gap-0 lg:grid-cols-2"
          style={{ marginBottom: "var(--space-xl)" }}
        >
          {/* Top Pages */}
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
                <TrendingUp size={20} style={{ color: "var(--primary)" }} />
                <h2
                  className="font-bold uppercase"
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--off-black)",
                  }}
                >
                  Top Pages
                </h2>
              </div>
            </div>
            
            <div style={{ padding: "var(--space-md)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                {analyticsData.topPages.map((page, index) => (
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
                          className="font-mono"
                          style={{
                            fontSize: "var(--text-sm)",
                            fontWeight: "bold",
                            color: "var(--off-black)",
                            marginBottom: "2px",
                          }}
                        >
                          {page.page || (page as any).path}
                        </h3>
                        <div
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--warm-gray)",
                          }}
                        >
                          {(page.views || 0).toLocaleString()} views
                        </div>
                      </div>
                      <div className="flex items-center" style={{ gap: "var(--space-xs)" }}>
                        <ArrowUp size={12} style={{ color: "var(--primary)" }} />
                        <span
                          style={{
                            fontSize: "var(--text-xs)",
                            fontWeight: "bold",
                            color: "var(--primary)",
                          }}
                        >
                          {page.change}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Questionnaire Performance */}
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
                <BarChart3 size={20} style={{ color: "var(--primary)" }} />
                <h2
                  className="font-bold uppercase"
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--off-black)",
                  }}
                >
                  Questionnaire Performance
                </h2>
              </div>
            </div>
            
            <div style={{ padding: "var(--space-md)" }}>
              {/* Questionnaire Metrics */}
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
                    {questionnaireLoading ? "..." : analyticsData.questionnaireMetrics.totalResponses}
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
                    {questionnaireLoading ? "..." : analyticsData.questionnaireMetrics.avgCompletionRate}
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

              {/* Top Questionnaires */}
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
                {analyticsData.topQuestionnaires.map((questionnaire, index) => (
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
                          {questionnaire.title.length > 20 ? questionnaire.title.substring(0, 20) + "..." : questionnaire.title}
                        </h3>
                        <div
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--warm-gray)",
                          }}
                        >
                          {questionnaire.submissions || (questionnaire as any).responses || 0} {questionnaire.submissions ? 'submissions' : 'responses'}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          fontWeight: "bold",
                          color: "var(--primary)",
                          backgroundColor: "var(--light-gray)",
                          padding: "2px var(--space-xs)",
                        }}
                      >
                        {questionnaire.completionRate ? `${questionnaire.completionRate}%` : (questionnaire as any).completion || "N/A"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon - Charts */}
        <div
          className="border-2 text-center"
          style={{
            borderColor: "var(--light-gray)",
            backgroundColor: "var(--off-white)",
            padding: "var(--space-xl)",
          }}
        >
          <Zap size={32} style={{ color: "var(--primary)", margin: "0 auto var(--space-md)" }} />
          <h3
            className="font-bold uppercase"
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--off-black)",
              marginBottom: "var(--space-sm)",
            }}
          >
            Real-time Charts Coming Soon
          </h3>
          <p
            style={{
              fontSize: "var(--text-base)",
              color: "var(--warm-gray)",
              marginBottom: "var(--space-md)",
            }}
          >
            Interactive charts, trend analysis, and detailed analytics visualization
          </p>
          <div
            className="font-mono"
            style={{
              fontSize: "var(--text-sm)",
              color: "var(--warm-gray)",
            }}
          >
            Phase 8.4: Chart.js integration with real-time data streams
          </div>
        </div>
      </div>
    </div>
  );
}