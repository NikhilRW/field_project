import { Colors } from "@/shared/constants/color";
import type { ActivityStatus } from "@/shared/types/mock";

export const getActivityStatusColor = (status: ActivityStatus) => {
  if (status === "Completed") return Colors.secondary;
  if (status === "Upcoming") return Colors.accent;
  return Colors.primary;
};

export const getActivityStatusBg = (status: ActivityStatus) => {
  if (status === "Completed") return Colors.secondaryLight;
  if (status === "Upcoming") return Colors.accentLight;
  return Colors.primaryLight;
};
