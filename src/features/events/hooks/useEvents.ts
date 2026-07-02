import { useQuery } from "@tanstack/react-query";
import { EventService } from "@/services/event.service";
import { EVENT_QUERY_KEYS } from "@/constants/query-keys";

export function useEvents(params: {
  projectId: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}) {
  return useQuery({
    queryKey: EVENT_QUERY_KEYS.lists(params),
    queryFn: () => EventService.getEvents(params),
    staleTime: 60 * 1000, // 60 seconds
    enabled: !isNaN(params.projectId) && params.projectId > 0,
  });
}
