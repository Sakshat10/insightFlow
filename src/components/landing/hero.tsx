"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, BarChart3, TrendingUp } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  // Mock data representing realistic traffic
  const chartPoints = [30, 45, 38, 70, 52, 90, 82, 110, 95, 120, 105, 130];

  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-20 lg:pt-24 lg:pb-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12 items-center">
          {/* Left Column: Copy & CTAs */}
          <motion.div
            className="lg:col-span-5 space-y-8 text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Small trust indicator */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 text-[12px] font-medium text-muted-foreground tracking-tight"
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Developer first analytics
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                variants={itemVariants}
                className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-5xl leading-[1.1]"
              >
                Understand your users.{" "}
                <span className="text-muted-foreground block font-normal mt-1">
                  Grow with data.
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-[15px] leading-relaxed text-muted-foreground max-w-lg"
              >
                InsightFlow helps businesses understand visitors, sessions, page performance, funnels, and conversions through a modern analytics dashboard.
              </motion.p>
            </div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-10 px-5 text-[13px] bg-foreground text-background hover:bg-foreground/95 rounded-md justify-center flex items-center gap-1.5 font-medium"
                )}
              >
                Get Started <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-10 px-5 text-[13px] text-foreground border-border hover:bg-muted/50 rounded-md justify-center flex items-center font-medium"
                )}
              >
                Live Demo
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column: Realistic Browser Mockup */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <div className="relative rounded-xl border border-border bg-card shadow-lg overflow-hidden w-full">
              {/* Authentic Browser Top Bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/20 border-b border-border/80">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-border" />
                  <div className="h-2.5 w-2.5 rounded-full bg-border" />
                  <div className="h-2.5 w-2.5 rounded-full bg-border" />
                </div>
                <div className="mx-auto max-w-[280px] w-full text-[11px] font-mono text-muted-foreground bg-muted/40 border border-border/60 py-0.5 px-3 rounded text-center truncate">
                  insightflow.co/dashboard
                </div>
              </div>

              {/* Realistic dashboard content representation */}
              <div className="p-5 md:p-6 space-y-5 bg-background">
                {/* Dashboard mock header */}
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <div>
                    <h3 className="text-xs font-semibold text-foreground">Visitors Trend</h3>
                    <p className="text-[10px] text-muted-foreground">Unique sessions daily</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <TrendingUp className="h-3 w-3" /> +18.4%
                  </div>
                </div>

                {/* Main KPI Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: "Active Visitors", val: "1,248", change: "+12.4%" },
                    { name: "Unique Sessions", val: "14.2k", change: "+8.2%" },
                    { name: "Bounce Rate", val: "38.6%", change: "-2.5%" },
                  ].map((stat, idx) => (
                    <div key={idx} className="border border-border/60 rounded-lg p-3 bg-card">
                      <span className="text-[10px] text-muted-foreground font-medium block">{stat.name}</span>
                      <span className="text-base font-bold text-foreground block mt-1 tracking-tight">{stat.val}</span>
                      <span className="text-[9px] text-emerald-600 font-semibold block mt-0.5">{stat.change}</span>
                    </div>
                  ))}
                </div>

                {/* Trend Graph Grid */}
                <div className="border border-border/60 rounded-xl p-4 bg-muted/5">
                  <div className="h-36 w-full flex items-end justify-between gap-1.5 pt-4 relative">
                    {/* Graph grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                      <div className="border-b border-muted-foreground w-full" />
                      <div className="border-b border-muted-foreground w-full" />
                      <div className="border-b border-muted-foreground w-full" />
                    </div>
                    {/* SVG Line representation overlay */}
                    <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <polyline
                        fill="none"
                        stroke="var(--color-primary, #4F81F7)"
                        strokeWidth="1.5"
                        points="0,85 9,75 18,80 27,58 36,70 45,45 54,50 63,30 72,40 81,20 90,30 100,10"
                      />
                    </svg>
                    {/* Small vertical bar chart overlays */}
                    {chartPoints.map((h, i) => (
                      <div key={i} className="flex-1 flex justify-center h-full z-10 opacity-15">
                        <div
                          className="w-full bg-primary rounded-t-sm"
                          style={{ height: `${(h / 140) * 100}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-muted-foreground mt-2 px-1 font-mono">
                    <span>06/12</span>
                    <span>06/18</span>
                    <span>06/24</span>
                    <span>06/30</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
