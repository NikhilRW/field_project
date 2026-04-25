import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../config/databaseSetup";
import {
  activityVolunteers,
  activities,
  users,
  volunteerProfiles,
} from "../config/databaseSetup";

type VolunteerResponse = {
  id: string;
  name: string;
  role: string;
  skill: string;
  assignedActivity: string;
  available: boolean;
  initials: string;
  color: string;
};

export const getVolunteers = async (_req: Request, res: Response) => {
  try {
    const rows = await db
      .select({
        userId: volunteerProfiles.userId,
        name: users.name,
        roleTitle: volunteerProfiles.roleTitle,
        skill: volunteerProfiles.skill,
        available: volunteerProfiles.available,
        initials: volunteerProfiles.initials,
        color: volunteerProfiles.color,
        activityName: activities.name,
      })
      .from(volunteerProfiles)
      .leftJoin(users, eq(volunteerProfiles.userId, users.id))
      .leftJoin(
        activityVolunteers,
        eq(volunteerProfiles.userId, activityVolunteers.volunteerId),
      )
      .leftJoin(activities, eq(activityVolunteers.activityId, activities.id));

    const volunteerMap = new Map<string, VolunteerResponse>();

    rows.forEach((row) => {
      if (!row.userId) return;

      const existing = volunteerMap.get(row.userId);
      if (!existing) {
        volunteerMap.set(row.userId, {
          id: row.userId,
          name: row.name ?? "Unknown",
          role: row.roleTitle,
          skill: row.skill,
          assignedActivity: row.activityName ?? "Unassigned",
          available: row.available,
          initials: row.initials,
          color: row.color,
        });
        return;
      }

      if (existing.assignedActivity === "Unassigned" && row.activityName) {
        existing.assignedActivity = row.activityName;
      }
    });

    const data = Array.from(volunteerMap.values());

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch volunteers:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
