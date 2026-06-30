import type { Activity, ActivityStatus } from "@/shared/types/mock";
import http from "@/shared/utils/http";
import { isWeb } from "@/shared/constants/platform";

type ActivitiesResponse = {
  success: boolean;
  data: Activity[];
};


export type CreateActivityPayload = {
  name: string;
  date: string;
  description: string;
  status?: "Upcoming" | "Completed" | "Ongoing";
  imageUri?: string;
  fileName?: string | null;
  fileType?: string | null;
};

export const fetchActivities = async () => {
  const response = await http.get<ActivitiesResponse>("/api/activities");
  return response.data.data;
};

export const createActivity = async (payload: CreateActivityPayload) => {
  const formData = new FormData();

  if (payload.imageUri) {
    const fileName = payload.fileName || payload.imageUri.split("/").pop() || "activity.jpg";
    const fileType = payload.fileType || "image/jpeg";

    if (isWeb) {
      const res = await fetch(payload.imageUri);
      const blob = await res.blob();
      formData.append("activityImage", new File([blob], fileName, { type: fileType }));
    } else {
      formData.append("activityImage", {
        uri: payload.imageUri,
        name: fileName,
        type: fileType,
      } as any);
    }
  }

  formData.append("name", payload.name);
  formData.append("date", payload.date);
  formData.append("description", payload.description);
  if (payload.status) {
    formData.append("status", payload.status);
  }

  const response = await http.post<{ success: boolean; data: Activity }>(
    "/api/activities",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
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
