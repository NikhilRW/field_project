import { ActivityStatus } from "@/shared/types/mock";
import type { ActivityFilterTab } from "../types/filter";

export const activityFilterTabs: ActivityFilterTab[] = [
  "All",
  "Upcoming",
  "Completed",
];
export const statusOptions: ActivityStatus[] = ["Upcoming", "Ongoing", "Completed"];