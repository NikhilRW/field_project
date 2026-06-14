import type { Request } from "express";

export type AuthRole = "Admin" | "User";

export type AuthUser = {
  id: string;
  email: string;
  role: AuthRole;
};

export interface AuthRequest extends Request {
  user?: AuthUser;
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
}
