import { useEffect, useRef } from "react";
import {
  FirebaseMessagingTypes,
  getInitialNotification,
  onMessage,
  onNotificationOpenedApp,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import { router } from "expo-router";
import {
  setNotificationHandler,
  scheduleNotificationAsync,
  addNotificationResponseReceivedListener,
  getLastNotificationResponseAsync,
  type NotificationResponse,
} from "expo-notifications";
import { useAuthStore } from "@/shared/stores/authStore";
import { createNotificationStore } from "@/shared/stores/notificationStore";
import { firebaseMessaging } from "../constants/firebase";

const ACTIVITY_NOTIFICATION_CHANNEL_ID = "activity-updates";

const getStringDataValue = (
  data: Record<string, unknown> | undefined,
  key: string,
) => {
  const value = data?.[key];
  return typeof value === "string" ? value : undefined;
};

const getActivityIdFromData = (data: Record<string, unknown> | undefined) =>
  getStringDataValue(data, "activityId");

/**
 * Complete notification bootstrap hook
 * Handles all app states: foreground, background, and killed
 *
 * Flow:
 * 1. Configure notification handler for foreground behavior
 * 2. Set up background message handler
 * 3. Listen for foreground messages
 * 4. Handle notification taps (app backgrounded)
 * 5. Check for initial notification (app killed)
 */
export const useNotificationBootstrap = () => {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const {
    hasHandledKilledStateNotification,
    setHasHandledKilledStateNotification,
  } = createNotificationStore();

  // Prevent duplicate handling of killed-state notifications
  const killedStateHandledRef = useRef(false);

  useEffect(() => {
    if (!isHydrated) return;


    if (!firebaseMessaging) {
      return;
    }

    const cleanupFunctions: Array<() => void> = [];

    // Defer initialization to avoid blocking app startup
    const timeoutId = setTimeout(() => {
      initializeNotifications();
    }, 500);

    const initializeNotifications = () => {
      try {
        // 1️⃣ CONFIGURE FOREGROUND NOTIFICATION HANDLER
        // Controls how notifications appear when app is open
        setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });

        // 2️⃣ SET UP BACKGROUND MESSAGE HANDLER
        // Called when app is backgrounded and message arrives
        setBackgroundMessageHandler(
          firebaseMessaging,
          async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            console.log("📱 Background message received:", {
              title: remoteMessage.notification?.title,
              body: remoteMessage.notification?.body,
              activityId: getActivityIdFromData(remoteMessage.data),
            });

            // Don't show notifications for "ended" events
            if (getStringDataValue(remoteMessage.data, "ended") === "true") {
              return;
            }

            // Schedule local notification to show in notification center
            await scheduleNotificationAsync({
              content: {
                title: remoteMessage.notification?.title ?? "Helping Hands",
                body: remoteMessage.notification?.body ?? "",
                sound: "default",
                badge: 1,
                data: remoteMessage.data ?? {},
              },
              trigger: null, // Show immediately
            });
          },
        );

        // 3️⃣ HANDLE FOREGROUND MESSAGES
        // Called when app is open and message arrives
        const unsubscribeForeground = onMessage(
          firebaseMessaging,
          async (remoteMessage) => {
            console.log("🔴 Foreground message received:", {
              title: remoteMessage.notification?.title,
              body: remoteMessage.notification?.body,
              activityId: getActivityIdFromData(remoteMessage.data),
            });

            if (getStringDataValue(remoteMessage.data, "ended") === "true") {
              return;
            }

            // Show notification banner even if app is open
            await scheduleNotificationAsync({
              content: {
                title: remoteMessage.notification?.title ?? "Helping Hands",
                body: remoteMessage.notification?.body ?? "",
                sound: "default",
                badge: 1,
                data: remoteMessage.data ?? {},
              },
              trigger: null, // Show immediately
            });
          },
        );

        cleanupFunctions.push(unsubscribeForeground);

        // 4️⃣ HANDLE NOTIFICATION TAP (APP BACKGROUNDED)
        // Called when user taps notification and app is backgrounded
        const notificationClickSubscription =
          addNotificationResponseReceivedListener((response) => {
            console.log("👆 Notification clicked (backgrounded app)");
            handleNotificationClick(response);
          });

        cleanupFunctions.push(() => {
          notificationClickSubscription.remove();
        });

        // 5️⃣ HANDLE APP OPENED FROM BACKGROUND NOTIFICATION
        // Called when user taps notification and app transitions from background
        const unsubscribeNotificationOpened = onNotificationOpenedApp(
          firebaseMessaging,
          (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            console.log("🔔 App opened from background notification");
            navigateToActivity(getActivityIdFromData(remoteMessage.data));
          },
        );

        cleanupFunctions.push(unsubscribeNotificationOpened);

        // 6️⃣ HANDLE APP OPENED FROM KILLED STATE
        // Called once when app is completely closed and user taps notification
        if (
          !killedStateHandledRef.current &&
          !hasHandledKilledStateNotification
        ) {
          killedStateHandledRef.current = true;
          setHasHandledKilledStateNotification(true);

          // Get Firebase initial notification (has priority)
          getInitialNotification(firebaseMessaging)
            .then((remoteMessage) => {
              const activityId = getActivityIdFromData(remoteMessage?.data);

              if (activityId) {
                console.log(
                  "🚀 App opened from killed state (Firebase notification)",
                );
                navigateToActivity(activityId);
                return;
              }

              // Fallback: Check Expo scheduled notifications
              getLastNotificationResponseAsync()
                .then((response) => {
                  const expoActivityId = getActivityIdFromData(
                    response?.notification?.request?.content?.data,
                  );

                  if (expoActivityId) {
                    console.log(
                      "🚀 App opened from killed state (Expo notification)",
                    );
                    navigateToActivity(expoActivityId);
                  }
                })
                .catch((error) => {
                  console.error(
                    "Error getting last notification response:",
                    error,
                  );
                });
            })
            .catch((error) => {
              console.error("Error getting initial notification:", error);
            });
        }
      } catch (error) {
        console.error("Error initializing notifications:", error);
      }
    };

    return () => {
      clearTimeout(timeoutId);
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [
    hasHandledKilledStateNotification,
    isHydrated,
    setHasHandledKilledStateNotification,
  ]);
};

/**
 * Handle notification click - navigate to activity
 */
const handleNotificationClick = (response: NotificationResponse) => {
  // Check if it's a default action (user tapped notification)
  if (
    response?.actionIdentifier === "expo.modules.notifications.actions.DEFAULT"
  ) {
    const activityId = getActivityIdFromData(
      response?.notification?.request?.content?.data,
    );
    if (activityId) {
      navigateToActivity(activityId);
    }
  }
};

/**
 * Navigate to activity detail screen
 */
const navigateToActivity = (activityId: string | undefined) => {
  if (!activityId) return;

  console.log(`🎯 Navigating to activity: ${activityId}`);
  // Use replace instead of push to avoid history stack issues
  router.replace(`/(main)/activity/${activityId}` as any);
};
