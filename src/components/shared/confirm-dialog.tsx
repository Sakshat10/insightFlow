"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isConfirming = false,
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm w-full p-6 rounded-xl bg-card border border-border">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-[15px] font-semibold text-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>
        <p className="text-[13px] text-muted-foreground mt-2">{description}</p>
        <div className="flex justify-end gap-2 pt-4 border-t border-border mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 text-[12px]"
            disabled={isConfirming}
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            className="h-8 text-[12px]"
            disabled={isConfirming}
          >
            {isConfirming ? "Processing..." : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
