import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string | number;
  change?: number;
  direction?: "up" | "down" | "neutral";
  suffix?: string;
  prefix?: string;
  description?: string;
  className?: string;
  valueClassName?: string;
}

export function KpiCard({
  label,
  value,
  change,
  direction = "neutral",
  suffix,
  prefix,
  description,
  className,
  valueClassName,
}: KpiCardProps) {
  const isPositive = direction === "up";
  const isNegative = direction === "down";

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card px-4 py-3.5",
        className
      )}
    >
      <p className="text-[12px] font-medium text-muted-foreground mb-1.5">
        {label}
      </p>
      <div className="flex items-end gap-2">
        <span
          className={cn(
            "text-[22px] font-semibold tracking-tight text-foreground tabular-nums leading-none",
            valueClassName
          )}
        >
          {prefix}
          {typeof value === "number" ? value.toLocaleString() : value}
          {suffix}
        </span>
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold mb-0.5",
              isPositive && "bg-emerald-50 text-emerald-700",
              isNegative && "bg-red-50 text-red-600",
              !isPositive && !isNegative && "bg-muted text-muted-foreground"
            )}
          >
            {isPositive && <TrendingUp className="h-3 w-3" />}
            {isNegative && <TrendingDown className="h-3 w-3" />}
            {!isPositive && !isNegative && <Minus className="h-3 w-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      {description && (
        <p className="mt-1 text-[11px] text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
