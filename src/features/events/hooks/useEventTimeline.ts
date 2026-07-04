import { useQuery } from "@tanstack/react-query";
import { EventTimelineService } from "@/services/eventTimeline.service";

export function useEventTimeline(projectId: number, from: string, to: string) {
  return useQuery({
    queryKey: ["event-timeline", projectId, from, to] as const,
    queryFn: () => EventTimelineService.getEventTimeline({ projectId, from, to }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !isNaN(projectId) && projectId > 0 && !!from && !!to,
  });
}
