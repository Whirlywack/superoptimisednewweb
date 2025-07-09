"use client";

import React, { useState } from "react";
import { api } from "@/lib/trpc/react";
import {
  Plus,
  Edit,
  Eye,
  Star,
  Search,
  Calendar,
  FileText,
  User,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PostListClientProps {
  userEmail?: string;
}

export function PostListClient({ userEmail: _userEmail }: PostListClientProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "draft" | "published">("all");
  const [selectedType, setSelectedType] = useState<"all" | "blog" | "tutorial" | "announcement">(
    "all"
  );
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [_showBulkActions, _setShowBulkActions] = useState(false);

  const limit = 10;

  // Get blog posts with pagination
  const {
    data: postsData,
    isLoading,
    refetch,
  } = api.blog.getBlogPosts.useQuery({
    page: currentPage,
    limit,
    search: searchTerm || undefined,
    status: selectedStatus === "all" ? undefined : selectedStatus,
    postType: selectedType === "all" ? undefined : selectedType,
  });

  // Get blog stats
  const { data: stats } = api.blog.getBlogStats.useQuery();

  // Update post mutation
  const updatePostMutation = api.blog.updatePost.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const posts = postsData?.posts || [];
  const pagination = postsData?.pagination;

  const handleStatusChange = async (postId: string, newStatus: "draft" | "published") => {
    try {
      await updatePostMutation.mutateAsync({
        id: postId,
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update post status:", error);
      alert("Failed to update post status");
    }
  };

  const handleFeatureToggle = async (postId: string, featured: boolean) => {
    try {
      await updatePostMutation.mutateAsync({
        id: postId,
        featured: !featured,
      });
    } catch (error) {
      console.error("Failed to toggle featured status:", error);
      alert("Failed to toggle featured status");
    }
  };

  const handleBulkAction = async (action: "publish" | "draft" | "delete") => {
    if (selectedPosts.length === 0) return;

    const confirmed = confirm(
      `Are you sure you want to ${action} ${selectedPosts.length} post(s)?`
    );
    if (!confirmed) return;

    try {
      for (const postId of selectedPosts) {
        if (action === "delete") {
          // Note: Would need a delete mutation in the router
          console.log("Delete functionality not yet implemented");
        } else {
          await updatePostMutation.mutateAsync({
            id: postId,
            status: action === "publish" ? "published" : "draft",
          });
        }
      }
      setSelectedPosts([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error("Bulk action failed:", error);
      alert("Bulk action failed");
    }
  };

  const handleSelectPost = (postId: string) => {
    setSelectedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([]);
    } else {
      setSelectedPosts(posts.map((post) => post.id));
    }
  };

  const _getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "var(--primary)";
      case "draft":
        return "var(--warm-gray)";
      default:
        return "var(--off-black)";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tutorial":
        return <FileText size={14} />;
      case "announcement":
        return <Globe size={14} />;
      default:
        return <FileText size={14} />;
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
                Blog Posts
              </h1>
              <p style={{ fontSize: "var(--text-base)", color: "var(--warm-gray)" }}>
                Manage all blog posts and content
              </p>
            </div>

            <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
              <Link
                href="/admin/posts/new"
                className="flex items-center font-medium uppercase transition-colors hover:bg-primary hover:text-off-white"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--off-white)",
                  backgroundColor: "var(--off-black)",
                  padding: "var(--space-sm) var(--space-md)",
                  border: "2px solid var(--off-black)",
                  gap: "var(--space-xs)",
                  textDecoration: "none",
                }}
              >
                <Plus size={16} />
                New Post
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mx-auto max-w-7xl px-6" style={{ paddingTop: "var(--space-lg)" }}>
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
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
              {stats?.totalPosts || 0}
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
              {stats?.publishedPosts || 0}
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
              {stats?.draftPosts || 0}
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
                color: "var(--primary)",
                marginBottom: "var(--space-xs)",
              }}
            >
              {stats?.featuredPosts || 0}
            </div>
            <div
              className="font-medium uppercase"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--warm-gray)",
                letterSpacing: "0.05em",
              }}
            >
              Featured
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mx-auto max-w-7xl px-6" style={{ marginBottom: "var(--space-lg)" }}>
        <div
          className="border-2 p-4"
          style={{
            borderColor: "var(--light-gray)",
            backgroundColor: "var(--off-white)",
          }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-3"
                style={{ color: "var(--warm-gray)" }}
              />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-sm border-2 border-light-gray py-2 pl-10 pr-4 focus:border-primary focus:outline-none"
                style={{ backgroundColor: "var(--off-white)" }}
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as "all" | "draft" | "published")}
              className="rounded-sm border-2 border-light-gray px-3 py-2 focus:border-primary focus:outline-none"
              style={{ backgroundColor: "var(--off-white)" }}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value as "all" | "blog" | "tutorial" | "announcement")
              }
              className="rounded-sm border-2 border-light-gray px-3 py-2 focus:border-primary focus:outline-none"
              style={{ backgroundColor: "var(--off-white)" }}
            >
              <option value="all">All Types</option>
              <option value="blog">Blog</option>
              <option value="tutorial">Tutorial</option>
              <option value="announcement">Announcement</option>
            </select>

            {/* Bulk Actions */}
            <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
              {selectedPosts.length > 0 && (
                <div className="flex items-center" style={{ gap: "var(--space-xs)" }}>
                  <button
                    onClick={() => handleBulkAction("publish")}
                    className="border-2 border-primary bg-primary px-3 py-1 text-xs font-medium uppercase text-off-white"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => handleBulkAction("draft")}
                    className="border-2 border-warm-gray bg-warm-gray px-3 py-1 text-xs font-medium uppercase text-off-white"
                  >
                    Draft
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="mx-auto max-w-7xl px-6" style={{ marginBottom: "var(--space-lg)" }}>
        <div
          className="border-2"
          style={{
            borderColor: "var(--light-gray)",
            backgroundColor: "var(--off-white)",
          }}
        >
          {/* Table Header */}
          <div
            className="grid grid-cols-12 gap-4 border-b-2 p-4 font-medium uppercase"
            style={{
              borderColor: "var(--light-gray)",
              fontSize: "var(--text-xs)",
              color: "var(--warm-gray)",
              letterSpacing: "0.05em",
            }}
          >
            <div className="col-span-1 flex items-center">
              <input
                type="checkbox"
                checked={selectedPosts.length === posts.length && posts.length > 0}
                onChange={handleSelectAll}
                className="rounded"
              />
            </div>
            <div className="col-span-4">Title</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-2">Author</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1">Actions</div>
          </div>

          {/* Table Body */}
          <div>
            {isLoading ? (
              <div className="p-8 text-center">
                <div style={{ color: "var(--warm-gray)" }}>Loading posts...</div>
              </div>
            ) : posts.length === 0 ? (
              <div className="p-8 text-center">
                <div style={{ color: "var(--warm-gray)" }}>No posts found</div>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="grid grid-cols-12 gap-4 border-b border-light-gray p-4 transition-colors hover:bg-light-gray"
                >
                  {/* Checkbox */}
                  <div className="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post.id)}
                      onChange={() => handleSelectPost(post.id)}
                      className="rounded"
                    />
                  </div>

                  {/* Title */}
                  <div className="col-span-4">
                    <div className="flex items-start" style={{ gap: "var(--space-xs)" }}>
                      {post.featured && <Star size={14} style={{ color: "var(--primary)" }} />}
                      <div>
                        <h3
                          className="cursor-pointer font-medium hover:text-primary"
                          style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--off-black)",
                            marginBottom: "2px",
                          }}
                          onClick={() => router.push(`/admin/posts/edit/${post.id}`)}
                        >
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p
                            style={{
                              fontSize: "var(--text-xs)",
                              color: "var(--warm-gray)",
                              lineHeight: "1.3",
                            }}
                          >
                            {post.excerpt.substring(0, 100)}...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <button
                      onClick={() =>
                        handleStatusChange(
                          post.id,
                          post.status === "published" ? "draft" : "published"
                        )
                      }
                      className="rounded px-2 py-1 text-xs font-medium uppercase transition-colors"
                      style={{
                        backgroundColor:
                          post.status === "published" ? "var(--primary)" : "var(--warm-gray)",
                        color: "var(--off-white)",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {post.status}
                    </button>
                  </div>

                  {/* Type */}
                  <div className="col-span-1">
                    <div className="flex items-center" style={{ gap: "var(--space-xs)" }}>
                      {getTypeIcon(post.postType)}
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--warm-gray)" }}>
                        {post.postType}
                      </span>
                    </div>
                  </div>

                  {/* Author */}
                  <div className="col-span-2">
                    <div className="flex items-center" style={{ gap: "var(--space-xs)" }}>
                      <User size={14} style={{ color: "var(--warm-gray)" }} />
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--warm-gray)" }}>
                        {post.author?.name || "Unknown"}
                      </span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="col-span-2">
                    <div className="flex items-center" style={{ gap: "var(--space-xs)" }}>
                      <Calendar size={14} style={{ color: "var(--warm-gray)" }} />
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--warm-gray)" }}>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1">
                    <div className="flex items-center" style={{ gap: "var(--space-xs)" }}>
                      <button
                        onClick={() => router.push(`/admin/posts/edit/${post.id}`)}
                        className="p-1 text-warm-gray transition-colors hover:text-primary"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => window.open(`/journey/${post.slug}`, "_blank")}
                        className="p-1 text-warm-gray transition-colors hover:text-primary"
                        title="View"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleFeatureToggle(post.id, post.featured)}
                        className="p-1 text-warm-gray transition-colors hover:text-primary"
                        title={post.featured ? "Unfeature" : "Feature"}
                      >
                        <Star size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mx-auto max-w-7xl px-6" style={{ marginBottom: "var(--space-lg)" }}>
          <div className="flex items-center justify-between">
            <div style={{ fontSize: "var(--text-sm)", color: "var(--warm-gray)" }}>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.totalCount)} of{" "}
              {pagination.totalCount} posts
            </div>

            <div className="flex items-center" style={{ gap: "var(--space-xs)" }}>
              <button
                onClick={() => setCurrentPage(pagination.page - 1)}
                disabled={!pagination.hasPreviousPage}
                className="flex items-center border-2 border-light-gray px-3 py-2 font-medium uppercase transition-colors disabled:opacity-50"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--off-black)",
                  backgroundColor: "var(--off-white)",
                  gap: "var(--space-xs)",
                }}
              >
                <ChevronLeft size={14} />
                Previous
              </button>

              <span style={{ fontSize: "var(--text-sm)", color: "var(--warm-gray)" }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(pagination.page + 1)}
                disabled={!pagination.hasNextPage}
                className="flex items-center border-2 border-light-gray px-3 py-2 font-medium uppercase transition-colors disabled:opacity-50"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--off-black)",
                  backgroundColor: "var(--off-white)",
                  gap: "var(--space-xs)",
                }}
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
