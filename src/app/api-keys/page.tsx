"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { CardSection } from "@/components/shared/section-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { apiKeysData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Key,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  RefreshCw,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const envConfig: Record<string, { label: string; color: string; bg: string }> = {
  production: { label: "Production", color: "text-red-700", bg: "bg-red-50" },
  staging: { label: "Staging", color: "text-amber-700", bg: "bg-amber-50" },
  development: { label: "Development", color: "text-blue-700", bg: "bg-blue-50" },
};

export default function ApiKeysPage() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState<string | null>(null);

  const toggleReveal = (id: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const maskKey = (key: string) => {
    return key.slice(0, 12) + "••••••••••••••••" + key.slice(-4);
  };

  return (
    <AppLayout>
      <Header
        title="API Keys"
        description="Manage your tracking and API keys"
        actions={
          <Button size="sm" className="h-8 gap-1.5 text-[12px]">
            <Plus className="h-3.5 w-3.5" />
            Generate Key
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Total Keys", value: apiKeysData.length, icon: Key },
              { label: "Active Keys", value: apiKeysData.filter((k) => k.status === "active").length, icon: CheckCircle2 },
              { label: "Requests Today", value: apiKeysData.reduce((a, k) => a + k.requestsToday, 0).toLocaleString(), icon: Activity },
              { label: "Revoked", value: apiKeysData.filter((k) => k.status === "revoked").length, icon: AlertTriangle },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-lg border border-border bg-card px-4 py-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[12px] font-medium text-muted-foreground">{stat.label}</p>
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-[22px] font-semibold tabular-nums leading-none text-foreground">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Keys Table */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h3 className="text-[13px] font-semibold text-foreground">API Keys</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Keep your keys secure — never expose them in client-side code
                </p>
              </div>
            </div>

            <div className="divide-y divide-border">
              {apiKeysData.map((apiKey) => {
                const env = envConfig[apiKey.environment] || envConfig.development;
                const isRevealed = revealed.has(apiKey.id);
                const isCopied = copied === apiKey.id;
                const isRevoked = apiKey.status === "revoked";

                return (
                  <div
                    key={apiKey.id}
                    className={cn(
                      "p-4 transition-colors",
                      isRevoked ? "bg-muted/30" : "hover:bg-muted/10"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={cn(
                          "mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border",
                          isRevoked
                            ? "border-border bg-muted"
                            : "border-border bg-muted"
                        )}
                      >
                        <Key
                          className={cn(
                            "h-4 w-4",
                            isRevoked ? "text-muted-foreground/50" : "text-muted-foreground"
                          )}
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className={cn(
                              "text-[14px] font-semibold",
                              isRevoked ? "text-muted-foreground/60" : "text-foreground"
                            )}
                          >
                            {apiKey.name}
                          </span>
                          <StatusBadge status={apiKey.status} />
                          <span
                            className={cn(
                              "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded",
                              env.bg,
                              env.color
                            )}
                          >
                            {env.label}
                          </span>
                        </div>

                        <p className="text-[12px] text-muted-foreground mb-2">
                          {apiKey.project}
                        </p>

                        {/* API Key Display */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-1.5 font-mono text-[12px] text-foreground">
                            {isRevealed ? apiKey.key : maskKey(apiKey.key)}
                          </div>
                          {!isRevoked && (
                            <>
                              <button
                                onClick={() => toggleReveal(apiKey.id)}
                                className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background hover:bg-muted transition-colors"
                                title={isRevealed ? "Hide key" : "Reveal key"}
                              >
                                {isRevealed ? (
                                  <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                )}
                              </button>
                              <button
                                onClick={() => copyKey(apiKey.id, apiKey.key)}
                                className="flex h-7 items-center gap-1.5 rounded-md border border-border bg-background px-2 hover:bg-muted transition-colors"
                              >
                                {isCopied ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                )}
                                <span className="text-[11px] text-muted-foreground">
                                  {isCopied ? "Copied" : "Copy"}
                                </span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right side stats */}
                      <div className="flex-shrink-0 text-right space-y-2">
                        <div>
                          <p className="text-[11px] text-muted-foreground">Requests today</p>
                          <p className="text-[13px] font-semibold tabular-nums text-foreground">
                            {isRevoked ? "—" : apiKey.requestsToday.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground">Last used</p>
                          <p className="text-[12px] text-foreground">{apiKey.lastUsed}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground">Created</p>
                          <p className="text-[12px] text-foreground">{apiKey.created}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      {!isRevoked && (
                        <div className="flex-shrink-0 flex flex-col gap-1">
                          <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[11px]">
                            <RefreshCw className="h-3 w-3" />
                            Rotate
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1.5 text-[11px] text-destructive hover:text-destructive hover:bg-destructive/5"
                          >
                            <Trash2 className="h-3 w-3" />
                            Revoke
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Permissions */}
                    {!isRevoked && (
                      <div className="mt-3 flex items-center gap-2 ml-[52px]">
                        <span className="text-[11px] text-muted-foreground">Permissions:</span>
                        {apiKey.permissions.map((perm) => (
                          <span
                            key={perm}
                            className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[11px] font-mono text-muted-foreground"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Usage guide */}
          <CardSection
            title="Quick Installation"
            description="Add InsightFlow to your website with one script tag"
          >
            <div className="rounded-lg bg-[#0d1117] border border-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                <span className="text-[11px] font-medium text-gray-400">HTML</span>
                <button className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1">
                  <Copy className="h-3 w-3" />
                  Copy
                </button>
              </div>
              <pre className="px-4 py-3 text-[12px] font-mono text-gray-300 overflow-x-auto">
                <code>{`<script>
  window.insightflow=window.insightflow||[];
  (function(d){
    var s=d.createElement('script');
    s.async=true;
    s.src='https://cdn.insightflow.io/v1/track.min.js';
    s.setAttribute('data-key','if_live_pk_acm39xd82kl');
    d.head.appendChild(s);
  })(document);
</script>`}</code>
              </pre>
            </div>
          </CardSection>
        </div>
      </div>
    </AppLayout>
  );
}
