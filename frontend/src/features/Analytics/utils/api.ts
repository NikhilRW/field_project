import http from "@/shared/utils/http";
import { AnalyticsDonation } from "../types/common";

export const fetchAnalyticsData = async (): Promise<AnalyticsDonation[]> => {
  const response = await http.get<{ data: AnalyticsDonation[] }>(
    "/api/analytics",
  );
  return response.data.data;
};
