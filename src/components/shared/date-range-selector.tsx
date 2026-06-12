import { cn } from "@/lib/utils";

interface DateRangeSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const ranges = [
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
  { label: "All", value: "all" },
];

export function DateRangeSelector({ value = "30d", onChange, className }: DateRangeSelectorProps) {
  return (
    <div
      className={cn(
        "flex items-center rounded-md border border-border bg-background p-0.5",
        className
      )}
    >
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange?.(range.value)}
          className={cn(
            "rounded px-2.5 py-1 text-[12px] font-medium transition-colors",
            value === range.value
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
