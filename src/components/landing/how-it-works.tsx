"use client";

import { motion } from "framer-motion";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Install the SDK",
      description: "Run npm install @insightflow/sdk inside your project root, or include our tiny async HTML script tag.",
    },
    {
      num: "02",
      title: "Instrument Events",
      description: "Initialize client and start tracking page loads, user transitions, and custom click funnels with a single line.",
    },
    {
      num: "03",
      title: "Monitor in Real Time",
      description: "Open the InsightFlow dashboard to view immediate aggregated statistics, bounce metrics, and conversions.",
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-background border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">Integration</h2>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Get started in three steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="space-y-4"
            >
              <div className="text-4xl font-extrabold text-foreground/10 tracking-tight font-mono">
                {step.num}
              </div>
              <h3 className="text-base font-semibold text-foreground tracking-tight">
                {step.title}
              </h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
