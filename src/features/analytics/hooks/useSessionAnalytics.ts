import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "@/services/analytics.service";
import { ANALYTICS_QUERY_KEYS } from "@/constants/query-keys";

export function useSessionAnalytics(projectId: number) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.sessions(projectId),
    queryFn: () => AnalyticsService.getSessions(projectId),
    staleTime: 60 * 1000, // 60 seconds
    enabled: !!projectId && !isNaN(projectId),
  });
}
