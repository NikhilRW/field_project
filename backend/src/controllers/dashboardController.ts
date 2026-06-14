import type { Response } from "express";
import { and, desc, eq, sql } from "drizzle-orm";
import {
  activities,
  beneficiaries,
  db,
  donations,
} from "../config/databaseSetup";
import type { AuthRequest } from "../types/auth";
import { formatDate } from "../utils/date";

export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const isAdmin = req.user?.role === "Admin";

    const [beneficiaryCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(beneficiaries);

    const [activityCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(activities);

    const [donationTotals] = isAdmin
      ? await db
          .select({
            total: sql<number>`coalesce(sum(${donations.amount}), 0)`,
          })
          .from(donations)
          .where(
            and(
              eq(donations.type, "incoming"),
              eq(donations.verificationStatus, "verified"),
            ),
          )
      : [{ total: 0 }];

    const activityRows = await db
      .select({
        id: activities.id,
        name: activities.name,
        date: activities.date,
        status: activities.status,
      })
      .from(activities)
      .orderBy(desc(activities.date))
      .limit(3);

    const recentActivities = activityRows.map((activity) => ({
      id: activity.id,
      name: activity.name,
      date: formatDate(activity.date),
      status: activity.status,
    }));

    const stats = {
      beneficiaries: Number(beneficiaryCount?.count ?? 0),
      activities: Number(activityCount?.count ?? 0),
      ...(isAdmin
        ? { donations: Number(donationTotals?.total ?? 0) }
        : {}),
    };

    return res.status(200).json({
      success: true,
      data: {
        stats,
        recentActivities,
      },
    });
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch dashboard data." });
  }
};
