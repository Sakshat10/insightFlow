"use client";

import { motion } from "framer-motion";
import { Activity, GitBranch, Code, ShieldCheck } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Real-time user event streaming",
      description:
        "Watch visitor behavior unfold in high-resolution detail. Monitor page views, click sequences, and user transitions as they occur with sub-millisecond aggregation.",
      icon: Activity,
      mockup: (
        <div className="border border-border/80 bg-card rounded-xl p-4 shadow-sm w-full font-mono text-[11px] space-y-2.5">
          <div className="flex items-center justify-between text-muted-foreground border-b border-border pb-2">
            <span>Event Name</span>
            <span>Path</span>
            <span>Duration</span>
          </div>
          <div className="flex items-center justify-between text-foreground">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              page_view
            </span>
            <span>/pricing</span>
            <span className="text-muted-foreground">1.2s</span>
          </div>
          <div className="flex items-center justify-between text-foreground/80">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
              click_cta
            </span>
            <span>/pricing#pro</span>
            <span className="text-muted-foreground">240ms</span>
          </div>
          <div className="flex items-center justify-between text-foreground/75">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
              submit_form
            </span>
            <span>/register</span>
            <span className="text-muted-foreground">420ms</span>
          </div>
        </div>
      ),
    },
    {
      title: "Conversion funnels & path retention",
      description:
        "Build multi-step conversion funnels instantly. Pin-point exact drop-off points to optimize sign-up flows, checkout paths, and onboarding funnels.",
      icon: GitBranch,
      mockup: (
        <div className="border border-border/80 bg-card rounded-xl p-4 shadow-sm w-full space-y-3">
          <div className="text-[11px] font-semibold text-muted-foreground">REGISTRATION CONVERSION</div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] text-foreground mb-1">
                <span>1. Visited Landing Page</span>
                <span className="font-semibold">100%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-foreground mb-1">
                <span>2. Clicked Get Started</span>
                <span className="font-semibold">74.2%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[74.2%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-foreground mb-1">
                <span>3. Created Account</span>
                <span className="font-semibold">42.8%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[42.8%]" />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Clean API instrumentation",
      description:
        "Integrate analytics into your client apps or backend services. With light SDKs weighing less than 1KB, instrumentation takes a single line of code.",
      icon: Code,
      mockup: (
        <div className="border border-border/80 bg-muted/40 rounded-xl p-4 shadow-sm w-full font-mono text-[11px] text-foreground overflow-x-auto">
          <div className="text-muted-foreground">// Instrument tracking</div>
          <div>
            <span className="text-blue-500">import</span> {"{ Insight }"} <span className="text-blue-500">from</span> <span className="text-emerald-600">"@insightflow/sdk"</span>;
          </div>
          <div className="mt-2">
            <span className="text-blue-500">const</span> client = <span className="text-blue-500">new</span> <span className="text-violet-600">Insight</span>({"{ key: 'if_prod_84' }"});
          </div>
          <div className="mt-1">
            client.<span className="text-blue-500">track</span>(<span className="text-emerald-600">"purchase_completed"</span>, {"{"}
            <div className="pl-4">value: <span className="text-amber-600">29.00</span>,</div>
            <div className="pl-4">currency: <span className="text-emerald-600">"USD"</span></div>
            {"}"});
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="py-24 lg:py-32 bg-background border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">Capabilities</h2>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Built for accuracy. Optimized for developers.
          </p>
        </div>

        {/* Alternating Feature Rows */}
        <div className="space-y-24 lg:space-y-32">
          {features.map((feature, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={feature.title}
                className={`grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center`}
              >
                {/* Text Content */}
                <div
                  className={`lg:col-span-5 ${
                    isEven ? "lg:order-1" : "lg:order-2 lg:col-start-8"
                  } space-y-5`}
                >
                  <div className="inline-flex items-center justify-center rounded-lg bg-muted p-2 text-foreground">
                    <feature.icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Mockup Column */}
                <div
                  className={`lg:col-span-6 ${
                    isEven ? "lg:order-2 lg:col-start-7" : "lg:order-1"
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center justify-center bg-muted/20 border border-border/50 p-6 md:p-8 rounded-2xl"
                  >
                    {feature.mockup}
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
