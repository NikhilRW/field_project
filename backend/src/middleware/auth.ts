import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types/auth";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const token = header.replace("Bearer ", "").trim();

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid token" });
  }
};

export const authorizeRoles =
  (...roles: Array<"Admin" | "Volunteer" | "Donor">) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (!role) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    if (!roles.includes(role)) {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    return next();
  };
