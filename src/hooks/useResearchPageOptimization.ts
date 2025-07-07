"use client";

import { useMemo, useCallback, useRef } from "react";
import { useActiveQuestions } from "./useActiveQuestions";

export interface ProcessedQuestion {
  id: string;
  title: string;
  description: string;
  options: {
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
    options?: string[];
    optionLabels?: Record<string, string>;
    optionDescriptions?: Record<string, string>;
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

    const { questionData } = dbQuestion;
    const options = questionData?.options || [];
    const optionLabels = questionData?.optionLabels || {};
    const optionDescriptions = questionData?.optionDescriptions || {};

    const processed: ProcessedQuestion = {
      id: dbQuestion.id,
      title: dbQuestion.title,
      description: dbQuestion.description || "",
      options: options.map((optionId: string) => ({
        id: optionId,
        text: optionLabels[optionId] || optionId,
        description: optionDescriptions[optionId],
      })),
    };

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
