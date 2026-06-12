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
} from "recharts";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { CardSection } from "@/components/shared/section-header";
import { DateRangeSelector } from "@/components/shared/date-range-selector";
import { funnelData, funnelTrend } from "@/lib/data";
import { ChevronDown, Users, TrendingDown, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
        <p className="text-[11px] font-medium text-muted-foreground mb-1">{label}</p>
        <p className="text-[12px] font-semibold tabular-nums">
          {payload[0]?.value}% conversion
        </p>
      </div>
    );
  }
  return null;
};

export default function FunnelsPage() {
  const [dateRange, setDateRange] = useState("30d");

  const totalConversion = funnelData[funnelData.length - 1]?.percentage ?? 0;
  const topDropoff = funnelData.reduce((max, step) =>
    step.dropoffRate > max.dropoffRate ? step : max,
    funnelData[0]
  );

  return (
    <AppLayout>
      <Header
        title="Funnels"
        description="Conversion funnel analysis"
        actions={
          <DateRangeSelector value={dateRange} onChange={setDateRange} />
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              {
                label: "Funnel Entry",
                value: funnelData[0].users.toLocaleString(),
                sub: "Total visitors",
                color: "text-foreground",
              },
              {
                label: "Overall Conversion",
                value: `${totalConversion}%`,
                sub: "Landing → Purchase",
                color: "text-emerald-600",
              },
              {
                label: "Biggest Drop-off",
                value: `${topDropoff.dropoffRate}%`,
                sub: topDropoff.name,
                color: "text-red-600",
              },
              {
                label: "Converted Users",
                value: funnelData[funnelData.length - 1].users.toLocaleString(),
                sub: "First purchase",
                color: "text-foreground",
              },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-card px-4 py-3.5">
                <p className="text-[12px] font-medium text-muted-foreground mb-1">{stat.label}</p>
                <p className={cn("text-[22px] font-semibold tabular-nums leading-none", stat.color)}>
                  {stat.value}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Funnel Visualization */}
            <div className="lg:col-span-2">
              <CardSection
                title="Conversion Funnel"
                description={`${funnelData[0].name} → ${funnelData[funnelData.length - 1].name}`}
              >
                <div className="space-y-2 py-2">
                  {funnelData.map((step, i) => {
                    const isLast = i === funnelData.length - 1;
                    const barWidth = Math.max(step.percentage, 3);

                    return (
                      <div key={step.step}>
                        <div className="flex items-center gap-4 mb-1.5">
                          <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/5 text-[11px] font-bold text-primary">
                            {step.step}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[13px] font-medium text-foreground">
                                {step.name}
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-[12px] text-muted-foreground font-mono">
                                  {step.page}
                                </span>
                                <span className="text-[13px] font-semibold tabular-nums text-foreground">
                                  {step.users.toLocaleString()}
                                </span>
                                <span className="text-[12px] font-medium tabular-nums text-muted-foreground w-12 text-right">
                                  {step.percentage}%
                                </span>
                              </div>
                            </div>
                            <div className="h-7 w-full rounded-md bg-muted overflow-hidden relative">
                              <div
                                className="h-full rounded-md transition-all duration-700"
                                style={{
                                  width: `${barWidth}%`,
                                  background: i === 0
                                    ? "#4F81F7"
                                    : `hsl(${220 - i * 20}, ${70 - i * 5}%, ${55 + i * 5}%)`,
                                }}
                              />
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-white">
                                {step.users.toLocaleString()} users
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Drop-off indicator */}
                        {!isLast && step.dropoffRate > 0 && (
                          <div className="flex items-center gap-2 ml-10 my-1.5">
                            <ArrowDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                            <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-100 px-2.5 py-1">
                              <TrendingDown className="h-3 w-3 text-red-500" />
                              <span className="text-[11px] font-medium text-red-700">
                                {step.dropoff.toLocaleString()} users dropped off
                              </span>
                              <span className="text-[11px] text-red-500 font-semibold">
                                ({step.dropoffRate}% drop-off)
                              </span>
                            </div>
                            <span className="text-[11px] text-muted-foreground">
                              avg. {step.avgTime} on page
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardSection>
            </div>

            {/* Conversion Trend */}
            <CardSection
              title="Conversion Trend"
              description="Overall funnel conversion rate by week"
            >
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={funnelTrend} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="funnelGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F81F7" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#4F81F7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} />
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}%`}
                    domain={[0, 6]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="conversion"
                    stroke="#4F81F7"
                    strokeWidth={2}
                    fill="url(#funnelGrad)"
                    dot={{ r: 3, fill: "#4F81F7" }}
                    activeDot={{ r: 5, fill: "#4F81F7" }}
                  />
                </AreaChart>
              </ResponsiveContainer>

              {/* Step conversion rates */}
              <div className="mt-4 border-t border-border pt-4 space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Step Conversion Rates
                </p>
                {funnelData.slice(1).map((step, i) => {
                  const prev = funnelData[i];
                  const stepConv = prev.users > 0 ? ((step.users / prev.users) * 100).toFixed(1) : "0";
                  return (
                    <div key={step.step} className="flex items-center justify-between">
                      <span className="text-[12px] text-muted-foreground truncate max-w-[120px]">
                        {prev.name.split(" ")[0]} → {step.name.split(" ")[0]}
                      </span>
                      <span className="text-[12px] font-semibold tabular-nums">
                        {stepConv}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardSection>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
