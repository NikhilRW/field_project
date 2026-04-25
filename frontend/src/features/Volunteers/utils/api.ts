import http from "@/shared/utils/http";
import type { Volunteer } from "@/shared/types/mock";

export const fetchVolunteers = async () => {
  const response = await http.get<{ success: boolean; data: Volunteer[] }>(
    "/api/volunteers",
  );
  return response.data.data;
};
