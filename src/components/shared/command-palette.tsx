"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
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
} from "lucide-react";

const pages = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Pages" },
  { href: "/projects", label: "Projects", icon: FolderOpen, group: "Pages" },
  { href: "/analytics", label: "Analytics", icon: BarChart2, group: "Pages" },
  { href: "/events", label: "Events", icon: Zap, group: "Pages" },
  { href: "/sessions", label: "Sessions", icon: MonitorPlay, group: "Pages" },
  { href: "/funnels", label: "Funnels", icon: GitBranch, group: "Pages" },
  { href: "/reports", label: "Reports", icon: FileText, group: "Pages" },
  { href: "/api-keys", label: "API Keys", icon: Key, group: "Pages" },
  { href: "/settings", label: "Settings", icon: Settings, group: "Pages" },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onOpenChange]);

  const runCommand = (fn: () => void) => {
    onOpenChange(false);
    fn();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages, events, reports…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {pages.map((page) => {
            const Icon = page.icon;
            return (
              <CommandItem
                key={page.href}
                onSelect={() => runCommand(() => router.push(page.href))}
                className="text-[13px]"
              >
                <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                {page.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/projects/new"))}
            className="text-[13px]"
          >
            <FolderOpen className="mr-2 h-4 w-4 text-muted-foreground" />
            Create new project
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/api-keys"))}
            className="text-[13px]"
          >
            <Key className="mr-2 h-4 w-4 text-muted-foreground" />
            Generate API key
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
