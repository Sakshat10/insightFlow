import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "@/services/analytics.service";
import { ANALYTICS_QUERY_KEYS } from "@/constants/query-keys";

export function useTopPagesAnalytics(projectId: number, limit?: number) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.topPages(projectId, limit),
    queryFn: () => AnalyticsService.getTopPages(projectId, limit),
    staleTime: 60 * 1000, // 60 seconds
    enabled: !!projectId && !isNaN(projectId),
  });
}
