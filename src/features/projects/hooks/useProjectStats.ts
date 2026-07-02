import { useQuery } from "@tanstack/react-query";
import { ProjectService } from "@/services/project.service";
import { PROJECT_QUERY_KEYS } from "@/constants/query-keys";

export function useProjectStats() {
  return useQuery({
    queryKey: PROJECT_QUERY_KEYS.stats(),
    queryFn: () => ProjectService.getProjectStats(),
    staleTime: 30 * 1000, // 30 seconds
  });
}
