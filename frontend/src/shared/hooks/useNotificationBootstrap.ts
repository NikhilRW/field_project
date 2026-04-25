import { useEffect, useRef } from "react";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";
import { router } from "expo-router";
import {
  setNotificationHandler,
  scheduleNotificationAsync,
  addNotificationResponseReceivedListener,
  getLastNotificationResponseAsync,
} from "expo-notifications";
import { useAuthStore } from "@/shared/stores/authStore";
import { createNotificationStore } from "@/shared/stores/notificationStore";

const ACTIVITY_NOTIFICATION_CHANNEL_ID = "activity-updates";

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
  const { hasHandledKilledStateNotification, setHasHandledKilledStateNotification } =
    createNotificationStore();

  // Prevent duplicate handling of killed-state notifications
  const killedStateHandledRef = useRef(false);

  useEffect(() => {
    if (!isHydrated) return;

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
        const unsubscribeBackground = messaging().setBackgroundMessageHandler(
          async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            console.log("📱 Background message received:", {
              title: remoteMessage.notification?.title,
              body: remoteMessage.notification?.body,
              activityId: remoteMessage.data?.activityId,
            });

            // Don't show notifications for "ended" events
            if (remoteMessage.data?.ended === "true") {
              return;
            }

            // Schedule local notification to show in notification center
            await scheduleNotificationAsync({
              content: {
                title: remoteMessage.notification?.title ?? "Helping Hands",
                body: remoteMessage.notification?.body ?? "",
                sound: "default",
                badge: 1,
                data: remoteMessage.data,
              },
              trigger: null, // Show immediately
            });
          }
        );

        cleanupFunctions.push(unsubscribeBackground);

        // 3️⃣ HANDLE FOREGROUND MESSAGES
        // Called when app is open and message arrives
        const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
          console.log("🔴 Foreground message received:", {
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            activityId: remoteMessage.data?.activityId,
          });

          if (remoteMessage.data?.ended === "true") {
            return;
          }

          // Show notification banner even if app is open
          await scheduleNotificationAsync({
            content: {
              title: remoteMessage.notification?.title ?? "Helping Hands",
              body: remoteMessage.notification?.body ?? "",
              sound: "default",
              badge: 1,
              data: remoteMessage.data,
            },
            trigger: null, // Show immediately
          });
        });

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
        const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(
          (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            console.log("🔔 App opened from background notification");
            navigateToActivity(remoteMessage.data?.activityId);
          }
        );

        cleanupFunctions.push(unsubscribeNotificationOpened);

        // 6️⃣ HANDLE APP OPENED FROM KILLED STATE
        // Called once when app is completely closed and user taps notification
        if (!killedStateHandledRef.current) {
          killedStateHandledRef.current = true;

          // Get Firebase initial notification (has priority)
          messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
              if (remoteMessage?.data?.activityId) {
                console.log(
                  "🚀 App opened from killed state (Firebase notification)"
                );
                navigateToActivity(remoteMessage.data.activityId);
                return;
              }

              // Fallback: Check Expo scheduled notifications
              getLastNotificationResponseAsync()
                .then((response) => {
                  if (response?.notification?.request?.content?.data?.activityId) {
                    console.log(
                      "🚀 App opened from killed state (Expo notification)"
                    );
                    navigateToActivity(
                      response.notification.request.content.data.activityId as string
                    );
                  }
                })
                .catch((error) => {
                  console.error("Error getting last notification response:", error);
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
  }, [isHydrated]);
};

/**
 * Handle notification click - navigate to activity
 */
const handleNotificationClick = (
  response: {
    actionIdentifier: string;
    notification: {
      request: {
        content: {
          data: Record<string, any>;
        };
      };
    };
  }
) => {
  // Check if it's a default action (user tapped notification)
  if (
    response?.actionIdentifier ===
    "expo.modules.notifications.actions.DEFAULT"
  ) {
    const activityId = response?.notification?.request?.content?.data?.activityId;
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
