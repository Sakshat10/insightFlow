"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { CardSection } from "@/components/shared/section-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { projectsData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Plus,
  Search,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Settings,
  CheckCircle2,
  Clock,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const [search, setSearch] = useState("");

  const filtered = projectsData.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <Header
        title="Projects"
        description={`${projectsData.length} analytics projects`}
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-[13px] w-52"
              />
            </div>
            <Link href="/projects/new">
              <Button size="sm" className="h-8 gap-1.5 text-[12px]">
                <Plus className="h-3.5 w-3.5" />
                New Project
              </Button>
            </Link>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4">
          {/* Summary Row */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Total Projects", value: projectsData.length },
              { label: "Active", value: projectsData.filter((p) => p.status === "active").length },
              {
                label: "Total Visitors",
                value: projectsData.reduce((a, p) => a + p.visitors, 0).toLocaleString(),
              },
              { label: "Tracking Verified", value: projectsData.filter((p) => p.tracking === "verified").length },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-card px-4 py-3.5">
                <p className="text-[12px] font-medium text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-[22px] font-semibold tabular-nums leading-none text-foreground">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {filtered.map((project) => (
              <div
                key={project.id}
                className="group rounded-lg border border-border bg-card hover:border-primary/20 transition-all"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[13px] font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: project.color }}
                      >
                        {project.name
                          .split(" ")
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-foreground">
                          {project.name}
                        </p>
                        <a
                          href={`https://${project.domain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[12px] text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Globe className="h-3 w-3" />
                          {project.domain}
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={project.status} />
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-0 divide-x divide-border rounded-lg border border-border bg-muted/20 overflow-hidden">
                    <div className="px-3 py-2">
                      <p className="text-[10px] text-muted-foreground mb-0.5">Visitors</p>
                      <p className="text-[14px] font-semibold tabular-nums text-foreground">
                        {project.visitors > 0 ? project.visitors.toLocaleString() : "—"}
                      </p>
                    </div>
                    <div className="px-3 py-2">
                      <p className="text-[10px] text-muted-foreground mb-0.5">Conv. Rate</p>
                      <p className="text-[14px] font-semibold tabular-nums text-foreground">
                        {project.conversionRate > 0 ? `${project.conversionRate}%` : "—"}
                      </p>
                    </div>
                    <div className="px-3 py-2">
                      <p className="text-[10px] text-muted-foreground mb-0.5">Plan</p>
                      <p className="text-[13px] font-medium text-foreground">{project.plan}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      {project.tracking === "verified" ? (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" />
                          Tracking active
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[11px] text-amber-600">
                          <Clock className="h-3 w-3" />
                          Pending verification
                        </div>
                      )}
                      <span className="text-[11px] text-muted-foreground">·</span>
                      <span className="text-[11px] text-muted-foreground">
                        {project.lastActivity}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="h-6 text-[11px]">
                          View Analytics
                        </Button>
                      </Link>
                      <Link href="/settings">
                        <Button variant="ghost" size="sm" className="h-6 gap-1 text-[11px]">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* New Project Card */}
            <Link href="/projects/new">
              <div className="group flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-border bg-transparent hover:border-primary/40 hover:bg-muted/20 transition-all min-h-[180px]">
                <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border group-hover:border-primary/40 transition-colors">
                    <Plus className="h-4 w-4" />
                  </div>
                  <p className="text-[13px] font-medium">Add new project</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
