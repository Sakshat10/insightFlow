import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiKeyService } from "@/services/apikey.service";
import { API_KEY_QUERY_KEYS } from "@/constants/query-keys";
import { components } from "@/generated/openapi";

type CreateApiKeyRequest = components["schemas"]["CreateApiKeyRequest"];

export function useApiKeys(projectId: number) {
  return useQuery({
    queryKey: API_KEY_QUERY_KEYS.list(projectId),
    queryFn: () => ApiKeyService.getApiKeys(projectId),
    staleTime: 60 * 1000,
    enabled: !!projectId && !isNaN(projectId),
  });
}

export function useApiKeyDetail(id: number, enabled = true) {
  return useQuery({
    queryKey: API_KEY_QUERY_KEYS.detail(id),
    queryFn: () => ApiKeyService.getApiKeyById(id),
    staleTime: 60 * 1000,
    enabled: enabled && !!id && !isNaN(id),
  });
}

export function useApiKeyStats(projectId: number) {
  return useQuery({
    queryKey: API_KEY_QUERY_KEYS.stats(projectId),
    queryFn: () => ApiKeyService.getApiKeyStats(projectId),
    staleTime: 60 * 1000,
    enabled: !!projectId && !isNaN(projectId),
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateApiKeyRequest) => ApiKeyService.createApiKey(payload),
    onSuccess: (data) => {
      if (data.projectId) {
        queryClient.invalidateQueries({
          queryKey: API_KEY_QUERY_KEYS.list(data.projectId),
        });
        queryClient.invalidateQueries({
          queryKey: API_KEY_QUERY_KEYS.stats(data.projectId),
        });
      }
    },
  });
}

export function useRotateApiKey(id: number, projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ApiKeyService.rotateApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: API_KEY_QUERY_KEYS.list(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: API_KEY_QUERY_KEYS.stats(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: API_KEY_QUERY_KEYS.detail(id),
      });
    },
  });
}

export function useRevokeApiKey(id: number, projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => ApiKeyService.revokeApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: API_KEY_QUERY_KEYS.list(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: API_KEY_QUERY_KEYS.stats(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: API_KEY_QUERY_KEYS.detail(id),
      });
    },
  });
}
