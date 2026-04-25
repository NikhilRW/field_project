import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import http from "@/shared/utils/http";
import { getAccessToken } from "@/shared/utils/secureStore";
import { setNotificationChannelAsync } from "expo-notifications";

/**
 * Create Android notification channel for FCM
 * Required for Android 8.0+
 */
export const createNotificationChannel = async () => {
  if (Platform.OS !== "android") {
    return;
  }

  try {
    await setNotificationChannelAsync("activity-updates",{
      name: "Activity Updates",
      description: "Notifications about activity status changes and assignments",
      importance: 4, // AndroidImportance.HIGH
      lightColor: "#1B6CA8",
      vibrationPattern: [0, 250, 250, 250],
      sound: "default",
    });

    console.log("✅ Activity updates notification channel created");
  } catch (error) {
    console.error("Error creating notification channel:", error);
  }
};

/**
 * Request notification permissions
 * Required for FCM on Android 13+ and iOS
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const permission = await messaging().requestPermission();

    // Permission levels:
    // 0 = disabled
    // 1 = provisional (iOS)
    // 2 = denied
    // 3 = allowed
    const isGranted = permission === 1 || permission === 3;

    if (isGranted) {
      console.log("✅ Notification permission granted");
    } else {
      console.log("⚠️  Notification permission denied");
    }

    return isGranted;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

/**
 * Get FCM token for this device
 */
export const getFCMToken = async (): Promise<string | null> => {
  try {
    const token = await messaging().getToken();

    if (token) {
      console.log("✅ FCM token obtained:", token.substring(0, 20) + "...");
    } else {
      console.warn("⚠️  No FCM token available");
    }

    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

/**
 * Register FCM token with backend
 * Called after login and when token refreshes
 */
export const registerFCMToken = async (): Promise<boolean> => {
  try {
    const token = await getFCMToken();
    if (!token) {
      console.warn("Cannot register token: FCM token not available");
      return false;
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.warn("Cannot register token: No access token");
      return false;
    }

    await http.post("/api/notifications/register-token", { token });

    console.log("✅ FCM token registered with backend");
    return true;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      console.warn("Token registration unauthorized - user may be logged out");
      return false;
    }

    console.error("Error registering FCM token:", error?.message ?? error);
    return false;
  }
};

/**
 * Subscribe to topic for broadcast notifications
 * Example: Subscribe to "activity-updates" to receive all activity notifications
 */
export const subscribeToTopic = async (topic: string): Promise<boolean> => {
  try {
    await messaging().subscribeToTopic(topic);
    console.log(`✅ Subscribed to topic: ${topic}`);
    return true;
  } catch (error) {
    console.error(`Error subscribing to topic ${topic}:`, error);
    return false;
  }
};

/**
 * Unsubscribe from topic
 */
export const unsubscribeFromTopic = async (topic: string): Promise<boolean> => {
  try {
    await messaging().unsubscribeFromTopic(topic);
    console.log(`✅ Unsubscribed from topic: ${topic}`);
    return true;
  } catch (error) {
    console.error(`Error unsubscribing from topic ${topic}:`, error);
    return false;
  }
};

/**
 * Complete FCM setup
 * Call this once during app initialization (after login)
 */
export const setupFCM = async (): Promise<void> => {
  console.log("🔧 Setting up Firebase Cloud Messaging...");

  try {
    // Step 1: Create Android notification channel
    await createNotificationChannel();

    // Step 2: Request permissions
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      console.warn("Notifications disabled - permission not granted");
      return;
    }

    // Step 3: Register token with backend
    await registerFCMToken();

    // Step 4: Subscribe to default topics (optional)
    // You can add topics here if using topic-based messaging
    // await subscribeToTopic("activity-updates");

    console.log("✅ Firebase Cloud Messaging setup complete");
  } catch (error) {
    console.error("Error setting up FCM:", error);
  }
};

/**
 * Delete FCM token (call on logout)
 */
export const deleteFCMToken = async (): Promise<void> => {
  try {
    await messaging().deleteToken();
    console.log("✅ FCM token deleted");
  } catch (error) {
    console.error("Error deleting FCM token:", error);
  }
};
