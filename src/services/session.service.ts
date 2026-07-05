import { SessionRepository } from "@/repositories/session.repository";
import { components } from "@/generated/openapi";

type SessionResponse = components["schemas"]["SessionResponse"];

export interface FrontSession {
  id: string;
  dbId: number;
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

export interface PagedFrontSessions {
  content: FrontSession[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export class SessionService {
  static transformSession(s: SessionResponse): FrontSession {
    const durationVal = s.duration || 0;
    const pagesCount = s.isBounce ? 1 : 4; // fallback/mock pageviews count
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
      dbId: s.id || 0,
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
      value: s.isBounce ? null : "$299", // fallback/mock
    };
  }

  static async getSessions(params: {
    projectId: number;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: string;
  }): Promise<PagedFrontSessions> {
    const response = await SessionRepository.getSessions(params);
    const data = response?.data || {};
    const content = data.content || [];

    return {
      content: content.map((s) => this.transformSession(s)),
      page: data.page || 0,
      size: data.size || 10,
      totalElements: data.totalElements || 0,
      totalPages: data.totalPages || 0,
      first: data.first ?? true,
      last: data.last ?? true,
    };
  }

  static async getSessionById(id: number): Promise<FrontSession> {
    const response = await SessionRepository.getSessionById(id);
    const data = response?.data;
    if (!data) {
      throw new Error("Session not found");
    }
    return this.transformSession(data);
  }
}
