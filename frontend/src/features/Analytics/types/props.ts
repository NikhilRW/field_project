import type { LucideIcon } from "lucide-react-native";
import type { DonationType } from "./common";

export interface DateRangePickerProps {
  visible: boolean;
  onClose: () => void;
  onApply: (startDate: Date, endDate: Date) => void;
}

export interface DonationChartProps {
  data: { date: string; count: number }[];
}

export interface FilterDropdownProps {
  value: DonationType;
  onChange: (value: DonationType) => void;
}

export interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: string;
}
