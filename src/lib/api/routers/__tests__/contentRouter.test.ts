import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { contentRouter } from "../contentRouter";
import { calculateProjectProgress } from "../../../milestone-tracker";

// Mock the milestone tracker
jest.mock("../../../milestone-tracker", () => ({
  calculateProjectProgress: jest.fn(),
}));

// Mock the content versioning
jest.mock("../../../content-versioning", () => ({
  createContentVersion: jest.fn(),
  getContentVersions: jest.fn(),
  rollbackContentToVersion: jest.fn(),
  compareContentVersions: jest.fn(),
  getVersioningStats: jest.fn(),
}));

// Mock Prisma
jest.mock("../../../db", () => ({
  prisma: {
    contentBlock: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    liveStat: {
      findMany: jest.fn(),
    },
    projectStat: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    questionResponse: {
      count: jest.fn(),
    },
    voterToken: {
      count: jest.fn(),
    },
    question: {
      count: jest.fn(),
    },
    xpLedger: {
      aggregate: jest.fn(),
    },
    newsletterSubscriber: {
      count: jest.fn(),
    },
    analyticsDaily: {
      findUnique: jest.fn(),
    },
  },
}));

describe("contentRouter - getProjectTimeline", () => {
  const mockCalculateProjectProgress = calculateProjectProgress as jest.MockedFunction<
    typeof calculateProjectProgress
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCalculateProjectProgress.mockClear();
  });

  it("should return timeline events with milestones and phases", async () => {
    // Mock the progress data
    const mockProgress = {
      overallPercentage: 65,
      totalTasks: 40,
      completedTasks: 26,
      currentPhase: "Phase 5",
      nextMilestone: null,
      milestones: [
        {
          id: "community-100-votes",
          title: "100 Community Votes",
          description: "Reach 100 total community votes on decisions",
          targetValue: 100,
          currentValue: 45,
          completionPercentage: 45,
          isCompleted: false,
          category: "community",
        },
        {
          id: "xp-system-1000",
          title: "1000 XP Distributed",
          description: "Distribute 1000 XP points to community members",
          targetValue: 1000,
          currentValue: 1200,
          completionPercentage: 100,
          isCompleted: true,
          completedAt: new Date("2024-12-01"),
          category: "community",
        },
      ],
      lastUpdated: new Date("2024-12-15"),
    };

    mockCalculateProjectProgress.mockResolvedValue(mockProgress);

    // Create a test context
    const ctx = {
      db: {} as unknown,
      headers: new Headers(),
    };

    // Call the procedure
    const caller = contentRouter.createCaller(ctx);
    const result = await caller.getProjectTimeline();

    expect(result).toBeDefined();
    expect(result.events).toBeDefined();
    expect(result.progress).toEqual(mockProgress);
    expect(result.lastUpdated).toBeDefined();

    // Check that timeline events include both milestones and phases
    const events = result.events;
    expect(events.length).toBeGreaterThan(0);

    // Should have completed phases
    const phaseEvents = events.filter((event) => event.type === "phase");
    expect(phaseEvents.length).toBe(5); // Phases 1-5

    // Should have milestone events
    const milestoneEvents = events.filter((event) => event.type === "milestone");
    expect(milestoneEvents.length).toBe(2); // From mock data

    // Check phase event structure
    const phase1 = phaseEvents.find((event) => event.id === "phase-1");
    expect(phase1).toMatchObject({
      id: "phase-1",
      title: "Phase 1: Core tRPC API Foundation",
      description: "Database schema, tRPC setup, and basic voting infrastructure",
      type: "phase",
      status: "completed",
      completionPercentage: 100,
      category: "Backend",
    });
    expect(phase1?.date).toBeInstanceOf(Date);

    // Check milestone event structure
    const xpMilestone = milestoneEvents.find((event) => event.id === "xp-system-1000");
    expect(xpMilestone).toMatchObject({
      id: "xp-system-1000",
      title: "1000 XP Distributed",
      description: "Distribute 1000 XP points to community members",
      type: "milestone",
      status: "completed",
      completionPercentage: 100,
      category: "community",
    });
    expect(xpMilestone?.date).toBeInstanceOf(Date);

    // Check incomplete milestone
    const votesMilestone = milestoneEvents.find((event) => event.id === "community-100-votes");
    expect(votesMilestone).toMatchObject({
      id: "community-100-votes",
      title: "100 Community Votes",
      type: "milestone",
      status: "in_progress",
      completionPercentage: 45,
      category: "community",
    });
    expect(votesMilestone?.date).toBe(null);
  });

  it("should handle errors gracefully", async () => {
    mockCalculateProjectProgress.mockRejectedValue(new Error("Database error"));

    const ctx = {
      db: {} as unknown,
      headers: new Headers(),
    };

    const caller = contentRouter.createCaller(ctx);

    await expect(caller.getProjectTimeline()).rejects.toThrow();
  });

  it("should sort events correctly (completed first, then by date)", async () => {
    const mockProgress = {
      overallPercentage: 50,
      totalTasks: 40,
      completedTasks: 20,
      currentPhase: "Phase 4",
      nextMilestone: null,
      milestones: [
        {
          id: "future-milestone",
          title: "Future Milestone",
          description: "Not yet started",
          targetValue: 100,
          currentValue: 0,
          completionPercentage: 0,
          isCompleted: false,
          category: "features",
        },
      ],
      lastUpdated: new Date(),
    };

    mockCalculateProjectProgress.mockResolvedValue(mockProgress);

    const ctx = {
      db: {} as unknown,
      headers: new Headers(),
    };

    const caller = contentRouter.createCaller(ctx);
    const result = await caller.getProjectTimeline();

    const events = result.events;

    // Find completed and upcoming events
    const completedEvents = events.filter((event) => event.status === "completed");

    // Check that completed events come first
    const firstCompletedIndex = events.findIndex((event) => event.status === "completed");
    const firstUpcomingIndex = events.findIndex((event) => event.status === "upcoming");

    if (firstCompletedIndex !== -1 && firstUpcomingIndex !== -1) {
      expect(firstCompletedIndex).toBeLessThan(firstUpcomingIndex);
    }

    // Check that completed events are sorted by date
    for (let i = 0; i < completedEvents.length - 1; i++) {
      const current = completedEvents[i];
      const next = completedEvents[i + 1];

      if (current.date && next.date) {
        expect(current.date.getTime()).toBeLessThanOrEqual(next.date.getTime());
      }
    }
  });
});
