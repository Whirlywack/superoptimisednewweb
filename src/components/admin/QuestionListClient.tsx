"use client";

import { useState } from "react";
import { api } from "@/lib/trpc/client";

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

export function QuestionListClient({ initialQuestions, userEmail }: QuestionListClientProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const toggleMutation = api.admin.toggleQuestionStatus.useMutation({
    onMutate: ({ id, isActive }) => {
      // Optimistic update
      setIsToggling(id);
      setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, isActive } : q)));
    },
    onSuccess: () => {
      setIsToggling(null);
    },
    onError: (error, { id }) => {
      // Revert optimistic update on error
      setIsToggling(null);
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === id
            ? { ...q, isActive: !q.isActive } // Revert the toggle
            : q
        )
      );
      console.error("Failed to toggle question status:", error);
    },
  });

  const handleToggleStatus = (questionId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    toggleMutation.mutate({ id: questionId, isActive: newStatus });
  };

  return (
    <div className="font-mono">
      {/* Brutalist Terminal Header */}
      <div
        className="border-b-2 border-off-black bg-off-black"
        style={{ padding: "var(--space-lg)" }}
      >
        <div className="space-y-4">
          <div className="font-mono text-sm text-green-400">$ cd /admin/questions/</div>
          <div
            className="font-mono font-bold uppercase tracking-wide text-off-white"
            style={{ fontSize: "var(--text-hero)", lineHeight: "1.1" }}
          >
            QUESTION FACTORY
          </div>
          <div className="space-y-1">
            <div className="font-mono text-sm text-warm-gray">
              database.questions.count(): {questions.length}
            </div>
            <div className="font-mono text-sm text-warm-gray">
              status.active: {questions.filter((q) => q.isActive).length} | status.inactive:{" "}
              {questions.filter((q) => !q.isActive).length}
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Command Interface */}
      <div className="border-b-2 border-off-black bg-white" style={{ padding: "var(--space-lg)" }}>
        <div style={{ marginBottom: "var(--space-lg)" }}>
          <div
            className="font-mono font-bold uppercase tracking-wide text-off-black"
            style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-md)" }}
          >
            COMMAND INTERFACE
          </div>

          <div style={{ marginBottom: "var(--space-md)" }}>
            <div className="font-mono text-sm text-warm-gray">$ admin/questions/ --operations</div>
            <div className="mt-4 flex flex-wrap gap-0">
              <a
                href="/admin/questions/new"
                className="border-2 border-off-black bg-off-black font-mono text-sm text-off-white transition-all duration-200 hover:border-primary hover:bg-primary hover:text-off-black"
                style={{ padding: "var(--space-sm) var(--space-md)" }}
              >
                CREATE_NEW
              </a>
              <button
                className="border-2 border-l-0 border-off-black bg-white font-mono text-sm text-off-black transition-all duration-200 hover:bg-light-gray"
                style={{ padding: "var(--space-sm) var(--space-md)" }}
              >
                FILTER_ALL
              </button>
              <button
                className="border-2 border-l-0 border-off-black bg-white font-mono text-sm text-off-black transition-all duration-200 hover:bg-light-gray"
                style={{ padding: "var(--space-sm) var(--space-md)" }}
              >
                SORT_DATE
              </button>
              <button
                className="border-2 border-l-0 border-off-black bg-white font-mono text-sm text-off-black transition-all duration-200 hover:bg-light-gray"
                style={{ padding: "var(--space-sm) var(--space-md)" }}
              >
                EXPORT_CSV
              </button>
            </div>
          </div>

          <div>
            <div className="font-mono text-sm text-warm-gray">$ filter --status</div>
            <div className="mt-2 flex gap-0">
              <button
                className="border-2 border-off-black bg-white font-mono text-xs text-off-black transition-all duration-200 hover:bg-off-black hover:text-off-white"
                style={{ padding: "var(--space-xs) var(--space-sm)" }}
              >
                ALL
              </button>
              <button
                className="border-2 border-l-0 border-off-black bg-white font-mono text-xs text-off-black transition-all duration-200 hover:bg-off-black hover:text-off-white"
                style={{ padding: "var(--space-xs) var(--space-sm)" }}
              >
                ACTIVE
              </button>
              <button
                className="border-2 border-l-0 border-off-black bg-white font-mono text-xs text-off-black transition-all duration-200 hover:bg-off-black hover:text-off-white"
                style={{ padding: "var(--space-xs) var(--space-sm)" }}
              >
                INACTIVE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Brutalist Data Grid */}
      <div className="bg-light-gray" style={{ padding: "var(--space-lg)" }}>
        <div
          className="font-mono font-bold uppercase tracking-wide text-off-black"
          style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-md)" }}
        >
          DATABASE RECORDS
        </div>
        <div
          className="font-mono text-sm text-warm-gray"
          style={{ marginBottom: "var(--space-md)" }}
        >
          $ SELECT * FROM questions ORDER BY display_order, created_at DESC;
        </div>

        {questions.length === 0 ? (
          <div
            className="border-2 border-off-black bg-white text-center"
            style={{ padding: "var(--space-xl)" }}
          >
            <div
              className="font-mono font-bold uppercase text-off-black"
              style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-sm)" }}
            >
              EMPTY_RESULT_SET
            </div>
            <div className="font-mono text-sm text-warm-gray">
              Execute CREATE_NEW to populate table
            </div>
          </div>
        ) : (
          <div className="border-2 border-off-black">
            {/* Brutalist Table Header */}
            <div
              className="border-b-2 border-off-black bg-off-black"
              style={{ padding: "var(--space-sm)" }}
            >
              <div className="grid grid-cols-12 gap-4 font-mono text-xs font-bold uppercase tracking-wide text-off-white">
                <div className="col-span-1">UUID</div>
                <div className="col-span-3">TITLE_TEXT</div>
                <div className="col-span-2">Q_TYPE</div>
                <div className="col-span-1">CATEGORY</div>
                <div className="col-span-1">STATUS</div>
                <div className="col-span-1">RESP_CNT</div>
                <div className="col-span-1">CREATED</div>
                <div className="col-span-2">OPERATIONS</div>
              </div>
            </div>

            {/* Data Rows */}
            {questions.map((question, index) => (
              <div
                key={question.id}
                className={`grid grid-cols-12 gap-4 border-b border-warm-gray transition-all duration-200 hover:bg-primary hover:text-off-white ${
                  index % 2 === 0 ? "bg-off-white" : "bg-white"
                }`}
                style={{ padding: "var(--space-sm)" }}
              >
                <div className="col-span-1 font-mono text-xs text-warm-gray">
                  {question.id.slice(-8)}
                </div>
                <div className="col-span-3">
                  <div
                    className="truncate font-mono text-sm font-bold text-off-black"
                    title={question.title}
                  >
                    {question.title}
                  </div>
                  {question.description && (
                    <div
                      className="mt-1 truncate font-mono text-xs text-warm-gray"
                      title={question.description}
                    >
                      {question.description.slice(0, 50)}...
                    </div>
                  )}
                </div>
                <div className="col-span-2 font-mono text-xs uppercase text-off-black">
                  {question.questionType.replace("-", "_")}
                </div>
                <div className="col-span-1 font-mono text-xs uppercase text-warm-gray">
                  {question.category || "general"}
                </div>
                <div className="col-span-1">
                  <span
                    className={`font-mono text-xs font-bold uppercase ${
                      question.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {question.isActive ? "LIVE" : "STOP"}
                  </span>
                </div>
                <div className="col-span-1 font-mono text-xs font-bold text-off-black">
                  {question.responseCount.toString().padStart(3, "0")}
                </div>
                <div className="col-span-1 font-mono text-xs text-warm-gray">
                  {new Date(question.createdAt).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </div>
                <div className="col-span-2 flex gap-0">
                  <button
                    className="border-2 border-off-black bg-white font-mono text-xs text-off-black transition-all duration-200 hover:bg-off-black hover:text-off-white"
                    style={{ padding: "var(--space-xs) var(--space-sm)" }}
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => handleToggleStatus(question.id, question.isActive)}
                    disabled={isToggling === question.id}
                    className={`border-2 border-l-0 border-off-black font-mono text-xs transition-all duration-200 ${
                      isToggling === question.id
                        ? "cursor-not-allowed bg-warm-gray text-off-white"
                        : question.isActive
                          ? "bg-white text-red-600 hover:bg-red-600 hover:text-white"
                          : "bg-white text-green-600 hover:bg-green-600 hover:text-white"
                    }`}
                    style={{ padding: "var(--space-xs) var(--space-sm)" }}
                  >
                    {isToggling === question.id ? "..." : question.isActive ? "STOP" : "START"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brutalist System Terminal */}
      <div
        className="border-t-2 border-off-black bg-off-white"
        style={{ padding: "var(--space-lg)" }}
      >
        <div
          className="font-mono font-bold uppercase tracking-wide text-off-black"
          style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-md)" }}
        >
          SYSTEM_STATUS
        </div>
        <div
          className="font-mono text-sm text-warm-gray"
          style={{ marginBottom: "var(--space-md)" }}
        >
          $ system --diagnostic --verbose
        </div>
        <div
          className="border-2 border-off-black bg-off-black"
          style={{ padding: "var(--space-md)" }}
        >
          <div className="space-y-2 font-mono text-sm">
            <div className="text-green-400">✓ database.connection.status: OPERATIONAL</div>
            <div className="text-green-400">
              ✓ questions.total_count: {questions.length.toString().padStart(3, "0")}
            </div>
            <div className="text-green-400">
              ✓ questions.active_count:{" "}
              {questions
                .filter((q) => q.isActive)
                .length.toString()
                .padStart(3, "0")}
            </div>
            <div className="text-green-400">
              ✓ question_types.supported:
              [BINARY|MULTI_CHOICE|RATING_SCALE|TEXT_RESPONSE|RANKING|AB_TEST]
            </div>
            <div className="text-green-400">✓ admin.session.authenticated: TRUE</div>
            <div className="text-green-400">✓ trpc.api.status: RESPONDING</div>
            <div className="mt-4 border-t border-warm-gray pt-2">
              <div className="text-warm-gray">system.timestamp: {new Date().toISOString()}</div>
              <div className="text-warm-gray">build.environment: PRODUCTION</div>
              <div className="text-warm-gray">admin.user: {userEmail}</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "var(--space-lg)" }}>
          <div
            className="font-mono text-sm text-warm-gray"
            style={{ marginBottom: "var(--space-sm)" }}
          >
            $ admin --help
          </div>
          <div
            className="border-2 border-off-black bg-white"
            style={{ padding: "var(--space-md)" }}
          >
            <div className="space-y-1 font-mono text-xs text-off-black">
              <div>
                <span className="text-warm-gray">CREATE_NEW</span> → Launch question factory
                interface
              </div>
              <div>
                <span className="text-warm-gray">EDIT</span> → Modify existing question
                configuration
              </div>
              <div>
                <span className="text-warm-gray">START/STOP</span> → Toggle question activation
                state
              </div>
              <div>
                <span className="text-warm-gray">FILTER_ALL</span> → Display filtered question
                subsets
              </div>
              <div>
                <span className="text-warm-gray">EXPORT_CSV</span> → Extract question data for
                analysis
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
