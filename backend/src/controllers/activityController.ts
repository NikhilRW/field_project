import type { Response } from "express";
import { desc, eq, sql } from "drizzle-orm";
import type { AuthRequest } from "../types/auth";
import {
  activityStatusEnum,
  activities,
  db,
  notifications,
  users,
} from "../config/databaseSetup";
import { formatDate } from "../utils/date";
import { sendActivityNotification } from "../utils/sendNotification";
import { deleteImageFromS3 } from "../utils/s3Upload";

const notifyUsersAboutActivity = async (
  activityId: string,
  activityName: string,
  excludeUserId?: string,
) => {
  let userRows = await db
    .select({
      id: users.id,
      expoPushToken: users.expoPushToken,
    })
    .from(users)
    .where(eq(users.role, "User"));

  if (excludeUserId) {
    userRows = userRows.filter((row) => row.id !== excludeUserId);
  }

  if (userRows.length === 0) {
    return;
  }

  const tokenRows = userRows.filter((row) => Boolean(row.expoPushToken));

  if (tokenRows.length > 0) {
    try {
      await sendActivityNotification({
        title: "New Activity Added",
        body: `${activityName} has been added. Check the activity details in the app.`,
        activityId,
        userIds: tokenRows.map((r) => r.id),
      });
    } catch (error) {
      console.error("Failed to send activity notification:", error);
    }
  }

  const notificationRows = userRows.map((row) => ({
    userId: row.id,
    title: "New Activity Added",
    body: `${activityName} has been added. Check the activity details in the app.`,
    data: JSON.stringify({ activityId }),
  }));

  if (notificationRows.length > 0) {
    await db.insert(notifications).values(notificationRows);
  }
};

export const getActivities = async (req: AuthRequest, res: Response) => {
  try {
    const selectFields = {
      id: activities.id,
      name: activities.name,
      date: activities.date,
      status: activities.status,
      description: activities.description,
      imageUrl: activities.imageUrl,
    };

    const rows = await db
      .select(selectFields)
      .from(activities)
      .orderBy(desc(activities.date))
      .limit(6);

    const data = rows.map((row) => ({
      id: row.id,
      name: row.name,
      date: formatDate(row.date),
      status: row.status,
      description: row.description,
      imageUrl: row.imageUrl,
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
        status: activities.status,
        description: activities.description,
        imageUrl: activities.imageUrl,
      })
      .from(activities)
      .where(eq(activities.id, id));

    if (!activity) {
      return res
        .status(404)
        .json({ success: false, error: "Activity not found." });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: activity.id,
        name: activity.name,
        date: formatDate(activity.date),
        status: activity.status,
        description: activity.description,
        imageUrl: activity.imageUrl,
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
    const { name, date, description, status } = req.body as {
      name?: string;
      date?: string;
      description?: string;
      status?: string;
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

    const [created] = await db
      .insert(activities)
      .values({
        name,
        date: parsedDate,
        description,
        status: statusValue as any,
        imageUrl: req.s3Url,
      })
      .returning({
        id: activities.id,
        name: activities.name,
        date: activities.date,
        status: activities.status,
        description: activities.description,
        imageUrl: activities.imageUrl,
      });

    if (!created) {
      return res
        .status(500)
        .json({ success: false, error: "Failed to create activity." });
    }

    await notifyUsersAboutActivity(created.id, created.name, req.user?.id);

    return res.status(201).json({
      success: true,
      data: {
        id: created.id,
        name: created.name,
        date: formatDate(created.date),
        status: created.status,
        description: created.description,
        imageUrl: created.imageUrl,
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
        imageUrl: activities.imageUrl,
      })
      .from(activities)
      .where(eq(activities.id, id));

    if (!existingActivity) {
      return res
        .status(404)
        .json({ success: false, error: "Activity not found." });
    }

    await deleteImageFromS3(existingActivity.imageUrl);

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
        status: activities.status,
        description: activities.description,
        imageUrl: activities.imageUrl,
      });

    if (!updatedActivity) {
      return res
        .status(404)
        .json({ success: false, error: "Activity not found." });
    }

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
        let allUsers = await db.select({ id: users.id }).from(users);
        if (req.user?.id) {
          allUsers = allUsers.filter((u) => u.id !== req.user!.id);
        }

        const userIds = allUsers.map((u) => u.id);

        if (userIds.length > 0) {
          await sendActivityNotification({
            title,
            body,
            activityId: id,
            userIds,
          });

          const notificationRows = allUsers.map((v) => ({
            userId: v.id,
            title,
            body,
            data: JSON.stringify({
              activityId: id,
              type: "activity_status_change",
            }),
          }));

          await db.insert(notifications).values(notificationRows);
        }
      }
    } catch (error) {
      console.error("Failed to send status update notification:", error);
    }

    return res.status(200).json({
      success: true,
      data: {
        id: updatedActivity.id,
        name: updatedActivity.name,
        date: formatDate(updatedActivity.date),
        status: updatedActivity.status,
        description: updatedActivity.description,
        imageUrl: updatedActivity.imageUrl,
      },
    });
  } catch (error) {
    console.error("Failed to update activity status", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update activity status" });
  }
};
