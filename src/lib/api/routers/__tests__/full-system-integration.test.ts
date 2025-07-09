import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { TRPCError } from "@trpc/server";

// Mock all system dependencies
jest.mock("../../../db", () => ({
  prisma: {
    question: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    questionResponse: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    questionnaire: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    questionnaireQuestion: {
      create: jest.fn(),
      createMany: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    voterToken: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    xpLedger: {
      create: jest.fn(),
      aggregate: jest.fn(),
    },
    analyticsDaily: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    newsletterSubscriber: {
      count: jest.fn(),
      create: jest.fn(),
    },
    projectStat: {
      findMany: jest.fn(),
      upsert: jest.fn(),
    },
    rateLimit: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  },
}));

jest.mock("../../voterToken", () => ({
  getOrCreateVoterToken: jest.fn(),
  hasVoterVoted: jest.fn(),
  getVoterRateLimit: jest.fn(),
  incrementRateLimit: jest.fn(),
  hashToken: jest.fn(),
}));

jest.mock("../../../background-jobs", () => ({
  queueVoteEnhancement: jest.fn(),
  processVoteEnhancement: jest.fn(),
  calculateAndRecordXp: jest.fn(),
  calculateXpForVote: jest.fn(),
}));

jest.mock("../../../email/sendEmail", () => ({
  sendXpClaimEmail: jest.fn(),
  sendNewsletterWelcome: jest.fn(),
}));

jest.mock("../../../progress-automation", () => ({
  trackProgressEvent: jest.fn(),
  onVoteSubmitted: jest.fn(),
  onXpClaimed: jest.fn(),
}));

jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
  createHash: jest.fn(),
}));

import { prisma } from "../../../db";
import { 
  getOrCreateVoterToken, 
  hasVoterVoted,
  getVoterRateLimit, 
  incrementRateLimit 
} from "../../voterToken";
import { 
  queueVoteEnhancement,
  processVoteEnhancement,
  calculateAndRecordXp 
} from "../../../background-jobs";
import { questionRouter } from "../questionRouter";
import { voteRouter } from "../voteRouter";
import { questionnaireRouter } from "../questionnaireRouter";
import { createMockContext, rateLimitMocks } from "./test-utils";
import { randomUUID } from "crypto";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockGetOrCreateVoterToken = getOrCreateVoterToken as jest.MockedFunction<typeof getOrCreateVoterToken>;
const mockHasVoterVoted = hasVoterVoted as jest.MockedFunction<typeof hasVoterVoted>;
const mockGetVoterRateLimit = getVoterRateLimit as jest.MockedFunction<typeof getVoterRateLimit>;
const mockIncrementRateLimit = incrementRateLimit as jest.MockedFunction<typeof incrementRateLimit>;
const mockQueueVoteEnhancement = queueVoteEnhancement as jest.MockedFunction<typeof queueVoteEnhancement>;
const mockProcessVoteEnhancement = processVoteEnhancement as jest.MockedFunction<typeof processVoteEnhancement>;
const mockCalculateAndRecordXp = calculateAndRecordXp as jest.MockedFunction<typeof calculateAndRecordXp>;
const mockRandomUUID = randomUUID as jest.MockedFunction<typeof randomUUID>;

describe("Full System Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default successful mocks
    mockGetVoterRateLimit.mockResolvedValue(rateLimitMocks.withinLimit);
    mockIncrementRateLimit.mockResolvedValue(undefined);
    mockRandomUUID.mockReturnValue("test-uuid");
    
    mockGetOrCreateVoterToken.mockResolvedValue({
      token: "test-token",
      voterTokenRecord: {
        id: "voter-1",
        voteCount: 5,
        createdAt: new Date(),
      },
    });
    
    mockHasVoterVoted.mockResolvedValue(false);
    mockQueueVoteEnhancement.mockResolvedValue(undefined);
    mockProcessVoteEnhancement.mockResolvedValue({
      xpAmount: 10,
      totalXp: 60,
      voteCount: 6,
    });
    mockCalculateAndRecordXp.mockResolvedValue({
      xpAmount: 10,
      totalXp: 60,
      voteCount: 6,
    });
  });

  describe("Complete Platform Workflow", () => {
    it("should handle end-to-end user journey from question creation to vote processing", async () => {
      // Phase 1: Admin creates question
      const adminCtx = createMockContext({ isAdmin: true });
      const questionCaller = questionRouter.createCaller(adminCtx);
      
      const mockQuestion = {
        id: "e2e-question-1",
        title: "What is your experience level with React?",
        description: "Please select your current React expertise level",
        questionType: "multiple_choice",
        questionData: {
          options: ["Beginner", "Intermediate", "Advanced", "Expert"],
        },
        category: "development",
        isActive: false,
        displayOrder: 0,
        startDate: null,
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.question.create.mockResolvedValue(mockQuestion);

      const createdQuestion = await questionCaller.create({
        title: "What is your experience level with React?",
        description: "Please select your current React expertise level",
        questionType: "multiple_choice",
        questionData: {
          options: ["Beginner", "Intermediate", "Advanced", "Expert"],
        },
        category: "development",
        displayOrder: 0,
      });

      expect(createdQuestion.id).toBe("e2e-question-1");
      expect(createdQuestion.isActive).toBe(false);

      // Phase 2: Admin activates question
      const mockActivatedQuestion = {
        ...mockQuestion,
        isActive: true,
        startDate: new Date(),
      };

      mockPrisma.question.update.mockResolvedValue(mockActivatedQuestion);

      const activatedQuestion = await questionCaller.update({
        id: "e2e-question-1",
        isActive: true,
      });

      expect(activatedQuestion.isActive).toBe(true);
      expect(activatedQuestion.startDate).toBeDefined();

      // Phase 3: User votes on question
      const userCtx = createMockContext({ isAdmin: false });
      const voteCaller = voteRouter.createCaller(userCtx);

      // Mock active question lookup
      mockPrisma.question.findFirst.mockResolvedValue(mockActivatedQuestion);

      const mockVoteResponse = {
        id: "e2e-vote-1",
        questionId: "e2e-question-1",
        voterTokenId: "voter-1",
        responseData: "Intermediate",
        ipAddress: "127.0.0.1",
        createdAt: new Date(),
      };

      mockPrisma.questionResponse.create.mockResolvedValue(mockVoteResponse);

      const voteResult = await voteCaller.submitVote({
        questionId: "e2e-question-1",
        response: "Intermediate",
      });

      expect(voteResult.success).toBe(true);
      expect(voteResult.voteId).toBe("e2e-vote-1");
      expect(voteResult.processingInBackground).toBe(true);

      // Phase 4: Background processing occurs
      const backgroundJob = {
        voteId: "e2e-vote-1",
        voterTokenId: "voter-1",
        questionId: "e2e-question-1",
        isNewVoter: false,
        submittedAt: new Date(),
      };

      await processVoteEnhancement(backgroundJob);

      expect(mockProcessVoteEnhancement).toHaveBeenCalledWith(backgroundJob);

      // Phase 5: Admin checks vote statistics
      const mockVoteStats = [
        { responseData: "Beginner", _count: { responseData: 25 } },
        { responseData: "Intermediate", _count: { responseData: 45 } },
        { responseData: "Advanced", _count: { responseData: 20 } },
        { responseData: "Expert", _count: { responseData: 10 } },
      ];

      mockPrisma.questionResponse.groupBy.mockResolvedValue(mockVoteStats);
      mockPrisma.questionResponse.count.mockResolvedValue(100);

      const voteStats = await voteCaller.getVoteStats({
        questionId: "e2e-question-1",
      });

      expect(voteStats.totalVotes).toBe(100);
      expect(voteStats.breakdown).toHaveLength(4);
      expect(voteStats.breakdown[1].option).toBe("Intermediate");
      expect(voteStats.breakdown[1].count).toBe(45);
      expect(voteStats.breakdown[1].percentage).toBe(45);

      // Phase 6: User checks their vote history
      const mockUserVotes = [
        {
          id: "e2e-vote-1",
          questionId: "e2e-question-1",
          responseData: "Intermediate",
          createdAt: new Date(),
          question: {
            id: "e2e-question-1",
            title: "What is your experience level with React?",
            category: "development",
          },
        },
      ];

      const mockUserXp = { _sum: { xpAmount: 60 } };

      mockPrisma.questionResponse.findMany.mockResolvedValue(mockUserVotes);
      mockPrisma.xpLedger.aggregate.mockResolvedValue(mockUserXp);

      const userCtxWithToken = createMockContext({ 
        isAdmin: false,
        voterTokenRecord: { id: "voter-1", voteCount: 6, createdAt: new Date() },
      });
      const userVoteCaller = voteRouter.createCaller(userCtxWithToken);

      const userHistory = await userVoteCaller.getUserVoteHistory();

      expect(userHistory.votes).toHaveLength(1);
      expect(userHistory.votes[0].questionTitle).toBe("What is your experience level with React?");
      expect(userHistory.votes[0].response).toBe("Intermediate");
      expect(userHistory.totalXp).toBe(60);
    });

    it("should handle questionnaire-based surveys with multiple questions", async () => {
      // Phase 1: Admin creates questionnaire
      const adminCtx = createMockContext({ isAdmin: true });
      const questionnaireCaller = questionnaireRouter.createCaller(adminCtx);
      
      const mockQuestionnaire = {
        id: "survey-1",
        title: "Developer Experience Survey",
        description: "Comprehensive survey about developer experience",
        category: "feedback",
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.questionnaire.create.mockResolvedValue(mockQuestionnaire);
      mockPrisma.questionnaireQuestion.createMany.mockResolvedValue({ count: 0 });

      const createdQuestionnaire = await questionnaireCaller.create({
        title: "Developer Experience Survey",
        description: "Comprehensive survey about developer experience",
        category: "feedback",
        questionIds: [],
      });

      expect(createdQuestionnaire.id).toBe("survey-1");

      // Phase 2: Create and add questions to questionnaire
      const questionCaller = questionRouter.createCaller(adminCtx);
      
      const surveyQuestions = [
        {
          id: "survey-q1",
          title: "How satisfied are you with our developer tools?",
          questionType: "rating",
          questionData: { scale: 5 },
        },
        {
          id: "survey-q2",
          title: "Which programming languages do you use most?",
          questionType: "multiple_choice",
          questionData: { options: ["JavaScript", "Python", "Java", "Go", "Rust"] },
        },
        {
          id: "survey-q3",
          title: "Any additional feedback?",
          questionType: "text",
          questionData: {},
        },
      ];

      for (let i = 0; i < surveyQuestions.length; i++) {
        const mockQuestion = {
          ...surveyQuestions[i],
          category: "survey",
          isActive: true,
          displayOrder: i,
          startDate: new Date(),
          endDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        mockPrisma.question.create.mockResolvedValue(mockQuestion);

        await questionCaller.create({
          title: surveyQuestions[i].title,
          questionType: surveyQuestions[i].questionType as any,
          questionData: surveyQuestions[i].questionData,
          category: "survey",
          displayOrder: i,
        });

        // Add question to questionnaire
        mockPrisma.questionnaireQuestion.count.mockResolvedValue(i);
        mockPrisma.questionnaireQuestion.create.mockResolvedValue({
          id: `qq-${i}`,
          questionnaireId: "survey-1",
          questionId: surveyQuestions[i].id,
          displayOrder: i,
          isRequired: true,
          createdAt: new Date(),
          question: mockQuestion,
        });

        await questionnaireCaller.addQuestion({
          questionnaireId: "survey-1",
          questionId: surveyQuestions[i].id,
          displayOrder: i,
        });
      }

      // Phase 3: Activate questionnaire
      const mockActivatedQuestionnaire = {
        ...mockQuestionnaire,
        status: "active",
        startDate: new Date(),
      };

      mockPrisma.questionnaire.update.mockResolvedValue(mockActivatedQuestionnaire);

      const activatedQuestionnaire = await questionnaireCaller.updateStatus({
        id: "survey-1",
        status: "active",
      });

      expect(activatedQuestionnaire.status).toBe("active");

      // Phase 4: User completes survey
      const userCtx = createMockContext({ isAdmin: false });
      const voteCaller = voteRouter.createCaller(userCtx);

      const surveyResponses = [
        { questionId: "survey-q1", response: 4 },
        { questionId: "survey-q2", response: "JavaScript" },
        { questionId: "survey-q3", response: "Great tools, would like better documentation" },
      ];

      for (const response of surveyResponses) {
        mockPrisma.question.findFirst.mockResolvedValue({
          id: response.questionId,
          isActive: true,
          startDate: new Date(),
          endDate: null,
        });

        mockPrisma.questionResponse.create.mockResolvedValue({
          id: `response-${response.questionId}`,
          questionId: response.questionId,
          voterTokenId: "voter-1",
          responseData: response.response,
          ipAddress: "127.0.0.1",
          createdAt: new Date(),
        });

        const voteResult = await voteCaller.submitVote({
          questionId: response.questionId,
          response: response.response,
        });

        expect(voteResult.success).toBe(true);
      }

      // Phase 5: Admin reviews survey results
      const mockSurveyStats = [
        { responseData: 4, _count: { responseData: 25 } },
        { responseData: 5, _count: { responseData: 15 } },
        { responseData: 3, _count: { responseData: 10 } },
      ];

      mockPrisma.questionResponse.groupBy.mockResolvedValue(mockSurveyStats);
      mockPrisma.questionResponse.count.mockResolvedValue(50);

      const surveyStats = await voteCaller.getVoteStats({
        questionId: "survey-q1",
      });

      expect(surveyStats.totalVotes).toBe(50);
      expect(surveyStats.breakdown).toHaveLength(3);
    });
  });

  describe("System Resilience and Error Handling", () => {
    it("should handle cascade failures gracefully", async () => {
      const adminCtx = createMockContext({ isAdmin: true });
      const questionCaller = questionRouter.createCaller(adminCtx);
      
      // Simulate database failure during question creation
      mockPrisma.question.create.mockRejectedValue(new Error("Database timeout"));

      await expect(questionCaller.create({
        title: "Test Question",
        questionType: "binary",
        questionData: {},
        category: "test",
        displayOrder: 0,
      })).rejects.toThrow("Database timeout");

      // System should still be functional for other operations
      mockPrisma.question.findMany.mockResolvedValue([]);
      
      const activeQuestions = await questionCaller.getActiveQuestions({ limit: 10 });
      expect(activeQuestions.questions).toHaveLength(0);
    });

    it("should handle rate limiting across the entire system", async () => {
      const userCtx = createMockContext({ isAdmin: false });
      const voteCaller = voteRouter.createCaller(userCtx);

      // Simulate rate limit exceeded
      mockGetVoterRateLimit.mockResolvedValue(rateLimitMocks.exceeded);

      await expect(voteCaller.submitVote({
        questionId: "question-1",
        response: "Yes",
      })).rejects.toThrow("Rate limit exceeded");

      // Verify that no subsequent operations were called
      expect(mockPrisma.question.findFirst).not.toHaveBeenCalled();
      expect(mockPrisma.questionResponse.create).not.toHaveBeenCalled();
      expect(mockQueueVoteEnhancement).not.toHaveBeenCalled();
    });

    it("should handle duplicate vote prevention across concurrent requests", async () => {
      const userCtx = createMockContext({ isAdmin: false });
      const voteCaller = voteRouter.createCaller(userCtx);

      mockPrisma.question.findFirst.mockResolvedValue({
        id: "question-1",
        isActive: true,
        startDate: new Date(),
        endDate: null,
      });

      // First request: no duplicate
      mockHasVoterVoted.mockResolvedValueOnce(false);
      // Second request: duplicate detected
      mockHasVoterVoted.mockResolvedValueOnce(true);

      mockPrisma.questionResponse.create.mockResolvedValue({
        id: "vote-1",
        questionId: "question-1",
        voterTokenId: "voter-1",
        responseData: "Yes",
        ipAddress: "127.0.0.1",
        createdAt: new Date(),
      });

      const [firstResult, secondResult] = await Promise.allSettled([
        voteCaller.submitVote({
          questionId: "question-1",
          response: "Yes",
        }),
        voteCaller.submitVote({
          questionId: "question-1",
          response: "No",
        }),
      ]);

      expect(firstResult.status).toBe("fulfilled");
      expect(secondResult.status).toBe("rejected");
      
      if (secondResult.status === "rejected") {
        expect(secondResult.reason.message).toContain("You have already voted on this question");
      }
    });
  });

  describe("Performance and Scalability", () => {
    it("should handle high-volume concurrent operations", async () => {
      const userCtx = createMockContext({ isAdmin: false });
      const voteCaller = voteRouter.createCaller(userCtx);

      // Setup for 100 concurrent votes
      mockPrisma.question.findFirst.mockResolvedValue({
        id: "popular-question",
        isActive: true,
        startDate: new Date(),
        endDate: null,
      });

      const votePromises = Array.from({ length: 100 }, (_, i) => {
        mockPrisma.questionResponse.create.mockResolvedValue({
          id: `vote-${i}`,
          questionId: "popular-question",
          voterTokenId: `voter-${i}`,
          responseData: i % 2 === 0 ? "Yes" : "No",
          ipAddress: "127.0.0.1",
          createdAt: new Date(),
        });

        return voteCaller.submitVote({
          questionId: "popular-question",
          response: i % 2 === 0 ? "Yes" : "No",
        });
      });

      const startTime = Date.now();
      const results = await Promise.all(votePromises);
      const endTime = Date.now();

      expect(results).toHaveLength(100);
      expect(results.every(r => r.success)).toBe(true);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });

    it("should handle memory-efficient large dataset operations", async () => {
      const adminCtx = createMockContext({ isAdmin: true });
      const questionCaller = questionRouter.createCaller(adminCtx);

      // Mock large dataset
      const largeQuestionSet = Array.from({ length: 10000 }, (_, i) => ({
        id: `question-${i}`,
        title: `Question ${i}`,
        questionType: "binary",
        questionData: {},
        category: "bulk",
        isActive: true,
        displayOrder: i,
        startDate: new Date(),
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      // Test pagination works correctly
      mockPrisma.question.findMany.mockResolvedValue(largeQuestionSet.slice(0, 100));

      const result = await questionCaller.getActiveQuestions({ limit: 100 });

      expect(result.questions).toHaveLength(100);
      expect(result.questions[0].id).toBe("question-0");
      expect(result.questions[99].id).toBe("question-99");
    });
  });

  describe("Data Integrity and Consistency", () => {
    it("should maintain data consistency across related operations", async () => {
      const adminCtx = createMockContext({ isAdmin: true });
      const questionCaller = questionRouter.createCaller(adminCtx);
      const questionnaireCaller = questionnaireRouter.createCaller(adminCtx);

      // Create question
      const mockQuestion = {
        id: "consistency-question",
        title: "Consistency Test Question",
        questionType: "binary",
        questionData: {},
        category: "test",
        isActive: false,
        displayOrder: 0,
        startDate: null,
        endDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.question.create.mockResolvedValue(mockQuestion);

      const question = await questionCaller.create({
        title: "Consistency Test Question",
        questionType: "binary",
        questionData: {},
        category: "test",
        displayOrder: 0,
      });

      // Create questionnaire
      const mockQuestionnaire = {
        id: "consistency-questionnaire",
        title: "Consistency Test Questionnaire",
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.questionnaire.create.mockResolvedValue(mockQuestionnaire);
      mockPrisma.questionnaireQuestion.createMany.mockResolvedValue({ count: 0 });

      const questionnaire = await questionnaireCaller.create({
        title: "Consistency Test Questionnaire",
        questionIds: [],
      });

      // Add question to questionnaire
      mockPrisma.questionnaireQuestion.count.mockResolvedValue(0);
      mockPrisma.questionnaireQuestion.create.mockResolvedValue({
        id: "qq-consistency",
        questionnaireId: questionnaire.id,
        questionId: question.id,
        displayOrder: 0,
        isRequired: true,
        createdAt: new Date(),
        question: mockQuestion,
      });

      const questionnaireQuestion = await questionnaireCaller.addQuestion({
        questionnaireId: questionnaire.id,
        questionId: question.id,
      });

      expect(questionnaireQuestion.questionId).toBe(question.id);
      expect(questionnaireQuestion.questionnaireId).toBe(questionnaire.id);

      // Delete question should handle questionnaire cleanup
      mockPrisma.question.delete.mockResolvedValue(mockQuestion);

      await questionCaller.delete({ id: question.id });

      // Verify deletion was called
      expect(mockPrisma.question.delete).toHaveBeenCalledWith({
        where: { id: question.id },
      });
    });

    it("should handle transaction rollbacks correctly", async () => {
      const adminCtx = createMockContext({ isAdmin: true });
      const questionCaller = questionRouter.createCaller(adminCtx);

      // Simulate partial failure scenario
      mockPrisma.question.create
        .mockResolvedValueOnce({
          id: "tx-question-1",
          title: "Transaction Test 1",
          questionType: "binary",
          questionData: {},
          category: "test",
          isActive: false,
          displayOrder: 0,
          startDate: null,
          endDate: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .mockRejectedValueOnce(new Error("Constraint violation"));

      // First operation should succeed
      const result1 = await questionCaller.create({
        title: "Transaction Test 1",
        questionType: "binary",
        questionData: {},
        category: "test",
        displayOrder: 0,
      });

      expect(result1.id).toBe("tx-question-1");

      // Second operation should fail
      await expect(questionCaller.create({
        title: "Transaction Test 2",
        questionType: "binary",
        questionData: {},
        category: "test",
        displayOrder: 1,
      })).rejects.toThrow("Constraint violation");

      // First operation should remain successful
      expect(result1.id).toBe("tx-question-1");
    });
  });

  describe("Security and Access Control", () => {
    it("should enforce proper access control across all operations", async () => {
      const userCtx = createMockContext({ isAdmin: false });
      const questionCaller = questionRouter.createCaller(userCtx);

      // Non-admin users should not be able to create questions
      await expect(questionCaller.create({
        title: "Unauthorized Question",
        questionType: "binary",
        questionData: {},
        category: "unauthorized",
        displayOrder: 0,
      })).rejects.toThrow(); // Should throw authorization error

      // But they should be able to read active questions
      mockPrisma.question.findMany.mockResolvedValue([]);
      
      const activeQuestions = await questionCaller.getActiveQuestions({ limit: 10 });
      expect(activeQuestions.questions).toHaveLength(0);
    });

    it("should handle IP-based rate limiting correctly", async () => {
      const userCtx = createMockContext({ 
        isAdmin: false,
        ipAddress: "192.168.1.100",
      });
      const voteCaller = voteRouter.createCaller(userCtx);

      // Mock rate limit check for specific IP
      mockGetVoterRateLimit.mockResolvedValue({
        remaining: 0,
        resetTime: new Date(Date.now() + 3600000), // 1 hour from now
      });

      await expect(voteCaller.submitVote({
        questionId: "question-1",
        response: "Yes",
      })).rejects.toThrow("Rate limit exceeded");

      // Verify rate limit was checked for correct IP
      expect(mockGetVoterRateLimit).toHaveBeenCalledWith("192.168.1.100");
    });
  });
});