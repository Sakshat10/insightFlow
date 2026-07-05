import { useQuery } from "@tanstack/react-query";
import { SessionService } from "@/services/session.service";
import { SESSION_QUERY_KEYS } from "@/constants/query-keys";

export function useSessions(params: {
  projectId: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}) {
  return useQuery({
    queryKey: SESSION_QUERY_KEYS.lists(params),
    queryFn: () => SessionService.getSessions(params),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !isNaN(params.projectId) && params.projectId > 0,
  });
}
