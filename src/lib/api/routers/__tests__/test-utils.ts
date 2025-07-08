import { jest } from "@jest/globals";

// Mock data generators for consistent test data
export const createMockQuestion = (overrides: Partial<any> = {}) => ({
  id: "question-1",
  title: "Test Question",
  description: "Test description",
  questionType: "binary",
  questionData: { options: ["Yes", "No"] },
  category: "test",
  displayOrder: 1,
  createdAt: new Date("2024-01-01"),
  isActive: true,
  startDate: null,
  endDate: null,
  _count: { responses: 0 },
  ...overrides,
});

export const createMockVoterToken = (overrides: Partial<any> = {}) => ({
  id: "voter-1",
  tokenHash: "test-hash",
  voteCount: 0,
  createdAt: new Date("2024-01-01"),
  lastActive: new Date("2024-01-01"),
  ipAddress: "127.0.0.1",
  ...overrides,
});

export const createMockQuestionResponse = (overrides: Partial<any> = {}) => ({
  id: "response-1",
  questionId: "question-1",
  voterTokenId: "voter-1",
  responseData: "Yes",
  ipAddress: "127.0.0.1",
  createdAt: new Date("2024-01-01"),
  ...overrides,
});

export const createMockXpLedger = (overrides: Partial<any> = {}) => ({
  id: "xp-1",
  voterTokenId: "voter-1",
  actionType: "vote",
  xpAmount: 10,
  sourceQuestionId: "question-1",
  createdAt: new Date("2024-01-01"),
  ...overrides,
});

// Question type specific mock data
export const questionTypeMocks = {
  binary: {
    questionType: "binary",
    questionData: {
      options: ["Yes", "No"],
    },
  },
  multiple_choice: {
    questionType: "multiple_choice",
    questionData: {
      options: ["React", "Vue", "Angular", "Svelte"],
      allowMultiple: false,
    },
  },
  rating: {
    questionType: "rating",
    questionData: {
      scale: {
        min: 1,
        max: 5,
        labels: {
          1: "Very Poor",
          3: "Average",
          5: "Excellent",
        },
      },
    },
  },
  ranking: {
    questionType: "ranking",
    questionData: {
      items: [
        "Performance",
        "Security",
        "User Experience",
        "Maintainability",
      ],
    },
  },
  text: {
    questionType: "text",
    questionData: {
      maxLength: 500,
      placeholder: "Enter your thoughts...",
    },
  },
  "ab-test": {
    questionType: "ab-test",
    questionData: {
      variants: [
        {
          id: "variant-a",
          name: "Option A",
          image: "/images/option-a.png",
          description: "First option",
        },
        {
          id: "variant-b",
          name: "Option B",
          image: "/images/option-b.png",
          description: "Second option",
        },
      ],
    },
  },
};

// Response type examples for each question type
export const responseTypeMocks = {
  binary: ["Yes", "No"],
  multiple_choice: ["React", "Vue", "Angular"],
  rating: [1, 2, 3, 4, 5],
  ranking: [
    ["Performance", "Security", "User Experience", "Maintainability"],
    ["Security", "Performance", "Maintainability", "User Experience"],
  ],
  text: [
    "This is a great feature request",
    "I would like to see better mobile support",
    "The current UI needs improvement",
  ],
  "ab-test": ["variant-a", "variant-b"],
};

// Mock Prisma client factory
export const createMockPrisma = () => ({
  question: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
  },
  questionResponse: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
  },
  voterToken: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  xpLedger: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
  },
  xpClaim: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  analyticsDaily: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  newsletterSubscriber: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  rateLimit: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    upsert: jest.fn(),
  },
  post: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
  },
});

// Mock voter token functions
export const createMockVoterTokenFunctions = () => ({
  getOrCreateVoterToken: jest.fn(),
  hasVoterVoted: jest.fn(),
  getVoterRateLimit: jest.fn(),
  incrementRateLimit: jest.fn(),
  hashVoterToken: jest.fn(),
});

// Mock context factory
export const createMockContext = (overrides: Partial<any> = {}) => ({
  db: createMockPrisma(),
  headers: new Headers(),
  ipAddress: "127.0.0.1",
  voterToken: "test-token",
  voterTokenRecord: createMockVoterToken(),
  ...overrides,
});

// Rate limit mock responses
export const rateLimitMocks = {
  withinLimit: {
    remaining: 10,
    resetTime: new Date(Date.now() + 60000),
  },
  exceeded: {
    remaining: 0,
    resetTime: new Date(Date.now() + 60000),
  },
};

// Error scenarios for testing
export const errorScenarios = {
  questionNotFound: null,
  databaseError: new Error("Database connection failed"),
  rateLimitExceeded: {
    remaining: 0,
    resetTime: new Date(Date.now() + 60000),
  },
  duplicateVote: true,
  invalidToken: null,
};

// Helper function to create mock question results
export const createMockQuestionResults = (
  questionType: string,
  responseCount: number = 10
) => {
  const responses = Array.from({ length: responseCount }, (_, i) => ({
    responseData: responseTypeMocks[questionType as keyof typeof responseTypeMocks][
      i % responseTypeMocks[questionType as keyof typeof responseTypeMocks].length
    ],
    createdAt: new Date(`2024-01-${String(i + 1).padStart(2, "0")}`),
  }));

  return {
    id: "question-1",
    questionType,
    responses,
  };
};

// Helper function to create engagement stats mock data
export const createMockEngagementStats = () => ({
  global: {
    totalXpEarned: 50000,
    totalXpTransactions: 2500,
    recentActivity: [
      {
        date: new Date("2024-01-01"),
        totalVotes: 150,
        uniqueVoters: 45,
      },
      {
        date: new Date("2024-01-02"),
        totalVotes: 200,
        uniqueVoters: 67,
      },
    ],
    leaderboard: [
      {
        rank: 1,
        voteCount: 500,
        memberSince: new Date("2023-01-01"),
        totalTransactions: 75,
      },
      {
        rank: 2,
        voteCount: 350,
        memberSince: new Date("2023-02-15"),
        totalTransactions: 52,
      },
    ],
  },
  user: {
    totalXp: 1250,
    totalVotes: 85,
    currentStreak: 5,
    xpTransactions: 12,
    rank: 15,
  },
  milestones: [
    {
      votes: 10,
      xpReward: 50,
      title: "Getting Started",
      achieved: true,
    },
    {
      votes: 25,
      xpReward: 100,
      title: "Community Member",
      achieved: true,
    },
    {
      votes: 50,
      xpReward: 250,
      title: "Active Participant",
      achieved: true,
    },
    {
      votes: 100,
      xpReward: 500,
      title: "Community Champion",
      achieved: false,
    },
    {
      votes: 250,
      xpReward: 1000,
      title: "Superoptimised Builder",
      achieved: false,
    },
  ],
});

// Helper function to create mock daily analytics
export const createMockDailyAnalytics = (date: Date) => ({
  id: "analytics-1",
  date,
  totalVotes: 250,
  uniqueVoters: 75,
  totalXpEarned: 1250,
  newsletterSignups: 15,
  popularQuestions: [
    {
      questionId: "question-1",
      title: "TypeScript vs JavaScript",
      voteCount: 100,
    },
    {
      questionId: "question-2",
      title: "Favorite Framework",
      voteCount: 75,
    },
    {
      questionId: "question-3",
      title: "UI Preferences",
      voteCount: 50,
    },
  ],
  createdAt: new Date(),
});

// Helper function to create mock XP claim
export const createMockXpClaim = (overrides: Partial<any> = {}) => ({
  id: "claim-1",
  voterTokenId: "voter-1",
  email: "test@example.com",
  claimToken: "test-uuid",
  totalXp: 500,
  status: "pending",
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  claimedAt: null,
  createdAt: new Date(),
  ...overrides,
});

// Helper function to assert tRPC error structure
export const expectTRPCError = (
  error: any,
  code: string,
  message?: string
) => {
  expect(error.code).toBe(code);
  if (message) {
    expect(error.message).toContain(message);
  }
};

// Helper function to create date ranges for testing
export const createDateRange = (daysBack: number = 7) => {
  const dates = [];
  for (let i = 0; i < daysBack; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    dates.push(date);
  }
  return dates.reverse();
};

// Helper function to create mock vote history
export const createMockVoteHistory = (count: number = 5) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `vote-${i + 1}`,
    questionId: `question-${i + 1}`,
    responseData: responseTypeMocks.binary[i % 2],
    createdAt: new Date(`2024-01-${String(i + 1).padStart(2, "0")}`),
    question: {
      id: `question-${i + 1}`,
      title: `Test Question ${i + 1}`,
      category: "test",
    },
  }));
};

// Helper function to mock background job processing
export const createMockBackgroundJobs = () => ({
  queueVoteEnhancement: jest.fn(),
  processVoteEnhancement: jest.fn(),
  calculateXpForVote: jest.fn(),
  updateEngagementStats: jest.fn(),
});

// Helper function to create mock email functions
export const createMockEmailFunctions = () => ({
  sendXpClaimEmail: jest.fn(),
  sendWelcomeEmail: jest.fn(),
  sendNewsletterEmail: jest.fn(),
});

// Helper function to create mock progress automation
export const createMockProgressAutomation = () => ({
  onXpClaimed: jest.fn(),
  onMilestoneReached: jest.fn(),
  onStreakUpdated: jest.fn(),
});

// Validation helpers
export const validateQuestionResponse = (response: any, questionType: string) => {
  expect(response).toHaveProperty("id");
  expect(response).toHaveProperty("questionId");
  expect(response).toHaveProperty("responseData");
  
  switch (questionType) {
    case "binary":
      expect(typeof response.responseData).toBe("string");
      break;
    case "rating":
      expect(typeof response.responseData).toBe("number");
      break;
    case "ranking":
      expect(Array.isArray(response.responseData)).toBe(true);
      break;
    case "text":
      expect(typeof response.responseData).toBe("string");
      break;
    default:
      // Generic validation for other types
      expect(response.responseData).toBeDefined();
  }
};

export const validateVoteStats = (stats: any) => {
  expect(stats).toHaveProperty("questionId");
  expect(stats).toHaveProperty("totalVotes");
  expect(stats).toHaveProperty("breakdown");
  expect(Array.isArray(stats.breakdown)).toBe(true);
  
  stats.breakdown.forEach((item: any) => {
    expect(item).toHaveProperty("option");
    expect(item).toHaveProperty("count");
    expect(item).toHaveProperty("percentage");
    expect(typeof item.count).toBe("number");
    expect(typeof item.percentage).toBe("number");
  });
};

export const validateEngagementStats = (stats: any) => {
  expect(stats).toHaveProperty("global");
  expect(stats).toHaveProperty("user");
  expect(stats).toHaveProperty("milestones");
  expect(stats).toHaveProperty("lastUpdated");
  
  expect(stats.global).toHaveProperty("totalXpEarned");
  expect(stats.global).toHaveProperty("totalXpTransactions");
  expect(stats.global).toHaveProperty("recentActivity");
  expect(stats.global).toHaveProperty("leaderboard");
  
  if (stats.user) {
    expect(stats.user).toHaveProperty("totalXp");
    expect(stats.user).toHaveProperty("totalVotes");
    expect(stats.user).toHaveProperty("currentStreak");
    expect(stats.user).toHaveProperty("rank");
  }
  
  if (stats.milestones) {
    expect(Array.isArray(stats.milestones)).toBe(true);
    stats.milestones.forEach((milestone: any) => {
      expect(milestone).toHaveProperty("votes");
      expect(milestone).toHaveProperty("xpReward");
      expect(milestone).toHaveProperty("title");
      expect(milestone).toHaveProperty("achieved");
    });
  }
};

// Performance test helpers
export const createPerformanceTest = (
  testName: string,
  fn: () => Promise<void>,
  maxDuration: number = 1000
) => {
  return async () => {
    const startTime = Date.now();
    await fn();
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBeLessThan(maxDuration);
    console.log(`${testName} completed in ${duration}ms`);
  };
};

// Load test helper
export const createLoadTest = (
  testFn: () => Promise<void>,
  concurrency: number = 10,
  iterations: number = 100
) => {
  return async () => {
    const batches = Math.ceil(iterations / concurrency);
    const results = [];
    
    for (let batch = 0; batch < batches; batch++) {
      const promises = [];
      const batchSize = Math.min(concurrency, iterations - batch * concurrency);
      
      for (let i = 0; i < batchSize; i++) {
        promises.push(testFn());
      }
      
      const batchResults = await Promise.allSettled(promises);
      results.push(...batchResults);
    }
    
    const failures = results.filter(r => r.status === "rejected");
    expect(failures.length).toBe(0);
  };
};

export default {
  createMockQuestion,
  createMockVoterToken,
  createMockQuestionResponse,
  createMockXpLedger,
  questionTypeMocks,
  responseTypeMocks,
  createMockPrisma,
  createMockVoterTokenFunctions,
  createMockContext,
  rateLimitMocks,
  errorScenarios,
  createMockQuestionResults,
  createMockEngagementStats,
  createMockDailyAnalytics,
  createMockXpClaim,
  expectTRPCError,
  createDateRange,
  createMockVoteHistory,
  createMockBackgroundJobs,
  createMockEmailFunctions,
  createMockProgressAutomation,
  validateQuestionResponse,
  validateVoteStats,
  validateEngagementStats,
  createPerformanceTest,
  createLoadTest,
};