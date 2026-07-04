"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { CardSection } from "@/components/shared/section-header";
import { DateRangeSelector } from "@/components/shared/date-range-selector";
import { StatusBadge } from "@/components/shared/status-badge";
import { Input } from "@/components/ui/input";
import { sessionsData } from "@/lib/data";
import { FrontSession } from "@/services/analytics.service";
import {
  Search,
  Monitor,
  Smartphone,
  Tablet,
  ArrowRight,
  Clock,
  MousePointer,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DeviceIcon = ({ device }: { device: string }) => {
  if (device === "Mobile") return <Smartphone className="h-3.5 w-3.5" />;
  if (device === "Tablet") return <Tablet className="h-3.5 w-3.5" />;
  return <Monitor className="h-3.5 w-3.5" />;
};

export default function SessionsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("30d");

  const filtered = (sessionsData as FrontSession[]).filter((s: FrontSession) => {
    if (!search) return true;
    return (
      s.user.toLowerCase().includes(search.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(search.toLowerCase())) ||
      s.id.toLowerCase().includes(search.toLowerCase())
    );
  });

  const selectedSession = selected
    ? (sessionsData as FrontSession[]).find((s: FrontSession) => s.id === selected)
    : null;

  const totalSessions = sessionsData.length;
  const avgDuration = "4m 31s";
  const converted = (sessionsData as FrontSession[]).filter((s: FrontSession) => s.status === "converted").length;
  const bounced = (sessionsData as FrontSession[]).filter((s: FrontSession) => s.status === "bounced").length;

  return (
    <AppLayout>
      <Header
        title="Sessions"
        description="User session explorer"
        actions={
          <div className="flex items-center gap-2">
            <DateRangeSelector value={dateRange} onChange={setDateRange} />
          </div>
        }
      />

      <div className="flex-1 overflow-hidden flex">
        {/* Session list */}
        <div className={cn("flex flex-col overflow-hidden border-r border-border", selected ? "w-[420px] flex-shrink-0" : "flex-1")}>
          {/* KPI row */}
          <div className="grid grid-cols-4 gap-0 border-b border-border">
            {[
              { label: "Total Sessions", value: totalSessions.toLocaleString() },
              { label: "Avg. Duration", value: avgDuration },
              { label: "Converted", value: converted.toString() },
              { label: "Bounced", value: bounced.toString() },
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
                placeholder="Search sessions, users…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-[13px]"
              />
            </div>
          </div>

          {/* Sessions list */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-muted/30 border-b border-border">
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
                {filtered.map((session: FrontSession) => (
                  <tr
                    key={session.id}
                    onClick={() => setSelected(selected === session.id ? null : session.id)}
                    className={cn(
                      "border-b border-border/50 cursor-pointer transition-colors",
                      selected === session.id
                        ? "bg-accent"
                        : "hover:bg-muted/20"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted flex-shrink-0">
                          <span className="text-[10px] font-semibold text-muted-foreground">
                            {session.user === "Anonymous" ? "?" : session.user.split(" ").map((n: string) => n[0]).join("")}
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
        </div>

        {/* Session Detail Panel */}
        {selectedSession && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[15px] font-semibold text-foreground">
                    {selectedSession.user}
                  </h2>
                  {selectedSession.email && (
                    <p className="text-[13px] text-muted-foreground">{selectedSession.email}</p>
                  )}
                  <p className="text-[11px] font-mono text-muted-foreground mt-1">
                    Session ID: {selectedSession.id}
                  </p>
                </div>
                <StatusBadge status={selectedSession.status} />
              </div>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Start Time", value: selectedSession.startTime },
                  { label: "Duration", value: selectedSession.duration },
                  { label: "Pages Visited", value: `${selectedSession.pageCount} pages` },
                  { label: "Device", value: selectedSession.device },
                  { label: "Browser", value: selectedSession.browser },
                  { label: "OS", value: selectedSession.os },
                  { label: "Country", value: selectedSession.country },
                  { label: "Source", value: selectedSession.source },
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
                  {selectedSession.journey.map((page: string, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-border bg-background text-[10px] font-semibold text-muted-foreground">
                        {i + 1}
                      </div>
                      <div className="flex-1 flex items-center justify-between rounded-md border border-border bg-muted/20 px-3 py-2">
                        <span className="text-[12px] font-mono text-foreground">{page}</span>
                        {i === 0 && (
                          <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">Entry</span>
                        )}
                        {i === selectedSession.journey.length - 1 && i > 0 && (
                          <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">Exit</span>
                        )}
                      </div>
                      {i < selectedSession.journey.length - 1 && (
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
                  <p className="text-[13px] font-mono font-medium text-foreground">{selectedSession.entryPage}</p>
                </div>
                <div className="rounded-lg border border-border bg-amber-50/50 px-4 py-3">
                  <p className="text-[11px] font-medium text-amber-700 mb-1">Exit Page</p>
                  <p className="text-[13px] font-mono font-medium text-foreground">{selectedSession.exitPage}</p>
                </div>
              </div>

              {selectedSession.value && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-[11px] font-medium text-emerald-700 mb-0.5">Conversion Value</p>
                  <p className="text-[20px] font-bold text-emerald-700">{selectedSession.value}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
