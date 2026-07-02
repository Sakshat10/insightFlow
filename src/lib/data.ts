// InsightFlow — Realistic dummy data layer
// All data represents acme.com (B2B SaaS product)

export const currentProject = {
  id: "proj_acme_001",
  name: "Acme Corporation",
  domain: "acme.com",
  industry: "B2B SaaS",
  plan: "Growth",
  created: "2024-01-15",
  timezone: "America/New_York",
  trackingId: "if_live_pk_acm39xd82kl",
};

// ─────────────────────────────────────────────
// KPI OVERVIEW
// ─────────────────────────────────────────────
export const kpiData = {
  totalVisitors: { value: 12481, change: 8.4, direction: "up" as const },
  uniqueVisitors: { value: 9847, change: 5.2, direction: "up" as const },
  sessions: { value: 18293, change: 12.1, direction: "up" as const },
  bounceRate: { value: 31.2, change: -3.4, direction: "down" as const },
  conversionRate: { value: 4.8, change: 0.6, direction: "up" as const },
  avgSessionDuration: { value: "3m 42s", change: 11.3, direction: "up" as const },
  pageviews: { value: 61204, change: 14.7, direction: "up" as const },
  newVisitors: { value: 7304, change: 9.1, direction: "up" as const },
};

// ─────────────────────────────────────────────
// TIME SERIES — Last 30 days
// ─────────────────────────────────────────────
export const visitorsOverTime = [
  { date: "May 10", visitors: 380, sessions: 541, conversions: 18 },
  { date: "May 11", visitors: 342, sessions: 490, conversions: 15 },
  { date: "May 12", visitors: 298, sessions: 401, conversions: 11 },
  { date: "May 13", visitors: 314, sessions: 431, conversions: 14 },
  { date: "May 14", visitors: 402, sessions: 567, conversions: 22 },
  { date: "May 15", visitors: 451, sessions: 623, conversions: 26 },
  { date: "May 16", visitors: 436, sessions: 604, conversions: 21 },
  { date: "May 17", visitors: 378, sessions: 528, conversions: 19 },
  { date: "May 18", visitors: 345, sessions: 482, conversions: 16 },
  { date: "May 19", visitors: 289, sessions: 398, conversions: 12 },
  { date: "May 20", visitors: 301, sessions: 415, conversions: 13 },
  { date: "May 21", visitors: 421, sessions: 589, conversions: 24 },
  { date: "May 22", visitors: 468, sessions: 641, conversions: 28 },
  { date: "May 23", visitors: 494, sessions: 672, conversions: 31 },
  { date: "May 24", visitors: 478, sessions: 658, conversions: 27 },
  { date: "May 25", visitors: 412, sessions: 571, conversions: 23 },
  { date: "May 26", visitors: 356, sessions: 490, conversions: 18 },
  { date: "May 27", visitors: 321, sessions: 441, conversions: 15 },
  { date: "May 28", visitors: 388, sessions: 537, conversions: 21 },
  { date: "May 29", visitors: 445, sessions: 614, conversions: 27 },
  { date: "May 30", visitors: 501, sessions: 689, conversions: 33 },
  { date: "May 31", visitors: 523, sessions: 718, conversions: 35 },
  { date: "Jun 1", visitors: 498, sessions: 683, conversions: 30 },
  { date: "Jun 2", visitors: 467, sessions: 641, conversions: 27 },
  { date: "Jun 3", visitors: 412, sessions: 565, conversions: 23 },
  { date: "Jun 4", visitors: 388, sessions: 528, conversions: 20 },
  { date: "Jun 5", visitors: 441, sessions: 608, conversions: 26 },
  { date: "Jun 6", visitors: 482, sessions: 658, conversions: 30 },
  { date: "Jun 7", visitors: 521, sessions: 714, conversions: 34 },
  { date: "Jun 8", visitors: 478, sessions: 651, conversions: 28 },
];

// ─────────────────────────────────────────────
// TOP PAGES
// ─────────────────────────────────────────────
export const topPages = [
  { path: "/", title: "Home", pageviews: 18420, uniqueViews: 13804, bounceRate: 28.4, avgTime: "2m 14s", exitRate: 22.1 },
  { path: "/pricing", title: "Pricing", pageviews: 9841, uniqueViews: 8302, bounceRate: 21.7, avgTime: "3m 52s", exitRate: 31.4 },
  { path: "/features", title: "Features", pageviews: 7234, uniqueViews: 6108, bounceRate: 34.2, avgTime: "2m 38s", exitRate: 28.7 },
  { path: "/blog/product-analytics", title: "Product Analytics Guide", pageviews: 5102, uniqueViews: 4781, bounceRate: 42.1, avgTime: "5m 18s", exitRate: 48.3 },
  { path: "/docs/getting-started", title: "Getting Started", pageviews: 4208, uniqueViews: 3967, bounceRate: 18.3, avgTime: "4m 42s", exitRate: 19.8 },
  { path: "/signup", title: "Sign Up", pageviews: 3847, uniqueViews: 3612, bounceRate: 12.4, avgTime: "1m 28s", exitRate: 5.2 },
  { path: "/blog/conversion-optimization", title: "Conversion Optimization Tips", pageviews: 2914, uniqueViews: 2740, bounceRate: 39.8, avgTime: "4m 11s", exitRate: 44.6 },
  { path: "/integrations", title: "Integrations", pageviews: 2401, uniqueViews: 2198, bounceRate: 31.5, avgTime: "2m 55s", exitRate: 27.9 },
];

// ─────────────────────────────────────────────
// TRAFFIC SOURCES
// ─────────────────────────────────────────────
export const trafficSources = [
  { source: "Google Search", visitors: 5241, percentage: 42.0, sessions: 7204, bounceRate: 28.4, color: "#4F81F7" },
  { source: "Direct", visitors: 2847, percentage: 22.8, sessions: 3841, bounceRate: 24.1, color: "#64B587" },
  { source: "LinkedIn", visitors: 1402, percentage: 11.2, sessions: 1847, bounceRate: 33.2, color: "#F59E0B" },
  { source: "Twitter / X", visitors: 981, percentage: 7.9, sessions: 1284, bounceRate: 41.8, color: "#A78BFA" },
  { source: "Product Hunt", visitors: 744, percentage: 6.0, sessions: 892, bounceRate: 37.4, color: "#FB923C" },
  { source: "GitHub", visitors: 521, percentage: 4.2, sessions: 634, bounceRate: 22.9, color: "#2DD4BF" },
  { source: "Other Referrals", visitors: 745, percentage: 5.9, sessions: 897, bounceRate: 38.1, color: "#94A3B8" },
];

// ─────────────────────────────────────────────
// ACTIVITY FEED
// ─────────────────────────────────────────────
export const activityFeed = [
  {
    id: "evt_001",
    type: "purchase",
    user: "Marcus Chen",
    email: "m.chen@novacorp.io",
    description: "Completed purchase — Growth Plan ($299/mo)",
    timestamp: "2 minutes ago",
    value: "$299",
    metadata: { plan: "Growth", billing: "monthly" },
  },
  {
    id: "evt_002",
    type: "signup",
    user: "Sarah Kowalski",
    email: "sarah@buildfast.dev",
    description: "New account created",
    timestamp: "8 minutes ago",
    value: null,
    metadata: { source: "Google" },
  },
  {
    id: "evt_003",
    type: "custom",
    user: "Anonymous",
    email: null,
    description: "checkout_started — 14 items in cart",
    timestamp: "14 minutes ago",
    value: "$847",
    metadata: { items: 14 },
  },
  {
    id: "evt_004",
    type: "signup",
    user: "David Okonkwo",
    email: "d.okonkwo@scale.ai",
    description: "New account created",
    timestamp: "22 minutes ago",
    value: null,
    metadata: { source: "LinkedIn" },
  },
  {
    id: "evt_005",
    type: "custom",
    user: "Priya Anand",
    email: "priya@loopanalytics.com",
    description: "download_pdf — Enterprise Security Whitepaper",
    timestamp: "31 minutes ago",
    value: null,
    metadata: { doc: "security-whitepaper-v3.pdf" },
  },
  {
    id: "evt_006",
    type: "purchase",
    user: "James Fitzgerald",
    email: "jfitz@momentum.co",
    description: "Completed purchase — Starter Plan ($79/mo)",
    timestamp: "45 minutes ago",
    value: "$79",
    metadata: { plan: "Starter", billing: "monthly" },
  },
  {
    id: "evt_007",
    type: "custom",
    user: "Anonymous",
    email: null,
    description: "contact_form_submit — Demo request",
    timestamp: "1 hour ago",
    value: null,
    metadata: { form: "demo-request" },
  },
  {
    id: "evt_008",
    type: "signup",
    user: "Elena Volkov",
    email: "e.volkov@metric.studio",
    description: "New account created",
    timestamp: "1 hour ago",
    value: null,
    metadata: { source: "Direct" },
  },
];

// ─────────────────────────────────────────────
// ANALYTICS — GEO
// ─────────────────────────────────────────────
export const geoData = [
  { country: "United States", visitors: 5241, percentage: 42.0, flag: "🇺🇸" },
  { country: "United Kingdom", visitors: 1248, percentage: 10.0, flag: "🇬🇧" },
  { country: "Germany", visitors: 987, percentage: 7.9, flag: "🇩🇪" },
  { country: "Canada", visitors: 844, percentage: 6.8, flag: "🇨🇦" },
  { country: "France", visitors: 712, percentage: 5.7, flag: "🇫🇷" },
  { country: "Netherlands", visitors: 634, percentage: 5.1, flag: "🇳🇱" },
  { country: "Australia", visitors: 521, percentage: 4.2, flag: "🇦🇺" },
  { country: "Sweden", visitors: 398, percentage: 3.2, flag: "🇸🇪" },
  { country: "Singapore", visitors: 342, percentage: 2.7, flag: "🇸🇬" },
  { country: "Other", visitors: 1554, percentage: 12.4, flag: "🌍" },
];

// ─────────────────────────────────────────────
// ANALYTICS — DEVICES
// ─────────────────────────────────────────────
export const deviceData = [
  { device: "Desktop", sessions: 12841, percentage: 70.2, color: "#4F81F7" },
  { device: "Mobile", sessions: 4521, percentage: 24.7, color: "#64B587" },
  { device: "Tablet", sessions: 931, percentage: 5.1, color: "#F59E0B" },
];

export const browserData = [
  { browser: "Chrome", sessions: 10241, percentage: 56.0, color: "#4F81F7" },
  { browser: "Safari", sessions: 4847, percentage: 26.5, color: "#A78BFA" },
  { browser: "Firefox", sessions: 1834, percentage: 10.0, color: "#FB923C" },
  { browser: "Edge", sessions: 1021, percentage: 5.6, color: "#2DD4BF" },
  { browser: "Other", sessions: 350, percentage: 1.9, color: "#94A3B8" },
];

export const osData = [
  { os: "macOS", sessions: 7841, percentage: 42.9, color: "#4F81F7" },
  { os: "Windows", sessions: 5124, percentage: 28.0, color: "#64B587" },
  { os: "iOS", sessions: 2847, percentage: 15.6, color: "#F59E0B" },
  { os: "Android", sessions: 1634, percentage: 8.9, color: "#A78BFA" },
  { os: "Linux", sessions: 847, percentage: 4.6, color: "#2DD4BF" },
];

// ─────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────
export const eventsData = [
  {
    id: "ev_001",
    name: "signup",
    displayName: "User Signup",
    count: 2847,
    uniqueUsers: 2847,
    conversionImpact: "High",
    trend: 14.2,
    lastSeen: "2 min ago",
    category: "acquisition",
    description: "User completed registration flow",
  },
  {
    id: "ev_002",
    name: "purchase",
    displayName: "Purchase Completed",
    count: 1204,
    uniqueUsers: 1156,
    conversionImpact: "Critical",
    trend: 8.7,
    lastSeen: "3 min ago",
    category: "revenue",
    description: "Payment successfully processed",
  },
  {
    id: "ev_003",
    name: "checkout_started",
    displayName: "Checkout Started",
    count: 3241,
    uniqueUsers: 2904,
    conversionImpact: "High",
    trend: 5.4,
    lastSeen: "1 min ago",
    category: "revenue",
    description: "User entered checkout flow",
  },
  {
    id: "ev_004",
    name: "download_pdf",
    displayName: "PDF Download",
    count: 892,
    uniqueUsers: 781,
    conversionImpact: "Medium",
    trend: -2.1,
    lastSeen: "12 min ago",
    category: "engagement",
    description: "Asset downloaded from content library",
  },
  {
    id: "ev_005",
    name: "contact_form_submit",
    displayName: "Contact Form Submit",
    count: 641,
    uniqueUsers: 628,
    conversionImpact: "High",
    trend: 22.4,
    lastSeen: "8 min ago",
    category: "acquisition",
    description: "Inbound lead form submitted",
  },
  {
    id: "ev_006",
    name: "feature_clicked",
    displayName: "Feature Clicked",
    count: 8421,
    uniqueUsers: 4201,
    conversionImpact: "Medium",
    trend: 3.8,
    lastSeen: "< 1 min",
    category: "engagement",
    description: "User interacted with product feature",
  },
  {
    id: "ev_007",
    name: "pricing_page_view",
    displayName: "Pricing Page View",
    count: 9841,
    uniqueUsers: 8302,
    conversionImpact: "High",
    trend: 11.3,
    lastSeen: "< 1 min",
    category: "intent",
    description: "Visitor viewed pricing page",
  },
  {
    id: "ev_008",
    name: "trial_activated",
    displayName: "Trial Activated",
    count: 421,
    uniqueUsers: 421,
    conversionImpact: "Critical",
    trend: 18.9,
    lastSeen: "18 min ago",
    category: "acquisition",
    description: "Free trial started by new user",
  },
];

export const eventTimeline = [
  { date: "Jun 2", signup: 94, purchase: 41, checkout_started: 128, contact_form: 22 },
  { date: "Jun 3", signup: 87, purchase: 38, checkout_started: 114, contact_form: 19 },
  { date: "Jun 4", signup: 76, purchase: 31, checkout_started: 98, contact_form: 16 },
  { date: "Jun 5", signup: 101, purchase: 44, checkout_started: 141, contact_form: 24 },
  { date: "Jun 6", signup: 118, purchase: 52, checkout_started: 162, contact_form: 28 },
  { date: "Jun 7", signup: 134, purchase: 58, checkout_started: 178, contact_form: 31 },
  { date: "Jun 8", signup: 122, purchase: 51, checkout_started: 164, contact_form: 27 },
];

// ─────────────────────────────────────────────
// SESSIONS
// ─────────────────────────────────────────────
export const sessionsData = [
  {
    id: "ses_8a4d21",
    userId: "usr_mc841",
    user: "Marcus Chen",
    email: "m.chen@novacorp.io",
    country: "United States",
    device: "Desktop",
    browser: "Chrome 124",
    os: "macOS",
    startTime: "Jun 8, 2:41 PM",
    duration: "8m 22s",
    pageCount: 7,
    entryPage: "/blog/product-analytics",
    exitPage: "/signup",
    journey: ["/blog/product-analytics", "/features", "/pricing", "/signup"],
    status: "converted",
    source: "Google",
    value: "$299",
  },
  {
    id: "ses_9b2e34",
    userId: "usr_sk992",
    user: "Sarah Kowalski",
    email: "sarah@buildfast.dev",
    country: "United Kingdom",
    device: "Desktop",
    browser: "Safari 17",
    os: "macOS",
    startTime: "Jun 8, 2:33 PM",
    duration: "4m 11s",
    pageCount: 4,
    entryPage: "/",
    exitPage: "/pricing",
    journey: ["/", "/features", "/pricing", "/pricing#growth"],
    status: "active",
    source: "LinkedIn",
    value: null,
  },
  {
    id: "ses_7c3f12",
    userId: null,
    user: "Anonymous",
    email: null,
    country: "Germany",
    device: "Mobile",
    browser: "Chrome 124",
    os: "Android",
    startTime: "Jun 8, 2:28 PM",
    duration: "1m 48s",
    pageCount: 2,
    entryPage: "/",
    exitPage: "/",
    journey: ["/", "/pricing"],
    status: "bounced",
    source: "Twitter",
    value: null,
  },
  {
    id: "ses_2d5a67",
    userId: "usr_do441",
    user: "David Okonkwo",
    email: "d.okonkwo@scale.ai",
    country: "United States",
    device: "Desktop",
    browser: "Firefox 125",
    os: "Windows",
    startTime: "Jun 8, 2:06 PM",
    duration: "12m 04s",
    pageCount: 11,
    entryPage: "/docs/getting-started",
    exitPage: "/docs/api-reference",
    journey: ["/docs/getting-started", "/docs/installation", "/docs/events", "/docs/api-reference"],
    status: "engaged",
    source: "Direct",
    value: null,
  },
  {
    id: "ses_5e8b23",
    userId: "usr_pa218",
    user: "Priya Anand",
    email: "priya@loopanalytics.com",
    country: "Canada",
    device: "Desktop",
    browser: "Chrome 124",
    os: "Windows",
    startTime: "Jun 8, 1:54 PM",
    duration: "6m 38s",
    pageCount: 6,
    entryPage: "/",
    exitPage: "/integrations",
    journey: ["/", "/features", "/integrations", "/pricing", "/signup", "/integrations"],
    status: "engaged",
    source: "Google",
    value: null,
  },
  {
    id: "ses_3f9c45",
    userId: "usr_jf731",
    user: "James Fitzgerald",
    email: "jfitz@momentum.co",
    country: "Australia",
    device: "Tablet",
    browser: "Safari 17",
    os: "iOS",
    startTime: "Jun 8, 1:45 PM",
    duration: "5m 12s",
    pageCount: 5,
    entryPage: "/pricing",
    exitPage: "/signup",
    journey: ["/pricing", "/features", "/pricing#starter", "/signup", "/onboarding"],
    status: "converted",
    source: "Product Hunt",
    value: "$79",
  },
];

// ─────────────────────────────────────────────
// FUNNELS
// ─────────────────────────────────────────────
export const funnelData = [
  {
    step: 1,
    name: "Landing Page Visit",
    page: "/",
    users: 12481,
    percentage: 100,
    dropoff: 0,
    dropoffRate: 0,
    avgTime: "1m 48s",
  },
  {
    step: 2,
    name: "Pricing Page",
    page: "/pricing",
    users: 5841,
    percentage: 46.8,
    dropoff: 6640,
    dropoffRate: 53.2,
    avgTime: "3m 52s",
  },
  {
    step: 3,
    name: "Signup Page",
    page: "/signup",
    users: 2947,
    percentage: 23.6,
    dropoff: 2894,
    dropoffRate: 49.5,
    avgTime: "1m 28s",
  },
  {
    step: 4,
    name: "Trial Activation",
    page: "/onboarding",
    users: 1284,
    percentage: 10.3,
    dropoff: 1663,
    dropoffRate: 56.4,
    avgTime: "4m 11s",
  },
  {
    step: 5,
    name: "First Purchase",
    page: "/checkout",
    users: 421,
    percentage: 3.4,
    dropoff: 863,
    dropoffRate: 67.2,
    avgTime: "2m 04s",
  },
];

export const funnelTrend = [
  { week: "Week 1", conversion: 2.8 },
  { week: "Week 2", conversion: 3.1 },
  { week: "Week 3", conversion: 3.4 },
  { week: "Week 4", conversion: 3.2 },
  { week: "Week 5", conversion: 3.7 },
  { week: "Week 6", conversion: 4.0 },
  { week: "Week 7", conversion: 3.9 },
  { week: "Week 8", conversion: 4.4 },
];

// ─────────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────────
export const reportsData = [
  {
    id: "rep_001",
    name: "Weekly Performance Summary",
    type: "weekly",
    period: "Jun 2 – Jun 8, 2025",
    createdAt: "Jun 8, 2025",
    status: "ready",
    metrics: { visitors: 3284, conversions: 142, revenue: "$28,450", bounceRate: "30.8%" },
    recipients: 4,
    schedule: "Every Monday",
  },
  {
    id: "rep_002",
    name: "Monthly Growth Report",
    type: "monthly",
    period: "May 2025",
    createdAt: "Jun 1, 2025",
    status: "ready",
    metrics: { visitors: 12481, conversions: 601, revenue: "$118,290", bounceRate: "31.2%" },
    recipients: 8,
    schedule: "1st of month",
  },
  {
    id: "rep_003",
    name: "Daily Digest — Jun 8",
    type: "daily",
    period: "Jun 8, 2025",
    createdAt: "Jun 8, 2025",
    status: "ready",
    metrics: { visitors: 478, conversions: 28, revenue: "$5,432", bounceRate: "29.4%" },
    recipients: 3,
    schedule: "Daily 8:00 AM",
  },
  {
    id: "rep_004",
    name: "Daily Digest — Jun 7",
    type: "daily",
    period: "Jun 7, 2025",
    createdAt: "Jun 7, 2025",
    status: "ready",
    metrics: { visitors: 521, conversions: 34, revenue: "$6,241", bounceRate: "28.1%" },
    recipients: 3,
    schedule: "Daily 8:00 AM",
  },
  {
    id: "rep_005",
    name: "Q2 2025 Quarterly Analysis",
    type: "monthly",
    period: "Apr – Jun 2025",
    createdAt: "Jun 5, 2025",
    status: "generating",
    metrics: { visitors: 38241, conversions: 1847, revenue: "$362,180", bounceRate: "32.1%" },
    recipients: 12,
    schedule: "Quarterly",
  },
  {
    id: "rep_006",
    name: "Weekly Performance Summary",
    type: "weekly",
    period: "May 26 – Jun 1, 2025",
    createdAt: "Jun 2, 2025",
    status: "ready",
    metrics: { visitors: 2941, conversions: 128, revenue: "$24,880", bounceRate: "32.4%" },
    recipients: 4,
    schedule: "Every Monday",
  },
];

// ─────────────────────────────────────────────
// API KEYS
// ─────────────────────────────────────────────
export const apiKeysData = [
  {
    id: "key_001",
    name: "Acme Production",
    project: "acme.com",
    environment: "production",
    key: "if_live_pk_acm39xd82kl",
    status: "active",
    lastUsed: "2 minutes ago",
    requestsToday: 84201,
    created: "Jan 15, 2025",
    permissions: ["track", "identify", "alias"],
  },
  {
    id: "key_002",
    name: "Acme Staging",
    project: "staging.acme.com",
    environment: "staging",
    key: "if_test_pk_stg72kxm41p",
    status: "active",
    lastUsed: "1 hour ago",
    requestsToday: 1204,
    created: "Jan 15, 2025",
    permissions: ["track", "identify"],
  },
  {
    id: "key_003",
    name: "Mobile App",
    project: "acme.com (iOS/Android)",
    environment: "production",
    key: "if_live_pk_mob88nzj29q",
    status: "active",
    lastUsed: "4 minutes ago",
    requestsToday: 24108,
    created: "Mar 2, 2025",
    permissions: ["track", "identify", "alias"],
  },
  {
    id: "key_004",
    name: "Legacy API Key",
    project: "old.acme.com",
    environment: "production",
    key: "if_live_pk_old12abc99x",
    status: "revoked",
    lastUsed: "42 days ago",
    requestsToday: 0,
    created: "Aug 10, 2024",
    permissions: ["track"],
  },
];


// ─────────────────────────────────────────────
// TEAM MEMBERS (Settings)
// ─────────────────────────────────────────────
export const teamMembers = [
  {
    id: "usr_001",
    name: "Marcus Chen",
    email: "m.chen@acme.com",
    role: "Owner",
    avatar: "MC",
    status: "active",
    lastActive: "Now",
    joinedAt: "Jan 15, 2025",
  },
  {
    id: "usr_002",
    name: "Priya Anand",
    email: "priya@acme.com",
    role: "Admin",
    avatar: "PA",
    status: "active",
    lastActive: "1 hour ago",
    joinedAt: "Feb 1, 2025",
  },
  {
    id: "usr_003",
    name: "James Fitzgerald",
    email: "james@acme.com",
    role: "Analyst",
    avatar: "JF",
    status: "active",
    lastActive: "3 hours ago",
    joinedAt: "Mar 12, 2025",
  },
  {
    id: "usr_004",
    name: "Elena Volkov",
    email: "elena@acme.com",
    role: "Viewer",
    avatar: "EV",
    status: "invited",
    lastActive: "Never",
    joinedAt: "Jun 5, 2025",
  },
];
