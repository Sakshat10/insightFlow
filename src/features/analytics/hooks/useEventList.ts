import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "@/services/analytics.service";
import { ANALYTICS_QUERY_KEYS } from "@/constants/query-keys";

export function useEventList(projectId: number, page?: number, size?: number) {
  return useQuery({
    queryKey: [...ANALYTICS_QUERY_KEYS.events(projectId), "list", page, size],
    queryFn: () => AnalyticsService.getEventList(projectId, page, size),
    staleTime: 60 * 1000, // 60 seconds
    enabled: !!projectId && !isNaN(projectId),
  });
}
