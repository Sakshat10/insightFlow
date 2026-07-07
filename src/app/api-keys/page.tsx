"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { CardSection } from "@/components/shared/section-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useActiveProject } from "@/providers/ActiveProjectProvider";
import {
  useApiKeys,
  useApiKeyStats,
  useCreateApiKey,
  useRotateApiKey,
  useRevokeApiKey,
} from "@/features/api-keys/hooks/useApiKeys";
import { GenerateKeyModal } from "@/features/api-keys/components/generate-key-modal";
import { SecretKeyModal } from "@/features/api-keys/components/secret-key-modal";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { env } from "@/config/env";
import { buildInstallationSnippet } from "@/features/api-keys/utils/snippet";
import {
  Key,
  Copy,
  Plus,
  Trash2,
  RefreshCw,
  Activity,
  CheckCircle2,
  AlertCircle,
  Zap,
  Clock,
  Calendar,
  Terminal,
  Check,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { components } from "@/generated/openapi";

type ApiKeyResponse = components["schemas"]["ApiKeyResponse"];

const envConfig: Record<string, { label: string; color: string; bg: string }> = {
  PRODUCTION: { label: "Production", color: "text-rose-700 dark:text-rose-300", bg: "bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-800/30" },
  STAGING: { label: "Staging", color: "text-amber-700 dark:text-amber-300", bg: "bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30" },
  DEVELOPMENT: { label: "Development", color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/30" },
};

function formatRelativeTime(dateString: string | undefined | null): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (isNaN(diffMs)) return "Never";
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 10) return "Just now";
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ApiKeysPage() {
  const { activeProjectId } = useActiveProject();

  // Dialog and secret states
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [activeSecret, setActiveSecret] = useState<string | null>(null);
  const [isSecretRotation, setIsSecretRotation] = useState(false);

  // Confirmations
  const [rotatingKey, setRotatingKey] = useState<ApiKeyResponse | null>(null);
  const [revokingKey, setRevokingKey] = useState<ApiKeyResponse | null>(null);

  // Banners
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Copy local prefix feedback
  const [copiedPrefixId, setCopiedPrefixId] = useState<number | null>(null);

  // New framework snippet and custom events state
  const [activeTab, setActiveTab] = useState<"html" | "react" | "nextjs" | "vue" | "angular">("html");
  const [customEventsOpen, setCustomEventsOpen] = useState(false);
  const [copiedEventText, setCopiedEventText] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    if (successBanner) {
      const t = setTimeout(() => setSuccessBanner(null), 3000);
      return () => clearTimeout(t);
    }
  }, [successBanner]);

  useEffect(() => {
    if (errorBanner) {
      const t = setTimeout(() => setErrorBanner(null), 5000);
      return () => clearTimeout(t);
    }
  }, [errorBanner]);

  // Project Switch Cleanup
  const [prevProjectId, setPrevProjectId] = useState(activeProjectId);
  if (activeProjectId !== prevProjectId) {
    setPrevProjectId(activeProjectId);
    setIsGenerateOpen(false);
    setActiveSecret(null);
    setIsSecretRotation(false);
    setRotatingKey(null);
    setRevokingKey(null);
  }

  // Fetch real API Keys list & stats
  const { data: apiKeys = [], isLoading: listLoading, refetch: refetchList } =
    useApiKeys(activeProjectId || 0);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } =
    useApiKeyStats(activeProjectId || 0);

  // Mutations
  const createMutation = useCreateApiKey();
  const rotateMutation = useRotateApiKey(rotatingKey?.id || 0, activeProjectId || 0);
  const revokeMutation = useRevokeApiKey(revokingKey?.id || 0, activeProjectId || 0);

  // Empty state for active project
  if (!activeProjectId) {
    return (
      <AppLayout>
        <Header title="API Keys" description="Manage your tracking and API keys" />
        <div className="flex-1 overflow-y-auto flex items-center justify-center p-6 bg-slate-50/50 dark:bg-slate-950/20 animate-in fade-in duration-200">
          <div className="max-w-md w-full p-8 text-center bg-card border border-border rounded-xl shadow-sm space-y-4">
            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
            <h3 className="text-base font-bold text-foreground">No active project selected</h3>
            <p className="text-[13px] text-muted-foreground">
              Please select or create a project first using the dropdown switcher in the sidebar.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const handleGenerateKey = async (data: {
    name: string;
    environment: "PRODUCTION" | "STAGING" | "DEVELOPMENT";
    permissions: string[];
  }) => {
    try {
      const result = await createMutation.mutateAsync({
        projectId: activeProjectId || 0,
        name: data.name,
        environment: data.environment,
        permissions: data.permissions,
      });

      setSuccessBanner("API Key generated successfully.");
      setIsGenerateOpen(false);

      if (result.apiKey) {
        setIsSecretRotation(false);
        setActiveSecret(result.apiKey);
      }
    } catch (e: unknown) {
      setErrorBanner(e instanceof Error ? e.message : "Failed to generate API Key.");
    }
  };

  const handleRotateKey = async () => {
    if (!rotatingKey?.id) return;
    try {
      const result = await rotateMutation.mutateAsync();
      setSuccessBanner("API Key rotated successfully.");
      setRotatingKey(null);

      if (result.apiKey) {
        setIsSecretRotation(true);
        setActiveSecret(result.apiKey);
      }
    } catch (e: unknown) {
      setErrorBanner(e instanceof Error ? e.message : "Failed to rotate API Key.");
    }
  };

  const handleRevokeKey = async () => {
    if (!revokingKey?.id) return;
    try {
      await revokeMutation.mutateAsync();
      setSuccessBanner("API Key revoked successfully.");
      setRevokingKey(null);
    } catch (e: unknown) {
      setErrorBanner(e instanceof Error ? e.message : "Failed to revoke API Key.");
    }
  };

  const handleCopyPrefix = (keyId: number, prefix: string | undefined) => {
    if (!prefix) return;
    navigator.clipboard.writeText(prefix);
    setCopiedPrefixId(keyId);
    setTimeout(() => setCopiedPrefixId(null), 1500);
  };

  const activeKeysCount = apiKeys.filter((k) => k.status === "ACTIVE").length;
  const revokedKeysCount = apiKeys.filter((k) => k.status === "REVOKED").length;
  const displayKey = activeSecret || "ENTER_YOUR_API_KEY_HERE";

  return (
    <AppLayout>
      <Header
        title="API Keys"
        description="Manage your tracking and API keys"
        actions={
          <Button
            size="sm"
            onClick={() => setIsGenerateOpen(true)}
            className="h-8 gap-1.5 text-[12px] bg-primary hover:bg-primary/95 shadow-sm transition-all duration-200"
          >
            <Plus className="h-3.5 w-3.5" />
            Generate Key
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/20">
        <div className="p-6 space-y-6">
          {/* Success / Error Banners */}
          {successBanner && (
            <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-300 text-[13px] rounded-xl shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>{successBanner}</span>
            </div>
          )}

          {errorBanner && (
            <div className="flex items-center gap-2.5 p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/30 text-rose-800 dark:text-rose-300 text-[13px] rounded-xl shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4.5 w-4.5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <span>{errorBanner}</span>
            </div>
          )}

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                label: "Total Keys",
                value: statsLoading ? "..." : stats?.totalKeys ?? apiKeys.length,
                icon: Key,
                gradient: "from-blue-500/8 to-indigo-500/8 border-blue-100 dark:border-blue-900/30",
                iconWrapper: "bg-blue-100/60 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
              },
              {
                label: "Active Keys",
                value: statsLoading ? "..." : stats?.activeKeys ?? activeKeysCount,
                icon: CheckCircle2,
                gradient: "from-emerald-500/8 to-teal-500/8 border-emerald-100 dark:border-emerald-900/30",
                iconWrapper: "bg-emerald-100/60 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
              },
              {
                label: "Total Requests",
                value: statsLoading ? "..." : stats?.totalRequests?.toLocaleString() ?? "0",
                icon: Activity,
                gradient: "from-purple-500/8 to-pink-500/8 border-purple-100 dark:border-purple-900/30",
                iconWrapper: "bg-purple-100/60 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
              },
              {
                label: "Revoked Keys",
                value: statsLoading ? "..." : stats?.revokedKeys ?? revokedKeysCount,
                icon: AlertCircle,
                gradient: "from-rose-500/8 to-orange-500/8 border-rose-100 dark:border-rose-900/30",
                iconWrapper: "bg-rose-100/60 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={cn(
                    "rounded-xl border bg-gradient-to-br bg-card px-4 py-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5",
                    stat.gradient
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[12px] font-medium text-muted-foreground">{stat.label}</p>
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg shadow-inner", stat.iconWrapper)}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="text-[26px] font-bold tracking-tight tabular-nums leading-none text-foreground">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Keys Grid Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-bold text-foreground">Active & Revoked Keys</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Secure access keys to integrate InsightFlow clients and backend systems
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  refetchList();
                  refetchStats();
                }}
                className="h-8 text-[12px] gap-1.5 shadow-sm"
                disabled={listLoading}
              >
                <RefreshCw className={cn("h-3.5 w-3.5", listLoading && "animate-spin")} />
                Refresh
              </Button>
            </div>

            {listLoading ? (
              <div className="grid grid-cols-1 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-28 bg-card border border-border animate-pulse rounded-xl" />
                ))}
              </div>
            ) : apiKeys.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-xl shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4 shadow-inner">
                  <Zap className="h-6 w-6" />
                </div>
                <p className="text-[15px] font-bold text-foreground">No API keys generated</p>
                <p className="text-[12px] text-muted-foreground mt-1 mb-6 max-w-sm">
                  Generate your first API key to start tracking custom event payloads and authenticating requests.
                </p>
                <Button size="sm" onClick={() => setIsGenerateOpen(true)} className="h-8 shadow-sm">
                  Generate Key
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {apiKeys.map((key) => {
                  const env = envConfig[key.environment || "DEVELOPMENT"] || envConfig.DEVELOPMENT;
                  const isRevoked = key.status === "REVOKED";

                  return (
                    <div
                      key={key.id}
                      className={cn(
                        "group relative rounded-xl border bg-card p-5 transition-all duration-300 shadow-sm hover:shadow-md",
                        isRevoked 
                          ? "border-border/60 bg-muted/10 opacity-75" 
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <div className="flex flex-col gap-5 md:flex-row md:items-start justify-between">
                        {/* Title, Badge & Key Prefix display */}
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          <div className={cn(
                            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border shadow-inner",
                            isRevoked 
                              ? "bg-muted/80 text-muted-foreground/60 border-border/80" 
                              : "bg-primary/5 text-primary border-primary/10"
                          )}>
                            <Key className="h-5 w-5" />
                          </div>

                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[15px] font-bold text-foreground truncate max-w-[250px]">
                                {key.name}
                              </span>
                              <span
                                className={cn(
                                  "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
                                  env.bg,
                                  env.color
                                )}
                              >
                                {env.label}
                              </span>
                              <StatusBadge status={key.status === "ACTIVE" ? "active" : "revoked"} />
                            </div>

                            {/* Masked Prefix Display with Custom copy feedback */}
                            <div className="flex items-center gap-2">
                              <div className="rounded-lg border border-border/80 bg-muted/40 px-3 py-1 font-mono text-[12px] text-foreground font-medium select-all shadow-inner">
                                {key.keyPrefix || "if_live_pk_••••"}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyPrefix(key.id || 0, key.keyPrefix)}
                                className={cn(
                                  "h-7 px-2.5 text-[11px] gap-1.5 transition-all duration-200",
                                  copiedPrefixId === key.id && "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/30"
                                )}
                              >
                                <Copy className="h-3.5 w-3.5" />
                                <span>{copiedPrefixId === key.id ? "Copied" : "Copy Prefix"}</span>
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Usage statistics grid */}
                        <div className="grid grid-cols-3 gap-6 flex-shrink-0 text-left md:text-right px-1 md:px-0">
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">
                              Requests
                            </p>
                            <p className="text-[14px] font-semibold text-foreground tabular-nums">
                              {key.requestCount?.toLocaleString() || "0"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">
                              Last used
                            </p>
                            <p className="text-[13px] text-foreground font-medium flex items-center md:justify-end gap-1">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground/75" />
                              {formatRelativeTime(key.lastUsedAt)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">
                              Created
                            </p>
                            <p className="text-[13px] text-foreground font-medium flex items-center md:justify-end gap-1">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground/75" />
                              {formatDate(key.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom row: permissions + actions */}
                      <div className="mt-4 pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {key.permissions && key.permissions.length > 0 ? (
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-semibold text-muted-foreground">Permissions:</span>
                            {key.permissions.map((perm) => (
                              <span
                                key={perm}
                                className="rounded-md bg-muted border border-border/50 px-2 py-0.5 text-[10px] font-mono font-medium text-muted-foreground"
                              >
                                {perm}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[11px] text-muted-foreground italic">No specific permissions.</div>
                        )}

                        {!isRevoked && (
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setRotatingKey(key)}
                              className="h-7 text-[11px] gap-1 px-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            >
                              <RefreshCw className="h-3 w-3" />
                              Rotate
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setRevokingKey(key)}
                              className="h-7 text-[11px] gap-1 px-2.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/20"
                            >
                              <Trash2 className="h-3 w-3" />
                              Revoke
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick installation snippet guide */}
          <CardSection
            title="Quick Installation"
            description="Add InsightFlow to your website with one script tag"
          >
            <div className="space-y-5">
                {/* Warning banner + Raw Key Display: only shown when a new key was just generated/rotated */}
                {activeSecret && (
                  <>
                    <div className="flex gap-3 p-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-800/30 rounded-xl text-amber-800 dark:text-amber-300 text-[12.5px] leading-relaxed">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1 text-left">
                        <span className="font-bold block">Security Warning</span>
                        <span>This API key is shown only once. Copy it now and store it securely. For security reasons, you will not be able to view it again once this view is cleared.</span>
                      </div>
                    </div>

                    {/* Raw Key Display */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        Raw API Key
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 rounded-lg border border-border bg-muted/40 px-3 py-2 font-mono text-[12px] text-foreground font-medium select-all shadow-inner break-all">
                          {activeSecret}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(activeSecret);
                            setCopiedKey(true);
                            setTimeout(() => setCopiedKey(false), 2000);
                          }}
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
                  </>
                )}

                {/* Quick Installation Section — always visible */}
                <div className="space-y-3">
                  {/* Info Box */}
                  <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 rounded-xl text-[12.5px] text-slate-600 dark:text-slate-300 leading-relaxed text-left">
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
                        onClick={() => {
                          const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || (import.meta as any).env?.VITE_API_BASE_URL || env.apiBaseUrl || "http://localhost:8080";
                          const scriptTag = `<script src="${apiBaseUrl}/tracking/script/${displayKey}"></script>`;
                          navigator.clipboard.writeText(scriptTag);
                          setCopiedSnippet(true);
                          setTimeout(() => setCopiedSnippet(false), 2000);
                        }}
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
                    <pre className="px-5 py-4 text-[12px] font-mono text-slate-300 overflow-x-auto leading-relaxed select-all text-left">
                      <code>{`<script src="${process.env.NEXT_PUBLIC_API_BASE_URL || (import.meta as any).env?.VITE_API_BASE_URL || env.apiBaseUrl || "http://localhost:8080"}/tracking/script/${displayKey}"></script>`}</code>
                    </pre>
                  </div>
                </div>

                {/* Integration Guide Tabs */}
                <div className="space-y-3 pt-2 text-left">
                  <div className="flex border-b border-border gap-1 overflow-x-auto">
                    {[
                      { id: "html", label: "HTML" },
                      { id: "react", label: "React (Vite)" },
                      { id: "nextjs", label: "Next.js" },
                      { id: "vue", label: "Vue" },
                      { id: "angular", label: "Angular" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
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
  <script src="${process.env.NEXT_PUBLIC_API_BASE_URL || (import.meta as any).env?.VITE_API_BASE_URL || env.apiBaseUrl || "http://localhost:8080"}/tracking/script/${displayKey}"></script>
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
  script.src = "${process.env.NEXT_PUBLIC_API_BASE_URL || (import.meta as any).env?.VITE_API_BASE_URL || env.apiBaseUrl || "http://localhost:8080"}/tracking/script/${displayKey}";
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
                        <p className="text-[12.5px] text-muted-foreground">Use inside <code className="font-mono text-[11px] bg-muted px-1 rounded">app/layout.tsx</code> (App Router) or <code className="font-mono text-[11px] bg-muted px-1 rounded">pages/_app.tsx</code> (Pages Router) depending on your Next.js setup.</p>
                        <pre className="p-3 bg-muted/60 border border-border rounded-lg font-mono text-[11.5px] text-foreground overflow-x-auto mt-2">
{`import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="${process.env.NEXT_PUBLIC_API_BASE_URL || (import.meta as any).env?.VITE_API_BASE_URL || env.apiBaseUrl || "http://localhost:8080"}/tracking/script/${displayKey}"
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
  script.src = "${process.env.NEXT_PUBLIC_API_BASE_URL || (import.meta as any).env?.VITE_API_BASE_URL || env.apiBaseUrl || "http://localhost:8080"}/tracking/script/${displayKey}";
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
                        <p className="text-[12.5px] text-muted-foreground">Place the snippet inside <code className="font-mono text-[11px] bg-muted px-1 rounded">src/index.html</code> immediately before the closing <code className="font-mono text-[11px] bg-muted px-1 rounded">&lt;/head&gt;</code> tag.</p>
                        <pre className="p-3 bg-muted/60 border border-border rounded-lg font-mono text-[11.5px] text-foreground overflow-x-auto mt-2">
{`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My Angular Application</title>
  <base href="/">
  <script src="${process.env.NEXT_PUBLIC_API_BASE_URL || (import.meta as any).env?.VITE_API_BASE_URL || env.apiBaseUrl || "http://localhost:8080"}/tracking/script/${displayKey}"></script>
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
                <div className="border border-border rounded-xl overflow-hidden bg-card mt-2 text-left">
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
                                    onClick={() => {
                                      navigator.clipboard.writeText(item.code);
                                      setCopiedEventText(item.code);
                                      setTimeout(() => setCopiedEventText(null), 2000);
                                    }}
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

                {/* Done button: only shown after a new key is revealed */}
                {activeSecret && (
                  <div className="flex justify-end gap-2 pt-3 border-t border-border mt-4">
                    <Button
                      size="sm"
                      onClick={() => setActiveSecret(null)}
                      className="h-8 text-[12px] px-6 bg-primary hover:bg-primary/95 text-primary-foreground shadow-sm"
                    >
                      Done
                    </Button>
                  </div>
                )}
              </div>
          </CardSection>
        </div>
      </div>

      {/* Generate API Key Form Modal */}
      <GenerateKeyModal
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        onGenerate={handleGenerateKey}
        isGenerating={createMutation.isPending}
      />

      {/* Rotation Confirmation Dialog */}
      <ConfirmDialog
        isOpen={rotatingKey !== null}
        onClose={() => setRotatingKey(null)}
        onConfirm={handleRotateKey}
        title="Rotate API Key?"
        description={`Rotating "${rotatingKey?.name || ""}" will invalidate the current key and generate a new secret. Applications using the old key must be updated.`}
        confirmText="Rotate Key"
        isConfirming={rotateMutation.isPending}
      />

      {/* Revoke Confirmation Dialog */}
      <ConfirmDialog
        isOpen={revokingKey !== null}
        onClose={() => setRevokingKey(null)}
        onConfirm={handleRevokeKey}
        title="Revoke API Key?"
        description={`"${revokingKey?.name || ""}" will stop working immediately. Applications using this key will no longer be able to authenticate. This action cannot be undone.`}
        confirmText="Revoke Key"
        isConfirming={revokeMutation.isPending}
      />
    </AppLayout>
  );
}
