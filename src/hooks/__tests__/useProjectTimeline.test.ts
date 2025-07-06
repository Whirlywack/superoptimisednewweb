import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useProjectTimeline } from "../useProjectTimeline";
import { api } from "@/lib/trpc/react";

// Mock the tRPC API
jest.mock("@/lib/trpc/react", () => ({
  api: {
    content: {
      getProjectTimeline: {
        useQuery: jest.fn(),
      },
    },
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function TestWrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

describe("useProjectTimeline", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls tRPC getProjectTimeline with correct options", () => {
    const mockUseQuery = jest.fn().mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    (api.content.getProjectTimeline.useQuery as jest.Mock) = mockUseQuery;

    renderHook(() => useProjectTimeline(), {
      wrapper: createWrapper(),
    });

    expect(mockUseQuery).toHaveBeenCalledWith(undefined, {
      refetchInterval: 5 * 60 * 1000, // 5 minutes
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  });

  it("returns loading state when data is loading", () => {
    const mockUseQuery = jest.fn().mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    (api.content.getProjectTimeline.useQuery as jest.Mock) = mockUseQuery;

    const { result } = renderHook(() => useProjectTimeline(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it("returns data when successfully loaded", () => {
    const mockTimelineData = {
      events: [
        {
          id: "phase-1",
          title: "Phase 1: Core tRPC API Foundation",
          description: "Database schema, tRPC setup, and basic voting infrastructure",
          date: new Date("2024-11-15"),
          type: "phase",
          status: "completed",
          completionPercentage: 100,
          category: "Backend",
        },
      ],
      progress: {
        overallPercentage: 65,
        currentPhase: "Phase 5",
        totalTasks: 40,
        completedTasks: 26,
        milestones: [],
        lastUpdated: new Date(),
      },
      lastUpdated: new Date(),
    };

    const mockUseQuery = jest.fn().mockReturnValue({
      data: mockTimelineData,
      isLoading: false,
      error: null,
    });

    (api.content.getProjectTimeline.useQuery as jest.Mock) = mockUseQuery;

    const { result } = renderHook(() => useProjectTimeline(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockTimelineData);
    expect(result.current.error).toBe(null);
  });

  it("returns error state when query fails", () => {
    const mockError = new Error("Failed to fetch timeline");

    const mockUseQuery = jest.fn().mockReturnValue({
      data: null,
      isLoading: false,
      error: mockError,
    });

    (api.content.getProjectTimeline.useQuery as jest.Mock) = mockUseQuery;

    const { result } = renderHook(() => useProjectTimeline(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(mockError);
  });
});
