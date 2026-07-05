import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AnalyticsService } from "@/services/analytics.service";
import { SAVED_FUNNEL_QUERY_KEYS } from "@/constants/query-keys";
import { components } from "@/generated/openapi";

type CreateFunnelRequest = components["schemas"]["CreateFunnelRequest"];
type UpdateFunnelRequest = components["schemas"]["UpdateFunnelRequest"];

export function useSavedFunnels(projectId: number) {
  return useQuery({
    queryKey: SAVED_FUNNEL_QUERY_KEYS.list(projectId),
    queryFn: () => AnalyticsService.getFunnels(projectId),
    staleTime: 60 * 1000,
    enabled: !!projectId && !isNaN(projectId),
  });
}

export function useSavedFunnelDetail(id: number, enabled = true) {
  return useQuery({
    queryKey: SAVED_FUNNEL_QUERY_KEYS.detail(id),
    queryFn: () => AnalyticsService.getFunnelById(id),
    staleTime: 60 * 1000,
    enabled: enabled && !!id && !isNaN(id),
  });
}

export function useCreateFunnel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFunnelRequest) => AnalyticsService.createFunnel(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: SAVED_FUNNEL_QUERY_KEYS.list(variables.projectId),
      });
    },
  });
}

export function useUpdateFunnel(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateFunnelRequest) => AnalyticsService.updateFunnel(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: SAVED_FUNNEL_QUERY_KEYS.detail(id),
      });
      if (data.projectId) {
        queryClient.invalidateQueries({
          queryKey: SAVED_FUNNEL_QUERY_KEYS.list(data.projectId),
        });
      }
    },
  });
}

export function useDeleteFunnel(id: number, projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => AnalyticsService.deleteFunnel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SAVED_FUNNEL_QUERY_KEYS.list(projectId),
      });
      queryClient.removeQueries({
        queryKey: SAVED_FUNNEL_QUERY_KEYS.detail(id),
      });
    },
  });
}
