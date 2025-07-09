"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/trpc/react";
import { QuestionScheduleModal } from "./QuestionScheduleModal";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface Question {
  id: string;
  title: string;
  description: string | null;
  questionType: string;
  category: string;
  isActive: boolean;
  startDate: Date | null;
  endDate: Date | null;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
  responseCount: number;
}

interface QuestionListClientProps {
  initialQuestions: Question[];
  userEmail?: string;
}

export function QuestionListClient({
  initialQuestions,
  userEmail: _userEmail,
}: QuestionListClientProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [scheduleModal, setScheduleModal] = useState<{
    isOpen: boolean;
    questionId: string;
    questionTitle: string;
    startDate: Date | null;
    endDate: Date | null;
  }>({
    isOpen: false,
    questionId: "",
    questionTitle: "",
    startDate: null,
    endDate: null,
  });

  const toggleMutation = api.admin.toggleQuestionStatus.useMutation({
    onMutate: ({ id, isActive }) => {
      setIsToggling(id);
      setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, isActive } : q)));
    },
    onSuccess: () => {
      setIsToggling(null);
    },
    onError: (error, { id }) => {
      setIsToggling(null);
      setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, isActive: !q.isActive } : q)));
      console.error("Failed to toggle question status:", error);
    },
  });

  const handleToggleStatus = (questionId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    toggleMutation.mutate({ id: questionId, isActive: newStatus });
  };

  const handleOpenScheduleModal = (question: Question) => {
    setScheduleModal({
      isOpen: true,
      questionId: question.id,
      questionTitle: question.title,
      startDate: question.startDate,
      endDate: question.endDate,
    });
  };

  const handleCloseScheduleModal = () => {
    setScheduleModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleScheduleSuccess = (
    questionId: string,
    updatedSchedule: { startDate: Date | null; endDate: Date | null }
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, startDate: updatedSchedule.startDate, endDate: updatedSchedule.endDate }
          : q
      )
    );
  };

  // Drag and drop functionality
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const reorderMutation = api.admin.reorderQuestions.useMutation({
    onError: (error) => {
      console.error("Failed to reorder questions:", error);
      // Revert the local state on error
      setQuestions(initialQuestions);
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = filteredQuestions.findIndex((q) => q.id === active.id);
      const newIndex = filteredQuestions.findIndex((q) => q.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedQuestions = arrayMove(filteredQuestions, oldIndex, newIndex);

        // Update displayOrder for all questions
        const updatedQuestions = reorderedQuestions.map((question, index) => ({
          ...question,
          displayOrder: index,
        }));

        // Update local state immediately
        setQuestions((prev) => {
          const newQuestions = [...prev];
          updatedQuestions.forEach((updatedQ) => {
            const index = newQuestions.findIndex((q) => q.id === updatedQ.id);
            if (index !== -1) {
              newQuestions[index] = updatedQ;
            }
          });
          return newQuestions;
        });

        // Send update to server
        const questionUpdates = updatedQuestions.map((question) => ({
          id: question.id,
          displayOrder: question.displayOrder,
        }));

        reorderMutation.mutate(questionUpdates);
      }
    }
  };

  // Filter questions and sort by displayOrder
  const filteredQuestions = questions
    .filter((question) => {
      const categoryMatch = filterCategory === "all" || question.category === filterCategory;
      const typeMatch = filterType === "all" || question.questionType === filterType;
      return categoryMatch && typeMatch;
    })
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Get unique categories and types for filters
  const categories = Array.from(new Set(questions.map((q) => q.category)));
  const questionTypes = Array.from(new Set(questions.map((q) => q.questionType)));

  // Sortable Question Item Component
  const SortableQuestionItem = ({ question }: { question: Question }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: question.id,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        className="border-2 border-b-0 p-6 last:border-b-2"
        style={{
          borderColor: "var(--off-black)",
          backgroundColor: "var(--off-white)",
          ...style,
        }}
      >
        <div className="flex items-start justify-between">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="mr-4 cursor-grab active:cursor-grabbing"
            style={{
              color: "var(--warm-gray)",
              fontSize: "var(--text-lg)",
            }}
          >
            <GripVertical size={20} />
          </div>

          <div className="flex-1">
            <div className="mb-3 flex items-center gap-4">
              <h3
                className="font-bold"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--off-black)",
                }}
              >
                {question.title}
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className="rounded px-2 py-1 text-xs font-medium uppercase"
                  style={{
                    backgroundColor: "var(--light-gray)",
                    color: "var(--warm-gray)",
                  }}
                >
                  {question.category}
                </span>
                <span
                  className="rounded px-2 py-1 text-xs font-medium uppercase"
                  style={{
                    backgroundColor: "var(--light-gray)",
                    color: "var(--warm-gray)",
                  }}
                >
                  {question.questionType}
                </span>
                <span
                  className={`rounded px-2 py-1 text-xs font-medium uppercase`}
                  style={{
                    backgroundColor: question.isActive ? "var(--primary)" : "var(--light-gray)",
                    color: question.isActive ? "var(--off-white)" : "var(--warm-gray)",
                  }}
                >
                  {question.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            </div>

            {question.description && (
              <p
                className="mb-3"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--warm-gray)",
                  lineHeight: "1.6",
                }}
              >
                {question.description}
              </p>
            )}

            <div className="flex items-center gap-6 text-sm">
              <span style={{ color: "var(--warm-gray)" }}>
                Responses: {question.responseCount || 0}
              </span>
              <span style={{ color: "var(--warm-gray)" }}>
                Created: {new Date(question.createdAt).toLocaleDateString()}
              </span>
              {question.startDate && (
                <span style={{ color: "var(--warm-gray)" }}>
                  Start: {new Date(question.startDate).toLocaleDateString()}
                </span>
              )}
              {question.endDate && (
                <span style={{ color: "var(--warm-gray)" }}>
                  End: {new Date(question.endDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleStatus(question.id, question.isActive)}
              disabled={isToggling === question.id}
              className="border-2 px-4 py-2 font-medium uppercase transition-colors hover:bg-gray-100 disabled:opacity-50"
              style={{
                borderColor: "var(--off-black)",
                color: "var(--off-black)",
                fontSize: "var(--text-xs)",
              }}
            >
              {isToggling === question.id ? "..." : question.isActive ? "DEACTIVATE" : "ACTIVATE"}
            </button>
            <button
              onClick={() => handleOpenScheduleModal(question)}
              className="border-2 px-4 py-2 font-medium uppercase transition-colors hover:bg-gray-100"
              style={{
                borderColor: "var(--off-black)",
                color: "var(--off-black)",
                fontSize: "var(--text-xs)",
              }}
            >
              SCHEDULE
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: "var(--off-white)" }}>
      {/* Hero Section - Dramatic Typography */}
      <section style={{ marginBottom: "var(--space-2xl)" }}>
        <h1
          className="font-bold uppercase tracking-tight"
          style={{
            fontSize: "var(--text-hero)",
            color: "var(--off-black)",
            letterSpacing: "-0.02em",
            lineHeight: "1.1",
            marginBottom: "var(--space-md)",
          }}
        >
          QUESTION DATABASE
        </h1>
        <div className="flex items-center justify-between">
          <p
            className="font-medium"
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--warm-gray)",
              maxWidth: "65ch",
            }}
          >
            Manage research questions across all categories and question types. Activate, schedule,
            and analyze community feedback.
          </p>

          <Link
            href="/admin/questions/new"
            className="inline-block font-bold uppercase transition-all duration-200 ease-out"
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--off-white)",
              backgroundColor: "var(--primary)",
              padding: "var(--space-md) var(--space-lg)",
              border: "2px solid var(--primary)",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--off-black)";
              e.currentTarget.style.borderColor = "var(--off-black)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--primary)";
              e.currentTarget.style.borderColor = "var(--primary)";
            }}
          >
            Create Question
          </Link>
        </div>
      </section>

      {/* Filters - Brutalist Button Groups */}
      <section style={{ marginBottom: "var(--space-2xl)" }}>
        <h2
          className="font-bold uppercase"
          style={{
            fontSize: "var(--text-xl)",
            color: "var(--off-black)",
            marginBottom: "var(--space-lg)",
          }}
        >
          FILTER CONTROLS
        </h2>

        <div className="space-y-6">
          {/* Category Filter */}
          <div>
            <div
              className="font-medium uppercase"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--warm-gray)",
                marginBottom: "var(--space-sm)",
                letterSpacing: "0.05em",
              }}
            >
              BY CATEGORY
            </div>
            <div className="flex items-center gap-0">
              <button
                onClick={() => setFilterCategory("all")}
                className="px-4 py-2 font-medium uppercase transition-all duration-200 ease-out"
                style={{
                  fontSize: "var(--text-sm)",
                  color: filterCategory === "all" ? "var(--off-white)" : "var(--off-black)",
                  backgroundColor: filterCategory === "all" ? "var(--primary)" : "var(--off-white)",
                  border: "2px solid var(--off-black)",
                  borderRight: "1px solid var(--off-black)",
                }}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilterCategory(category)}
                  className="px-4 py-2 font-medium uppercase transition-all duration-200 ease-out"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: filterCategory === category ? "var(--off-white)" : "var(--off-black)",
                    backgroundColor:
                      filterCategory === category ? "var(--primary)" : "var(--off-white)",
                    border: "2px solid var(--off-black)",
                    borderLeft: "1px solid var(--off-black)",
                    borderRight: "1px solid var(--off-black)",
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <div
              className="font-medium uppercase"
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--warm-gray)",
                marginBottom: "var(--space-sm)",
                letterSpacing: "0.05em",
              }}
            >
              BY TYPE
            </div>
            <div className="flex items-center gap-0">
              <button
                onClick={() => setFilterType("all")}
                className="px-4 py-2 font-medium uppercase transition-all duration-200 ease-out"
                style={{
                  fontSize: "var(--text-sm)",
                  color: filterType === "all" ? "var(--off-white)" : "var(--off-black)",
                  backgroundColor: filterType === "all" ? "var(--primary)" : "var(--off-white)",
                  border: "2px solid var(--off-black)",
                  borderRight: "1px solid var(--off-black)",
                }}
              >
                All
              </button>
              {questionTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className="px-4 py-2 font-medium uppercase transition-all duration-200 ease-out"
                  style={{
                    fontSize: "var(--text-sm)",
                    color: filterType === type ? "var(--off-white)" : "var(--off-black)",
                    backgroundColor: filterType === type ? "var(--primary)" : "var(--off-white)",
                    border: "2px solid var(--off-black)",
                    borderLeft: "1px solid var(--off-black)",
                    borderRight: "1px solid var(--off-black)",
                  }}
                >
                  {type.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Display */}
      <section style={{ marginBottom: "var(--space-2xl)" }}>
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            border: "2px solid var(--off-black)",
          }}
        >
          <div
            className="border-r-2 p-4 text-center"
            style={{
              borderColor: "var(--off-black)",
              backgroundColor: "var(--off-white)",
            }}
          >
            <div
              className="font-mono font-bold"
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--off-black)",
                marginBottom: "var(--space-xs)",
              }}
            >
              {filteredQuestions.length}
            </div>
            <div
              className="font-medium uppercase"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--warm-gray)",
                letterSpacing: "0.05em",
              }}
            >
              Showing
            </div>
          </div>

          <div
            className="border-r-2 p-4 text-center"
            style={{
              borderColor: "var(--off-black)",
              backgroundColor: "var(--off-white)",
            }}
          >
            <div
              className="font-mono font-bold"
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--primary)",
                marginBottom: "var(--space-xs)",
              }}
            >
              {filteredQuestions.filter((q) => q.isActive).length}
            </div>
            <div
              className="font-medium uppercase"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--warm-gray)",
                letterSpacing: "0.05em",
              }}
            >
              Active
            </div>
          </div>

          <div
            className="border-r-2 p-4 text-center"
            style={{
              borderColor: "var(--off-black)",
              backgroundColor: "var(--off-white)",
            }}
          >
            <div
              className="font-mono font-bold"
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--off-black)",
                marginBottom: "var(--space-xs)",
              }}
            >
              {filteredQuestions.reduce((total, q) => total + q.responseCount, 0)}
            </div>
            <div
              className="font-medium uppercase"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--warm-gray)",
                letterSpacing: "0.05em",
              }}
            >
              Responses
            </div>
          </div>

          <div
            className="p-4 text-center"
            style={{
              backgroundColor: "var(--off-white)",
            }}
          >
            <div
              className="font-mono font-bold"
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--off-black)",
                marginBottom: "var(--space-xs)",
              }}
            >
              {questions.length}
            </div>
            <div
              className="font-medium uppercase"
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--warm-gray)",
                letterSpacing: "0.05em",
              }}
            >
              Total
            </div>
          </div>
        </div>
      </section>

      {/* Questions List */}
      <section>
        <h2
          className="font-bold uppercase"
          style={{
            fontSize: "var(--text-xl)",
            color: "var(--off-black)",
            marginBottom: "var(--space-lg)",
          }}
        >
          QUESTIONS
        </h2>

        {filteredQuestions.length === 0 ? (
          <div
            className="border-2 p-8 text-center"
            style={{
              borderColor: "var(--off-black)",
              backgroundColor: "var(--light-gray)",
            }}
          >
            <p
              className="font-medium"
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--warm-gray)",
              }}
            >
              No questions match current filters
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredQuestions.map((q) => q.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-0">
                {filteredQuestions.map((question) => (
                  <SortableQuestionItem key={question.id} question={question} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </section>

      {/* Schedule Modal */}
      <QuestionScheduleModal
        isOpen={scheduleModal.isOpen}
        onClose={handleCloseScheduleModal}
        questionId={scheduleModal.questionId}
        questionTitle={scheduleModal.questionTitle}
        initialStartDate={scheduleModal.startDate}
        initialEndDate={scheduleModal.endDate}
        onSuccess={(updatedSchedule) =>
          handleScheduleSuccess(scheduleModal.questionId, updatedSchedule)
        }
      />
    </div>
  );
}
