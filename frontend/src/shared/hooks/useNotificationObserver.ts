import { useEffect, useRef } from "react";
import {
  FirebaseMessagingTypes,
  getInitialNotification,
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
} from "@react-native-firebase/messaging";
import { router } from "expo-router";
import { useAuthStore } from "@/shared/stores/authStore";

const firebaseMessaging = getMessaging();

const getActivityIdFromMessage = (
  message: FirebaseMessagingTypes.RemoteMessage,
) => {
  const activityId = message.data?.activityId;
  return typeof activityId === "string" && activityId.length > 0
    ? activityId
    : null;
};

export const useNotificationObserver = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const pendingActivityIdRef = useRef<string | null>(null);
  const handledMessageIdsRef = useRef(new Set<string>());

  // Set message handler for when app is in foreground
  useEffect(() => {
    const unsubscribeForeground = onMessage(firebaseMessaging, async (message) => {
      console.log("Foreground message received:", message);

      const activityId = getActivityIdFromMessage(message);
      if (activityId) {
        pendingActivityIdRef.current = activityId;
      }
    });

    return unsubscribeForeground;
  }, []);

  // Handle notification taps and app launch from notification
  useEffect(() => {
    let isMounted = true;

    const handleNotificationOpen = async (
      message: FirebaseMessagingTypes.RemoteMessage | null,
    ) => {
      if (!isMounted || !message) {
        return;
      }

      const messageId = message.messageId;
      if (!messageId || handledMessageIdsRef.current.has(messageId)) {
        return;
      }

      handledMessageIdsRef.current.add(messageId);
      const activityId = getActivityIdFromMessage(message);

      if (activityId) {
        pendingActivityIdRef.current = activityId;
      }
    };

    // Get initial notification that opened the app
    getInitialNotification(firebaseMessaging).then((message) => {
      handleNotificationOpen(message);
    });

    // Handle notification when app is in background and user taps it
    const unsubscribeNotificationOpened = onNotificationOpenedApp(
      firebaseMessaging,
      (message) => {
        handleNotificationOpen(message);
      },
    );

    return unsubscribeNotificationOpened;
  }, []);

  // Navigate to activity when authenticated and have pending activity ID
  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !pendingActivityIdRef.current) {
      return;
    }

    const activityId = pendingActivityIdRef.current;
    pendingActivityIdRef.current = null;
    router.push(`/(main)/activity/${activityId}` as any);
  }, [isAuthenticated, isHydrated]);
};
