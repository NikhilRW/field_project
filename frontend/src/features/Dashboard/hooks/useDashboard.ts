import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "../utils/api";

export const dashboardQueryKey = ["dashboard"];

export const useDashboard = () =>
  useQuery({
    queryKey: dashboardQueryKey,
    queryFn: fetchDashboard,
  });
