export const routes = {
  home: "/",
  dashboard: "/dashboard",
  analytics: "/analytics",
  projects: {
    list: "/projects",
    new: "/projects/new",
  },
  events: "/events",
  sessions: "/sessions",
  funnels: "/funnels",
  reports: "/reports",
  apiKeys: "/api-keys",
  settings: "/settings",
} as const;

export type AppRoutes = typeof routes;
