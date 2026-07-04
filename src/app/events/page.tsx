"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { CardSection } from "@/components/shared/section-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Zap } from "lucide-react";
import { useActiveProject } from "@/providers/ActiveProjectProvider";
import { useEvents, useEvent, useEventTimeline } from "@/features/events";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  DateRangePicker,
  DateRangeSelection,
  formatApiDate,
  getPresetLabel,
  getPresetRange,
} from "@/components/shared/date-range-picker";

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

const PALETTE = [
  "#4F81F7", // blue
  "#64B587", // green
  "#F59E0B", // amber
  "#A78BFA", // violet
  "#FB923C", // orange
  "#2DD4BF", // teal
  "#F43F5E", // rose
  "#06B6D4", // cyan
  "#EC4899", // pink
  "#10B981", // emerald
];

function getEventColor(index: number): string {
  return PALETTE[index % PALETTE.length];
}

interface CustomTooltipEntry {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: CustomTooltipEntry[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, entry) => sum + (Number(entry.value) || 0), 0);
    
    return (
      <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-lg min-w-[200px]">
        <p className="text-[12px] font-semibold text-foreground mb-2">{label}</p>
        <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
          {payload.map((entry) => {
            const displayName = entry.name
              ? String(entry.name).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
              : "Unknown";
            return (
              <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-[12px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                  <span className="text-muted-foreground truncate max-w-[120px]">{displayName}</span>
                </div>
                <span className="font-semibold tabular-nums text-foreground">
                  {entry.value?.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-2.5 pt-2 border-t border-border flex items-center justify-between text-[12px] font-bold text-foreground">
          <span>Total Events</span>
          <span className="tabular-nums">{total.toLocaleString()}</span>
        </div>
      </div>
    );
  }
  return null;
};

const SkeletonChart = () => (
  <div className="flex flex-col items-center justify-center h-[180px] w-full bg-muted/5 border border-border rounded-lg relative overflow-hidden">
    <div className="absolute inset-0 flex items-end justify-between px-8 pb-4 gap-4 animate-pulse">
      <div className="h-16 w-8 bg-muted rounded-t" />
      <div className="h-24 w-8 bg-muted rounded-t" />
      <div className="h-32 w-8 bg-muted rounded-t" />
      <div className="h-12 w-8 bg-muted rounded-t" />
      <div className="h-28 w-8 bg-muted rounded-t" />
      <div className="h-20 w-8 bg-muted rounded-t" />
      <div className="h-36 w-8 bg-muted rounded-t" />
    </div>
    <div className="text-[12px] font-medium text-muted-foreground/60 z-10">Loading timeline activity...</div>
  </div>
);

const ErrorChart = ({ error, onRetry }: { error: Error | null; onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center h-[180px] bg-red-50/30 border border-dashed border-red-200 rounded-lg p-4">
    <span className="text-[13px] font-medium text-red-800">Failed to load Event Activity timeline</span>
    <span className="text-[11px] text-red-600/80 mt-1 mb-3">{error?.message || "Check your network connection"}</span>
    <Button size="sm" variant="outline" onClick={onRetry} className="h-8 text-red-800 border-red-200 hover:bg-red-50">
      Retry
    </Button>
  </div>
);

const EmptyChart = () => (
  <div className="flex flex-col items-center justify-center h-[180px] bg-muted/10 border border-dashed border-border rounded-lg">
    <span className="text-[13px] font-medium text-muted-foreground">No events during selected period</span>
    <span className="text-[11px] text-muted-foreground/80 mt-1">Timeline is empty for the current date range</span>
  </div>
);

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
  const [dateRangeSelection, setDateRangeSelection] = useState<DateRangeSelection>(() => {
    const { from, to } = getPresetRange("7d");
    return {
      from,
      to,
      label: getPresetLabel("7d"),
    };
  });
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

  // Query event timeline
  const from = formatApiDate(dateRangeSelection.from);
  const to = formatApiDate(dateRangeSelection.to);
  const {
    data: timelineData,
    isLoading: isTimelineLoading,
    isError: isTimelineError,
    error: timelineError,
    refetch: refetchTimeline,
  } = useEventTimeline(activeProjectId || 0, from, to);

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
            />
            <KpiCard
              label="Unique Users (Page)"
              value={totalUnique}
            />
            <KpiCard
              label="Tracked Events (Page)"
              value={new Set(eventsList.map((e) => e.name)).size}
              description="Unique event definitions on page"
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
            description="Daily volume timeline"
            actions={
              <DateRangePicker
                value={dateRangeSelection}
                onChange={setDateRangeSelection}
              />
            }
          >
            {isTimelineLoading ? (
              <SkeletonChart />
            ) : isTimelineError ? (
              <ErrorChart error={timelineError} onRetry={refetchTimeline} />
            ) : !timelineData || timelineData.chartData.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={timelineData.chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
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
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle" 
                    iconSize={8}
                    formatter={(value) => (
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {String(value).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                    )}
                  />
                  {timelineData.eventNames.map((name, index) => (
                    <Bar
                      key={name}
                      dataKey={name}
                      stackId="a"
                      fill={getEventColor(index)}
                      maxBarSize={28}
                      // Rounded corners for the topmost bar in stack can be added or standard flat
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
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
                          <span className="text-[13px] text-muted-foreground">--</span>
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

