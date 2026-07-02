"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema, CreateProjectSchema } from "@/schemas/project.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateProject } from "../hooks/use-create-project";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

interface CreateProjectFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateProjectForm({ onSuccess, onCancel }: CreateProjectFormProps) {
  const [apiError, setApiError] = useState("");
  const createMutation = useCreateProject();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      projectName: "",
      domain: "",
    },
  });

  const onSubmit = (data: CreateProjectSchema) => {
    setApiError("");
    createMutation.mutate(data, {
      onSuccess: () => {
        onSuccess();
      },
      onError: (err: any) => {
        setApiError(err?.message || "Failed to create project. Please try again.");
      },
    });
  };

  const isPending = createMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
      {apiError && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 flex items-start gap-2.5 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="projectName" className="text-xs font-semibold uppercase tracking-wider text-foreground">
          Project Name
        </Label>
        <Input
          id="projectName"
          disabled={isPending}
          aria-invalid={!!errors.projectName}
          aria-describedby={errors.projectName ? "projectName-error" : undefined}
          placeholder="e.g. Acme Corporation"
          {...register("projectName")}
          className="h-9 text-sm"
        />
        {errors.projectName && (
          <p id="projectName-error" className="text-[11px] text-destructive font-medium">
            {errors.projectName.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="domain" className="text-xs font-semibold uppercase tracking-wider text-foreground">
          Domain (optional)
        </Label>
        <Input
          id="domain"
          disabled={isPending}
          aria-invalid={!!errors.domain}
          aria-describedby={errors.domain ? "domain-error" : undefined}
          placeholder="e.g. acme.com"
          {...register("domain")}
          className="h-9 text-sm"
        />
        {errors.domain && (
          <p id="domain-error" className="text-[11px] text-destructive font-medium">
            {errors.domain.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onCancel}
          className="h-9 text-[13px] rounded-lg"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="h-9 text-[13px] rounded-lg bg-foreground text-background hover:bg-foreground/90 border-0"
        >
          {isPending ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
