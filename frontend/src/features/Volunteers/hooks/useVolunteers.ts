import { useQuery } from "@tanstack/react-query";
import { fetchVolunteers } from "../utils/api";

export const volunteersQueryKey = ["volunteers"];

export const useVolunteers = () =>
  useQuery({ queryKey: volunteersQueryKey, queryFn: fetchVolunteers });
