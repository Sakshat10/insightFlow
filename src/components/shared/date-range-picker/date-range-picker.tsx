"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown } from "lucide-react";
import { DateRangePreset, DateRangeSelection } from "./types";
import {
  formatApiDate,
  formatDisplayDate,
  getPresetLabel,
  getPresetRange,
} from "./date-range-utils";

import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  value: DateRangeSelection;
  onChange: (value: DateRangeSelection) => void;
  className?: string;
}

const presets: DateRangePreset[] = ["7d", "30d", "90d", "thisMonth", "lastMonth", "custom"];

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>("7d");
  
  // Custom date selection state
  const [customFrom, setCustomFrom] = useState<string>(formatApiDate(value.from));
  const [customTo, setCustomTo] = useState<string>(formatApiDate(value.to));

  const handlePresetSelect = (preset: DateRangePreset) => {
    setSelectedPreset(preset);
    if (preset !== "custom") {
      const { from, to } = getPresetRange(preset);
      const label = getPresetLabel(preset);
      onChange({ from, to, label });
      setOpen(false);
    }
  };

  const handleApplyCustom = () => {
    if (customFrom && customTo) {
      const from = new Date(`${customFrom}T00:00:00Z`);
      const to = new Date(`${customTo}T23:59:59Z`);
      
      if (from > to) {
        alert("Start date cannot be after end date.");
        return;
      }
      
      const label = `${formatDisplayDate(from)} – ${formatDisplayDate(to)}`;
      onChange({ from, to, label });
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 gap-2 text-[12px] font-medium px-3 bg-background border-border text-foreground hover:bg-muted/10 hover:text-foreground",
              className
            )}
          >
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{value.label}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        }
      />
      <PopoverContent className="w-[380px] p-0 flex flex-row overflow-hidden border border-border rounded-lg shadow-lg bg-popover" align="end">
        {/* Presets Sidebar */}
        <div className="w-[140px] border-r border-border p-1 bg-muted/10">
          <div className="py-1.5 px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Presets
          </div>
          <div className="space-y-0.5">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`w-full text-left px-2 py-1.5 text-[12px] font-medium rounded transition-colors ${
                  selectedPreset === preset
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
              >
                {getPresetLabel(preset)}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Range Pane */}
        <div className="flex-1 p-3.5 flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="text-[12px] font-semibold text-foreground mb-3">
              {selectedPreset === "custom" ? "Choose Custom Range" : "Preset Date Range"}
            </div>
            
            {selectedPreset === "custom" ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="custom-from" className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Start Date
                  </label>
                  <input
                    id="custom-from"
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="w-full h-8 px-2 text-[12px] rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="custom-to" className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    End Date
                  </label>
                  <input
                    id="custom-to"
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="w-full h-8 px-2 text-[12px] rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
                  />
                </div>
              </div>
            ) : (
              <div className="text-[12px] text-muted-foreground py-2 leading-relaxed">
                Selecting a preset range will update the dashboard view immediately.
              </div>
            )}
          </div>

          {selectedPreset === "custom" && (
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                className="h-8 text-[12px]"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleApplyCustom}
                className="h-8 text-[12px]"
              >
                Apply
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
