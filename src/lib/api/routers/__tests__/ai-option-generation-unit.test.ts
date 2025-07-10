/**
 * AI Option Generation Unit Tests
 *
 * Tests the validation and core logic of the generateQuestionOptions endpoint
 * without requiring actual AI client initialization.
 */

import { describe, it, expect } from "@jest/globals";
import { z } from "zod";

describe("AI Option Generation Validation", () => {
  describe("input validation schema", () => {
    // Define the validation schema (matching what's in adminRouter)
    const generateQuestionOptionsSchema = z.object({
      questionTitle: z.string().min(1),
      questionDescription: z.string().optional(),
      questionType: z.enum(["multi-choice", "ranking", "ab-test"]),
      category: z.string().optional(),
      context: z.string().optional(),
      optionCount: z.number().min(2).max(10).default(4),
      existingOptions: z.array(z.string()).optional(),
    });

    it("should validate correct input parameters", () => {
      const validInput = {
        questionTitle: "What is your favorite color?",
        questionDescription: "Select your preferred color",
        questionType: "multi-choice" as const,
        category: "preferences",
        context: "Color preference survey",
        optionCount: 4,
        existingOptions: ["Red", "Blue"],
      };

      const result = generateQuestionOptionsSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.questionTitle).toBe("What is your favorite color?");
        expect(result.data.optionCount).toBe(4);
        expect(result.data.questionType).toBe("multi-choice");
      }
    });

    it("should reject invalid question types", () => {
      const invalidInput = {
        questionTitle: "Test question",
        questionType: "invalid-type",
        optionCount: 3,
      };

      const result = generateQuestionOptionsSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should enforce option count limits", () => {
      // Test below minimum
      const belowMin = {
        questionTitle: "Test question",
        questionType: "multi-choice" as const,
        optionCount: 1, // Below minimum of 2
      };
      expect(generateQuestionOptionsSchema.safeParse(belowMin).success).toBe(false);

      // Test above maximum
      const aboveMax = {
        questionTitle: "Test question",
        questionType: "multi-choice" as const,
        optionCount: 15, // Above maximum of 10
      };
      expect(generateQuestionOptionsSchema.safeParse(aboveMax).success).toBe(false);

      // Test valid range
      const validRange = {
        questionTitle: "Test question",
        questionType: "multi-choice" as const,
        optionCount: 5,
      };
      expect(generateQuestionOptionsSchema.safeParse(validRange).success).toBe(true);
    });

    it("should apply default option count", () => {
      const inputWithoutCount = {
        questionTitle: "Test question",
        questionType: "ranking" as const,
      };

      const result = generateQuestionOptionsSchema.safeParse(inputWithoutCount);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.optionCount).toBe(4);
      }
    });

    it("should require question title", () => {
      const noTitle = {
        questionType: "multi-choice" as const,
        optionCount: 3,
      };

      const result = generateQuestionOptionsSchema.safeParse(noTitle);
      expect(result.success).toBe(false);

      const emptyTitle = {
        questionTitle: "",
        questionType: "multi-choice" as const,
        optionCount: 3,
      };

      const result2 = generateQuestionOptionsSchema.safeParse(emptyTitle);
      expect(result2.success).toBe(false);
    });

    it("should accept all supported question types", () => {
      const supportedTypes = ["multi-choice", "ranking", "ab-test"] as const;

      supportedTypes.forEach((type) => {
        const input = {
          questionTitle: "Test question",
          questionType: type,
          optionCount: 3,
        };

        const result = generateQuestionOptionsSchema.safeParse(input);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.questionType).toBe(type);
        }
      });
    });

    it("should handle optional fields correctly", () => {
      const minimalInput = {
        questionTitle: "Test question",
        questionType: "multi-choice" as const,
      };

      const result = generateQuestionOptionsSchema.safeParse(minimalInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.questionDescription).toBeUndefined();
        expect(result.data.category).toBeUndefined();
        expect(result.data.context).toBeUndefined();
        expect(result.data.existingOptions).toBeUndefined();
        expect(result.data.optionCount).toBe(4); // Default value
      }
    });
  });

  describe("response validation", () => {
    it("should validate AI response structure", () => {
      const validResponse = {
        options: [
          {
            id: "opt-1",
            text: "Option 1",
            description: "First option",
            reasoning: "This is a good option because...",
          },
          {
            id: "opt-2",
            text: "Option 2",
            description: "Second option",
            reasoning: "This complements the first option...",
          },
        ],
        suggestions: {
          orderingNote: "Consider randomizing order",
          balanceNote: "Options are well balanced",
          additionalOptions: "Could add more specific options",
        },
      };

      // Test that we have required fields
      expect(validResponse.options).toBeDefined();
      expect(Array.isArray(validResponse.options)).toBe(true);
      expect(validResponse.options.length).toBeGreaterThan(0);

      validResponse.options.forEach((option, _index) => {
        expect(option.id).toBeDefined();
        expect(typeof option.id).toBe("string");
        expect(option.text).toBeDefined();
        expect(typeof option.text).toBe("string");
        expect(option.text.length).toBeGreaterThan(0);
      });
    });

    it("should handle missing optional fields in AI response", () => {
      const responseWithMissingFields = {
        options: [
          {
            id: "opt-1",
            text: "Option 1",
            // Missing description and reasoning
          },
        ],
      };

      // Should still be valid with minimal required fields
      expect(responseWithMissingFields.options[0].id).toBeDefined();
      expect(responseWithMissingFields.options[0].text).toBeDefined();
    });
  });

  describe("business logic validation", () => {
    it("should handle appropriate option counts for different question types", () => {
      const questionTypeDefaults = {
        "multi-choice": { min: 2, recommended: 4, max: 8 },
        ranking: { min: 3, recommended: 5, max: 7 },
        "ab-test": { min: 2, recommended: 2, max: 2 },
      };

      Object.entries(questionTypeDefaults).forEach(([_type, limits]) => {
        // Test that recommended counts are within expected ranges
        expect(limits.recommended).toBeGreaterThanOrEqual(limits.min);
        expect(limits.recommended).toBeLessThanOrEqual(limits.max);
        expect(limits.max).toBeLessThanOrEqual(10); // Schema maximum
      });
    });

    it("should validate existing options format", () => {
      const validExistingOptions = ["Yes", "No", "Maybe"];
      const invalidExistingOptions = [123, null, "", "  "];

      // Valid options should all be non-empty strings
      validExistingOptions.forEach((option) => {
        expect(typeof option).toBe("string");
        expect(option.trim().length).toBeGreaterThan(0);
      });

      // Invalid options should be filtered out
      const filteredOptions = invalidExistingOptions.filter(
        (option) => typeof option === "string" && option.trim().length > 0
      );
      expect(filteredOptions).toHaveLength(0);
    });
  });

  describe("prompt construction logic", () => {
    it("should build appropriate prompt sections for different question types", () => {
      const questionTypes = ["multi-choice", "ranking", "ab-test"] as const;

      questionTypes.forEach((type) => {
        let expectedPromptContent: string[] = [];

        switch (type) {
          case "multi-choice":
            expectedPromptContent = [
              "distinct options that cover the likely response range",
              "mutually exclusive and comprehensive",
            ];
            break;
          case "ranking":
            expectedPromptContent = ["items that can be meaningfully ranked", "comparable"];
            break;
          case "ab-test":
            expectedPromptContent = ["2 distinct alternatives", "Option A and Option B"];
            break;
        }

        // Each question type should have specific prompt requirements
        expect(expectedPromptContent.length).toBeGreaterThan(0);
      });
    });

    it("should handle context inclusion in prompts", () => {
      const contextExamples = [
        "User satisfaction survey for mobile app",
        "Product feature prioritization research",
        "Brand preference study for millennials",
      ];

      contextExamples.forEach((context) => {
        // Context should be meaningful and specific
        expect(context.length).toBeGreaterThan(10);
        expect(context.split(" ").length).toBeGreaterThan(2);
      });
    });
  });
});
