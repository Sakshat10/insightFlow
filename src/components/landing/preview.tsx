"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Download, RefreshCw, BarChart2 } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Preview() {
  return (
    <section className="py-24 lg:py-32 bg-muted/10 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">Interactive Preview</h2>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            A dashboard built for modern teams
          </p>
          <p className="mt-4 text-[14px] text-muted-foreground max-w-lg leading-relaxed">
            Take a look at the exact dashboard layout. Handcrafted UI cards, unified fonts, exact padding, and clean grid alignments provide clear, immediate insights.
          </p>
        </div>

        {/* Large Browser Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border border-border bg-card shadow-xl overflow-hidden w-full"
        >
          {/* Authentic Browser Top Bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/20 border-b border-border/80">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-border" />
              <div className="h-2.5 w-2.5 rounded-full bg-border" />
              <div className="h-2.5 w-2.5 rounded-full bg-border" />
            </div>
            <div className="mx-auto max-w-[280px] w-full text-[11px] font-mono text-muted-foreground bg-muted/40 border border-border/60 py-0.5 px-3 rounded text-center truncate">
              insightflow.co/dashboard/analytics
            </div>
          </div>

          {/* Realistic Dashboard Frame */}
          <div className="bg-background min-h-[480px] flex flex-col font-sans">
            {/* Header controls inside mockup */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-border/60">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Analytics Overview</h3>
                <p className="text-[10px] text-muted-foreground">acme.com — Last 30 days</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 border border-border/80 px-2 py-1 rounded text-[11px] text-muted-foreground bg-card">
                  <Calendar className="h-3 w-3" /> Last 30 days
                </div>
                <div className="border border-border/80 px-2.5 py-1 rounded text-[11px] font-medium text-foreground bg-card cursor-pointer hover:bg-muted/40 transition-colors">
                  Export
                </div>
              </div>
            </div>

            {/* Dashboard Inner Grid */}
            <div className="p-6 space-y-6">
              {/* KPI Cards Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Total Visitors", val: "142,842", diff: "+12.4%", desc: "vs. last month" },
                  { name: "Unique Visits", val: "94,380", diff: "+8.2%", desc: "vs. last month" },
                  { name: "Bounce Rate", val: "38.6%", diff: "-2.1%", desc: "vs. last month" },
                  { name: "Conversion Rate", val: "4.82%", diff: "+1.4%", desc: "vs. last month" },
                ].map((kpi, idx) => (
                  <div key={idx} className="border border-border/60 bg-card rounded-lg p-4">
                    <span className="text-[10px] font-medium text-muted-foreground block">{kpi.name}</span>
                    <span className="text-lg font-bold text-foreground block mt-1 tracking-tight">{kpi.val}</span>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[9px] text-emerald-600 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                        {kpi.diff}
                      </span>
                      <span className="text-[9px] text-muted-foreground">{kpi.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart Mockup Section */}
              <div className="border border-border/60 bg-card rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">Traffic Analysis</h4>
                    <p className="text-[9px] text-muted-foreground">Daily aggregate user visits</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <RefreshCw className="h-3 w-3" /> Refreshing
                  </div>
                </div>

                <div className="h-44 w-full flex items-end justify-between gap-1.5 pt-4 relative">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                    <div className="border-b border-muted-foreground w-full" />
                    <div className="border-b border-muted-foreground w-full" />
                    <div className="border-b border-muted-foreground w-full" />
                  </div>
                  {/* Bars representing daily stats */}
                  {[45, 62, 54, 80, 68, 92, 85, 110, 95, 125, 115, 140, 125, 150, 138, 160].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end h-full z-10">
                      <div
                        className="w-full bg-primary rounded-t-[2px]"
                        style={{ height: `${(h / 180) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[9px] text-muted-foreground font-mono px-1">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-10 px-5 text-[13px] border-border hover:bg-muted/50 rounded-md flex items-center gap-1.5 font-medium"
            )}
          >
            Explore Live Dashboard <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
