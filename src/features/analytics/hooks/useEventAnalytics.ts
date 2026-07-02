import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "@/services/analytics.service";
import { ANALYTICS_QUERY_KEYS } from "@/constants/query-keys";

export function useEventAnalytics(projectId: number, limit?: number) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.events(projectId, limit),
    queryFn: () => AnalyticsService.getEvents(projectId, limit),
    staleTime: 60 * 1000, // 60 seconds
    enabled: !!projectId && !isNaN(projectId),
  });
}
