import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, UserPlus, Zap, AlertCircle } from "lucide-react";

type EventType = "purchase" | "signup" | "custom" | "error";

const eventConfig: Record<EventType, { icon: React.ElementType; color: string; bg: string }> = {
  purchase: { icon: ShoppingCart, color: "text-emerald-600", bg: "bg-emerald-50" },
  signup: { icon: UserPlus, color: "text-blue-600", bg: "bg-blue-50" },
  custom: { icon: Zap, color: "text-violet-600", bg: "bg-violet-50" },
  error: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
};

interface ActivityItem {
  id: string;
  type: string;
  user: string;
  email: string | null;
  description: string;
  timestamp: string;
  value: string | null;
}

interface ActivityTimelineProps {
  items: ActivityItem[];
  className?: string;
}

export function ActivityTimeline({ items, className }: ActivityTimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {items.map((item, i) => {
        const type = (item.type as EventType) || "custom";
        const config = eventConfig[type] || eventConfig.custom;
        const Icon = config.icon;

        return (
          <div
            key={item.id}
            className={cn(
              "flex items-start gap-3 py-3 px-4",
              i < items.length - 1 && "border-b border-border/60"
            )}
          >
            <div
              className={cn(
                "mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full",
                config.bg
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", config.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] font-medium text-foreground">
                  {item.user}
                </span>
                {item.email && (
                  <span className="text-[12px] text-muted-foreground truncate">
                    {item.email}
                  </span>
                )}
              </div>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                {item.description}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              {item.value && (
                <span className="text-[12px] font-semibold text-emerald-600">
                  {item.value}
                </span>
              )}
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                {item.timestamp}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
