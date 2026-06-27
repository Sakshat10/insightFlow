"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Cpu, Database, RefreshCw, BarChart2 } from "lucide-react";

export function WhyUs() {
  const points = [
    {
      title: "Fast",
      description: "Sub-millisecond data aggregation pipelines. Your dashboards update in real time without lag.",
      icon: Zap,
    },
    {
      title: "Secure",
      description: "GDPR, CCPA, and HIPAA compliance built-in. Data is fully encrypted in transit and at rest.",
      icon: ShieldCheck,
    },
    {
      title: "Developer Friendly",
      description: "Deploy in 5 minutes with our clean SDK. Ready-made React hooks and customizable components.",
      icon: Cpu,
    },
    {
      title: "Scalable",
      description: "Engineered to comfortably handle billions of events monthly. Grow from startup to enterprise smoothly.",
      icon: Database,
    },
    {
      title: "Reliable",
      description: "99.99% uptime SLA. Redundant databases ensure you never lose a single conversion event.",
      icon: RefreshCw,
    },
    {
      title: "Enterprise Ready",
      description: "Role-based access control, SSO, and dedicated support packages for demanding teams.",
      icon: BarChart2,
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-background relative border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column Sticky Header */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">Why InsightFlow</h2>
            <h3 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Engineered for absolute accuracy
            </h3>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              We started with a simple vision: build an analytics product that is ultra-fast, strictly respects privacy laws, and works flawlessly.
            </p>
          </div>

          {/* Right Column Grid of Points */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {points.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      <point.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-base mb-1">
                      {point.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
