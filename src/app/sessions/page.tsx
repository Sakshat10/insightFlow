"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { CardSection } from "@/components/shared/section-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActiveProject } from "@/providers/ActiveProjectProvider";
import { useSessions, useSession } from "@/features/sessions";
import { useAnalyticsOverview } from "@/features/analytics";
import type { FrontSession } from "@/features/sessions";
import {
  Search,
  Monitor,
  Smartphone,
  Tablet,
  ArrowRight,
  Clock,
  MousePointer,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DeviceIcon = ({ device }: { device: string }) => {
  if (device === "Mobile") return <Smartphone className="h-3.5 w-3.5" />;
  if (device === "Tablet") return <Tablet className="h-3.5 w-3.5" />;
  return <Monitor className="h-3.5 w-3.5" />;
};

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export default function SessionsPage() {
  const { activeProjectId } = useActiveProject();

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [selectedDbId, setSelectedDbId] = useState<number | null>(null);

  const [prevProjectId, setPrevProjectId] = useState(activeProjectId);
  if (activeProjectId !== prevProjectId) {
    setPrevProjectId(activeProjectId);
    setPage(0);
    setSelectedDbId(null);
  }

  // Fetch paginated sessions
  const {
    data: sessionsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useSessions({
    projectId: activeProjectId || 0,
    page,
    size,
    sortBy: "createdAt",
    sortDir: "desc",
  });

  // Fetch selected session detail
  const {
    data: detailData,
    isLoading: detailLoading,
    isError: detailError,
    error: detailErrorObj,
    refetch: refetchDetail,
  } = useSession(selectedDbId || 0);

  // Fetch overview stats for KPI counts
  const { data: overviewData } = useAnalyticsOverview(activeProjectId || 0);

  const sessions = sessionsResponse?.content || [];
  const totalElements = sessionsResponse?.totalElements || 0;
  const totalPages = sessionsResponse?.totalPages || 0;

  const totalSessions = overviewData?.totalSessions || 0;
  const avgDuration = overviewData?.avgSessionDurationSeconds
    ? formatDuration(overviewData.avgSessionDurationSeconds)
    : "--";
  const bounced = overviewData?.totalSessions && overviewData?.bounceRate
    ? Math.round((overviewData.totalSessions * overviewData.bounceRate) / 100)
    : 0;

  return (
    <AppLayout>
      <Header
        title="Sessions"
        description="User session explorer"
        actions={
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-muted-foreground border border-border bg-background rounded-md px-3 py-1.5">
              All time
            </span>
          </div>
        }
      />

      <div className="flex-1 overflow-hidden flex">
        {/* Session list */}
        <div className={cn("flex flex-col overflow-hidden border-r border-border", selectedDbId ? "w-[420px] flex-shrink-0" : "flex-1")}>
          {/* KPI row */}
          <div className="grid grid-cols-4 gap-0 border-b border-border">
            {[
              { label: "Total Sessions", value: totalSessions.toLocaleString() },
              { label: "Avg. Duration", value: avgDuration },
              { label: "Converted", value: "--" },
              { label: "Bounced", value: bounced.toLocaleString() },
            ].map((kpi, i) => (
              <div
                key={kpi.label}
                className={cn(
                  "px-4 py-3",
                  i < 3 && "border-r border-border"
                )}
              >
                <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
                <p className="text-[18px] font-semibold tabular-nums text-foreground mt-0.5">
                  {kpi.value}
                </p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search unavailable (API limitation)"
                disabled
                className="h-8 pl-8 text-[13px] bg-muted/20 opacity-60 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Error view */}
          {isError && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 border border-dashed border-red-200 rounded-lg m-6 bg-red-50/50">
              <p className="text-sm font-medium text-red-800">Failed to load sessions</p>
              <p className="text-xs text-red-600 mb-4">{error?.message || "Please check your network connection."}</p>
              <Button size="sm" onClick={() => refetch()} className="h-8">
                Retry
              </Button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && sessions.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-lg m-6 bg-muted/5">
              <p className="text-sm font-medium text-muted-foreground">No sessions recorded yet</p>
              <p className="text-xs text-muted-foreground/80 mt-1 text-center">
                Sessions will appear here when visitors start using your tracked website.
              </p>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border/50 rounded-lg animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full bg-muted" />
                    <div className="space-y-1">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-3 w-20 bg-muted rounded" />
                    </div>
                  </div>
                  <div className="h-5 w-16 bg-muted rounded-full" />
                </div>
              ))}
            </div>
          )}

          {/* Sessions list */}
          {!isLoading && !isError && sessions.length > 0 && (
            <>
              <div className="flex-1 overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-muted/30 border-b border-border z-10">
                    <tr>
                      <th className="px-4 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        User
                      </th>
                      <th className="px-4 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                        Duration
                      </th>
                      <th className="px-4 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                        Pages
                      </th>
                      <th className="px-4 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden xl:table-cell">
                        Source
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session: FrontSession) => (
                      <tr
                        key={session.id}
                        onClick={() => setSelectedDbId(selectedDbId === session.dbId ? null : session.dbId)}
                        className={cn(
                          "border-b border-border/50 cursor-pointer transition-colors",
                          selectedDbId === session.dbId
                            ? "bg-accent"
                            : "hover:bg-muted/20"
                        )}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted flex-shrink-0">
                              <span className="text-[10px] font-semibold text-muted-foreground">
                                ?
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-medium text-foreground truncate">
                                {session.user}
                              </p>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <DeviceIcon device={session.device} />
                                <span className="text-[11px] truncate">{session.browser}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-[13px] tabular-nums">{session.duration}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex items-center gap-1.5">
                            <MousePointer className="h-3 w-3 text-muted-foreground" />
                            <span className="text-[13px] tabular-nums">{session.pageCount}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={session.status} />
                        </td>
                        <td className="px-4 py-3 hidden xl:table-cell">
                          <span className="text-[12px] text-muted-foreground">{session.source}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border px-4 py-3 bg-muted/10">
                  <div className="text-[12px] text-muted-foreground">
                    Showing <span className="font-medium">{(page * size) + 1}</span> to{" "}
                    <span className="font-medium">{Math.min((page + 1) * size, totalElements)}</span> of{" "}
                    <span className="font-medium">{totalElements}</span> sessions
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
            </>
          )}
        </div>

        {/* Session Detail Panel */}
        {selectedDbId !== null && (
          <div className="flex-1 overflow-y-auto">
            {detailLoading ? (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-6 w-32 bg-muted rounded animate-pulse" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setSelectedDbId(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                <div className="grid grid-cols-2 gap-3 pt-2 animate-pulse">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-14 bg-muted rounded-lg" />
                  ))}
                </div>
              </div>
            ) : detailError ? (
              <div className="p-6 space-y-4">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setSelectedDbId(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-col items-center justify-center p-8 border border-dashed border-red-200 rounded-lg bg-red-50/50">
                  <p className="text-sm font-medium text-red-800">Failed to load session details</p>
                  <p className="text-xs text-red-600 mb-4">{detailErrorObj?.message || "An error occurred."}</p>
                  <Button size="sm" onClick={() => refetchDetail()} className="h-8">
                    Retry
                  </Button>
                </div>
              </div>
            ) : detailData ? (
              <div className="p-6 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-[15px] font-semibold text-foreground">
                      {detailData.user}
                    </h2>
                    {detailData.email && (
                      <p className="text-[13px] text-muted-foreground">{detailData.email}</p>
                    )}
                    <p className="text-[11px] font-mono text-muted-foreground mt-1">
                      Session ID: {detailData.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={detailData.status} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => setSelectedDbId(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Start Time", value: detailData.startTime },
                    { label: "Duration", value: detailData.duration },
                    { label: "Pages Visited", value: `${detailData.pageCount} pages` },
                    { label: "Device", value: detailData.device },
                    { label: "Browser", value: detailData.browser },
                    { label: "OS", value: detailData.os },
                    { label: "Country", value: detailData.country },
                    { label: "Source", value: detailData.source },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg border border-border bg-muted/20 px-3 py-2.5">
                      <p className="text-[11px] text-muted-foreground mb-0.5">{item.label}</p>
                      <p className="text-[13px] font-medium text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* User Journey */}
                <CardSection title="User Journey" description="Pages visited in order">
                  <div className="space-y-2">
                    {detailData.journey.map((pageStr: string, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-border bg-background text-[10px] font-semibold text-muted-foreground">
                          {i + 1}
                        </div>
                        <div className="flex-1 flex items-center justify-between rounded-md border border-border bg-muted/20 px-3 py-2">
                          <span className="text-[12px] font-mono text-foreground">{pageStr}</span>
                          {i === 0 && (
                            <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">Entry</span>
                          )}
                          {i === detailData.journey.length - 1 && i > 0 && (
                            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">Exit</span>
                          )}
                        </div>
                        {i < detailData.journey.length - 1 && (
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardSection>

                {/* Entry/Exit */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border bg-blue-50/50 px-4 py-3">
                    <p className="text-[11px] font-medium text-blue-700 mb-1">Entry Page</p>
                    <p className="text-[13px] font-mono font-medium text-foreground">{detailData.entryPage}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-amber-50/50 px-4 py-3">
                    <p className="text-[11px] font-medium text-amber-700 mb-1">Exit Page</p>
                    <p className="text-[13px] font-mono font-medium text-foreground">{detailData.exitPage}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
