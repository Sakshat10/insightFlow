import { cn } from "@/lib/utils";
import { User, Eye, Zap, Target, HelpCircle } from "lucide-react";
import { components } from "@/generated/openapi";

type LiveActivityResponse = components["schemas"]["LiveActivityResponse"];

const eventConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  SESSION_START: { icon: User, color: "text-blue-600", bg: "bg-blue-50" },
  PAGE_VIEW: { icon: Eye, color: "text-indigo-600", bg: "bg-indigo-50" },
  CUSTOM_EVENT: { icon: Zap, color: "text-violet-600", bg: "bg-violet-50" },
  CONVERSION: { icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
};

interface ActivityTimelineProps {
  items: LiveActivityResponse[];
  className?: string;
}

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "Just now";
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 15) return "Just now";
  if (diffSecs < 60) return `${diffSecs}s ago`;
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function formatEventName(name?: string): string {
  if (!name) return "Unknown Event";
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const getPageViewTitle = (item: LiveActivityResponse) => {
  if (item.title && item.title.trim() !== "") return item.title;
  if (item.url) {
    try {
      const urlObj = new URL(item.url);
      return urlObj.pathname !== "/" ? urlObj.pathname : "Home";
    } catch {
      return item.url;
    }
  }
  return "Page";
};

const getPagePathname = (url?: string) => {
  if (!url) return "";
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch {
    return "";
  }
};

export function ActivityTimeline({ items, className }: ActivityTimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {items.map((item, i) => {
        const type = item.type || "UNKNOWN";
        const config = eventConfig[type] || { icon: HelpCircle, color: "text-muted-foreground", bg: "bg-muted" };
        const Icon = config.icon;

        let primaryText = "";
        let secondaryText = "";

        const geoBrowserDevice = [item.country, item.browser, item.deviceType]
          .filter(Boolean)
          .join(" · ");

        if (type === "SESSION_START") {
          primaryText = "New session started";
          secondaryText = geoBrowserDevice || "Session details unavailable";
        } else if (type === "PAGE_VIEW") {
          primaryText = `Viewed ${getPageViewTitle(item)}`;
          secondaryText = geoBrowserDevice || "Page view details";
        } else if (type === "CUSTOM_EVENT") {
          primaryText = formatEventName(item.eventName);
          const path = getPagePathname(item.url);
          secondaryText = path ? `Custom event on ${path}` : "Custom event";
        } else if (type === "CONVERSION") {
          primaryText = `Conversion: ${formatEventName(item.eventName)}`;
          const path = getPagePathname(item.url);
          secondaryText = path ? `Conversion completed on ${path}` : "Conversion completed";
        } else {
          primaryText = "Unknown activity";
          secondaryText = "Activity type not recognized";
        }

        return (
          <div
            key={item.activityId}
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
              <span className="text-[13px] font-medium text-foreground block truncate">
                {primaryText}
              </span>
              <p className="text-[12px] text-muted-foreground mt-0.5 truncate">
                {secondaryText}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                {formatRelativeTime(item.timestamp)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
