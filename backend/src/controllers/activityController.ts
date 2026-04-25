import axios from "axios";
import type { Response } from "express";
import { desc, eq, sql } from "drizzle-orm";
import type { AuthRequest } from "../types/auth";
import {
  activityStatusEnum,
  activityVolunteers,
  activities,
  db,
  notifications,
  users,
  volunteerProfiles,
} from "../config/databaseSetup";
import { formatDate } from "../utils/date";
import { sendActivityNotification, sendUserNotification } from "../utils/sendNotification";
import { storeNotification } from "./notificationController";

const activityNotificationChannelId = "activity-updates";

/**
 * Send notifications to volunteers about activity updates
 * Uses FCM instead of Expo push tokens
 */
const notifyUsersAboutActivity = async (
  activityId: string,
  activityName: string,
  assignedVolunteerIds: string[],
) => {
  const userRows = await db
    .select({
      id: users.id,
      expoPushToken: users.expoPushToken,
    })
    .from(users);

  if (userRows.length === 0) {
    return;
  }

  const assignedIdSet = new Set(assignedVolunteerIds);
  const assignedRecipients = userRows.filter((row) =>
    assignedIdSet.has(row.id),
  );
  const generalRecipients = userRows.filter((row) => !assignedIdSet.has(row.id));

  // Store notifications in database
  const notificationRows = [
    ...generalRecipients.map((row) => ({
      userId: row.id,
      title: "New Activity Added",
      body: `${activityName} has been added. Check the activity details in the app.`,
      data: JSON.stringify({ activityId }),
    })),
    ...assignedRecipients.map((row) => ({
      userId: row.id,
      title: "New Activity Assigned",
      body: `You have been assigned to ${activityName}.`,
      data: JSON.stringify({ activityId }),
    })),
  ];

  if (notificationRows.length > 0) {
    await db.insert(notifications).values(notificationRows);
  }

  // Send FCM to assigned volunteers
  const assignedTokens = assignedRecipients
    .map((row) => row.expoPushToken)
    .filter((token): token is string => Boolean(token));
  
  if (assignedTokens.length > 0) {
    try {
      await sendActivityNotification({
        title: "New Activity Assigned",
        body: `You have been assigned to ${activityName}.`,
        activityId,
        volunteerIds: assignedRecipients.map((r) => r.id),
      });
    } catch (error) {
      console.error("Failed to send assigned notification:", error);
    }
  }

  // Send FCM to all other users
  const generalTokens = generalRecipients
    .map((row) => row.expoPushToken)
    .filter((token): token is string => Boolean(token));

  if (generalTokens.length > 0) {
    try {
      await sendActivityNotification({
        title: "New Activity Added",
        body: `${activityName} has been added. Check the activity details in the app.`,
        activityId,
        volunteerIds: generalRecipients.map((r) => r.id),
      });
    } catch (error) {
      console.error("Failed to send general notification:", error);
    }
  }
};

export const getActivities = async (req: AuthRequest, res: Response) => {
  try {
    const selectFields = {
      id: activities.id,
      name: activities.name,
      date: activities.date,
      volunteersCount: activities.volunteersCount,
      status: activities.status,
      description: activities.description,
    };

    const rows = await db
      .select(selectFields)
      .from(activities)
      .orderBy(desc(activities.date));

    const data = rows.map((row) => ({
      id: row.id,
      name: row.name,
      date: formatDate(row.date),
      volunteers: row.volunteersCount,
      status: row.status,
      description: row.description,
    }));

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch activities", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch activities" });
  }
};

export const getActivityById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Activity ID is required." });
    }

    const [activity] = await db
      .select({
        id: activities.id,
        name: activities.name,
        date: activities.date,
        volunteersCount: activities.volunteersCount,
        status: activities.status,
        description: activities.description,
      })
      .from(activities)
      .where(eq(activities.id, id));

    if (!activity) {
      return res
        .status(404)
        .json({ success: false, error: "Activity not found." });
    }

    const volunteers =
      req.user?.role === "Admin"
        ? await db
            .select({
              id: volunteerProfiles.userId,
              name: users.name,
              roleTitle: volunteerProfiles.roleTitle,
              skill: volunteerProfiles.skill,
              initials: volunteerProfiles.initials,
              color: volunteerProfiles.color,
            })
            .from(activityVolunteers)
            .innerJoin(
              volunteerProfiles,
              eq(activityVolunteers.volunteerId, volunteerProfiles.userId),
            )
            .innerJoin(users, eq(volunteerProfiles.userId, users.id))
            .where(eq(activityVolunteers.activityId, id))
        : [];

    return res.status(200).json({
      success: true,
      data: {
        id: activity.id,
        name: activity.name,
        date: formatDate(activity.date),
        volunteers: activity.volunteersCount,
        status: activity.status,
        description: activity.description,
        assignedVolunteers: volunteers.map((volunteer) => ({
          id: volunteer.id,
          name: volunteer.name ?? "Unknown",
          role: volunteer.roleTitle,
          skill: volunteer.skill,
          initials: volunteer.initials,
          color: volunteer.color,
        })),
      },
    });
  } catch (error) {
    console.error("Failed to fetch activity details", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to fetch activity details" });
  }
};

export const createActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { name, date, description, status, volunteerIds } =
      req.body as {
        name?: string;
        date?: string;
        description?: string;
        status?: string;
        volunteerIds?: string[];
      };

    if (!name || !date || !description) {
      return res.status(400).json({
        success: false,
        error: "Name, date, and description are required.",
      });
    }

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: "Invalid date.",
      });
    }

    const statusValue = status ?? "Upcoming";
    if (!activityStatusEnum.enumValues.includes(statusValue as any)) {
      return res.status(400).json({
        success: false,
        error: "Invalid activity status.",
      });
    }

    const assignedVolunteerIds = Array.isArray(volunteerIds)
      ? volunteerIds.filter((id) => typeof id === "string" && id.length > 0)
      : [];

    const [created] = await db
      .insert(activities)
      .values({
        name,
        date: parsedDate,
        description,
        status: statusValue as any,
        volunteersCount: assignedVolunteerIds.length,
      })
      .returning({
        id: activities.id,
        name: activities.name,
        date: activities.date,
        volunteersCount: activities.volunteersCount,
        status: activities.status,
        description: activities.description,
      });

    if (!created) {
      return res
        .status(500)
        .json({ success: false, error: "Failed to create activity." });
    }

    if (assignedVolunteerIds.length > 0) {
      await db.insert(activityVolunteers).values(
        assignedVolunteerIds.map((volunteerId) => ({
          activityId: created.id,
          volunteerId,
        })),
      );
    }

    await notifyUsersAboutActivity(
      created.id,
      created.name,
      assignedVolunteerIds,
    );

    return res.status(201).json({
      success: true,
      data: {
        id: created.id,
        name: created.name,
        date: formatDate(created.date),
        volunteers: created.volunteersCount,
        status: created.status,
        description: created.description,
      },
    });
  } catch (error) {
    console.error("Failed to create activity", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to create activity" });
  }
};

export const deleteActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id?: string };

    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Activity ID is required." });
    }

    const [existingActivity] = await db
      .select({
        id: activities.id,
      })
      .from(activities)
      .where(eq(activities.id, id));

    if (!existingActivity) {
      return res
        .status(404)
        .json({ success: false, error: "Activity not found." });
    }

    await db
      .delete(notifications)
      .where(
        sql`${notifications.data} IS NOT NULL AND ${notifications.data} LIKE ${`%"activityId":"${id}"%`}`,
      );

    const [deletedActivity] = await db
      .delete(activities)
      .where(eq(activities.id, id))
      .returning({
        id: activities.id,
      });

    if (!deletedActivity) {
      return res
        .status(500)
        .json({ success: false, error: "Failed to delete activity." });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: deletedActivity.id,
      },
    });
  } catch (error) {
    console.error("Failed to delete activity", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to delete activity" });
  }
};

export const updateActivityStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params as { id?: string };
    const { status } = req.body as { status?: string };

    if (!id) {
      return res
        .status(400)
        .json({ success: false, error: "Activity ID is required." });
    }

    if (!status) {
      return res
        .status(400)
        .json({ success: false, error: "Activity status is required." });
    }

    if (!activityStatusEnum.enumValues.includes(status as any)) {
      return res.status(400).json({
        success: false,
        error: "Invalid activity status.",
      });
    }

    // Get current activity details before updating
    const [currentActivity] = await db
      .select({
        id: activities.id,
        name: activities.name,
        status: activities.status,
      })
      .from(activities)
      .where(eq(activities.id, id));

    if (!currentActivity) {
      return res
        .status(404)
        .json({ success: false, error: "Activity not found." });
    }

    const [updatedActivity] = await db
      .update(activities)
      .set({
        status: status as any,
        updatedAt: new Date(),
      })
      .where(eq(activities.id, id))
      .returning({
        id: activities.id,
        name: activities.name,
        date: activities.date,
        volunteersCount: activities.volunteersCount,
        status: activities.status,
        description: activities.description,
      });

    if (!updatedActivity) {
      return res
        .status(404)
        .json({ success: false, error: "Activity not found." });
    }

    // Send notification about status change
    try {
      let title = "";
      let body = "";

      if (currentActivity.status === "Upcoming" && status === "Ongoing") {
        title = "🔴 Activity Started";
        body = `${updatedActivity.name} has started now! Check in to participate.`;
      } else if (status === "Completed") {
        title = "✅ Activity Completed";
        body = `${updatedActivity.name} has been marked as completed.`;
      } else if (status === "Upcoming") {
        title = "📅 Activity Scheduled";
        body = `${updatedActivity.name} is coming up soon!`;
      }

      if (title && body) {
        await sendActivityNotification({
          title,
          body,
          activityId: id,
          allVolunteers: true,
        });

        // Also store in DB for history
        const volunteers = await db.select({ id: users.id }).from(users);
        const notificationRows = volunteers.map((v) => ({
          userId: v.id,
          title,
          body,
          data: JSON.stringify({ activityId: id, type: "activity_status_change" }),
        }));

        if (notificationRows.length > 0) {
          await db.insert(notifications).values(notificationRows);
        }
      }
    } catch (error) {
      console.error("Failed to send status update notification:", error);
      // Continue - don't fail the status update if notification fails
    }

    return res.status(200).json({
      success: true,
      data: {
        id: updatedActivity.id,
        name: updatedActivity.name,
        date: formatDate(updatedActivity.date),
        volunteers: updatedActivity.volunteersCount,
        status: updatedActivity.status,
        description: updatedActivity.description,
      },
    });
  } catch (error) {
    console.error("Failed to update activity status", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update activity status" });
  }
};
