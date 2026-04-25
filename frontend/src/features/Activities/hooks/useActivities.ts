import { useQuery } from "@tanstack/react-query";
import { fetchActivities } from "../utils/api";

export const activitiesQueryKey = ["activities"];

export const useActivities = () =>
  useQuery({
    queryKey: activitiesQueryKey,
    queryFn: fetchActivities,
  });
