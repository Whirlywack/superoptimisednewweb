import { trpc } from "@/lib/trpc/client";
import type { ProjectProgress } from "@/lib/milestone-tracker";

export function useProjectProgress() {
  const {
    data: progress,
    isLoading,
    error,
    refetch,
  } = trpc.content.getProjectProgress.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  const refreshMutation = trpc.content.refreshProjectProgress.useMutation({
    onSuccess: () => {
      // Invalidate and refetch the project progress
      refetch();
    },
  });

  const refreshProgress = () => {
    refreshMutation.mutate();
  };

  return {
    progress: progress as ProjectProgress | undefined,
    isLoading: isLoading || refreshMutation.isLoading,
    error,
    refreshProgress,
    isRefreshing: refreshMutation.isLoading,
  };
}
