import type { Response } from "express";
import { eq } from "drizzle-orm";
import { db, users } from "../config/databaseSetup";
import type { AuthRequest } from "../types/auth";

export const getAllUsers = async (_req: AuthRequest, res: Response) => {
  try {
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.role, "User"))
      .orderBy(users.name);

    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Failed to fetch users", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch users." });
  }
};
