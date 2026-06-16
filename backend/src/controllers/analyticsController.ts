import type { Response } from "express";
import { desc, eq, or } from "drizzle-orm";
import { db, donations, users } from "../config/databaseSetup";
import type { AuthRequest } from "../types/auth";

export const getAnalytics = async (_req: AuthRequest, res: Response) => {
  try {
    const rows = await db
      .select({
        id: donations.id,
        donorId: donations.donorId,
        donorName: donations.donorName,
        purpose: donations.purpose,
        amount: donations.amount,
        type: donations.type,
        category: donations.category,
        verificationStatus: donations.verificationStatus,
        date: donations.date,
        createdAt: donations.createdAt,
      })
      .from(donations)
      .where(
        or(
          eq(donations.verificationStatus, "verified"),
          eq(donations.type, "outgoing")
        )
      )
      .orderBy(desc(donations.date));

    const donorIds = [...new Set(rows.map(r => r.donorId).filter(Boolean))];
    
    const userRows = donorIds.length > 0 
      ? await db
          .select({
            id: users.id,
            createdAt: users.createdAt,
          })
          .from(users)
          .where(or(...donorIds.map(id => eq(users.id, id!))))
      : [];

    const userMap = new Map(userRows.map(u => [u.id, u.createdAt]));

    const data = rows.map(row => ({
      id: row.id,
      donorId: row.donorId,
      donorName: row.donorName,
      purpose: row.purpose,
      amount: Number(row.amount),
      type: row.type,
      category: row.category,
      verificationStatus: row.verificationStatus,
      date: row.date.toISOString(),
      createdAt: row.createdAt.toISOString(),
      donorCreatedAt: row.donorId ? userMap.get(row.donorId)?.toISOString() : null,
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch analytics data", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch analytics data" });
  }
};
