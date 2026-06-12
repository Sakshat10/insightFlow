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
import {
  visitorsOverTime,
  geoData,
  deviceData,
  browserData,
  osData,
  kpiData,
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <KpiCard
              label="Total Pageviews"
              value={kpiData.pageviews.value}
              change={kpiData.pageviews.change}
              direction={kpiData.pageviews.direction}
            />
            <KpiCard
              label="New Visitors"
              value={kpiData.newVisitors.value}
              change={kpiData.newVisitors.change}
              direction={kpiData.newVisitors.direction}
            />
            <KpiCard
              label="Avg. Session"
              value={kpiData.avgSessionDuration.value}
              change={kpiData.avgSessionDuration.change}
              direction={kpiData.avgSessionDuration.direction}
            />
            <KpiCard
              label="Bounce Rate"
              value={kpiData.bounceRate.value}
              change={kpiData.bounceRate.change}
              direction={kpiData.bounceRate.direction}
              suffix="%"
            />
          </div>

          {/* Visitor Trend */}
          <CardSection
            title="Visitor Trend"
            description="Unique visitors over time"
          >
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={visitorsOverTime} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
                  interval={4}
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
          </CardSection>

          {/* Geography + Devices */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CardSection title="Geographic Breakdown" description="Visitors by country">
              <div className="space-y-3">
                {geoData.map((country, i) => (
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
            </CardSection>

            <div className="space-y-4">
              {/* Device */}
              <CardSection title="Devices" description="Session breakdown by device type">
                <div className="flex items-center gap-4">
                  <div className="relative w-[110px] h-[110px] flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={32}
                          outerRadius={52}
                          dataKey="sessions"
                          labelLine={false}
                          label={renderCustomLabel}
                        >
                          {deviceData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {deviceData.map((d) => (
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
              </CardSection>

              {/* Browser */}
              <CardSection title="Browsers">
                <StatBars items={browserData.map((b) => ({ label: b.browser, value: b.sessions, color: b.color }))} />
              </CardSection>
            </div>
          </div>

          {/* OS */}
          <CardSection title="Operating Systems" description="Session distribution by OS">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {osData.map((os) => (
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
          </CardSection>
        </div>
      </div>
    </AppLayout>
  );
}
