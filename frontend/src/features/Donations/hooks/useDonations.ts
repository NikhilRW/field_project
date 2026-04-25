import { useQuery } from "@tanstack/react-query";
import { fetchDonations, fetchMonthlyDonations } from "../utils/api";

export const donationsQueryKey = ["donations"];
export const monthlyDonationsQueryKey = ["donations", "monthly"];

export const useDonations = () =>
  useQuery({
    queryKey: donationsQueryKey,
    queryFn: fetchDonations,
  });

export const useMonthlyDonations = () =>
  useQuery({
    queryKey: monthlyDonationsQueryKey,
    queryFn: fetchMonthlyDonations,
  });
