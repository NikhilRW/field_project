import { messaging } from "@services/firebase";
import { db, users } from "@config/databaseSetup";
import { eq, inArray } from "drizzle-orm";

interface SendActivityNotificationParams {
  title: string;
  body: string;
  activityId: string;
  userIds?: string[];
}

/**
 * Send FCM notification to users about an activity
 */
export const sendActivityNotification = async ({
  title,
  body,
  activityId,
  userIds = [],
}: SendActivityNotificationParams) => {
  try {
    let tokens: string[] = [];

    if (userIds.length === 0) {
      return;
    }

    const userRows = await db
      .select({ fcmToken: users.expoPushToken })
      .from(users)
      .where(inArray(users.id, userIds));

    tokens = userRows
      .filter((u) => u.fcmToken != null)
      .map((u) => u.fcmToken!);

    if (tokens.length === 0) {
      console.warn("No FCM tokens available for activity notification");
      return;
    }
    // Send multicast notification
    const response = await messaging.sendEachForMulticast({
      tokens,
      notification: {
        title,
        body,
      },
      android: {
        priority: "high",
        notification: {
          priority: "max",
          channelId: "activity-updates",
          // TODO: see this how flutter FLUTTER_NOTIFICATION_CLICK 
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
          custom: {
            activityId,
          },
        },
      },
      // Data payload sent to app
      data: {
        activityId,
        type: "activity_update",
        title,
        body,
      },
    });

    console.log(`✅ Activity notification sent to ${response.successCount} devices`);
    if (response.failureCount > 0) {
      console.warn(`⚠️  Failed to send to ${response.failureCount} devices`);
    }

    return response;
  } catch (error) {
    console.error("❌ Error sending activity notification:", error);
    throw error;
  }
};

/**
 * Send notification to a specific user (donor, admin, etc.)
 */
export const sendUserNotification = async (
  userId: string,
  title: string,
  body: string,
  data?: Record<string, string>
) => {
  try {
    const user = await db
      .select({ fcmToken: users.expoPushToken })
      .from(users)
      .where(eq(users.id, userId));

    if (!user[0]?.fcmToken) {
      console.warn(`No FCM token found for user ${userId}`);
      return;
    }

    const response = await messaging.send({
      token: user[0].fcmToken,
      notification: { title, body },
      android: {
        priority: "high",
        notification: {
          priority: "max",
          channelId: "activity-updates",
        },
      },
      apns: {
        payload: {
          aps: {
            "mutable-content": 1,
            sound: "default",
          },
        },
      },
      data: data || {},
    });

    console.log(`✅ Notification sent to user ${userId}`);
    return response;
  } catch (error) {
    console.error("❌ Error sending user notification:", error);
    throw error;
  }
};
