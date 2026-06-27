"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does InsightFlow track visits without cookies?",
      a: "InsightFlow creates a daily cryptographic hash from the client's IP address and User-Agent. This identifier resets automatically every 24 hours, meaning no personal information is persisted, and no cookie banner consent is legally required.",
    },
    {
      q: "Can I migrate historical data from other platforms?",
      a: "Yes, we support a simple import assistant that lets you authenticate with Google Analytics or export csv files to instantly reconstruct past visits, bounce metrics, and session views in InsightFlow.",
    },
    {
      q: "Is there a limit on custom conversion events?",
      a: "No. Custom conversion parameters and events are supported on all tiers. Events count directly towards your monthly account volume limits.",
    },
    {
      q: "Does the script affect loading speed?",
      a: "Our client tracker script is ultra-lightweight (less than 1KB gzipped) and loads asynchronously. It will not block the main thread or degrade LCP/INP web vital scores.",
    },
  ];

  return (
    <section id="faq" className="py-24 lg:py-32 bg-background border-t border-border/60">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">FAQ</h2>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            Frequently asked questions
          </p>
        </div>

        {/* Minimal Accordion List */}
        <div className="border-t border-border/60 divide-y divide-border/60">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between text-left py-2 font-medium text-foreground hover:text-primary transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-[14px] font-medium">{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-250 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <div className="pt-2 pb-4 text-[13px] text-muted-foreground leading-relaxed max-w-2xl">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
