import { useEffect, useRef } from "react";
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
import { webFirebaseApp } from "../config/firebase";
import { isWeb } from "../constants/platform";

const isDesktopBrowser =
  isWeb && !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

let webMessaging: any = null;

const getWebMessaging = async () => {
  if (webMessaging) return webMessaging;

  while (!webFirebaseApp === null) {
    if (webFirebaseApp) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const { getMessaging } = await import("@firebase/messaging");
  const { getApp } = await import("@firebase/app");
  webMessaging = getMessaging(getApp());
  return webMessaging;
};

const getStringDataValue = (
  data: Record<string, unknown> | undefined,
  key: string,
) => {
  const value = data?.[key];
  return typeof value === "string" ? value : undefined;
};

const getActivityIdFromData = (data: Record<string, unknown> | undefined) =>
  getStringDataValue(data, "activityId");

export const useNotificationBootstrap = () => {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const {
    hasHandledKilledStateNotification,
    setHasHandledKilledStateNotification,
  } = createNotificationStore();

  const killedStateHandledRef = useRef(false);

  useEffect(() => {
    if (!isHydrated) return;

    const cleanupFunctions: (() => void)[] = [];

    const timeoutId = setTimeout(() => {
      initializeNotifications();
    }, 500);

    const initializeNotifications = () => {
      try {
        if (isWeb) {
          initializeWebNotifications();
          return;
        }

        initializeNativeNotifications();
      } catch (error) {
        console.error("Error initializing notifications:", error);
      }
    };

    const initializeWebNotifications = async () => {
      try {
        const messaging = await getWebMessaging();
        const { onMessage } = await import("@firebase/messaging");

        setHasHandledKilledStateNotification(true);
        killedStateHandledRef.current = true;

        onMessage(messaging, async (payload: any) => {
          console.log("🔴 Web foreground message received:", payload);

          if (!isDesktopBrowser) return;

          const title = payload.notification?.title ?? "Helping Hands";
          const body = payload.notification?.body ?? "";

          if (getStringDataValue(payload.data, "ended") === "true") return;

          new Notification(title, { body, icon: "/favicon.png" });
        });
      } catch (error) {
        console.warn("Web notifications unavailable:", error);
      }
    };

    const initializeNativeNotifications = async () => {
      if (!firebaseMessaging) {
        return;
      }

      const {
        getInitialNotification,
        onMessage: onNativeMessage,
        onNotificationOpenedApp,
        setBackgroundMessageHandler,
      } = await import("@react-native-firebase/messaging");

      setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      setBackgroundMessageHandler(
        firebaseMessaging,
        async (remoteMessage: any) => {
          console.log("📱 Background message received:", {
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            activityId: getActivityIdFromData(remoteMessage.data),
          });

          if (getStringDataValue(remoteMessage.data, "ended") === "true") {
            return;
          }

          await scheduleNotificationAsync({
            content: {
              title: remoteMessage.notification?.title ?? "Helping Hands",
              body: remoteMessage.notification?.body ?? "",
              sound: "default",
              badge: 1,
              data: remoteMessage.data ?? {},
            },
            trigger: null,
          });
        },
      );

      const unsubscribeForeground = onNativeMessage(
        firebaseMessaging,
        async (remoteMessage: any) => {
          console.log("🔴 Foreground message received:", {
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            activityId: getActivityIdFromData(remoteMessage.data),
          });

          if (getStringDataValue(remoteMessage.data, "ended") === "true") {
            return;
          }

          await scheduleNotificationAsync({
            content: {
              title: remoteMessage.notification?.title ?? "Helping Hands",
              body: remoteMessage.notification?.body ?? "",
              sound: "default",
              badge: 1,
              data: remoteMessage.data ?? {},
            },
            trigger: null,
          });
        },
      );

      cleanupFunctions.push(unsubscribeForeground);

      const notificationClickSubscription =
        addNotificationResponseReceivedListener((response) => {
          console.log("👆 Notification clicked (backgrounded app)");
          handleNotificationClick(response);
        });

      cleanupFunctions.push(() => {
        notificationClickSubscription.remove();
      });

      const unsubscribeNotificationOpened = onNotificationOpenedApp(
        firebaseMessaging,
        (remoteMessage: any) => {
          console.log("🔔 App opened from background notification");
          navigateToActivity(getActivityIdFromData(remoteMessage.data));
        },
      );

      cleanupFunctions.push(unsubscribeNotificationOpened);

      if (
        !killedStateHandledRef.current &&
        !hasHandledKilledStateNotification
      ) {
        killedStateHandledRef.current = true;
        setHasHandledKilledStateNotification(true);

        getInitialNotification(firebaseMessaging)
          .then((remoteMessage: any) => {
            const activityId = getActivityIdFromData(remoteMessage?.data);

            if (activityId) {
              console.log(
                "🚀 App opened from killed state (Firebase notification)",
              );
              navigateToActivity(activityId);
              return;
            }

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

const handleNotificationClick = (response: NotificationResponse) => {
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

const navigateToActivity = (activityId: string | undefined) => {
  if (!activityId) return;

  console.log(`🎯 Navigating to activity: ${activityId}`);
  router.replace(`/(main)/activity/${activityId}` as any);
};
