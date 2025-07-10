"use client";

import React, { useState, useMemo } from "react";
import { api } from "@/lib/trpc/react";
import {
  FileText,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  History,
  Code,
  Type,
  Hash,
} from "lucide-react";

interface ContentBlock {
  id: string;
  pageKey: string;
  blockKey: string;
  contentType: "markdown" | "html" | "text" | "tsx";
  content: string;
  isActive: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  recentVersions?: Array<{
    version: number;
    createdAt: Date;
    createdBy: string | null;
    changeReason: string | null;
  }>;
}

interface ContentBlockEditorProps {
  userEmail: string;
}

export function ContentBlockEditor({ userEmail: _userEmail }: ContentBlockEditorProps) {
  const [selectedPage, setSelectedPage] = useState<string>("all");
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [editContentType, setEditContentType] = useState<"markdown" | "html" | "text" | "tsx">(
    "markdown"
  );
  const [changeReason, setChangeReason] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<string | null>(null);

  // New content block form
  const [newBlock, setNewBlock] = useState({
    pageKey: "",
    blockKey: "",
    contentType: "markdown" as const,
    content: "",
  });

  // tRPC queries and mutations
  const { data: contentData, refetch: refetchBlocks } = api.content.getAllContentBlocks.useQuery();

  const contentBlocks = useMemo(() => contentData?.blocks || [], [contentData?.blocks]);

  const { data: versions } = api.content.getContentVersions.useQuery(
    { contentBlockId: showVersionHistory || "" },
    { enabled: !!showVersionHistory }
  );

  const updateBlockMutation = api.content.updateContentBlock.useMutation({
    onSuccess: () => {
      refetchBlocks();
      setEditingBlock(null);
      setEditContent("");
      setChangeReason("");
    },
  });

  const createBlockMutation = api.content.createContentBlock.useMutation({
    onSuccess: () => {
      refetchBlocks();
      setShowCreateModal(false);
      setNewBlock({ pageKey: "", blockKey: "", contentType: "markdown", content: "" });
    },
  });

  const deleteBlockMutation = api.content.deleteContentBlock.useMutation({
    onSuccess: () => {
      refetchBlocks();
    },
  });

  const toggleStatusMutation = api.content.toggleContentBlockStatus.useMutation({
    onSuccess: () => {
      refetchBlocks();
    },
  });

  // Get unique page keys for filter
  const pageKeys = React.useMemo(() => {
    return [...new Set(contentBlocks.map((block) => block.pageKey))].sort();
  }, [contentBlocks]);

  const handleEditStart = (block: ContentBlock) => {
    setEditingBlock(block.id);
    setEditContent(block.content);
    setEditContentType(block.contentType);
    setChangeReason("");
  };

  const handleEditSave = async () => {
    if (!editingBlock) return;

    await updateBlockMutation.mutateAsync({
      id: editingBlock,
      content: editContent,
      contentType: editContentType,
    });
  };

  const handleEditCancel = () => {
    setEditingBlock(null);
    setEditContent("");
    setChangeReason("");
  };

  const handleCreateBlock = async () => {
    if (!newBlock.pageKey || !newBlock.blockKey || !newBlock.content) return;

    await createBlockMutation.mutateAsync(newBlock);
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (confirm("Are you sure you want to delete this content block?")) {
      await deleteBlockMutation.mutateAsync({ id: blockId });
    }
  };

  const handleToggleStatus = async (blockId: string, isActive: boolean) => {
    await toggleStatusMutation.mutateAsync({ id: blockId, isActive });
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "markdown":
        return <Hash size={16} />;
      case "html":
        return <Code size={16} />;
      case "text":
        return <Type size={16} />;
      case "tsx":
        return <Code size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const renderPreview = (content: string, contentType: string) => {
    if (contentType === "html") {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    } else if (contentType === "markdown") {
      // Simple markdown preview (you might want to use a proper markdown parser)
      return <div className="prose prose-sm max-w-none">{content}</div>;
    } else {
      return <div className="whitespace-pre-wrap">{content}</div>;
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
                className="font-bold uppercase"
                style={{ fontSize: "var(--text-hero)", color: "var(--off-black)" }}
              >
                Content Block Editor
              </h1>
              <p style={{ fontSize: "var(--text-base)", color: "var(--warm-gray)" }}>
                Manage content blocks across all pages
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center font-medium uppercase transition-colors hover:bg-primary hover:text-off-white"
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
              Create Block
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto max-w-7xl px-6" style={{ paddingTop: "var(--space-lg)" }}>
        <div className="mb-6 flex items-center gap-0">
          <button
            onClick={() => setSelectedPage("all")}
            className={`font-medium uppercase transition-colors ${selectedPage === "all" ? "bg-off-black text-off-white" : "bg-light-gray text-off-black"}`}
            style={{
              fontSize: "var(--text-sm)",
              padding: "var(--space-sm) var(--space-md)",
              border: "2px solid var(--light-gray)",
              borderRight: "1px solid var(--light-gray)",
            }}
          >
            All Pages
          </button>
          {pageKeys.map((pageKey) => (
            <button
              key={pageKey}
              onClick={() => setSelectedPage(pageKey)}
              className={`font-medium uppercase transition-colors ${selectedPage === pageKey ? "bg-off-black text-off-white" : "bg-light-gray text-off-black"}`}
              style={{
                fontSize: "var(--text-sm)",
                padding: "var(--space-sm) var(--space-md)",
                border: "2px solid var(--light-gray)",
                borderRight:
                  pageKey === pageKeys[pageKeys.length - 1]
                    ? "2px solid var(--light-gray)"
                    : "1px solid var(--light-gray)",
              }}
            >
              {pageKey}
            </button>
          ))}
        </div>

        {/* Content Blocks List */}
        <div className="space-y-4">
          {contentBlocks?.map((block) => (
            <div
              key={block.id}
              className="border-2 p-6"
              style={{
                borderColor: "var(--light-gray)",
                backgroundColor: "var(--off-white)",
                opacity: block.isActive ? 1 : 0.6,
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getContentTypeIcon(block.contentType)}
                      <h3
                        className="font-bold"
                        style={{ fontSize: "var(--text-lg)", color: "var(--off-black)" }}
                      >
                        {block.pageKey}:{block.blockKey}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded px-2 py-1 text-xs font-medium uppercase"
                        style={{
                          backgroundColor: "var(--light-gray)",
                          color: "var(--warm-gray)",
                        }}
                      >
                        {block.contentType}
                      </span>
                      <span
                        className="rounded px-2 py-1 text-xs font-medium uppercase"
                        style={{
                          backgroundColor: block.isActive ? "var(--primary)" : "var(--warm-gray)",
                          color: "var(--off-white)",
                        }}
                      >
                        v{block.version}
                      </span>
                      <span
                        className="rounded px-2 py-1 text-xs font-medium uppercase"
                        style={{
                          backgroundColor: block.isActive ? "var(--primary)" : "var(--warm-gray)",
                          color: "var(--off-white)",
                        }}
                      >
                        {block.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {editingBlock === block.id ? (
                    <div className="space-y-4">
                      <div>
                        <label
                          className="mb-2 block font-medium"
                          style={{ fontSize: "var(--text-sm)", color: "var(--off-black)" }}
                        >
                          Content Type:
                        </label>
                        <select
                          value={editContentType}
                          onChange={(e) =>
                            setEditContentType(
                              e.target.value as "markdown" | "html" | "text" | "tsx"
                            )
                          }
                          className="border-2 border-light-gray bg-off-white px-3 py-2 font-mono text-sm"
                        >
                          <option value="markdown">Markdown</option>
                          <option value="html">HTML</option>
                          <option value="text">Text</option>
                          <option value="tsx">TSX/React</option>
                        </select>
                      </div>
                      <div>
                        <label
                          className="mb-2 block font-medium"
                          style={{ fontSize: "var(--text-sm)", color: "var(--off-black)" }}
                        >
                          Content:
                        </label>
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full border-2 border-light-gray bg-off-white p-3 font-mono text-sm"
                          rows={8}
                          placeholder="Enter content..."
                        />
                      </div>
                      <div>
                        <label
                          className="mb-2 block font-medium"
                          style={{ fontSize: "var(--text-sm)", color: "var(--off-black)" }}
                        >
                          Change Reason:
                        </label>
                        <input
                          type="text"
                          value={changeReason}
                          onChange={(e) => setChangeReason(e.target.value)}
                          className="w-full border-2 border-light-gray bg-off-white p-3 font-mono text-sm"
                          placeholder="Describe your changes..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleEditSave}
                          disabled={updateBlockMutation.isLoading}
                          className="flex items-center gap-2 bg-primary px-4 py-2 font-medium uppercase text-off-white transition-colors hover:bg-off-black disabled:opacity-50"
                        >
                          <Save size={16} />
                          {updateBlockMutation.isLoading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="flex items-center gap-2 bg-light-gray px-4 py-2 font-medium uppercase text-off-black transition-colors hover:bg-warm-gray"
                        >
                          <X size={16} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {previewMode === block.id ? (
                        <div
                          className="border-2 border-light-gray bg-off-white p-4"
                          style={{ maxHeight: "200px", overflow: "auto" }}
                        >
                          {renderPreview(block.content, block.contentType)}
                        </div>
                      ) : (
                        <div
                          className="bg-light-gray p-4 font-mono text-sm text-warm-gray"
                          style={{ maxHeight: "200px", overflow: "auto" }}
                        >
                          {block.content.substring(0, 300)}
                          {block.content.length > 300 && "..."}
                        </div>
                      )}
                      <div className="mt-3 flex items-center gap-2 text-xs text-warm-gray">
                        <span>Last updated: {new Date(block.updatedAt).toLocaleDateString()}</span>
                        {block.recentVersions && block.recentVersions.length > 0 && (
                          <span>• {block.recentVersions.length} version(s)</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-4 flex items-center gap-2">
                  <button
                    onClick={() => setPreviewMode(previewMode === block.id ? null : block.id)}
                    className="border-2 border-light-gray p-2 text-warm-gray transition-colors hover:border-primary hover:text-off-black"
                    title={previewMode === block.id ? "Hide preview" : "Show preview"}
                  >
                    {previewMode === block.id ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => setShowVersionHistory(block.id)}
                    className="border-2 border-light-gray p-2 text-warm-gray transition-colors hover:border-primary hover:text-off-black"
                    title="Version history"
                  >
                    <History size={16} />
                  </button>
                  <button
                    onClick={() => handleEditStart(block)}
                    disabled={editingBlock === block.id}
                    className="border-2 border-light-gray p-2 text-warm-gray transition-colors hover:border-primary hover:text-off-black disabled:opacity-50"
                    title="Edit content"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(block.id, !block.isActive)}
                    className="border-2 border-light-gray p-2 text-warm-gray transition-colors hover:border-primary hover:text-off-black"
                    title={block.isActive ? "Deactivate" : "Activate"}
                  >
                    {block.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => handleDeleteBlock(block.id)}
                    className="border-2 border-light-gray p-2 text-warm-gray transition-colors hover:border-red-600 hover:text-red-600"
                    title="Delete content block"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Block Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-2xl border-2 border-off-black bg-off-white p-6">
            <h2
              className="mb-4 font-bold uppercase"
              style={{ fontSize: "var(--text-lg)", color: "var(--off-black)" }}
            >
              Create New Content Block
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="mb-2 block font-medium"
                    style={{ fontSize: "var(--text-sm)", color: "var(--off-black)" }}
                  >
                    Page Key:
                  </label>
                  <input
                    type="text"
                    value={newBlock.pageKey}
                    onChange={(e) => setNewBlock({ ...newBlock, pageKey: e.target.value })}
                    className="w-full border-2 border-light-gray bg-off-white p-3 font-mono text-sm"
                    placeholder="e.g., homepage, about, contact"
                  />
                </div>
                <div>
                  <label
                    className="mb-2 block font-medium"
                    style={{ fontSize: "var(--text-sm)", color: "var(--off-black)" }}
                  >
                    Block Key:
                  </label>
                  <input
                    type="text"
                    value={newBlock.blockKey}
                    onChange={(e) => setNewBlock({ ...newBlock, blockKey: e.target.value })}
                    className="w-full border-2 border-light-gray bg-off-white p-3 font-mono text-sm"
                    placeholder="e.g., hero-title, mission-statement"
                  />
                </div>
              </div>
              <div>
                <label
                  className="mb-2 block font-medium"
                  style={{ fontSize: "var(--text-sm)", color: "var(--off-black)" }}
                >
                  Content Type:
                </label>
                <select
                  value={newBlock.contentType}
                  onChange={(e) =>
                    setNewBlock({
                      ...newBlock,
                      contentType: e.target.value as "markdown" | "html" | "text" | "tsx",
                    })
                  }
                  className="border-2 border-light-gray bg-off-white px-3 py-2 font-mono text-sm"
                >
                  <option value="markdown">Markdown</option>
                  <option value="html">HTML</option>
                  <option value="text">Text</option>
                  <option value="tsx">TSX/React</option>
                </select>
              </div>
              <div>
                <label
                  className="mb-2 block font-medium"
                  style={{ fontSize: "var(--text-sm)", color: "var(--off-black)" }}
                >
                  Content:
                </label>
                <textarea
                  value={newBlock.content}
                  onChange={(e) => setNewBlock({ ...newBlock, content: e.target.value })}
                  className="w-full border-2 border-light-gray bg-off-white p-3 font-mono text-sm"
                  rows={8}
                  placeholder="Enter content..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateBlock}
                  disabled={
                    createBlockMutation.isLoading ||
                    !newBlock.pageKey ||
                    !newBlock.blockKey ||
                    !newBlock.content
                  }
                  className="flex items-center gap-2 bg-primary px-4 py-2 font-medium uppercase text-off-white transition-colors hover:bg-off-black disabled:opacity-50"
                >
                  <Plus size={16} />
                  {createBlockMutation.isLoading ? "Creating..." : "Create"}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex items-center gap-2 bg-light-gray px-4 py-2 font-medium uppercase text-off-black transition-colors hover:bg-warm-gray"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[80vh] w-full max-w-4xl overflow-y-auto border-2 border-off-black bg-off-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="font-bold uppercase"
                style={{ fontSize: "var(--text-lg)", color: "var(--off-black)" }}
              >
                Version History
              </h2>
              <button
                onClick={() => setShowVersionHistory(null)}
                className="border-2 border-light-gray p-2 text-warm-gray transition-colors hover:border-primary hover:text-off-black"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {versions?.map((version) => (
                <div key={version.version} className="border-2 border-light-gray bg-off-white p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary">v{version.version}</span>
                      <span className="text-sm text-warm-gray">
                        {new Date(version.createdAt).toLocaleString()}
                      </span>
                      {version.createdBy && (
                        <span className="text-sm text-warm-gray">by {version.createdBy}</span>
                      )}
                    </div>
                    <span className="text-xs text-warm-gray">
                      {version.changeReason || "No reason provided"}
                    </span>
                  </div>
                  <div className="max-h-32 overflow-y-auto bg-light-gray p-3 font-mono text-sm text-warm-gray">
                    {version.content.substring(0, 500)}
                    {version.content.length > 500 && "..."}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
