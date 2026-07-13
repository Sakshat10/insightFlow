"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { StatusBadge } from "@/components/shared/status-badge";
import { useProjects, useProjectStats, CreateProjectDialog } from "@/features/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActiveProject } from "@/providers/ActiveProjectProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProjectService } from "@/services/project.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  ExternalLink,
  Globe,
  AlertCircle,
  MoreVertical,
  Settings,
  Archive,
  RotateCcw,
  Trash2,
  BarChart3,
} from "lucide-react";

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { activeProjectId, setActiveProjectId } = useActiveProject();
  const router = useRouter();

  const {
    data: projects = [],
    isLoading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useProjects();

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useProjectStats();

  const filtered = projects.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.domain.toLowerCase().includes(search.toLowerCase())
  );

  const activeProjects = filtered.filter((p) => p.status === "active");
  const archivedProjects = filtered.filter((p) => p.status === "inactive");

  const handleProjectClick = (projectId: number) => {
    setActiveProjectId(projectId);
    router.push("/dashboard");
  };

  const handleArchiveProject = async (id: number) => {
    if (!confirm("Are you sure you want to archive this project? It will be marked as inactive and hide from your active dashboard.")) return;
    try {
      await ProjectService.updateProject(id, { projectStatus: 0 });
      if (activeProjectId === id) {
        const remaining = projects.filter((p) => p.id !== id && p.status === "active");
        if (remaining.length > 0) {
          setActiveProjectId(remaining[0].id);
        } else {
          localStorage.removeItem("activeProjectId");
        }
      }
      refetchProjects();
      refetchStats();
    } catch (err: any) {
      alert(err.message || "Failed to archive project");
    }
  };

  const handleRestoreProject = async (id: number) => {
    try {
      await ProjectService.restoreProject(id);
      refetchProjects();
      refetchStats();
    } catch (err: any) {
      alert(err.message || "Failed to restore project");
    }
  };

  const handleHardDeleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this project? All associated analytics data will be deleted forever. This cannot be undone.")) return;
    try {
      await ProjectService.deleteProject(id);
      if (activeProjectId === id) {
        const remaining = projects.filter((p) => p.id !== id && p.status === "active");
        if (remaining.length > 0) {
          setActiveProjectId(remaining[0].id);
        } else {
          localStorage.removeItem("activeProjectId");
        }
      }
      refetchProjects();
      refetchStats();
    } catch (err: any) {
      alert(err.message || "Failed to delete project");
    }
  };

  return (
    <AppLayout>
      <Header
        title="Projects"
        description={`${projects.length} analytics projects`}
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
            <Button onClick={() => setCreateDialogOpen(true)} size="sm" className="h-8 gap-1.5 text-[12px]">
              <Plus className="h-3.5 w-3.5" />
              New Project
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-5">
          {/* Summary Row */}
          {statsLoading ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-lg border border-border bg-card px-4 py-3.5 animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-6 bg-muted rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : statsError ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 flex items-center justify-between text-xs text-destructive">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>Failed to load project summary metrics.</span>
              </div>
              <Button onClick={() => refetchStats()} size="sm" variant="outline" className="h-7 text-[10px]">
                Retry
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                { label: "Total Projects", value: stats?.totalProjects ?? 0 },
                { label: "Active", value: stats?.activeProjects ?? 0 },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border bg-card px-4 py-3.5">
                  <p className="text-[12px] font-medium text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-[22px] font-semibold tabular-nums leading-none text-foreground">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Project Tabs & List */}
          {projectsLoading ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-4 animate-pulse space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-muted" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-4 bg-muted rounded w-1/3" />
                      <div className="h-3 bg-muted rounded w-1/4" />
                    </div>
                  </div>
                  <div className="h-10 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : projectsError ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center space-y-3">
              <div className="flex justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-sm font-medium text-destructive">Failed to load projects list</p>
              <Button onClick={() => refetchProjects()} size="sm" variant="outline">
                Retry
              </Button>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-1">
                <TabsList className="h-9 bg-muted/60 p-1 gap-0.5 border-none rounded-md">
                  <TabsTrigger value="active" className="flex items-center gap-1.5 text-[12px] h-7 px-3">
                    Active Projects ({projects.filter((p) => p.status === "active").length})
                  </TabsTrigger>
                  <TabsTrigger value="archived" className="flex items-center gap-1.5 text-[12px] h-7 px-3">
                    Archived ({projects.filter((p) => p.status === "inactive").length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="active" className="space-y-4 mt-0 outline-none">
                {activeProjects.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-3">
                    <p className="text-sm font-semibold text-foreground">No active projects yet</p>
                    <p className="text-xs text-muted-foreground">Create your first project to start collecting analytics.</p>
                    <Button onClick={() => setCreateDialogOpen(true)} size="sm" className="mt-2">
                      Add Project
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {activeProjects.map((project) => (
                      <div
                        key={project.id}
                        className="group relative rounded-lg border border-border bg-card hover:border-primary/20 transition-all"
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleProjectClick(project.id)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-[13px] font-bold text-white flex-shrink-0 hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: project.color }}
                              >
                                {project.name.substring(0, 2).toUpperCase()}
                              </button>
                              <div className="text-left">
                                <button
                                  onClick={() => handleProjectClick(project.id)}
                                  className="block text-[14px] font-semibold text-foreground hover:text-primary transition-colors text-left"
                                >
                                  {project.name}
                                </button>
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
                              <DropdownMenu>
                                <DropdownMenuTrigger className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none cursor-pointer">
                                  <MoreVertical className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44">
                                  <DropdownMenuItem onClick={() => handleProjectClick(project.id)}>
                                    <BarChart3 className="mr-2 h-4 w-4" />
                                    View Analytics
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    setActiveProjectId(project.id);
                                    router.push("/settings");
                                  }}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleArchiveProject(project.id)}>
                                    <Archive className="mr-2 h-4 w-4" />
                                    Archive Project
                                  </DropdownMenuItem>
                                  <DropdownMenuItem variant="destructive" onClick={() => handleHardDeleteProject(project.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Permanently
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-[11px] text-muted-foreground">
                              {project.lastActivity}
                            </span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-[11px]"
                                onClick={() => handleProjectClick(project.id)}
                              >
                                View Analytics
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* New Project Card */}
                    <div
                      onClick={() => setCreateDialogOpen(true)}
                      className="group flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-border bg-transparent hover:border-primary/40 hover:bg-muted/20 transition-all min-h-[140px]"
                    >
                      <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border group-hover:border-primary/40 transition-colors">
                          <Plus className="h-4 w-4" />
                        </div>
                        <p className="text-[13px] font-medium">Add new project</p>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="archived" className="space-y-4 mt-0 outline-none">
                {archivedProjects.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-12 text-center">
                    <p className="text-sm font-semibold text-foreground">No archived projects yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Archived projects can be restored at any time.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {archivedProjects.map((project) => (
                      <div
                        key={project.id}
                        className="group relative rounded-lg border border-border bg-muted/30 opacity-75 hover:opacity-100 transition-all"
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-[13px] font-bold text-white flex-shrink-0"
                                style={{ backgroundColor: project.color }}
                              >
                                {project.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="text-left">
                                <span className="block text-[14px] font-semibold text-foreground">
                                  {project.name}
                                </span>
                                <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                                  <Globe className="h-3 w-3" />
                                  {project.domain}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={project.status} />
                              <DropdownMenu>
                                <DropdownMenuTrigger className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none cursor-pointer">
                                  <MoreVertical className="h-4 w-4" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44">
                                  <DropdownMenuItem onClick={() => handleRestoreProject(project.id)}>
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Restore Project
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem variant="destructive" onClick={() => handleHardDeleteProject(project.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Permanently
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-[11px] text-muted-foreground">
                              {project.lastActivity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
      <CreateProjectDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </AppLayout>
  );
}
