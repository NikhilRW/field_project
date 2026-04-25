import type { Response } from "express";
import { desc, eq } from "drizzle-orm";
import type { AuthRequest } from "../types/auth";
import { db, notifications, users } from "../config/databaseSetup";
import { messaging } from "../services/firebase";

const parseData = (value: string | null) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

/**
 * Register/update FCM device token for a user
 * Called from mobile app after login and when token refreshes
 */
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

    console.log(`✅ FCM token registered for user ${req.user.id}`);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Register push token error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to register push token." });
  }
};

/**
 * Get all notifications for authenticated user
 * Notifications are stored locally for history
 */
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

/**
 * Store a notification in database for user
 * Called after FCM is sent to maintain local notification history
 */
export const storeNotification = async (
  userId: string,
  title: string,
  body: string,
  data?: Record<string, string>
) => {
  try {
    await db.insert(notifications).values({
      userId,
      title,
      body,
      data: data ? JSON.stringify(data) : null,
    });

    console.log(`✅ Notification stored for user ${userId}`);
  } catch (error) {
    console.error("Error storing notification:", error);
    // Don't throw - failing to store shouldn't prevent FCM send
  }
};

/**
 * TEST ENDPOINT: Send push notification to a specific device token
 * For testing and debugging purposes only
 *
 * Request body:
 * {
 *   "deviceToken": "eC..xyz",
 *   "title": "Test Notification",
 *   "body": "This is a test notification",
 *   "data": { "activityId": "test-123" }  // optional
 * }
 */
export const sendTestNotification = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, error: "Unauthorized." });
    }

    const {
      deviceToken,
      title,
      body,
      data,
    } = req.body as {
      deviceToken?: string;
      title?: string;
      body?: string;
      data?: Record<string, string>;
    };

    // Validate required fields
    if (!deviceToken) {
      return res
        .status(400)
        .json({ success: false, error: "deviceToken is required." });
    }

    if (!title) {
      return res
        .status(400)
        .json({ success: false, error: "title is required." });
    }

    if (!body) {
      return res
        .status(400)
        .json({ success: false, error: "body is required." });
    }

    // Send notification via FCM
    try {
      const response = await messaging.send({
        token: deviceToken,
        notification: {
          title,
          body,
        },
        android: {
          priority: "high",
          notification: {
            priority: "max",
            channelId: "activity-updates",
            clickAction: "FLUTTER_NOTIFICATION_CLICK",
          },
        },
        apns: {
          payload: {
            aps: {
              "mutable-content": 1,
              sound: "default",
              badge: 1,
            },
          },
        },
        data: data || {},
      });

      console.log(`✅ Test notification sent to device: ${deviceToken}`);
      console.log(`Message ID: ${response}`);

      return res.status(200).json({
        success: true,
        message: "Notification sent successfully",
        messageId: response,
        details: {
          deviceToken,
          title,
          body,
          data: data || {},
        },
      });
    } catch (fcmError: any) {
      console.error("FCM Error:", fcmError.message);

      // Check for specific FCM errors
      if (fcmError.code === "messaging/invalid-argument") {
        return res.status(400).json({
          success: false,
          error: "Invalid device token format",
          details: fcmError.message,
        });
      }

      if (fcmError.code === "messaging/registration-token-not-registered") {
        return res.status(404).json({
          success: false,
          error: "Device token not registered or expired",
          details: fcmError.message,
        });
      }

      throw fcmError;
    }
  } catch (error: any) {
    console.error("Test notification error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to send test notification",
      details: error?.message ?? "Unknown error",
    });
  }
};

/**
 * TEST ENDPOINT: Send multicast notification to multiple device tokens
 * For testing and debugging purposes only
 *
 * Request body:
 * {
 *   "deviceTokens": ["token1", "token2", "token3"],
 *   "title": "Bulk Test",
 *   "body": "Sending to multiple devices",
 *   "data": { "type": "test" }  // optional
 * }
 */
export const sendBulkTestNotification = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // if (!req.user?.id) {
    //   return res.status(401).json({ success: false, error: "Unauthorized." });
    // }

    const {
      deviceTokens,
      title,
      body,
      data,
    } = req.body as {
      deviceTokens?: string[];
      title?: string;
      body?: string;
      data?: Record<string, string>;
    };

    // Validate required fields
    if (!Array.isArray(deviceTokens) || deviceTokens.length === 0) {
      return res.status(400).json({
        success: false,
        error: "deviceTokens array is required and must not be empty.",
      });
    }

    if (!title) {
      return res
        .status(400)
        .json({ success: false, error: "title is required." });
    }

    if (!body) {
      return res
        .status(400)
        .json({ success: false, error: "body is required." });
    }

    // Send multicast notification
    try {
      const response = await messaging.sendEachForMulticast({
        tokens: deviceTokens,
        notification: {
          title,
          body,
        },
        android: {
          priority: "high",
          notification: {
            priority: "max",
            channelId: "activity-updates",
            clickAction: "FLUTTER_NOTIFICATION_CLICK",
          },
        },
        apns: {
          payload: {
            aps: {
              "mutable-content": 1,
              sound: "default",
              badge: 1,
            },
          },
        },
        data: data || {},
      });

      console.log(
        `✅ Bulk test notification sent to ${response.successCount} devices`
      );
      if (response.failureCount > 0) {
        console.warn(
          `⚠️  Failed to send to ${response.failureCount} devices`
        );
      }

      return res.status(200).json({
        success: true,
        message: "Bulk notification sent",
        stats: {
          total: deviceTokens.length,
          successful: response.successCount,
          failed: response.failureCount,
        },
        failureReasons: response.responses
          .map((resp, idx) => {
            if (resp.error) {
              return {
                token: deviceTokens[idx],
                error: resp.error.message,
              };
            }
            return null;
          })
          .filter((x) => x !== null),
      });
    } catch (fcmError: any) {
      console.error("FCM Bulk Error:", fcmError.message);
      throw fcmError;
    }
  } catch (error: any) {
    console.error("Bulk test notification error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to send bulk test notification",
      details: error?.message ?? "Unknown error",
    });
  }
};

