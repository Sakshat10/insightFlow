import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "@/services/analytics.service";
import { ANALYTICS_QUERY_KEYS } from "@/constants/query-keys";

export function useSessionList(projectId: number, page?: number, size?: number) {
  return useQuery({
    queryKey: [...ANALYTICS_QUERY_KEYS.sessions(projectId), "list", page, size],
    queryFn: () => AnalyticsService.getSessionList(projectId, page, size),
    staleTime: 60 * 1000, // 60 seconds
    enabled: !!projectId && !isNaN(projectId),
  });
}
