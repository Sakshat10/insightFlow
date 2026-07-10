import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "@/services/analytics.service";
import { ANALYTICS_QUERY_KEYS } from "@/constants/query-keys";

export function useReferrerAnalytics(projectId: number, from: string, to: string) {
  return useQuery({
    queryKey: [...ANALYTICS_QUERY_KEYS.referrers(projectId), from, to],
    queryFn: () => AnalyticsService.getTrafficSources({ projectId, from, to }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!projectId && !isNaN(projectId) && !!from && !!to,
  });
}
