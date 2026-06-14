import type { ActivityStatus } from "@/shared/types/mock";
import http from "@/shared/utils/http";

export type DashboardStats = {
  beneficiaries: number;
  activities: number;
  donations?: number;
};

export type DashboardActivity = {
  id: string;
  name: string;
  date: string;
  status: ActivityStatus;
};

export type DashboardData = {
  stats: DashboardStats;
  recentActivities: DashboardActivity[];
};

export const fetchDashboard = async () => {
  const response = await http.get<{ success: boolean; data: DashboardData }>(
    "/api/dashboard",
  );
  return response.data.data;
};
