import { DateRangePreset } from "./types";

export function formatApiDate(date: Date): string {
  // Return YYYY-MM-DD format in UTC to avoid local timezone offset shifts
  return date.toISOString().split("T")[0];
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function getPresetRange(preset: DateRangePreset): { from: Date; to: Date } {
  const to = new Date();
  to.setUTCHours(23, 59, 59, 999);
  
  const from = new Date();
  from.setUTCHours(0, 0, 0, 0);

  switch (preset) {
    case "7d":
      from.setUTCDate(to.getUTCDate() - 6);
      break;
    case "30d":
      from.setUTCDate(to.getUTCDate() - 29);
      break;
    case "90d":
      from.setUTCDate(to.getUTCDate() - 89);
      break;
    case "thisMonth":
      from.setUTCDate(1);
      break;
    case "lastMonth":
      // Set from to 1st of last month
      from.setUTCMonth(from.getUTCMonth() - 1);
      from.setUTCDate(1);
      // Set to to the 0th day of current month (last day of previous month)
      to.setUTCDate(0);
      break;
    case "custom":
    default:
      break;
  }
  return { from, to };
}

export function getPresetLabel(preset: DateRangePreset): string {
  switch (preset) {
    case "7d":
      return "Last 7 Days";
    case "30d":
      return "Last 30 Days";
    case "90d":
      return "Last 90 Days";
    case "thisMonth":
      return "This Month";
    case "lastMonth":
      return "Last Month";
    case "custom":
      return "Custom Range";
    default:
      return "";
  }
}
