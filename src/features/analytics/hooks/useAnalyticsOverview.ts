import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "@/services/analytics.service";
import { ANALYTICS_QUERY_KEYS } from "@/constants/query-keys";

export function useAnalyticsOverview(projectId: number) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.overview(projectId),
    queryFn: () => AnalyticsService.getOverview(projectId),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!projectId && !isNaN(projectId),
  });
}
