import type { DonationType, GraphMetric, TimeFilter } from "../types/common";

export const TIME_FILTERS: { value: TimeFilter; label: string }[] = [
  { value: "7days", label: "Last 7 Days" },
  { value: "month", label: "Last Month" },
  { value: "year", label: "Last Year" },
  { value: "custom", label: "Custom" },
];

export const GRAPH_METRICS: { value: GraphMetric; label: string }[] = [
  { value: "total", label: "Total Donations" },
  { value: "newDonators", label: "New Donators" },
  { value: "type", label: "Donation Type" },
];

export const TYPE_OPTIONS: { value: DonationType; label: string }[] = [
  { value: "money", label: "Money" },
  { value: "clothes", label: "Clothes" },
  { value: "books", label: "Books" },
  { value: "other_items", label: "Others" },
];

export const DONATION_TYPES: { value: DonationType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "money", label: "Money" },
  { value: "clothes", label: "Clothes" },
  { value: "books", label: "Books" },
  { value: "other_items", label: "Others" },
];

export const CIRCLE_RADIUS = 5;
export const HORIZONTAL_PADDING = 7;
