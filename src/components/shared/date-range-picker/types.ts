export type DateRangePreset = '7d' | '30d' | '90d' | 'thisMonth' | 'lastMonth' | 'custom';

export interface DateRangeSelection {
  from: Date;
  to: Date;
  label: string;
}
