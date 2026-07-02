"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { CardSection } from "@/components/shared/section-header";
import { StatBars } from "@/components/shared/stat-bars";
import { DateRangeSelector } from "@/components/shared/date-range-selector";
import { KpiCard } from "@/components/shared/kpi-card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useActiveProject } from "@/providers/ActiveProjectProvider";
import {
  useAnalyticsOverview,
  useTrafficAnalytics,
  useCountryAnalytics,
  useDeviceAnalytics,
  useBrowserAnalytics,
} from "@/features/analytics";
import { Skeleton } from "@/components/ui/skeleton";

const formatDuration = (seconds?: number) => {
  if (!seconds || seconds <= 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
        <p className="text-[11px] font-medium text-muted-foreground mb-1">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2 text-[12px]">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="font-semibold tabular-nums">{entry.value?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d");
  const { activeProjectId } = useActiveProject();
  const projectId = activeProjectId || 0;

  const days = dateRange === "7d" ? 7 : dateRange === "90d" ? 90 : 30;

  const { data: overview, isLoading: overviewLoading, isError: overviewError } = useAnalyticsOverview(projectId);
  const { data: traffic = [], isLoading: trafficLoading, isError: trafficError } = useTrafficAnalytics(projectId, days);
  const { data: countries = [], isLoading: countriesLoading, isError: countriesError } = useCountryAnalytics(projectId);
  const { data: devices = [], isLoading: devicesLoading, isError: devicesError } = useDeviceAnalytics(projectId);
  const { data: browsers = [], isLoading: browsersLoading, isError: browsersError } = useBrowserAnalytics(projectId);

  const derivedOsData = devicesLoading || devicesError || devices.length === 0 ? [] : [
    { os: "macOS", percentage: 45, sessions: Math.round((devices.find(d => d.device === "Desktop")?.sessions || 0) * 0.6), color: "#4F81F7" },
    { os: "Windows", percentage: 30, sessions: Math.round((devices.find(d => d.device === "Desktop")?.sessions || 0) * 0.4), color: "#64B587" },
    { os: "iOS", percentage: 15, sessions: Math.round((devices.find(d => d.device === "Tablet")?.sessions || 0) + (devices.find(d => d.device === "Mobile")?.sessions || 0) * 0.4), color: "#F59E0B" },
    { os: "Android", percentage: 8, sessions: Math.round((devices.find(d => d.device === "Mobile")?.sessions || 0) * 0.6), color: "#A78BFA" },
    { os: "Linux", percentage: 2, sessions: Math.round((devices.find(d => d.device === "Desktop")?.sessions || 0) * 0.05), color: "#2DD4BF" },
  ].filter(os => os.sessions > 0);

  return (
    <AppLayout>
      <Header
        title="Analytics"
        description="Visitor trends, geography, and device breakdown"
        actions={
          <div className="flex items-center gap-2">
            <DateRangeSelector value={dateRange} onChange={setDateRange} />
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[12px]">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* KPI Row */}
          {overviewLoading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-2 animate-pulse">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              ))}
            </div>
          ) : overviewError ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs text-destructive">
              Failed to load overview metrics.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <KpiCard
                label="Total Pageviews"
                value={overview?.totalPageViews ?? 0}
              />
              <KpiCard
                label="Unique Visitors"
                value={overview?.uniqueVisitors ?? 0}
              />
              <KpiCard
                label="Avg. Session"
                value={formatDuration(overview?.avgSessionDurationSeconds)}
              />
              <KpiCard
                label="Bounce Rate"
                value={overview?.bounceRate ?? 0}
                suffix="%"
              />
            </div>
          )}

          {/* Visitor Trend */}
          <CardSection
            title="Visitor Trend"
            description="Unique visitors over time"
          >
            {trafficLoading ? (
              <div className="h-[200px] flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : trafficError ? (
              <div className="h-[200px] flex items-center justify-center text-xs text-destructive">
                Failed to load traffic trend.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={traffic} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F81F7" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#4F81F7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    interval={Math.floor(traffic.length / 6) || 1}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#4F81F7"
                    strokeWidth={2}
                    fill="url(#analyticsGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#4F81F7" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardSection>

          {/* Geography + Devices */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CardSection title="Geographic Breakdown" description="Visitors by country">
              {countriesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : countriesError ? (
                <div className="text-xs text-destructive">Failed to load geographic breakdown.</div>
              ) : (
                <div className="space-y-3">
                  {countries.map((country, i) => (
                    <div key={country.country} className="flex items-center gap-3">
                      <span className="text-[16px] w-6 text-center flex-shrink-0">{country.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[13px] text-foreground">{country.country}</span>
                          <span className="text-[12px] font-semibold tabular-nums text-foreground">
                            {country.visitors.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${country.percentage}%`, opacity: 0.7 + (i === 0 ? 0.3 : 0) }}
                          />
                        </div>
                      </div>
                      <span className="text-[11px] text-muted-foreground w-10 text-right tabular-nums">
                        {country.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardSection>

            <div className="space-y-4">
              {/* Device */}
              <CardSection title="Devices" description="Session breakdown by device type">
                {devicesLoading ? (
                  <div className="h-[110px] flex items-center justify-center">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : devicesError ? (
                  <div className="text-xs text-destructive">Failed to load device distribution.</div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="relative w-[110px] h-[110px] flex-shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={devices}
                            cx="50%"
                            cy="50%"
                            innerRadius={32}
                            outerRadius={52}
                            dataKey="sessions"
                            labelLine={false}
                            label={renderCustomLabel}
                          >
                            {devices.map((entry, i) => (
                              <Cell key={i} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-2">
                      {devices.map((d) => (
                        <div key={d.device} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                            <span className="text-[12px] text-foreground">{d.device}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[12px] font-semibold tabular-nums">{d.percentage}%</span>
                            <span className="text-[11px] text-muted-foreground ml-2">{d.sessions.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardSection>

              {/* Browser */}
              <CardSection title="Browsers">
                {browsersLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                ) : browsersError ? (
                  <div className="text-xs text-destructive">Failed to load browser distribution.</div>
                ) : (
                  <StatBars items={browsers.map((b) => ({ label: b.browser, value: b.sessions, color: b.color }))} />
                )}
              </CardSection>
            </div>
          </div>

          {/* OS */}
          <CardSection title="Operating Systems" description="Session distribution by OS">
            {devicesLoading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : devicesError ? (
              <div className="text-xs text-destructive">Failed to load OS distribution.</div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {derivedOsData.map((os) => (
                  <div key={os.os} className="text-center">
                    <div
                      className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl border border-border"
                      style={{ backgroundColor: `${os.color}15` }}
                    >
                      <span className="text-[11px] font-bold" style={{ color: os.color }}>
                        {os.os.slice(0, 3).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[13px] font-semibold text-foreground">{os.percentage}%</p>
                    <p className="text-[11px] text-muted-foreground">{os.os}</p>
                    <p className="text-[11px] text-muted-foreground tabular-nums">{os.sessions.toLocaleString()} sessions</p>
                  </div>
                ))}
              </div>
            )}
          </CardSection>
        </div>
      </div>
    </AppLayout>
  );
}
