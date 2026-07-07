"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  BarChart2,
  Zap,
  MonitorPlay,
  GitBranch,
  FileText,
  Key,
  Settings,
  TrendingUp,
  ChevronDown,
  Plus,
  Bell,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser, useLogout } from "@/features/auth";
import { useRouter } from "next/navigation";

import { useActiveProject } from "@/providers/ActiveProjectProvider";
import { useEvents } from "@/features/events";

const navItems = [
  {
    section: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/projects", label: "Projects", icon: FolderOpen, badge: "4" },
    ],
  },
  {
    section: "Analytics",
    items: [
      { href: "/analytics", label: "Analytics", icon: BarChart2 },
      { href: "/events", label: "Events", icon: Zap, badge: "8" },
      { href: "/sessions", label: "Sessions", icon: MonitorPlay },
      { href: "/funnels", label: "Funnels", icon: GitBranch },
    ],
  },
  {
    section: "Reports",
    items: [
      { href: "/reports", label: "Reports", icon: FileText },
    ],
  },
  {
    section: "Developer",
    items: [
      { href: "/api-keys", label: "API Keys", icon: Key },
    ],
  },
  {
    section: "Configuration",
    items: [
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const logoutMutation = useLogout();
  const { activeProject, projects, setActiveProjectId, isLoading: projectsLoading } = useActiveProject();
  const { data: eventsData } = useEvents({
    projectId: activeProject?.id || 0,
    page: 0,
    size: 1,
  });

  const handleSignOut = () => {
    if (logoutMutation.isPending) return;
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        router.replace("/login");
      },
    });
  };

  const username = user?.username || "User";
  const email = user?.email || "Growth Plan";
  const initials = username.substring(0, 2).toUpperCase();

  return (
    <aside className="flex h-full w-[220px] flex-shrink-0 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <TrendingUp className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          InsightFlow
        </span>
      </div>

      {/* Project switcher */}
      <div className="border-b border-border px-3 py-2.5">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left hover:bg-sidebar-accent transition-colors outline-none" disabled={projectsLoading}>
            <div
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
              style={{ backgroundColor: activeProject?.color || "#4F81F7" }}
            >
              {activeProject ? activeProject.name.substring(0, 2).toUpperCase() : "AC"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-foreground leading-tight">
                {activeProject ? activeProject.name : "Loading..."}
              </p>
              <p className="truncate text-[11px] text-muted-foreground leading-tight">
                {activeProject ? activeProject.domain : "..."}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            {projects.map((proj) => (
              <DropdownMenuItem
                key={proj.id}
                onClick={() => setActiveProjectId(proj.id)}
                className="text-[13px] cursor-pointer"
              >
                <div
                  className="flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold text-white mr-2"
                  style={{ backgroundColor: proj.color }}
                >
                  {proj.name.substring(0, 2).toUpperCase()}
                </div>
                {proj.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[13px] cursor-pointer" onClick={() => router.push("/projects")}>
              <Plus className="mr-2 h-3.5 w-3.5" />
              New project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navItems.map((section) => (
          <div key={section.section} className="mb-4">
            <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {section.section}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const badgeValue =
                  item.href === "/projects"
                    ? projects.length.toString()
                    : item.href === "/events"
                    ? (eventsData?.totalElements !== undefined ? eventsData.totalElements.toString() : item.badge)
                    : item.badge;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors",
                        isActive
                          ? "bg-primary/8 text-primary"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-foreground"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 flex-shrink-0",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      <span className="flex-1">{item.label}</span>
                      {badgeValue && (
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground tabular-nums">
                          {badgeValue}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom user section */}
      <div className="border-t border-border p-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-sidebar-accent transition-colors outline-none">
            <Avatar className="h-6 w-6 flex-shrink-0">
              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[10px] font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-[12px] font-medium text-foreground leading-tight">
                {username}
              </p>
              <p className="truncate text-[11px] text-muted-foreground leading-tight">
                {email}
              </p>
            </div>
            <ChevronDown className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]" side="top">
            <DropdownMenuItem className="text-[13px]">Profile</DropdownMenuItem>
            <DropdownMenuItem className="text-[13px]">Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              disabled={logoutMutation.isPending}
              className="text-[13px] text-destructive cursor-pointer disabled:opacity-50"
            >
              {logoutMutation.isPending ? "Signing out..." : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
