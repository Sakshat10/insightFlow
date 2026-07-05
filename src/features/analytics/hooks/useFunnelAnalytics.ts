import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "@/services/analytics.service";
import { ANALYTICS_QUERY_KEYS } from "@/constants/query-keys";

export function useFunnelAnalytics(params: {
  projectId: number;
  from: string;
  to: string;
  steps: string[];
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.funnel(
      params.projectId,
      params.from,
      params.to,
      params.steps
    ),
    queryFn: () =>
      AnalyticsService.getFunnel({
        projectId: params.projectId,
        from: params.from,
        to: params.to,
        steps: params.steps,
      }),
    staleTime: 30 * 1000, // 30 seconds
    enabled:
      params.enabled !== false &&
      !!params.projectId &&
      !isNaN(params.projectId) &&
      !!params.from &&
      !!params.to &&
      params.steps.length >= 2,
  });
}
