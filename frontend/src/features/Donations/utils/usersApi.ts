import http from "@/shared/utils/http";
import { UserListItem } from "../types/common";

export const fetchAllUsers = async () => {
  const response = await http.get<{ success: boolean; data: UserListItem[] }>(
    "/api/users",
  );
  return response.data.data;
};

export const createUser = async (payload: {
  name: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: string;
}) => {
  const response = await http.post<{ success: boolean; data: UserListItem }>(
    "/api/users",
    payload,
  );
  return response.data.data;
};

export const toggleBlockUser = async (userId: string) => {
  const response = await http.patch<{ success: boolean; data: UserListItem }>(
    "/api/users/block",
    { userId },
  );
  return response.data.data;
};
