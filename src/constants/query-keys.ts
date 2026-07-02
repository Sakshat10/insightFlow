export const queryKeys = {
  auth: {
    session: ["auth", "session"] as const,
    currentUser: ["auth", "me"] as const,
  },
  dashboard: {
    metrics: (range: string) => ["dashboard", "metrics", range] as const,
  },
  projects: {
    all: ["projects", "list"] as const,
    detail: (id: string) => ["projects", "detail", id] as const,
  },
  analytics: {
    overview: (range: string) => ["analytics", "overview", range] as const,
    pages: (range: string) => ["analytics", "pages", range] as const,
    sources: (range: string) => ["analytics", "sources", range] as const,
  },
  events: {
    all: ["events", "list"] as const,
    stream: ["events", "stream"] as const,
  },
  sessions: {
    all: ["sessions", "list"] as const,
    detail: (id: string) => ["sessions", "detail", id] as const,
  },
  funnels: {
    all: ["funnels", "list"] as const,
    detail: (id: string) => ["funnels", "detail", id] as const,
  },
  reports: {
    all: ["reports", "list"] as const,
  },
  apiKeys: {
    all: ["api-keys", "list"] as const,
  },
  settings: {
    profile: ["settings", "profile"] as const,
    org: ["settings", "org"] as const,
  },
} as const;

export const PROJECT_QUERY_KEYS = {
  all: ["projects"] as const,
  lists: () => [...PROJECT_QUERY_KEYS.all, "list"] as const,
  detail: (id: number) => [...PROJECT_QUERY_KEYS.all, id] as const,
  stats: () => [...PROJECT_QUERY_KEYS.all, "stats"] as const,
} as const;

export const ANALYTICS_QUERY_KEYS = {
  all: ["analytics"] as const,
  overview: (projectId: number) => [...ANALYTICS_QUERY_KEYS.all, "overview", projectId] as const,
  traffic: (projectId: number, days?: number) => [...ANALYTICS_QUERY_KEYS.all, "traffic", projectId, days] as const,
  countries: (projectId: number) => [...ANALYTICS_QUERY_KEYS.all, "countries", projectId] as const,
  devices: (projectId: number) => [...ANALYTICS_QUERY_KEYS.all, "devices", projectId] as const,
  browsers: (projectId: number) => [...ANALYTICS_QUERY_KEYS.all, "browsers", projectId] as const,
  referrers: (projectId: number) => [...ANALYTICS_QUERY_KEYS.all, "referrers", projectId] as const,
  topPages: (projectId: number, limit?: number) => [...ANALYTICS_QUERY_KEYS.all, "topPages", projectId, limit] as const,
  sessions: (projectId: number) => [...ANALYTICS_QUERY_KEYS.all, "sessions", projectId] as const,
  events: (projectId: number, limit?: number) => [...ANALYTICS_QUERY_KEYS.all, "events", projectId, limit] as const,
} as const;

export const EVENT_QUERY_KEYS = {
  all: ["events"] as const,
  lists: (params?: any) => [...EVENT_QUERY_KEYS.all, "list", params] as const,
  detail: (id: number) => [...EVENT_QUERY_KEYS.all, "detail", id] as const,
} as const;

export type QueryKeys = typeof queryKeys;
