"use client";

import { use } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { useProject } from "@/features/projects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { ArrowLeft, Globe, Key, Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id: rawId } = use(params);
  const projectId = parseInt(rawId, 10);
  const { data: project, isLoading, error, refetch } = useProject(projectId);

  return (
    <AppLayout>
      <Header
        title={project?.name || "Project Details"}
        description={project?.domain}
        actions={
          <Link href="/projects">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[12px]">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Projects
            </Button>
          </Link>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-2xl space-y-6">
          {isLoading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-10 bg-muted rounded-lg w-1/3" />
              <div className="h-28 bg-muted rounded-lg" />
              <div className="h-28 bg-muted rounded-lg" />
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-5 text-center space-y-3">
              <div className="flex justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-sm font-medium text-destructive">Failed to load project details</p>
              <Button onClick={() => refetch()} size="sm" variant="outline">
                Retry
              </Button>
            </div>
          )}

          {!isLoading && !error && project && (
            <div className="space-y-6">
              {/* Project Card */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                      style={{ backgroundColor: project.color }}
                    >
                      {project.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-foreground">{project.name}</h2>
                      <a
                        href={`https://${project.domain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mt-0.5"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        {project.domain}
                      </a>
                    </div>
                  </div>
                  <StatusBadge status={project.status} />
                </div>

                <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                      Billing Plan
                    </span>
                    <Badge variant="secondary">{project.plan}</Badge>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                      Verification Status
                    </span>
                    {project.tracking === "verified" ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        Verified Active
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                        <Clock className="h-4 w-4" />
                        Pending Verification
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Integration snippet card */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">API Tracking Key</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Use this tracking key to associate client-side telemetry events with this workspace.
                </p>
                <div className="rounded-lg bg-muted p-3 font-mono text-[11px] text-foreground select-all border border-border">
                  {project.trackingKey || "No tracking key generated"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
