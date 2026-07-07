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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface GenerateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: {
    name: string;
    environment: "PRODUCTION" | "STAGING" | "DEVELOPMENT";
    permissions: string[];
  }) => void;
  isGenerating?: boolean;
}

export function GenerateKeyModal({
  isOpen,
  onClose,
  onGenerate,
  isGenerating = false,
}: GenerateKeyModalProps) {
  const [name, setName] = useState("");
  const [environment, setEnvironment] = useState<"PRODUCTION" | "STAGING" | "DEVELOPMENT">("DEVELOPMENT");
  const [permissions, setPermissions] = useState<string[]>(["track"]);
  const [validationError, setValidationError] = useState<string | null>(null);

  const availablePermissions = [
    { value: "track", label: "Track Events (track)" },
    { value: "read:analytics", label: "Read Analytics (read:analytics)" },
    { value: "write:settings", label: "Write Settings (write:settings)" },
  ];

  const handleTogglePermission = (value: string) => {
    setPermissions((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  };

  const handleGenerate = () => {
    setValidationError(null);
    if (!name.trim()) {
      setValidationError("API Key Name is required.");
      return;
    }

    onGenerate({
      name: name.trim(),
      environment,
      permissions,
    });

    // Reset fields on submit
    setName("");
    setEnvironment("DEVELOPMENT");
    setPermissions(["track"]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md w-full p-6 rounded-xl bg-card border border-border">
        <DialogHeader className="pb-3 border-b border-border">
          <DialogTitle className="text-[16px] font-semibold text-foreground">
            Generate API Key
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">
              Key Name
            </label>
            <Input
              type="text"
              placeholder="e.g. Production Ingestion Key"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 text-[13px]"
              disabled={isGenerating}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">
              Environment
            </label>
            <select
              value={environment}
              onChange={(e) =>
                setEnvironment(e.target.value as "PRODUCTION" | "STAGING" | "DEVELOPMENT")
              }
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-[13px] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              disabled={isGenerating}
            >
              <option value="DEVELOPMENT">Development</option>
              <option value="STAGING">Staging</option>
              <option value="PRODUCTION">Production</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">
              Permissions
            </label>
            <div className="space-y-2">
              {availablePermissions.map((perm) => (
                <div key={perm.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`perm-${perm.value}`}
                    checked={permissions.includes(perm.value)}
                    onCheckedChange={() => handleTogglePermission(perm.value)}
                    disabled={isGenerating}
                  />
                  <Label
                    htmlFor={`perm-${perm.value}`}
                    className="text-[12px] font-medium text-foreground cursor-pointer"
                  >
                    {perm.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {validationError && (
            <p className="text-[12px] text-destructive font-medium">{validationError}</p>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-border mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 text-[12px]"
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleGenerate}
              className="h-8 text-[12px]"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Key"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
