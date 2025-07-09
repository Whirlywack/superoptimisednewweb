"use client";

import React, { useState } from "react";
import { api } from "@/lib/trpc/react";
import { useRouter } from "next/navigation";
import { Save, Eye, ArrowLeft, Copy } from "lucide-react";

interface PostEditorClientProps {
  mode: "create" | "edit";
  postId?: string;
}

export function PostEditorClient({ mode, postId }: PostEditorClientProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<"tsx" | "markdown">("tsx");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [isSaving, setIsSaving] = useState(false);
  const [templateUsed, setTemplateUsed] = useState<string | null>(null);

  // Get templates for quick insertion
  const { data: templates } = api.content.getContentTemplates.useQuery();

  // tRPC queries and mutations
  const { data: existingPost } = api.blog.getPostById.useQuery(
    { id: postId || "" },
    { enabled: mode === "edit" && !!postId }
  );

  const createPostMutation = api.blog.createPost.useMutation();
  const updatePostMutation = api.blog.updatePost.useMutation();

  // Load existing post data
  React.useEffect(() => {
    if (existingPost && mode === "edit") {
      setTitle(existingPost.title);
      setSlug(existingPost.slug);
      setExcerpt(existingPost.excerpt || "");
      setContent(existingPost.content);
      setContentType(existingPost.contentType as "tsx" | "markdown");
      setStatus(existingPost.status as "draft" | "published");
    }
  }, [existingPost, mode]);

  // Load template if available (for new posts)
  React.useEffect(() => {
    if (mode === "create") {
      const selectedTemplate = sessionStorage.getItem("selectedTemplate");
      if (selectedTemplate) {
        try {
          const template = JSON.parse(selectedTemplate);
          setContent(template.defaultContent);
          setContentType("tsx");
          setTemplateUsed(template.title);
          // Clear the template from sessionStorage
          sessionStorage.removeItem("selectedTemplate");
        } catch (error) {
          console.error("Failed to parse template:", error);
        }
      }
    }
  }, [mode]);

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!slug || generateSlug(slug) === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSave = async () => {
    if (!title || !content) {
      alert("Please fill in title and content");
      return;
    }

    setIsSaving(true);
    try {
      if (mode === "create") {
        await createPostMutation.mutateAsync({
          title,
          slug,
          excerpt,
          content,
          contentType,
          status,
        });
      } else if (postId) {
        await updatePostMutation.mutateAsync({
          id: postId,
          title,
          slug,
          excerpt,
          content,
          contentType,
          status,
        });
      }

      alert(`Post ${status === "published" ? "published" : "saved as draft"} successfully!`);
      if (mode === "create") {
        router.push("/admin");
      }
    } catch (error: any) {
      console.error("Failed to save post:", error);
      alert(error.message || "Failed to save post");
    } finally {
      setIsSaving(false);
    }
  };

  const insertTemplate = (templateContent: string) => {
    setContent(templateContent);
    setContentType("tsx");
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
            <div className="flex items-center" style={{ gap: "var(--space-md)" }}>
              <button
                onClick={() => router.back()}
                className="flex items-center font-medium transition-colors"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--warm-gray)",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  gap: "var(--space-xs)",
                }}
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <div>
                <h1
                  className="font-bold uppercase tracking-tight"
                  style={{
                    fontSize: "var(--text-xl)",
                    color: "var(--off-black)",
                    marginBottom: "var(--space-xs)",
                  }}
                >
                  {mode === "create" ? "Create New Post" : "Edit Post"}
                </h1>
                <p style={{ fontSize: "var(--text-base)", color: "var(--warm-gray)" }}>
                  Build with TypeScript React components
                </p>
              </div>
            </div>

            {/* Actions */}
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
                onClick={() => {
                  if (contentType === "tsx") {
                    alert(
                      "Preview not available for TypeScript components. Use the template variables to build your content and publish to see the result."
                    );
                  } else {
                    window.open(`/journey/${slug}`, "_blank");
                  }
                }}
                disabled={!slug}
              >
                <Eye size={16} />
                Preview
              </button>

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
                onClick={() => {
                  setStatus("draft");
                  handleSave();
                }}
                disabled={isSaving}
              >
                <Save size={16} />
                {isSaving ? "Saving..." : "Save Draft"}
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
                onClick={() => {
                  setStatus("published");
                  handleSave();
                }}
                disabled={isSaving}
              >
                <Save size={16} />
                {isSaving ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div
        className="mx-auto max-w-7xl px-6"
        style={{ paddingTop: "var(--space-lg)", paddingBottom: "var(--space-lg)" }}
      >
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-4">
          {/* Main Editor - Left 3 columns */}
          <div
            className="border-2 border-r-0 lg:col-span-3"
            style={{
              borderColor: "var(--light-gray)",
              backgroundColor: "var(--off-white)",
            }}
          >
            <div style={{ padding: "var(--space-lg)" }}>
              {/* Post Metadata */}
              <div
                className="mb-xl space-y-md"
                style={{
                  paddingBottom: "var(--space-lg)",
                  borderBottom: "2px solid var(--light-gray)",
                }}
              >
                <div>
                  <label
                    className="block font-medium"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--off-black)",
                      marginBottom: "var(--space-xs)",
                    }}
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter post title..."
                    className="w-full rounded-sm border-2 border-light-gray px-md py-sm text-base focus:border-primary focus:outline-none"
                    style={{ backgroundColor: "var(--off-white)" }}
                  />
                </div>

                <div>
                  <label
                    className="block font-medium"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--off-black)",
                      marginBottom: "var(--space-xs)",
                    }}
                  >
                    Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="post-url-slug"
                    className="w-full rounded-sm border-2 border-light-gray px-md py-sm text-base focus:border-primary focus:outline-none"
                    style={{ backgroundColor: "var(--off-white)" }}
                  />
                </div>

                <div>
                  <label
                    className="block font-medium"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--off-black)",
                      marginBottom: "var(--space-xs)",
                    }}
                  >
                    Excerpt
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief description of the post..."
                    rows={2}
                    className="w-full resize-none rounded-sm border-2 border-light-gray px-md py-sm text-base focus:border-primary focus:outline-none"
                    style={{ backgroundColor: "var(--off-white)" }}
                  />
                </div>

                <div>
                  <label
                    className="block font-medium"
                    style={{
                      fontSize: "var(--text-sm)",
                      color: "var(--off-black)",
                      marginBottom: "var(--space-xs)",
                    }}
                  >
                    Content Type
                  </label>
                  <div className="flex items-center" style={{ gap: "var(--space-sm)" }}>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value as "tsx" | "markdown")}
                      className="rounded-sm border-2 border-light-gray px-md py-sm text-base focus:border-primary focus:outline-none"
                      style={{ backgroundColor: "var(--off-white)" }}
                    >
                      <option value="tsx">TypeScript React Component</option>
                      <option value="markdown">Markdown</option>
                    </select>
                    {templateUsed && (
                      <div
                        className="rounded-sm px-md py-sm"
                        style={{
                          backgroundColor: "var(--primary)",
                          color: "var(--off-white)",
                          fontSize: "var(--text-xs)",
                          fontWeight: "bold",
                        }}
                      >
                        Template: {templateUsed}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <label
                  className="block font-medium"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--off-black)",
                    marginBottom: "var(--space-xs)",
                  }}
                >
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    contentType === "tsx"
                      ? "Paste or write your TypeScript React component here..."
                      : "Write your markdown content here..."
                  }
                  rows={25}
                  className="resize-vertical w-full rounded-sm border-2 border-light-gray px-md py-sm font-mono text-sm focus:border-primary focus:outline-none"
                  style={{
                    backgroundColor: "var(--off-white)",
                    minHeight: "500px",
                    lineHeight: "1.4",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Templates Sidebar - Right 1 column */}
          <div
            className="border-2"
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
              <h3
                className="font-bold uppercase"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--off-black)",
                }}
              >
                Templates
              </h3>
            </div>

            <div style={{ padding: "var(--space-md)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                {templates?.templates.map((template) => (
                  <div
                    key={template.id}
                    className="cursor-pointer border-2 transition-all"
                    style={{
                      borderColor: "var(--light-gray)",
                      backgroundColor: "var(--off-white)",
                      padding: "var(--space-sm)",
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4
                          className="font-medium"
                          style={{
                            fontSize: "var(--text-sm)",
                            color: "var(--off-black)",
                            marginBottom: "2px",
                          }}
                        >
                          {template.title}
                        </h4>
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
                        onClick={() => insertTemplate(template.defaultContent)}
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
