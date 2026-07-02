import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "@/services/analytics.service";
import { ANALYTICS_QUERY_KEYS } from "@/constants/query-keys";

export function useReferrerAnalytics(projectId: number) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.referrers(projectId),
    queryFn: () => AnalyticsService.getReferrers(projectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!projectId && !isNaN(projectId),
  });
}
