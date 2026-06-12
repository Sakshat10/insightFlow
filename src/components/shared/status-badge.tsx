import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; dot: string; text: string; bg: string }> = {
  active: { label: "Active", dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  inactive: { label: "Inactive", dot: "bg-gray-400", text: "text-gray-600", bg: "bg-gray-100" },
  revoked: { label: "Revoked", dot: "bg-red-400", text: "text-red-700", bg: "bg-red-50" },
  pending: { label: "Pending", dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50" },
  ready: { label: "Ready", dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  generating: { label: "Generating", dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" },
  verified: { label: "Verified", dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  converted: { label: "Converted", dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  bounced: { label: "Bounced", dot: "bg-red-400", text: "text-red-700", bg: "bg-red-50" },
  engaged: { label: "Engaged", dot: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" },
  invited: { label: "Invited", dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status?.toLowerCase()] || statusConfig.inactive;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full flex-shrink-0", config.dot)} />
      {config.label}
    </span>
  );
}
