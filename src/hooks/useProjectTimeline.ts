import { api } from "@/lib/trpc/react";

export function useProjectTimeline() {
  return api.content.getProjectTimeline.useQuery(undefined, {
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });
}
