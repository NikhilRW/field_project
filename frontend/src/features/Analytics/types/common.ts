export type AnalyticsDonation = {
  id: string;
  donorId: string | null;
  donorName: string;
  purpose: string;
  amount: number;
  type: "incoming" | "outgoing";
  category: "money" | "books" | "clothes" | "other_items";
  verificationStatus: "verified" | "unverified" | "rejected";
  date: string;
  createdAt: string;
  donorCreatedAt: string | null;
};

export type TimeFilter = "7days" | "month" | "year" | "custom";
export type DonationType = "all" | "money" | "clothes" | "books" | "other_items";
export type GraphMetric = "total" | "newDonators" | "type";

// Set to true to use generated data instead of API
export const USE_MOCK_DATA = true;

export type UseAnalyticsReturn = {
  loading: boolean;
  error: string | null;
  donations: number;
  newDonators: number;
  moneyCollected: number;
  typeBreakdown: { money: number; clothes: number; books: number; others: number };
  chartData: { date: string; count: number }[];
  timeFilter: TimeFilter;
  donationType: DonationType;
  customStartDate: Date | null;
  customEndDate: Date | null;
  setTimeFilter: (filter: TimeFilter) => void;
  setDonationType: (type: DonationType) => void;
  setCustomDateRange: (start: Date, end: Date) => void;
  // Graph selection
  graphMetric: GraphMetric;
  graphType: DonationType;
  setGraphMetric: (metric: GraphMetric) => void;
  setGraphType: (type: DonationType) => void;
  graphChartData: { date: string; count: number }[];
}