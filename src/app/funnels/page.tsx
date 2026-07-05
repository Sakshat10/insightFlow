"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActiveProject } from "@/providers/ActiveProjectProvider";
import {
  useEventAnalytics,
  useFunnelAnalytics,
  useSavedFunnels,
  useCreateFunnel,
  useUpdateFunnel,
  useDeleteFunnel,
  FunnelBuilder,
} from "@/features/analytics";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  TrendingDown,
  ArrowDown,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  AlertCircle,
  Zap,
  ChevronRight,
  ArrowLeft,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { components } from "@/generated/openapi";

type FunnelResponse = components["schemas"]["FunnelResponse"];

interface FunnelStep {
  step?: number;
  eventName?: string;
  sessions?: number;
  conversionFromPrevious?: number;
  conversionFromEntry?: number;
  dropOffSessions?: number;
  dropOffRate?: number;
}

export default function FunnelsPage() {
  const { activeProjectId } = useActiveProject();

  // Load event options to check if project has tracked events
  const { data: eventAnalytics = [], isLoading: eventsLoading } =
    useEventAnalytics(activeProjectId || 0);

  const hasNoEvents = !eventsLoading && eventAnalytics.length === 0;

  // Active saved funnel chosen for analytics
  const [activeSavedFunnel, setActiveSavedFunnel] = useState<FunnelResponse | null>(null);

  // Default dates: latest 7 days
  const getDefaultDates = () => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 7);
    return {
      from: fromDate.toISOString().split("T")[0],
      to: toDate.toISOString().split("T")[0],
    };
  };

  const defaultDates = getDefaultDates();
  const [from, setFrom] = useState(defaultDates.from);
  const [to, setTo] = useState(defaultDates.to);

  // Modals & Confirm Dialog state
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingFunnel, setEditingFunnel] = useState<FunnelResponse | null>(null);
  const [deletingFunnel, setDeletingFunnel] = useState<FunnelResponse | null>(null);

  // Success/Error banners
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Auto-dismiss banners
  useEffect(() => {
    if (successBanner) {
      const t = setTimeout(() => setSuccessBanner(null), 3500);
      return () => clearTimeout(t);
    }
  }, [successBanner]);

  useEffect(() => {
    if (errorBanner) {
      const t = setTimeout(() => setErrorBanner(null), 5000);
      return () => clearTimeout(t);
    }
  }, [errorBanner]);

  // Load saved funnels for active project
  const { data: savedFunnels = [], isLoading: listLoading, refetch: refetchList } =
    useSavedFunnels(activeProjectId || 0);

  // Reset page state on project switch
  const [prevProjectId, setPrevProjectId] = useState(activeProjectId);
  if (activeProjectId !== prevProjectId) {
    setPrevProjectId(activeProjectId);
    setActiveSavedFunnel(null);
    setIsBuilderOpen(false);
    setEditingFunnel(null);
    setDeletingFunnel(null);
  }

  // Hook for querying funnel analytics
  const activeSteps = activeSavedFunnel?.steps
    ? [...activeSavedFunnel.steps]
        .sort((a, b) => (a.stepOrder || 0) - (b.stepOrder || 0))
        .map((s) => s.eventName || "")
        .filter(Boolean)
    : [];

  const {
    data: funnelDataResponse,
    isLoading: isAnalyzing,
    isError: analyticsError,
    error: analyticsErrorData,
    refetch: refetchAnalytics,
  } = useFunnelAnalytics({
    projectId: activeProjectId || 0,
    from,
    to,
    steps: activeSteps,
    enabled: activeSavedFunnel !== null && activeSteps.length >= 2,
  });

  // Mutations
  const createMutation = useCreateFunnel();
  const updateMutation = useUpdateFunnel(editingFunnel?.id || 0);
  const deleteMutation = useDeleteFunnel(deletingFunnel?.id || 0, activeProjectId || 0);

  const handleSaveFunnelDefinition = async (data: {
    name: string;
    description: string;
    steps: string[];
  }) => {
    const stepRequests = data.steps.map((eventName, idx) => ({
      eventName,
      stepOrder: idx + 1,
    }));

    try {
      if (editingFunnel?.id) {
        const updated = await updateMutation.mutateAsync({
          name: data.name,
          description: data.description,
          steps: stepRequests,
        });
        setSuccessBanner("Funnel updated successfully.");
        // If the updated funnel is currently viewed, reload it
        if (activeSavedFunnel?.id === editingFunnel.id) {
          setActiveSavedFunnel(updated);
        }
      } else {
        await createMutation.mutateAsync({
          projectId: activeProjectId || 0,
          name: data.name,
          description: data.description,
          steps: stepRequests,
        });
        setSuccessBanner("Funnel created successfully.");
      }
      setIsBuilderOpen(false);
      setEditingFunnel(null);
    } catch (e: unknown) {
      setErrorBanner(e instanceof Error ? e.message : "Failed to save funnel definition.");
    }
  };

  const handleDeleteFunnelDefinition = async () => {
    if (!deletingFunnel?.id) return;
    try {
      await deleteMutation.mutateAsync();
      setSuccessBanner("Funnel deleted successfully.");
      if (activeSavedFunnel?.id === deletingFunnel.id) {
        setActiveSavedFunnel(null);
      }
      setDeletingFunnel(null);
    } catch (e: unknown) {
      setErrorBanner(e instanceof Error ? e.message : "Failed to delete funnel.");
    }
  };

  const handleOpenAnalytics = (funnel: FunnelResponse) => {
    setActiveSavedFunnel(funnel);
    const dates = getDefaultDates();
    setFrom(dates.from);
    setTo(dates.to);
  };

  // Maps backend biggestDropOffStep to UI representation inside the Summary Card
  const renderBiggestDropoffCard = (
    biggestDropOffStep: number | undefined | null,
    steps: FunnelStep[]
  ) => {
    if (!biggestDropOffStep || biggestDropOffStep < 1 || biggestDropOffStep >= steps.length) {
      return (
        <span className="text-[12px] font-semibold text-muted-foreground">
          No drop-off data
        </span>
      );
    }
    const fromIndex = biggestDropOffStep - 1;
    const fromStep = steps[fromIndex];
    const toStep = steps[fromIndex + 1];

    if (!fromStep || !toStep) {
      return (
        <span className="text-[12px] font-semibold text-muted-foreground">
          No drop-off data
        </span>
      );
    }

    return (
      <div className="space-y-0.5">
        <div className="flex items-center gap-1 text-[13px] font-bold text-red-600 truncate max-w-[200px]">
          <span>{fromStep.eventName}</span>
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-red-400" />
          <span>{toStep.eventName}</span>
        </div>
        <p className="text-[11px] text-red-500 font-medium">
          {(fromStep.dropOffSessions ?? 0).toLocaleString()} sessions dropped ({fromStep.dropOffRate ?? 0}%)
        </p>
      </div>
    );
  };

  return (
    <AppLayout>
      <Header
        title="Funnels"
        description="Analyze ordered user journeys and identify where sessions drop off."
        actions={
          !hasNoEvents &&
          !activeSavedFunnel && (
            <Button
              onClick={() => {
                setEditingFunnel(null);
                setIsBuilderOpen(true);
              }}
              className="h-8 gap-1 text-[12px]"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Funnel
            </Button>
          )
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Success / Error Banners */}
          {successBanner && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] rounded-lg">
              <Info className="h-4 w-4 text-emerald-600" />
              <span>{successBanner}</span>
            </div>
          )}

          {errorBanner && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-800 text-[13px] rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span>{errorBanner}</span>
            </div>
          )}

          {/* No events tracked banner */}
          {hasNoEvents ? (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-lg bg-muted/5 max-w-lg mx-auto mt-12">
              <AlertCircle className="h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-[14px] font-medium text-foreground">
                No events have been tracked for this project yet
              </p>
              <p className="text-[12px] text-muted-foreground text-center mt-1">
                Track events before creating a funnel.
              </p>
            </div>
          ) : !activeSavedFunnel ? (
            /* STATE 1: Saved Funnels listing view */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[14px] font-semibold text-foreground">
                  Saved Funnel Definitions
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetchList()}
                  className="h-7 text-[12px] gap-1"
                  disabled={listLoading}
                >
                  <RefreshCw className={cn("h-3 w-3", listLoading && "animate-spin")} />
                  Refresh List
                </Button>
              </div>

              {listLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-muted animate-pulse rounded-lg border border-border" />
                  ))}
                </div>
              ) : savedFunnels.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-lg bg-muted/5 max-w-lg mx-auto mt-12">
                  <Zap className="h-8 w-8 text-primary mb-3" />
                  <p className="text-[14px] font-medium text-foreground">
                    No funnels yet
                  </p>
                  <p className="text-[12px] text-muted-foreground text-center mt-1 mb-6">
                    Create your first funnel to analyze where sessions drop off.
                  </p>
                  <Button
                    onClick={() => {
                      setEditingFunnel(null);
                      setIsBuilderOpen(true);
                    }}
                    size="sm"
                    className="h-8"
                  >
                    Create Funnel
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedFunnels.map((funnel) => {
                    const sortedSteps = [...(funnel.steps || [])].sort(
                      (a, b) => (a.stepOrder || 0) - (b.stepOrder || 0)
                    );
                    return (
                      <div
                        key={funnel.id}
                        className="rounded-lg border border-border bg-card p-4 flex flex-col justify-between hover:border-primary/30 hover:shadow-xs transition-all space-y-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-[14px] font-bold text-foreground truncate">
                              {funnel.name}
                            </h3>
                            <span className="text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                              {sortedSteps.length} steps
                            </span>
                          </div>
                          {funnel.description && (
                            <p className="text-[12px] text-muted-foreground line-clamp-2">
                              {funnel.description}
                            </p>
                          )}
                        </div>

                        {/* Visual Path chips */}
                        <div className="flex items-center gap-1 flex-wrap py-1">
                          {sortedSteps.map((s, idx) => (
                            <div key={s.id || idx} className="flex items-center gap-1 text-[11px] font-mono">
                              {idx > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/60" />}
                              <span className="bg-muted px-1.5 py-0.5 rounded leading-none text-foreground">
                                {s.eventName}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/60">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => {
                                setEditingFunnel(funnel);
                                setIsBuilderOpen(true);
                              }}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setDeletingFunnel(funnel)}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>

                          <Button
                            size="sm"
                            onClick={() => handleOpenAnalytics(funnel)}
                            className="h-8 text-[12px] gap-1"
                          >
                            Open Analytics
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* STATE 2: Funnel Analytics results view */
            <div className="space-y-6">
              {/* Back to list and header options */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setActiveSavedFunnel(null)}
                  className="h-8 text-[12px] gap-1 px-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Funnels
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingFunnel(activeSavedFunnel);
                      setIsBuilderOpen(true);
                    }}
                    className="h-8 text-[12px] gap-1.5"
                    disabled={isAnalyzing}
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit Funnel Definition
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setDeletingFunnel(activeSavedFunnel)}
                    className="h-8 text-[12px] gap-1.5"
                    disabled={isAnalyzing}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Funnel
                  </Button>
                </div>
              </div>

              {/* Active Funnel Config Bar */}
              <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1 min-w-0 space-y-2 lg:space-y-0 lg:flex lg:items-center lg:gap-6">
                  {/* Name and Path */}
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[14px] font-bold text-foreground leading-none mb-1">
                      {activeSavedFunnel.name}
                    </h2>
                    {activeSavedFunnel.description && (
                      <p className="text-[11px] text-muted-foreground truncate mb-2">
                        {activeSavedFunnel.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {activeSteps.map((s, i) => (
                        <div key={i} className="flex items-center gap-1 text-[13px] font-medium text-foreground">
                          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />}
                          <span className="bg-muted border border-border/40 px-2 py-0.5 rounded text-[12px] font-mono leading-none">
                            {s}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider line on larger screen */}
                  <div className="hidden lg:block h-8 w-px bg-border" />

                  {/* Date Range selectors */}
                  <div className="flex items-center gap-3">
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                        From
                      </label>
                      <Input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="h-8 text-[12px] w-[130px]"
                        disabled={isAnalyzing}
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                        To
                      </label>
                      <Input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="h-8 text-[12px] w-[130px]"
                        disabled={isAnalyzing}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end lg:self-center">
                  <Button
                    variant="outline"
                    onClick={() => refetchAnalytics()}
                    className="h-8 text-[12px] gap-1.5"
                    disabled={isAnalyzing}
                  >
                    <RefreshCw className={cn("h-3.5 w-3.5", isAnalyzing && "animate-spin")} />
                    Analyze Again
                  </Button>
                </div>
              </div>

              {/* Error state */}
              {analyticsError && (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed border-red-200 rounded-lg bg-red-50/50">
                  <p className="text-sm font-medium text-red-800">Failed to analyze funnel</p>
                  <p className="text-xs text-red-600 mb-4">
                    {analyticsErrorData?.message || "Please check your network connection."}
                  </p>
                  <Button size="sm" onClick={() => refetchAnalytics()} className="h-8">
                    Retry
                  </Button>
                </div>
              )}

              {/* Loading Skeleton */}
              {isAnalyzing && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                    ))}
                  </div>
                  <div className="h-60 bg-muted animate-pulse rounded-lg w-full" />
                </div>
              )}

              {/* Funnel Results */}
              {!isAnalyzing && !analyticsError && funnelDataResponse && (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                      {
                        label: "Entered Sessions",
                        value: funnelDataResponse.totalEnteredSessions?.toLocaleString() || "0",
                        desc: "Sessions that reached step 1",
                      },
                      {
                        label: "Converted Sessions",
                        value: funnelDataResponse.totalConvertedSessions?.toLocaleString() || "0",
                        desc: "Sessions that completed all steps",
                      },
                      {
                        label: "Overall Conversion Rate",
                        value: `${funnelDataResponse.overallConversionRate || 0}%`,
                        desc: "Entry to final-step rate",
                      },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-lg border border-border bg-card px-4 py-3 flex flex-col justify-between min-h-[92px]">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground leading-none">
                          {stat.label}
                        </p>
                        <p className="text-[22px] font-bold tabular-nums text-foreground my-1 leading-none">
                          {stat.value}
                        </p>
                        <p className="text-[11px] text-muted-foreground leading-none">{stat.desc}</p>
                      </div>
                    ))}

                    {/* Biggest Drop-off Summary Card */}
                    <div className="rounded-lg border border-border bg-card px-4 py-3 flex flex-col justify-between min-h-[92px]">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground leading-none">
                        Biggest Drop-off
                      </p>
                      <div className="my-1">
                        {renderBiggestDropoffCard(
                          funnelDataResponse.biggestDropOffStep,
                          funnelDataResponse.steps || []
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Zero Data State Alert */}
                  {funnelDataResponse.totalEnteredSessions === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-lg bg-muted/5">
                      <p className="text-[13px] font-medium text-muted-foreground">
                        No sessions entered this funnel during the selected date range.
                      </p>
                    </div>
                  ) : (
                    /* Main Funnel Visualization & Steps Table */
                    <div className="space-y-6">
                      {/* Visual Funnel Breakdown Container */}
                      <div className="rounded-xl border border-border bg-card p-6">
                        <div className="text-center mb-8">
                          <h3 className="text-[15px] font-semibold text-foreground">
                            Funnel Breakdown
                          </h3>
                          <p className="text-[12px] text-muted-foreground mt-0.5">
                            Session progression through each funnel step
                          </p>
                        </div>

                        <div className="flex flex-col items-center max-w-2xl mx-auto">
                          {(funnelDataResponse.steps || []).map((step, idx) => {
                            const isLast = idx === (funnelDataResponse.steps || []).length - 1;
                            const visualWidth = Math.max(step.conversionFromEntry || 0, 28);
                            const isBiggestDrop =
                              funnelDataResponse.biggestDropOffStep !== null &&
                              funnelDataResponse.biggestDropOffStep !== undefined &&
                              idx + 1 === funnelDataResponse.biggestDropOffStep;

                            return (
                              <div key={step.step} className="w-full flex flex-col items-center">
                                {/* Centered wide horizontal segment */}
                                <div
                                  className="rounded-xl border border-primary/25 bg-primary/5 px-6 py-4 flex flex-col justify-between items-center sm:flex-row sm:text-left text-center gap-4 transition-all duration-300 shadow-xs max-w-full"
                                  style={{ width: `${visualWidth}%` }}
                                >
                                  <div>
                                    <span className="text-[9px] font-bold text-primary/80 uppercase tracking-widest block mb-0.5">
                                      Step {step.step}
                                    </span>
                                    <h4 className="text-[14px] font-bold text-foreground truncate max-w-[280px]">
                                      {step.eventName}
                                    </h4>
                                  </div>

                                  <div className="flex items-center gap-5 sm:text-right text-center flex-wrap justify-center sm:justify-end">
                                    <div>
                                      <p className="text-[16px] font-extrabold text-foreground tabular-nums leading-none">
                                        {step.sessions?.toLocaleString() || "0"}
                                      </p>
                                      <span className="text-[10px] text-muted-foreground">
                                        sessions
                                      </span>
                                    </div>
                                    <div className="h-6 w-px bg-primary/20 hidden sm:block" />
                                    <div>
                                      <p className="text-[14px] font-bold text-primary tabular-nums leading-none">
                                        {step.conversionFromEntry || 0}%
                                      </p>
                                      <span className="text-[10px] text-muted-foreground">
                                        of entry
                                      </span>
                                    </div>
                                    {idx > 0 && (
                                      <>
                                        <div className="h-6 w-px bg-primary/20 hidden sm:block" />
                                        <div>
                                          <p className="text-[14px] font-bold text-muted-foreground tabular-nums leading-none">
                                            {step.conversionFromPrevious || 0}%
                                          </p>
                                          <span className="text-[10px] text-muted-foreground">
                                            from prev
                                          </span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Connection Path Area */}
                                {!isLast && (
                                  <div className="flex flex-col items-center my-3 relative w-full">
                                    <div className="w-0.5 h-12 bg-border/80 flex items-center justify-center">
                                      <ArrowDown className={cn(
                                        "h-4 w-4 text-border absolute top-4",
                                        isBiggestDrop && "text-red-400"
                                      )} />
                                    </div>

                                    <div
                                      className={cn(
                                        "absolute top-1/2 -translate-y-1/2 flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium border shadow-xs transition-all",
                                        step.dropOffSessions && step.dropOffSessions > 0
                                          ? isBiggestDrop
                                            ? "bg-red-50 border-red-200 text-red-700 ring-2 ring-red-100"
                                            : "bg-red-50/60 border-red-100/80 text-red-600/90"
                                          : "bg-muted border-border text-muted-foreground"
                                      )}
                                    >
                                      {step.dropOffSessions && step.dropOffSessions > 0 ? (
                                        <>
                                          <TrendingDown className="h-3 w-3" />
                                          <span>
                                            {step.dropOffSessions.toLocaleString()} dropped ·{" "}
                                            {step.dropOffRate}%
                                          </span>
                                          {isBiggestDrop && (
                                            <span className="ml-1 text-[9px] font-extrabold uppercase bg-red-100 text-red-800 px-1.5 py-0.2 rounded-sm tracking-wider">
                                              Biggest Drop-off
                                            </span>
                                          )}
                                        </>
                                      ) : (
                                        <span>0 dropped · 0%</span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Step Details Table */}
                      <div className="rounded-xl border border-border bg-card overflow-hidden">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-muted/40 border-b border-border">
                            <tr>
                              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                Step
                              </th>
                              <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                Event
                              </th>
                              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                Sessions
                              </th>
                              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                From Previous
                              </th>
                              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                From Entry
                              </th>
                              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                Drop-off Sessions
                              </th>
                              <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                Drop-off Rate
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {(funnelDataResponse.steps || []).map((step, i) => {
                              const isBiggestDropRow =
                                funnelDataResponse.biggestDropOffStep !== null &&
                                funnelDataResponse.biggestDropOffStep !== undefined &&
                                step.step === funnelDataResponse.biggestDropOffStep;

                              return (
                                <tr
                                  key={step.step}
                                  className={cn(
                                    "border-b border-border/40 hover:bg-muted/5 transition-colors",
                                    i === (funnelDataResponse.steps || []).length - 1 && "border-0",
                                    isBiggestDropRow && "border-l-4 border-l-red-500 bg-red-50/10 hover:bg-red-50/15"
                                  )}
                                >
                                  <td className="px-4 py-3 font-semibold text-foreground">
                                    {step.step}
                                  </td>
                                  <td className="px-4 py-3 font-mono text-[13px] text-foreground">
                                    {step.eventName}
                                  </td>
                                  <td className="px-4 py-3 text-right font-bold tabular-nums text-foreground">
                                    {step.sessions?.toLocaleString() || "0"}
                                  </td>
                                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                                    {step.step === 1 ? "—" : `${step.conversionFromPrevious || 0}%`}
                                  </td>
                                  <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                                    {step.conversionFromEntry || 0}%
                                  </td>
                                  <td className="px-4 py-3 text-right tabular-nums text-red-600">
                                    {step.dropOffSessions?.toLocaleString() || "0"}
                                  </td>
                                  <td className="px-4 py-3 text-right tabular-nums text-red-600">
                                    {step.dropOffRate || 0}%
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Funnel Builder Modal Dialog */}
      <FunnelBuilder
        isOpen={isBuilderOpen}
        onClose={() => {
          setIsBuilderOpen(false);
          setEditingFunnel(null);
        }}
        projectId={activeProjectId || 0}
        initialFunnel={
          editingFunnel
            ? {
                id: editingFunnel.id,
                name: editingFunnel.name || "",
                description: editingFunnel.description || "",
                steps: [...(editingFunnel.steps || [])]
                  .sort((a, b) => (a.stepOrder || 0) - (b.stepOrder || 0))
                  .map((s) => s.eventName || "")
                  .filter(Boolean),
              }
            : null
        }
        onSave={handleSaveFunnelDefinition}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deletingFunnel !== null}
        onClose={() => setDeletingFunnel(null)}
        onConfirm={handleDeleteFunnelDefinition}
        title="Delete Funnel?"
        description={`This will permanently delete "${deletingFunnel?.name || ""}". This action cannot be undone.`}
        confirmText="Delete Funnel"
        isConfirming={deleteMutation.isPending}
      />
    </AppLayout>
  );
}
