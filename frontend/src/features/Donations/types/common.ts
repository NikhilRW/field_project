export type UserListItem = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role: string;
  isBlocked: boolean;
};
