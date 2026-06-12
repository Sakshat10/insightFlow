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
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { KpiCard } from "@/components/shared/kpi-card";
import { CardSection } from "@/components/shared/section-header";
import { ActivityTimeline } from "@/components/shared/activity-timeline";
import { StatBars } from "@/components/shared/stat-bars";
import { DateRangeSelector } from "@/components/shared/date-range-selector";
import {
  kpiData,
  visitorsOverTime,
  topPages,
  trafficSources,
  activityFeed,
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, ExternalLink } from "lucide-react";
import Link from "next/link";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
        <p className="text-[11px] font-medium text-muted-foreground mb-1.5">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2 text-[12px]">
            <span
              className="h-2 w-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground capitalize">{entry.dataKey}:</span>
            <span className="font-semibold text-foreground tabular-nums">
              {entry.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("30d");

  // Show last N days
  const chartData =
    dateRange === "7d"
      ? visitorsOverTime.slice(-7)
      : dateRange === "90d"
      ? visitorsOverTime
      : visitorsOverTime.slice(-30);

  return (
    <AppLayout>
      <Header
        title="Dashboard"
        description="acme.com — Last 30 days"
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
          {/* KPI Grid */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            <KpiCard
              label="Total Visitors"
              value={kpiData.totalVisitors.value}
              change={kpiData.totalVisitors.change}
              direction={kpiData.totalVisitors.direction}
              description="vs. last period"
            />
            <KpiCard
              label="Unique Visitors"
              value={kpiData.uniqueVisitors.value}
              change={kpiData.uniqueVisitors.change}
              direction={kpiData.uniqueVisitors.direction}
              description="vs. last period"
            />
            <KpiCard
              label="Sessions"
              value={kpiData.sessions.value}
              change={kpiData.sessions.change}
              direction={kpiData.sessions.direction}
              description="vs. last period"
            />
            <KpiCard
              label="Bounce Rate"
              value={kpiData.bounceRate.value}
              change={kpiData.bounceRate.change}
              direction={kpiData.bounceRate.direction}
              suffix="%"
              description="vs. last period"
            />
            <KpiCard
              label="Conversion Rate"
              value={kpiData.conversionRate.value}
              change={kpiData.conversionRate.change}
              direction={kpiData.conversionRate.direction}
              suffix="%"
              description="vs. last period"
            />
          </div>

          {/* Main Chart */}
          <CardSection
            title="Visitors & Sessions"
            description="Daily trend for the selected period"
            actions={
              <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[12px] text-muted-foreground">
                <RefreshCw className="h-3 w-3" />
                Refresh
              </Button>
            }
          >
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F81F7" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#4F81F7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#64B587" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#64B587" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  interval={Math.floor(chartData.length / 6)}
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
                  fill="url(#visitorGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#4F81F7" }}
                />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="#64B587"
                  strokeWidth={2}
                  fill="url(#sessionGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#64B587" }}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2 border-t border-border pt-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span className="text-[11px] text-muted-foreground">Visitors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-muted-foreground">Sessions</span>
              </div>
            </div>
          </CardSection>

          {/* Conversion Chart + Traffic Sources */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CardSection
                title="Conversions"
                description="Daily completed goals"
              >
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData.slice(-14)} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} vertical={false} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                      interval={2}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="conversions"
                      fill="#4F81F7"
                      radius={[3, 3, 0, 0]}
                      maxBarSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardSection>
            </div>

            <CardSection
              title="Traffic Sources"
              actions={
                <Link href="/analytics" className="text-[11px] text-primary hover:underline flex items-center gap-1">
                  View all <ExternalLink className="h-3 w-3" />
                </Link>
              }
            >
              <StatBars
                items={trafficSources.map((s) => ({
                  label: s.source,
                  value: s.visitors,
                  color: s.color,
                  meta: `${s.percentage}%`,
                }))}
              />
            </CardSection>
          </div>

          {/* Top Pages + Activity */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CardSection
              title="Top Pages"
              actions={
                <Link href="/analytics" className="text-[11px] text-primary hover:underline flex items-center gap-1">
                  View all <ExternalLink className="h-3 w-3" />
                </Link>
              }
              noPadding
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Page
                    </th>
                    <th className="px-4 py-2 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Views
                    </th>
                    <th className="px-4 py-2 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                      Bounce
                    </th>
                    <th className="px-4 py-2 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                      Avg. Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.slice(0, 6).map((page, i) => (
                    <tr
                      key={page.path}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-2.5">
                        <div>
                          <p className="text-[13px] font-medium text-foreground">
                            {page.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono">
                            {page.path}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-right text-[13px] font-semibold tabular-nums text-foreground">
                        {page.pageviews.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 text-right text-[12px] tabular-nums text-muted-foreground hidden md:table-cell">
                        {page.bounceRate}%
                      </td>
                      <td className="px-4 py-2.5 text-right text-[12px] text-muted-foreground hidden md:table-cell">
                        {page.avgTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardSection>

            <CardSection
              title="Live Activity"
              description="Real-time event stream"
              noPadding
            >
              <ActivityTimeline items={activityFeed.slice(0, 6)} />
            </CardSection>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
