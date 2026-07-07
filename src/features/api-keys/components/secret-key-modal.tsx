"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2, AlertTriangle, Terminal, ChevronDown, Check } from "lucide-react";
import { env } from "@/config/env";
import { motion, AnimatePresence } from "framer-motion";

interface SecretKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  isRotation?: boolean;
}

type TabType = "html" | "react" | "nextjs" | "vue" | "angular";

export function SecretKeyModal({
  isOpen,
  onClose,
  apiKey,
  isRotation = false,
}: SecretKeyModalProps) {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("html");
  const [customEventsOpen, setCustomEventsOpen] = useState(false);
  const [copiedEventText, setCopiedEventText] = useState<string | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || (import.meta as any).env?.VITE_API_BASE_URL || env.apiBaseUrl || "http://localhost:8080";
  const scriptTag = `<script src="${apiBaseUrl}/tracking/script/${apiKey}"></script>`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(scriptTag);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyEvent = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEventText(text);
    setTimeout(() => setCopiedEventText(null), 2000);
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "html", label: "HTML" },
    { id: "react", label: "React (Vite)" },
    { id: "nextjs", label: "Next.js" },
    { id: "vue", label: "Vue" },
    { id: "angular", label: "Angular" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl w-full p-6 rounded-xl bg-card border border-border max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-3 border-b border-border">
          <DialogTitle className="text-[16px] font-semibold text-foreground">
            {isRotation ? "API Key Rotated Successfully" : "API Key Created Successfully"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-4">
          {/* Warning banner */}
          <div className="flex gap-3 p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-800/30 rounded-xl text-amber-800 dark:text-amber-300 text-[12.5px] leading-relaxed">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Security Warning</span>
              <span>This API key is shown only once. Copy it now and store it securely. For security reasons, you will not be able to view it again once this dialog is closed.</span>
            </div>
          </div>

          {/* Raw Key Display */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Raw API Key
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border border-border bg-muted/40 px-3 py-2 font-mono text-[12px] text-foreground font-medium select-all shadow-inner break-all">
                {apiKey}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyKey}
                className="h-8 text-[12px] gap-1.5 flex-shrink-0"
              >
                {copiedKey ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Key
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Installation Section */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Quick Installation
            </label>

            {/* Info Box */}
            <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 rounded-xl text-[12.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Install this script once in your website's global HTML layout (preferably before <code className="font-mono text-[11.5px] bg-muted px-1 py-0.5 rounded">&lt;/head&gt;</code>). Once installed, InsightFlow automatically tracks visitors, sessions, page views, navigation, browser information, and sends analytics to your project.
            </div>

            {/* Snippet Block */}
            <div className="rounded-xl bg-slate-950 border border-slate-800 shadow-lg overflow-hidden mt-3">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/80 bg-slate-900/60">
                <div className="flex items-center gap-2 text-slate-400">
                  <Terminal className="h-3.5 w-3.5" />
                  <span className="text-[11px] font-mono tracking-tight font-medium">Tracking Script Snippet</span>
                </div>
                <button
                  onClick={handleCopySnippet}
                  className="text-[11px] text-slate-400 hover:text-slate-100 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-all"
                >
                  {copiedSnippet ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Snippet
                    </>
                  )}
                </button>
              </div>
              <pre className="px-5 py-4 text-[12px] font-mono text-slate-300 overflow-x-auto leading-relaxed select-all">
                <code>{scriptTag}</code>
              </pre>
            </div>
          </div>

          {/* Integration Guide Tabs */}
          <div className="space-y-3 pt-2">
            <div className="flex border-b border-border gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 text-[13px] font-medium border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-1 min-h-[140px]">
              {activeTab === "html" && (
                <div className="space-y-2 animate-in fade-in duration-250">
                  <h4 className="text-[13px] font-bold text-foreground">HTML Installation</h4>
                  <p className="text-[12.5px] text-muted-foreground">Paste this script immediately before the closing <code className="font-mono text-[11px] bg-muted px-1 rounded">&lt;/head&gt;</code> tag.</p>
                  <pre className="p-3 bg-muted/60 border border-border rounded-lg font-mono text-[12px] text-foreground overflow-x-auto">
                    {`<html>
<head>
  <!-- Other head elements -->
  <script src="${apiBaseUrl}/tracking/script/${apiKey}"></script>
</head>
<body>
...`}
                  </pre>
                </div>
              )}

              {activeTab === "react" && (
                <div className="space-y-2 animate-in fade-in duration-250">
                  <h4 className="text-[13px] font-bold text-foreground">React (Vite) Installation</h4>
                  <p className="text-[12.5px] text-muted-foreground"><span className="font-bold">Primary Recommendation:</span> Place the script inside <code className="font-mono text-[11px] bg-muted px-1 rounded">public/index.html</code> before the closing <code className="font-mono text-[11.5px]">&lt;/head&gt;</code> tag.</p>
                  <p className="text-[12px] text-muted-foreground italic mt-1">Using public/index.html is preferred.</p>
                  <div className="pt-2 border-t border-border mt-3">
                    <p className="text-[12.5px] text-muted-foreground">Alternative dynamic initialization using React hook:</p>
                    <pre className="p-3 bg-muted/60 border border-border rounded-lg font-mono text-[11.5px] text-foreground overflow-x-auto mt-2">
{`import { useEffect } from "react";

// Inside your main App component or layout
useEffect(() => {
  const script = document.createElement("script");
  script.src = "${apiBaseUrl}/tracking/script/${apiKey}";
  script.async = true;
  document.head.appendChild(script);

  return () => {
    document.head.removeChild(script);
  };
}, []);`}
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === "nextjs" && (
                <div className="space-y-2 animate-in fade-in duration-250">
                  <h4 className="text-[13px] font-bold text-foreground">Next.js Installation</h4>
                  <p className="text-[12.5px] text-muted-foreground">Use inside <code className="font-mono text-[11px] bg-muted px-1 rounded">app/layout.tsx</code> (App Router) or <code className="font-mono text-[11px] bg-muted px-1 rounded">pages/_app.tsx</code> (Pages Router) depending on your version.</p>
                  <pre className="p-3 bg-muted/60 border border-border rounded-lg font-mono text-[11.5px] text-foreground overflow-x-auto mt-2">
{`import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="${apiBaseUrl}/tracking/script/${apiKey}"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}`}
                  </pre>
                </div>
              )}

              {activeTab === "vue" && (
                <div className="space-y-2 animate-in fade-in duration-250">
                  <h4 className="text-[13px] font-bold text-foreground">Vue Installation</h4>
                  <p className="text-[12.5px] text-slate-600 dark:text-slate-300"><span className="font-bold">Preferred:</span> Add the script tag in <code className="font-mono text-[11px] bg-muted px-1 rounded">public/index.html</code>.</p>
                  <div className="pt-2 border-t border-border mt-3">
                    <p className="text-[12.5px] text-muted-foreground">Alternative initialization inside Vue component lifecycle:</p>
                    <pre className="p-3 bg-muted/60 border border-border rounded-lg font-mono text-[11.5px] text-foreground overflow-x-auto mt-2">
{`mounted() {
  const script = document.createElement("script");
  script.src = "${apiBaseUrl}/tracking/script/${apiKey}";
  script.async = true;
  document.head.appendChild(script);
}`}
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === "angular" && (
                <div className="space-y-2 animate-in fade-in duration-250">
                  <h4 className="text-[13px] font-bold text-foreground">Angular Installation</h4>
                  <p className="text-[12.5px] text-muted-foreground">Place the script snippet inside <code className="font-mono text-[11px] bg-muted px-1 rounded">src/index.html</code> immediately before the closing <code className="font-mono text-[11px] bg-muted px-1 rounded">&lt;/head&gt;</code> tag.</p>
                  <pre className="p-3 bg-muted/60 border border-border rounded-lg font-mono text-[11.5px] text-foreground overflow-x-auto mt-2">
{`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My Angular Application</title>
  <base href="/">
  <script src="${apiBaseUrl}/tracking/script/${apiKey}"></script>
</head>
<body>
  <app-root></app-root>
</body>
</html>`}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Track Custom Events Accordion */}
          <div className="border border-border rounded-xl overflow-hidden bg-card mt-2">
            <button
              onClick={() => setCustomEventsOpen(!customEventsOpen)}
              className="flex w-full items-center justify-between text-left px-4 py-3 font-semibold text-[13.5px] text-foreground hover:bg-muted/30 transition-colors"
            >
              <span>Track Custom Events</span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                  customEventsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {customEventsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <div className="px-4 pb-4 pt-1 text-[12.5px] text-muted-foreground leading-relaxed space-y-3 border-t border-border/40">
                    <p>
                      Automatic tracking already includes: <span className="font-semibold text-emerald-600 dark:text-emerald-400">✓ Sessions</span>, <span className="font-semibold text-emerald-600 dark:text-emerald-400">✓ Page Views</span>, and <span className="font-semibold text-emerald-600 dark:text-emerald-400">✓ Navigation</span>. Business-specific actions must be tracked manually.
                    </p>

                    <div className="space-y-2 pt-2">
                      {[
                        {
                          label: "Track a simple action:",
                          code: `window.InsightFlow.track("signup");`,
                        },
                        {
                          label: "Track with properties:",
                          code: `window.InsightFlow.track("add_to_cart", {\n  productId: "123",\n  price: 499\n});`,
                        },
                        {
                          label: "Track high-value conversion:",
                          code: `window.InsightFlow.track("purchase", {\n  orderId: "ORD-1001",\n  revenue: 4999\n});`,
                        },
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <span className="text-[11px] font-semibold text-foreground/80 block">{item.label}</span>
                          <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg border border-border/80 font-mono text-[11px] text-foreground">
                            <code className="flex-1 whitespace-pre-wrap">{item.code}</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyEvent(item.code)}
                              className="h-7 w-7 p-0 flex-shrink-0"
                            >
                              {copiedEventText === item.code ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-muted/40 border border-border rounded-xl text-[12px] text-muted-foreground italic mt-3">
                      Use <code className="font-mono text-[11.5px] bg-muted px-1 py-0.5 rounded">window.InsightFlow.track()</code> whenever meaningful business actions occur, such as purchases, signups, button clicks, or form submissions.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border mt-4">
            <Button size="sm" onClick={onClose} className="h-8 text-[12px] px-6 bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


