import http from "@/shared/utils/http";

export type UserListItem = {
  id: string;
  name: string;
  email: string;
};

export const fetchAllUsers = async () => {
  const response = await http.get<{ success: boolean; data: UserListItem[] }>(
    "/api/users",
  );
  return response.data.data;
};
