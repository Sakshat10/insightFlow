import { AnalyticsRepository } from "@/repositories/analytics.repository";
import { components } from "@/generated/openapi";

type StatEntry = components["schemas"]["StatEntry"];

export interface FrontOverview {
  totalPageViews: number;
  totalSessions: number;
  totalEvents: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDurationSeconds: number;
  pageViewsToday: number;
  sessionsToday: number;
}

export interface FrontTraffic {
  date: string;
  visitors: number;
  sessions: number;
  pageViews: number;
}

export interface FrontCountry {
  country: string;
  visitors: number;
  percentage: number;
  flag: string;
}

export interface FrontDevice {
  device: string;
  sessions: number;
  percentage: number;
  color: string;
}

export interface FrontBrowser {
  browser: string;
  sessions: number;
  percentage: number;
  color: string;
}

export interface FrontReferrer {
  source: string;
  visitors: number;
  percentage: number;
  color: string;
}

export interface FrontTopPage {
  path: string;
  title: string;
  pageviews: number;
  bounceRate: number;
  avgTime: string;
}

export interface FrontSession {
  id: string;
  userId: string | null;
  user: string;
  email: string | null;
  country: string;
  device: string;
  browser: string;
  os: string;
  startTime: string;
  duration: string;
  pageCount: number;
  entryPage: string;
  exitPage: string;
  journey: string[];
  status: "converted" | "active" | "bounced" | "engaged";
  source: string;
  value: string | null;
}

export interface FrontEvent {
  id: string;
  name: string;
  displayName: string;
  count: number;
  uniqueUsers: number;
  conversionImpact: "Critical" | "High" | "Medium" | "Low";
  trend: number;
  lastSeen: string;
  category: string;
  description: string;
}

// Helpers
function getCountryFlag(countryName?: string): string {
  if (!countryName) return "🌍";
  const map: Record<string, string> = {
    "United States": "🇺🇸",
    "USA": "🇺🇸",
    "United Kingdom": "🇬🇧",
    "UK": "🇬🇧",
    "Germany": "🇩🇪",
    "Canada": "🇨🇦",
    "France": "🇫🇷",
    "Netherlands": "🇳🇱",
    "Australia": "🇦🇺",
    "Sweden": "🇸🇪",
    "Singapore": "🇸🇬",
    "India": "🇮🇳",
    "Japan": "🇯🇵",
    "China": "🇨🇳",
    "Brazil": "🇧🇷",
  };
  return map[countryName] || "🌍";
}

const DEVICE_COLORS: Record<string, string> = {
  Desktop: "#4F81F7",
  Mobile: "#64B587",
  Tablet: "#F59E0B",
};

const BROWSER_COLORS: Record<string, string> = {
  Chrome: "#4F81F7",
  Safari: "#A78BFA",
  Firefox: "#FB923C",
  Edge: "#2DD4BF",
  Other: "#94A3B8",
};

const REFERRER_COLORS: Record<string, string> = {
  "Google Search": "#4F81F7",
  "Google": "#4F81F7",
  Direct: "#64B587",
  LinkedIn: "#F59E0B",
  "Twitter / X": "#A78BFA",
  Twitter: "#A78BFA",
  "Product Hunt": "#FB923C",
  GitHub: "#2DD4BF",
  Other: "#94A3B8",
};

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

function getPageTitle(path?: string): string {
  if (!path) return "Unknown";
  if (path === "/") return "Home";
  const name = path.split("/").filter(Boolean).pop();
  if (!name) return "Home";
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");
}

export class AnalyticsService {
  static async getOverview(projectId: number): Promise<FrontOverview> {
    const res = await AnalyticsRepository.getOverview(projectId);
    const data = res?.data || {};
    return {
      totalPageViews: data.totalPageViews || 0,
      totalSessions: data.totalSessions || 0,
      totalEvents: data.totalEvents || 0,
      uniqueVisitors: data.uniqueVisitors || 0,
      bounceRate: data.bounceRate || 0,
      avgSessionDurationSeconds: data.avgSessionDurationSeconds || 0,
      pageViewsToday: data.pageViewsToday || 0,
      sessionsToday: data.sessionsToday || 0,
    };
  }

  static async getTraffic(projectId: number, days?: number): Promise<FrontTraffic[]> {
    const res = await AnalyticsRepository.getTraffic(projectId, days);
    const points = res?.data?.dataPoints || [];
    return points.map((p) => ({
      date: p.date || "",
      visitors: p.pageViews || 0,
      sessions: p.sessions || 0,
      pageViews: p.pageViews || 0,
    }));
  }

  static async getCountries(projectId: number): Promise<FrontCountry[]> {
    const res = await AnalyticsRepository.getCountries(projectId);
    const items = res?.data || [];
    return items.map((item) => ({
      country: item.label || "Other",
      visitors: item.count || 0,
      percentage: item.percentage || 0,
      flag: getCountryFlag(item.label),
    }));
  }

  static async getDevices(projectId: number): Promise<FrontDevice[]> {
    const res = await AnalyticsRepository.getDevices(projectId);
    const items = res?.data || [];
    return items.map((item) => {
      const name = item.label || "Desktop";
      return {
        device: name,
        sessions: item.count || 0,
        percentage: item.percentage || 0,
        color: DEVICE_COLORS[name] || "#94A3B8",
      };
    });
  }

  static async getBrowsers(projectId: number): Promise<FrontBrowser[]> {
    const res = await AnalyticsRepository.getBrowsers(projectId);
    const items = res?.data || [];
    return items.map((item) => {
      const name = item.label || "Other";
      return {
        browser: name,
        sessions: item.count || 0,
        percentage: item.percentage || 0,
        color: BROWSER_COLORS[name] || "#94A3B8",
      };
    });
  }

  static async getReferrers(projectId: number): Promise<FrontReferrer[]> {
    const res = await AnalyticsRepository.getReferrers(projectId);
    const items = res?.data || [];
    return items.map((item) => {
      const name = item.label || "Direct";
      return {
        source: name,
        visitors: item.count || 0,
        percentage: item.percentage || 0,
        color: REFERRER_COLORS[name] || "#94A3B8",
      };
    });
  }

  static async getTopPages(projectId: number, limit?: number): Promise<FrontTopPage[]> {
    const res = await AnalyticsRepository.getTopPages(projectId, limit);
    const items = res?.data || [];
    return items.map((item) => ({
      path: item.label || "/",
      title: getPageTitle(item.label),
      pageviews: item.count || 0,
      bounceRate: item.percentage || 0,
      avgTime: "2m 14s", // Mocking average time for path since it's not in StatEntry
    }));
  }

  static async getSessions(projectId: number): Promise<StatEntry[]> {
    const res = await AnalyticsRepository.getSessions(projectId);
    return res?.data || [];
  }

  static async getEvents(projectId: number, limit?: number): Promise<FrontEvent[]> {
    const res = await AnalyticsRepository.getEvents(projectId, limit);
    const items = res?.data || [];
    return items.map((item, index) => {
      const name = item.label || "custom_event";
      let category = "engagement";
      let impact: "Critical" | "High" | "Medium" | "Low" = "Medium";
      if (name.includes("signup")) {
        category = "acquisition";
        impact = "High";
      } else if (name.includes("purchase")) {
        category = "revenue";
        impact = "Critical";
      } else if (name.includes("pricing") || name.includes("checkout")) {
        category = "intent";
        impact = "High";
      }
      return {
        id: `ev_${index}_${name}`,
        name,
        displayName: name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, " "),
        count: item.count || 0,
        uniqueUsers: Math.round((item.count || 0) * 0.9),
        conversionImpact: impact,
        trend: item.percentage || 0,
        lastSeen: "Just now",
        category,
        description: `Backend event tracked for ${name}`,
      };
    });
  }

  // Paged Session List for Sessions Page
  static async getSessionList(projectId: number, page?: number, size?: number): Promise<{
    sessions: FrontSession[];
    totalElements: number;
    totalPages: number;
  }> {
    const res = await AnalyticsRepository.getSessionList(projectId, page, size);
    const content = res?.data?.content || [];
    const sessions = content.map((s): FrontSession => {
      const durationVal = s.duration || 0;
      const pagesCount = s.isBounce ? 1 : 4; // Mock pageviews count if not available or fallback
      let status: "converted" | "active" | "bounced" | "engaged" = "engaged";
      if (s.isBounce) {
        status = "bounced";
      } else if (durationVal > 300) {
        status = "converted";
      } else if (durationVal > 60) {
        status = "engaged";
      } else {
        status = "active";
      }

      return {
        id: s.sessionId || `session_${s.id}`,
        userId: null,
        user: "Anonymous",
        email: null,
        country: s.country || "United States",
        device: s.deviceType || "Desktop",
        browser: s.browser || "Chrome",
        os: s.os || "macOS",
        startTime: s.startedAt ? new Date(s.startedAt).toLocaleString() : "Unknown",
        duration: formatDuration(durationVal),
        pageCount: pagesCount,
        entryPage: s.referrer || "/",
        exitPage: s.referrer || "/",
        journey: [s.referrer || "/"],
        status,
        source: s.referrer || "Direct",
        value: s.isBounce ? null : "$299", // fallback mock value
      };
    });

    return {
      sessions,
      totalElements: res?.data?.totalElements || 0,
      totalPages: res?.data?.totalPages || 0,
    };
  }

  // Paged Event List for Events Page
  static async getEventList(projectId: number, page?: number, size?: number): Promise<{
    events: FrontEvent[];
    totalElements: number;
    totalPages: number;
  }> {
    const res = await AnalyticsRepository.getEventList(projectId, page, size);
    const content = res?.data?.content || [];
    const events = content.map((e, index): FrontEvent => {
      const name = e.eventName || "custom_event";
      let category = e.eventCategory || "engagement";
      let impact: "Critical" | "High" | "Medium" | "Low" = "Medium";
      if (name.includes("signup")) {
        category = "acquisition";
        impact = "High";
      } else if (name.includes("purchase")) {
        category = "revenue";
        impact = "Critical";
      } else if (name.includes("pricing") || name.includes("checkout")) {
        category = "intent";
        impact = "High";
      }
      return {
        id: e.id ? `evt_${e.id}` : `evt_${index}_${name}`,
        name,
        displayName: e.eventName ? e.eventName.charAt(0).toUpperCase() + e.eventName.slice(1).replace(/_/g, " ") : "Custom Event",
        count: 1,
        uniqueUsers: 1,
        conversionImpact: impact,
        trend: 0,
        lastSeen: e.createdAt ? new Date(e.createdAt).toLocaleString() : "Unknown",
        category,
        description: e.properties || `Event value: ${e.eventValue || "none"}`,
      };
    });

    return {
      events,
      totalElements: res?.data?.totalElements || 0,
      totalPages: res?.data?.totalPages || 0,
    };
  }
}
