"use client";

import React, { useState } from "react";
import { api } from "@/lib/trpc/react";
import {
  Eye,
  Edit,
  Globe,
  Calendar,
  Clock,
  FileText,
  Send,
  X,
  RefreshCw,
  Archive,
  ExternalLink,
} from "lucide-react";

interface ContentPreviewWorkflowProps {
  userEmail: string;
}

export function ContentPreviewWorkflow({ userEmail: _userEmail }: ContentPreviewWorkflowProps) {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [publishingSchedule, setPublishingSchedule] = useState<string>("");
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published" | "scheduled">(
    "all"
  );

  // Get blog posts with various statuses
  const { data: blogPosts, refetch: refetchBlogPosts } = api.blog.getBlogPosts.useQuery({
    page: 1,
    limit: 20,
    status: statusFilter === "all" ? undefined : statusFilter,
    search: searchTerm || undefined,
  });

  // Get selected post details
  const { data: selectedPost } = api.blog.getPostById.useQuery(
    { id: selectedPostId || "" },
    { enabled: !!selectedPostId }
  );

  // Mutations
  const updatePostMutation = api.blog.updatePost.useMutation();
  const _createPostMutation = api.blog.createPost.useMutation();

  const handleUpdatePostStatus = async (postId: string, newStatus: "draft" | "published") => {
    try {
      await updatePostMutation.mutateAsync({
        id: postId,
        status: newStatus,
      });
      refetchBlogPosts();
    } catch (error) {
      console.error("Failed to update post status:", error);
    }
  };

  const handleSchedulePost = async (postId: string, scheduledDate: string) => {
    try {
      // For now, this would be a custom implementation
      // In a real app, you'd want to use a job queue or scheduling service
      console.log("Scheduling post", postId, "for", scheduledDate);
      setIsSchedulingModalOpen(false);
      setPublishingSchedule("");
    } catch (error) {
      console.error("Failed to schedule post:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <Globe size={16} />;
      case "draft":
        return <Edit size={16} />;
      case "scheduled":
        return <Calendar size={16} />;
      default:
        return <FileText size={16} />;
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
                Content Preview &amp; Publishing
              </h1>
              <p style={{ fontSize: "var(--text-base)", color: "var(--warm-gray)" }}>
                Preview, manage and publish content across the platform
              </p>
            </div>

            <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
              <button
                onClick={() => refetchBlogPosts()}
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
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mx-auto max-w-7xl px-6"
        style={{ paddingTop: "var(--space-lg)", paddingBottom: "var(--space-lg)" }}
      >
        {/* Filters and Search */}
        <div
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
          style={{ marginBottom: "var(--space-lg)" }}
        >
          <div>
            <label
              className="mb-2 block font-medium uppercase"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--warm-gray)",
              }}
            >
              Search Posts
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or content..."
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

          <div>
            <label
              className="mb-2 block font-medium uppercase"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--warm-gray)",
              }}
            >
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "all" | "draft" | "published" | "scheduled")
              }
              className="w-full"
              style={{
                fontSize: "var(--text-sm)",
                padding: "var(--space-sm)",
                border: "2px solid var(--light-gray)",
                backgroundColor: "var(--off-white)",
                color: "var(--off-black)",
              }}
            >
              <option value="all">All Posts</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          <div>
            <label
              className="mb-2 block font-medium uppercase"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--warm-gray)",
              }}
            >
              Quick Actions
            </label>
            <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
              <button
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
                <FileText size={16} />
                New Post
              </button>
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
                <Archive size={16} />
                Archive
              </button>
            </div>
          </div>
        </div>

        {/* Content List and Preview */}
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
          {/* Content List */}
          <div
            className="border-2 border-r-0"
            style={{
              borderColor: "var(--light-gray)",
              backgroundColor: "var(--off-white)",
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            <div
              className="sticky top-0 flex items-center justify-between border-b-2"
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
                  Content List
                </h2>
              </div>
              <div
                className="font-medium"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--warm-gray)",
                }}
              >
                {blogPosts?.posts.length || 0} posts
              </div>
            </div>

            <div style={{ padding: "var(--space-md)" }}>
              {blogPosts?.posts.length === 0 ? (
                <div className="py-8 text-center" style={{ color: "var(--warm-gray)" }}>
                  No posts found matching your criteria
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
                  {blogPosts?.posts.map((post) => (
                    <div
                      key={post.id}
                      className={`cursor-pointer border-2 transition-all ${
                        selectedPostId === post.id ? "border-primary" : ""
                      }`}
                      onClick={() => setSelectedPostId(post.id)}
                      style={{
                        borderColor:
                          selectedPostId === post.id ? "var(--primary)" : "var(--light-gray)",
                        backgroundColor: "var(--off-white)",
                        padding: "var(--space-sm)",
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div
                            className="flex items-center"
                            style={{ gap: "var(--space-sm)", marginBottom: "var(--space-xs)" }}
                          >
                            {getStatusIcon(post.status)}
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium uppercase ${getStatusColor(post.status)}`}
                            >
                              {post.status}
                            </span>
                            {post.featured && (
                              <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium uppercase text-purple-800">
                                Featured
                              </span>
                            )}
                          </div>
                          <h3
                            className="font-bold"
                            style={{
                              fontSize: "var(--text-sm)",
                              color: "var(--off-black)",
                              marginBottom: "var(--space-xs)",
                            }}
                          >
                            {post.title}
                          </h3>
                          <p
                            style={{
                              fontSize: "var(--text-xs)",
                              color: "var(--warm-gray)",
                              marginBottom: "var(--space-xs)",
                            }}
                          >
                            {post.excerpt || "No excerpt available"}
                          </p>
                          <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
                            <div className="flex items-center" style={{ gap: "var(--space-xs)" }}>
                              <Clock size={12} style={{ color: "var(--warm-gray)" }} />
                              <span
                                style={{ fontSize: "var(--text-xs)", color: "var(--warm-gray)" }}
                              >
                                {post.updatedAt
                                  ? new Date(post.updatedAt).toLocaleDateString()
                                  : "Unknown"}
                              </span>
                            </div>
                            {post.author && (
                              <div
                                style={{ fontSize: "var(--text-xs)", color: "var(--warm-gray)" }}
                              >
                                by {post.author.name}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center" style={{ gap: "var(--space-xs)" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`/blog/${post.slug}`, "_blank");
                            }}
                            className="transition-colors"
                            style={{
                              color: "var(--warm-gray)",
                              padding: "var(--space-xs)",
                            }}
                          >
                            <ExternalLink size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content Preview */}
          <div
            className="border-2"
            style={{
              borderColor: "var(--light-gray)",
              backgroundColor: "var(--off-white)",
              maxHeight: "70vh",
              overflowY: "auto",
            }}
          >
            <div
              className="sticky top-0 flex items-center justify-between border-b-2"
              style={{
                borderColor: "var(--light-gray)",
                padding: "var(--space-md)",
                backgroundColor: "var(--off-white)",
              }}
            >
              <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
                <Eye size={20} style={{ color: "var(--primary)" }} />
                <h2
                  className="font-bold uppercase"
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--off-black)",
                  }}
                >
                  Content Preview
                </h2>
              </div>
              {selectedPost && (
                <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
                  <button
                    onClick={() =>
                      handleUpdatePostStatus(
                        selectedPost.id,
                        selectedPost.status === "published" ? "draft" : "published"
                      )
                    }
                    className="flex items-center font-medium uppercase transition-colors"
                    style={{
                      fontSize: "var(--text-sm)",
                      color:
                        selectedPost.status === "published"
                          ? "var(--off-black)"
                          : "var(--off-white)",
                      backgroundColor:
                        selectedPost.status === "published"
                          ? "var(--light-gray)"
                          : "var(--primary)",
                      padding: "var(--space-sm) var(--space-md)",
                      border: `2px solid ${selectedPost.status === "published" ? "var(--light-gray)" : "var(--primary)"}`,
                      gap: "var(--space-xs)",
                    }}
                  >
                    {selectedPost.status === "published" ? (
                      <>
                        <Edit size={16} />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Publish
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsSchedulingModalOpen(true)}
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
                    <Calendar size={16} />
                    Schedule
                  </button>
                </div>
              )}
            </div>

            <div style={{ padding: "var(--space-md)" }}>
              {selectedPost ? (
                <div>
                  {/* Post Header */}
                  <div
                    className="mb-4 border-2"
                    style={{
                      borderColor: "var(--light-gray)",
                      backgroundColor: "var(--off-white)",
                      padding: "var(--space-md)",
                    }}
                  >
                    <div
                      className="flex items-center"
                      style={{ gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}
                    >
                      {getStatusIcon(selectedPost.status)}
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium uppercase ${getStatusColor(selectedPost.status)}`}
                      >
                        {selectedPost.status}
                      </span>
                      {selectedPost.featured && (
                        <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium uppercase text-purple-800">
                          Featured
                        </span>
                      )}
                    </div>
                    <h1
                      className="font-bold"
                      style={{
                        fontSize: "var(--text-lg)",
                        color: "var(--off-black)",
                        marginBottom: "var(--space-sm)",
                      }}
                    >
                      {selectedPost.title}
                    </h1>
                    <p
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--warm-gray)",
                        marginBottom: "var(--space-sm)",
                      }}
                    >
                      {selectedPost.excerpt || "No excerpt available"}
                    </p>
                    <div className="flex items-center" style={{ gap: "var(--space-md)" }}>
                      <div className="flex items-center" style={{ gap: "var(--space-xs)" }}>
                        <Clock size={14} style={{ color: "var(--warm-gray)" }} />
                        <span style={{ fontSize: "var(--text-xs)", color: "var(--warm-gray)" }}>
                          Updated: {new Date(selectedPost.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {selectedPost.publishedAt && (
                        <div className="flex items-center" style={{ gap: "var(--space-xs)" }}>
                          <Globe size={14} style={{ color: "var(--warm-gray)" }} />
                          <span style={{ fontSize: "var(--text-xs)", color: "var(--warm-gray)" }}>
                            Published: {new Date(selectedPost.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {selectedPost.author && (
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--warm-gray)" }}>
                          by {selectedPost.author.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div
                    className="border-2"
                    style={{
                      borderColor: "var(--light-gray)",
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
                      Content Preview
                    </h3>
                    <div
                      className="prose prose-sm max-w-none"
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--off-black)",
                        lineHeight: "1.6",
                      }}
                    >
                      {selectedPost.contentType === "markdown" ? (
                        <pre
                          style={{
                            whiteSpace: "pre-wrap",
                            fontFamily: "inherit",
                            fontSize: "inherit",
                          }}
                        >
                          {selectedPost.content}
                        </pre>
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              selectedPost.content.substring(0, 1000) +
                              (selectedPost.content.length > 1000 ? "..." : ""),
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* SEO and Metadata */}
                  <div
                    className="mt-4 border-2"
                    style={{
                      borderColor: "var(--light-gray)",
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
                      SEO &amp; Metadata
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div
                          className="font-medium uppercase"
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--warm-gray)",
                            marginBottom: "var(--space-xs)",
                          }}
                        >
                          Slug
                        </div>
                        <div
                          className="font-mono"
                          style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--off-black)",
                          }}
                        >
                          {selectedPost.slug}
                        </div>
                      </div>
                      <div>
                        <div
                          className="font-medium uppercase"
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--warm-gray)",
                            marginBottom: "var(--space-xs)",
                          }}
                        >
                          Post Type
                        </div>
                        <div
                          style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--off-black)",
                          }}
                        >
                          {selectedPost.postType}
                        </div>
                      </div>
                      <div>
                        <div
                          className="font-medium uppercase"
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--warm-gray)",
                            marginBottom: "var(--space-xs)",
                          }}
                        >
                          Content Type
                        </div>
                        <div
                          style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--off-black)",
                          }}
                        >
                          {selectedPost.contentType}
                        </div>
                      </div>
                      <div>
                        <div
                          className="font-medium uppercase"
                          style={{
                            fontSize: "var(--text-xs)",
                            color: "var(--warm-gray)",
                            marginBottom: "var(--space-xs)",
                          }}
                        >
                          Word Count
                        </div>
                        <div
                          style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--off-black)",
                          }}
                        >
                          {selectedPost.content.split(" ").length} words
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center" style={{ color: "var(--warm-gray)" }}>
                  <Eye
                    size={48}
                    style={{ color: "var(--light-gray)", marginBottom: "var(--space-md)" }}
                  />
                  <p>Select a post from the list to preview its content</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scheduling Modal */}
      {isSchedulingModalOpen && selectedPost && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}
        >
          <div
            className="mx-4 w-full max-w-md border-2"
            style={{
              borderColor: "var(--light-gray)",
              backgroundColor: "var(--off-white)",
              padding: "var(--space-lg)",
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="font-bold uppercase"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--off-black)",
                }}
              >
                Schedule Post
              </h2>
              <button
                onClick={() => setIsSchedulingModalOpen(false)}
                style={{
                  color: "var(--warm-gray)",
                  padding: "var(--space-xs)",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <p
              className="mb-4"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--warm-gray)",
              }}
            >
              Schedule &quot;{selectedPost.title}&quot; for publication
            </p>

            <div className="mb-4">
              <label
                className="mb-2 block font-medium uppercase"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--warm-gray)",
                }}
              >
                Publication Date &amp; Time
              </label>
              <input
                type="datetime-local"
                value={publishingSchedule}
                onChange={(e) => setPublishingSchedule(e.target.value)}
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

            <div className="flex items-center justify-end" style={{ gap: "var(--space-sm)" }}>
              <button
                onClick={() => setIsSchedulingModalOpen(false)}
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
              <button
                onClick={() => handleSchedulePost(selectedPost.id, publishingSchedule)}
                disabled={!publishingSchedule}
                className="flex items-center font-medium uppercase transition-colors"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--off-white)",
                  backgroundColor: "var(--primary)",
                  padding: "var(--space-sm) var(--space-md)",
                  border: "2px solid var(--primary)",
                  gap: "var(--space-xs)",
                  opacity: !publishingSchedule ? 0.5 : 1,
                }}
              >
                <Calendar size={16} />
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
