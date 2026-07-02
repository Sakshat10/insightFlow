import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "@/services/analytics.service";
import { ANALYTICS_QUERY_KEYS } from "@/constants/query-keys";

export function useDeviceAnalytics(projectId: number) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.devices(projectId),
    queryFn: () => AnalyticsService.getDevices(projectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!projectId && !isNaN(projectId),
  });
}
