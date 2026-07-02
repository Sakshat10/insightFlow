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
import { eventTimeline } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Plus,
  Zap,
} from "lucide-react";
import { useActiveProject } from "@/providers/ActiveProjectProvider";
import { useEvents, useEvent } from "@/features/events";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

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

interface TooltipEntry {
  dataKey?: string | number;
  name?: string;
  value?: number | string;
  color?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
        <p className="text-[11px] font-medium text-muted-foreground mb-1.5">{label}</p>
        {payload.map((entry) => (
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

const SkeletonRow = () => (
  <tr className="border-b border-border/50">
    <td className="px-4 py-3">
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-md bg-muted animate-pulse" />
        <div className="space-y-1">
          <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          <div className="h-3 w-20 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </td>
    <td className="px-4 py-3 text-right">
      <div className="h-4 w-12 bg-muted rounded ml-auto animate-pulse" />
    </td>
    <td className="px-4 py-3 text-right hidden md:table-cell">
      <div className="h-4 w-12 bg-muted rounded ml-auto animate-pulse" />
    </td>
    <td className="px-4 py-3 text-center hidden lg:table-cell">
      <div className="h-5 w-20 bg-muted rounded-full mx-auto animate-pulse" />
    </td>
    <td className="px-4 py-3 text-center hidden lg:table-cell">
      <div className="h-5 w-16 bg-muted rounded-full mx-auto animate-pulse" />
    </td>
    <td className="px-4 py-3 text-right hidden md:table-cell">
      <div className="h-4 w-16 bg-muted rounded ml-auto animate-pulse" />
    </td>
    <td className="px-4 py-3 text-right hidden xl:table-cell">
      <div className="h-4 w-24 bg-muted rounded ml-auto animate-pulse" />
    </td>
  </tr>
);

export default function EventsPage() {
  const { activeProjectId } = useActiveProject();
  
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("30d");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sortBy] = useState("createdAt");
  const [sortDir] = useState<"asc" | "desc">("desc");

  // Query events
  const {
    data: eventsDataResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useEvents({
    projectId: activeProjectId || 0,
    page,
    size,
    sortBy,
    sortDir,
  });

  // Query event details
  const {
    data: eventDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
    error: detailError,
    refetch: refetchDetail,
  } = useEvent(selectedEventId || 0);

  const eventsList = eventsDataResponse?.content || [];
  const totalElements = eventsDataResponse?.totalElements || 0;
  const totalPages = eventsDataResponse?.totalPages || 0;

  const filtered = eventsList.filter((e) => {
    const matchesSearch =
      !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.displayName.toLowerCase().includes(search.toLowerCase()) ||
      (e.properties && e.properties.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory =
      activeCategory === "all" || e.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalEvents = totalElements;
  const totalUnique = new Set(eventsList.map((e) => e.sessionId).filter(Boolean)).size;

  return (
    <AppLayout>
      <Header
        title="Events"
        description={`${totalElements} custom events tracked`}
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
              label="Unique Users (Page)"
              value={totalUnique}
              change={7.2}
              direction="up"
            />
            <KpiCard
              label="Tracked Events (Page)"
              value={eventsList.length}
              description="Events on current page"
            />
            <KpiCard
              label="Critical Events (Page)"
              value={eventsList.filter((e) => e.conversionImpact === "Critical").length}
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

          {/* Error View */}
          {isError && (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed border-red-200 rounded-lg bg-red-50/50">
              <p className="text-sm font-medium text-red-800">Failed to load events</p>
              <p className="text-xs text-red-600 mb-4">{error?.message || "Please check your network connection."}</p>
              <Button size="sm" onClick={() => refetch()} className="h-8">
                Retry
              </Button>
            </div>
          )}

          {/* Events Table */}
          {!isError && (
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
                  {isLoading ? (
                    [...Array(size)].map((_, idx) => <SkeletonRow key={idx} />)
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No events found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((event, i) => (
                      <tr
                        key={event.id}
                        onClick={() => setSelectedEventId(Number(event.id))}
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
                            ) : event.trend < 0 ? (
                              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                            )}
                            <span
                              className={`text-[12px] font-medium tabular-nums ${
                                event.trend > 0 ? "text-emerald-600" : event.trend < 0 ? "text-red-600" : "text-muted-foreground"
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
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {!isLoading && totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/10">
                  <div className="text-[12px] text-muted-foreground">
                    Showing <span className="font-medium">{(page * size) + 1}</span> to{" "}
                    <span className="font-medium">{Math.min((page + 1) * size, totalElements)}</span> of{" "}
                    <span className="font-medium">{totalElements}</span> events
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="h-8 text-[12px]"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                      className="h-8 text-[12px]"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      <Sheet open={selectedEventId !== null} onOpenChange={(open) => !open && setSelectedEventId(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Event Details</SheetTitle>
            <SheetDescription>
              Full properties and context for this event instance.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isDetailLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 w-3/4 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-14 bg-muted rounded-lg" />
                  ))}
                </div>
              </div>
            ) : isDetailError ? (
              <div className="flex flex-col items-center justify-center p-6 border border-dashed border-red-200 rounded-lg bg-red-50/50">
                <p className="text-sm font-medium text-red-800">Failed to load event details</p>
                <p className="text-xs text-red-600 mb-4">{detailError?.message || "An error occurred."}</p>
                <Button size="sm" onClick={() => refetchDetail()} className="h-8">
                  Retry
                </Button>
              </div>
            ) : eventDetail ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-[16px] font-semibold text-foreground">
                    {eventDetail.displayName}
                  </h2>
                  <p className="text-[12px] font-mono text-muted-foreground mt-0.5">
                    Event Name: {eventDetail.name}
                  </p>
                  {eventDetail.id && (
                    <p className="text-[11px] font-mono text-muted-foreground">
                      ID: {eventDetail.id}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Category", value: eventDetail.category },
                    { label: "Impact", value: eventDetail.conversionImpact },
                    { label: "Session ID", value: eventDetail.sessionId || "None" },
                    { label: "URL", value: eventDetail.url || "None" },
                    { label: "Country", value: eventDetail.country || "Unknown" },
                    { label: "Device Type", value: eventDetail.deviceType || "Unknown" },
                    { label: "Browser", value: eventDetail.browser || "Unknown" },
                    { label: "Tracked At", value: eventDetail.lastSeen },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-border bg-muted/20 px-3 py-2.5">
                      <p className="text-[11px] text-muted-foreground mb-0.5">{item.label}</p>
                      <p className="text-[13px] font-medium text-foreground break-all">{item.value}</p>
                    </div>
                  ))}
                </div>

                {eventDetail.properties && (
                  <CardSection title="Properties" description="Custom metadata attached to this event">
                    <pre className="text-[11px] font-mono bg-muted/30 border border-border rounded-md p-3 overflow-x-auto max-w-full whitespace-pre-wrap break-all">
                      {eventDetail.properties}
                    </pre>
                  </CardSection>
                )}
              </div>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>
    </AppLayout>
  );
}

