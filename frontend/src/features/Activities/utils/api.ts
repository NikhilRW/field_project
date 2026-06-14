import type { Activity, ActivityStatus } from "@/shared/types/mock";
import http from "@/shared/utils/http";

type ActivitiesResponse = {
  success: boolean;
  data: Activity[];
};

export type CreateActivityPayload = {
  name: string;
  date: string;
  description: string;
  status?: "Upcoming" | "Completed" | "Ongoing";
};

export const fetchActivities = async () => {
  const response = await http.get<ActivitiesResponse>("/api/activities");
  return response.data.data;
};

export const createActivity = async (payload: CreateActivityPayload) => {
  const response = await http.post<{ success: boolean; data: Activity }>(
    "/api/activities",
    payload,
  );
  return response.data.data;
};

export const fetchActivityById = async (id: string) => {
  const response = await http.get<{ success: boolean; data: Activity }>(
    `/api/activities/${id}`,
  );
  return response.data.data;
};

export const deleteActivity = async (id: string) => {
  const response = await http.delete<{ success: boolean; data: { id: string } }>(
    `/api/activities/${id}`,
  );
  return response.data.data;
};

export const updateActivityStatus = async (
  id: string,
  status: ActivityStatus,
) => {
  const response = await http.patch<{ success: boolean; data: Activity }>(
    `/api/activities/${id}/status`,
    { status },
  );
  return response.data.data;
};
