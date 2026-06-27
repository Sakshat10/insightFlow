"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      description: "For simple personal sites and developers.",
      features: ["10k tracked events/mo", "1 custom domain", "6-month data retention", "Community channels"],
      cta: "Start Free",
    },
    {
      name: "Pro",
      price: "$29",
      description: "For scaling businesses wanting deep insights.",
      features: ["500k tracked events/mo", "Unlimited domains", "24-month retention", "Conversion funnels", "Email support"],
      cta: "Get Started",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Dedicated resources for large teams.",
      features: ["Unlimited event volume", "SLA guarantees", "SSO/SAML integration", "Dedicated support manager", "Custom data exports"],
      cta: "Contact Sales",
    },
  ];

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-muted/10 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">Pricing</h2>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Simple plans, built to scale
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{plan.name}</span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold tracking-tight text-foreground">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-xs text-muted-foreground">/mo</span>}
                </div>
                <p className="mt-2 text-[12px] text-muted-foreground min-h-[32px]">{plan.description}</p>

                <ul className="mt-6 space-y-3 border-t border-border/60 pt-6">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-[12px] text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href="/register"
                  className={cn(
                    buttonVariants({ variant: plan.name === "Pro" ? "default" : "outline", size: "sm" }),
                    "w-full justify-center h-9 text-[12px] rounded-md font-medium"
                  )}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
