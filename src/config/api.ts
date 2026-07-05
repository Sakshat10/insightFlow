import { env } from "./env";

export const apiConfig = {
  baseUrl: env.apiBaseUrl,
  isDev: env.isDev,
} as const;

export const apiEndpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    refreshToken: "/auth/refresh-token",
    me: "/auth/me",
  },
  dashboard: "/dashboard/metrics",
  analytics: {
    overview: "/analytics/overview",
    traffic: "/analytics/traffic",
    countries: "/analytics/countries",
    devices: "/analytics/devices",
    browsers: "/analytics/browsers",
    referrers: "/analytics/referrers",
    topPages: "/analytics/top-pages",
    sessions: "/analytics/sessions",
    events: "/analytics/events",
    eventTimeline: "/analytics/event-timeline",
    funnel: "/analytics/funnel",
  },
  projects: {
    base: "/projects",
    stats: "/projects/stats",
    detail: (id: string | number) => `/projects/${id}`,
  },
  events: {
    base: "/events",
    stream: "/events/stream",
  },
  sessions: {
    base: "/sessions",
    detail: (id: string) => `/sessions/${id}`,
  },
  funnels: {
    base: "/funnels",
    detail: (id: string | number) => `/funnels/${id}`,
  },
  reports: {
    base: "/reports",
  },
  apiKeys: {
    base: "/api-keys",
  },
  settings: {
    profile: "/settings/profile",
    organization: "/settings/org",
  },
} as const;

export type ApiEndpoints = typeof apiEndpoints;
