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
    pages: "/analytics/pages",
    sources: "/analytics/sources",
  },
  projects: {
    base: "/projects",
    detail: (id: string) => `/projects/${id}`,
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
    detail: (id: string) => `/funnels/${id}`,
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
