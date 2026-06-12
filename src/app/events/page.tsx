"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { CardSection } from "@/components/shared/section-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { DateRangeSelector } from "@/components/shared/date-range-selector";
import { StatusBadge } from "@/components/shared/status-badge";
import { eventsData, eventTimeline } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, TrendingDown, Plus, Zap, ArrowUpRight } from "lucide-react";

const categoryColors: Record<string, string> = {
  revenue: "bg-emerald-50 text-emerald-700 border-emerald-200",
  acquisition: "bg-blue-50 text-blue-700 border-blue-200",
  engagement: "bg-violet-50 text-violet-700 border-violet-200",
  intent: "bg-amber-50 text-amber-700 border-amber-200",
};

const impactColors: Record<string, string> = {
  Critical: "text-red-600 bg-red-50",
  High: "text-amber-600 bg-amber-50",
  Medium: "text-blue-600 bg-blue-50",
  Low: "text-gray-500 bg-gray-100",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
        <p className="text-[11px] font-medium text-muted-foreground mb-1.5">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2 text-[12px]">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground capitalize">{entry.dataKey}:</span>
            <span className="font-semibold tabular-nums">{entry.value?.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("30d");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = eventsData.filter((e) => {
    const matchesSearch =
      !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.displayName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || e.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalEvents = eventsData.reduce((a, e) => a + e.count, 0);
  const totalUnique = eventsData.reduce((a, e) => a + e.uniqueUsers, 0);

  return (
    <AppLayout>
      <Header
        title="Events"
        description={`${eventsData.length} custom events tracked`}
        actions={
          <div className="flex items-center gap-2">
            <DateRangeSelector value={dateRange} onChange={setDateRange} />
            <Button size="sm" className="h-8 gap-1.5 text-[12px]">
              <Plus className="h-3.5 w-3.5" />
              New Event
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <KpiCard
              label="Total Events"
              value={totalEvents}
              change={9.4}
              direction="up"
            />
            <KpiCard
              label="Unique Users"
              value={totalUnique}
              change={7.2}
              direction="up"
            />
            <KpiCard
              label="Tracked Events"
              value={eventsData.length}
              description="Custom event definitions"
            />
            <KpiCard
              label="Critical Events"
              value={eventsData.filter((e) => e.conversionImpact === "Critical").length}
              description="Revenue & acquisition"
            />
          </div>

          {/* Event Timeline Chart */}
          <CardSection
            title="Event Activity"
            description="Top events — daily volume"
          >
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={eventTimeline} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.6} vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="signup" fill="#4F81F7" stackId="a" maxBarSize={28} />
                <Bar dataKey="purchase" fill="#64B587" stackId="a" maxBarSize={28} />
                <Bar dataKey="checkout_started" fill="#F59E0B" stackId="a" maxBarSize={28} />
                <Bar dataKey="contact_form" fill="#A78BFA" stackId="a" radius={[3, 3, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2 border-t border-border pt-3">
              {[
                { label: "signup", color: "#4F81F7" },
                { label: "purchase", color: "#64B587" },
                { label: "checkout_started", color: "#F59E0B" },
                { label: "contact_form", color: "#A78BFA" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] text-muted-foreground font-mono">{item.label}</span>
                </div>
              ))}
            </div>
          </CardSection>

          {/* Filter row */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search events…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-[13px]"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {["all", "revenue", "acquisition", "engagement", "intent"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-3 py-1 text-[12px] font-medium transition-colors capitalize ${
                    activeCategory === cat
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Events Table */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Event
                  </th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Count
                  </th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                    Unique Users
                  </th>
                  <th className="px-4 py-2.5 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                    Category
                  </th>
                  <th className="px-4 py-2.5 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                    Impact
                  </th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                    Trend
                  </th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden xl:table-cell">
                    Last Seen
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((event, i) => (
                  <tr
                    key={event.id}
                    className={`border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer ${
                      i === filtered.length - 1 ? "border-0" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted flex-shrink-0">
                          <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-foreground">
                            {event.displayName}
                          </p>
                          <p className="text-[11px] font-mono text-muted-foreground">
                            {event.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-[13px] font-semibold tabular-nums text-foreground">
                        {event.count.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <span className="text-[13px] tabular-nums text-muted-foreground">
                        {event.uniqueUsers.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${
                          categoryColors[event.category] || "bg-muted text-muted-foreground"
                        }`}
                      >
                        {event.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          impactColors[event.conversionImpact] || "text-muted-foreground bg-muted"
                        }`}
                      >
                        {event.conversionImpact}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <div className="flex items-center justify-end gap-1">
                        {event.trend > 0 ? (
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                        )}
                        <span
                          className={`text-[12px] font-medium tabular-nums ${
                            event.trend > 0 ? "text-emerald-600" : "text-red-600"
                          }`}
                        >
                          {event.trend > 0 ? "+" : ""}
                          {event.trend}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right hidden xl:table-cell">
                      <span className="text-[12px] text-muted-foreground">{event.lastSeen}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
