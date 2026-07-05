"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEventAnalytics } from "@/features/analytics";
import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";

interface FunnelBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  initialFunnel?: {
    id?: number;
    name: string;
    description?: string;
    steps: string[];
  } | null;
  onSave: (data: { name: string; description: string; steps: string[] }) => void;
  isSaving?: boolean;
}

export function FunnelBuilder({
  isOpen,
  onClose,
  projectId,
  initialFunnel,
  onSave,
  isSaving = false,
}: FunnelBuilderProps) {
  // Get tracked events for this project
  const { data: eventAnalytics = [], isLoading: eventsLoading } =
    useEventAnalytics(projectId);

  const eventOptions = Array.from(
    new Set(eventAnalytics.map((e) => e.name).filter(Boolean))
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<string[]>(["", ""]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Adjust state during render when initialFunnel or isOpen changes to avoid useEffect warnings
  const [prevInitialFunnel, setPrevInitialFunnel] = useState<typeof initialFunnel>(null);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  if (initialFunnel !== prevInitialFunnel || isOpen !== prevIsOpen) {
    setPrevInitialFunnel(initialFunnel);
    setPrevIsOpen(isOpen);
    if (initialFunnel) {
      setName(initialFunnel.name || "");
      setDescription(initialFunnel.description || "");
      setSteps(initialFunnel.steps.length >= 2 ? initialFunnel.steps : ["", ""]);
    } else {
      setName("");
      setDescription("");
      setSteps(["", ""]);
    }
    setValidationError(null);
  }

  // Validate and sanitize step selections when eventOptions change (e.g. project switch) during render
  const [prevEventOptions, setPrevEventOptions] = useState<string[]>([]);
  if (!eventsLoading && eventOptions.length > 0 && JSON.stringify(eventOptions) !== JSON.stringify(prevEventOptions)) {
    setPrevEventOptions(eventOptions);
    const hasInvalidStep = steps.some((step) => step !== "" && !eventOptions.includes(step));
    if (hasInvalidStep) {
      const sanitized = steps.map((step) =>
        step !== "" && !eventOptions.includes(step) ? "" : step
      );
      const allEmpty = sanitized.every((s) => s === "");
      setSteps(allEmpty ? ["", ""] : sanitized);
    }
  }

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 2) return;
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const moveStepUp = (index: number) => {
    if (index === 0) return;
    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index - 1];
    newSteps[index - 1] = temp;
    setSteps(newSteps);
  };

  const moveStepDown = (index: number) => {
    if (index === steps.length - 1) return;
    const newSteps = [...steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index + 1];
    newSteps[index + 1] = temp;
    setSteps(newSteps);
  };

  const handleSave = () => {
    setValidationError(null);

    // Validation
    if (!name.trim()) {
      setValidationError("Funnel Name is required.");
      return;
    }

    if (steps.length < 2) {
      setValidationError("A funnel must contain at least 2 steps.");
      return;
    }

    if (steps.some((s) => !s || s.trim() === "")) {
      setValidationError("Funnel steps cannot be blank. Please select an event for each step.");
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      steps,
    });
  };

  const hasNoEvents = !eventsLoading && eventOptions.length === 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md w-full max-h-[85vh] flex flex-col p-6 rounded-xl bg-card border border-border">
        <DialogHeader className="pb-3 border-b border-border">
          <DialogTitle className="text-[16px] font-semibold text-foreground">
            {initialFunnel ? "Edit Funnel" : "Create Funnel"}
          </DialogTitle>
        </DialogHeader>

        {hasNoEvents ? (
          <div className="py-6 text-center space-y-4">
            <p className="text-[13px] text-muted-foreground">
              No events have been tracked for this project yet.
            </p>
            <p className="text-[12px] text-muted-foreground/80">
              Track events before creating a funnel.
            </p>
            <div className="flex justify-end pt-3 border-t border-border mt-6">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden min-h-0 space-y-4 pt-4">
            {/* Metadata inputs */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Funnel Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g. User Signup Flow"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 text-[13px]"
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Description
                </label>
                <Textarea
                  placeholder="Describe the target path..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[60px] text-[13px] resize-none"
                  disabled={isSaving}
                />
              </div>
            </div>

            {/* Funnel Steps Builder */}
            <div className="flex-1 flex flex-col min-h-0 space-y-2">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                Funnel Steps
              </label>

              <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[220px] py-1">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-muted-foreground w-12 flex-shrink-0">
                      Step {idx + 1}
                    </span>

                    <select
                      value={step}
                      onChange={(e) => handleStepChange(idx, e.target.value)}
                      className="flex-1 h-8 rounded-md border border-input bg-background px-2.5 py-1 text-[13px] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      disabled={isSaving}
                    >
                      <option value="">Select Event...</option>
                      {eventOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground disabled:opacity-30"
                        onClick={() => moveStepUp(idx)}
                        disabled={idx === 0 || isSaving}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground disabled:opacity-30"
                        onClick={() => moveStepDown(idx)}
                        disabled={idx === steps.length - 1 || isSaving}
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10 disabled:opacity-30"
                        onClick={() => handleRemoveStep(idx)}
                        disabled={steps.length <= 2 || isSaving}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-8 text-[12px] w-fit self-start gap-1"
                onClick={handleAddStep}
                disabled={isSaving}
              >
                <Plus className="h-3.5 w-3.5" /> Add Step
              </Button>
            </div>

            {validationError && (
              <p className="text-[12px] text-destructive font-medium">
                {validationError}
              </p>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-border mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="h-8 text-[12px]"
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="h-8 text-[12px]"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Funnel"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
