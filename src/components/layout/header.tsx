"use client";

import { useState } from "react";
import { Search, Plus, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/shared/command-palette";

interface HeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function Header({ title, description, actions }: HeaderProps) {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <>
      <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-border bg-background px-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-[15px] font-semibold text-foreground">{title}</h1>
            {description && (
              <p className="text-[12px] text-muted-foreground leading-tight">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCmdOpen(true)}
            className="flex h-8 w-[220px] items-center gap-2 rounded-md border border-border bg-muted/50 px-2.5 text-[12px] text-muted-foreground hover:bg-muted transition-colors"
          >
            <Search className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="flex-1 text-left">Search or jump to…</span>
            <kbd className="flex items-center gap-0.5 rounded border border-border bg-background px-1 py-0.5 text-[10px] font-medium">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </button>
          {actions}
        </div>
      </header>
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </>
  );
}
