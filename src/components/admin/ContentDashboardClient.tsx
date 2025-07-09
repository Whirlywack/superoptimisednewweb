"use client";

import { api } from "@/lib/trpc/react";
import {
  FileText,
  Plus,
  Edit,
  Eye,
  Calendar,
  Tag,
  Copy,
  Upload,
  Settings,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface ContentDashboardClientProps {
  userEmail: string;
}

export function ContentDashboardClient({ userEmail: _userEmail }: ContentDashboardClientProps) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Real content data from tRPC
  const { data: blogPosts, isLoading: postsLoading } = api.blog.getBlogPosts.useQuery({
    page: 1,
    limit: 10,
    postType: "blog",
  });
  const { data: contentStats, isLoading: statsLoading } = api.content.getContentStats.useQuery();
  const { data: contentTemplates } = api.content.getContentTemplates.useQuery();

  // Fallback content data for gradual migration
  const contentData = {
    stats: {
      totalPosts: contentStats?.blogPosts || 24,
      draftPosts: (contentStats?.blogPosts || 24) - (contentStats?.publishedPosts || 18),
      publishedPosts: contentStats?.publishedPosts || 18,
      totalViews: 15420, // Will be replaced with analytics data
    },
    contentTemplates: contentTemplates?.templates || [
      { 
        id: "blog-post", 
        title: "Blog Post", 
        description: "Standard blog article with SEO optimization",
        category: "blog",
      },
      { 
        id: "case-study", 
        title: "Case Study", 
        description: "Project showcase with problem-solution format",
        category: "project",
      },
      { 
        id: "tutorial", 
        title: "Tutorial", 
        description: "Step-by-step technical guide",
        category: "education",
      },
      { 
        id: "announcement", 
        title: "Announcement", 
        description: "Product updates and feature releases",
        category: "news",
      },
    ],
    recentPosts: blogPosts?.posts.map(post => ({
      id: post.id,
      title: post.title,
      status: post.publishedAt ? "published" : "draft",
      author: post.author?.name || "Admin",
      publishedAt: post.publishedAt ? post.publishedAt.toISOString().split('T')[0] : undefined,
      updatedAt: !post.publishedAt ? post.updatedAt.toISOString().split('T')[0] : undefined,
      views: Math.floor(Math.random() * 2000) + 100, // Placeholder - will be replaced with analytics
      category: post.postType || "blog",
    })) || [
      {
        id: "1",
        title: "Building Better User Surveys with tRPC",
        status: "published",
        author: "Admin",
        publishedAt: "2024-01-15",
        views: 1240,
        category: "tutorial",
      },
      {
        id: "2", 
        title: "Analytics Deep Dive: Understanding User Behavior",
        status: "draft",
        author: "Admin",
        updatedAt: "2024-01-12",
        views: 0,
        category: "analysis",
      },
    ],
  };

  const filters = [
    { id: "all", label: "All Content" },
    { id: "published", label: "Published" },
    { id: "draft", label: "Drafts" },
    { id: "scheduled", label: "Scheduled" },
  ];

  const filteredPosts = contentData.recentPosts.filter(post => {
    if (selectedFilter === "all") return true;
    return post.status === selectedFilter;
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
              {statsLoading ? "..." : contentData.stats.totalPosts}
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
              >
                <Plus size={16} />
              </button>
            </div>
            
            <div style={{ padding: "var(--space-md)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                {contentData.contentTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="border-2 cursor-pointer transition-all"
                    style={{
                      borderColor: selectedTemplate === template.id ? "var(--off-black)" : "var(--light-gray)",
                      backgroundColor: "var(--off-white)",
                      padding: "var(--space-sm)",
                    }}
                    onClick={() => setSelectedTemplate(template.id)}
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
                      >
                        <Copy size={12} />
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
                        borderBottom: isActive ? "2px solid var(--off-black)" : "2px solid transparent",
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
                  <div style={{ color: "var(--warm-gray)", fontSize: "var(--text-sm)" }}>Loading posts...</div>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="py-4 text-center">
                  <div style={{ color: "var(--warm-gray)", fontSize: "var(--text-sm)" }}>No posts found</div>
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
                            {post.title.length > 25 ? post.title.substring(0, 25) + "..." : post.title}
                          </h3>
                          <div
                            className="flex items-center"
                            style={{ gap: "var(--space-sm)", marginBottom: "var(--space-xs)" }}
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
                              {post.status === 'published' ? post.publishedAt : post.updatedAt}
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
                          <button style={{ color: "var(--warm-gray)" }}>
                            <Edit size={14} />
                          </button>
                          <button style={{ color: "var(--warm-gray)" }}>
                            <Eye size={14} />
                          </button>
                          <button style={{ color: "var(--warm-gray)" }}>
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
              
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)", marginBottom: "var(--space-md)" }}>
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
                        Bulk Editor
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--warm-gray)",
                        }}
                      >
                        Edit multiple posts
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
                        SEO Analysis
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-xs)",
                          color: "var(--warm-gray)",
                        }}
                      >
                        Optimize content
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
    </div>
  );
}