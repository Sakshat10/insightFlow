"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { CardSection } from "@/components/shared/section-header";
import { DateRangeSelector } from "@/components/shared/date-range-selector";
import { StatusBadge } from "@/components/shared/status-badge";
import { reportsData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  Calendar,
  Users,
  RefreshCw,
  Mail,
  Plus,
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
  daily: { label: "Daily", color: "text-blue-700", bg: "bg-blue-50" },
  weekly: { label: "Weekly", color: "text-violet-700", bg: "bg-violet-50" },
  monthly: { label: "Monthly", color: "text-emerald-700", bg: "bg-emerald-50" },
};

export default function ReportsPage() {
  const [filter, setFilter] = useState("all");

  const filtered = reportsData.filter(
    (r) => filter === "all" || r.type === filter
  );

  return (
    <AppLayout>
      <Header
        title="Reports"
        description="Scheduled and on-demand analytics reports"
        actions={
          <Button size="sm" className="h-8 gap-1.5 text-[12px]">
            <Plus className="h-3.5 w-3.5" />
            New Report
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Total Reports", value: reportsData.length, icon: FileText },
              { label: "Scheduled", value: reportsData.filter((r) => r.schedule !== "Quarterly").length, icon: Calendar },
              { label: "Recipients", value: 12, icon: Users },
              { label: "Ready", value: reportsData.filter((r) => r.status === "ready").length, icon: TrendingUp },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="rounded-lg border border-border bg-card px-4 py-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[12px] font-medium text-muted-foreground">{card.label}</p>
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-[22px] font-semibold tabular-nums leading-none text-foreground">
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5">
            {["all", "daily", "weekly", "monthly"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors capitalize",
                  filter === type
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filtered.map((report) => {
              const type = typeConfig[report.type] || typeConfig.monthly;
              return (
                <div
                  key={report.id}
                  className="group rounded-lg border border-border bg-card hover:border-primary/30 transition-colors"
                >
                  {/* Report header */}
                  <div className="flex items-start justify-between p-4 border-b border-border">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-foreground">
                          {report.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={cn(
                              "text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded",
                              type.bg,
                              type.color
                            )}
                          >
                            {type.label}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {report.period}
                          </span>
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={report.status} />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-4 divide-x divide-border px-4 py-3">
                    {[
                      { label: "Visitors", value: report.metrics.visitors.toLocaleString() },
                      { label: "Conversions", value: report.metrics.conversions.toLocaleString() },
                      { label: "Revenue", value: report.metrics.revenue },
                      { label: "Bounce", value: report.metrics.bounceRate },
                    ].map((metric) => (
                      <div key={metric.label} className="px-3 first:pl-0 last:pr-0">
                        <p className="text-[10px] text-muted-foreground mb-0.5">{metric.label}</p>
                        <p className="text-[13px] font-semibold tabular-nums text-foreground">
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/20">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {report.schedule}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {report.recipients} recipients
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-6 gap-1 text-[11px]">
                        <Mail className="h-3 w-3" />
                        Send
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 gap-1 text-[11px]">
                        <Download className="h-3 w-3" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scheduled Reports */}
          <CardSection
            title="Scheduled Reports"
            description="Automated delivery schedule"
          >
            <div className="space-y-3">
              {[
                { name: "Daily Digest", schedule: "Every day at 8:00 AM ET", recipients: 3, type: "daily" },
                { name: "Weekly Performance Summary", schedule: "Every Monday at 9:00 AM ET", recipients: 4, type: "weekly" },
                { name: "Monthly Growth Report", schedule: "1st of each month at 8:00 AM ET", recipients: 8, type: "monthly" },
              ].map((schedule) => {
                const type = typeConfig[schedule.type];
                return (
                  <div
                    key={schedule.name}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn("text-[10px] font-semibold uppercase px-2 py-0.5 rounded", type.bg, type.color)}>
                        {type.label}
                      </span>
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{schedule.name}</p>
                        <p className="text-[11px] text-muted-foreground">{schedule.schedule}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-muted-foreground">
                        {schedule.recipients} recipients
                      </span>
                      <Button variant="ghost" size="sm" className="h-7 text-[12px]">
                        Edit
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardSection>
        </div>
      </div>
    </AppLayout>
  );
}
