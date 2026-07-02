import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "@/services/analytics.service";
import { ANALYTICS_QUERY_KEYS } from "@/constants/query-keys";

export function useTrafficAnalytics(projectId: number, days?: number) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.traffic(projectId, days),
    queryFn: () => AnalyticsService.getTraffic(projectId, days),
    staleTime: 60 * 1000, // 60 seconds
    enabled: !!projectId && !isNaN(projectId),
  });
}
