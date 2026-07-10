import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ConversionGoalService } from "@/services/conversionGoal.service";
import { CONVERSION_GOAL_QUERY_KEYS, ANALYTICS_QUERY_KEYS } from "@/constants/query-keys";
import { components } from "@/generated/openapi";

type CreateConversionGoalRequest = components["schemas"]["CreateConversionGoalRequest"];
type UpdateConversionGoalRequest = components["schemas"]["UpdateConversionGoalRequest"];

export function useConversionGoalsQuery(projectId: number) {
  return useQuery({
    queryKey: CONVERSION_GOAL_QUERY_KEYS.list(projectId),
    queryFn: () => ConversionGoalService.getConversionGoals(projectId),
    staleTime: 5 * 60 * 1000,
    enabled: !!projectId && !isNaN(projectId),
  });
}

export function useConversionGoalByIdQuery(id: number) {
  return useQuery({
    queryKey: CONVERSION_GOAL_QUERY_KEYS.detail(id),
    queryFn: () => ConversionGoalService.getConversionGoalById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id && !isNaN(id),
  });
}

export function useCreateConversionGoalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateConversionGoalRequest) =>
      ConversionGoalService.createConversionGoal(request),
    onSuccess: (data) => {
      if (data.projectId) {
        queryClient.invalidateQueries({ queryKey: CONVERSION_GOAL_QUERY_KEYS.list(data.projectId) });
        queryClient.invalidateQueries({ queryKey: CONVERSION_GOAL_QUERY_KEYS.all });
        queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEYS.all });
      }
    },
  });
}

export function useUpdateConversionGoalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateConversionGoalRequest }) =>
      ConversionGoalService.updateConversionGoal(id, request),
    onSuccess: (data) => {
      if (data.projectId) {
        queryClient.invalidateQueries({ queryKey: CONVERSION_GOAL_QUERY_KEYS.list(data.projectId) });
        queryClient.invalidateQueries({ queryKey: CONVERSION_GOAL_QUERY_KEYS.all });
        queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEYS.all });
      }
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: CONVERSION_GOAL_QUERY_KEYS.detail(data.id) });
      }
    },
  });
}

export function useDeactivateConversionGoalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ConversionGoalService.deactivateConversionGoal(id),
    onSuccess: (data) => {
      if (data.projectId) {
        queryClient.invalidateQueries({ queryKey: CONVERSION_GOAL_QUERY_KEYS.list(data.projectId) });
        queryClient.invalidateQueries({ queryKey: CONVERSION_GOAL_QUERY_KEYS.all });
        queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEYS.all });
      }
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: CONVERSION_GOAL_QUERY_KEYS.detail(data.id) });
      }
    },
  });
}

export function useConversionAnalyticsQuery(projectId: number, days?: number) {
  const daysParam = days || 30;
  return useQuery({
    queryKey: CONVERSION_GOAL_QUERY_KEYS.analytics(projectId, daysParam),
    queryFn: () => ConversionGoalService.getConversionAnalytics(projectId, daysParam),
    staleTime: 5 * 60 * 1000,
    enabled: !!projectId && !isNaN(projectId),
  });
}
