import type { Response } from "express";
import { desc, eq } from "drizzle-orm";
import type { AuthRequest } from "../types/auth";
import { db, notifications, users } from "../config/databaseSetup";

const parseData = (value: string | null) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const registerPushToken = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: "Unauthorized." });
    }

    const { token } = req.body as { token?: string };
    if (!token) {
      return res
        .status(400)
        .json({ success: false, error: "Push token is required." });
    }

    await db
      .update(users)
      .set({ expoPushToken: token })
      .where(eq(users.id, req.user.id));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Register push token error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to register push token." });
  }
};

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: "Unauthorized." });
    }

    const rows = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, req.user.id))
      .orderBy(desc(notifications.createdAt));

    const data = rows.map((row) => ({
      id: row.id,
      title: row.title,
      body: row.body,
      data: parseData(row.data),
      readAt: row.readAt,
      createdAt: row.createdAt,
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Fetch notifications error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch notifications." });
  }
};
