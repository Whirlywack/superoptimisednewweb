/**
 * AI Option Generation Integration Tests
 *
 * Tests the generateQuestionOptions endpoint that powers AI-generated options
 * for multi-choice, ranking, and A/B test questions.
 */

import { describe, it, expect, beforeEach, jest } from "@jest/globals";

// Mock the AI client before any imports
jest.mock("../../../aiClient", () => ({
  generateChatCompletion: jest.fn(),
  parseJsonResponse: jest.fn(),
}));

import { createMockContext } from "./test-utils";
import { adminRouter } from "../adminRouter";
import * as aiClient from "../../../aiClient";

const mockGenerateChatCompletion = aiClient.generateChatCompletion as jest.MockedFunction<
  typeof aiClient.generateChatCompletion
>;
const mockParseJsonResponse = aiClient.parseJsonResponse as jest.MockedFunction<
  typeof aiClient.parseJsonResponse
>;

describe("AI Option Generation Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateQuestionOptions endpoint", () => {
    it("should generate options for multi-choice questions", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = adminRouter.createCaller(mockCtx);

      // Mock AI response
      const mockAIResponse = "Mock AI response";
      const mockParsedResponse = {
        options: [
          {
            id: "opt-1",
            text: "Very Satisfied",
            description: "Indicates high satisfaction",
            reasoning: "Common satisfaction survey option",
          },
          {
            id: "opt-2",
            text: "Satisfied",
            description: "Indicates moderate satisfaction",
            reasoning: "Standard satisfaction option",
          },
          {
            id: "opt-3",
            text: "Neutral",
            description: "Neither satisfied nor dissatisfied",
            reasoning: "Provides balanced middle option",
          },
          {
            id: "opt-4",
            text: "Dissatisfied",
            description: "Indicates low satisfaction",
            reasoning: "Important negative option",
          },
        ],
        suggestions: {
          orderingNote: "Consider randomizing option order",
          balanceNote: "Options provide balanced coverage",
          additionalOptions: "Could add 'Very Dissatisfied' for complete scale",
        },
      };

      mockGenerateChatCompletion.mockResolvedValue(mockAIResponse);
      mockParseJsonResponse.mockReturnValue(mockParsedResponse);

      const result = await caller.generateQuestionOptions({
        questionTitle: "How satisfied are you with our service?",
        questionDescription: "Please rate your overall satisfaction",
        questionType: "multi-choice",
        category: "feedback",
        optionCount: 4,
      });

      expect(mockGenerateChatCompletion).toHaveBeenCalledWith(
        [
          {
            role: "user",
            content: expect.stringContaining("How satisfied are you with our service?"),
          },
        ],
        "GPT_4O",
        { temperature: 0.6 }
      );

      expect(result).toEqual({
        options: [
          {
            id: "opt-1",
            text: "Very Satisfied",
            description: "Indicates high satisfaction",
            reasoning: "Common satisfaction survey option",
          },
          {
            id: "opt-2",
            text: "Satisfied",
            description: "Indicates moderate satisfaction",
            reasoning: "Standard satisfaction option",
          },
          {
            id: "opt-3",
            text: "Neutral",
            description: "Neither satisfied nor dissatisfied",
            reasoning: "Provides balanced middle option",
          },
          {
            id: "opt-4",
            text: "Dissatisfied",
            description: "Indicates low satisfaction",
            reasoning: "Important negative option",
          },
        ],
        metadata: {
          questionTitle: "How satisfied are you with our service?",
          questionType: "multi-choice",
          generatedCount: 4,
          requestedCount: 4,
        },
        suggestions: {
          orderingNote: "Consider randomizing option order",
          balanceNote: "Options provide balanced coverage",
          additionalOptions: "Could add 'Very Dissatisfied' for complete scale",
        },
      });
    });

    it("should generate items for ranking questions", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = adminRouter.createCaller(mockCtx);

      const mockAIResponse = "Mock AI response";
      const mockParsedResponse = {
        options: [
          {
            id: "item-1",
            text: "Price",
            description: "Cost consideration",
            reasoning: "Primary factor in purchasing decisions",
          },
          {
            id: "item-2",
            text: "Quality",
            description: "Product/service quality",
            reasoning: "Important for long-term satisfaction",
          },
          {
            id: "item-3",
            text: "Customer Service",
            description: "Support and assistance quality",
            reasoning: "Critical for customer retention",
          },
          {
            id: "item-4",
            text: "Brand Reputation",
            description: "Company reputation and trust",
            reasoning: "Influences purchase confidence",
          },
        ],
        suggestions: {
          orderingNote: "Consider randomizing to reduce order bias",
          balanceNote: "Items cover key decision factors",
          additionalOptions: "Could add 'Delivery Speed' or 'Features'",
        },
      };

      mockGenerateChatCompletion.mockResolvedValue(mockAIResponse);
      mockParseJsonResponse.mockReturnValue(mockParsedResponse);

      const result = await caller.generateQuestionOptions({
        questionTitle: "Rank these factors by importance when choosing a product",
        questionType: "ranking",
        category: "research",
        optionCount: 4,
        context: "Product selection survey",
      });

      expect(result.options).toHaveLength(4);
      expect(result.options[0]).toEqual({
        id: "item-1",
        text: "Price",
        description: "Cost consideration",
        reasoning: "Primary factor in purchasing decisions",
      });
      expect(result.metadata.questionType).toBe("ranking");
    });

    it("should generate alternatives for A/B test questions", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = adminRouter.createCaller(mockCtx);

      const mockAIResponse = "Mock AI response";
      const mockParsedResponse = {
        options: [
          {
            id: "option-a",
            text: "Sign Up Now",
            description: "Direct call-to-action",
            reasoning: "Urgency-focused, immediate action",
          },
          {
            id: "option-b",
            text: "Learn More",
            description: "Informational approach",
            reasoning: "Education-focused, builds interest first",
          },
        ],
        suggestions: {
          orderingNote: "A/B test should randomize presentation",
          balanceNote: "Options test different psychological approaches",
          additionalOptions: "Options sufficient for A/B testing",
        },
      };

      mockGenerateChatCompletion.mockResolvedValue(mockAIResponse);
      mockParseJsonResponse.mockReturnValue(mockParsedResponse);

      const result = await caller.generateQuestionOptions({
        questionTitle: "Which button text is more appealing?",
        questionType: "ab-test",
        category: "ux-research",
        optionCount: 2,
      });

      expect(result.options).toHaveLength(2);
      expect(result.options[0].text).toBe("Sign Up Now");
      expect(result.options[1].text).toBe("Learn More");
      expect(result.metadata.questionType).toBe("ab-test");
    });

    it("should avoid duplicating existing options", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = adminRouter.createCaller(mockCtx);

      const mockAIResponse = "Mock AI response";
      const mockParsedResponse = {
        options: [
          {
            id: "opt-3",
            text: "Maybe",
            description: "Uncertain response",
            reasoning: "Provides middle-ground option",
          },
          {
            id: "opt-4",
            text: "Not Sure",
            description: "Indicates uncertainty",
            reasoning: "Alternative to definitive yes/no",
          },
        ],
        suggestions: {
          orderingNote: "Consider logical flow",
          balanceNote: "Options complement existing choices",
          additionalOptions: "Generated options avoid duplication",
        },
      };

      mockGenerateChatCompletion.mockResolvedValue(mockAIResponse);
      mockParseJsonResponse.mockReturnValue(mockParsedResponse);

      const result = await caller.generateQuestionOptions({
        questionTitle: "Do you agree with this statement?",
        questionType: "multi-choice",
        optionCount: 2,
        existingOptions: ["Yes", "No"], // Existing options to avoid
      });

      // Verify the prompt includes existing options to avoid
      expect(mockGenerateChatCompletion).toHaveBeenCalledWith(
        [
          {
            role: "user",
            content: expect.stringContaining("Existing Options to Avoid Duplicating"),
          },
        ],
        "GPT_4O",
        { temperature: 0.6 }
      );

      expect(result.options).toHaveLength(2);
      expect(result.options.some((opt) => opt.text === "Yes")).toBe(false);
      expect(result.options.some((opt) => opt.text === "No")).toBe(false);
    });

    it("should handle AI parsing errors gracefully", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = adminRouter.createCaller(mockCtx);

      mockGenerateChatCompletion.mockResolvedValue("Invalid JSON response");
      mockParseJsonResponse.mockImplementation(() => {
        throw new Error("Failed to parse JSON");
      });

      await expect(
        caller.generateQuestionOptions({
          questionTitle: "Test question",
          questionType: "multi-choice",
          optionCount: 3,
        })
      ).rejects.toThrow("Failed to generate valid question options");
    });

    it("should validate required fields in AI response", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = adminRouter.createCaller(mockCtx);

      const mockAIResponse = "Mock AI response";
      const invalidParsedResponse = {
        options: [
          {
            id: "opt-1",
            // Missing 'text' field
            description: "Some description",
            reasoning: "Some reasoning",
          },
        ],
      };

      mockGenerateChatCompletion.mockResolvedValue(mockAIResponse);
      mockParseJsonResponse.mockReturnValue(invalidParsedResponse);

      await expect(
        caller.generateQuestionOptions({
          questionTitle: "Test question",
          questionType: "multi-choice",
          optionCount: 1,
        })
      ).rejects.toThrow("Option 1 missing valid text");
    });

    it("should require admin permissions", async () => {
      const mockCtx = createMockContext({ isAdmin: false });
      const caller = adminRouter.createCaller(mockCtx);

      await expect(
        caller.generateQuestionOptions({
          questionTitle: "Test question",
          questionType: "multi-choice",
          optionCount: 3,
        })
      ).rejects.toThrow();
    });

    it("should validate input parameters", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = adminRouter.createCaller(mockCtx);

      // Test invalid question type
      await expect(
        caller.generateQuestionOptions({
          questionTitle: "Test question",
          questionType: "invalid-type" as "multi-choice",
          optionCount: 3,
        })
      ).rejects.toThrow();

      // Test invalid option count
      await expect(
        caller.generateQuestionOptions({
          questionTitle: "Test question",
          questionType: "multi-choice",
          optionCount: 0, // Below minimum
        })
      ).rejects.toThrow();

      await expect(
        caller.generateQuestionOptions({
          questionTitle: "Test question",
          questionType: "multi-choice",
          optionCount: 15, // Above maximum
        })
      ).rejects.toThrow();
    });
  });

  describe("prompt engineering verification", () => {
    it("should include all relevant context in AI prompt", async () => {
      const mockCtx = createMockContext({ isAdmin: true });
      const caller = adminRouter.createCaller(mockCtx);

      const mockAIResponse = "Mock response";
      const mockParsedResponse = {
        options: [{ id: "1", text: "Option 1", description: "", reasoning: "" }],
        suggestions: {},
      };

      mockGenerateChatCompletion.mockResolvedValue(mockAIResponse);
      mockParseJsonResponse.mockReturnValue(mockParsedResponse);

      await caller.generateQuestionOptions({
        questionTitle: "What is your favorite color?",
        questionDescription: "Select your preferred color",
        questionType: "multi-choice",
        category: "preferences",
        context: "Color preference survey for website design",
        optionCount: 4,
        existingOptions: ["Red", "Blue"],
      });

      const capturedPrompt = mockGenerateChatCompletion.mock.calls[0][0][0].content;

      // Verify prompt includes all context
      expect(capturedPrompt).toContain("What is your favorite color?");
      expect(capturedPrompt).toContain("Select your preferred color");
      expect(capturedPrompt).toContain("multi-choice");
      expect(capturedPrompt).toContain("preferences");
      expect(capturedPrompt).toContain("Color preference survey for website design");
      expect(capturedPrompt).toContain("Existing Options to Avoid Duplicating");
      expect(capturedPrompt).toContain("Red");
      expect(capturedPrompt).toContain("Blue");
      expect(capturedPrompt).toContain("Generate 4");
    });
  });
});
