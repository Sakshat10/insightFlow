"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CreateProjectForm } from "./create-project-form";

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const handleSuccess = () => {
    // Show simple browser native notification since custom toast isn't fully set up, or just close dialog
    alert("Project created successfully.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Create New Project</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Add a new project to start tracking visitors, sessions, pageviews, and custom conversion events.
          </DialogDescription>
        </DialogHeader>
        <CreateProjectForm
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
