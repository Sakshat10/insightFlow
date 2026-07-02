import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "@/services/analytics.service";
import { ANALYTICS_QUERY_KEYS } from "@/constants/query-keys";

export function useCountryAnalytics(projectId: number) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.countries(projectId),
    queryFn: () => AnalyticsService.getCountries(projectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!projectId && !isNaN(projectId),
  });
}
