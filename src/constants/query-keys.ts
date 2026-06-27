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

export type QueryKeys = typeof queryKeys;
