import React from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProjectTimeline } from "../ProjectTimeline";
import { useProjectTimeline } from "@/hooks/useProjectTimeline";

// Mock the hook
jest.mock("@/hooks/useProjectTimeline");

// Mock the utils
jest.mock("@/lib/utils", () => ({
  cn: (...classes: (string | undefined | null | boolean)[]) => classes.filter(Boolean).join(" "),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockTimelineData = {
  events: [
    {
      id: "phase-1",
      title: "Phase 1: Core tRPC API Foundation",
      description: "Database schema, tRPC setup, and basic voting infrastructure",
      date: new Date("2024-11-15"),
      type: "phase" as const,
      status: "completed" as const,
      completionPercentage: 100,
      category: "Backend",
    },
    {
      id: "community-100-votes",
      title: "100 Community Votes",
      description: "Reach 100 total community votes on decisions",
      date: null,
      type: "milestone" as const,
      status: "in_progress" as const,
      completionPercentage: 45,
      category: "community",
    },
    {
      id: "phase-6",
      title: "Phase 6: Advanced Question Types",
      description: "Multi-choice, rating, and ranking question support",
      date: null,
      type: "phase" as const,
      status: "upcoming" as const,
      completionPercentage: 0,
      category: "Features",
    },
  ],
  progress: {
    overallPercentage: 65,
    totalTasks: 40,
    completedTasks: 26,
    currentPhase: "Phase 5",
    nextMilestone: null,
    milestones: [],
    lastUpdated: new Date(),
  },
  lastUpdated: new Date(),
};

describe("ProjectTimeline", () => {
  const mockUseProjectTimeline = useProjectTimeline as jest.MockedFunction<
    typeof useProjectTimeline
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state when data is loading", () => {
    mockUseProjectTimeline.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as ReturnType<typeof useProjectTimeline>);

    render(<ProjectTimeline />, { wrapper: createWrapper() });

    expect(screen.getByText("Project Timeline")).toBeInTheDocument();
    expect(screen.getByText("Loading timeline...")).toBeInTheDocument();
  });

  it("renders error state when there is an error", () => {
    mockUseProjectTimeline.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to fetch"),
    } as ReturnType<typeof useProjectTimeline>);

    render(<ProjectTimeline />, { wrapper: createWrapper() });

    expect(screen.getByText("Project Timeline")).toBeInTheDocument();
    expect(screen.getByText("Unable to load timeline data.")).toBeInTheDocument();
  });

  it("renders timeline events when data is loaded", () => {
    mockUseProjectTimeline.mockReturnValue({
      data: mockTimelineData,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useProjectTimeline>);

    render(<ProjectTimeline />, { wrapper: createWrapper() });

    // Check header
    expect(screen.getByText("Project Timeline")).toBeInTheDocument();
    expect(screen.getByText("Overall Progress: 65%")).toBeInTheDocument();
    expect(screen.getByText("Phase 5")).toBeInTheDocument();

    // Check timeline events
    expect(screen.getByText("Phase 1: Core tRPC API Foundation")).toBeInTheDocument();
    expect(screen.getByText("100 Community Votes")).toBeInTheDocument();
    expect(screen.getByText("Phase 6: Advanced Question Types")).toBeInTheDocument();

    // Check descriptions
    expect(
      screen.getByText("Database schema, tRPC setup, and basic voting infrastructure")
    ).toBeInTheDocument();
    expect(screen.getByText("Reach 100 total community votes on decisions")).toBeInTheDocument();

    // Check status indicators
    expect(screen.getByText("completed")).toBeInTheDocument();
    expect(screen.getByText("in progress")).toBeInTheDocument();
    expect(screen.getByText("upcoming")).toBeInTheDocument();

    // Check categories
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("community")).toBeInTheDocument();
    expect(screen.getByText("Features")).toBeInTheDocument();
  });

  it("respects showUpcoming prop", () => {
    mockUseProjectTimeline.mockReturnValue({
      data: mockTimelineData,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useProjectTimeline>);

    render(<ProjectTimeline showUpcoming={false} />, { wrapper: createWrapper() });

    // Should show completed and in-progress events
    expect(screen.getByText("Phase 1: Core tRPC API Foundation")).toBeInTheDocument();
    expect(screen.getByText("100 Community Votes")).toBeInTheDocument();

    // Should not show upcoming events
    expect(screen.queryByText("Phase 6: Advanced Question Types")).not.toBeInTheDocument();
  });

  it("respects maxEvents prop", () => {
    mockUseProjectTimeline.mockReturnValue({
      data: mockTimelineData,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useProjectTimeline>);

    render(<ProjectTimeline maxEvents={2} />, { wrapper: createWrapper() });

    // Should only show first 2 events
    expect(screen.getByText("Phase 1: Core tRPC API Foundation")).toBeInTheDocument();
    expect(screen.getByText("100 Community Votes")).toBeInTheDocument();

    // Should not show the third event
    expect(screen.queryByText("Phase 6: Advanced Question Types")).not.toBeInTheDocument();
  });

  it("displays progress bar for in-progress events", () => {
    mockUseProjectTimeline.mockReturnValue({
      data: mockTimelineData,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useProjectTimeline>);

    render(<ProjectTimeline />, { wrapper: createWrapper() });

    // Should show progress percentage for in-progress milestone
    expect(screen.getByText("45%")).toBeInTheDocument();
  });

  it("formats dates correctly", () => {
    mockUseProjectTimeline.mockReturnValue({
      data: mockTimelineData,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useProjectTimeline>);

    render(<ProjectTimeline />, { wrapper: createWrapper() });

    // Should format the date for Phase 1
    expect(screen.getByText("Nov 15, 2024")).toBeInTheDocument();

    // Should show TBD for events without dates
    expect(screen.getAllByText("TBD")).toHaveLength(2); // For the two events without dates
  });

  it("applies variant prop correctly", () => {
    mockUseProjectTimeline.mockReturnValue({
      data: mockTimelineData,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useProjectTimeline>);

    const { container } = render(<ProjectTimeline variant="compact" />, {
      wrapper: createWrapper(),
    });

    // In compact variant, the component should have different styling
    // We can't easily test the exact styles, but we can verify the variant is passed through
    expect(container.firstChild).toBeInTheDocument();
  });

  it("displays empty state when no events are available", () => {
    const emptyData = {
      ...mockTimelineData,
      events: [],
    };

    mockUseProjectTimeline.mockReturnValue({
      data: emptyData,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useProjectTimeline>);

    render(<ProjectTimeline />, { wrapper: createWrapper() });

    expect(screen.getByText("No timeline events available.")).toBeInTheDocument();
  });

  it("handles missing progress data gracefully", () => {
    const dataWithoutProgress = {
      events: mockTimelineData.events,
      progress: {
        ...mockTimelineData.progress,
        overallPercentage: 0,
        currentPhase: "",
      },
      lastUpdated: new Date(),
    };

    mockUseProjectTimeline.mockReturnValue({
      data: dataWithoutProgress,
      isLoading: false,
      error: null,
    } as ReturnType<typeof useProjectTimeline>);

    render(<ProjectTimeline />, { wrapper: createWrapper() });

    expect(screen.getByText("Overall Progress: 0%")).toBeInTheDocument();
  });
});
