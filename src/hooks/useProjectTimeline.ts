import { useMemo } from "react";
import { api } from "@/lib/trpc/react";

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: Date | null;
  type: "phase" | "milestone" | "feature" | "community";
  status: "completed" | "in_progress" | "upcoming";
  completionPercentage?: number;
  category?: string;
  isEstimated?: boolean;
}

export function useProjectTimeline() {
  const {
    data: timelineData,
    isLoading: isTimelineLoading,
    error: timelineError,
  } = api.content.getProjectTimeline.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  const timelineEvents = useMemo((): TimelineEvent[] => {
    if (!timelineData?.events) return [];

    // Convert the API response to our TimelineEvent format
    return timelineData.events.map((event) => ({
      ...event,
      date: event.date ? new Date(event.date) : null,
    }));
  }, [timelineData]);

  const timelineStats = useMemo(() => {
    if (!timelineEvents.length) return null;

    const completed = timelineEvents.filter((e) => e.status === "completed").length;
    const inProgress = timelineEvents.filter((e) => e.status === "in_progress").length;
    const upcoming = timelineEvents.filter((e) => e.status === "upcoming").length;

    const nextMilestone = timelineEvents.find(
      (e) => e.status === "in_progress" || e.status === "upcoming"
    );

    return {
      totalEvents: timelineEvents.length,
      completed,
      inProgress,
      upcoming,
      nextMilestone,
      completionRate: Math.round((completed / timelineEvents.length) * 100),
    };
  }, [timelineEvents]);

  return {
    timelineEvents,
    timelineStats,
    progress: timelineData?.progress,
    isLoading: isTimelineLoading,
    error: timelineError,
  };
}
