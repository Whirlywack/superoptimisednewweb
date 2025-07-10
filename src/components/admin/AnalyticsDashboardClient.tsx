"use client";

import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  ArrowUp,
  Download,
  RefreshCw,
  Activity,
  Award,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/trpc/react";
import dynamic from "next/dynamic";

// Dynamically import Chart.js components to avoid SSR issues
const Line = dynamic(() => import("react-chartjs-2").then((mod) => mod.Line), {
  ssr: false,
});
const Bar = dynamic(() => import("react-chartjs-2").then((mod) => mod.Bar), {
  ssr: false,
});
const Doughnut = dynamic(() => import("react-chartjs-2").then((mod) => mod.Doughnut), {
  ssr: false,
});

// Register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsDashboardClientProps {
  userEmail: string;
}

export function AnalyticsDashboardClient({ userEmail: _userEmail }: AnalyticsDashboardClientProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const isDevelopment = process.env.NODE_ENV === "development";

  // Real analytics data from tRPC
  const { data: websiteStats } = api.analytics.getWebsiteStats.useQuery();
  const { data: questionnaireAnalytics } = api.analytics.getQuestionnaireAnalytics.useQuery();
  const { data: _trafficData } = api.analytics.getTrafficOverTime.useQuery({
    timeRange: selectedTimeRange as "24h" | "7d" | "30d" | "90d",
  });
  const { data: topPages } = api.analytics.getTopPages.useQuery();

  // New real-time voting analytics
  const { data: votingAnalytics, refetch: refetchVoting } =
    api.analytics.getVotingAnalytics.useQuery({
      timeRange: selectedTimeRange as "24h" | "7d" | "30d" | "90d",
    });
  const { data: communityEngagement } = api.analytics.getCommunityEngagement.useQuery();
  const { data: questionPerformance } = api.analytics.getQuestionPerformance.useQuery();

  // Export functionality
  const exportDataMutation = api.analytics.exportVotingData.useMutation();

  // Real analytics data structure
  const analyticsData = {
    websiteTraffic: {
      pageViews: websiteStats?.pageViews || 0,
      uniqueVisitors: websiteStats?.uniqueVisitors || 0,
      sessions: websiteStats?.sessions || 0,
      avgSessionDuration: websiteStats?.avgSessionDuration || "0m 0s",
      bounceRate: websiteStats?.bounceRate || "0%",
      conversionRate: websiteStats?.conversionRate || "0%",
    },
    questionnaireMetrics: {
      totalQuestionnaires: questionnaireAnalytics?.totalQuestionnaires || 0,
      totalResponses: questionnaireAnalytics?.totalResponses || 0,
      avgCompletionRate: questionnaireAnalytics?.avgCompletionRate || "0%",
      avgResponseTime: questionnaireAnalytics?.avgResponseTime || "0m 0s",
    },
    topPages: topPages || [],
    topQuestionnaires: questionnaireAnalytics?.topQuestionnaires || [],
  };

  const timeRanges = [
    { id: "24h", label: "24 Hours" },
    { id: "7d", label: "7 Days" },
    { id: "30d", label: "30 Days" },
    { id: "90d", label: "90 Days" },
  ];

  // Export handler
  const handleExport = async () => {
    try {
      const result = await exportDataMutation.mutateAsync({
        format: "csv",
        timeRange: selectedTimeRange as "24h" | "7d" | "30d" | "90d",
        includeResponses: true,
        includeVoterInfo: false,
      });

      if (result.content && result.filename) {
        // Create download link
        const blob = new Blob([result.content], {
          type: result.format === "csv" ? "text/csv" : "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--off-white)" }}>
      {/* Development Mode Banner */}
      {isDevelopment && (
        <div
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--off-white)",
            padding: "var(--space-sm)",
            textAlign: "center",
            fontSize: "var(--text-sm)",
            fontWeight: "bold",
          }}
        >
          📊 DEMO MODE - Analytics data shown below is simulated for development purposes
        </div>
      )}

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
                      color:
                        selectedTimeRange === range.id ? "var(--off-white)" : "var(--off-black)",
                      backgroundColor:
                        selectedTimeRange === range.id ? "var(--off-black)" : "var(--light-gray)",
                      padding: "var(--space-sm) var(--space-md)",
                      border: "2px solid var(--light-gray)",
                      borderRight:
                        range.id === "90d"
                          ? "2px solid var(--light-gray)"
                          : "1px solid var(--light-gray)",
                    }}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => refetchVoting()}
                className="flex items-center font-medium uppercase transition-colors hover:bg-gray-200"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--off-black)",
                  backgroundColor: "var(--light-gray)",
                  padding: "var(--space-sm) var(--space-md)",
                  border: "2px solid var(--light-gray)",
                  gap: "var(--space-xs)",
                  marginRight: "var(--space-sm)",
                }}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button
                onClick={handleExport}
                disabled={exportDataMutation.isPending}
                className="flex items-center font-medium uppercase transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
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
                {exportDataMutation.isPending ? "Exporting..." : "Export CSV"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mx-auto max-w-7xl px-6"
        style={{ paddingTop: "var(--space-lg)", paddingBottom: "var(--space-lg)" }}
      >
        {/* Real-time Voting Metrics Grid */}
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            marginBottom: "var(--space-xl)",
            border: "2px solid var(--light-gray)",
          }}
        >
          {/* Total Votes */}
          <div
            className="border-r-2 text-center"
            style={{
              borderColor: "var(--light-gray)",
              backgroundColor: "var(--off-white)",
              padding: "var(--space-md)",
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{ marginBottom: "var(--space-sm)" }}
            >
              <Activity
                size={20}
                style={{ color: "var(--primary)", marginRight: "var(--space-xs)" }}
              />
              <span
                className="font-medium uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--warm-gray)",
                  letterSpacing: "0.05em",
                }}
              >
                Total Votes
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
              {votingAnalytics?.summary.totalVotes.toLocaleString() || "0"}
            </div>
            <div className="flex items-center justify-center" style={{ gap: "var(--space-xs)" }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--warm-gray)" }}>
                {selectedTimeRange}
              </span>
            </div>
          </div>

          {/* Unique Voters */}
          <div
            className="border-r-2 text-center"
            style={{
              borderColor: "var(--light-gray)",
              backgroundColor: "var(--off-white)",
              padding: "var(--space-md)",
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{ marginBottom: "var(--space-sm)" }}
            >
              <Users
                size={20}
                style={{ color: "var(--primary)", marginRight: "var(--space-xs)" }}
              />
              <span
                className="font-medium uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--warm-gray)",
                  letterSpacing: "0.05em",
                }}
              >
                Unique Voters
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
              {votingAnalytics?.summary.uniqueVoters.toLocaleString() || "0"}
            </div>
            <div className="flex items-center justify-center" style={{ gap: "var(--space-xs)" }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--warm-gray)" }}>
                {votingAnalytics?.summary.avgVotesPerHour.toFixed(1) || "0"} votes/hr
              </span>
            </div>
          </div>

          {/* Active Users */}
          <div
            className="border-r-2 text-center"
            style={{
              borderColor: "var(--light-gray)",
              backgroundColor: "var(--off-white)",
              padding: "var(--space-md)",
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{ marginBottom: "var(--space-sm)" }}
            >
              <Zap size={20} style={{ color: "var(--primary)", marginRight: "var(--space-xs)" }} />
              <span
                className="font-medium uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--warm-gray)",
                  letterSpacing: "0.05em",
                }}
              >
                Active Users
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
              {communityEngagement?.metrics.totalActiveUsers.toLocaleString() || "0"}
            </div>
            <div className="flex items-center justify-center" style={{ gap: "var(--space-xs)" }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--primary)" }}>
                {communityEngagement?.metrics.retentionRate || 0}% retention
              </span>
            </div>
          </div>

          {/* Average Streak */}
          <div
            className="border-r-2 text-center"
            style={{
              borderColor: "var(--light-gray)",
              backgroundColor: "var(--off-white)",
              padding: "var(--space-md)",
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{ marginBottom: "var(--space-sm)" }}
            >
              <Award
                size={20}
                style={{ color: "var(--primary)", marginRight: "var(--space-xs)" }}
              />
              <span
                className="font-medium uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--warm-gray)",
                  letterSpacing: "0.05em",
                }}
              >
                Avg Streak
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
              {communityEngagement?.metrics.avgCurrentStreak.toFixed(1) || "0"}
            </div>
            <div className="flex items-center justify-center" style={{ gap: "var(--space-xs)" }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--warm-gray)" }}>
                Max: {communityEngagement?.metrics.longestStreak || 0} days
              </span>
            </div>
          </div>

          {/* Total XP */}
          <div
            className="text-center"
            style={{
              backgroundColor: "var(--off-white)",
              padding: "var(--space-md)",
            }}
          >
            <div
              className="flex items-center justify-center"
              style={{ marginBottom: "var(--space-sm)" }}
            >
              <Target
                size={20}
                style={{ color: "var(--primary)", marginRight: "var(--space-xs)" }}
              />
              <span
                className="font-medium uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--warm-gray)",
                  letterSpacing: "0.05em",
                }}
              >
                Total XP
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
              {communityEngagement?.metrics.totalXpAwarded.toLocaleString() || "0"}
            </div>
            <div className="flex items-center justify-center" style={{ gap: "var(--space-xs)" }}>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--warm-gray)" }}>
                Last 30 days
              </span>
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
                {analyticsData.topPages.length === 0 ? (
                  <div className="py-4 text-center" style={{ color: "var(--warm-gray)" }}>
                    No page views yet
                  </div>
                ) : (
                  analyticsData.topPages.map((page, index) => (
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
                            {page.page || (page as { path?: string }).path}
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
                  ))
                )}
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
                    {analyticsData.questionnaireMetrics.totalResponses}
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
                    {analyticsData.questionnaireMetrics.avgCompletionRate}
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
                {analyticsData.topQuestionnaires.length === 0 ? (
                  <div className="py-4 text-center" style={{ color: "var(--warm-gray)" }}>
                    No questionnaire responses yet
                  </div>
                ) : (
                  analyticsData.topQuestionnaires.map((questionnaire, index) => (
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
                            {questionnaire.title.length > 20
                              ? questionnaire.title.substring(0, 20) + "..."
                              : questionnaire.title}
                          </h3>
                          <div
                            style={{
                              fontSize: "var(--text-xs)",
                              color: "var(--warm-gray)",
                            }}
                          >
                            {questionnaire.submissions ||
                              (questionnaire as { responses?: number }).responses ||
                              0}{" "}
                            {questionnaire.submissions ? "submissions" : "responses"}
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
                          {questionnaire.completionRate
                            ? `${questionnaire.completionRate}%`
                            : (questionnaire as { completion?: string }).completion || "N/A"}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Voting Charts Section */}
        <div
          className="grid grid-cols-1 gap-0 lg:grid-cols-2"
          style={{ marginBottom: "var(--space-xl)" }}
        >
          {/* Real-Time Voting Activity Chart */}
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
                <Activity size={20} style={{ color: "var(--primary)" }} />
                <h2
                  className="font-bold uppercase"
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--off-black)",
                  }}
                >
                  Real-Time Voting Activity
                </h2>
              </div>
            </div>

            <div style={{ padding: "var(--space-md)", height: "300px" }}>
              {votingAnalytics?.chartData ? (
                <Line
                  data={votingAnalytics.chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                        labels: {
                          usePointStyle: true,
                          font: { size: 12 },
                        },
                      },
                    },
                    scales: {
                      x: {
                        grid: { display: false },
                        ticks: { font: { size: 11 } },
                      },
                      y: {
                        beginAtZero: true,
                        grid: { color: "#f3f4f6" },
                        ticks: { font: { size: 11 } },
                      },
                    },
                    elements: {
                      point: { radius: 3, hoverRadius: 6 },
                    },
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  Loading voting data...
                </div>
              )}
            </div>
          </div>

          {/* Question Types Distribution */}
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
                  Question Types Distribution
                </h2>
              </div>
            </div>

            <div style={{ padding: "var(--space-md)", height: "300px" }}>
              {votingAnalytics?.questionTypeBreakdown ? (
                <Doughnut
                  data={{
                    labels: Object.keys(votingAnalytics.questionTypeBreakdown).map((key) => {
                      const labels: Record<string, string> = {
                        binary: "Yes/No",
                        multiChoice: "Multiple Choice",
                        rating: "Rating Scale",
                        text: "Text Response",
                        ranking: "Ranking",
                        abTest: "A/B Test",
                      };
                      return labels[key] || key;
                    }),
                    datasets: [
                      {
                        data: Object.values(votingAnalytics.questionTypeBreakdown),
                        backgroundColor: [
                          "#6366f1", // Binary
                          "#10b981", // Multi Choice
                          "#f59e0b", // Rating
                          "#ef4444", // Text
                          "#8b5cf6", // Ranking
                          "#06b6d4", // A/B Test
                        ],
                        borderWidth: 2,
                        borderColor: "#ffffff",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right",
                        labels: {
                          usePointStyle: true,
                          font: { size: 12 },
                          padding: 15,
                        },
                      },
                    },
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  Loading question type data...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Community Engagement Charts */}
        <div
          className="grid grid-cols-1 gap-0 lg:grid-cols-2"
          style={{ marginBottom: "var(--space-xl)" }}
        >
          {/* XP Trend Chart */}
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
                <Award size={20} style={{ color: "var(--primary)" }} />
                <h2
                  className="font-bold uppercase"
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--off-black)",
                  }}
                >
                  XP Trends (7 Days)
                </h2>
              </div>
            </div>

            <div style={{ padding: "var(--space-md)", height: "300px" }}>
              {communityEngagement?.xpTrendData ? (
                <Line
                  data={communityEngagement.xpTrendData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                        labels: {
                          usePointStyle: true,
                          font: { size: 12 },
                        },
                      },
                    },
                    scales: {
                      x: {
                        grid: { display: false },
                        ticks: { font: { size: 11 } },
                      },
                      y: {
                        beginAtZero: true,
                        grid: { color: "#f3f4f6" },
                        ticks: { font: { size: 11 } },
                      },
                    },
                    elements: {
                      point: { radius: 4, hoverRadius: 7 },
                    },
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  Loading XP trend data...
                </div>
              )}
            </div>
          </div>

          {/* Streak Distribution */}
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
                <Zap size={20} style={{ color: "var(--primary)" }} />
                <h2
                  className="font-bold uppercase"
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--off-black)",
                  }}
                >
                  User Streak Distribution
                </h2>
              </div>
            </div>

            <div style={{ padding: "var(--space-md)", height: "300px" }}>
              {communityEngagement?.streakDistribution ? (
                <Doughnut
                  data={communityEngagement.streakDistribution}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "right",
                        labels: {
                          usePointStyle: true,
                          font: { size: 12 },
                          padding: 15,
                        },
                      },
                    },
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  Loading streak data...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question Performance Chart */}
        <div
          className="border-2"
          style={{
            borderColor: "var(--light-gray)",
            backgroundColor: "var(--off-white)",
            marginBottom: "var(--space-xl)",
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
                Top Question Performance
              </h2>
            </div>
          </div>

          <div style={{ padding: "var(--space-md)", height: "300px" }}>
            {questionPerformance?.topPerforming && questionPerformance.topPerforming.length > 0 ? (
              <Bar
                data={{
                  labels: questionPerformance.topPerforming.slice(0, 5).map((q) => q.title),
                  datasets: [
                    {
                      label: "Total Responses",
                      data: questionPerformance.topPerforming
                        .slice(0, 5)
                        .map((q) => q.totalResponses),
                      backgroundColor: "rgba(99, 102, 241, 0.8)",
                      borderColor: "rgb(99, 102, 241)",
                      borderWidth: 2,
                    },
                    {
                      label: "Completion Rate (%)",
                      data: questionPerformance.topPerforming
                        .slice(0, 5)
                        .map((q) => q.completionRate),
                      backgroundColor: "rgba(16, 185, 129, 0.8)",
                      borderColor: "rgb(16, 185, 129)",
                      borderWidth: 2,
                      yAxisID: "y1",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        usePointStyle: true,
                        font: { size: 12 },
                      },
                    },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { font: { size: 11 } },
                    },
                    y: {
                      type: "linear",
                      display: true,
                      position: "left",
                      beginAtZero: true,
                      grid: { color: "#f3f4f6" },
                      ticks: { font: { size: 11 } },
                      title: {
                        display: true,
                        text: "Total Responses",
                        font: { size: 12 },
                      },
                    },
                    y1: {
                      type: "linear",
                      display: true,
                      position: "right",
                      beginAtZero: true,
                      max: 100,
                      grid: { drawOnChartArea: false },
                      ticks: { font: { size: 11 } },
                      title: {
                        display: true,
                        text: "Completion Rate (%)",
                        font: { size: 12 },
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                Loading question performance data...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
