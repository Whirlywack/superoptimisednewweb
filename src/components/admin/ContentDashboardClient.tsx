"use client";

import { api } from "@/lib/trpc/react";
import {
  FileText,
  Plus,
  Edit,
  Eye,
  Copy,
  Upload,
  Settings,
  Search,
  MoreHorizontal,
  ExternalLink,
  Blocks,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ContentBlockEditor } from "./ContentBlockEditor";
import { ProjectStatsManager } from "./ProjectStatsManager";
import { ContentPreviewWorkflow } from "./ContentPreviewWorkflow";

interface ContentDashboardClientProps {
  userEmail: string;
}

export function ContentDashboardClient({ userEmail }: ContentDashboardClientProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<{
    id: string;
    title: string;
    description: string;
    contentType: string;
    defaultContent: string;
  } | null>(null);
  const [showContentBlocks, setShowContentBlocks] = useState(false);
  const [showProjectStats, setShowProjectStats] = useState(false);
  const [showContentPreview, setShowContentPreview] = useState(false);

  // Real content data from tRPC
  const { data: blogPosts, isLoading: postsLoading } = api.blog.getBlogPosts.useQuery({
    page: 1,
    limit: 10,
    postType: "blog",
    status: undefined, // Get all posts (published and draft)
  });
  const { data: contentStats, isLoading: statsLoading } = api.content.getContentStats.useQuery();
  const { data: contentTemplates, refetch: refetchTemplates } =
    api.content.getContentTemplates.useQuery();

  // tRPC mutations
  const useTemplateMutation = api.content.useContentTemplate.useMutation({
    onSuccess: () => {
      refetchTemplates();
    },
  });

  // Real content data from database
  const contentData = {
    stats: {
      blogPosts: contentStats?.blogPosts || 0,
      draftPosts: contentStats?.draftPosts || 0,
      publishedPosts: contentStats?.publishedPosts || 0,
      totalViews: contentStats?.totalViews || 0,
    },
    contentTemplates: contentTemplates?.templates || [],
    recentPosts:
      blogPosts?.posts.map((post) => ({
        id: post.id,
        title: post.title,
        status: post.publishedAt ? "published" : "draft",
        author: post.author?.name || "Unknown",
        publishedAt: post.publishedAt ? post.publishedAt.toISOString().split("T")[0] : undefined,
        updatedAt: !post.publishedAt ? post.updatedAt.toISOString().split("T")[0] : undefined,
        views: 0, // Will be replaced with real analytics when available
        category: post.postType || "blog",
      })) || [],
  };

  const filters = [
    { id: "all", label: "All Content" },
    { id: "published", label: "Published" },
    { id: "draft", label: "Drafts" },
    { id: "scheduled", label: "Scheduled" },
  ];

  const filteredPosts = contentData.recentPosts.filter((post) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "scheduled") return false; // No scheduled posts yet
    return post.status === selectedFilter;
  });

  // Handler functions
  const handleTemplateUse = async (templateId: string) => {
    try {
      await useTemplateMutation.mutateAsync({ id: templateId });
      const template = contentData.contentTemplates.find((t) => t.id === templateId);
      if (template) {
        // Store template in sessionStorage and redirect to new post
        sessionStorage.setItem("selectedTemplate", JSON.stringify(template));
        window.open("/admin/posts/new", "_blank");
      }
    } catch (error) {
      console.error("Failed to use template:", error);
      alert("Failed to use template");
    }
  };

  const handleTemplatePreview = (template: {
    id: string;
    title: string;
    description: string;
    contentType: string;
    defaultContent: string;
  }) => {
    setPreviewTemplate(template);
    setShowTemplatePreview(true);
  };

  const handlePostEdit = (postId: string) => {
    window.open(`/admin/posts/edit/${postId}`, "_blank");
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
                Content Management
              </h1>
              <p style={{ fontSize: "var(--text-base)", color: "var(--warm-gray)" }}>
                Blog posts, templates, and publishing workflow
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
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
                <Upload size={16} />
                Import
              </button>

              <button
                className="flex items-center font-medium uppercase transition-colors"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--off-white)",
                  backgroundColor: "var(--off-black)",
                  padding: "var(--space-sm) var(--space-md)",
                  border: "2px solid var(--off-black)",
                  gap: "var(--space-xs)",
                }}
                onClick={() => window.open("/admin/posts/new", "_blank")}
              >
                <Plus size={16} />
                New Post
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mx-auto max-w-7xl px-6"
        style={{ paddingTop: "var(--space-lg)", paddingBottom: "var(--space-lg)" }}
      >
        {/* Content Stats */}
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
              {statsLoading ? "..." : contentData.stats.blogPosts}
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
              {statsLoading ? "..." : contentData.stats.publishedPosts}
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
                color: "var(--warm-gray)",
                marginBottom: "var(--space-xs)",
              }}
            >
              {statsLoading ? "..." : contentData.stats.draftPosts}
            </div>
            <div
              className="font-medium uppercase"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--warm-gray)",
                letterSpacing: "0.05em",
              }}
            >
              Drafts
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
              {statsLoading ? "..." : contentData.stats.totalViews.toLocaleString()}
            </div>
            <div
              className="font-medium uppercase"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--warm-gray)",
                letterSpacing: "0.05em",
              }}
            >
              Total Views
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div
          className="grid grid-cols-1 gap-0 lg:grid-cols-3"
          style={{ marginBottom: "var(--space-xl)" }}
        >
          {/* Content Templates */}
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
                <Copy size={20} style={{ color: "var(--primary)" }} />
                <h2
                  className="font-bold uppercase"
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--off-black)",
                  }}
                >
                  Templates
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
                onClick={() => window.open("/admin/templates/new", "_blank")}
                title="Create new template"
              >
                <Plus size={16} />
              </button>
            </div>

            <div style={{ padding: "var(--space-md)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                {contentData.contentTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="cursor-pointer border-2 transition-all"
                    style={{
                      borderColor:
                        selectedTemplate === template.id ? "var(--off-black)" : "var(--light-gray)",
                      backgroundColor: "var(--off-white)",
                      padding: "var(--space-sm)",
                    }}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      handleTemplatePreview(template);
                    }}
                  >
                    <div className="flex items-start justify-between">
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
                        <p
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--warm-gray)",
                            marginBottom: "var(--space-xs)",
                          }}
                        >
                          {template.description}
                        </p>
                        <div className="flex items-center" style={{ gap: "var(--space-xs)" }}>
                          <div
                            style={{
                              fontSize: "var(--text-xs)",
                              fontWeight: "bold",
                              color: "var(--primary)",
                              backgroundColor: "var(--light-gray)",
                              padding: "2px var(--space-xs)",
                              display: "inline-block",
                            }}
                          >
                            {template.category}
                          </div>
                          <div
                            style={{
                              fontSize: "var(--text-xs)",
                              fontWeight: "bold",
                              color:
                                template.contentType === "tsx"
                                  ? "var(--off-white)"
                                  : "var(--off-black)",
                              backgroundColor:
                                template.contentType === "tsx"
                                  ? "var(--primary)"
                                  : "var(--light-gray)",
                              padding: "2px var(--space-xs)",
                              display: "inline-block",
                              textTransform: "uppercase",
                            }}
                          >
                            {template.contentType}
                          </div>
                        </div>
                      </div>
                      <button
                        className="flex items-center transition-colors"
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--off-white)",
                          backgroundColor: "var(--off-black)",
                          padding: "var(--space-xs)",
                          border: "2px solid var(--off-black)",
                          cursor: "pointer",
                          gap: "var(--space-xs)",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTemplateUse(template.id);
                        }}
                        disabled={useTemplateMutation.isLoading}
                      >
                        <Copy size={12} />
                        {useTemplateMutation.isLoading ? "..." : "Use"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Posts */}
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
                <FileText size={20} style={{ color: "var(--primary)" }} />
                <h2
                  className="font-bold uppercase"
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--off-black)",
                  }}
                >
                  Recent Posts
                </h2>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="border-b-2" style={{ borderColor: "var(--light-gray)" }}>
              <nav className="flex" style={{ gap: "0" }}>
                {filters.map((filter) => {
                  const isActive = selectedFilter === filter.id;

                  return (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className="font-medium uppercase transition-colors"
                      style={{
                        fontSize: "var(--text-xs)",
                        color: isActive ? "var(--off-white)" : "var(--warm-gray)",
                        backgroundColor: isActive ? "var(--off-black)" : "transparent",
                        padding: "var(--space-sm)",
                        border: "none",
                        borderBottom: isActive
                          ? "2px solid var(--off-black)"
                          : "2px solid transparent",
                      }}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div style={{ padding: "var(--space-md)" }}>
              {postsLoading ? (
                <div className="py-4 text-center">
                  <div style={{ color: "var(--warm-gray)", fontSize: "var(--text-sm)" }}>
                    Loading posts...
                  </div>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="py-4 text-center">
                  <div style={{ color: "var(--warm-gray)", fontSize: "var(--text-sm)" }}>
                    No posts found
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="border-2"
                      style={{
                        borderColor: "var(--light-gray)",
                        backgroundColor: "var(--off-white)",
                        padding: "var(--space-sm)",
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3
                            style={{
                              fontSize: "var(--text-sm)",
                              fontWeight: "bold",
                              color: "var(--off-black)",
                              marginBottom: "2px",
                            }}
                          >
                            {post.title.length > 25
                              ? post.title.substring(0, 25) + "..."
                              : post.title}
                          </h3>
                          <div
                            className="flex items-center"
                            style={{ gap: "var(--space-sm)", marginBottom: "var(--space-xs)" }}
                          >
                            <span
                              style={{
                                fontSize: "var(--text-xs)",
                                fontWeight: "bold",
                                color:
                                  post.status === "published"
                                    ? "var(--primary)"
                                    : "var(--warm-gray)",
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
                              {post.status === "published" ? post.publishedAt : post.updatedAt}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: "var(--text-xs)",
                              color: "var(--warm-gray)",
                            }}
                          >
                            {post.views} views • {post.category}
                          </div>
                        </div>
                        <div className="flex" style={{ gap: "var(--space-xs)" }}>
                          <button
                            style={{ color: "var(--warm-gray)" }}
                            onClick={() => handlePostEdit(post.id)}
                            title="Edit post"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            style={{ color: "var(--warm-gray)" }}
                            onClick={() => window.open(`/journey/${post.id}`, "_blank")}
                            title="View post"
                          >
                            <Eye size={14} />
                          </button>
                          <button style={{ color: "var(--warm-gray)" }} title="More options">
                            <MoreHorizontal size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content Tools */}
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
                  Tools
                </h2>
              </div>
            </div>

            <div style={{ padding: "var(--space-md)" }}>
              {/* Quick Actions */}
              <div
                className="font-medium uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--warm-gray)",
                  marginBottom: "var(--space-sm)",
                  letterSpacing: "0.05em",
                }}
              >
                Quick Actions
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-xs)",
                  marginBottom: "var(--space-md)",
                }}
              >
                <button
                  className="border-2 text-left transition-colors"
                  style={{
                    borderColor: "var(--light-gray)",
                    backgroundColor: "var(--off-white)",
                    padding: "var(--space-sm)",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowContentBlocks(true)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "bold",
                          color: "var(--off-black)",
                        }}
                      >
                        Content Blocks
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--warm-gray)",
                        }}
                      >
                        Manage page content
                      </div>
                    </div>
                    <Blocks size={16} style={{ color: "var(--warm-gray)" }} />
                  </div>
                </button>

                <button
                  className="border-2 text-left transition-colors"
                  style={{
                    borderColor: "var(--light-gray)",
                    backgroundColor: "var(--off-white)",
                    padding: "var(--space-sm)",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowProjectStats(true)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "bold",
                          color: "var(--off-black)",
                        }}
                      >
                        Project Stats
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--warm-gray)",
                        }}
                      >
                        Manage project metrics
                      </div>
                    </div>
                    <Edit size={16} style={{ color: "var(--warm-gray)" }} />
                  </div>
                </button>

                <button
                  className="border-2 text-left transition-colors"
                  style={{
                    borderColor: "var(--light-gray)",
                    backgroundColor: "var(--off-white)",
                    padding: "var(--space-sm)",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowContentPreview(true)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "bold",
                          color: "var(--off-black)",
                        }}
                      >
                        Content Preview
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--warm-gray)",
                        }}
                      >
                        Preview & publish content
                      </div>
                    </div>
                    <Search size={16} style={{ color: "var(--warm-gray)" }} />
                  </div>
                </button>

                <button
                  className="border-2 text-left transition-colors"
                  style={{
                    borderColor: "var(--light-gray)",
                    backgroundColor: "var(--off-white)",
                    padding: "var(--space-sm)",
                    cursor: "pointer",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "bold",
                          color: "var(--off-black)",
                        }}
                      >
                        Media Library
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--warm-gray)",
                        }}
                      >
                        Manage images
                      </div>
                    </div>
                    <Upload size={16} style={{ color: "var(--warm-gray)" }} />
                  </div>
                </button>
              </div>

              {/* External Links */}
              <div
                className="font-medium uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--warm-gray)",
                  marginBottom: "var(--space-sm)",
                  letterSpacing: "0.05em",
                }}
              >
                External Links
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                <Link
                  href="/journey"
                  className="border-2 text-left transition-colors"
                  style={{
                    borderColor: "var(--light-gray)",
                    backgroundColor: "var(--off-white)",
                    padding: "var(--space-sm)",
                    textDecoration: "none",
                    display: "block",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "bold",
                          color: "var(--off-black)",
                        }}
                      >
                        Journey Page
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--warm-gray)",
                        }}
                      >
                        View live blog
                      </div>
                    </div>
                    <ExternalLink size={16} style={{ color: "var(--warm-gray)" }} />
                  </div>
                </Link>

                <Link
                  href="/admin/questionnaires/templates"
                  className="border-2 text-left transition-colors"
                  style={{
                    borderColor: "var(--light-gray)",
                    backgroundColor: "var(--off-white)",
                    padding: "var(--space-sm)",
                    textDecoration: "none",
                    display: "block",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        style={{
                          fontSize: "var(--text-sm)",
                          fontWeight: "bold",
                          color: "var(--off-black)",
                        }}
                      >
                        Questionnaire Templates
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--warm-gray)",
                        }}
                      >
                        Content inspiration
                      </div>
                    </div>
                    <ExternalLink size={16} style={{ color: "var(--warm-gray)" }} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Preview Modal */}
      {showTemplatePreview && previewTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
          onClick={() => setShowTemplatePreview(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-lg border-2 bg-white"
            style={{
              borderColor: "var(--light-gray)",
              margin: "var(--space-lg)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="sticky top-0 flex items-center justify-between border-b-2 bg-white"
              style={{
                borderColor: "var(--light-gray)",
                padding: "var(--space-md)",
              }}
            >
              <div>
                <h3
                  className="font-bold"
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--off-black)",
                    marginBottom: "var(--space-xs)",
                  }}
                >
                  {previewTemplate.title}
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--warm-gray)",
                  }}
                >
                  {previewTemplate.description}
                </p>
              </div>
              <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
                <button
                  className="flex items-center font-medium transition-colors"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--off-white)",
                    backgroundColor: "var(--primary)",
                    padding: "var(--space-sm) var(--space-md)",
                    border: "2px solid var(--primary)",
                    gap: "var(--space-xs)",
                  }}
                  onClick={() => handleTemplateUse(previewTemplate.id)}
                  disabled={useTemplateMutation.isLoading}
                >
                  <Copy size={16} />
                  {useTemplateMutation.isLoading ? "Copying..." : "Use Template"}
                </button>
                <button
                  className="flex items-center font-medium transition-colors"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--off-black)",
                    backgroundColor: "var(--light-gray)",
                    padding: "var(--space-sm) var(--space-md)",
                    border: "2px solid var(--light-gray)",
                  }}
                  onClick={() => setShowTemplatePreview(false)}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: "var(--space-lg)" }}>
              {previewTemplate.contentType === "tsx" ? (
                <div>
                  <div
                    className="mb-lg rounded-lg border-2 border-primary bg-primary/5 p-md"
                    style={{
                      marginBottom: "var(--space-lg)",
                    }}
                  >
                    <h4 className="mb-sm text-sm font-semibold text-primary">
                      TypeScript React Component Template
                    </h4>
                    <p className="text-sm text-warm-gray">
                      This template creates a TypeScript React component with:
                    </p>
                    <ul className="mt-sm text-sm text-warm-gray" style={{ paddingLeft: "1.5rem" }}>
                      <li>• Interactive polls and community engagement</li>
                      <li>• Newsletter signup forms with XP rewards</li>
                      <li>• Responsive two-column layout (content + sidebar)</li>
                      <li>• Table of contents and post statistics</li>
                      <li>• Customizable content sections with template variables</li>
                      <li>• Elevated brutalism design system styling</li>
                    </ul>
                  </div>

                  <div
                    className="mb-md text-sm font-semibold"
                    style={{ color: "var(--off-black)" }}
                  >
                    Template Variables (Replace with your content):
                  </div>

                  <div className="mb-lg rounded-lg border-2 border-light-gray bg-white p-md">
                    <div className="grid grid-cols-2 gap-sm text-xs">
                      {[
                        "COMPONENT_NAME",
                        "POST_INTRO",
                        "POST_DESCRIPTION",
                        "SECTION_1_TITLE",
                        "SECTION_1_CONTENT",
                        "QUOTE_TEXT",
                        "POLL_QUESTION",
                        "NEWSLETTER_TITLE",
                        "NEWSLETTER_DESCRIPTION",
                        "SECTION_2_TITLE",
                        "SECTION_3_TITLE",
                      ].map((variable) => (
                        <div key={variable} className="font-mono text-primary">
                          {`{{${variable}}}`}
                        </div>
                      ))}
                    </div>
                  </div>

                  <details>
                    <summary className="mb-sm cursor-pointer text-sm font-medium text-warm-gray">
                      View Template Source Code
                    </summary>
                    <div
                      className="font-mono text-sm"
                      style={{
                        backgroundColor: "var(--light-gray)",
                        padding: "var(--space-md)",
                        borderRadius: "4px",
                        maxHeight: "40vh",
                        overflow: "auto",
                        whiteSpace: "pre-wrap",
                        fontSize: "var(--text-xs)",
                        lineHeight: "1.4",
                      }}
                    >
                      {previewTemplate.defaultContent}
                    </div>
                  </details>
                </div>
              ) : (
                <div
                  className="font-mono text-sm"
                  style={{
                    backgroundColor: "var(--light-gray)",
                    padding: "var(--space-md)",
                    borderRadius: "4px",
                    maxHeight: "60vh",
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                    fontSize: "var(--text-xs)",
                    lineHeight: "1.4",
                  }}
                >
                  {previewTemplate.defaultContent}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Block Editor Modal */}
      {showContentBlocks && (
        <div
          className="fixed inset-0 z-50"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <div className="flex h-full flex-col">
            <div
              className="flex items-center justify-between"
              style={{
                backgroundColor: "var(--off-white)",
                borderBottom: "2px solid var(--light-gray)",
                padding: "var(--space-md) var(--space-lg)",
              }}
            >
              <h2
                className="font-bold uppercase"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--off-black)",
                }}
              >
                Content Block Editor
              </h2>
              <button
                onClick={() => setShowContentBlocks(false)}
                className="border-2 border-light-gray p-2 text-warm-gray transition-colors hover:border-primary hover:text-off-black"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ContentBlockEditor userEmail={userEmail} />
            </div>
          </div>
        </div>
      )}

      {/* Project Stats Manager Modal */}
      {showProjectStats && (
        <div
          className="fixed inset-0 z-50"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <div className="flex h-full flex-col">
            <div
              className="flex items-center justify-between"
              style={{
                backgroundColor: "var(--off-white)",
                borderBottom: "2px solid var(--light-gray)",
                padding: "var(--space-md) var(--space-lg)",
              }}
            >
              <h2
                className="font-bold uppercase"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--off-black)",
                }}
              >
                Project Statistics Manager
              </h2>
              <button
                onClick={() => setShowProjectStats(false)}
                className="border-2 border-light-gray p-2 text-warm-gray transition-colors hover:border-primary hover:text-off-black"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ProjectStatsManager userEmail={userEmail} />
            </div>
          </div>
        </div>
      )}

      {/* Content Preview & Publishing Workflow Modal */}
      {showContentPreview && (
        <div
          className="fixed inset-0 z-50"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <div className="flex h-full flex-col">
            <div
              className="flex items-center justify-between"
              style={{
                backgroundColor: "var(--off-white)",
                borderBottom: "2px solid var(--light-gray)",
                padding: "var(--space-md) var(--space-lg)",
              }}
            >
              <h2
                className="font-bold uppercase"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--off-black)",
                }}
              >
                Content Preview &amp; Publishing
              </h2>
              <button
                onClick={() => setShowContentPreview(false)}
                className="border-2 border-light-gray p-2 text-warm-gray transition-colors hover:border-primary hover:text-off-black"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ContentPreviewWorkflow userEmail={userEmail} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
