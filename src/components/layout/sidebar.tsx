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
          <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left hover:bg-sidebar-accent transition-colors outline-none">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-blue-600 text-[10px] font-bold text-white">
              AC
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-foreground leading-tight">
                Acme Corporation
              </p>
              <p className="truncate text-[11px] text-muted-foreground leading-tight">
                acme.com
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuItem className="text-[13px]">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-600 text-[9px] font-bold text-white mr-2">AC</div>
              Acme Corporation
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[13px]">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-emerald-600 text-[9px] font-bold text-white mr-2">AM</div>
              Acme Mobile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[13px]">
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
                      {item.badge && (
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground tabular-nums">
                          {item.badge}
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
        <div className="mb-1 flex gap-1">
          <Link
            href="#"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-[12px] text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          >
            <Bell className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="#"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-[12px] text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-sidebar-accent transition-colors outline-none">
            <Avatar className="h-6 w-6 flex-shrink-0">
              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[10px] font-semibold">
                MC
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-[12px] font-medium text-foreground leading-tight">
                Marcus Chen
              </p>
              <p className="truncate text-[11px] text-muted-foreground leading-tight">
                Growth Plan
              </p>
            </div>
            <ChevronDown className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]" side="top">
            <DropdownMenuItem className="text-[13px]">Profile</DropdownMenuItem>
            <DropdownMenuItem className="text-[13px]">Billing</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[13px] text-destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
