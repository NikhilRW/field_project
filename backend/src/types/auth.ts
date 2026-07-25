import type { Request } from "express";

export type AuthRole = "Admin" | "User";

export type AuthUser = {
  id: string;
  email: string;
  role: AuthRole;
};

export interface AuthRequest extends Request {
  user?: AuthUser;
  s3Url?: string;
  s3Key?: string;
  s3Urls?: string[];
}
