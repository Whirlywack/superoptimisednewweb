"use client";

import { api } from "@/lib/trpc/react";
import { useCallback } from "react";

export interface UseActiveQuestionsOptions {
  category?: "auth" | "platform" | "general";
  limit?: number;
}

export function useActiveQuestions(options: UseActiveQuestionsOptions = {}) {
  const { category, limit = 10 } = options;

  const {
    data: questions,
    isLoading,
    isError,
    error,
    refetch,
  } = api.question.getActiveQuestions.useQuery(
    { category, limit },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const getRandomQuestions = useCallback(
    (count: number = 2) => {
      if (!questions || questions.length === 0) return [];

      // If we have fewer questions than requested, return all
      if (questions.length <= count) return questions;

      // Shuffle and return random subset
      const shuffled = [...questions].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    },
    [questions]
  );

  const getQuestionById = useCallback(
    (id: string) => {
      return questions?.find((q) => q.id === id) || null;
    },
    [questions]
  );

  return {
    questions: questions || [],
    isLoading,
    isError,
    error: error?.message || null,
    refetch,
    getRandomQuestions,
    getQuestionById,
    hasQuestions: (questions?.length || 0) > 0,
    totalQuestions: questions?.length || 0,
  };
}
