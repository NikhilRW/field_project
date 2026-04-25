import type { Request } from "express";

export type AuthRole = "Admin" | "Volunteer" | "Donor";

export type AuthUser = {
  id: string;
  email: string;
  role: AuthRole;
};

export interface AuthRequest extends Request {
  user?: AuthUser;
}
