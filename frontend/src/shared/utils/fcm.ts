import { PermissionsAndroid, Platform } from "react-native";
import http from "@/shared/utils/http";
import { getAccessToken } from "@/shared/utils/secureStore";
import { webFirebaseApp } from "@/shared/config/firebase";
import { isAndroid, isWeb } from "../constants/platform";
import { getMessaging } from "@react-native-firebase/messaging";
import { getMessaging as getFirebaseWebMessaging } from "@firebase/messaging";
import type { Messaging } from "@firebase/messaging";
import { showAppMessage } from "./flashMessage";

let webMessaging: any = null;
let webSwRegistration: ServiceWorkerRegistration | null = null;

const getWebMessaging = async (): Promise<Messaging> => {
  if (webMessaging) return webMessaging;
  webMessaging = getFirebaseWebMessaging(webFirebaseApp);
  return webMessaging;
};

const getNativeMessagingModule = async () => {
  const native = await import("@react-native-firebase/messaging");
  return native;
};

export const getNativeFirebaseMessaging = () => {
  if (isWeb) {
    return null;
  }
  return getMessaging();
};

export const getMessagingInstance = () => (isWeb ? webMessaging : null);

export const createNotificationChannel = async () => {
  if (Platform.OS !== "android") {
    return;
  }

  try {
    const { setNotificationChannelAsync } = await import("expo-notifications");
    await setNotificationChannelAsync("activity-updates", {
      name: "Activity Updates",
      description:
        "Notifications about activity status changes and assignments",
      importance: 4,
      lightColor: "#1B6CA8",
      vibrationPattern: [0, 250, 250, 250],
      sound: "default",
    });

    console.log("✅ Activity updates notification channel created");
  } catch (error) {
    console.error("Error creating notification channel:", error);
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (isWeb) {
    try {
      if (Notification.permission === "granted") return true;
      if (Notification.permission === "denied") return false;

      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch {
      return false;
    }
  }

  try {
    const native = await getNativeMessagingModule();
    const firebaseMessaging = getMessaging();
    if (!firebaseMessaging) return false;
    if (isAndroid) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("✅ Notification permission granted");
        return true;
      } else {
        showAppMessage({
          type: "warning",
          message: "Notification permission denied",
          description:
            "You won't receive updates about your activities. You can enable notifications in your device settings.",
        });
        return false;
      }
    } else {
      const permission = await native.requestPermission(firebaseMessaging);
      const isGranted =
        permission === native.AuthorizationStatus.AUTHORIZED ||
        permission === native.AuthorizationStatus.PROVISIONAL ||
        permission === native.AuthorizationStatus.EPHEMERAL;

      if (isGranted) {
        console.log("✅ Notification permission granted");
        return true;
      } else {
        console.log("⚠️  Notification permission denied");
        return false;
      }
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

export const getFCMToken = async (): Promise<string | null> => {
  if (isWeb) {
    try {
      const messaging = await getWebMessaging();
      const { getToken } = await import("@firebase/messaging");
      const vapidKey = process.env.EXPO_PUBLIC_FIREBASE_VAPID_KEY;
      const options: any = { vapidKey };
      if (webSwRegistration) {
        options.serviceWorkerRegistration = webSwRegistration;
      }

      const token = await getToken(messaging, options);
      return token ?? null;
    } catch (error: any) {
      if (__DEV__) {
        console.warn("[FCM Web] Error getting token:", error?.message ?? error);
      }
      return null;
    }
  }

  try {
    const native = await getNativeMessagingModule();
    const firebaseMessaging = native.getMessaging();
    if (!firebaseMessaging) return null;

    const token = await native.getToken(firebaseMessaging);

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

export const registerWebServiceWorker = async () => {
  if (!isWeb || !("serviceWorker" in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      {
        scope: "/",
      },
    );
    console.log("✅ Web service worker registered");

    webSwRegistration = registration;

    if (registration.active) {
      registration.active.postMessage({
        type: "FIREBASE_CONFIG",
        config: {
          apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
          projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
          messagingSenderId:
            process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
        },
      });
    }

    return registration;
  } catch (error) {
    console.error("Error registering web service worker:", error);
  }
};

export const subscribeToTopic = async (topic: string): Promise<boolean> => {
  if (isWeb) return false;

  try {
    const native = await getNativeMessagingModule();
    const firebaseMessaging = native.getMessaging();
    if (!firebaseMessaging) return false;

    await native.subscribeToTopic(firebaseMessaging, topic);
    console.log(`✅ Subscribed to topic: ${topic}`);
    return true;
  } catch (error) {
    console.error(`Error subscribing to topic ${topic}:`, error);
    return false;
  }
};

export const unsubscribeFromTopic = async (topic: string): Promise<boolean> => {
  if (isWeb) return false;

  try {
    const native = await getNativeMessagingModule();
    const firebaseMessaging = native.getMessaging();
    if (!firebaseMessaging) return false;

    await native.unsubscribeFromTopic(firebaseMessaging, topic);
    console.log(`✅ Unsubscribed from topic: ${topic}`);
    return true;
  } catch (error) {
    console.error(`Error unsubscribing from topic ${topic}:`, error);
    return false;
  }
};

export const setupFCM = async (): Promise<void> => {
  console.log("🔧 Setting up Firebase Cloud Messaging...");

  try {
    if (isWeb) {
      await registerWebServiceWorker();
      await requestNotificationPermission();
      await registerFCMToken();
      console.log("✅ Firebase Cloud Messaging setup complete (web)");
      return;
    }

    await createNotificationChannel();
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      console.warn("Notifications disabled - permission not granted");
      return;
    }

    await registerFCMToken();
    console.log("✅ Firebase Cloud Messaging setup complete");
  } catch (error) {
    console.error("Error setting up FCM:", error);
  }
};

export const deleteFCMToken = async (): Promise<void> => {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      await http.post("/api/notifications/unregister-token");
    }
  } catch (error: any) {
    if (error?.response?.status !== 401 && error?.response?.status !== 403) {
      console.error("Error unregistering FCM token:", error);
    }
  }

  if (isWeb) {
    if (webMessaging) {
      try {
        const { deleteToken } = await import("@firebase/messaging");
        await deleteToken(webMessaging);
        console.log("✅ FCM token deleted (web)");
      } catch (error) {
        console.error("Error deleting FCM token (web):", error);
      }
    }
    return;
  }

  try {
    const native = await getNativeMessagingModule();
    const firebaseMessaging = native.getMessaging();
    if (!firebaseMessaging) return;

    await native.deleteToken(firebaseMessaging);
    console.log("✅ FCM token deleted");
  } catch (error) {
    console.error("Error deleting FCM token:", error);
  }
};
