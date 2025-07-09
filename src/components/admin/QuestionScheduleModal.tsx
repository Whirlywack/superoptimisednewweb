"use client";

import { useState } from "react";
import { api } from "@/lib/trpc/react";

interface QuestionScheduleModalProps {
  questionId: string;
  questionTitle: string;
  initialStartDate: Date | null;
  initialEndDate: Date | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedSchedule: { startDate: Date | null; endDate: Date | null }) => void;
}

export function QuestionScheduleModal({
  questionId,
  questionTitle,
  initialStartDate,
  initialEndDate,
  isOpen,
  onClose,
  onSuccess,
}: QuestionScheduleModalProps) {
  const [startDate, setStartDate] = useState<string>(
    initialStartDate ? initialStartDate.toISOString().slice(0, 16) : ""
  );
  const [endDate, setEndDate] = useState<string>(
    initialEndDate ? initialEndDate.toISOString().slice(0, 16) : ""
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const updateScheduleMutation = api.admin.updateQuestionSchedule.useMutation({
    onSuccess: (data) => {
      onSuccess({
        startDate: data.startDate,
        endDate: data.endDate,
      });
      onClose();
      setIsUpdating(false);
    },
    onError: (error) => {
      console.error("Failed to update schedule:", error);
      setIsUpdating(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    const startDateTime = startDate ? new Date(startDate) : null;
    const endDateTime = endDate ? new Date(endDate) : null;

    updateScheduleMutation.mutate({
      id: questionId,
      startDate: startDateTime,
      endDate: endDateTime,
    });
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-off-black/80">
      <div className="w-full max-w-2xl border-4 border-off-black bg-off-white font-mono">
        {/* Terminal Header */}
        <div className="border-b-2 border-off-black bg-off-black p-4">
          <div className="space-y-2">
            <div className="font-mono text-sm text-green-400">
              $ admin/questions/schedule --edit
            </div>
            <div
              className="font-mono font-bold uppercase tracking-wide text-off-white"
              style={{ fontSize: "var(--text-xl)" }}
            >
              SCHEDULE_EDITOR
            </div>
            <div className="font-mono text-sm text-warm-gray">
              target: {questionId.slice(-8)} | {questionTitle}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label
                className="block font-mono text-sm font-bold uppercase tracking-wide text-off-black"
                style={{ marginBottom: "var(--space-xs)" }}
              >
                START_DATE:
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border-2 border-off-black bg-off-white font-mono text-sm text-off-black transition-all duration-200 focus:border-primary focus:outline-none"
                style={{ padding: "var(--space-sm)" }}
              />
              <div className="mt-1 font-mono text-xs text-warm-gray">
                Leave empty for immediate activation
              </div>
            </div>

            <div>
              <label
                className="block font-mono text-sm font-bold uppercase tracking-wide text-off-black"
                style={{ marginBottom: "var(--space-xs)" }}
              >
                END_DATE:
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border-2 border-off-black bg-off-white font-mono text-sm text-off-black transition-all duration-200 focus:border-primary focus:outline-none"
                style={{ padding: "var(--space-sm)" }}
              />
              <div className="mt-1 font-mono text-xs text-warm-gray">
                Leave empty for no expiration
              </div>
            </div>

            {/* Date Validation */}
            {startDate && endDate && new Date(startDate) >= new Date(endDate) && (
              <div className="border-2 border-red-600 bg-red-50 p-3">
                <div className="font-mono text-sm font-bold text-red-800">
                  ERROR: START_DATE must be before END_DATE
                </div>
              </div>
            )}

            {/* Current Schedule Display */}
            <div className="border-2 border-off-black bg-light-gray p-4">
              <div className="font-mono text-sm font-bold text-off-black">CURRENT_SCHEDULE:</div>
              <div className="mt-2 space-y-1 font-mono text-xs text-warm-gray">
                <div>
                  start: {initialStartDate ? initialStartDate.toLocaleString() : "IMMEDIATE"}
                </div>
                <div>end: {initialEndDate ? initialEndDate.toLocaleString() : "NEVER"}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={
                isUpdating || (startDate && endDate && new Date(startDate) >= new Date(endDate))
              }
              className="bg-off-black px-6 py-3 font-mono text-sm text-off-white transition-colors hover:bg-primary hover:text-off-black disabled:bg-warm-gray disabled:text-light-gray"
            >
              {isUpdating ? "[updating...]" : "UPDATE_SCHEDULE"}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={isUpdating}
              className="border-2 border-off-black bg-white px-6 py-3 font-mono text-sm text-off-black transition-colors hover:bg-light-gray disabled:bg-warm-gray disabled:text-light-gray"
            >
              CLEAR_ALL
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="border-2 border-off-black bg-white px-6 py-3 font-mono text-sm text-off-black transition-colors hover:bg-light-gray disabled:bg-warm-gray disabled:text-light-gray"
            >
              CANCEL
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="border-t-2 border-off-black bg-off-white p-4">
          <div className="font-mono text-sm text-warm-gray">$ admin --help --schedule</div>
          <div className="mt-2 space-y-1 font-mono text-xs text-off-black">
            <div>
              <span className="text-warm-gray">START_DATE</span> → Question becomes visible and
              active
            </div>
            <div>
              <span className="text-warm-gray">END_DATE</span> → Question becomes inactive and
              hidden
            </div>
            <div>
              <span className="text-warm-gray">CLEAR_ALL</span> → Remove all scheduling constraints
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
