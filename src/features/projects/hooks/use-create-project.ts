import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "@/services/project.service";
import { PROJECT_QUERY_KEYS } from "@/constants/query-keys";
import { components } from "@/generated/openapi";

type CreateProjectRequest = components["schemas"]["CreateProjectRequest"];

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateProjectRequest) => ProjectService.createProject(request),
    onSuccess: () => {
      // Invalidate projects lists and stats to refresh caches
      queryClient.invalidateQueries({ queryKey: PROJECT_QUERY_KEYS.all });
    },
  });
}
