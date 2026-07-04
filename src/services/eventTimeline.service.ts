import { AnalyticsRepository } from "@/repositories/analytics.repository";

export interface ChartDayData {
  date: string;
  [eventName: string]: string | number;
}

export interface FrontEventTimelineData {
  chartData: ChartDayData[];
  eventNames: string[];
}

export class EventTimelineService {
  static async getEventTimeline(params: {
    projectId: number;
    from: string;
    to: string;
  }): Promise<FrontEventTimelineData> {
    const response = await AnalyticsRepository.getEventTimeline(params);
    const data = response?.data || {};
    const timeline = data.timeline || [];
    
    const eventNamesSet = new Set<string>();
    
    const chartData = timeline.map((day) => {
      let displayDate = day.date || "";
      if (displayDate) {
        try {
          const dateObj = new Date(displayDate);
          if (!isNaN(dateObj.getTime())) {
            displayDate = dateObj.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              timeZone: "UTC",
            });
          }
        } catch {
          displayDate = day.date || "";
        }
      }

      const row: ChartDayData = { date: displayDate };
      
      const events = day.events || [];
      events.forEach((item) => {
        if (item.eventName) {
          row[item.eventName] = item.count || 0;
          eventNamesSet.add(item.eventName);
        }
      });
      
      return row;
    });

    return {
      chartData,
      eventNames: Array.from(eventNamesSet),
    };
  }
}
