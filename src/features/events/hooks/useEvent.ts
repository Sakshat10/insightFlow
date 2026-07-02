import { useQuery } from "@tanstack/react-query";
import { EventService } from "@/services/event.service";
import { EVENT_QUERY_KEYS } from "@/constants/query-keys";

export function useEvent(id: number) {
  return useQuery({
    queryKey: EVENT_QUERY_KEYS.detail(id),
    queryFn: () => EventService.getEventById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !isNaN(id) && id > 0,
  });
}
