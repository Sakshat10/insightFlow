import { useQuery } from "@tanstack/react-query";
import { SessionService } from "@/services/session.service";
import { SESSION_QUERY_KEYS } from "@/constants/query-keys";

export function useSession(id: number) {
  return useQuery({
    queryKey: SESSION_QUERY_KEYS.detail(id),
    queryFn: () => SessionService.getSessionById(id),
    staleTime: 30 * 1000, // 30 seconds
    enabled: !isNaN(id) && id > 0,
  });
}
