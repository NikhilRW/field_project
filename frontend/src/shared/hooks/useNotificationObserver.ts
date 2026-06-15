import { useEffect, useRef } from "react";
import { router } from "expo-router";
import { useAuthStore } from "@/shared/stores/authStore";
import { firebaseMessaging } from "../constants/firebase";
import { isWeb } from "../constants/platform";

export const useNotificationObserver = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const pendingActivityIdRef = useRef<string | null>(null);
  const handledMessageIdsRef = useRef(new Set<string>());

  useEffect(() => {
    if (isWeb) {
      const handleWebNotificationClick = (event: Event) => {
        // TODO: fix the any type here.
        const notificationEvent = event as any;
        const activityId = notificationEvent.notification?.data?.activityId;
        if (activityId) {
          pendingActivityIdRef.current = activityId;
        }
      };

      navigator.serviceWorker?.addEventListener(
        "notificationclick",
        handleWebNotificationClick as any,
      );

      return () => {
        navigator.serviceWorker?.removeEventListener(
          "notificationclick",
          handleWebNotificationClick as any,
        );
      };
    }

    if (!firebaseMessaging) {
      return;
    }

    let isMounted = true;

    const initNative = async () => {
      const {
        getInitialNotification,
        onMessage: onNativeMessage,
        onNotificationOpenedApp,
      } = await import("@react-native-firebase/messaging");

      const unsubscribeForeground = onNativeMessage(
        firebaseMessaging!,
        async (message: any) => {
          console.log("Foreground message received:", message);
          const activityId = message.data?.activityId;
          if (typeof activityId === "string" && activityId.length > 0) {
            pendingActivityIdRef.current = activityId;
          }
        },
      );

      cleanupFunctions.push(unsubscribeForeground);

      const handleNotificationOpen = async (message: any) => {
        if (!isMounted || !message) return;

        const messageId = message.messageId;
        if (!messageId || handledMessageIdsRef.current.has(messageId)) return;

        handledMessageIdsRef.current.add(messageId);
        const activityId = message.data?.activityId;
        if (typeof activityId === "string" && activityId.length > 0) {
          pendingActivityIdRef.current = activityId;
        }
      };

      getInitialNotification(firebaseMessaging!).then((message: any) => {
        handleNotificationOpen(message);
      });

      const unsubscribeNotificationOpened = onNotificationOpenedApp(
        firebaseMessaging!,
        (message: any) => {
          handleNotificationOpen(message);
        },
      );

      cleanupFunctions.push(unsubscribeNotificationOpened);
    };

    const cleanupFunctions: Array<() => void> = [];

    initNative();

    return () => {
      isMounted = false;
      cleanupFunctions.forEach((fn) => fn());
    };
  }, []);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !pendingActivityIdRef.current) {
      return;
    }

    const activityId = pendingActivityIdRef.current;
    pendingActivityIdRef.current = null;
    router.push(`/(main)/activity/${activityId}` as any);
  }, [isAuthenticated, isHydrated]);
};
