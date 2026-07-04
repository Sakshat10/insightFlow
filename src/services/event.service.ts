import { EventRepository } from "@/repositories/event.repository";
import { components } from "@/generated/openapi";

type EventResponse = components["schemas"]["EventResponse"];

export interface FrontEvent {
  id: string;
  name: string;
  displayName: string;
  count: number;
  uniqueUsers: number;
  conversionImpact: "Critical" | "High" | "Medium" | "Low" | "--";
  trend: number;
  lastSeen: string;
  category: string;
  description: string;
  sessionId?: string;
  url?: string;
  country?: string;
  deviceType?: string;
  browser?: string;
  properties?: string;
}

export interface PagedFrontEvents {
  content: FrontEvent[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export class EventService {
  static transformEvent(e: EventResponse): FrontEvent {
    const name = e.eventName || "unknown";
    // Capitalize eventName for displayName
    const displayName = e.eventName
      ? e.eventName.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "Unknown Event";
      
    // Determine conversionImpact and category from eventName or category
    let category = e.eventCategory || "engagement";
    let conversionImpact: "Critical" | "High" | "Medium" | "Low" | "--" = "--";
    
    if (name === "purchase" || name === "trial_activated") {
      conversionImpact = "Critical";
    } else if (name === "signup" || name === "checkout_started" || name === "contact_form_submit") {
      conversionImpact = "High";
    } else if (name === "download_pdf" || name === "feature_clicked") {
      conversionImpact = "Medium";
    }
    
    if (name === "purchase" || name === "checkout_started") {
      category = "revenue";
    } else if (name === "signup" || name === "contact_form_submit" || name === "trial_activated") {
      category = "acquisition";
    } else if (name === "pricing_page_view") {
      category = "intent";
    }

    // Format lastSeen to human readable or use createdAt
    let lastSeen = "Just now";
    if (e.createdAt) {
      try {
        const date = new Date(e.createdAt);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 1) {
          lastSeen = "Just now";
        } else if (diffMins < 60) {
          lastSeen = `${diffMins} min ago`;
        } else if (diffHours < 24) {
          lastSeen = `${diffHours} hr ago`;
        } else {
          lastSeen = `${diffDays} days ago`;
        }
      } catch {
        lastSeen = e.createdAt;
      }
    }

    return {
      id: String(e.id),
      name,
      displayName,
      count: 1, // Individual event instance
      uniqueUsers: 1, // Individual event instance
      conversionImpact,
      trend: 0, // Individual event has no trend
      lastSeen,
      category,
      description: e.eventLabel || `Event ${name} tracked on path ${e.url || ""}`,
      sessionId: e.sessionId ? String(e.sessionId) : undefined,
      url: e.url,
      country: e.country,
      deviceType: "--",
      browser: e.browser,
      properties: e.properties,
    };
  }

  static async getEvents(params: {
    projectId: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PagedFrontEvents> {
    const response = await EventRepository.getEvents(params);
    const data = response?.data || {};
    const content = data.content || [];
    
    return {
      content: content.map((e) => this.transformEvent(e)),
      page: data.page || 0,
      size: data.size || 10,
      totalElements: data.totalElements || 0,
      totalPages: data.totalPages || 0,
      first: data.first ?? true,
      last: data.last ?? true,
    };
  }

  static async getEventById(id: number): Promise<FrontEvent> {
    const response = await EventRepository.getEventById(id);
    const data = response?.data;
    if (!data) {
      throw new Error("Event not found");
    }
    return this.transformEvent(data);
  }
}
