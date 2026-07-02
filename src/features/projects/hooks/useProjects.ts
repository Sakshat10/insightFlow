import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "@/services/project.service";
import { PROJECT_QUERY_KEYS } from "@/constants/query-keys";

export function useProjects() {
  return useQuery({
    queryKey: PROJECT_QUERY_KEYS.lists(),
    queryFn: () => ProjectService.getProjects(),
    staleTime: 60 * 1000, // 60 seconds
  });
}
