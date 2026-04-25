import http from "@/shared/utils/http";
import type { Donation } from "@/shared/types/mock";

export type MonthlyDonation = {
  month: string;
  received: number;
  spent: number;
};

export const fetchDonations = async () => {
  const response = await http.get<{ success: boolean; data: Donation[] }>(
    "/api/donations",
  );
  return response.data.data;
};

export const fetchMonthlyDonations = async () => {
  const response = await http.get<{
    success: boolean;
    data: MonthlyDonation[];
  }>("/api/donations/monthly");
  return response.data.data;
};
