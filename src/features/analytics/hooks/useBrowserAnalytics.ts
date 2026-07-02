import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "@/services/analytics.service";
import { ANALYTICS_QUERY_KEYS } from "@/constants/query-keys";

export function useBrowserAnalytics(projectId: number) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.browsers(projectId),
    queryFn: () => AnalyticsService.getBrowsers(projectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!projectId && !isNaN(projectId),
  });
}
