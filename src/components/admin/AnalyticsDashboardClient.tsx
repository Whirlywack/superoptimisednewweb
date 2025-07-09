"use client";

import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Target,
  ArrowUp,
  Download,
} from "lucide-react";
import { useState } from "react";
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
  
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Demo analytics data (clearly marked as demo)
  const demoAnalyticsData = {
    websiteTraffic: {
      pageViews: 1247,
      uniqueVisitors: 1247,
      sessions: 5890,
      avgSessionDuration: "4m 32s",
      bounceRate: "34.5%",
      conversionRate: "73%",
    },
    questionnaireMetrics: {
      totalQuestionnaires: 42,
      totalResponses: 389,
      avgCompletionRate: "73%",
      avgResponseTime: "2m 15s",
    },
    topPages: [
      { page: "/", views: 1247, change: "+12%" },
      { page: "/journey", views: 834, change: "+8%" },
      { page: "/about", views: 567, change: "+15%" },
      { page: "/research", views: 342, change: "+23%" },
      { page: "/admin", views: 189, change: "+31%" },
    ],
    topQuestionnaires: [
      { title: "What's your experience level?", submissions: 156, completionRate: 89 },
      { title: "Rate our service", submissions: 143, completionRate: 82 },
      { title: "Additional feedback", submissions: 98, completionRate: 67 },
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
                Analytics Dashboard {isDevelopment && "(DEMO)"}
              </h1>
              <p style={{ fontSize: "var(--text-base)", color: "var(--warm-gray)" }}>
                {isDevelopment 
                  ? "Simulated analytics data for development and testing" 
                  : "Website traffic, questionnaire performance, user engagement"}
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
              {demoAnalyticsData.websiteTraffic.pageViews.toLocaleString()}
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
              {demoAnalyticsData.websiteTraffic.uniqueVisitors.toLocaleString()}
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
              {demoAnalyticsData.websiteTraffic.conversionRate}
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
              {demoAnalyticsData.websiteTraffic.avgSessionDuration}
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
                {demoAnalyticsData.topPages.map((page, index) => (
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
                    {demoAnalyticsData.questionnaireMetrics.totalResponses}
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
                    {demoAnalyticsData.questionnaireMetrics.avgCompletionRate}
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
                {demoAnalyticsData.topQuestionnaires.map((questionnaire, index) => (
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

        {/* Charts Section */}
        <div
          className="grid grid-cols-1 gap-0 lg:grid-cols-2"
          style={{ marginBottom: "var(--space-xl)" }}
        >
          {/* Traffic Over Time Chart */}
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
                  Traffic Over Time
                </h2>
              </div>
            </div>
            
            <div style={{ padding: "var(--space-md)", height: "300px" }}>
              <Line
                data={{
                  labels: ["Jul 3", "Jul 4", "Jul 5", "Jul 6", "Jul 7", "Jul 8", "Jul 9"],
                  datasets: [
                    {
                      label: "Visitors",
                      data: [180, 150, 120, 160, 140, 170, 155],
                      backgroundColor: "rgba(99, 102, 241, 0.1)",
                      borderColor: "rgb(99, 102, 241)",
                      borderWidth: 2,
                      fill: true,
                      tension: 0.4,
                    },
                    {
                      label: "Submissions",
                      data: [35, 30, 25, 32, 28, 34, 31],
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      borderColor: "rgb(16, 185, 129)",
                      borderWidth: 2,
                      fill: true,
                      tension: 0.4,
                    }
                  ]
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
                  Question Types
                </h2>
              </div>
            </div>
            
            <div style={{ padding: "var(--space-md)", height: "300px" }}>
              <Doughnut
                data={{
                  labels: ["Multiple Choice", "Text Input", "Rating", "Yes/No", "Ranking"],
                  datasets: [{
                    data: [15, 12, 8, 5, 2],
                    backgroundColor: [
                      "#6366f1", // Multiple Choice
                      "#10b981", // Text Input  
                      "#f59e0b", // Rating
                      "#ef4444", // Yes/No
                      "#8b5cf6", // Ranking
                    ],
                    borderWidth: 2,
                    borderColor: "#ffffff",
                  }]
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
            </div>
          </div>
        </div>

        {/* Questionnaire Performance Chart */}
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
                Top Questionnaire Performance
              </h2>
            </div>
          </div>
          
          <div style={{ padding: "var(--space-md)", height: "300px" }}>
            <Bar
              data={{
                labels: ["What's your experien...", "Rate our service", "Additional feedback"],
                datasets: [
                  {
                    label: "Submissions",
                    data: [156, 143, 98],
                    backgroundColor: "rgba(99, 102, 241, 0.8)",
                    borderColor: "rgb(99, 102, 241)",
                    borderWidth: 2,
                  },
                  {
                    label: "Completion Rate (%)",
                    data: [89, 82, 67],
                    backgroundColor: "rgba(16, 185, 129, 0.8)",
                    borderColor: "rgb(16, 185, 129)",
                    borderWidth: 2,
                    yAxisID: "y1",
                  }
                ]
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
                      text: "Submissions",
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
          </div>
        </div>
      </div>
    </div>
  );
}