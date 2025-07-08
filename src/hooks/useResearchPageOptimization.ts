"use client";

import { useMemo, useCallback, useRef } from "react";
import { useActiveQuestions } from "./useActiveQuestions";

export interface ProcessedQuestion {
  id: string;
  title: string;
  description: string;
  content?: {
    type: string;
    maxSelections?: number;
    scale?: number;
    variant?: string;
    maxLength?: number;
    placeholder?: string;
    items?: Record<string, unknown>[];
    optionA?: Record<string, unknown>;
    optionB?: Record<string, unknown>;
  };
  options?: {
    id: string;
    text: string;
    description?: string;
  }[];
}

export interface DatabaseQuestion {
  id: string;
  title: string;
  description: string | null;
  questionType: string;
  questionData: {
    type?: string;
    options?: Record<string, unknown>[];
    optionLabels?: Record<string, string>;
    optionDescriptions?: Record<string, string>;
    maxSelections?: number;
    scale?: number;
    variant?: string;
    maxLength?: number;
    placeholder?: string;
    items?: Record<string, unknown>[];
    optionA?: Record<string, unknown>;
    optionB?: Record<string, unknown>;
  };
  category: string | null;
  responseCount: number;
}

export function useResearchPageOptimization() {
  const processedQuestionsCache = useRef<Map<string, ProcessedQuestion>>(new Map());

  // Fetch research questions from database with optimized caching
  const {
    questions: dbQuestions,
    isLoading,
    isError,
    error,
    refetch,
  } = useActiveQuestions({
    category: "research",
    limit: 10,
  });

  // Memoized question processing to avoid re-computation
  const processQuestion = useCallback((dbQuestion: DatabaseQuestion): ProcessedQuestion => {
    // Check cache first
    const cached = processedQuestionsCache.current.get(dbQuestion.id);
    if (cached) {
      return cached;
    }

    const { questionData, questionType } = dbQuestion;
    const questionDataType = questionData?.type || questionType || "binary";

    const processed: ProcessedQuestion = {
      id: dbQuestion.id,
      title: dbQuestion.title,
      description: dbQuestion.description || "",
      content: {
        type: questionDataType,
        ...questionData,
      },
    };

    // Process options differently based on question type
    switch (questionDataType) {
      case "binary":
      case "multi-choice":
        const options = questionData?.options || [];
        const optionLabels = questionData?.optionLabels || {};
        const optionDescriptions = questionData?.optionDescriptions || {};

        processed.options = options.map((option: Record<string, unknown> | string) => {
          // Handle both string arrays and object arrays
          if (typeof option === "string") {
            return {
              id: option,
              text: optionLabels[option] || option,
              description: optionDescriptions[option],
            };
          } else if (typeof option === "object" && option.id) {
            return {
              id: option.id,
              text: option.text || option.id,
              description: option.description,
            };
          }
          return { id: option, text: option };
        });
        break;

      case "rating-scale":
        processed.content.scale = questionData?.scale || 10;
        processed.content.variant = questionData?.variant || "numbers";
        break;

      case "text-response":
        processed.content.maxLength = questionData?.maxLength || 500;
        processed.content.placeholder = questionData?.placeholder || "Enter your response...";
        break;

      case "ranking":
        processed.content.items = questionData?.items || [];
        break;

      case "ab-test":
        processed.content.optionA = questionData?.optionA;
        processed.content.optionB = questionData?.optionB;
        // Create options array for compatibility with optimistic updates
        processed.options = [
          {
            id: questionData?.optionA?.id || "variant_a",
            text: questionData?.optionA?.title || "Option A",
            description: questionData?.optionA?.description,
          },
          {
            id: questionData?.optionB?.id || "variant_b",
            text: questionData?.optionB?.title || "Option B",
            description: questionData?.optionB?.description,
          },
        ];
        break;

      default:
        // Fallback to binary for unknown types
        processed.content.type = "binary";
        processed.options = [
          { id: "option1", text: "Option 1" },
          { id: "option2", text: "Option 2" },
        ];
    }

    // Cache the processed question
    processedQuestionsCache.current.set(dbQuestion.id, processed);
    return processed;
  }, []);

  // Memoized processed questions to prevent unnecessary re-renders
  const questions = useMemo(() => {
    if (!dbQuestions) return [];
    return dbQuestions.map(processQuestion);
  }, [dbQuestions, processQuestion]);

  // Performance monitoring
  const performanceMetrics = useMemo(() => {
    return {
      questionsLoaded: questions.length,
      cacheSize: processedQuestionsCache.current.size,
      isOptimized:
        questions.length > 0 && questions.length === processedQuestionsCache.current.size,
    };
  }, [questions]);

  // Clear cache when needed (e.g., on error or refetch)
  const clearCache = useCallback(() => {
    processedQuestionsCache.current.clear();
  }, []);

  return {
    questions,
    isLoading,
    isError,
    error,
    refetch,
    performanceMetrics,
    clearCache,
  };
}
