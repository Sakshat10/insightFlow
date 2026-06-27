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
        "rounded-xl border border-border/70 bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:border-border/100",
        className
      )}
    >
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="flex items-baseline justify-between">
        <span
          className={cn(
            "text-2xl font-bold tracking-tight text-foreground tabular-nums",
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
              "flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold",
              isPositive && "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
              isNegative && "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
              !isPositive && !isNegative && "bg-muted/50 border-border text-muted-foreground"
            )}
          >
            {isPositive && <TrendingUp className="h-3 w-3" />}
            {isNegative && <TrendingDown className="h-3 w-3" />}
            {!isPositive && !isNegative && <Minus className="h-3 w-3" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      {description && (
        <p className="mt-2 text-[11px] text-muted-foreground/80 leading-normal">{description}</p>
      )}
    </div>
  );
}
