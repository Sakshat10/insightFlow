"use client";

import Link from "next/link";
import { BarChart3 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background py-12">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-foreground tracking-tight">InsightFlow</span>
          <span className="text-[10px] text-muted-foreground ml-2 font-mono">© {new Date().getFullYear()}</span>
        </div>

        {/* Right Side: Simple Links */}
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-[11px] font-medium text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Documentation
          </Link>
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
            GitHub
          </Link>
          <Link href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
            Twitter
          </Link>
        </div>
      </div>
    </footer>
  );
}
