import { cn } from "@/lib/utils";

interface StatBarProps {
  label: string;
  value: number;
  total: number;
  color?: string;
  suffix?: string;
  meta?: string;
}

export function StatBar({ label, value, total, color = "#4F81F7", suffix, meta }: StatBarProps) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-foreground">{label}</span>
        <div className="flex items-center gap-2">
          {meta && <span className="text-[12px] text-muted-foreground">{meta}</span>}
          <span className="text-[13px] font-semibold tabular-nums text-foreground">
            {value.toLocaleString()}{suffix}
          </span>
        </div>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

interface StatBarsProps {
  items: Array<{
    label: string;
    value: number;
    color?: string;
    meta?: string;
  }>;
  suffix?: string;
  className?: string;
}

export function StatBars({ items, suffix, className }: StatBarsProps) {
  const total = items.reduce((acc, item) => acc + item.value, 0);
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => (
        <StatBar
          key={item.label}
          label={item.label}
          value={item.value}
          total={total}
          color={item.color}
          suffix={suffix}
          meta={item.meta}
        />
      ))}
    </div>
  );
}
