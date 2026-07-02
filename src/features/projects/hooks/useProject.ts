import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "@/services/project.service";
import { PROJECT_QUERY_KEYS } from "@/constants/query-keys";

export function useProject(id: number) {
  return useQuery({
    queryKey: PROJECT_QUERY_KEYS.detail(id),
    queryFn: () => ProjectService.getProjectById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !isNaN(id) && id > 0,
  });
}
