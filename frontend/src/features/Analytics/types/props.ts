import type { LucideIcon } from "lucide-react-native";

export interface DateRangePickerProps {
  visible: boolean;
  onClose: () => void;
  onApply: (startDate: Date, endDate: Date) => void;
}

export interface DonationChartProps {
  data: { date: string; count: number }[];
}

export interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
}
