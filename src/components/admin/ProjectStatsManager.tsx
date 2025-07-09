"use client";

import React, { useState } from "react";
import { api } from "@/lib/trpc/react";
import {
  BarChart3,
  RefreshCw,
  Settings,
  Target,
  Clock,
  CheckCircle,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";

interface ProjectStatsManagerProps {
  userEmail: string;
}

export function ProjectStatsManager({ userEmail: _userEmail }: ProjectStatsManagerProps) {
  const [editingStatId, setEditingStatId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newStatData, setNewStatData] = useState({
    statKey: "",
    statValue: "",
    description: "",
  });

  // Get project stats and progress
  const { data: projectStats, refetch: refetchProjectStats } =
    api.content.getProjectStats.useQuery();
  const { data: projectProgress, refetch: refetchProjectProgress } =
    api.content.getProjectProgress.useQuery();
  const { data: projectTimeline, refetch: refetchTimeline } =
    api.content.getProjectTimeline.useQuery();

  // Mutations
  const refreshProgressMutation = api.content.refreshProjectProgress.useMutation();
  const createProjectStatMutation = api.content.createProjectStat.useMutation();
  const updateProjectStatMutation = api.content.updateProjectStat.useMutation();
  const deleteProjectStatMutation = api.content.deleteProjectStat.useMutation();

  const handleRefreshProgress = async () => {
    try {
      await refreshProgressMutation.mutateAsync();
      refetchProjectProgress();
      refetchTimeline();
    } catch (error) {
      console.error("Failed to refresh progress:", error);
    }
  };

  const handleEditStat = (statKey: string, currentValue: string, currentDescription: string) => {
    setEditingStatId(statKey);
    setEditingValues({
      [statKey]: currentValue,
      [`${statKey}_description`]: currentDescription || "",
    });
  };

  const handleSaveEdit = async (statKey: string) => {
    try {
      await updateProjectStatMutation.mutateAsync({
        statKey,
        statValue: editingValues[statKey],
        description: editingValues[`${statKey}_description`],
      });
      setEditingStatId(null);
      setEditingValues({});
      refetchProjectStats();
    } catch (error) {
      console.error("Failed to update project stat:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingStatId(null);
    setEditingValues({});
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewStatData({
      statKey: "",
      statValue: "",
      description: "",
    });
  };

  const handleSaveNew = async () => {
    try {
      await createProjectStatMutation.mutateAsync({
        statKey: newStatData.statKey,
        statValue: newStatData.statValue,
        description: newStatData.description,
      });
      setIsAddingNew(false);
      setNewStatData({
        statKey: "",
        statValue: "",
        description: "",
      });
      refetchProjectStats();
    } catch (error) {
      console.error("Failed to create project stat:", error);
    }
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewStatData({
      statKey: "",
      statValue: "",
      description: "",
    });
  };

  const handleDeleteStat = async (statKey: string) => {
    if (confirm(`Are you sure you want to delete the stat "${statKey}"?`)) {
      try {
        await deleteProjectStatMutation.mutateAsync({ statKey });
        refetchProjectStats();
      } catch (error) {
        console.error("Failed to delete project stat:", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Backend":
        return "bg-blue-100 text-blue-800";
      case "Frontend":
        return "bg-green-100 text-green-800";
      case "Features":
        return "bg-purple-100 text-purple-800";
      case "CMS":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
                Project Stats Manager
              </h1>
              <p style={{ fontSize: "var(--text-base)", color: "var(--warm-gray)" }}>
                Manage project statistics, milestones, and progress tracking
              </p>
            </div>

            <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
              <button
                onClick={handleRefreshProgress}
                disabled={refreshProgressMutation.isLoading}
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
                <RefreshCw
                  size={16}
                  className={refreshProgressMutation.isLoading ? "animate-spin" : ""}
                />
                Refresh Progress
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mx-auto max-w-7xl px-6"
        style={{ paddingTop: "var(--space-lg)", paddingBottom: "var(--space-lg)" }}
      >
        {/* Project Overview */}
        <div
          className="grid grid-cols-1 gap-0 lg:grid-cols-3"
          style={{ marginBottom: "var(--space-xl)" }}
        >
          {/* Overall Progress */}
          <div
            className="col-span-2 border-2 border-r-0"
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
                  Overall Progress
                </h2>
              </div>
            </div>

            <div style={{ padding: "var(--space-md)" }}>
              {projectProgress ? (
                <>
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span style={{ fontSize: "var(--text-sm)", color: "var(--warm-gray)" }}>
                        Project Completion
                      </span>
                      <span
                        className="font-mono font-bold"
                        style={{ fontSize: "var(--text-lg)", color: "var(--primary)" }}
                      >
                        {projectProgress.overallPercentage}%
                      </span>
                    </div>
                    <div
                      className="h-3 w-full rounded-full"
                      style={{ backgroundColor: "var(--light-gray)" }}
                    >
                      <div
                        className="h-3 rounded-full transition-all duration-1000"
                        style={{
                          width: `${projectProgress.overallPercentage}%`,
                          backgroundColor: "var(--primary)",
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div
                        className="font-mono font-bold"
                        style={{ fontSize: "var(--text-base)", color: "var(--primary)" }}
                      >
                        {projectProgress.completedTasks}
                      </div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--warm-gray)" }}>
                        Tasks Done
                      </div>
                    </div>
                    <div>
                      <div
                        className="font-mono font-bold"
                        style={{ fontSize: "var(--text-base)", color: "var(--primary)" }}
                      >
                        {projectProgress.totalTasks}
                      </div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--warm-gray)" }}>
                        Total Tasks
                      </div>
                    </div>
                    <div>
                      <div
                        className="font-mono font-bold"
                        style={{ fontSize: "var(--text-base)", color: "var(--primary)" }}
                      >
                        {projectProgress.currentPhase}
                      </div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--warm-gray)" }}>
                        Current Phase
                      </div>
                    </div>
                    <div>
                      <div
                        className="font-mono font-bold"
                        style={{ fontSize: "var(--text-base)", color: "var(--primary)" }}
                      >
                        {projectProgress.milestones.filter((m) => m.isCompleted).length}
                      </div>
                      <div style={{ fontSize: "var(--text-xs)", color: "var(--warm-gray)" }}>
                        Milestones Hit
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-4 text-center" style={{ color: "var(--warm-gray)" }}>
                  Loading project progress...
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
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
                  Quick Stats
                </h2>
              </div>
            </div>

            <div style={{ padding: "var(--space-md)" }}>
              {projectStats ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                  {Object.entries(projectStats).map(([key, stat]) => (
                    <div
                      key={key}
                      className="border-2"
                      style={{
                        borderColor: "var(--light-gray)",
                        backgroundColor: "var(--off-white)",
                        padding: "var(--space-sm)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div
                            className="font-medium"
                            style={{
                              fontSize: "var(--text-sm)",
                              color: "var(--off-black)",
                              marginBottom: "2px",
                            }}
                          >
                            {key.replace(/_/g, " ").toUpperCase()}
                          </div>
                          <div
                            className="font-mono font-bold"
                            style={{
                              fontSize: "var(--text-base)",
                              color: "var(--primary)",
                            }}
                          >
                            {stat.value}
                          </div>
                        </div>
                        <button
                          onClick={() => handleEditStat(key, stat.value, stat.description || "")}
                          className="transition-colors"
                          style={{
                            color: "var(--warm-gray)",
                            padding: "var(--space-xs)",
                          }}
                        >
                          <Edit3 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center" style={{ color: "var(--warm-gray)" }}>
                  Loading project stats...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Timeline */}
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
              <Clock size={20} style={{ color: "var(--primary)" }} />
              <h2
                className="font-bold uppercase"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--off-black)",
                }}
              >
                Project Timeline
              </h2>
            </div>
          </div>

          <div style={{ padding: "var(--space-md)" }}>
            {projectTimeline ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                {projectTimeline.events.map((event) => (
                  <div
                    key={event.id}
                    className="border-2"
                    style={{
                      borderColor: "var(--light-gray)",
                      backgroundColor: "var(--off-white)",
                      padding: "var(--space-sm)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div
                          className="flex items-center"
                          style={{ gap: "var(--space-sm)", marginBottom: "var(--space-xs)" }}
                        >
                          {event.status === "completed" ? (
                            <CheckCircle size={16} style={{ color: "var(--primary)" }} />
                          ) : (
                            <Clock size={16} style={{ color: "var(--warm-gray)" }} />
                          )}
                          <span
                            className="font-medium uppercase"
                            style={{
                              fontSize: "var(--text-xs)",
                              color: "var(--off-black)",
                            }}
                          >
                            {event.title}
                          </span>
                        </div>
                        <div style={{ fontSize: "var(--text-sm)", color: "var(--warm-gray)" }}>
                          {event.description}
                        </div>
                      </div>
                      <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium uppercase ${getStatusColor(event.status)}`}
                        >
                          {event.status.replace("_", " ")}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium uppercase ${getCategoryColor(event.category)}`}
                        >
                          {event.category}
                        </span>
                        <div
                          className="font-mono font-bold"
                          style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--primary)",
                          }}
                        >
                          {event.completionPercentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center" style={{ color: "var(--warm-gray)" }}>
                Loading project timeline...
              </div>
            )}
          </div>
        </div>

        {/* Custom Stats Management */}
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
              <Settings size={20} style={{ color: "var(--primary)" }} />
              <h2
                className="font-bold uppercase"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--off-black)",
                }}
              >
                Custom Stats Management
              </h2>
            </div>
            <button
              onClick={handleAddNew}
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
              <Plus size={16} />
              Add Stat
            </button>
          </div>

          <div style={{ padding: "var(--space-md)" }}>
            {/* Add New Stat Form */}
            {isAddingNew && (
              <div
                className="mb-4 border-2"
                style={{
                  borderColor: "var(--primary)",
                  backgroundColor: "var(--off-white)",
                  padding: "var(--space-md)",
                }}
              >
                <h3
                  className="mb-3 font-bold uppercase"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--off-black)",
                  }}
                >
                  Add New Stat
                </h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div>
                    <label
                      className="mb-1 block font-medium uppercase"
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--warm-gray)",
                      }}
                    >
                      Stat Key
                    </label>
                    <input
                      type="text"
                      value={newStatData.statKey}
                      onChange={(e) => setNewStatData({ ...newStatData, statKey: e.target.value })}
                      className="w-full font-mono"
                      style={{
                        fontSize: "var(--text-sm)",
                        padding: "var(--space-sm)",
                        border: "2px solid var(--light-gray)",
                        backgroundColor: "var(--off-white)",
                        color: "var(--off-black)",
                      }}
                      placeholder="e.g., total_features"
                    />
                  </div>
                  <div>
                    <label
                      className="mb-1 block font-medium uppercase"
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--warm-gray)",
                      }}
                    >
                      Value
                    </label>
                    <input
                      type="text"
                      value={newStatData.statValue}
                      onChange={(e) =>
                        setNewStatData({ ...newStatData, statValue: e.target.value })
                      }
                      className="w-full font-mono"
                      style={{
                        fontSize: "var(--text-sm)",
                        padding: "var(--space-sm)",
                        border: "2px solid var(--light-gray)",
                        backgroundColor: "var(--off-white)",
                        color: "var(--off-black)",
                      }}
                      placeholder="e.g., 42"
                    />
                  </div>
                  <div>
                    <label
                      className="mb-1 block font-medium uppercase"
                      style={{
                        fontSize: "var(--text-xs)",
                        color: "var(--warm-gray)",
                      }}
                    >
                      Description
                    </label>
                    <input
                      type="text"
                      value={newStatData.description}
                      onChange={(e) =>
                        setNewStatData({ ...newStatData, description: e.target.value })
                      }
                      className="w-full"
                      style={{
                        fontSize: "var(--text-sm)",
                        padding: "var(--space-sm)",
                        border: "2px solid var(--light-gray)",
                        backgroundColor: "var(--off-white)",
                        color: "var(--off-black)",
                      }}
                      placeholder="Optional description"
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center" style={{ gap: "var(--space-sm)" }}>
                  <button
                    onClick={handleSaveNew}
                    className="flex items-center font-medium uppercase transition-colors"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--off-white)",
                      backgroundColor: "var(--primary)",
                      padding: "var(--space-sm) var(--space-md)",
                      border: "2px solid var(--primary)",
                      gap: "var(--space-xs)",
                    }}
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={handleCancelNew}
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
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Existing Stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {projectStats ? (
                Object.entries(projectStats).map(([key, stat]) => (
                  <div
                    key={key}
                    className="border-2"
                    style={{
                      borderColor: editingStatId === key ? "var(--primary)" : "var(--light-gray)",
                      backgroundColor: "var(--off-white)",
                      padding: "var(--space-sm)",
                    }}
                  >
                    {editingStatId === key ? (
                      <div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div>
                            <label
                              className="mb-1 block font-medium uppercase"
                              style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--warm-gray)",
                              }}
                            >
                              Value
                            </label>
                            <input
                              type="text"
                              value={editingValues[key] || ""}
                              onChange={(e) =>
                                setEditingValues({ ...editingValues, [key]: e.target.value })
                              }
                              className="w-full font-mono"
                              style={{
                                fontSize: "var(--text-sm)",
                                padding: "var(--space-sm)",
                                border: "2px solid var(--light-gray)",
                                backgroundColor: "var(--off-white)",
                                color: "var(--off-black)",
                              }}
                            />
                          </div>
                          <div>
                            <label
                              className="mb-1 block font-medium uppercase"
                              style={{
                                fontSize: "var(--text-xs)",
                                color: "var(--warm-gray)",
                              }}
                            >
                              Description
                            </label>
                            <input
                              type="text"
                              value={editingValues[`${key}_description`] || ""}
                              onChange={(e) =>
                                setEditingValues({
                                  ...editingValues,
                                  [`${key}_description`]: e.target.value,
                                })
                              }
                              className="w-full"
                              style={{
                                fontSize: "var(--text-sm)",
                                padding: "var(--space-sm)",
                                border: "2px solid var(--light-gray)",
                                backgroundColor: "var(--off-white)",
                                color: "var(--off-black)",
                              }}
                            />
                          </div>
                        </div>
                        <div className="mt-3 flex items-center" style={{ gap: "var(--space-sm)" }}>
                          <button
                            onClick={() => handleSaveEdit(key)}
                            className="flex items-center font-medium uppercase transition-colors"
                            style={{
                              fontSize: "var(--text-sm)",
                              color: "var(--off-white)",
                              backgroundColor: "var(--primary)",
                              padding: "var(--space-sm) var(--space-md)",
                              border: "2px solid var(--primary)",
                              gap: "var(--space-xs)",
                            }}
                          >
                            <Save size={16} />
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
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
                            <X size={16} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div
                            className="font-medium uppercase"
                            style={{
                              fontSize: "var(--text-sm)",
                              color: "var(--off-black)",
                              marginBottom: "2px",
                            }}
                          >
                            {key.replace(/_/g, " ")}
                          </div>
                          <div
                            className="font-mono font-bold"
                            style={{
                              fontSize: "var(--text-base)",
                              color: "var(--primary)",
                              marginBottom: "2px",
                            }}
                          >
                            {stat.value}
                          </div>
                          {stat.description && (
                            <div style={{ fontSize: "var(--text-xs)", color: "var(--warm-gray)" }}>
                              {stat.description}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center" style={{ gap: "var(--space-xs)" }}>
                          <button
                            onClick={() => handleEditStat(key, stat.value, stat.description || "")}
                            className="transition-colors"
                            style={{
                              color: "var(--warm-gray)",
                              padding: "var(--space-xs)",
                            }}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteStat(key)}
                            className="transition-colors"
                            style={{
                              color: "var(--warm-gray)",
                              padding: "var(--space-xs)",
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-4 text-center" style={{ color: "var(--warm-gray)" }}>
                  No custom stats found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
